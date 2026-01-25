import React, { useState, useEffect } from 'react';
import { profiler } from '../utils/LatencyProfiler';
import { generateResponse } from '../services/dextoraAI';
import { speakText } from '../services/ttsService';

const LatencyTest = () => {
    const [metrics, setMetrics] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        // Subscribe to profiler updates
        const unsubscribe = profiler.subscribe((data) => {
            setMetrics([...data]); // Force re-render with new array
        });
        return () => unsubscribe();
    }, []);

    const clearMetrics = () => {
        profiler.clear();
        setMetrics([]);
    };

    const runMockTest = async () => {
        if (isRunning) return;
        setIsRunning(true);
        clearMetrics();

        try {
            console.log("Starting Mock Test...");
            const text = "Hello Dextora, this is a latency test.";

            // Manually trigger the pipeline bits excluding STT
            await generateResponse(text);

        } catch (e) {
            console.error("Test failed", e);
        } finally {
            setIsRunning(false);
        }
    };

    // Group metrics by name or category if needed, but flat list is fine for detailed view
    return (
        <div className="min-h-screen bg-charcoal text-white p-8 pt-24 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-cyan">Latency Diagnostic Dashboard</h1>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={runMockTest}
                        disabled={isRunning}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${isRunning
                            ? 'bg-white/20 cursor-not-allowed'
                            : 'bg-cyan text-black hover:opacity-90 shadow-lg shadow-cyan/20'
                            }`}
                    >
                        {isRunning ? 'Running Test...' : 'Run Mock Pipeline Test'}
                    </button>

                    <button
                        onClick={clearMetrics}
                        className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all"
                    >
                        Clear Data
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-4 text-gray-300">Test Instructions</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                            <li><strong>Mock Test:</strong> Simulates "Hello Dextora..." sent to LLM. Measures LLM + TTS latency.</li>
                            <li><strong>Voice Test:</strong> Go to the Chat page, speak, then come back here to see the <code>STT_Result</code> and voice pipeline metrics.</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-4 text-gray-300">Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Entries:</span>
                                <span>{metrics.length}</span>
                            </div>
                            {/* Can add calculated averages here later */}
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-800 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 border-b border-white/10">
                                <th className="p-4 font-medium">Timestamp</th>
                                <th className="p-4 font-medium">Metric Name</th>
                                <th className="p-4 font-medium">Duration (ms)</th>
                                <th className="p-4 font-medium">Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                        No data recorded yet. Run a test.
                                    </td>
                                </tr>
                            ) : (
                                metrics.map((m, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-500">{m.timestamp.split('T')[1].split('.')[0]}</td>
                                        <td className="p-4 font-mono text-cyan-300">{m.name}</td>
                                        <td className="p-4 font-bold text-white">
                                            {m.duration ? `${parseFloat(m.duration).toFixed(0)} ms` : '-'}
                                        </td>
                                        <td className="p-4 text-xs text-gray-400 font-mono truncate max-w-xs">
                                            {JSON.stringify(m).replace(/"name":".*?","timestamp":".*?",?/, '').replace(/"duration":".*?",?/, '')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LatencyTest;

import { ShieldCheck, Activity, Eye, LineChart } from 'lucide-react';

const Parent = () => {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Complete Visibility. Total Trust.</span>
                        <br />
                        <span className="text-white">Better Results.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Dextora keeps parents fully informed about their child’s learning journey.
                    </p>
                </div>

                {/* What Parents Get */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="glass-card p-8 rounded-2xl col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Activity className="text-electric-blue" /> What Parents Get
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Weekly learning reports",
                                "Subject-wise progress tracking",
                                "Focus & attention insights",
                                "Strength and weakness analysis",
                                "Revision & improvement suggestions",
                                "Predicted academic performance",
                                "Safe, controlled learning environment"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parent Assurance */}
                    <div className="glass-card p-8 rounded-2xl border-l-4 border-l-electric-blue">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-electric-blue" /> Parent Assurance
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "No misuse of AI",
                                "Academic-only intelligence",
                                "Child-safe system by design"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-12 text-center">
                            <p className="text-xl font-bold text-white italic">
                                "Parents don’t just see marks. They see real learning."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Parent;

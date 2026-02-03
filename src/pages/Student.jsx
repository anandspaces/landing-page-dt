import { Bot, Youtube, PenTool, Brain, Zap, Shield } from 'lucide-react';

const Student = () => {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Turn Into a Super Student</span>
                        <br />
                        <span className="text-white">with AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Dextora is a personal AI tutor that studies how you learn, where you struggle, and how you improve, then designs learning just for you.
                        Students learn directly from their own school textbooks, explained line by line using videos, simulations, stories, comics, and real-life analogies.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: <PenTool className="w-8 h-8 text-electric-blue" />, title: "Line-by-line Teaching", desc: "Line-by-line teaching from school books" },
                        { icon: <Brain className="w-8 h-8 text-electric-blue" />, title: "Instant Doubt Solving", desc: "Text, voice, & camera support for immediate help" },
                        { icon: <Youtube className="w-8 h-8 text-electric-blue" />, title: "AI Videos & Animations", desc: "AI-generated videos, animations & simulations" },
                        { icon: <PenTool className="w-8 h-8 text-electric-blue" />, title: "Handwritten Notes", desc: "Hyper-realistic handwritten notes" },
                        { icon: <Zap className="w-8 h-8 text-electric-blue" />, title: "Smart Quizzes", desc: "Smart quizzes & adaptive tests" },
                        { icon: <Shield className="w-8 h-8 text-electric-blue" />, title: "Safe Environment", desc: "Safe, distraction-free academic environment" }
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-xl border border-white/10 hover:border-electric-blue/30 transition-all">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-purple-500"></div>
                    <h2 className="text-3xl font-bold text-white mb-8">Student Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-semibold text-electric-blue mb-2">Better Understanding</h3>
                            <p className="text-gray-400 text-sm">Not rote learning</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-semibold text-electric-blue mb-2">Confidence</h3>
                            <p className="text-gray-400 text-sm">More focus and confidence</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-semibold text-electric-blue mb-2">Stronger Memory</h3>
                            <p className="text-gray-400 text-sm">Faster revision</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-semibold text-electric-blue mb-2">Reduced Fear</h3>
                            <p className="text-gray-400 text-sm">Reduced exam fear</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <p className="text-2xl font-bold text-white italic">
                            "Dextora doesn’t make students study more. It makes them understand better."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Student;

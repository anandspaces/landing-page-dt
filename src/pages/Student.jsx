import { useEffect, useRef } from 'react';
import { Bot, Youtube, PenTool, Brain, Zap, Shield, Sparkles } from 'lucide-react';
import ImageCrawler from '../components/ImageCrawler';
import ScrollRevealHeading from '../components/ScrollRevealHeading';

// Images
import imgLineByLine from '../assets/student/line-by-line.png';
import imgDoubtSolving from '../assets/student/doubt-solving.png';
import imgAiVideos from '../assets/student/ai-videos.png';
import imgHandwrittenNotes from '../assets/student/handwritten-notes.png';
import imgSmartQuizzes from '../assets/student/smart-quizzes.png';

// Stickers
import stickerUnderstanding from '../assets/student/stickers/better-understanding.png';
import stickerConfidence from '../assets/student/stickers/confidence.png';
import stickerMemory from '../assets/student/stickers/stronger-memory.png';
import stickerFear from '../assets/student/stickers/reduced-fear.png';

const studentImages = [imgLineByLine, imgDoubtSolving, imgAiVideos, imgHandwrittenNotes, imgSmartQuizzes];

const benefits = [
    {
        title: "Better Understanding",
        desc: "Not rote learning",
        icon: Brain
    },
    {
        title: "Confidence",
        desc: "More focus and confidence",
        icon: Zap
    },
    {
        title: "Stronger Memory",
        desc: "Faster revision",
        icon: Sparkles
    },
    {
        title: "Reduced Fear",
        desc: "Reduced exam fear",
        icon: Shield
    }
];

const Student = () => {
    const crawlerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the crawler section is intersecting (visible), hide the avatar
                // We dispatch a custom event that Layout.jsx listens for
                const isVisible = entry.isIntersecting;

                // If visible, we want to HIDE the avatar (visible: false)
                // If not visible, we want to SHOW the avatar (visible: true)
                const shouldAvatarBeVisible = !isVisible;

                window.dispatchEvent(new CustomEvent('toggle-avatar', {
                    detail: { visible: shouldAvatarBeVisible }
                }));
            },
            {
                threshold: 0.1, // Trigger as soon as 10% is visible
                rootMargin: "100px 0px 0px 0px" // Trigger slightly before it enters content area
            }
        );

        if (crawlerRef.current) {
            observer.observe(crawlerRef.current);
        }

        return () => {
            if (crawlerRef.current) {
                observer.unobserve(crawlerRef.current);
            }
            // Reset to visible when leaving page
            window.dispatchEvent(new CustomEvent('toggle-avatar', {
                detail: { visible: true }
            }));
        };
    }, []);

    return (
        <div className="relative min-h-screen pt-32 pb-0">
            {/* Top Section - Restricted Width for Avatar */}
            <div className="w-full lg:max-w-[75%] px-6 md:px-12 lg:pl-24">
                {/* Header */}
                <div className="text-center lg:text-left mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 flex flex-col gap-2">
                        <ScrollRevealHeading
                            text="Turn Into a Super Student"
                            level="span"
                            className="block"
                            textClassName="gradient-text"
                        />
                        <ScrollRevealHeading
                            text="with AI"
                            level="span"
                            className="block"
                            textClassName="text-white"
                        />
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
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
                {/* Benefits Section - Zig Zag Stickers */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            Student <span className="gradient-text">Benefits</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
                        {benefits.map((item, index) => (
                            <div
                                key={index}
                                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan/50 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Icon */}
                                <div className="relative z-10 mb-6 inline-flex p-4 rounded-2xl bg-cyan/10 text-cyan group-hover:scale-110 transition-transform duration-300">
                                    <item.icon size={32} strokeWidth={1.5} />
                                </div>

                                {/* Text */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyan transition-colors">{item.title}</h3>
                                    <p className="text-gray-400 font-mono text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FULL WIDTH CRAWLER SECTION - Outside the 75% container */}
            <div ref={crawlerRef} className="w-full relative z-50 py-20 bg-gradient-to-b from-charcoal/0 via-charcoal to-charcoal/0 backdrop-blur-sm">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Experience the Future</h2>
                    <p className="text-gray-400 text-xl">See what Dextora looks like in action</p>
                </div>
                <ImageCrawler images={studentImages} speed={40} />
            </div>
        </div>
    );
};

export default Student;

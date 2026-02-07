import { useEffect, useRef } from 'react';
import { ShieldCheck, Activity, Eye, LineChart } from 'lucide-react';
import ImageCrawler from '../components/ImageCrawler';
import ScrollRevealHeading from '../components/ScrollRevealHeading';

// Images
import imgWeeklyReports from '../assets/parent/weekly-reports.png';
import imgAiFocus from '../assets/parent/ai-focus.png';
import imgStrengthWeakness from '../assets/parent/strength-weakness.png';
import imgPredictedPerformance from '../assets/parent/predicted-performance.png';
import imgSafeEnvironment from '../assets/parent/safe-environment.png';

const parentImages = [
    { img: imgWeeklyReports, brief: "Stay updated\nTrack progress" },
    { img: imgAiFocus, brief: "Monitor attention\nImprove focus" },
    { img: imgStrengthWeakness, brief: "Know gaps\nTarget growth" },
    { img: imgPredictedPerformance, brief: "Future insights\nPlan ahead" },
    { img: imgSafeEnvironment, brief: "Secure learning\nPeace of mind" }
];

const Parent = () => {
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
            <div className="w-full lg:max-w-[90%] px-6 md:px-12 lg:pl-24">
                {/* Header */}
                <div className="text-center lg:text-left mb-15">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 flex flex-col gap-2">
                        <ScrollRevealHeading
                            text="Complete Visibility Total Trust."
                            level="span"
                            className="block"
                            textClassName="gradient-text"
                        />
                        <ScrollRevealHeading
                            text="Better Results."
                            level="span"
                            className="block"
                            textClassName="text-white"
                        />
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
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
                    </div>
                </div>

                {/* Quote Section */}
                <div className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden text-center mb-32">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-purple-500"></div>
                    <div className="mt-4 text-center">
                        <p className="text-xl font-bold text-white italic">
                            "Parents don’t just see marks. They see real learning."
                        </p>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH CRAWLER SECTION */}
            <div ref={crawlerRef} className="w-full relative z-50 py-20 bg-gradient-to-b from-charcoal/0 via-charcoal to-charcoal/0 backdrop-blur-sm">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Complete Peace of Mind</h2>
                    <p className="text-gray-400 text-xl">See how we include you in the journey</p>
                </div>
                <ImageCrawler images={parentImages} speed={40} />
            </div>
        </div>
    );
};

export default Parent;

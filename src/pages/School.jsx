import { useEffect, useRef } from 'react';
import { Building, TrendingUp, Users, Award, LayoutDashboard } from 'lucide-react';
import ImageCrawler from '../components/ImageCrawler';

// Images
import imgAiLms from '../assets/school/ai-lms.png';
import imgPerformanceAnalytics from '../assets/school/performance-analytics.png';
import imgReportCards from '../assets/school/report-cards.png';
import imgTeacherAssistant from '../assets/school/teacher-assistant.png';
import imgCompetitiveEdge from '../assets/school/competitive-edge.png';

const schoolImages = [imgAiLms, imgPerformanceAnalytics, imgReportCards, imgTeacherAssistant, imgCompetitiveEdge];

const School = () => {
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
            <div className="w-full lg:max-w-[75%] px-6 md:px-12 lg:pl-24">
                {/* Header */}
                <div className="text-center lg:text-left mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Future-Proof Your School</span>
                        <br />
                        <span className="text-white">with AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                        Schools are losing students to coaching institutes and edtech companies after Class 10.
                        To stay relevant, schools must offer better learning than coaching — inside the school itself.
                        Dextora gives schools that edge.
                    </p>
                </div>

                {/* Capabilities Section */}
                <div className="glass-card p-10 rounded-2xl mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">AI Capabilities for Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: <LayoutDashboard className="w-6 h-6" />, text: "AI-powered Learning Management System (AI-LMS)" },
                            { icon: <Users className="w-6 h-6" />, text: "Personalized learning for every student" },
                            { icon: <Award className="w-6 h-6" />, text: "AI-generated report cards" },
                            { icon: <TrendingUp className="w-6 h-6" />, text: "Skill, concept & behavior-based evaluation" },
                            { icon: <Building className="w-6 h-6" />, text: "School-wide performance analytics" },
                            { icon: <Users className="w-6 h-6" />, text: "AI-assisted classrooms for teachers" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-electric-blue">{item.icon}</div>
                                <span className="text-gray-200">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strategic Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Strategic Benefits for Schools</h2>
                        <ul className="space-y-4">
                            {[
                                "Students don’t need external coaching",
                                "Reduced dropouts after Class 10",
                                "Compete with Byju’s, PhysicsWallah & other edtechs",
                                "Schools regain authority as the best place to learn"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                                    <span className="text-gray-300 text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card p-8 rounded-2xl flex items-center justify-center text-center">
                        <p className="text-2xl font-bold text-white italic leading-relaxed">
                            "Dextora keeps students learning with the school, not outside it."
                        </p>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH CRAWLER SECTION */}
            <div ref={crawlerRef} className="w-full relative z-50 py-20 bg-gradient-to-b from-charcoal/0 via-charcoal to-charcoal/0 backdrop-blur-sm">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Empower Your Institution</h2>
                    <p className="text-gray-400 text-xl">See how AI transforms school management</p>
                </div>
                <ImageCrawler images={schoolImages} speed={40} />
            </div>
        </div>
    );
};

export default School;

import { useEffect, useRef } from 'react';
import { ClipboardList, UserCheck, BarChart, BookOpen, Mic, Users, CheckCircle } from 'lucide-react';
import ImageCrawler from '../components/ImageCrawler';

// Images
import imgLessonPlanning from '../assets/teacher/lesson-planning.png';
import imgAutomatedGrading from '../assets/teacher/automated-grading.png';
import imgClassroomIntelligence from '../assets/teacher/classroom-intelligence.png';
import imgInfiniteCanvas from '../assets/teacher/infinite-canvas.png';
import imgStudentInsight from '../assets/teacher/student-insight.png';

const teacherImages = [imgLessonPlanning, imgAutomatedGrading, imgClassroomIntelligence, imgInfiniteCanvas, imgStudentInsight];

const Teacher = () => {
    const crawlerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry.isIntersecting;
                const shouldAvatarBeVisible = !isVisible; // Hide avatar when crawler is visible

                window.dispatchEvent(new CustomEvent('toggle-avatar', {
                    detail: { visible: shouldAvatarBeVisible }
                }));
            },
            {
                threshold: 0.1,
                rootMargin: "100px 0px 0px 0px"
            }
        );

        if (crawlerRef.current) {
            observer.observe(crawlerRef.current);
        }

        return () => {
            if (crawlerRef.current) {
                observer.unobserve(crawlerRef.current);
            }
            // Reset to visible when leaving
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
                        <span className="gradient-text">Become a Super Teacher</span>
                        <br />
                        <span className="text-white">with AI by Your Side</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                        As students become smarter with AI, teachers need equally powerful tools.
                        Dextora transforms teachers into high-impact educators by handling workload, analysis, and personalization — so teachers can focus on mentoring.
                    </p>
                </div>

                {/* Features Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Teaching & Planning */}
                    <div className="glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <BookOpen className="text-electric-blue" /> Teaching & Planning
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Creates complete lesson plans automatically",
                                "Generates learning resources aligned with syllabus",
                                "Designs tests & exams using Bloom’s Taxonomy",
                                "Creates notes, worksheets, presentations & audio books",
                                "Converts live classroom teaching into intelligent notes",
                                "Provides an infinite AI-powered teaching canvas",
                                "Canvas is shared with students after class automatically"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <span className="text-electric-blue mt-1">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Assessment & Evaluation */}
                    <div className="glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <ClipboardList className="text-electric-blue" /> Assessment & Evaluation
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Checks student copies automatically",
                                "Grades tests and exam papers",
                                "Provides concept-wise error analysis",
                                "Generates performance insights instantly"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <span className="text-electric-blue mt-1">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <Mic className="text-electric-blue" /> Student Intelligence
                            </h3>
                            <p className="text-gray-400 mb-4">AI monitors each student’s learning continuously. Teacher can ask AI questions like:</p>
                            <div className="bg-white/5 p-4 rounded-lg mb-4 italic text-gray-300">
                                "Why is this student weak in physics?"<br />
                                "What learning style suits this child?"
                            </div>
                            <p className="text-gray-400">AI answers using real learning data, enabling personalized attention to every student.</p>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="text-center bg-gradient-to-r from-electric-blue/10 to-purple-500/10 p-12 rounded-3xl border border-white/10 mb-32">
                    <h2 className="text-2xl font-bold text-white mb-8">Result for Teachers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="text-electric-blue font-semibold">Less repetitive work</div>
                        <div className="text-electric-blue font-semibold">More time for mentoring</div>
                        <div className="text-electric-blue font-semibold">Data-driven teaching</div>
                        <div className="text-electric-blue font-semibold">Stronger classroom outcomes</div>
                    </div>
                    <p className="text-3xl font-bold text-white italic">
                        "With Dextora, teachers don’t get replaced — they get upgraded."
                    </p>
                </div>
            </div>

            {/* FULL WIDTH CRAWLER SECTION */}
            <div ref={crawlerRef} className="w-full relative z-50 py-20 bg-gradient-to-b from-charcoal/0 via-charcoal to-charcoal/0 backdrop-blur-sm">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Supercharge Your Teaching</h2>
                    <p className="text-gray-400 text-xl">See the future of education management</p>
                </div>
                <ImageCrawler images={teacherImages} speed={40} />
            </div>
        </div>
    );
};

export default Teacher;

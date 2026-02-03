import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "What makes Dextora different from other learning apps?",
        answer: "Unlike traditional apps that just provide videos, Dextora acts as a personal tutor. It reads your mood, adapts to your learning style, tracks your weak areas, and explains concepts line-by-line from your specific school textbooks."
    },
    {
        question: "Is Dextora suitable for competitive exams like JEE & NEET?",
        answer: "Absolutely. Dextora offers specialized modules for JEE and NEET preparation, providing deep conceptual clarity, adaptive practice tests, and performance analytics to ensure you are exam-ready."
    },
    {
        question: "Can parents monitor their child's progress?",
        answer: "Yes. Dextora provides a dedicated Parent Portal where you can view weekly reports, strengths & weaknesses, study time, and even get insights into your child's learning behavior."
    },
    {
        question: "How does the AI doubt solving work?",
        answer: "You can ask doubts via text, voice, or by clicking a picture of your question. Our AI understands the context and provides a step-by-step explanation instantly, 24/7."
    },
    {
        question: "Is my data safe with Dextora?",
        answer: "Your privacy is our top priority. We use end-to-end encryption and strictly follow child data protection laws. Your data is used solely to personalize your learning experience and is never sold to third parties."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes! We offer a 7-day free trial so you can experience the power of personalized AI learning before committing to a subscription."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
                        <HelpCircle className="w-4 h-4 text-electric-blue" />
                        <span className="text-sm text-electric-blue font-semibold">Help Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Everything you need to know about Dextora. Can't find the answer you're looking for? Contact our support team.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`glass-card overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-electric-blue/50' : 'border-white/10'}`}
                        >
                            <button
                                className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-electric-blue flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            <div
                                className={`px-6 text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Support CTA */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-4">Still have questions?</p>
                    <a href="/contact" className="btn-primary inline-flex items-center gap-2">
                        Contact Support
                    </a>
                </div>

            </div>
        </div>
    );
};

export default FAQ;

const PrivacyPolicy = () => {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Privacy Policy</h1>
                <div className="glass-card p-8 rounded-2xl text-gray-300 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Education & Child Safety</h2>
                        <h3 className="text-xl font-semibold text-electric-blue mb-3">Data Protection Measures</h3>
                        <ul className="list-disc pl-5 space-y-3">
                            <li>End-to-end encryption of student data</li>
                            <li>No selling or sharing of personal data</li>
                            <li>Data used only for educational personalization</li>
                            <li>Parent-controlled access</li>
                            <li>Strict child data protection compliance</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-electric-blue mb-3">Our Commitment</h3>
                        <ul className="list-disc pl-5 space-y-3">
                            <li>Privacy-first design</li>
                            <li>Transparent data usage</li>
                            <li>Secure learning ecosystem</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                        <p className="font-bold text-white text-lg">
                            Your data exists only to make learning better and safer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

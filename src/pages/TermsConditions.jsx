const TermsConditions = () => {
    return (
        <div className="relative min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Terms & Conditions</h1>
                <div className="glass-card p-8 rounded-2xl text-gray-300 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Education AI Specific</h2>

                    <h3 className="text-xl font-semibold text-electric-blue">Key Points</h3>
                    <ul className="list-disc pl-5 space-y-3">
                        <li>Dextora is an academic support platform.</li>
                        <li>AI-generated explanations and predictions may not always be perfect.</li>
                        <li>Students should use Dextora as a learning aid, not the sole authority.</li>
                        <li>Vulgar, abusive, or non-academic usage is prohibited.</li>
                        <li>Accounts are personal and non-transferable.</li>
                        <li>The platform may evolve and improve continuously.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="font-semibold text-white">
                            Using Dextora means accepting that AI supports learning, not replaces human judgment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;

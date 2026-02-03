import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        console.log("Login with:", email, password);
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 z-[9999] overflow-hidden">

            {/* Navigation Bar - Forced Overlay */}
            <div className="absolute top-0 left-0 w-full z-50">
                <Navigation />
            </div>

            {/* 1. Background - Absolute & Low Z-Index */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_70%)]" />
                {/* Static Orbs for visuals (no heavy animation) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
            </div>

            {/* 2. Main Content Card - High Z-Index, pushed down slightly to clear nav */}
            <div className="relative z-50 w-full max-w-md mt-20">

                <div className="glass-card backdrop-blur-xl bg-slate-950/60 border border-white/10 p-8 rounded-2xl shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-4">
                            <h1 className="text-3xl font-display font-bold tracking-tighter text-white hover:text-cyan-400 transition-colors">
                                DEXTORA
                            </h1>
                        </Link>
                        <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 text-sm">Sign in to your AI learning space</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest pl-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/80 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest pl-1">Password</label>
                                <a href="#" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/80 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-lg font-bold tracking-wide transition-all ${isLoading
                                    ? 'bg-white/10 cursor-wait text-gray-400'
                                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-950 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons (Text Only for Safety) */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white text-sm font-medium">
                            <span className="mr-2 font-bold text-lg leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">G</span> Google
                        </button>
                        <button className="flex items-center justify-center py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white text-sm font-medium">
                            <span className="mr-2 font-mono">def</span> GitHub
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-8 text-center text-sm text-gray-400">
                        New to Dextora?{' '}
                        <a href="/admission" className="text-cyan-400 hover:text-cyan-400/80 font-medium transition-colors">
                            Start Free Trial
                        </a>
                    </div>

                </div>
            </div>

            {/* Floating Chat Bot Icon (Bottom Right) */}
            <button
                onClick={() => navigate('/chat')}
                className="absolute bottom-8 right-8 z-[1000] group"
                aria-label="Chat with Dextora"
            >
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-20 group-hover:opacity-40 duration-1000" />

                {/* Icon Container */}
                <div className="relative bg-slate-950 border border-cyan-400/50 p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-all duration-300">
                    {/* Safe SVG Bot Icon */}
                    <svg
                        className="w-8 h-8 text-cyan-400 group-hover:text-white transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                {/* Simple tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <span className="text-cyan-400 text-xs font-mono tracking-widest bg-slate-950/90 px-2 py-1 rounded border border-cyan-400/20">CHAT</span>
                </div>
            </button>
        </div>
    );
};

export default Login;

import React from 'react';

const ZigZagCrawler = ({ items = [], speed = 40 }) => {
    // Duplicate items to create seamless loop
    // We quadruplicate to ensure we have enough buffer for the scroll
    const crawlerItems = [...items, ...items, ...items, ...items];

    return (
        <div className="relative w-full overflow-hidden h-[1200px] bg-charcoal/0 hover-pause">
            {/* Gradient Overlays for smooth entry/exit - distinct from main bg */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-charcoal to-transparent z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent z-20" />

            {/* Scrolling Container */}
            <div className="flex flex-col animate-vertical-marquee"
                style={{ animationDuration: `${speed}s` }}>

                {crawlerItems.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const isLastItem = index === crawlerItems.length - 1;

                    return (
                        <div key={index} className="relative w-full max-w-6xl mx-auto py-16 px-4 group">
                            {/* Chain Connector */}
                            {!isLastItem && (
                                <div className="absolute w-full h-48 pointer-events-none z-0"
                                    style={{
                                        top: '60%', // Start from bottom area of current item
                                        left: 0
                                    }}>
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                                        {isEven ? (
                                            // Left Image Bottom -> Right Image Top (\)
                                            // We draw an S-curve to connect them smoothly
                                            <path d="M 25 20 C 25 80, 75 20, 75 80"
                                                className="stroke-cyan"
                                                strokeWidth="0.8"
                                                fill="none"
                                                strokeDasharray="4 4" />

                                        ) : (
                                            // Right Image Bottom -> Left Image Top (/)
                                            <path d="M 75 20 C 75 80, 25 20, 25 80"
                                                className="stroke-cyan"
                                                strokeWidth="0.8"
                                                fill="none"
                                                strokeDasharray="4 4" />
                                        )}

                                        {/* Add dots at endpoints for "chain anchor" look */}
                                        <circle cx={isEven ? 25 : 75} cy="20" r="1" className="fill-cyan" />
                                        <circle cx={isEven ? 75 : 25} cy="80" r="1" className="fill-cyan" />
                                    </svg>
                                </div>
                            )}

                            <div className={`flex items-center gap-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>

                                {/* Image Side */}
                                <div className="flex-1 relative flex justify-center">
                                    <div className={`relative w-[400px] h-[250px] rounded-2xl overflow-hidden border border-white/10 group-hover:border-electric-blue/50 transition-all duration-500 shadow-2xl group-hover:shadow-electric-blue/20
                                                    ${isEven ? 'rotate-[-2deg] group-hover:rotate-0' : 'rotate-[2deg] group-hover:rotate-0'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent z-10" />
                                        <img src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Chain Hook Points Visuals */}
                                        <div className={`absolute w-3 h-3 bg-charcoal rounded-full border-2 border-cyan z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                                                        ${isEven ? 'bottom-3 right-8' : 'bottom-3 left-8'}`} />

                                        {/* Top Hook (Connects from previous) - Hide for very first item visually if needed, but marquee loops so keep it */}
                                        <div className={`absolute w-3 h-3 bg-charcoal rounded-full border-2 border-cyan z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                                                        ${isEven ? 'top-3 left-8' : 'top-3 right-8'}`} />
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="flex-1 text-left px-8">
                                    <h3 className="text-4xl font-display font-bold text-white mb-4 group-hover:text-electric-blue transition-colors drop-shadow-lg">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-300 font-mono text-base leading-relaxed max-w-md">
                                        {item.desc}
                                    </p>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes vertical-marquee {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .animate-vertical-marquee {
                    animation: vertical-marquee linear infinite;
                }
                /* Pause animation on hover */
                .hover-pause:hover .animate-vertical-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default ZigZagCrawler;

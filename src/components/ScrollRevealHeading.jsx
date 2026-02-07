import { useRef } from 'react';
import { useInView } from 'framer-motion';

const ScrollRevealHeading = ({ text, className = "", textClassName = "", level = "h2" }) => {
    const Tag = level;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

    return (
        <Tag ref={ref} className={`${className} overflow-hidden`}>
            <span className="block drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                {Array.from(text).map((char, index) => (
                    <span
                        key={index}
                        className={`inline-block will-change-transform ${textClassName}`}
                        style={{
                            opacity: 0,
                            animation: isInView
                                ? `smoothFadeUp 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards`
                                : 'none',
                            animationDelay: isInView
                                ? `${0.1 + (index * 0.05)}s` // Faster stagger for visible scroll elements
                                : '0s'
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
        </Tag>
    );
};

export default ScrollRevealHeading;

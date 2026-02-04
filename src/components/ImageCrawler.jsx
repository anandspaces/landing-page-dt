import React from 'react';

const ImageCrawler = ({ images = [], speed = 50, direction = 'left', className = '' }) => {
    if (!images.length) return null;

    // Create a large enough set of images to ensure one "track" fills the screen comfortably
    // 5 images * 400px = 2000px. On 4K screens (3840px), we need at least 2 repeats to fill ONCE.
    // Let's do 4 repeats per track to be safe.
    const trackImages = [...images, ...images, ...images, ...images];

    return (
        <div className={`w-full overflow-hidden bg-charcoal/50 backdrop-blur-sm py-8 ${className}`}>
            {/* 
         The Wrapper: Flex container to hold the two tracks side-by-side.
         No external gaps here.
      */}
            <div className="flex select-none hover:pause-animation">

                {/* Track 1 */}
                <div
                    className="flex shrink-0 items-center justify-around gap-8 pr-8 animate-marquee"
                    style={{
                        animationDuration: `${speed}s`,
                        animationDirection: direction === 'left' ? 'normal' : 'reverse',
                        minWidth: '100%'
                    }}
                >
                    {trackImages.map((img, idx) => (
                        <Card key={`t1-${idx}`} img={img} idx={idx} />
                    ))}
                </div>

                {/* Track 2 - Identical to Track 1 */}
                <div
                    className="flex shrink-0 items-center justify-around gap-8 pr-8 animate-marquee"
                    style={{
                        animationDuration: `${speed}s`,
                        animationDirection: direction === 'left' ? 'normal' : 'reverse',
                        minWidth: '100%'
                    }}
                >
                    {trackImages.map((img, idx) => (
                        <Card key={`t2-${idx}`} img={img} idx={idx} />
                    ))}
                </div>

            </div>
        </div>
    );
};

const Card = ({ img, idx }) => (
    <div
        className="flex-shrink-0 relative group rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border border-white/5"
        style={{ width: '400px', height: '225px' }} // 16:9 aspect ratio
    >
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
            {/* Optional overlay could go here */}
        </div>
        <img
            src={img}
            alt={`Feature ${idx}`}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
        />
    </div>
)

export default ImageCrawler;

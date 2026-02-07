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

// Helper to extract and format image name from URL
const formatImageName = (url) => {
    if (!url) return '';

    // Extract filename from path/URL
    // Handles scenarios like: /assets/my-image.png, /assets/my-image.hash.png
    const filename = url.split('/').pop().split('.')[0];

    // Decode URI component in case of encoded characters
    const decodedName = decodeURIComponent(filename);

    // Replace hyphens/underscores with spaces
    // Remove potential hash or IDs if they are separated by dots (already handled by split('.')[0])
    // But sometimes vite adds hash like name-HASH.ext or name.HASH.ext
    // Let's assume standard kebab-case or snake_case for the name part
    const cleanName = decodedName.replace(/[-_]/g, ' ');

    // Capitalize first letter of each word
    return cleanName.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Card = ({ img, idx }) => {
    // Handle both string URLs and object structures
    const isObject = typeof img === 'object';
    const imgSrc = isObject ? img.img : img;
    const imgName = isObject && img.name ? img.name : formatImageName(imgSrc);
    const brief = isObject ? img.brief : null;

    const name = imgName;

    return (
        <div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-default">
            <div
                className="relative rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 border border-white/5"
                style={{ width: '400px', height: '225px' }} // 16:9 aspect ratio
            >
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                    src={imgSrc}
                    alt={name || `Feature ${idx}`}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                />
            </div>

            <div className="text-center mt-2">
                <p className="text-gray-300 font-medium tracking-wide text-lg group-hover:text-cyan transition-colors duration-300">
                    {name}
                </p>
                {brief && (
                    <p className="text-gray-400 text-sm font-light mt-1 whitespace-pre-line leading-snug">
                        {brief}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ImageCrawler;

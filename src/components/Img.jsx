import { useState } from "react";

const Img = ({ src, alt = "Image", className = "", ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <div className={`relative w-full ${className}`} style={{ paddingBottom: "66.66%" }}>
            {/* 🔹 3:2 Aspect Ratio (2 / 3 * 100) */}
            <img
                src={imgSrc}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                onError={() => setImgSrc(`https://placehold.co/100?text=${encodeURIComponent(alt)}`)}
                {...props}
            />
        </div>
    );
};

export default Img;

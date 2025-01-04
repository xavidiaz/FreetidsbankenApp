import { useState } from "react";

const Img = ({ src, alt = "Image", className = "", ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`} // ✅ Ensures full width & height
            onError={() => setImgSrc(`https://placehold.co/100?text=${encodeURIComponent(alt)}`)} // ✅ Dynamic fallback text
            {...props}
        />
    );
};

export default Img;

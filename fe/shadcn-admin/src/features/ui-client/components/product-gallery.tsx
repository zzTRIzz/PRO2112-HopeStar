import React from "react";
import { Card, CardBody, Image } from "@heroui/react";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export function ProductGallery() {
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  const images: ProductImage[] = [
    { id: 1, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Main" },
    { id: 2, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Side" },
    { id: 3, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Back" },
    { id: 4, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Camera" },
    { id: 5, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Camera" },
    { id: 6, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Camera" },
    { id: 7, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Camera" },
    { id: 8, url: "https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pro_max_desert_titan_3552a28ae0.png", alt: "iPhone 15 Pro Max - Camera" }
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardBody className="p-0 relative group">
          <Image
            removeWrapper
            className="w-full aspect-square object-cover"
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
          />
          {/* Navigation Buttons - Hidden by default, shown on hover */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            ◀
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            ▶
          </button>
        </CardBody>
      </Card>
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`flex-shrink-0 w-1/4 relative rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedImage === index ? "ring-2 ring-primary" : "hover:opacity-80"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              removeWrapper
              className="w-full aspect-square object-cover"
              src={image.url}
              alt={image.alt}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
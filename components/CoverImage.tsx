"use client";

import React from "react";
import Image from "next/image";
import styles from "./CoverImage.module.css";

interface CoverImageProps {
  image: string;
  alt?: string;
}

const CoverImage: React.FC<CoverImageProps> = ({ image, alt = "Cover image" }) => {
  return (
    <div className={`${styles.coverImageMain} w-screen relative left-1/2 right-1/2 -mx-[50vw] h-60 sm:h-80 md:h-96`}>
      <Image
        src={image}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
};

export default CoverImage;

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
    <div className={styles.coverImageMain}>
      <Image src={image} alt={alt} width={800} height={400} layout="responsive" />
    </div>
  );
};

export default CoverImage;

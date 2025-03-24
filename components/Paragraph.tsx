"use client";

import React from "react";
import styles from "./Paragraph.module.css";

interface ParagraphProps {
  header: string;
  text: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ header, text }) => {
  return (
    <div className={styles.paragraphMain}>
      <div className={styles.paragraphSubmain}>
        <div className={styles.paragraphHeader}>{header}</div>
        <div className={styles.paragraphText}>{text}</div>
      </div>
    </div>
  );
};

export default Paragraph;

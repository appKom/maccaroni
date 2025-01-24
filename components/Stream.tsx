import YouTube from "react-youtube";
import styles from "./Stream.module.css";

interface Props {
  link: {
    link: string;
  };
}

const Stream = ({ link }: Props) => {
  const videoOpts = {
    playerVars: {
      autoplay: 1,
      playsinline: 1,
    },
  };

  return (
    <div className={styles.youtubeWrapper}>
      <YouTube
        videoId={link?.link}
        opts={videoOpts}
        className={styles.youtubeActual}
      />
    </div>
  );
};

export default Stream;

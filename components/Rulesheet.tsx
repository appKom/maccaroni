import styles from "./Rulesheet.module.css";

interface Props {
  rulesheet: {
    markdown: string;
  };
}

const Rulesheet = ({ rulesheet }: Props) => {
  return (
    <div className={styles.rulesheetWrapper}>
      <div>
        <p>{rulesheet.markdown}</p>
      </div>
    </div>
  );
};

export default Rulesheet;

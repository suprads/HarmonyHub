import styles from "./chart.module.css";

export default function Page() {
  return (
    <div className={styles.page}>
      <h1 className={styles.chartHeader}>Your Personalized Charts</h1>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          Explore your data with our interactive charting tools.
        </div>
      </main>
    </div>
  );
}

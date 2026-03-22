import { Card, CardContent } from "@/components/ui/card";
import styles from "./page.module.css";

export default function StatCard({
  label,
  displayValue,
}: {
  label: string;
  displayValue: string;
}) {
  return (
    <Card className={styles.statCard}>
      <CardContent className={styles.statCardContent}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{displayValue}</p>
      </CardContent>
    </Card>
  );
}

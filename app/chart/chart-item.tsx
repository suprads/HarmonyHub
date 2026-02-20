import Image from "next/image";

type ChartItemProps = {
  itemNumber: number;
  imgUrl?: string;
  name: string;
  subtitle: string;
};

export default function ChartItem({
  itemNumber,
  imgUrl,
  name,
  subtitle,
}: ChartItemProps) {
  return (
    <li style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 28,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          {itemNumber}
        </div>
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={name}
            width={64}
            height={64}
            style={{ borderRadius: 6 }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{subtitle}</div>
        </div>
      </div>
    </li>
  );
}

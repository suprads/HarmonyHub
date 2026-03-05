import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkServiceButton, UnlinkServiceButton } from "./service-buttons";

type ServiceDisplayProps = {
  action: "link" | "unlink";
  provider: string;
  title: string;
  scopes?: string[];
};

export default function ServiceDisplay({
  action,
  provider,
  scopes,
  title,
}: ServiceDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {action === "unlink" ? (
          <UnlinkServiceButton provider={provider} />
        ) : (
          <LinkServiceButton provider={provider} scopes={scopes} />
        )}
      </CardContent>
    </Card>
  );
}

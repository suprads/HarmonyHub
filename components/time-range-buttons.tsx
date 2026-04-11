"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as SpotifyAPI from "@/services/spotify";

interface TimeRangeButtonsProps {
  currentTimeRange: SpotifyAPI.TimeRange;
}

export default function TimeRangeButtons({
  currentTimeRange,
}: TimeRangeButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeRanges: { value: SpotifyAPI.TimeRange; label: string }[] = [
    { value: "short_term", label: "Last 4 Weeks" },
    { value: "medium_term", label: "Last 6 Months" },
    { value: "long_term", label: "All Time" },
  ];

  const handleTimeRangeChange = (timeRange: SpotifyAPI.TimeRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("timeRange", timeRange);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 justify-center py-4 flex-wrap">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          onClick={() => handleTimeRangeChange(range.value)}
          variant={currentTimeRange === range.value ? "default" : "outline"}
          className="px-6"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}

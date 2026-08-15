import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DurationSettingsProps {
  onSetDuration: (seconds: number) => void;
}

export function DurationSettings({ onSetDuration }: DurationSettingsProps) {
  const [customMinutes, setCustomMinutes] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");

  const handleSetCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const totalSecs = mins * 60 + secs;
    if (totalSecs > 0) {
      onSetDuration(totalSecs);
      setCustomMinutes("");
      setCustomSeconds("");
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Pengaturan Durasi</CardTitle>
        <CardDescription>
          Atur durasi pengerjaan menggunakan template bawaan atau waktu kustom.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Template Shortcut */}
        <div>
          <h4 className="text-sm font-bold mb-3">Template Shortcut (Detik):</h4>
          <div className="flex flex-wrap gap-2">
            {[90, 60, 30, 15, 10].map((sec) => (
              <Button
                key={sec}
                variant="outline"
                onClick={() => onSetDuration(sec)}
                className="flex-1 font-bold h-12"
              >
                {sec}s
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <h4 className="text-sm font-bold mb-3">Durasi Kustom:</h4>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Menit
              </span>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="font-bold text-center mt-1"
              />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Detik
              </span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="30"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                className="font-bold text-center mt-1"
              />
            </div>
            <Button
              onClick={handleSetCustomTime}
              className="font-bold h-10 px-6"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

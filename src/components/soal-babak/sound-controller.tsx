import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface SoundControllerProps {
  onTriggerSound: (type: "correct" | "wrong" | "timesup") => void;
}

export function SoundController({ onTriggerSound }: SoundControllerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center gap-1.5">
          <Volume2 className="w-4 h-4" /> Trigger Sound FX
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => onTriggerSound("correct")} className="border-emerald-200 text-emerald-600">
          Benar (Tung)
        </Button>
        <Button size="sm" variant="outline" onClick={() => onTriggerSound("wrong")} className="border-rose-200 text-rose-600">
          Salah (Tot)
        </Button>
      </CardContent>
    </Card>
  );
}

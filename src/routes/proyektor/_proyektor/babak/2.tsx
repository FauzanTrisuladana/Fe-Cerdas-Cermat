import { createFileRoute } from "@tanstack/react-router";
import { Babak2View } from "@/components/proyektor/babak2-view";

export const Route = createFileRoute("/proyektor/_proyektor/babak/2")({
  component: Babak2,
});

function Babak2() {
  return <Babak2View />;
}

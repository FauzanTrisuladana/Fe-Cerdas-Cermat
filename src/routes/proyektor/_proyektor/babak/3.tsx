import { createFileRoute } from "@tanstack/react-router";
import { Babak3View } from "@/components/proyektor/babak3-view";

export const Route = createFileRoute("/proyektor/_proyektor/babak/3")({
  component: Babak3,
});

function Babak3() {
  return <Babak3View />;
}

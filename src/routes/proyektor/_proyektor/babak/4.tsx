import { createFileRoute } from "@tanstack/react-router";
import { Babak14View } from "@/components/proyektor/babak1-view";

export const Route = createFileRoute("/proyektor/_proyektor/babak/4")({
  component: Babak4,
});

function Babak4() {
  return <Babak14View babakNumber={4} />;
}

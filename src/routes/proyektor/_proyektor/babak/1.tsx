import { createFileRoute } from "@tanstack/react-router";
import { Babak14View } from "@/components/proyektor/babak1-view";

export const Route = createFileRoute("/proyektor/_proyektor/babak/1")({
  component: Babak1,
});

function Babak1() {
  return <Babak14View babakNumber={1} />;
}

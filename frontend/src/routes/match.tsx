import { createFileRoute } from "@tanstack/react-router";
import { Match } from "../components/match/Match";

export const Route = createFileRoute("/match")({
  component: Match,
});

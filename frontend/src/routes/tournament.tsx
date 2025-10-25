import { createFileRoute } from "@tanstack/react-router";
import { Tournament } from "../components/tournament/Tournament";

export const Route = createFileRoute("/tournament")({
  component: Tournament,
});

import "./index.css";
import { registerRoute, init } from "./router";
import { Home } from "./pages/Home";
import { Match } from "./pages/Match";
import { Tournament } from "./pages/Tournament";
import { Local } from "./pages/Local";
import { Layout } from "./components/layout/Layout";

// Register routes
registerRoute("/", () => Layout(Home()));
registerRoute("/match", () => Layout(Match()));
registerRoute("/tournament", () => Layout(Tournament()));
registerRoute("/local", () => Layout(Local()));

// Initialize router
init();

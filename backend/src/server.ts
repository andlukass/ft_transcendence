import websocket from "@fastify/websocket";
import Fastify from "fastify";
import matchRoute from "./ws/match";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const fastify = Fastify({ logger: false });

// Register WebSocket plugin
await fastify.register(websocket);

fastify.get("/health", async (_request, _reply) => {
	return { status: "ok", message: "Server is running" };
});

// Register WebSocket routes
await fastify.register(matchRoute);

await fastify.listen({ port: PORT, host: HOST });
console.log(`🚀 Server listening on http://${HOST}:${PORT}`);

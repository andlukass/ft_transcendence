import Fastify from "fastify";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const fastify = Fastify({ logger: false });

fastify.get("/health", async (_request, _reply) => {
	return { status: "ok", message: "Server is running" };
});

await fastify.listen({ port: PORT, host: HOST });
console.log(`🚀 Server listening on http://${HOST}:${PORT} !`);

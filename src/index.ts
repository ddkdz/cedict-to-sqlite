import { Server } from "./api/server";

const server = new Server(8090);

const gracefulShutdown = (async () => {
	await server.shutdown();
	process.exit();
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

(async () => {
	await server.start();
})();

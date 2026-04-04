import { serve } from "bun";
import index from "./index.html";

const server = serve({
	routes: {
		"/*": index,
	},

	development: process.env.NODE_ENV !== "production" && {
		/* hot reloading */
		hmr: true,

		/* echo client console logs to server */
		console: true,
	}
});

console.log(`up and running at ${server.url}`);

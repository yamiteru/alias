import { workerSimple, assert } from "utils";
import { KVNamespace } from "@cloudflare/workers-types";

export default {
	fetch: workerSimple<{
	  KV: KVNamespace,
	}>()(async (request, { KV }) => {
		const key = new URL(request.url).pathname.slice(1);

		assert(key !== "", 500, "URL should not be empty");

		const value = await KV.get(key);

		assert(value !== null, 404, `Alias for this URL not found`);

		return new Response(value);
	})
};
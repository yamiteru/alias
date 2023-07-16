import { ok, error } from "utils";
import { KVNamespace } from "@cloudflare/workers-types";

export default {
  async fetch(request: Request, env: {
		KV: KVNamespace,
	}) {
		const url = await env.KV.get(new URL(request.url).pathname.slice(1).replace("/", ":"));

		if(url == null){
			return error(500);
		} 

    return new ok(url);
  }
};

import {ok, keyFromUrl, errorKeyNotFound, errorKeyEmpty} from "utils";
import { KVNamespace } from "@cloudflare/workers-types";

export default {
  async fetch(request: Request, env: {
	  KV: KVNamespace,
  }) {
  	const key = keyFromUrl(request.url);

	  // TODO: change if into assert
	 if(key === "") {
		 return errorKeyEmpty();
	 }

  	const value = await env.KV.get(key);

	  // TODO: change if into assert
	if(value === null){
		return errorKeyNotFound(key);
	}

	return ok(value);
  }
};
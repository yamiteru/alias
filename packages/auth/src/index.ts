import { D1Database } from "@cloudflare/workers-types";
import {error, ok} from "utils";

// TODO: allow to specify input/output schemas (zod?)
const ROUTES = {
    "POST /login": async () => {
        return ok("login");
    },
    "POST /register": async () => {
        return ok("register");
    },
} satisfies Record<string, (() => Promise<Response>)>;

export default {
    // TODO: extract env
  async fetch(request: Request, env: {
	  __D1_BETA__DB: D1Database,
  }) {
      // TODO: extract into function
      const key = `${request.method} ${new URL(request.url).pathname}`;
      const route = ROUTES[key as keyof typeof ROUTES];

      if(route) {
          // TODO: pass some data into the route
          return route();
      } else {
          // TODO: create custom error
         return error(500, "Route not found");
      }
  }
};
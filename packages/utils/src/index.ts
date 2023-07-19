import {KVNamespace} from "@cloudflare/workers-types";

export type Method = "POST" | "GET" | "PUT" | "DELETE";

export type Handler<
    $Env extends Record<string, any>,
> = <
    $Context extends Context
>(
    request: Request,
    env: $Env,
    context: $Context
) => Promise<Response>;

export type Router<
    $Env extends Record<string, any>,
> = Partial<
    Record<
        Method,
        Array<[
            `/${string}`,
            Handler<$Env>
        ]>
    >
>;

export type Env = {
    KV: KVNamespace,
};

export function assert(condition: unknown, code: number, msg: string): asserts condition {
    if(!condition) {
        console.log(`Error: ${msg}`);
        throw code;
    }
}

export const error = (e: any) => {
    console.log(e);
    return new Response("", {
        status: typeof e === "number" ? e: 500
    });
};

export const workerSimple = <$Env extends Record<string, unknown>>() => (handler: Handler<$Env>) => {
    return async (request: Request, env: $Env) => {
       try {
           return await handler(request, env, { vars: new Map(), body: null });
       } catch (e: any) {
           return error(e);
       }
    };
};

export const extractVarsFromUrl = (pattern: string, pathname: string) => {
   const map = new Map<string, string>();

   const patternParts = pattern.split("/");
   const pathnameParts = pathname.split("/");

   for(let i = 0; i < patternParts.length; ++i) {
       const part = patternParts[i];

      if(part[0] === ":") {
         map.set(part.slice(1), pathnameParts[i]);
      }
   }

   return map;
};

export const extractBodyFromRequest = async (request: Request)  => {
    if(request.method === "POST") {
        const text = await request.text();

        assert(text !== "", 500, "Body is empty");

        try {
            return JSON.parse(text) as Record<string, any>;
        } catch {
            assert(false, 500, "Body could not be parsed");
        }
    }

    return null;
};

export type Context = {
   vars: Map<string, string>;
   body: Record<string, any> | null;
};

export const workerAdvanced = <
    $Env extends Record<string, unknown>
>() => <
    $Router extends Router<$Env>
>(router: $Router) => {
    return async (request: Request, env: $Env) => {
       try {
           const { method, url} = request;
           const handlers = router[method as Method];

           assert(
               handlers,
               404,
               "This method does not exist in the router"
           );

           const { origin, pathname } = new URL(url);

           for(const [pattern, handler] of handlers) {
               if(new URLPattern(pattern, origin).test(url)) {
                   const context = {
                       vars: extractVarsFromUrl(pattern, pathname),
                       body: await extractBodyFromRequest(request)
                   } satisfies Context;

                   return await handler(request, env, context);
               }
           }

           assert(
               false,
               500,
               "No handler for this url was found"
           );
       } catch (e) {
           return error(e);
       }
    };
};
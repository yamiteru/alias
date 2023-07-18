export type Method = "POST" | "GET" | "PUT" | "DELETE";

export type Handler = <$Env extends Record<string, any>>(request: Request, env: $Env) => Promise<Response>;

export type Router = Partial<
    Record<
        Method,
        Array<[
            `/${string}`,
            Handler
        ]>
    >
>;

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

export const workerSimple = <$Env extends Record<string, unknown>>() => (handler: Handler) => {
    return async (request: Request, env: $Env) => {
       try {
           return await handler(request, env);
       } catch (e: any) {
           return error(e);
       }
    };
};

export const workerAdvanced = <
    $Env extends Record<string, unknown>
>() => <
    $Router extends Router
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

           const { origin } = new URL(url);

           for(const [path, handler] of handlers) {
               if(new URLPattern(path, origin).test(url)) {
                   return await handler(request, env);
               }
           }

           assert(
               false,
               500,
               "No handler for this method and url was found"
           );
       } catch (e) {
           return error(e);
       }
    };
};
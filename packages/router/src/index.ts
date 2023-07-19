import {assert, Env, workerAdvanced} from "utils";

export default {
    fetch: workerAdvanced<Env>()({
        GET: [
            ["/:user/:url", async (request, { KV }) => {
                const key = new URL(request.url).pathname.slice(1);

                assert(key !== "", 500, "URL should not be empty");

                const url = await KV.get(key);

                assert(url !== null, 404, `Alias for this URL not found`);

                const source = await fetch(url);
                const { headers, status, statusText} = source;

                return new Response(source.body, {
                    status,
                    statusText,
                    headers
                });
            }]
        ],
        POST: [
            ["/:user/:url", async (_1, { KV }, { vars, body }) => {
                await KV.put(`${vars.get("user")}/${vars.get("url")}`, (body as Record<string, any>).source as string);
                
                return new Response();
            }],
        ],
        DELETE: [
            ["/:user/:url", async (_1, { KV }, { vars }) => {
                await KV.delete(`${vars.get("user")}/${vars.get("url")}`);

                return new Response();
            }],
        ]
    })
};
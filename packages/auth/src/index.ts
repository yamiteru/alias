import { workerAdvanced } from "utils";
import { D1Database } from "@cloudflare/workers-types";

export default {
    fetch: workerAdvanced<{
        __D1_BETA__DB: D1Database
    }>()({
        POST: [
            ["/login", async () => {
                return new Response();
            }],
            ["/register", async () => {
                return new Response();
            }],
        ],
        DELETE: [
            ["/:user", async () => {
                return new Response();
            }],
        ]
    })
};
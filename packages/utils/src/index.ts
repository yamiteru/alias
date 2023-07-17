export const error = (status: number, statusText: string) => new Response("", { status, statusText});

// TODO: rename to errorUrlNotFound
export const errorKeyNotFound = (key: string) => error(500,`Key [${key}] not found`);

// TODO: rename to errorUrlEmpty
export const errorKeyEmpty = () => error(500,`Key should not be empty`);

export const ok = (value: string) => new Response(value);

// TODO: extract new URL(url).pathname into a function
export const keyFromUrl = (url: string) => new URL(url).pathname.slice(1).replace("/", ":");
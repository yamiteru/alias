export const error = (code: number) => new Response("", {
	status: code,
	statusText: "Something went wrong"
});

export const ok = (value: string) => new Response(value);

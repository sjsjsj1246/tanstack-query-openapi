import createClient, { type Middleware } from "openapi-fetch";
import { type paths } from "./types";

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
const baseUrl = "https://api.github.com";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set("Authorization", `Bearer ${githubToken}`);
    return request;
  },
};

export const client = createClient<paths>({ baseUrl });

client.use(authMiddleware);

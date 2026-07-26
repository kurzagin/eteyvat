import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const exportDirectory = resolve(projectRoot, "out");
const distributionDirectory = resolve(projectRoot, "dist");
const clientDirectory = resolve(distributionDirectory, "client");
const serverDirectory = resolve(distributionDirectory, "server");

await rm(distributionDirectory, { force: true, recursive: true });
await mkdir(serverDirectory, { recursive: true });
await cp(exportDirectory, clientDirectory, { recursive: true });

const workerSource = `const worker = {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname.endsWith("/")) {
      requestUrl.pathname += "index.html";
    }

    let response = await env.ASSETS.fetch(new Request(requestUrl, request));
    if (response.status === 404) {
      response = await env.ASSETS.fetch(
        new Request(new URL("/404.html", request.url), request),
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    const html = (await response.text()).replaceAll(
      "http://localhost:3000",
      new URL(request.url).origin,
    );
    const headers = new Headers(response.headers);
    headers.set("content-length", String(new TextEncoder().encode(html).length));
    return new Response(html, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  },
};

export default worker;
`;

await writeFile(resolve(serverDirectory, "index.js"), workerSource);

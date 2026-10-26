import { serveFile, serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  let response = await serveDir(req, {
    fsRoot: "dist/pokedex-angular",
  });

  // Fallback para Angular (SPA) - Si da 404, redirige al index.html
  if (response.status === 404) {
    response = await serveFile(req, "dist/pokedex-angular/index.html");
  }

  // Inyectar los 6 encabezados de seguridad requeridos
  const secureHeaders = new Headers(response.headers);
  secureHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  secureHeaders.set("X-Frame-Options", "SAMEORIGIN");
  secureHeaders.set("X-Content-Type-Options", "nosniff");
  secureHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  secureHeaders.set("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: wss:;");
  secureHeaders.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return new Response(response.body, {
    status: response.status,
    headers: secureHeaders,
  });
});
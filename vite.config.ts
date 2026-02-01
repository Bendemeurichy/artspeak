import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [deno(), reactRouter()],
  base: command === "build" ? "/artspeak/" : "/",
}));

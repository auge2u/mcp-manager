import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import electron from "vite-plugin-electron"
import renderer from "vite-plugin-electron-renderer"

export default defineConfig({
	plugins: [
		react(),
		electron([
			{
				entry: "electron/main.ts",
				onstart(options) {
					options.reload()
				},
			},
			{
				entry: "electron/preload.ts",
				onstart(options) {
					options.reload()
				},
			},
		]),
		renderer()
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},
	base: "./",
	build: {
		sourcemap: true,
		minify: false,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html')
			}
		}
	},
	server: {
		port: 7777,
		strictPort: true,
		host: true,
		hmr: {
			protocol: 'ws',
			host: 'localhost'
		},
		watch: {
			usePolling: true
		}
	},
	clearScreen: false
})

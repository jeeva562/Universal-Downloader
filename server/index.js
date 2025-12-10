import express from "express";
import cors from "cors";
import morgan from "morgan";
import { spawn } from "child_process";
import https from "https";
import http from "http";
import { sanitizeFilename } from "./utils/filename.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Helper to find yt-dlp executable
function getYtDlpPath() {
	// Check local bin directory (relative to project root)
	// server/index.js is in /server, so project root is ../
	const localBinPath = path.resolve(__dirname, '..', 'bin', 'yt-dlp');

	if (fs.existsSync(localBinPath)) {
		console.log(`✅ Found local yt-dlp at: ${localBinPath}`);
		return localBinPath;
	}

	// Check if it's in the PATH by trying to spawn 'which' or just returning 'yt-dlp'
	console.log('⚠️ Local yt-dlp not found in bin/, using system PATH');
	return 'yt-dlp';
}

const ytDlpExecutable = getYtDlpPath();

// CORS configuration for production
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (mobile apps, curl, etc.)
		if (!origin) return callback(null, true);

		// Allow localhost for development
		if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
			return callback(null, true);
		}

		// Allow Netlify domains
		if (origin.includes('.netlify.app') || origin.includes('netlify.app')) {
			return callback(null, true);
		}

		// Allow common hosting platforms
		if (origin.includes('.vercel.app') || origin.includes('.railway.app') ||
			origin.includes('.render.com') || origin.includes('.onrender.com')) {
			return callback(null, true);
		}

		// Allow any HTTPS origin (more permissive, adjust as needed)
		if (origin.startsWith('https://')) {
			return callback(null, true);
		}

		callback(new Error('Not allowed by CORS'));
	},
	credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.set("trust proxy", true);

// Health check
app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});

// Universal download endpoint - handles all platforms
app.get("/api/download", async (req, res) => {
	const { url, format = "best" } = req.query;

	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "Missing or invalid URL" });
	}

	try {
		// For direct image URLs, download via HTTP instead of yt-dlp
		if (format === "image" && url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i)) {
			console.log(`Direct image download: ${url}`);

			const protocol = url.startsWith("https") ? https : http;

			const imageReq = protocol.get(url, (imageRes) => {
				if (imageRes.statusCode !== 200) {
					return res.status(imageRes.statusCode).json({
						error: "Failed to fetch image",
						details: `HTTP ${imageRes.statusCode}`
					});
				}

				const contentType = imageRes.headers["content-type"] || "image/jpeg";
				let ext = "jpg";
				if (contentType.includes("png")) ext = "png";
				else if (contentType.includes("gif")) ext = "gif";
				else if (contentType.includes("webp")) ext = "webp";

				let filename = "image." + ext;
				try {
					const urlParts = url.split("/");
					const urlFilename = urlParts[urlParts.length - 1].split("?")[0];
					if (urlFilename && urlFilename.includes(".")) {
						filename = sanitizeFilename(urlFilename);
					}
				} catch (e) {
					// Use default
				}

				res.setHeader("Content-Type", contentType);
				res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
				res.setHeader("Cache-Control", "no-cache");

				console.log(`Downloading image: ${filename}`);

				imageRes.pipe(res);
			});

			imageReq.on("error", (err) => {
				console.error("Image download error:", err);
				if (!res.headersSent) {
					res.status(500).json({ error: "Image download failed", details: err.message });
				}
			});

			res.on("close", () => {
				imageReq.destroy();
			});

			return;
		}

		// Video/Audio download via yt-dlp
		let ytDlpFormat;
		let fileExt;
		const defaultVideoExt = "mp4";
		const defaultAudioExt = "m4a";

		if (format === "audio") {
			ytDlpFormat = "bestaudio";
			fileExt = defaultAudioExt;
		} else if (format === "video") {
			ytDlpFormat = "best[ext=mp4]/best";
			fileExt = defaultVideoExt;
		} else if (format.startsWith("quality:")) {
			const quality = format.split(":")[1].replace("p", "");
			ytDlpFormat = `best[height<=${quality}][ext=mp4]/best[height<=${quality}]`;
			fileExt = defaultVideoExt;
		} else {
			ytDlpFormat = "best[ext=mp4]/best";
			fileExt = defaultVideoExt;
		}

		console.log(`Format requested: ${format}, yt-dlp format: ${ytDlpFormat}`);

		// Valid video/audio extensions - used to validate extracted extension
		const validVideoExts = ['mp4', 'm4v', 'webm', 'mkv', 'avi', 'mov', 'flv', '3gp'];
		const validAudioExts = ['m4a', 'mp3', 'aac', 'opus', 'ogg', 'wav', 'flac', 'webm'];
		const validMediaExts = [...validVideoExts, ...validAudioExts];

		// Get media info
		// YouTube-specific workarounds to bypass bot detection
		const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
		const isInstagram = url.includes('instagram.com');

		// Platform-specific arguments
		let platformArgs = [];
		if (isYouTube) {
			platformArgs = [
				"--extractor-args", "youtube:player_client=android,web",
				"--user-agent", "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
			];
		} else if (isInstagram) {
			// Instagram-specific workarounds
			platformArgs = [
				"--user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
				"--add-header", "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
				"--add-header", "Accept-Language:en-US,en;q=0.5"
			];
		}

		const infoArgs = [
			"--get-filename",
			"-o", "%(title)s.%(ext)s",
			"-f", ytDlpFormat,
			"--no-warnings",
			"--no-check-certificate",
			"--age-limit", "99",
			...platformArgs,
			url
		];

		const infoProcess = spawn(ytDlpExecutable, infoArgs);

		let filename = `download.${fileExt}`;
		let infoOutput = "";
		let infoErrors = "";

		infoProcess.stdout.on("data", (chunk) => {
			infoOutput += chunk.toString().trim();
		});

		infoProcess.stderr.on("data", (chunk) => {
			infoErrors += chunk.toString();
		});

		await new Promise((resolve) => {
			infoProcess.on("close", (code) => {
				if (code === 0 && infoOutput) {
					const rawFilename = sanitizeFilename(infoOutput);
					if (rawFilename.includes('.')) {
						const parts = rawFilename.split('.');
						const extractedExt = parts.pop().toLowerCase();
						const baseName = parts.join('.');

						// Validate extracted extension is a known media format
						if (validMediaExts.includes(extractedExt)) {
							filename = rawFilename;
							fileExt = extractedExt;
						} else {
							// Invalid extension (like .txt) - use default and keep base name
							console.warn(`Invalid extension detected: .${extractedExt}, using default .${fileExt}`);
							const expectedExt = format === 'audio' ? defaultAudioExt : defaultVideoExt;
							filename = `${baseName}.${expectedExt}`;
							fileExt = expectedExt;
						}
					} else {
						filename = `${rawFilename}.${fileExt}`;
					}
				} else if (code !== 0) {
					console.error("Info fetch failed:", infoErrors);
				}
				resolve();
			});
			infoProcess.on("error", (err) => {
				console.error("Info process error:", err);
				resolve();
			});
		});

		// Determine content type
		const ext = fileExt.toLowerCase();
		let contentType = "application/octet-stream";

		if (ext === "mp4" || ext === "m4v") {
			contentType = "video/mp4";
		} else if (ext === "webm") {
			contentType = "video/webm";
		} else if (ext === "mkv") {
			contentType = "video/x-matroska";
		} else if (ext === "m4a" || ext === "aac") {
			contentType = "audio/mp4";
		} else if (ext === "mp3") {
			contentType = "audio/mpeg";
		}

		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

		// Define yt-dlp arguments for streaming download
		const dlArgs = [
			"-f", ytDlpFormat,
			"-o", "-", // Output to stdout
			"--no-warnings",
			"--no-check-certificate",
			"--age-limit", "99",
			"--no-playlist",
			...platformArgs,
			url
		];

		console.log(`Starting download: ${filename}`);
		console.log(`yt-dlp args: ${dlArgs.join(" ")}`);

		const dlProcess = spawn(ytDlpExecutable, dlArgs);

		let hasData = false;

		dlProcess.on("error", (err) => {
			console.error("yt-dlp process error:", err);
			if (!res.headersSent) {
				res.status(500).json({ error: "Download failed", details: err.message });
			} else {
				res.end();
			}
		});

		let errorOutput = "";
		dlProcess.stderr.on("data", (chunk) => {
			const errText = chunk.toString();
			errorOutput += errText;
			if (errText.includes("ERROR")) {
				console.error("yt-dlp ERROR:", errText.trim());
			}
		});

		dlProcess.stdout.on("data", (chunk) => {
			hasData = true;
			res.write(chunk);
		});

		dlProcess.on("close", (code) => {
			if (code !== 0) {
				console.error(`yt-dlp exited with code ${code}`);
				console.error("Full error output:", errorOutput);
				if (!res.headersSent) {
					res.status(500).json({
						error: "Download failed",
						details: errorOutput || `Process exited with code ${code}`
					});
				} else {
					res.end();
				}
			} else {
				if (!hasData) {
					console.error("Download completed but no data received!");
					console.error("Error output:", errorOutput);
				} else {
					console.log(`Download completed successfully: ${filename}`);
				}
				res.end();
			}
		});

		res.on("close", () => {
			if (!dlProcess.killed) {
				dlProcess.kill();
			}
		});

		res.on("error", (err) => {
			console.error("Response stream error:", err);
			if (!dlProcess.killed) {
				dlProcess.kill();
			}
		});

	} catch (error) {
		console.error("Download handler error:", error);
		if (!res.headersSent) {
			res.status(500).json({ error: "Download failed", details: error.message });
		}
	}
});

// API 404 handler
app.use("/api", (_req, res) => {
	res.status(404).json({ error: "API endpoint not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
	console.error("Unhandled error:", err);
	if (!res.headersSent) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(PORT, () => {
	console.log(`✓ Server listening on http://localhost:${PORT}`);
	console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log(`✓ CORS: Enabled for all HTTPS origins`);
	console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});

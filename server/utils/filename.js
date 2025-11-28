export function sanitizeFilename(name) {
	if (!name) return "download";
	// Remove illegal characters and trim length
	return name
		.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 120);
}



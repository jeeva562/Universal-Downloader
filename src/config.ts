// Frontend configuration file
export const config = {
    // For local development
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',

    // Whether we're in production
    IS_PRODUCTION: import.meta.env.PROD,
};

// Get the API endpoint
export function getApiUrl(endpoint: string): string {
    if (config.IS_PRODUCTION) {
        // In production, use the backend URL from environment variable
        const backendUrl = import.meta.env.VITE_API_URL;
        if (!backendUrl) {
            throw new Error('VITE_API_URL environment variable is not set');
        }
        return `${backendUrl}${endpoint}`;
    }

    // In development, use proxy (relative URL)
    return endpoint;
}

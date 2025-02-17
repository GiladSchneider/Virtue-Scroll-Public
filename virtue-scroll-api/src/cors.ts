export const getCorsHeaders = (allowedOrigins: { origins: string[] }, request: Request): HeadersInit => {
	const origin = request.headers.get('Origin');

	return {
		'Access-Control-Allow-Origin': allowedOrigins.origins.includes(origin || '') ? origin! : allowedOrigins.origins[0],
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Allow-Credentials': 'true',
	};
};

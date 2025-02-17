/* eslint-disable @typescript-eslint/no-unused-vars */
import { requireAuth } from './auth';
import { Router } from './router';

interface Env {
	DB: D1Database;
	ENVIRONMENT: string;
	ALLOWED_ORIGIN: string;
}

interface JWTClaims {
	email: string;
	name?: string;
	sub: string;
	exp: number;
	aud: string[];
}

// Function to get CORS headers based on environment
const getCorsHeaders = (allowedOrigin: string, request: Request) => {
	// Get the Origin header from the request
	const origin = request.headers.get('Origin');

	// If the origin matches our allowed origin, return it
	// Otherwise return the default allowed origin
	const responseOrigin = origin && origin === allowedOrigin ? origin : allowedOrigin;

	return {
		'Access-Control-Allow-Origin': responseOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Allow-Credentials': 'true',
	};
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const corsHeaders = getCorsHeaders(env.ALLOWED_ORIGIN, request);
		const db = env.DB;

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		const router = new Router();

		// Get all virtues - no auth required
		router.get('/api/virtues', async () => {
			try {
				const { results } = await db
					.prepare(
						`
						SELECT 
							v.*,
							u.username,
							u.display_name,
							u.avatar_url
						FROM virtues v
						JOIN users u ON v.user_id = u.id
						ORDER BY v.created_at DESC
						LIMIT 50
						`,
					)
					.all();

				return new Response(JSON.stringify({ success: true, data: results }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error('Error fetching virtues:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to fetch virtues',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					},
				);
			}
		});

		// Get virtues by user - no auth required
		router.get('/api/users/:username/virtues', async (request) => {
			try {
				const username = new URL(request.url).pathname.split('/')[3];
				const { results } = await db
					.prepare(
						`
						SELECT 
							v.*,
							u.username,
							u.display_name,
							u.avatar_url
						FROM virtues v
						JOIN users u ON v.user_id = u.id
						WHERE u.username = ?
						ORDER BY v.created_at DESC
						LIMIT 50
						`,
					)
					.bind(username)
					.all();

				return new Response(JSON.stringify({ success: true, data: results }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to fetch user virtues',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					},
				);
			}
		});

		// Auth login endpoint
		router.get('/auth/login', async (request) => {
			return Response.redirect(`https://${request.headers.get('host')}/cdn-cgi/access/login`, 302);
		});

		// Auth logout endpoint
		router.post('/auth/logout', async (request) => {
			return Response.redirect(`https://${request.headers.get('host')}/cdn-cgi/access/logout`, 302);
		});

		// Create new virtue - requires auth
		router.post('/api/virtues', async (request) => {
			// Check authentication
			const authResult = await requireAuth(request);
			if (authResult instanceof Response) {
				return authResult;
			}

			try {
				const body = (await request.json()) as { content: string; userId: string };
				const { content, userId } = body;

				if (!content || !userId) {
					return new Response(
						JSON.stringify({
							success: false,
							error: 'Content and userId are required',
						}),
						{
							status: 400,
							headers: {
								'Content-Type': 'application/json',
								...corsHeaders,
							},
						},
					);
				}

				const { success } = await db
					.prepare(
						`
						INSERT INTO virtues (id, content, user_id)
						VALUES (?, ?, ?)
						`,
					)
					.bind(crypto.randomUUID(), content, userId)
					.run();

				if (!success) {
					throw new Error('Failed to insert virtue');
				}

				return new Response(JSON.stringify({ success: true }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to create virtue',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					},
				);
			}
		});

		// Get current user
		router.get('/api/auth/me', async (request) => {
			try {
				// Get JWT from Cloudflare Access
				const jwtToken = request.headers.get('Cf-Access-Jwt-Assertion');
				if (!jwtToken) {
					return new Response(
						JSON.stringify({
							success: false,
							error: 'Unauthorized',
						}),
						{
							status: 401,
							headers: {
								'Content-Type': 'application/json',
								...corsHeaders,
							},
						},
					);
				}

				// Decode JWT payload
				const [, payloadBase64] = jwtToken.split('.');
				const payload = JSON.parse(atob(payloadBase64)) as JWTClaims;

				// Verify JWT and get user info
				const userInfo = await db.prepare('SELECT * FROM users WHERE email = ?').bind(payload.email).first();

				if (!userInfo) {
					// Create new user if they don't exist
					const newUser = {
						id: crypto.randomUUID(),
						email: payload.email,
						username: payload.email.split('@')[0],
						display_name: payload.name || payload.email.split('@')[0],
						created_at: new Date().toISOString(),
					};

					await db
						.prepare(
							`
							INSERT INTO users (id, email, username, display_name, created_at)
							VALUES (?, ?, ?, ?, ?)
							`,
						)
						.bind(newUser.id, newUser.email, newUser.username, newUser.display_name, newUser.created_at)
						.run();

					return new Response(JSON.stringify({ success: true, data: newUser }), {
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					});
				}

				return new Response(JSON.stringify({ success: true, data: userInfo }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error('Auth error:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Authentication failed',
					}),
					{
						status: 401,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					},
				);
			}
		});

		// Update user profile
		router.put('/api/users/:username', async (request) => {
			try {
				const jwtToken = request.headers.get('Cf-Access-Jwt-Assertion');
				if (!jwtToken) throw new Error('Unauthorized');

				// Decode JWT payload
				const [, payloadBase64] = jwtToken.split('.');
				const payload = JSON.parse(atob(payloadBase64)) as JWTClaims;

				const body = (await request.json()) as { display_name?: string; avatar_url?: string };
				const { display_name, avatar_url } = body;

				const result = await db
					.prepare(
						`
						UPDATE users 
						SET display_name = ?, avatar_url = ?
						WHERE email = ?
						`,
					)
					.bind(display_name, avatar_url, payload.email)
					.run();

				return new Response(JSON.stringify({ success: true }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error('Profile update error:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to update profile',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					},
				);
			}
		});

		// Handle 404 for unmatched routes
		router.get('.*', async () => {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Not Found',
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				},
			);
		});

		try {
			return await router.handle(request);
		} catch (error) {
			console.error('Unhandled error:', error);
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Internal Server Error',
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				},
			);
		}
	},
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from './router';

interface Env {
	DB: D1Database;
	ENVIRONMENT: string;
	ALLOWED_ORIGINS: any;
}

// Function to get CORS headers based on environment
const getCorsHeaders = (allowedOrigin: any, request: Request) => {
	const allowedOrigins = allowedOrigin.origins;
	const origin = request.headers.get('Origin');

	const headers = {
		'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Allow-Credentials': 'true',
	};

	return headers;
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const corsHeaders = getCorsHeaders(env.ALLOWED_ORIGINS, request);
		const db = env.DB;

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		const router = new Router();

		// Get all virtues
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
            `
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
					}
				);
			}
		});

		// Get virtues by user
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
            `
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
				console.error('Error fetching user virtues:', error);
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
					}
				);
			}
		});

		// Create new virtue
		router.post('/api/virtues', async (request) => {
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
						}
					);
				}

				const { success } = await db
					.prepare(
						`
            INSERT INTO virtues (id, content, user_id)
            VALUES (?, ?, ?)
            `
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
				console.error('Error creating virtue:', error);
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
					}
				);
			}
		});

		// Add user
		router.post('/api/users', async (request) => {
			try {
				const body = (await request.json()) as { [key: string]: string };
				const { username, display_name, avatar_url, email, id } = body;

				if (!username || !display_name || !email) {
					return new Response(
						JSON.stringify({
							success: false,
							error: 'Username, display_name, and email are required',
						}),
						{
							status: 400,
							headers: {
								'Content-Type': 'application/json',
								...corsHeaders,
							},
						}
					);
				}

				const values = [id, username, display_name, avatar_url || 'todo', email, new Date().toISOString()];
				console.log('values 8ygbnji', values);
				const { success } = await db
					.prepare(
						`
            INSERT INTO users (id, username, display_name, avatar_url, email, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            `
					)
					.bind(
						id || 'tempid1',
						username || 'tempid2',
						display_name || 'temp3',
						avatar_url || 'temp4',
						email || 'temp5',
						new Date().toISOString()
					)
					.run();

				if (!success) {
					throw new Error('Failed to insert user');
				}

				return new Response(JSON.stringify({ success: true }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error('Error creating user:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to create user',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					}
				);
			}
		});

		// Get user by id
		router.get('/api/users/:id', async (request) => {
			try {
				const id = new URL(request.url).pathname.split('/')[3];
				const { results } = await db
					.prepare(
						`
            SELECT 
              *
            FROM users
            WHERE id = ?
            `
					)
					.bind(id)
					.all();

				return new Response(JSON.stringify({ success: true, data: results[0] }), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error('Error fetching user:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to fetch user',
					}),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					}
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
				}
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
				}
			);
		}
	},
};

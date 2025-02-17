/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from './router';

interface Env {
	DB: D1Database;
	ENVIRONMENT: string;
}

// Function to get CORS headers based on environment
const getCorsHeaders = (environment: string) => ({
	'Access-Control-Allow-Origin': environment === 'development' ? 'http://localhost:5173' : 'https://www.virtuescroll.com',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Max-Age': '86400',
});

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const corsHeaders = getCorsHeaders(env.ENVIRONMENT);

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
				const { results } = await env.DB.prepare(
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
				).all();

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
				const { results } = await env.DB.prepare(
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

				const { success } = await env.DB.prepare(
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

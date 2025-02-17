import { Router } from './router';

interface Env {
	DB: D1Database;
}

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const router = new Router();

		// CORS preflight
		router.options('.*', async () => {
			return new Response(null, { headers: corsHeaders });
		});

		// Get all virtues
		router.get('/api/virtues', async () => {
			try {
				// Debug: First check users table
				const usersCheck = await env.DB.prepare('SELECT * FROM users').all();
				console.log('Users in database:', usersCheck.results);

				// Debug: Then check virtues table
				const virtuesCheck = await env.DB.prepare('SELECT * FROM virtues').all();
				console.log('Virtues in database:', virtuesCheck.results);

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

				return new Response(
					JSON.stringify({
						success: true,
						data: results,
						debug: {
							users: usersCheck.results,
							virtues: virtuesCheck.results,
						},
					}),
					{
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					}
				);
			} catch (error) {
				console.error('Error fetching virtues:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to fetch virtues',
						details: error instanceof Error ? error.message : 'Unknown error',
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					}
				);
			}
		});

		// Get virtues by user
		router.get('/api/users/:username/virtues', async (request) => {
			try {
				const username = new URL(request.url).pathname.split('/')[3];

				// Debug: Check if user exists
				const userCheck = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).all();
				console.log('User found:', userCheck.results);

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

				return new Response(
					JSON.stringify({
						success: true,
						data: results,
						debug: {
							user: userCheck.results,
						},
					}),
					{
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					}
				);
			} catch (error) {
				console.error('Error fetching user virtues:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to fetch user virtues',
						details: error instanceof Error ? error.message : 'Unknown error',
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
							headers: { 'Content-Type': 'application/json', ...corsHeaders },
						}
					);
				}

				// Debug: Check if user exists before inserting
				const userCheck = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).all();
				console.log('User found for new virtue:', userCheck.results);

				const virtueId = crypto.randomUUID();
				const { success } = await env.DB.prepare(
					`
					INSERT INTO virtues (id, content, user_id)
					VALUES (?, ?, ?)
				`
				)
					.bind(virtueId, content, userId)
					.run();

				if (!success) {
					throw new Error('Failed to insert virtue');
				}

				// Debug: Fetch the inserted virtue
				const insertedVirtue = await env.DB.prepare('SELECT * FROM virtues WHERE id = ?').bind(virtueId).all();
				console.log('Inserted virtue:', insertedVirtue.results);

				return new Response(
					JSON.stringify({
						success: true,
						debug: {
							user: userCheck.results,
							insertedVirtue: insertedVirtue.results,
						},
					}),
					{
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					}
				);
			} catch (error) {
				console.error('Error creating virtue:', error);
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Failed to create virtue',
						details: error instanceof Error ? error.message : 'Unknown error',
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				}
			);
		});

		return router.handle(request).catch((error) => {
			console.error('Unhandled error:', error);
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Internal Server Error',
					details: error instanceof Error ? error.message : 'Unknown error',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				}
			);
		});
	},
};

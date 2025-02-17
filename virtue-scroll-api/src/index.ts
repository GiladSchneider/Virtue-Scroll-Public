import { Router } from './router';
import { Env } from './types';
import { getCorsHeaders } from './cors';
import { VirtueService } from './services/virtueService';
import { UserService } from './services/userService';
import { VirtueController } from './controllers/virtueController';
import { UserController } from './controllers/userController';
import { handleProtectedRoute } from './auth';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const corsHeaders = getCorsHeaders(env.ALLOWED_ORIGINS, request);

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Initialize services
		const virtueService = new VirtueService(env.DB);
		const userService = new UserService(env.DB);

		// Initialize controllers
		const virtueController = new VirtueController(virtueService, corsHeaders);
		const userController = new UserController(userService, corsHeaders);

		const router = new Router();

		// Virtue routes
		router.get('/api/virtues', () => virtueController.getVirtues());
		router.get('/api/users/:username/virtues', (request) => {
			const username = new URL(request.url).pathname.split('/')[3];
			return virtueController.getUserVirtues(username);
		});
		router.get('/api/virtues/:id', (request) => {
			const id = new URL(request.url).pathname.split('/')[3];
			return virtueController.getVirtue(id);
		});
		router.post('/api/virtues', (request) => handleProtectedRoute(request, () => virtueController.createVirtue(request)));

		// User routes
		router.post('/api/users', (request) => handleProtectedRoute(request, () => userController.createUser(request)));
		router.get('/api/users/:id', (request) => {
			const id = new URL(request.url).pathname.split('/')[3];
			return userController.getUser(id);
		});
		// 404 handler
		router.all('.*', async () => {
			return new Response(JSON.stringify({ success: false, error: 'Not Found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		});

		try {
			return await router.handle(request);
		} catch (error) {
			console.error('Unhandled error:', error);
			return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		}
	},
};

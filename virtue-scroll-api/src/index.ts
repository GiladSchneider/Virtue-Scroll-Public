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
  
	  // Public endpoints (no auth required)
	  router.get('/api/virtues', async () => {
		try {
		  const { results } = await db
			.prepare(`
			  SELECT v.*, u.username, u.display_name, u.avatar_url
			  FROM virtues v
			  JOIN users u ON v.user_id = u.id
			  ORDER BY v.created_at DESC
			  LIMIT 50
			`)
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
  
	  // Protected endpoints (auth required)
	  router.post('/api/virtues', async (request) => {
		// Check authentication
		const authResult = await requireAuth(request);
		if ('isAuthenticated' in authResult && !authResult.isAuthenticated) {
		  return new Response(
			JSON.stringify({
			  success: false,
			  error: 'Authentication required',
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
			  `INSERT INTO virtues (id, content, user_id)
			   VALUES (?, ?, ?)`,
			)
			.bind(crypto.randomUUID(), content, userId)
			.run();
  
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
  
	  // Current user endpoint - returns user if authenticated, null if not
	  router.get('/api/auth/me', async (request) => {
		const jwtToken = request.headers.get('Cf-Access-Jwt-Assertion');
		
		if (!jwtToken) {
		  return new Response(
			JSON.stringify({ success: true, data: null }),
			{
			  headers: {
				'Content-Type': 'application/json',
				...corsHeaders,
			  },
			},
		  );
		}
  
		try {
		  const [, payloadBase64] = jwtToken.split('.');
		  const payload = JSON.parse(atob(payloadBase64)) as JWTClaims;
  
		  const userInfo = await db
			.prepare('SELECT * FROM users WHERE email = ?')
			.bind(payload.email)
			.first();
  
		  if (!userInfo) {
			const newUser = {
			  id: crypto.randomUUID(),
			  email: payload.email,
			  username: payload.email.split('@')[0],
			  display_name: payload.name || payload.email.split('@')[0],
			  created_at: new Date().toISOString(),
			};
  
			await db
			  .prepare(
				`INSERT INTO users (id, email, username, display_name, created_at)
				 VALUES (?, ?, ?, ?, ?)`,
			  )
			  .bind(
				newUser.id,
				newUser.email,
				newUser.username,
				newUser.display_name,
				newUser.created_at,
			  )
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
  
	  // Handle 404 for unmatched routes
	  router.all('.*', async () => {
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
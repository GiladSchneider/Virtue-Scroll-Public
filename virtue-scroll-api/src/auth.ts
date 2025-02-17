/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthError {
	error: string;
	status: number;
}

export async function validateAuth(request: Request): Promise<AuthError | null> {
	const authHeader = request.headers.get('Authorization');
	console.log('Auth header:', authHeader);

	if (!authHeader) {
		console.log('No auth header found');
		return {
			error: 'No authorization header',
			status: 401,
		};
	}

	const token = authHeader.split(' ')[1];
	console.log('Token:', token?.substring(0, 20) + '...');

	if (!token) {
		console.log('No token found in auth header');
		return {
			error: 'Invalid authorization header format',
			status: 401,
		};
	}

	try {
		const domain = 'dev-6q6gfnsktyxcf0bj.us.auth0.com';
		const audience = 'https://dev-6q6gfnsktyxcf0bj.us.auth0.com/api/v2/';

		// Fetch Auth0 public keys
		const jwksUrl = `https://${domain}/.well-known/jwks.json`;
		console.log('Fetching JWKS from:', jwksUrl);

		const jwksResponse = await fetch(jwksUrl);
		const jwks: any = await jwksResponse.json();
		console.log('JWKS keys count:', jwks.keys?.length);

		// Split the token into parts
		const [headerB64, payloadB64, signatureB64] = token.split('.');
		console.log('Token parts found:', {
			hasHeader: !!headerB64,
			hasPayload: !!payloadB64,
			hasSignature: !!signatureB64,
		});

		// Decode the header
		const header = JSON.parse(atob(headerB64));
		console.log('Token header:', header);

		// Find the signing key
		const key = jwks.keys.find((k: any) => k.kid === header.kid);
		console.log('Matching key found:', !!key, 'kid:', header.kid);

		if (!key) {
			console.log('No matching key found in JWKS');
			return {
				error: 'Invalid token signing key',
				status: 401,
			};
		}

		// Convert the JWKS key to a CryptoKey
		console.log('Importing public key...');
		const publicKey = await crypto.subtle.importKey(
			'jwk',
			key,
			{
				name: 'RSASSA-PKCS1-v1_5',
				hash: { name: 'SHA-256' },
			},
			false,
			['verify']
		);
		console.log('Public key imported successfully');

		// Prepare the signature verification
		const signedContent = new TextEncoder().encode(headerB64 + '.' + payloadB64);
		const signature = new Uint8Array(
			atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'))
				.split('')
				.map((c) => c.charCodeAt(0))
		);
		console.log('Prepared for verification:', {
			signedContentLength: signedContent.length,
			signatureLength: signature.length,
		});

		// Verify the token
		console.log('Verifying signature...');
		const isValid = await crypto.subtle.verify(
			{
				name: 'RSASSA-PKCS1-v1_5',
				hash: { name: 'SHA-256' },
			},
			publicKey,
			signature,
			signedContent
		);
		console.log('Signature verification result:', isValid);

		if (!isValid) {
			console.log('Signature verification failed');
			return {
				error: 'Invalid token signature',
				status: 401,
			};
		}

		// Verify token claims
		const payload = JSON.parse(atob(payloadB64));
		console.log('Token payload:', {
			aud: payload.aud,
			iss: payload.iss,
			exp: payload.exp,
			currentTime: Math.floor(Date.now() / 1000),
		});

		const now = Math.floor(Date.now() / 1000);

		if (payload.exp && payload.exp < now) {
			console.log('Token expired');
			return {
				error: 'Token expired',
				status: 401,
			};
		}

		// Check if audience is valid (handling both string and array cases)
		const tokenAudience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
		if (!tokenAudience.includes(audience)) {
			console.log('Invalid audience', {
				expected: audience,
				received: payload.aud,
			});
			return {
				error: 'Invalid token audience',
				status: 401,
			};
		}

		if (payload.iss !== `https://${domain}/`) {
			console.log('Invalid issuer', {
				expected: `https://${domain}/`,
				received: payload.iss,
			});
			return {
				error: 'Invalid token issuer',
				status: 401,
			};
		}

		console.log('Token validation successful');
		return null;
	} catch (error) {
		console.error('Token validation error:', error);
		return {
			error: 'Invalid token',
			status: 401,
		};
	}
}

export async function handleProtectedRoute(request: Request, handler: () => Promise<Response>): Promise<Response> {
	const authError = await validateAuth(request);

	if (authError) {
		return new Response(JSON.stringify({ success: false, error: authError.error }), {
			status: authError.status,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	return handler();
}

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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
type RouteHandler = (request: Request, params?: Record<string, string>) => Promise<Response>;

interface Route {
	method: HttpMethod;
	pattern: RegExp;
	handler: RouteHandler;
}

export class Router {
	private routes: Route[] = [];

	add(method: HttpMethod, pattern: string, handler: RouteHandler) {
		const regexPattern = new RegExp(`^${pattern.replace(/\/:(\w+)/g, '/([^/]+)')}$`);
		this.routes.push({ method, pattern: regexPattern, handler });
	}

	get(pattern: string, handler: RouteHandler) {
		this.add('GET', pattern, handler);
	}

	post(pattern: string, handler: RouteHandler) {
		this.add('POST', pattern, handler);
	}

	put(pattern: string, handler: RouteHandler) {
		this.add('PUT', pattern, handler);
	}

	options(pattern: string, handler: RouteHandler) {
		this.add('OPTIONS', pattern, handler);
	}

	async handle(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method as HttpMethod;

		for (const route of this.routes) {
			if (method === route.method) {
				const match = path.match(route.pattern);
				if (match) {
					return route.handler(request);
				}
			}
		}

		return new Response('Not Found', { status: 404 });
	}
}

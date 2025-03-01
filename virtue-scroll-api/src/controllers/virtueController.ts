import { VirtueService } from '../services/virtueService';
import { ApiResponse } from '../types';

export class VirtueController {
	constructor(private virtueService: VirtueService, private corsHeaders: HeadersInit) {}

	async getVirtue(id: string): Promise<Response> {
		try {
			const virtue = await this.virtueService.getVirtue(id);
			return this.jsonResponse({ success: true, data: virtue });
		} catch (error) {
			console.error('Error fetching virtue:', error);
			return this.errorResponse('Failed to fetch virtue');
		}
	}

	async getVirtues(): Promise<Response> {
		try {
			const virtues = await this.virtueService.getAllVirtues();
			return this.jsonResponse({ success: true, data: virtues });
		} catch (error) {
			console.error('Error fetching virtues:', error);
			return this.errorResponse('Failed to fetch virtues');
		}
	}

	async getUserVirtues(username: string): Promise<Response> {
		try {
			const virtues = await this.virtueService.getUserVirtues(username);
			return this.jsonResponse({ success: true, data: virtues });
		} catch (error) {
			console.error('Error fetching user virtues:', error);
			return this.errorResponse('Failed to fetch user virtues');
		}
	}

	async createVirtue(request: Request): Promise<Response> {
		try {
			const body = (await request.json()) as { content: string; userId: string };

			const trimmedContent = body.content?.trim();
			if (!trimmedContent || !body.userId) {
				return this.errorResponse('Content and userId are required', 400);
			}

			if (trimmedContent.length > 300) {
				return this.errorResponse('Content must not exceed 300 characters', 400);
			}

			await this.virtueService.createVirtue(body.content.trim(), body.userId);
			return this.jsonResponse({ success: true });
		} catch (error) {
			console.error('Error creating virtue:', error);
			return this.errorResponse('Failed to create virtue');
		}
	}

	private jsonResponse(data: ApiResponse<unknown>, status = 200): Response {
		return new Response(JSON.stringify(data), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...this.corsHeaders,
			},
		});
	}

	private errorResponse(error: string, status = 500): Response {
		return this.jsonResponse({ success: false, error }, status);
	}
}

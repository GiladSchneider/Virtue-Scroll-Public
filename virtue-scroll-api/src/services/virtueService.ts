import { VirtueWithUser } from '../types';

export class VirtueService {
	constructor(private db: D1Database) {}

	async getVirtue(id: string): Promise<VirtueWithUser> {
		const result = await this.db
			.prepare(
				`
				SELECT 
					v.*,
					u.username,
					u.display_name,
					u.avatar_url
				FROM virtues v
				JOIN users u ON v.user_id = u.id
				WHERE v.id = ?
				`
			)
			.bind(id)
			.first();

		return result as unknown as VirtueWithUser;
	}

	async getAllVirtues(): Promise<VirtueWithUser[]> {
		const { results } = await this.db
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

		return results as unknown as VirtueWithUser[];
	}

	async getUserVirtues(username: string): Promise<VirtueWithUser[]> {
		const { results } = await this.db
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

		return results as unknown as VirtueWithUser[];
	}

	async createVirtue(content: string, userId: string): Promise<void> {
		const { success } = await this.db
			.prepare(
				`
				INSERT INTO virtues (id, content, user_id, created_at)
				VALUES (?, ?, ?, ?)
				`
			)
			.bind(crypto.randomUUID(), content, userId, new Date().toISOString())
			.run();

		if (!success) {
			throw new Error('Failed to create virtue');
		}
	}
}

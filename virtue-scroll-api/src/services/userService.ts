import { User } from '../types';

export class UserService {
	constructor(private db: D1Database) {}

	async createUser(user: Omit<User, 'created_at'>): Promise<void> {
		const { success } = await this.db
			.prepare(
				`
				INSERT INTO users (id, username, display_name, avatar_url, email, created_at)
				VALUES (?, ?, ?, ?, ?, ?)
				`
			)
			.bind(user.id, user.username, user.display_name, user.avatar_url || null, user.email, new Date().toISOString())
			.run();

		if (!success) {
			throw new Error('Failed to create user');
		}
	}

	async getUserById(id: string): Promise<User | null> {
		const result = await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();

		return result as User | null;
	}
}

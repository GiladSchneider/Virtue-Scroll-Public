export interface User {
	id: string;
	username: string;
	display_name: string;
	avatar_url?: string;
	email: string;
	created_at: string;
}

export interface Virtue {
	id: string;
	content: string;
	user_id: string;
	created_at: string;
}

export interface VirtueWithUser extends Virtue {
	username: string;
	display_name: string;
	avatar_url?: string;
}

export interface Env {
	DB: D1Database;
	ENVIRONMENT: string;
	ALLOWED_ORIGINS: {
		origins: string[];
	};
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

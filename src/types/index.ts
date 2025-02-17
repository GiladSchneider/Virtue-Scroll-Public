export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  email: string;
}

export interface Virtue {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  username: string;
  avatar_url: string;
  display_name: string;
}

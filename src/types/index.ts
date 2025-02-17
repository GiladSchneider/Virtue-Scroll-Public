export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Virtue {
  id: string;
  content: string;
  userId: string;
  user?: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  likeCount: number;
  isLiked?: boolean;
}
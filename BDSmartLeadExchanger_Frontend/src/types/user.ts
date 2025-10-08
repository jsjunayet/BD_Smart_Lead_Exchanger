import { Comment, PostStatus } from ".";

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  status?: string;
  createdAt: string;
  isPremium: boolean;
}

type UserRole = "user" | "admin" | "superAdmin";

export interface Post {
  id: string;
  title: string;
  user: IUser; // or a more complex User object if available
  category: Category;
  imageUrl?: string;
  image?: string;
  description?: string;
  content?: string;
  excerpt?: string;
  createdAt: string;
  date?: string;
  comments?: Comment[];
  isPremium: boolean;
  status: PostStatus;
}
export interface Category {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

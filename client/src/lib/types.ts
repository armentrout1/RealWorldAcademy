export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  categoryId: number;
  duration: string;
  rating: string;
  isFeatured: boolean;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Testimonial {
  id: number;
  content: string;
  userName: string;
  userTitle: string;
  userAvatar: string;
  rating: number;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
}

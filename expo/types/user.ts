export type UserRole = 'kid' | 'parent' | 'tutor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  points: number;
  level: number;
  streak: number;
  completedModules: string[];
  badges: string[];
  hasPremiumAccess: boolean;
  purchaseDate?: string;
}

export interface Kid extends User {
  role: 'kid';
  parentId?: string;
  tutorId?: string;
}

export interface Parent extends User {
  role: 'parent';
  children: string[];
}

export interface Tutor extends User {
  role: 'tutor';
  students: string[];
}
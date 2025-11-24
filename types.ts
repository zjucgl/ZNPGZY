export interface Task {
  id: number;
  taskNo: string;
  taskName: string;
  requirements: string;
  creator: string;
  createdAt: string;
}

export interface User {
  name: string;
  avatar: string;
}

export interface Submission {
  id: number;
  fileName: string;
  studentId: string;
  studentName: string;
  score: string;
  comments: string;
  content: string; // The actual text content to be graded
  status: 'pending' | 'graded' | 'error';
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardView {
  LIST = 'LIST',
  DETAIL = 'DETAIL'
}
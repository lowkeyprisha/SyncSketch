export type Point = { x: number; y: number };

export interface BaseShape {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface Rectangle extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface Circle extends BaseShape {
  type: 'circle';
  radius: number;
}

export type Shape = Rectangle | Circle;

export interface User {
  id: string;
  color: string;
  cursor?: Point;
}

// Strictly typed WebSocket payloads
export interface ServerToClientEvents {
  'init-state': (shapes: Shape[], users: Record<string, User>) => void;
  'user-connected': (userId: string, user: User) => void;
  'user-disconnected': (userId: string) => void;
  'shape-added': (shape: Shape) => void;
  'shape-updated': (shape: Shape) => void;
  'cursor-updated': (userId: string, position: Point) => void;
  'canvas-cleared': () => void;
}

export interface ClientToServerEvents {
  'add-shape': (shape: Shape) => void;
  'update-shape': (shape: Shape) => void;
  'update-cursor': (position: Point) => void;
  'clear-canvas': () => void;
}
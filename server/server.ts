import Fastify from 'fastify';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, Shape, User } from 'shared/types';

const fastify = Fastify({ logger: true });

// In-memory state storage
const shapes: Map<string, Shape> = new Map();
const users: Map<string, User> = new Map();

const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF0'];

const io = new Server<ClientToServerEvents, ServerToClientEvents>(fastify.server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const userId = socket.id;
  const userColor = colors[Math.floor(Math.random() * colors.length)];
  
  const newUser: User = { id: userId, color: userColor };
  users.set(userId, newUser);

  // Send current canvas state to the newly connected user
  socket.emit('init-state', Array.from(shapes.values()), Object.fromEntries(users));

  // Broadcast new user to everyone else
  socket.broadcast.emit('user-connected', userId, newUser);

  // Handle drawing a new shape
  socket.on('add-shape', (shape) => {
    shapes.set(shape.id, shape);
    socket.broadcast.emit('shape-added', shape);
  });

  // Handle dragging/modifying a shape
  socket.on('update-shape', (shape) => {
    shapes.set(shape.id, shape);
    socket.broadcast.emit('shape-updated', shape);
  });

  // Handle cursor tracking
  socket.on('update-cursor', (position) => {
    const user = users.get(userId);
    if (user) {
      user.cursor = position;
      socket.broadcast.emit('cursor-updated', userId, position);
    }
  });

  // Handle global clear
  socket.on('clear-canvas', () => {
    shapes.clear();
    io.emit('canvas-cleared');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    users.delete(userId);
    io.emit('user-disconnected', userId);
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 WebSocket Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
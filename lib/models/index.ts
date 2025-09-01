// Import all models to ensure they are registered together
// Order matters - User must be imported first since Post and Comment reference it
import User from './User';
import Post from './Post';
import Comment from './Comment';

// Ensure all models are registered with Mongoose
const models = { User, Post, Comment };

export { User, Post, Comment };
export default models;

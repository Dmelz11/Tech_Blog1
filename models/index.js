const User = require('./Users');
const Post = require('./Post');
const Comment = require('./Comment');

// relationships between users, post, and comments
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Post.hasMany(Comment, {
  foreignKey: '_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
  foreignKey: 'techdata_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Post, Comment };
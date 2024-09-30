const jsonHandler = require('../utils/jsonHandler');
const Comment = require('../models/Comment');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const filePath = path.join(__dirname, '../data/comments.json');

class CommentService {
  async getAllComments() {
    return await jsonHandler.readJSON(filePath);
  }

  async getCommentById(id) {
    const comments = await jsonHandler.readJSON(filePath);
    return comments.find(comment => comment.id === id);
  }

  async createComment(commentData) {
    const comments = await jsonHandler.readJSON(filePath);
    const newComment = { id: uuidv4(), ...commentData};
    comments.push(newComment);
    await jsonHandler.writeJSON(filePath, comments);
    return newComment;
  }

  async updateComment(id, updatedData) {
    const comments = await jsonHandler.readJSON(filePath);
    const index = comments.findIndex(comment => comment.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    comments[index] = { ...comments[index], ...updatedData };
    await jsonHandler.writeJSON(filePath, comments);
    return comments[index];
  }

  async deleteComment(id) {
    const comments = await jsonHandler.readJSON(filePath);
    const updatedComments = comments.filter(comment => comment.id !== id);
    await jsonHandler.writeJSON(filePath, updatedComments);
    return { message: 'Comment deleted successfully' };
  }
}

module.exports = new CommentService();
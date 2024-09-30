const commentService = require('../Services/CommentService');

class CommentController {
  async getAllComments(req, res) {
    try {
      const comments = await commentService.getAllComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCommentById(req, res) {
    try {
      const comment = await commentService.getCommentById(req.params.id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createComment(req, res) {
    try {
      const newComment = await commentService.createComment(req.body);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateComment(req, res) {
    try {
      const updatedComment = await commentService.updateComment(req.params.id, req.body);
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      await commentService.deleteComment(req.params.id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CommentController();
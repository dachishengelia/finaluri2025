const express = require('express')
const router = express.Router()

const {
  getMainPage,
  createPost,
  editPost,
  deletePost,
  getSinglePost
} = require('../controllers/postController')

const { authenticate } = require('../authorization/login')
const { upload } = require('../config/cloudinary.config')

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts for authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', authenticate, getMainPage)

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post with optional image
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       302:
 *         description: Redirect to posts page after creation
 */
router.post('/', authenticate, upload.single('image'), createPost)

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a single post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single post details
 */
router.get('/:postId', authenticate, getSinglePost)

/**
 * @swagger
 * /api/posts/{postId}/edit:
 *   post:
 *     summary: Edit an existing post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               newContent:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to posts page after edit
 */
router.post('/:postId/edit', authenticate, editPost)

/**
 * @swagger
 * /api/posts/{postId}/delete:
 *   post:
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect after deletion
 */
router.post('/:postId/delete', authenticate, deletePost)

module.exports = router
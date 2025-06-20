const express = require('express')
const router = express.Router()

const { getSignup, postSignup } = require('../authorization/signup')
const { getLogin, postLogin } = require('../authorization/login')

/**
 * @swagger
 * /api/users/signup:
 *   get:
 *     summary: Get signup form (if frontend existed)
 *     responses:
 *       200:
 *         description: Signup form loaded
 */
router.get('/signup', getSignup)

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 */
router.post('/signup', postSignup)

/**
 * @swagger
 * /api/users/login:
 *   get:
 *     summary: Get login form (if frontend existed)
 *     responses:
 *       200:
 *         description: Login form loaded
 */
router.get('/login', getLogin)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
router.post('/login', postLogin)

module.exports = router
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getLogin = (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px;">
            <h1>Login</h1>
            <form method="POST" action="/api/users/login">
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    `)
}

const postLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).select('+password')
        if (!user) return res.status(400).send('Invalid credentials')

        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(400).send('Invalid credentials')

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 
        })


        res.redirect('/api/posts')
    } catch (err) {
        res.status(500).send('Server error')
    }
}

const authenticate = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(400).send('Invalid token.')
    }
}

const protectedRoute = (req, res) => {
    res.send(`<h1>Welcome, User ${req.user.id}!</h1><p>This is a protected page.</p>`)
}

module.exports = {
    getLogin,
    postLogin,
    authenticate,
    protectedRoute
}

const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getSignup = (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px;">
            <h1>Sign Up</h1>
            <form method="POST" action="/api/users/signup">
                <div>
                    <label>Full Name:</label>
                    <input type="text" name="fullName" required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    `)
}

const postSignup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).send('User already exists')

        const user = new User({ fullName, email, password })
        await user.save()

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
        res.status(500).send('Something went wrong')
    }
}

module.exports = {
    getSignup,
    postSignup
}

const Post = require('../models/Post')
const { deleteFromCloudinary } = require('../config/cloudinary.config')


const getMainPage = async (req, res) => {
    const posts = await Post.find().populate('author', 'fullName')
    const postList = posts.map(post => {
        const isAuthor = post.author._id.toString() === req.user.id
        return `
            <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px;">
                <a href="/api/posts/${post._id}" style="text-decoration: none;">
                    <strong>${post.author.fullName}</strong>: ${post.content}
                </a><br/>
                ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width: 200px; margin-top: 10px;" />` : ''}
                ${isAuthor ? `
                    <form method="POST" action="/api/posts/${post._id}/edit">
                        <input name="newContent" placeholder="Edit content" required />
                        <button type="submit">Edit</button>
                    </form>
                    <form method="POST" action="/api/posts/${post._id}/delete">
                        <button type="submit">Delete</button>
                    </form>
                ` : ''}
            </div>
        `
    }).join('')

    res.send(`
        <div style="font-family: Arial; padding: 20px;">
            <h1>Main Page</h1>
            <form method="POST" action="/api/posts" enctype="multipart/form-data">
                <textarea name="content" rows="3" cols="50" required></textarea><br/>
                <input type="file" name="image" accept="image/*" /><br/><br/>
                <button type="submit">Create Post</button>
            </form>
            <h2>All Posts</h2>
            ${postList}
        </div>
    `)
}


const createPost = async (req, res) => {
    try {
        const { content } = req.body
        const userId = req.user.id

        let imageUrl = null
        let imagePublicId = null

        if (req.file && req.file.path) {
            imageUrl = req.file.path
            imagePublicId = req.file.filename
        }

        const newPost = new Post({
            content,
            author: userId,
            imageUrl,
            imagePublicId
        })

        await newPost.save()
        res.redirect('/api/posts')
    } catch (error) {
        console.error('Error creating post:', error)
        res.status(500).send(`<pre>${error.message}</pre>`)
    }
}


const editPost = async (req, res) => {
    const { postId } = req.params
    const { newContent } = req.body
    const post = await Post.findById(postId)
    if (!post || post.author.toString() !== req.user.id) {
        return res.status(403).send('Not allowed')
    }
    post.content = newContent
    await post.save()
    res.redirect('/api/posts')
}


const deletePost = async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if (!post || post.author.toString() !== req.user.id) {
        return res.status(403).send('Not allowed')
    }

    if (post.imagePublicId) {
        await deleteFromCloudinary(post.imagePublicId)
    }

    await post.deleteOne()
    res.redirect('/api/posts')
}


const getSinglePost = async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId).populate('author', 'fullName')
    if (!post) return res.status(404).send('Post not found')

    res.send(`
        <div style="font-family: Arial; padding: 20px;">
            <h1>${post.author.fullName}'s Post</h1>
            <p>${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width: 300px;" />` : ''}
            <br/><br/>
            <a href="/api/posts">← Back to Posts</a>
        </div>
    `)
}

module.exports = {
    getMainPage,
    createPost,
    editPost,
    deletePost,
    getSinglePost
}

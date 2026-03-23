import { Router } from 'express'
import { getDB } from '../db/index.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', async (req, res) => {
  const db = getDB()
  const posts = await db.collection('posts').find().toArray()
  res.json(posts)
})

router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body

  const db = getDB()

  const result = await db.collection('posts').insertOne({
    title,
    content,
    userId: req.user.userId,
    createdAt: new Date(),
  })

  res
    .status(201)
    .json({ message: 'Post created successfully', postId: result.insertedId })
})

export default router

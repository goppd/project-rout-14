import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getDB } from '../db/index.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  const db = getDB()

  const existingUser = await db.collection('users').findOne({ username })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await db.collection('users').insertOne({
    username,
    password: hashedPassword,
  })

  res.status(201).json({ message: 'User registered successfully', userId: result.insertedId })  
})
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const db = getDB()

  const user = await db.collection('users').findOne({ username })
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid login or password' })
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' })
  
  res.json({ token })
})

export default router

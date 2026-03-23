import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import authRouter from './routes/auth.js'
// import postRouter from './routes/posts.js'

dotenv.config()

const app = express()

app.use(express.json())

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3333

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${HOST}:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server', error)
  })

app.use('/auth', authRouter)
app.use('/post', postRouter)

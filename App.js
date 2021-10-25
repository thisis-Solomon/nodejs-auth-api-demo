const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// import Routes
const authRoute = require('./routers/auth')
const postRoute = require('./routers/posts')
// initialization
const app = express()

// middlewares
app.use(express.json())

dotenv.config()
const PORT = process.env.PORT || 4001

// connect to database
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('connected to db')
})

app.use('/api/user/', authRoute)
app.use('/api/post', postRoute)

app.listen(PORT, () => console.log('server up running: ', PORT))

const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { RegisterValidation, LoginValidation } = require('../validation')

const router = require('express').Router()

router.post('/register', async (req, res) => {
  const { error } = RegisterValidation(req.body)

  if (error) return res.status(400).send(error.details[0].message)

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('Email already exists')

  // crypting the passwordq
  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    const savedUser = user.save()
    res.status(200).send({ user: user._id })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/login', async (req, res) => {
  // Login Validation
  const { error } = LoginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // User exists ?
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Wrong email')

  // Compare PassWords
  const validPassword = await bcryptjs.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('wrong password')

  // create jsonWebToken
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN)

  res.header('auth-token', token).send(token)
})
module.exports = router

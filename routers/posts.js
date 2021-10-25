const router = require('express').Router()
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
  res.json({
    post: {
      title: 'post one',
      description: 'hope this works nicely and beautifully '
    }
  })
})

module.exports = router

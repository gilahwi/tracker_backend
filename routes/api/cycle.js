const router = require('express').Router()
const mongoose = require('mongoose')
const Cycle = mongoose.model('Cycle')

router.post('/', (req, res) => {
  const { body } = req
  const new_cycle = new Cycle(body)
  new_cycle
    .save()
    .then(() => {
      res.status(201)
      res.json({
        data: {
          ok: 1,
          message: 'New cycle added to database',
          body
        }
      })
    })
    .catch(e => {
      console.log(e)
      res.status(400)
      res.json({
        data: {
          ok: 0,
          message: 'MongoDB connection failed',
          body
        }
      })
    })
})

router.get('/', (req, res) => {
  Cycle.find((err, docs) => {
    if (err) {
      res.status(400)
      res.json({
        data: {
          ok: 0,
          message: 'We could not get at your cycles'
        }
      })
    } else if (docs != null) {
      res.status(201)
      res.json({
        data: {
          ok: 1,
          message: 'These are the cycles that we found',
          docs
        }
      })
    } else {
      res.status(404)
      res.json({
        data: {
          ok: 0,
          message: 'We found no cycles',
          docs
        }
      })
    }
  })
})

router.put('/', (req, res) => {
  const { body } = req

  Cycle.findOne({ hasEnded: false }, (err, obj) => {
    if (err) {
      res.status(400)
      res.json({
        data: {
          ok: 0,
          message: 'We could not get at your cycles at all'
        }
      })
    } else {
      if (obj) {
        obj.hasEnded = true
        obj.cycleLength = body.difference
        obj.save()
        res.status(201)
        res.json({
          data: {
            ok: 1,
            message: 'We ended your previous cycle',
            obj
          }
        })
      } else {
        res.status(400)
        res.json({
          data: {
            ok: 0,
            message: 'We could not find an unfinished cycle'
          }
        })
      }
    }
  })
})

module.exports = router

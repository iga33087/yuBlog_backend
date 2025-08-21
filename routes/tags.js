const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')

router.get('/',async (req, res) => {
  try {
    let r=await mongo.getData('tagModel',req.query)
    res.send(r)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.post('/',async (req, res) => {
  try {
    await mongo.addData('tagModel',req.body)
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.put('/',async (req, res) => {
  try {
    await mongo.editDataByID('tagModel',req.body)
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.delete('/',async (req, res) => {
  try {
    await mongo.delDataByID('tagModel',{_id:req.query._id})
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
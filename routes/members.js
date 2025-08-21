const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')
const SHA256 = require("crypto-js/sha256")

router.get('/',async (req, res) => {
  try {
    let r=await mongo.getData('memberModel',req.query,'name account isAdmin intro link date')
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
    if(req.body.password) req.body.password=String(SHA256(req.body.password))
    await mongo.addData('memberModel',req.body)
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
    if(req.body.password) req.body.password=String(SHA256(req.body.password))
    await mongo.editDataByID('memberModel',req.body)
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
    await mongo.delDataByID('memberModel',{_id:req.query._id})
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
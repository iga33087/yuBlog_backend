const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')
const SHA256 = require("crypto-js/sha256")

router.post('/login',async function (req, res) {
  try {
    if(!req.body.account||!req.body.password) throw 'No account or password' 
    let r=null
    if(req.body.password) req.body.password=String(SHA256(req.body.password))
    req.body.isAdmin=true
    let member=await mongo.getOneData('memberModel',req.body,'name account date')
    if(member) {
      r=global.getToken({_id:member._id,name:member.name,account:member.account})
    }
    else throw 'Wrong account or password' 
    res.send(r)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})
router.post('/verify',async function (req, res) {
  try {
    let r=global.verifyToken(req.headers.authorization)
    res.send(r)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router

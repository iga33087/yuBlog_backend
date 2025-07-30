const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')

router.get('/',async (req, res) => {
  try {
    let r=await mongo.getData('articleModel',req.query)
    res.send(r)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.get('/classtypeBox',async (req, res) => {
  try {
    let data=[]
    let classtypes=await mongo.getData('classtypeModel',{})
    for(let item of classtypes.data) {
      let obj= {
        title:item.title,
        children:(await mongo.getData('articleModel',{classtype_id:item._id},'member_id classtype_id title date')).data
      }
      data.push(obj)
    }
    res.send(data)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.post('/',async (req, res) => {
  try {
    let userData=global.verifyToken(req.headers.authorization)
    req.body.member_id=userData.data._id
    await mongo.addData('articleModel',req.body)
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
    await mongo.editDataByID('articleModel',req.body)
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
    await mongo.delDataByID('articleModel',{_id:req.query._id})
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
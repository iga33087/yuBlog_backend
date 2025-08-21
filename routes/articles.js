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

router.get('/outline',async (req, res) => {
  try {
    let obj= {
      title:req.query.keyword,
      classtype_id:req.query.classtype,
      tag_id:req.query.tag ? req.query.tag.split(',') : [],
      page:req.query.page,
      limit:req.query.limit
    }
    let data=JSON.parse(JSON.stringify(await mongo.getData('articleModel',{...obj,sort:'-date'})))
    for(let item of data.data) {
      item.content=global.htmlToText(item.content).substr(0,60)+'...'
    }
    res.send(data)
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

router.get('/data',async (req, res) => {
  try {
    let data={}
    data.article=await mongo.getOneData('articleModel',{_id:req.query.id})
    data.classtype=await mongo.getOneData('classtypeModel',{_id:data.article.classtype_id})
    if(!data.classtype) data.classtype={title:'Unknown'}
    data.tag=[]
    for(let item of data.article.tag_id) {
      data.tag.push((await mongo.getOneData('tagModel',{_id:item}))?.title)
    }
    data.member=await mongo.getOneData('memberModel',{_id:data.article.member_id},'name account isAdmin intro link')
    data.comment=JSON.parse(JSON.stringify(await mongo.getData('commentModel',{article_id:req.query.id,sort:'-date'})))
    for(let item of data.comment.data) {
      item.name=(await mongo.getOneData('memberModel',{_id:item.member_id}))?.name
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
    await mongo.delDataMany('commentModel',{article_id:req.query._id})
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
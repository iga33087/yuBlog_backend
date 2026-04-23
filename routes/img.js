const fs = require('fs')
const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')
const SHA256 = require('crypto-js/sha256')
const fslib = require('../lib/fslib.js')

router.get('/',async (req, res) => {
  try {
    let r=await mongo.getData('imgModel',req.query)
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
    //await mongo.addData('imgModel',req.body)
    let data = fs.readFileSync(req.files.img.path)
    let signature=String(SHA256(fs.readFileSync(req.files.img.path,"utf8")))
    let imgData=await mongo.getOneData('imgModel',{signature:signature})
    let exists=fs.existsSync(`./img/${req.files.img.originalFilename}`)
    if(imgData && exists) throw 'Image duplicate！'
    else if(imgData && !exists) {
      await mongo.delDataByID('imgModel',{signature:signature})
      await mongo.addData('imgModel',{name:req.files.img.originalFilename,signature})
      fslib.addFile('./img',req.files.img.originalFilename,data)
    }
    else {
      await mongo.addData('imgModel',{name:req.files.img.originalFilename,signature})
      fslib.addFile('./img',req.files.img.originalFilename,data)
    }
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
    let data=await mongo.getOneData('imgModel',{_id:req.query._id})
    await mongo.delDataByID('imgModel',{_id:data._id})
    fs.unlinkSync(`./img/${data.name}`)
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
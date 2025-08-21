const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')

router.get('/',async (req, res) => {
  try {
    let r=await mongo.getOneData('appInfoModel',req.query)
    if(!r) {
      await mongo.addData('appInfoModel',{google_app_id:null,google_app_password:null,google_app_base_url:null})
      r=await mongo.getOneData('appInfoModel',req.query)
    }
    res.send(r)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.put('/',async (req, res) => {
  try {
    await mongo.editDataByID('appInfoModel',req.body)
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router
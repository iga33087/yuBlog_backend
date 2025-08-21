const {google} = require('googleapis');
const express = require('express')
const router = express.Router()
const mongo = require('../lib/mongo.js')

async function Oauth2Client() {
  try {
    let res=null
    let appInfo=await mongo.getOneData('appInfoModel',{})
    if(appInfo) {
      res=new google.auth.OAuth2(
        appInfo.google_app_id,
        appInfo.google_app_password,
        appInfo.google_app_base_url
      )
    }
    return res
  }
  catch(err) {
    throw err
  }
}

router.post('/login',async function (req, res) {
  try {
    let Oauth2ClientVar=await Oauth2Client()
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile', // get user info
      'https://www.googleapis.com/auth/userinfo.email',  
    ]
    const authorizationUrl = await Oauth2ClientVar.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: "consent",
      state: "GOOGLE_LOGIN",
    })
    res.send(authorizationUrl)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.get('/getToken',async function (req, res) {
  try {
    let Oauth2ClientVar=await Oauth2Client()
    let code = req.query.code;    // get the code from req, need to get access_token for the user 
    let { tokens } = await Oauth2ClientVar.getToken(code);    // get tokens
    res.send(tokens.access_token)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

router.get('/getInfo',async function (req, res) {
  try {
    let oauth2Client = new google.auth.OAuth2();    // create new auth client
    oauth2Client.setCredentials({access_token: req.query.token});    // use the new auth client with the access_token
    let oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    let { data } = await oauth2.userinfo.get();    // get user info
    let member=await mongo.getOneData('memberModel',{account:data.email},'name account date')
    if(!member) {
      let obj= {
        name:data.name,
        account:data.email,
        password:'-',
        isAdmin:false,
        type:'google',
        intro:null,
        link:null
      }
      await mongo.addData('memberModel',obj)
      member=await mongo.getOneData('memberModel',{account:data.email},'name account date')
    }
    let r=global.getToken({_id:member._id,name:member.name,account:member.account})
    res.send(r)
  }
  catch(err) {
    console.log(err)
    res.status(400).send({
      message: err
    })
  }
})

module.exports = router

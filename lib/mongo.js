const mongoose = require('mongoose')
const schema = require('./schema.js')
const mongoPath=process.argv[2]&&process.argv[2]==='build' ? `mongodb://mongo:27017/test` : `mongodb://localhost:27017/test`
const authData= {
  authSource: "admin",
  user: "root",
  pass: "example",
}

async function initDB() { 
  try {
    await mongoose.connect(mongoPath,authData)
    console.log('initDB')
  }
  catch (error) {
    console.log('Error')
  }
}

initDB()

module.exports = {
  async getData(className,value,cols=null) {
    try {
      let RegExpValue=global.queryRegExp(value)
      let skip=value.page&&value.limit ? (value.page-1)*value.limit : null
      let limit=value.limit ? value.limit : 20
      let sort=value.sort ? value.sort : null
      let total=await schema[className].countDocuments(RegExpValue)
      let data=await schema[className].find(RegExpValue,cols,{skip,limit}).sort(sort).exec()
      let res= {total,data}
      return res
    }
    catch(err) {
      throw err
    }
  },
  async getOneData(className,value,cols=null) {
    try {
      let data=await schema[className].findOne(value,cols).exec()
      return data
    }
    catch(err) {
      throw err
    }
  },
  async addData(className,value) {
    try {
      const instance = new schema[className](value)
      await instance.save()
    }
    catch(err) {
      throw err
    }
  },
  async editDataByID(className,value) {
    try {
      let res=await schema[className].updateOne({ _id: value['_id'] },value)
      return res
    }
    catch(err) {
      throw err
    }
  },
  async delDataByID(className,value) {
    try {
      let res=await schema[className].deleteOne({ _id: value['_id'] })
      return res
    }
    catch(err) {
      throw err
    }
  },
  async delDataMany(className,value) {
    try {
      let res=await schema[className].deleteMany(value)
      return res
    }
    catch(err) {
      throw err
    }
  }
}

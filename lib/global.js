const jwt = require('jsonwebtoken')
const exp = 180

module.exports = {
  sign:null,
  queryRegExp(x) {
    let res=JSON.parse(JSON.stringify(x))
    delete res.page
    delete res.limit
    delete res.sort
    for(let item of Object.keys(res)) {
      if(item=='startDate'||item=='endDate') continue
      let type=typeof(res[item])
      if(type==='string') res[item]=new RegExp(res[item],'i')
      else if(type==='object') {
        if(res[item].join()) res[item]={$in:res[item]}
        else delete res[item]
      }
    }
    if(res['startDate']||res['endDate']) {
      res.date={}
      if(res['startDate']) res.date.$gte=new Date(res['startDate']).getTime()
      if(res['endDate']) res.date.$lte=new Date(res['endDate']).getTime()
      delete res['startDate']
      delete res['endDate']
    }
    return res
  },
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  randomWord() {
    let arr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    return arr[module.exports.randomNum(0,Number(arr.length)-1)]
  },
  randomSerial() {
    let res=''
    for(let v1=0;v1<4;v1++) {
      for(let v2=0;v2<4;v2++) {
        res+=module.exports.randomWord()
      }
      if(v1!==3) res+='-'
    }
    return res.toUpperCase()
  },
  randomSign() {
    let res=''
    for(let i=0;i<50;i++) {
      res+=module.exports.randomWord()
    }
    module.exports.sign=res
    console.log(module.exports.sign)
  },
  getToken(x) {
    return jwt.sign({data:x}, module.exports.sign, { expiresIn: 60 * exp });
  },
  verifyToken(x) {
    let res=null
    if(!x) return null
    try {
      res = jwt.verify(x, module.exports.sign);
      //console.log('OK',res)
    } catch(err) {
      res = null
    }
    return res
  },
  verifyTokenGetValue(req,key) {
    try {
      let obj=module.exports.verifyToken(req.headers.authorization)
      return obj.data[key]
    }
    catch(err) {
      return null
    }
  },
  htmlToText(x) {
    return x.replace(/<[^>]+>/g, '');
  }
}

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

// 生成token
exports.generateToken = (data) => {
  let privateKey = fs.readFileSync(path.join(__dirname,'../config/rsa_private_key.pem')),
    currentTime = Math.floor(Date.now()/1000),
    token = jwt.sign({
      data,
      exp: currentTime+10*60
    }, privateKey, {algorithm: 'RS256'})

    return token
}
// 验证token
exports.verifyToken = (token) => {
  let publicKey = fs.readFileSync(path.join(__dirname,'../config/rsa_public_key.pem')),
    res = {}
  try {
    let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) || {}
    console.log('payload:',result)
    let {exp=0} = result,
      currentTime = Math.floor(Date.now()/1000)
      if(currentTime <= exp){
        res = result.data || {}
      }
  }catch(e){
    console.log(e)
  }
  return res
}
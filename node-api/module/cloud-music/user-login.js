const token = require('../../util/token')
module.exports = (data,connection) => {
  let name = data.name,
    password = data.password,
    email = data.email
    return new Promise((resolve, reject) => {
      connection.query('select * from user_info where email=? and password=?',[email,password],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        if(!res || res.length < 1) {
          reject({
            code: 500,
            success: false,
            msg: '账号或者密码错误'
          })
        } else {
          let tokenStr = token.generateToken({uid: res[0].id})
          resolve({
            code: 200,
            success: true,
            token: tokenStr,
            data: res[0],
            msg: '登录成功'
          })
        }
      })
    })
}
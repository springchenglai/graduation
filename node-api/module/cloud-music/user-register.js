module.exports = (data,connection) => {
  let name = data.name,
    password = data.password,
    email = data.email,
    result = null
    return new Promise((resolve, reject) => {
      connection.query('select * from user_info where email=?',[email],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        if(res && res.length > 0) {
          console.log('该邮箱已被注册')
          reject({
            code: 500,
            msg: '该邮箱已被注册'
          })
        } else {
          connection.query('insert into user_info(name,password,email) values(?,?,?)',[name,password,email],function(err,res){
            if(err) {
              console.log('err:',err)
              reject({
                code: 500,
                msg: '未知错误'
              })
            }
            resolve({
              code: 200,
              msg: 'success'
            })
          })
        }
      })
    })
}
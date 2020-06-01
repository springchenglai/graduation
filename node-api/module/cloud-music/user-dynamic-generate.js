module.exports = (data,connection) => {
  let uid = data.id,
    type = data.type,
    detail = JSON.stringify(data.detail),
    createAt = Date.now()
    return new Promise((resolve, reject) => {
      connection.query('insert into user_dynamic(uid,type,detail,createAt) values(?,?,?,?)',[uid,type,detail,createAt],function(err,res){
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
    })
}
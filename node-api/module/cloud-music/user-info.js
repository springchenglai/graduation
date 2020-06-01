module.exports = (data,connection) => {
  let userId = data.id
    return new Promise((resolve, reject) => {
      connection.query('select * from user_info where id=?',[userId],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        if(res && res.length > 0) {
          resolve({
            code: 200,
            msg: 'success',
            data: res[0]
          })
        } else {
          reject({
            code: 500,
            msg: '用户不存在'
          })
        }
      })
    })
}
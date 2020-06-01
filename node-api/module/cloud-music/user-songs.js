module.exports = (data,connection) => {
  let uid = data.uid,
    type = data.type
  if(type == 2){
    sql = `select * from user_download_like where uid=${uid}`
  } else {
    sql = `select * from user_download_like where uid=${uid} and type=${type}`
  }
  return new Promise((resolve, reject) => {
    connection.query(sql,function(err,res){
      if(err){
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      resolve({
        code: 200,
        msg: 'success',
        data: res
      })
    })
  })
}
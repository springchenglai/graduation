module.exports = (data,connection) => {
  let uid = data.uid
  return new Promise((resolve, reject) => {
    connection.query('select * from play_list where uid=?',[uid],function(err,res){
      if(err) {
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
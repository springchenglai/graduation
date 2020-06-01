module.exports = (data,connection) => {
  let url = data.url,
    id = data.id
  return new Promise((resolve, reject) => {
    connection.query('update user_info set avatarUrl=? where id=?',[url,id],function(err,res){
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
        avatarUrl: data.url
      })
    })
  })
}
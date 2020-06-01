module.exports = (data,connection) => {
  let id = data.id
  return new Promise((resolve, reject) => {
    connection.query('select * from play_list where id=?',[id],function(err,res){
      if(err) {
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      if(!res || res.length < 1){
        reject({
          code: 500,
          msg: '歌单不存在'
        })
      } else {
        resolve({
          code: 200,
          msg: 'success',
          playlist: res[0]
        })
      }
    })
  })
}
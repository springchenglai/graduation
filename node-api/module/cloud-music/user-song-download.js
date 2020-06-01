module.exports = (data,connection) => {
  let uid = data.uid,
    sid = data.sid,
    type = data.type
  return new Promise((resolve, reject) => {
    connection.query('select * from user_download_like where uid=? and sid=? and type=?',[uid,sid,type],function(err,res){
      if(err){
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      if(res && res.length > 0) {
        console.log('已存在该歌曲')
        // 对于喜欢的，可以取消喜欢
        if(type === 1){
          connection.query('delete from user_download_like where id=?',[res[0].id],function(err,res){
            if(err) {
              console.log('err:',err)
              reject({
                code: 500,
                msg: '未知错误'
              })
            }
            // 加入operation以区别是插入还是删除
            resolve({
              code: 200,
              msg: 'success',
              operateType: 'delete'
            })
          })
        } else {
          reject({
            code: 500,
            msg: '已存在该歌曲'
          })
        }
      } else {
        connection.query('insert into user_download_like(uid,sid,type) values(?,?,?)',[uid,sid,type],function(err,res){
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
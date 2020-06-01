module.exports = (data,connection) => {
  let uid = data.uid,
    pid = data.pid,
    sid = data.sid
  return new Promise((resolve, reject) => {
    connection.query('select * from play_list where id=? and uid=?',[pid,uid],function(err,res){
      if(err){
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      if(res && res.length > 0) {
        let songIdsArr = res[0].songIds ? res[0].songIds.split(',') : []
        if(songIdsArr.includes(sid+'')){
          reject({
            code: 500,
            msg: '已存在该歌曲'
          })
        } else {
          songIdsArr.push(sid)
          let newSongIds = songIdsArr.join(',')
          connection.query('update play_list set songIds=? where id=? and uid=?',[newSongIds,pid,uid],function(err,res){
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
      } else {
        reject({
          code: 500,
          msg: '该歌单不存在'
        })
      }
    })
  })
}
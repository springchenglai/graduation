module.exports = (data,connection) => {
  let id = data.id
    type = data.type
    return new Promise((resolve, reject) => {
      connection.query('select * from user_dynamic where id=?',[id],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        let likeCount = res[0].like_number ? res[0].like_number : 0,
        newlikeCount = type === 0 ? likeCount + 1 : (likeCount - 1 > 0 ? likeCount - 1 : 0)

        if(res && res.length>0){
          connection.query('update user_dynamic set like_number=? where id=?',[newlikeCount,id],function(err,res){
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
        } else {
          reject({
            code: 500,
            msg: '该动态不存在'
          })
        }

      })
    })
}
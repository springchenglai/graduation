async function getAttentionsList(attentionIdArr,connection){
  let attentionArr = []
  for(let i=0; i<attentionIdArr.length; i++) {
    let attentionId = attentionIdArr[i]
    await new Promise((resolve,reject) => {
      connection.query('select * from user_info where id=?',[attentionId],function(err,res){
        if(err){
          reject(err)
        }
        if(res && res.length > 0){
          attentionArr.push(res[0])
          resolve()
        } else {
          reject('关注用户不存在')
        }
      })
    })
  }
  return attentionArr
}
module.exports = (data,connection) => {
  let uid = data.id
  return new Promise((resolve, reject) => {
    connection.query('select attention from user_info where id=?',[uid],function(err,res){
      if(err){
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      if(res && res.length > 0){
        let attentionIdArr = res[0].attention && res[0].attention.split(',') || []

        getAttentionsList(attentionIdArr,connection)
        .then((data) => {
          resolve({
            code: 200,
            msg: 'success',
            data: data
          })
        })
        .catch((err) => {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        })
      } else {
        reject({
          code: 500,
          msg: '该用户不存在'
        })
      }
    })
  })
}
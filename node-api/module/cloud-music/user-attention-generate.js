module.exports = (data,connection) => {
  let cid = data.cid,
    id = data.id
    return new Promise((resolve, reject) => {
      connection.query('select * from user_info where id in (?,?)',[cid,id],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        let cAttention,fans
        res.forEach(record => {
          record.id == cid && (cAttention = record.attention ? record.attention.split(',') : [])
          record.id == id && (fans = record.fans ? record.fans.split(',') : [])
        })
        cAttention.push(id)
        fans.push(cid)
        let newCAttention = cAttention.join(','),
          newFans = fans.join(',')
        const updateAttention = new Promise((resolve,reject) => {
          connection.query('update user_info set attention=? where id=?',[newCAttention,cid],function(err,res){
            if(err){
              reject(err)
            }
            resolve()
          })
        })
        const updateFans = new Promise((resolve,reject) => {
          connection.query('update user_info set fans=? where id=?',[newFans,id],function(err,res){
            if(err){
              reject(err)
            }
            resolve()
          })
        })
        Promise.all([updateAttention, updateFans])
        .then(resArr => {
          resolve({
            code: 200,
            msg: 'success'
          })
        })
        .catch(error => {
          reject({
            code: 500,
            msg: '未知错误'
          })
        })
      })
    })
}
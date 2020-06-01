async function getFansList(fansIdArr,connection){
  let fansArr = []
  for(let i=0; i<fansIdArr.length; i++){
    let fansId = fansIdArr[i]
    await new Promise((resolve,reject) => {
      connection.query('select * from user_info where id=?',[fansId],function(err,res){
        if(err){
          reject(err)
        }
        if(res && res.length > 0){
          fansArr.push(res[0])
          resolve()
        } else {
          reject('粉丝不存在')
        }
      })
      
    })
  }
  console.log('fans:',fansArr)
  return fansArr
}
module.exports = (data,connection) => {
  let uid = data.id
  return new Promise((resolve, reject) => {
    connection.query('select fans from user_info where id=?',[uid],function(err,res){
      if(err){
        console.log('err:',err)
        reject({
          code: 500,
          msg: '未知错误'
        })
      }
      if(res && res.length > 0){
        let fansIdArr = res[0].fans && res[0].fans.split(',') || []

          getFansList(fansIdArr,connection)
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

module.exports = (data,connection) => {
  let id = data.id
    return new Promise((resolve, reject) => {
      connection.query('select * from user_info where id=?',[id],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        if(res && res.length>0){
          const {fans,attention} = res[0]
          let friendsArr = (fans ? fans.split(',') : []).concat(attention ? attention.split(',') : [])
          friendsArr.push(id)
          let sql = 'select * from user_dynamic where uid in (' + friendsArr.join(',') + ')'
          connection.query(sql,function(err,res){
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
        } else {
          reject({
            code: 500,
            msg: '用户不存在'
          })
        }
      })
    })
}
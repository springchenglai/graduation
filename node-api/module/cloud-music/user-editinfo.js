module.exports = (data,connection) => {
  const {id, name, gender, signature} = data
    return new Promise((resolve, reject) => {
      connection.query('update user_info set name=?, gender=?, signature=? where id=?',[name,gender,signature,id],function(err,res){
        if(err) {
          console.log('err:',err)
          reject({
            code: 500,
            msg: '未知错误'
          })
        }
        resolve({
          code: 200,
          success: true,
          msg: '修改成功'
        })
      })
    })
  }
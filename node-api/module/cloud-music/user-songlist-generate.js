module.exports = (data,connection) => {
  let uid = data.uid,
    name = data.name,
    description = data.description || ''
  return new Promise((resolve, reject) => {
    connection.query('insert into play_list(uid,name,description) values(?,?,?)',[uid,name,description],function(err,res){
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
  })
}
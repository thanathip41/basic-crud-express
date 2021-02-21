import util from 'util'
import mysql from 'mysql'
import env from '../Config/env.js'

const options = {
  host     : env.NODE_ENV === 'development' ? env.DB_HOST : env.DB_HOST_PROD, 
  database : env.NODE_ENV === 'development' ? env.DB_DATABASE : env.DB_DATABASE_PROD,
  user     : env.NODE_ENV === 'development' ? env.DB_USERNAME : env.DB_USERNAME_PROD,
  password : env.NODE_ENV === 'development' ? env.DB_PASSWORD : env.DB_PASSWORD_PROD,
  dateStrings: true
}

const connection = mysql.createPool(options)
connection.getConnection((err, connection) => {
    if (err) console.error(err.message,`${env.DB_HOST} host`)
    if (connection) connection.release()
    return
})
connection.query = util.promisify(connection.query)

export default  connection
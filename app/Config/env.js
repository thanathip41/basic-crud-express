
import dotenv from 'dotenv'
dotenv.config()
const env = process.env
export default {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    APP_URL : env.APP_URL,
    FRONT_URL : env.FRONT_URL,
    
    DB_USERNAME : env.DB_USERNAME,
    DB_PASSWORD : env.DB_PASSWORD, 
    DB_DATABASE : env.DB_DATABASE,
    DB_HOST : env.DB_HOST,
    DB_DIALECT : env.DB_DIALECT,
    DB_PORT : env.DB_PORT,

    DB_USERNAME_PROD : env.DB_USERNAME_PROD,
    DB_PASSWORD_PROD : env.DB_PASSWORD_PROD, 
    DB_DATABASE_PROD : env.DB_DATABASE_PROD,
    DB_HOST_PROD : env.DB_HOST_PROD,
    DB_DIALECT_PROD : env.DB_DIALECT_PROD,
    DB_PORT_PROD : env.DB_PORT_PROD,
    MAIL_SERVICE : env.MAIL_SERVICE,
    MAIL_USERNAME : env.MAIL_USERNAME,
    MAIL_PASSWORD : env.MAIL_PASSWORD,
    JWT_SECRET : env.JWT_SECRET,
    JWT_EXPIRE_HOUR :env.JWT_EXPIRE_HOUR,
}

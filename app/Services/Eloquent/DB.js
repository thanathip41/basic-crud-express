import Eloquent from './index.js'

class DB  extends Eloquent{
    constructor(){
        super()
    }
    static table(table) {
        const self = new DB()
        self.SELECT = `SELECT *`
        self.TABLE_NAME = table
        self.FROM = `FROM ${table}`
       return self
    }  
}

export default DB
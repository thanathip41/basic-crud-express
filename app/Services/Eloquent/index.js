import Connection from '../../Database/Connection.js'
import helper from '../../Helper/index.js'

class Eloquent{
    constructor(){
        this.UPDATE = ''
        this.INSERT = ''
        this.SELECT = ''
        this.COUNT = ''
        this.FROM = ''
        this.JOIN = ''
        this.WHERE = ''
        this.GROUP_BY = ''
        this.ORDER_BY = ''
        this.LIMIT = ''
        this.TABLE_NAME = ''
        this.TIMESTAMP = false
        this.HIDDEN = []
        this.INSERT_OBJ = []
        this.ONLYID = false
    }
    select (...params) {
        let  select = '*' 
        if(params.length > 0) {
            select = params.join(',')
        }
        this.SELECT = `SELECT ${select}`
        return this
    }
    where (column , operator , value) {
        [value , operator] = this.#valueAndOperator(
            value, operator, arguments.length === 2
        )
        value = this.#escape(value)
        if(operator === 'LIKE') value = `%${value}%`
        if(!this.WHERE.includes('WHERE'))  this.WHERE = `WHERE ${column} ${operator} '${value}'` 
        else this.WHERE = `${this.WHERE} AND ${column} ${operator} '${value}'`

        return this
    }
    orwhere (column , operator , value) {
        [value , operator] = this.#valueAndOperator(
            value, operator, arguments.length === 2
        )
        value = this.#escape(value)
        if(operator === 'LIKE') value = `%${value}%`
        if(this.WHERE.includes('WHERE')) this.WHERE = `${this.WHERE} OR ${column} ${operator} '${value}'`
        else this.WHERE = `WHERE ${column} ${operator} '${value}'` 
           
        return this
    }
    whereIn (column , arrayValues) {
        const sql = this.WHERE
        if(!sql.includes('WHERE')){
            this.WHERE = `WHERE ${column} IN (${arrayValues})`
        }else {
            this.WHERE = `${this.WHERE} AND ${column} IN (${arrayValues})`
        }
        return this
    }
    whereNotIn (column , arrayValues) {
        const sql = this.WHERE
        if(!sql.includes('WHERE')){
            this.WHERE = `WHERE ${column} NOT IN (${arrayValues})`
        }else {
            this.WHERE = `${this.WHERE} AND ${column} NOT IN (${arrayValues})`
        }
        return this
    }
    whereBettween (column , value1 , value2) {
        value1 = this.#escape(value1)
        value2 = this.#escape(value2)
        let sql = this.WHERE
        if(!sql.includes('WHERE')){
            this.WHERE = `WHERE ${column} BETTWEEN '${value1}' AND ${value2}`
        }else {
            this.WHERE = `${this.WHERE} ${column} BETTWEEN '${value1}' AND ${value2}`
        }
        return this
    }
    join (pk , fk) {
        const table = fk.split('.').shift()
        this.JOIN = `${this.JOIN} INNER JOIN ${table} ON ${pk} = ${fk}`;
        return this
    }
    orderBy (column , order = 'ASC') {
        order = order.toUpperCase()
        this.ORDER_BY = `ORDER BY ${column} ${order}`
        return this
    }
    latest (column) {
        this.ORDER_BY = `ORDER BY ${column} DESC`
        return this
    }
    oldest (column) {
        this.ORDER_BY = `ORDER BY ${column} ASC`
        return this
    }
    groupBy (column) {
        this.GROUP_BY = `GROUP BY ${column}`
        return this
    }
    limit (number = 1) {
        this.LIMIT = `LIMIT ${number}`
        return this
    }
    paginationTotal () {
        this.PAGINATIONTOTAL = true
        return this
    }
    async raw (sql) {
        return await Connection.query(sql)
    }
    
    async all() {
        const sql = `SELECT * FROM ${this.TABLE_NAME}`
        return await Connection.query(sql)
    }
    async find(id){
        const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = ${id}`
        return await Connection.query(sql)
    }
    async pagination(limit = 15 , page = 1) {
        try {
            const currentPage = page
            const offset = ( page - 1 ) * limit
            let sql = this.#getSQL()
            
             if(!sql.includes('LIMIT')){
                sql = `${sql} LIMIT ${limit} OFFSET ${offset}`
            } else {
                sql =  sql.replace(this.LIMIT ,`${limit} OFFSET ${offset}`);
            }
            const result = await Connection.query(sql)
            if(this.HIDDEN.length) this.#hiddenColumn(result)
            if(!result.length) return [currentPage , []]

            this.SELECT = `SELECT COUNT(id) as total`
                sql = this.#getSQL()
            const count = await Connection.query(sql)
            const total = count.shift().total || 0
            const lastPage = Math.round(total / limit)
            
            return [currentPage, lastPage, total, result]

        } catch (err) {
            throw {message : err.message, code:400}
        }
    }
    async first(){
        try {
            let sql = this.#getSQL()
            if(!sql.includes('LIMIT'))  sql = `${sql} LIMIT 1` 
            else  sql =  sql.replace(this.LIMIT ,'LIMIT 1')
            const result = await Connection.query(sql)
            console.log(result)
            if(this.HIDDEN.length) this.#hiddenColumn(result)
    
            return result.shift() || null
        } catch (err) {
            throw {message : err.message, code:400}
        }
    }
    async get () {
     try {
            const sql = this.#getSQL()
            const result = await Connection.query(sql)
            if(this.HIDDEN.length) this.#hiddenColumn(result)

            return result || []
        } catch (err) {
            throw {message : err.message, code:400}
        }
    }
    async toArray (column = 'id') {
        try {
                this.SELECT = `SELECT ${column}`
               const sql = this.#getSQL()
               const result = await Connection.query(sql)
               if(this.HIDDEN.length) this.#hiddenColumn(result)
                const newArray = []
                    for(const i in result) {
                        newArray.push(result[i][column])
                    }
               return  newArray 
           } catch (err) {
               throw {message : err.message, code:400}
           }
       }
    async count (column ='id') {
       try {
            this.SELECT = `SELECT COUNT(${column}) as total`
            const sql = this.#getSQL()
            const result = await Connection.query(sql)

            return result.shift().total || 0
        } catch (err) {
            throw {message : err.message, code:400}
        }
    }
    hidden (...columns) {
        this.HIDDEN = columns
        return this
    }

    async getcolumns () {
        const sql = `SHOW COLUMNS FROM ${this.TABLE_NAME}`
        const columns = await Connection.query(sql)
        let arraycolumns = []
            for(let i in columns) {
                arraycolumns.push(columns[i].Field)
            }
        return arraycolumns
    }
    update (objects) {
        let query = ''
        for(let i in objects) {
            const value = objects[i] 
            const column = i
            if(query.includes("SET"))   query = `${query} , ${column} = '${value}'` 
            else  query = `SET ${column} = '${value}'`
        }

        let sql = `UPDATE ${this.TABLE_NAME} ${query}`;
        if(this.TIMESTAMP) {
            sql = `${sql} , updated_at = '${helper.now()}'`;
        }
        this.UPDATE = sql

        return this
    }

    async delete () {
        try {
            if(!this.WHERE) throw { message : "can't delete without where condition" , code : 400}
            const result = await Connection.query(`DELETE ${this.FROM} ${this.WHERE}`)
            if(result.affectedRows) return true
    
            return false
        } catch (err) {
            throw { message :err.message , code : 400}
        }
    }
    create(objects) {
        const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`
        if(this.TIMESTAMP) {
            objects.created_at = helper.now()
            objects.updated_at = helper.now()
        }
        this.INSERT_OBJ = objects
        this.INSERT = sql

        return this
    }
    async save () {
        if(this.UPDATE)  return await this.#update()
        else return await this.#create()
    }
    returnID () {
        this.ONLYID = true
        return this
    }
    #create = async () => {
        try {
            const result = await Connection.query(this.INSERT,this.INSERT_OBJ)
            if(this.ONLYID) return result.insertId
            const sql = `${this.SELECT} ${this.FROM} ${this.TABLE_NAME} WHERE id = ${result.insertId}`
            const data = await Connection.query(sql)
           
            return data.shift() || null
        } catch (err) {
            throw {message : err.message, code:400}
        }
    }
    #update = async () => {
        if(!this.WHERE) throw { message : "Can't Update Without Where Condition"}
            const result =  await Connection.query(`${this.UPDATE} ${this.WHERE}`)
            if(result.affectedRows) {
                if(this.ONLYID) return result.insertId
                const data = await Connection.query(`${this.SELECT} ${this.FROM} ${this.TABLE_NAME} ${this.WHERE}`)
                return data
            }
        return null
    }
    #escape = (str) => {
        if(str == null || str === true || str === false || Number.isInteger(str)) return str
        const regx = /[`+#$&*=;':"\\|,<>\?~]/
        let res = str.split(regx).join("")
            
        const regxs =  ['DROP TABLE' ,'UPDATE ','OR ' ,'SELECT ']
            for(let i in regxs) {
                if(res.includes(regxs[i])) {
                    res = res.split(regxs[i]).join("")
                }
            }
        return res
    }
    
    #hiddenColumn = (object) => {
        const hidden = this.HIDDEN
        if(object.length) {
            for(const i in hidden) {
                const column = hidden[i]
                for(const j in object) {
                    delete object[j][column]
                }
            }
        }
        return object
    }

    #valueAndOperator = (value, operator, useDefault = false) => {
        if (useDefault) {
            return [operator, '='];
        }
        if(operator === 'like') operator = operator.toUpperCase();
      
        return [value, operator];
    }
    #getSQL = () => {
        const arraySql = [
            this.SELECT ,
            this.FROM ,
            this.JOIN ,
            this.WHERE ,
            this.GROUP_BY ,
            this.ORDER_BY ,
            this.LIMIT
        ]
        const filterSql = arraySql.filter(data => data != '')
        const sql = filterSql.join(' ')
        return sql
    }
}

export default  Eloquent
import DB from '../Eloquent/DB.js'

class Validate {
    constructor() {
        this.errors = []
    }
    handle = async(req , objRule) => {
        if(Object.keys(objRule).length > Object.keys(req).length) throw { message : 'rules & req invalid !' }
        const errorValidate = {}
        for(let i in objRule) {
           
            const reqInput = req[i]
            this.errors = []
            const rawRules = objRule[i]
                if(!rawRules) throw { message : 'invalid Rule' }
            const rules = objRule[i].split('|')
            for(let j in rules) {
                const rule = rules[j]

                if(rule === 'required') {
                    this.#required(i, reqInput)
                }
                else if(rule === 'password') {
                     this.#password(i, reqInput)
                }
                else if(rule.includes("unique")){
                    await this.#unique(i, reqInput,rule.split(':').pop())
                }
                else if(rule.includes("regex")) {
                    this.#regex(i, reqInput, rule.split(':').pop())
                }

                else if(rule === 'email') {
                    this.#email(reqInput)
                }

                else if(rule.includes("max")) {
                    this.#max(i, reqInput,rule.split(':').pop())
                }

                else if(rule.includes("min")) {
                    this.#min(i,reqInput,rule.split(':').pop())
                }

                else if(rule === 'number') {
                    this.#number(i, reqInput)
                }

                else if (rule === 'date') {
                    this.#date(i, reqInput)
                }
            }
            if(this.errors.length) {
                errorValidate[i] = this.errors
            }
        }
        const error = {
            message : errorValidate,
            code : 400
        }
        if(Object.keys(errorValidate).length) throw error

        return
    }

    #required = (i,reqInput) => {
        const message = `${i} required !`
        if(reqInput === '' || reqInput == null)  this.errors.push(message)
    }
    #password = (i , reqInput) => {
        const regex =  /^(?=.*\d)(?=.*[a-zA-Z])/
        const message =  `${i} format is invalid !` 

        if(!regex.test(reqInput)) this.errors.push(message)
    }
    #unique = async (field , reqInput, table = null) => {
        if(table == null) throw { message : 'unique required table name !' , code: 400}
        const message = `${field} must not be unique`
        const result = await DB.table(table).where(field, reqInput).count()
        if(result) this.errors.push(message)
    }
    #date = (i , reqInput) => {
        const regex = /\d{4}-\d{2}-\d{2}/
        const message =  `date must be valid ( YYYY-MM-DD)!` 

        if(!regex.test(reqInput)) this.errors.push(message)
    }
    #regex = (i, reqInput, rawRegex) => {
         // ^ .... allow only 
        let regex = rawRegex 
            if(rawRegex.length > 1) {
                regex = `[${regex}]`
            }
        const regexRule = new RegExp(regex)    
        const message =  `${i} must not be regex ${rawRegex} in characters !` 

        if(regexRule.test(reqInput))  this.errors.push(message)
    }
    #email = (reqInput) => {
        const regex = /\S+@\S+\.\S+/
        const message =  `email must be valid !` 

        if(!regex.test(reqInput))  this.errors.push(message)
    }
    #max = (i , reqInput , max = 8) => {
        const message = `${i} length maximum ${max} characters !`
        if(reqInput && reqInput.length> max)  this.errors.push(message)
    }
    #min = (i , reqInput, min = 3) => {
        const message = `${i} length minimum ${min} characters !`
        if(reqInput && reqInput.length < min)  this.errors.push(message)
    }
    #number = (i , reqInput) => {
        const regex = /^\d+$/
        const message = `${i} must be number valid !`
        if(!regex.test(reqInput)) this.errors.push(message)
    }
}

export default Validate


// Ex
// const rule = {
//     username : { rule : 'required|regex:$@#|unique:users', message : {
//       required : '... config',
//       unique : '...config'
//     } }, 
//     password : { rule : 'required|min:8|password' },
//     first_name : { rule : 'required'},  
//     last_name : { rule : 'required'}, 
//     email :  { rule : 'required|email|unique:users'}, 
//     mobile_no :  { rule : 'required|max:10|min:8|number'}
//   }
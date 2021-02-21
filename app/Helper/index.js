import jwt from 'jsonwebtoken'
import env from '../Config/env.js'

export default {
    now : () => {
        const d = new Date();
        const year = d.getFullYear() ;
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const date = ("0" + d.getDate()).slice(-2);
        const hours = ("0" + d.getHours()).slice(-2);
        const minutes = ("0" + d.getMinutes()).slice(-2);
        const seconds = ("0" + d.getSeconds()).slice(-2);
        const now = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
            
        return now
    },
    encodeAccessToken : (user , biz = [] , role = []) => {
        const accessToken =  jwt.sign({
            username : user.username,
            biz : biz,
            role, role
          }, env.JWT_SECRET , { expiresIn: env.JWT_EXPIRE_HOUR });
        return accessToken  
    },
    decodeAccessToken : (token) => {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            return decoded
        } catch (err) {
            return err.message
        }
    },
    covertDate : (timestamp , time = true ,thai = false) => {
        const d = new Date(timestamp)
        const year = d.getFullYear() 
        let month = ("0" + (d.getMonth() + 1)).slice(-2)
        const date = ("0" + d.getDate()).slice(-2)
        const hours = ("0" + d.getHours()).slice(-2)
        const minutes = ("0" + d.getMinutes()).slice(-2)
        const seconds = ("0" + d.getSeconds()).slice(-2)

        if(thai){
            const arrMonths = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
            if(month.length === 2){
                month = month.slice(-1)
            }
            month = arrMonths[month]
        }
       
        let now= `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`
        if(!time) now = `${date}-${month}-${year}`    

        
        return now
    },
    search : (key , value, obj) =>{
        const newObj = []
        obj.find(data => {
            if(data[key] === value) {
                newObj.push(data)
            }
        })
        return newObj
    },
    dateThaiFormat : (dateString ,monthFull = true , time = true) => {
        const [dataDate,dataTime] = dateString.split(' ')
        let [year , m , date] = dataDate.split('-')
            date = parseInt(date)
            year = parseInt(year) + 543
        const [h,s] = dataTime.split(':')

        let month = parseInt(m)
        let arrMonths = []
        if(monthFull) {
            arrMonths = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
        } else {
            arrMonths = ["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
        }
        month = arrMonths[month]

        if(time) return  `${date} ${month} ${year} ${h}:${s}` 

        return `${date} ${month} ${year} ${h}:${s}` 
    },
    calAge : (dateString) => {
        const now = new Date()
        const yN = now.getFullYear()
        const mN = now.getMonth() + 1
        const dN = now.getDate()
            
        const [dS , mS , yS] = dateString.split('/')
        const db = new Date(parseInt(yS)-543 , parseInt(mS)-1 ,parseInt(dS));

        const y = db.getFullYear()
        const m = db.getMonth() + 1
        const d = db.getDate()
        let age = yN - y
        let month = mN < m ? ( mN + 12 ) -m : mN - m
        month = dN < d ? month - 1 : month

        age = month < 12 ? age -1 : age

       return [age,month]
    }
}
import DB from '../../Services/Eloquent/DB.js'

export default {
    index : async (req , res) => {
       try {
            const users = await DB.table('users').all()
        return res.json({
                result : 'Success',
                data : users
                
            })
        } catch (err) {
            return res.status(err.code || 500).json({
                result : 'Fail',
                error : err.message
            })
        }
    },

    store : async (req , res) => {
        try {
            const data = await DB.table('users').create({
                username : req.body.username,
                name : req.body.name,
                email : req.body.email
            }).save()

         return res.json({
                 result : 'Success',
                 data
             })
         } catch (err) {
             return res.status(err.code || 500).json({
                 result : 'Fail',
                 error : err.message
             })
         }
    },
    edit : async (req , res) => {
        try {
            console.log('done')
            const id = req.params.id
            const user = await DB.table('users').where('id',id).first()
         return res.json({
                 result : 'Success',
                 data : user
                 
             })
         } catch (err) {
             return res.status(err.code || 500).json({
                 result : 'Fail',
                 error : err.message
             })
         }
    },
    update : async (req , res) => {
        try {
            const id = req.params.id
            const user = await DB.table('users').update({
                    name : req.body.name,
                    username : req.body.username,
                    email : req.body.email
                })
                .where('id',id).save()
            
         return res.json({
                 result : 'Success',
                 data : user[0]
             })
         } catch (err) {
             return res.status(err.code || 500).json({
                 result : 'Fail',
                 error : err.message
             })
         }
    },
    delete : async (req , res) => {
        try {
            const id = req.params.id
            await DB.table('users').where('id',id).delete()
         return res.status(202).json({
                 result : 'Success'
             })
         } catch (err) {
             return res.status(err.code || 500).json({
                 result : 'Fail',
                 error : err.message
             })
         }
    }
}
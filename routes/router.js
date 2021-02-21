import express from 'express'
import indexController from '../app/Http/Controllers/IndexController.js'

const router = express.Router()


router.get('/index',indexController.index)
router.post('/store',indexController.store)
router.get('/edit/:id',indexController.edit)
router.put('/update/:id',indexController.update)
router.delete('/delete/:id',indexController.delete)

export default router
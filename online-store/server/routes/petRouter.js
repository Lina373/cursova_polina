const Router = require('express')
const router = new Router()
const petProductController = require('../controllers/PetProductController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', petProductController.create)
router.get('/', petProductController.getAll)
router.get('/:id', petProductController.getOne)
router.delete('/:id', checkRole('ADMIN'), petProductController.delete)


module.exports = router

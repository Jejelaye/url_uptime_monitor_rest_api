const express = require('express')
const router = express.Router()
const {
  createCheck,
  getChecks,
  updateCheck,
  deleteCheck
} = require('../controllers/checkController')

const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getChecks)
router.post("/create", protect, createCheck)
router.route('/:checkId').put(protect, updateCheck).delete(protect, deleteCheck)


module.exports = router
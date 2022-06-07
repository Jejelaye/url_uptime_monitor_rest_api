const asyncHandler = require('express-async-handler')

const Check = require('../models/checkModel')
const User = require('../models/userModel')

// @desc    Create check
// @route   POST /api/checks/create
// @access  Private
const createCheck = asyncHandler(async (req, res) => {
  // payload should contain protocol,url,method,successCodes,timeoutSeconds
  // console.log(req.body)
  const { 
    user: {id},
    body: {
      protocol,
      url,
      method,
      successCodes,
      timeoutSeconds,
    }
  } = req

  if (!id || !protocol || !url || !method || !successCodes || !timeoutSeconds) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const checkObject = {
    user: id,
    protocol,
    url,
    method: method.toUpperCase(),
    successCodes,
    timeoutSeconds,
  }

  const check = await Check.create(checkObject)

  res.status(200).json(check)
})

// @desc    Get checks
// @route   GET /api/checks
// @access  Private
const getChecks = asyncHandler(async (req, res) => {
  const checks = await Check.find({ user: req.user.id })

  res.status(200).json(checks)
})

// @desc    Update check
// @route   PUT /api/checks/:checkId
// @access  Private
const updateCheck = asyncHandler(async (req, res) => {
  const { 
    user,
    user: {id},
    params: {checkId},
    body: {
      protocol,
      url,
      method,
      successCodes,
      timeoutSeconds,
      state
    }
  } = req

  const check = await Check.findById(checkId)

  if (!check) {
    res.status(400)
    throw new Error('Check not found')
  }

  // Check for user
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (check.user.toString() !== id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  let updatedCheckObj = {}

  if (protocol) updatedCheckObj.protocol = protocol
  if (url) updatedCheckObj.url = url
  if (method) updatedCheckObj.method = method
  if (successCodes) updatedCheckObj.successCodes = successCodes
  if (timeoutSeconds) updatedCheckObj.timeoutSeconds = timeoutSeconds
  if (state) updatedCheckObj.state = state

  const updatedCheck = await Check.findByIdAndUpdate(checkId, updatedCheckObj, {
    new: true,
  })

  res.status(200).json(updatedCheck)
})

// @desc    Delete check
// @route   DELETE /api/checks/:checkId
// @access  Private
const deleteCheck = asyncHandler(async (req, res) => {
  const {
    user,
    user: {id},
    params: {checkId}
  } = req

  const check = await Check.findById(checkId)

  if (!check) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (check.user.toString() !== id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await check.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  createCheck,
  getChecks,
  updateCheck,
  deleteCheck
}

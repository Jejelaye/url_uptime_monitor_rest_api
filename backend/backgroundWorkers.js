const asyncHandler = require('express-async-handler')
const URL = require('url')
const https = require('https')
const nodemailer = require('nodemailer')
const Check = require('./models/checkModel')
const User = require('./models/userModel')

// get all checks
const getAllChecks = asyncHandler(async (req, res) => {
  const allChecks = await Check.find({})

  allChecks.length > 0 ? 
    allChecks.forEach(check => performCheck(check)) :
    false
})

// perform checks: this is the part where you actually query the endpoint
const performCheck = (checkObj) => {
  const outcomeObj = {
    error: false,
    responseCode: ""
  }
  let isOutcomeSent = false


  const {
    protocol, url,
    method, successCodes,
    timeoutSeconds, state,
    lastChecked
  } = checkObj || "" // I kept getting TypeError because the program thought checkObj was undefined hence this fix

  const link = URL.parse(`${protocol}://${url}`, true)

  const options = {
     'protocol': 'https:',
    'hostname' : link.hostname,
     method,
    'path' : link.path,
    'timeout' : timeoutSeconds ? timeoutSeconds * 1000 : 3000
  }

  const req = https.request(options, (res) => {
    // console.log({
    //   "url": options.hostname,
    //   "statusCode": res.statusCode,
    //   headers: res.headers
    // });

    outcomeObj.responseCode = res.statusCode
    if (!isOutcomeSent) {
      processCheckOutcome(checkObj, outcomeObj)
      isOutcomeSent = true
    }
  });

  req.on('error', (e) => {
    outcomeObj.error = {"error": true, "value": e.message}

    if (!isOutcomeSent) {
      processCheckOutcome(checkObj, outcomeObj)
      isOutcomeSent = true
    }
  });

  req.on('timeout', () => {
    outcomeObj.error = {"error": true, "value": "timeout"}

    if (!isOutcomeSent) {
      processCheckOutcome(checkObj, outcomeObj)
      isOutcomeSent = true
    }
  })

  req.end();
}

const processCheckOutcome = asyncHandler(async (checkObj, outcomeObj) => {
 if (checkObj) {
  let state = !outcomeObj.error && outcomeObj.responseCode && checkObj.successCodes.indexOf(outcomeObj.responseCode) > -1 ? 'up' : 'down'

  let hasStateChanged = checkObj.state != state ? true : false

  let newCheckObj = checkObj
  newCheckObj.state = state
  newCheckObj.lastChecked = Date.now()

  let updateCheck = await Check.findByIdAndUpdate(checkObj._id, newCheckObj)

  if (hasStateChanged) {
    // send mail to the check creator notifying them of changes
    notifyOwnerOfChange(newCheckObj)
  }
 }
})

const notifyOwnerOfChange = asyncHandler(async ({ user, protocol, method, state, url }) => {
  const { name, email } = await User.findById(user)

  let msg = `Alert: Your check for ${method} ${protocol}://${url} is currently ${state}`

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "ATTN: Info on the URL you are watching!",
    text: msg
  }

  transporter.sendMail(mailOptions, (err, info) => {
    err ? console.log(err) : console.log(`Email sent: ${info.response}`)
  })
})

// execute query once per hour
const loopWorkers = () => {
  setInterval(
    function () { getAllChecks() },
    1000 * 60 * 60
  )
}

const init = (req, res) => {
  getAllChecks()

  loopWorkers()
}


module.exports = {
  getAllChecks, 
  loopWorkers,
  init
}
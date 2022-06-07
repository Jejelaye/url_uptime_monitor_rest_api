const mongoose = require('mongoose')

const checkSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    protocol: {
      type: String,
      required: [true, 'Please add protocol'],
    }, 
    url: {
      type: String,
      required: [true, 'Please enter url']
    },
    method: {
      type: String,
      required: [true, 'Please enter method']
    },
    successCodes: {
      type: []
    },
    timeoutSeconds: {
      type: Number
    },
    state: {
      type: String,
      default: ""
    },
    lastChecked: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Check', checkSchema)

var mongoose = require('mongoose');


/**
 * Race Schema
 * 
 * Definitions
 * notifications - An array that contains notification objects
 * _raceref - The ID of the race that the notification belongs to
 * _meetingref - The ID of the meeting that the notification belongs to
 */

var NotificationSchema = mongoose.Schema({
    notifications: [{
        type: { type: String },
        name: { type: String },
        timestamp: { type: Date },
        _isChecked: { type: Boolean, default: false },
    }],
    _raceref: { type: mongoose.Schema.Types.ObjectId, ref: 'Race'},
    _meetingref: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'}
})

module.exports = mongoose.model('Notification', NotificationSchema);
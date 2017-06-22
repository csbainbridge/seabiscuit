var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    notifications: [{
        name: { type: String },
        timestamp: { type: Date },
        _isChecked: { type: Boolean, default: false },
    }],
    _raceref: { type: mongoose.Schema.Types.ObjectId, ref: 'Race'}
})

module.exports = mongoose.model('Notification', NotificationSchema);
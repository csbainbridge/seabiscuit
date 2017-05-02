var Promise = require('bluebird');
var mongoose = require('mongoose')

// http://mongoosejs.com/docs/populate.html
//http://stackoverflow.com/questions/35795480/mongoose-query-to-get-data-from-multiple-collections

/**
 * Meeting Schema
 * 
 * Definitions
 * created_at - Time when initial meeting object was created.
 * xreference - ID used to cross reference meeting data from race card and betting data.
 * statuses - Array of status objects.
 * country - The country where the meeting is taking place.
 * course - The course where the meeting is taking place.
 * date - Date of the meeting.
 * going - Going of the meeting.
 * races - Array of race objects.
 */

var MeetingSchema = mongoose.Schema({
    _country: { type: Number, ref: 'Country' },
    created_at: { type: Date, default: new Date() },
    x_reference: { type: String, min: 12, max: 12, default: '' },
    statuses: [{
        _id: mongoose.Schema.Types.ObjectId,
        created_at: { type: Date, default: new Date() },
        status:  { type: String, default: '' }
    }],
    course: { type: String, default: '' },
    date: { type: String, default: '' },
    going: { type: String, default: '' },
    races: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Race' }]
})
module.exports = mongoose.model('Meeting', MeetingSchema);
var mongoose = require('mongoose');

// http://mongoosejs.com/docs/populate.html

/**
 * Race Schema
 * 
 * Definitions
 * created_at - Time when initial race object was created.
 * xreference - ID used to cross reference race data from race card and betting data.
 * offTime - Off time for race.
 * winningTime - Winning time for race.
 * time - The race time.
 * statuses - Array of status objects.
 * title - Title for race.
 * handicap - Is the race a handicap race.
 * raceType - Type for race.
 * trackType - Track type for race.
 * trifecta - Will there be a trifecta for race.
 * maxRunners - The maximum number of runners in race.
 * runners - the amount of runners in race.
 * horses - Array of horse objects.
 * returns - Array of return objects.
 */

var RaceSchema = mongoose.Schema({
    _meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
    created_at: { type: Date, default: Date.now },
    x_reference: { type: String, min: 16, max: 16, default: '' },
    off_time: { type: String, default: '' },
    winning_time: { type: String, default: '' },
    time: { type: String, default: '' },
    statuses: [{
        _id: mongoose.Schema.Types.ObjectId,
        created_at: { type: Date, default: Date.now },
        supplier_timestamp: { type: String },
        status:  { type: String, default: '' }
    }],
    title: { type: String, default: '' },
    distance: { type: String, default: '' },
    handicap: { type: String, defualt: '' },
    race_type: { type: String, default: '' },
    track_type: { type: String, default: '' },
    trifecta: { type: String, default: '' },
    max_runners: { type: String, default: '' },
    runners: { type: String, default: '' },
    horses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Horse' }],
    returns: [{
        _id: mongoose.Schema.Types.ObjectId,
        created_at: { type: Date, default: Date.now },
        type: { type: String, default: '' },
        currencey: { type: String, default: ''},
        dividend: { type: String, default: '' },
        horses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Horse' }]
    }]
})

module.exports = mongoose.model('Race', RaceSchema);
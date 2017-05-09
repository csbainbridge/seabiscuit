var mongoose = require('mongoose');

// http://mongoosejs.com/docs/populate.html
// http://stackoverflow.com/questions/35795480/mongoose-query-to-get-data-from-multiple-collections

/**
 * Horse Schema
 * 
 * Definitions
 * created_at - Time when initial horse object was created.
 * statuses - Array of status objects
 * name - Name of horse
 * bred - Bred of horse
 * drawn - Drawn position
 * cloth - Cloth number
 * weight - Object of weight data
 * jockeys - Array of jockey objects
 * shows - Array of show objects
 * sp - Object of starting price data
 * result - Object of result data
 */

HorseSchema = mongoose.Schema({
    _raceref: { type: Number, ref: 'Race' },
    created_at: { type: Date, default: Date.now },
    statuses: [{
        created_at: { type: Date, default: Date.now },
        status: { type: String, default: '' }
    }],
    name: { type: String, default: '' },
    bred: { type: String, default: '' },
    drawn: { type: String, default: '' },
    cloth: { type: Number },
    weight: {
        units: { type: String, default: '' },
        value: { type: String, default: '' }
    },
    jockeys: [{
        created_at: { type: Date, default: Date.now },
        name: { type: String, default: '' },
        allowance: {
            units: { type: String, default: '' },
            value: { type: String, default: '' }
        }
    }],
    shows: [{
        created_at: { type: Date, default: Date.now },
        supplier_timestamp: { type: String, default: '' },
        numerator: { type: String },
        denominator: { type: String },
        offer: { type: String, default: 'no' }
    }],
    starting_price: {
        created_at: { type: Date, default: Date.now },
        numerator: { type: String },
        denominator: { type: String }
    },
    result: {
        created_at: { type: Date, default: Date.now },
        pos: { type: String, default: '' },
        disqualified: { type: String, default: 'no' },
        btn_distance: { type: String, default: '' }
    },
})

module.exports = mongoose.model('Horse', HorseSchema);
var mongoose = require('mongoose');

// http://mongoosejs.com/docs/populate.html
// http://stackoverflow.com/questions/35795480/mongoose-query-to-get-data-from-multiple-collections

/**
 * NOTE: When saving new race card data use the Country value of the data passed to query against the documents that exist, if the country does
 * not exist create a new country
 * 
 */

/**
 * Country Schema Schema
 * 
 * Definitions
 * created_at - Time when initial country object was created.
 * name - Name of meeting.
 * meetings - Array of meetings for the country.
 */
 

var CountrySchema = mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    name: { type: String, default: '' },
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }]
})

module.exports = mongoose.model('Country', CountrySchema);
/**
 * CheckCountryCodes checks the country code of the betting object supplied, and calls a setter function based on this value.
 */

/**
 * Dependencies
 * @bluebird, @SetSABettingValues
 */
var Promise = require('bluebird'),
    setSABettingValues = require('./SetSABettingValues.js')

module.exports = {
    /**
	 * Calls setter function based on the supplied datas country code.
	 * 
	 * @param {Object} bettingDataObjects The object holds the betting data supplied, country code and pa betting object.
	 * @returns {Object} Returns pa betting object.
	 */
    checkCountryCode : function( bettingDataObjects ) {
        return new Promise(function( resolve, reject ) {
            var paObject = bettingDataObjects.PAObject,
                bettingObject = bettingDataObjects.BettingDataObject,
                messageType = bettingObject.HorseRacingX.Message["0"].$.type,
                countryCode = bettingDataObjects.CountryCode
            if (typeof countryCode===undefined){
                reject({
                    "Error" : "Country Code is undefined",
                    "Action" : "N/A"
                })
            }
            if ( countryCode === "SA" ) {
                resolve(setSABettingValues.setBettingValues(messageType, paObject, bettingObject))
            }
        })
    }
}
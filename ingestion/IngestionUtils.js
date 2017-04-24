/**
 * IngestionUtils provides utility functions when processing Betting and Race Card JSON data.
 */

/**
 * Dependencies
 * @bluebird
 */
var Promise = require('bluebird');

module.exports = {
/**
 * Creates a unique meeting ID using Course, Country and Date values from the PA Data {Object}
 * 
 * @param {Object} paDataObject The PA Data Object (PA Betting or PA Race Card)
 * @returns {String} Returns the unique meeting id.
 */
  createMeetingId : function( paDataObject ) {
    var meetingId = "";
    var course;
    var country;
    var date;

    if ( paDataObject.PABettingObject ) {
      course = paDataObject.PABettingObject.Meeting.Course;
      country = paDataObject.PABettingObject.Meeting.Country;
      date = paDataObject.PABettingObject.Meeting.Date;
    } else {
      course = paDataObject.PARaceCardObject.Meeting.Course;
      country = paDataObject.PARaceCardObject.Meeting.Country;
      date = paDataObject.PARaceCardObject.Meeting.Date
    }
    meetingId += country.slice(0, 3).toLowerCase();
    meetingId += date.slice(2, 9);
    meetingId += course.slice(0, 3).toLowerCase();
    return meetingId;
	},
  /**
   * Creates a unique race ID using the meetingId and raceTime of the PA Data {Object}
   * NOTE: The only metadata that can be used to create the unique race ids is the race time value.
   * This data does not match the race time value provided in the PA Race data. Please see example below.
   * 
   * Example: SA Betting Data race time <RaceRef time="1315+0200"> -- PA Race Card Data race time time="1215+0100"
   * To fix this issue in the {SAUtils} module please see {Function} standardizeRaceTime.
   * 
   * @param {Object} paDataObject
   * @param {String} raceTime
   * @returns {String} Returns the unqiue race id.
   */
  	createRaceId : function( paDataObject, raceTime ) {
    var raceId = "";
    var raceTime;
    var meetingId; 
    if ( paDataObject.PABettingObject ) {
      meetingId = paDataObject.PABettingObject.Meeting.ID;
      raceTime = paDataObject.PABettingObject.Meeting.Race.Time;

    } else {
      meetingId = paDataObject.PARaceCardObject.Meeting.ID
    }
    raceId +=  meetingId.slice(0, 7) + raceTime.slice(0, 4) + meetingId.slice(7, 12);
    return raceId;
  },
  /**
   * Creates formatted timestamp string
   * Format: YYYYMMDDTHHMMSS (Example: 20170415T213645)
   * 
   * @returns {String} Returns timestamp string
   */
   createTimeStamp : function() {
    return new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  },
}
/*
  @@CreateIDs module
  Provides functions @createMeetingId and @createRaceId.
*/
var Promise = require('bluebird');

var createIDs = {
	 /*
	    @createMeetingId
	    Returns a unique {Meeting ID}. Created using {PA Betting Object} data ({Course}, {Country} and {Date}).
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
	/*
		@createRaceId
		Returns a unique {Race ID}. Created using {PA Betting Object} data ({Meeting ID} and {Race Time}).
    SA Betting <RaceRef time="1315+0200"> does not match PA Racecard time="1215+0100"
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


    raceId +=  meetingId.slice(0, 8) + raceTime.slice(0, 4) + meetingId.slice(8, 12);
    
    return raceId;
  },
}

module.exports = createIDs;
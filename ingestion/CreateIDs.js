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
	createMeetingId : function( paBettingObject ) {
    var meetingId = "";

    var course = paBettingObject.PABettingObject.Meeting.Course;
    var country = paBettingObject.PABettingObject.Meeting.Country;
    var date = paBettingObject.PABettingObject.Meeting.Date;

    meetingId += country.slice(0, 3).toLowerCase();
    meetingId += date.slice(2, 9);
    meetingId += course.slice(0, 3).toLowerCase();

    return meetingId;
	},
	/*
		@createRaceId
		Returns a unique {Race ID}. Created using {PA Betting Object} data ({Meeting ID} and {Race Time}).
	*/
  	createRaceId : function( paBettingObject ) {
    var raceId = "";
    var meetingId = paBettingObject.PABettingObject.Meeting.ID;

    raceId +=  meetingId.slice(0, 8) + paBettingObject.PABettingObject.Meeting.Race.Time.slice(0, 4) + meetingId.slice(8, 12);
    
    return raceId;
  },	
}

module.exports = createIDs;
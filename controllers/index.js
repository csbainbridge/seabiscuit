var CountryController = require('./CountryController');
var HorseController = require('./HorseController');
var MeetingController = require('./MeetingController');
var RaceController = require('./RaceController');

module.exports = {
    country: CountryController,
    horse: HorseController,
    meeting: MeetingController, 
    race: RaceController
}
var CountryController = require('./CountryController');
var HorseController = require('./HorseController');
var MeetingController = require('./MeetingController');
var RaceController = require('./RaceController');
var NotificationController = require('./NotificationController');

module.exports = {
    country: CountryController,
    horse: HorseController,
    meeting: MeetingController, 
    race: RaceController,
    notification: NotificationController
}
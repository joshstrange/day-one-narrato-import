var program = require('commander');
var DayOne = require('dayone').DayOne;
var DayOneEntry = require('dayone').DayOneEntry;
var path = require('path-extra');
var fs = require('fs');
var GoogleMapsAPI = require('googlemaps');
var doniPackage = require('./package.json');

var publicConfig = {
	key: 'AIzaSyDt-30BtV8Al6wr_pGvEE65cPqNL5Y--cA',
	stagger_time:       1000, // for elevationPath
	encode_polylines:   false,
	secure:             true // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

var iCloudDirectory = path.join(path.homedir(), 'Library/Mobile Documents/5U8NS4GX82~com~dayoneapp~dayone/Documents/Journal_dayone/');
var dropboxDirectory = path.join(path.homedir(), 'Dropbox/Applications/Day One/Journal.dayone/');
var dropbox2Directory = path.join(path.homedir(), 'Dropbox/Apps/Day One/Journal.dayone/');

var locations = [
	'[Dropbox]: '+dropboxDirectory+' ('+(fs.existsSync(dropboxDirectory) ? 'FOUND' : 'NOT-FOUND')+'!)',
	'[Dropbox (alt)]: '+dropbox2Directory+' ('+(fs.existsSync(dropbox2Directory) ? 'FOUND' : 'NOT-FOUND')+'!)',
	'[iCloud]: '+iCloudDirectory+' ('+(fs.existsSync(iCloudDirectory) ? 'FOUND' : 'NOT-FOUND')+'!)'
];

program
  .version(doniPackage.version)
  .option('-d, --directory [value]', "Where is your Day One synced to? Here are some possible locations:\n"+locations.join('\n'));


program
   .command('import <file>')
   .description('run import on narrato export file')
   .action(function(file){
   		if(!program.directory)
   		{
   			program.directory = iCloudDirectory;
   		}
   		var dayone = new DayOne({
				directory: program.directory
			});
   		var items = require(file);
			items.forEach(function(item){
				if(item.type == 'co.narrato.journal.textpost') {
					var entry = new DayOneEntry();
					entry.entryText = item.text;
					entry.creationDate = new Date(item.created);
					dayone.save(entry, function(error) {
						console.log('Entry Imported!');
					});
				} else if(item.type == 'co.narrato.journal.checkinpost' || item.type == 'com.foursquare.checkin') {


					var lat = item.location.lat;
					var lon = item.location.lon;

					// reverse geocode API
					var reverseGeocodeParams = {
						"latlng":        lat +','+lon,
						"result_type":   "postal_code",
						"language":      "en",
						"location_type": "APPROXIMATE"
					};

					gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
						var state = '';
						var country = '';
						var city = '';
						result.results[0].address_components.forEach(function(component){
							if(component.types.indexOf('locality') !== -1) {
								city = component.long_name;
							} else if(component.types.indexOf('administrative_area_level_1') !== -1) {
								state = component.short_name;
							} else if(component.types.indexOf('country') !== -1) {
								country = component.long_name;
							}


						});
						var entry = new DayOneEntry();
						entry.location = {
							administrativeArea: state,
							country: country,
							locality: city,
							latitude: lat,
							longitude: lon,
							placeName: result.results[0].formatted_address, //Address
							region: {
								center: {
									latitude: lat,
									longitude: lon
								},
								radius: 30
							}
						};
						entry.entryText = 'Location Only';
						entry.creationDate = new Date(item.created);
						dayone.save(entry, function(error) {
							console.log('Location Imported!');
						});
					});



				}
			});
   });


program.parse(process.argv);

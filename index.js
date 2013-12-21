var program = require('commander');
var DayOne = require('dayone').DayOne;
var DayOneEntry = require('dayone').DayOneEntry;
var path = require('path-extra');
var fs = require('fs');
var doniPackage = require('./package.json');


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
				item.annotations.forEach(function(annotation){
					if(annotation.key == 'core.text')
					{
						var entry = new DayOneEntry();
						entry.entryText = annotation.value.text;
				    entry.creationDate = new Date(item.created*1000);
						dayone.save(entry, function(error) {
						    console.log('Entry Imported!');
						});
					}
				});
			});
   });


program.parse(process.argv);

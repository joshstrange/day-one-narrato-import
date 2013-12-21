# What is this?
This is a very simple node JS program that I wrote to migrate my [Narrato](https://www.narrato.co/) text posts to [Day One](http://dayoneapp.com/). It does not support images, locations, weather, etc (Though the library it is using does so support can be added).

## Usage

To use simply:
```bash
git clone https://github.com/joshstrange/day-one-narrato-import
cd day-one-narrato-import
npm install
node index.js import ./items.json -d '/path/to/day/one/sync/folder' //iCloud by default
```

This will import the test Narrato entry contained in items.json to your Day One journal. You can also run:
```bash
node index.js --help
```
To see the locations your folder might be stored. I'm not aware of all the possibilities but if running the above doesn't find any existing folders (And you are running Day One on your Mac) then see if your Dropbox applications folder is named something other than "~/Dropbox/Apps" or "~/Dropbox/Applications" (or if you don't have your Dropbox in your home directory).

When you are ready to import your Narrato posts (Which you can export [here](https://account.narrato.co/export)) just point at your "items.json" instead of the testing one.

### Known issues
As I said above it does not support any Narrato types other than text or, more specifically, "core.text". If you want to add support for more (as the base library does support it) then open an issue and we can talk. Let me know if you find any other problems! Thanks.
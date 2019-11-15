# Don't Play Kittens Game

Seriously, don't.  But if you do, this script might make it easier for you to deal with the pleathora of shit they throw at you.

# Usage

First get yourself a custom Javascript injection extension for your browser.

Chrome Users: [Custom Javascript 2/CJS](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk?hl=en)
Firefox Users: [Code Injector](https://addons.mozilla.org/en-US/firefox/addon/codeinjector/)

You will paste whatever Javascript you want to load and configure for which hosts/websites it should load on, then simply update the saved code whenever there are changes.  Then, just reload the page and enjoy your new buttons.  

# Functions

You can probably figure out what the UI elements do through experimentation but I'll post a summary.  Unless otherwise specified, things happen in the order they are written from top to bottom.

### Make stuff

- Crafts all Beams
- Crafts all Slabs

### Make stuff + plates

- Does everything `Make stuff` does
- Crafts all plates

### Make stuff + steel

- Does everything `Make stuff` does
- Crafts all steel

### Make all the stuff

- Does everything `Make stuff` does
- Crafts all steel
- Crafts all plates

### Spend culture

- Crafts all parchemnt
- Crafts all manuscript
- Crafts all compendiums ***
- Sends as many hunters as you can

_*** In the code, there's a typo causing compendiums to be called `compediums` - this is intentional and is not a bug in the script!_

### Spend culture and praise 

- Does everything that `Spend culture` does
- Praise the sun

### Trade to cap titanium

- Runs a heuristic to determine the "optimal" number of times to trade with the Zebras given your gold, slabs, catpower, average expected titanium per trade, and trade failure rate, then trades with the Zebras that many times.

Caveat with this one is that if the game is updated and the calculation for trading changes, this function has to be updated or it's going to be off in it's calculations.  It's also based on averages, so it's not perfect - This becomes less of an issue when you have enough ships to ensure titanium in every trade and enough tradeposts that your failure rate is low.

# The Fuuuuuuuture

One day I might make an extension so that you can simply install that and keep the extension up to date.


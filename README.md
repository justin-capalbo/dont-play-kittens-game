# Don't Play Kittens Game

Seriously, don't.  But if you do, this script might make it easier for you to deal with the pleathora of shit they throw at you.

[Kittens Game](http://bloodrizer.ru/games/kittens/#)

## Browser compatibility

This might not be compatible with older versions of certain browsers because it uses more modern javascript.  If you get errors when trying to inject the script, try upgrading to the latest Chrome or Firefox.  But most of the Javascript being used is pretty tame. 

## Usage

First get yourself a custom Javascript injection extension for your browser.

- Chrome Users: [Custom Javascript 2/CJS](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk?hl=en)
- Firefox Users: [Code Injector](https://addons.mozilla.org/en-US/firefox/addon/codeinjector/)

You will paste whatever Javascript you want to load and configure for which hosts/websites it should load on, then simply update the saved code whenever there are changes.  Then, just reload the page and enjoy your new buttons.  

## Tools

You can probably figure out what the UI elements do through experimentation but I'll post a summary.  Unless otherwise specified, things happen in the order they are written from top to bottom.

### Make stuff

- Crafts **all** resources toggled by the accompanying checkboxes

### Do culture activities (optionally praise)

- Crafts all of parchment, manuscripts, and compendiums*** depending on those selected via the accompanying checkboxes, then hunts.  The order is as follows:
  1. Craft all blueprints (if selected)
  2. Craft all compendiums (if selected)
  3. Craft all manuscripts (if selected) 
  4. Send all hunters
- *Do culture activities and praise* will do the same thing, but will follow culture activities by praising the sun.

_*** In the code, there's a typo causing compendiums to be called `compediums` - this is intentional and is not a bug in the script!_

### Trade

Here are some useful functions that do some assisted trading.

#### Trade to cap titanium

- Runs a heuristic to determine the "optimal" number of times to trade with the Zebras given your gold, slabs, catpower, average expected titanium per trade, and trade failure rate, then trades with the Zebras that many times.

Caveat with this one is that if the game is updated and the calculation for trading changes, this function has to be updated or it's going to be off in it's calculations.  It's also based on averages, so it's not perfect - This becomes less of an issue when you have enough ships to ensure titanium in every trade and enough tradeposts that your failure rate is low.

The calculation is a little buggy at high titanium caps, so you might have to click the button 2 or even 3 times to cap titanium.

#### Trade for coal (match iron)

- Runs a calculation on the approximate amount of trades with spiders needed to cap coal, or reach an amount of coal equal to your current iron amount, whichiever is smaller.  Then, it trades with spiders that many times.  
- This estimates your aproximate coal per trade by keeping track of the average coal of the coal gained on the last several trades, so if you are ramping up tradeposts you might notice this doesn't work 100% perfectly.

### Cycles

- Keeps track of the current cycle and displays it in a colored font next to the other 9 cycles which are displayed in a grayed out font.
- The cycles are displayed in order so you always know which ones are coming up soon.  
- TODO: Add a tooltip to the inactive cycles so you know what effects they might have even if they aren't active.  Unfortunately bloodrizer didn't encapsulate the tooltip logic, so it would have to be completely duplicated or written from scratch.

# The Fuuuuuuuture

One day I might make an extension so that you can simply install that and keep the extension up to date.


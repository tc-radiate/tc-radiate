Radiator for TeamCity
==========
Features
-------------
* Self-hostable on Github under _youraccount.github.io/tc-radiate_ - just fork this repo for your own URL, edit the [Settings.js](./Settings.js) and open that URL on your big screen
* List ordered by priority: _Uninvestigated Failure_ > _Investigated Failure_ > _Running_ > _Success_ > _Paused_ (within each group sorted by recency, big picture always shows highest priority)
* Plays a sound on a new failure (when not wanted can be muted persistently)
* Very easy to <a href="./Content/images/!List.js" target="_blank">customize images</a> and <a href="./Content/sounds/!List.js" target="_blank">sounds</a> (supports remote URLs with fallback to local ones)
* Shows author names of failed changes (when no changes shows who triggerred the build)
* Shows investigator name and his comment, if provided
* Auto update - any changes pushed to `gh-pages` branch get picked up automatically after a while.
* Supports 'no guest account' setups of TeamCity, with no credentials saved in code (uses the standard browser's basic authentication, so you can save credentials in your browser, or just keep entering them)

<img src="screenshot.jpg" width="600" />


Working monitors
-------------
They're here: https://aqovia.github.io/tc-radiate/

Setup
-------------
1. Fork this repo. This will give you a web-page: _youraccount.github.io/tc-radiate_
2. Edit relevant variables in [Settings.js](./Settings.js).
2. Set your TeamCity to allow cross-domain requests from the _youraccount.github.io_ domain (see [TeamCity Doc](https://confluence.jetbrains.com/display/TCD10/REST+API#RESTAPI-CORSSupport)). Alternatively, use a [Proxy](#proxy).
3. Enjoy your radiator at _youraccount.github.io/tc-radiate_

#### Testing local changes
To test your changes on your local machine, you need to open the index.html file in a browser with disabled cross-domain security. In the [main folder](./) there are open-in-*-for-local-development.cmd files, which help you to do this. Please read and follow instructions displayed during execution.

Proxy
-----
This is not advised if you can set up CORS in TeamCity (see [Configuration](#configuration)), but in the absence of other choice you can use a proxy web application to request the TeamCity web services. In the 'proxies' folder there is an example of a an ASP.NET proxy which needs to be ran on IIS. If you want to use this, just copy it into the root tc-radiate folder and hook the folder up to an IIS website.

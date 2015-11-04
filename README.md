TravCorp's Radiator for TeamCity (based on tc-radiate)
==========

Working monitors
-------------
They're here: https://travcorp.github.io/tc-radiate/
(use your own TeamCity credentials or the [shared one](http://ttcwiki/display/itropics/Passwords+to+production#Passwordstoproduction-teamcitysharedaccount))

Hacking the monitors:
-------------
Clone this repo, play with the code and make a pull request to the `gh-pages` branch. The above page will update automatically!



**_Original readme from tc-radiate follows:_**

-------------

tc-radiate
==========
A simple JavaScript build radiator for TeamCity

Please feel free to fork and hack away at the code.

![Screenshot](screenshot.jpg "Screenshot")

Configuration
-------------
1. To configure tc-radiate with your own TeamCity server go to 'Settings.js' and edit the relevant variables.
2. Set your TeamCity to allow cross-domain requests from the domain where you host the monitor (see [TeamCity Doc](https://confluence.jetbrains.com/display/TCD9/REST+API#RESTAPI-CORSSupport)). Alternatively, use a [Proxy](#proxy).

Proxy
-----
It is not advised, but i you don't set up CORS in teamcity (see [Configuration](#configuration)), a proxy web application will be required to request the team city web services. This is because the browser won't let the monitor read a cross domain request. All the proxy needs to to is request the web service on behalf of the JavaScript whilst running on the same domain.

In the 'proxies' folder there is an example of a an ASP.NET proxy which needs to be ran on IIS.
If you want to use this, just copy it into the root tc-radiate folder and hook the folder up to an IIS website.

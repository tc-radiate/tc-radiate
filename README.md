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
To configure tc-radiate with your own TeamCity server go to 'Settings.js' and edit the relevant variables.

Configuration settings can be overridden using query strings e.g. http://mybuildscreenurl/?mainBranch=exampleBranchName

Proxy
-----
A proxy is required to request the team city web services. This is because javascript won't let you do a cross domain request in most browsers. All the proxy needs to to is request the web service on behalf of the JavaScript whilst running on the same domain.

In the 'proxies' folder there is an example of a an ASP.NET proxy which needs to be ran on IIS, i'll try add more examples in other languages when i get the chance.
If you want to use this, just copy it into the root tc-radiate folder and hook the folder up to an IIS website.

//The url that points to team city
var teamCityUrl = 'http://teamcity:8111';

//The main branch to show the master build status on the right hand panel on the screen
var mainBranch = 'develop';

var proxy = 'proxy.ashx?url=';

//How often to call the TeamCity webservices and update the screen
var checkIntervalMs = 5000; //5000 ms = 5 seconds

//How often to refresh the build image;
var buildImageIntervalMs = 3600000; //3600000 ms = 1 hour


//use this to stop the screen from updating automatically e.g. if you manually refresh it.
var enableAutoUpdate = true;


//The url for the list of all builds on the left hand side of the screen
var buildsUrl = proxy + teamCityUrl + '/guestAuth/app/rest/builds?locator=running:any,branch:branched:any,count:20';

//The url for the list of build types (used for mapping the build id (e.g. bt11) to the name (e.g. Website Tests)
var buildTypesUrl = proxy + teamCityUrl + '/guestAuth/app/rest/buildTypes';

//The url for the status of the build on the main branch
var buildStatusUrl = proxy + teamCityUrl + '/guestAuth/app/rest/builds/branch:' + mainBranch + ',running:any,canceled:any';


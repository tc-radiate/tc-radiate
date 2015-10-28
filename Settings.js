var Settings = {
    //The url that points to team city
    teamCityUrl: 'http://tclive:8111',

    //The main branch to show the master build status on the right hand panel on the screen
    mainBranch: 'develop',

    //Proxy to handle the cross domain ajax request.
    // This will need to be hosted on the relevant server e.g. proxy-node.js on Node.js or proxy-aspnet.ashx on IIS
    // You could write your own proxy just so long as it is hosted form the same domain as the rest of the app
    proxy: 'proxy-aspnet.ashx?url=',

    // If your TeamCity is set up for guest access, you can just use it. Otherwise, the moment that tc-radiate sends first request to TC, TC will
    // ask the user for basic http credentials. Your browser may even offer you to save them.
    useTeamCityGuest: true,

    //How often to call the TeamCity webservices and update the screen
    checkIntervalMs: 5000, //5000 ms = 5 seconds

    //How often to refresh the build image;
    buildImageIntervalMs: 3600000, //3600000 ms = 1 hour

    //use this to stop the screen from updating automatically e.g. if you manually refresh it.
    enableAutoUpdate: true,
}

//Allow the settings to be overridden by querystring parameters
//(url parameters are currently only treated as strings)
jQuery.extend(Settings, UrlParams);

var authType = Settings.useTeamCityGuest ? 'guestAuth' : 'httpAuth';

//----------------------
// TEAM CITY URLS
//----------------------
//The url for the list of all builds on the left hand side of the screen
Settings.buildsUrl = Settings.proxy + Settings.teamCityUrl + '/'+authType+'/app/rest/builds?locator=running:any,branch:branched:any,count:20';

//The url for the list of build types (used for mapping the build id (e.g. bt11) to the name (e.g. Website Tests)
Settings.buildTypesUrl = Settings.proxy + Settings.teamCityUrl + '/'+authType+'/app/rest/buildTypes';

//The url for the status of the build on the main branch
Settings.buildStatusUrl = Settings.proxy + Settings.teamCityUrl + '/'+authType+'/app/rest/builds/branch:' + Settings.mainBranch + ',running:any,canceled:any';
var Settings = {
    //The url that points to team city
    teamCityUrl: 'https://ci.travcorpservices.com',

    //The main branch to show the master build status on the right hand panel on the screen. Leave empty to show the first failed one.
    mainBranch: '',

    //Proxy to handle the cross domain ajax request.
    // This will need to be hosted on the relevant server e.g. proxy-node.js on Node.js or proxy-aspnet.ashx on IIS
    // You could write your own proxy just so long as it is hosted form the same domain as the rest of the app
    proxy: '',

    // If your TeamCity is set up for guest access, you can just use it. Otherwise, the moment that tc-radiate sends first request to TC, TC will
    // ask the user for basic http credentials. Your browser may even offer you to save them.
    useTeamCityGuest: false,

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

Settings.restApiBaseUrl = Settings.proxy + Settings.teamCityUrl + '/' + authType + '/app/rest';
//The url for the list of all builds on the left hand side of the screen
Settings.buildsUrl = Settings.restApiBaseUrl + '/builds?locator=running:any,branch:branched:any,count:20';

//The url for the list of build types (used for mapping the build id (e.g. bt11) to the name (e.g. Website Tests)
Settings.buildTypesUrl = Settings.restApiBaseUrl + '/buildTypes';

function getBuildStatusUrlForBranch(branchName) {
    return Settings.restApiBaseUrl + '/builds/branch:' + branchName + ',running:any,canceled:any';
}

function getBuildStatusUrlForBuildId(buildId) {
    return Settings.restApiBaseUrl + '/builds/id:' + buildId;
}
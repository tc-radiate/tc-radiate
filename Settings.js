var DefaultSettings = {
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

    //How often to refresh the whole page in order to update the application (to get all the latest changes without having to come to the monitor and refresh).
    // Set to [0/undefined/null] to disable just this. Use enableAutoUpdate to disable this and any data updates.
    appUpdateIntervalMs: 1 /*hr*/ * 60 * 60 * 1000,

    //How often to call the TeamCity webservices and update the data on the screen
    dataUpdateIntervalMs: 30/*sec*/ * 1000,

    //How often to refresh the build image;
    buildImageIntervalMs: 15/*min*/ * 60 * 60 * 1000,

    //use this to stop the screen from updating automatically at all (disables both appUpdateIntervalMs and dataUpdateIntervalMs). You will need to manually refresh the page to get new data.
    enableAutoUpdate: true,

    //Only show builds for branches that satisfy the predicate
    branchFilter: function(branch) {
        return (
            (branch.buildType.projectName != "Tour Itinerary Portal" 
                || [
                    "aws-uat :: Create stack", 
                    "aws-uat :: Deploy", 
                    "aws-uat :: Delete stack"
                ].indexOf(branch.buildType.name) == -1) // Ignore TIP UAT, as the peering VPS infrastructure has not been set up
            && (branch.buildType.projectName != "Single Sign On" 
                || [
                    "Run BDD tests on develop branch"
                ].indexOf(branch.buildType.name) == -1) // Ignore SSO E2E tests, as they are not reliable. Fix and unignore!
            && (branch.buildType.projectName != "iTROPICS" 
                || [
                    "AWS Deploy QA"
                ].indexOf(branch.buildType.name) == -1) // Ignore iTropics QA deployment, as the environment is not ready
            && (
                !branch.name /* No branch name is there for builds with no VCS roots at all, or when 'Branch specification' is left empty (e.g. when not using feature branches at all)*/
                || [
                    "<default>"/*This branch name is used for the default builds, when there are multiple VCS roots with different branches (e.g. source and config files are in different repos) */,
                    "master",
                    "refs/heads/master" /* Long Git 'refs/...' names are used when 'Branch specification' doesn't have a '*' and paretheses are also not being used to mark the 'Logical branch name' - see https://confluence.jetbrains.com/display/TCD9/Working+with+Feature+Branches#WorkingwithFeatureBranches-Logicalbranchname */,
                    "develop",
                    "refs/heads/develop"
                ].indexOf(branch.name) > -1
            )
        );
    }
};

var Settings = DefaultSettings;

var queryString = Utils.getObjectFromQueryString();
if (queryString.teamCityUrl)
    Settings.teamCityUrl = queryString.teamCityUrl;
else
    history.replaceState(null, '', '?' + 'teamCityUrl=' + Settings.teamCityUrl + (location.search ? '&' + location.search.substr(1):'')); // Put the TeamCity url to the querystring - a cheap way of advertising to savvy users that they can connect to a different instance, and that they can have each tab connected to a different one

//Allow the settings to be overridden by querystring parameters
//(url parameters are currently only treated as strings)
jQuery.extend(Settings, UrlParams);

var authType = Settings.useTeamCityGuest ? 'guestAuth' : 'httpAuth';

//----------------------
// TEAM CITY URLS
//----------------------

Settings.teamCityBaseUrl = Settings.proxy + Settings.teamCityUrl;
Settings.restApiBaseUrl = Settings.teamCityBaseUrl + '/' + authType + '/app/rest';
//The url for the list of all builds on the left hand side of the screen
Settings.buildsUrl = Settings.restApiBaseUrl + '/builds?locator=running:any';

//The url for the list of build types (used for mapping the build id (e.g. bt11) to the name (e.g. Website Tests)
Settings.buildTypesUrl = Settings.restApiBaseUrl + '/buildTypes';

function getBuildStatusUrlForBranch(branchName) {
    return Settings.restApiBaseUrl + '/builds/branch:' + branchName + ',running:any,canceled:any';
}

function getBuildStatusUrlForBuildId(buildId) {
    return Settings.restApiBaseUrl + '/builds/id:' + buildId;
}

function getAppStorageKey(storageKey) {
    return Settings.teamCityUrl + '#' + storageKey; // Add the URL we're working against, so that it doesn't mix setting when this monitor is open from a local .html file (at least in Chrome, files in the same folder share their localStorage space).
}

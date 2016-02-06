var BuildScreenViewModel = function () {
    var self = this;

    function getNewDataModel() {
        var buildTypes = (function () {
            var isResultUpdate = false;
            var buildTypesFromApi = ko.observable({ isLoadingPlaceholder: true });

            var returnValue = ko.computed({
                read: function () {
                    if (!isResultUpdate) {
                        $.ajax({
                            dataType: "json",
                            url: Settings.buildTypesUrl,
                            xhrFields: { withCredentials: true }
                        }).always(function (data, textStatus, xhr) {
                            try {
                                isResultUpdate = true;
                                buildTypesFromApi(Utils.getErrorFromAjaxAlways.apply(this, arguments) || xhr.responseJSON.buildType);
                            } finally {
                                isResultUpdate = false;
                            }
                        })
                        ;
                    }

                    return buildTypesFromApi().isLoadingPlaceholder || buildTypesFromApi().isError ? buildTypesFromApi() : _(buildTypesFromApi()).map(function (buildTypeFromApi) {
                        buildTypeFromApi.branches = getBranchesForBuildTypeObservable(buildTypeFromApi);
                        return buildTypeFromApi;
                    });
                },
                deferEvaluation: true
            });

            returnValue.update = function() {
                buildTypesFromApi([]);
            };

            return returnValue;
        })();

        function getBranchesForBuildTypeObservable(buildType) {
            var branchesFromApi = ko.observable({ isLoadingPlaceholder: true });

            var isResultUpdate = false;
            var branchesUnfiltered = ko.computed({
                read: function () {
                    if (!isResultUpdate) {
                        $.ajax({
                            dataType: "json",
                            url: Settings.buildTypesUrl + '/id:(' + buildType.id + ')' + '/branches?' + Utils.getTsQSParam(),
                            xhrFields: { withCredentials: true }
                        }).always(function (data) {
                            try {
                                isResultUpdate = true;
                                var branches = [];
                                // Sadly, we don't get information from '/branches?' whether there are any 'no-branch' builds on this config (such builds can only be queried by branched:false, since they don't have a name). So, we add a fake entry here. Perhaps in future we could query the configuration.
                                if (data.branch && data.branch.length === 1) // The entry needs to be conditional, because otherwise we will show very old builds for the jobs that only at some point started using the 'Branch specification'. This is because 'Branch specification' respects the expiry of 'Active branch' (see https://confluence.jetbrains.com/display/TCD9/Working+with+Feature+Branches#WorkingwithFeatureBranches-Activebranches ) and old 'no-branch' builds don't, so they would stay visible forever, despite being dead. If we queried the configuration we'd know for sure, but for now, we know that when the call to '/branches?' returns more than one branch, it's a sign of using the 'Branch specification' which seems to cover all our cases.
                                    branches.push({ isNoBranchPlaceHolder: true });
                                branches = branches.concat(data.branch);
                                branchesFromApi(Utils.getErrorFromAjaxAlways.apply(this, arguments) || branches);
                            } finally {
                                isResultUpdate = false;
                            }
                        });
                    }

                    return branchesFromApi().isLoadingPlaceholder || branchesFromApi().isError ? branchesFromApi() : branchesFromApi().map(function (branchFromApi) {
                            branchFromApi.buildType = buildType;
                            return branchFromApi;
                        })
                        .map(function (branchFromApi) {
                            branchFromApi.builds = getBuildsForBranchObservable(branchFromApi);
                            return branchFromApi;
                        })
                    ;
                }
            });
            return ko.computed({
                read: function() {
                    return branchesUnfiltered().isLoadingPlaceholder || branchesUnfiltered().isError ? branchesUnfiltered() : branchesUnfiltered()
                        .filter(Settings.branchFilter || function () { return true; })
                        .filter(function(branch) {
                            return _(thisClientBranchFilterExcludeFunctions()).any(function(shouldExclude) { return shouldExclude(branch); }) === false;
                        })
;
                },
                deferEvaluation: true,
            });
        }

        function getBuildsForBranchObservable(branch) {
            var buildsFromApi = ko.observable({ isLoadingPlaceholder: true });

            var isResultUpdate = false;
            var builds = ko.computed({
                read: function () {
                    function ajaxLastBuild(nonRunningOnly) {
                        return $.ajax({
                            dataType: "json",
                            url: Settings.restApiBaseUrl + '/builds?locator=running:'+(nonRunningOnly ? 'false' : 'any')+',buildType:(id:(' + branch.buildType.id + ')),branch(' + (branch.isNoBranchPlaceHolder ? 'branched:false' : ('name:(' + branch.name + ')')) + '),count:1&fields=build(id,buildTypeId,number,status,state,running,percentageComplete,branchName,href,webUrl,startDate,finishDate)' + Utils.getTsQSParam(),
                            xhrFields: { withCredentials: true }
                        });
                    }
                    if (!isResultUpdate) {
                        ajaxLastBuild().always(function (responseDataWhereRunningIsAny) {
                            var error = Utils.getErrorFromAjaxAlways.apply(this, arguments);
                            var buildsWhereRunningIsAny = responseDataWhereRunningIsAny.build || [];
                            if (error || !responseDataWhereRunningIsAny.build || !responseDataWhereRunningIsAny.build[0] || !responseDataWhereRunningIsAny.build[0].running) {
                                try {
                                    isResultUpdate = true;
                                    buildsFromApi(error || buildsWhereRunningIsAny);
                                } finally {
                                    isResultUpdate = false;
                                }
                            } else { // Build is running. Don't triumph yet. Look for the previous one, it could be red.
                                ajaxLastBuild(/*nonRunningOnly:*/true).always(function (buildsWhereRunningIsFalse) {
                                    try {
                                        isResultUpdate = true;
                                        buildsFromApi(Utils.getErrorFromAjaxAlways.apply(this, arguments) || (buildsWhereRunningIsFalse.build || []).concat(buildsWhereRunningIsAny));
                                    } finally {
                                        isResultUpdate = false;
                                    }
                                });
                            }
                        });
                    }

                    return buildsFromApi().isLoadingPlaceholder || buildsFromApi().isError ? buildsFromApi() : ko.utils.arrayMap(buildsFromApi(), function (build) {
                        // this is just a trick to prevent ko.mapping from evaluating the investigations observable. TODO get rid of ko.mapping (used underneath this._super() in the SingleBuildViewModel), which evaluates our computeds immediately, creating a cyclic dependency on the build object, and causing an infinite loop when request for investigations comes back, by triggering uptade of builds.
                        var investigationsComputed;
                        build.investigations = function() {
                                return (investigationsComputed || (investigationsComputed = build.status === 'SUCCESS' ? ko.observable([]) : getInvestigationsForBuildType(build.buildTypeId)))();
                            };
                        build.investigations.isInvestigated = function () { return investigationsComputed && investigationsComputed.isInvestigated && investigationsComputed.isInvestigated(); };
                        return new SingleBuildViewModel(build, buildTypes());
                    });
                },
                deferEvaluation: true
            });
            return builds;
        }

        var projects;

        var allBuildsOfAllProjectsOrPlaceholders = ko.computed({
            read: function () {
                return projects().isLoadingPlaceholder || projects().isError ? [projects()] : (_(projects()).chain()
                    .map(function (project) {
                        return project.buildTypes.isLoadingPlaceholder ? project.buildTypes : _(project.buildTypes).map(function (buildType) {
                            return buildType.branches().isLoadingPlaceholder || buildType.branches().isError ? buildType.branches() : _(buildType.branches()).map(function (branch) {
                                return branch.builds().isLoadingPlaceholder || branch.builds().isError ? branch.builds() : _(branch.builds()).map(function (build) { return (build.investigations && build.investigations().isLoadingPlaceholder || build.investigations().isError ? build.investigations() : build); });
                            });
                        });
                    })
                    .flatten()
                    .sortBy(function (build) { return (build.isLoadingPlaceholder || build.isError) ? 6 : (build.status() !== 'SUCCESS' ? (build.isRunning() ? 5 : ((build.investigations && build.investigations.isInvestigated && build.investigations.isInvestigated()) === false ? 4 : 3)) : (build.isRunning() ? 2 : 1)) + '_' + build.startDate(); })
                    .reverse()
                    .value());
            },
            deferEvaluation: true
        });
        return {
            projects: projects = ko.computed({
                read: function () {
                    return buildTypes().isLoadingPlaceholder || buildTypes().isError ? buildTypes() : _(buildTypes()).chain().groupBy(function (buildType) {
                        return buildType.projectId;
                    }).mapObject(function (buildTypes, projectId) {
                        return {
                            projectId: projectId,
                            projectName: buildTypes[0].projectName,
                            buildTypes: buildTypes
                        };
                    })
                        .value()
                    ;
                },
                deferEvaluation: true
            }),
            allBuildsOfAllProjectsOrPlaceholders: allBuildsOfAllProjectsOrPlaceholders,
            allLoadedBuildsOfAllProjects: ko.computed({
                    read: function () {
                        return allBuildsOfAllProjectsOrPlaceholders().filter(function (build) { return !build.isLoadingPlaceholder && !build.isError; });
                    },
                    deferEvaluation: true
                }),
            isInitializing: ko.computed({
                read: function () {
                    return !!_(allBuildsOfAllProjectsOrPlaceholders()).findWhere({ isLoadingPlaceholder: true });
                },
                deferEvaluation: true
            }),
            errorsInfo: ko.computed({
                read: function () {
                    var allErrors = _(allBuildsOfAllProjectsOrPlaceholders()).where({ isError: true });
                    if (allErrors.length === 0)
                        return null;
                    if (_(allErrors).any(function (error) { return error.errorText === "" || error.textStatus === 'timeout' || (error.xhr && (error.xhr.status === 401 || error.xhr.status === 403 || error.xhr.status >= 500)); }))
                        return { code: 'CONNECTION_ERROR' };
                    else
                        return { allErrors: allErrors };
                },
                deferEvaluation: true
            })
        };
    };

    var currentViewDataModel = ko.observable(getNewDataModel());

    self.isFirstLoad = ko.computed(function() {
        return currentViewDataModel().isInitializing();
    });
    self.hasConnectionWorked = ko.observable(false);

    var thisClientBranchFilterExcludeProperties = Utils.getObservableArrayBackedByStorage(/*storage:*/ window.localStorage, /*storageKey:*/ getAppStorageKey('buildFilterExcludeProperties'));
    var thisClientBranchFilterExcludeFunctions = ko.computed(function () {
        return _(thisClientBranchFilterExcludeProperties()).map(function(branchToExcludeProps) {
            return function(branchToTest) {
                return ((!branchToExcludeProps.branchName && !branchToTest.name) || (branchToTest.name === branchToExcludeProps.branchName)) && branchToTest.buildType.id === branchToExcludeProps.buildTypeId;
            };
        });

    });

    self.excludedBuilds = {
        get length() { return thisClientBranchFilterExcludeProperties().length },
        push: function (build) {
            thisClientBranchFilterExcludeProperties.push({
                branchName: build.branchName && build.branchName(),
                buildTypeId: build.buildTypeId()
            });
        },
        removeAll: function () {
            thisClientBranchFilterExcludeProperties.removeAll();
        }
    };

    self.builds = ko.computed({
        read: function () {
            return currentViewDataModel().allLoadedBuildsOfAllProjects();
        },
        deferEvaluation: true
    });

    self.mainBuild = (function () {
        var isResultUpdate = false;
        var lastMainBuild = undefined;

        var mainBuildFromApi = ko.observable();

        var timeOfLastNotifyOfMainBuild = Utils.getObservableBackedByStorage(
            /*storage:*/ window.sessionStorage, // So that refreshing the same tab doesn't makes us notify again (e.g. play the sound), but if we restart the browser or use a new tab, we get fresh notifications.
            /*storageKey:*/ 'timeOfLastNotifyOfMainBuild'
            );

        var mainBuildUrl = ko.computed({
            read: function() {
                var url = null;
                if (Settings.mainBranch)
                    url = getBuildStatusUrlForBranch(Settings.mainBranch);
                else if (!currentViewDataModel().isInitializing()) {
                    var build = currentViewDataModel().allBuildsOfAllProjectsOrPlaceholders()[0];
                    if (build && !build.isError)
                        url = getBuildStatusUrlForBuildId(build.id());
                }
                return url;
            },
            deferEvaluation: true,
        });

        ko.computed({
            read: function () {
                if (mainBuildUrl() && !isResultUpdate) {
                    $.ajax({
                        dataType: "json",
                        url: mainBuildUrl() + '?' + Utils.getTsQSParam(),
                        xhrFields: { withCredentials: true }
                    }).always(function (build, status, xhr) {
                        try {
                            isResultUpdate = true;

                            var error = Utils.getErrorFromAjaxAlways.apply(this, arguments);
                            if (error) {
                                mainBuildFromApi(undefined); // TODO show the error
                                return;
                            }

                            if (lastMainBuild === xhr.responseText)
                                return;
                            lastMainBuild = xhr.responseText;

                            build.isNew = !timeOfLastNotifyOfMainBuild() || (build.startDate > timeOfLastNotifyOfMainBuild());

                            timeOfLastNotifyOfMainBuild(build.startDate);

                            var mainBuildModel = ko.mapping.fromJS(build, {
                                create: function (options) {
                                    return new MainBuildViewModel(options.data);
                                }
                            });

                            mainBuildModel.investigations = getInvestigationsForBuildType(build.buildTypeId);


                            mainBuildModel.changes = (function () {
                                var changesFromApi = ko.observable([]);
                                var isResultUpdate = false;

                                return ko.computed({
                                    read: function () {
                                        if (!isResultUpdate) {
                                            $.ajax({
                                                dataType: "json",
                                                url: Settings.teamCityBaseUrl + build.changes.href + Utils.getTsQSParam(),
                                                xhrFields: { withCredentials: true }
                                            }).always(function (changesResult) {
                                                try {
                                                    var error = Utils.getErrorFromAjaxAlways.apply(this, arguments);
                                                    if (error) {
                                                        mainBuildFromApi(undefined); // TODO show the error
                                                        return;
                                                    }

                                                    isResultUpdate = true;
                                                    changesFromApi(changesResult.change || []);
                                                } finally {
                                                    isResultUpdate = false;
                                                }
                                            })
                                            ;
                                        }
                                        return changesFromApi();
                                    },
                                    deferEvaluation: true
                                });
                            })();

                            mainBuildFromApi(mainBuildModel);
                        } finally {
                            isResultUpdate = false;
                        }
                    });
                }

                return mainBuildFromApi();
            },
        });

        return mainBuildFromApi;
    })();

    function getInvestigationsForBuildType(buildTypeId) {
        var refreshTrigger = ko.observable();
        var investigationsFromApi = ko.observable({ isLoadingPlaceholder: true });
        var isResultUpdate = false;
        var observableInvestigations = ko.computed({
            read: function () {
                refreshTrigger(); // This add dependency on the refresh trigger, so that we recompute again when it fires.
                if (!isResultUpdate) {
                    $.ajax({
                        dataType: "json",
                        url: Settings.restApiBaseUrl + '/investigations?locator=buildType:(id:(' + buildTypeId + '))' + Utils.getTsQSParam(),
                        xhrFields: { withCredentials: true },
                    }).always(function (data) {
                        try {
                            isResultUpdate = true;
                            investigationsFromApi(Utils.getErrorFromAjaxAlways.apply(this, arguments) || data.investigation || []);
                        } finally {
                            isResultUpdate = false;
                        }
                    });
                }

                return investigationsFromApi();
            },
            deferEvaluation: true
        });
        observableInvestigations.isInvestigated = ko.computed({
            read: function() {
                return !!_(observableInvestigations()).filter(function (investigation) { return investigation.state !== 'GIVEN_UP'; }).length;
            },
            deferEvaluation: true,
        });
        observableInvestigations.refresh = function () { refreshTrigger.notifySubscribers(); };
        return observableInvestigations;
    }


    self.audio = {
        volume: Utils.getObservableBackedByStorage(window.localStorage, 'audio.volume', 1),
        isMuted: Utils.getObservableBackedByStorage(window.localStorage, 'audio.isMuted', false)
    };

    var imageUpdateTickSource = ko.observable();

    self.getImageForStatus = function(status) {
        return ko.computed(function() {
            imageUpdateTickSource();
            return Images[status].getRandom();
        });
    }

    function updateData() {
        var newDataModel = getNewDataModel();
        newDataModel.isInitializing.subscribe(function (isInitializing) {
            if (!isInitializing) {
                currentViewDataModel(newDataModel);
                self.mainBuild() && self.mainBuild().investigations.refresh();
                ensureDataAutoUpdate();
            }
        });
    }

    function ensureDataAutoUpdate() {
        if (Settings.enableAutoUpdate)
            setTimeout(updateData, Settings.dataUpdateIntervalMs);
    }

    self.errorsInfo = ko.computed({
        read: function() {
            return currentViewDataModel().errorsInfo();
        },
        deferEvaluation: true
    });

    self.init = function () {
        setInterval(function () { imageUpdateTickSource(!imageUpdateTickSource()); }, Settings.buildImageIntervalMs);
        ensureDataAutoUpdate();
        if (Settings.enableAutoUpdate && Settings.appUpdateIntervalMs)
            setTimeout(function() { location.reload(/*withoutCache*/ true); }, Settings.appUpdateIntervalMs);
    };

    self.init();
};

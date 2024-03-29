'use strict';

angular.module('projekteApp')

    .controller('showHideMapCtrl', ['$scope', function($scope) {

       /* // define filter for week days
        $scope.setDateFriday = dateFilter.setDateFriday;
        $scope.setDateSaturday =  dateFilter.setDateSaturday;
        $scope.setDateSunday = dateFilter.setDateSunday;
        $scope.getDatetime = dateFilter.getDatetime;

        $scope.showFriday = true;
        $scope.showSaturday = true;
        $scope.showSunday = true;*/

        /*if ($scope.getDatetime.valueOf() === $scope.setDateFriday.valueOf())
        {
            $scope.showFriday = true;
            $scope.showSaturday = false;
            $scope.showSunday = false;
            $scope.startbuttonLink = '#freitagstart';
        }
        else if ($scope.getDatetime.valueOf() === $scope.setDateSaturday.valueOf())
        {
            $scope.showFriday = true;
            $scope.showSaturday = true;
            $scope.showSunday = false;
            $scope.startbuttonLink = '#samstagstart';
        }
        else if ($scope.getDatetime.valueOf() === $scope.setDateSunday.valueOf())
        {
            $scope.showFriday = true;
            $scope.showSaturday = true;
            $scope.showSunday = true;
            $scope.startbuttonLink = '#sonntagstart';
        }
        else {
            $scope.showFriday = true;
            $scope.showSaturday = true;
            $scope.showSunday = true;
            $scope.startbuttonLink = '#content';
        }*/

        /* toggle visibility of map */

        $scope.showmap = true;
        $scope.startbuttonLink = '#content';
        $scope.buttonText = 'Auf die Jagd';

        $scope.toggleMap = function(){
            if ($scope.showmap === true)
            {
                $scope.buttonText = 'Zur Karte';
                $scope.showmap = false;
                $scope.hideTitel = 'hide-titel';

            }
            else
            {
                $scope.buttonText = 'Auf die Jagd';
                $scope.showmap = true;
            }
        };

    }]) 

    .controller('dataFeedCtrl', ['$scope', 'dataService', '$sce', function ($scope, dataService, $sce) {

        /* load the content from dataService */

        $scope.name = dataService.name;

        $scope.parsedEntries = [];
        $scope.loading = true;
        $scope.httpStatus = 0;
        $scope.LoadRequest = dataService.loadSpreadsheetData();
        dataService.loadSpreadsheetData()
            .then(function(results){
                for (var i = 0; i < results.length; i++){
                    $scope.parsedEntries.push({
                        titel: results[i].gsx$titel.$t,
                        inhalt: results[i].gsx$inhalt.$t,
                        images: results[i].gsx$images.$t,
                        link: results[i].gsx$link.$t,
                        einleitung: results[i].gsx$einleitung.$t,
                        einleitungtitel: results[i].gsx$einleitungtitel.$t,
                        anker: results[i].gsx$anker.$t,

                    });
                    }

                }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });
        
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

    }])

    .controller('mapCtrl', [ '$scope', 'dataService', 'screenSize', '$sce',
        function ($scope, dataService, screenSize, $sce) {


            $scope.name = dataService.name;

            $scope.parsedEntries = [];
            $scope.httpStatus = 0;
            $scope.LoadRequest = dataService.loadSpreadsheetData();
            dataService.loadSpreadsheetData()
              .then(function(results){
                  for (var i = 0; i < results.length; i++){
                      $scope.parsedEntries.push({
                          einleitung: results[i].gsx$einleitung.$t,
                          einleitungtitel: results[i].gsx$einleitungtitel.$t

                      });
                  }

              }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

        /* set the map positions on mobile and desktop */

        if (screenSize.is('xs, sm'))
        {
            // on mobile
            $scope.latitude =  47.558;
            $scope.longitude = 7.593;
            $scope.zoom = 14;
        }
        else
        {
            // on desktop

            $scope.latitude =  47.5575;
            $scope.longitude = 7.59923;
            $scope.zoom = 15;
        }

        /* get the data for the markers array from the dataService */

        $scope.markers = [];

        $scope.httpStatus = 0;
        $scope.LoadRequest = dataService.loadSpreadsheetData();
        dataService.loadSpreadsheetData()

        // Code here will be linted with JSHint.
        /* jshint ignore:start */


        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                $scope.markers.push({
                    lat: parseFloat(results[i].gsx$latitude.$t),  //use parseFloat() to convert string to integer
                    lng: parseFloat(results[i].gsx$longitude.$t),
                    getMessageScope: function () { return $scope; },
                    message: '<h2>' + results[i].gsx$titelkarte.$t + '</h2><p>' + results[i].gsx$beschreibungkarte.$t + '</p><a href="#' + results[i].gsx$anker.$t + '" target="_self" ng-click="toggleMap()">Weiterlesen »</a>',
                    icon: eval('localIcons' + '.' + results[i].gsx$anker.$t) //use eval() to convert string to variable
                    //layer: results[i].gsx$kategorie.$t
                });

            }
/*            // define filter for week days
            $scope.setDateFriday = dateFilter.setDateFriday;
            $scope.setDateSaturday =  dateFilter.setDateSaturday;
            $scope.setDateSunday = dateFilter.setDateSunday;
            $scope.getDatetime = dateFilter.getDatetime;*/

            // $scope.markers = $filter('filter')($scope.markers, {tag: '!Sonntag'});

           /* if ($scope.getDatetime.valueOf() === $scope.setDateFriday.valueOf())
            {
                $scope.markers = $filter('filter')($scope.markers, {tag: 'Freitag'});
            }
            else if ($scope.getDatetime.valueOf() === $scope.setDateSaturday.valueOf())
            {
                $scope.markers = $filter('filter')($scope.markers, {tag: 'Samstag'});

            }
            else if ($scope.getDatetime.valueOf() === $scope.setDateSunday.valueOf())
            {
                $scope.markers = $filter('filter')($scope.markers, {tag: 'Sonntag'});
            }*/
        });

            /* jshint ignore:end */
            // Code here will be linted with JSHint.



        /* define the icon style for the map markers */

        var localIcons = {
            versteck1: {
                iconUrl: 'images/markers/schnitzel1.svg',
                shadowUrl: 'images/markers/dropshadow.png',
                iconSize:     [40, 61], // size of the icon
                shadowSize:   [36, 21], // size of the shadow
                iconAnchor:   [18, 57], // point of the icon which will correspond to marker's location
                shadowAnchor: [-2, 17],  // the same for the shadow
                popupAnchor:  [2, -62] // point from which the popup should open relative to the iconAnchor
            },
            versteck2: {
                iconUrl: 'images/markers/schnitzel2.svg',
                shadowUrl: 'images/markers/dropshadow.png',
                iconSize:     [40, 61], // size of the icon
                shadowSize:   [36, 21], // size of the shadow
                iconAnchor:   [18, 57], // point of the icon which will correspond to marker's location
                shadowAnchor: [-2, 17],  // the same for the shadow
                popupAnchor:  [2, -62] // point from which the popup should open relative to the iconAnchor
            },
            versteck3: {
                iconUrl: 'images/markers/schnitzel3.svg',
                shadowUrl: 'images/markers/dropshadow.png',
                iconSize:     [40, 61], // size of the icon
                shadowSize:   [36, 21], // size of the shadow
                iconAnchor:   [18, 57], // point of the icon which will correspond to marker's location
                shadowAnchor: [-2, 17],  // the same for the shadow
                popupAnchor:  [2, -62] // point from which the popup should open relative to the iconAnchor
            },
            versteck4: {
                iconUrl: 'images/markers/schnitzel4.svg',
                shadowUrl: 'images/markers/dropshadow.png',
                iconSize:     [40, 61], // size of the icon
                shadowSize:   [36, 21], // size of the shadow
                iconAnchor:   [18, 57], // point of the icon which will correspond to marker's location
                shadowAnchor: [-2, 17],  // the same for the shadow
                popupAnchor:  [2, -62] // point from which the popup should open relative to the iconAnchor
            },
            versteck5: {
                iconUrl: 'images/markers/schnitzel5.svg',
                shadowUrl: 'images/markers/dropshadow.png',
                iconSize:     [40, 61], // size of the icon
                shadowSize:   [36, 21], // size of the shadow
                iconAnchor:   [18, 57], // point of the icon which will correspond to marker's location
                shadowAnchor: [-2, 17],  // the same for the shadow
                popupAnchor:  [2, -62] // point from which the popup should open relative to the iconAnchor
            }
        };

        angular.extend($scope, {


            layercontrol: {
                icons: {
                    uncheck: 'fa fa-toggle-off',
                    check: 'fa fa-toggle-on'
                }
            },


            layers: {
                baselayers: {
                    MapBoxTile: {
                        name: 'Basel in Schwarz Weiss',
                        type: 'xyz',
                        url: 'https://a.tiles.mapbox.com/v4/felixmichel.me37n7fa/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmVsaXhtaWNoZWwiLCJhIjoiZWZrazRjOCJ9.62fkOEqGMxFxJZPJuo2iIQ'
                    },
                    TonerMap: {
                        name: 'Basel in Schwarz Weiss',
                        type: 'xyz',
                        url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png'
                    },
                    openStreetMap: {
                        name: 'ganz normale Karte',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                },

                // define the layers
                overlays: {
                    Essen: {
                        type: 'group',
                        name: 'Essen',
                        visible: true
                    },
                    Erleben: {
                        type: 'group',
                        name: 'Erleben',
                        visible: true
                    },
                    Trinken: {
                        type: 'group',
                        name: 'Trinken',
                        visible: true
                    },
                    Tanzen: {
                        type: 'group',
                        name: 'Tanzen',
                        visible: true
                    },
                    Einkaufen: {
                        type: 'group',
                        name: 'Einkaufen',
                        visible: true
                    }
                }
            },
            
            // center position
            basel: {
                lat: $scope.latitude,
                lng: $scope.longitude,
                zoom: $scope.zoom
            },

            defaults: {
                scrollWheelZoom: false
            },

            // function to toggle different layers
            toggleLayer: function(type) {
                if (type === "all") {
                    for (var key in $scope.layers.overlays) {

                        if ($scope.checked === true) {
                            $scope.layers.overlays[key].visible = true;
                        }
                        else {
                            $scope.layers.overlays[key].visible = false;
                        }

                    }
                }
                else
                {
                    $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
                }
            },
            events: {
            }

        });

    }]);
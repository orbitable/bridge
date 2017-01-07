/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

var angular = require('angular');
var bowser = require('bowser');

global.missionControl = 'ec2-34-196-102-11.compute-1.amazonaws.com:8000';

angular.module('bridge.controllers', []);
angular.module('bridge.controllers.auth', []);
angular.module('bridge.services', [require('angular-resource')]);
angular.module('bridge.directives', []);
angular.module('bridge.filters', []);

angular.module('bridge', [
    'bridge.services',
    'bridge.controllers',
    'bridge.controllers.auth',
    'bridge.directives',
    'bridge.filters',
    require('angular-cookies'),
    require('angular-route')
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/s/', {
      templateUrl: 'partials/simulation-list.html',
      controller: 'simulationListController'
    })
    .when('/s/:simulationId', {
      templateUrl: 'partials/simulation.html',
      controller: 'simulationController'
    })
    .when('/u/:userId', {
      templateUrl: 'partials/simulation-list.html',
      controller: 'simulationListController'
    })
    .when('/u/:userId/:simulationId', {
      templateUrl: 'partials/simulation.html',
      controller: 'simulationController'
    })
    .otherwise({
      redirectTo: '/s/random'
    });
  }])
  .run(function() {
    if (bowser.firefox || (bowser.msie && bowser.version < 11)) {
      // Show un supported modal
      $('#unsupported-browser').modal('show');

      // Hide all the things
      $('#app-container').hide();
    }

  });

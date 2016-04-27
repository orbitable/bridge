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

angular.module('bridge.directives')
  .directive('unit', ['Units', function(Units) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function(data) {
          //convert data from view format to model format
          switch (attrs.unit) {
            case 'distance':
              return Units.distanceToSim(data);
            case 'mass':
              return Units.massToSim(data);
            case 'time':
              return Units.timeToSim(data);
            default:
              return data;
          }
        });

        ngModelController.$formatters.push(function(data) {
          //convert data from model format to view format
          switch (attrs.unit) {
            case 'distance':
              return Units.distanceFromSim(data);
            case 'mass':
              return Units.massFromSim(data);
            case 'time':
              return Units.timeFromSim(data);
            default:
              return data;
          }
        });
      }
    };
  }]);

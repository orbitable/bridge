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

angular.module('bridge.filters')
  .filter('distance', function($filter){
      var factor = {
        m:  1,
        km: 1000,
        au: 149600000000
      };

      return function(distance, unit){
        // if distance is null or undef, pass through.
        // call built in number filter to format new value nicely
        return (distance == null) ? distance : $filter('number')(distance / factor[unit]) +" "+ unit;
      };
  });

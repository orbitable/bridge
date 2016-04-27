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

angular.module('bridge.services')
  .factory('Units', function($resource) {
    return {
      labels: {
        distance: 'm',
        mass: 'kg',
        time: 's',
        speed: 'm/s'
      },
      distanceFromSim: function(d) {
        switch (this.labels.distance) {
          case 'km':
            return d / 1000;
          case 'au':
            return d / 149597870700;
          default:
            return d;
        }
      },
      distanceToSim: function(d) {
        switch (this.labels.distance) {
          case 'km':
            return 1000 * d;
          case 'au':
            return 149597870700 * d;
          default:
            return d;
        }
      },
      massFromSim: function(d) {
        switch (this.labels.mass) {
          case 't':
            return d / 1000;
          case 'M':
            return d / 1988435000000000000000000000000;
          default:
            return d;
        }
      },
      massToSim: function(d) {
        switch (this.labels.mass) {
          case 't':
            return d * 1000;
          case 'M':
            return d * 1988435000000000000000000000000;
          default:
            return d;
        }
      },
      timeFromSim: function(d) {
        switch (this.labels.time) {
          case 'hr':
            return d / (60 * 60);
          case 'yr':
            return d / (60 * 60 * 24 * 365);
          default:
            return d;
        }
      }
    };
  });

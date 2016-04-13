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
  .factory('Scale', function($resource) {
    return {
      height: 100,
      width: 100,
      x:  d3.scale.linear()
                  .domain([-1482671117702, 1482671117702])
                  .range([-this.width, this.width]),

      y: d3.scale.linear()
        .domain([-1482671117702, 1482671117702])
        .range([-this.height, this.height]),

      setBoundingRect:  function(height, width) {
        this.height = height || this.height;
        this.width = width || this.width;

        this.x.range([-this.height, this.height]);
        this.y.range([-this.width, this.width]);
      }
    };
  });

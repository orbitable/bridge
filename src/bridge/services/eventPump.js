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

function EventPump() {
  this.observers = [];
  this.paused = true;
}

EventPump.prototype.register = function(callback) {
  this.observers.push(callback);
  return callback;
};


EventPump.prototype.unregister = function(callback) {
  var index = this.observers.indexOf(callback);

  if (index > -1) {
    this.observers.splice(index, 1);
    return callback;
  }

  return null;
};

EventPump.prototype.pause = function() {
    this.paused = true;
};

EventPump.prototype.step = function (continious,pause) {
  var pump = this;
  continious = continious || false;
  
  if (pause || false) {
    this.simulator.pauseFrame = true;
  }

  var animationLoop = function(timestamp) {
    pump.observers.forEach( function(callback) {
      callback(timestamp);
    });

    if (continious && !pump.paused) {
      window.requestAnimationFrame(animationLoop);
    }
  };

  window.requestAnimationFrame(animationLoop);
};


EventPump.prototype.resume = function() {
  var self = this;
  self.paused = false;

  this.step(true);
};

angular.module('bridge.services')
  .factory('eventPump', function() {
    return new EventPump();
  });

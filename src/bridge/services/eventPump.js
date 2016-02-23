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

EventPump.prototype.resume = function() {
  var self = this;
  self.paused = false;

  var loop = function(timestamp) {
    self.observers.forEach(function(callback) {
      callback(timestamp);
    });

    if (!self.paused) {
      window.requestAnimationFrame(loop);
    }
  };

  window.requestAnimationFrame(loop);
};

angular.module('bridge.services')
  .factory('eventPump', function() {
    return new EventPump();
  });

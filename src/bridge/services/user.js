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
  .factory('User', ['$cookies', '$http', '$q', function($cookies, $http, $q) {

    var USER_COOKIE_KEY = 'orbitable-user';
    var SESSION_COOKIE_KEY = 'orbitable-session';

    // TODO: Get session id and requery for values. Don't store object.
    var userService = {
      current: $cookies.getObject(USER_COOKIE_KEY),
      session: $cookies.getObject(SESSION_COOKIE_KEY),
      host: '//' + global.missionControl,
      registerEndpoint: 'users',
      sessionEndpoint: 'sessions'
    };

    userService.register = register;
    userService.logout   = logout;
    userService.login    = login;

    return userService;

    function register(user) {
      var d = $q.defer();
      var self = this;

      $http.post(self.host + '/' + self.registerEndpoint, user).then(
          function(resp) {
            d.resolve(self.current);
          },
          function(err) {
            d.reject(err);
          });

      return d.promise;
    }

    function login(username, password) {
      var d = $q.defer();
      var self = this;

      $http.post(self.host + '/' + self.sessionEndpoint,
        {username: username, password: password})
          .then(function(resp) {
            self.session  = resp.data;
            self.current = self.session.owner;

            $cookies.putObject(USER_COOKIE_KEY, self.current);
            $cookies.putObject(SESSION_COOKIE_KEY, self.session);

            d.resolve(self.session.owner);
          }, d.reject);

      return d.promise;
    }

    function logout() {
      // Bail if we never were logged in
      if (this.session === null && this.current === null) { return; }

      var d = $q.defer();
      var self = this;

      var deleteValues = function(resolveValue) {
        self.current = null;
        self.session = null;

        $cookies.remove(USER_COOKIE_KEY);
        $cookies.remove(SESSION_COOKIE_KEY);

        d.resolve(resolveValue);
      };

      var path = this.host + '/' + this.sessionEndpoint + '/' + this.session._id;
      $http.delete(path, self.session).then(deleteValues, deleteValues);

      return d.promise;
    }
  }]);

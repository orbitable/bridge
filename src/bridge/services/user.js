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
  .factory('User', ['$http', '$q', function($http, $q) {
      var userService = {
        current:  null,
        session: null,
        host: '//mission-control.orbitable.tech',
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
              self.current = resp.data;
              d.resolve(self.current);
            },
            function(err) {
              console.warn("Failed user registration: ", err);
              d.reject(err); 
            });

        return d.promise;
      }
      
      function login(username, password) {
        var d = $q.defer();
        var self = this;

        $http.post(self.host + '/' + self.sessionEndpoint, {username: username, password: password}).then(
            function(resp) {

              self.session  = resp.data;
              self.current = self.session.owner;

              d.resolve(self.session.owner);
            }, 
            function(err) {
              console.warn("Failed user login: ", err);
              d.reject(err);
            });

        return d.promise;
      }


      function logout() {
        // Bail if we never were logged in
        if (this.session === null && this.current === null) return;

        var d = $q.defer();
        var self = this;

        
        $http.delete(this.host + '/' + this.sessionEndpoint + '/' + this.session._id, self.session).then(
            function(resp) {

              self.current = null;
              self.session = null;

              d.resolve(null);
            },
            function(err) {

              self.current = null;
              self.session = null;

              d.resolve(err);
            });

        return d.promise;
      }
  }]);

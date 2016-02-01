(function() {
  'use strict';

  angular
    .module('Chat.services', [])
    .factory("Auth", Auth)
    .factory("Message", Message)
    .factory("Rooms", Rooms)
    .service("UserService", UserService);

    Auth.$inject = ["$firebaseAuth", "CONFIG"];
    Message.$inject = ["$firebaseArray", "Rooms", "CONFIG", "UserService", "md5", "$q"];
    Rooms.$inject = ["$firebaseArray", "CONFIG"];
    UserService.$inject = ["Auth","$q", "$state", "$ionicLoading", "$rootScope", "CONFIG"];

    function Auth($firebaseAuth, CONFIG){
      var ref = new Firebase(CONFIG.FIREBASE_URL);
      return $firebaseAuth(ref);
    }

    function Message($firebaseArray, Rooms, CONFIG, UserService, md5, $q){
      var selectedRoomId;
      var chatMessagesForRoom;
      var ref = new Firebase(CONFIG.FIREBASE_URL);

      return {
        get     : get,
        remove  : remove,
        send    : send
      }

      function get(roomId) {
        chatMessagesForRoom = $firebaseArray(ref.child('rooms').child(roomId).child('messages').orderByChild("createdAt"));
        return chatMessagesForRoom;
      }

      function remove(chat) {
        chatMessagesForRoom.$remove(chat).then(function (ref) {
          ref.key() === chat.$id; // true item has been removed
        });
      }

      function send(message) {
        var deferred = $q.defer();
        var currentUser = UserService.getProfile();
        if (message) {
          var chatMessage = {
            from_username: currentUser.displayName,
            from_email: currentUser.email,
            content: message,
            createdAt: Firebase.ServerValue.TIMESTAMP
          };
          chatMessagesForRoom.$add(chatMessage).then(function (data) {
            deferred.resolve();
            console.log("message added");
          });
          return deferred.promise;
        }
      }
    }

    function Rooms($firebaseArray, CONFIG){
      var ref = new Firebase(CONFIG.FIREBASE_URL);
      var roomsWithLastMessage = []
      var rooms = $firebaseArray(ref.child('rooms'));

      return {
        all: function () {
          rooms.$loaded().then(function(response){
            angular.forEach(response, function(room){
              ref.child('rooms').child(room.$id).child('messages')
                .orderByChild("createdAt")
                .limitToLast(1)
                .on("child_added", function(snapshot) {
                  room["last_message_content"] = snapshot.val().content;
                });
            })
          });
          return rooms;
        },

        get: function (roomId) {
          return rooms.$getRecord(roomId);
        },

        save: function(room){
          room.createdAt = Firebase.ServerValue.TIMESTAMP;
          room.ownerId = currentUser.id;
          rooms.$add(room);
        }
      }
    }

    function UserService(Auth, $q, $state, $ionicLoading, $rootScope, CONFIG){
      var ref = new Firebase(CONFIG.FIREBASE_URL);

      return {
        createUser: createUser,
        login: login,
        saveProfile: saveProfile,
        getProfile: getProfile
      }

      function createUser(user){
        var deferred = $q.defer();
        var self = this;
        $ionicLoading.show({
          template: 'Signing Up...'
        });
        Auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function (userData) {
          ref.child("users").child(userData.uid).set({
            id: userData.uid,
            email: user.email,
            username: user.username
          });
          $ionicLoading.hide();
          login.call(self, user);
          deferred.resolve();
        }).catch(function (error) {
          alert("Error: " + error);
          $ionicLoading.hide();
        });
        return deferred.promise;
      }

      function login(user){
        var self = this;
        $ionicLoading.show({
          template: 'Signing In...'
        });
        Auth.$authWithPassword({
          email: user.email,
          password: user.password
        }).then(function (authData) {
          $ionicLoading.hide();
          $state.go('tab.rooms');
        }).catch(function (error) {
          alert("Authentication failed:" + error.message);
          $ionicLoading.hide();
        });
      }

      function saveProfile(user){
        localStorage.setItem("chat.current_user", JSON.stringify(user));
      }

      function getProfile(){
        var user = localStorage.getItem("chat.current_user");
        return user && JSON.parse(user);
      }
    }
})();

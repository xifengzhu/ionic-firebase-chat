(function() {
  'use strict';

  angular
    .module('Chat.services', [])
    .factory("Auth", Auth)
    .factory("Message", Message)
    .factory("Rooms", Rooms)
    .service("UserService", UserService)
    .service("FacebookService", FacebookService);

    Auth.$inject = ["$firebaseAuth", "firebase"];
    Message.$inject = ["$firebaseArray", "Rooms", "UserService", "md5", "$q", "firebase"];
    Rooms.$inject = ["$firebaseArray", "UserService", "firebase"];
    UserService.$inject = ["Auth","$q", "$state", "$ionicLoading", "$rootScope", "firebase"];
    FacebookService.$inject = ["$q", "firebase"];

    function Auth($firebaseAuth, firebase){
      return $firebaseAuth(firebase.auth());
    }

    function Message($firebaseArray, Rooms, UserService, md5, $q, firebase){
      var selectedRoomId;
      var chatMessagesForRoom;
      var ref = firebase.database().ref();

      return {
        get     : get,
        remove  : remove,
        send    : send
      }

      function get(roomId) {
        chatMessagesForRoom = $firebaseArray(ref.child('room-messages').child(roomId).orderByChild("createdAt"));
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
            sender_username: currentUser.username,
            sender_email: currentUser.email,
            content: message,
            createdAt: firebase.database.ServerValue.TIMESTAMP
          };
          chatMessagesForRoom.$add(chatMessage).then(function (data) {
            deferred.resolve();
            console.log("message added");
          });
          return deferred.promise;
        }
      }
    }

    function Rooms($firebaseArray, UserService, firebase){
      var currentUser = UserService.getProfile();
      var ref = firebase.database().ref();
      var rooms = $firebaseArray(ref.child('rooms'));

      return {
        all: function () {
          rooms.$loaded().then(function(response){
            angular.forEach(response, function(room){
              ref.child('room-messages').child(room.$id)
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
          room.createdAt = firebase.database.ServerValue.TIMESTAMP;
          room.ownerId = currentUser.id;
          rooms.$add(room);
        }
      }
    }

    function UserService(Auth, $q, $state, $ionicLoading, $rootScope, firebase){
      var ref = firebase.database().ref();

      return {
        createUser: createUser,
        login: login,
        saveProfile: saveProfile,
        getProfile: getProfile,
        trackPresence: trackPresence
      }

      function trackPresence(){
        var currentUser = this.getProfile();
        // Get a reference to my own presence status.
        var connectedRef = ref.child('/.info/connected');
        // Get a reference to the presence data in Firebase.
        var myConnectionsRef = ref.child('/users/' + currentUser.id +'/connected');
        connectedRef.on('value', function(isOnline) {
          if (isOnline.val()) {
            // If we lose our internet connection, we want ourselves removed from the list.
            myConnectionsRef.onDisconnect().remove();
            myConnectionsRef.set(true);
          }
        });
      }


      function createUser(user){
        var deferred = $q.defer();
        var self = this;
        $ionicLoading.show({
          template: 'Signing Up...'
        });
        Auth.$createUserWithEmailAndPassword(user.email, user.password).then(function (userData) {
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
        Auth.$signInWithEmailAndPassword(user.email, user.password).then(function (authData) {
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

    function FacebookService($q, firebase){
      var ref = firebase.database().ref();
      var deferred = $q.defer();
      return {
        login: function(){
          ref.signInWithPopup("facebook", function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
              localStorage.clear();
            } else {
              // the access token will allow us to make Open Graph API calls
              // console.log(authData.facebook.accessToken);
              deferred.resolve(authData);
            }
          }, {
            scope: "email, public_profile" // the permissions requested
          });
          return deferred.promise;
        }
      }
    }
})();

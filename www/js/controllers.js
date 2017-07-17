(function() {
  'use strict';

  angular
    .module('Chat.controllers', [])
    .controller("LoginCtrl", LoginCtrl)
    .controller("ChatCtrl", ChatCtrl)
    .controller("RoomsCtrl", RoomsCtrl);

  LoginCtrl.$inject = ["$scope", "$ionicModal", "$state", "$firebaseAuth", "$ionicLoading", "$rootScope", "CONFIG", "UserService", "FacebookService"];
  ChatCtrl.$inject = ['$scope', "Message", "Rooms", "UserService", "$state", "$ionicScrollDelegate"];
  RoomsCtrl.$inject = ['$scope', "Rooms", "Message", "$state", "$ionicPopup"];

  function LoginCtrl($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, CONFIG, UserService, FacebookService) {

    var vm = $scope.vm = {};
    var ref = firebase.database().ref();
    var auth = $firebaseAuth(firebase.auth());

    angular.extend(vm, {
      user        : {},
      createUser  : createUser,
      login       : login,
      signInWithFaceBook: signInWithFaceBook
    });

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      vm.modal = modal;
    });

    function createUser() {
      UserService.createUser(vm.user).then(function(){
        vm.modal.hide();
      })
    }

    function login() {
      UserService.login(vm.user);
    }

    function signInWithFaceBook(){
      FacebookService.login().then(function(userData){
        ref.child("users").child(userData.uid).set({
          id: userData.uid,
          email: userData.facebook.email,
          username: userData.facebook.displayName
        });
        $state.go('tab.rooms');
      });
    }
  }

  function ChatCtrl($scope, Message, Rooms, UserService, $state, $ionicScrollDelegate) {
    var vm = $scope.vm = {};

    angular.extend(vm, {
      newMessage: "",
      messages: Message.get($state.params.roomId),
      room: Rooms.get($state.params.roomId),
      currentUser: UserService.getProfile(),

      sendMessage: sendMessage,
      remove: remove
    });

    function sendMessage(message) {
      Message.send(message).then(function(){
        $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
      });
      vm.newMessage = "";
    }

    function remove(chat) {
      Message.remove(chat);
    }
  }

  function RoomsCtrl($scope, Rooms, Message, $state, $ionicPopup) {
    var vm = $scope.vm = {};

    angular.extend(vm, {
      room: {},
      rooms: Rooms.all(),

      openChatRoom: openChatRoom,
      createRoom: createRoom
    });

    function openChatRoom(roomId) {
      $state.go('tab.chat', {
        roomId: roomId
      });
    }


    console.log(vm.rooms)

    function createRoom(){
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        templateUrl: './templates/create-room-template.html',
        title: 'Enter Room Name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!vm.room.name) {
                e.preventDefault();
              } else {
                Rooms.save(vm.room);
              }
            }
          }
        ]
      });
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('Chat.controllers', [])
    .controller("LoginCtrl", LoginCtrl)
    .controller("ChatCtrl", ChatCtrl)
    .controller("RoomsCtrl", RoomsCtrl);

  LoginCtrl.$inject = ["$scope", "$ionicModal", "$state", "$firebaseAuth", "$ionicLoading", "$rootScope", "CONFIG", "UserService"];
  ChatCtrl.$inject = ['$scope', "Message", "Rooms", "UserService", "$state", "$ionicScrollDelegate"];
  RoomsCtrl.$inject = ['$scope', "Rooms", "Message", "$state", "$ionicPopup"];

  function LoginCtrl($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, CONFIG, UserService) {

    var ref = new Firebase(CONFIG.FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.createUser = function (user) {
      if (user && user.email && user.password && user.displayname) {
        UserService.createUser(user).then(function(){
          $scope.modal.hide();
        })
      } else {
        alert("Please fill all details");
      }
    }

    $scope.login = function (user) {
      if (user && user.email && user.password) {
        UserService.login(user);
      } else {
        alert("Please enter email and password both");
      }
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
      newRoomName: "",
      rooms: Rooms.all(),

      openChatRoom: openChatRoom,
      createRoom: createRoom
    });

    function openChatRoom(roomId) {
      $state.go('tab.chat', {
        roomId: roomId
      });
    }

    function createRoom(){
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="vm.newRoomName">',
        title: 'Enter Room Name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!vm.newRoomName) {
                e.preventDefault();
              } else {
                // return vm.newRoomName;
                vm.rooms.$add({name: vm.newRoomName});
              }
            }
          }
        ]
      });
    }
  }
})();

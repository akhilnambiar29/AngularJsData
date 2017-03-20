myApp.controller('CheckinsController', ['$rootScope','$routeParams','$scope','$firebase','$firebaseArray', '$location', '$firebaseObject',
	function($rootScope,$routeParams,$scope,$firebase,$firebaseArray,$location,$firebaseObject) {
  //$scope.message = "Success!!!";

  var ref , checkinsList;

  $scope.whichMeeting = $routeParams.mId;
  $scope.whichUser = $routeParams.uId;

  ref = firebase.database().ref()
    .child('users').child($scope.whichUser).child('meetings').child($scope.whichMeeting).child('checkins');

    checkinsList =$firebaseArray(ref);
    $scope.checkins = checkinsList;

    $scope.addCheckin = function(){

        $firebaseArray(ref).$add({
          firstname : $scope.user.firstname,
          lastname : $scope.user.lastname,
          email : $scope.user.email,
          date : firebase.database.ServerValue.TIMESTAMP
        }).then(function(){
          $location.path('/checkins/' + $scope.whichUser +'/' + $scope.whichMeeting+ '/checkinsList');
        });
    };

    $scope.order = 'firstname';
    $scope.direction = null;
    $scope.query = '';
    $scope.recordId='';

    $scope.pickRandom = function(){
      var whichRecord = Math.round(Math.random() * (checkinsList.length-1));
      $scope.recordId = checkinsList.$keyAt(whichRecord);
    }; //pick a random winner


    $scope.showLove = function(checkinId){
        checkinId.show = !checkinId.show;

        if(checkinId.userState == 'expanded'){
          checkinId.userState = '';
        }
        else{
          checkinId.userState = 'expanded';
        }
    }; // toggle show love 

    $scope.giveLove = function(myCheckin , myGift){
      var refLove = ref.child(myCheckin.$id).child('awards');
      var checkinsArray =$firebaseArray(refLove);

      checkinsArray.$add({
        name : myGift ,
        date : firebase.database.ServerValue.TIMESTAMP
      });
    };//giving Love

    $scope.deleteAward = function(myCheckin,key){
      var refLove = ref.child(myCheckin.$id).child('awards').child(key);
      var record = $firebaseObject(refLove);

      record.$remove(key);

    };

    $scope.deleteCheckin = function(id){
        var refDelete = ref.child(id);
        var record = $firebaseObject(refDelete);
        record.$remove(id);
    };

  

}]);
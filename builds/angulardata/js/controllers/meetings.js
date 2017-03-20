myApp.controller('MeetingsController', ['$rootScope','$scope','$firebaseAuth','$firebaseArray', 
	function($rootScope,$scope,$firebaseAuth,$firebaseArray) {
  //$scope.message = "Success!!!";

  var ref = firebase.database().ref(); //this firebase variable is referred to in the index.html
  var auth = $firebaseAuth();

  auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      var meetingRef = ref.child('users').child(authUser.uid).child('meetings');
      var meetingsInfo = $firebaseArray(meetingRef); //Get value as array or object.
    //  var userObj = $firebaseObject(userRef);
     // $rootScope.currentUser = userObj;

     $scope.meetings = meetingsInfo;

     meetingsInfo.$loaded().then(function(data){

     	$rootScope.howManyMeetings = meetingsInfo.length;
     });

     meetingsInfo.$watch(function(data){

     	$rootScope.howManyMeetings = meetingsInfo.length;
     });

     $scope.addMeeting = function(){
     	meetingsInfo.$add({
     		name: $scope.meetingname ,
     		date: firebase.database.ServerValue.TIMESTAMP
     	}).then(function(){
     		$scope.meetingname='';
     	});
     };

     $scope.deleteMeeting = function(key){
     	meetingsInfo.$remove(key);
     };
    }
  });

}]);
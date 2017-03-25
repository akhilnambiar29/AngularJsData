myApp.factory('Authentication',
  ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth','$route',
  function($rootScope, $location, $firebaseObject, $firebaseAuth , $route) {

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  var myObject;

  auth.$onAuthStateChanged(function(authUser) {
    if(authUser && authUser.emailVerified) {
      //console.log("email verified");
      var userRef = ref.child('users').child(authUser.uid);
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });

  myObject = {
    login: function(user) {
      // $rootScope.message = '';
        //console.log("Here");
       // if(user.emailVerified){
      auth.$signInWithEmailAndPassword(
        user.email,
        user.password
      ).then(function(user) {
        if(user.emailVerified){
          $location.path('/meetings');
        }
        else{
          myObject.logout();
          $rootScope.message = "Email Not Verified";
          $location.path('/login');
        }
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); //signInWithEmailAndPassword
    //}
   

    }, //login

    logout: function() {
      return auth.$signOut();
    }, //logout

    requireAuth: function() {
      return auth.$requireSignIn();
    }, //require Authentication

    forgotPassword : function(user){
      //console.log(user.email);
        auth.$sendPasswordResetEmail(user.email).then(function(){
          $rootScope.message = "Password reset mail sent";
          $location.path('/login');
        })
        .catch(function(error){
            $rootScope.message = error.message;
           // $location.path('/forgotPassword');
        });
         $location.path('/forgotPassword');
       
    },

    register: function(user) {
      auth.$createUserWithEmailAndPassword(
        user.email,
        user.password
      ).then(function(regUser) {
        var regRef = ref.child('users')
          .child(regUser.uid).set({
            date: firebase.database.ServerValue.TIMESTAMP,
            regUser: regUser.uid,
            firstname: user.firstname,
            //displayName : user.firstname,
            lastname: user.lastname,
            email: user.email ,
          }); //userinfo
          regUser.sendEmailVerification(); //Used to send verification mail ;
         // myObject.login(user);
         $rootScope.message = "Please check your mail for verification";
         $location.path('/login');
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); //createUserWithEmailAndPassword
    } //register

  }; //return


  return myObject;

}]); //factory
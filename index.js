var admin = require("firebase-admin");
const functions = require('firebase-functions');
const cors = require('cors')({origin : true});
var serviceAccount = require("./sendtivity-firebase-adminsdk-gvl63-2e0bdf3df1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sendtivity.firebaseio.com"
});
var db = admin.database();




exports.GetTimeLineWeb = functions.https.onRequest((request, response) => {
  var Result = [];
  var FriendUser = [];
  debugger;
  const query = request.query.mAuthID;
  db.ref('User/'+query+"/PhoneNumberList").on('value',(queryUserList) => {
    var QuerryUser = queryUserList.val();
      debugger;
      db.ref('User').on('value',(AllUserList) => {
      var AllUser = AllUserList.val();
      QuerryUser.forEach(querryPhoneListItem => {
          Object.keys(AllUser).forEach((AllUserObject => {
            if(AllUser[AllUserObject].PhoneNumber.replace('+9','') === querryPhoneListItem.replace('+9','')){
              FriendUser.push(AllUser[AllUserObject].mAuthID);
            }
          }));
      });
      db.ref('Post').on('value',(Post) => {
        var PostList = Post.val();
              Object.keys(PostList).forEach((PostItem) => {
                FriendUser.forEach((FriendUserList) => {
                  if(PostList[PostItem].UserID === FriendUserList ){
                    Result.push(PostList[PostItem])
                  }
                });
              });
              console.log(Result);
              response.send({Result:Result});
      });
    });
  });

});

exports.GetTimeLineApp = functions.https.onCall((data,context) => {
  const Result = [];
  const FriendUser = [];

  const query = context.auth.uid;
  db.ref('User/'+query).on('value',(queryUserList) => {
    var QuerryUser = queryUserList.val();
    db.ref('User').on('value',(AllUserList) => {
      var AllUser = AllUserList.val();
      QuerryUser.PhoneNumberList.forEach(querryPhoneListItem => {
          Object.keys(AllUser).forEach((AllUserObject => {
            if(AllUser[AllUserObject].PhoneNumber === querryPhoneListItem){
              FriendUser.push(AllUser[AllUserObject].mAuthID);
            }
          }));
      });
      db.ref('Post').on('value',(Post) => {
        var PostList = Post.val();
              Object.keys(PostList).forEach((PostItem) => {
                FriendUser.forEach((FriendUserList) => {
                  if(PostList[PostItem].UserID === FriendUserList ){
                    Result.push(PostList[PostItem])
                  }
                });
              });
              console.log(Result);
              return {Result:Result};
      });
    });
  });

});

exports.UserCreate = functions.auth.user().onCreate((createUser) => {
  db.ref('User/'+createUser.uid).on('value', (value) => {
    CurrentUser = value.val();
    console.log(CurrentUser);
      CurrentUser.PhoneNumberList.forEach((phoneNumber) => {
        
      })
  });
});

exports.GetTimeLineTest = functions.https.onRequest((request, response) => {
  var Result = [];
  var FriendUser = [];
  var QueryUserArray = [];
  
  var query = request.query.mAuthID;

  db.ref('User/'+query).on('value' , (params) => {
      var QueryList = params.val();
      QueryList.PhoneNumberList.forEach((phoneNumber) => {
      QueryUserArray.push(phoneNumber);
    });
  });
  db.ref('User').on('value',(params) => {
    var QuerryAllUser = params.val();
    for(var value in QuerryAllUser){
      console.log(value);
    }
    response.send(QuerryAllUser);
  });
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

console.log(JSON.stringify({
  "apiKey": "AIzaSyB8dFCkPIwejsU7cqE1hwYsvVOnmN7pcN0",
  "databaseURL": "https://sendtivity.firebaseio.com",
  "storageBucket": "sendtivity.appspot.com",
  "authDomain": "sendtivity.firebaseapp.com",
  "messagingSenderId": "328630731499",
  "projectId": "sendtivity"
}))

FIREBASE_CONFIG="{\"apiKey\":\"AIzaSyB8dFCkPIwejsU7cqE1hwYsvVOnmN7pcN0\",\"databaseURL\":\"https://sendtivity.firebaseio.com\",\"storageBucket\":\"sendtivity.appspot.com\",\"authDomain\":\"sendtivity.firebaseapp.com\",\"messagingSenderId\":\"328630731499\",\"projectId\":\"sendtivity\"}"

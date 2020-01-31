var admin = require("firebase-admin");
const functions = require('firebase-functions');
const cors = require('cors')({origin : true});
var serviceAccount = require("./sendtivity-firebase-adminsdk-gvl63-2e0bdf3df1.json");


var FCM = require('fcm-node');
var serverKey = 'AAAATIPrAus:APA91bFnH1V90rlLel6m8WBwTRD8-5ZQJgMGa0VyJeVD_lwORT_HZslIhGUu0DpBJQlrBSBoIDjs-DCRzfZMvNMWLH3aBZZ4FZpcXO4hQuzUyKifYdmUWCAF_6GbvOA-v6-wRfpr2rOA'; //put your server key here
var fcm = new FCM(serverKey);





admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sendtivity.firebaseio.com",
  storageBucket: "gs://sendtivity.appspot.com"
});
var db = admin.database();
const messaging = admin.messaging();
const storageRef = admin.storage().bucket().storage;



exports.GetTimeLineWeb = functions.https.onRequest((request, response) => {
  var Result = [];
  var FriendUser = [];

  function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) === -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
  const query = request.query.mAuthID;
  db.ref('User/'+query+"/PhoneNumberList").on('value',(queryUserList) => {
    var QuerryUser = queryUserList.val();
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
            FriendUser.forEach((FriendUserList) => {
              Object.keys(PostList).forEach((PostItem) => {
                if(PostList[PostItem].UserID === FriendUserList ){
                  Result.push(PostList[PostItem])
                }
          });
        });
      
        console.log(Result);
        response.set('Access-Control-Allow-Origin', '*');
        response.send({Result:removeDuplicates(Result)});
      });
    });
  });

});



exports.GetMessageLineWeb = functions.https.onRequest((request, response) => {
  var Result = [];
  var FriendUser = [];

  function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) === -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
  const query = request.query.mAuthID;
  db.ref('User/'+query+"/PhoneNumberList").on('value',(queryUserList) => {
    var QuerryUser = queryUserList.val();
      db.ref('User').on('value',(AllUserList) => {
      var AllUser = AllUserList.val();
      QuerryUser.forEach(querryPhoneListItem => {
          Object.keys(AllUser).forEach((AllUserObject => {
            if(AllUser[AllUserObject].PhoneNumber.replace('+9','') === querryPhoneListItem.replace('+9','')){
              FriendUser.push(AllUser[AllUserObject]);
            }
          }));
      }); 


      console.log(FriendUser);
      response.set('Access-Control-Allow-Origin', '*');
      response.send({Result:removeDuplicates(FriendUser)});
    });
  });

});


exports.GetProfileLineWeb = functions.https.onRequest((request, response) => {
  var Result = [];
  debugger;

  function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) === -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

  const query = request.query.mAuthID;
  db.ref('Post').on('value',(AllPostList) => {
    var PostList = AllPostList.val();
    Object.keys(PostList).forEach(Post => {
      debugger;
      if(PostList[Post].UserID === query){
        Result.push(PostList[Post])
      }
    });
      response.set('Access-Control-Allow-Origin', '*');
      response.send({Result:removeDuplicates(Result)});
    });
  });


  exports.GetUserWeb = functions.https.onRequest((request, response) => {
    debugger;
  
    const query = request.query.mAuthID;
    db.ref('User').on('value',(AllUserList) => {
      var UserList = AllUserList.val();
      Object.keys(UserList).forEach(User => {
        debugger;
        if(UserList[User].mAuthID === query){
          response.set('Access-Control-Allow-Origin', '*');
          response.send(UserList[User]);
        }
      });
      });
    });

    /*
    exports.PushNotification = functions.database.ref('Messages/{RecieverID}/{SenderID}/{Message}/message').onWrite((snapshot,context) =>{
      
      console.log(context.params);
      var ReceiverID = context.params.RecieverID;
      var SenderID = context.params.SenderID;
      var Message = context.params.Message;

      var token = 'dQSAjSUpLtA:APA91bG7CY1BvVGpP3hrUZgfb8Q_1hm5lI2tmFQD4KFhVxUDURLJtoIegSd5Cd1eQgvsbQVDfUdHWtnA96DrYiLE-uuYlWY5akg_rXkrPf54sa1EjovYzcAXepUoTcgChTGEqqKYoGBC';

      console.log('We have a notification to send to :' , ReceiverID);
      console.log(snapshot);

      const payload = 
		{
			notification:
			{
				title: "New Chat Request",
				body: `you have a new Chat Request, Please Check.`,
				icon: "default"
			}
		}; 

      db.ref('User/'+ReceiverID).on('value',(UserSnapshot)=> {
        var RecieverUser = UserSnapshot.val();
        messaging.sendToDevice(token,payload).then((response) => {
          console.log('Gönderildi');
          return;
        }).catch((error) => {
          console.log(error);
        });
      });
  });
  */

 exports.PushNotification = functions.database.ref('Messages/{SenderID}/{RecieverID}/{Message}/message').onWrite((snapshot,context) =>{
      
  var ReceiverID = context.params.RecieverID;
  var SenderID = context.params.SenderID;
  var Message = context.params.Message;
  
  console.log(context);
  console.log(snapshot);


  if(context.params.SenderID === context.auth.uid){
    
    db.ref('User/'+ReceiverID).on('value',(RecieverUserSnapshot) =>{
      db.ref('User/'+SenderID).on('value',(SenderUserSnapshot) =>{
        var SenderUser = SenderUserSnapshot.val();
        var RecieverUser = RecieverUserSnapshot.val();
        var message = { 
        to: RecieverUser.Device_id, 
        notification: {
            title: SenderUser.Name +' '+SenderUser.LastName, 
            body: snapshot.after._data 
        },
        data:{
          "User":SenderID
        }
      
    };
    
    fcm.send(message, (err, response) =>{
        if (err) {
            console.log("Something has gone wrong!   : "+err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
    });
  });
      
  }

});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

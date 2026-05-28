#DevTInder Apis



### authRouter 

-Post/signup
-Post/login
-Post/logout


### profileRouter 

// it will not allow the emailid and password to edit

-GET /PROFILE/view
-PATCH /PROFILE/edit
-PATCH/profile/password


IN TINDER RIGHT SWIPE INTERESTED
IN LEFT Swipe Rejected



### ConnectionRequestRouter

-POST /request/send/interested/:userId
-POST/request/send/ignored/:userId
-Post/request/review/accepted/:requestId
-Post/request/review/rejected/:requestId



### userRouter
-GET /user/connections
-GET/user/requests/received
-GET/user/feed 
//- Gets you the  profiles of other users on platform 



Status :ignore,interested,accepted,rejected 

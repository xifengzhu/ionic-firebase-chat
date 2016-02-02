## IonicFirebaseChat
IonicFirebaseChat is a sample chat widget powered by Firebase. We created a simple authentication system with email and Facebook support in Ionic.

### Screenshot
<img src="/screenshots/login.jpg?raw=true" alt="alt text" height="400px">
<img src="/screenshots/login-with-facebook.jpg?raw=true" alt="login with facebook" height="400px">
<img src="/screenshots/chat.jpg?raw=true" alt="chat" height="400px">
<img src="/screenshots/add-room.jpg?raw=true" alt="add room" height="400px">

### Setup

##### 1.Setting up a Firebase Account

In order to user Firebase, you need to have an account with them. Url: https://www.firebase.com/signup/

##### 2.Setting up a facebook App for Login
Login the firebase dashboard, and select the `login&&Auth` tab, select the `facebook` tab, fill the `Facebook APP Id ` and `Facebook App Secret`.
https://developers.facebook.com/

##### 3.Install the lib by bower

```
bower install firebase --save
bower install angularfire --save
bower install angular-md5 --save  // md5 for Angular.js and Gravatar filter
```

##### 4.Replace the firebase url with your's in `www/js/configs.js`

### Data Structure

* `users/`
  * `user-id`
    * `username` - The display name of the user.
    * `email` - The user email.
    * `connected` - The user online or offline.

* `rooms/`
  * `room-id`
    * `name` -The room name.
    * `type` - The room type(private and public).
    * `createdAt`- The time at which the room was created.
    * `ownerId`  - The room's owner id .

* `room-messages/`
  * `room-id`
    * `message-id`
      * `sender_username`
      * `sender_email` - For getting the gravatar.
      * `content` - The message content.
      * `createdAt` - The time at which the message was created.

### Get help
* https://www.firebase.com/docs/web/libraries/ionic/guide.html
* https://www.firebase.com/docs/web/libraries/angular/api.html
* https://ccoenraets.github.io/ionic-tutorial/ionic-facebook-integration.html

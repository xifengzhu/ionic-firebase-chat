### Setup

ionic-firebase-chat uses Firebase as a backend, so it requires no server-side code. It can be added to any web app by including a few JavaScript files. it's implement facebook login,

1.Setting up a Firebase Account

In order to user Firebase, you need to have an account with them. You can sign up on the Hacker Plan for 50 Max Connections, 5 GB Data Transfer, 100 MB Data Storage, 1 GB Hosting Storage and 100 GB Hosting Transfer from this url: https://www.firebase.com/signup/

2.Setting up a facebook App for Login
Login the firebase dashbord, and select the `login&&Auth` tab, select the `facebook` tab, fill the `Facebook APP Id ` and `Facebook App Secret`.
https://developers.facebook.com/

3.Install the lib by bower

```
bower install firebase --save
bower install angularfire --save
bower install angular-md5 --save  // md5 for Angular.js and Gravatar filter
```

4.Replace the firebase url with your's in `www/js/configs.js`

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

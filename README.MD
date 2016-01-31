### Setup
ionic-firebase-chat uses Firebase as a backend, so it requires no server-side code. It can be added to any web app by including a few JavaScript files

1.Setting up a Firebase Account

In order to user Firebase, you need to have an account with them. You can sign up on the Hacker Plan for 50 Max Connections, 5 GB Data Transfer, 100 MB Data Storage, 1 GB Hosting Storage and 100 GB Hosting Transfer from this url: https://www.firebase.com/signup/

2.Install the lib by bower

```
bower install firebase --save
bower install angularfire --save
```

3.Replace the firebase url with your's in `www/js/configs.js`

### Data Structure

* `users/`
  * `user-id`
    * `displayName` - The display name of the user.
    * `email:` - The user email.

* `rooms/`
  * `name` -The room name
  * `messages/`
    * `message-id`>
      * `from_email` - For getting the gravatar.
      * `from_username` - The display name of the user
      * `content` - The message content.
      * `createdAt`  - The time at which the message was created.

### Get help
* https://www.firebase.com/docs/web/libraries/ionic/guide.html
* https://www.firebase.com/docs/web/libraries/angular/api.html

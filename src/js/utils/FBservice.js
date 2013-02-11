/*
 document.getElementById('fb-login-status').onclick = function() {
 FB.getLoginStatus(function(response) {
 Log.info('FB.getLoginStatus callback', response);
 });
 };


 FB.Event.subscribe('auth.login', function(response) {
 Log.info('auth.login event handler', response);
 });
 FB.Event.subscribe('auth.logout', function(response) {
 Log.info('auth.logout event handler', response);
 });
 FB.Event.subscribe('auth.statusChange', function(response) {
 Log.info('auth.statusChange event handler', response);
 });
 FB.Event.subscribe('auth.authResponseChange', function(response) {
 Log.info('auth.authResponseChange event handler', response);
 });

 document.getElementById('fb-permissions').onclick = function() {
 FB.login(
 function(response) {
 Log.info('FB.login with permissions callback', response);
 },
 { scope: 'publish_actions' }
 );
 };
 */

var FBservice = function () {
    var self = this;
    self.debugMode = false;
    self.initialized = false;
    self.connected = false;
    self.userID = null;
    self.accessToken = null;
    self.userProfile = null;
    self.premissions = '';
    self.useImageProxy = false;
    self.imageProxyUrl = ROOT_PATH+"photo/facebook/";
    self.init = function (onCompleteCallback) {
        if (!window.fbApiInitialized) {
            setTimeout(function () {
                self.init(onCompleteCallback);
            }, 50);
        } else { // complete
            self.initialized = true;
            if (onCompleteCallback) {
                onCompleteCallback();
            }
            addListeners();
        }
    }
    var addListeners = function () {
        FB.Event.subscribe('auth.login', function (response) {
            log('auth.login event handler', response);
        });
        FB.Event.subscribe('auth.logout', function (response) {
            log('auth.logout event handler', response);
        });
        FB.Event.subscribe('auth.statusChange', function (response) {
            log('auth.statusChange event handler', response);
        });
        FB.Event.subscribe('auth.authResponseChange', function (response) {
            log('auth.authResponseChange event handler', response);
        });
    }
    self.getLoginStatus = function (onCompleteCallback) {
        if (checkInitialized()) {
            FB.getLoginStatus(function (response) {
                switch (response.status) {
                case "not_authorized":
                    self.connected = false;
                    break;
                case "connected":
                    self.connected = true;
                    self.userID = response.authResponse.userID;
                    self.accessToken = response.authResponse.accessToken;
                    break;
                default:
                    break;
                }

                onCompleteCallback(response)
            });
        }
    }
    self.login = function (onCompleteCallback) {
        FB.login(
                function (response) {
                    echo('FB.login with permissions callback', response);
                    onCompleteCallback(response)
                },
                { scope:self.premissions }
        );

    }
    self.loadProfile = function (onCompleteCallback) {
        return self.loadUserProfile("me", onCompleteCallback);
    };
    /*
     {
     "id": "100000778309018",
     "name": "Phil McDevin",
     "first_name": "Phil",
     "last_name": "McDevin",
     "link": "http://www.facebook.com/phil.mcdevin",
     "username": "phil.mcdevin",
     "gender": "male",
     "timezone": 10,
     "locale": "en_GB",
     "verified": true,
     "updated_time": "2012-06-26T02:17:43+0000"
     }
     */
    self.loadUserProfile = function (userID, onCompleteCallback) {
        userID = userID || "me";
        FB.api('/'+userID, function(response){
            response.photos = {};
            response.photos.square = self.getPhotoUrl(response.id, 'square')
            response.photos.small = self.getPhotoUrl(response.id, 'small')
            response.photos.normal = self.getPhotoUrl(response.id, 'normal')
            response.photos.large = self.getPhotoUrl(response.id, 'large')
            if(userID == "me"){
                self.userProfile = response;
            }
            onCompleteCallback(response);
        });
    }
    self.loadFriends = function (onCompleteCallback) {
        if (checkConnected()) {
            FB.api({ method:'friends.get' }, function (response) {
                echo('friends.get response', response);
                onCompleteCallback(response)

            });
        }
    }
    self.wallpost = function(options){
        return self.postDialog(options);
    }
    self.postDialog = function(options){
        options = options || {};
        options.from = options.from || null;
        options.to = options.to || null;
        options.name = options.name || null;
        options.link = options.link || null;
        options.picture = options.picture || null;
        options.caption = options.caption || " ";
        options.description = options.description || null;
        options.message = options.message || null;
        options.callback = options.callback || function(){};

        FB.ui(
                {
                    method: 'feed',
                    to: options.to,
                    from: options.from,
                    name: options.name,
                    link: options.link,
                    picture: options.picture,
                    caption: options.caption,
                    description: options.description,
                    message: options.message
                }, options.callback);
        return;

        var publish = {
            method: 'feed',
            message: 'getting educated about Facebook Connect',
            name: 'Connect',
            to: userID,
            caption: 'The Facebook Connect JavaScript SDK',
            description: (
                    'A small JavaScript library that allows you to harness ' +
                            'the power of Facebook, bringing the user\'s identity, ' +
                            'social graph and distribution power to your site.'
                    ),
            link: 'http://www.fbrell.com/',
            picture: 'http://www.fbrell.com/public/f8.jpg',
            actions: [
                { name: 'fbrell', link: 'http://www.fbrell.com/' }
            ],
            user_message_prompt: 'Share your thoughts about RELL'
        };

        FB.ui(publish, Log.info.bind('feed callback'));
    }
    /*
      types
      square (50x50),
      small (50 pixels wide, variable height),
      normal (100 pixels wide, variable height)
      large (about 200 pixels wide, variable height):
     */
    self.getPhotoUrl = function (userID, type) {
        type = type || "square";
        if(self.useImageProxy)
        return self.imageProxyUrl+userID+"/"+ type
        else
        return "http://graph.facebook.com/" + userID + "/picture?type=" + type;
    }
    var checkInitialized = function () {
        if (!self.initialized) {
            throw new Error("FBservice not initialized")
            return false;
        } else
            return true;
    }
    var checkConnected = function () {
        if (!self.connected) {
            throw new Error("FBservice not connected/logged")
            return false;
        } else
            return true;
    }
    var echo = function () {
        if (self.debugMode) {
            log("FBservice", arguments)
        }
    }
    return self;
}
/*
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var path = require('path');
process.env.PWD = process.cwd();

var client_id = '96d2092fa0ad4ceca884cc06551b3446'; // spotify client id
var client_secret = 'f6632cdf53b44729ad860f414b04424f'; // spotify secret
var redirect_uri = 'https://envisify.heroku.com/callback'; // Your redirect uri

var port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || 'dev';

if(environment === 'dev')
  redirect_uri = 'http://localhost:8080/callback';

console.log('port: ' + port);
console.log('env: ' + environment);     
console.log('redirect: ' + redirect_uri);
console.log('cwd: ' + process.env.PWD);

var stateKey = 'spotify_auth_state';
var app = express();

// only load this middleware in dev mode
if(environment == 'dev'){
  var webpackMiddleware = require('webpack-dev-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');

  app.use(webpackMiddleware(webpack(config), {
    publicPath: '/',
    headers: { 'X-Custom-Webpack-Header': 'yes'}, 
    stats: {
      colors: true
    }
  }));
}




/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


//
// setup static express directories to serve up
//
app.use(express.static(path.join(process.env.PWD, 'dist')))
   .use(cookieParser())
   .use(function(req, res, next){
      // enable CORS for dev so that we can work on browsersync's port  
      if(environment === 'dev'){
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      }
      next();
   });


//
// login: redirects to spotify auth server with client id
//
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-follow-read playlist-read-private';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


//
// callback
//
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // // var options = {
        // //   url: 'https://api.spotify.com/v1/me',
        // //   headers: { 'Authorization': 'Bearer ' + access_token },
        // //   json: true
        // // };

        // // // use the access token to access the Spotify Web API
        // // request.get(options, function(error, response, body) {
        // //   console.log(body);
        // // });

        // determine the base url to use based on the environment
        // we have to do this to deal with browsersync 
        var baseUri = environment === 'dev' ? 'http://localhost:3000' : ''; 
        
        // we can also pass the token to the browser to make requests from there
        res.redirect(baseUri + '/#/account;' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


//
// refresh_token
//
app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on ' + port);
app.listen(port);

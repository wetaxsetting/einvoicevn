'use strict';
const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis')
const CREDENTIAL_FILE = '/home/www/sendmail/credential-einvoice-mail2.json';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = '/home/www/sendmail/token/token2.json'

fs.readFile(CREDENTIAL_FILE, (err, content) => {
  if(err) throw err
  checkToken(JSON.parse(content))
})

// check token exist in token file
function checkToken(credential) {
  let clientSecret = credential.installed.client_secret;
  let clientId = credential.installed.client_id;
  let redirectUrl = credential.installed.redirect_uris[0];
  let oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if(err) return getNewToken(oauth2Client)
    oauth2Client.setCredentials(JSON.parse(token));
  })
}

function getNewToken(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}
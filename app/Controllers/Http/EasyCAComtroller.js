'use strict';
const Utils = use('Utils');
const CryptoJS = use('crypto-js');
const Env = use('Env');
const AES = use('AES');
const APP_KEY = Env.get('APP_KEY');
const Helpers = use('Helpers');
const Request = use('Request');
const ROOT_DIR_FILES = Env.get('ROOT_DIR_FILES', Helpers.tmpPath());
const API_URL = Env.get('API_URL');
const APP_URL_LOCAL = Env.get('APP_URL_LOCAL', Env.get('APP_URL'));
const API_URL_API = Env.get('API_URL_API', Env.get('API_URL_API'));
const PORT = Env.get('PORT', Env.get('PORT'));

class EasyCAComtroller {}

module.exports = EasyCAComtroller;

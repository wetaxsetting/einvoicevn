'use strict';
const Utils = use('Utils');
const Request = use('Request');
const easysignUrl = 'http://demosign.easyca.vn:8080/api'; //https://sign.easyca.vn
const axios = require('axios');
const EINVOICE_ESIGN_XML = 'http://genuclouding.com/wseinvoice/BSService.asmx/SignXml';

class HSMController2 {
  async loginEasysign({username, password, rememberMe = false}) {
    try {
      const res = await axios.post(easysignUrl + '/authenticate', {
        username,
        password,
        rememberMe,
      });
      return res.data.id_token;
    } catch (error) {
      console.log('=======> loginEasysign failed: ' + error.message);
      return null;
    }
  }

  async getCertificatesIPOS({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {username, password} = request.all();

      const token = await loginEasysign({username, password});

      if (!token) {
        return response.status(404).json(
          Utils.responseByRule({
            success: false,
            message: 'username or password invalid.',
          }),
        );
      }

      const res = await Request.get(easysignUrl + `/certificate/ownerId/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: res,
        }),
      );
    } catch (err) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'HsmSignXml',
        CONTENT: e.message,
      });
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async getQr2Fa({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {username, password, serial, pin} = request.all();

      const token = await loginEasysign({username, password});

      if (!token) {
        return response.status(404).json(
          Utils.responseByRule({
            success: false,
            message: 'username or password invalid.',
          }),
        );
      }

      const res = await Request.get(easysignUrl + `/certificate/getQRCodeOTP?serial=${serial}&pin=${pin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: res.data.data,
        }),
      );
    } catch (err) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'HsmSignXml',
        CONTENT: e.message,
      });
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async HsmSignXml({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {user_name, password, serial_no, pin, organization} = request.all();

      if (!user_name || !password || !pin || !organization || !serial_no) {
        return response.status(400).json(
          Utils.responseByRule({
            success: false,
            message: 'Invalid: parameter',
          }),
        );
      }

      let data;
      switch (organization) {
        case 'easysign':
          const res = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization}),
          });
          data = res.data.d;
          break;
        default:
          return response.status(404).json(
            Utils.responseByRule({
              success: false,
              message: 'not found organization.',
            }),
          );
      }

      console.log(JSON.stringify({user_name, password, serial_no, pin, organization}));

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: JSON.parse(data),
        }),
      );
    } catch (err) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'HsmSignXml',
        CONTENT: e.message,
      });
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }
}

module.exports = HSMController2;

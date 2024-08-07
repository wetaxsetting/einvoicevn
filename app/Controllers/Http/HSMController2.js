'use strict';
const Utils = use('Utils');
const Request = use('Request');
const easysignUrl = 'http://demosign.easyca.vn:8080/api'; //https://sign.easyca.vn 540110c7d6d61b8f6474f5b993d3b979  12345678
const axios = require('axios');
const EINVOICE_ESIGN_XML = 'http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/SignXml';

class HSMController2 {
  async verifyCertificate({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const {user_name, password, pin, serial_no} = request.all();
      const token = await this.loginEasysign({user_name, password});
      // console.log(token);
      if (!token) {
        return response.status(404).json(
          Utils.responseByRule({
            success: false,
            message: 'user_name or password invalid.',
          }),
        );
      }

      const res = await Request.get(easysignUrl + `/certificate/get?serial=${serial_no}&pin=${pin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status(200).json(
        Utils.responseByRule({
          success: res.data.status == 0 ? true : false,
          // message: res.data.msg,
          message: res.data.status == 0 ? 'Verify success' : 'Verify failed',
          data: res.data.data,
        }),
      );
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'verifyCertificate',
        CONTENT: e.message,
      });
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async loginEasysign({user_name, password, rememberMe = false}) {
    try {
      const res = await axios.post(easysignUrl + '/authenticate', {
        username: user_name,
        password,
        rememberMe,
      });
      return res.data.id_token;
    } catch (error) {
      console.log('=======> loginEasysign failed: ' + error.message);
      return null;
    }
  }

  async getCertificates({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {user_name, password} = request.all();

      const token = await this.loginEasysign({user_name, password});
      // console.log(token);
      if (!token) {
        return response.status(404).json(
          Utils.responseByRule({
            success: false,
            message: 'user_name or password invalid.',
          }),
        );
      }

      const res = await Request.get(easysignUrl + `/certificate/ownerId/${user_name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res);

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: res.data,
        }),
      );
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'getCertificates',
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

      const {user_name, password, serial_no, pin} = request.all();

      const token = await this.loginEasysign({user_name, password});

      if (!token) {
        return response.status(404).json(
          Utils.responseByRule({
            success: false,
            message: 'user_name or password invalid.',
          }),
        );
      }

      const res = await Request.get(easysignUrl + `/certificate/getQRCodeOTP?serial=${serial_no}&pin=${pin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status(200).json(
        Utils.responseByRule({
          success: res.data.status == 0 ? true : false,
          message: res.data.msg,
          data: res.data.data,
        }),
      );
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'getQr2Fa',
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

      const {user_name, password, otp, serial_no, pin, organization, signing_xml, client_id, client_secret} = request.all();

      console.log('HsmSignXml  BEGIN ===================================');
      console.log('HsmSignXml user_name ', user_name);
      console.log('HsmSignXml password ', password);
      console.log('HsmSignXml otp ', otp);
      console.log('HsmSignXml serial_no ', serial_no);
      console.log('HsmSignXml pin ', pin);
      console.log('HsmSignXml organization ', organization);
      console.log('HsmSignXml signing_xml ', signing_xml);
      let type = 'C';
      if (!user_name || !password || !pin || !organization || !serial_no || !signing_xml) {
        return response.status(400).json(
          Utils.responseByRule({
            success: false,
            message: 'Invalid: parameter',
          }),
        );
      }
      const {transform, prettyPrint} = require('camaro');
      const templateKHHDon = {
        KHHDon: 'HDon/DLHDon/TTChung/KHHDon',
      };
      const KHHDon = await transform(signing_xml?.[0]?.xml, templateKHHDon);
      console.log('HsmSignXml KHHDon ', KHHDon);
      if (KHHDon.KHHDon) {
        type = KHHDon.KHHDon.toString().substring(0, 1);
      }
      let data;
      let res;
      let url;
      let site = 'test';
      switch (organization) {
        case 'easysign':
          url = 'http://demosign.easyca.vn:8080/api/';
          res = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site}),
          });
          data = res.data.d;
          break;
        case 'vnpt':
          url = 'https://rmgateway.vnptit.vn/sca/sp769';
          res = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site, client_id, client_secret}),
          });
          data = res.data.d;
          console.log('HsmSignXml data ', data);
          break;
        default:
          return response.status(404).json(
            Utils.responseByRule({
              success: false,
              message: 'not found organization.',
            }),
          );
      }
      console.log('HsmSignXml  END ========================');

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: JSON.parse(data),
        }),
      );
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'HSMController',
        FUNC: 'HsmSignXml',
        CONTENT: e.message,
      });
      console.log('HsmSignXml  ', e);
      console.log('HsmSignXml  END ========================');
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async HSMGeneralQRCode({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {serial, pin} = request.all();

      const body = {
        username: '1201496252', //  HSM_Username,
        password: '1201496252', //
        rememberMe: false,
      };

      const token = await Request.post(`https://sign.easyca.vn/api` + '/authenticate', body);

      console.log('token  ', token);
      if (token.data.id_token) {
        const certData = await Request.get(`https://sign.easyca.vn/api` + `/certificate/getQRCodeOTP?serial=${serial}&pin=${pin}`, {
          headers: {
            Authorization: `Bearer ${token.data.id_token}`,
          },
        });
        console.log('certData  ', certData);
        console.log('certData  ', certData.data.data);
        return {
          msg: 'General QR Code sussces !!',
          data: certData.data.data,
        };
      } else {
        console.error('Failed to get api token');
        return {
          msg: 'Failed to get api token',
          data: '',
        };
      }
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }
}

module.exports = HSMController2;

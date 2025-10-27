'use strict';
const Utils = use('Utils');
const Request = use('Request');
const easysignUrl = 'http://demosign.easyca.vn:8080/api'; //https://sign.easyca.vn 540110c7d6d61b8f6474f5b993d3b979  12345678
const axios = require('axios');
const EINVOICE_ESIGN_XML = 'http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx/SignXml';
const uuid = require('uuid');

//const EINVOICE_ESIGN_XML = 'http://localhost:39234/BSService.asmx/SignXml';

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
      console.log('getCertificates ', user_name, password);

      const token = await this.loginEasysign({user_name, password});
      console.log('getCertificates ', token);
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
      //console.log(res);

      var temp_data = res.data.find((item) => item.serial == '540110beffa622f3ca84bd2f93f0122c');

      const res_data = [{ ...temp_data }];

      return response.status(200).json(
        Utils.responseByRule({
          success: true,
          message: 'success.',
          data: res_data,
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
      var p_language = request.header('accept-lanwguage', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {user_name, password, otp, serial_no, pin, organization, signing_xml, client_id, client_secret} = request.all();

      console.log('HsmSignXml client_id ', client_id);
      console.log('HsmSignXml signing_xml ', JSON.stringify(signing_xml));


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
      // console.log('HsmSignXml KHHDon ', KHHDon);
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
          // console.log('HsmSignXml data ', data);
          break;
        default:
          return response.status(404).json(
            Utils.responseByRule({
              success: false,
              message: 'not found organization.',
            }),
          );
      }
      // console.log('HsmSignXml  END ========================');

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

  async HsmSignXmlTwice({request, response, auth}) {
    try {
      var p_language = request.header('accept-lanwguage', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {user_name, password, otp, serial_no, pin, organization, signing_xml1, client_id, client_secret} = request.all();

      console.log('HsmSignXml client_id ', client_id, ' organization ', organization);

      let type = 'C';
      if (!user_name || !password || !pin || !organization || !serial_no || !signing_xml1) {
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
      const KHHDon = await transform(signing_xml1?.[0]?.xml, templateKHHDon);
      // console.log('HsmSignXml KHHDon ', KHHDon);
      if (KHHDon.KHHDon) {
        type = KHHDon.KHHDon.toString().substring(0, 1);
      }
      let data;
      let res;
      let url;
      let site = 'testt';
      switch (organization) {
        case 'easysign':
          url = 'http://demosign.easyca.vn:8080/api/';

          // res = await Request.post(EINVOICE_ESIGN_XML, {
          //   xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site}),
          // });
          // data = res.data.d;

          // tam thời đóng đoan này chờ Easy HSM
          let signing_xml = signing_xml1;

          const res_1 = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site}),
          });
          data = res_1.data.d;

          let data_sign_xml = JSON.parse(data);

          console.log('data_sign_xml  ', data_sign_xml);

          const id = uuid.v4();
          const signature_path = 'TDiep/CKSNNT';
          const xmlRemoveLine = `<TDiep><DLieu Id=\'${id}\'> ` + data_sign_xml.data[0].signed_xml + `</DLieu><CKSNNT></CKSNNT></TDiep>`;

          signing_xml.push({
            sign_id: id,
            signature_path: signature_path,
            xml: xmlRemoveLine,
            req_key: data_sign_xml.data[0].req_key,
          });

          //console.log('weTaxSignXMLHSM signing_xml  ', signing_xml);

          const res_2 = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site}),
          });
          data = res_2.data.d; //JSON.parse(res_2.data.d); //  data_sign_xml; //;
          // tam thời đóng đoan này chờ Easy HSM
          break;
        case 'vnpt':
          url = 'https://rmgateway.vnptit.vn/sca/sp769';
          res = await Request.post(EINVOICE_ESIGN_XML, {
            xmlContent: JSON.stringify({user_name, password, serial_no, pin, organization, otp, signing_xml, url, site, client_id, client_secret}),
          });
          data = res.data.d;
          // console.log('HsmSignXml data ', data);
          break;
        default:
          return response.status(404).json(
            Utils.responseByRule({
              success: false,
              message: 'not found organization.',
            }),
          );
      }
      // console.log('HsmSignXml  END ========================');

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
}

module.exports = HSMController2;

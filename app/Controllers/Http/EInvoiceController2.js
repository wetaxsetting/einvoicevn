'use strict';
const Utils = use('Utils');
const CryptoJS = use('crypto-js');
const Env = use('Env');
const AES = use('AES');
const APP_KEY = Env.get('APP_KEY');
const Helpers = use('Helpers');
const Request = use('Request');
const ImportHelper = use('App/Helpers/ImportHelper');
const ROOT_DIR_FILES = Env.get('ROOT_DIR_FILES', Helpers.tmpPath());
const API_URL = Env.get('API_URL');
const APP_URL_LOCAL = Env.get('APP_URL_LOCAL', Env.get('APP_URL'));
const API_URL_API = Env.get('API_URL_API', Env.get('API_URL_API'));
const PORT = Env.get('PORT', Env.get('PORT'));
const EINVOICE_USER = Env.get('EINVOICE_USER');
const EINVOICE_PW = Env.get('EINVOICE_PW');
const EINVOICE_URL_LOGIN = Env.get('EINVOICE_URL_LOGIN');
const EINVOICE_URL_API = Env.get('EINVOICE_URL_API');
const EINVOICE_URL_API_CHECKING = Env.get('EINVOICE_URL_API_CHECKING');
const EINVOICE_URL_API_INFORMADJUST_SEND = Env.get('EINVOICE_URL_API_INFORMADJUST_SEND');
const EINVOICE_URL_API_INFORMADJUST_CHECK = Env.get('EINVOICE_URL_API_INFORMADJUST_CHECK');
const EINVOICE_URL_API_DECLARATION_SEND = Env.get('EINVOICE_URL_API_DECLARATION_SEND');
const EINVOICE_URL_API_DECLARATION_CHECK = Env.get('EINVOICE_URL_API_DECLARATION_CHECK');
const EINVOICE_URL_API_CONVERT = Env.get('EINVOICE_URL_API_DECLARATION_CHECK');
const EINVOICE_URL_API_CONVERT_EINV = Env.get('EINVOICE_URL_API_CONVERT_EINV');
const EINVOICE_URL_API_VIEW_PDF = Env.get('EINVOICE_URL_API_VIEW_PDF');
const EINVOICE_URL_API_CONVERT_TO_XML_CLIENT = Env.get('EINVOICE_URL_API_CONVERT_TO_XML_CLIENT');
const EINVOICE_URL_API_VIEW_XML = Env.get('EINVOICE_URL_API_VIEW_XML');
const SMTP_SERVER = Env.get('SMTP_SERVER');
const SMTP_PORT = Env.get('SMTP_PORT');
const EMAIL_FROM = Env.get('EMAIL_FROM');
const EMAIL_USER = Env.get('EMAIL_USER');
const EMAIL_PW = Env.get('EMAIL_PW');
const _send_from_users = eval(Env.get('send_from_users'));
const fs = use('fs');
const {transform, prettyPrint} = require('camaro');
const convertXML = require('xml-js');
const DB_CONNECTION = Env.get('DB_CONNECTION');
const DBService = use('DBService');
const oracledb = require('oracledb');
// const { result_lodash } = require("lodash-es");
const RenderJsonToExcelFile = use('App/Helpers/RenderJsonToExcelFile');
const EiExcelHandler = use('App/Helpers/EiExcelHandler');
const EiExcelHandlerAuto = use('App/Helpers/EiExcelHandlerAuto');
const EiPosExcelConverter = use('App/Helpers/EiPosExcelConverter');
const EiPosExcelHandler = use('App/Helpers/EiPosExcelHandler');
const EiPosExcelHandlerAuto = use('App/Helpers/EiPosExcelHandlerAuto');
const EiExcelTemplateHandler = use('App/Helpers/EiExcelTemplateHandler');
const EiWTExcelHandlerAuto = use('App/Helpers/EiWTExcelHandlerAuto');
const EiExcel04SS2Handler = use('App/Helpers/EiExcel04SS2Handler');
const EiExcel04SS3Handler = use('App/Helpers/EiExcel04SS3Handler');
const EiExcel04SSHandler = use('App/Helpers/EiExcel04SSHandler');
const EiWTExcel04SSHandler = use('App/Helpers/EiWTExcel04SSHandler');
const EiWTExcel04SS_BBHandler = use('App/Helpers/EiWTExcel04SS_BBHandler');
const EiWTExcel04SS_BBRHandler = use('App/Helpers/EiWTExcel04SS_BBRHandler');
const URL = 'http://demosign.easyca.vn:8080/api';
const Username = 'demo_easysign';
const Password = 'demo_easysign';
const Serial = '540110beffa622f3ca84bd2f93f0122c';
const Pin = '12345678';
const uuid = require('uuid');
const sharp = require('sharp');
const {Builder, parseString} = require('xml2js');
const {X509Certificate, crypto} = require('crypto');
const {create, createCB} = require('xmlbuilder2');
const {log, Console} = require('console');

const EINVOICE_API_SEND_MAIL = 'http://sendmail.webcashvietnam.com/api/user/sendmail';
const EINVOICE_API_SEND_MAIL_SMTP = 'http://sendmail.webcashvietnam.com/api/user/sendmailsmtp';
// const moment = require('moment');
// const {jar} = require('request');
// const {lookup} = require('dns');
// const {cloneQuiet} = require('jimp/types');

// real site
const TAX_CHECK_TRADE_CODE = 'https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=';
const TAX_USER_NAME = 'GENUWIN';
const TAX_PASSWORD = 'e_GX4v@';
const WETAX_TOKEN_CALLBACK = Env.get('WETAX_API_KEY');
const WETAX_API_URL = Env.get('WETAX_API_URL');

const WEBSERVICE_C_SHARP = 'http://csharp-api.webcashvietnam.com/wseinvoice/BSService.asmx';

// test site
// const TAX_CHECK_TRADE_CODE = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

const REDIS_CONNECTION = Env.get('REDIS_CONNECTION', 'NO_REDIS');
let Redis = false;
if (REDIS_CONNECTION != 'NO_REDIS') {
  Redis = use('Redis');
} else {
  Redis = false;
}

class EInvoiceController2 {
  async weTaxPosReportToTax({request, response, auth}) {
    try {
      var p_language = request.header('accept-language', 'ENG');
      var p_crt_by = '';
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {
        tax_code,
        sale_date,
        store_code,
        store_name,
        process_type,
        list_invoice,
        user_name,
        password,
        tax_serial_number,
        pin,
        organization,
        otp,
      } = request.all();

      const {json_xml, data_send_mail} = await this.weTaxGeneralXML(
        sale_date,
        tax_code,
        store_code,
        store_name,
        list_invoice,
        process_type || 'I',
        p_language,
        p_crt_by,
      );
      console.log('weTaxGeneralXML data_send_mail ', data_send_mail, ' json_xml ', json_xml[0].xml_process);
      if (json_xml[0].xml_process) {
        const json_xml_signed = await this.weTaxSignXMLHSM(
          user_name,
          password,
          otp,
          tax_serial_number,
          pin,
          organization,
          json_xml,
          process_type || 'I',
        );

        if (process_type == 'I' || process_type == 'P') {
          console.log('json_xml_signed  ', json_xml_signed);
          const {check_data, data_inv} = await this.weTaxExtractPosXMLContent(
            json_xml[0].xml,
            json_xml_signed.data[0].signed_xml,
            tax_code,
            sale_date,
            tax_serial_number,
            json_xml_signed.data[0].req_key,
            store_code,
            store_name,
            process_type,
            p_language,
            p_crt_by,
          );

          console.log('check_data ', check_data);
          console.log('data_inv ', data_inv);

          if (check_data.STATUS == 'FAILE') {
            return response
              .status(409)
              .json(Utils.responseByRule({success: false, message: `Send invoice to Tax Office was Faile!`, data: check_data}));
          } else if (check_data.STATUS == 'EXIT') {
            return response.status(409).json(Utils.responseByRule({success: false, message: `The sign xml was send Tax Office`, data: check_data}));
          } else if (check_data.STATUS == 'NOEXIT') {
            return response.status(409).json(Utils.responseByRule({success: false, message: `Company not yet register`, data: check_data}));
          }

          const data_send_tax = await this.weTaxSendPosInvoice(
            tax_code,
            sale_date,
            store_code,
            store_name,
            tax_serial_number,
            json_xml_signed.data[0].signed_xml,
            check_data,
            data_inv,
            data_send_mail[0].lookup_code,
            p_language,
            p_crt_by,
          );
          console.log('weTaxSendPosInvoice data_send_tax ', data_send_tax);
          if (data_send_tax && data_send_tax.send_mail) {
            this.weTaxSendMailPos(data_send_mail, 'WTPTA002', tax_code, p_language, p_crt_by);

            return response.status(200).json(Utils.responseByRule({success: true, message: 'Sending invoice is successfully.', data: data_send_tax}));
          } else {
            return response.status(409).json(Utils.responseByRule({success: false, message: 'Sending invoice to TAX is error!!'}));
          }
        } else {
          let masterInvoicePK = '',
            rtnValueTradecode = [],
            rtnValue = [];
          masterInvoicePK = await this.weTaxExtractNorXMLContent(
            json_xml_signed.data[0].signed_xml,
            list_invoice[0].buyer_email || '',
            list_invoice[0].buyer_email_cc || '',
            '',
            '',
            tax_serial_number,
            json_xml_signed.data[0].req_key,
            '',
            p_language,
            p_crt_by,
          );
          //console.log('masterInvoicePK ', masterInvoicePK);
          if (masterInvoicePK.PK == -1) {
            console.log(`The issuer invoice has not register [${invoices[i].req_key}]`, invoices[i].xml_signed);
            rtnValue.push({
              req_key: json_xml_signed.data[0].req_key,
              trade_code: '',
              errmsg: 'The issuer invoice has not register',
            });
            return response.status(409).json(Utils.responseByRule({success: false, message: `Company not yet register`, data: rtnValue}));
          } else if (masterInvoicePK.PK == -2) {
            rtnValue.push({
              req_key: json_xml_signed.data[0].req_key,
              trade_code: '',
              errmsg: 'invoice date current < invoice date max ',
            });
            return response
              .status(409)
              .json(Utils.responseByRule({success: false, message: `invoice date current < invoice date max `, data: rtnValue}));
          } else if (masterInvoicePK.PK == 0) {
            if (masterInvoicePK.CQT_MCCQT) {
              rtnValueTradecode.push({
                sale_id: list_invoice[0].sale_id,
                req_ep_key: masterInvoicePK.REQ_KEY_PK,
                trade_code: masterInvoicePK.MA_TRACUU,
                msg_his_id: list_invoice[0].msg_his_id,
                lookup_code: masterInvoicePK.LOOKUP_CODE,
                buyer_email: list_invoice[0].buyer_email,
                buyer_email_cc: list_invoice[0].buyer_email_cc,
                mccqt: '',
                send_mail_yn: 'N',
              });
              return response.status(409).json(Utils.responseByRule({success: false, message: `The sign xml was send Tax Office`, data: null}));
            } else {
              rtnValueTradecode.push({
                sale_id: list_invoice[0].sale_id,
                req_ep_key: masterInvoicePK.REQ_KEY_PK,
                trade_code: masterInvoicePK.MA_TRACUU,
                msg_his_id: list_invoice[0].msg_his_id,
                lookup_code: masterInvoicePK.LOOKUP_CODE,
                buyer_email: list_invoice[0].buyer_email,
                buyer_email_cc: list_invoice[0].buyer_email_cc,
                mccqt: '',
                send_mail_yn: 'N',
              });
            }
          } else if (masterInvoicePK.PK < -1) {
            rtnValue.push({
              req_key: list_invoice[0].sale_id,
              trade_code: '',
              errmsg: 'Invalid xml format',
            });
            return response.status(409).json(Utils.responseByRule({success: false, message: `Invalid xml format`, data: rtnValue}));
          }

          rtnValueTradecode.push({
            sale_id: list_invoice[0].sale_id,
            req_ep_key: masterInvoicePK.PK,
            trade_code: '',
            msg_his_id: list_invoice[0].msg_his_id,
            lookup_code: '',
            buyer_email: list_invoice[0].buyer_email,
            buyer_email_cc: list_invoice[0].buyer_email_cc,
            mccqt: '',
            send_mail_yn: 'N',
          });

          const data_send_tax = await this.weTaxSendNorInvoice(
            masterInvoicePK,
            rtnValueTradecode,
            json_xml_signed.data[0].signed_xml,
            p_language,
            p_crt_by,
          );
          //console.log('data_send_tax ', data_send_tax);
          if (data_send_tax) {
            let res_data = {
              trade_code: data_send_tax.rtnValue[0].trade_code,
              seller_tax_code: list_invoice[0].seller_taxcode,
              sale_date: list_invoice[0].sale_date,
              store_code: list_invoice[0].store_code,
              store_name: list_invoice[0].store_name,
              tax_serial_number: list_invoice[0].tax_serial_number,
              data_error: [],
              data_inv: [
                {
                  mccqt: data_send_tax.rtnValue[0].mccqt,
                  tax_code: list_invoice[0].seller_taxcode,
                  form_no: list_invoice[0].form_no,
                  serial_no: list_invoice[0].serial_no,
                  invoice_no: list_invoice[0].invoice_no,
                  inform_code: data_send_tax.rtnValue[0].inform_code,
                  inform_name: data_send_tax.rtnValue[0].inform_name,
                  lookup_code: data_send_tax.rtnValue[0].lookup_code,
                  sign_datetime: data_send_tax.rtnValue[0].sign_datetime,
                  sign_by: data_send_tax.rtnValue[0].sign_by,
                  xml_no_sign: json_xml[0].xml,
                  xml_signed: json_xml_signed.data[0].signed_xml,
                  xml_tax_signed: data_send_tax.rtnValue[0].xml_tax_signed,
                },
              ],
            };
            return response.status(200).json(Utils.responseByRule({success: true, message: 'Sending invoice is successfully.', data: res_data}));
          } else {
            return response.status(409).json(Utils.responseByRule({success: false, message: 'Sending invoice to TAX is error!!'}));
          }
        }
      } else {
        return response.status(409).json(Utils.responseByRule({success: false, message: 'General XML of invoice is error!!', data: json_xml}));
      }
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxPosReportToTax',
        CONTENT: e.message,
      });
      console.log('error ', e);
      // return response.send(Utils.response(false, e.message, null));
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async weTaxGeneralXML(sale_date, tax_code, store_code, store_name, invoices, process_type, p_language, p_crt_by) {
    try {
      let json_xml = [];
      let objInvoice = {};
      let objData = {
        TDiep: {
          DLieu: {
            HDon: [],
          },
          CKSNNT: {},
        },
      };

      let req_key = [];
      let data_send_mail = [];
      let valid = '';
      if (process_type == 'E' || process_type == 'I') {
        valid = this.weTaxValidatePosInvoiceToXML(invoices);
      } else if (process_type == 'N') {
        valid = this.weTaxValidateNormalInvoiceToXML(invoices);
      }
      if (!valid.status) {
        json_xml.push({
          error: valid.message,
          xml_process: false,
        });
        return {json_xml, data_send_mail};
      }

      if (invoices.length == undefined || invoices.length == 0) {
        json_xml.push({
          error: `Invalid: list_invoice`,
          xml_process: false,
        });

        return {json_xml, data_send_mail};
      }

      if (process_type == 'E') {
        objInvoice = {
          DLHDon: {
            TTChung: {
              PBan: '',
              THDon: '',
              KHMSHDon: '',
              KHHDon: '',
              SHDon: '',
              NLap: '',
              TTKhac: '',
            },
            NDHDon: {
              NBan: {
                Ten: '',
                MST: '',
                DChi: '',
                SDThoai: '',
                TTKhac: '',
              },
              NMua: {
                Ten: '',
                MST: '',
                DChi: '',
                SDThoai: '',
                CCCDan: '',
                TTKhac: '',
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: '',
                    ThTien: '',
                    TThue: '',
                  },
                },
                TgTCTHue: '',
                TgTThue: '',
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: '',
                TgTTTBSo: '',
                TgTTTBChu: '',
              },
            },
          },
          DSCKS: {},
        };
        for (let i = 0; i < invoices.length; i++) {
          const lastInvoiceNo = await DBService.callProcCursor(
            'wt_sel_last_invoice_no',
            [invoices[i].seller_taxcode, invoices[i].serial_no, invoices[i].form_no],
            p_language,
            p_crt_by,
            'N',
          );
          let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
          const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
          const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
          if (isNaN(last_invoice_no)) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `Failed to create invoice no. Please contact administrator for helping.`,
                data: null,
              }),
            );
          }

          if (invoices[i].invoice_date < last_invoice_date && !invoices[i].invoice_no) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `invoice date cannot smaller than ${last_invoice_date}.`,
                data: invoices[i].invoice_date,
              }),
            );
          }
          if (invoices[i].invoice_date >= tomorrow_date) {
            return response
              .status(409)
              .json(
                Utils.responseByRule({success: false, message: `invoice date cannot greater than ${tomorrow_date}.`, data: invoices[i].invoice_date}),
              );
          }
          req_key.push(invoices[i].sale_id);

          if (invoices[i].form_no == 1) {
            objInvoice.DLHDon.TTChung.THDon = 'Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 2) {
            objInvoice.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 3) {
            objInvoice.DLHDon.TTChung.THDon = 'Hóa đơn bán tài sản công khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 4) {
            objInvoice.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 5) {
            objInvoice.DLHDon.TTChung.THDon =
              'Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 6) {
            objInvoice.DLHDon.TTChung.THDon = 'Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền';
          }
          objInvoice.DLHDon.TTChung.PBan = invoices[i].version;
          objInvoice.DLHDon.TTChung.KHMSHDon = invoices[i].form_no;
          objInvoice.DLHDon.TTChung.KHHDon = invoices[i].serial_no;
          objInvoice.DLHDon.TTChung.SHDon = invoices[i].invoice_no;
          objInvoice.DLHDon.TTChung.NLap = invoices[i].invoice_date;

          objInvoice.DLHDon.TTChung.TTHDLQuan = [];
          // console.log("invoices[i].invoice_feature  " ,invoices[i].invoice_feature)
          if (invoices[i].invoice_feature != 0 && invoices[i].invoice_feature != null) {
            //
            objInvoice.DLHDon.TTChung.TTHDLQuan.push({
              TCHDon: invoices[i].invoice_feature,
              LHDCLQuan: invoices[i].invoice_type_relative,
              KHMSHDCLQuan: invoices[i].form_no_relative,
              KHHDCLQuan: invoices[i].serial_no_relative,
              SHDCLQuan: invoices[i].invoice_no_relative,
              NLHDCLQuan: invoices[i].invoice_date_relative,
              GChu: invoices[i].description,
            });
          }

          objInvoice.DLHDon.TTChung.TTKhac = {};
          objInvoice.DLHDon.TTChung.TTKhac.TTin = [];
          objInvoice.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: 'PortalLink',
            KDLieu: 'string',
            DLieu: 'https://einvoicepro.webcashvietnam.com/login',
          });

          if (invoices[i].currency) {
            objInvoice.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'DVTTe',
              KDLieu: 'string',
              DLieu: invoices[i].currency,
            });
          }
          if (invoices[i].ex_rate) {
            objInvoice.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'TGia',
              KDLieu: 'number',
              DLieu: invoices[i].ex_rate,
            });
          }
          if (invoices[i].payment_method) {
            objInvoice.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'HTTToan',
              KDLieu: 'string',
              DLieu: invoices[i].payment_method,
            });
          }
          objInvoice.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: 'MSTTCGP',
            KDLieu: 'string',
            DLieu: '1201496252',
          });

          objInvoice.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(invoices[i].seller_comp_name);
          objInvoice.DLHDon.NDHDon.NBan.MST = invoices[i].seller_taxcode;
          objInvoice.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(invoices[i].seller_address);
          objInvoice.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_phone;

          objInvoice.DLHDon.NDHDon.NBan.TTKhac = {};
          objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin = [];

          if (invoices[i].seller_email) {
            objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'DCTDTu',
              KDLieu: 'string',
              DLieu: invoices[i].seller_email,
            });
          }

          if (invoices[i].seller_bank_no) {
            objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'STKNHang',
              KDLieu: 'string',
              DLieu: invoices[i].seller_bank_no,
            });
          }

          if (invoices[i].seller_bank_name) {
            objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'TNHang',
              KDLieu: 'string',
              DLieu: invoices[i].seller_bank_name,
            });
          }

          if (invoices[i].seller_fax) {
            objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'Fax',
              KDLieu: 'string',
              DLieu: invoices[i].seller_fax,
            });
          }

          if (invoices[i].seller_website) {
            objInvoice.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'Website',
              KDLieu: 'string',
              DLieu: invoices[i].seller_website,
            });
          }

          objInvoice.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(invoices[i].buyer_comp_name);
          objInvoice.DLHDon.NDHDon.NMua.MST = invoices[i].buyer_taxcode;
          objInvoice.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(invoices[i].buyer_address);
          objInvoice.DLHDon.NDHDon.NMua.CCCDan = invoices[i].buyer_cccd;
          objInvoice.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_phone;

          objInvoice.DLHDon.NDHDon.NMua.TTKhac = {};
          objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin = [];

          if (invoices[i].buyer_code) {
            objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'MKHang',
              KDLieu: 'string',
              DLieu: invoices[i].buyer_code,
            });
          }

          if (invoices[i].buyer_email) {
            objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'DCTDTu',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_email),
            });
          }

          if (invoices[i].buyer_nm) {
            objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'HVTNMHang',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_nm),
            });
          }

          if (invoices[i].buyer_bank_no) {
            objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'STKNHang',
              KDLieu: 'string',
              DLieu: invoices[i].buyer_bank_no,
            });
          }

          if (invoices[i].buyer_bank_name) {
            objInvoice.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'TNHang',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_bank_name),
            });
          }
          //if(invoices[i].buyer_phone)

          objInvoice.DLHDon.NDHDon.DSHHDVu = [];

          objInvoice.DLHDon.NDHDon.DSHHDVu = {};
          objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

          for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
            //console.log("invoices[i].detail_invoice  ", invoices[i].detail_invoice);
            if (invoices[i].detail_invoice[j].amt_vat) {
              let TTKhac = {};
              TTKhac.TTin = [];
              TTKhac.TTin.push({
                TTruong: 'VATAmount',
                KDLieu: 'decimal',
                DLieu: invoices[i].detail_invoice[j].amt_vat,
              });

              objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
                TChat: invoices[i].detail_invoice[j].feature,
                STT: invoices[i].detail_invoice[j].seq,
                MHHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_code),
                THHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_name),
                DVTinh: invoices[i].detail_invoice[j].item_uom,
                SLuong: invoices[i].detail_invoice[j].quantity,
                DGia: invoices[i].detail_invoice[j].uprice,
                TLCKhau: invoices[i].detail_invoice[j].dc_rate,
                STCKhau: invoices[i].detail_invoice[j].dc_amt,
                ThTien: invoices[i].detail_invoice[j].amt,
                TSuat: invoices[i].detail_invoice[j].vat_rate,
                TTKhac: TTKhac,
              });
            } else {
              objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
                TChat: invoices[i].detail_invoice[j].feature,
                STT: invoices[i].detail_invoice[j].seq,
                MHHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_code),
                THHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_name),
                DVTinh: invoices[i].detail_invoice[j].item_uom,
                SLuong: invoices[i].detail_invoice[j].quantity,
                DGia: invoices[i].detail_invoice[j].uprice,
                TLCKhau: invoices[i].detail_invoice[j].dc_rate,
                STCKhau: invoices[i].detail_invoice[j].dc_amt,
                ThTien: invoices[i].detail_invoice[j].amt,
                TSuat: invoices[i].detail_invoice[j].vat_rate,
              });
            }
          }

          objInvoice.DLHDon.NDHDon.TToan = {};
          objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat = {};
          objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

          //console.log(' weTaxPosReportToTax invoices[i].total_vat_list', invoices[i].total_vat_list);

          for (let j = 0; j < invoices[i].total_vat_list.length; j++) {
            objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
              TSuat: invoices[i].total_vat_list[j].sub_vat_rate,
              ThTien: invoices[i].total_vat_list[j].sub_amt,
              TThue: invoices[i].total_vat_list[j].sub_amt_vat,
            });
          }

          objInvoice.DLHDon.NDHDon.TToan.TgTCThue = invoices[i].total_amt;
          objInvoice.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_amt_vat;

          objInvoice.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_amt_dc;
          objInvoice.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].total_payment;
          objInvoice.DLHDon.NDHDon.TToan.TgTTTBChu = invoices[i].total_payment_word_vie; // await Utils.Num2VNText2(invoices[i].total_payment.toString(), invoices[i].currency);

          objInvoice.DSCKS.NBan = '';

          objInvoice.MCCQT = invoices[i].mccqt; //`M1-24-VZQYY-${Math.floor(10000000000 + Math.random() * 9000000000)}`; //

          objInvoice = {
            DLHDon: {
              TTChung: {
                PBan: '',
                THDon: '',
                KHMSHDon: '',
                KHHDon: '',
                SHDon: '',
                NLap: '',
                TTKhac: '',
              },
              NDHDon: {
                NBan: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  SDThoai: '',
                  TTKhac: '',
                },
                NMua: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  SDThoai: '',

                  CCCDan: '',
                  TTKhac: '',
                },
                DSHHDVu: {},
                TToan: {
                  THTTLTSuat: {
                    LTSuat: {
                      TSuat: '',
                      ThTien: '',
                      TThue: '',
                    },
                  },
                  TgTCTHue: '',
                  TgTThue: '',
                  DSLPhi: {
                    LPhi: {},
                  },
                  TTCKTMai: '',
                  TgTTTBSo: '',
                  TgTTTBChu: '',
                },
              },
            },
            DSCKS: {},
          };
        }
        const id = uuid.v4();
        const signature_path = 'TDiep/CKSNNT';
        const xml = this.OBJtoXML(objData);
        const xmlId = xml.toString().replace('<DLieu>', `<DLieu Id=\'${id}\'>`);
        const xmlRemoveLine = xmlId.toString().replace(/\n/g, '').replaceAll('"', "'");
        json_xml = {
          sign_id: id,
          signature_path: signature_path,
          xml: xmlRemoveLine,
          req_key: req_key,
        };
      } else if (process_type == 'I') {
        objInvoice = {
          HDon: {
            DLHDon: {
              TTChung: {
                PBan: '',
                THDon: '',
                KHMSHDon: '',
                KHHDon: '',
                SHDon: '',
                NLap: '',
                TTKhac: '',
              },
              NDHDon: {
                NBan: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  SDThoai: '',
                  TTKhac: '',
                },
                NMua: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  SDThoai: '',
                  CCCDan: '',
                  TTKhac: '',
                },
                DSHHDVu: {},
                TToan: {
                  THTTLTSuat: {
                    LTSuat: {
                      TSuat: '',
                      ThTien: '',
                      TThue: '',
                    },
                  },
                  TgTCTHue: '',
                  TgTThue: '',
                  DSLPhi: {
                    LPhi: {},
                  },
                  TTCKTMai: '',
                  TgTTTBSo: '',
                  TgTTTBChu: '',
                },
              },
            },
            DSCKS: {},
          },
        };

        //console.log('invoices ', invoices);
        for (let i = 0; i < invoices.length; i++) {
          //console.log('invoices ', invoices[i]);
          const lastInvoiceNo = await DBService.callProcCursor(
            'wt_sel_last_invoice_no',
            [invoices[i].seller_taxcode, invoices[i].serial_no, invoices[i].form_no],
            p_language,
            p_crt_by,
            'N',
          );
          let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
          const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
          const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
          if (isNaN(last_invoice_no)) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `Failed to create invoice no. Please contact administrator for helping.`,
                data: null,
              }),
            );
          }

          if (invoices[i].invoice_date < last_invoice_date && !invoices[i].invoice_no) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `invoice date cannot smaller than ${last_invoice_date}.`,
                data: invoices[i].invoice_date,
              }),
            );
          }
          if (invoices[i].invoice_date >= tomorrow_date) {
            return response
              .status(409)
              .json(
                Utils.responseByRule({success: false, message: `invoice date cannot greater than ${tomorrow_date}.`, data: invoices[i].invoice_date}),
              );
          }
          req_key = invoices[i].sale_id;

          const para_value = {
            sale_date: sale_date,
            store_code: store_code,
            store_name: store_name,
            pos_no: '',
            bill_no: '',
            version: invoices[i].version,
            invoice_name: invoices[i].invoice_name,
            symbol_type: invoices[i].form_no, //invoices[i].symbol_type,
            form_no: invoices[i].form_no,
            serial_no: invoices[i].serial_no,
            invoice_date: invoices[i].invoice_date,
            invoice_no: invoices[i].invoice_no,
            currency: invoices[i].currency,
            ex_rate: invoices[i].ex_rate,
            payment_method: invoices[i].payment_method,
            seller_comp_name: invoices[i].seller_comp_name,
            seller_taxcode: invoices[i].seller_taxcode,
            seller_address: invoices[i].seller_address,
            seller_phone: invoices[i].seller_phone,
            buyer_nm: invoices[i].buyer_nm || '', //tam thoi dong -- vng-199
            buyer_comp_name: invoices[i].buyer_comp_name,
            buyer_taxcode: invoices[i].buyer_taxcode,
            buyer_phone: invoices[i].buyer_phone,
            buyer_address: invoices[i].buyer_address,
            buyer_cccd: invoices[i].buyer_cccd,
            buyer_email: invoices[i].buyer_email,
            buyer_email_cc: invoices[i].buyer_email_cc,
            total_amt_no_vat: invoices[i].total_amt,
            total_amt_dc: invoices[i].total_amt_dc || 0,
            total_amt_vat: invoices[i].total_amt_vat,
            total_payment: invoices[i].total_payment,
            total_payment_word_vie: invoices[i].total_payment_word_vie,
            mccqt: invoices[i].mccqt,
            data_xml: '',
            count_length: '',
            xml_type: '',
          };
          //console.log(para_value);
          const rtnValue = await DBService.ExecuteSQLBlob(
            `BEGIN wt_upd_send_order_info (          
                                                            :sale_date,
                                                            :store_code,
                                                            :store_name,
                                                            :pos_no,
                                                            :bill_no,
                                                            :version,
                                                            :invoice_name,
                                                            :symbol_type,
                                                            :form_no,
                                                            :serial_no,
                                                            :invoice_date,
                                                            :invoice_no,
                                                            :currency,
                                                            :ex_rate,
                                                            :payment_method,
                                                            :seller_comp_name,
                                                            :seller_taxcode,
                                                            :seller_address,
                                                            :seller_phone,
                                                            :buyer_nm,
                                                            :buyer_comp_name,
                                                            :buyer_taxcode,
                                                            :buyer_phone,
                                                            :buyer_address,
                                                            :buyer_cccd,
                                                            :buyer_email,
                                                            :buyer_email_cc,
                                                            :total_amt_no_vat,
                                                            :total_amt_dc,
                                                            :total_amt_vat,
                                                            :total_payment,
                                                            :total_payment_word_vie,
                                                            :mccqt,
                                                            :data_xml,
                                                            :count_length,
                                                            :xml_type,
                                                            :p_language, 
                                                            :p_crt_by, 
                                                            :p_rtn_cur); END;`,
            para_value,
            p_language,
            p_crt_by,
          );
          //console.log(' weTaxGeneralXML rtnValue ', rtnValue);

          let tei_wt_sale_bill_pk = rtnValue.p_rtn_cur[0].PK;

          if (rtnValue.p_rtn_cur[0].STATUS == 'OK') {
            data_send_mail.push({
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              lookup_code: rtnValue.p_rtn_cur[0].LOOKUP_CODE,
              invoice: invoices[i],
            });
            for (let j = 0; j < invoices[i].total_vat_list.length; j++) {
              const para_amt_vat = {
                tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
                sub_amt: invoices[i].total_vat_list[j].sub_amt,
                sub_vat_rate: invoices[i].total_vat_list[j].sub_vat_rate,
                sub_vat_amt: invoices[i].total_vat_list[j].sub_amt_vat,
              };

              //console.log('wt_upd_sale_bill_vat  para_amt_vat ', para_amt_vat);

              await DBService.ExecuteSQLBlob(
                `BEGIN wt_upd_sale_bill_vat (          
                                                                  :tei_wt_sale_bill_pk,
                                                                  :sub_amt,
                                                                  :sub_vat_rate,
                                                                  :sub_vat_amt,
                                                                  :p_language, 
                                                                  :p_crt_by, 
                                                                  :p_rtn_cur); END;`,
                para_amt_vat,
                p_language,
                p_crt_by,
              );
            }

            for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
              const para_prod_details = {
                tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
                feature: invoices[i].detail_invoice[j].feature,
                seq: invoices[i].detail_invoice[j].seq,
                item_code: invoices[i].detail_invoice[j].item_code,
                item_name: invoices[i].detail_invoice[j].item_name,
                unit: invoices[i].detail_invoice[j].unit,
                quantity: invoices[i].detail_invoice[j].quantity,
                unit_price: invoices[i].detail_invoice[j].uprice,
                dc_rate: invoices[i].detail_invoice[j].dc_rate,
                dc_amt: invoices[i].detail_invoice[j].dc_amt,
                amount: invoices[i].detail_invoice[j].amt,
                vat_rate: invoices[i].detail_invoice[j].vat_rate,
              };

              //console.log('wt_upd_sale_prod  para_prod_details ', para_prod_details);
              await DBService.ExecuteSQLBlob(
                `BEGIN wt_upd_sale_prod (          
                                                                  :tei_wt_sale_bill_pk,
                                                                  :feature,
                                                                  :seq,
                                                                  :item_code,
                                                                  :item_name,
                                                                  :unit,
                                                                  :quantity,
                                                                  :unit_price,
                                                                  :dc_rate,
                                                                  :dc_amt,
                                                                  :amount,
                                                                  :vat_rate,
                                                                  :p_language, 
                                                                  :p_crt_by, 
                                                                  :p_rtn_cur); END;`,
                para_prod_details,
                p_language,
                p_crt_by,
              );
            }
          } else {
            console.log('invoices[i].form_no continue', invoices[i].form_no);

            continue;
          }

          console.log('invoices[i].form_no xxxxx', invoices[i].form_no);

          if (invoices[i].form_no == 1) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 2) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 3) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán tài sản công khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 4) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 5) {
            objInvoice.HDon.DLHDon.TTChung.THDon =
              'Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền';
          } else if (invoices[i].form_no == 6) {
            objInvoice.HDon.DLHDon.TTChung.THDon =
              'Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền';
          }
          objInvoice.HDon.DLHDon.TTChung.PBan = invoices[i].version;
          objInvoice.HDon.DLHDon.TTChung.KHMSHDon = invoices[i].form_no;
          objInvoice.HDon.DLHDon.TTChung.KHHDon = invoices[i].serial_no;
          objInvoice.HDon.DLHDon.TTChung.SHDon = invoices[i].invoice_no;
          objInvoice.HDon.DLHDon.TTChung.NLap = invoices[i].invoice_date;

          objInvoice.HDon.DLHDon.TTChung.TTHDLQuan = [];

          if (invoices[i].invoice_feature != 0 && invoices[i].invoice_feature != null) {
            //
            objInvoice.HDon.DLHDon.TTChung.TTHDLQuan.push({
              TCHDon: invoices[i].invoice_feature,
              LHDCLQuan: invoices[i].invoice_type_relative,
              KHMSHDCLQuan: invoices[i].form_no_relative,
              KHHDCLQuan: invoices[i].serial_no_relative,
              SHDCLQuan: invoices[i].invoice_no_relative,
              NLHDCLQuan: invoices[i].invoice_date_relative,
              GChu: invoices[i].description,
            });
          }

          objInvoice.HDon.DLHDon.TTChung.TTKhac = {};
          objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin = [];
          objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: 'PortalLink',
            KDLieu: 'string',
            DLieu: 'https://einvoicepro.webcashvietnam.com/login',
          });

          if (invoices[i].currency) {
            objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'DVTTe',
              KDLieu: 'string',
              DLieu: invoices[i].currency,
            });
          }
          if (invoices[i].ex_rate) {
            objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'TGia',
              KDLieu: 'number',
              DLieu: invoices[i].ex_rate,
            });
          }
          if (invoices[i].payment_method) {
            objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin.push({
              TTruong: 'HTTToan',
              KDLieu: 'string',
              DLieu: invoices[i].payment_method,
            });
          }
          objInvoice.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: 'MSTTCGP',
            KDLieu: 'string',
            DLieu: '1201496252',
          });

          objInvoice.HDon.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(invoices[i].seller_comp_name);
          objInvoice.HDon.DLHDon.NDHDon.NBan.MST = invoices[i].seller_taxcode;
          objInvoice.HDon.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(invoices[i].seller_address);
          objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_phone;

          objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac = {};
          objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin = [];

          if (invoices[i].seller_email) {
            objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'DCTDTu',
              KDLieu: 'string',
              DLieu: invoices[i].seller_email,
            });
          }

          if (invoices[i].seller_bank_no) {
            objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'STKNHang',
              KDLieu: 'string',
              DLieu: invoices[i].seller_bank_no,
            });
          }

          if (invoices[i].seller_bank_name) {
            objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'TNHang',
              KDLieu: 'string',
              DLieu: invoices[i].seller_bank_name,
            });
          }

          if (invoices[i].seller_fax) {
            objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'Fax',
              KDLieu: 'string',
              DLieu: invoices[i].seller_fax,
            });
          }

          if (invoices[i].seller_website) {
            objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac.TTin.push({
              TTruong: 'Website',
              KDLieu: 'string',
              DLieu: invoices[i].seller_website,
            });
          }

          objInvoice.HDon.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(invoices[i].buyer_comp_name);
          objInvoice.HDon.DLHDon.NDHDon.NMua.MST = invoices[i].buyer_taxcode;
          objInvoice.HDon.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(invoices[i].buyer_address);
          objInvoice.HDon.DLHDon.NDHDon.NMua.CCCDan = invoices[i].buyer_cccd;
          objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_phone;

          objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac = {};
          objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin = [];

          if (invoices[i].buyer_code) {
            objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'MKHang',
              KDLieu: 'string',
              DLieu: invoices[i].buyer_code,
            });
          }

          if (invoices[i].buyer_email) {
            objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'DCTDTu',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_email),
            });
          }

          if (invoices[i].buyer_nm) {
            objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'HVTNMHang',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_nm),
            });
          }

          if (invoices[i].buyer_bank_no) {
            objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'STKNHang',
              KDLieu: 'string',
              DLieu: invoices[i].buyer_bank_no,
            });
          }

          if (invoices[i].buyer_bank_name) {
            objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac.TTin.push({
              TTruong: 'TNHang',
              KDLieu: 'string',
              DLieu: this.convertHtmlCode(invoices[i].buyer_bank_name),
            });
          }
          //if(invoices[i].buyer_phone)

          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

          for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
            console.log('invoices[i].detail_invoice  ', invoices[i].detail_invoice);
            if (invoices[i].detail_invoice[j].amt_vat) {
              let TTKhac = {};
              TTKhac.TTin = [];
              TTKhac.TTin.push({
                TTruong: 'VATAmount',
                KDLieu: 'decimal',
                DLieu: invoices[i].detail_invoice[j].amt_vat,
              });

              objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
                TChat: invoices[i].detail_invoice[j].feature,
                STT: invoices[i].detail_invoice[j].seq,
                MHHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_code),
                THHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_name),
                DVTinh: invoices[i].detail_invoice[j].item_uom,
                SLuong: invoices[i].detail_invoice[j].quantity,
                DGia: invoices[i].detail_invoice[j].uprice,
                TLCKhau: invoices[i].detail_invoice[j].dc_rate,
                STCKhau: invoices[i].detail_invoice[j].dc_amt,
                ThTien: invoices[i].detail_invoice[j].amt,
                TSuat: invoices[i].detail_invoice[j].vat_rate,
                TTKhac: TTKhac,
              });
            } else {
              objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
                TChat: invoices[i].detail_invoice[j].feature,
                STT: invoices[i].detail_invoice[j].seq,
                MHHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_code),
                THHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_name),
                DVTinh: invoices[i].detail_invoice[j].item_uom,
                SLuong: invoices[i].detail_invoice[j].quantity,
                DGia: invoices[i].detail_invoice[j].uprice,
                TLCKhau: invoices[i].detail_invoice[j].dc_rate,
                STCKhau: invoices[i].detail_invoice[j].dc_amt,
                ThTien: invoices[i].detail_invoice[j].amt,
                TSuat: invoices[i].detail_invoice[j].vat_rate,
              });
            }
          }

          objInvoice.HDon.DLHDon.NDHDon.TToan = {};
          objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat = {};
          objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

          //console.log(' weTaxPosReportToTax invoices[i].total_vat_list', invoices[i].total_vat_list);

          for (let j = 0; j < invoices[i].total_vat_list.length; j++) {
            objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
              TSuat: invoices[i].total_vat_list[j].sub_vat_rate,
              ThTien: invoices[i].total_vat_list[j].sub_amt,
              TThue: invoices[i].total_vat_list[j].sub_amt_vat,
            });
          }

          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoices[i].total_amt;
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_amt_vat;

          objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_amt_dc;
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].total_payment;
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = invoices[i].total_payment_word_vie; // await Utils.Num2VNText2(invoices[i].total_payment.toString(), invoices[i].currency);

          objInvoice.HDon.DSCKS.NBan = '';

          objInvoice.HDon.MCCQT = invoices[i].mccqt; //`M1-24-VZQYY-${Math.floor(10000000000 + Math.random() * 9000000000)}`; //
        }
        //console.log('json_xml objInvoice', JSON.stringify(objInvoice));

        const id = uuid.v4();
        const signature_path = 'HDon/DSCKS/NBan';
        const xml = this.OBJtoXML(objInvoice);
        const xmlStr = xml.toString().replace('<DLHDon>', `<DLHDon Id=\'${id}\'>`).replace(/\n/g, '').replaceAll('"', "'");

        json_xml.push({
          sign_id: id,
          signature_path: signature_path,
          xml: xmlStr,
          req_key: req_key,
          xml_process: true,
        });

        //return;
      } else if (process_type == 'N') {
        objInvoice = {
          HDon: {
            DLHDon: {
              TTChung: {
                PBan: '',
                THDon: '',
                KHMSHDon: '',
                KHHDon: '',
                SHDon: '',
                NLap: '',
                DVTTe: '',
                TGia: '',
                HTTToan: '',
                MSTTCGP: '',
              },
              NDHDon: {
                NBan: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  SDThoai: '',
                  DCTDTu: '',
                  STKNHang: '',
                  TNHang: '',
                  Fax: '',
                  Website: '',
                  TTKhac: '',
                },
                NMua: {
                  Ten: '',
                  MST: '',
                  DChi: '',
                  MKHang: '',
                  SDThoai: '',
                  DCTDTu: '',
                  STKNHang: '',
                  HVTNMHang: '',
                  TNHang: '',
                  TTKhac: '',
                },
                DSHHDVu: {},
                TToan: {
                  THTTLTSuat: {
                    LTSuat: {
                      TSuat: '',
                      ThTien: '',
                      TThue: '',
                    },
                  },
                  TgTCThue: '',
                  TgTThue: '',
                  TTCKTMai: '',
                  TgTTTBSo: '',
                  TgTTTBChu: '',
                },
              },
            },
            DSCKS: {},
          },
        };
        if (invoices.length == undefined || invoices.length == 0) {
          // return response.send(Utils.response(false, `Invalid json format!`,null));
          return response.status(400).json(Utils.responseByRule({success: false, message: 'Invalid json format!'}));
        }

        for (let i = 0; i < invoices.length; i++) {
          //console.log("invoices:", invoices[i])
          const lastInvoiceNo = await DBService.callProcCursor(
            'wt_sel_last_invoice_no',
            [invoices[i].seller_taxcode, invoices[i].serial_no, invoices[i].form_no],
            'ENG',
            p_crt_by,
            'N',
          );
          let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
          const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
          const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
          if (isNaN(last_invoice_no)) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `Failed to create invoice no. Please contact administrator for helping.`,
                data: null,
              }),
            );
          }

          if (invoices[i].invoice_date < last_invoice_date && !invoices[i].invoice_no) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `invoice date cannot smaller than ${last_invoice_date}.`,
                data: invoices[i].invoice_date,
              }),
            );
          }
          if (invoices[i].invoice_date >= tomorrow_date) {
            return response
              .status(409)
              .json(
                Utils.responseByRule({success: false, message: `invoice date cannot greater than ${tomorrow_date}.`, data: invoices[i].invoice_date}),
              );
          }

          if (invoices[i].invoice_date < last_invoice_date && !invoices[i].invoice_no) {
            return response.status(409).json(
              Utils.responseByRule({
                success: false,
                message: `invoice date cannot smaller than ${last_invoice_date}.`,
                data: invoices[i].invoice_date,
              }),
            );
          }
          if (invoices[i].invoice_date >= tomorrow_date) {
            return response
              .status(409)
              .json(
                Utils.responseByRule({success: false, message: `invoice date cannot greater than ${tomorrow_date}.`, data: invoices[i].invoice_date}),
              );
          }

          /*const data_raw_param = {
            p_req_key: invoices[i].master_pk,
            p_data_raw: JSON.stringify(invoices[i]),
          };

          // console.log('weTaxSendPosInvoiceToTaxOffice param_pos  ', param_pos);
          await DBService.ExecuteSQLBlob(
            `BEGIN WT_UPD_DATA_RAW(
                                :p_req_key,
                                :p_data_raw,
                                :p_language, 
                                :p_crt_by, 
                                :p_rtn_cur); 
                END;`,
            data_raw_param,
            p_language,
            p_crt_by,
          );*/
          req_key = invoices[i].sale_id;
          if (invoices[i].form_no == 1) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn giá trị gia tăng';
          } else if (invoices[i].form_no == 2) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng';
          } else if (invoices[i].form_no == 3) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán tài sản công';
          } else if (invoices[i].form_no == 4) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Hóa đơn bán hàng dự trữ quốc gia';
          } else if (invoices[i].form_no == 5) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng';
          } else if (invoices[i].form_no == 6) {
            objInvoice.HDon.DLHDon.TTChung.THDon = 'Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý';
          }
          objInvoice.HDon.DLHDon.TTChung.PBan = invoices[i].version;
          objInvoice.HDon.DLHDon.TTChung.KHMSHDon = invoices[i].form_no;
          objInvoice.HDon.DLHDon.TTChung.KHHDon = invoices[i].serial_no;
          objInvoice.HDon.DLHDon.TTChung.SHDon = invoices[i].invoice_no;
          objInvoice.HDon.DLHDon.TTChung.NLap = invoices[i].invoice_date;
          objInvoice.HDon.DLHDon.TTChung.DVTTe = invoices[i].currency;
          objInvoice.HDon.DLHDon.TTChung.TGia = invoices[i].ex_rate;
          objInvoice.HDon.DLHDon.TTChung.HTTToan = invoices[i].payment_method;
          objInvoice.HDon.DLHDon.TTChung.MSTTCGP = '1201496252'; //webcashgenuwin.com taxcode

          objInvoice.HDon.DLHDon.TTChung.TTHDLQuan = [];
          // console.log("invoices[i].invoice_feature  " ,invoices[i].invoice_feature)
          if (invoices[i].invoice_feature != 0 && invoices[i].invoice_feature != null) {
            //
            objInvoice.HDon.DLHDon.TTChung.TTHDLQuan.push({
              TCHDon: invoices[i].invoice_feature,
              LHDCLQuan: invoices[i].invoice_type_relative,
              KHMSHDCLQuan: invoices[i].form_no_relative,
              KHHDCLQuan: invoices[i].serial_no_relative,
              SHDCLQuan: invoices[i].invoice_no_relative,
              NLHDCLQuan: invoices[i].invoice_date_relative,
              GChu: invoices[i].description,
            });
          }

          objInvoice.HDon.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(invoices[i].seller_comp_name) || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.MST = invoices[i].seller_taxcode || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(invoices[i].seller_address) || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_phone || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.DCTDTu = invoices[i].seller_email || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.STKNHang = invoices[i].seller_bank_no || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.TNHang = this.convertHtmlCode(invoices[i].seller_bank_name) || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.Fax = invoices[i].seller_fax || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.Website = invoices[i].seller_website || '';
          objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac = '';

          objInvoice.HDon.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(invoices[i].buyer_comp_name) || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.MST = invoices[i].buyer_taxcode || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_phone || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(invoices[i].buyer_address) || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.MKHang = invoices[i].buyer_code || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.HVTNMHang = this.convertHtmlCode(invoices[i].buyer_name) || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.DCTDTu = invoices[i].buyer_email || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.STKNHang = invoices[i].buyer_bank_no || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.TNHang = this.convertHtmlCode(invoices[i].buyer_bank_name) || '';
          objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac = '';

          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

          objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

          for (let k = 0; k < invoices[i].total_vat_list.length; k++) {
            objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
              TSuat: invoices[i].total_vat_list[k].sub_vat_rate || '0%',
              ThTien: invoices[i].total_vat_list[k].sub_amt || '0',
              TThue: invoices[i].total_vat_list[k].sub_amt_vat || '0',
            });
          }

          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoices[i].total_amt || '0';
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_amt_vat || '0';
          objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_amt_dc || '0';
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].total_payment || '0';
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = invoices[i].total_payment_word_vie; //await Utils.Num2VNText2(invoices[i].total_payment.toString() || '0', invoices[i].currency);

          objInvoice.HDon.DSCKS.NBan = '';
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

          for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
            //console.log("invoices[i].detail_invoice  ", invoices[i].detail_invoice);
            objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
              TChat: invoices[i].detail_invoice[j].feature,
              STT: invoices[i].detail_invoice[j].seq,
              MHHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_code),
              THHDVu: this.convertHtmlCode(invoices[i].detail_invoice[j].item_name),
              DVTinh: invoices[i].detail_invoice[j].unit,
              SLuong: invoices[i].detail_invoice[j].quantity,
              DGia: invoices[i].detail_invoice[j].uprice,
              TLCKhau: invoices[i].detail_invoice[j].dc_rate,
              STCKhau: invoices[i].detail_invoice[j].dc_amt,
              ThTien: invoices[i].detail_invoice[j].amt,
              TSuat: invoices[i].detail_invoice[j].vat_rate,
              TTKhac: [
                {
                  TTin: {
                    TTruong: 'VATAmount',
                    KDLieu: 'decimal',
                    DLieu: invoices[i].detail_invoice[j].amt_vat,
                  },
                },
              ],
            });
          }

          const id = uuid.v4();
          const signature_path = 'HDon/DSCKS/NBan';
          const xml = this.OBJtoXML(objInvoice);
          const xmlStr = xml.toString().replace('<DLHDon>', `<DLHDon Id=\'${id}\'>`).replace(/\n/g, '').replaceAll('"', "'");

          json_xml.push({
            sign_id: id,
            signature_path: signature_path,
            xml: xmlStr,
            req_key: req_key,
            xml_process: true,
          });
        }
      }
      return {json_xml, data_send_mail};
    } catch (error) {
      console.log('EInvoiceController2 weTaxPosReportToTax error', error);
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxPosReportToTax',
        CONTENT: error.message,
      });

      return [];
    }
  }

  async weTaxSignXMLHSM(user_name, password, otp, tax_serial_number, pin, organization, signing_xml, process_type) {
    try {
      const url = 'http://demosign.easyca.vn:8080/api';
      const site = 'test';

      // const url =  'https://sign.easyca.vn/api/'; //
      // const site = 'real';

      if (!user_name || !password || !pin || !organization || !tax_serial_number || !signing_xml) {
        return {};
      }

      let data;

      //console.log('organization  ', organization, ' process_type ', process_type);

      switch (organization) {
        case 'easysign':
          if (process_type == 'I') {
            const res_1 = await Request.post(WEBSERVICE_C_SHARP + '/SignXml', {
              xmlContent: JSON.stringify({user_name, password, tax_serial_number, pin, organization, otp, signing_xml, url, site}),
            });
            data = res_1.data.d;

            //console.log('weTaxSignXMLHSM  ', data);

            let data_sign_xml = JSON.parse(data);

            const id = uuid.v4();
            const signature_path = 'TDiep/CKSNNT';

            const xmlRemoveLine = `<TDiep><DLieu Id=\'${id}\'> ` + data_sign_xml.data[0].signed_xml + `</DLieu><CKSNNT></CKSNNT></TDiep>`;

            signing_xml = [];
            signing_xml.push({
              sign_id: id,
              signature_path: signature_path,
              xml: xmlRemoveLine,
              req_key: data_sign_xml.data[0].req_key,
            });

            //console.log('weTaxSignXMLHSM signing_xml  ', signing_xml);

            const res_2 = await Request.post(WEBSERVICE_C_SHARP + '/SignXml', {
              xmlContent: JSON.stringify({user_name, password, tax_serial_number, pin, organization, otp, signing_xml, url, site}),
            });
            data = JSON.parse(res_2.data.d); //  data_sign_xml; //;
          } else if (process_type == 'N') {
            const res = await Request.post(WEBSERVICE_C_SHARP + '/SignXml', {
              xmlContent: JSON.stringify({user_name, password, tax_serial_number, pin, organization, otp, signing_xml, url, site}),
            });
            //console.log('res.data.d  ', res.data.d);
            data = JSON.parse(res.data.d);
          }
          break;
        default:
          data = {};
          break;
      }
      return data;
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxSignXMLHSM',
        CONTENT: e.message,
      });
      console.log(e);
      return {};
    }
  }

  async weTaxExtractPosXMLContent(
    xml_no_sign,
    xml_content,
    seller_tax_code,
    seller_date,
    tax_serial_number,
    req_key,
    store_code,
    store_name,
    lookup_code,
    process_type,
    p_language,
    p_crt_by,
  ) {
    let check_data = {};
    let data_inv = [];
    let status = '';
    try {
      const template = [
        '//HDon',
        {
          DLHDon: {
            TTChung: {
              PBan: 'DLHDon/TTChung/PBan',
              THDon: 'DLHDon/TTChung/THDon',
              KHMSHDon: 'DLHDon/TTChung/KHMSHDon',
              KHHDon: 'DLHDon/TTChung/KHHDon',
              SHDon: 'DLHDon/TTChung/SHDon',

              NLap: 'DLHDon/TTChung/NLap',
              TTKhac: [
                'DLHDon/TTChung/TTKhac/TTin',
                {
                  TTruong: 'TTruong',
                  KDLieu: 'KDLieu',
                  DLieu: 'DLieu',
                },
              ],
            },
            NDHDon: {
              NBan: {
                Ten: 'DLHDon/NDHDon/NBan/Ten',
                MST: 'DLHDon/NDHDon/NBan/MST',
                DChi: 'DLHDon/NDHDon/NBan/DChi',
                SDThoai: 'DLHDon/NDHDon/NBan/SDThoai',
                TTKhac: [
                  'DLHDon/NDHDon/NBan/TTKhac/TTin',
                  {
                    TTruong: 'TTruong',
                    KDLieu: 'KDLieu',
                    DLieu: 'DLieu',
                  },
                ],
              },
              NMua: {
                Ten: 'DLHDon/NDHDon/NMua/Ten',
                MST: 'DLHDon/NDHDon/NMua/MST',
                DChi: 'DLHDon/NDHDon/NMua/DChi',
                SDThoai: 'DLHDon/NDHDon/NMua/SDThoai',
                CCCDan: 'DLHDon/NDHDon/NMua/CCCDan',
                TTKhac: [
                  'DLHDon/NDHDon/NMua/TTKhac/TTin',
                  {
                    TTruong: 'TTruong',
                    KDLieu: 'KDLieu',
                    DLieu: 'DLieu',
                  },
                ],
              },
              DSHHDVu: {
                HHDVu: [
                  'DLHDon/NDHDon/DSHHDVu/HHDVu',
                  {
                    TChat: 'TChat',
                    STT: 'STT',
                    MHHDVu: 'MHHDVu',
                    THHDVu: 'THHDVu',
                    DVTinh: 'DVTinh',
                    SLuong: 'SLuong',
                    DGia: 'DGia',
                    TLCKhau: 'TLCKhau',
                    STCKhau: 'STCKhau',
                    ThTien: 'ThTien',
                    TSuat: 'TSuat',
                    TTKhac: [
                      'TTKhac/TTin',
                      {
                        TTruong: 'TTruong',
                        KDLieu: 'KDLieu',
                        DLieu: 'DLieu',
                      },
                    ],
                  },
                ],
              },
              TToan: {
                THTTLTSuat: {
                  LTSuat: [
                    'DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat',
                    {
                      TSuat: 'TSuat',
                      ThTien: 'ThTien',
                      TThue: 'TThue',
                    },
                  ],
                },
                DSLPhi: {
                  LPhi: [
                    'DLHDon/NDHDon/TToan/DSLPhi/LPhi',
                    {
                      TLPhi: 'TLPhi',
                      TPhi: 'TPhi',
                    },
                  ],
                },
                TgTCThue: 'DLHDon/NDHDon/TToan/TgTCThue',
                TgTThue: 'DLHDon/NDHDon/TToan/TgTThue',
                TTCKTMai: 'DLHDon/NDHDon/TToan/TTCKTMai',
                TgTTTBSo: 'DLHDon/NDHDon/TToan/TgTTTBSo',
                TgTTTBChu: 'DLHDon/NDHDon/TToan/TgTTTBChu',
              },
            },
          },
          DSCKS: [
            'DSCKS',
            {
              NBan: 'NBan',
            },
          ],
          MCCQT: 'MCCQT',
        },
      ];
      //console.log('xml_content  ', xml_content);
      const jsonInvoice = await transform(xml_content, template);

      //console.log('jsonInvoice  ', JSON.stringify(jsonInvoice));

      var xpath = require('xpath');
      var dom = require('@xmldom/xmldom').DOMParser;

      var doc = new dom().parseFromString(xml_content, 'text/xml');
      var nodes = xpath.select('//HDon', doc);

      const templateSignTime = {
        SigningTime: 'TDiep/DLieu/HDon/DSCKS/NBan/Signature/Object/SignatureProperties/SignatureProperty/SigningTime',
      };
      const signingTime = await transform(xml_content, templateSignTime);

      //return jsonInvoice;
      if (jsonInvoice) {
        const paraPos = {
          invoice_date: seller_date,
          seller_tax_code: seller_tax_code,
          tax_serial_number: tax_serial_number,
          pos_xml: xml_content,
          req_key: req_key,
          signing_time: signingTime.SigningTime,
          qty: jsonInvoice.length,
        };

        const rtnValuePos = await DBService.ExecuteSQLBlob(
          `BEGIN wt_upd_pos_xml_box (          
                                          :invoice_date,
                                          :seller_tax_code,
                                          :tax_serial_number,
                                          :pos_xml,
                                          :req_key,
                                          :signing_time,
                                          :qty,
                                          :p_language, 
                                          :p_crt_by, 
                                          :p_rtn_cur); END;`,
          paraPos,
          p_language,
          p_crt_by,
        );

        status = rtnValuePos.p_rtn_cur[0].STATUS;
        if (rtnValuePos.p_rtn_cur[0].STATUS == 'OK') {
          //console.log("jsonInvoice  ", jsonInvoice);
          let index_node_xml = 0;
          for (const invoice of jsonInvoice) {
            let xml_content = nodes[index_node_xml].toString(); // '<HDon>' + this.OBJtoXML(invoice) + '</HDon>';
            var getLength = require('utf8-byte-length');
            let xml_length = getLength(xml_content);
            // console.log('weTaxExtractPosXMLContent m xml_content ===> ', xml_content);
            let p_DVTTe = '',
              p_TGia = '',
              p_HTTToan = '';
            invoice.DLHDon.TTChung.TTKhac.forEach((element, index) => {
              if (element.TTruong == 'DVTTe') {
                p_DVTTe = element.DLieu;
              }
              if (element.TTruong == 'TGia') {
                p_TGia = element.DLieu;
              }
              if (element.TTruong == 'HTTToan') {
                p_HTTToan = element.DLieu;
              }
            });

            let p_DCTDTu = '',
              p_STKNHang = '',
              p_TNHang = '',
              p_Fax = '',
              p_Website = '';
            invoice.DLHDon.NDHDon.NBan.TTKhac.forEach((element, index) => {
              if (element.TTruong == 'DCTDTu') {
                p_DCTDTu = element.DLieu;
              }
              if (element.TTruong == 'STKNHang') {
                p_STKNHang = element.DLieu;
              }
              if (element.TTruong == 'TNHang') {
                p_TNHang = element.DLieu;
              }

              if (element.TTruong == 'Fax') {
                p_Fax = element.DLieu;
              }

              if (element.TTruong == 'Website') {
                p_Website = element.DLieu;
              }
            });

            let p_nm_DCTDTu = '',
              p_nm_MKHang = '',
              p_nm_HVTNMHang = '',
              p_nm_STKNHang = '',
              p_nm_TNHang = '';
            invoice.DLHDon.NDHDon.NMua.TTKhac.forEach((element, index) => {
              if (element.TTruong == 'DCTDTu') {
                p_nm_DCTDTu = element.DLieu;
              }
              if (element.TTruong == 'MKHang') {
                p_nm_MKHang = element.DLieu;
              }
              if (element.TTruong == 'HVTNMHang') {
                p_nm_HVTNMHang = element.DLieu;
              }

              if (element.TTruong == 'STKNHang') {
                p_nm_STKNHang = element.DLieu;
              }

              if (element.TTruong == 'TNHang') {
                p_nm_TNHang = element.DLieu;
              }
            });
            const paraMaster = {
              pban: invoice.DLHDon.TTChung.PBan,
              thdon: invoice.DLHDon.TTChung.THDon,
              khmshdon: invoice.DLHDon.TTChung.KHMSHDon,
              khhdon: invoice.DLHDon.TTChung.KHHDon,
              shdon: invoice.DLHDon.TTChung.SHDon,
              nlap: invoice.DLHDon.TTChung.NLap,

              dvtte: p_DVTTe, //invoice.DLHDon.TTChung.DVTTe,
              tgia: p_TGia, //invoice.DLHDon.TTChung.TGia,
              htttoan: p_HTTToan, //invoice.DLHDon.TTChung.HTTToan,

              nban_ten: invoice.DLHDon.NDHDon.NBan.Ten,
              nban_mst: invoice.DLHDon.NDHDon.NBan.MST,
              nban_dchi: invoice.DLHDon.NDHDon.NBan.DChi,
              nban_sdthoai: invoice.DLHDon.NDHDon.NBan.SDThoai,
              nban_dctdtu: p_DCTDTu,
              nban_stknhang: p_STKNHang,
              nban_tnhang: p_TNHang,
              nban_fax: p_Fax,
              nban_website: p_Website,

              nmua_ten: invoice.DLHDon.NDHDon.NMua.Ten,
              nmua_mst: invoice.DLHDon.NDHDon.NMua.MST,
              nmua_dchi: invoice.DLHDon.NDHDon.NMua.DChi,
              nmua_sdthoai: invoice.DLHDon.NDHDon.NMua.SDThoai,
              nmua_cccdan: invoice.DLHDon.NDHDon.NMua.CCCDan,
              nmua_dctdtu: p_nm_DCTDTu,
              nmua_mkhang: p_nm_MKHang,
              nmua_hvten: p_nm_HVTNMHang,
              nmua_stknhang: p_nm_STKNHang,
              nmua_tnhang: p_nm_TNHang,

              tgtcthue: invoice.DLHDon.NDHDon.TToan.TgTCThue,
              tgtthue: invoice.DLHDon.NDHDon.TToan.TgTThue,
              ttcktmai: invoice.DLHDon.NDHDon.TToan.TTCKTMai,
              tgtttbso: invoice.DLHDon.NDHDon.TToan.TgTTTBSo,
              tgtttbchu: invoice.DLHDon.NDHDon.TToan.TgTTTBChu,
              mccqt: invoice.MCCQT,
              seller_tax_code: seller_tax_code,
              seller_date: seller_date,
              store_code: store_code,
              store_name: store_name,
              tax_serial_number: tax_serial_number,
              pos_no: '',
              signing_time: signingTime.SigningTime,
              tei_wt_invoice_pos_pk: rtnValuePos.p_rtn_cur[0].PK,
              xml_content: xml_content,
              xml_length: xml_length,
              vat_rate: invoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat[0].TSuat,
            };

            //console.log('weTaxExtractPosXMLContent m param ===> ', paraMaster);

            const rtnValueMaster = await DBService.ExecuteSQLBlob(
              `BEGIN WT_UPD_SALE_BILL (          
                                                :pban,
                                                :thdon,
                                                :khmshdon,
                                                :khhdon,
                                                :shdon,
                                                :nlap,
                                                :dvtte,
                                                :tgia,
                                                :vat_rate,
                                                :htttoan,
                                                :nban_ten,
                                                :nban_mst,
                                                :nban_dchi,
                                                :nban_sdthoai,
                                                :nban_dctdtu,
                                                :nban_stknhang,
                                                :nban_tnhang,
                                                :nban_fax,
                                                :nban_website,
                                                :nmua_ten,
                                                :nmua_mst,
                                                :nmua_dchi,
                                                :nmua_sdthoai,
                                                :nmua_cccdan,
                                                :nmua_dctdtu,
                                                :nmua_mkhang,
                                                :nmua_hvten,
                                                :nmua_stknhang,
                                                :nmua_tnhang,
                                                :tgtcthue,
                                                :tgtthue,
                                                :ttcktmai,
                                                :tgtttbso,
                                                :tgtttbchu,
                                                :mccqt,
                                                :seller_tax_code,
                                                :seller_date,
                                                :store_code,
                                                :store_name,
                                                :tax_serial_number,
                                                :pos_no,
                                                :signing_time,
                                                :tei_wt_invoice_pos_pk,
                                                :xml_content,
                                                :xml_length,
                                                :p_language, 
                                                :p_crt_by, 
                                                :p_rtn_cur); END;`,
              paraMaster,
              p_language,
              p_crt_by,
            );
            // console.log('weTaxExtractPosXMLContent rtnValueMaster  ', rtnValueMaster);
            status = rtnValueMaster.p_rtn_cur[0].STATUS;
            // tao json hd va trann thai các kiểu để sau này trả về cho WeTax dễ update
            data_inv.push({
              mccqt: invoice.MCCQT,
              tax_code: invoice.DLHDon.NDHDon.NBan.MST,
              form_no: invoice.DLHDon.TTChung.KHMSHDon,
              serial_no: invoice.DLHDon.TTChung.KHHDon,
              invoice_no: invoice.DLHDon.TTChung.SHDon,
              inform_code: '', //8
              inform_name: '', //Dữ liệu hóa đơn hợp lệ
              lookup_code: '',
              sign_datetime: signingTime.SigningTime,
              sign_by: invoice.DLHDon.NDHDon.NBan.Ten,
              xml_no_sign: xml_no_sign,
              xml_signed: xml_content,
              xml_tax_signed: '',
            });
            if (rtnValueMaster.p_rtn_cur[0].STATUS == 'OK') {
              const invoice_detail = invoice.DLHDon.NDHDon.DSHHDVu.HHDVu;
              for (let inv_d of invoice_detail) {
                //console.log(' invoice_detail  ', invoice_detail);
                let p_vat_amt = 0;

                inv_d.TTKhac.forEach((element, index) => {
                  if (element.TTruong == 'VATAmount') {
                    p_vat_amt = element.DLieu;
                  }
                });
                const paraDetails = {
                  tei_wt_invoice_m_pk: rtnValueMaster.p_rtn_cur[0].PK,
                  tchat: inv_d.TChat,
                  stt: inv_d.STT,
                  mhhdvu: inv_d.MHHDVu,
                  thhdvu: inv_d.THHDVu,
                  dvtinh: inv_d.DVTinh,
                  sluong: inv_d.SLuong,
                  dgia: inv_d.DGia,
                  tlckhau: inv_d.TLCKhau,
                  stckhau: inv_d.STCKhau,
                  thtien: inv_d.ThTien,
                  tsuat: inv_d.TSuat,
                  tthue: p_vat_amt,
                };

                //console.log('weTaxExtractPosXMLContent d param ===> ', paraDetails);

                const rtnValueDetail = await DBService.ExecuteSQLBlob(
                  `BEGIN WT_UPD_SALE_BILL_D (          
                                                      :tei_wt_invoice_m_pk,
                                                      :tchat,
                                                      :stt,
                                                      :mhhdvu,
                                                      :thhdvu,
                                                      :dvtinh,
                                                      :sluong,
                                                      :dgia,
                                                      :tlckhau,
                                                      :stckhau,
                                                      :thtien,
                                                      :tsuat,
                                                      :tthue,
                                                      :p_language, 
                                                      :p_crt_by, 
                                                      :p_rtn_cur); END;`,
                  paraDetails,
                  p_language,
                  p_crt_by,
                );
              }

              const invoice_detail_vat = invoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat;
              for (const inv_d_vat of invoice_detail_vat) {
                //console.log(" inv_d_vat  ", inv_d_vat);
                const para_amt_vat = {
                  tei_wt_sale_bill_pk: rtnValueMaster.p_rtn_cur[0].PK,
                  sub_amt: inv_d_vat.ThTien,
                  sub_vat_rate: inv_d_vat.TSuat,
                  sub_vat_amt: inv_d_vat.TThue,
                };

                //console.log('weTaxExtractPosXMLContent d vat param  ===> ', para_amt_vat);

                const rtnValue_VAT = await DBService.ExecuteSQLBlob(
                  `BEGIN WT_UPD_SALE_BILL_D_VAT (          
                                                                        :tei_wt_sale_bill_pk,
                                                                        :sub_amt,
                                                                        :sub_vat_rate,
                                                                        :sub_vat_amt,
                                                                        :p_language, 
                                                                        :p_crt_by, 
                                                                        :p_rtn_cur); END;`,
                  para_amt_vat,
                  p_language,
                  p_crt_by,
                );

                // console.log(' weTaxExtractPosXMLContent invoice_detail_vat  ', rtnValue_VAT);
              }
            } else if (rtnValueMaster.p_rtn_cur[0].STATUS == 'RESEND') {
              check_data = {
                PK: rtnValuePos.p_rtn_cur[0].PK,
                TEI_HISTORY_M_PK: rtnValuePos.p_rtn_cur[0].TEI_HISTORY_M_PK,
                STATUS: 'OK', // rtnValuePos.p_rtn_cur[0].STATUS,
              };

              // return {check_data, data_inv};
            } else {
              check_data = {
                PK: null,
                //TEI_HISTORY_M_PK: null,
                STATUS: 'FAILE',
              };

              return {check_data, data_inv};
            }
            index_node_xml++;
          }
        } else {
          check_data = {
            PK: null,
            TEI_HISTORY_M_PK: null,
            STATUS: 'FAILE',
          };

          return {check_data, data_inv};
        }
        //console.log('rtnValuePos.p_rtn_cur[0] ', rtnValuePos.p_rtn_cur[0]);
        check_data = {
          PK: rtnValuePos.p_rtn_cur[0].PK,
          TEI_HISTORY_M_PK: rtnValuePos.p_rtn_cur[0].TEI_HISTORY_M_PK,
          STATUS: rtnValuePos.p_rtn_cur[0].STATUS,
        };
        //console.log('check_data ', check_data);
        //console.log('data_inv ', data_inv);

        return {check_data, data_inv};
      }
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController',
        FUNC: 'extractXMLContent',
        CONTENT: e.message,
      });
      console.log('===> extractXMLContent ', e);
      return (check_data = {
        PK: -2,
        STATUS: 'FAILE',
      }); //master[0].PK;;
    }
  }

  async weTaxSendPosInvoice(
    seller_tax_code,
    sale_date,
    store_code,
    store_name,
    tax_serial_number,
    invoice_xml_signed,
    check_data,
    data_inv,
    lookup_code,
    p_language,
    p_crt_by,
  ) {
    try {
      const authUserName = 'GENUWIN';
      const authPassword = 'genuwin123';
      const url = 'https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/mttien';
      const urlCheck = 'https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=';

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: 'https:',
          options: {maxVersion: 'TLSv1.2', minVersion: 'TLSv1.2', path: null},
        },
      };
      let SLuong = 0;
      let rtnValue = {};
      let data_error = [];
      let mLTDiep = '',
        trade_code = '',
        maCQT = '',
        maTBao = '',
        tenTBao = '',
        xml_tax_signed = '',
        ngayTBao = '',
        ngayCQTKy = '',
        maGDichDTu = '',
        tenGDDTu = '',
        ord = '',
        soTBao = '';
      let send_mail = false;
      const res = await Request.post(
        url,
        {base64XML: Buffer.from(invoice_xml_signed).toString('base64')},
        {
          agent,
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${authUserName}:${authPassword}`).toString('base64'),
          },
        },
      );
      trade_code = res.data.maGDich;

      if (trade_code) {
        const para_value = {
          tei_einvoice_ar_pk: check_data.PK,
          tei_history_m_pk: check_data.TEI_HISTORY_M_PK,
          trade_code: trade_code,
        };

        await DBService.ExecuteSQLBlob(
          `BEGIN WT_UPD_TRADECODE_P_XML(
                            :tei_einvoice_ar_pk,
                            :tei_history_m_pk,
                            :trade_code,
                            :p_language, 
                            :p_crt_by, 
                            :p_rtn_cur); 
            END;`,
          para_value,
          p_language,
          p_crt_by,
        );
      }
      await Utils._sleep(5);

      await Request.get(urlCheck + trade_code, {
        agent,
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${authUserName}:${authPassword}`).toString('base64'),
        },
      }).then(async res => {
        if (res.data.length) {
          for (let j = 0; j < res.data.length; j++) {
            const items = res.data[j];
            for (let k = 0; k < items.length; k++) {
              if (items[k].loaiTBao == '1') {
                xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, 'base64').toString('utf8');

                const templateMLTDiep = {
                  mLTDiep: 'TDiep/TTChung/MLTDiep',
                };
                var jsonD = await transform(xml_tax_signed, templateMLTDiep);
                mLTDiep = jsonD.mLTDiep;

                ngayTBao = items[k].ndungTBao.ngayTBao;
                ngayCQTKy = items[k].ndungTBao.ngayCQTKy;
                maGDichDTu = items[k].ndungTBao.maGDichTNDLieu;
                if (mLTDiep == '204') {
                  tenGDDTu = 'Thông báo về việc kết quả kiểm tra dữ liệu hóa đơn điện tử';
                  ord = '3';

                  const templateMLTDiep_204 = {
                    LTBao: 'TDiep/DLieu/TBao/DLTBao/LTBao',
                    SLuong: 'TDiep/DLieu/TBao/DLTBao/SLuong',
                  };
                  var json_td_204 = await transform(xml_tax_signed, templateMLTDiep_204);

                  SLuong = json_td_204.SLuong || 0;
                  maTBao = json_td_204.LTBao || '2';
                } else if (mLTDiep == '999') {
                  tenGDDTu = 'Thông báo gói tin hợp lệ.';
                  ord = '2';
                }
                const param_pos = {
                  p_tei_history_m_pk: check_data.TEI_HISTORY_M_PK,
                  p_qty_invoice: SLuong,
                  p_loaiTB: maTBao,
                  p_CQT_Code: trade_code,
                  p_xml_sign: xml_tax_signed,
                  p_maTDiep: mLTDiep,
                  p_maGdDTu: maGDichDTu,
                  p_tenGdDTu: tenGDDTu,
                  p_ngayTaoTB: ngayCQTKy,
                  p_ord: ord,
                  p_tvan_data_result: JSON.stringify(res.data),
                };

                await DBService.ExecuteSQLBlob(
                  `BEGIN WT_UPD_HISTORY_D_POS(
                                      :p_tei_history_m_pk,
                                      :p_qty_invoice,
                                      :p_loaiTB,
                                      :p_CQT_Code,
                                      :p_xml_sign,
                                      :p_maTDiep,
                                      :p_maGdDTu,
                                      :p_tenGdDTu,
                                      :p_ngayTaoTB,
                                      :p_ord,
                                      :p_tvan_data_result,
                                      :p_language, 
                                      :p_crt_by, 
                                      :p_rtn_cur); 
                      END;`,
                  param_pos,
                  p_language,
                  p_crt_by,
                );

                mLTDiep = '';
                ngayTBao = '';
                ngayCQTKy = '';
                maGDichDTu = '';
              } else if (items[k].loaiTBao == '8') {
                send_mail = true;
                maTBao = items[k].ndungTBao.tbaoKTraDLieu.loaiTBao; //  '2'; //items[k].loaiTBao;
                tenTBao = items[k].tenTBao;
                soTBao = items[k].ndungTBao.tbaoKTraDLieu.soTBao;
                ngayCQTKy = items[k].ndungTBao.tbaoKTraDLieu.ngayCQTKy;

                const param_ltb_8 = {
                  p_tei_history_m_pk: check_data.TEI_HISTORY_M_PK,
                  p_CQT_Code: trade_code,
                  p_soTBao: soTBao,
                  p_maTBao: maTBao,
                  p_tenTBao: tenTBao,
                  p_ngayCQTKy: ngayCQTKy,
                  p_count_error: '',
                };

                await DBService.ExecuteSQLBlob(
                  `BEGIN WT_UPD_HISTORY_D_POS_TB8(
                                      :p_tei_history_m_pk,
                                      :p_CQT_Code,
                                      :p_soTBao,
                                      :p_maTBao,
                                      :p_tenTBao,
                                      :p_ngayCQTKy,
                                      :p_count_error,
                                      :p_language, 
                                      :p_crt_by, 
                                      :p_rtn_cur); 
                      END;`,
                  param_ltb_8,
                  p_language,
                  p_crt_by,
                );

                data_inv.forEach((element, index) => {
                  if (element.inform_code == '' && element.inform_name == '') {
                    (data_inv[index].inform_code = maTBao), //items[k].loaiTBao;
                      (data_inv[index].inform_name = tenTBao), //'Dữ liệu hóa đơn hợp lệ';
                      (data_inv[index].xml_tax_signed = xml_tax_signed);
                  }
                });
              } else if (items[k].loaiTBao == '9' || items[k].loaiTBao == '7') {
                maTBao = items[k].ndungTBao.tbaoKTraDLieu.loaiTBao; //items[k].loaiTBao;
                tenTBao = items[k].tenTBao;
                soTBao = items[k].ndungTBao.tbaoKTraDLieu.soTBao;
                ngayCQTKy = items[k].ndungTBao.tbaoKTraDLieu.ngayCQTKy;

                for (let invoice of items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu) {
                  data_error.push({
                    maLoi: invoice.maLoi,
                    mtaLoi: invoice.mtaLoi,
                  });
                  const chars = invoice.mtaLoi.split(';');
                  data_inv.forEach((element, index) => {
                    if (element.form_no === chars[0] && element.serial_no === chars[1] && element.invoice_no === chars[2]) {
                      data_inv[index].inform_code = '7'; //items[k].loaiTBao;
                      data_inv[index].inform_name = invoice.maLoi + ' - ' + invoice.mtaLoi;
                      data_inv[index].xml_tax_signed = xml_tax_signed;
                    }
                  });
                }

                data_inv.forEach((element, index) => {
                  if (element.inform_code == '' && element.inform_name == '') {
                    data_inv[index].inform_code = '2'; //items[k].loaiTBao;
                    data_inv[index].inform_name = 'Thông báo dữ liệu hóa đơn hợp lệ';
                    data_inv[index].xml_tax_signed = xml_tax_signed;
                  }
                });

                const param_ltb_8 = {
                  p_tei_history_m_pk: check_data.TEI_HISTORY_M_PK,
                  p_CQT_Code: trade_code,
                  p_soTBao: soTBao,
                  p_maTBao: maTBao,
                  p_tenTBao: tenTBao,
                  p_ngayCQTKy: ngayCQTKy,
                  p_count_error: data_error.length,
                };

                await DBService.ExecuteSQLBlob(
                  `BEGIN WT_UPD_HISTORY_D_POS_TB8(
                                      :p_tei_history_m_pk,
                                      :p_CQT_Code,
                                      :p_soTBao,
                                      :p_maTBao,
                                      :p_tenTBao,
                                      :p_ngayCQTKy,
                                      :p_count_error,
                                      :p_language, 
                                      :p_crt_by, 
                                      :p_rtn_cur); 
                      END;`,
                  param_ltb_8,
                  p_language,
                  p_crt_by,
                );
              }
            }
          }
        }

        for (const inv of data_inv) {
          const param_m = {
            mccqt: inv.mccqt,
            tax_code: inv.tax_code,
            form_no: inv.form_no,
            serial_no: inv.serial_no,
            invoice_no: inv.invoice_no,
            inform_code: inv.inform_code,
            inform_name: inv.inform_name,
            tei_wt_invoice_pos_pk: check_data.PK,
          };

          const r_data_inv = await DBService.ExecuteSQLBlob(
            `BEGIN WT_UPD_TEI_WT_INVOICE_POS(
                              :mccqt,
                              :tax_code,
                              :form_no,
                              :serial_no,
                              :invoice_no,
                              :inform_code,
                              :inform_name,
                              :tei_wt_invoice_pos_pk,
                              :p_language, 
                              :p_crt_by, 
                              :p_rtn_cur); 
              END;`,
            param_m,
            p_language,
            p_crt_by,
          );

          data_inv.forEach((element, index) => {
            if (element.form_no === inv.form_no && element.serial_no === inv.serial_no && element.invoice_no === inv.invoice_no) {
              data_inv[index].lookup_code = r_data_inv.p_rtn_cur[0].LOOKUP_CODE == null ? lookup_code : r_data_inv.p_rtn_cur[0].LOOKUP_CODE;
            }
          });
        }

        rtnValue = {
          trade_code: trade_code,
          seller_tax_code: seller_tax_code,
          sale_date: sale_date,
          store_code: store_code,
          store_name: store_name,
          tax_serial_number: tax_serial_number,
          data_error: data_error,
          data_inv: data_inv,
        };
      });

      return rtnValue;
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxSendPosInvoice',
        CONTENT: e.message,
      });
      console.log('===> weTaxSendPosInvoice ', e);
      return {};
    }
  }

  async weTaxSendNorInvoice(masterInvoicePK, rtnValueTradecode, xml_signed, p_language, p_crt_by) {
    try {
      // const urlCheck = 'https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=';
      // const url = 'https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon';
      // const authUserName = 'GENUWIN'; // "GENUWIN";
      // const authPassword = 'e_GX4v@'; // "e_GX4v@";// "genuwin123";// "e_GX4v@";

      const url = 'https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon';
      const urlCheck = 'https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=';
      const authUserName = 'GENUWIN'; // "GENUWIN";
      const authPassword = 'genuwin123'; // "e_GX4v@";
      let rtnValue = [];
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: 'https:',
          options: {maxVersion: 'TLSv1.2', minVersion: 'TLSv1.2', path: null},
        },
      };

      // ======================== tam thoi =========================
      const trade_code = await Request.post(
        url,
        {base64XML: Buffer.from(xml_signed).toString('base64')},
        {
          agent,
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${authUserName}:${authPassword}`).toString('base64'),
          },
        },
      );

      // console.log('trade_code  ', trade_code);

      const para_trade_code = {
        req_ep_key: masterInvoicePK.PK,
        trade_code: trade_code.data.maGDich,
        xml_signed: xml_signed,
      };
      // console.log('weTaxSendInvoiceToTaxOffice para_trade_code  ', para_trade_code);

      const data_r_tradecode = await DBService.ExecuteSQLBlob(
        `BEGIN WT_UPD_TEI_INV_TRADECODE(
                                  :req_ep_key, 
                                  :trade_code,
                                  :xml_signed,
                                  :p_language, 
                                  :p_crt_by, 
                                  :p_rtn_cur); 
                  END;`,
        para_trade_code,
        p_language,
        p_crt_by,
      );

      // console.log('rtnValueTradecode  ', rtnValueTradecode);
      rtnValueTradecode[0].trade_code = trade_code.data.maGDich;
      rtnValueTradecode[0].lookup_code = data_r_tradecode.p_rtn_cur[0].LOOKUP_CODE;
      // rtnValueTradecode.push({
      //   sale_id: invoices[i].req_key,
      //   req_ep_key: masterInvoicePK.PK,
      //   trade_code: trade_code.data.maGDich,
      //   msg_his_id: invoices[i].msg_his_id,
      //   lookup_code: data_r_tradecode.p_rtn_cur[0].LOOKUP_CODE,
      //   buyer_email: invoices[i].mail_to,
      //   buyer_email_cc: invoices[i].mail_cc,
      //   mccqt: '',
      //   send_mail_yn: 'N',
      // });

      //console.log('weTaxSendInvoiceToTaxOffice befor check status e-invoice ', rtnValueTradecode);

      await Utils._sleep(5);

      for (const tr_code of rtnValueTradecode) {
        let maTBao = '';
        let tenTBao = '';
        let maCQT = '';
        let xml_tax_signed = '';
        let xml_length = 0;
        let data_error = [];
        let base64XML = '';
        let maTD = '';
        let maGDDTu = '';
        let tenGDDTu = '';
        let ngayTaoTB = '';
        let ord = '';
        let ngayCQTKy = '';
        let soTBao = '';
        if (tr_code.trade_code) {
          await Request.get(urlCheck + tr_code.trade_code, {
            agent,
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${authUserName}:${authPassword}`).toString('base64'),
            },
          }).then(async res => {
            //console.log("res ", res);
            //return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, res.data));
            if (res.data.length) {
              for (let j = 0; j < res.data.length; j++) {
                const items = res.data[j];
                for (let k = 0; k < items.length; k++) {
                  if (items[k].loaiTBao == '1') {
                    base64XML = Buffer.from(items[k].ndungTBao.base64XML, 'base64').toString('utf8');
                    const temp_of_tax = {
                      MLTDiep: 'TDiep/TTChung/MLTDiep',
                    };
                    const data_of_tax = await transform(base64XML, temp_of_tax);

                    maTD = data_of_tax.MLTDiep;
                    maGDDTu = items[k].ndungTBao.maGDichTNDLieu;
                    ngayTaoTB = items[k].ngayTaoTBao;

                    if (maTD == '202') {
                      tenGDDTu = 'hóa đơn được CQT cấp mã';
                      ord = '3';
                    } else if (maTD == '204') {
                      tenGDDTu = 'hóa đơn không được CQT cấp mã';
                      ord = '3';
                    } else {
                      tenGDDTu = 'gói tin hợp lệ';
                      ord = '2';
                    }

                    if (base64XML) {
                      const para_history = {
                        p_CQT_Code: tr_code.trade_code,
                        p_xml_sign: base64XML,
                        p_maTD: maTD,
                        p_maGDDTu: maGDDTu,
                        p_tenGDDTu: tenGDDTu,
                        p_ngayTaoTB: ngayTaoTB,
                        p_ord: ord,
                        p_tvan_data_result: JSON.stringify(res.data),
                      };

                      //console.log('weTaxSendInvoiceToTaxOffice  para_history  ', para_history);

                      const res_op = await DBService.ExecuteSQLBlob(
                        `BEGIN ei_upd_his_nor_inv(
                                                    :p_CQT_Code, 
                                                    :p_xml_sign,
                                                    :p_maTD,
                                                    :p_maGDDTu,
                                                    :p_tenGDDTu,
                                                    :p_ngayTaoTB,
                                                    :p_ord,
                                                    :p_tvan_data_result,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); 
                                    END;`,
                        para_history,
                        p_language,
                        p_crt_by,
                      );

                      base64XML = '';
                      maTD = '';
                      maGDDTu = '';
                      tenGDDTu = '';
                      ngayTaoTB = '';
                    }
                  } else if (items[k].loaiTBao == '10') {
                    let xml_draft = Buffer.from(items[k].ndungTBao.base64XML, 'base64').toString('utf8').split('</TTChung><DLieu>');
                    xml_tax_signed = '<?xml version="1.0" encoding="UTF-8"?>' + xml_draft[1].replace('</DLieu></TDiep>', '');
                    var getLength = require('utf8-byte-length');
                    xml_length = getLength(xml_tax_signed);

                    maCQT = items[k].ndungTBao.maCQT;
                    maTBao = items[k].loaiTBao;
                    tenTBao = items[k].tenTBao;
                    ngayCQTKy = items[k].ndungTBao.tbaoCMa.ngayCQTKy;

                    rtnValueTradecode.forEach((element, index) => {
                      if (element.trade_code === tr_code.trade_code) {
                        rtnValueTradecode[index].mccqt = maCQT;
                      }
                    });

                    const param_ltb_8 = {
                      p_tei_history_m_pk: null,
                      p_CQT_Code: tr_code.trade_code,
                      p_soTBao: '',
                      p_maTBao: maTBao,
                      p_tenTBao: tenTBao,
                      p_ngayCQTKy: ngayCQTKy,
                      p_mccqt: maCQT,
                      p_xml_tax_signed: xml_tax_signed,
                      p_xml_length: xml_length,
                    };

                    //console.log('jobCheckTradeCodeNorInvoice param_ltb_8  ', items[k].loaiTBao, '    ', param_ltb_8);

                    await DBService.ExecuteSQLBlob(
                      `BEGIN WT_UPD_HISTORY_D_NOR_TB8(
                                      :p_tei_history_m_pk,
                                      :p_CQT_Code,
                                      :p_soTBao,
                                      :p_maTBao,
                                      :p_tenTBao,
                                      :p_ngayCQTKy,
                                      :p_mccqt,
                                      :p_xml_tax_signed,
                                      :p_xml_length,
                                      :p_language, 
                                      :p_crt_by, 
                                      :p_rtn_cur); 
                      END;`,
                      param_ltb_8,
                      p_language,
                      p_crt_by,
                    );
                  } else if (items[k].loaiTBao == '9' || items[k].loaiTBao == '16' || items[k].loaiTBao == '15') {
                    maTBao = items[k].ndungTBao.tbaoKTraDLieu.loaiTBao;
                    tenTBao =
                      items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].maLoi +
                      ' - ' +
                      items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].mtaLoi; //items[k].tenTBao;
                    data_error.push({
                      maLoi: items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].maLoi,
                      mtaLoi: items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].mtaLoi,
                    });

                    soTBao = items[k].ndungTBao.tbaoKTraDLieu.soTBao;
                    ngayCQTKy = items[k].ndungTBao.tbaoKTraDLieu.ngayCQTKy;

                    const param_ltb_8 = {
                      p_tei_history_m_pk: null,
                      p_CQT_Code: tr_code.trade_code,
                      p_soTBao: soTBao,
                      p_maTBao: maTBao,
                      p_tenTBao: tenTBao,
                      p_ngayCQTKy: ngayCQTKy,
                      p_mccqt: '',
                      p_xml_tax_signed: '',
                      p_xml_length: '',
                    };

                    //console.log('jobCheckTradeCodeNorInvoice param_ltb_8  ', items[k].loaiTBao, '    ', param_ltb_8);

                    await DBService.ExecuteSQLBlob(
                      `BEGIN WT_UPD_HISTORY_D_NOR_TB8(
                                      :p_tei_history_m_pk,
                                      :p_CQT_Code,
                                      :p_soTBao,
                                      :p_maTBao,
                                      :p_tenTBao,
                                      :p_ngayCQTKy,
                                      :p_mccqt,
                                      :p_xml_tax_signed,
                                      :p_xml_length,
                                      :p_language, 
                                      :p_crt_by, 
                                      :p_rtn_cur); 
                      END;`,
                      param_ltb_8,
                      p_language,
                      p_crt_by,
                    );
                  }
                }
              }
            } else {
              rtnValue.push({
                req_key: tr_code.sale_id,
                trade_code: tr_code.trade_code,
                inform_code: '',
                inform_name: '',
                xml_tax_signed: '',
                mccqt: '',
                lookup_code: tr_code.lookup_code,
                data_error: null,
              });
              return response.status(200).json(Utils.responseByRule({success: true, message: 'Sent Normal invoice successfully.', data: rtnValue}));
            }
          });
        }

        //  console.log("res_op   ", res_op);
        rtnValue.push({
          req_key: tr_code.sale_id,
          trade_code: tr_code.trade_code,
          inform_code: maTBao,
          inform_name: tenTBao,
          xml_tax_signed: xml_tax_signed,
          mccqt: maCQT,
          lookup_code: tr_code.lookup_code,
          data_error: data_error,
          sign_datetime: masterInvoicePK.SIGN_DATETIME,
          sign_by: masterInvoicePK.SIGN_BY,
        });
      }
      //console.log('weTaxSendInvoiceToTaxOffice  rtnValue', rtnValue);
      //console.log('weTaxSendInvoiceToTaxOffice  END ================================= ');
      //console.log('rtnValueTradecode ', rtnValueTradecode);

      this.weTaxSendMailNor(rtnValueTradecode, 'WTPTA003N', p_language, p_crt_by);

      return {rtnValue};
      // return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));
      //return response.status(200).json(Utils.responseByRule({success: true, message: 'Sent Normal invoice successfully.', data: rtnValue}));
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController',
        FUNC: 'weTaxSendInvoiceToTaxOffice',
        CONTENT: e.message,
      });
      console.log('weTaxSendInvoiceToTaxOffice error  ', e);
      // return response.send(Utils.response(false, e.message, null));
      //return response.status(409).json(Utils.responseByRule({success: true, message: e.message}));
    }
  }

  async weTaxExtractNorXMLContent(
    p_xml_content,
    p_mail_to,
    p_mail_cc,
    p_invoice_type,
    p_tr_type,
    p_tax_serial_number,
    p_tac_crca_pk,
    p_invoice_form_symbol,
    p_language,
    p_crt_by,
  ) {
    let result_extra = {};
    try {
      const templateTTChung = [
        'HDon/DLHDon/TTChung',
        {
          PBan: 'PBan',
          THDon: 'THDon',
          KHMSHDon: 'KHMSHDon',
          KHHDon: 'KHHDon',
          SHDon: 'SHDon',
          MHSo: 'MHSo',
          NLap: 'NLap',
          SBKe: 'SBKe',
          NBKe: 'NBKe',
          DVTTe: 'DVTTe',
          TGia: 'TGia',
          HTTToan: 'HTTToan',
          MSTTCGP: 'MSTTCGP',
          MSTDVNUNLHDon: 'MSTDVNUNLHDon',
          TDVNUNLHDon: 'TDVNUNLHDon',
          DCDVNUNLHDon: 'DCDVNUNLHDon',
        },
      ];
      const jsonTTChung = await transform(p_xml_content, templateTTChung);
      //console.log("jsonTTChung", jsonTTChung)
      const templateTTKhac = [
        'HDon/DLHDon/TTChung/TTKhac/TTin',
        {
          TTruong: 'TTruong',
          DLieu: 'DLieu',
        },
      ];
      let jsonTTKhac = null;
      try {
        jsonTTKhac = await transform(p_xml_content, templateTTKhac);
      } catch (e) {}
      // console.log("jsonTTKhac", jsonTTKhac)
      let customField1 = '',
        customField2 = '',
        customField3 = '',
        customField4 = '',
        customField5 = '',
        customField6 = '',
        customField7 = '',
        customField8 = '',
        customField9 = '',
        customField10 = '';
      if (jsonTTKhac && jsonTTKhac.length > 0) {
        customField1 = jsonTTKhac[0].TTruong + ': ' + jsonTTKhac[0].DLieu;
        if (jsonTTKhac.length > 1) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
        }
        if (jsonTTKhac.length > 2) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
        }
        if (jsonTTKhac.length > 3) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
        }
        if (jsonTTKhac.length > 4) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
        }
        if (jsonTTKhac.length > 5) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu;
        }
        if (jsonTTKhac.length > 6) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu;
        }
        if (jsonTTKhac.length > 7) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu;
        }
        if (jsonTTKhac.length > 8) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ': ' + jsonTTKhac[8].DLieu;
        }
        if (jsonTTKhac.length > 9) {
          customField2 = jsonTTKhac[1].TTruong + ': ' + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ': ' + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ': ' + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ': ' + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ': ' + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ': ' + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ': ' + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ': ' + jsonTTKhac[8].DLieu;
          customField10 = jsonTTKhac[9].TTruong + ': ' + jsonTTKhac[9].DLieu;
        }
      }

      const templateTTHDLQuan = [
        'HDon/DLHDon/TTChung/TTHDLQuan',
        {
          TCHDon: 'TCHDon',
          LHDCLQuan: 'LHDCLQuan',
          KHMSHDCLQuan: 'KHMSHDCLQuan',
          KHHDCLQuan: 'KHHDCLQuan',
          SHDCLQuan: 'SHDCLQuan',
          NLHDCLQuan: 'NLHDCLQuan',
          GChu: 'GChu',
        },
      ];
      const jsonTTHDLQuan = await transform(p_xml_content, templateTTHDLQuan);
      // console.log("templateTTHDLQuan", jsonTTHDLQuan)

      const arrTTChung = [
        jsonTTChung[0].PBan,
        jsonTTChung[0].THDon,
        jsonTTChung[0].KHMSHDon,
        jsonTTChung[0].KHHDon,
        jsonTTChung[0].SHDon,
        jsonTTChung[0].MHSo,
        jsonTTChung[0].NLap,
        jsonTTChung[0].SBKe,
        jsonTTChung[0].NBKe,
        jsonTTChung[0].DVTTe,
        jsonTTChung[0].TGia,
        jsonTTChung[0].HTTToan,
        jsonTTChung[0].MSTTCGP,
        jsonTTChung[0].MSTDVNUNLHDon,
        jsonTTChung[0].TDVNUNLHDon,
        jsonTTChung[0].DCDVNUNLHDon,
      ];
      const templateNBan = [
        'HDon/DLHDon/NDHDon/NBan',
        {
          Ten: 'Ten',
          MST: 'MST',
          DChi: 'DChi',
          SDThoai: 'SDThoai',
          DCTDTu: 'DCTDTu',
          STKNHang: 'STKNHang',
          TNHang: 'TNHang',
          Fax: 'Fax',
          Website: 'Website',
          TTKhac: 'TTKhac',
        },
      ];
      const jsonNBan = await transform(p_xml_content, templateNBan);
      const arrNBan = [
        jsonNBan[0].Ten,
        jsonNBan[0].MST,
        jsonNBan[0].DChi,
        jsonNBan[0].SDThoai,
        jsonNBan[0].DCTDTu,
        jsonNBan[0].STKNHang,
        jsonNBan[0].TNHang,
        jsonNBan[0].Fax,
        jsonNBan[0].Website,
        jsonNBan[0].TTKhac,
      ];
      // console.log("jsonNBan", jsonNBan)
      const templateNMua = [
        'HDon/DLHDon/NDHDon/NMua',
        {
          Ten: 'Ten',
          MST: 'MST',
          DChi: 'DChi',
          SDThoai: 'SDThoai',
          DCTDTu: 'DCTDTu',
          MKHang: 'MKHang',
          HVTNMHang: 'HVTNMHang',
          STKNHang: 'STKNHang',
          TNHang: 'TNHang',
          TTKhac: 'TTKhac',
        },
      ];
      const jsonNMua = await transform(p_xml_content, templateNMua);
      // console.log("jsonNMua", jsonNMua)
      const arrNMua = [
        jsonNMua[0].Ten,
        jsonNMua[0].MST,
        jsonNMua[0].DChi,
        jsonNMua[0].SDThoai,
        jsonNMua[0].DCTDTu,
        jsonNMua[0].MKHang,
        jsonNMua[0].HVTNMHang,
        jsonNMua[0].STKNHang,
        jsonNMua[0].TNHang,
        jsonNMua[0].TTKhac,
      ];
      const templateLTSuat = [
        'HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat',
        {
          TSuat: 'TSuat',
          ThTien: 'ThTien',
          TThue: 'TThue',
        },
      ];
      const jsonLTSuat = await transform(p_xml_content, templateLTSuat);
      // console.log("jsonLTSuat", jsonLTSuat)
      const arrLTSuat = [jsonLTSuat[0].TSuat, jsonLTSuat[0].ThTien, jsonLTSuat[0].TThue];
      const templateTToan = [
        'HDon/DLHDon/NDHDon/TToan',
        {
          TgTCThue: 'TgTCThue',
          TgTThue: 'TgTThue',
          TTCKTMai: 'TTCKTMai',
          TgTTTBSo: 'TgTTTBSo',
          TgTTTBChu: 'TgTTTBChu',
        },
      ];
      const jsonTToan = await transform(p_xml_content, templateTToan);
      // console.log("jsonTToan", jsonTToan)
      const arrTToan = [jsonTToan[0].TgTCThue, jsonTToan[0].TgTThue, jsonTToan[0].TTCKTMai, jsonTToan[0].TgTTTBSo, jsonTToan[0].TgTTTBChu];
      let v_vn_amount = await Utils.Num2VNText2(jsonTToan[0].TgTTTBSo.toString(), jsonTTChung[0].DVTTe);
      // console.log("  v_vn_amount ", v_vn_amount);
      /*const templateMCCQT = ['HDon', {
                                  MCCQT: 'MCCQT'
                              }]
                              const jsonMCCQT = await transform(p_xml_content, templateMCCQT);
                              //console.log(jsonMCCQT)
                              */
      const arrMCCQT = ''; //[jsonMCCQT[0].MCCQT];

      const templateDSHHDVu = [
        'HDon/DLHDon/NDHDon/DSHHDVu/HHDVu',
        {
          TChat: 'TChat',
          STT: 'STT',
          MHHDVu: 'MHHDVu',
          THHDVu: 'THHDVu',
          DVTinh: 'DVTinh',
          SLuong: 'SLuong',
          DGia: 'DGia',
          TLCKhau: 'TLCKhau',
          STCKhau: 'STCKhau',
          ThTien: 'ThTien',
          TSuat: 'TSuat',
          TTKhac: [
            'TTKhac/TTin',
            {
              TTruong: 'TTruong',
              KDLieu: 'KDLieu',
              DLieu: 'DLieu',
            },
          ],
        },
      ];
      let masterPara = arrTTChung.concat(arrNBan).concat(arrNMua).concat(arrLTSuat).concat(arrTToan).concat(arrMCCQT);
      //const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
      masterPara = masterPara.concat(['', '', '', '']);
      if (jsonTTHDLQuan && jsonTTHDLQuan.length > 0) {
        masterPara = masterPara.concat([
          jsonTTHDLQuan[0].TCHDon,
          jsonTTHDLQuan[0].LHDCLQuan,
          jsonTTHDLQuan[0].KHMSHDCLQuan,
          jsonTTHDLQuan[0].KHHDCLQuan,
          jsonTTHDLQuan[0].SHDCLQuan,
          jsonTTHDLQuan[0].NLHDCLQuan,
          jsonTTHDLQuan[0].GChu,
        ]);
      } else {
        masterPara = masterPara.concat(['', '', '', '', '', '', '']);
      }

      const templateSignTime = {
        SigningTime: 'HDon/DSCKS/NBan/Signature/Object/SignatureProperties/SignatureProperty/SigningTime',
      };
      const signingTime = await transform(p_xml_content, templateSignTime);

      masterPara = masterPara.concat([
        customField1,
        customField2,
        customField3,
        customField4,
        customField5,
        customField6,
        customField7,
        customField8,
        customField9,
        customField10,
        p_mail_to,
        p_mail_cc,
        p_invoice_type,
        v_vn_amount,
        p_tr_type,
        p_tax_serial_number,
        p_tac_crca_pk,
        p_invoice_form_symbol,
        signingTime.SigningTime,
      ]);

      //const master = await callAPI(_jwtToken, { proc: 'ei_upd_tei_einvoice_cloud', para: masterPara });
      const master = await DBService.callProcCursor('WT_UPD_TEI_WT_INVOICE_M', masterPara, p_language, p_crt_by);
      // console.log("master", master);

      if (master && master[0].PK > 0) {
        const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonDSHHDVu.length; i++) {
          console.log(JSON.stringify(jsonDSHHDVu[i]));
          const detailPara = [
            master[0].PK,
            jsonDSHHDVu[i].TChat,
            jsonDSHHDVu[i].STT,
            jsonDSHHDVu[i].MHHDVu,
            jsonDSHHDVu[i].THHDVu,
            jsonDSHHDVu[i].DVTinh,
            jsonDSHHDVu[i].SLuong,
            jsonDSHHDVu[i].DGia,
            jsonDSHHDVu[i].ThTien,
            jsonDSHHDVu[i].TLCKhau,
            jsonDSHHDVu[i].STCKhau,
            jsonDSHHDVu[i].TSuat,
            jsonDSHHDVu[i].TTKhac[0].DLieu,
            master[0].TEI_EINVOICE_M_PK,
          ];

          await DBService.callProcCursor('WT_UPD_TEI_WT_INVOICE_D', detailPara, p_language, p_crt_by);
          // console.log("detail", detail);
        }

        await DBService.callProcCursor('WT_UPD_TEI_WT_INVOICE_D_VAT', [master[0].PK], p_language, p_crt_by);

        return (result_extra = {
          PK: master[0].PK,
          TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
          SIGN_DATETIME: signingTime.SigningTime,
          SIGN_BY: jsonNBan[0].Ten,
        });
      } else {
        return (result_extra = {
          PK: master[0].PK,
          //TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
          MA_TRACUU: master[0].MA_TRACUU,
          CQT_MCCQT: master[0].CQT_MCCQT,
          REQ_KEY_PK: master[0].REQ_KEY_PK,
          LOOKUP_CODE: master[0].LOOKUP_CODE,
        }); //master[0].PK;
      }
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController',
        FUNC: 'weTaxExtractXMLContent',
        CONTENT: e.message,
      });
      console.log(e);
      return (result_extra = {
        PK: -2,
        TEI_EINVOICE_M_PK: 0,
      }); //master[0].PK;;
    }
  }

  weTaxValidatePosInvoiceToXML(invoices) {
    let status = true;
    let resMess = '';
    const mess1 = 'Invalid field';
    //console.log('weTaxValidatePosInvoiceToXML invoice  ', invoices);
    try {
      const errorList = {
        version: /^(\d{1}\.\d{1}\.\d{1})$/, //6
        sale_id: /^-?\d+(\.\d{1,99})?$/, //99
        msg_his_id: /^-?\d+(\.\d{1,99})?$/, //99
        invoice_name: /^.{0,100}$/, //100
        form_no: /^.{0,1}$/, //1
        serial_no: /^.{0,6}$/, // 6
        invoice_no: /^.{0,9}$/, // 8
        invoice_date: /^(\d{4}\-\d{2}\-\d{2})$/, //10,
        currency: /^.{0,3}$/, //3,
        ex_rate: /^-?[0-9]{1,7}(?:\.[0-9]{1,2})?$/, //7.2
        payment_method: /^.{0,50}$/, //50,
        seller_comp_name: /^.{0,400}$/, //400,
        seller_taxcode: {10: /^(\d{10})$/, 14: /^(\d{10}\-\d{3})$/}, // 10
        seller_address: /^.{0,400}$/, //400,
        seller_phone: /^.{0,50}$/, // 20
        buyer_comp_name: /^.{0,400}$/, //400,
        buyer_taxcode: {10: /^(\d{10})$/, 14: /^(\d{10}\-\d{3})$/},
        buyer_address: /^.{0,400}$/, // 400
        buyer_nm: /^.{0,100}$/,
        buyer_phone: /^.{0,20}$/, //20,
        buyer_cccd: /^.{0,12}$/, //12,
        detail_invoice: {
          feature: /^(1|2|3|4){1}$/, /// /^-?\d+(\.\d{1})?$/, //1,
          seq: /^-?\d+(\.\d{0,4})?$/, //4 ,
          item_code: /^[\s\S]{0,50}$/, //50,
          item_name: /^[\s\S]{1,500}$/, //500,
          item_uom: /^.{0,50}$/, //50,
          quantity: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, //21.6,
          uprice: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, // 21.6,
          dc_rate: /^-?\d+(\.\d{1,4})?[%]/, // 6,4
          dc_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          vat_rate: /^(0%|5%|8%|10%)$/, //  /^-?\d+(\.\d{1,4})?[%]/,
          amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, //21, 6
        },

        total_vat_list: {
          sub_vat_rate: /^(0%|5%|8%|10%)$/, //  /^-?\d+(\.\d{1,4})?[%]/, //11,
          sub_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          sub_amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        },

        total_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_amt_dc: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment_word_vie: /^.{1,255}$/, // 255
      };

      for (const invoice of invoices) {
        let vat_amount_vat = 0,
          vat_amout = 0,
          vat_total_amount = 0;
        let master_amount_vat = 0,
          master_amount = 0,
          master_total_amount = 0;
        let detail_amount_vat = 0,
          detail_amount = 0,
          detail_total_amount = 0;
        for (const key in invoice) {
          if (errorList[`${key}`] != undefined && !Array.isArray(invoice[key])) {
            master_amount_vat = Number(invoice['total_amt_vat']);
            master_amount = Number(invoice['total_amt']);
            master_total_amount = Number(invoice['total_payment']);

            if (key == 'seller_taxcode' || key == 'buyer_taxcode') {
              if (invoice[key].length == 10) {
                if (!errorList[`${key}`][10].test(invoice[key])) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              } else if (invoice[key].length == 14) {
                if (!errorList[`${key}`][14].test(invoice[key])) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              } else if (invoice[key]) {
                // ((invoice[key].length < 10 || invoice[key].length > 14) && invoice[key]) {
                status = false;
                resMess = `${mess1} ${key}. length between 10 and 14}.`;
                return {
                  status,
                  message: resMess,
                };
              }
            } else if (key == 'buyer_email' || key == 'buyer_email_cc' || key == 'seller_email') {
              if (!errorList[`${key}`].test(invoice[key]) && invoice[key]) {
                // && invoice[key]
                status = false;
                resMess = `${mess1} ${key}.`;
                return {
                  status,
                  message: resMess,
                };
              }
            } else if (!errorList[`${key}`].test(invoice[key])) {
              // && invoice[key]
              status = false;
              resMess = `${mess1} ${key}.`;
              return {
                status,
                message: resMess,
              };
            }
          } else {
            if (key == 'total_vat_list') {
              //console.log('key  ', key);

              for (const sub_vat of invoice[key]) {
                vat_amount_vat += Number(sub_vat.sub_amt_vat);
                vat_amout += Number(sub_vat.sub_amt);

                if (
                  !errorList[`${key}`].sub_vat_rate.test(sub_vat.sub_vat_rate) &&
                  sub_vat.sub_vat_rate != 'KCT' &&
                  sub_vat.sub_vat_rate != 'KKKNT'
                ) {
                  status = false;
                  resMess = `${mess1} sub_vat_rate is ${sub_vat.sub_vat_rate}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }

                if (!errorList[`${key}`].sub_amt.test(sub_vat.sub_amt)) {
                  status = false;
                  resMess = `${mess1} sub_amt is ${sub_vat.sub_amt}.`;

                  return {
                    status,
                    message: resMess,
                  };
                }

                if (!errorList[`${key}`].sub_amt_vat.test(sub_vat.sub_amt_vat)) {
                  status = false;
                  resMess = `${mess1} sub_amt_vat is ${sub_vat.sub_amt_vat}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              }
            }

            if (key == 'detail_invoice') {
              for (const inv of invoice[key]) {
                if (inv.feature == 3) {
                  detail_amount_vat -= Number(inv.amt_vat);
                  detail_amount -= Number(inv.amt);
                } else {
                  detail_amount_vat += Number(inv.amt_vat);
                  detail_amount += Number(inv.amt);
                }

                if (!errorList[`${key}`].feature.test(inv.feature)) {
                  status = false;
                  resMess = `${mess1} feature is:  ${inv.feature}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].seq.test(inv.seq)) {
                  status = false;
                  resMess = `${mess1} seq is:  ${inv.seq}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_code.test(inv.item_code) && inv.item_code) {
                  status = false;
                  resMess = `${mess1} item_code is:  ${inv.item_code}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_name.test(inv.item_name)) {
                  status = false;
                  resMess = `${mess1} item_name is:  ${inv.item_name}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_uom.test(inv.item_uom)) {
                  status = false;
                  resMess = `${mess1} item_uom is:  ${inv.item_uom}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].quantity.test(inv.quantity)) {
                  status = false;
                  resMess = `${mess1} quantity is:  ${inv.quantity}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].uprice.test(inv.uprice)) {
                  status = false;
                  resMess = `${mess1} uprice is:  ${inv.uprice}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].dc_amt.test(inv.dc_amt)) {
                  status = false;
                  resMess = `${mess1} dc_amt is:  ${inv.dc_amt}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].dc_rate.test(inv.dc_rate) && inv.dc_rate && inv.dc_rate != 'KCT' && inv.dc_rate != 'KKKNT') {
                  status = false;
                  resMess = `${mess1} dc_rate is:  ${inv.dc_rate}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].amt.test(inv.amt)) {
                  status = false;
                  resMess = `${mess1} amt is:  ${inv.amt}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].vat_rate.test(inv.vat_rate) && inv.vat_rate != 'KCT' && inv.vat_rate != 'KKKNT') {
                  status = false;
                  resMess = `${mess1} vat_rate is:  ${inv.vat_rate}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].amt_vat.test(inv.amt_vat)) {
                  status = false;
                  resMess = `${mess1} amt_vat is:  ${inv.amt_vat}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              }
            }
          }
        }
        if (
          (Number(master_amount.toFixed(6)) != Number(detail_amount.toFixed(6)) ||
            Number(vat_amout.toFixed(6)) != Number(master_amount.toFixed(6))) &&
          master_amount != null
        ) {
          status = false;
          resMess = `${mess1} amount no vat is: ${master_amount}  != ${detail_amount} != ${vat_amout}`;
          return {
            status,
            message: resMess,
          };
        }

        // console.log(
        //   'master_amount_vat.toFixed(6)  ',
        //   master_amount_vat.toFixed(6),
        //   'detail_amount_vat.toFixed(6) ',
        //   detail_amount_vat.toFixed(6),
        //   '  master_amount_vat ',
        //   master_amount_vat,
        //   '  vat_amount_vat ',
        //   vat_amount_vat,
        // );
        if (
          (Number(master_amount_vat.toFixed(6)) != Number(detail_amount_vat.toFixed(6)) ||
            Number(vat_amount_vat.toFixed(6)) != Number(master_amount_vat.toFixed(6))) &&
          master_amount_vat != null
        ) {
          status = false;
          resMess = `${mess1} amount vat is: ${master_amount_vat} != ${detail_amount_vat}  != ${vat_amount_vat}`;
          return {
            status,
            message: resMess,
          };
        }
        vat_total_amount = Number(vat_amount_vat.toFixed(6)) + Number(vat_amout.toFixed(6));
        detail_total_amount = Number(detail_amount) + Number(detail_amount_vat);

        // console.log(
        //   'master_total_amount.toFixed(6)  ',
        //   master_total_amount.toFixed(6),
        //   'detail_total_amount.toFixed(6) ',
        //   detail_total_amount.toFixed(6),
        //   '  master_total_amount ',
        //   master_total_amount,
        //   '  vat_total_amount ',
        //   vat_total_amount,
        // );
        if (
          (Number(master_total_amount.toFixed(6)) != Number(detail_total_amount.toFixed(6)) ||
            Number(vat_total_amount.toFixed(6)) != Number(master_total_amount.toFixed(6))) &&
          master_total_amount != null
        ) {
          status = false;
          resMess = `${mess1} amount total is: ${master_total_amount}  != ${detail_total_amount} != ${vat_total_amount}`;
          return {
            status,
            message: resMess,
          };
        }
      }
      // if dont have any problem
      return {
        status,
        message: resMess,
      };
    } catch (error) {
      console.log('error  ', error);
      //let status = false;
      return {
        status,
        message: resMess,
      };
    }
  }

  weTaxValidateNormalInvoiceToXML(invoices) {
    let status = true;
    let resMess = '';
    const mess1 = 'Invalid field';
    //console.log("invoice  ", invoice)
    try {
      const errorList = {
        version: /^(\d{1}\.\d{1}\.\d{1})$/, //6
        master_pk: /^-?\d+(\.\d{1,99})?$/, //99
        invoice_name: /^.{0,100}$/, //100
        form_no: /^.{0,1}$/, //1
        serial_no: /^.{0,6}$/, // 6
        invoice_no: /^.{0,9}$/, // 8
        invoice_date: /^(\d{4}\-\d{2}\-\d{2})$/, //10,
        currency: /^.{0,3}$/, //3,
        ex_rate: /^-?[0-9]{1,7}(?:\.[0-9]{1,2})?$/, //7.2
        payment_method: /^.{0,50}$/, //50,
        seller_comp_name: /^.{0,400}$/, //400,
        seller_taxcode: {10: /^(\d{10})$/, 14: /^(\d{10}\-\d{3})$/}, // 10
        seller_address: /^.{0,400}$/, //400,
        seller_phone: /^.{0,20}$/, // 20
        seller_email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, ///^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm, // 20
        seller_bank_no: /^.{0,30}$/, // 20
        seller_bank_name: /^.{0,400}$/, // 20
        seller_fax: /^.{0,20}$/, // 20
        seller_website: /^.{0,50}$/, // 20
        buyer_comp_name: /^.{0,400}$/, //400,
        buyer_name: /^.{0,100}$/,
        buyer_code: /^.{0,50}$/,
        buyer_taxcode: {10: /^(\d{10})$/, 14: /^(\d{10}\-\d{3})$/},
        buyer_address: /^.{0,400}$/, // 400
        buyer_phone: /^.{0,20}$/, //20,
        buyer_email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, //  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm,
        buyer_email_cc: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm,
        buyer_bank_no: /^.{0,30}$/,
        buyer_bank_name: /^.{0,400}$/,
        detail_invoice: {
          feature: /^(1|2|3|4){1}$/, //  /^-?\d+(\.\d{1})?$/, //1,
          seq: /^-?\d+(\.\d{0,4})?$/, //4 ,
          item_code: /^[\s\S]{0,50}$/, //50,
          item_name: /^[\s\S]{1,500}$/, //500,
          item_uom: /^.{0,50}$/, //50,
          quantity: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, //21.6,
          uprice: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, // 21.6,
          dc_rate: /^-?\d+(\.\d{1,4})?[%]/, // 6,4
          dc_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          vat_rate: /^(0%|5%|8%|10%)$/, //  /^-?\d+(\.\d{1,4})?[%]/,
          amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/, //21, 6
        },

        total_vat_list: {
          sub_vat_rate: /^(0%|5%|8%|10%|KCT|KKKNT)$/, //sub_vat_rate: /^(0%|5%|8%|10%)$/, //  /^-?\d+(\.\d{1,4})?[%]/, //11,
          sub_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
          sub_amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        },

        total_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_amt_vat: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_amt_dc: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment_word_vie: /^.{1,255}$/, // 255
      };

      for (const invoice of invoices) {
        let vat_amount_vat = 0,
          vat_amout = 0,
          vat_total_amount = 0;
        let master_amount_vat = 0,
          master_amount = 0,
          master_total_amount = 0;
        let detail_amount_vat = 0,
          detail_amount = 0,
          detail_total_amount = 0;

        for (const key in invoice) {
          if (errorList[`${key}`] != undefined && !Array.isArray(invoice[key])) {
            master_amount_vat = Number(invoice['total_amt_vat']);
            master_amount = Number(invoice['total_amt']);
            master_total_amount = Number(invoice['total_payment']);
            if (key == 'seller_taxcode' || key == 'buyer_taxcode') {
              if (invoice[key].length == 10) {
                if (!errorList[`${key}`][10].test(invoice[key])) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              } else if (invoice[key].length == 14) {
                if (!errorList[`${key}`][14].test(invoice[key])) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              } else if (invoice[key]) {
                // ((invoice[key].length < 10 || invoice[key].length > 14) && invoice[key]) {
                status = false;
                resMess = `${mess1} ${key}. length between 10 and 14}.`;
                return {
                  status,
                  message: resMess,
                };
              }
            } else if (key == 'buyer_email' || key == 'buyer_email_cc' || key == 'seller_email') {
              //console.log('validateJsonInvalidNormalInvoiceToXML  key   ', key, ' - ', invoice[key]);
              if (!errorList[`${key}`].test(invoice[key]) && invoice[key]) {
                // && invoice[key]
                status = false;
                resMess = `${mess1} ${key}.`;
                return {
                  status,
                  message: resMess,
                };
              }
            } else if (!errorList[`${key}`].test(invoice[key])) {
              status = false;
              resMess = `${mess1} ${key}.`;
              return {
                status,
                message: resMess,
              };
            }
          } else {
            if (key == 'total_vat_list') {
              for (const sub_vat of invoice[key]) {
                vat_amount_vat += Number(sub_vat.sub_amt_vat);
                vat_amout += Number(sub_vat.sub_amt);
                if (
                  !errorList[`${key}`].sub_vat_rate.test(sub_vat.sub_vat_rate) &&
                  sub_vat.sub_vat_rate != 'KCT' &&
                  sub_vat.sub_vat_rate != 'KKKNT'
                ) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }

                if (!errorList[`${key}`].sub_amt.test(sub_vat.sub_amt)) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }

                if (!errorList[`${key}`].sub_amt_vat.test(sub_vat.sub_amt_vat)) {
                  status = false;
                  resMess = `${mess1} ${key}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              }
            }

            if (key == 'detail_invoice') {
              for (const inv of invoice[key]) {
                detail_amount_vat += Number(inv.amt_vat);
                detail_amount += Number(inv.amt);
                if (!errorList[`${key}`].feature.test(inv.feature)) {
                  status = false;
                  resMess = `${mess1} feature is: ${inv.feature}.`;

                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].seq.test(inv.seq)) {
                  status = false;
                  resMess = `${mess1} seq is: ${inv.seq}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_code.test(inv.item_code) && inv.item_code) {
                  status = false;
                  resMess = `${mess1} item_code is: ${inv.item_code}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_name.test(inv.item_name)) {
                  status = false;
                  resMess = `${mess1} item_name is: ${inv.item_name}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].item_uom.test(inv.item_uom)) {
                  status = false;
                  resMess = `${mess1} item_uom is: ${inv.item_uom}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].quantity.test(inv.quantity)) {
                  status = false;
                  resMess = `${mess1} quantity is: ${inv.quantity}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].uprice.test(inv.uprice)) {
                  status = false;
                  resMess = `${mess1} uprice is: ${inv.uprice}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].dc_amt.test(inv.dc_amt)) {
                  status = false;
                  resMess = `${mess1} dc_amt is: ${inv.dc_amt}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].dc_rate.test(inv.dc_rate) && inv.dc_rate && inv.dc_rate != 'KCT' && inv.dc_rate != 'KKKNT') {
                  status = false;
                  resMess = `${mess1} dc_rate is: ${inv.dc_rate}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].amt.test(inv.amt)) {
                  status = false;
                  resMess = `${mess1} amt is: ${inv.amt}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].vat_rate.test(inv.vat_rate) && inv.vat_rate != 'KCT' && inv.vat_rate != 'KKKNT') {
                  status = false;
                  resMess = `${mess1} vat_rate is: ${inv.vat_rate}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
                if (!errorList[`${key}`].amt_vat.test(inv.amt_vat)) {
                  status = false;
                  resMess = `${mess1} amt_vat is: ${inv.amt_vat}.`;
                  return {
                    status,
                    message: resMess,
                  };
                }
              }
            }
          }
        }

        if (Number(master_amount.toFixed(6)) != Number(detail_amount.toFixed(6)) && master_amount != null) {
          status = false;
          resMess = `${mess1} amount xx is: ${master_amount}  != ${detail_amount}`;
          return {
            status,
            message: resMess,
          };
        }

        if (Number(master_amount_vat.toFixed(6)) != Number(detail_amount_vat.toFixed(6)) && master_amount_vat != null) {
          status = false;
          resMess = `${mess1} amount vat is: ${master_amount_vat} != ${detail_amount_vat}`;
          return {
            status,
            message: resMess,
          };
        }
        //vat_total_amount = vat_amount_vat + vat_amout;
        detail_total_amount = Number(detail_amount) + Number(detail_amount_vat);

        if (Number(master_total_amount.toFixed(6)) != Number(detail_total_amount.toFixed(6)) && master_total_amount != null) {
          status = false;
          resMess = `${mess1} amount total is: ${master_total_amount}  != ${detail_total_amount}`;
          return {
            status,
            message: resMess,
          };
        }
      }
      // if dont have any problem
      return {
        status,
        message: resMess,
      };
    } catch (error) {
      console.log('error  ', error);
      //let status = false;
      return {
        status,
        message: resMess,
      };
    }
  }

  async weTaxSendMailPos(data_send_mail, ipa_name, tax_code, p_language, p_crt_by) {
    try {
      // send mail ............
      let data_rep = [];
      for (const data of data_send_mail) {
        const {res_send_mail, subject, body} = await this.sendMailToCustomer(
          data.tei_wt_sale_bill_pk,
          data.lookup_code,
          data.invoice,
          p_language,
          p_crt_by,
        );

        if (res_send_mail.data.success) {
          const para_inv_st = {
            tei_wt_sale_bill_pk: data.tei_wt_sale_bill_pk,
            status: 'Sent Success',
          };
          // const rtnValueSendMail =
          await DBService.ExecuteSQLBlob(
            `BEGIN wt_upd_sale_bill_status (          
                                                               :tei_wt_sale_bill_pk,
                                                               :status,
                                                               :p_language, 
                                                               :p_crt_by, 
                                                               :p_rtn_cur); END;`,
            para_inv_st,
            p_language,
            p_crt_by,
          );

          data_rep.push({
            sale_id: data.invoice.sale_id,
            msg_his_id: data.invoice.msg_his_id,
            status_code: '1',
            status_name: 'Sent Success',
            send_date: res_send_mail.data.data.date_send,
            send_time: res_send_mail.data.data.time_send,
            mail_form: res_send_mail.data.data.mail_from,
            mail_to: res_send_mail.data.data.mail_to,
            mail_to_cc: res_send_mail.data.data.mail_to_cc,
            title: subject,
            content: body,
          });
        } else {
          const para_inv_st = {
            tei_wt_sale_bill_pk: data.tei_wt_sale_bill_pk,
            status: 'Sent Faile',
          };
          // const rtnValueSendMail =
          await DBService.ExecuteSQLBlob(
            `BEGIN wt_upd_sale_bill_status (          
                                                               :tei_wt_sale_bill_pk,
                                                               :status,
                                                               :p_language, 
                                                               :p_crt_by, 
                                                               :p_rtn_cur); END;`,
            para_inv_st,
            p_language,
            p_crt_by,
          );
          data_rep.push({
            sale_id: data.invoice.sale_id,
            msg_his_id: data.invoice.msg_his_id,
            status_code: '0',
            status_name: 'Sent Faile',
            send_date: res_send_mail.data.data.date_send,
            send_time: res_send_mail.data.data.time_send,
            mail_form: res_send_mail.data.data.mail_from,
            mail_to: res_send_mail.data.data.mail_to,
            mail_to_cc: res_send_mail.data.data.mail_to_cc,
            title: subject,
            content: body,
          });
        }
      }

      if (data_rep && data_rep.length > 0) {
        const agent = {
          Agent: {
            defaultPort: 443,
            protocol: 'https:',
            options: {maxVersion: 'TLSv1.2', minVersion: 'TLSv1.2', path: null},
          },
        };
        //console.log('sendMailWT   service_id ', ipa_name);
        //console.log('sendMailWT   seller_tax_code ', tax_code);
        //console.log('sendMailWT   info_send_email ', data_rep);

        let triesCounter = 0;
        while (triesCounter < 3) {
          try {
            const res = await Request.post(
              `${WETAX_API_URL}/api/wtx/v1/email-delivery-status`,
              {
                service_id: ipa_name,
                seller_tax_code: tax_code,
                info_send_email: data_rep,
              },
              {
                agent,
                headers: {
                  Authorization: 'Basic ' + WETAX_TOKEN_CALLBACK,
                },
              },
            );
            break; // 'return' would work here as well
          } catch (err) {
            await Utils._sleep(5);
            console.log(err);
          }
          triesCounter++;
        }
      }
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController',
        FUNC: 'sendMailWT',
        CONTENT: e.message,
      });
      console.log('e  ', e);
      //return response.send(Utils.response(false, e.message));
    }
  }

  async weTaxSendMailNor(data_send_mail, ipa_name, p_language, p_crt_by) {
    try {
      // send mail ............
      let data_rep = [];
      let tax_code = '';
      console.log('data_send_mail', data_send_mail);
      for (const data of data_send_mail) {
        if (data.mccqt && data.msg_his_id && data.buyer_email) {
          const data_param = {
            rep_key: data.trade_code,
            send_mail_yn: data.send_mail_yn,
          };
          const rtnValue_inv = await DBService.ExecuteSQLBlob(
            `BEGIN wt_sel_nor_inv_mail (          
                                                                  :rep_key,
                                                                  :send_mail_yn,
                                                                  :p_language, 
                                                                  :p_crt_by, 
                                                                  :p_rtn_cur); END;`,
            data_param,
            p_language,
            p_crt_by,
          );

          console.log('rtnValue_inv  ', rtnValue_inv);
          if (rtnValue_inv?.p_rtn_cur?.[0]?.STATUS == 'OK') {
            const invoice = {
              buyer_comp_name: rtnValue_inv.p_rtn_cur[0].BUYER_COMP_NM,
              seller_comp_name: rtnValue_inv.p_rtn_cur[0].SLLR_COMP_NM,
              form_no: rtnValue_inv.p_rtn_cur[0].FORM_NO,
              serial_no: rtnValue_inv.p_rtn_cur[0].SERIAL_NO,
              invoice_no: rtnValue_inv.p_rtn_cur[0].INVOICE_NO,
              total_payment: rtnValue_inv.p_rtn_cur[0].TOT_NET_TR_AMT,
              mccqt: rtnValue_inv.p_rtn_cur[0].CQT_MCCQT,
              buyer_email: data.buyer_email,
              buyer_email_cc: data.buyer_email_cc,
              invoice_type: rtnValue_inv.p_rtn_cur[0].INVOICE_TYPE,
              form_no_ref: rtnValue_inv.p_rtn_cur[0].FORM_NO_REF,
              serial_no_ref: rtnValue_inv.p_rtn_cur[0].SERIAL_NO_REF,
              invoice_no_ref: rtnValue_inv.p_rtn_cur[0].INVOICE_NO_REF,
              mccqt_ref: rtnValue_inv.p_rtn_cur[0].CQT_MCCQT_REF,
              total_payment_ref: rtnValue_inv.p_rtn_cur[0].TOT_NET_TR_AMT_REF,
              currency: rtnValue_inv.p_rtn_cur[0].TR_CCY,
            };

            tax_code = rtnValue_inv.p_rtn_cur[0].SLLR_TAXCODE;

            const {res_send_mail, subject, body} = await this.sendMailNorToCustomer(
              rtnValue_inv.p_rtn_cur[0].PK, //data.req_ep_key,
              rtnValue_inv.p_rtn_cur[0].LOOKUP_CD,
              invoice,
              p_language,
              p_crt_by,
            );
            console.log('res_send_mail ', res_send_mail);
            console.log('subject ', subject);
            console.log('body ', body);

            if (res_send_mail.data.success) {
              const para_inv_st = {
                tei_wt_sale_bill_pk: data.req_ep_key,
                status: 'Y',
              };
              // const rtnValueSendMail =
              await DBService.ExecuteSQLBlob(
                `BEGIN wt_upd_invoice_status (          
                                                                     :tei_wt_sale_bill_pk,
                                                                     :status,
                                                                     :p_language, 
                                                                     :p_crt_by, 
                                                                     :p_rtn_cur); END;`,
                para_inv_st,
                p_language,
                p_crt_by,
              );

              data_rep.push({
                sale_id: data.sale_id,
                msg_his_id: data.msg_his_id,
                status_code: '1',
                status_name: 'Sent Success',
                send_date: res_send_mail.data.data.date_send,
                send_time: res_send_mail.data.data.time_send,
                mail_form: res_send_mail.data.data.mail_from,
                mail_to: res_send_mail.data.data.mail_to,
                mail_to_cc: res_send_mail.data.data.mail_to_cc,
                title: subject,
                content: body,
              });
            } else {
              const para_inv_st = {
                tei_wt_sale_bill_pk: data.req_ep_key,
                status: 'N',
              };
              // const rtnValueSendMail =
              await DBService.ExecuteSQLBlob(
                `BEGIN wt_upd_invoice_status (          
                                                                     :tei_wt_sale_bill_pk,
                                                                     :status,
                                                                     :p_language, 
                                                                     :p_crt_by, 
                                                                     :p_rtn_cur); END;`,
                para_inv_st,
                p_language,
                p_crt_by,
              );
              data_rep.push({
                sale_id: data.sale_id,
                msg_his_id: data.msg_his_id,
                status_code: '0',
                status_name: 'Sent Faile',
                send_date: res_send_mail.data.data.date_send,
                send_time: res_send_mail.data.data.time_send,
                mail_form: res_send_mail.data.data.mail_from,
                mail_to: res_send_mail.data.data.mail_to,
                mail_to_cc: res_send_mail.data.data.mail_to_cc,
                title: subject,
                content: body,
              });
            }
          }
        }
      }

      if (data_rep && data_rep.length > 0) {
        console.log('data_rep ', data_rep);
        const agent = {
          Agent: {
            defaultPort: 443,
            protocol: 'https:',
            options: {maxVersion: 'TLSv1.2', minVersion: 'TLSv1.2', path: null},
          },
        };

        let triesCounter = 0;
        while (triesCounter < 3) {
          try {
            const res = await Request.post(
              `${WETAX_API_URL}/api/wtx/v1/email-delivery-status`,
              {
                service_id: ipa_name,
                seller_tax_code: tax_code,
                info_send_email: data_rep,
              },
              {
                agent,
                headers: {
                  Authorization: 'Basic ' + WETAX_TOKEN_CALLBACK,
                },
              },
            );
            break; // 'return' would work here as well
          } catch (err) {
            await Utils._sleep(5);
            console.log(err);
          }
          triesCounter++;
        }
      }
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController',
        FUNC: 'sendMailNormailWT',
        CONTENT: e.message,
      });
      console.log('e  ', e);
      //return response.send(Utils.response(false, e.message));
    }
  }

  async sendMailToCustomer(tei_wt_sale_bill_pk, lookup_code, data_invoice, p_language, p_crt_by) {
    try {
      //console.log("sSSSS ", tei_wt_sale_bill_pk);
      //let EiExcels = new EiPosExcelHandlerAuto();
      //let url_pdf = await EiExcels.getEinvoice(tei_wt_sale_bill_pk, p_language, p_crt_by);
      //console.log("base64PDf  ", url_pdf);
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      let token = AES.encrypt(tei_wt_sale_bill_pk + '|' + lookup_code + '|' + year + month + day, APP_KEY);
      token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');

      let url_pdf = APP_URL_LOCAL + '/api/dso/getfiletokenrealtime?req_key=' + tei_wt_sale_bill_pk + '&token=' + token;

      let re_url_xml = await Request.get(
        APP_URL_LOCAL + '/api/dso/getfiledbtoken?pk=' + tei_wt_sale_bill_pk + '&proc=' + 'EI_SEL_XML_POS_EINVOICE' + '&token=',
      ); //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE" );
      let url_xml = re_url_xml.data;
      //console.log("base64XXML  ", url_xml);

      let subject = `${data_invoice.seller_comp_name}[Thông báo phát hành HĐĐT][${data_invoice.form_no}][${data_invoice.serial_no}][${data_invoice.invoice_no}]`;
      let body = `<html>
                    <body>
                        <div id="page">
                            <div id="d2">
                                <p>Dear: ${data_invoice.buyer_comp_name}
                                    <br />
                                    <br />${data_invoice.seller_comp_name}.
                                    <br />            Trân trọng cảm ơn Quý khách hàng đã sử dụng sản phẩm của chúng tôi.
                                    <br/> Chúng tôi đã 
                                    <b>PHÁT HÀNH </b> hóa đơn điện tử với các thông tin như sau:
                                    <br/>- Mẫu số: ${data_invoice.form_no}
                                    <br/>- Ký hiệu: 
                                    <b>${data_invoice.serial_no}</b>
                                    <br/>- Số hóa đơn: 
                                    <b>${data_invoice.invoice_no}</b>
                                    <br/>- Tổng thanh toán: 
                                    <b>       ${
                                      new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                        .format(Number(data_invoice.total_payment))
                                        .replace('₫', '') +
                                      ' ' +
                                      data_invoice.currency
                                    }</b>
                                    <br/>- Mã CQT của hóa đơn: 
                                    <b> ${data_invoice.mccqt}</b>
                                    <br/>- Link tra cứu: 
                                    <a href='https://test.einvoicepro.webcashvietnam.com/lookup-einvoice?trade_code=${lookup_code}'>Xem hóa đơn</a>

                                    <br />- Link download file PDF: 
                                    <a href='${url_pdf}'>Tải file PDF</a>
                                    <br />- Link download file XML: 
                                    <a href='${url_xml}'>Tải file XML</a>
                                    <br />
                            </div>
                            <br/>
                            <div id="d6">
                                <p>
                                    <i>* Xin lưu ý: Đây là email gửi tự động từ hệ thống, vui lòng không trả lời về địa chỉ email này</i>
                                    <br />
                                    <i>Cám ơn sự hợp tác. </i>
                                    <br />
                            --------------------------------------------------------------------------
                        
                                </p>
                            </div>
                            <div id="d7"> Would like to send you our warmest greetings and most sincere thanks for choosing our product. 
                                <br/> We 
                                <b>issued </b> your e-invoice with the information as below: 
                                <br/>- Form No: 
                                <b>${data_invoice.form_no}</b>
                                <br/>- Serial: 
                                <b>${data_invoice.serial_no}</b>
                                <br/>- Invoice No:  
                                <b>${data_invoice.invoice_no}</b>
                                <br/>- Total amount :  
                                <b>       ${
                                  new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                    .format(Number(data_invoice.total_payment))
                                    .replace('₫', '') +
                                  ' ' +
                                  data_invoice.currency
                                }</b>
                                <br/>- CQT code of e-invoice: 
                                <b> ${data_invoice.mccqt}</b>
                                <br/>- Link lookup: 
                                <a href='https://test.einvoicepro.webcashvietnam.com/lookup-einvoice?trade_code=${lookup_code}'>View e-invoice</a>
                                <br />- Download file PDF link:  
                                <a href='${url_pdf}'>Download file PDF</a>
                                <br />- Download file XML link:  
                                <a href='${url_xml}'>Download file XML</a>
                                <br />
                                </p>
                            </div>
                            <div id="d8">
                                <p>
                                    <br/>* Note: This is an automatic email. Please do not feedback to this email.
                                    <br/>
                                Thank you for your corporation!
                                
                                </p>
                            </div>
                          </div>
                        </body>
                    </html>`;

      //console.log("sSSSS4 ", tei_wt_sale_bill_pk);

      const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
        mail_to: data_invoice.buyer_email,
        cc_to: data_invoice.buyer_email_cc,
        subject: subject,
        body: body,
        // attachfile1: url_xml,
        // attachfile2: url_pdf,
        // filename1: data_invoice.form_no + '_' + data_invoice.serial_no + '_' + data_invoice.invoice_no + '.xml',
        // filename2: data_invoice.form_no + '_' + data_invoice.serial_no + '_' + data_invoice.invoice_no + '.pdf',
      });
      //console.log("res_send_mail  ", res_send_mail);
      return {res_send_mail, subject, body};
    } catch (error) {
      console.log('res_send_mail error  ', error);
    }
  }

  async sendMailNorToCustomer(tei_wt_sale_bill_pk, lookup_code, data_invoice, p_language, p_crt_by) {
    try {
      //console.log("sSSSS ", tei_wt_sale_bill_pk);
      let EiExcels = new EiWTExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(tei_wt_sale_bill_pk, p_language, p_crt_by);
      //console.log("base64PDf  ", url_pdf);

      let re_url_xml = await Request.get(
        APP_URL_LOCAL + '/api/dso/getfiledbtoken?pk=' + tei_wt_sale_bill_pk + '&proc=' + 'WT_SEL_XML_NOR_EINVOICE' + '&token=',
      ); //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE" );
      let url_xml = re_url_xml.data;
      console.log('sendMailNorToCustomer data_invoice ', data_invoice);
      let body = '';

      let subject = `${data_invoice.seller_comp_name}[Thông báo phát hành HĐĐT][${data_invoice.form_no}][${data_invoice.serial_no}][${data_invoice.invoice_no}]`;

      if (data_invoice.invoice_type == '1') {
        subject = `${data_invoice.seller_comp_name}[Thông báo về việc thay thế HĐĐT][${data_invoice.form_no}][${data_invoice.serial_no}][${data_invoice.invoice_no}]`;
      } else if (data_invoice.invoice_type == '2') {
        subject = `${data_invoice.seller_comp_name}[Thông báo về việc điều chỉnh HĐĐT][${data_invoice.form_no}][${data_invoice.serial_no}][${data_invoice.invoice_no}]`;
      }

      body = `<html>
                            <body>
                                <div id="page">
                                    <div id="d2">
                                        <p>Dear: ${data_invoice.buyer_comp_name}
                                            <br />
                                            <br />${data_invoice.seller_comp_name}.
                                            <br />            Trân trọng cảm ơn Quý khách hàng đã sử dụng sản phẩm của chúng tôi.
                                            <br/> Chúng tôi đã 
                                            <b>PHÁT HÀNH </b> hóa đơn điện tử với các thông tin như sau:
                                            <br/>- Mẫu số: ${data_invoice.form_no}
                                            <br/>- Ký hiệu: 
                                            <b>${data_invoice.serial_no}</b>
                                            <br/>- Số hóa đơn: 
                                            <b>${data_invoice.invoice_no}</b>
                                            <br/>- Tổng thanh toán: 
                                            <b>       ${
                                              new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                .format(Number(data_invoice.total_payment))
                                                .replace('₫', '') +
                                              ' ' +
                                              data_invoice.currency
                                            }</b>
                                            <br/>- Mã CQT của hóa đơn: 
								                            <b> ${data_invoice.mccqt}</b>
                                            <br/>- Link tra cứu: 
								                            <a href='https://test.einvoicepro.webcashvietnam.com/lookup-einvoice?trade_code=${lookup_code}'>Xem hóa đơn</a>

                                            <br />- Link download file PDF: 
                                            <a href='${url_pdf}'>Tải file PDF</a>
                                            <br />- Link download file XML: 
                                            <a href='${url_xml}'>Tải file XML</a>
                                            <br />`;
      if (data_invoice.invoice_type == '1') {
        body =
          body +
          ` - Thay thế cho Số hóa đơn: <b>${data_invoice.invoice_no_ref}</b><br />
                                              - Mẫu số: <b>${data_invoice.form_no_ref}</b><br />
                                              - Ký hiệu: <b>${data_invoice.serial_no_ref}</b><br />
                                              - Mã CQT (nếu có): <b>${data_invoice.mccqt_ref}</b><br />
                                              - Tổng thanh toán: <b>${
                                                new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                  .format(Number(data_invoice.total_payment_ref))
                                                  .replace('₫', '') +
                                                ' ' +
                                                data_invoice.currency
                                              }</b><br />
                                            `;
      } else if (data_invoice.invoice_type == '2') {
        body =
          body +
          ` - Điều chỉnh cho Số hóa đơn: <b>${data_invoice.invoice_no_ref}</b><br />
                                              - Mẫu số: <b>${data_invoice.form_no_ref}</b><br />
                                              - Ký hiệu: <b>${data_invoice.serial_no_ref}</b><br />
                                              - Mã CQT (nếu có): <b>${data_invoice.mccqt_ref}</b><br />
                                              - Tổng thanh toán: <b>${
                                                new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                  .format(Number(data_invoice.total_payment_ref))
                                                  .replace('₫', '') +
                                                ' ' +
                                                data_invoice.currency
                                              }</b><br />
                                            `;
      }
      body =
        body +
        `</div>
                                        <br/>
                                        <div id="d6">
                                            <p>
                                                <i>* Xin lưu ý: Đây là email gửi tự động từ hệ thống, vui lòng không trả lời về địa chỉ email này</i>
                                                <br />
                                                <i>Cám ơn sự hợp tác. </i>
                                                <br />
                                        --------------------------------------------------------------------------
                                    
                                            </p>
                                        </div>
                                        <div id="d7"> Would like to send you our warmest greetings and most sincere thanks for choosing our product. 
                                            <br/> We 
                                            <b>issued </b> your e-invoice with the information as below: 
                                            <br/>- Form No: 
                                            <b>${data_invoice.form_no}</b>
                                            <br/>- Serial: 
                                            <b>${data_invoice.serial_no}</b>
                                            <br/>- Invoice No:  
                                            <b>${data_invoice.invoice_no}</b>
                                            <br/>- Total amount :  
                                            <b>       ${
                                              new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                .format(Number(data_invoice.total_payment))
                                                .replace('₫', '') +
                                              ' ' +
                                              data_invoice.currency
                                            }</b>
                                            <br/>- CQT code of e-invoice: 
								                            <b> ${data_invoice.mccqt}</b>
                                            <br/>- Link lookup: 
								                            <a href='https://test.einvoicepro.webcashvietnam.com/lookup-einvoice?trade_code=${lookup_code}'>View e-invoice</a>

                                            <br />- Download file PDF link:  
                                            <a href='${url_pdf}'>Download file PDF</a>
                                            <br />- Download file XML link:  
                                            <a href='${url_xml}'>Download file XML</a>
                                            <br />`;
      if (data_invoice.invoice_type == '1') {
        body =
          body +
          ` - Replace for Invoice No: <b>${data_invoice.invoice_no_ref}</b> <br />
                                              - Form No: <b>${data_invoice.form_no_ref}</b> <br />
                                              - Serial No: <b>${data_invoice.serial_no_ref}</b> <br />
                                              - Tax agency’s code: <b>${data_invoice.mccqt_ref}</b> <br />
                                              - Total amount: <b>${
                                                new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                  .format(Number(data_invoice.total_payment_ref))
                                                  .replace('₫', '') +
                                                ' ' +
                                                data_invoice.currency
                                              }</b> <br />
                                            `;
      } else if (data_invoice.invoice_type == '2') {
        body =
          body +
          ` - Adjustment for Invoice No: <b>${data_invoice.invoice_no_ref}</b> <br />
                                              - Form No: <b>${data_invoice.form_no_ref}</b> <br />
                                              - Serial No: <b>${data_invoice.serial_no_ref}</b> <br />
                                              - Tax agency’s code: <b>${data_invoice.mccqt_ref}</b> <br />
                                              - Total amount: <b>${
                                                new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND', maximumFractionDigits: 9})
                                                  .format(Number(data_invoice.total_payment_ref))
                                                  .replace('₫', '') +
                                                ' ' +
                                                data_invoice.currency
                                              }</b> <br />
                                            `;
      }
      body =
        body +
        `</p>
                                    </div>
                                    <div id="d8">
                                        <p>
                                            <br/>* Note: This is an automatic email. Please do not feedback to this email.
                                            <br/>
                                        Thank you for your corporation!
                                        
                                        </p>
                                    </div>
                                </body>
                            </html>
                            `;

      //console.log("sSSSS4 ", tei_wt_sale_bill_pk);

      const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
        mail_to: data_invoice.buyer_email,
        cc_to: data_invoice.buyer_email_cc,
        subject: subject,
        body: body,
        attachfile1: url_xml,
        attachfile2: url_pdf,
        filename1: data_invoice.form_no + '_' + data_invoice.serial_no + '_' + data_invoice.invoice_no + '.xml',
        filename2: data_invoice.form_no + '_' + data_invoice.serial_no + '_' + data_invoice.invoice_no + '.pdf',
      });
      //console.log("res_send_mail  ", res_send_mail);
      return {res_send_mail, subject, body};
    } catch (error) {
      console.log('sendMailNorToCustomer error  ', error);
    }
  }

  convertHtmlCode(sText) {
    if (sText != null || sText == '') {
      return this.replaceAllExt(this.replaceAllExt(this.replaceAllExt(sText, '"', '&#34;'), '<', '&lt;'), '>', '&gt;');
      /*this.replaceAllExt(
        this.replaceAllExt(this.replaceAllExt(this.replaceAllExt(sText, '"', '&#34;'), '<', '&lt;'), '>', '&gt;'),
        '&',
        '&amp;',
      );*/
    } else {
      return '';
    }
  }

  replaceAllExt(strOgr, search, replacement) {
    var target = strOgr.toString();
    return target.replace(new RegExp(search, 'g'), replacement);
  }

  OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += '<' + prop + '>';
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] == 'object') {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    console.log('xml  ', xml);
    return xml;
  }
}
module.exports = EInvoiceController2;

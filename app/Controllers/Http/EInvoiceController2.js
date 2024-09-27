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
const moment = require('moment');
const {jar} = require('request');
const {lookup} = require('dns');

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

      const {tax_code, store_code, store_name, count_invoice, process_type, list_invoice} = request.all();

      const json_xml = await this.weTaxPosGeneralXML(tax_code, store_code, store_name, list_invoice, process_type || 'I', p_language, p_crt_by);
      console.log('json_xml ', json_xml);
      return response.status(200).json(Utils.responseByRule({success: true, message: 'Send e-Record successfully.', data: json_xml}));
    } catch (e) {
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxPosReportToTax',
        CONTENT: e.message,
      });
      // console.log("error ", e);
      // return response.send(Utils.response(false, e.message, null));
      return response.status(409).json(Utils.responseByRule({success: false, message: e.message}));
    }
  }

  async weTaxPosGeneralXML(tax_code, store_code, store_name, invoices, process_type, p_language, p_crt_by) {
    try {
      let rtnXML = [];
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

      const valid = this.validatePosInvoiceToXML(invoices);
      if (!valid.status) {
        return response.status(400).json(Utils.responseByRule({success: false, message: valid.message}));
      }

      if (invoices.length == undefined || invoices.length == 0) {
        return response.status(400).json(Utils.responseByRule({success: false, message: `Invalid: list_invoice`}));
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
          req_key.push(invoices[i].req_key);

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
          objInvoice.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_tel;

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
          objInvoice.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_tel;

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
          //if(invoices[i].buyer_tel)

          objInvoice.DLHDon.NDHDon.DSHHDVu = [];

          objInvoice.DLHDon.NDHDon.DSHHDVu = {};
          objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

          for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
            //console.log("invoices[i].detail_invoice  ", invoices[i].detail_invoice);
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
          objInvoice.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_vat_amt;

          objInvoice.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_dc_amt;
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
        rtnXML = {
          tax_code: tax_code,
          store_code: store_code,
          store_name: store_name,
          count_invoice_convert: invoices.length,
          sign_id: id,
          signature_path: signature_path,
          xml_data: xmlRemoveLine,
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
          req_key.push(invoices[i].req_key);

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
          objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_tel;

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
          objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_tel;

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
          //if(invoices[i].buyer_tel)

          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

          for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
            //console.log("invoices[i].detail_invoice  ", invoices[i].detail_invoice);
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
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_vat_amt;

          objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_dc_amt;
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].total_payment;
          objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = invoices[i].total_payment_word_vie; // await Utils.Num2VNText2(invoices[i].total_payment.toString(), invoices[i].currency);

          objInvoice.HDon.DSCKS.NBan = '';

          objInvoice.HDon.MCCQT = invoices[i].mccqt; //`M1-24-VZQYY-${Math.floor(10000000000 + Math.random() * 9000000000)}`; //
        }

        const id = uuid.v4();
        const signature_path = 'HDon/DSCKS/NBan';
        const xml = this.OBJtoXML(objInvoice);
        const xmlStr = xml.toString().replace('<DLHDon>', `<DLHDon Id=\'${id}\'>`).replace(/\n/g, '').replaceAll('"', "'");

        rtnXML = {
          tax_code: tax_code,
          store_code: store_code,
          store_name: store_name,
          count_invoice_convert: invoices.length,
          sign_id: id,
          signature_path: signature_path,
          xml_data: xmlStr,
          req_key: req_key,
        };
      }

      return rtnXML;
    } catch (error) {
      console.log(error);
      Utils.Logger({
        LVL: 'error',
        MODULE: 'EInvoiceController2',
        FUNC: 'weTaxPosReportToTax',
        CONTENT: error.message,
      });

      return [];
    }
  }

  validatePosInvoiceToXML(invoices) {
    let status = true;
    let resMess = '';
    const mess1 = 'Invalid field';
    //console.log("invoice  ", invoice)
    try {
      const errorList = {
        version: /^(\d{1}\.\d{1}\.\d{1})$/, //6
        req_key: /^-?\d+(\.\d{1,99})?$/, //99
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
        seller_tel: /^.{0,50}$/, // 20
        buyer_comp_name: /^.{0,400}$/, //400,
        buyer_taxcode: {10: /^(\d{10})$/, 14: /^(\d{10}\-\d{3})$/},
        buyer_address: /^.{0,400}$/, // 400
        buyer_nm: /^.{0,100}$/,
        buyer_tel: /^.{0,20}$/, //20,
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
        total_vat_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_dc_amt: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment: /^-?[0-9]{0,21}(?:\.[0-9]{1,6})?$/,
        total_payment_word_vie: /^.{1,255}$/, // 255
      };

      for (const invoice of invoices) {
        for (const key in invoice) {
          if (errorList[`${key}`] != undefined && !Array.isArray(invoice[key])) {
            //console.log('weTaxConvertPosInvoiceToXML key  ', key, ' invoice[key] ', invoice[key]);
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
                //console.log('sub_vat   ', sub_vat);
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

  convertHtmlCode(sText) {
    if (sText != null || sText == '') {
      return this.replaceAllExt(this.replaceAllExt(this.replaceAllExt(sText, '"', '&#34;'), '<', '&lt;'), '>', '&gt;');
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
    return xml;
  }
}
module.exports = EInvoiceController2;

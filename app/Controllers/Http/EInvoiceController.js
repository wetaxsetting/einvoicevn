"use strict";
const Utils = use("Utils");
const Env = use("Env");
const AES = use("AES");
const APP_KEY = Env.get("APP_KEY");
const Helpers = use("Helpers");
const Request = use("Request");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const API_URL = Env.get("API_URL");
const APP_URL_LOCAL = Env.get("APP_URL_LOCAL", Env.get("APP_URL"));
const API_URL_API = Env.get("API_URL_API", Env.get("API_URL_API"));
const PORT = Env.get("PORT", Env.get("PORT"));
const EINVOICE_USER = Env.get("EINVOICE_USER");
const EINVOICE_PW = Env.get("EINVOICE_PW");
const EINVOICE_URL_LOGIN = Env.get("EINVOICE_URL_LOGIN");
const EINVOICE_URL_API = Env.get("EINVOICE_URL_API");
const EINVOICE_URL_API_CHECKING = Env.get("EINVOICE_URL_API_CHECKING");
const EINVOICE_URL_API_INFORMADJUST_SEND = Env.get("EINVOICE_URL_API_INFORMADJUST_SEND");
const EINVOICE_URL_API_INFORMADJUST_CHECK = Env.get("EINVOICE_URL_API_INFORMADJUST_CHECK");
const EINVOICE_URL_API_DECLARATION_SEND = Env.get("EINVOICE_URL_API_DECLARATION_SEND");
const EINVOICE_URL_API_DECLARATION_CHECK = Env.get("EINVOICE_URL_API_DECLARATION_CHECK");
const EINVOICE_URL_API_CONVERT = Env.get("EINVOICE_URL_API_DECLARATION_CHECK");
const EINVOICE_URL_API_CONVERT_EINV = Env.get("EINVOICE_URL_API_CONVERT_EINV");
const EINVOICE_URL_API_VIEW_PDF = Env.get("EINVOICE_URL_API_VIEW_PDF");
const EINVOICE_URL_API_CONVERT_TO_XML_CLIENT = Env.get("EINVOICE_URL_API_CONVERT_TO_XML_CLIENT");
const EINVOICE_URL_API_VIEW_XML = Env.get("EINVOICE_URL_API_VIEW_XML");
const SMTP_SERVER = Env.get("SMTP_SERVER");
const SMTP_PORT = Env.get("SMTP_PORT");
const EMAIL_FROM = Env.get("EMAIL_FROM");
const EMAIL_USER = Env.get("EMAIL_USER");
const EMAIL_PW = Env.get("EMAIL_PW");
const _send_from_users = eval(Env.get("send_from_users"));
const fs = use("fs");
const { transform, prettyPrint } = require("camaro");
const convertXML = require("xml-js");
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
// const { result_lodash } = require("lodash-es");
const RenderJsonToExcelFile = use("App/Helpers/RenderJsonToExcelFile");
const EiExcelHandler = use("App/Helpers/EiExcelHandler");
const EiExcelHandlerAuto = use("App/Helpers/EiExcelHandlerAuto");
const EiPosExcelConverter = use("App/Helpers/EiPosExcelConverter");
const EiPosExcelHandler = use("App/Helpers/EiPosExcelHandler");
const EiPosExcelHandlerAuto = use("App/Helpers/EiPosExcelHandlerAuto");
const EiExcelTemplateHandler = use("App/Helpers/EiExcelTemplateHandler");
const EiWTExcelHandlerAuto = use("App/Helpers/EiWTExcelHandlerAuto");
const EiExcel04SS2Handler = use("App/Helpers/EiExcel04SS2Handler");
const EiExcel04SS3Handler = use("App/Helpers/EiExcel04SS3Handler");
const EiExcel04SSHandler = use("App/Helpers/EiExcel04SSHandler");
const URL = "http://demosign.easyca.vn:8080/api";
const Username = "demo_easysign";
const Password = "demo_easysign";
const Serial = "540110beffa622f3ca84bd2f93f0122c";
const Pin = "12345678";
const uuid = require("uuid");
const sharp = require('sharp');
const { Builder, parseString } = require("xml2js");
const { X509Certificate, crypto } = require("crypto");
const { create, createCB } = require("xmlbuilder2");
const { log, Console } = require("console");
const EINVOICE_ESIGN_XML = "http://genuclouding.com/wseinvoice/BSService.asmx/SignXml";
const EINVOICE_API_SEND_MAIL = "http://sendmail.genuwinsolution.com/api/user/sendmail";
const moment = require('moment');

// real site
const TAX_CHECK_TRADE_CODE = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
const TAX_USER_NAME = "GENUWIN";
const TAX_PASSWORD = "e_GX4v@";
const WETAX_TOKEN_CALLBACK = "bad056ce571e2f1459ced4f7ff4db6d493b6472026ac8a8997bc0c03625c8667";
const WETAX_API_URL = "https://api.wetax.com.vn";
// test site
// const TAX_CHECK_TRADE_CODE = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

const REDIS_CONNECTION = Env.get("REDIS_CONNECTION", "NO_REDIS")
let Redis = false
if (REDIS_CONNECTION != "NO_REDIS") {
  Redis = use('Redis')
} else {
  Redis = false
}

class EInvoiceController {

  async einvoicePdfConvert({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const { trade_code } = request.all();
    let EiExcel = new EiExcelHandler();
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    let result = await EiExcel.getEinvoice(trade_code, p_language, p_crt_by);
    return response.send(result);
  }

  async callLogin(p_url, p_user_id, p_user_pw) {
    try {
      // console.log("p_url  ", p_url);
      // console.log("p_user_id  ", p_user_id);
      // console.log("p_user_pw  ", p_user_pw);
      const res = await Request.post(p_url, {
        user_id: p_user_id,
        password: p_user_pw,
      });
      console.log("res.data", res.data);
      console.log("res.data.data", res.data.data.token);
      return res.data.data.token;
    } catch (err) {
      // console.log("err",err)
      return null;
    }
  }

  async sendMail({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const config = {
        headers: { Authorization: request.headers().authorization },
      };
      //console.log(config)
      const { trade_codes } = request.all();
      let smtp_info = {
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        tls: {
          secureProtocol: "TLSv1_method",
          secure: false,
          ignoreTLS: true,
          rejectUnauthorized: false,
        },
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PW,
        },
      };
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      let rtnResult = [];
      const template = await DBService.callProcCursor(
        "sys_sel_mail_template_default",
        ["einvoice"],
        "ENG",
        p_crt_by,
        "N"
      );
      //console.log("template", template)
      for (let i = 0; i < trade_codes.length; i++) {
        const trade_code = trade_codes[i].trade_code;
        const mail_to = trade_codes[i].mail_to;
        const mail_cc = trade_codes[i].mail_cc;
        let pdf_url = await Request.post(API_URL + "/einvoice/einvoicepdfconvert", { trade_code: trade_code }, config);
        let xml_url = await Request.get(
          API_URL + "/dso/getfiledbtoken?proc=EI_SEL_XML_FILE_BY_TRADECODE&pk=" + trade_code
        );
        const subject = template[0].SUBJECT;
        const body = template[0].BODY;
        let pdf_file_name = "";
        let xml_file_name = "";

        if (pdf_url == null || pdf_url == undefined || pdf_url == "") {
          rtnResult.push({ trade_code: trade_code, success: false, errmsg: "fail to create invoice pdf file" });
          continue;
        }

        if (xml_url == null || xml_url == undefined || xml_url == "") {
          rtnResult.push({ trade_code: trade_code, success: false, errmsg: "fail to create invoice xml file" });
          continue;
        }
        pdf_url = pdf_url.data;
        xml_url = xml_url.data;

        const invoice = await DBService.callProcCursor(
          "ei_sel_einvoice_by_tradecode",
          [trade_code],
          "ENG",
          p_crt_by,
          "N"
        );
        let cnt = 0;
        if (invoice[0].SMTP_SERVER) {
          smtp_info.host = invoice[0].SMTP_SERVER;
          smtp_info.port = invoice[0].SMTP_PORT;
          cnt = i % 5;
          if (cnt == 0) {
            smtp_info.auth.user = invoice[0].SMTP_MAIL1;
            smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
          } else if (cnt == 1) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL2.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL2;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL2_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 2) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL3.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL3;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL3_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 3) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL4.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL4;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL4_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          } else if (cnt == 4) {
            if (invoice[0].SMTP_MAIL2 && invoice[0].SMTP_MAIL5.length > 5) {
              smtp_info.auth.user = invoice[0].SMTP_MAIL5;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL5_PW;
            } else {
              smtp_info.auth.user = invoice[0].SMTP_MAIL1;
              smtp_info.auth.pass = invoice[0].SMTP_MAIL1_PW;
            }
          }
        } else {
          //use webcashgenuwin email
          cnt = i % _send_from_users.length;
          if (cnt < _send_from_users.length) {
            smtp_info.auth.user = _send_from_users[cnt].email;
            smtp_info.auth.pass = _send_from_users[cnt].password;
          }
        }
        if (smtp_info.port == 465 || smtp_info.port == "465") {
          smtp_info.secure = true;
        }

        let subject_binding = {
          SELLER_COMPANY_NAME: invoice[0].SELLER_COMPANY_NAME,
          FORM_NO: invoice[0].FORM_NO,
          SERIAL_NO: invoice[0].SERIAL_NO,
          INVOICE_NO: invoice[0].INVOICE_NO,
        };
        let body_binding = {
          EINVOICE_LOOKUP_URL:
            '<a href="http://e-invoice.webcashgenuwin.com/tracuuhd" rel="noopener noreferrer" target="_blank">http://e-invoice.webcashgenuwin.com/tracuuhd</a>',
          TRADE_CODE: trade_code,
        };
        pdf_file_name = invoice[0].INVOICE_NO + ".pdf";
        xml_file_name = invoice[0].INVOICE_NO + ".xml";
        let mail_option = {
          from: smtp_info.auth.user,
          to: mail_to, // list of receivers, separate by comma(;)
          cc: mail_cc,
          subject: subject, // Subject line
          text: "", // plain text body
          html: body, // html body
          attachments: [
            { filename: pdf_file_name, path: pdf_url },
            { filename: xml_file_name, path: xml_url },
          ],
        };
        //console.log("subject_binding", subject_binding)

        mail_option.subject = Utils.replaceString(mail_option.subject, subject_binding);
        mail_option.html = Utils.replaceString(mail_option.html, body_binding);
        //console.log("mail_option", mail_option)
        //console.log("smtp_info", smtp_info)
        const result = await Utils.smtpSendMail(mail_option, smtp_info);
        rtnResult.push({ trade_code: trade_code, success: result });
      }
      return response.send(Utils.response(true, `Sent mail result.`, rtnResult));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendMail",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, `Send mail neet error.`, e.message));
    }
  }

  async receiveSmsStatus({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
    
      const {
        SMSGUID,
        SMSSTATUS,
        SECRECTSIGN
      } = request.all();

      const para_value = {
        id: SMSGUID,
        stt: SMSSTATUS,
        sign: SECRECTSIGN,
      };
      const res = await DBService.ExecuteSQLBlob(
        `BEGIN EI_UPD_OTP_STS_WT(:id, :stt, :sign,
                              :p_language, :p_crt_by, :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );
      
      return response.send(
        Utils.response(true, 'ok', {  SMSGUID,
          SMSSTATUS,
          SECRECTSIGN })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "receiveSmsStatus",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message));
    }
  }

  async convertDeclareUsingInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { declare } = request.all();
      let jsonDeclare = {
        TKhai: {
          DLTKhai: {
            TTChung: {
              PBan: "2.0.1",
              MSo: "01/ĐKTĐ-HĐĐT",
              Ten: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
              HThuc: 1,
              TNNT: "Vinmart",
              MST: 104918404,
              CQTQLy: "Chi cục thuế Quận Hoàng Mai",
              MCQTQLy: 10108,
              NLHe: "NGUYỄN THỊ DUNG",
              DCLHe: "Quận Hoàng Mai, Hà Nội",
              DCTDTu: "dungnguyentran@gmail.com",
              DTLHe: "394552327",
              DDanh: "Hà Nội",
              NLap: "2021-15-11",
            },
            NDTKhai: {
              HTHDon: {
                CMa: 1,
                KCMa: 0,
                CMTMTTien: 0,
              },
              HTGDLHDDT: {
                NNTDBKKhan: 0,
                NNTKTDNUBND: 0,
                CDLTTDCQT: 0,
                CDLQTVAN: 0,
                CDLQTCTN: 0
              },
              PThuc: {
                CDDu: 1,
                CBTHop: 0,
              },
              LHDSDung: {
                HDGTGT: 1,
                HDBHang: 1,
                HDBTSCong: "",
                HDBHDTQGia: "",
                HDKhac: 0,
                CTu: 1,
              },
              DSCTSSDung: {
                CTS: [],
              },
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };

      if (declare && !declare.hasOwnProperty("seller_taxcode")) {
        return response.send(Utils.response(false, `Invalid json format.`, declare));
      }
      jsonDeclare.TKhai.DLTKhai.TTChung.PBan = this.convertHtmlCode(declare.version);
      jsonDeclare.TKhai.DLTKhai.TTChung.Ten = this.convertHtmlCode(declare.declare_name);
      jsonDeclare.TKhai.DLTKhai.TTChung.HThuc = declare.declare_type;
      jsonDeclare.TKhai.DLTKhai.TTChung.TNNT = this.convertHtmlCode(declare.seller_company_name);
      jsonDeclare.TKhai.DLTKhai.TTChung.MST = declare.seller_taxcode;
      jsonDeclare.TKhai.DLTKhai.TTChung.CQTQLy = declare.tax_office_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.MCQTQLy = declare.tax_office_code;
      jsonDeclare.TKhai.DLTKhai.TTChung.NLHe = this.convertHtmlCode(declare.contact_person);
      jsonDeclare.TKhai.DLTKhai.TTChung.DCLHe = this.convertHtmlCode(declare.contact_address);
      jsonDeclare.TKhai.DLTKhai.TTChung.DCTDTu = declare.contact_email;
      jsonDeclare.TKhai.DLTKhai.TTChung.DTLHe = declare.contact_phone;
      jsonDeclare.TKhai.DLTKhai.TTChung.DDanh = this.convertHtmlCode(declare.location_name);
      jsonDeclare.TKhai.DLTKhai.TTChung.NLap = await this.formatDate(declare.created_date);
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMa = declare.has_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.KCMa = declare.no_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMTMTTien = declare.pos_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTDBKKhan = declare.taxpayer_from_difficult_location;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTKTDNUBND = declare.taxpayer_from_people_committee_suggestions;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLTTDCQT = declare.transfer_data_directly_to_tax_office;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTVAN = declare.cdlqtvan;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTCTN = "0";
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CDDu = declare.full_transfer;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CBTHop = declare.summary_transfer;

      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDGTGT = declare.vat_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHang = declare.saling_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBTSCong = declare.public_asset_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHDTQGia = declare.national_reserve_goods_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDKhac = declare.other_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.CTu = declare.voucher;

      for (let i = 0; i < declare.digital_certificates.length; i++) {
        jsonDeclare.TKhai.DLTKhai.NDTKhai.DSCTSSDung.CTS.push({
          STT: declare.digital_certificates[i].sequence,
          TTChuc: declare.digital_certificates[i].organization_name,
          Seri: declare.digital_certificates[i].serial_no,
          TNgay: declare.digital_certificates[i].from_date,
          DNgay: declare.digital_certificates[i].to_date,
          HThuc: declare.digital_certificates[i].type,
        });
      }
      const xml = this.OBJtoXML(jsonDeclare);
      // console.log("xmlxml ++++==?> ", xml);
      return response.send(
        Utils.response(true, `Convert declare using invoices to xml was succesful.`, xml.toString().replace(/\n/g, ""))
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertDeclareUsingInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async weTaxConvertDeclareUsingInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { 
        version,
        declare_name,
        declare_type,
        declare_form_no,
        seller_company_name,
        seller_taxcode,
        tax_office_name,
        tax_office_code,
        contact_person,
        contact_address,
        contact_email,
        contact_phone,
        location_name,
        created_date,
        has_code,
        no_code,
        pos_code,
        taxpayer_from_difficult_location,
        taxpayer_from_people_committee_suggestions,
        transfer_data_directly_to_tax_office,
        cdlqtvan,
        full_transfer,
        summary_transfer,
        vat_invoice,
        sales_invoice,
        sales_invoice_passet,
        sales_invoice_national,
        other_invoice,
        voucher,
        digital_certificates
      } = request.all();

       const valid = this.validateDeclareJson({
        version,
        declare_name,
        declare_type,
        declare_form_no,
        seller_company_name,
        seller_taxcode,
        tax_office_name,
        tax_office_code,
        contact_person,
        contact_address,
        contact_email,
        contact_phone,
        location_name,
        created_date,
        has_code,
        no_code,
        pos_code,
        taxpayer_from_difficult_location,
        taxpayer_from_people_committee_suggestions,
        transfer_data_directly_to_tax_office,
        cdlqtvan,
        full_transfer,
        summary_transfer,
        vat_invoice,
        sales_invoice,
        sales_invoice_passet,
        sales_invoice_national,
        other_invoice,
        voucher,
        digital_certificates
       });
      if (!valid.status) {
        return response.send(Utils.response(valid.status, valid.message, null));
       }

       console.log("weTaxConvertDeclareUsingInvoiceToXML  ", {
        version,
        declare_name,
        declare_type,
        declare_form_no,
        seller_company_name,
        seller_taxcode,
        tax_office_name,
        tax_office_code,
        contact_person,
        contact_address,
        contact_email,
        contact_phone,
        location_name,
        created_date,
        has_code,
        no_code,
        pos_code,
        taxpayer_from_difficult_location,
        taxpayer_from_people_committee_suggestions,
        transfer_data_directly_to_tax_office,
        cdlqtvan,
        full_transfer,
        summary_transfer,
        vat_invoice,
        sales_invoice,
        sales_invoice_passet,
        sales_invoice_national,
        other_invoice,
        voucher,
        digital_certificates
       });

      let jsonDeclare = {
        TKhai: {
          DLTKhai: {
            TTChung: {
              PBan: "2.0.0",
              MSo: "01/ĐKTĐ-HĐĐT",
              Ten: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
              HThuc: 1,
              TNNT: "Vinmart",
              MST: 104918404,
              CQTQLy: "Chi cục thuế Quận Hoàng Mai",
              MCQTQLy: 10108,
              NLHe: "NGUYỄN THỊ DUNG",
              DCLHe: "Quận Hoàng Mai, Hà Nội",
              DCTDTu: "dungnguyentran@gmail.com",
              DTLHe: "394552327",
              DDanh: "Hà Nội",
              NLap: "2021-15-11",
            },
            NDTKhai: {
              HTHDon: {
                CMa: 1,
                KCMa: 0,
                CMTMTTien: 0,
              },
              HTGDLHDDT: {
                NNTDBKKhan: 0,
                NNTKTDNUBND: 0,
                CDLTTDCQT: 0,
                CDLQTVAN: 0,
                CDLQTCTN: 0,
              },
              PThuc: {
                CDDu: 1,
                CBTHop: 0,
              },
              LHDSDung: {
                HDGTGT: 1,
                HDBHang: 1,
                HDBTSCong: "",
                HDBHDTQGia: "",
                HDKhac: 0,
                CTu: 1,
              },
              DSCTSSDung: {
                CTS: [],
              },
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };
      jsonDeclare.TKhai.DLTKhai.TTChung.PBan = version;
      jsonDeclare.TKhai.DLTKhai.TTChung.MSo = declare_form_no;
      jsonDeclare.TKhai.DLTKhai.TTChung.Ten = declare_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.HThuc = declare_type;
      jsonDeclare.TKhai.DLTKhai.TTChung.TNNT = seller_company_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.MST = seller_taxcode;
      jsonDeclare.TKhai.DLTKhai.TTChung.CQTQLy = tax_office_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.MCQTQLy = tax_office_code;
      jsonDeclare.TKhai.DLTKhai.TTChung.NLHe = contact_person;
      jsonDeclare.TKhai.DLTKhai.TTChung.DCLHe = contact_address;
      jsonDeclare.TKhai.DLTKhai.TTChung.DCTDTu = contact_email;
      jsonDeclare.TKhai.DLTKhai.TTChung.DTLHe = contact_phone;
      jsonDeclare.TKhai.DLTKhai.TTChung.DDanh = location_name;
      jsonDeclare.TKhai.DLTKhai.TTChung.NLap = created_date;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMa = has_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.KCMa = no_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMTMTTien = pos_code;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTDBKKhan = taxpayer_from_difficult_location;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTKTDNUBND = taxpayer_from_people_committee_suggestions;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLTTDCQT = transfer_data_directly_to_tax_office;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTVAN = cdlqtvan;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTCTN = 0;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CDDu = full_transfer;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.PThuc.CBTHop = summary_transfer;

      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDGTGT = vat_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHang = sales_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBTSCong = sales_invoice_passet;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDBHDTQGia = sales_invoice_national;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.HDKhac = other_invoice;
      jsonDeclare.TKhai.DLTKhai.NDTKhai.LHDSDung.CTu = voucher;

      for (let i = 0; i < digital_certificates.length; i++) {
        jsonDeclare.TKhai.DLTKhai.NDTKhai.DSCTSSDung.CTS.push({
          STT: digital_certificates[i].sequence,
          TTChuc: digital_certificates[i].organization_name,
          Seri: digital_certificates[i].serial_no,
          TNgay: digital_certificates[i].from_date,
          DNgay: digital_certificates[i].to_date,
          HThuc: digital_certificates[i].type,
        });
      }
      // const id = uuid.v4();
      const id = 'ID1';
      const xml = this.OBJtoXML(jsonDeclare);
      const xmlId = xml.toString().replace("<DLTKhai>", `<DLTKhai Id=\'${id}\'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");

      return response.send(
        Utils.response(true, `Convert declare using invoices to xml was succesful.`, {
          xml_data: xmlRemoveLine,
          sign_id: id,
        })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxConvertDeclareUsingInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message));
    }
  }

  async convertInvoiceToXMLClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, invoices } = request.all();

      console.log(" invoices ", invoices);

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API_CONVERT_EINV, { invoices: invoices }, config);
        console.log("convertInvoiceToXMLClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.....`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXMLClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async convertDeclareToXMLClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { proc, declare } = request.all();
      // console.log(" declare ", declare);
      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);
      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API_CONVERT_TO_XML_CLIENT, { declare: declare }, config);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.....`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertDeclareToXMLClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async convertInvaliInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { invalid_invoices } = request.all();
      let jsonInvalidInvoices = {
        TBao: {
          DLTBao: {
            PBan: "v2.0.0",
            MSo: "04/SS-HĐĐT",
            Ten: "Thông báo hóa đơn điện tử có sai sót",
            Loai: 1,
            So: "",
            NTBCCQT: "",
            TCQT: "Chi cục thuế thành phố Hà Nội",
            MCQT: 101,
            MST: 104918404,
            TNNT: "Vinmart",
            DDanh: "Hà Nội",
            NTBao: "2021-10-07",
            DSHDon: {
              HDon: [
                /*{
                                                                                MCQTCap: 1234,
                                                                                KHMSHDon: 4,
                                                                                KHHDon: "C21TYY",
                                                                                SHDon: 411,
                                                                                Ngay: "2021-10-07",
                                                                                LADHDDT: 1,
                                                                                TCTBao: 2,
                                                                                LDo: "Điều chỉnh tên người bán cho hóa đơn Mẫu số 6 ký hiệu C21TYY số 61 ngày 29 tháng 09 năm 2021"
                                                                            },*/
              ],
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };
      if (invalid_invoices && !invalid_invoices.hasOwnProperty("tax_office_name")) {
        return response.send(Utils.response(false, `Invalid json format.`, invalid_invoices));
      }
      jsonInvalidInvoices.TBao.DLTBao.TCQT = this.convertHtmlCode(invalid_invoices.tax_office_name);
      jsonInvalidInvoices.TBao.DLTBao.MCQT = invalid_invoices.tax_office_code;
      jsonInvalidInvoices.TBao.DLTBao.MST = invalid_invoices.seller_taxcode;
      jsonInvalidInvoices.TBao.DLTBao.TNNT = this.convertHtmlCode(invalid_invoices.seller_company_name);
      jsonInvalidInvoices.TBao.DLTBao.DDanh = this.convertHtmlCode(invalid_invoices.location_name);
      jsonInvalidInvoices.TBao.DLTBao.NTBao = invalid_invoices.inform_date;

      for (let i = 0; i < invalid_invoices.invoices.length; i++) {
        jsonInvalidInvoices.TBao.DLTBao.DSHDon.HDon.push({
          MCQTCap: invalid_invoices.invoices[i].tax_confirmation_code,
          KHMSHDon: invalid_invoices.invoices[i].form_no,
          KHHDon: invalid_invoices.invoices[i].serial_no,
          SHDon: invalid_invoices.invoices[i].invoice_no,
          Ngay: invalid_invoices.invoices[i].invoice_date,
          LADHDDT: invalid_invoices.invoices[i].invoice_type,
          TCTBao: invalid_invoices.invoices[i].inform_type,
          LDo: this.convertHtmlCode(invalid_invoices.invoices[i].reason),
        });
      }
      const xml = convertXML.json2xml(jsonInvalidInvoices, {
        compact: true,
        ignoreComment: true,
        spaces: 4,
      });
      return response.send(
        Utils.response(true, `Convert invalid invoices to xml was succesful.`, xml.toString().replace(/\n/g, ""))
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvaliInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async weTaxConvertInvalidInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { version,
        declare_name,
        declare_type,
        form_no,
        tax_office_code,
        tax_office_name,
        seller_taxcode,
        seller_company_name,
        location_name,
        inform_date,
        invoices

      } = request.all();

      const valid = this.validateJsonInvalidInvoiceToXML({version,
        declare_name,
        declare_type,
        form_no,
        tax_office_code,
        tax_office_name,
        seller_taxcode,
        seller_company_name,
        location_name,
        inform_date,
        invoices});
      if (!valid.status) {
        return response.send(Utils.response(valid.status, valid.message, null));
      }

      let jsonInvalidInvoices = {
        TBao: {
          DLTBao: {
            PBan: "v2.0.0",
            MSo: "04/SS-HĐĐT",
            Ten: "Thông báo hóa đơn điện tử có sai sót",
            Loai: 1,
            So: "",
            NTBCCQT: "",
            TCQT: "Chi cục thuế thành phố Hà Nội",
            MCQT: 101,
            MST: 104918404,
            TNNT: "Vinmart",
            DDanh: "Hà Nội",
            NTBao: "2021-10-07",
            DSHDon: {
              HDon: [
                /*{
                                                                                MCQTCap: 1234,
                                                                                KHMSHDon: 4,
                                                                                KHHDon: "C21TYY",
                                                                                SHDon: 411,
                                                                                Ngay: "2021-10-07",
                                                                                LADHDDT: 1,
                                                                                TCTBao: 2,
                                                                                LDo: "Điều chỉnh tên người bán cho hóa đơn Mẫu số 6 ký hiệu C21TYY số 61 ngày 29 tháng 09 năm 2021"
                                                                            },*/
              ],
            },
          },
          DSCKS: {
            NNT: "",
          },
        },
      };

      jsonInvalidInvoices.TBao.DLTBao.PBan = version;
      jsonInvalidInvoices.TBao.DLTBao.MSo = declare_name;
      jsonInvalidInvoices.TBao.DLTBao.Ten = declare_type;
      jsonInvalidInvoices.TBao.DLTBao.Loai = form_no;
      jsonInvalidInvoices.TBao.DLTBao.TCQT = tax_office_name;
      jsonInvalidInvoices.TBao.DLTBao.MCQT = tax_office_code;
      jsonInvalidInvoices.TBao.DLTBao.MST = seller_taxcode;
      jsonInvalidInvoices.TBao.DLTBao.TNNT = seller_company_name;
      jsonInvalidInvoices.TBao.DLTBao.DDanh = location_name;
      jsonInvalidInvoices.TBao.DLTBao.NTBao = inform_date;

      for (let i = 0; i < invoices.length; i++) {
        jsonInvalidInvoices.TBao.DLTBao.DSHDon.HDon.push({
          MCQTCap: invoices[i].tax_confirmation_code,
          KHMSHDon: invoices[i].form_no,
          KHHDon: invoices[i].serial_no,
          SHDon: invoices[i].invoice_no,
          Ngay: invoices[i].invoice_date,
          LADHDDT: invoices[i].invoice_type,
          TCTBao: invoices[i].inform_type,
          LDo: invoices[i].reason,
        });
      }
      const id = "ID1";// uuid.v4();
      const xml = this.OBJtoXML(jsonInvalidInvoices);
      const xmlId = xml.toString().replace("<DLTBao>", `<DLTBao Id=\'${id}\'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");

      return response.send(
        Utils.response(true, `Convert invalid invoices to xml was successful.`, {
          xml_data: xmlRemoveLine,
          sign_id: id,
        })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxConvertInvalidInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async convertInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { invoices } = request.all();
      console.log(" invoices  ", invoices);
      //invoices = JSON.parse(invoices);
      let rtnXML = [];
      let objInvoice_M = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              SBKe: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
              MSTTCGP: "",
              MSTDVNUNLHDon: "",
              TDVNUNLHDon: "",
              DCDVNUNLHDon: "",
              TTKhac: {},
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                DCTDTu: "",
                STKNHang: "",
                NNBSTKNHang: "",
                TNHang: "",
                Fax: "",
                Website: "",
                TTKhac: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                MKHang: "",
                SDThoai: "",
                DCTDTu: "",
                HVTNMHang: "",
                TNHang: "",
                TTKhac: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
                TTKhac: {
                  TTin: {
                    TTruong: "",
                    KDLieu: "",
                    DLieu: "",
                  },
                },
              },
            },
          },
          DSCKS: {},
        },
      };
      /*let invoices_sample=[
                            {master:{},detail:[{}]},
                            {master:{},detail:[{}]},
                            {master:{},detail:[{}]},
                        ];*/
      //console.log("invoices1:", invoices)
      if (invoices.length == undefined || invoices.length == 0) {
        return response.send(Utils.response(false, `Invalid json format.`, invoices));
      }
      const lastInvoiceNo = await DBService.callProcCursor(
        "ei_sel_last_invoice_no",
        [invoices[0].master.seller_taxcode, invoices[0].master.serial_no, invoices[0].master.form_no],
        "ENG",
        p_crt_by,
        "N"
      );
      let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
      const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
      const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
      if (isNaN(last_invoice_no)) {
        return response.send(
          Utils.response(false, `Failed to create invoice no. Please contact administrator for helping.`, null)
        );
      }
      for (let i = 0; i < invoices.length; i++) {
        //console.log("invoices:", invoices[i])

        if (invoices[i].master.form_no == 1) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng";
        } else if (invoices[i].master.form_no == 2) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng";
        } else if (invoices[i].master.form_no == 3) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công";
        } else if (invoices[i].master.form_no == 4) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia";
        } else if (invoices[i].master.form_no == 5) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng";
        } else if (invoices[i].master.form_no == 6) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý";
        }
        last_invoice_no++;
        objInvoice_M.HDon.DLHDon.TTChung.PBan = invoices[i].version;
        objInvoice_M.HDon.DLHDon.TTChung.KHMSHDon = invoices[i].master.form_no;
        objInvoice_M.HDon.DLHDon.TTChung.KHHDon = invoices[i].master.serial_no;
        objInvoice_M.HDon.DLHDon.TTChung.SHDon = last_invoice_no;
        objInvoice_M.HDon.DLHDon.TTChung.MHSo = "";
        if (invoices[i].master.invoice_date < last_invoice_date) {
          return response.send(
            Utils.response(
              false,
              `invoice date cannot smaller than ${last_invoice_date}.`,
              invoices[i].master.invoice_date
            )
          );
        }
        if (invoices[i].master.invoice_date > tomorrow_date) {
          return response.send(
            Utils.response(false, `invoice date cannot greater than ${tomorrow_date}.`, invoices[i].master.invoice_date)
          );
        }
        objInvoice_M.HDon.DLHDon.TTChung.NLap = invoices[i].master.invoice_date;
        objInvoice_M.HDon.DLHDon.TTChung.SBKe = "";
        objInvoice_M.HDon.DLHDon.TTChung.NBKe = "";
        objInvoice_M.HDon.DLHDon.TTChung.DVTTe = invoices[i].master.tr_ccy;
        objInvoice_M.HDon.DLHDon.TTChung.TGia = invoices[i].master.tr_rate;
        objInvoice_M.HDon.DLHDon.TTChung.HTTToan = invoices[i].master.payment_method;
        objInvoice_M.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode
        objInvoice_M.HDon.DLHDon.TTChung.MSTDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.TDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.DCDVNUNLHDon = "";
        objInvoice_M.HDon.DLHDon.TTChung.TTKhac = {};
        objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin = [];
        if (invoices[i].master.hasOwnProperty("customfield1")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "PortalLink",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield1,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield2")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "Fkey",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield2,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield3")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "PO",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield3,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield4")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield4",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield4,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield5")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield5",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield5,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield6")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield6",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield6,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield7")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield7",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield7,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield8")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield8",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield8,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield9")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield9",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield9,
          });
        }
        if (invoices[i].master.hasOwnProperty("customfield10")) {
          objInvoice_M.HDon.DLHDon.TTChung.TTKhac.TTin.push({
            TTruong: "customfield10",
            KDLieu: "string",
            DLieu: invoices[i].master.customfield10,
          });
        }

        objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan = [];
        if (invoices[i].master.feature !== "0") {
          objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan.push({
            TCHDon: invoices[i].master.feature,
            LHDCLQuan: invoices[i].master.invoice_type_relative,
            KHMSHDCLQuan: invoices[i].master.form_no_relative,
            KHHDCLQuan: invoices[i].master.serial_no_relative,
            SHDCLQuan: invoices[i].master.invoice_no_relative,
            NLHDCLQuan: invoices[i].master.invoice_date_relative,
            GChu: invoices[i].master.description,
          });
        }

        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(invoices[i].master.seller_company_name);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.MST = this.convertHtmlCode(invoices[i].master.seller_taxcode);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(invoices[i].master.seller_address);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.SDThoai = this.convertHtmlCode(invoices[i].master.seller_tel);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DCTDTu = this.convertHtmlCode(invoices[i].master.seller_email);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.STKNHang = this.convertHtmlCode(invoices[i].master.seller_bank_no);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.NNBSTKNHang = "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TNHang = this.convertHtmlCode(invoices[i].master.seller_bank_name);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Fax = this.convertHtmlCode(invoices[i].master.seller_fax);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Website = this.convertHtmlCode(invoices[i].master.seller_website);
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(invoices[i].master.buyer_name);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MST = this.convertHtmlCode(invoices[i].master.buyer_taxcode);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(invoices[i].master.buyer_address);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MKHang = this.convertHtmlCode(invoices[i].master.buyer_code);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.SDThoai = this.convertHtmlCode(invoices[i].master.buyer_phone);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DCTDTu = this.convertHtmlCode(invoices[i].master.buyer_email);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.HVTNMHang = "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.STKNHang = this.convertHtmlCode(invoices[i].master.buyer_bank_no);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TNHang = this.convertHtmlCode(invoices[i].master.buyer_bank_name);
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = [];
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TSuat = this.convertHtmlCode(
          invoices[i].master.vat_rate
        );
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.ThTien = invoices[i].master.amt_exclude_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TThue = invoices[i].master.amt_vat;

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoices[i].master.amt_exclude_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTThue = invoices[i].master.amt_vat;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.DSLPhi.LPhi = "";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].master.comission_amt;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].master.total_payment;
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = this.convertHtmlCode(
          invoices[i].master.total_payment_word_vie
        );

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac = {};
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac.TTin = [];
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTKhac.TTin.push({
          TTruong: "Amount10",
          KDLieu: "decimal",
          DLieu: invoices[i].master.amt_exclude_vat,
        });
        objInvoice_M.HDon.DSCKS.NBan = "";
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoices[i].detail.length; j++) {
          objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoices[i].detail[j].item_type,
            STT: invoices[i].detail[j].seq_dis,
            MHHDVu: this.convertHtmlCode(invoices[i].detail[j].item_code),
            THHDVu: this.convertHtmlCode(invoices[i].detail[j].item_name),
            DVTinh: this.convertHtmlCode(invoices[i].detail[j].item_uom),
            SLuong: this.convertHtmlCode(invoices[i].detail[j].qty),
            DGia: this.convertHtmlCode(invoices[i].detail[j].unit_price),
            TLCKhau: this.convertHtmlCode(invoices[i].detail[j].commission_rate),
            STCKhau: this.convertHtmlCode(invoices[i].detail[j].commission_amt),
            ThTien: this.convertHtmlCode(invoices[i].detail[j].net_tr_amt),
            TSuat: this.convertHtmlCode(invoices[i].detail[j].vat_rate),
            TTKhac: {
              TTin: [
                {
                  TTruong: "VATAmount",
                  KDLieu: "decimal",
                  DLieu: invoices[i].detail[j].vat_tr_amt,
                },
                {
                  TTruong: "Amount",
                  KDLieu: "decimal",
                  DLieu: invoices[i].detail[j].net_tr_amt,
                },
              ],
            },
          });
        }

        const xml = convertXML.json2xml(objInvoice_M, {
          compact: true,
          ignoreComment: true,
          spaces: 4,
        });
        const xmlStr = xml.toString().replace("<DLHDon>", "<DLHDon Id='ID1'>").replace(/\n/g, "");
        //console.log("xmlStr", xmlStr)
        rtnXML.push({ master_pk: invoices[i].master.master_pk, invoice_no: last_invoice_no, xml: xmlStr });
      }

      return response.send(Utils.response(true, `Convert json to xml was successful.`, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendInvoiceToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API, { para: para }, config);
        console.log("sendInvoiceToTaxOfficeFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.....`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInvoiceStatusFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log("EINVOICE_URL_API_CHECKING ", EINVOICE_URL_API_CHECKING);
        const res = await Request.post(EINVOICE_URL_API_CHECKING, { para: para }, config);
        console.log("checkInvoiceStatusFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendInvoiceToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      //const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      //const url = "http://118.71.250.233/ftvan-hddt/hdon/cmahdon";
      const { proc, para } = request.all();

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      let rtnValue = [];
      for (let i = 0; i < para.length; i++) {
        const masterInvoicePK = await this.extractXMLContent(
          para[i].xml_signed,
          para[i].mail_to,
          para[i].mail_cc,
          para[i].invoice_type,
          para[i].tr_type,
          para[i].tax_serial_number,
          para[i].tac_crca_pk,
          para[i].invoice_form_symbol,
          p_language,
          p_crt_by
        );
        if (masterInvoicePK.PK == -1) {
          console.log(`The issuer invoice has not register [${para[i].tei_einvoice_m_pk}]`, para[i].xml_signed);
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            trade_code: "",
            errmsg: "The issuer invoice has not register",
          });
          continue;
        } else if (masterInvoicePK.PK == 0) {
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            trade_code: "",
            errmsg: "Duplicated data. This invoice already sent",
          });
          continue;
        } else if (masterInvoicePK.PK < -1) {
          console.log(`invalid xml format [${para[i].tei_einvoice_m_pk}]`, para[i].xml_signed);
          rtnValue.push({
            tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
            trade_code: "",
            errmsg: "Invalid xml format",
          });
          continue;
        }
        const trade_code = await Request.post(
          url,
          { base64XML: Buffer.from(para[i].xml_signed).toString("base64") },
          {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }
        );
        //console.log("masterInvoicePK  ", masterInvoicePK);

        if (trade_code && trade_code.data) {
          const para_value = {
            tei_einvoice_ar_pk: masterInvoicePK.PK,
            xml_sign: para[i].xml_signed,
            issuer: para[i].issuer,
            issueby: para[i].issue_by,
            issueto: para[i].issue_to,
            dn_name: para[i].dn_name,
            dn_mst: para[i].dn_mst,
            notafter: para[i].notafter,
            notbefore: para[i].notbefore,
            serialnumber: para[i].tax_serial_number,
            trade_code: trade_code.data.maGDich,
            cqt_code: "", //cqt_code
            tei_einvoice_m_pk: masterInvoicePK.TEI_EINVOICE_M_PK,
          };

          await DBService.ExecuteSQLBlob(
            `BEGIN ei_upd_file_xml_ar(
                                        :tei_einvoice_ar_pk,
                                        :xml_sign,
                                        :issuer,
                                        :issueby,
                                        :issueto,
                                        :dn_name,
                                        :dn_mst,
                                        :notafter,
                                        :notbefore,
                                        :serialnumber,
                                        :trade_code,
                                        :cqt_code,
                                        :tei_einvoice_m_pk, 
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                        END;`,
            para_value,
            p_language,
            p_crt_by
          );
          let base64PDf;
          try {
            let EiExcel = new EiExcelHandlerAuto();
            base64PDf = await EiExcel.getEinvoice(trade_code.data.maGDich, p_language, p_crt_by);
            console.log("base64PDf  ", base64PDf);
          } catch (e) {
            base64PDf = "";
          }

          const para_pdf = {
            tei_einvoice_m_pk: masterInvoicePK.TEI_EINVOICE_M_PK,
            // base64 : "data:application/pdf;base64," + base64PDf
            url_pdf: "",
          };
          await DBService.ExecuteSQLBlob(
            `BEGIN ei_upd_file_pdf_ar(
                                        :tei_einvoice_m_pk, 
                                        :url_pdf,
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                        END;`,
            para_pdf,
            p_language,
            p_crt_by
          );

          //console.log("rtnValue ", rtnValue);
          rtnValue.push({
            tac_crca_pk: para[i].tac_crca_pk,
            trade_code: trade_code.data.maGDich,
          });
        } else {
          return response.send(Utils.response(false, `Failed to call taxoffice api.`, null));
        }
      }
      return response.send(Utils.response(true, `invoices successful`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInvoiceStatusFromTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      //const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao";
      let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      const { proc, para } = request.all();
      let rtnValue = [];
      for (let i = 0; i < para.tei_einvoice_m_pk.length; i++) {
        let maCQT = "",
          maTBao = "",
          tenTBao = "";

        // @TODO: _______________________________________________________
        maTBao = "9999";
        tenTBao = "Invoices are processing.";
        // await DBService.ExecuteSQLBlob(
        //     `BEGIN ei_upd_file_xml_ar(:tei_einvoice_ar_pk,:xml_sign,:issuer,:issueby,:issueto,:dn_name,:dn_mst,
        //              :notafter,:notbefore,:serialnumber,:tradecode,:cqt_code,:p_language, :p_crt_by, :p_rtn_cur); END;`,
        //     para_value,
        //     p_language,
        //     p_crt_by
        //   );
        const result = await DBService.callProcCursor(
          "ei_upd_file_xml_v8",
          [para.tei_einvoice_m_pk[i], maTBao, tenTBao],
          p_language,
          p_crt_by
        );
        if (result[0].STATUS == "OK") {
          rtnValue.push({
            trade_code: para.trade_code[i],
            tax_confirmation_code: para.tei_einvoice_m_pk[i],
            inform_code: maTBao,
            inform_name: tenTBao,
            invoice_status: "1",
            sign_dt: "",
            cancel_dt: "",
            cancel_cause: "",
          });
        } else {
          return response.send(
            Utils.response(
              false,
              `Something went wrong, please try again later.
                        ei_upd_file_xml_v8`,
              rtnValue
            )
          );
        }
      }

      return response.send(
        Utils.response(true, `${para.trade_code.length} invoices was update status from tax office.`, rtnValue)
      );

      // @TODO: _______________________________________________________

      // const res = await Request.get(url + para[i], {
      //     agent,
      //     headers: {
      //         Authorization: "Basic " +
      //             Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
      //     },
      // });

      // //@!!!!!!!!!!!!!!!! loi : url + para[i]
      // console.log(
      //     "checkInvoiceStatusFromTaxOffice url + para[i] " + url + para[i]
      // );
      // console.log("checkInvoiceStatusFromTaxOffice res.length " + res.length); //res.length undefined
      // //res = [object Object] => co the res = {}
      // console.log("checkInvoiceStatusFromTaxOffice res " + res);

      // if (!res.length) {
      //     return response.send(Utils.response(false, `no data found.`));
      // }

      // for (let j = 0; j < res.length; j++) {
      //     //res.length undefined !!!!!!!!!!!!!!!!!
      //     const items = res[j];
      //     for (let k = 0; k < items.length; k++) {
      //         console.log("items[k].loaiTBao " + items[k].loaiTBao);
      //         if (items[k].loaiTBao == "10") {
      //             maCQT = items[k].ndungTBao.maCQT;
      //             const base64XML = Buffer.from(
      //                 items[k].ndungTBao.base64XML,
      //                 "base64"
      //             ).toString("utf8");
      //             const para_value = {
      //                 trade_code: para[i],
      //                 macqt: maCQT,
      //                 xml_sign: base64XML,
      //             };
      //             const result = await DBService.ExecuteSQLBlob(
      //                 `BEGIN ei_upd_file_xml_v5(:trade_code,:macqt,:xml_sign,:p_language, :p_crt_by, :p_rtn_cur); END;`,
      //                 para_value,
      //                 p_language,
      //                 p_crt_by
      //             );
      //         } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {
      //             maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
      //             tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
      //             const result = await DBService.callProcCursor(
      //                 "ei_upd_file_xml_v8", [para[i], maTBao, tenTBao],
      //                 p_language,
      //                 p_crt_by
      //             );
      //         } else if (items[k].loaiTBao == "15") {
      //             tenTBao = items[k].tenTBao;
      //             const result = await DBService.callProcCursor(
      //                 "ei_upd_file_xml_v9", [para[i], tenTBao],
      //                 p_language,
      //                 p_crt_by
      //             );
      //         }
      //     }
      // }
      // rtnValue.push({
      //     trade_code: para[i],
      //     tax_confirmation_code: maCQT,
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // rtnValue.push({
      //     trade_code: para.trade_code[i],
      //     tax_confirmation_code: para.tei_einvoice_m_pk[i],
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // }
      // return response.send(
      //     Utils.response(
      //         true,
      //         `${para.trade_code.length} invoices was update status from tax office.`,
      //         rtnValue
      //     )
      // );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async extractXMLContent_Dec(p_xml_content, p_language, p_crt_by) {
    try {
      const templateTTChung = [
        "TKhai/DLTKhai/TTChung",
        {
          PBan: "PBan",
          MSo: "MSo",
          Ten: "Ten",
          HThuc: "HThuc",
          TNNT: "TNNT",
          MST: "MST",
          CQTQLy: "CQTQLy",
          MCQTQLy: "MCQTQLy",
          NLHe: "NLHe",
          DCLHe: "DCLHe",
          DCTDTu: "DCTDTu",
          DTLHe: "DTLHe",
          MSTTCGP: "MSTTCGP",
          DDanh: "DDanh",
          NLap: "NLap",
        },
      ];

      const jsonTTChung = await transform(p_xml_content, templateTTChung);

      const arrTTChung = [
        jsonTTChung[0].PBan,
        jsonTTChung[0].MSo,
        jsonTTChung[0].Ten,
        jsonTTChung[0].HThuc,
        jsonTTChung[0].TNNT,
        jsonTTChung[0].MST,
        jsonTTChung[0].CQTQLy,
        jsonTTChung[0].MCQTQLy,
        jsonTTChung[0].NLHe,
        jsonTTChung[0].DCLHe,
        jsonTTChung[0].DCTDTu,
        jsonTTChung[0].DTLHe,
        jsonTTChung[0].DDanh,
        jsonTTChung[0].NLap,
      ];
      //TKhai.DLTKhai.NDTKhai.HTHDon.CMa
      const templateNDTKhai = [
        "TKhai/DLTKhai/NDTKhai/HTHDon",
        {
          CMa: "CMa",
          KCMa: "KCMa",
          CMTMTTien: "CMTMTTien",
        },
      ];
      const jsonNDTKhai = await transform(p_xml_content, templateNDTKhai);
      const arrNDTKhai = [jsonNDTKhai[0].CMa, jsonNDTKhai[0].KCMa];

      //TKhai.DLTKhai.NDTKhai.HTGDLHDDT
      const templateHTGDLHDDT = [
        "TKhai/DLTKhai/NDTKhai/HTGDLHDDT",
        {
          NNTDBKKhan: "NNTDBKKhan",
          NNTKTDNUBND: "NNTKTDNUBND",
          CDLTTDCQT: "CDLTTDCQT",
          CDLQTVAN: "CDLQTVAN",
        },
      ];
      const jsonHTGDLHDDT = await transform(p_xml_content, templateHTGDLHDDT);
      const arrHTGDLHDDT = [
        jsonHTGDLHDDT[0].NNTDBKKhan,
        jsonHTGDLHDDT[0].NNTKTDNUBND,
        jsonHTGDLHDDT[0].CDLTTDCQT,
        jsonHTGDLHDDT[0].CDLQTVAN,
      ];

      //TKhai.DLTKhai.NDTKhai.PThuc
      const templatePThuc = [
        "TKhai/DLTKhai/NDTKhai/PThuc",
        {
          CDDu: "CDDu",
          CBTHop: "CBTHop",
        },
      ];
      const jsonPThuc = await transform(p_xml_content, templatePThuc);
      const arrPThuc = [jsonPThuc[0].CDDu, jsonPThuc[0].CBTHop];

      //TKhai.DLTKhai.NDTKhai.LHDSDung
      const templateLHDSDung = [
        "TKhai/DLTKhai/NDTKhai/LHDSDung",
        {
          HDGTGT: "HDGTGT",
          HDBHang: "HDBHang",
          HDBTSCong: "HDBTSCong",
          HDBHDTQGia: "HDBHDTQGia",
          HDKhac: "HDKhac",
          CTu: "CTu",
        },
      ];
      const jsonLHDSDung = await transform(p_xml_content, templateLHDSDung);
      const arrLHDSDung = [
        jsonLHDSDung[0].HDGTGT,
        jsonLHDSDung[0].HDBHang,
        jsonLHDSDung[0].HDBTSCong,
        jsonLHDSDung[0].HDBHDTQGia,
        jsonLHDSDung[0].HDKhac,
        jsonLHDSDung[0].CTu,
      ];

      //TKhai.DLTKhai.NDTKhai.DSCTSSDung
      const templateCTS = [
        "TKhai/DLTKhai/NDTKhai/DSCTSSDung/CTS",
        {
          STT: "STT",
          TTChuc: "TTChuc",
          Seri: "Seri",
          TNgay: "TNgay",
          DNgay: "DNgay",
          HThuc: "HThuc",
        },
      ];
      const jsonCTS = await transform(p_xml_content, templateCTS);

      let masterPara = arrTTChung.concat(arrNDTKhai).concat(arrHTGDLHDDT).concat(arrPThuc).concat(arrLHDSDung);

      //console.log("masterPara  ",masterPara)
      const master = await DBService.callProcCursor("ei_upd_tei_declaration_cloud", masterPara, p_language, p_crt_by);
      //console.log("master", master);
      if (master && master[0].PK > 0) {
        //const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonCTS.length; i++) {
          const detailPara = [
            master[0].PK,
            jsonCTS[i].STT,
            jsonCTS[i].TTChuc,
            jsonCTS[i].Seri,
            jsonCTS[i].TNgay,
            jsonCTS[i].DNgay,
            jsonCTS[i].HThuc,
          ];
          const detail = await DBService.callProcCursor(
            "ei_upd_tei_declarationd_cloud",
            detailPara,
            p_language,
            p_crt_by
          );
          //console.log("detail", detail);
        }
        return master[0].PK;
      } else {
        return 0;
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent_Dec",
        CONTENT: e.message,
      });
      return -1;
    }
  }

  async weTaxExtractXMLContentDec(p_xml_content, p_language, p_crt_by) {
    try {
      const templateTTChung = [
        "TKhai/DLTKhai/TTChung",
        {
          PBan: "PBan",
          MSo: "MSo",
          Ten: "Ten",
          HThuc: "HThuc",
          TNNT: "TNNT",
          MST: "MST",
          CQTQLy: "CQTQLy",
          MCQTQLy: "MCQTQLy",
          NLHe: "NLHe",
          DCLHe: "DCLHe",
          DCTDTu: "DCTDTu",
          DTLHe: "DTLHe",
          MSTTCGP: "MSTTCGP",
          DDanh: "DDanh",
          NLap: "NLap",
        },
      ];
      //console.log("p_xml_content  ", p_xml_content);

      const jsonTTChung = await transform(p_xml_content, templateTTChung);
      //console.log("jsonTTChung  ", jsonTTChung);
      const arrTTChung = [
        jsonTTChung[0].PBan,
        jsonTTChung[0].MSo,
        jsonTTChung[0].Ten,
        jsonTTChung[0].HThuc,
        jsonTTChung[0].TNNT,
        jsonTTChung[0].MST,
        jsonTTChung[0].CQTQLy,
        jsonTTChung[0].MCQTQLy,
        jsonTTChung[0].NLHe,
        jsonTTChung[0].DCLHe,
        jsonTTChung[0].DCTDTu,
        jsonTTChung[0].DTLHe,
        jsonTTChung[0].DDanh,
        jsonTTChung[0].NLap,
      ];
      //TKhai.DLTKhai.NDTKhai.HTHDon.CMa
      const templateNDTKhai = [
        "TKhai/DLTKhai/NDTKhai/HTHDon",
        {
          CMa: "CMa",
          KCMa: "KCMa",
          CMTMTTien: "CMTMTTien",
        },
      ];
      const jsonNDTKhai = await transform(p_xml_content, templateNDTKhai);
      const arrNDTKhai = [jsonNDTKhai[0].CMa, jsonNDTKhai[0].KCMa, jsonNDTKhai[0].CMTMTTien];

      //TKhai.DLTKhai.NDTKhai.HTGDLHDDT
      const templateHTGDLHDDT = [
        "TKhai/DLTKhai/NDTKhai/HTGDLHDDT",
        {
          NNTDBKKhan: "NNTDBKKhan",
          NNTKTDNUBND: "NNTKTDNUBND",
          CDLTTDCQT: "CDLTTDCQT",
          CDLQTVAN: "CDLQTVAN",
        },
      ];
      const jsonHTGDLHDDT = await transform(p_xml_content, templateHTGDLHDDT);
      const arrHTGDLHDDT = [
        jsonHTGDLHDDT[0].NNTDBKKhan || '0',
        jsonHTGDLHDDT[0].NNTKTDNUBND || '0',
        jsonHTGDLHDDT[0].CDLTTDCQT || '0',
        jsonHTGDLHDDT[0].CDLQTVAN || '0',
      ];

      //TKhai.DLTKhai.NDTKhai.PThuc
      const templatePThuc = [
        "TKhai/DLTKhai/NDTKhai/PThuc",
        {
          CDDu: "CDDu",
          CBTHop: "CBTHop",
        },
      ];
      const jsonPThuc = await transform(p_xml_content, templatePThuc);
      const arrPThuc = [jsonPThuc[0].CDDu, jsonPThuc[0].CBTHop];

      //TKhai.DLTKhai.NDTKhai.LHDSDung
      const templateLHDSDung = [
        "TKhai/DLTKhai/NDTKhai/LHDSDung",
        {
          HDGTGT: "HDGTGT",
          HDBHang: "HDBHang",
          HDBTSCong: "HDBTSCong",
          HDBHDTQGia: "HDBHDTQGia",
          HDKhac: "HDKhac",
          CTu: "CTu",
        },
      ];
      const jsonLHDSDung = await transform(p_xml_content, templateLHDSDung);
      const arrLHDSDung = [
        jsonLHDSDung[0].HDGTGT,
        jsonLHDSDung[0].HDBHang,
        jsonLHDSDung[0].HDBTSCong,
        jsonLHDSDung[0].HDBHDTQGia,
        jsonLHDSDung[0].HDKhac,
        jsonLHDSDung[0].CTu,
      ];

      //TKhai.DLTKhai.NDTKhai.DSCTSSDung
      const templateCTS = [
        "TKhai/DLTKhai/NDTKhai/DSCTSSDung/CTS",
        {
          STT: "STT",
          TTChuc: "TTChuc",
          Seri: "Seri",
          TNgay: "TNgay",
          DNgay: "DNgay",
          HThuc: "HThuc",
        },
      ];
      const jsonCTS = await transform(p_xml_content, templateCTS);

      let masterPara = arrTTChung.concat(arrNDTKhai).concat(arrHTGDLHDDT).concat(arrPThuc).concat(arrLHDSDung);

      console.log("masterPara  ",masterPara)
      const master = await DBService.callProcCursor("WT_UPD_DECLARATION_M", masterPara, p_language, p_crt_by);
      console.log("master", master);
      if (master && master[0].PK > 0) {
        //const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonCTS.length; i++) {
          const detailPara = [
            master[0].PK,
            jsonCTS[i].STT,
            jsonCTS[i].TTChuc,
            jsonCTS[i].Seri,
            jsonCTS[i].TNgay,
            jsonCTS[i].DNgay,
            jsonCTS[i].HThuc,
          ];
          const detail = await DBService.callProcCursor(
            "WT_UPD_DECLARATION_D",
            detailPara,
            p_language,
            p_crt_by
          );
          //console.log("detail", detail);
        }
        return master[0].PK;
      } else {
        return 0;
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent_Dec",
        CONTENT: e.message,
      });
      console.log("e   ", e);
      return -2;
    }
  }

  async sendDeclarationToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let dataJson = [];
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/dkyhddt/dkysdung";
      const { proc, para } = request.all();

      console.log("para   ", para);

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      const trade_code = await Request.post(
        url,
        { base64XML: Buffer.from(para.xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      if (trade_code && trade_code.data) {
        const para_value = {
          tei_declaration_m_pk: para.erp_declaration_m_pk,
          xml_sign: para.xml_signed,
          trade_code: trade_code.data.maGDich,
        };
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN AC_UPD_DECLARATION_M_AR( :tei_declaration_m_pk, 
                                                    :trade_code,
                                                    :xml_sign,  
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );
      } else {
        return response.send(Utils.response(false, `Failed to call taxoffice api.`, null));
      }
      dataJson.push({
        erp_declaration_m_pk: para.erp_declaration_m_pk,
        xml_sign: para.xml_signed,
        trade_code: trade_code.data.maGDich,
      });
      return response.send(Utils.response(true, `Declaration was sent successfull.`, dataJson));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendDeclarationToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", { err_msg: e.message }));
    }
  }

  async weTaxSendCompanyInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      console.log("weTaxSendCompanyInfo user ==> ", p_crt_by); 
      const {
        seller_company_id = "",
        seller_company_nm,
        seller_company_fnm,
        seller_taxcode,
        representative = "",
        seller_address,
        seller_tel = "",
        seller_fax = "",
        seller_email = "",
        seller_bank_no = "",
        seller_bank_name = "",
        seller_bank_no2 = "",
        seller_bank_name2 = "",
        tax_office_name = "",
        tax_office_code = "",
        seller_website = "",
        tokens = [],
      } = request.all();

      if (!seller_company_nm) {
        return response.send(Utils.response(false, `Invalid: seller_company_nm`, null));
      }
      // if (!seller_company_fnm) {
      //   return response.send(Utils.response(false, `Invalid: seller_company_fnm`));
      // }
      if (!seller_taxcode) {
        return response.send(Utils.response(false, `Invalid: seller_taxcode`, null));
      }
      if (!seller_address) {
        return response.send(Utils.response(false, `Invalid: seller_address`, null));
      }

      const para_value = {
        seller_company_id,
        seller_company_nm,
        seller_company_fnm,
        seller_taxcode,
        representative,
        seller_address,
        seller_tel,
        seller_fax,
        seller_email,
        seller_bank_no,
        seller_bank_name,
        seller_bank_no2,
        seller_bank_name2,
        tax_office_name,
        tax_office_code,
        seller_website,
      };
      const res = await DBService.ExecuteSQLBlob(
        `BEGIN WETAX_PRO_COMPANY_INFO(
                    :seller_company_id,
                    :seller_company_nm, 
                    :seller_company_fnm, 
                    :seller_taxcode, 
                    :representative, 
                    :seller_address, 
                    :seller_tel,
                    :seller_fax,
                    :seller_email,
                    :seller_bank_no,
                    :seller_bank_name,
                    :seller_bank_no2,
                    :seller_bank_name2,
                    :tax_office_name,
                    :tax_office_code,
                    :seller_website
                    ,:p_language, :p_crt_by, :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );
      //console.log(res);
      let req_key = res.p_rtn_cur[0].TEI_COMPANY_PK;
      if (res.p_rtn_cur[0].STATUS_CD == "000" && tokens?.length) {
        for (let i = 0; i < tokens.length; i++) {
          //const caName = tokens[i].issuer.split('CN=');

          const para_token_list = {
            serial_number: tokens[i].serial_number,
            tax_institute: tokens[i].tax_institute,
            from_dt: tokens[i].from_dt,
            to_dt: tokens[i].to_dt,
            issuer: "",//tokens[i].issuer,
            issue_by: "",//tokens[i].issue_by,
            issue_to: "",//tokens[i].issue_to,
            ca_name: "",//tokens[i].ca_name ? tokens[i].ca_name : caName[1],
            dn_name: "",//tokens[i].dn_name,
            dn_mst: "",//tokens[i].dn_mst,
            raw_data: "",//tokens[i].raw_data,
            status: tokens[i].status,
            company_id: seller_taxcode,
            tei_company_pk : res.p_rtn_cur[0].TEI_COMPANY_PK,
          };
          const result = await DBService.ExecuteSQLBlob(
            `BEGIN WETAX_PRO_TOKEN_INFO(
                            :company_id,
                            :serial_number,
                            :tax_institute,
                            :from_dt,
                            :to_dt,
                            :issuer,
                            :issue_by,
                            :issue_to,
                            :ca_name,
                            :dn_name,
                            :dn_mst,
                            :raw_data,
                            :status,
                            :tei_company_pk,
                            :p_language, :p_crt_by, :p_rtn_cur); END;`,
            para_token_list,
            p_language,
            p_crt_by
          );
            
          //console.log("result  ", result);

        }
      }

      return response.send(
        Utils.response(true, res.p_rtn_cur[0].STATUS_NM, { company_id: res.p_rtn_cur[0].COMPANY_ID, seller_company_id : seller_company_id, req_key : req_key })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendCompanyInfor",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxSendDeclarationToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/dkyhddt/dkysdung";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const { xml_signed, tax_code, req_key } = request.all();


      console.log(" weTaxSendDeclarationToTaxOffice  xml_signed  ", xml_signed)
      console.log(" weTaxSendDeclarationToTaxOffice tax_code  ", tax_code)
      console.log(" weTaxSendDeclarationToTaxOffice req_key  ", req_key)

      const valid = this.validateDeclareXML(this.parseXmlToJson(xml_signed));
      if (!valid.status) {
        return response.send(Utils.response(valid.status, valid.message, null));
      }
      console.log(" weTaxSendDeclarationToTaxOffice req_key  ssss")

      const matesDecPK = await this.weTaxExtractXMLContentDec(xml_signed, p_crt_by, p_language);
      console.log("matesDecPK  ", matesDecPK);
      if(matesDecPK == 0 )
      {
        return response.send(
          Utils.response(false, `Declaration have not details`, {
            req_key: "",
            xml_signed: "",
            trade_code: "",
            tax_code: tax_code,
          })
        );
      }else if (matesDecPK == -1 )
      {
        return response.send(
          Utils.response(false, `Taxcode company not yet register! `, {
            req_key: "",
            xml_signed: "",
            trade_code: "",
            tax_code: tax_code,
          })
        );
      } else if (matesDecPK == -2 )
      {
        return response.send(
          Utils.response(false, `The file xml is wrong! `, {
            req_key: "",
            xml_signed: "",
            trade_code: "",
            tax_code: tax_code,
          })
        );
      }
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };


      const tradeCode = await Request.post(
        url,
        { base64XML: Buffer.from(xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      Utils._sleep(5);


      if (tradeCode.data.maGDich.length > 0) {

        // const res_tradeCode = await Request.get(urlCheck + tradeCode.data.maGDich, {
        //   agent,
        //   headers: {
        //     Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
        //   },
        // });

        // let tenTBao = "",
        //   status = "",
        //   base64XML = "";


        // if (!res_tradeCode.data) {
        //   return response.send(Utils.response(false, `no data found.`));
        // }
        // for (let item of res.data) {
        //   for (let child of item) {
        //     if (child.loaiTBao == "1") {
        //       base64XML = Buffer.from(child.ndungTBao.base64XML, "base64").toString("utf8");
        //     } else if (child.loaiTBao == "3") {
        //       status = "0";
        //     } else {
        //       status = "1";
        //     }
        //     tenTBao = child.tenTBao;

        //     para_value = {
        //       p_tei_einvoice_issuse_cqt_pk: para.p_tei_einvoice_issuse_cqt_pk,
        //       xml_sign: base64XML,
        //       p_messCQT: tenTBao,
        //       p_status: status,
        //     };
        //     await DBService.ExecuteSQLBlob(
        //       `BEGIN ei_upd_file_xml_v6(
        //                         :p_tei_einvoice_issuse_cqt_pk, :xml_sign, :p_messCQT, :p_status,
        //                         :p_language, :p_crt_by, :p_rtn_cur
        //                     ); END;`,
        //       para_value,
        //       p_language,
        //       p_crt_by
        //     );
        //   }
        // }



        const para_value = {
          req_key: matesDecPK,
          xml_sign: xml_signed,
          trade_code: tradeCode.data.maGDich,
          tax_code: tax_code,
        };

        // console.log(para_value);
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN WT_UPD_DECLARATION_STATUS( :req_key, 
                                            :xml_sign, 
                                            :trade_code, 
                                            :tax_code,
                                            :p_language, 
                                            :p_crt_by, 
                                            :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("res  ", res);

      } else {
        return response.send(Utils.response(false, `Failed to call tax office api.`, tradeCode));
      }

      return response.send(
        Utils.response(true, `Declaration was sent successfully.`, {
          req_key: req_key,
          xml_signed: xml_signed,
          trade_code: tradeCode.data.maGDich,
          tax_code: tax_code,
        })
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendDeclarationToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async sendDeclarationToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log("EINVOICE_URL_API_DECLARATION_SEND" + EINVOICE_URL_API_DECLARATION_SEND);
        const res = await Request.post(EINVOICE_URL_API_DECLARATION_SEND, { para: para }, config);
        console.log("sendDeclarationToTaxOfficeFromClient res.data" + res.data);
        return response.send(Utils.response(true, `Success.`, res.data));
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send declaration.`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingdeclarationfromclient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false,  e.message, null));
    }
  }

  // đã test ok theo dữ liệu thât
  async checkingDeclarations({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      // const authPassword = "genuwin123"; // "e_GX4v@";

      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const { para } = request.all();
      // console.log("para +++===> ", para);
      // @TODO: _______________________________________________________

      /*const para_value = {
                      p_tei_einvoice_issuse_cqt_pk: para.p_tei_einvoice_issuse_cqt_pk,
                      xml_sign: "xml_sign test.",
                      p_messCQT: "mess cqt test.",
                      p_status: "2",
                  };
                  const res = await DBService.ExecuteSQLBlob(
                      `BEGIN ei_upd_file_xml_v6(
                                :p_tei_einvoice_issuse_cqt_pk, :xml_sign, :p_messCQT, :p_status,
                                :p_language, :p_crt_by, :p_rtn_cur
                            ); END;`,
                      para_value,
                      p_language,
                      p_crt_by
                  );
                  // console.log("checkingdeclaration res " + JSON.stringify(res));
                  if (res.p_rtn_cur[0].STATUS == "OK") {
                      return response.send(
                          Utils.response(
                              true,
                              `Get declaration status from tax office successful.`,
                              para_value
                          )
                      );
                  } else {
                      return response.send(
                          Utils.response(
                              false,
                              `Something went wrong, please try again later.
                  ei_upd_file_xml_v6`,
                              para_value
                          )
                      );
                  }*/

      // @TODO: _______________________________________________________

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      let para_value;
      for (let parent of para.trade_code) {
        console.log("checkingDeclarations parent " + JSON.stringify(parent));
        // den day
        const res = await Request.get(url + parent, {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        });
        // dung o day: "Request failed with status code 401"

        let tenTBao = "",
          status = "",
          base64XML = "";

        // console.log(`checkingDeclarations url + parent `, url + parent);
        // console.log(`checkingDeclarations res `, res);
        // console.log(`checkingDeclarations res.data `, res.data);

        if (!res.data) {
          return response.send(Utils.response(false, `no data found.`, null));
        }
        for (let item of res.data) {
          for (let child of item) {
            if (child.loaiTBao == "1") {
              base64XML = Buffer.from(child.ndungTBao.base64XML, "base64").toString("utf8");
            } else if (child.loaiTBao == "3") {
              status = "0";
            } else {
              status = "1";
            }
            tenTBao = child.tenTBao;

            para_value = {
              p_tei_einvoice_issuse_cqt_pk: para.p_tei_einvoice_issuse_cqt_pk,
              xml_sign: base64XML,
              p_messCQT: tenTBao,
              p_status: status,
            };
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_file_xml_v6(
                                :p_tei_einvoice_issuse_cqt_pk, :xml_sign, :p_messCQT, :p_status,
                                :p_language, :p_crt_by, :p_rtn_cur
                            ); END;`,
              para_value,
              p_language,
              p_crt_by
            );
          }
        }
      }
      return response.send(Utils.response(true, `checking_declare_success`, para_value));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingDeclarations",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

   makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result.toLocaleUpperCase();
  }

  async weTaxCheckingDeclarations({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { trade_code, tax_code, req_key } = request.all();
      let cr_pos_key = await this.makeid(5);

      let para_value_r = {
        req_key: req_key,
        trade_code: trade_code,
        content: "",
        inform_desc: "Thông báo về việc chấp nhận đăng ký/thay đổi thông tin",
        inform_code: "5",
        pos_key: cr_pos_key,
      };

      const re_data = await DBService.ExecuteSQLBlob(
        `BEGIN ei_upd_file_xml_v6_test(
                                :req_key, 
                                :trade_code,
                                :content, 
                                :inform_desc, 
                                :inform_code,
                                :pos_key,
                                :p_language, 
                                :p_crt_by, 
                                :p_rtn_cur); END;`,
                                para_value_r,
        p_language,
        p_crt_by
      );
        console.log("re_data  ", re_data);
        cr_pos_key = re_data.p_rtn_cur[0].POS_KEY;
      //// === tam thoi dong de tao pos key
      return response.send(
        Utils.response(true, `checking_declare_success`, {
          tax_code: tax_code,
          req_key: req_key,
          inform_desc: "Thông báo về việc chấp nhận đăng ký/thay đổi thông tin",
          inform_code: "5",
          content: {
                      soTBao: "177998/TB-CTHN-KDT",
                      mauTBao: "01/TB-ĐKĐT",
                      tenTBao: "Thông báo về việc chấp nhận thay đổi thông tin sử dụng hóa đơn điện tử",
                      ngayTBao: "2023-08-10T08:08:44",
                      ngayCQTKy: "2023-08-10T08:09:34",
                      tthaiXNhanCQT: 1
                  },
          pos_key: cr_pos_key,
        })
      );

      //// === tam thoi dong de tao pos key

      let para_value;
      let pos_key = "";
      const res = await this.checkingTaxStatus(TAX_CHECK_TRADE_CODE, trade_code, TAX_USER_NAME, TAX_PASSWORD);

      let contentNotice;
      let XML = "";
      let taxCode;
      let tenTBao;
      let loaiTBao;
      if (!res.data.length) {
        return response.send(Utils.response(false, 'Checking Tax Status Failure. No data found.', null));
      }

      const lastNotice = res.data[res.data.length - 1];

      tenTBao = lastNotice[1].tenTBao;
      loaiTBao = lastNotice[1].loaiTBao;

      for (let i = 0; i < lastNotice.length; i++) {
        if (lastNotice[i].loaiTBao == "1") {
          taxCode = lastNotice[i].mst;
          XML = Buffer.from(lastNotice[i].ndungTBao.base64XML, "base64").toString("utf8");
          let re_cqt = await this.weTaxExtractXMLContentGetDataDec(XML);
          if (re_cqt != -1) {
            pos_key = re_cqt;
          }
        } else if (lastNotice[i].loaiTBao == "3" || lastNotice[i].loaiTBao == "4") {
          contentNotice = lastNotice[i].ndungTBao.tbaoTNhanDTu;
        } else if (lastNotice[i].loaiTBao == "5") {
          contentNotice = lastNotice[i].ndungTBao.tbaoDKyDTu;
        }
      }

      para_value = {
        req_key: req_key,
        content: contentNotice.toString(),
        inform_desc: tenTBao,
        inform_code: loaiTBao,
        pos_key: pos_key,
      };
      await DBService.ExecuteSQLBlob(
        `BEGIN ei_upd_file_xml_v6(
                                :req_key, 
                                :content, 
                                :inform_desc, 
                                :inform_code,
                                :pos_key,
                                :p_language, 
                                :p_crt_by, 
                                :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );
      return response.send(
        Utils.response(true, `checking_declare_success`, {
          tax_code: taxCode,
          req_key: req_key,
          inform_desc: tenTBao,
          inform_code: loaiTBao,
          content: contentNotice,
          pos_key: pos_key,
        })
      );


    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxCheckingDeclarations",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message,null));
    }
  }

  async checkingTaxStatus(url, trade_code, authUserName, authPassword) {
    const agent = {
      Agent: {
        defaultPort: 443,
        protocol: "https:",
        options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
      },
    };
    const res = await Request.get(url + trade_code, {
      agent,
      headers: {
        Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
      },
    });
    return res;
  }

  _handleDataCheckingTaxStatus(res) {
    const realNotice = res[res.length - 1][res[res.length - 1].length - 1];

    return realNotice;
  }

  async checkingDeclarationsFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API_DECLARATION_CHECK, { para: para }, config);
        console.log("checkingDeclarationsFromClient", res.data);
        return response.send(Utils.response(true, `Send invoices successfuly.`, res.data));
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingDeclarationsFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async sendInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      const { proc, para } = request.all();
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      const trade_code = await Request.post(
        url,
        { base64XML: Buffer.from(para.xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      if (trade_code && trade_code.data) {
        const para_value = {
          req_key: para.req_key,    //erp_einvoice_ss_m_pk
          trade_code: trade_code.data.maGDich,
          xml_sign: para.xml_signed,
        };
        const res = await DBService.ExecuteSQLBlob(
          `BEGIN EI_UP_6095280_TRADE_CODE(      :req_key,
                                                :trade_code, 
                                                :xml_sign,
                                                :p_language, 
                                                :p_crt_by, 
                                                :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        if (res.p_rtn_cur[0].STATUS == "OK") {
          return Utils.response(true, `Call tax office api success.`, {
            erp_einvoice_ss_m_pk: para.erp_einvoice_ss_m_pk,
            trade_code: trade_code.data.maGDich,
          });
        } else {
          return response.send(
            Utils.response(
              false,
              `Something went wrong, please try again later.
                  EI_UP_6095280_TRADE_CODE`,
              para_value
            )
          );
        }
      } else {
        return response.send(Utils.response(false, `Failed to call taxoffice api.`, null));
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxSendInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
      const { xml_signed, req_key } = request.all();
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      // console.log("weTaxSendInformAdjustToTaxOffice");

      const trade_code = await Request.post(
        url,
        { base64XML: Buffer.from(xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );
      // console.log("trade_code ", trade_code);
      if (trade_code && trade_code.data) {
        return Utils.response(true, `Call tax office api success.`, {
          req_key: req_key,
          trade_code: trade_code.data.maGDich,
        });
        // const para_value = {
        //     req_key: req_key,
        //     trade_code: trade_code.data.maGDich,
        //     xml_sign: xml_signed,
        // };
        // const res = await DBService.ExecuteSQLBlob(
        //     `BEGIN EI_UP_6095280_DATA_TRADE_CODE(:req_key,:trade_code, :xml_sign,
        //             :p_language, :p_crt_by, :p_rtn_cur); END;`,
        //     para_value,
        //     p_language,
        //     p_crt_by
        // );

        // if (res.p_rtn_cur[0].STATUS == "OK") {
        //     return Utils.response(true, `Call tax office api success.`, {
        //         req_key: req_key,
        //         trade_code: trade_code.data.maGDich,
        //     });
        // } else {
        //     return response.send(
        //         Utils.response(
        //             false,
        //             `Something went wrong, please try again later.
        //   EI_UP_6095280_DATA_TRADE_CODE`,
        //             para_value
        //         )
        //     );
        // }
      } else {
        return response.send(Utils.response(false, 'No data found!', null));
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async sendInformAdjustToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API_INFORMADJUST_SEND, { para: para }, config);
        console.log("sendInformAdjustToTaxOfficeFromClient " + res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInformAdjustToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async weTaxCheckInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      //console.log("ss",EINVOICE_URL_API)
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      const authUserName = "GENUWIN";
      const authPassword = "e_GX4v@";
      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // const authUserName = "GENUWIN"; // "GENUWIN";
      // const authPassword = "genuwin123"; // "e_GX4v@";
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const { trade_code, tax_code, req_key } = request.all();

      let rtnValue = [];

      const result = await Request.get(url + trade_code, {
        agent,
        headers: {
          Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
        },
      });
      // console.log("result", JSON.stringify(result.data));

      if (!result.data.length) {
        return response.send(Utils.response(false, 'Checking Tax Status Failure. No data found.',null));
      }
      let tenTBao = "",
        maTBao = "";
      let ndungTBao = "";
      for (let j = 0; j < result.data.length; j++) {
        const items = result.data[j];
        for (let k = 0; k < items.length; k++) {
          if (items[k].loaiTBao == "0") {
            tenTBao = items[k].tenTBao;
            maTBao = items[k].loaiTBao;
          } else if (items[k].loaiTBao == "17") {
            tenTBao = items[k].tenTBao;
            maTBao = items[k].loaiTBao;
            ndungTBao = items[k].ndungTBao;
          } else if (items[k].loaiTBao == "15") {
            tenTBao = items[k].tenTBao;
            maTBao = items[k].loaiTBao;
            ndungTBao = items[k].ndungTBao;
          } else {
            maTBao = items[k].loaiTBao;
            tenTBao = items[k].tenTBao || items[k].message;
          }
        }
      }
      rtnValue.push({
        trade_code: trade_code,
        inform_code: maTBao,
        inform_desc: tenTBao,
        tax_code: tax_code,
        req_key: req_key,
        result_content: ndungTBao,
      });

      return response.send(Utils.response(true, `checking_success`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxCheckInformAdjustToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async checkInformAdjustToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      //console.log("ss",EINVOICE_URL_API)
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      // const authUserName = "GENUWIN"; // "GENUWIN";
      // const authPassword = "genuwin123"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@";// "genuwin123";// "e_GX4v@";
      const { proc, para } = request.all();

      console.log("para", para);
      //@TODO: remove return
      //return response.send(Utils.response(true, `checking_declare_success`, para));
      //console.log(para.trade_code.length)

      let rtnValue = [];
      //for (let i = 0; i < para.length; i++) {
      for (let i = 0; i < para.trade_code.length; i++) {
        //console.log("para_value[i].trade_code ", para.trade_code[i]);
        const result = await Request.get(url + para.trade_code[i], {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        });
        //console.log("result", JSON.stringify(result.data));

        if (!result.data.length) {
          return response.send(Utils.response(false, `no data found.`));
        }
        let tenTBao = "",
          maTBao = "",
          base64XML = "",
          cqt_result = "",
          cqt_status = "",
          mccqt = "";
        for (let j = 0; j < result.data.length; j++) {
          //res.length undefined !!!!!!!!!!!!!!!!!
          const items = result.data[j];
          //console.log("items", items);
          for (let k = 0; k < items.length; k++) {
            console.log("items[k].loaiTBao " + items[k].loaiTBao);
            if (items[k].loaiTBao == "0") {
              tenTBao = items[k].tenTBao;
              maTBao = items[k].loaiTBao;
            } else if (items[k].loaiTBao == "1") {
              base64XML = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");

            } else if (items[k].loaiTBao == "17" || items[k].loaiTBao == "15") {
              tenTBao = items[k].tenTBao;
              maTBao = items[k].loaiTBao;
              for (const invoice of items[k].ndungTBao.tbaoTNhanSSotDoc.dsachHDonLoi) {

                if (invoice.dsachLoi.length == 0) {
                  cqt_result = "Thành công";
                  cqt_status = invoice.tthaiTNCQT;
                } else {
                  for (const error of invoice.dsachLoi) {
                    cqt_result += error.MaLoi + " - " + error.MTaLoi;
                    cqt_status = invoice.tthaiTNCQT;
                  }
                }
                let para_value_d = {
                  p_req_key: para.req_key,
                  p_mccqt: invoice.MCCQT,
                  p_form_no: invoice.khieuMauHDon,
                  p_serial_no: invoice.khieuHDon,
                  p_invoice_no: invoice.soHDon,
                  p_cqt_result: cqt_result,
                  p_cqt_status: cqt_status,
                };
                await DBService.ExecuteSQLBlob(
                  `BEGIN ei_upd_hd04ss_d(
                                    :p_req_key, 
                                    :p_mccqt, 
                                    :p_form_no, 
                                    :p_serial_no,
                                    :p_invoice_no,
                                    :p_cqt_result,
                                    :p_cqt_status,
                                    :p_language, 
                                    :p_crt_by, 
                                    :p_rtn_cur
                                ); END;`,
                  para_value_d,
                  p_language,
                  p_crt_by
                );
              }

              let para_value_m = {
                p_req_key: para.req_key,
                p_xml_sign: base64XML,
                p_messCQT: tenTBao,
                p_status: "1",
              };
              await DBService.ExecuteSQLBlob(
                `BEGIN ei_upd_hd04ss_m(
                                  :p_req_key, 
                                  :p_xml_sign, 
                                  :p_messCQT, 
                                  :p_status,
                                  :p_language, 
                                  :p_crt_by, 
                                  :p_rtn_cur
                              ); END;`,
                para_value_m,
                p_language,
                p_crt_by
              );


              let para_value_mail = {
                p_tei_einvoice_m_pk: para.req_key, //"4090",// 
                p_tco_company_pk: para.tei_company_pk,
              };
              let data_mail = await DBService.ExecuteSQLBlob(
                `BEGIN ei_sel_data_send_mail(
                                  :p_tei_einvoice_m_pk, 
                                  :p_tco_company_pk, 
                                  :p_language, 
                                  :p_crt_by, 
                                  :p_rtn_cur
                              ); END;`,
                para_value_mail,
                p_language,
                p_crt_by
              );
              console.log(data_mail);

              if (data_mail.p_rtn_cur.length > 0) {
                for (const mail of data_mail.p_rtn_cur) {
                  let invoice_data = {
                    subject: mail.SUBJECT,
                    body: mail.BODY_1_MAIL,
                    buyer_email: mail.EMAIL_ADDRESS,
                    buyer_email_cc: mail.EMAIL_ADDRESS_CC,
                    pk: mail.PK,
                    filename1: mail.FILENAME1,
                    filename2: mail.FILENAME2,
                  }

                  const { res_send_mail } = await this.sendMailToCustomerWhenCancelEinvoice(
                    invoice_data,
                    p_language,
                    p_crt_by
                  );
                }
              }
            }
          }
        }
        rtnValue.push({
          trade_code: para.trade_code[i],
          inform_code: maTBao,
          inform_desc: tenTBao,
        });
      }

      return response.send(Utils.response(true, `checking_invalid_invoices_was_success`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInformAdjustToTaxOffice",
        CONTENT: e.message,
      });
      console.log(e)
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInformAdjustToTaxOfficeFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await Request.post(EINVOICE_URL_API_INFORMADJUST_CHECK, { para: para }, config);
        console.log("checkInformAdjustToTaxOfficeFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.`, null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInformAdjustToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendPITToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      let rtnValue = [];
      let res_data = [];
      // checking ...
      for (let i = 0; i < para.length; i++) {
        const para_value = {
          master_pk: para[i].master_pk,
          form_no: para[i].form_no,
          serial_no: para[i].serial_no,
          invoice_date: para[i].invoice_date,
          company_name: para[i].company_name,
          company_taxcode: para[i].company_taxcode,
          company_address: para[i].company_address,
          payer_name: para[i].payer_name,
          payer_address: para[i].payer_address,
          payer_taxcode: para[i].payer_taxcode,
          payer_nation: para[i].payer_nation,
          payer_resident: para[i].payer_resident,
          id_passport_number: para[i].id_passport_number,
          place_of_issue: para[i].place_of_issue,
          date_of_issue: para[i].date_of_issue,
          income_amt: para[i].income_amt,
          income_time: para[i].income_time,
          income_amt_total: para[i].income_amt_total,
          income_amt_total_defuct: para[i].income_amt_total_defuct,
          income_amt_recv: para[i].income_amt_recv,
          income_type: para[i].income_type,
          income_time_yyyy: para[i].income_time_yyyy,
        };
        rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_file_pit_ar(  :master_pk,
                                                :form_no,
                                                :serial_no,
                                                :invoice_date,
                                                :company_name,
                                                :company_taxcode,
                                                :company_address,
                                                :payer_name,
                                                :payer_address,
                                                :payer_taxcode,
                                                :payer_nation,
                                                :payer_resident,
                                                :id_passport_number,
                                                :place_of_issue,
                                                :date_of_issue,
                                                :income_amt,
                                                :income_time,
                                                :income_amt_total,
                                                :income_amt_total_defuct,
                                                :income_amt_recv,
                                                :income_type,
                                                :income_time_yyyy,
                                                :p_language, 
                                                :p_crt_by, 
                                                :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        res_data.push(rtnValue.p_rtn_cur[0]);
      }

      return response.send(Utils.response(true, `${para.length} invoices were sent successful.`, res_data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendPOSToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      let rtnValue = [];
      let res_data = [];
      // checking ...
      for (let i = 0; i < para.length; i++) {
        // console.log("para  ", para[i]);

        const para_value = {
          master_pk: para[i].master_pk,
          form_no: para[i].form_no,
          serial_no: para[i].serial_no,
          invoice_date: para[i].invoice_date,
          currency: para[i].currency,
          exchange_rate: para[i].exchange_rate,
          payment_methods: para[i].payment_methods,
          seller_name: para[i].seller_name,
          seller_taxcode: para[i].seller_taxcode,
          seller_address: para[i].seller_address,
          seller_phone: para[i].seller_phone,
          seller_mail: para[i].seller_mail,
          seller_account: para[i].seller_account,
          seller_bank: para[i].seller_bank,
          seller_fax: para[i].seller_fax,
          seller_website: para[i].seller_website,
          buyer_name: para[i].buyer_name,
          buyer_taxcode: para[i].buyer_taxcode,
          buyer_address: para[i].buyer_address,
          buyer_code: para[i].buyer_code,
          buyer_phone: para[i].buyer_phone,
          buyer_mail: para[i].buyer_mail,
          buyer_for_name: para[i].buyer_for_name,
          buyer_account: para[i].buyer_account,
          buyer_of_name: para[i].buyer_of_name,
          vat_rate: para[i].vat_rate,
          net_amount: para[i].net_amount,
          vat_amount: para[i].vat_amount,
          total_net_amount: para[i].total_net_amount,
          total_vat_amount: para[i].total_vat_amount,
          free_name: para[i].free_name,
          free_amount: para[i].free_amount,
          total_free_amount: para[i].total_free_amount,
          total_amount_number: para[i].total_amount_number,
          total_amount_words: para[i].total_amount_words,
          create_by: para[i].create_by,
          create_date: para[i].create_date,
        };

        rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_file_pit_ar ( :master_pk,
                                                        :form_no,
                                                        :serial_no,
                                                        :invoice_date,
                                                        :company_name,
                                                        :company_taxcode,
                                                        :company_address,
                                                        :payer_name,
                                                        :payer_address,
                                                        :payer_taxcode,
                                                        :payer_nation,
                                                        :payer_resident,
                                                        :id_passport_number,
                                                        :place_of_issue,
                                                        :date_of_issue,
                                                        :income_amt,
                                                        :income_time,
                                                        :income_amt_total,
                                                        :income_amt_total_defuct,
                                                        :income_amt_recv,
                                                        :income_type,
                                                        :income_time_yyyy,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        for (let j = 0; j < para[i].details.length; j++) {
          console.log(" para details  ", para[i].details[j]);
        }
      }

      return response.send(Utils.response(true, `${para.length} invoices were sent successful.`, res_data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendPOSListToListTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      // let rtnValue = [];
      let res_data = [];
      let res_data_taxcode = [];
      // checking ...
      for (let i = 0; i < para.length; i++) {
        // console.log("para  ", para[i]);
        const para_value = {
          master_pk: para[i].master_pk,
          seller_name: para[i].seller_name,
          seller_taxcode: para[i].seller_taxcode,
          seller_address: para[i].seller_address,
          seller_phone: para[i].seller_phone,
          seller_mail: para[i].seller_mail,
          seller_account: para[i].seller_account,
          seller_bank: para[i].seller_bank,
          seller_fax: para[i].seller_fax,
          seller_website: para[i].seller_website,
          buyer_name: para[i].buyer_name,
          buyer_taxcode: para[i].buyer_taxcode,
          buyer_cccdan: para[i].buyer_cccdan,
          buyer_address: para[i].buyer_address,
          buyer_code: para[i].buyer_code,
          buyer_phone: para[i].buyer_phone,
          buyer_mail: para[i].buyer_mail,
          date_of_sales: para[i].date_of_sales,
          store_code: para[i].store_code,
          store_name: para[i].store_name,
          pos: para[i].pos,
          receipt_number: para[i].receipt_number,
          sales_category: para[i].sales_category,
          payment_type: para[i].payment_type,
          total_amount: para[i].total_amount,
          actual_sales: para[i].actual_sales,
          general_discount: para[i].general_discount,
          credit_card_discount: para[i].credit_card_discount,
          item_code: para[i].item_code,
          item_name: para[i].item_name,
          uom: para[i].uom,
          qty: para[i].qty,
          price: para[i].price,
        };

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_file_pos_ar_list(     :master_pk, 
                                                                :seller_name,      
                                                                :seller_taxcode,             
                                                                :seller_address,          
                                                                :seller_phone,           
                                                                :seller_mail,       
                                                                :seller_account,         
                                                                :seller_bank,       
                                                                :seller_fax,        
                                                                :seller_website,    
                                                                :buyer_name, 
                                                                :buyer_taxcode, 
                                                                :buyer_cccdan,    
                                                                :buyer_address,   
                                                                :buyer_code,  
                                                                :buyer_phone,      
                                                                :buyer_mail,   
                                                                :date_of_sales,     
                                                                :store_code,   
                                                                :store_name,     
                                                                :pos,    
                                                                :receipt_number,         
                                                                :sales_category,        
                                                                :payment_type,        
                                                                :total_amount,        
                                                                :actual_sales,          
                                                                :general_discount,          
                                                                :credit_card_discount,         
                                                                :item_code,         
                                                                :item_name,         
                                                                :uom,    
                                                                :qty,       
                                                                :price,
                                                                :p_language, 
                                                                :p_crt_by, 
                                                                :p_rtn_cur
                                                                ); END;`,
          para_value,
          p_language,
          p_crt_by
        );
        // console.log(rtnValue.p_rtn_cur[0]);
        res_data.push(rtnValue.p_rtn_cur[0]);
      }

      const para_value_taxcode = {
        master_pk: para[0].master_pk,
        seller_taxcode: para[0].seller_taxcode,
        store_code: para[0].store_code,
        pos: para[0].pos,
        receipt_number: para[0].receipt_number,
        date_of_sales: para[0].date_of_sales,
      };

      const rtnValue_re = await DBService.ExecuteSQLBlob(
        `BEGIN ei_upd_inf_tax(              :master_pk, 
                                                    :seller_taxcode,     
                                                    :store_code,      
                                                    :pos,    
                                                    :receipt_number,         
                                                    :date_of_sales,   
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur
                                                    ); END;`,
        para_value_taxcode,
        p_language,
        p_crt_by
      );

      res_data_taxcode.push(rtnValue_re.p_rtn_cur[0]);

      console.log("  rtnValue_re.p_rtn_cur[0] ", rtnValue_re.p_rtn_cur[0]);

      return response.send(
        Utils.response(true, `${res_data.length}` + `/` + `${para.length} rows were sent successful.`, res_data_taxcode)
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkingStatusEInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { para } = request.all();

      let rtnValue = [];

      const para_value = {
        p_tco_company_pk: para.tco_company_pk,
        p_tei_company_pk: para.tei_company_pk,
        p_dt_from: para.dt_from,
        p_dt_to: para.dt_to,
      };

      rtnValue = await DBService.ExecuteSQLBlob(
        `BEGIN ei_pro_getinfo_inv_erp_nodejs (  :p_tco_company_pk,
                                                        :p_tei_company_pk,
                                                        :p_dt_from,
                                                        :p_dt_to,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );

      return response.send(Utils.response(true, `Checking status einvoice successful.`, rtnValue.p_rtn_cur));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkingStatusEInvoice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async getTaxCode({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();
      let url_api = "https://api.vietqr.io/v2/business/" + para.mst;
      const res_get = await Request.get(url_api);
      let result_res = [];
      if (res_get.data.data == null) {
        result_res = res_get.data;
      } else {
        result_res = res_get.data.data;
      }

      return response.send(Utils.response(true, `getting taxcode successful.`, result_res));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDF({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      console.log("para ", para);

      let rtnValue = [];
      let res_data = [];

      // let  ExcelHandler = require("./ExcelHandler.js");
      //let EiExcel = new EiExcelHandlerAuto();
      //const pdfUrlExcel = await EiExcel.getEinvoice(para.trade_code, p_language, p_crt_by);
      //console.log("pdfUrlExcel" , pdfUrlExcel);

      let masterPara = { p_trade_code: para.trade_code };

      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const master = await DBService.callProcCursor("ei_sel_einvoice_get_pdf", [para.trade_code], p_language, p_crt_by);
      if (master) return response.send(Utils.response(true, `${master.length} invoices were sent successful.`, master));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log("EINVOICE_URL_API_VIEW_PDF ", EINVOICE_URL_API_VIEW_PDF);
        const res = await Request.post(EINVOICE_URL_API_VIEW_PDF, { para: para }, config);
        console.log("checkInvoiceStatusFromClient", res.data);
        return response.send(res.data);
      } else {
        console.error("Failed to get api token");
      }
      return response.send(Utils.response(false, `Failed to send invoices.`, null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOfficeFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async updateViewTemplateFromClient({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      const token = await this.callLogin(EINVOICE_URL_LOGIN, EINVOICE_USER, EINVOICE_PW);

      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // console.log("EINVOICE_URL_API_VIEW_PDF ", EINVOICE_URL_API_VIEW_PDF);
        const res = await Request.post(EINVOICE_URL_API_UPDATE_TEMPLATE, { para: para }, config);
        // console.log("checkInvoiceStatusFromClient", res.data);
        return response.send(res.data);
      }
      return response.send(Utils.response(false, `Failed to get api token.`, null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "updateViewTemplateFromClient",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async updateViewTemplate({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }

      const { proc, para } = request.all();

      // console.log("para ", para);
      let master;

      let rtnValue = [];
      let res_data = [];

      const para_issue = {
        p_tac_invoice_issuse: para.PK,
        p_invoice_type: para.INVOICE_TYPE,
        p_form_no: para.FORM_NO,
        p_invoice_symbol: para.INVOICE_SYMBOL,
        p_serial_no: para.SERIAL_NO,
        p_inv_qty: para.INV_QTY,
        p_from_no: para.FROM_NO,
        p_to_no: para.TO_NO,
        p_inv_qty: null,
        p_from_dt: para.FROM_DT,
        p_to_dt: para.TO_DT,
        p_status: para.STATUS,
        p_tco_busplace_pk: para.TCO_BUSPLACE_PK,
        p_remarks: para.REMARKS,
        p_use_yn: para.USE_YN == true ? "Y" : "N",
        p_tco_company_pk: para.TCO_COMPANY_PK,
        p_tei_company_pk: para.TEI_COMPANY_PK,
        p_invoice_kind: para.INVOICE_KIND,
        p_tac_template_pk: para.TAC_TEMPLATE_PK,
      };
      const res_issue = await DBService.ExecuteSQLBlob(
        `BEGIN ei_update_issuse(                :p_tac_invoice_issuse, 
                                                        :p_invoice_type, 
                                                        :p_form_no,
                                                        :p_invoice_symbol,
                                                        :p_serial_no, 
                                                        :p_inv_qty,
                                                        :p_from_no,
                                                        :p_to_no, 
                                                        :p_from_dt, 
                                                        :p_to_dt, 
                                                        :p_status, 
                                                        :p_tco_busplace_pk, 
                                                        :p_remarks,
                                                        :p_use_yn, 
                                                        :p_tco_company_pk,
                                                        :p_tei_company_pk, 
                                                        :p_invoice_kind,
                                                        :p_tac_template_pk,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
        para_issue,
        p_language,
        p_crt_by
      );

      // console.log("res_issue   ++==>", res_issue);
      if (res_issue.p_rtn_cur[0].PK > 0) {
        // console.log("para.Template   ++==>", para.Template);

        const para_template = {
          p_template_pk: para.Template[0][0].PK,
          p_template_cd: para.Template[0][0].TEMPLATE_CD,
          p_template_nm: para.Template[0][0].TEMPLATE_NM,
          p_template_lnm: para.Template[0][0].TEMPLATE_LNM,
          p_template_fnm: para.Template[0][0].TEMPLATE_FNM,
          p_form_no: para.Template[0][0].FORM_NO,
          p_remarks: para.Template[0][0].REMARKS,
          p_inv_content: para.Template[0][0].INV_CONTENT,
          p_use_yn: para.Template[0][0].USE_YN == true ? "Y" : "N",
          p_tco_company_pk: para.TEI_COMPANY_PK, //para.Template[0].TCO_COMPANY_PK,
          p_valid_date_from: para.Template[0][0].VALID_DATE_FROM,
          p_valid_date_to: para.Template[0][0].VALID_DATE_TO,
          p_report_id: para.Template[0][0].REPORT_ID,
          p_addr2: para.Template[0][0].ADDR2,
          p_addr1: para.Template[0][0].ADDR1,
          p_bank_account1: para.Template[0][0].BANK_ACCOUNT1,
          p_bank_account2: para.Template[0][0].BANK_ACCOUNT2,
          p_bank_nm1: para.Template[0][0].BANK_NM1,
          p_bank_nm2: para.Template[0][0].BANK_NM2,
          p_tel: para.Template[0][0].TEL,
          p_fax: para.Template[0].FAX,
          p_tax_code: para.Template[0][0].TAX_CODE,
          p_tac_einvoice_issuse_pk: res_issue.p_rtn_cur[0].PK, //para.Template[0].TAC_EINVOICE_ISSUSE_PK,
          p_invoice_type: para.Template[0][0].INVOICE_TYPE,
          p_convert_yn: para.Template[0][0].CONVERT_YN,
          p_report_id_type: para.Template[0][0].REPORT_ID_TYPE,
          p_swift_code: para.Template[0][0].SWIFT_CODE,
          p_company_nm: para.Template[0][0].COMPANY_NM,
          p_company_lnm: para.Template[0][0].COMPANY_LNM,
          p_website: para.Template[0][0].WEBSITE,
          p_tax_code_display: para.Template[0][0].TAX_CODE_DISPLAY,
          p_logo_img: para.Template[0][0].LOGO_IMG,
          p_logo_width: para.Template[0][0].LOGO_WIDTH,
          p_logo_height: para.Template[0][0].LOGO_HEIGHT,
          p_logo_paddingtop: para.Template[0][0].LOGO_PADDINGTOP,
          p_logo_paddingleft: para.Template[0][0].LOGO_PADDINGLEFT,
          p_cmtmttien: para.Template[0][0].CMTMTTIEN,
          p_pban: para.Template[0][0].PBAN,
          p_serial_no_2: para.Template[0][0].SERIAL_NO_2,
          p_url_file_excel: para.Template[0][0].URL_FILE_EXCEL,
          p_url_img_logo: para.Template[0][0].URL_IMG_LOGO,
          p_url_img_bg: para.Template[0][0].URL_IMG_BG,
          p_logo_start_row: para.Template[0][0].LOGO_START_ROW,
          p_logo_start_col: para.Template[0][0].LOGO_START_COL,
          p_bg_start_row: para.Template[0][0].BG_START_ROW,
          p_bg_width: para.Template[0][0].BG_WIDTH,
          p_bg_height: para.Template[0][0].BG_HEIGHT,
          p_sign_start_cell: para.Template[0][0].SIGN_START_CELL,
          p_sign_end_cell: para.Template[0][0].SIGN_END_CELL,
          p_sign_by_start_cell: para.Template[0][0].SIGN_BY_START_CELL,
          p_sign_by_end_cell: para.Template[0][0].SIGN_BY_END_CELL,
          p_bg_end_row: para.Template[0][0].BG_END_ROW,
          p_sign_cell_box: para.Template[0][0].SIGN_CELL_BOX,
          p_details_start_row: para.Template[0][0].DETAILS_START_ROW,
          p_att01: para.Template[0][0].ATT01,
          p_att02: para.Template[0][0].ATT02,
          p_att03: para.Template[0][0].ATT03,
          p_att04: para.Template[0][0].ATT04,
          p_att05: para.Template[0][0].ATT05,
          p_att06: para.Template[0][0].ATT06,
          p_att07: para.Template[0][0].ATT07,
          p_att08: para.Template[0][0].ATT08,
          p_att09: para.Template[0][0].ATT09,
          p_att10: para.Template[0][0].ATT10,
          p_att01_num: para.Template[0][0].ATT01_NUM,
          p_att02_num: para.Template[0][0].ATT02_NUM,
          p_att03_num: para.Template[0][0].ATT03_NUM,
          p_att04_num: para.Template[0][0].ATT04_NUM,
          p_att05_num: para.Template[0][0].ATT05_NUM,
          p_att06_num: para.Template[0][0].ATT06_NUM,
          p_att07_num: para.Template[0][0].ATT07_NUM,
          p_att08_num: para.Template[0][0].ATT08_NUM,
          p_att09_num: para.Template[0][0].ATT09_NUM,
          p_att10_num: para.Template[0][0].ATT10_NUM,
          p_range_details_sign: para.Template[0][0].RANGE_DETAILS_SIGN,
        };

        // console.log("para_template   ++==>", para_template);

        const res_template = await DBService.ExecuteSQLBlob(
          `BEGIN ei_update_template(              :p_template_pk, 
                                                            :p_template_cd, 
                                                            :p_template_nm, 
                                                            :p_template_lnm,
                                                            :p_template_fnm, 
                                                            :p_form_no, 
                                                            :p_remarks, 
                                                            :p_inv_content, 
                                                            :p_use_yn, 
                                                            :p_tco_company_pk, 
                                                            :p_valid_date_from, 
                                                            :p_valid_date_to, 
                                                            :p_report_id, 
                                                            :p_addr2,
                                                            :p_addr1,
                                                            :p_bank_account1,
                                                            :p_bank_account2,
                                                            :p_bank_nm1,
                                                            :p_bank_nm2,
                                                            :p_tel, 
                                                            :p_fax,
                                                            :p_tax_code, 
                                                            :p_tac_einvoice_issuse_pk,
                                                            :p_invoice_type, 
                                                            :p_convert_yn,
                                                            :p_report_id_type, 
                                                            :p_swift_code,
                                                            :p_company_nm, 
                                                            :p_company_lnm, 
                                                            :p_website, 
                                                            :p_tax_code_display, 
                                                            :p_logo_img,
                                                            :p_logo_width,
                                                            :p_logo_height,
                                                            :p_logo_paddingtop, 
                                                            :p_logo_paddingleft, 
                                                            :p_cmtmttien, 
                                                            :p_pban,
                                                            :p_serial_no_2,
                                                            :p_url_file_excel, 
                                                            :p_url_img_logo,
                                                            :p_url_img_bg, 
                                                            :p_logo_start_row, 
                                                            :p_logo_start_col, 
                                                            :p_bg_start_row, 
                                                            :p_bg_width, 
                                                            :p_bg_height,
                                                            :p_sign_start_cell,
                                                            :p_sign_end_cell, 
                                                            :p_sign_by_start_cell,
                                                            :p_sign_by_end_cell,
                                                            :p_bg_end_row, 
                                                            :p_sign_cell_box, 
                                                            :p_details_start_row, 
                                                            :p_att01,
                                                            :p_att02, 
                                                            :p_att03, 
                                                            :p_att04, 
                                                            :p_att05, 
                                                            :p_att06, 
                                                            :p_att07, 
                                                            :p_att08, 
                                                            :p_att09, 
                                                            :p_att10, 
                                                            :p_att01_num,
                                                            :p_att02_num,
                                                            :p_att03_num,
                                                            :p_att04_num,
                                                            :p_att05_num,
                                                            :p_att06_num,
                                                            :p_att07_num,
                                                            :p_att08_num,
                                                            :p_att09_num,
                                                            :p_att10_num,
                                                            :p_range_details_sign,
                                                            :p_language, 
                                                            :p_crt_by, 
                                                            :p_rtn_cur); END;`,
          para_template,
          p_language,
          p_crt_by
        );

        // console.log("res_template   ++==>", res_template);

        if (res_template.p_rtn_cur[0].PK > 0) {
          // console.log("para.ParamMaster   ++==>", para.ParamMaster);
          for (let i = 0; i < para.ParamMaster[0].length; i++) {
            const para_master = {
              p_tei_param_m_pk: para.ParamMaster[0][i].PK,
              p_cell_code: para.ParamMaster[0][i].CELL_CODE,
              p_data_mapping: para.ParamMaster[0][i].DATA_MAPPING,
              p_remarks: para.ParamMaster[0][i].REMARKS,
              p_tei_template_pk: res_template.p_rtn_cur[0].PK, // para.ParamMaster[0][i].TAC_TEMPLATE_PK,
              p_type_table: para.ParamMaster[0][i].TYPE_TABLE,
              p_type_template: para.ParamMaster[0][i].TYPE_TEMPLATE,
              p_type: para.ParamMaster[0][i].TYPE,
            };
            // console.log(" para.ParamDetail[0]   ++==>",  para.ParamDetail[0]);
            //const res_para_master =
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_update_param_m(   :p_tei_param_m_pk,   
                                                        :p_cell_code,         
                                                        :p_data_mapping,      
                                                        :p_remarks,           
                                                        :p_tei_template_pk,   
                                                        :p_type_table,        
                                                        :p_type_template,     
                                                        :p_type,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
              para_master,
              p_language,
              p_crt_by
            );
          }

          // console.log(" para.ParamDetail[0]   ++==>",  para.ParamDetail[0]);
          for (let j = 0; j < para.ParamDetail[0].length; j++) {
            const para_details = {
              p_tei_param_d_pk: para.ParamDetail[0][j].PK,
              p_remarks: para.ParamDetail[0][j].REMARKS,
              p_tei_template_pk: res_template.p_rtn_cur[0].PK,
              p_type_table: para.ParamDetail[0][j].TYPE_TABLE,
              p_type_template: para.ParamDetail[0][j].TYPE_TEMPLATE,
              p_startcell: para.ParamDetail[0][j].STARTCELL,
              p_endcell: para.ParamDetail[0][j].ENDCELL,
              p_cellborder: para.ParamDetail[0][j].CELLBORDER,
              p_field: para.ParamDetail[0][j].FIELD,
              p_type: para.ParamDetail[0][j].TYPE,
              p_ord: para.ParamDetail[0][j].ORD,
            };
            // const res_para_details =
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_update_param_d(   :p_tei_param_d_pk,   
                                                        :p_remarks,         
                                                        :p_tei_template_pk,      
                                                        :p_type_table,           
                                                        :p_type_template,   
                                                        :p_startcell,        
                                                        :p_endcell,     
                                                        :p_cellborder,
                                                        :p_field,
                                                        :p_type,
                                                        :p_ord,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
              para_details,
              p_language,
              p_crt_by
            );
          }
        }
      }
      master = {
        status: "OK",
        tac_einvoice_issuse_pk: res_issue.p_rtn_cur[0].PK,
      };
      return response.send(Utils.response(true, `updating template sent successful.`, master));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "updateViewTemplate",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFTEST({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      console.log("para ", para);

      let rtnValue = [];
      let res_data = [];

      // let  ExcelHandler = require("./ExcelHandler.js");
      // let EiExcel = new EiExcelHandlerAuto();
      // const pdfUrlExcel = await EiExcel.getEinvoice(para.trade_code, p_language, p_crt_by);
      // console.log("pdfUrlExcel" , pdfUrlExcel);

      // let masterPara = {p_trade_code : pdfUrlExcel };

      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const master = await DBService.callProcCursor("ei_sel_einvoice_get_pdf", [para.trade_code], p_language, p_crt_by);
      let data_base64;
      if (master.p_rtn_cur[0].SIGN_PDF == null) {
        data_base64 = Utils.readFileByUrl(master.p_rtn_cur[0].PDF_URL);
      }
      return response.send(Utils.response(true, ` invoices were sent successful.`, master));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async DownloadXML({ request, response, auth }) {
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      const { token, proc, pk, params } = request.all();
      // console.log("params ++=>", params)
      // console.log("token ++=>", token)
      // console.log("proc ++=>", proc)
      // console.log("pk ++=>", pk)
      //if dont pass token that mean generate url only else download file
      if (token == undefined || token == null || token == "") {
        const current = new Date();
        const year = current.getFullYear();
        let month = current.getMonth() + 1;
        let day = current.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        if (month < 10) {
          month = "0" + month;
        }
        let tokenEncrypted = AES.encrypt(proc + "|" + year + month + day, APP_KEY);
        tokenEncrypted = tokenEncrypted
          .replace(/\+/g, "p1L2u3S")
          .replace(/\//g, "s1L2a3S4h")
          .replace(/=/g, "e1Q2u3A4l");
        return response.send(
          APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=" + tokenEncrypted
        );
      }

      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== proc) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      if (HOST != ip && ip != "127.0.0.1") {
        const curDate = Utils.CurrentDate();
        if (arrToken[1].substring(0, 8) != curDate) {
          return response.send(Utils.response(false, "Token was expired", null));
        }
      }

      const result = await DBService.callProcCursor(proc, [pk], "ENG", "public", "N");

      if (result.length > 0) {
        response.header("content-type", result[0].FILE_TYPE);
        response.header("Content-Disposition", "attachment; filename=" + result[0].FILE_NAME);
        response.header("content-length", result[0].FILE_SIZE);
        return response.send(result[0].FILE_CONTENT);
      }
      return response.send(Utils.response(false, "not found data", null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "DownloadXMLFromClient",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async DownloadPDF({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      const { proc, para, trade_code } = request.all();

      // console.log("para ", para);

      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const master = await DBService.callProcCursor("ei_sel_einvoice_get_pdf_xml", [trade_code], p_language, p_crt_by);

      let pdf_url_t = "";

      if (master) {
        pdf_url_t = master[0].PDF_URL;
      }
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let token = AES.encrypt("/" + pdf_url_t + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      const pdf_url = APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + "/" + pdf_url_t + "&token=" + token;
      return response.send(pdf_url);
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async SignXml({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { para, otp } = request.all();
      console.log("para ", JSON.stringify(para));

      await Request.post(EINVOICE_ESIGN_XML, { xmlContent: JSON.stringify(para) })
        .then((res) => {
          // console.log("res  ++===> ",res.data.d);
          let json = JSON.parse(res.data.d);
          //console.log("json ", json);
          return response.send(Utils.response(true, `e-Signing XML is finish !!`, res.data.d));
        })
        .catch((error) => {
          console.log(error);
          return response.send(Utils.response(false, `e-Signing XML is faile !!`, error));
        });
    } catch (err) {
      console.log("err", err);
      return null;
    }

    return;
    const { trade_codes } = request.all();
  }

  // async createSignedInfo() {
  //     try {
  //         return createxml({ version: '1.0' })
  //       .ele('SignedInfo', { xmlns: 'http://www.w3.org/2000/09/xmldsig#' })
  //       .ele('CanonicalizationMethod', { Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' })
  //       .up()
  //       .ele('SignatureMethod', { Algorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256' })
  //       .up()
  //       .ele('Reference', { URI: '#dataToSign' })
  //       .ele('DigestMethod', { Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' })
  //       .up()
  //       .ele('DigestValue')
  //       .end({ prettyPrint: true });
  //     } catch (error) {
  //         console.log("error  " , error);
  //     }

  //   }

  async findNodeById(node, desiredId) {
    if (node["$"] && node["$"].id === desiredId) {
      return node;
    }

    for (const key in node) {
      if (Array.isArray(node[key])) {
        for (const subNode of node[key]) {
          const result = this.findNodeById(subNode, desiredId);
          if (result) {
            return result;
          }
        }
      } else if (typeof node[key] === "object") {
        const result = this.findNodeById(node[key], desiredId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  async DownloadXML({ request, response, auth }) {
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      const { token, proc, pk, params } = request.all();
      // console.log("params ++=>", params)
      // console.log("token ++=>", token)
      // console.log("proc ++=>", proc)
      // console.log("pk ++=>", pk)
      //if dont pass token that mean generate url only else download file
      if (token == undefined || token == null || token == "") {
        const current = new Date();
        const year = current.getFullYear();
        let month = current.getMonth() + 1;
        let day = current.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        if (month < 10) {
          month = "0" + month;
        }
        let tokenEncrypted = AES.encrypt(proc + "|" + year + month + day, APP_KEY);
        tokenEncrypted = tokenEncrypted
          .replace(/\+/g, "p1L2u3S")
          .replace(/\//g, "s1L2a3S4h")
          .replace(/=/g, "e1Q2u3A4l");
        return response.send(
          APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=" + tokenEncrypted
        );
      }

      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== proc) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      if (HOST != ip && ip != "127.0.0.1") {
        const curDate = Utils.CurrentDate();
        if (arrToken[1].substring(0, 8) != curDate) {
          return response.send(Utils.response(false, "Token was expired", null));
        }
      }

      const result = await DBService.callProcCursor(proc, [pk], "ENG", "public", "N");

      if (result.length > 0) {
        response.header("content-type", result[0].FILE_TYPE);
        response.header("Content-Disposition", "attachment; filename=" + result[0].FILE_NAME);
        response.header("content-length", result[0].FILE_SIZE);
        return response.send(result[0].FILE_CONTENT);
      }
      return response.send(Utils.response(false, "not found data", null));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "DownloadXMLFromClient",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async DownloadPDF({ request, response, auth }) {
    var p_language = request.header("accept-language", "ENG");
    var p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    try {
      const { proc, para, trade_code } = request.all();

      // console.log("para ", para);

      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const master = await DBService.callProcCursor("ei_sel_einvoice_get_pdf_xml", [trade_code], p_language, p_crt_by);

      let pdf_url_t = "";

      if (master) {
        pdf_url_t = master[0].PDF_URL;
      }
      const current = new Date();
      const year = current.getFullYear();
      let month = current.getMonth() + 1;
      let day = current.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let token = AES.encrypt("/" + pdf_url_t + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      const pdf_url = APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + "/" + pdf_url_t + "&token=" + token;
      return response.send(pdf_url);
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  // weTAX
  async weTaxSendPOSToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, para } = request.all();

      let rtnValue = [];
      let res_data = [];
      // checking ...
      for (let i = 0; i < para.length; i++) {
        const para_value = {
          master_pk: para[i].master_pk,
          form_no: para[i].form_no,
          serial_no: para[i].serial_no,
          invoice_date: para[i].invoice_date,
          currency: para[i].currency,
          exchange_rate: para[i].exchange_rate,
          payment_methods: para[i].payment_methods,
          seller_name: para[i].seller_name,
          seller_taxcode: para[i].seller_taxcode,
          seller_address: para[i].seller_address,
          seller_phone: para[i].seller_phone,
          seller_mail: para[i].seller_mail,
          seller_account: para[i].seller_account,
          seller_bank: para[i].seller_bank,
          seller_fax: para[i].seller_fax,
          seller_website: para[i].seller_website,
          buyer_name: para[i].buyer_name,
          buyer_taxcode: para[i].buyer_taxcode,
          buyer_address: para[i].buyer_address,
          buyer_code: para[i].buyer_code,
          buyer_phone: para[i].buyer_phone,
          buyer_mail: para[i].buyer_mail,
          buyer_for_name: para[i].buyer_for_name,
          buyer_account: para[i].buyer_account,
          buyer_of_name: para[i].buyer_of_name,
          vat_rate: para[i].vat_rate,
          net_amount: para[i].net_amount,
          vat_amount: para[i].vat_amount,
          total_net_amount: para[i].total_net_amount,
          total_vat_amount: para[i].total_vat_amount,
          free_name: para[i].free_name,
          free_amount: para[i].free_amount,
          total_free_amount: para[i].total_free_amount,
          total_amount_number: para[i].total_amount_number,
          total_amount_words: para[i].total_amount_words,
          create_by: para[i].create_by,
          create_date: para[i].create_date,
        };

        rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_file_pit_ar ( :master_pk,
                                                        :form_no,
                                                        :serial_no,
                                                        :invoice_date,
                                                        :company_name,
                                                        :company_taxcode,
                                                        :company_address,
                                                        :payer_name,
                                                        :payer_address,
                                                        :payer_taxcode,
                                                        :payer_nation,
                                                        :payer_resident,
                                                        :id_passport_number,
                                                        :place_of_issue,
                                                        :date_of_issue,
                                                        :income_amt,
                                                        :income_time,
                                                        :income_amt_total,
                                                        :income_amt_total_defuct,
                                                        :income_amt_recv,
                                                        :income_type,
                                                        :income_time_yyyy,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        for (let j = 0; j < para[i].details.length; j++) {
          console.log(" para details  ", para[i].details[j]);
        }
      }

      return response.send(Utils.response(true, `${para.length} invoices were sent successful.`, res_data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendPITToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async weTaxConvertPosInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const {
        tax_code,
        store_code,
        store_name,
        count_invoice,
        list_invoice
      } = request.all();

      // console.log(" data  ", data);

      //invoices = JSON.parse(invoices);
      let rtnXML = [];
      let objInvoice = {
        DLHDon: {
          TTChung: {
            PBan: "",
            THDon: "",
            KHMSHDon: "",
            KHHDon: "",
            SHDon: "",
            MHSo: "",
            NLap: "",
            NBKe: "",
            DVTTe: "",
            TGia: "",
            HTTToan: "",
          },
          NDHDon: {
            NBan: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              NNBSTKNHang: "",
            },
            NMua: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              HVTNMHang: "",
              CCCDan: "",
            },
            DSHHDVu: {},
            TToan: {
              THTTLTSuat: {
                LTSuat: {
                  TSuat: "",
                  ThTien: "",
                  TThue: "",
                },
              },
              TgTCTHue: "",
              TgTThue: "",
              DSLPhi: {
                LPhi: {},
              },
              TTCKTMai: "",
              TgTTTBSo: "",
              TgTTTBChu: "",
            },
          },
        },
        DSCKS: {},
      };
      let objData = {
        TDiep: {
          DLieu: {
            HDon: [],
          },
        },
      };
      // console.log(" data.list_invoice  ", data.list_invoice);
      let req_key = [];
      const invoices = list_invoice;
      const valid = this.weTaxValidateJsonInvalidPosInvoiceToXML(invoices);
      if (!valid.status) {
        return response.send(Utils.response(valid.status, valid.message, null));
      }
      /*let invoices_sample=[
                            {master:{},detail:[{}]},
                            {master:{},detail:[{}]},
                            {master:{},detail:[{}]},
                        ];*/
      //console.log("invoices1:", invoices)
      if (invoices.length == undefined || invoices.length == 0) {
        return response.send(Utils.response(false, `Invalid json format.`, null));
      }

      for (let i = 0; i < invoices.length; i++) {
        //console.log("invoices:", invoices[i])
        req_key.push(invoices[i].req_key);

        if (invoices[i].form_no == 1) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
        } else if (invoices[i].form_no == 2) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
        } else if (invoices[i].form_no == 3) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
        } else if (invoices[i].form_no == 4) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
        } else if (invoices[i].form_no == 5) {
          objInvoice.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
        } else if (invoices[i].form_no == 6) {
          objInvoice.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
        }
        objInvoice.DLHDon.TTChung.PBan = invoices[i].version;
        objInvoice.DLHDon.TTChung.KHMSHDon = invoices[i].form_no;
        objInvoice.DLHDon.TTChung.KHHDon = invoices[i].serial_no;
        objInvoice.DLHDon.TTChung.SHDon = invoices[i].invoice_no;
        objInvoice.DLHDon.TTChung.NLap = invoices[i].invoice_date;
        objInvoice.DLHDon.TTChung.DVTTe = invoices[i].currency;
        objInvoice.DLHDon.TTChung.TGia = invoices[i].ex_rate;
        objInvoice.DLHDon.TTChung.HTTToan = invoices[i].payment_method;
        objInvoice.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice.DLHDon.NDHDon.NBan.Ten = invoices[i].seller_comp_name;
        objInvoice.DLHDon.NDHDon.NBan.MST = invoices[i].seller_taxcode;
        objInvoice.DLHDon.NDHDon.NBan.DChi = invoices[i].seller_address;
        objInvoice.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_tel;

        objInvoice.DLHDon.NDHDon.NMua.Ten = invoices[i].buyer_comp_name;
        objInvoice.DLHDon.NDHDon.NMua.MST = invoices[i].buyer_taxcode;
        objInvoice.DLHDon.NDHDon.NMua.DChi = invoices[i].buyer_address;
        objInvoice.DLHDon.NDHDon.NMua.CCCDan = invoices[i].buyer_cccd;
        objInvoice.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_tel;

        objInvoice.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
          objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoices[i].detail_invoice[j].feature,
            STT: invoices[i].detail_invoice[j].seq,
            MHHDVu: invoices[i].detail_invoice[j].item_code,
            THHDVu: invoices[i].detail_invoice[j].item_name,
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
        objInvoice.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoices[i].total_payment.toString(),
          invoices[i].currency
        );

        objInvoice.DSCKS.NBan = "";

        objInvoice.MCCQT = invoices[i].mccqt;

        objData.TDiep.DLieu.HDon.push(objInvoice);
        objInvoice = {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                NNBSTKNHang: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                HVTNMHang: "",
                CCCDan: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        };
      }

      const id = "ID1";//uuid.v4();
      const xml = this.OBJtoXML(objData);
      const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "").replaceAll("\"","\'");
      rtnXML = {
        tax_code: tax_code,
        store_code: store_code,
        store_name: store_name,
        count_invoice_convert: invoices.length,
        sign_id: id,
        xml_data: xmlRemoveLine,
        req_key: req_key,
      };

      return response.send(Utils.response(true, `Convert json to xml was successful.`, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxConvertPosInvoiceToXML",
        CONTENT: e.message,
      });
      console.log("error ", e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  weTaxValidateJsonInvalidPosInvoiceToXML(invalid_pos_invoices) {
    let status = true;
    let resMess = "";
    const mess1 = "Invalid field";
    //console.log("invalid_pos_invoices  ", invalid_pos_invoices)
    try {
    
      const errorList = [
        {
          version: 6,
          master_pk: 99,
          invoice_name: 100,
          form_no: 1,
          serial_no: 6,
          invoice_no: 8,
          invoice_date: 10,
          currency: 3,
          ex_rate: 10,
          payment_method: 50,
          seller_comp_name: 400,
          seller_taxcode: 14,
          seller_address: 400,
          seller_tel: 20,
          buyer_comp_name: 400,
          buyer_taxcode: 14,
          buyer_address: 400,
          buyer_tel: 20,
          buyer_cccd: 12,
          detail_invoice: [
            {
              feature: 1,
              seq: 4,
              item_code: 50,
              item_name: 500,
              item_uom: 50,
              quantity: 28,
              uprice: 28,
              dc_rate: 11,
              dc_amt: 28,
              amt: 28,
              vat_rate: 11,
              amt_vat: 28,
            },
          ],
          total_vat_list: [
            {
              sub_vat_rate: 11,
              sub_amt: 28,
              sub_amt_vat: 28,
            },
          ],
          total_amt: 28,
          total_discount_amt: 28,
          total_payment: 28,
          total_payment_word_vie: 255,
        },
      ];

      for (const key in errorList) {
        // valid null of not null values
        if (invalid_pos_invoices[key] === undefined || invalid_pos_invoices[key] == null) {
          status = false;
          resMess = `${mess1} ${key}.`;
          return {
            status,
            message: resMess,
          };
        }

        // valid length
        if (String(invalid_pos_invoices[key]).length > errorList[key] && key != "invoices") {
          return {
            status: false,
            message: `Length of ${key} too long.`,
          };
        }
      }
      // console.log("invalid_pos_invoices ", invalid_pos_invoices);
      // valid invoices
      // if(!invalid_pos_invoices.detail[0]){
      // return {
      //     status: false,
      //     message:`${mess1} invoices.`,
      // };
      // }

      for (let i = 0; i < invalid_pos_invoices.length; i++) {
        // console.log(" i ", i, "  sss", invalid_pos_invoices[i]);

        for (let j = 0; j < invalid_pos_invoices[i].detail_invoice.length; j++) {
          for (const key in errorList[0].detail_invoice[0]) {
            // valid digital_certificates
            if ( invalid_pos_invoices[i].detail_invoice[j][key] === undefined || invalid_pos_invoices[i].detail_invoice[j][key] == null ) 
            {
              status = false;
              resMess = `${mess1} invoices ${key}.`;
              return {
                status,
                message: resMess,
              };
            }
            // vald length
            if (String(invalid_pos_invoices[i].detail_invoice[j][key]).length > errorList[0].detail_invoice[0][key]) {
              return {
                status: false,
                message: `Length of invoices.${key} too long.`,
              };
            }
          }
        }

        for (let j = 0; j < invalid_pos_invoices[i].total_vat_list.length; j++) {
          for (const key in errorList[0].total_vat_list[0]) {
            // valid digital_certificates
            //console.log(invalid_pos_invoices[i].total_vat_list)
            if ( invalid_pos_invoices[i].total_vat_list[j][key] === undefined ||   invalid_pos_invoices[i].total_vat_list[j][key] == null ) {
              status = false;
              resMess = `${mess1} invoices ${key}.`;
              return {
                status,
                message: resMess,
              };
            }
            // vald length
            if (String(invalid_pos_invoices[i].total_vat_list[0][key]).length > errorList[0].total_vat_list[0][key]) {
              return {
                status: false,
                message: `Length of invoices.${key} too long.`,
              };
            }
          }
        }

      }
      //console.log("status ", status, " resMess ", resMess);
      // if dont have any problem
      return {
        status,
        message: resMess,
      };
    } catch (error) {
      console.log("error  ", error);
      //let status = false;
      return {
        status,
        message: resMess,
      };
    }
  }

  async weTaxSendOrderInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { 
        tax_code = "",
        sale_date = "",
        store_code = "",
        store_name = "",
        pos_no = "",
        bill_no = "",
        data_invoice = []
      } = request.all();

      console.log("======================weTaxSendOrderInfo BEGIN===================");
      console.log("weTaxSendOrderInfo tax_code  ",tax_code );
      console.log("weTaxSendOrderInfo p_crt_by  ",p_crt_by );
      console.log("weTaxSendOrderInfo sale_date  ",sale_date );
      console.log("weTaxSendOrderInfo store_code  ",store_code );
      console.log("weTaxSendOrderInfo store_name  ",store_name );
      console.log("weTaxSendOrderInfo pos_no  ",pos_no );
      console.log("weTaxSendOrderInfo bill_no  ",bill_no );
      console.log("weTaxSendOrderInfo data_invoice  ",data_invoice );
      console.log("======================weTaxSendOrderInfo END===================");

      if (!data_invoice) {
        return response.send(Utils.response(false, `Invalid data_invoice `, null)
        );
      }

      if (!sale_date) {
        return response.send(Utils.response(false, `Invalid sale_date `, null)
        );
      }

      if (!tax_code) {
        return response.send(Utils.response(false, `Invalid tax_code `, null)
        );
      }
      let data_rep = [];
      for (const invoice of data_invoice) {
        let tei_wt_sale_bill_pk = 0;
        const data_xml = await this.createXMLByOne(invoice);
        var getLength = require("utf8-byte-length")
        const count_length = getLength(data_xml);
        console.log(" count_length   ", count_length);
        const xml_type = "application/xhtml+xml; charset=utf-8";

        if (!invoice.form_no || !invoice.serial_no || !invoice.invoice_no) {
          return response.send(Utils.response(false, `Invalid infor for e-invoice `, null)
          );
        }

        if (!invoice.seller_comp_name || !invoice.seller_taxcode) {
          return response.send(Utils.response(false, `Invalid infor for company `, null)
          );
        }

        const para_value = {
          sale_date: sale_date,
          store_code: store_code,
          store_name: store_name,
          pos_no: pos_no,
          bill_no: bill_no,
          version: invoice.version,
          invoice_name: invoice.invoice_name,
          symbol_type: invoice.form_no, //invoice.symbol_type,
          form_no: invoice.form_no,
          serial_no: invoice.serial_no,
          invoice_date: invoice.invoice_date,
          invoice_no: invoice.invoice_no,
          currency: invoice.currency,
          ex_rate: invoice.ex_rate,
          payment_method: invoice.payment_method,
          seller_comp_name: invoice.seller_comp_name,
          seller_taxcode: invoice.seller_taxcode,
          seller_address: invoice.seller_address,
          seller_phone: invoice.seller_phone,
          // buyer_nm: invoice.buyer_nm || '', tam thoi dong -- vng-199
          buyer_comp_name: invoice.buyer_comp_name || '',
          buyer_taxcode: invoice.buyer_taxcode,
          buyer_phone: invoice.buyer_phone,
          buyer_address: invoice.buyer_address,
          buyer_cccd: invoice.buyer_cccd,
          buyer_email: invoice.buyer_email,
          buyer_email_cc: invoice.buyer_email_cc,
          total_amt_no_vat: invoice.total_amt,
          total_amt_dc: invoice.total_dc_amt,
          total_amt_vat: invoice.total_amt_vat,
          total_payment: invoice.total_payment,
          total_payment_word_vie: await Utils.Num2VNText(invoice.total_payment.toString(),invoice.currency),//  invoice.total_payment_word_vie,
          mccqt: invoice.mccqt,
          data_xml: data_xml,
          count_length: count_length,
          xml_type: xml_type,
        };
 
        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_order_info (          
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
          p_crt_by
        );


        tei_wt_sale_bill_pk = rtnValue.p_rtn_cur[0].PK;
        console.log("tei_wt_sale_bill_pk  ", tei_wt_sale_bill_pk);
        //console.log("para_value   ", para_value);
        console.log("rtnValue   ", rtnValue);

        if (rtnValue.p_rtn_cur[0].STATUS == "OK") {
          console.log("tei_wt_sale_bill_pk OK ", tei_wt_sale_bill_pk);
          for (let j = 0; j < invoice.total_vat_list.length; j++) {
            const para_amt_vat = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              sub_amt: invoice.total_vat_list[j].sub_amt,
              sub_vat_rate: invoice.total_vat_list[j].sub_vat_rate,
              sub_vat_amt: invoice.total_vat_list[j].sub_vat_amt,
            };
            const rtnValue_VAT = await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_bill_vat (          
                                                                :tei_wt_sale_bill_pk,
                                                                :sub_amt,
                                                                :sub_vat_rate,
                                                                :sub_vat_amt,
                                                                :p_language, 
                                                                :p_crt_by, 
                                                                :p_rtn_cur); END;`,
              para_amt_vat,
              p_language,
              p_crt_by
            );
          }

          for (let j = 0; j < invoice.detail_invoice.length; j++) {
            const para_prod_details = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              feature: invoice.detail_invoice[j].feature,
              seq: invoice.detail_invoice[j].seq,
              item_code: invoice.detail_invoice[j].item_code,
              item_name: invoice.detail_invoice[j].item_name,
              unit: invoice.detail_invoice[j].unit,
              quantity: invoice.detail_invoice[j].quantity,
              unit_price: invoice.detail_invoice[j].unit_price,
              dc_rate: invoice.detail_invoice[j].dc_rate,
              dc_amt: invoice.detail_invoice[j].dc_amt,
              amount: invoice.detail_invoice[j].amount,
              vat_rate: invoice.detail_invoice[j].vat_rate,
            };
            //console.log("para_prod_details  ", para_prod_details)
            const rtnValue_VAT = await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_prod (          
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
              p_crt_by
            );
          }
        }
        else //if (rtnValue.p_rtn_cur[0].STATUS == "NOEXIT")
        {
          //console.log("tei_wt_sale_bill_pk NOEXIT ", tei_wt_sale_bill_pk);

          data_rep.push({
            link_invoice_preview: "https://einvoicevn.com/lookup",
            security_code: "",
            status_code: "0",
            status_name: "Tax code has not been registered",
            seller_tax_code : invoice.seller_taxcode,
            form_no : invoice.form_no,
            serial_no : invoice.serial_no,
            invoice_no :invoice.invoice_no,
            user_name: '',
            send_date: '',
            send_time: '',
            mail_form: '',
            mail_to: '',
            mail_to_cc: '',
            etax_result: "",
            etax_status: "",
            title: '',
            content: '',
          });
          continue;
        } 
       
        
        if (!invoice.buyer_email && !invoice.buyer_email_cc) {
          data_rep.push({
            link_invoice_preview: "https://einvoicevn.com/lookup",
            security_code: "",
            status_code: "0",
            status_name: "Not Sent",
            seller_tax_code : invoice.seller_taxcode,
            form_no : invoice.form_no,
            serial_no : invoice.serial_no,
            invoice_no :invoice.invoice_no,
            user_name: '',
            send_date: '',
            send_time: '',
            mail_form: '',
            mail_to: '',
            mail_to_cc: '',
            etax_result: "0",
            etax_status: "",
            title: '',
            content: '',
          });
        } else {
           
          const { res_send_mail, subject, body } = await this.sendMailToCustomer(
            tei_wt_sale_bill_pk,
            invoice,
            p_language,
            p_crt_by
          );

          if (res_send_mail.data.success) {
            const para_inv_st = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              status: "Sent Success",
            };
            // const rtnValueSendMail = 
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_bill_status (          
                                                              :tei_wt_sale_bill_pk,
                                                              :status,
                                                              :p_language, 
                                                              :p_crt_by, 
                                                              :p_rtn_cur); END;`,
              para_inv_st,
              p_language,
              p_crt_by
            );

             data_rep.push({
              link_invoice_preview: "https://einvoicevn.com/lookup",
              lookup_code: "1234567bac",
              status_code: "1",
              status_name: "Sent Success",
              seller_tax_code : invoice.seller_taxcode,
              form_no : invoice.form_no,
              serial_no : invoice.serial_no,
              invoice_no :invoice.invoice_no,
              customer_name: invoice.buyer_comp_name,
              send_date: res_send_mail.data.data.date_send,
              send_time: res_send_mail.data.data.time_send,
              mail_form: res_send_mail.data.data.mail_from,
              mail_to: res_send_mail.data.data.mail_to,
              mail_to_cc: res_send_mail.data.data.mail_to_cc,
              etax_result: "0",
              etax_status: "",
              title: subject,
              content: body,
            });
          } else {
            const para_inv_st = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              status: "Sent Faile",
            };
            // const rtnValueSendMail = 
            await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_bill_status (          
                                                              :tei_wt_sale_bill_pk,
                                                              :status,
                                                              :p_language, 
                                                              :p_crt_by, 
                                                              :p_rtn_cur); END;`,
              para_inv_st,
              p_language,
              p_crt_by
            );
            data_rep.push({
              link_invoice_preview: "https://einvoicevn.com/lookup",
              security_code: "1234567bac",
              status_code: "0",
              status_name: "Sent Faile",
              seller_tax_code : invoice.seller_taxcode,
              form_no : invoice.form_no,
              serial_no : invoice.serial_no,
              invoice_no :invoice.invoice_no,
              user_name: invoice.buyer_comp_name,
              send_date: res_send_mail.data.data.date_send,
              send_time: res_send_mail.data.data.time_send,
              mail_form: res_send_mail.data.data.mail_from,
              mail_to: res_send_mail.data.data.mail_to,
              mail_to_cc: res_send_mail.data.data.mail_to_cc,
              etax_result: "0",
              etax_status: "",
              title: subject,
              content: body,
            });
          }
          
        }
        
      }

      return response.send(Utils.response(true, `Send order to invoice was successfully!`, data_rep));
      // console.log("res_send_mail  ", res_send_mail);
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendOrderInfo",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxSendOrderInfoV2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      let data_send_mail = [];
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { 
        sale_id = "1",
        msg_his_id = "1",
        tax_code = "",
        sale_date = "",
        store_code = "",
        store_name = "",
        pos_no = "",
        bill_no = "",
        data_invoice = []
      } = request.all();

      console.log("======================weTaxSendOrderInfoV2 BEGIN===================");
      console.log("weTaxSendOrderInfoV2 sale_id   ",sale_id  );
      console.log("weTaxSendOrderInfoV2 msg_his_id  ",msg_his_id );
      console.log("weTaxSendOrderInfoV2 tax_code  ",tax_code );
      console.log("weTaxSendOrderInfoV2 p_crt_by  ",p_crt_by );
      console.log("weTaxSendOrderInfoV2 sale_date  ",sale_date );
      console.log("weTaxSendOrderInfoV2 store_code  ",store_code );
      console.log("weTaxSendOrderInfoV2 store_name  ",store_name );
      console.log("weTaxSendOrderInfoV2 pos_no  ",pos_no );
      console.log("weTaxSendOrderInfoV2 bill_no  ",bill_no );
      console.log("weTaxSendOrderInfoV2 data_invoice  ",data_invoice );

      if (!data_invoice) {
        return response.send(Utils.response(false, `Invalid data_invoice `, null)
        );
      }

      if (!sale_date) {
        return response.send(Utils.response(false, `Invalid sale_date `, null)
        );
      }

      if (!tax_code) {
        return response.send(Utils.response(false, `Invalid tax_code `, null)
        );
      }
      let data_rep = [];
      for (const invoice of data_invoice) {
        let tei_wt_sale_bill_pk = 0;
        const data_xml = await this.createXMLByOne(invoice);
        var getLength = require("utf8-byte-length")
        const count_length = getLength(data_xml);
        console.log(" count_length   ", count_length);
        const xml_type = "application/xhtml+xml; charset=utf-8";

        if (!invoice.form_no || !invoice.serial_no || !invoice.invoice_no) {
          return response.send(Utils.response(false, `Invalid infor for e-invoice `, null)
          );
        }

        if (!invoice.seller_comp_name || !invoice.seller_taxcode) {
          return response.send(Utils.response(false, `Invalid infor for company `, null)
          );
        }

        const para_value = {
          sale_date: sale_date,
          store_code: store_code,
          store_name: store_name,
          pos_no: pos_no,
          bill_no: bill_no,
          version: invoice.version,
          invoice_name: invoice.invoice_name,
          symbol_type: invoice.form_no, //invoice.symbol_type,
          form_no: invoice.form_no,
          serial_no: invoice.serial_no,
          invoice_date: invoice.invoice_date,
          invoice_no: invoice.invoice_no,
          currency: invoice.currency,
          ex_rate: invoice.ex_rate,
          payment_method: invoice.payment_method,
          seller_comp_name: invoice.seller_comp_name,
          seller_taxcode: invoice.seller_taxcode,
          seller_address: invoice.seller_address,
          seller_phone: invoice.seller_phone,
          // buyer_nm: invoice.buyer_nm || '', tam thoi dong -- vng-199
          buyer_comp_name: invoice.buyer_comp_name || '',
          buyer_taxcode: invoice.buyer_taxcode,
          buyer_phone: invoice.buyer_phone,
          buyer_address: invoice.buyer_address,
          buyer_cccd: invoice.buyer_cccd,
          buyer_email: invoice.buyer_email,
          buyer_email_cc: invoice.buyer_email_cc,
          total_amt_no_vat: invoice.total_amt,
          total_amt_dc: invoice.total_dc_amt,
          total_amt_vat: invoice.total_amt_vat,
          total_payment: invoice.total_payment,
          total_payment_word_vie: await Utils.Num2VNText(invoice.total_payment.toString(),invoice.currency),//  invoice.total_payment_word_vie,
          mccqt: invoice.mccqt,
          data_xml: data_xml,
          count_length: count_length,
          xml_type: xml_type,
        };
 
        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_upd_order_info (          
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
          p_crt_by
        );


        tei_wt_sale_bill_pk = rtnValue.p_rtn_cur[0].PK;
        console.log("tei_wt_sale_bill_pk  ", tei_wt_sale_bill_pk);
        //console.log("para_value   ", para_value);
        console.log("rtnValue   ", rtnValue);

        if (rtnValue.p_rtn_cur[0].STATUS == "OK") {
          console.log("tei_wt_sale_bill_pk OK ", tei_wt_sale_bill_pk);
          data_send_mail.push({
            tei_wt_sale_bill_pk : tei_wt_sale_bill_pk,
            invoice : invoice
          });
          for (let j = 0; j < invoice.total_vat_list.length; j++) {
            const para_amt_vat = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              sub_amt: invoice.total_vat_list[j].sub_amt,
              sub_vat_rate: invoice.total_vat_list[j].sub_vat_rate,
              sub_vat_amt: invoice.total_vat_list[j].sub_vat_amt,
            };
            const rtnValue_VAT = await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_bill_vat (          
                                                                :tei_wt_sale_bill_pk,
                                                                :sub_amt,
                                                                :sub_vat_rate,
                                                                :sub_vat_amt,
                                                                :p_language, 
                                                                :p_crt_by, 
                                                                :p_rtn_cur); END;`,
              para_amt_vat,
              p_language,
              p_crt_by
            );
          }

          for (let j = 0; j < invoice.detail_invoice.length; j++) {
            const para_prod_details = {
              tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
              feature: invoice.detail_invoice[j].feature,
              seq: invoice.detail_invoice[j].seq,
              item_code: invoice.detail_invoice[j].item_code,
              item_name: invoice.detail_invoice[j].item_name,
              unit: invoice.detail_invoice[j].unit,
              quantity: invoice.detail_invoice[j].quantity,
              unit_price: invoice.detail_invoice[j].unit_price,
              dc_rate: invoice.detail_invoice[j].dc_rate,
              dc_amt: invoice.detail_invoice[j].dc_amt,
              amount: invoice.detail_invoice[j].amount,
              vat_rate: invoice.detail_invoice[j].vat_rate,
            };
            //console.log("para_prod_details  ", para_prod_details)
            const rtnValue_VAT = await DBService.ExecuteSQLBlob(
              `BEGIN ei_upd_sale_prod (          
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
              p_crt_by
            );
          }
        }
        else //if (rtnValue.p_rtn_cur[0].STATUS == "NOEXIT")
        {
          //console.log("tei_wt_sale_bill_pk NOEXIT ", tei_wt_sale_bill_pk);

          data_rep.push({
            sale_id : sale_id ,
            msg_his_id: msg_his_id,
            link_invoice_preview: "https://einvoicevn.com/lookup",
            security_code: "",
            status_code: "0",
            status_name: "Tax code has not been registered",
            seller_tax_code : invoice.seller_taxcode,
            form_no : invoice.form_no,
            serial_no : invoice.serial_no,
            invoice_no :invoice.invoice_no,
            user_name: '',
            send_date: '',
            send_time: '',
            mail_form: '',
            mail_to: '',
            mail_to_cc: '',
            etax_result: "",
            etax_status: "",
            title: '',
            content: '',
          });
          continue;
        } 
       
        
        if (!invoice.buyer_email && !invoice.buyer_email_cc) {
          data_rep.push({
            sale_id : sale_id ,
            msg_his_id: msg_his_id,
            link_invoice_preview: "https://einvoicevn.com/lookup",
            security_code: "",
            status_code: "0",
            status_name: "Not Sent",
            seller_tax_code : invoice.seller_taxcode,
            form_no : invoice.form_no,
            serial_no : invoice.serial_no,
            invoice_no :invoice.invoice_no,
            user_name: '',
            send_date: '',
            send_time: '',
            mail_form: '',
            mail_to: '',
            mail_to_cc: '',
            etax_result: "0",
            etax_status: "",
            title: '',
            content: '',
          });

        } else {
           
          data_rep.push({
            sale_id : sale_id ,
            msg_his_id: msg_his_id,
            link_invoice_preview: "https://einvoicevn.com/lookup",
            lookup_code: "1234567bac",
            status_code: "3",
            status_name: "In Process",
            seller_tax_code : invoice.seller_taxcode,
            form_no : invoice.form_no,
            serial_no : invoice.serial_no,
            invoice_no :invoice.invoice_no,
            customer_name: invoice.buyer_comp_name,
            send_date: "",
            send_time: "",
            mail_form: "",
            mail_to: "",
            mail_to_cc: "",
            etax_result: "0",
            etax_status: "",
            title: "",
            content: "",
          });
        }
      }

      this.sendMailWT(data_send_mail, sale_id, msg_his_id, tax_code, p_language, p_crt_by);

      console.log("======================weTaxSendOrderInfoV2 END===================");

      return response.send(Utils.response(true, `Send order to invoice was successfully!`, data_rep));
     
      // console.log("res_send_mail  ", res_send_mail);
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendOrderInfoV2",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxReSendOrderInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { tax_code,
        sale_date,
        store_code,
        store_name,
        infor_send_mail
      } = request.all();

      console.log("weTaxReSendOrderInfo  BEGIN ============================= ");
      console.log("weTaxReSendOrderInfo  tax_code ",tax_code);
      console.log("weTaxReSendOrderInfo  sale_date ",sale_date);
      console.log("weTaxReSendOrderInfo  store_code ",store_code);
      console.log("weTaxReSendOrderInfo  store_name ",store_name);
      console.log("weTaxReSendOrderInfo  infor_send_mail ",infor_send_mail);
      console.log("weTaxReSendOrderInfo  END =============================== ");

      let tei_wt_sale_bill_pk = 0;
      let data_r = [];
      //const data_xml = await this.createXMLByOne(data.data_invoice);
      for (const invoice of infor_send_mail) {
        const para_value = {
          tax_code: tax_code,
          sale_date: sale_date,
          store_code: store_code,
          store_name: store_name,
          form_no: invoice.form_no,
          serial_no: invoice.serial_no,
          invoice_no: invoice.invoice_no,
        };

        console.log("para_value  ", para_value)

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_re_order_info (                   :tax_code,
                                                          :sale_date,
                                                          :store_code,
                                                          :store_name,
                                                          :form_no,
                                                          :serial_no,
                                                          :invoice_no,
                                                          :p_language, 
                                                          :p_crt_by, 
                                                          :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        console.log("rtnValue  ", rtnValue)

        if (rtnValue?.p_rtn_cur?.[0]?.STATUS == "OK") {
          tei_wt_sale_bill_pk = rtnValue.p_rtn_cur[0].PK;

          if (!invoice.buyer_email && !invoice.buyer_email_cc && !rtnValue.p_rtn_cur[0].BUYER_EMAIL && !rtnValue.p_rtn_cur[0].BUYER_EMAIL_CC) {
            data_r.push({
              link_invoice_preview: "https://einvoicevn.com/lookup",
              lookup_code: "1234567bac",
              seller_taxcode: tax_code,
              form_no: invoice.form_no,
              serial_no: invoice.serial_no,
              invoice_no: invoice.invoice_no,
              status_code: "0",
              status_name: "Buyer mail and buyer maill cc are null",
              user_name: "",
              send_date: "",
              send_time: "",
              mail_form: "",
              mail_to: "",
              mail_to_cc: "",
              title: "",
              content: "",
            });
          } else {
            let invoice_data =
            {
              buyer_comp_name: rtnValue.p_rtn_cur[0].BUYER_COMP_NAME,
              seller_comp_name: rtnValue.p_rtn_cur[0].SELLER_COMP_NAME,
              form_no: rtnValue.p_rtn_cur[0].FORM_NO,
              serial_no: rtnValue.p_rtn_cur[0].SERIAL_NO,
              invoice_no: rtnValue.p_rtn_cur[0].INVOICE_NO,
              total_payment: rtnValue.p_rtn_cur[0].TOTAL_PAYMENT,
              mccqt: rtnValue.p_rtn_cur[0].MCCQT,
              buyer_email: invoice.buyer_email,
              buyer_email_cc: invoice.buyer_email_cc,
            }
            const { res_send_mail, subject, body } = await this.sendMailToCustomer(
              tei_wt_sale_bill_pk,
              invoice_data,
              p_language,
              p_crt_by
            );

            // console.log("res_send_mail  ", res_send_mail.data);
            // console.log("res_send_mail  ", res_send_mail.data.success);

            if (res_send_mail.data.success) {
              const para_inv_st = {
                tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
                status: "Sent Success",
              };
              const rtnValueSendMail = await DBService.ExecuteSQLBlob(
                `BEGIN ei_upd_sale_bill_status (          
                                                                  :tei_wt_sale_bill_pk,
                                                                  :status,
                                                                  :p_language, 
                                                                  :p_crt_by, 
                                                                  :p_rtn_cur); END;`,
                para_inv_st,
                p_language,
                p_crt_by
              );
              //console.log("rtnValueSendMail  ", rtnValueSendMail);

              data_r.push({
                link_invoice_preview: "https://einvoicevn.com/lookup",
                lookup_code: "1234567bac",
                seller_taxcode: tax_code,
                form_no: invoice.form_no,
                serial_no: invoice.serial_no,
                invoice_no: invoice.invoice_no,
                status_code: "1",
                status_name: "Sent Success",
                user_name: rtnValue.p_rtn_cur[0].BUYER_COMP_NAME,
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
                tei_wt_sale_bill_pk: tei_wt_sale_bill_pk,
                status: "Sent Faile",
              };
              const rtnValueSendMail = await DBService.ExecuteSQLBlob(
                `BEGIN ei_upd_sale_bill_status (          
                                                                  :tei_wt_sale_bill_pk,
                                                                  :status,
                                                                  :p_language, 
                                                                  :p_crt_by, 
                                                                  :p_rtn_cur); END;`,
                para_inv_st,
                p_language,
                p_crt_by
              );

              data_r.push({
                link_invoice_preview: "https://einvoicevn.com/lookup",
                lookup_code: "1234567bac",
                seller_taxcode: tax_code,
                form_no: invoice.form_no,
                serial_no: invoice.serial_no,
                invoice_no: invoice.invoice_no,
                status_code: "0",
                status_name: "Sent Faile",
                user_name: "",
                send_date: "",
                send_time: "",
                mail_form: "",
                mail_to: "",
                mail_to_cc: "",
                title: "",
                content: "",
              });
            }
          }
        }
        else {
          //return response.send(Utils.response(false, 'Order einvoice not exit'));
          data_r.push({
            link_invoice_preview: "https://einvoicevn.com/lookup",
            lookup_code: "1234567bac",
            seller_taxcode: tax_code,
            form_no: invoice.form_no,
            serial_no: invoice.serial_no,
            invoice_no: invoice.invoice_no,
            status_code: "D",
            status_name: "Order einvoice not exit/ Taxcode not yet register",
            user_name: "",
            send_date: "",
            send_time: "",
            mail_form: "",
            mail_to: "",
            mail_to_cc: "",
            title: "",
            content: "",
          });
        }
      }

      return response.send(Utils.response(true, `ReSend order to invoice was Successfully!`, data_r));

    } catch (error) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxReSendOrderInfo",
        CONTENT: error.message,
      });
      console.log(error);
      return response.send(Utils.response(false, error.message, null));
    }
  }

  async weTaxReSendOrderInfoV2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      let data_send_mail = [];
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { 
        sale_id = "1",
        msg_his_id = "2",
        tax_code,
        sale_date,
        store_code,
        store_name,
        infor_send_mail
      } = request.all();

      console.log("weTaxReSendOrderInfoV2  BEGIN ============================= ");
      console.log("weTaxReSendOrderInfoV2  sale_id ",sale_id);
      console.log("weTaxReSendOrderInfoV2  msg_his_id ",msg_his_id);
      console.log("weTaxReSendOrderInfoV2  tax_code ",tax_code);
      console.log("weTaxReSendOrderInfoV2  sale_date ",sale_date);
      console.log("weTaxReSendOrderInfoV2  store_code ",store_code);
      console.log("weTaxReSendOrderInfoV2  store_name ",store_name);
      console.log("weTaxReSendOrderInfoV2  infor_send_mail ",infor_send_mail);
      console.log("weTaxReSendOrderInfoV2  END =============================== ");

      let tei_wt_sale_bill_pk = 0;
      let data_r = [];
      //const data_xml = await this.createXMLByOne(data.data_invoice);
      for (const invoice of infor_send_mail) {
        const para_value = {
          tax_code: tax_code,
          sale_date: sale_date,
          store_code: store_code,
          store_name: store_name,
          form_no: invoice.form_no,
          serial_no: invoice.serial_no,
          invoice_no: invoice.invoice_no,
        };

        console.log("para_value  ", para_value)

        const rtnValue = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_re_order_info (                   :tax_code,
                                                          :sale_date,
                                                          :store_code,
                                                          :store_name,
                                                          :form_no,
                                                          :serial_no,
                                                          :invoice_no,
                                                          :p_language, 
                                                          :p_crt_by, 
                                                          :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        console.log("rtnValue  ", rtnValue)

        if (rtnValue?.p_rtn_cur?.[0]?.STATUS == "OK") {
          tei_wt_sale_bill_pk = rtnValue.p_rtn_cur[0].PK;
          data_send_mail.push({
            tei_wt_sale_bill_pk : tei_wt_sale_bill_pk,
            invoice : {
              buyer_comp_name: rtnValue.p_rtn_cur[0].BUYER_COMP_NAME,
              seller_comp_name: rtnValue.p_rtn_cur[0].SELLER_COMP_NAME,
              form_no: rtnValue.p_rtn_cur[0].FORM_NO,
              serial_no: rtnValue.p_rtn_cur[0].SERIAL_NO,
              invoice_no: rtnValue.p_rtn_cur[0].INVOICE_NO,
              total_payment: rtnValue.p_rtn_cur[0].TOTAL_PAYMENT,
              mccqt: rtnValue.p_rtn_cur[0].MCCQT,
              buyer_email: invoice.buyer_email,
              buyer_email_cc: invoice.buyer_email_cc,
            }
          });

          if (!invoice.buyer_email && !invoice.buyer_email_cc && !rtnValue.p_rtn_cur[0].BUYER_EMAIL && !rtnValue.p_rtn_cur[0].BUYER_EMAIL_CC) {
            data_r.push({
              link_invoice_preview: "https://einvoicevn.com/lookup",
              lookup_code: "1234567bac",
              seller_taxcode: tax_code,
              form_no: invoice.form_no,
              serial_no: invoice.serial_no,
              invoice_no: invoice.invoice_no,
              status_code: "0",
              status_name: "Buyer mail and buyer maill cc are null",
              customer_name: "",
              send_date: "",
              send_time: "",
              mail_form: "",
              mail_to: "",
              mail_to_cc: "",
              title: "",
              content: "",
            });
            continue;
          } 

          data_r.push({
            link_invoice_preview: "https://einvoicevn.com/lookup",
            lookup_code: "1234567bac",
            seller_taxcode: tax_code,
            form_no: invoice.form_no,
            serial_no: invoice.serial_no,
            invoice_no: invoice.invoice_no,
            status_code: "3",
            status_name: "In Process",
            customer_name: "",
            send_date: "",
            send_time: "",
            mail_form: "",
            mail_to: "",
            mail_to_cc: "",
            title: "",
            content: "",
          });
        }
        else {
          //return response.send(Utils.response(false, 'Order einvoice not exit'));
          data_r.push({
            link_invoice_preview: "https://einvoicevn.com/lookup",
            lookup_code: "1234567bac",
            seller_taxcode: tax_code,
            form_no: invoice.form_no,
            serial_no: invoice.serial_no,
            invoice_no: invoice.invoice_no,
            status_code: "D",
            status_name: "Order einvoice not exit/ Taxcode not yet register",
            customer_name: "",
            send_date: "",
            send_time: "",
            mail_form: "",
            mail_to: "",
            mail_to_cc: "",
            title: "",
            content: "",
          });
        }
      }

      this.sendMailWT(data_send_mail, sale_id, msg_his_id, tax_code, p_language, p_crt_by);

      return response.send(Utils.response(true, `ReSend order to invoice was Successfully!`, data_r));

    } catch (error) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxReSendOrderInfo",
        CONTENT: error.message,
      });
      console.log(error);
      return response.send(Utils.response(false, error.message, null));
    }
  }

  async weTaxSendCompanyTemplate({ request, response, auth }) {
    try {

      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { seller_comp_taxcode,
        symbol_type,
        form_no,
        serial_no,
        template_id,
        start_date,
        end_date,
        start_number,
        preview,
      } = request.all();
      const template_excel = request.file("template_excel");
      const logo_image = request.file("logo_image");
      const background_image = request.file("background_image");

      console.log("weTaxSendCompanyTemplate logo_image : ", logo_image);
      //console.log("weTaxSendCompanyTemplate background_image :",background_image);
      console.log("weTaxSendCompanyTemplate form_no :",form_no);
      console.log("weTaxSendCompanyTemplate serial_no :",serial_no);
      console.log("weTaxSendCompanyTemplate symbol_type : ", symbol_type);
      console.log("weTaxSendCompanyTemplate template_id :",template_id);
      console.log("weTaxSendCompanyTemplate start_number :",start_number);
      console.log("weTaxSendCompanyTemplate start_date : ", start_date);
      console.log("weTaxSendCompanyTemplate seller_comp_taxcode :",seller_comp_taxcode);

      if (!seller_comp_taxcode) {
        return response.send(Utils.response(false, "seller_comp_taxcode can't null",null));
      }

      if (!form_no) {
        return response.send(Utils.response(false, "form_no can't null",null));
      }if(form_no.length !== 1) {
        return response.send(Utils.response(false, "length form_no is 1 ",null));
      }
      if (!serial_no) {
        return response.send(Utils.response(false, "serial_no can't null",null));
      }else if(serial_no.length !== 6) {
        return response.send(Utils.response(false, "length serial_no is 6 ",null));
      }
      if (!template_id) {
        return response.send(Utils.response(false, "template_id can't null",null));
      } if(template_id.length !== 10) {
        return response.send(Utils.response(false, "length template_id is 10 ",null));
      }
      if (!start_date) {
        return response.send(Utils.response(false, "start_date can't null",null));
      }
      if (!logo_image) {
        return response.send(Utils.response(false, "logo_image can't null",null));
      }
      
      //if (preview == "N") {

      const file_url_img = `/einvoices_logo/${seller_comp_taxcode}`;
      const file_url_excel = `/resources/report/60/95/einvoices_template/${seller_comp_taxcode}`;
      let logo_width = 0, logo_height = 0;
      let file_path_logo = "", file_path_bg = "";

      if (logo_image) {
        file_path_logo = await Utils.putFileRandomNameRootPathOut(logo_image, file_url_img, "WETAXT");
        //file_path_bg = await Utils.putExcelRootPath(logo_image, file_url_img, "WETAXT");

        let savePath = await Helpers.appRoot(`resources${file_path_logo}`);
        const imagePath = savePath.replaceAll("\\","/");  //`${logo_image.tmpPath}`;

        // Use sharp to read the image and get its metadata (width and height)
        await sharp(imagePath)
          .metadata()
          .then((metadata) => {
            const { width, height } = metadata;
            logo_width = width;
            logo_height = height;
          })
          .catch((error) => {
            console.error('Error:', error);
          });


        if (logo_width > logo_height && logo_width > 100) {
          logo_width = 100;
          logo_height = 100 * logo_width / logo_height;
        }
        if (logo_height > logo_width && logo_height > 100) {
          logo_height = 100;
          logo_width = 100 * logo_height / logo_width;
        }

      }

      const para_value = {
        p_seller_comp_seller: seller_comp_taxcode,
        p_serial_no2: symbol_type,
        p_form_no: form_no,
        p_serial_no: serial_no,
        p_from_dt: start_date,
        p_end_dt: end_date || '',
        p_start_num: start_number,
        p_template_cd: template_id,
        p_url_img_logo: file_path_logo.replace("/assets", "assets"),
        p_url_img_bg: "",//file_path_bg,
        p_logo_width: logo_width,
        p_logo_height: logo_height,
        p_logo_start_col: "0.5",
        p_logo_start_row: "1.7",
      };

      const rtnValue = await DBService.ExecuteSQLBlob(
        `BEGIN ei_upd_template_comp (                     :p_seller_comp_seller,
                                                          :p_serial_no2,
                                                          :p_form_no,
                                                          :p_serial_no,
                                                          :p_from_dt,
                                                          :p_end_dt,
                                                          :p_start_num,
                                                          :p_template_cd,
                                                          :p_url_img_logo,
                                                          :p_url_img_bg,
                                                          :p_logo_width,
                                                          :p_logo_height,
                                                          :p_logo_start_row,
                                                          :p_logo_start_col,
                                                          :p_language, 
                                                          :p_crt_by, 
                                                          :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );

      if(rtnValue.p_rtn_cur[0].STATUS == "OK"){
        let EiExcels = new EiExcelTemplateHandler();
        let url_pdf = await EiExcels.getEinvoice(rtnValue.p_rtn_cur[0].PK, p_language, p_crt_by);
        //console.log("base64PDf  ", url_pdf);
        let req_value = {
          seller_comp_taxcode: seller_comp_taxcode,
          req_key: rtnValue.p_rtn_cur[0].PK,
          template: url_pdf
        }

        return response.send(Utils.response(true, "Send Company template was Successfully", req_value));
      
      }else
      {
        let req_value = {
          seller_comp_taxcode: seller_comp_taxcode,
          req_key: "",
          template: "",
          status_code: "001",
          status_name: rtnValue.p_rtn_cur[0].ERRCODE
        }
        return response.send(Utils.response(false, "Send Company template was Faile", req_value));
      }


      
    } catch (error) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendCompanyTemplate",
        CONTENT: error.message,
      });
      console.log(error);
      return response.send(Utils.response(false, error.message, null));
    }
  }

  async weTaxUpdateSendOrderInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { seller_tax_code, 
              form_no, 
              serial_no, 
              invoice_no, 
              info_update } = request.all();

      const para_value = {
        seller_tax_code,
        form_no,
        serial_no,
        invoice_no,
        buyer_comp_name: info_update.buyer_comp_name,
        buyer_taxcode: info_update.buyer_taxcode,
        buyer_tel: info_update.buyer_tel,
        buyer_address: info_update.buyer_address,
        buyer_cccd: info_update.buyer_cccd,
        buyer_email: info_update.buyer_email,
        buyer_email_cc: info_update.buyer_email_cc,
      };

      const rtnValue = await DBService.ExecuteSQLBlob(
        `BEGIN WETAX_UPD_ORDER_INFO (          
                    :seller_tax_code,
                    :form_no,
                    :serial_no,
                    :invoice_no,
                    :buyer_comp_name,
                    :buyer_taxcode,
                    :buyer_tel,
                    :buyer_address,
                    :buyer_cccd,
                    :buyer_email,
                    :buyer_email_cc,
                    :p_language, 
                    :p_crt_by, 
                    :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );
      console.log("rtnValue ", rtnValue);
      if(rtnValue?.p_rtn_cur?.[0])
      {
        let data_rep = {
          status_code : rtnValue.p_rtn_cur[0].STATUS_CD,
          status_name : rtnValue.p_rtn_cur[0].STATUS_NM }

        return response.send(Utils.response(rtnValue.p_rtn_cur[0].STATUS_CD == '000' ? true : false, rtnValue.p_rtn_cur[0].STATUS_NM, null));
      }
      else
      {
        // let data_rep = {
        //   status_code : rtnValue.p_rtn_cur[0].STATUS_CD,
        //   status_name : rtnValue.p_rtn_cur[0].STATUS_NM }
        return response.send(Utils.response(false, rtnValue?.p_rtn_cur?.[0]?.STATUS_NM, null));
      }
      
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxUpdateSendOrderInfo",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxCheckStausSendMail({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { invoice_date,
        seller_taxcode } = request.all();

      const para_amt_vat = {
        invoice_date: invoice_date,
        seller_taxcode: seller_taxcode,
      };
      const rtnValue_status = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_sendmail_inv_status (          
                                                        :invoice_date,
                                                        :seller_taxcode,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
        para_amt_vat,
        p_language,
        p_crt_by
      );
      let data_resutl = await this.convertKeysToLowerCase(rtnValue_status.p_rtn_cur);

      console.log("data_resutl  ", data_resutl);

      return response.send(Utils.response(true, `Successfully!`, data_resutl));
    } catch (error) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxUpdateSendOrderInfo",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxCheckInvoiceStatusFromTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // const authUserName = "GENUWIN"; // "GENUWIN";
      // const authPassword = "genuwin123"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";

      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";

      const { data } = request.all();
      // console.log("data  ", data);
      let rtnValue = [];
      let maCQT = "",
        maTBao = "",
        tenTBao = "",
        base64XMLCQT = "";
      for (let i = 0; i < data.length; i++) {
        //console.log("SSS ", url + data[i].trade_code);

        const agent = {
          Agent: {
            defaultPort: 443,
            protocol: "https:",
            options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
          },
        };
        // const res ;
        await Request.get(url + data[i].trade_code, {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        })
          .then(async (res) => {
            // console.log("res  ++===> ", res.data);

            if (!res.data.length) {
              return response.send(Utils.response(false, `No data found.`, null));
            }
            for (let j = 0; j < res.data.length; j++) {
              const items = res.data[j];
              for (let k = 0; k < items.length; k++) {
                // console.log("items[k].loaiTBao " + items[k].loaiTBao);
                if (items[k].loaiTBao == "10") {
                  maCQT = items[k].ndungTBao.maCQT;
                  base64XMLCQT = items[k].ndungTBao.base64XML;
                  const base64XML = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");

                  maTBao = items[k].loaiTBao;
                  tenTBao = items[k].tenTBao;
                  const para_value = {
                    trade_code: data[i].trade_code,
                    macqt: maCQT,
                    xml_sign: base64XML,
                  };
                  // const result = await DBService.ExecuteSQLBlob(
                  //     `BEGIN ei_upd_file_xml_v5(:trade_code,:macqt,:xml_sign,:p_language, :p_crt_by, :p_rtn_cur); END;`,
                  //     para_value,
                  //     p_language,
                  //     p_crt_by
                  // );
                } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {
                  maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                  tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
                  // const result = await DBService.callProcCursor(
                  //     "ei_upd_file_xml_v8", [para[i], maTBao, tenTBao],
                  //     p_language,
                  //     p_crt_by
                  // );
                } else if (items[k].loaiTBao == "15") {
                  tenTBao = items[k].tenTBao;
                  maTBao = items[k].loaiTBao;
                  // const result = await DBService.callProcCursor(
                  //     "ei_upd_file_xml_v9", [para[i], tenTBao],
                  //     p_language,
                  //     p_crt_by
                  // );
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
            return response.send(Utils.response(false, error.message, null));
          });

        rtnValue.push({
          trade_code: data[i].trade_code,
          mccqt: maCQT,
          inform_code: maTBao,
          inform_name: tenTBao,
          xml_tax_signed: base64XMLCQT,
          tax_code: data[i].tax_code,
          req_key: data[i].req_key,
        });
      }

      return response.send(
        Utils.response(true, `${data.length} invoices was update status from tax office.`, rtnValue)
      );

      // rtnValue.push({
      //     trade_code: para.trade_code[i],
      //     tax_confirmation_code: para.tei_einvoice_m_pk[i],
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // }
      // return response.send(
      //     Utils.response(
      //         true,
      //         `${para.trade_code.length} invoices was update status from tax office.`,
      //         rtnValue
      //     )
      // );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxCheckInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxExtractXMLContentGetDataDec(xml_content) {
    try {
      const templateTTChung = [
        "TDiep/DLieu/TBao/DLTBao",
        {
          PBan: "PBan",
          MSo: "MSo",
          Ten: "Ten",
          DDanh: "DDanh",
          TCQTCTren: "TCQTCTren",
          TCQT: "TCQT",
          MST: "MST",
          TNNT: "TNNT",
          Ngay: "Ngay",
          HTDKy: "HTDKy",
          TTXNCQT: "TTXNCQT",
          HThuc: "HThuc",
          MCCQT: "MCCQT",
          DDanh: "DDanh",
          CDanh: "CDanh",
        },
      ];

      const jsonBase64XML = await transform(xml_content, templateTTChung);
      // console.log("jsonTTChungjsonTTChung");
      // console.log("jsonTTChung  ", jsonBase64XML)
      if (jsonBase64XML.length > 0) {
        // console.log("jsonTTChungjsonTTChung");
        // console.log("base64CQT  ", jsonBase64XML[0].MCCQT)
        return jsonBase64XML[0].MCCQT;
      } else {
        return -1;
      }
    } catch (e) {
      console.log(e);
      // Utils.Logger({
      //     LVL: "error",
      //     MODULE: "EInvoiceController",
      //     FUNC: "weTaxExtractXMLContentGetDataDec",
      //     CONTENT: e.message,
      // });
      // return -1;
    }
  }

  async weTaxSendPosInvoiceToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
     
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/mttien";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const {
        tax_serial_number,
        seller_tax_code,
        sale_date,
        store_code,
        store_name,
        pos_no,
        invoice_xml_signed,
        req_key,
      } = request.all();
      console.log("weTaxSendPosInvoiceToTaxOffice   =========================== BEGIN =======================", )
      console.log("weTaxSendPosInvoiceToTaxOffice   tax_serial_number ", tax_serial_number )
      console.log("weTaxSendPosInvoiceToTaxOffice   seller_tax_code ",seller_tax_code )
      console.log("weTaxSendPosInvoiceToTaxOffice   sale_date ", sale_date )
      console.log("weTaxSendPosInvoiceToTaxOffice   store_code ", store_code )
      console.log("weTaxSendPosInvoiceToTaxOffice   pos_no ", pos_no )
      console.log("weTaxSendPosInvoiceToTaxOffice   invoice_xml_signed ", invoice_xml_signed)
      console.log("weTaxSendPosInvoiceToTaxOffice   req_key ", req_key)
      console.log("weTaxSendPosInvoiceToTaxOffice   =========================== END =======================", )

      // let json =  this.parseXmlToJson(invoice_xml_signed);

      const check_data =  await this.weTaxExtractPosXMLContent(invoice_xml_signed,
                                                      seller_tax_code,
                                                      sale_date,
                                                      tax_serial_number,
                                                      req_key,
                                                      store_code,
                                                      store_name,
                                                      pos_no,
                                                      p_language,
                                                      p_crt_by);

      //console.log("json  ", json);
      //  
      // console.log("json.TDiep.DLieu.HDon  ", json.TDiep.DLieu.HDon);

      if(check_data.STATUS == 'FAILE')
      {
        return response.send(Utils.response(false, `Send invoice to Tax Office was failure!`, null));
      }else if (check_data.STATUS == 'EXIT' )
      {
        return response.send(Utils.response(false, `The sign xml was send Tax Offiec`, null));
      }else if (check_data.STATUS == 'NOEXIT' )
      {
        return response.send(Utils.response(false, `Compay not yet register`, null));
      }

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      let trade_code = "";
      let maCQT = "";
      let maTBao = "";
      let tenTBao = "";
      let xml_tax_signed = "";
      let rtnValue = {};

      const res = await Request.post(
        url,
        { base64XML: Buffer.from(invoice_xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      trade_code = res.data.maGDich;
      console.log("trade_code   ", trade_code);
      if (trade_code) {
        const para_value = {
            tei_einvoice_ar_pk: check_data.PK,
            trade_code: trade_code
        };

        await DBService.ExecuteSQLBlob(
            `BEGIN ei_upd_tradecode_p_xml(
                            :tei_einvoice_ar_pk,
                            :trade_code,
                            :p_language, 
                            :p_crt_by, 
                            :p_rtn_cur); 
            END;`,
            para_value,
            p_language,
            p_crt_by
        );
      }
      await Utils._sleep(5);

      await Request.get(urlCheck + trade_code, {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }).then(async (res) => {
          console.log(" res  ", res.data);
          if (res.data.length) {
            for (let j = 0; j < res.data.length; j++) {
              const items = res.data[j];
              for (let k = 0; k < items.length; k++) {
                if(items[k].loaiTBao == "1"){
                  xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");
                }else if (items[k].loaiTBao == "8") {
                  maCQT = items[k].ndungTBao.maCQT;
                 
                  maTBao = items[k].loaiTBao;
                  tenTBao = items[k].tenTBao;
                } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "7") {
                  for(let invoice of items[k].ndungTBao.dsachLoiKTraDLieu)
                  {
                    
                  }

                  maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                  tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
                } 
              }
            }
          }

          rtnValue = {
            trade_code: trade_code,
            seller_tax_code: seller_tax_code,
            sale_date: sale_date,
            store_code: store_code,
            store_name: store_name,
            tax_serial_number: tax_serial_number,
            pos_no: pos_no,
            inform_code: maTBao,
            inform_name: tenTBao,
            mccqt: maCQT,
            xml_tax_signed: xml_tax_signed,
          };
        });
        console.log("rtnValue  ", rtnValue);
      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));

    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxSendPosInvoiceToTaxOffice2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
     
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/mttien";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      const {
        tax_serial_number,
        seller_tax_code,
        invoices
      } = request.all();

      let totalSuccess = 0;
      let totalFail = 0;
      let resArr = []


      for (let i = 0; i < invoices?.length; i++) {
        const element = invoices[i];

        const check_data =  await this.weTaxExtractPosXMLContent(element.invoice_xml_signed,
          seller_tax_code,
          element.sale_date,
          tax_serial_number,
          element.req_key,
          element.store_code,
          element.store_name,
          element.pos_no,
          p_language,
          p_crt_by);

          if(check_data.STATUS == 'FAILE')
          {
            resArr = [...resArr, {...element, status_name: `Send invoice to Tax Office was failure!`, status_code: '001'}]
            totalFail++;
            continue;
          }else if (check_data.STATUS == 'EXIT' )
          {
            resArr = [...resArr, {...element, status_name: `The sign xml was send to Tax Office`, status_code: '002'}]
            totalFail++;
            continue;
          }else if (check_data.STATUS == 'NOEXIT' )
          {  
            resArr = [...resArr, {...element, status_name: `Compay not yet register`, status_code: '003'}]
            totalFail++;
            continue;
          }

          let trade_code = "";
          const res = await Request.post(
            url,
            { base64XML: Buffer.from(element.invoice_xml_signed).toString("base64") },
            {
              agent,
              headers: {
                Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
              },
            }
          );
    
          trade_code = res?.data?.maGDich;
          console.log("trade_code   ", trade_code);
          totalSuccess++;
          resArr = [...resArr, {...element, trade_code, status_name: `Send to Tax Office succesfully`, status_code: '000'}]
          if (trade_code) {
            const para_value = {
                tei_einvoice_ar_pk: check_data.PK,
                trade_code: trade_code
            };
    
            await DBService.ExecuteSQLBlob(
                `BEGIN ei_upd_tradecode_p_xml(
                                :tei_einvoice_ar_pk,
                                :trade_code,
                                :p_language, 
                                :p_crt_by, 
                                :p_rtn_cur); 
                END;`,
                para_value,
                p_language,
                p_crt_by
            );
          }
         
      }
      this.newThreadCheckStatusinvoice(urlCheck, authUserName, authPassword,agent, resArr, seller_tax_code)
      return  response.send({...Utils.response(true, `Send invoice to Tax Office was Successfully!`, resArr, ), totalSuccess, totalFail});
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxSendPosInvoiceToTaxOffice2",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

 async newThreadCheckStatusinvoice(url, authUserName, authPassword,agent, resArr, seller_tax_code){
  if(!resArr?.length){
    return;
  }
  let statusList = [];
    setTimeout(() => {
      console.log('==========> newThreadCheckStatusinvoice');
      for (let i = 0; i < resArr?.length; i++) {
        const element = resArr[i];
        if(
          element?.trade_code
          )
          Request.get(url + element.trade_code, {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }).then((res) => {
            console.log(" res  ", res.data);
            let xml_tax_signed = '';
            let maCQT = '';
            let maTBao = '';
            let tenTBao = '';

            if (res.data.length) {
              for (let j = 0; j < res.data.length; j++) {
                const items = res.data[j];
                for (let k = 0; k < items.length; k++) {
                  if(items[k].loaiTBao == "1"){
                    xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");
                  }else if (items[k].loaiTBao == "8") {
                    maCQT = items[k].ndungTBao.maCQT;
                   
                    maTBao = items[k].loaiTBao;
                    tenTBao = items[k].tenTBao;
                  } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "7") {
                    // for(let invoice of items[k].ndungTBao.dsachLoiKTraDLieu)
                    // {
                    // }
                    maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                    tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
                  } 
                }
              }
            }

            statusList = [...statusList,  {
              req_key: element.req_key,
              trade_code: element?.trade_code,
              sale_date: element?.sale_date,
              store_code: element?.store_code,
              store_name: element?.store_name,
              pos_no: element?.pos_no,
              inform_code: maTBao,
              inform_name: tenTBao,
              mccqt: maCQT,
              xml_tax_signed: xml_tax_signed
            }]
    
           
          }).catch((err)=>{
            console.log('===> newThreadcheckStatusinvoice ', err);
          });
      }
// ------------------------------
        for (let i = 0; i < 5; i++) {
          Request.post('https://api.wetax.com.vn/api/wtx/v1/pos-invoice-delivery-status', {
            service_id: 'WTPTA003',
            seller_tax_code: seller_tax_code,
            info_send_invoices: statusList
          }, {
            headers: {
              Authorization: "Basic " + "bad056ce571e2f1459ced4f7ff4db6d493b6472026ac8a8997bc0c03625c8667",
            },
          }).then((res) =>{
              if (res.data?.status?.code == '200') {
                return;
              }
          }).catch((err)=> console.log('===> callback WeTax CheckStatusinvoice err ', err))

        }

    }, 10000);
  }
 
  async weTaxSendInvoiceToTaxOffice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      //const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon";

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const { invoices } = request.all();

      console.log("weTaxSendInvoiceToTaxOffice  invoices  ",invoices);
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      let rtnValue = [];
      let rtnValueTradecode = [];
      for (let i = 0; i < invoices.length; i++) {
        
                const masterInvoicePK = await this.weTaxExtractXMLContent(
                    invoices[i].xml_signed,
                    invoices[i].mail_to || '',
                    invoices[i].mail_cc || '',
                    invoices[i].invoice_type || '',
                    invoices[i].tr_type || '',
                    invoices[i].token_serial_number || '',
                    invoices[i].req_key || '',
                    invoices[i].invoice_form_symbol || '',
                    p_language,
                    p_crt_by
                );
                if (masterInvoicePK.PK == -1) {
                    console.log(`The issuer invoice has not register [${invoices[i].req_key}]`, invoices[i].xml_signed);
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "The issuer invoice has not register",
                    });
                    continue;
                } else if (masterInvoicePK.PK == 0) {
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "Duplicated data. This invoice already sent",
                    });
                    continue;
                } else if (masterInvoicePK.PK < -1) {
                    console.log(`invalid xml format [${invoices[i].req_key}]`, invoices[i].xml_signed);
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "Invalid xml format",
                    });
                    continue;
                }
              
              
        // ======================== tam thoi =========================
        const trade_code = await Request.post(
          url,
          { base64XML: Buffer.from(invoices[i].xml_signed).toString("base64") },
          {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }
        );

        const para_trade_code = {
              req_wt_key : masterInvoicePK.PK,
              trade_code : trade_code.data.maGDich
        };
        console.log("para_trade_code  ", para_trade_code);

        await DBService.ExecuteSQLBlob(
                  `BEGIN EI_UPD_TEI_WT_INVOICE_TRADECODE(
                                  :req_wt_key, 
                                  :trade_code,
                                  :p_language, 
                                  :p_crt_by, 
                                  :p_rtn_cur); 
                  END;`,
                  para_trade_code,
                  p_language,
                  p_crt_by
          );

       // console.log("res_op  ", res_op);

        rtnValueTradecode.push({
          req_key : invoices[i].req_key,
          req_wt_key : masterInvoicePK.PK,
          trade_code : trade_code.data.maGDich
        });
      }  

      await Utils._sleep(5);

      for(const tr_code of rtnValueTradecode)
      {
        let maTBao = "";
          let tenTBao = "";
          let maCQT = "";
          let xml_tax_signed = "";

        if(tr_code.trade_code)
        {
          
          await Request.get(urlCheck + tr_code.trade_code, {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }).then(async (res) => {
            //console.log("res ", res);
            //return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, res.data));
            if (res.data.length) {
              for (let j = 0; j < res.data.length; j++) {
                const items = res.data[j];
                for (let k = 0; k < items.length; k++) {
                  // console.log("items[k].loaiTBao " + items[k].loaiTBao);
                  //console.log("items  ", items[k]);
                  if (items[k].loaiTBao == "10") {

                    let xml_draft = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8").split('</TTChung><DLieu>');
                    xml_tax_signed ='<?xml version="1.0" encoding="UTF-8"?>'+ xml_draft[1].replace('</DLieu></TDiep>','');
                    maCQT = items[k].ndungTBao.maCQT;

                    //xml_tax_signed = 
                    maTBao = items[k].loaiTBao;
                    tenTBao = items[k].tenTBao;

                  } /*else if (items[k].loaiTBao == "1") {
                    xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");

                  }*/
                   else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {

                    maTBao = items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].maLoi;
                    tenTBao = items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].mtaLoi;

                  } else if (items[k].loaiTBao == "15") {
                    tenTBao = items[k].tenTBao;
                    maTBao = items[k].loaiTBao;
                  }
                }
              }
            }
          });
        }
        const para_status = {
          req_wt_key : masterInvoicePK.PK,
          maCQT : maCQT,
          xml_tax_signed : xml_tax_signed
          };

          const res_op = await DBService.ExecuteSQLBlob(
                    `BEGIN ET_UPD_TEI_WT_INVOICE_UP(
                                    :req_wt_key, 
                                    :maCQT,
                                    :xml_tax_signed,
                                    :p_language, 
                                    :p_crt_by, 
                                    :p_rtn_cur); 
                    END;`,
                    para_status,
                    p_language,
                    p_crt_by
            );
        
          rtnValue.push({
            req_key: tr_code.req_key,
            trade_code: tr_code.trade_code,
            inform_code: maTBao,
            inform_name: tenTBao,
            xml_tax_signed: xml_tax_signed,
            mcct: maCQT,
          });
      
      }

      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      console.log("e  ", e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async weTaxConvertInvoiceToXML({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { invoices,
        count_invoice,
        tax_code,
        order_date
      } = request.all();
      //  console.log(" invoices  ", list_invoice);
      //invoices = JSON.parse(invoices);
      let rtnXML = [];
      let count_inv = 0;
      let objInvoice_M = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              NLap: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
              MSTTCGP: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                DCTDTu: "",
                STKNHang: "",
                NNBSTKNHang: "",
                TNHang: "",
                Fax: "",
                Website: "",
                TTKhac: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                MKHang: "",
                SDThoai: "",
                DCTDTu: "",
                STKNHang: "",
                HVTNMHang: "",
                TNHang: "",
                TTKhac: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCThue: "",
                TgTThue: "",
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        },
      };
      if (invoices.length == undefined || invoices.length == 0) {
        return response.send(Utils.response(false, `Invalid json format!`,null));
      }

      for (let i = 0; i < invoices.length; i++) {
        //console.log("invoices:", invoices[i])

        if (invoices[i].form_no == 1) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng";
        } else if (invoices[i].form_no == 2) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng";
        } else if (invoices[i].form_no == 3) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công";
        } else if (invoices[i].form_no == 4) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia";
        } else if (invoices[i].form_no == 5) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng";
        } else if (invoices[i].form_no == 6) {
          objInvoice_M.HDon.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý";
        }
        objInvoice_M.HDon.DLHDon.TTChung.PBan = invoices[i].version;
        objInvoice_M.HDon.DLHDon.TTChung.KHMSHDon = invoices[i].form_no;
        objInvoice_M.HDon.DLHDon.TTChung.KHHDon = invoices[i].serial_no;
        objInvoice_M.HDon.DLHDon.TTChung.SHDon = invoices[i].invoice_no;
        objInvoice_M.HDon.DLHDon.TTChung.NLap = invoices[i].invoice_date;
        objInvoice_M.HDon.DLHDon.TTChung.DVTTe = invoices[i].currency;
        objInvoice_M.HDon.DLHDon.TTChung.TGia = invoices[i].ex_rate;
        objInvoice_M.HDon.DLHDon.TTChung.HTTToan = invoices[i].payment_method;
        objInvoice_M.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan = [];
        if (invoices[i].invoice_feature !== "0") {
          objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan.push({
            TCHDon: invoices[i].feature || "0",
            LHDCLQuan: invoices[i].invoice_type_relative || "0",
            KHMSHDCLQuan: invoices[i].form_no_relative || "",
            KHHDCLQuan: invoices[i].serial_no_relative || "",
            SHDCLQuan: invoices[i].invoice_no_relative || "",
            NLHDCLQuan: invoices[i].invoice_date_relative || "",
            GChu: invoices[i].description_relative || "",
          });
        }

        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Ten = invoices[i].seller_comp_name || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.MST = invoices[i].seller_taxcode || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DChi = invoices[i].seller_address || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.SDThoai = invoices[i].seller_phone || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.DCTDTu = invoices[i].seller_email || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.STKNHang = invoices[i].seller_bank_no || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.NNBSTKNHang = "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TNHang = invoices[i].seller_bank_name || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Fax = invoices[i].seller_fax || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.Website = invoices[i].seller_website || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NBan.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.NMua.Ten = invoices[i].buyer_comp_name || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MST = invoices[i].buyer_taxcode || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.SDThoai = invoices[i].buyer_phone || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DChi = invoices[i].buyer_address || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.MKHang = invoices[i].buyer_code || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.HVTNMHang = invoices[i].buyer_name || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.DCTDTu = invoices[i].buyer_email || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.STKNHang = invoices[i].buyer_bank_no || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TNHang = invoices[i].buyer_bank_name || "";
        objInvoice_M.HDon.DLHDon.NDHDon.NMua.TTKhac = "";

        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

        for (let k = 0; k < invoices[i].total_vat_list.length; k++) {
          objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
            TSuat: invoices[i].total_vat_list[k].sub_vat_rate || "0%",
            ThTien: invoices[i].total_vat_list[k].sub_amt || "0",
            TThue: invoices[i].total_vat_list[k].sub_amt_vat || "0",
          });
        }

        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoices[i].total_amt_no_vat || "0";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTThue = invoices[i].total_amt_vat || "0";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoices[i].total_amt_dc || "0";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoices[i].total_payment || "0";
        objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoices[i].total_payment.toString() || "0",
          invoices[i].currency
        );

        objInvoice_M.HDon.DSCKS.NBan = "";
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoices[i].detail_invoice.length; j++) {
          objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoices[i].detail_invoice[j].feature || "",
            STT: invoices[i].detail_invoice[j].seq || "",
            MHHDVu: invoices[i].detail_invoice[j].item_code || "",
            THHDVu: invoices[i].detail_invoice[j].item_name || "",
            DVTinh: invoices[i].detail_invoice[j].unit || "",
            SLuong: invoices[i].detail_invoice[j].quantity || "",
            DGia: invoices[i].detail_invoice[j].unit_price || "",
            TLCKhau: invoices[i].detail_invoice[j].dc_rate || "",
            STCKhau: invoices[i].detail_invoice[j].dc_amt || "",
            ThTien: invoices[i].detail_invoice[j].amount || "",
            TSuat: invoices[i].detail_invoice[j].vat_rate || "",
          });
        }
        count_inv++;
        //const id = uuid.v4();
        const id = "ID1";
        const xml = this.OBJtoXML(objInvoice_M);
        const xmlStr = xml.toString().replace("<DLHDon>", `<DLHDon Id=\'${id}\'>`);

        //console.log("xmlStr", xmlStr)
        rtnXML.push({ master_pk: invoices[i].master_pk, xml_data: xmlStr, sign_id: id });
      }

      return response.send(
        Utils.response(true, `Convert json to xml was successful. ${count_inv}/${invoices.length} `, rtnXML)
      );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxConvertInvoiceToXML",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  // end weTAX

  // e -invoice
  async generalXmlPosInvoiceView({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { list_invoice } = request.all();

      console.log("list_invoice ", list_invoice);
      let rtnXML = [];
      let objInvoice = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                NNBSTKNHang: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                HVTNMHang: "",
                CCCDan: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        }
      };

      for (let i = 0; i < list_invoice.length; i++) {
        const para_value = {
          p_tei_einvoice_m_pk: list_invoice[i].PK,
          p_user_id: list_invoice[i].USER_ID,
        };
        // console.log("para_value  ", para_value);

        const rtnValueMaster = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_m (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueMaster  ", rtnValueMaster);

        const rtnValueDetail = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_d (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueDetail  ", rtnValueDetail);

        const rtnValueVAT = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_vat (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueVAT  ", rtnValueVAT);

        const invoiceM = rtnValueMaster.p_rtn_cur[0];
        const invoiceD = rtnValueDetail.p_rtn_cur;
        const invoiceVAT = rtnValueVAT.p_rtn_cur;

        if (invoiceM.FORM_NO == 1) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 2) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 3) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 4) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 5) {
          objInvoice.HDon.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 6) {
          objInvoice.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
        }
        objInvoice.HDon.DLHDon.TTChung.PBan = invoiceM.VERSION;
        objInvoice.HDon.DLHDon.TTChung.KHMSHDon = invoiceM.FORM_NO;
        objInvoice.HDon.DLHDon.TTChung.KHHDon = invoiceM.SERIAL_NO;
        objInvoice.HDon.DLHDon.TTChung.SHDon = invoiceM.INVOICE_NO;
        objInvoice.HDon.DLHDon.TTChung.NLap = invoiceM.INVOICE_DATE;
        objInvoice.HDon.DLHDon.TTChung.DVTTe = invoiceM.CURRENCY;
        objInvoice.HDon.DLHDon.TTChung.TGia = invoiceM.EX_RATE;
        objInvoice.HDon.DLHDon.TTChung.HTTToan = invoiceM.PAYMENT_METHOD;
        objInvoice.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice.HDon.DLHDon.NDHDon.NBan.Ten = invoiceM.SELLER_NAME;
        objInvoice.HDon.DLHDon.NDHDon.NBan.MST = invoiceM.SELLER_TAXCODE;
        objInvoice.HDon.DLHDon.NDHDon.NBan.DChi = invoiceM.SELLER_ADDRESS;
        objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoiceM.SELLER_TEL;

        objInvoice.HDon.DLHDon.NDHDon.NMua.Ten = invoiceM.BUYER_COMP_NAME;
        objInvoice.HDon.DLHDon.NDHDon.NMua.MST = invoiceM.BUYER_TAXCODE;
        objInvoice.HDon.DLHDon.NDHDon.NMua.DChi = invoiceM.BUYER_ADDRESS;
        objInvoice.HDon.DLHDon.NDHDon.NMua.CCCDan = invoiceM.BUYER_CCCD;
        objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoiceM.BUYER_TEL;

        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoiceD.length; j++) {
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoiceD[j].TCHAT,
            STT: invoiceD[j].SEQ_DIS,
            MHHDVu: invoiceD[j].ITEM_CODE,
            THHDVu: invoiceD[j].ITEM_NAME,
            DVTinh: invoiceD[j].ITEM_UOM,
            SLuong: invoiceD[j].QTY,
            DGia: invoiceD[j].U_PRICE,
            TLCKhau: "", //invoiceD[j].dc_rate,
            STCKhau: "", //invoiceD[j].dc_amt,
            ThTien: invoiceD[j].NET_TR_AMT,
            TSuat: invoiceD[j].VAT_RATE,
          });
        }

        objInvoice.HDon.DLHDon.NDHDon.TToan = {};
        objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat = {};
        objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

        for (let j = 0; j < invoiceVAT.length; j++) {
          objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
            TSuat: invoiceVAT[j].SUB_VAT_RATE,
            ThTien: invoiceVAT[j].SUB_AMT,
            TThue: invoiceVAT[j].SUB_AMT_VAT,
          });
        }

        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoiceM.TOTAL_AMT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoiceM.TOTAL_VAT_AMT;

        objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoiceM.TOTAL_DC_AMT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoiceM.TOTAL_PAYMENT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoiceM.TOTAL_PAYMENT.toString(),
          invoiceM.CURRENCY
        );

        objInvoice.HDon.DSCKS.NBan = "";

        objInvoice.HDon.MCCQT = invoiceM.MCCQT;

        // objData.TDiep.DLieu.HDon.push(objInvoice);
        // objInvoice = {
        //   DLHDon: {
        //     TTChung: {
        //       PBan: "",
        //       THDon: "",
        //       KHMSHDon: "",
        //       KHHDon: "",
        //       SHDon: "",
        //       MHSo: "",
        //       NLap: "",
        //       NBKe: "",
        //       DVTTe: "",
        //       TGia: "",
        //       HTTToan: "",
        //     },
        //     NDHDon: {
        //       NBan: {
        //         Ten: "",
        //         MST: "",
        //         DChi: "",
        //         SDThoai: "",
        //         NNBSTKNHang: "",
        //       },
        //       NMua: {
        //         Ten: "",
        //         MST: "",
        //         DChi: "",
        //         SDThoai: "",
        //         HVTNMHang: "",
        //         CCCDan: "",
        //       },
        //       DSHHDVu: {},
        //       TToan: {
        //         THTTLTSuat: {
        //           LTSuat: {
        //             TSuat: "",
        //             ThTien: "",
        //             TThue: "",
        //           },
        //         },
        //         TgTCTHue: "",
        //         TgTThue: "",
        //         DSLPhi: {
        //           LPhi: {},
        //         },
        //         TTCKTMai: "",
        //         TgTTTBSo: "",
        //         TgTTTBChu: "",
        //       },
        //     },
        //   },
        //   DSCKS: {},
        // };
      }

      const id = uuid.v4();
      const xml = this.OBJtoXML(objInvoice);
      //const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
      const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id='ID1'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");
      rtnXML = {
        //tax_code: data.tax_code,
        //store_code: data.store_code,
        //store_name: data.store_name,
        //count_invoice_convert: invoices.length,
        id_signing: "ID1",
        xml_converted: xmlRemoveLine,
      };

      return response.send(Utils.response(true, `Convert json to xml was successful. `, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async generalXmlPosInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { tax_code, count_invoice, list_invoice } = request.all();

      console.log("list_invoice ", list_invoice);
      let rtnXML = [];
      let objInvoice = {
        DLHDon: {
          TTChung: {
            PBan: "",
            THDon: "",
            KHMSHDon: "",
            KHHDon: "",
            SHDon: "",
            MHSo: "",
            NLap: "",
            NBKe: "",
            DVTTe: "",
            TGia: "",
            HTTToan: "",
          },
          NDHDon: {
            NBan: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              NNBSTKNHang: "",
            },
            NMua: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              HVTNMHang: "",
              CCCDan: "",
            },
            DSHHDVu: {},
            TToan: {
              THTTLTSuat: {
                LTSuat: {
                  TSuat: "",
                  ThTien: "",
                  TThue: "",
                },
              },
              TgTCTHue: "",
              TgTThue: "",
              DSLPhi: {
                LPhi: {},
              },
              TTCKTMai: "",
              TgTTTBSo: "",
              TgTTTBChu: "",
            },
          },
        },
        DSCKS: {},
      };
      let objData = {
        TDiep: {
          DLieu: {
            HDon: [],
          },
          CKSNNT: {}
        },
      };
      for (let i = 0; i < list_invoice.length; i++) {
        const para_value = {
          p_tei_einvoice_m_pk: list_invoice[i].PK,
          p_user_id: list_invoice[i].USER_ID,
        };
        // console.log("para_value  ", para_value);

        const rtnValueMaster = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_m (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueMaster  ", rtnValueMaster);

        const rtnValueDetail = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_d (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueDetail  ", rtnValueDetail);

        const rtnValueVAT = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_vat (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueVAT  ", rtnValueVAT);

        const invoiceM = rtnValueMaster.p_rtn_cur[0];
        const invoiceD = rtnValueDetail.p_rtn_cur;
        const invoiceVAT = rtnValueVAT.p_rtn_cur;

        if (invoiceM.FORM_NO == 1) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 2) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 3) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 4) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 5) {
          objInvoice.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 6) {
          objInvoice.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
        }
        objInvoice.DLHDon.TTChung.PBan = invoiceM.VERSION;
        objInvoice.DLHDon.TTChung.KHMSHDon = invoiceM.FORM_NO;
        objInvoice.DLHDon.TTChung.KHHDon = invoiceM.SERIAL_NO;
        objInvoice.DLHDon.TTChung.SHDon = invoiceM.INVOICE_NO;
        objInvoice.DLHDon.TTChung.NLap = invoiceM.INVOICE_DATE;
        objInvoice.DLHDon.TTChung.DVTTe = invoiceM.CURRENCY;
        objInvoice.DLHDon.TTChung.TGia = invoiceM.EX_RATE;
        objInvoice.DLHDon.TTChung.HTTToan = invoiceM.PAYMENT_METHOD;
        objInvoice.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice.DLHDon.NDHDon.NBan.Ten = invoiceM.SELLER_NAME;
        objInvoice.DLHDon.NDHDon.NBan.MST = invoiceM.SELLER_TAXCODE;
        objInvoice.DLHDon.NDHDon.NBan.DChi = invoiceM.SELLER_ADDRESS;
        objInvoice.DLHDon.NDHDon.NBan.SDThoai = invoiceM.SELLER_TEL;

        objInvoice.DLHDon.NDHDon.NMua.Ten = invoiceM.BUYER_COMP_NAME;
        objInvoice.DLHDon.NDHDon.NMua.MST = invoiceM.BUYER_TAXCODE;
        objInvoice.DLHDon.NDHDon.NMua.DChi = invoiceM.BUYER_ADDRESS;
        objInvoice.DLHDon.NDHDon.NMua.CCCDan = invoiceM.BUYER_CCCD;
        objInvoice.DLHDon.NDHDon.NMua.SDThoai = invoiceM.BUYER_TEL;

        objInvoice.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoiceD.length; j++) {
          objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoiceD[j].TCHAT,
            STT: invoiceD[j].SEQ_DIS,
            MHHDVu: invoiceD[j].ITEM_CODE,
            THHDVu: invoiceD[j].ITEM_NAME,
            DVTinh: invoiceD[j].ITEM_UOM,
            SLuong: invoiceD[j].QTY,
            DGia: invoiceD[j].U_PRICE,
            TLCKhau: "", //invoiceD[j].dc_rate,
            STCKhau: "", //invoiceD[j].dc_amt,
            ThTien: invoiceD[j].NET_TR_AMT,
            TSuat: invoiceD[j].VAT_RATE,
          });
        }

        objInvoice.DLHDon.NDHDon.TToan = {};
        objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat = {};
        objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

        for (let j = 0; j < invoiceVAT.length; j++) {
          objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
            TSuat: invoiceVAT[j].SUB_VAT_RATE,
            ThTien: invoiceVAT[j].SUB_AMT,
            TThue: invoiceVAT[j].SUB_AMT_VAT,
          });
        }

        objInvoice.DLHDon.NDHDon.TToan.TgTCThue = invoiceM.TOTAL_AMT;
        objInvoice.DLHDon.NDHDon.TToan.TgTThue = invoiceM.TOTAL_VAT_AMT;

        objInvoice.DLHDon.NDHDon.TToan.TTCKTMai = invoiceM.TOTAL_DC_AMT;
        objInvoice.DLHDon.NDHDon.TToan.TgTTTBSo = invoiceM.TOTAL_PAYMENT;
        objInvoice.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoiceM.TOTAL_PAYMENT.toString(),
          invoiceM.CURRENCY
        );

        objInvoice.DSCKS.NBan = "";

        objInvoice.MCCQT = invoiceM.MCCQT;

        objData.TDiep.DLieu.HDon.push(objInvoice);
        objInvoice = {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                NNBSTKNHang: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                HVTNMHang: "",
                CCCDan: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        };
      }

      const id = uuid.v4();
      const xml = this.OBJtoXML(objData);
      //const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
      const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id='ID1'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");
      rtnXML = {
        //tax_code: data.tax_code,
        //store_code: data.store_code,
        //store_name: data.store_name,
        //count_invoice_convert: invoices.length,
        id_signing: "ID1",
        xml_converted: xmlRemoveLine,
      };

      return response.send(Utils.response(true, `Convert json to xml was successful. `, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async generalXmlInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { tax_code, count_invoice, list_invoice } = request.all();

      console.log("list_invoice ", list_invoice);
      let rtnXML = [];
      let objInvoice = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              NLap: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
              MSTTCGP: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                DCTDTu: "",
                STKNHang: "",
                NNBSTKNHang: "",
                TNHang: "",
                Fax: "",
                Website: "",
                TTKhac: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                MKHang: "",
                SDThoai: "",
                DCTDTu: "",
                HVTNMHang: "",
                TNHang: "",
                TTKhac: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCThue: "",
                TgTThue: "",
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        },
      };
      for (let i = 0; i < list_invoice.length; i++) {
        const para_value = {
          p_tei_einvoice_m_pk: list_invoice[i].PK,
          p_user_id: list_invoice[i].USER_ID,
        };
        // console.log("para_value  ", para_value);

        const rtnValueMaster = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_m (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueMaster  ", rtnValueMaster);

        const rtnValueDetail = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_d (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueDetail  ", rtnValueDetail);

        const rtnValueVAT = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_vat (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueVAT  ", rtnValueVAT);
        // console.log("rtnValueVAT  ", rtnValueVAT.p_rtn_cur);
        // console.log("rtnValueVAT  ", rtnValueVAT.p_rtn_cur[0]);

        let invoiceM = rtnValueMaster.p_rtn_cur[0];
        let invoiceD = rtnValueDetail.p_rtn_cur[0];
        let invoiceVAT = rtnValueVAT.p_rtn_cur[0];

        if (rtnValueVAT.p_rtn_cur[0] == undefined) {
          const rtnValueVAT1 = await DBService.ExecuteSQLBlob(
            `BEGIN ei_sel_einvoice_xml_vat1 (  :p_tei_einvoice_m_pk,
                                                        :p_user_id,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
            para_value,
            p_language,
            p_crt_by
          );
          // console.log("rtnValueVAT1  ", rtnValueVAT1);
          invoiceVAT = rtnValueVAT1.p_rtn_cur[0];
        }

        if (invoiceM.FORM_NO == 1) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng";
        } else if (invoiceM.FORM_NO == 2) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng";
        } else if (invoiceM.FORM_NO == 3) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công";
        } else if (invoiceM.FORM_NO == 4) {
          objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia";
        } else if (invoiceM.FORM_NO == 5) {
          objInvoice.HDon.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng";
        } else if (invoiceM.FORM_NO == 6) {
          objInvoice.HDon.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý";
        }
        objInvoice.HDon.DLHDon.TTChung.PBan = invoiceM.VERSION;
        objInvoice.HDon.DLHDon.TTChung.KHMSHDon = invoiceM.FORM_NO;
        objInvoice.HDon.DLHDon.TTChung.KHHDon = invoiceM.SERIAL_NO;
        objInvoice.HDon.DLHDon.TTChung.SHDon = invoiceM.INVOICE_NO;
        objInvoice.HDon.DLHDon.TTChung.NLap = invoiceM.INVOICE_DATE;
        objInvoice.HDon.DLHDon.TTChung.DVTTe = invoiceM.CURRENCY;
        objInvoice.HDon.DLHDon.TTChung.TGia = invoiceM.EX_RATE;
        objInvoice.HDon.DLHDon.TTChung.HTTToan = invoiceM.PAYMENT_METHOD;
        objInvoice.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice.HDon.DLHDon.NDHDon.NBan.Ten = invoiceM.SELLER_NAME;
        objInvoice.HDon.DLHDon.NDHDon.NBan.MST = invoiceM.SELLER_TAXCODE;
        objInvoice.HDon.DLHDon.NDHDon.NBan.DChi = invoiceM.SELLER_ADDRESS;
        objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoiceM.SELLER_TEL;
        objInvoice.HDon.DLHDon.NDHDon.NBan.DCTDTu = "";
        objInvoice.HDon.DLHDon.NDHDon.NBan.STKNHang = invoiceM.SELLER_ACCOUNTNO;
        objInvoice.HDon.DLHDon.NDHDon.NBan.NNBSTKNHang = "";
        objInvoice.HDon.DLHDon.NDHDon.NBan.TNHang = invoiceM.SELLER_ACCOUNTNAME;
        objInvoice.HDon.DLHDon.NDHDon.NBan.Fax = invoiceM.SELLER_FAX;
        objInvoice.HDon.DLHDon.NDHDon.NBan.Website = invoiceM.SELLER_WEBSITE;
        objInvoice.HDon.DLHDon.NDHDon.NBan.TTKhac = "";

        objInvoice.HDon.DLHDon.NDHDon.NMua.Ten = invoiceM.BUYER_COMP_NAME;
        objInvoice.HDon.DLHDon.NDHDon.NMua.MST = invoiceM.BUYER_TAXCODE;
        objInvoice.HDon.DLHDon.NDHDon.NMua.DChi = invoiceM.BUYER_ADDRESS;
        objInvoice.HDon.DLHDon.NDHDon.NMua.MKHang = invoiceM.BUYERLEGALCODE;
        objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoiceM.BUYER_TEL;
        objInvoice.HDon.DLHDon.NDHDon.NMua.DCTDTu = invoiceM.MAIL;
        objInvoice.HDon.DLHDon.NDHDon.NMua.HVTNMHang = invoiceM.BUYER;
        objInvoice.HDon.DLHDon.NDHDon.NMua.STKNHang = invoiceM.BUYER_ACCOUNTNO;
        objInvoice.HDon.DLHDon.NDHDon.NMua.TNHang = "";
        objInvoice.HDon.DLHDon.NDHDon.NMua.TTKhac = "";

        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoiceD.length; j++) {
          objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoiceD[j].TCHAT,
            STT: invoiceD[j].SEQ_DIS,
            MHHDVu: invoiceD[j].ITEM_CODE,
            THHDVu: invoiceD[j].ITEM_NAME,
            DVTinh: invoiceD[j].ITEM_UOM,
            SLuong: invoiceD[j].QTY,
            DGia: invoiceD[j].U_PRICE,
            TLCKhau: "", //invoiceD[j].dc_rate,
            STCKhau: "", //invoiceD[j].dc_amt,
            ThTien: invoiceD[j].NET_TR_AMT,
            TSuat: invoiceD[j].VAT_RATE,
          });
        }

        objInvoice.HDon.DLHDon.NDHDon.TToan = {};
        objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat = {};
        objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

        for (let j = 0; j < invoiceVAT.length; j++) {
          objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
            TSuat: invoiceVAT[j].SUB_VAT_RATE,
            ThTien: invoiceVAT[j].sub_amt,
            TThue: invoiceVAT[j].sub_amt_vat,
          });
        }

        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoiceM.TOTAL_AMT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoiceM.TOTAL_VAT_AMT;

        objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoiceM.TOTAL_DC_AMT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoiceM.TOTAL_PAYMENT;
        objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoiceM.TOTAL_PAYMENT.toString(),
          invoiceM.CURRENCY
        );

        objInvoice.HDon.DSCKS.NBan = "";

        //objInvoice.MCCQT = invoiceM.MCCQT;

        //objData.TDiep.DLieu.HDon.push(objInvoice);
        const id = uuid.v4();
        const xml = this.OBJtoXML(objInvoice);
        //const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
        const xmlId = xml.toString().replace("<DLHDon>", `<DLHDon Id='ID1'>`);
        const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");
        rtnXML.push({
          req_key: list_invoice[i].PK,
          xml: xmlRemoveLine,
          id_signing: "ID1",
        });
        // rtnXML = {
        //     //tax_code: data.tax_code,
        //     //store_code: data.store_code,
        //     //store_name: data.store_name,
        //     //count_invoice_convert: invoices.length,
        //     id_signing: "ID1",
        //     xml_converted: xmlRemoveLine
        // };
        objInvoice = {
          HDon: {
            DLHDon: {
              TTChung: {
                PBan: "",
                THDon: "",
                KHMSHDon: "",
                KHHDon: "",
                SHDon: "",
                NLap: "",
                DVTTe: "",
                TGia: "",
                HTTToan: "",
                MSTTCGP: "",
              },
              NDHDon: {
                NBan: {
                  Ten: "",
                  MST: "",
                  DChi: "",
                  SDThoai: "",
                  DCTDTu: "",
                  STKNHang: "",
                  NNBSTKNHang: "",
                  TNHang: "",
                  Fax: "",
                  Website: "",
                  TTKhac: "",
                },
                NMua: {
                  Ten: "",
                  MST: "",
                  DChi: "",
                  MKHang: "",
                  SDThoai: "",
                  DCTDTu: "",
                  HVTNMHang: "",
                  TNHang: "",
                  TTKhac: "",
                },
                DSHHDVu: {},
                TToan: {
                  THTTLTSuat: {
                    LTSuat: {
                      TSuat: "",
                      ThTien: "",
                      TThue: "",
                    },
                  },
                  TgTCThue: "",
                  TgTThue: "",
                  TTCKTMai: "",
                  TgTTTBSo: "",
                  TgTTTBChu: "",
                },
              },
            },
            DSCKS: {},
          },
        };
      }

      return response.send(Utils.response(true, `Convert json to xml was successful. `, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async sendInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const authUserName = "GENUWIN"; // "GENUWIN";
      //const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      const authPassword = "genuwin123"; // "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      //const url = "http://118.71.250.233/ftvan-hddt/hdon/cmahdon";
      const { invoices } = request.all();

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      let rtnValue = [];
      for (let i = 0; i < invoices.length; i++) {
        // ======================== tam thoi =========================
        const trade_code = await Request.post(
          url,
          { base64XML: Buffer.from(invoices[i].xml_signed).toString("base64") },
          {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }
        );

        const para_value = {
          req_key: invoices[i].req_key,
          trade_code: trade_code.data.maGDich,
          xml_signed: invoices[i].xml_signed,
          sign_by: invoices[i].sign_by,
        };

        await DBService.ExecuteSQLBlob(
          `BEGIN EI_UPDATE_TRADE_CODE(
                                    :req_key,
                                    :trade_code,
                                    :xml_signed,
                                    :sign_by,
                                    :p_language, 
                                    :p_crt_by, 
                                    :p_rtn_cur); 
                    END;`,
          para_value,
          p_language,
          p_crt_by
        );

        const res_send_mail = await this.sendMailToCustomerEPort(trade_code.data.maGDich, p_language, p_crt_by);

        rtnValue.push({
          req_key: invoices[i].req_key,
          trade_code: trade_code.data.maGDich,
        });
      }
      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async sendPosInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/mttien";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const { data } = request.all();
      //console.log("data  ", data);
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      let trade_code = "";
      let maCQT = "";
      let maTBao = "";
      let tenTBao = "";
      let xml_tax_signed = "";
      let rtnValue = {};

      const res = await Request.post(
        url,
        { base64XML: Buffer.from(data.invoice_xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      trade_code = res.data.maGDich;
      //
      await Request.get(urlCheck + trade_code, {
        agent,
        headers: {
          Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
        },
      }).then(async (res) => {
        if (res.data.length) {
          for (let j = 0; j < res.data.length; j++) {
            const items = res.data[j];
            for (let k = 0; k < items.length; k++) {
              // console.log("items[k].loaiTBao " + items[k].loaiTBao);
              if (items[k].loaiTBao == "10") {
                maCQT = items[k].ndungTBao.maCQT;
                xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");
                maTBao = items[k].loaiTBao;
                tenTBao = items[k].tenTBao;
              } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {
                maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
              } else if (items[k].loaiTBao == "15") {
                tenTBao = items[k].tenTBao;
                maTBao = items[k].loaiTBao;
              }
            }
          }
        }
      });
      for (let i = 0; i < data.list_invoice.length; i++) {
        let xml_signed = await this.generalXmlPosInvoiceIn(data.list_invoice[i].PK, data.list_invoice[i].USER_ID, p_language, p_crt_by);
        console.log("xml_signed  ", xml_signed)
        const para_value = {
          req_key: data.list_invoice[i].PK,
          trade_code: trade_code,
          xml_signed: xml_signed,
          sign_by: data.sign_by,
        };

        await DBService.ExecuteSQLBlob(
          `BEGIN EI_UPDATE_TRADE_CODE(
                                    :req_key,
                                    :trade_code,
                                    :xml_signed,
                                    :sign_by,
                                    :p_language, 
                                    :p_crt_by, 
                                    :p_rtn_cur); 
                    END;`,
          para_value,
          p_language,
          p_crt_by
        );
      }


      rtnValue = {
        trade_code: trade_code,
        seller_tax_code: data.seller_tax_code,
        sale_date: data.sale_date,
        store_code: data.store_code,
        store_name: data.store_name,
        tax_serial_number: data.tax_serial_number,
        pos_no: data.pos_no,
        inform_code: maTBao,
        inform_name: tenTBao,
        mccqt: maCQT,
        xml_tax_signed: xml_tax_signed,
      };

      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));

    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async checkInvoiceStatus({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      // let url = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      // const authUserName = "GENUWIN"; // "GENUWIN";
      // const authPassword = "genuwin123"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";

      const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "e_GX4v@"; // "e_GX4v@";

      const { data } = request.all();
      // console.log("data  ", data);
      let rtnValue = [];
      let maCQT = "",
        maTBao = "",
        tenTBao = "",
        base64XMLCQT = "";
      for (let i = 0; i < data.length; i++) {
        //console.log("SSS ", url + data[i].trade_code);

        const agent = {
          Agent: {
            defaultPort: 443,
            protocol: "https:",
            options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
          },
        };
        // const res ;
        await Request.get(url + data[i].trade_code, {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        })
          .then(async (res) => {
            // console.log("res  ++===> ", res.data);

            if (!res.data.length) {
              return response.send(Utils.response(false, `no data found.`));
            }
            for (let j = 0; j < res.data.length; j++) {
              const items = res.data[j];
              for (let k = 0; k < items.length; k++) {
                // console.log("items[k].loaiTBao " + items[k].loaiTBao);
                if (items[k].loaiTBao == "10") {
                  maCQT = items[k].ndungTBao.maCQT;
                  base64XMLCQT = items[k].ndungTBao.base64XML;
                  const base64XML = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");

                  maTBao = items[k].loaiTBao;
                  tenTBao = items[k].tenTBao;
                  const para_value = {
                    trade_code: data[i].trade_code,
                    macqt: maCQT,
                    xml_sign: base64XML,
                  };
                  const result = await DBService.ExecuteSQLBlob(
                    `BEGIN ei_upd_file_xml_v5(:trade_code,:macqt,:xml_sign,:p_language, :p_crt_by, :p_rtn_cur); END;`,
                    para_value,
                    p_language,
                    p_crt_by
                  );
                } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {
                  maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                  tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
                  const result = await DBService.callProcCursor(
                    "ei_upd_file_xml_v8",
                    [para[i], maTBao, tenTBao],
                    p_language,
                    p_crt_by
                  );
                } else if (items[k].loaiTBao == "15") {
                  tenTBao = items[k].tenTBao;
                  maTBao = items[k].loaiTBao;
                  const result = await DBService.callProcCursor(
                    "ei_upd_file_xml_v9",
                    [para[i], tenTBao],
                    p_language,
                    p_crt_by
                  );
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
            return response.send(Utils.response(false, `e-Signing XML is faile !!`, error));
          });

        rtnValue.push({
          trade_code: data[i].trade_code,
          mccqt: maCQT,
          inform_code: maTBao,
          inform_name: tenTBao,
          base64XML: base64XMLCQT,
          tax_code: data[i].tax_code,
          erp_declaration_m_pk: data[i].erp_declaration_m_pk,
        });
      }

      return response.send(
        Utils.response(true, `${data.length} invoices was update status from tax office.`, rtnValue)
      );

      // rtnValue.push({
      //     trade_code: para.trade_code[i],
      //     tax_confirmation_code: para.tei_einvoice_m_pk[i],
      //     inform_code: maTBao,
      //     inform_name: tenTBao,
      // });
      // }
      // return response.send(
      //     Utils.response(
      //         true,
      //         `${para.trade_code.length} invoices was update status from tax office.`,
      //         rtnValue
      //     )
      // );
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendMailAt({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { data } = request.all();

      console.log(data);

      let para_value_mail = {
        p_tei_einvoice_m_pk: data.req_key, //"4090",// 
        p_tco_company_pk: data.tei_company_pk,
      };
      let data_mail = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_data_send_mail_3(
                          :p_tei_einvoice_m_pk, 
                          :p_tco_company_pk, 
                          :p_language, 
                          :p_crt_by, 
                          :p_rtn_cur
                      ); END;`,
        para_value_mail,
        p_language,
        p_crt_by
      );

      console.log(data_mail);
      if (data_mail.p_rtn_cur.length > 0) {
        for (const invoice of data_mail.p_rtn_cur) {
          let EiExcels = new EiExcelHandlerAuto();
          let url_pdf1 = await EiExcels.getEinvoice(invoice.PK, p_language, p_crt_by);
          console.log("url_pdf1  ", url_pdf1);

          let re_url_xml = await Request.get(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + invoice.CQT_MAGD + "&proc=" + "EI_SEL_XML_EINVOICE" + "&token="); //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE" );
          let url_xml = re_url_xml.data;
          console.log("base64XXML  ", url_xml);

          const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
            mail_to: invoice.EMAIL_ADDRESS,
            cc_to: invoice.EMAIL_ADDRESS_CC,
            subject: invoice.SUBJECT,
            body: invoice.BODY_1_MAIL + invoice.BODY_2_MAIL,
            attachfile1: url_pdf1,
            attachfile2: url_xml,
            filename1: invoice.FILENAME1,
            filename2: invoice.FILENAME2,
          });
          console.log("res_send_mail  ", res_send_mail);

          if (res_send_mail.data.success) {

            let para_end_mail = {
              p_tei_einvoice_m_pk: invoice.PK,
              p_email_address: invoice.EMAIL_ADDRESS,
              p_email_address_cc: invoice.EMAIL_ADDRESS_CC,
            };
            await DBService.ExecuteSQLBlob(
              `BEGIN EI_UPD_6095100_2(
                                :p_tei_einvoice_m_pk, 
                                :p_email_address, 
                                :p_email_address_cc, 
                                :p_language, 
                                :p_crt_by, 
                                :p_rtn_cur
                            ); END;`,
              para_end_mail,
              p_language,
              p_crt_by
            );
          }
        }
        return response.send(
          Utils.response(true, `Send mail customer was suscess`)
        );
      } else {
        return response.send(
          Utils.response(false, `Send mail customer was faile`)
        );
      }
    } catch (error) {
      console.log("res_send_mail error  ", error);
    }
  }

  async sendMailToCustomer(tei_wt_sale_bill_pk, data_invoice, p_language, p_crt_by) {
    try {
      //console.log("sSSSS ", tei_wt_sale_bill_pk);
      let EiExcels = new EiPosExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(tei_wt_sale_bill_pk, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      let re_url_xml = await Request.get(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + tei_wt_sale_bill_pk + "&proc=" + "EI_SEL_XML_POS_EINVOICE" + "&token="); //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE" );
      let url_xml = re_url_xml.data;
      console.log("base64XXML  ", url_xml);

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
                                            <b>       ${data_invoice.total_payment}</b>
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
                                            <b>       ${data_invoice.total_payment}</b>
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
                                </body>
                            </html>
                            `;

      console.log("sSSSS4 ", tei_wt_sale_bill_pk);

      const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
        mail_to: data_invoice.buyer_email,
        cc_to: data_invoice.buyer_email_cc,
        subject: subject,
        body: body,
        attachfile1: url_xml,
        attachfile2: url_pdf,
        filename1: data_invoice.mccqt + ".xml",
        filename2: data_invoice.mccqt + ".pdf",
      });
      //console.log("res_send_mail  ", res_send_mail);
      return { res_send_mail, subject, body };
    } catch (error) {
      //console.log("res_send_mail error  ", error);
    }
  }

  async sendMailToCustomerWhenCancelEinvoice(data_invoice,
    p_language,
    p_crt_by) {
    try {

      let EiExcels = new EiExcelHandlerAuto();
      let url_pdf1 = await EiExcels.getEinvoice(data_invoice.pk, p_language, p_crt_by);
      console.log("url_pdf1  ", url_pdf1);

      let EiExcels1 = new EiExcel04SS2Handler();
      let url_pdf2 = await EiExcels1.getEinvoice(data_invoice.pk, p_language, p_crt_by);
      console.log("url_pdf2  ", url_pdf2);


      const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
        mail_to: data_invoice.buyer_email,
        cc_to: data_invoice.buyer_email_cc,
        subject: data_invoice.subject,
        body: data_invoice.body,
        attachfile1: url_pdf1,
        attachfile2: url_pdf2,
        filename1: data_invoice.filename1,
        filename2: data_invoice.filename2,
      });
      console.log("res_send_mail  ", res_send_mail);
      return { res_send_mail };
    } catch (error) {
      console.log("res_send_mail error  ", error);
    }
  }

  async sendMailInvalidInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const { data } = request.all();

      // console.log(data);

      let para_value_mail = {
        p_tei_einvoice_m_pk: data.req_key, //"4090",// 
        p_tco_company_pk: data.tei_company_pk,
      };
      let data_mail = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_data_send_mail_2(
                          :p_tei_einvoice_m_pk, 
                          :p_tco_company_pk, 
                          :p_language, 
                          :p_crt_by, 
                          :p_rtn_cur
                      ); END;`,
        para_value_mail,
        p_language,
        p_crt_by
      );
      // console.log(data_mail.p_rtn_cur);
      // console.log(data_mail.p_rtn_cur.length);

      if (data_mail.p_rtn_cur.length > 0) {
        if (data_mail.p_rtn_cur[0].EI_STATUS == "5") {
          let EiExcels = new EiExcelHandlerAuto();
          let url_pdf1 = await EiExcels.getEinvoice(data.req_key, p_language, p_crt_by);
          console.log("url_pdf1  ", url_pdf1);

          let EiExcels1 = new EiExcel04SS2Handler();
          let url_pdf2 = await EiExcels1.getEinvoice(data.req_key, p_language, p_crt_by);
          console.log("url_pdf2  ", url_pdf2);


          const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
            mail_to: data_mail.p_rtn_cur[0].EMAIL_ADDRESS,
            cc_to: data_mail.p_rtn_cur[0].EMAIL_ADDRESS_CC,
            subject: data_mail.p_rtn_cur[0].SUBJECT,
            body: data_mail.p_rtn_cur[0].BODY_1_MAIL,
            attachfile1: url_pdf1,
            attachfile2: url_pdf2,
            filename1: data_mail.p_rtn_cur[0].FILENAME2,
            filename2: data_mail.p_rtn_cur[0].FILENAME1,
          });
          console.log("res_send_mail  ", res_send_mail);

          if (res_send_mail.data.success) {
            let rtnValue = {
              send_date: res_send_mail.data.data.date_send,
              send_time: res_send_mail.data.data.time_send,
              mail_form: res_send_mail.data.data.mail_from,
              mail_to: res_send_mail.data.data.mail_to,
              mail_to_cc: res_send_mail.data.data.mail_to_cc,
            };

            return response.send(
              Utils.response(true, `Sending mail customer was suscce`, rtnValue)
            );
          }
          else {
            return response.send(
              Utils.response(false, `Send mail customer was faile`)
            );
          }
        }
        else {
          // let EiExcels = new EiExcelHandlerAuto();
          // let url_pdf1 = await EiExcels.getEinvoice(data.req_key, p_language, p_crt_by);
          // console.log("url_pdf1  ", url_pdf1);

          let EiExcels1 = new EiExcel04SS2Handler();
          let url_pdf2 = await EiExcels1.getEinvoice(data.req_key, p_language, p_crt_by);
          console.log("url_pdf2  ", url_pdf2);


          const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
            mail_to: data_mail.p_rtn_cur[0].EMAIL_ADDRESS,
            cc_to: data_mail.p_rtn_cur[0].EMAIL_ADDRESS_CC,
            subject: data_mail.p_rtn_cur[0].SUBJECT,
            body: data_mail.p_rtn_cur[0].BODY_1_MAIL,
            attachfile1: url_pdf2,
            //attachfile2: url_pdf2,
            filename1: data_mail.p_rtn_cur[0].FILENAME1,
            //filename2: data_mail.p_rtn_cur[0].FILENAME1,
          });
          console.log("res_send_mail  ", res_send_mail);

          if (res_send_mail.data.success) {
            let rtnValue = {
              send_date: res_send_mail.data.data.date_send,
              send_time: res_send_mail.data.data.time_send,
              mail_form: res_send_mail.data.data.mail_from,
              mail_to: res_send_mail.data.data.mail_to,
              mail_to_cc: res_send_mail.data.data.mail_to_cc,
            };

            return response.send(
              Utils.response(true, `Sending mail customer was suscce`, rtnValue)
            );
          }
          else {
            return response.send(
              Utils.response(false, `Send mail customer was faile`)
            );
          }
        }

      } else {
        return response.send(
          Utils.response(true, `The origin invoice not yet send customer`)
        );
      }
      //if()


    } catch (error) {
      console.log("res_send_mail error  ", error);
    }
  }

  async sendMailToCustomerEPort(trade_code, p_language, p_crt_by) {
    try {
      const para_inv_st = {
        trade_code: trade_code,
      };
      const rtnValue_VAT = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_get_email_cus (          
                                                        :trade_code,
                                                        :p_language, 
                                                        :p_crt_by, 
                                                        :p_rtn_cur); END;`,
        para_inv_st,
        p_language,
        p_crt_by
      );

      console.log("rtnValue_VAT  ", rtnValue_VAT);

      let EiExcels = new EiExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(trade_code, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      let re_url_xml = await Request.get(
        APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + trade_code + "&proc=" + "EI_SEL_XML_EINVOICE" + "&token="
      ); //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE" );
      let url_xml = re_url_xml.data;
      console.log("base64XXML  ", url_xml);

      // let subject = `${data.data_invoice.seller_comp_name}[Thông báo phát hành HĐĐT][${data.data_invoice.form_no}][${data.data_invoice.serial_no}][${data.data_invoice.invoice_no}]`;
      // let body = `<html>
      //                 <body>
      //                     <div id="page">
      //                         <div id="d2">
      //                             <p>Dear: ${data.data_invoice.buyer_comp_name}
      //                                 <br />
      //                                 <br />${data.data_invoice.seller_comp_name}.
      //                                 <br />            Trân trọng cảm ơn Quý khách hàng đã sử dụng sản phẩm của chúng tôi.
      //                                 <br/> Chúng tôi đã
      //                                 <b>PHÁT HÀNH </b> hóa đơn điện tử với các thông tin như sau:
      //                                 <br/>- Mẫu số: ${data.data_invoice.form_no}
      //                                 <br/>- Ký hiệu:
      //                                 <b>${data.data_invoice.serial_no}</b>
      //                                 <br/>- Số hóa đơn:
      //                                 <b>${data.data_invoice.invoice_no}</b>
      //                                 <br/>- Tổng thanh toán:
      //                                 <b>       ${data.data_invoice.total_payment}</b>
      //                                 <br />- Link download file PDF:
      //                                 <a href=${url_pdf}>Tải file PDF</a>
      //                                 <br />- Link download file XML:
      //                                 <a href=${url_xml}>Tải file XML</a>
      //                                 <br />
      //                             </div>
      //                             <br/>
      //                             <div id="d6">
      //                                 <p>
      //                                     <i>* Xin lưu ý: Đây là email gửi tự động từ hệ thống, vui lòng không trả lời về địa chỉ email này</i>
      //                                     <br />
      //                                     <i>Cám ơn sự hợp tác. </i>
      //                                     <br />
      //                             --------------------------------------------------------------------------

      //                                 </p>
      //                             </div>
      //                             <div id="d7"> Would like to send you our warmest greetings and most sincere thanks for choosing our product.
      //                                 <br/> We
      //                                 <b>issued </b> your e-invoice with the information as below:
      //                                 <br/>- Form No:
      //                                 <b>${data.data_invoice.form_no}</b>
      //                                 <br/>- Serial:
      //                                 <b>${data.data_invoice.serial_no}</b>
      //                                 <br/>- Invoice No:
      //                                 <b>${data.data_invoice.invoice_no}</b>
      //                                 <br/>- Total amount :
      //                                 <b>       ${data.data_invoice.total_payment}</b>
      //                                 <br />- Download file PDF link:
      //                                 <a href=${url_pdf}>Download file PDF</a>
      //                                 <br />- Download file XML link:
      //                                 <a href=${url_xml}>Download file XML</a>
      //                                 <br />
      //                             </p>
      //                         </div>
      //                         <div id="d8">
      //                             <p>
      //                                 <br/>* Note: This is an automatic email. Please do not feedback to this email.
      //                                 <br/>
      //                             Thank you for your corporation!

      //                             </p>
      //                         </div>
      //                     </body>
      //                 </html>
      //                 `;
      // const res_send_mail = await Request.post(EINVOICE_API_SEND_MAIL, {
      //     mail_to: data.data_invoice.buyer_email,
      //     cc_to: data.data_invoice.buyer_email_cc,
      //     subject: subject,
      //     body: body,
      //     attachfile1: url_xml,
      //     attachfile2: url_pdf,
      //     filename1: data.data_invoice.mccqt + ".xml",
      //     filename2: data.data_invoice.mccqt + ".pdf",
      // });
      // console.log("res_send_mail  ", res_send_mail);
      // return { res_send_mail, subject, body}

      return "";
    } catch (error) {
      console.log("error  ", error);
    }
  }

  async viewPDFEPortal({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, tei_wt_sale_bill_pk } = request.all();

      //  console.log("para ", para);

      let EiExcels = new EiExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(tei_wt_sale_bill_pk, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFTemplateEPortal({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, data } = request.all();

      console.log("data ", data);

      let EiExcels = new EiExcelTemplateHandler();
      let url_pdf = await EiExcels.getEinvoice(data, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFEinvoiceBBEPortal({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { tei_einvoice_m_pk_row } = request.all();


      let EiExcels = new EiExcel04SS2Handler();
      let url_pdf = await EiExcels.getEinvoice(tei_einvoice_m_pk_row, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDFEinvoiceBBReplaceEPortal({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { tei_einvoice_m_pk_row } = request.all();


      let EiExcels = new EiExcel04SS3Handler();
      let url_pdf = await EiExcels.getEinvoice(tei_einvoice_m_pk_row, p_language, p_crt_by);
      console.log("base64PDf  ", url_pdf);

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async generalXmlPosInvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { tax_code, count_invoice, list_invoice } = request.all();

      console.log("list_invoice ", list_invoice);
      let rtnXML = [];
      let objInvoice = {
        DLHDon: {
          TTChung: {
            PBan: "",
            THDon: "",
            KHMSHDon: "",
            KHHDon: "",
            SHDon: "",
            MHSo: "",
            NLap: "",
            NBKe: "",
            DVTTe: "",
            TGia: "",
            HTTToan: "",
          },
          NDHDon: {
            NBan: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              NNBSTKNHang: "",
            },
            NMua: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              HVTNMHang: "",
              CCCDan: "",
            },
            DSHHDVu: {},
            TToan: {
              THTTLTSuat: {
                LTSuat: {
                  TSuat: "",
                  ThTien: "",
                  TThue: "",
                },
              },
              TgTCTHue: "",
              TgTThue: "",
              DSLPhi: {
                LPhi: {},
              },
              TTCKTMai: "",
              TgTTTBSo: "",
              TgTTTBChu: "",
            },
          },
        },
        DSCKS: {},
      };
      let objData = {
        TDiep: {
          DLieu: {
            HDon: [],
          },
          CKSNNT: {}
        },
      };


      for (let i = 0; i < list_invoice.length; i++) {
        const para_value = {
          p_tei_einvoice_m_pk: list_invoice[i].PK,
          p_user_id: list_invoice[i].USER_ID,
        };
        // console.log("para_value  ", para_value);

        const rtnValueMaster = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_m (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        // console.log("rtnValueMaster  ", rtnValueMaster);

        const rtnValueDetail = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_d (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueDetail  ", rtnValueDetail);

        const rtnValueVAT = await DBService.ExecuteSQLBlob(
          `BEGIN ei_sel_einvoice_xml_vat (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
          para_value,
          p_language,
          p_crt_by
        );

        //console.log("rtnValueVAT  ", rtnValueVAT);

        const invoiceM = rtnValueMaster.p_rtn_cur[0];
        const invoiceD = rtnValueDetail.p_rtn_cur;
        const invoiceVAT = rtnValueVAT.p_rtn_cur;

        if (invoiceM.FORM_NO == 1) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 2) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 3) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 4) {
          objInvoice.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 5) {
          objInvoice.DLHDon.TTChung.THDon =
            "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
        } else if (invoiceM.FORM_NO == 6) {
          objInvoice.DLHDon.TTChung.THDon =
            "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
        }
        objInvoice.DLHDon.TTChung.PBan = invoiceM.VERSION;
        objInvoice.DLHDon.TTChung.KHMSHDon = invoiceM.FORM_NO;
        objInvoice.DLHDon.TTChung.KHHDon = invoiceM.SERIAL_NO;
        objInvoice.DLHDon.TTChung.SHDon = invoiceM.INVOICE_NO;
        objInvoice.DLHDon.TTChung.NLap = invoiceM.INVOICE_DATE;
        objInvoice.DLHDon.TTChung.DVTTe = invoiceM.CURRENCY;
        objInvoice.DLHDon.TTChung.TGia = invoiceM.EX_RATE;
        objInvoice.DLHDon.TTChung.HTTToan = invoiceM.PAYMENT_METHOD;
        objInvoice.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

        objInvoice.DLHDon.NDHDon.NBan.Ten = invoiceM.SELLER_NAME;
        objInvoice.DLHDon.NDHDon.NBan.MST = invoiceM.SELLER_TAXCODE;
        objInvoice.DLHDon.NDHDon.NBan.DChi = invoiceM.SELLER_ADDRESS;
        objInvoice.DLHDon.NDHDon.NBan.SDThoai = invoiceM.SELLER_TEL;

        objInvoice.DLHDon.NDHDon.NMua.Ten = invoiceM.BUYER_COMP_NAME;
        objInvoice.DLHDon.NDHDon.NMua.MST = invoiceM.BUYER_TAXCODE;
        objInvoice.DLHDon.NDHDon.NMua.DChi = invoiceM.BUYER_ADDRESS;
        objInvoice.DLHDon.NDHDon.NMua.CCCDan = invoiceM.BUYER_CCCD;
        objInvoice.DLHDon.NDHDon.NMua.SDThoai = invoiceM.BUYER_TEL;

        objInvoice.DLHDon.NDHDon.DSHHDVu = [];

        objInvoice.DLHDon.NDHDon.DSHHDVu = {};
        objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

        for (let j = 0; j < invoiceD.length; j++) {
          objInvoice.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
            TChat: invoiceD[j].TCHAT,
            STT: invoiceD[j].SEQ_DIS,
            MHHDVu: invoiceD[j].ITEM_CODE,
            THHDVu: invoiceD[j].ITEM_NAME,
            DVTinh: invoiceD[j].ITEM_UOM,
            SLuong: invoiceD[j].QTY,
            DGia: invoiceD[j].U_PRICE,
            TLCKhau: "", //invoiceD[j].dc_rate,
            STCKhau: "", //invoiceD[j].dc_amt,
            ThTien: invoiceD[j].NET_TR_AMT,
            TSuat: invoiceD[j].VAT_RATE,
          });
        }

        objInvoice.DLHDon.NDHDon.TToan = {};
        objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat = {};
        objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

        for (let j = 0; j < invoiceVAT.length; j++) {
          objInvoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
            TSuat: invoiceVAT[j].SUB_VAT_RATE,
            ThTien: invoiceVAT[j].SUB_AMT,
            TThue: invoiceVAT[j].SUB_AMT_VAT,
          });
        }

        objInvoice.DLHDon.NDHDon.TToan.TgTCThue = invoiceM.TOTAL_AMT;
        objInvoice.DLHDon.NDHDon.TToan.TgTThue = invoiceM.TOTAL_VAT_AMT;

        objInvoice.DLHDon.NDHDon.TToan.TTCKTMai = invoiceM.TOTAL_DC_AMT;
        objInvoice.DLHDon.NDHDon.TToan.TgTTTBSo = invoiceM.TOTAL_PAYMENT;
        objInvoice.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
          invoiceM.TOTAL_PAYMENT.toString(),
          invoiceM.CURRENCY
        );

        objInvoice.DSCKS.NBan = "";

        objInvoice.MCCQT = invoiceM.MCCQT;

        objData.TDiep.DLieu.HDon.push(objInvoice);
        objInvoice = {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                NNBSTKNHang: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                HVTNMHang: "",
                CCCDan: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        };
      }

      const id = uuid.v4();
      const xml = this.OBJtoXML(objData);
      //const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
      const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id='ID1'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");
      rtnXML = {
        //tax_code: data.tax_code,
        //store_code: data.store_code,
        //store_name: data.store_name,
        //count_invoice_convert: invoices.length,
        id_signing: "ID1",
        xml_converted: xmlRemoveLine,
      };

      return response.send(Utils.response(true, `Convert json to xml was successful. `, rtnXML));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "convertInvoiceToXML",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async sendPosInvoiceErp({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
     
      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/mttien";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

      const {
        tax_serial_number,
        seller_tax_code,
        sale_date,
        store_code,
        store_name,
        pos_no,
        invoice_xml_signed,
        req_key,
      } = request.all();


      // let json =  this.parseXmlToJson(invoice_xml_signed);

      const check_data =  await this.weTaxExtractPosXMLContent(invoice_xml_signed,
                                                      seller_tax_code,
                                                      sale_date,
                                                      tax_serial_number,
                                                      req_key,
                                                      store_code,
                                                      store_name,
                                                      pos_no,
                                                      p_language,
                                                      p_crt_by);

      //console.log("json  ", json);
      //  
      // console.log("json.TDiep.DLieu.HDon  ", json.TDiep.DLieu.HDon);

      if(check_data.STATUS == 'FAILE')
      {
        return response.send(Utils.response(true, `Send invoice to Tax Office was Faile!`, check_data));
      }else if (check_data.STATUS == 'EXIT' )
      {
        return response.send(Utils.response(true, `The sign xml was send Tax Offiec`, check_data));
      }else if (check_data.STATUS == 'NOEXIT' )
      {
        return response.send(Utils.response(true, `Compay not yet register`, check_data));
      }

      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };
      let trade_code = "";
      let maCQT = "";
      let maTBao = "";
      let tenTBao = "";
      let xml_tax_signed = "";
      let rtnValue = {};

      const res = await Request.post(
        url,
        { base64XML: Buffer.from(invoice_xml_signed).toString("base64") },
        {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }
      );

      trade_code = res.data.maGDich;
      console.log("trade_code   ", trade_code);

      await Utils._sleep(5);

      await Request.get(urlCheck + trade_code, {
          agent,
          headers: {
            Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
          },
        }).then(async (res) => {
          console.log(" res  ", res.data);
          if (res.data.length) {
            for (let j = 0; j < res.data.length; j++) {
              const items = res.data[j];
              for (let k = 0; k < items.length; k++) {
                if(items[k].loaiTBao == "1"){
                  xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");
                }else if (items[k].loaiTBao == "8") {
                  maCQT = items[k].ndungTBao.maCQT;
                 
                  maTBao = items[k].loaiTBao;
                  tenTBao = items[k].tenTBao;
                } else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "7") {
                  for(let invoice of items[k].ndungTBao.dsachLoiKTraDLieu)
                  {
                    
                  }

                  maTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].maLoi;
                  tenTBao = items[k].ndungTBao.dsachLoiKTraDLieu[0].mtaLoi;
                } 
              }
            }
          }

          rtnValue = {
            trade_code: trade_code,
            seller_tax_code: seller_tax_code,
            sale_date: sale_date,
            store_code: store_code,
            store_name: store_name,
            tax_serial_number: tax_serial_number,
            pos_no: pos_no,
            inform_code: maTBao,
            inform_name: tenTBao,
            mccqt: maCQT,
            xml_tax_signed: xml_tax_signed,
          };
        });
        console.log("rtnValue  ", rtnValue);
      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));

    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      console.log("e ", e);
      return response.send(Utils.response(false, e.message));
    }
  }

  // end e - invoce




  // public get data search ma tra cuu
  async getDataEinvoiceFormLookupCode({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";

      const { captcha, sessionid, lookupcode } = request.all();
      console.log("captcha:", captcha);
      console.log("sessionid:", sessionid);
      if (Redis) {
        const valueCache = await Redis.get(sessionid)
        if (!valueCache || valueCache != captcha) {
          return response.send(Utils.response(false, "invalid_captchar", null));
        }
      }

      /* const para_inv = {
        lookupcode : lookupcode,
      }; */
      console.log("lookupcode:", lookupcode);
      /* const rtnValue_VAT = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_get_data_lookup_code (:lookupcode,:p_language,:p_crt_by,:p_rtn_cur); END;`,
        para_inv,
        p_language,
        p_crt_by
      ); */

      const para_inv_st = {
        trade_code: lookupcode,
      };
      const rtnValue = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_get_data_lookup_code (:trade_code,:p_language, :p_crt_by, :p_rtn_cur); END;`,
        para_inv_st,
        p_language,
        p_crt_by
      );
      // console.log("rtnValue_VAT  ", rtnValue.p_rtn_cur);

      let EiExcels = new EiExcelHandlerAuto(); //CQT_MAGD
      let url_pdf = await EiExcels.getEinvoice(rtnValue.p_rtn_cur[0].CQT_MAGD, p_language, p_crt_by);
      // console.log("base64PDf: ", url_pdf);

      let re_url_xml = await Request.get(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + rtnValue.p_rtn_cur[0].CQT_MAGD + "&proc=" + "EI_SEL_XML_EINVOICE" + "&token=");
      //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE");
      let url_xml = re_url_xml.data;
      // console.log("base64XML:", url_xml);

      const rep_data = {
        form_no: rtnValue.p_rtn_cur[0].TEMPLATECODE,
        serial_no: rtnValue.p_rtn_cur[0].INVOICESERIALNO,
        invoice_date: rtnValue.p_rtn_cur[0].INVOICE_DATE_34,
        invoice_no: rtnValue.p_rtn_cur[0].INVOICENUMBER,
        currency: rtnValue.p_rtn_cur[0].CURRENCYCODEUSD,
        ex_rate: rtnValue.p_rtn_cur[0].TR_RATE_31,
        payment_method: rtnValue.p_rtn_cur[0].PAYMENTMETHODCK,
        seller_comp_name: rtnValue.p_rtn_cur[0].SELLER_NAME,
        seller_taxcode: rtnValue.p_rtn_cur[0].SELLER_TAXCODE,
        seller_address: rtnValue.p_rtn_cur[0].SELLER_ADDRESS,
        seller_phone: rtnValue.p_rtn_cur[0].SELLER_TEL,
        buyer_name: rtnValue.p_rtn_cur[0].BUYER_NAME_35,
        buyer_comp_name: rtnValue.p_rtn_cur[0].BUYERLEGALNAME,
        buyer_taxcode: rtnValue.p_rtn_cur[0].BUYERTAXCODE,
        buyer_phone: rtnValue.p_rtn_cur[0].TEL_53,
        buyer_address: rtnValue.p_rtn_cur[0].SELLER_ADDRESS_1,
        url_pdf: url_pdf,
        url_xml: url_xml,
        total_amt_no_vat: rtnValue.p_rtn_cur[0].NET_TR_AMT_DIS_TR_89,
        total_amt_dc: 0,
        total_amt_vat: rtnValue.p_rtn_cur[0].VAT_TR_AMT_DIS_TR_91,
        total_payment: rtnValue.p_rtn_cur[0].TOT_AMT_TR_94,
        total_payment_word_vie: rtnValue.p_rtn_cur[0].AMOUNT_WORD_VIE_107,
        mccqt: rtnValue.p_rtn_cur[0].CQT_MCCQT_ID_85
      }

      return response.send(Utils.response(true, "Research data invocie was success", rep_data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "getDataEinvoiceFormLookupCode",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async generalConvertEinvoice({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";

      const { converter, lookupcode } = request.all();

      /* const para_inv = {
        lookupcode : lookupcode,
      }; */
      console.log("lookupcode:", lookupcode);
      /* const rtnValue_VAT = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_get_data_lookup_code (:lookupcode,:p_language,:p_crt_by,:p_rtn_cur); END;`,
        para_inv,
        p_language,
        p_crt_by
      ); */

      const para_inv_st = {
        trade_code: lookupcode,
        converter: converter,
      };
      const rtnValue = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_get_data_lookup_code_c (:trade_code,:converter,:p_language, :p_crt_by, :p_rtn_cur); END;`,
        para_inv_st,
        p_language,
        p_crt_by
      );
      // console.log("rtnValue_VAT  ", rtnValue.p_rtn_cur);

      let EiExcels = new EiExcelHandlerAuto(); //CQT_MAGD
      let url_pdf = await EiExcels.getEinvoice(rtnValue.p_rtn_cur[0].CQT_MAGD, p_language, p_crt_by);
      // console.log("base64PDf: ", url_pdf);

      let re_url_xml = await Request.get(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + rtnValue.p_rtn_cur[0].CQT_MAGD + "&proc=" + "EI_SEL_XML_EINVOICE" + "&token=");
      //  await this.getUrlXML(tei_wt_sale_bill_pk, "EI_SEL_XML_POS_EINVOICE");
      let url_xml = re_url_xml.data;
      // console.log("base64XML:", url_xml);

      const rep_data = {
        form_no: rtnValue.p_rtn_cur[0].TEMPLATECODE,
        serial_no: rtnValue.p_rtn_cur[0].INVOICESERIALNO,
        invoice_date: rtnValue.p_rtn_cur[0].INVOICE_DATE_34,
        invoice_no: rtnValue.p_rtn_cur[0].INVOICENUMBER,
        currency: rtnValue.p_rtn_cur[0].CURRENCYCODEUSD,
        ex_rate: rtnValue.p_rtn_cur[0].TR_RATE_31,
        payment_method: rtnValue.p_rtn_cur[0].PAYMENTMETHODCK,
        seller_comp_name: rtnValue.p_rtn_cur[0].SELLER_NAME,
        seller_taxcode: rtnValue.p_rtn_cur[0].SELLER_TAXCODE,
        seller_address: rtnValue.p_rtn_cur[0].SELLER_ADDRESS,
        seller_phone: rtnValue.p_rtn_cur[0].SELLER_TEL,
        buyer_name: rtnValue.p_rtn_cur[0].BUYER_NAME_35,
        buyer_comp_name: rtnValue.p_rtn_cur[0].BUYERLEGALNAME,
        buyer_taxcode: rtnValue.p_rtn_cur[0].BUYERTAXCODE,
        buyer_phone: rtnValue.p_rtn_cur[0].TEL_53,
        buyer_address: rtnValue.p_rtn_cur[0].SELLER_ADDRESS_1,
        url_pdf: url_pdf,
        url_xml: url_xml,
        total_amt_no_vat: rtnValue.p_rtn_cur[0].NET_TR_AMT_DIS_TR_89,
        total_amt_dc: 0,
        total_amt_vat: rtnValue.p_rtn_cur[0].VAT_TR_AMT_DIS_TR_91,
        total_payment: rtnValue.p_rtn_cur[0].TOT_AMT_TR_94,
        total_payment_word_vie: rtnValue.p_rtn_cur[0].AMOUNT_WORD_VIE_107,
        mccqt: rtnValue.p_rtn_cur[0].CQT_MCCQT_ID_85
      }

      return response.send(Utils.response(true, "Convert einvoice successful!", rep_data));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "getDataEinvoiceFormLookupCode",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  // pivate function 
  convertKeysToLowerCase(obj) {
    //console.log("obj ", obj);
    let newObjM = [];
    let newObj = {};
    for (const keyM in obj) {
      for (const key in obj[keyM]) {
        if (Object.hasOwnProperty.call(obj[keyM], key)) {
          //console.log("key", key);
          newObj[key.toLowerCase()] = obj[keyM][key];
        }
        newObjM.push(newObj);
      }

    }

    //console.log("newObjM",    newObjM);
    //console.log("newObj", newObj);
    return newObjM;
  }

  async createXMLByOne(dataObject) {
    let objInvoice_M = {
      HDon: {
        DLHDon: {
          TTChung: {
            PBan: "",
            THDon: "",
            KHMSHDon: "",
            KHHDon: "",
            SHDon: "",
            MHSo: "",
            NLap: "",
            NBKe: "",
            DVTTe: "",
            TGia: "",
            HTTToan: "",
          },
          NDHDon: {
            NBan: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              NNBSTKNHang: "",
            },
            NMua: {
              Ten: "",
              MST: "",
              DChi: "",
              SDThoai: "",
              HVTNMHang: "",
              CCCDan: "",
            },
            DSHHDVu: {},
            TToan: {
              THTTLTSuat: {
                // LTSuat: [
                //     {
                //         TSuat: "",
                //         ThTien: "",
                //         TThue: "",
                //     }
                // ],
              },
              TgTCTHue: "",
              TgTThue: "",
              DSLPhi: {
                LPhi: {},
              },
              TTCKTMai: "",
              TgTTTBSo: "",
              TgTTTBChu: "",
            },
          },
        },
        MCCQT: {},
        DSCKS: {},
      },
    };

    if (dataObject.form_no == 1) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
    } else if (dataObject.form_no == 2) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
    } else if (dataObject.form_no == 3) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
    } else if (dataObject.form_no == 4) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
    } else if (dataObject.form_no == 5) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon =
        "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
    } else if (dataObject.form_no == 6) {
      objInvoice_M.HDon.DLHDon.TTChung.THDon =
        "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
    }
    objInvoice_M.HDon.DLHDon.TTChung.PBan = dataObject.version;
    objInvoice_M.HDon.DLHDon.TTChung.KHMSHDon = dataObject.form_no;
    objInvoice_M.HDon.DLHDon.TTChung.KHHDon = dataObject.serial_no;
    objInvoice_M.HDon.DLHDon.TTChung.SHDon = dataObject.invoice_no;
    objInvoice_M.HDon.DLHDon.TTChung.NLap = dataObject.invoice_date;
    objInvoice_M.HDon.DLHDon.TTChung.DVTTe = dataObject.currency;
    objInvoice_M.HDon.DLHDon.TTChung.TGia = dataObject.ex_rate;
    objInvoice_M.HDon.DLHDon.TTChung.HTTToan = dataObject.payment_method;
    objInvoice_M.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

    objInvoice_M.HDon.DLHDon.NDHDon.NBan.Ten = dataObject.seller_comp_name;
    objInvoice_M.HDon.DLHDon.NDHDon.NBan.MST = dataObject.seller_taxcode;
    objInvoice_M.HDon.DLHDon.NDHDon.NBan.DChi = dataObject.seller_address;
    objInvoice_M.HDon.DLHDon.NDHDon.NBan.SDThoai = dataObject.seller_phone;

    objInvoice_M.HDon.DLHDon.NDHDon.NMua.Ten = dataObject.buyer_comp_name;
    objInvoice_M.HDon.DLHDon.NDHDon.NMua.MST = dataObject.buyer_taxcode;
    objInvoice_M.HDon.DLHDon.NDHDon.NMua.DChi = dataObject.buyer_address;
    objInvoice_M.HDon.DLHDon.NDHDon.NMua.CCCDan = dataObject.buyer_cccd;
    objInvoice_M.HDon.DLHDon.NDHDon.NMua.SDThoai = dataObject.buyer_phone;

    objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = [];

    objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = {};
    objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

    for (let j = 0; j < dataObject.detail_invoice.length; j++) {
      objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
        TChat: dataObject.detail_invoice[j].feature,
        STT: dataObject.detail_invoice[j].seq,
        MHHDVu: dataObject.detail_invoice[j].item_code,
        THHDVu: dataObject.detail_invoice[j].item_name,
        DVTinh: dataObject.detail_invoice[j].unit,
        SLuong: dataObject.detail_invoice[j].quantity,
        DGia: dataObject.detail_invoice[j].unit_price,
        TLCKhau: dataObject.detail_invoice[j].dc_rate,
        STCKhau: dataObject.detail_invoice[j].dc_amt,
        ThTien: dataObject.detail_invoice[j].amount,
        TSuat: dataObject.detail_invoice[j].vat_rate,
      });
    }

    // objInvoice_M.HDon.DLHDon.NDHDon.TToan = {};

    objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

    for (let k = 0; k < dataObject.total_vat_list.length; k++) {
      objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
        TSuat: dataObject.total_vat_list[k].sub_vat_rate,
        ThTien: dataObject.total_vat_list[k].sub_amt,
        TThue: dataObject.total_vat_list[k].sub_vat_amt,
      });
    }

    objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTCThue = dataObject.total_amt;
    objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTThue = dataObject.total_amt_vat;

    objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTCKTMai = dataObject.total_amt_dc;
    objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = dataObject.total_payment;
    if(!dataObject.total_payment_word_vie)
    {
      let wordsAmt = Utils.Num2VNText(dataObject.total_payment.toString(), dataObject.ccy);
      objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = wordsAmt.substr(0, 2) + wordsAmt.substr(2, wordsAmt.length - 2).toLowerCase() + '.'; //  wordsAmt.substring(0,2) + wordsAmt.substring(2);  // dataObject.total_payment_word_vie;

    }else
    {
      objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = dataObject.total_payment_word_vie;

    }
    

    objInvoice_M.HDon.DSCKS.NBan = "";

    objInvoice_M.HDon.MCCQT = dataObject.mccqt;

    const xml = this.OBJtoXML(objInvoice_M);

    return xml;
    //console.log("  xml   ", xml);
  }

  async getUrlXML(pk, proc) {
    const current = new Date();
    const year = current.getFullYear();
    let month = current.getMonth() + 1;
    let day = current.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    let tokenEncrypted = AES.encrypt(proc + "|" + year + month + day, APP_KEY);
    tokenEncrypted = tokenEncrypted.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
    //let url_xml =  response.send(APP_URL_LOCAL+"/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=" + tokenEncrypted);
    let url_xml = await Request.get(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=");
    return url_xml;
  }

  IsNullOrEmpty(str) {
    return str === null || str === undefined || str.trim() === "";
  }

  async GetToken() {
    try {
      const tokenResponse = await Request.post(`${URL}/authenticate`, {
        username: Username,
        password: Password,
        rememberMe: false,
      });
      // console.log("res.data", tokenResponse);
      return tokenResponse.data.id_token;
    } catch (err) {
      console.log("err", err);
      return null;
    }
  }

  async GetCertificateRawData(token) {
    let para = {
      serial: Serial,
      pin: Pin,
    };
    const agent = {
      Agent: {
        defaultPort: 443,
        protocol: "https:",
        options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
      },
    };
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: para,
      };

      const certDataRes = await Request.get(`${URL}/certificate/get`, config);

      return certDataRes.data.data;
    } catch (err) {
      console.log("err", err);
      return null;
    }
  }

  async tempSignature(
    base64Digest, //byte[]
    base64SignatureValue, //byte[]
    CustomerCert, //X509Certificate2
    SignedTagId, //string
    SigningTagId, //string
    useNamespacePrefix, //bool
    isTagName //bool
  ) {
    if (this.IsNullOrEmpty(SigningTagId)) {
      SigningTagId = "serSig";
    }
    if (this.IsNullOrEmpty(SignedTagId)) {
      throw new Exception("Signed Tag Id is required");
    }
    //string str1 = "serSig";
    let signingTagId = SigningTagId;
    let refSigningTagId = ""; //`#${SignedTagId}`;
    let signatureValue = base64SignatureValue == null ? "" : base64SignatureValue.toString();
    let signatureMethod__Algorithm = "";
    let canonicalizationMethod_Algorithm = "";
    if (useNamespacePrefix) {
      canonicalizationMethod_Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
    } else {
      canonicalizationMethod_Algorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    }

    let signatureMethod_Algorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

    if (isTagName) {
      refSigningTagId = ""; //`#${SignedTagId}`;
    } else {
      refSigningTagId = `#${SignedTagId}`;
    }

    let transform_Algorithm = "http://www.w3.org/2000/09/xmldsig#enveloped-signature";

    // loai 2 transform
    if (useNamespacePrefix) {
    }

    let digestMethod_Algorithm = "http://www.w3.org/2000/09/xmldsig#sha1"; // "http://www.w3.org/2001/04/xmlenc#sha256";

    const signedInfoXml = create({ version: "1.0" })
      .ele("Signature", { Id: signingTagId, xmlns: "http://www.w3.org/2000/09/xmldsig#" })
      .ele("SignedInfo")
      .ele("CanonicalizationMethod", { Algorithm: canonicalizationMethod_Algorithm })
      .up()
      .ele("SignatureMethod", { Algorithm: signatureMethod_Algorithm })
      .up()
      .ele("Reference", { URI: refSigningTagId })
      .ele("Transforms")
      .ele("Transform", { Algorithm: transform_Algorithm })
      .up()
      .up()
      .ele("DigestMethod", { Algorithm: digestMethod_Algorithm })
      .ele("DigestValue")
      .txt(base64Digest.toString())

      .end({ prettyPrint: true });
    console.log(signedInfoXml);
  }

  async HashForRemote(
    xd, //XmlDocument
    SignedTagId, //string
    SigningTagId, //string
    namespacePrefix, //string
    CustomerCert, //X509Certificate2
    path, //string
    isSignTagName //bool
  ) {
    try {
      //XmlNode signature = null;
      // if (isSignTagName)
      // {
      //     signature = DsigSignature.tempSignature(DsigSignature.getDigestForRemoteByTagName(xd, SignedTagId, namespacePrefix), (byte[])null, CustomerCert, SignedTagId, SigningTagId, !string.IsNullOrEmpty(namespacePrefix), true);
      // }
      // else
      // {
      //     signature = DsigSignature.tempSignature(DsigSignature.getDigestForRemoteByID(xd, SignedTagId, namespacePrefix), (byte[])null, CustomerCert, SignedTagId, SigningTagId, !string.IsNullOrEmpty(namespacePrefix), false);
      // }
      // return DsigSignature.PerformHash(xd, signature, path);
    } catch (ex) {
      console.log("error ", ex);
    }
  }

  async createHashxml(
    xmlRaw,
    SignedTagId,
    SigningTagId,
    namespacePrefix,
    certificate2,
    xmlWithHashInfo,
    path,
    isSignTagName
  ) {
    const builder = new Builder();
    const xmlDocument = builder.buildObject(xmlRaw);
  }

  convertHtmlCode(sText) {
    if (sText != null || sText == "") {
      return this.replaceAllExt(this.replaceAllExt(sText, "&", "&#38;"), '"', "&#34;");
    } else {
      return "";
    }
  }

  replaceAllExt(strOgr, search, replacement) {
    var target = strOgr.toString();
    return target.replace(new RegExp(search, "g"), replacement);
  }

  validateJsonInvalidInvoiceToXML(invalid_invoices) {
    let status = true;
    let resMess = "";
    const mess1 = "Invalid field";
    const errorList = {
      version: 6,
      declare_name: 100,
      declare_type: 1,
      form_no: 15,
      tax_office_code: 5,
      tax_office_name: 100,
      seller_taxcode: 14,
      seller_company_name: 400,
      location_name: 50,
      inform_date: 10,
      invoices: [
        {
          tax_confirmation_code: 34,
          form_no: 1,
          serial_no: 8,
          invoice_no: 8,
          invoice_date: 10,
          invoice_type: 1,
          inform_type: 1,
          reason: 255,
        },
      ],
    };

    for (const key in errorList) {
      // valid null of not null values
      if (invalid_invoices[key] === undefined || invalid_invoices[key] == null) {
        status = false;
        resMess = `${mess1} ${key}.`;
        return {
          status,
          message: resMess,
        };
      }

      // valid length
      if (String(invalid_invoices[key]).length > errorList[key] && key != "invoices") {
        return {
          status: false,
          message: `Length of ${key} too long.`,
        };
      }
    }

    // valid invoices
    if (!invalid_invoices.invoices[0]) {
      return {
        status: false,
        message: `${mess1} invoices.`,
      };
    }

    for (let i = 0; i < invalid_invoices.invoices.length; i++) {
      for (const key in errorList.invoices[0]) {
        // valid digital_certificates
        if (invalid_invoices.invoices[i][key] === undefined || invalid_invoices.invoices[i][key] == null) {
          status = false;
          resMess = `${mess1} invoices ${key}.`;
          return {
            status,
            message: resMess,
          };
        }
        // vald length
        if (String(invalid_invoices.invoices[i][key]).length > errorList.invoices[0][key]) {
          return {
            status: false,
            message: `Length of invoices.${key} too long.`,
          };
        }
      }
    }
    const valueDT = ["1", "2"];
    if (!valueDT.includes(String(invalid_invoices.declare_type))) {
      return {
        status: false,
        message: `invalid_invoices must be 1 or 2. Receive: declare_type = ${invalid_invoices.declare_type}`,
      };
    }

    // if dont have any problem
    return {
      status,
      message: resMess,
    };
  }

  parseXmlToJson(xml) {
    const json = {};
    for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
      const key = res[1] || res[3];
      const value = res[2] && this.parseXmlToJson(res[2]);
      json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
    }
    return json;
  }

  validateDeclareJson(declare) {
    let status = true;
    let resMess = "";
    const mess1 = "Invalid field";
    const mess2 = "Data invalid";
    const errorList = {
      version: 6,
      declare_name: 100,
      declare_type: 1,
      declare_form_no: 15,
      seller_company_name: 400,
      seller_taxcode: 14,
      tax_office_name: 100,
      tax_office_code: 5,
      contact_person: 50,
      contact_address: 400,
      contact_email: 50,
      contact_phone: 20,
      location_name: 50,
      created_date: 10,
      has_code: 1,
      no_code: 1,
      pos_code: 1,
      taxpayer_from_difficult_location: 1,
      taxpayer_from_people_committee_suggestions: 1,
      transfer_data_directly_to_tax_office: 1,
      cdlqtvan: 1,
      full_transfer: 1,
      summary_transfer: 1,
      vat_invoice: 1,
      sales_invoice: 1,
      sales_invoice_passet: 1,
      sales_invoice_national: 1,
      other_invoice: 1,
      voucher: 1,
      digital_certificates: [
        {
          sequence: 1,
          organization_name: "SmartSign",
          serial_no: "540101072FBF82CD8A4D89AEADEBCF88",
          from_date: "2023-04-27T08:47:43",
          to_date: "2024-07-27T08:47:42",
          type: "1",
        },
      ],
    };

    for (const key in errorList) {
      // valid null of not null values
      if (declare[key] === undefined || declare[key] == null) {
        status = false;
        resMess = `${mess1} ${key}.`;
        return {
          status,
          message: resMess,
        };
      }

      // valid length
      if (String(declare[key]).length > errorList[key] && key != "digital_certificates") {
        return {
          status: false,
          message: `Length of ${key} too long.`,
        };
      }

      // valid data must be in valueReq
      const valueReq = ["0", "1"];
      if (
        key == "has_code" ||
        key == "no_code" ||
        key == "pos_code" ||
        key == "taxpayer_from_difficult_location" ||
        key == "taxpayer_from_people_committee_suggestions" ||
        key == "transfer_data_directly_to_tax_office" ||
        key == "cdlqtvan" ||
        key == "full_transfer" ||
        key == "summary_transfer" ||
        key == "vat_invoice" ||
        key == "sales_invoice" ||
        key == "sales_invoice_passet" ||
        key == "sales_invoice_national" ||
        key == "other_invoice" ||
        key == "voucher"
      ) {
        if (!valueReq.includes(String(declare[key]))) {
          status = false;
          resMess = `${mess2}. Field ${key}.`;
          return {
            status,
            message: resMess,
          };
        }
      }
    }

    // valid digital_certificates
    if (!declare.digital_certificates[0]) {
      return {
        status: false,
        message: `${mess1} digital_certificates.`,
      };
    }
    for (let i = 0; i < declare.digital_certificates.length; i++) {
      for (const key in errorList.digital_certificates[0]) {
        // valid digital_certificates
        if (declare.digital_certificates[i][key] === undefined || declare.digital_certificates[i][key] == null) {
          status = false;
          resMess = `${mess1} digital_certificates ${key}.`;
          return {
            status,
            message: resMess,
          };
        }
        // vald date
        if (key == "from_date" || key == "to_date") {
          if (new Date(declare.digital_certificates[i][key]) == "Invalid Date") {
            return {
              status: false,
              message: `Invalid Date. key digital_certificates ${key}`,
            };
          }
        }
      }
    }

    // valid declare_type must be in valueDT
    const valueDT = ["1", "2"];
    if (!valueDT.includes(String(declare.declare_type))) {
      return {
        status: false,
        message: `declare_type must be 1 or 2. Receive: declare_type = ${declare.declare_type}`,
      };
    }

    // if dont have any problem
    return {
      status,
      message: resMess,
    };
  }

  OBJtoXML(obj) {
    var xml = "";
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? "" : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? "" : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
    return xml;
  }

  async renderJsonToExcelFile() {
    const exjs = new RenderJsonToExcelFile();
    const propsEx = {
      filename: "test02.xlsx",
    };
    const result = await exjs.createFille(propsEx);
    return response.send(result);
  }

  async extractXMLContent(
    p_xml_content,
    p_mail_to,
    p_mail_cc,
    p_invoice_type,
    p_tr_type,
    p_tax_serial_number,
    p_tac_crca_pk,
    p_invoice_form_symbol,
    p_language,
    p_crt_by
  ) {
    let result_extra = {};
    try {
      const templateTTChung = [
        "HDon/DLHDon/TTChung",
        {
          PBan: "PBan",
          THDon: "THDon",
          KHMSHDon: "KHMSHDon",
          KHHDon: "KHHDon",
          SHDon: "SHDon",
          MHSo: "MHSo",
          NLap: "NLap",
          SBKe: "SBKe",
          NBKe: "NBKe",
          DVTTe: "DVTTe",
          TGia: "TGia",
          HTTToan: "HTTToan",
          MSTTCGP: "MSTTCGP",
          MSTDVNUNLHDon: "MSTDVNUNLHDon",
          TDVNUNLHDon: "TDVNUNLHDon",
          DCDVNUNLHDon: "DCDVNUNLHDon",
        },
      ];
      const jsonTTChung = await transform(p_xml_content, templateTTChung);
      // console.log("jsonTTChung", jsonTTChung)
      const templateTTKhac = [
        "HDon/DLHDon/TTChung/TTKhac/TTin",
        {
          TTruong: "TTruong",
          DLieu: "DLieu",
        },
      ];
      let jsonTTKhac = null;
      try {
        jsonTTKhac = await transform(p_xml_content, templateTTKhac);
      } catch (e) { }
      // console.log("jsonTTKhac", jsonTTKhac)
      let customField1 = "",
        customField2 = "",
        customField3 = "",
        customField4 = "",
        customField5 = "",
        customField6 = "",
        customField7 = "",
        customField8 = "",
        customField9 = "",
        customField10 = "";
      if (jsonTTKhac && jsonTTKhac.length > 0) {
        customField1 = jsonTTKhac[0].TTruong + ": " + jsonTTKhac[0].DLieu;
        if (jsonTTKhac.length > 1) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
        }
        if (jsonTTKhac.length > 2) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
        }
        if (jsonTTKhac.length > 3) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
        }
        if (jsonTTKhac.length > 4) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
        }
        if (jsonTTKhac.length > 5) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
        }
        if (jsonTTKhac.length > 6) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
        }
        if (jsonTTKhac.length > 7) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
        }
        if (jsonTTKhac.length > 8) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
        }
        if (jsonTTKhac.length > 9) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
          customField10 = jsonTTKhac[9].TTruong + ": " + jsonTTKhac[9].DLieu;
        }
      }

      const templateTTHDLQuan = [
        "HDon/DLHDon/TTChung/TTHDLQuan",
        {
          TCHDon: "TCHDon",
          LHDCLQuan: "LHDCLQuan",
          KHMSHDCLQuan: "KHMSHDCLQuan",
          KHHDCLQuan: "KHHDCLQuan",
          SHDCLQuan: "SHDCLQuan",
          NLHDCLQuan: "NLHDCLQuan",
          GChu: "GChu",
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
        "HDon/DLHDon/NDHDon/NBan",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          STKNHang: "STKNHang",
          NNBSTKNHang: "NNBSTKNHang",
          TNHang: "TNHang",
          Fax: "Fax",
          Website: "Website",
          TTKhac: "TTKhac",
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
        jsonNBan[0].NNBSTKNHang,
        jsonNBan[0].TNHang,
        jsonNBan[0].Fax,
        jsonNBan[0].Website,
        jsonNBan[0].TTKhac,
      ];
      // console.log("jsonNBan", jsonNBan)
      const templateNMua = [
        "HDon/DLHDon/NDHDon/NMua",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          MKHang: "MKHang",
          HVTNMHang: "HVTNMHang",
          STKNHang: "STKNHang",
          TNHang: "TNHang",
          TTKhac: "TTKhac",
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
        "HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat",
        {
          TSuat: "TSuat",
          ThTien: "ThTien",
          TThue: "TThue",
        },
      ];
      const jsonLTSuat = await transform(p_xml_content, templateLTSuat);
      // console.log("jsonLTSuat", jsonLTSuat)
      const arrLTSuat = [jsonLTSuat[0].TSuat, jsonLTSuat[0].ThTien, jsonLTSuat[0].TThue];
      const templateTToan = [
        "HDon/DLHDon/NDHDon/TToan",
        {
          TgTCThue: "TgTCThue",
          TgTThue: "TgTThue",
          TTCKTMai: "TTCKTMai",
          TgTTTBSo: "TgTTTBSo",
          TgTTTBChu: "TgTTTBChu",
        },
      ];
      const jsonTToan = await transform(p_xml_content, templateTToan);
      // console.log("jsonTToan", jsonTToan)
      const arrTToan = [
        jsonTToan[0].TgTCThue,
        jsonTToan[0].TgTThue,
        jsonTToan[0].TTCKTMai,
        jsonTToan[0].TgTTTBSo,
        jsonTToan[0].TgTTTBChu,
      ];
      let v_vn_amount = Utils.Num2VNText(jsonTToan[0].TgTTTBSo.toString(), jsonTTChung[0].DVTTe);
      // console.log("  v_vn_amount ", v_vn_amount);
      /*const templateMCCQT = ['HDon', {
                                  MCCQT: 'MCCQT'
                              }]
                              const jsonMCCQT = await transform(p_xml_content, templateMCCQT);
                              //console.log(jsonMCCQT)
                              */
      const arrMCCQT = ""; //[jsonMCCQT[0].MCCQT];

      const templateDSHHDVu = [
        "HDon/DLHDon/NDHDon/DSHHDVu/HHDVu",
        {
          TChat: "TChat",
          STT: "STT",
          MHHDVu: "MHHDVu",
          THHDVu: "THHDVu",
          DVTinh: "DVTinh",
          SLuong: "SLuong",
          DGia: "DGia",
          TLCKhau: "TLCKhau",
          STCKhau: "STCKhau",
          ThTien: "ThTien",
          TSuat: "TSuat",
        },
      ];
      let masterPara = arrTTChung.concat(arrNBan).concat(arrNMua).concat(arrLTSuat).concat(arrTToan).concat(arrMCCQT);
      //const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
      masterPara = masterPara.concat(["", "", "", ""]);
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
        masterPara = masterPara.concat(["", "", "", "", "", "", ""]);
      }

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
      ]);

      // console.log("masterPara", masterPara)
      //const master = await callAPI(_jwtToken, { proc: 'ei_upd_tei_einvoice_cloud', para: masterPara });
      const master = await DBService.callProcCursor("ei_upd_tei_einvoice_ar", masterPara, p_language, p_crt_by);
      // console.log("master", master);

      if (master && master[0].PK > 0) {
        const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonDSHHDVu.length; i++) {
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
            master[0].TEI_EINVOICE_M_PK,
          ];
          const detail = await DBService.callProcCursor("ei_upd_tei_einvoiced_ar", detailPara, p_language, p_crt_by);
          // console.log("detail", detail);
        }
        return (result_extra = {
          PK: master[0].PK,
          TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
        });
      } else {
        return (result_extra = {
          PK: master[0].PK,
          TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
        }); //master[0].PK;
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "extractXMLContent",
        CONTENT: e.message,
      });
      return (result_extra = {
        PK: -2,
        TEI_EINVOICE_M_PK: 0,
      }); //master[0].PK;;
    }
  }

  async generalXmlPosInvoiceIn(p_tei_einvoice_m_pk, p_user_id, p_language, p_crt_by) {
    try {

      let rtnXML = [];
      let objInvoice = {
        HDon: {
          DLHDon: {
            TTChung: {
              PBan: "",
              THDon: "",
              KHMSHDon: "",
              KHHDon: "",
              SHDon: "",
              MHSo: "",
              NLap: "",
              NBKe: "",
              DVTTe: "",
              TGia: "",
              HTTToan: "",
            },
            NDHDon: {
              NBan: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                NNBSTKNHang: "",
              },
              NMua: {
                Ten: "",
                MST: "",
                DChi: "",
                SDThoai: "",
                HVTNMHang: "",
                CCCDan: "",
              },
              DSHHDVu: {},
              TToan: {
                THTTLTSuat: {
                  LTSuat: {
                    TSuat: "",
                    ThTien: "",
                    TThue: "",
                  },
                },
                TgTCTHue: "",
                TgTThue: "",
                DSLPhi: {
                  LPhi: {},
                },
                TTCKTMai: "",
                TgTTTBSo: "",
                TgTTTBChu: "",
              },
            },
          },
          DSCKS: {},
        }
      };


      const para_value = {
        p_tei_einvoice_m_pk: p_tei_einvoice_m_pk,
        p_user_id: p_user_id,
      };
      // console.log("para_value  ", para_value);

      const rtnValueMaster = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_einvoice_xml_m (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );

      // console.log("rtnValueMaster  ", rtnValueMaster);

      const rtnValueDetail = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_einvoice_xml_d (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );

      //console.log("rtnValueDetail  ", rtnValueDetail);

      const rtnValueVAT = await DBService.ExecuteSQLBlob(
        `BEGIN ei_sel_einvoice_xml_vat (  :p_tei_einvoice_m_pk,
                                                    :p_user_id,
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
        para_value,
        p_language,
        p_crt_by
      );

      //console.log("rtnValueVAT  ", rtnValueVAT);

      const invoiceM = rtnValueMaster.p_rtn_cur[0];
      const invoiceD = rtnValueDetail.p_rtn_cur;
      const invoiceVAT = rtnValueVAT.p_rtn_cur;

      if (invoiceM.FORM_NO == 1) {
        objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng khởi tạo từ máy tính tiền";
      } else if (invoiceM.FORM_NO == 2) {
        objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng khởi tạo từ máy tính tiền";
      } else if (invoiceM.FORM_NO == 3) {
        objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công khởi tạo từ máy tính tiền";
      } else if (invoiceM.FORM_NO == 4) {
        objInvoice.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia khởi tạo từ máy tính tiền";
      } else if (invoiceM.FORM_NO == 5) {
        objInvoice.HDon.DLHDon.TTChung.THDon =
          "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng khởi tạo từ máy tính tiền";
      } else if (invoiceM.FORM_NO == 6) {
        objInvoice.DLHDon.TTChung.THDon =
          "Phiếu xuất kho kiêm vận chuyển nội bộ, phiếu xuất kho hàng gửi bán đại lý khởi tạo từ máy tính tiền";
      }
      objInvoice.HDon.DLHDon.TTChung.PBan = invoiceM.VERSION;
      objInvoice.HDon.DLHDon.TTChung.KHMSHDon = invoiceM.FORM_NO;
      objInvoice.HDon.DLHDon.TTChung.KHHDon = invoiceM.SERIAL_NO;
      objInvoice.HDon.DLHDon.TTChung.SHDon = invoiceM.INVOICE_NO;
      objInvoice.HDon.DLHDon.TTChung.NLap = invoiceM.INVOICE_DATE;
      objInvoice.HDon.DLHDon.TTChung.DVTTe = invoiceM.CURRENCY;
      objInvoice.HDon.DLHDon.TTChung.TGia = invoiceM.EX_RATE;
      objInvoice.HDon.DLHDon.TTChung.HTTToan = invoiceM.PAYMENT_METHOD;
      objInvoice.HDon.DLHDon.TTChung.MSTTCGP = "1201496252"; //webcashgenuwin.com taxcode

      objInvoice.HDon.DLHDon.NDHDon.NBan.Ten = invoiceM.SELLER_NAME;
      objInvoice.HDon.DLHDon.NDHDon.NBan.MST = invoiceM.SELLER_TAXCODE;
      objInvoice.HDon.DLHDon.NDHDon.NBan.DChi = invoiceM.SELLER_ADDRESS;
      objInvoice.HDon.DLHDon.NDHDon.NBan.SDThoai = invoiceM.SELLER_TEL;

      objInvoice.HDon.DLHDon.NDHDon.NMua.Ten = invoiceM.BUYER_COMP_NAME;
      objInvoice.HDon.DLHDon.NDHDon.NMua.MST = invoiceM.BUYER_TAXCODE;
      objInvoice.HDon.DLHDon.NDHDon.NMua.DChi = invoiceM.BUYER_ADDRESS;
      objInvoice.HDon.DLHDon.NDHDon.NMua.CCCDan = invoiceM.BUYER_CCCD;
      objInvoice.HDon.DLHDon.NDHDon.NMua.SDThoai = invoiceM.BUYER_TEL;

      objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = [];

      objInvoice.HDon.DLHDon.NDHDon.DSHHDVu = {};
      objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu = [];

      for (let j = 0; j < invoiceD.length; j++) {
        objInvoice.HDon.DLHDon.NDHDon.DSHHDVu.HHDVu.push({
          TChat: invoiceD[j].TCHAT,
          STT: invoiceD[j].SEQ_DIS,
          MHHDVu: invoiceD[j].ITEM_CODE,
          THHDVu: invoiceD[j].ITEM_NAME,
          DVTinh: invoiceD[j].ITEM_UOM,
          SLuong: invoiceD[j].QTY,
          DGia: invoiceD[j].U_PRICE,
          TLCKhau: "", //invoiceD[j].dc_rate,
          STCKhau: "", //invoiceD[j].dc_amt,
          ThTien: invoiceD[j].NET_TR_AMT,
          TSuat: invoiceD[j].VAT_RATE,
        });
      }

      objInvoice.HDon.DLHDon.NDHDon.TToan = {};
      objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat = {};
      objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat = [];

      for (let j = 0; j < invoiceVAT.length; j++) {
        objInvoice.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.push({
          TSuat: invoiceVAT[j].SUB_VAT_RATE,
          ThTien: invoiceVAT[j].SUB_AMT,
          TThue: invoiceVAT[j].SUB_AMT_VAT,
        });
      }

      objInvoice.HDon.DLHDon.NDHDon.TToan.TgTCThue = invoiceM.TOTAL_AMT;
      objInvoice.HDon.DLHDon.NDHDon.TToan.TgTThue = invoiceM.TOTAL_VAT_AMT;

      objInvoice.HDon.DLHDon.NDHDon.TToan.TTCKTMai = invoiceM.TOTAL_DC_AMT;
      objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBSo = invoiceM.TOTAL_PAYMENT;
      objInvoice.HDon.DLHDon.NDHDon.TToan.TgTTTBChu = await Utils.Num2VNText(
        invoiceM.TOTAL_PAYMENT.toString(),
        invoiceM.CURRENCY
      );

      objInvoice.HDon.DSCKS.NBan = "";

      objInvoice.HDon.MCCQT = invoiceM.MCCQT;



      const id = uuid.v4();
      const xml = this.OBJtoXML(objInvoice);
      //const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id=\'${id}\'>`);
      const xmlId = xml.toString().replace("<DLieu>", `<DLieu Id='ID1'>`);
      const xmlRemoveLine = xmlId.toString().replace(/\n/g, "");

      return xmlRemoveLine;
    } catch (e) {

      console.log(e);
    }
  }

  validateDeclareXML(declare) {
    let status = true;
    let resMess = "";
    const mess1 = "Invalid field";
    const mess2 = "Data invalid";
    if (!declare.TKhai) {
      return {
        status: false,
        message: `${mess1} TKhai.`,
      };
    }
    if (!declare.TKhai.DLTKhai) {
      return {
        status: false,
        message: `${mess1} DLTKhai.`,
      };
    }
    if (!declare.TKhai.DSCKS) {
      return {
        status: false,
        message: `${mess1} DSCKS (unsigned).`,
      };
    }
    if (!declare.TKhai.DSCKS.NNT) {
      return {
        status: false,
        message: `${mess1} NNT (unsigned).`,
      };
    }

    const errorList = {
      DLTKhai: {
        TTChung: {
          PBan: 6,
          MSo: 15,
          Ten: 100,
          HThuc: 1,
          TNNT: 400,
          MST: 14,
          CQTQLy: 100,
          MCQTQLy: 5,
          NLHe: 50,
          DCLHe: 400,
          DCTDTu: 50,
          DTLHe: 20,
          DDanh: 50,
          NLap: 10,
        },
        NDTKhai: {
          HTHDon: {
            CMa: 1,
            KCMa: 1,
            CMTMTTien: 1,
          },
          HTGDLHDDT: {
            NNTDBKKhan: 1,
            NNTKTDNUBND: 1,
            CDLTTDCQT: 1,
            CDLQTVAN: 1,
            CDLQTCTN: 0,
          },
          PThuc: {
            CDDu: 1,
            CBTHop: 1,
          },
          LHDSDung: {
            HDGTGT: 1,
            HDBHang: 1,
            HDBTSCong: 1,
            HDBHDTQGia: 1,
            HDKhac: 1,
            CTu: 1,
          },
          DSCTSSDung: {
            CTS: {
              STT: 1,
              TTChuc: "SmartSign",
              Seri: "540101072FBF82CD8A4D89AEADEBCF88",
              TNgay: "2023-04-27T08:47:43",
              DNgay: "2024-07-27T08:47:42",
              HThuc: "1",
            },
          },
        },
      },
    };

    for (const key in errorList.DLTKhai) {
      // valid null of not null values
      if (declare.TKhai.DLTKhai[key] === undefined || declare.TKhai.DLTKhai[key] == null) {
        status = false;
        resMess = `${mess2} ${key}.`;
        return {
          status,
          message: resMess,
        };
      }
    }
    for (const key in errorList.DLTKhai.TTChung) {
      if (String(declare.TKhai.DLTKhai.TTChung[key]).length > errorList.DLTKhai.TTChung[key]) {
        return {
          status: false,
          message: `${mess2} ${key}.`,
        };
      }
    }
    //     for (const key in errorList.DLTKhai.NDTKhai) {
    //         // if(status == false){
    //         //     return {
    //         //         status: status,
    //         //         message: resMess,
    //         //     };
    //         // }
    //         for (const childKey in errorList.DLTKhai.NDTKhai[key]) {
    //             if(String(declare.TKhai.DLTKhai.NDTKhai[key][childKey]).length > errorList.DLTKhai.NDTKhai[key][childKey] && childKey != 'DSCTSSDung'){
    //                 status= false;
    //                 resMess = `Length of ${key} ${childKey} too long.`
    //                 return {
    //                     status: status,
    //                     message: resMess,
    //                 };
    //             }

    //           // valid data must be in valueReq
    //           const valueReq = ["0", "1"];
    //           if (
    //             key == 'CMa' ||
    //             key == 'KCMa' ||
    //             key == 'CMTMTTien' ||
    //             key == 'NNTDBKKhan' ||
    //             key == 'NNTKTDNUBND' ||
    //             key == 'CDLTTDCQT' ||
    //             // key == 'CDLQTVAN' ||
    //             key == 'CDDu' ||
    //             key == 'CBTHop' ||
    //             key == 'HDGTGT' ||
    //             key == 'HDBHang' ||
    //             key == 'HDBTSCong' ||
    //             key == 'HDBHDTQGia' ||
    //             key == 'HDKhac' ||
    //             key == 'CTuer'
    //           ) {
    //             if (!valueReq.includes(String(declare.TKhai.DLTKhai.NDTKhai[key][childKey]))) {
    //               status = false;
    //               resMess = `${mess2}. Field ${key} ${key}.`;
    //               return {
    //                 status: status,
    //                 message: resMess,
    //             };
    //             }
    //           }
    //         }
    //         console.log(resMess);
    //    }
    // for (const key in errorList.DLTKhai.NDTKhai.DSCTSSDung.CTS) {
    //     if(!declare.TKhai.DLTKhai.NDTKhai.DSCTSSDung.CTS[key]) {
    //         status = false;
    //         resMess = `${mess1} CTS ${key}.`;
    //         return {
    //             status,
    //             message: resMess,
    //         };
    //     }
    // }
    return {
      status: status,
      message: resMess,
    };
  }

  async weTaxExtractPosXMLContent(
    xml_content,
    seller_tax_code,
    seller_date,
    tax_serial_number,
    req_key,
    store_code,
    store_name,
    pos_no,
    p_language,
    p_crt_by
) {
    let result_extra = {};
    try {
      
           const template =
            ["//HDon", { 
                         DLHDon: {
                          TTChung : {
                              PBan: "DLHDon/TTChung/PBan",
                              THDon: "DLHDon/TTChung/THDon",
                              KHMSHDon: "DLHDon/TTChung/KHMSHDon",
                              KHHDon: "DLHDon/TTChung/KHHDon",
                              SHDon: "DLHDon/TTChung/SHDon",
                              MHSo: "DLHDon/TTChung/MHSo",
                              NLap: "DLHDon/TTChung/NLap",
                            },
                            NDHDon:{
                                NBan:{
                                    Ten: "DLHDon/NDHDon/NBan/Ten",
                                    MST: "DLHDon/NDHDon/NBan/MST",
                                    DChi: "DLHDon/NDHDon/NBan/DChi",
                                    SDThoai: "DLHDon/NDHDon/NBan/SDThoai",
                                  },
                                NMua:{
                                  Ten: "DLHDon/NDHDon/NMua/Ten",
                                  MST: "DLHDon/NDHDon/NMua/MST",
                                  DChi: "DLHDon/NDHDon/NMua/DChi",
                                  SDThoai: "DLHDon/NDHDon/NMua/SDThoai",
                                  CCCDan: "DLHDon/NDHDon/NMua/CCCDan",
                                  },
                                DSHHDVu:{
                                  HHDVu:["DLHDon/NDHDon/DSHHDVu/HHDVu",
                                  {
                                    TChat: "TChat",
                                    STT: "STT",
                                    MHHDVu: "MHHDVu",
                                    THHDVu: "THHDVu",
                                    DVTinh: "DVTinh",
                                    SLuong: "SLuong",
                                    DGia: "DGia",
                                    TLCKhau: "TLCKhau",
                                    STCKhau: "STCKhau",
                                    ThTien: "ThTien",
                                    TSuat: "TSuat",
                                  }

                                  ]
                                },
                                TToan:  {
                                  THTTLTSuat:
                                  {
                                    LTSuat:["DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat",
                                      {
                                        TSuat: "TSuat",
                                        ThTien: "ThTien",
                                        TThue: "TThue",
                                      }
                                    ]
                                  }     
                                  ,DSLPhi:
                                  {
                                    LPhi:["DLHDon/NDHDon/TToan/DSLPhi/LPhi",
                                      {
                                        TLPhi: "TLPhi",
                                        TPhi: "TPhi",
                                      }
                                    ]
                                  },
                                  TgTCThue: "DLHDon/NDHDon/TToan/TgTCThue",
                                  TgTThue: "DLHDon/NDHDon/TToan/TgTThue",
                                  TTCKTMai: "DLHDon/NDHDon/TToan/TTCKTMai",
                                  TgTTTBSo: "DLHDon/NDHDon/TToan/TgTTTBSo",
                                  TgTTTBChu: "DLHDon/NDHDon/TToan/TgTTTBChu",
                                }
                              }
                          },
                          DSCKS: ["DSCKS", {
                            NBan: "NBan"
                          },
                          ],
                          MCCQT: "MCCQT"
                         },
            ]
           ;
        const jsonInvoice = await transform(xml_content, template);

        // console.log('===> jsonInvoice ', jsonInvoice);

        const templateSignTime = {
          SigningTime : "TDiep/CKSNNT/Signature/Object/SignatureProperties/SignatureProperty/SigningTime"
        }
        const signingTime = await transform(xml_content, templateSignTime);

        //return jsonInvoice;
        if(jsonInvoice)
        {
          const paraPos = {
              invoice_date: seller_date,
              seller_tax_code:  seller_tax_code,
              tax_serial_number: tax_serial_number,
              pos_xml: xml_content,
              req_key : req_key,
              signing_time : signingTime.SigningTime,
              qty:jsonInvoice.length
          }

          const rtnValuePos = await DBService.ExecuteSQLBlob(
            `BEGIN ei_upd_pos_xml_box (          
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
            p_crt_by
          );

          // console.log("rtnValuePos  ", rtnValuePos);

          if(rtnValuePos.p_rtn_cur[0].STATUS == "OK")
          {
            console.log("jsonInvoice  ", jsonInvoice);
            for(const invoice of jsonInvoice)
            {
                const paraMaster = {
                  pban: invoice.DLHDon.TTChung.PBan,
                  thdon: invoice.DLHDon.TTChung.THDon,
                  khmshdon: invoice.DLHDon.TTChung.KHMSHDon,
                  khhdon: invoice.DLHDon.TTChung.KHHDon,
                  shdon: invoice.DLHDon.TTChung.SHDon,
                  nlap: invoice.DLHDon.TTChung.NLap,
                  nban_ten: invoice.DLHDon.NDHDon.NBan.Ten,
                  nban_mst: invoice.DLHDon.NDHDon.NBan.MST,
                  nban_dchi: invoice.DLHDon.NDHDon.NBan.DChi,
                  nban_sdthoai: invoice.DLHDon.NDHDon.NBan.SDThoai,

                  nmua_ten: invoice.DLHDon.NDHDon.NMua.Ten,
                  nmua_mst: invoice.DLHDon.NDHDon.NMua.MST,
                  nmua_dchi: invoice.DLHDon.NDHDon.NMua.DChi,
                  nmua_sdthoai: invoice.DLHDon.NDHDon.NMua.SDThoai,
                  nmua_cccdan: invoice.DLHDon.NDHDon.NMua.CCCDan,

                  tgtcthue: invoice.DLHDon.NDHDon.TToan.TgTCThue,
                  tgtthue: invoice.DLHDon.NDHDon.TToan.TgTThue,
                  ttcktmai: invoice.DLHDon.NDHDon.TToan.TTCKTMai,
                  tgtttbso: invoice.DLHDon.NDHDon.TToan.TgTTTBSo,
                  tgtttbchu: invoice.DLHDon.NDHDon.TToan.TgTTTBChu,
                  mccqt:  invoice.MCCQT,
                  seller_tax_code: seller_tax_code,
                  seller_date: seller_date,
                  store_code: store_code,
                  store_name: store_name,
                  tax_serial_number: tax_serial_number,
                  pos_no: pos_no,
                  signing_time: signingTime.SigningTime,
                  tei_wt_invoice_pos_pk: rtnValuePos.p_rtn_cur[0].PK,
                  
              } 

              const rtnValueMaster = await DBService.ExecuteSQLBlob(
                  `BEGIN ei_upd_sale_bill (          
                                                  :pban,
                                                  :thdon,
                                                  :khmshdon,
                                                  :khhdon,
                                                  :shdon,
                                                  :nlap,
                                                  :nban_ten,
                                                  :nban_mst,
                                                  :nban_dchi,
                                                  :nban_sdthoai,
                                                  :nmua_ten,
                                                  :nmua_mst,
                                                  :nmua_dchi,
                                                  :nmua_sdthoai,
                                                  :nmua_cccdan,
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
                                                  :p_language, 
                                                  :p_crt_by, 
                                                  :p_rtn_cur); END;`,
                                                  paraMaster,
                  p_language,
                  p_crt_by
              );
              console.log("rtnValueMaster  ", rtnValueMaster);
              if(rtnValueMaster.p_rtn_cur[0].STATUS == "OK")
              {
                const invoice_detail = invoice.DLHDon.NDHDon.DSHHDVu.HHDVu;
                for( let inv_d of invoice_detail)
                {
                  console.log(" invoice_detail  ", invoice_detail);
                  const paraDetails = {
                    tei_wt_invoice_m_pk: rtnValueMaster.p_rtn_cur[0].PK,
                    tchat	:inv_d.TChat,
                    stt		:inv_d.STT,
                    mhhdvu	:inv_d.MHHDVu,
                    thhdvu	:inv_d.THHDVu,
                    dvtinh	:inv_d.DVTinh,
                    sluong	:inv_d.SLuong,
                    dgia	: inv_d.DGia,
                    tlckhau	: inv_d.TLCKhau,
                    stckhau	: inv_d.STCKhau,
                    thtien	: inv_d.ThTien,
                    tsuat	: inv_d.TSuat,
                } 
                 const rtnValueDetail =  await DBService.ExecuteSQLBlob(
                    `BEGIN ei_upd_sale_bill_d (          
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
                                                    :p_language, 
                                                    :p_crt_by, 
                                                    :p_rtn_cur); END;`,
                                                    paraDetails,
                    p_language,
                    p_crt_by
                  );

                  console.log(" rtnValueDetail  ", rtnValueDetail);
                }
              
                const invoice_detail_vat = invoice.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat;
                for(const inv_d_vat of invoice_detail_vat)
                {
                  const para_amt_vat = {
                    tei_wt_sale_bill_pk: rtnValueMaster.p_rtn_cur[0].PK,
                    sub_amt: inv_d_vat.ThTien,
                    sub_vat_rate: inv_d_vat.TSuat,
                    sub_vat_amt: inv_d_vat.TThue,
                  };
                  const rtnValue_VAT = await DBService.ExecuteSQLBlob(
                    `BEGIN ei_upd_sale_bill_d_vat (          
                                                                      :tei_wt_sale_bill_pk,
                                                                      :sub_amt,
                                                                      :sub_vat_rate,
                                                                      :sub_vat_amt,
                                                                      :p_language, 
                                                                      :p_crt_by, 
                                                                      :p_rtn_cur); END;`,
                    para_amt_vat,
                    p_language,
                    p_crt_by
                  );

                  console.log(" invoice_detail_vat  ", rtnValue_VAT);
                }
               
              }//else
              // {

              // }
            }
           
          }

          return (result_extra = {
              PK: rtnValuePos.p_rtn_cur[0].PK,
              STATUS:  rtnValuePos.p_rtn_cur[0].STATUS,
          }); 
          
        }
    } catch (e) {
        Utils.Logger({
            LVL: "error",
            MODULE: "EInvoiceController",
            FUNC: "extractXMLContent",
            CONTENT: e.message,
        });
        console.log('===> extractXMLContent ',e.message);
        return (result_extra = {
            PK: -2,
            STATUS: "FAILE",
        }); //master[0].PK;;
    }
  }

  async weTaxExtractXMLContent(
    p_xml_content,
    p_mail_to,
    p_mail_cc,
    p_invoice_type,
    p_tr_type,
    p_tax_serial_number,
    p_tac_crca_pk,
    p_invoice_form_symbol,
    p_language,
    p_crt_by
  ) {
    let result_extra = {};
    try {
      const templateTTChung = [
        "HDon/DLHDon/TTChung",
        {
          PBan: "PBan",
          THDon: "THDon",
          KHMSHDon: "KHMSHDon",
          KHHDon: "KHHDon",
          SHDon: "SHDon",
          MHSo: "MHSo",
          NLap: "NLap",
          SBKe: "SBKe",
          NBKe: "NBKe",
          DVTTe: "DVTTe",
          TGia: "TGia",
          HTTToan: "HTTToan",
          MSTTCGP: "MSTTCGP",
          MSTDVNUNLHDon: "MSTDVNUNLHDon",
          TDVNUNLHDon: "TDVNUNLHDon",
          DCDVNUNLHDon: "DCDVNUNLHDon",
        },
      ];
      const jsonTTChung = await transform(p_xml_content, templateTTChung);
      // console.log("jsonTTChung", jsonTTChung)
      const templateTTKhac = [
        "HDon/DLHDon/TTChung/TTKhac/TTin",
        {
          TTruong: "TTruong",
          DLieu: "DLieu",
        },
      ];
      let jsonTTKhac = null;
      try {
        jsonTTKhac = await transform(p_xml_content, templateTTKhac);
      } catch (e) { }
      // console.log("jsonTTKhac", jsonTTKhac)
      let customField1 = "",
        customField2 = "",
        customField3 = "",
        customField4 = "",
        customField5 = "",
        customField6 = "",
        customField7 = "",
        customField8 = "",
        customField9 = "",
        customField10 = "";
      if (jsonTTKhac && jsonTTKhac.length > 0) {
        customField1 = jsonTTKhac[0].TTruong + ": " + jsonTTKhac[0].DLieu;
        if (jsonTTKhac.length > 1) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
        }
        if (jsonTTKhac.length > 2) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
        }
        if (jsonTTKhac.length > 3) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
        }
        if (jsonTTKhac.length > 4) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
        }
        if (jsonTTKhac.length > 5) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
        }
        if (jsonTTKhac.length > 6) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
        }
        if (jsonTTKhac.length > 7) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
        }
        if (jsonTTKhac.length > 8) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
        }
        if (jsonTTKhac.length > 9) {
          customField2 = jsonTTKhac[1].TTruong + ": " + jsonTTKhac[1].DLieu;
          customField3 = jsonTTKhac[2].TTruong + ": " + jsonTTKhac[2].DLieu;
          customField4 = jsonTTKhac[3].TTruong + ": " + jsonTTKhac[3].DLieu;
          customField5 = jsonTTKhac[4].TTruong + ": " + jsonTTKhac[4].DLieu;
          customField6 = jsonTTKhac[5].TTruong + ": " + jsonTTKhac[5].DLieu;
          customField7 = jsonTTKhac[6].TTruong + ": " + jsonTTKhac[6].DLieu;
          customField8 = jsonTTKhac[7].TTruong + ": " + jsonTTKhac[7].DLieu;
          customField9 = jsonTTKhac[8].TTruong + ": " + jsonTTKhac[8].DLieu;
          customField10 = jsonTTKhac[9].TTruong + ": " + jsonTTKhac[9].DLieu;
        }
      }

      const templateTTHDLQuan = [
        "HDon/DLHDon/TTChung/TTHDLQuan",
        {
          TCHDon: "TCHDon",
          LHDCLQuan: "LHDCLQuan",
          KHMSHDCLQuan: "KHMSHDCLQuan",
          KHHDCLQuan: "KHHDCLQuan",
          SHDCLQuan: "SHDCLQuan",
          NLHDCLQuan: "NLHDCLQuan",
          GChu: "GChu",
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
        "HDon/DLHDon/NDHDon/NBan",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          STKNHang: "STKNHang",
          NNBSTKNHang: "NNBSTKNHang",
          TNHang: "TNHang",
          Fax: "Fax",
          Website: "Website",
          TTKhac: "TTKhac",
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
        jsonNBan[0].NNBSTKNHang,
        jsonNBan[0].TNHang,
        jsonNBan[0].Fax,
        jsonNBan[0].Website,
        jsonNBan[0].TTKhac,
      ];
      // console.log("jsonNBan", jsonNBan)
      const templateNMua = [
        "HDon/DLHDon/NDHDon/NMua",
        {
          Ten: "Ten",
          MST: "MST",
          DChi: "DChi",
          SDThoai: "SDThoai",
          DCTDTu: "DCTDTu",
          MKHang: "MKHang",
          HVTNMHang: "HVTNMHang",
          STKNHang: "STKNHang",
          TNHang: "TNHang",
          TTKhac: "TTKhac",
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
        "HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat",
        {
          TSuat: "TSuat",
          ThTien: "ThTien",
          TThue: "TThue",
        },
      ];
      const jsonLTSuat = await transform(p_xml_content, templateLTSuat);
      // console.log("jsonLTSuat", jsonLTSuat)
      const arrLTSuat = [jsonLTSuat[0].TSuat, jsonLTSuat[0].ThTien, jsonLTSuat[0].TThue];
      const templateTToan = [
        "HDon/DLHDon/NDHDon/TToan",
        {
          TgTCThue: "TgTCThue",
          TgTThue: "TgTThue",
          TTCKTMai: "TTCKTMai",
          TgTTTBSo: "TgTTTBSo",
          TgTTTBChu: "TgTTTBChu",
        },
      ];
      const jsonTToan = await transform(p_xml_content, templateTToan);
      // console.log("jsonTToan", jsonTToan)
      const arrTToan = [
        jsonTToan[0].TgTCThue,
        jsonTToan[0].TgTThue,
        jsonTToan[0].TTCKTMai,
        jsonTToan[0].TgTTTBSo,
        jsonTToan[0].TgTTTBChu,
      ];
      let v_vn_amount = Utils.Num2VNText(jsonTToan[0].TgTTTBSo.toString(), jsonTTChung[0].DVTTe);
      // console.log("  v_vn_amount ", v_vn_amount);
      /*const templateMCCQT = ['HDon', {
                                  MCCQT: 'MCCQT'
                              }]
                              const jsonMCCQT = await transform(p_xml_content, templateMCCQT);
                              //console.log(jsonMCCQT)
                              */
      const arrMCCQT = ""; //[jsonMCCQT[0].MCCQT];

      const templateDSHHDVu = [
        "HDon/DLHDon/NDHDon/DSHHDVu/HHDVu",
        {
          TChat: "TChat",
          STT: "STT",
          MHHDVu: "MHHDVu",
          THHDVu: "THHDVu",
          DVTinh: "DVTinh",
          SLuong: "SLuong",
          DGia: "DGia",
          TLCKhau: "TLCKhau",
          STCKhau: "STCKhau",
          ThTien: "ThTien",
          TSuat: "TSuat",
        },
      ];
      let masterPara = arrTTChung.concat(arrNBan).concat(arrNMua).concat(arrLTSuat).concat(arrTToan).concat(arrMCCQT);
      //const xmlRelativePath = p_xml_path.replace(ROOT_DIR_FILES, "");
      masterPara = masterPara.concat(["", "", "", ""]);
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
        masterPara = masterPara.concat(["", "", "", "", "", "", ""]);
      }

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
      ]);

      // console.log("masterPara", masterPara)
      //const master = await callAPI(_jwtToken, { proc: 'ei_upd_tei_einvoice_cloud', para: masterPara });
      const master = await DBService.callProcCursor("ei_upd_tei_wt_invoice_m", masterPara, p_language, p_crt_by);
      // console.log("master", master);

      if (master && master[0].PK > 0) {
        const jsonDSHHDVu = await transform(p_xml_content, templateDSHHDVu);
        //console.log(jsonDSHHDVu)
        for (let i = 0; i < jsonDSHHDVu.length; i++) {
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
            master[0].TEI_EINVOICE_M_PK,
          ];
          const detail = await DBService.callProcCursor("EI_UPD_TEI_WT_INVOICE_D", detailPara, p_language, p_crt_by);
          // console.log("detail", detail);
        }

        // const para_detail_vat = [
        //   req_wt_key : ,
        // ]
        
        const detail_vat = await DBService.callProcCursor("EI_UPD_TEI_WT_INVOICE_D_VAT", [master[0].PK], p_language, p_crt_by);


        return (result_extra = {
          PK: master[0].PK,
          TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
        });
      } else {
        console.log();
        return (result_extra = {
          PK: master[0].PK,
          TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK,
        }); //master[0].PK;
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "weTaxExtractXMLContent",
        CONTENT: e.message,
      });
      console.log(e)
      return (result_extra = {
        PK: -2,
        TEI_EINVOICE_M_PK: 0,
      }); //master[0].PK;;
    }
  }

  formatDate(yyyymmdd)
  {
    const date = moment(yyyymmdd);
    const formattedDate = date.format('YYYY-MM-DD');

    return formattedDate
  }

  async sendInvoiceErp({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      //const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";
      //const url = "https://tvan.fpt.com.vn/ftvan-hddt/hdon/cmahdon";

      const authUserName = "GENUWIN"; // "GENUWIN";
      const authPassword = "genuwin123"; // "e_GX4v@";
      const url = "https://tvan.webhoadon.com.vn/ftvan-hddt/hdon/cmahdon";
      const urlCheck = "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
      const { invoices } = request.all();

      // console.log("weTaxSendInvoiceToTaxOffice  invoices  ",invoices);
      const agent = {
        Agent: {
          defaultPort: 443,
          protocol: "https:",
          options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
        },
      };

      let rtnValue = [];
      let rtnValueTradecode = [];
      let ei_upd_tei_wt_invoice_m_pk = 0;
      for (let i = 0; i < invoices.length; i++) {
        
                const masterInvoicePK = await this.weTaxExtractXMLContent(
                    invoices[i].xml_signed,
                    invoices[i].mail_to || '',
                    invoices[i].mail_cc || '',
                    invoices[i].invoice_type || '',
                    invoices[i].tr_type || '',
                    invoices[i].token_serial_number || '',
                    invoices[i].req_key || '',
                    invoices[i].invoice_form_symbol || '',
                    p_language,
                    p_crt_by
                );
                if (masterInvoicePK.PK == -1) {
                    console.log(`The issuer invoice has not register [${invoices[i].req_key}]`, invoices[i].xml_signed);
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "The issuer invoice has not register",
                    });
                    continue;
                } else if (masterInvoicePK.PK == 0) {
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "Duplicated data. This invoice already sent",
                    });
                    continue;
                } else if (masterInvoicePK.PK < -1) {
                    console.log(`invalid xml format [${invoices[i].req_key}]`, invoices[i].xml_signed);
                    rtnValue.push({
                        req_key: invoices[i].req_key,
                        trade_code: "",
                        errmsg: "Invalid xml format",
                    });
                    continue;
                }
                
                ei_upd_tei_wt_invoice_m_pk = masterInvoicePK.PK;
              
        // ======================== tam thoi =========================
        const trade_code = await Request.post(
          url,
          { base64XML: Buffer.from(invoices[i].xml_signed).toString("base64") },
          {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }
        );

        const para_trade_code = {
              req_wt_key : masterInvoicePK.PK,
              trade_code : trade_code.data.maGDich
        };
        console.log("para_trade_code  ", para_trade_code);

        await DBService.ExecuteSQLBlob(
                  `BEGIN EI_UPD_TEI_WT_INVOICE_TRADECODE(
                                  :req_wt_key, 
                                  :trade_code,
                                  :p_language, 
                                  :p_crt_by, 
                                  :p_rtn_cur); 
                  END;`,
                  para_trade_code,
                  p_language,
                  p_crt_by
          );

       // console.log("res_op  ", res_op);

        rtnValueTradecode.push({
          req_key : invoices[i].req_key,
          req_wt_key : masterInvoicePK.PK,
          trade_code : trade_code.data.maGDich
        });
      }  

      await Utils._sleep(5);

      for(const tr_code of rtnValueTradecode)
      {
        let maTBao = "";
          let tenTBao = "";
          let maCQT = "";
          let xml_tax_signed = "";

        if(tr_code.trade_code)
        {
          
          await Request.get(urlCheck + tr_code.trade_code, {
            agent,
            headers: {
              Authorization: "Basic " + Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
            },
          }).then(async (res) => {
            //console.log("res ", res);
            //return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, res.data));
            if (res.data.length) {
              for (let j = 0; j < res.data.length; j++) {
                const items = res.data[j];
                for (let k = 0; k < items.length; k++) {
                  // console.log("items[k].loaiTBao " + items[k].loaiTBao);
                  //console.log("items  ", items[k]);
                  if (items[k].loaiTBao == "10") {

                    let xml_draft = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8").split('</TTChung><DLieu>');
                    xml_tax_signed ='<?xml version="1.0" encoding="UTF-8"?>'+ xml_draft[1].replace('</DLieu></TDiep>','');
                    maCQT = items[k].ndungTBao.maCQT;

                    //xml_tax_signed = 
                    maTBao = items[k].loaiTBao;
                    tenTBao = items[k].tenTBao;

                  } /*else if (items[k].loaiTBao == "1") {
                    xml_tax_signed = Buffer.from(items[k].ndungTBao.base64XML, "base64").toString("utf8");

                  }*/
                   else if (items[k].loaiTBao == "9" || items[k].loaiTBao == "16") {

                    maTBao = items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].maLoi;
                    tenTBao = items[k].ndungTBao.tbaoKTraDLieu.dsachLoiKTraDLieu[0].mtaLoi;

                  } else if (items[k].loaiTBao == "15") {
                    tenTBao = items[k].tenTBao;
                    maTBao = items[k].loaiTBao;
                  }
                }
              }
            }
          });
        }
        const para_status = {
          req_wt_key : ei_upd_tei_wt_invoice_m_pk,
          maCQT : maCQT,
          xml_tax_signed : xml_tax_signed
          };

          const res_op = await DBService.ExecuteSQLBlob(
                    `BEGIN ET_UPD_TEI_WT_INVOICE_UP(
                                    :req_wt_key, 
                                    :maCQT,
                                    :xml_tax_signed,
                                    :p_language, 
                                    :p_crt_by, 
                                    :p_rtn_cur); 
                    END;`,
                    para_status,
                    p_language,
                    p_crt_by
            );
        
          rtnValue.push({
            req_key: tr_code.req_key,
            trade_code: tr_code.trade_code,
            inform_code: maTBao,
            inform_name: tenTBao,
            xml_tax_signed: xml_tax_signed,
            mcct: maCQT,
          });
      
      }

      return response.send(Utils.response(true, `Send invoice to Tax Office was Successfully!`, rtnValue));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendInvoiceToTaxOffice",
        CONTENT: e.message,
      });
      console.log("e  ", e);
      return response.send(Utils.response(false, e.message));
    }
  }

  async sendMailWT(data_send_mail, sale_id, msg_his_id, tax_code,  p_language, p_crt_by) {
    try {
       // send mail ............
       let data_rep = [];
       for (const data of data_send_mail) {
         const { res_send_mail, subject, body } = await this.sendMailToCustomer(
             data.tei_wt_sale_bill_pk,
             data.invoice,
             p_language,
             p_crt_by
           );
 
           if (res_send_mail.data.success) {
             const para_inv_st = {
               tei_wt_sale_bill_pk: data.tei_wt_sale_bill_pk,
               status: "Sent Success",
             };
             // const rtnValueSendMail = 
             await DBService.ExecuteSQLBlob(
               `BEGIN ei_upd_sale_bill_status (          
                                                               :tei_wt_sale_bill_pk,
                                                               :status,
                                                               :p_language, 
                                                               :p_crt_by, 
                                                               :p_rtn_cur); END;`,
               para_inv_st,
               p_language,
               p_crt_by
             );
 
              data_rep.push({
               sale_id : sale_id ,
               msg_his_id: msg_his_id,
               status_code: "1",
               status_name: "Sent Success",
               send_date: res_send_mail.data.data.date_send,
               send_time: res_send_mail.data.data.time_send,
               mail_form: res_send_mail.data.data.mail_from,
               mail_to: res_send_mail.data.data.mail_to,
               mail_to_cc: res_send_mail.data.data.mail_to_cc,
               title:  subject,
               content: body,
             });
           } else {
             const para_inv_st = {
               tei_wt_sale_bill_pk: data.tei_wt_sale_bill_pk,
               status: "Sent Faile",
             };
             // const rtnValueSendMail = 
             await DBService.ExecuteSQLBlob(
               `BEGIN ei_upd_sale_bill_status (          
                                                               :tei_wt_sale_bill_pk,
                                                               :status,
                                                               :p_language, 
                                                               :p_crt_by, 
                                                               :p_rtn_cur); END;`,
               para_inv_st,
               p_language,
               p_crt_by
             );
             data_rep.push({
               sale_id : sale_id ,
               msg_his_id : msg_his_id,
               status_code: "0",
               status_name: "Sent Faile",
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
       
       let data_response = {
         service_id : "WTPTA002",
         seller_tax_code : tax_code,
         info_send_email : data_rep
       }
       const agent = {
         Agent: {
           defaultPort: 443,
           protocol: "https:",
           options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
         },
       };
       const res = await Request.post(
         `${WETAX_API_URL}/api/wtx/v1/email-delivery-status`,
         { 
           service_id : "WTPTA002",
           seller_tax_code : tax_code,
           info_send_email : data_rep
          },
         {
           agent,
           headers: {
             Authorization: "Basic " + WETAX_TOKEN_CALLBACK,
           },
         }
       );
       
       console.log("weTaxSendOrderInfoV2 data_response ", data_response);
       console.log("weTaxSendOrderInfoV2 res ", res.data);
    
       
      
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "sendMailWT",
        CONTENT: e.message,
      });
      console.log("e  ", e);
      //return response.send(Utils.response(false, e.message));
    }
  }

  ///vng-304
  async viewPDFTemplate_04SS({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, data } = request.all(); //data:6030

      // console.log("data ", data);

      let EiExcels = new EiExcel04SSHandler();
      let url_pdf = await EiExcels.getEinvoice(data, p_language, p_crt_by);
      //console.log("file: EInvoiceController.js:8644 [vng-304] viewPDFTemplate_04SS [vng-304] url_pdf:", url_pdf)

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDF_InvoiceWT({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, data } = request.all(); //data:6030

      // console.log("data ", data);

      let EiExcels = new EiWTExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(data, p_language, p_crt_by);
      //console.log("file: EInvoiceController.js:10529 [vng-304] viewPDF_InvoiceWT [vng-304] url_pdf:", url_pdf)

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  async viewPDF_SaleBillWT({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { proc, data } = request.all(); //data:6030

      // console.log("data ", data);

      let EiExcels = new EiPosExcelHandlerAuto();
      let url_pdf = await EiExcels.getEinvoice(data, p_language, p_crt_by);
      //console.log("file: EInvoiceController.js:10529 [vng-304] viewPDF_InvoiceWT [vng-304] url_pdf:", url_pdf)

      return response.send(Utils.response(true, "general url pdf success", url_pdf));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "checkInvoiceStatusFromTaxOffice",
        CONTENT: e.message,
      });
      console.log(e);
      return response.send(Utils.response(false, "error", e.message));
    }
  }

  
}

module.exports = EInvoiceController;

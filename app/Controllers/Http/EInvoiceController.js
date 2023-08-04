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
const EINVOICE_URL_API_CONVERT_TO_XML_CLIENT = Env.get("EINVOICE_URL_API_CONVERT_TO_XML_CLIENT")
const EINVOICE_URL_API_VIEW_XML = Env.get("EINVOICE_URL_API_VIEW_XML");
const SMTP_SERVER = Env.get("SMTP_SERVER");
const SMTP_PORT = Env.get("SMTP_PORT");
const EMAIL_FROM = Env.get("EMAIL_FROM");
const EMAIL_USER = Env.get("EMAIL_USER");
const EMAIL_PW = Env.get("EMAIL_PW");
const _send_from_users = eval(Env.get("send_from_users"));
const fs = use("fs");
const { transform } = require("camaro");
const convertXML = require("xml-js");
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
// const { result_lodash } = require("lodash-es");
const EiExcelHandler = use("App/Helpers/EiExcelHandler");
const EiExcelHandlerAuto = use("App/Helpers/EiExcelHandlerAuto");
const URL = "http://demosign.easyca.vn:8080/api";
const Username = "demo_easysign";
const Password = "demo_easysign";
const Serial = "540110beffa622f3ca84bd2f93f0122c";
const Pin = "12345678";
const uuid = require("uuid");
const { Builder, parseString } = require('xml2js');
const { X509Certificate, crypto } = require('crypto');
const { create, createCB } = require('xmlbuilder2');
const EINVOICE_ESIGN_XML = "http://genuclouding.com/wseinvoice/BSService.asmx/SignXml" 

class EInvoiceController {
    async einvoicePdfConvert({ request, response, auth }) {
        var p_language = request.header("accept-language", "ENG");
        var p_crt_by = "";
        const { tradecode } = request.all()
        let EiExcel = new EiExcelHandler();
        const user = await auth.getUser();
        if (user) {
            p_crt_by = user.USER_ID;
        }
        let result = await EiExcel.getEinvoice(tradecode, p_language, p_crt_by)
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
            const { tradecodes } = request.all();
            let smtp_info = {
                host: SMTP_SERVER,
                port: SMTP_PORT,
                secure: false, // true for 465, false for other ports               
                tls: {
                    secureProtocol: "TLSv1_method",
                    secure: false,
                    ignoreTLS: true,
                    rejectUnauthorized: false
                },
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PW
                }
            }
            if (DB_CONNECTION == "oracle") {
                oracledb.fetchAsBuffer = [oracledb.BLOB]
                oracledb.fetchAsString = [oracledb.CLOB]
            }
            let rtnResult = [];
            const template = await DBService.callProcCursor(
                "sys_sel_mail_template_default", ['einvoice'],
                'ENG',
                p_crt_by,
                'N'
            );
            //console.log("template", template)
            for (let i = 0; i < tradecodes.length; i++) {
                const tradcode = tradecodes[i].tradecode;
                const mail_to = tradecodes[i].mail_to;
                const mail_cc = tradecodes[i].mail_cc;
                let pdf_url = await Request.post(API_URL + "/einvoice/einvoicepdfconvert", { tradecode: tradcode }, config);
                let xml_url = await Request.get(API_URL + "/dso/getfiledbtoken?proc=EI_SEL_XML_FILE_BY_TRADECODE&pk=" + tradcode);
                const subject = template[0].SUBJECT;
                const body = template[0].BODY;
                let pdf_file_name = "";
                let xml_file_name = "";

                if (pdf_url == null || pdf_url == undefined || pdf_url == "") {
                    rtnResult.push({ tradcode: tradcode, success: false, errmsg: 'fail to create invoice pdf file' });
                    continue;
                }

                if (xml_url == null || xml_url == undefined || xml_url == "") {
                    rtnResult.push({ tradcode: tradcode, success: false, errmsg: 'fail to create invoice xml file' });
                    continue;
                }
                pdf_url = pdf_url.data;
                xml_url = xml_url.data;

                const invoice = await DBService.callProcCursor(
                    "ei_sel_einvoice_by_tradecode", [tradcode],
                    'ENG',
                    p_crt_by,
                    'N'
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
                if (smtp_info.port == 465 || smtp_info.port == '465') {
                    smtp_info.secure = true;
                }

                let subject_binding = { SELLER_COMPANY_NAME: invoice[0].SELLER_COMPANY_NAME, FORM_NO: invoice[0].FORM_NO, SERIAL_NO: invoice[0].SERIAL_NO, INVOICE_NO: invoice[0].INVOICE_NO };
                let body_binding = { EINVOICE_LOOKUP_URL: '<a href="http://e-invoice.webcashgenuwin.com/tracuuhd" rel="noopener noreferrer" target="_blank">http://e-invoice.webcashgenuwin.com/tracuuhd</a>', TRADECODE: tradcode };
                pdf_file_name = invoice[0].INVOICE_NO + ".pdf";
                xml_file_name = invoice[0].INVOICE_NO + ".xml";
                let mail_option = {
                    from: smtp_info.auth.user,
                    to: mail_to, // list of receivers, separate by comma(;)
                    cc: mail_cc,
                    subject: subject, // Subject line
                    text: '', // plain text body
                    html: body, // html body
                    attachments: [
                        { filename: pdf_file_name, path: pdf_url },
                        { filename: xml_file_name, path: xml_url }
                    ]
                };
                //console.log("subject_binding", subject_binding)

                mail_option.subject = Utils.replaceString(mail_option.subject, subject_binding);
                mail_option.html = Utils.replaceString(mail_option.html, body_binding);
                //console.log("mail_option", mail_option)
                //console.log("smtp_info", smtp_info)
                const result = await Utils.smtpSendMail(mail_option, smtp_info);
                rtnResult.push({ tradcode: tradcode, success: result });
            }
            return response.send(
                Utils.response(
                    true,
                    `Sent mail result.`,
                    rtnResult
                )
            );
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "sendMail",
                CONTENT: e.message,
            });
            return response.send(
                Utils.response(
                    false,
                    `Send mail neet error.`,
                    e.message
                )
            );
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
                            NLap: "2021-15-11"
                        },
                        NDTKhai: {
                            HTHDon: {
                                CMa: 1,
                                KCMa: 0,
                                CMTMTTien: 0
                            },
                            HTGDLHDDT: {
                                NNTDBKKhan: 0,
                                NNTKTDNUBND: 0,
                                CDLTTDCQT: 0,
                                CDLQTVAN: 0
                            },
                            PThuc: {
                                CDDu: 1,
                                CBTHop: 0
                            },
                            LHDSDung: {
                                HDGTGT: 1,
                                HDBHang: 1,
                                HDBTSCong: "",
                                HDBHDTQGia: "",
                                HDKhac: 0,
                                CTu: 1
                            },
                            DSCTSSDung: {
                                CTS: []
                            }
                        }
                    },
                    DSCKS: {
                        NNT: ""
                    }
                }
            };

            if (declare && !declare.hasOwnProperty("seller_taxcode")) {
                return response.send(
                    Utils.response(
                        false,
                        `Invalid json format.`,
                        declare
                    )
                );
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
            jsonDeclare.TKhai.DLTKhai.TTChung.NLap = declare.created_date;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMa = declare.has_code;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.KCMa = declare.no_code;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTHDon.CMTMTTien = declare.pos_code;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTDBKKhan = declare.taxpayer_from_difficult_location;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.NNTKTDNUBND = declare.taxpayer_from_people_committee_suggestions;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLTTDCQT = declare.transfer_data_directly_to_tax_office;
            jsonDeclare.TKhai.DLTKhai.NDTKhai.HTGDLHDDT.CDLQTVAN = declare.cdlqtvan;
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
                    HThuc: declare.digital_certificates[i].type
                });
            }
            const xml = convertXML.json2xml(jsonDeclare, { compact: true, ignoreComment: true, spaces: 4 });
            // console.log("xmlxml ++++==?> ", xml);
            return response.send(
                Utils.response(
                    true,
                    `Convert declare using invoices to xml was succesful.`,
                    xml.toString().replace(/\n/g, '')
                )
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

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );


            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(
                    EINVOICE_URL_API_CONVERT_EINV, { invoices: invoices },
                    config
                );
                console.log("convertInvoiceToXMLClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");
            }
            return response.send(
                Utils.response(false, `Failed to send invoices.....`, null)
            );
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

    async convertDeclareToXMLClient ({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }
            const { proc, declare } = request.all();
            // console.log(" declare ", declare);
            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );
            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(EINVOICE_URL_API_CONVERT_TO_XML_CLIENT, { declare: declare }, config)
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");
            }
            return response.send(
                Utils.response(false, `Failed to send invoices.....`, null)
            );
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
                return response.send(
                    Utils.response(false, `Invalid json format.`, invalid_invoices)
                );
            }
            jsonInvalidInvoices.TBao.DLTBao.TCQT = this.convertHtmlCode(invalid_invoices.tax_office_name);
            jsonInvalidInvoices.TBao.DLTBao.MCQT = invalid_invoices.tax_office_code;
            jsonInvalidInvoices.TBao.DLTBao.MST = invalid_invoices.seller_taxcode;
            jsonInvalidInvoices.TBao.DLTBao.TNNT = this.convertHtmlCode(
                invalid_invoices.seller_company_name
            );
            jsonInvalidInvoices.TBao.DLTBao.DDanh = this.convertHtmlCode(
                invalid_invoices.location_name
            );
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
                Utils.response(
                    true,
                    `Convert invalid invoices to xml was succesful.`,
                    xml.toString().replace(/\n/g, '')
                )
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
                return response.send(
                    Utils.response(false, `Invalid json format.`, invoices)
                );
            }
            const lastInvoiceNo = await DBService.callProcCursor(
                "ei_sel_last_invoice_no", [
                invoices[0].master.seller_taxcode,
                invoices[0].master.serial_no,
                invoices[0].master.form_no,
            ],
                "ENG",
                p_crt_by,
                "N"
            );
            let last_invoice_no = lastInvoiceNo[0].INVOICE_NO;
            const last_invoice_date = lastInvoiceNo[0].INVOICE_DATE;
            const tomorrow_date = lastInvoiceNo[0].TOMORROW_DATE;
            if (isNaN(last_invoice_no)) {
                return response.send(
                    Utils.response(
                        false,
                        `Failed to create invoice no. Please contact administrator for helping.`,
                        null
                    )
                );
            }
            for (let i = 0; i < invoices.length; i++) {
                //console.log("invoices:", invoices[i])
                
                if (invoices[i].master.form_no == 1) {
                    objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn giá trị gia tăng";
                } else if (invoices[i].master.form_no == 2) {
                    objInvoice_M.HDon.DLHDon.TTChung.THDon =
                        "Hóa đơn bán hàng";
                } else if (invoices[i].master.form_no == 3) {
                    objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán tài sản công";
                } else if (invoices[i].master.form_no == 4) {
                    objInvoice_M.HDon.DLHDon.TTChung.THDon = "Hóa đơn bán hàng dự trữ quốc gia";
                } else if (invoices[i].master.form_no == 5) {
                    objInvoice_M.HDon.DLHDon.TTChung.THDon = "Tem điện tử, vé điện tử, thẻ điện tử, phiếu thu điện tử, chứng từ thu phí DV ngân hàng";
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
                        Utils.response(
                            false,
                            `invoice date cannot greater than ${tomorrow_date}.`,
                            invoices[i].master.invoice_date
                        )
                    );
                }
                objInvoice_M.HDon.DLHDon.TTChung.NLap = invoices[i].master.invoice_date;
                objInvoice_M.HDon.DLHDon.TTChung.SBKe = "";
                objInvoice_M.HDon.DLHDon.TTChung.NBKe = "";
                objInvoice_M.HDon.DLHDon.TTChung.DVTTe = invoices[i].master.tr_ccy;
                objInvoice_M.HDon.DLHDon.TTChung.TGia = invoices[i].master.tr_rate;
                objInvoice_M.HDon.DLHDon.TTChung.HTTToan =
                    invoices[i].master.payment_method;
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
                if (invoices[i].master.nature !== "0") {
                    objInvoice_M.HDon.DLHDon.TTChung.TTHDLQuan.push({
                        TCHDon: invoices[i].master.nature,
                        LHDCLQuan: invoices[i].master.invoice_type_relative,
                        KHMSHDCLQuan: invoices[i].master.form_no_relative,
                        KHHDCLQuan: invoices[i].master.serial_no_relative,
                        SHDCLQuan: invoices[i].master.invoice_no_relative,
                        NLHDCLQuan: invoices[i].master.invoice_date_relative,
                        GChu: invoices[i].master.description,
                    });
                }

                objInvoice_M.HDon.DLHDon.NDHDon.NBan.Ten = this.convertHtmlCode(
                    invoices[i].master.seller_company_name
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.MST = this.convertHtmlCode(
                    invoices[i].master.seller_taxcode
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.DChi = this.convertHtmlCode(
                    invoices[i].master.seller_address
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.SDThoai = this.convertHtmlCode(
                    invoices[i].master.seller_tel
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.DCTDTu = this.convertHtmlCode(
                    invoices[i].master.seller_email
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.STKNHang = this.convertHtmlCode(
                    invoices[i].master.seller_bank_no
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.NNBSTKNHang = "";
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.TNHang = this.convertHtmlCode(
                    invoices[i].master.seller_bank_name
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.Fax = this.convertHtmlCode(
                    invoices[i].master.seller_fax
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.Website = this.convertHtmlCode(
                    invoices[i].master.seller_website
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NBan.TTKhac = "";

                objInvoice_M.HDon.DLHDon.NDHDon.NMua.Ten = this.convertHtmlCode(
                    invoices[i].master.buyer_name
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.MST = this.convertHtmlCode(
                    invoices[i].master.buyer_taxcode
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.DChi = this.convertHtmlCode(
                    invoices[i].master.buyer_address
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.MKHang = this.convertHtmlCode(
                    invoices[i].master.buyer_code
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.SDThoai = this.convertHtmlCode(
                    invoices[i].master.buyer_phone
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.DCTDTu = this.convertHtmlCode(
                    invoices[i].master.buyer_email
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.HVTNMHang = "";
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.STKNHang = this.convertHtmlCode(
                    invoices[i].master.buyer_bank_no
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.TNHang = this.convertHtmlCode(
                    invoices[i].master.buyer_bank_name
                );
                objInvoice_M.HDon.DLHDon.NDHDon.NMua.TTKhac = "";

                objInvoice_M.HDon.DLHDon.NDHDon.DSHHDVu = [];
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TSuat =
                    this.convertHtmlCode(invoices[i].master.vat_rate);
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.ThTien =
                    invoices[i].master.amt_exclude_vat;
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.THTTLTSuat.LTSuat.TThue =
                    invoices[i].master.amt_vat;

                objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTCThue =
                    invoices[i].master.amt_exclude_vat;
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTThue =
                    invoices[i].master.amt_vat;
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.DSLPhi.LPhi = "";
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.TTCKTMai =
                    invoices[i].master.comission_amt;
                objInvoice_M.HDon.DLHDon.NDHDon.TToan.TgTTTBSo =
                    invoices[i].master.total_payment;
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
                        TLCKhau: this.convertHtmlCode(
                            invoices[i].detail[j].commission_rate
                        ),
                        STCKhau: this.convertHtmlCode(invoices[i].detail[j].commission_amt),
                        ThTien: this.convertHtmlCode(invoices[i].detail[j].net_tr_amt),
                        TSuat: this.convertHtmlCode(invoices[i].detail[j].vat_rate),
                        TTKhac: {
                            TTin: [{
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
                const xmlStr = xml.toString().replace("<DLHDon>", "<DLHDon Id='ID1'>").replace(/\n/g, '');
                //console.log("xmlStr", xmlStr)
                rtnXML.push({ master_pk: invoices[i].master.master_pk, invoice_no: last_invoice_no, xml: xmlStr });
            }

            return response.send(
                Utils.response(true, `Convert json to xml was successful.`, rtnXML)
            );
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

    convertHtmlCode(sText) {
        if (sText != null || sText == "") {
            return this.replaceAllExt(
                this.replaceAllExt(sText, "&", "&#38;"),
                '"',
                "&#34;"
            );
        } else {
            return "";
        }
    }

    replaceAllExt(strOgr, search, replacement) {
        var target = strOgr.toString();
        return target.replace(new RegExp(search, "g"), replacement);
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

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );


            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(
                    EINVOICE_URL_API, { para: para },
                    config
                );
                console.log("sendInvoiceToTaxOfficeFromClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");
            }
            return response.send(
                Utils.response(false, `Failed to send invoices.....`, null)
            );
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

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                console.log("EINVOICE_URL_API_CHECKING ", EINVOICE_URL_API_CHECKING);
                const res = await Request.post(
                    EINVOICE_URL_API_CHECKING, { para: para },
                    config
                );
                console.log("checkInvoiceStatusFromClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");

            }
            return response.send(
                Utils.response(false, `Failed to send invoices.`, null)
            );

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
                    console.log(
                        `The issuer invoice has not register [${para[i].tei_einvoice_m_pk}]`,
                        para[i].xml_signed
                    );
                    rtnValue.push({
                        tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
                        tradecode: "",
                        errmsg: "The issuer invoice has not register"
                    });
                    continue;
                } else if (masterInvoicePK.PK == 0) {
                    rtnValue.push({
                        tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
                        tradecode: "",
                        errmsg: "Duplicated data. This invoice already sent"
                    });
                    continue;
                } else if (masterInvoicePK.PK < -1) {
                    console.log(
                        `invalid xml format [${para[i].tei_einvoice_m_pk}]`,
                        para[i].xml_signed
                    );
                    rtnValue.push({
                        tei_einvoice_m_pk: para[i].tei_einvoice_m_pk,
                        tradecode: "",
                        errmsg: "Invalid xml format"
                    });
                    continue;
                }
                const tradeCode = await Request.post(
                    url, { base64XML: Buffer.from(para[i].xml_signed).toString("base64") }, {
                    agent,
                    headers: {
                        Authorization: "Basic " +
                            Buffer.from(`${authUserName}:${authPassword}`).toString(
                                "base64"
                            ),
                    },
                }
                );
                //console.log("masterInvoicePK  ", masterInvoicePK);
                
                if (tradeCode && tradeCode.data) {
                    
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
                        tradecode: tradeCode.data.maGDich,
                        cqt_code: "", //cqt_code
                        tei_einvoice_m_pk : masterInvoicePK.TEI_EINVOICE_M_PK,
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
                                        :tradecode,
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
                    let base64PDf ;
                    try{
                        let EiExcel = new EiExcelHandlerAuto(); 
                        base64PDf = await EiExcel.getEinvoice(tradeCode.data.maGDich, p_language, p_crt_by); 
                        console.log("base64PDf  ", base64PDf);
                    }catch(e)
                    {
                        base64PDf = "";
                    }

                    const para_pdf = {
                        tei_einvoice_m_pk : masterInvoicePK.TEI_EINVOICE_M_PK,
                        // base64 : "data:application/pdf;base64," + base64PDf
                        url_pdf:  base64PDf
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
                        tradecode: tradeCode.data.maGDich,
                    });
                } else {
                    return response.send(
                        Utils.response(false, `Failed to call taxoffice api.`, null)
                    );
                }
            }
            return response.send(
                Utils.response(
                    true,
                    `invoices successful`,
                    rtnValue
                )
            );
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
                    MKHang:"MKHang",
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
            const arrLTSuat = [
                jsonLTSuat[0].TSuat,
                jsonLTSuat[0].ThTien,
                jsonLTSuat[0].TThue,
            ];
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
            let v_vn_amount = Utils.Num2VNText(jsonTToan[0].TgTTTBSo, jsonTTChung[0].DVTTe);
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
            let masterPara = arrTTChung
                .concat(arrNBan)
                .concat(arrNMua)
                .concat(arrLTSuat)
                .concat(arrTToan)
                .concat(arrMCCQT);
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
            const master = await DBService.callProcCursor(
                "ei_upd_tei_einvoice_ar",
                masterPara,
                p_language,
                p_crt_by
            );
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
                    const detail = await DBService.callProcCursor(
                        "ei_upd_tei_einvoiced_ar",
                        detailPara,
                        p_language,
                        p_crt_by
                    );
                    // console.log("detail", detail);
                }
                return result_extra = {
                    PK: master[0].PK,
                    TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK
                }
            } else {
                return result_extra = {
                    PK: master[0].PK,
                    TEI_EINVOICE_M_PK: master[0].TEI_EINVOICE_M_PK
                }   //master[0].PK;
            }
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "extractXMLContent",
                CONTENT: e.message,
            });
            return result_extra = {
                PK: -2,
                TEI_EINVOICE_M_PK: 0
            }   //master[0].PK;;
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
                    "ei_upd_file_xml_v8", [para.tei_einvoice_m_pk[i], maTBao, tenTBao],
                    p_language,
                    p_crt_by
                );
                if (result[0].STATUS == "OK") {
                    rtnValue.push({
                        tradecode: para.trade_code[i],
                        tax_confirmation_code: para.tei_einvoice_m_pk[i],
                        inform_code: maTBao,
                        inform_name: tenTBao,
                        invoice_status:"1",
                        sign_dt:"",
                        cancel_dt:"",
                        cancel_cause:""
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
                Utils.response(
                    true,
                    `${para.trade_code.length} invoices was update status from tax office.`,
                    rtnValue
                )
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
            //                 tradecode: para[i],
            //                 macqt: maCQT,
            //                 xml_sign: base64XML,
            //             };
            //             const result = await DBService.ExecuteSQLBlob(
            //                 `BEGIN ei_upd_file_xml_v5(:tradecode,:macqt,:xml_sign,:p_language, :p_crt_by, :p_rtn_cur); END;`,
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
            //     tradecode: para[i],
            //     tax_confirmation_code: maCQT,
            //     inform_code: maTBao,
            //     inform_name: tenTBao,
            // });
            // rtnValue.push({
            //     tradecode: para.trade_code[i],
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
                    HDGHDBHangTGT: "HDBHang",
                    HDBTSCong: "HDBTSCong",
                    HDBHDTQGia: "HDBHDTQGia",
                    HDKhac: "HDKhac",
                    CTu: "CTu",
                },
            ];
            const jsonLHDSDung = await transform(p_xml_content, templateLHDSDung);
            const arrLHDSDung = [
                jsonLHDSDung[0].HDGTGT,
                jsonLHDSDung[0].HDGHDBHangTGT,
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

            let masterPara = arrTTChung
                .concat(arrNDTKhai)
                .concat(arrHTGDLHDDT)
                .concat(arrPThuc)
                .concat(arrLHDSDung);

            //console.log("masterPara  ",masterPara)
            const master = await DBService.callProcCursor(
                "ei_upd_tei_declaration_cloud",
                masterPara,
                p_language,
                p_crt_by
            );
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
                FUNC: "extractXMLContent",
                CONTENT: e.message,
            });
            return -1;
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

            const agent = {
                Agent: {
                    defaultPort: 443,
                    protocol: "https:",
                    options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
                },
            };
            const tradeCode = await Request.post(
                url, { base64XML: Buffer.from(para.xml_signed).toString("base64") }, {
                agent,
                headers: {
                    Authorization: "Basic " +
                        Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
                },
            }
            );

            if (tradeCode && tradeCode.data) {
                const para_value = {
                    tei_declaration_m_pk: para.erp_declaration_m_pk,
                    xml_sign: para.xml_signed,
                    trade_code: tradeCode.data.maGDich,
                    cqt_code: "", //cqt_code
                };
                const res = await DBService.ExecuteSQLBlob(
                    `BEGIN ei_upd_einvoice_ss_xml_ar(:tei_declaration_m_pk, :xml_sign, :trade_code, :cqt_code,
                                :p_language, :p_crt_by, :p_rtn_cur); END;`,
                    para_value,
                    p_language,
                    p_crt_by
                );
            } else {
                return response.send(
                    Utils.response(false, `Failed to call taxoffice api.`, null)
                );
            }
            dataJson.push({
                erp_declaration_m_pk: para.erp_declaration_m_pk,
                xml_sign: para.xml_signed,
                trade_code: tradeCode.data.maGDich,
            });
            return response.send(
                Utils.response(true, `Declaration was sent successfull.`, dataJson)
            );
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

    async sendDeclarationToTaxOfficeFromClient({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            const { proc, para } = request.all();

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                console.log("EINVOICE_URL_API_DECLARATION_SEND" + EINVOICE_URL_API_DECLARATION_SEND);
                const res = await Request.post(
                    EINVOICE_URL_API_DECLARATION_SEND, { para: para },
                    config
                );
                console.log("sendDeclarationToTaxOfficeFromClient res.data" + res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");
            }
            return response.send(
                Utils.response(false, `Failed to send declaration.`, null)
            );

        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "checkingdeclarationfromclient",
                CONTENT: e.message,
            });
            return response.send(Utils.response(false, "error", e.message));
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

            const {  para } = request.all();
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
            for (let parent of para.tradecode) {
                console.log("checkingDeclarations parent " + JSON.stringify(parent));
                // den day
                const res = await Request.get(url + parent, {
                    agent,
                    headers: {
                        Authorization: "Basic " +
                            Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
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
                    return response.send(Utils.response(false, `no data found.`));
                }
                for (let item of res.data) {
                    for (let child of item) {
                        if (child.loaiTBao == "1") {
                            base64XML = Buffer.from(
                                child.ndungTBao.base64XML,
                                "base64"
                            ).toString("utf8");
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
            return response.send(Utils.response(true, `checking_declare_success`,para_value));
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

    async checkingDeclarationsFromClient({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            const { proc, para } = request.all();

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(
                    EINVOICE_URL_API_DECLARATION_CHECK, { para: para },
                    config
                );
                console.log("checkingDeclarationsFromClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");

            }
            return response.send(
                Utils.response(false, `Failed to send invoices.`, null)
            );

        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "checkingDeclarationsFromClient",
                CONTENT: e.message,
            });
            return response.send(Utils.response(false, "error", e.message));
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
            const url =
                "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tbaonnt/tbaossot";
            const { proc, para } = request.all();
            const agent = {
                Agent: {
                    defaultPort: 443,
                    protocol: "https:",
                    options: { maxVersion: "TLSv1.2", minVersion: "TLSv1.2", path: null },
                },
            };

            const tradeCode = await Request.post(
                url, { base64XML: Buffer.from(para.xml_signed).toString("base64") }, {
                agent,
                headers: {
                    Authorization: "Basic " +
                        Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
                },
            }
            );

            if (tradeCode && tradeCode.data) {
                const para_value = {
                    erp_einvoice_ss_m_pk: para.erp_einvoice_ss_m_pk,
                    trade_code: tradeCode.data.maGDich,
                    xml_sign: para.xml_signed,
                };
                const res = await DBService.ExecuteSQLBlob(
                    `BEGIN EI_UP_6095280_DATA_TRADE_CODE(:erp_einvoice_ss_m_pk,:trade_code, :xml_sign,
                            :p_language, :p_crt_by, :p_rtn_cur); END;`,
                    para_value,
                    p_language,
                    p_crt_by
                );

                if (res.p_rtn_cur[0].STATUS == "OK") {
                    return Utils.response(true, `Call tax office api success.`, {
                        erp_einvoice_ss_m_pk: para.erp_einvoice_ss_m_pk,
                        trade_code: tradeCode.data.maGDich,
                    });
                } else {
                    return response.send(
                        Utils.response(
                            false,
                            `Something went wrong, please try again later.
                  EI_UP_6095280_DATA_TRADE_CODE`,
                            para_value
                        )
                    );
                }
            } else {
                return response.send(
                    Utils.response(false, `Failed to call taxoffice api.`, null)
                );
            }
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

    async sendInformAdjustToTaxOfficeFromClient({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            const { proc, para } = request.all();

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(
                    EINVOICE_URL_API_INFORMADJUST_SEND, { para: para },
                    config
                );
                console.log("sendInformAdjustToTaxOfficeFromClient " + res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");

            }
            return response.send(
                Utils.response(false, `Failed to send invoices.`, null)
            );

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

            const authUserName = "GENUWIN"; // "GENUWIN";
            const authPassword = "e_GX4v@"; // "e_GX4v@";// "genuwin123";// "e_GX4v@";

            //const url = "https://tvan.fpt.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";
            let url =
                "https://tvan.webhoadon.com.vn/ftvan-hddt/tbao/tcuu/tcuutbao?maGDichTNDLieu=";

            const { proc, para } = request.all();

            console.log("para", para);
            //   @TODO: remove return
            return response.send(
                Utils.response(true, `checking_declare_success`, para)
            );

            //console.log(para.tradecode.length)
            let rtnValue = [];
            //for (let i = 0; i < para.length; i++) {
            for (let i = 0; i < para.tradecode.length; i++) {
                //console.log("para_value[i].tradeCode ", para.tradecode[i]);
                const result = await Request.get(url + para.tradecode[i], {
                    agent,
                    headers: {
                        Authorization: "Basic " +
                            Buffer.from(`${authUserName}:${authPassword}`).toString("base64"),
                    },
                });
                //console.log("result", JSON.stringify(result.data));

                if (!result.data.length) {
                    return response.send(Utils.response(false, `no data found.`));
                }
                let tenTBao = "",
                    maTBao = "";
                for (let j = 0; j < result.data.length; j++) {
                    //res.length undefined !!!!!!!!!!!!!!!!!
                    const items = result.data[j];
                    //console.log("items", items);
                    for (let k = 0; k < items.length; k++) {
                        console.log("items[k].loaiTBao " + items[k].loaiTBao);
                        if (items[k].loaiTBao == "0") {
                            tenTBao = items[k].tenTBao;
                            maTBao = items[k].loaiTBao;
                        } else if (items[k].loaiTBao == "17") {
                            tenTBao = items[k].tenTBao;
                            maTBao = items[k].loaiTBao;
                        } else if (items[k].loaiTBao == "15") {
                            tenTBao = items[k].tenTBao;
                            maTBao = items[k].loaiTBao;
                        }
                    }
                }
                rtnValue.push({
                    tradecode: para.tradecode[i],
                    inform_code: maTBao,
                    inform_desc: tenTBao,
                });
            }

            return response.send(
                Utils.response(true, `checking_declare_success`, rtnValue)
            );
        } catch (e) {
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "checkInformAdjustToTaxOffice",
                CONTENT: e.message,
            });
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

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const res = await Request.post(
                    EINVOICE_URL_API_INFORMADJUST_CHECK, { para: para },
                    config
                );
                console.log("checkInformAdjustToTaxOfficeFromClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");

            }
            return response.send(
                Utils.response(false, `Failed to send invoices.`, null)
            );

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
                    income_time_yyyy: para[i].income_time_yyyy
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

            return response.send(
                Utils.response(
                    true,
                    `${para.length} invoices were sent successful.`,
                    res_data
                )
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
                    create_date: para[i].create_date
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

            return response.send(
                Utils.response(
                    true,
                    `${para.length} invoices were sent successful.`,
                    res_data
                )
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
                    price: para[i].price
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
                res_data.push(rtnValue.p_rtn_cur[0])
            }

            const para_value_taxcode = {
                master_pk: para[0].master_pk,
                seller_taxcode: para[0].seller_taxcode,
                store_code: para[0].store_code,
                pos: para[0].pos,
                receipt_number: para[0].receipt_number,
                date_of_sales: para[0].date_of_sales
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

            res_data_taxcode.push(rtnValue_re.p_rtn_cur[0])

            console.log("  rtnValue_re.p_rtn_cur[0] ", rtnValue_re.p_rtn_cur[0]);

            return response.send(
                Utils.response(
                    true,
                    `${res_data.length}` + `/` + `${para.length} rows were sent successful.`,
                    res_data_taxcode
                )
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

            const {  para } = request.all();

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

            return response.send(
                Utils.response(
                    true,
                    `Checking status einvoice successful.`,
                    rtnValue.p_rtn_cur
                )
            );
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

            return response.send(
                Utils.response(
                    true,
                    `getting taxcode successful.`,
                    result_res
                )
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

            let masterPara = {p_trade_code : para.trade_code };

            if (DB_CONNECTION == "oracle") {
                oracledb.fetchAsBuffer = [oracledb.BLOB]
                oracledb.fetchAsString = [oracledb.CLOB]
            }
            const master = await DBService.callProcCursor(
                "ei_sel_einvoice_get_pdf",
                [para.trade_code],
                p_language,
                p_crt_by
            );
            if(master)
            return response.send(
                Utils.response(
                    true,
                    `${master.length} invoices were sent successful.`,
                    master
                )
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

    async viewPDFFromClient({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            const { proc, para } = request.all();

            const token = await this.callLogin(
                EINVOICE_URL_LOGIN,
                EINVOICE_USER,
                EINVOICE_PW
            );

            if (token) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                console.log("EINVOICE_URL_API_VIEW_PDF ", EINVOICE_URL_API_VIEW_PDF);
                const res = await Request.post(
                    EINVOICE_URL_API_VIEW_PDF, { para: para },
                    config
                );
                console.log("checkInvoiceStatusFromClient", res.data);
                return response.send(res.data);
            } else {
                console.error("Failed to get api token");

            }
            return response.send(
                Utils.response(false, `Failed to send invoices.`, null)
            );

        } catch (e) {
            Utils.ConsoleLogError(e.message)
            Utils.Logger({
                LVL: "error",
                MODULE: "EInvoiceController",
                FUNC: "sendInvoiceToTaxOfficeFromClient",
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
                oracledb.fetchAsBuffer = [oracledb.BLOB]
                oracledb.fetchAsString = [oracledb.CLOB]
            }


            const { proc, para } = request.all();

            // console.log("para ", para);
            let master ;

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
                p_use_yn: para.USE_YN == true ? 'Y' : 'N',
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
                                                        p_crt_by);

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
                    p_use_yn: para.Template[0][0].USE_YN == true ? 'Y' : 'N',
                    p_tco_company_pk: para.TEI_COMPANY_PK,//para.Template[0].TCO_COMPANY_PK,
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
                    p_tac_einvoice_issuse_pk: res_issue.p_rtn_cur[0].PK,//para.Template[0].TAC_EINVOICE_ISSUSE_PK,
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
                                                            p_crt_by);

                // console.log("res_template   ++==>", res_template);        

                if (res_template.p_rtn_cur[0].PK > 0) 
                {
                    // console.log("para.ParamMaster   ++==>", para.ParamMaster);        
                    for (let i = 0; i < para.ParamMaster[0].length; i++) {
                        const para_master = {
                            p_tei_param_m_pk: para.ParamMaster[0][i].PK,
                            p_cell_code: para.ParamMaster[0][i].CELL_CODE,
                            p_data_mapping: para.ParamMaster[0][i].DATA_MAPPING,
                            p_remarks: para.ParamMaster[0][i].REMARKS,
                            p_tei_template_pk: res_template.p_rtn_cur[0].PK,// para.ParamMaster[0][i].TAC_TEMPLATE_PK,
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
                                                        p_crt_by);
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
                                                        p_crt_by);
                    }
                }

            }
            master = {
                status :"OK",
                tac_einvoice_issuse_pk : res_issue.p_rtn_cur[0].PK
            }
            return response.send(
                Utils.response(
                    true,
                    `updating template sent successful.`,
                    master
                )
            );
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
                oracledb.fetchAsBuffer = [oracledb.BLOB]
                oracledb.fetchAsString = [oracledb.CLOB]
            }
            const master = await DBService.callProcCursor(
                "ei_sel_einvoice_get_pdf",
                [para.trade_code],
                p_language,
                p_crt_by
            );
            let data_base64 ;
            if(master.p_rtn_cur[0].SIGN_PDF == null)
            {
                data_base64 = Utils.readFileByUrl(master.p_rtn_cur[0].PDF_URL);
            }
            return response.send(
                Utils.response(
                    true,
                    ` invoices were sent successful.`,
                    master
                )
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
                const year = current.getFullYear()
                let month = current.getMonth() + 1
                let day = current.getDate()
                if (day < 10) {
                    day = "0" + day
                }
                if (month < 10) {
                    month = "0" + month
                }
                let tokenEncrypted = AES.encrypt(proc + "|" + year + month + day, APP_KEY)
                tokenEncrypted = tokenEncrypted.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
                return response.send(APP_URL_LOCAL+"/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=" + tokenEncrypted)
            }

            const token2 = token.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
            const decodeToken = AES.decrypt(token2, APP_KEY);
            const arrToken = decodeToken.split("|");
            if (arrToken.length != 2) {
                return response.send(Utils.response(false, "Invalid token", null));
            }
            if (arrToken[0] !== proc) {
                return response.send(Utils.response(false, "Invalid token", null));
            }
            let ip = request.header("x-real-ip")
            if (ip == undefined) {
                ip = request.ip()
            }
            if (HOST != ip && ip != '127.0.0.1') {
                const curDate = Utils.CurrentDate();
                if (arrToken[1].substring(0, 8) != curDate) {
                    return response.send(Utils.response(false, "Token was expired", null));
                }
            }

            const result = await DBService.callProcCursor(
                proc, [pk],
                "ENG",
                "public",
                "N"
            );

            if (result.length > 0) {
                response.header("content-type", result[0].FILE_TYPE);
                response.header(
                    "Content-Disposition",
                    "attachment; filename=" + result[0].FILE_NAME
                );
                response.header("content-length", result[0].FILE_SIZE);
                return response.send(result[0].FILE_CONTENT);
            }
            return response.send(Utils.response(false, "not found data", null));

        } catch (e) {
            Utils.ConsoleLogError(e.message)
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
                    oracledb.fetchAsBuffer = [oracledb.BLOB]
                    oracledb.fetchAsString = [oracledb.CLOB]
                }
                const master = await DBService.callProcCursor(
                    "ei_sel_einvoice_get_pdf_xml",
                    [trade_code],
                    p_language,
                    p_crt_by
                );
                 
                let pdf_url_t = "";

                if(master)
                {
                    pdf_url_t = master[0].PDF_URL;
                }
                const current = new Date();
                const year = current.getFullYear()
                let month = current.getMonth() + 1
                let day = current.getDate()
                if (day < 10) {
                    day = "0" + day
                }
                if (month < 10) {
                    month = "0" + month
                }
                let token = AES.encrypt('/' + pdf_url_t + "|" + year + month + day, APP_KEY)
                token = token.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
                const pdf_url = APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + '/' + pdf_url_t + "&token=" + token
                return response.send(pdf_url)
            } catch (e) {
                return response.send(Utils.response(false, e.message, null))
            }
    }

    IsNullOrEmpty(str) {
        return str === null || str === undefined || str.trim() === '';
    }

    async GetToken()
    {
        try {
            const tokenResponse = await Request.post(`${URL}/authenticate`, {
                username: Username,
                password: Password,
                rememberMe: false
            });
            // console.log("res.data", tokenResponse);
            return tokenResponse.data.id_token;
        } catch (err) {
             console.log("err",err)
            return null;
        }

    }

    async GetCertificateRawData(token)
    {
        let para = {
            serial: Serial,
            pin: Pin,
        }
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
                params : para,
            };
       
            const certDataRes = await Request.get(`${URL}/certificate/get`, config);

            return certDataRes.data.data;
        } catch (err) {
             console.log("err",err)
            return null;
        }

    }

    async tempSignature(     base64Digest,                  //byte[]
                             base64SignatureValue,          //byte[]
                             CustomerCert,                  //X509Certificate2
                             SignedTagId,                   //string
                             SigningTagId,                  //string
                             useNamespacePrefix,            //bool
                             isTagName                      //bool
                        )
    {
        if (this.IsNullOrEmpty(SigningTagId))
        {
            SigningTagId = "serSig";
        }
        if (this.IsNullOrEmpty(SignedTagId))
        {
            throw new Exception("Signed Tag Id is required");
        }
        //string str1 = "serSig";
        let signingTagId = SigningTagId;
        let refSigningTagId = ""; //`#${SignedTagId}`;
        let signatureValue = base64SignatureValue == null ? "" : (base64SignatureValue.toString());
        let signatureMethod__Algorithm = "";
        let canonicalizationMethod_Algorithm = "";
        if (useNamespacePrefix)
        {
            canonicalizationMethod_Algorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
        }else
        {
            canonicalizationMethod_Algorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
        }

        let signatureMethod_Algorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

        if(isTagName)
        {
            refSigningTagId = ""; //`#${SignedTagId}`;
        }else
        {
            refSigningTagId = `#${SignedTagId}`;
        }

        let transform_Algorithm = "http://www.w3.org/2000/09/xmldsig#enveloped-signature";

        // loai 2 transform
        if(useNamespacePrefix)
        {

        }
        
        let digestMethod_Algorithm = "http://www.w3.org/2000/09/xmldsig#sha1" ;// "http://www.w3.org/2001/04/xmlenc#sha256";

        const signedInfoXml = create({ version: '1.0' })
                                        .ele('Signature', {Id: signingTagId, xmlns: 'http://www.w3.org/2000/09/xmldsig#',  })
                                        .ele('SignedInfo')
                                        .ele('CanonicalizationMethod', { Algorithm: canonicalizationMethod_Algorithm })
                                        .up()
                                        .ele('SignatureMethod', { Algorithm: signatureMethod_Algorithm })
                                        .up()
                                        .ele('Reference', { URI: refSigningTagId })
                                        .ele('Transforms')
                                        .ele('Transform', { Algorithm: transform_Algorithm })
                                        .up()
                                        .up()
                                        .ele('DigestMethod', { Algorithm: digestMethod_Algorithm })
                                        .ele('DigestValue')
                                        .txt(base64Digest.toString())

                                        .end({ prettyPrint: true });
            console.log(signedInfoXml);

    }

    async HashForRemote(     xd,                //XmlDocument
                             SignedTagId,       //string 
                             SigningTagId,      //string
                             namespacePrefix,   //string
                             CustomerCert,      //X509Certificate2
                             path,              //string
                             isSignTagName      //bool
                    )
        {
            try
            {
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
            }
            catch (ex)
            {
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
                    )
    {
        const builder = new Builder();
        const xmlDocument = builder.buildObject(xmlRaw);
    }
    
    async SignXml({ request, response, auth }) {
        
        try {
            var p_language = request.header("accept-language", "ENG");
            var p_crt_by = "";
            const user = await auth.getUser();
            if (user) {
                p_crt_by = user.USER_ID;
            }

            const {  para } = request.all();
             console.log("para ", JSON.stringify(para));
     
            await Request.post( EINVOICE_ESIGN_XML, { xmlContent : JSON.stringify(para)}  )
            .then(res => {
                // console.log("res  ++===> ",res.data.d);
                 let json = JSON.parse(res.data.d);
                //console.log("json ", json);
                return response.send(
                    Utils.response(true, `e-Signing XML is finish !!`, res.data.d)
                );
    
            })
            .catch(error => {
                console.log(error);
                return response.send(
                    Utils.response(false, `e-Signing XML is faile !!`, error)
                );
            })


        
           

            } catch (err) {
                console.log("err",err)
               return null;
           }

        return;
        const { tradecodes } = request.all();
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

        if (node['$'] && node['$'].id === desiredId) {
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
          } else if (typeof node[key] === 'object') {
            const result = this.findNodeById(node[key], desiredId);
            if (result) {
              return result;
            }
          }
        }
      
        return null;
      }

}

module.exports = EInvoiceController;
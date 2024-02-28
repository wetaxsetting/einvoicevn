"use strict";
const Helpers = use("Helpers");
const Utils = use("Utils");
const Request = use("Request");
const Firebase = use("Firebase");
const AES = use("AES");
const Env = use("Env");
const fs = use("fs");
const HOST = Env.get("HOST");
const APP_KEY = Env.get("APP_KEY");
const APP_URL_LOCAL = Env.get("APP_URL_LOCAL", Env.get("APP_URL"));
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const CLEAR_CACHE_URL1 = Env.get("CLEAR_CACHE_URL1", "NOCLEAR");
const CLEAR_CACHE_URL2 = Env.get("CLEAR_CACHE_URL2", "NOCLEAR");
const SESSION_TIMEOUT = Env.get("SESSION_TIMEOUT", 60);
const API_SESSION_TIMEOUT = Env.get("API_SESSION_TIMEOUT", 24 * 60);
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require("oracledb");
const lineByLine = use("n-readlines");
let _message_ids = [];
let _user_last_called = [];

class DsoController {
  async test({ request, response, auth }) {
    try {
      //console.log(request.request.headers.authorization)
      const options = {
        input: "c:\\tmp\\input.pdf",
        keyLength: 256,
        output: "c:\\tmp\\output.pdf",
        password: "Khongbiet@88",
        restrictions: {
          print: "none",
        },
      };
      const result = await Utils.setPdfPassword(options);

      // const file_path = Helpers.publicPath(`pdf2/test.pdf`)
      // const config = {
      //     format: 'A4',
      //     zoomFactor: '1', // default is 1
      //     border: { top: "0.5in", right: "0", bottom: "0.5in", left: "0" },
      //     filename: file_path
      // }

      // const html = "<html><body><h1>Hello H1</h1></body></html>"
      // const result = await Utils.createPDF(html, config)
      console.log(result);
      return response.send(Utils.response(true, "Upload file was sucessfully!", result));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadExcelToFolder({ request, response, auth }) {
    let p_crt_by = "";
    console.log("request  ", request);
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    // console.log("request  ", request);
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // const file_size = file.size;
      // const file_name = file.clientName;
      // const file_ext = file.extname;
      // const file_type = file.type;

      let { folder, proc, para, type_insert } = request.all();
      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      }

      // console.log("folder " + folder + " file_ext  " + file_ext);
      let file_path = await Utils.putExcelRootPath(file, folder, type_insert);
      console.log("file: DsoController.js:78 [vng-304] UploadExcelToFolder [vng-304] file_path:", file_path)
      let result;

      // console.log("para  ", para);

      const dbInfo = Utils.handleDBInfo(user);

      if (file_path != "") {
        const params = JSON.parse(para);
        if (type_insert === "EXCEL" || type_insert === "TEMPLATE" || type_insert === "TEMPLATE_C" || type_insert === "EXCEL_C" ) {
          file_path = file_path.replace("/resources/", "");
        } else {
          file_path = file_path.replace(folder + "/", "");
        }
        // console.log("params  ", params);
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tei_company_pk,
                                    :p_tei_template_pk,
                                    :p_type_update, 
                                    :p_url,
                                    :p_language,
                                    :p_crt_by,
                                    :p_rtn_cur); END;`,
          {
            p_tei_company_pk: params[0],
            p_tei_template_pk: params[1],
            p_type_update: type_insert,
            p_url: file_path,
          },
          p_language,
          p_crt_by,
          dbInfo
        );
      }
      return response.send(Utils.response(true, "Upload file was sucessfull", file_path));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadExcelToFolder",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async DownloadFileDBToken({ request, response, auth }) {
    try {
      const { token, proc, pk } = request.all();
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
        tokenEncrypted = tokenEncrypted.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
        return response.send(APP_URL_LOCAL + "/api/dso/getfiledbtoken?pk=" + pk + "&proc=" + proc + "&token=" + tokenEncrypted);
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
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(proc, [pk], "ENG", "public", "N");
      console.log("result ", result);
      if (result.length > 0) {
        response.header("Content-Type", result[0].FILE_TYPE);
        response.header("Content-Disposition", "attachment; filename=" + result[0].FILE_NAME);
        response.header("Content-Length", result[0].FILE_SIZE);
        return response.send(result[0].FILE_CONTENT);
      }
      return response.send(Utils.response(false, "not found data", null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "DownloadFileDBToken",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async htmlToPdf({ request, response }) {
    try {
      const { html, folder } = request.all();
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
      const dir = ROOT_DIR_FILES + "/" + folder + "/" + year + "/" + month + "/" + day;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.err(err);
        });
      }
      const unixtime = Date.now();
      const fileName = "inv-" + unixtime + ".pdf";
      const file_path = dir + "/" + fileName;
      const config = {
        format: "A4",
        zoomFactor: "1", // default is 1
        border: { top: "0.5in", right: "0", bottom: "0.5in", left: "0" },
        filename: file_path,
      };
      const result = await Utils.createPDF(html, config);
      let token = AES.encrypt("/" + folder + "/" + year + "/" + month + "/" + day + "/" + fileName + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      const pdf_url = APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + "/" + folder + "/" + year + "/" + month + "/" + day + "/" + fileName + "&token=" + token;
      return response.send(Utils.response(true, "created_file_pdf_was_successfull", { url: pdf_url }));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async stringToFile({ request, response }) {
    try {
      const { string_data, folder, ext } = request.all();
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
      const dir = ROOT_DIR_FILES + "/" + folder + "/" + year + "/" + month + "/" + day;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.err(err);
        });
      }
      const unixtime = Date.now();
      const fileName = "inv-" + unixtime + "." + ext;
      const file_path = dir + "/" + fileName;
      const result = await Utils.createPDF(string_data, file_path);
      let token = AES.encrypt("/" + folder + "/" + year + "/" + month + "/" + day + "/" + fileName + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      const pdf_url = APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + "/" + folder + "/" + year + "/" + month + "/" + day + "/" + fileName + "&token=" + token;
      return response.send(Utils.response(true, "created_file_pdf_was_successfull", { url: pdf_url }));
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async clearCache({ request, response, auth }) {
    let p_crt_by = null;
    try {
      const user = await auth.getUser();
      let result = null;
      if (user) {
        result = await DBService.clearCache();
        p_crt_by = user.USER_ID;
      }
      return response.send(Utils.response(true, "Clear cache was sucessfully!", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "clearCache",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async CallBulkInsertProcedure({ request, response, auth }) {
    console.log("CallBulkInsertProcedure");
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      console.log("para", para);
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await DBService.callBulkProcCursor(proc, para, p_language, p_crt_by, _db2);
      return response.send(Utils.response(true, "Call api bulk insert pro  was sucessfully!", result));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallBulkInsertProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async CallProcedureCLOB({ request, response, auth }) {
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let para1 = "",
        para_value = {};
      for (let i = 0; i < para.length; i++) {
        para1 += ":p_para" + (i + 1) + ", ";
        eval(`para_value.p_para` + (i + 1) + `=para[i]`);
      }
      const result = await DBService.ExecuteSQLBlob(`BEGIN ${proc}(${para1} :p_language, :p_crt_by, :p_rtn_cur); END;`, para_value, p_language, p_crt_by, _db2);
      return response.send(Utils.response(true, "Call API CLOB was sucessfully!", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureCLOB",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedureCLOBMultiRow({ request, response, auth }) {
    let p_crt_by = "";
    try {
      const { proc, para, _db2 } = request.all();
      //console.log("para", para)
      const p_language = request.header("accept-language", "ENG");
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let para1 = "",
        para_value = {};
      for (let i = 0; i < para.length; i++) {
        let row = para[i];
        para1 = "";
        para_value = {};
        for (let j = 0; j < row.length; j++) {
          para1 += ":p_para" + (j + 1) + ", ";
          eval(`para_value.p_para` + (j + 1) + `=row[j]`);
        }
        //console.log("p_para", para1)
        //console.log("para_value", para_value)
        const result = await DBService.ExecuteSQLBlob(`BEGIN ${proc}(${para1} :p_language, :p_crt_by, :p_rtn_cur); END;`, para_value, p_language, p_crt_by, _db2);
      }
      return response.send(Utils.response(true, "Call API CLOB was sucessfully!", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureCLOBMultiRow",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async writeRTDB({ request, response, auth }) {
    try {
      const { node, para } = request.all();
      //var p_language = request.header("accept-language", "ENG")
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await Firebase.updateRTDB(node, para);
      if (result != "OK") {
        return response.send(Utils.response(false, result, para));
      } else {
        return response.send(Utils.response(true, "Successfull call writeRTDB", para));
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "writeRTDB",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async getSessions({ response, auth }) {
    try {
      var p_crt_by = "";
      const user = await auth.getUser();
      return response.send(Utils.response(true, "Successfull call getSessions", _user_last_called));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "getSessions",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedure({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const now = new Date();
      const miliseconds = now.getTime();
      const found = _user_last_called.find((e) => e.pk == user.PK);
      if (found) {
        //ignore check session timeout when user login again
        for (let i = 0; i < _user_last_called.length; i++) {
          if (_user_last_called[i].pk == user.PK) {
            const idleTime = (miliseconds - (_user_last_called[i].lastcalled ? _user_last_called[i].lastcalled : 0)) / 1000 / 60;
            if (idleTime >= SESSION_TIMEOUT) {
              //response.clearCookie('token')
              if (proc.toUpperCase() != "SYS_SEL_LANGUAGE") {
                _user_last_called.splice(i, 1);
                return response.send(Utils.response(false, "your_session_timeout_logout_and_login_to_continue", { lang: p_language }));
              } else {
                _user_last_called[i].lastcalled = miliseconds;
              }
            } else {
              _user_last_called[i].lastcalled = miliseconds;
            }
            break;
          }
        }
      } else {
        //first call
        _user_last_called.push({
          pk: user.PK,
          userid: user.USER_ID,
          username: user.USER_NAME,
          lastcalled: miliseconds,
          ipaddress: ip,
        });
      }
      //console.log(_user_last_called)
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
      if (
        proc.toUpperCase().indexOf("_UPD_") > 0 ||
        proc.toUpperCase().indexOf("_PROCESS_") > 0 ||
        proc.toUpperCase().indexOf("_PRO_") > 0 ||
        proc.toUpperCase().indexOf("_DEL_") > 0 ||
        proc.toUpperCase().indexOf("_COPY_") > 0 ||
        proc.toUpperCase().indexOf("_REGEN_") > 0 ||
        proc.toUpperCase().indexOf("_NOCACHE") > 0
      ) {
        const bearerToken = request.request.headers.authorization;
        let result2 = null;
        try {
          if (CLEAR_CACHE_URL1 != "NOCLEAR") {
            result2 = await Request.post(CLEAR_CACHE_URL1, {}, { headers: { Authorization: bearerToken } });
          }
          if (CLEAR_CACHE_URL2 != "NOCLEAR") {
            result2 = await Request.post(CLEAR_CACHE_URL2, {}, { headers: { Authorization: bearerToken } });
          }
        } catch (ex) {}
      }
      return response.send(Utils.response(true, "Successfull call procedure", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallAPIProcedure({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      let ip = request.header("x-real-ip");
      if (ip == undefined) {
        ip = request.ip();
      }
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (API_SESSION_TIMEOUT > 0) {
        const now = new Date();
        const miliseconds = now.getTime();
        const found = _user_last_called.find((e) => e.pk == user.PK);
        if (found) {
          //ignore check session timeout when user login again
          for (let i = 0; i < _user_last_called.length; i++) {
            if (_user_last_called[i].pk == user.PK) {
              const idleTime = (miliseconds - _user_last_called[i].lastcalled) / 1000 / 60;
              if (idleTime >= API_SESSION_TIMEOUT) {
                //response.clearCookie('token')
                if (proc.toUpperCase() != "SYS_SEL_LANGUAGE") {
                  _user_last_called.splice(i, 1);
                  return response.send(Utils.response(false, "your_session_timeout_logout_and_login_to_continue", { lang: p_language }));
                } else {
                  _user_last_called[i].lastcalled = miliseconds;
                }
              } else {
                _user_last_called[i].lastcalled = miliseconds;
              }
              break;
            }
          }
        } else {
          //first call
          _user_last_called.push({
            pk: user.PK,
            userid: user.USER_ID,
            username: user.USER_NAME,
            lastcalled: miliseconds,
            ipaddress: ip,
          });
        }
      }
      //console.log(_user_last_called)
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }

      const result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
      return response.send(Utils.response(true, "api completed successfull", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallAPIProcedure",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async pushMobileMsg({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (API_SESSION_TIMEOUT > 0) {
        const now = new Date();
        const miliseconds = now.getTime();
        const found = _user_last_called.find((e) => e.pk == user.PK);
        if (found) {
          //ignore check session timeout when user login again
          for (let i = 0; i < _user_last_called.length; i++) {
            if (_user_last_called[i].pk == user.PK) {
              const idleTime = (miliseconds - _user_last_called[i].lastcalled) / 1000 / 60;
              if (idleTime >= API_SESSION_TIMEOUT) {
                //response.clearCookie('token')
                if (proc.toUpperCase() != "SYS_SEL_LANGUAGE") {
                  _user_last_called.splice(i, 1);
                  return response.send(Utils.response(false, "your_session_timeout_logout_and_login_to_continue", { lang: p_language }));
                } else {
                  _user_last_called[i].lastcalled = miliseconds;
                }
              } else {
                _user_last_called[i].lastcalled = miliseconds;
              }
              break;
            }
          }
        } else {
          //first call
          _user_last_called.push({
            pk: user.PK,
            userid: user.USER_ID,
            username: user.USER_NAME,
            lastcalled: miliseconds,
          });
        }
      }
      //console.log(_user_last_called)
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);

      if (result && result.length > 0) {
        let payload = {};
        for (let i = 0; i < result.length; i++) {
          if (result[i].DEVICE_ID && result[i].TITLE) {
            payload = {
              notification: {
                title: result[i].TITLE,
                body: result[i].BODY,
              },
              data: JSON.parse(result[i].DATA),
            };
            //console.log(payload)
            await Firebase.sendToDevice(result[i].DEVICE_ID, payload);
            await DBService.callProcCursor("LG_WMS_UPD_NOTICE_LOG", [result[i].PK], p_language, p_crt_by);
          }
        }
      }
      return response.send(Utils.response(true, `[${result.length}] messages was sent`, result.length));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "pushMobileMsg",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallProcedureMultiCursor({ request, response, auth }) {
    try {
      const { proc, para, number_cursor, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const result = await DBService.callProcMultiCursor(proc, para, p_language, p_crt_by, number_cursor, _db2);
      return response.send(Utils.response(true, "Successfull call procedure", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "CallProcedureMultiCursor",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async ExecuteSQL({ request, response, auth }) {
    try {
      const { sql, para, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let result = null;
      if (para) {
        result = await DBService.ExecuteSQL(sql, para, p_crt_by, _db2);
      } else {
        result = await DBService.ExecuteSQL(sql, [], p_crt_by, _db2);
      }
      //console.log(result)
      return response.send(Utils.response(true, "Sucessfull execute sql", result.rows));
    } catch (e) {
      Utils.Logger({ LVL: "error", MODULE: "DsoController", FUNC: "ExecuteSQL", CONTENT: e.message, CRT_BY: p_crt_by });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async DownloadFile({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const { table_name, pk, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      result = await DBService.ExecuteSQL(`select * from ${table_name} where pk=:pk`, { pk: pk }, p_crt_by, _db2);
      if (DB_CONNECTION == "oracle") {
        if (result.rows.length > 0) {
          response.header("content-type", result.rows[0].FILE_TYPE);
          response.header("Content-Disposition", "attachment; filename=" + result.rows[0].FILE_NAME);
          response.header("content-length", result.rows[0].FILE_SIZE);
          return response.send(result.rows[0].FILE_CONTENT);
        }
        return response.send(Utils.response(false, "not found data", null));
      } else if (DB_CONNECTION == "mysql") {
        response.header("content-type", result[0][0].FILE_TYPE);
        response.header("Content-Disposition", "attachment; filename=" + result[0][0].FILE_NAME);
        response.header("content-length", result[0][0].FILE_SIZE);
        return response.send(result[0][0].FILE_CONTENT);
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "DownloadFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async GetBlobData({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const { table_name, pk, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const result = await DBService.ExecuteSQL(`select * from ${table_name} where pk=:pk`, { pk: pk }, p_crt_by, _db2);
      if (DB_CONNECTION == "oracle") {
        return response.send(result.rows);
      } else if (DB_CONNECTION == "mysql") {
        return response.send(result[0]);
      }

      return response.send(Utils.response(false, "not_found_data", null));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "GetBlobData",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileDynamic({ request, response, auth }) {
    let p_crt_by = "";
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }

    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { proc, para, _db2 } = request.all();
      let params = JSON.parse(para);
      let result = null;

      let paraKeys = params.keys ? params.keys : Object.keys(params);
      let dbParams = "";
      let dbDatas = {};

      paraKeys.forEach((key, idx) => {
        dbParams += `:${key.startsWith("_") ? key.replace("_", "") : key}`;
        if (idx < paraKeys.length - 1) dbParams += ",";
        dbDatas[key.startsWith("_") ? key.replace("_", "") : key] = params[key] == "byte-array" ? fileBuffer : params[key];
      });

      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(`BEGIN ${proc}(${dbParams},:p_language,:p_crt_by,:p_rtn_cur); END;`, { ...dbDatas }, p_language, p_crt_by, _db2);
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(`call ${proc}(${dbParams},:p_language,:p_crt_by);`, { ...dbDatas }, p_language, p_crt_by, _db2);
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      return response.send(Utils.response(true, "Upload file was sucessfull", result));
    } catch (e) {
      //console.log(e)
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileDynamic",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFile({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // console.log(file)
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { proc, para, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const params = [...JSON.parse(para)];
      let result = null;
      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_language,:p_crt_by,:p_rtn_cur); END;`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(
          `call ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_language,:p_crt_by);`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      return response.send(Utils.response(true, "Upload file was sucessfull", result));
    } catch (e) {
      //console.log(e)
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFile2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // console.log(file)
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { proc, para, folder, _db2 } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      }

      const params = [...JSON.parse(para)];
      let result;
      if (DB_CONNECTION == "oracle") {
        result = await DBService.ExecuteSQLBlob(
          `BEGIN ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_file_path,:p_language,:p_crt_by,:p_rtn_cur); END;`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
            p_file_path: "",
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else if (DB_CONNECTION == "mysql") {
        result = await DBService.ExecuteSQLBlob(
          `call ${proc}(:p_tes_file_pk,:p_table_name,:p_master_table,:p_master_table_pk, :p_file_content,:p_file_name,:p_file_ext,:p_file_size,:p_file_type,:p_file_path,:p_language,:p_crt_by);`,
          {
            p_tes_file_pk: params[0],
            p_table_name: params[1],
            p_master_table: params[2],
            p_master_table_pk: params[3],
            p_file_content: fileBuffer,
            p_file_name: file_name,
            p_file_ext: file_ext,
            p_file_size: file_size,
            p_file_type: file_type,
            p_file_path: "",
          },
          p_language,
          p_crt_by,
          _db2
        );
      } else {
        console.log(`not support DB ${DB_CONNECTION}`);
      }

      return response.send(Utils.response(true, "Upload file was sucessfull", result));
    } catch (e) {
      //console.log(e)
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFile2",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileToFolder({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { proc, table_name, table_pk, folder } = request.all();
      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      }
      const file_path = await Utils.putFileRootPath(file, folder);

      if (!proc) {
        proc = "sys_upload_file_to_folder";
      }
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      // const paras = [para[0], para[1], file_name, p_file_ext, p_file_size, p_file_type, file_path]

      const paras = [table_pk, table_name, file_size, file_name, file_path, file_ext, file_type];
      const result = await DBService.callProcCursor(proc, paras, p_language, p_crt_by);
      return response.send(Utils.response(true, "upload_file_sucessfull", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolder",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async UploadFileToFolder2({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { proc, table_name, table_pk, folder, att_type } = request.all();
      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      }
      const file_path = await Utils.putFileRootPath(file, folder);

      if (!proc) {
        proc = "sys_upload_file_to_folder2";
      }
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      // const paras = [para[0], para[1], file_name, p_file_ext, p_file_size, p_file_type, file_path]

      const paras = [table_pk, table_name, att_type, file_size, file_name, file_path, file_ext, file_type];
      const result = await DBService.callProcCursor(proc, paras, p_language, p_crt_by);
      return response.send(Utils.response(true, "upload_file_sucessfull", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolder2",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadFileToFolderReturnURLToken({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");

      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;

      let { folder } = request.all();
      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      }
      let file_path = await Utils.putFileRootPath(file, folder);
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
      //file_path="/"+file_path
      let token = AES.encrypt(file_path + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + file_path + "&token=" + token);
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileToFolderReturnURLToken",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadManualFile({ request, response, auth }) {
    try {
      const user = await auth.getUser();
      if (user.SYSADMIN_YN !== "Y") {
        return response.send(Utils.response(false, "you_do_not_have_permission", null));
      }
      const file = request.file("file");
      let { form_id, p_language } = request.all();
      if (p_language.length != 3) {
        return response.send(Utils.response(false, "invalid_language", null));
      }
      if (form_id.length == 7) {
        const file_path = await Utils.putManualFile(file, p_language.toLowerCase(), form_id + ".pdf");
        if (file_path.indexOf("/manual") == 0) {
          return response.send(Utils.response(true, "upload_manual_successful", null));
        }
        return response.send(Utils.response(false, file_path, null));
      } else {
        return response.send(Utils.response(false, "invalid_form_id", null));
      }
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadManualFile",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async readManualFile({ request, response }) {
    try {
      const { lang, form_id } = request.get(["lang", "form_id"]);
      const filePath = Helpers.appRoot(`manual/${lang.toLowerCase()}/${form_id.toUpperCase()}.pdf`);
      if (filePath) {
        return response.attachment(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async readAttachFile({ request, response }) {
    try {
      const { token, file_name } = request.get(["token", "file_name"]);
      const file_name_decrypt = AES.decrypt(token, APP_KEY);
      if (file_name_decrypt !== file_name) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      const filePath = Helpers.tmpPath(file_name);
      if (filePath) {
        return response.download(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async getFile({ request, response }) {
    try {
      const { file_name } = request.get(["file_name"]);
      const filePath = ROOT_DIR_FILES + file_name;
      return response.attachment(filePath);
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async getFileToken({ request, response }) {
    try {
      const { token, file_name } = request.get(["token", "file_name"]);
      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== file_name) {
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
      const filePath = ROOT_DIR_FILES + file_name;
      return response.download(filePath);
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async getFileToken2({ request, response }) {
    try {
      const { token, file_name } = request.get(["token", "file_name"]);
      const token2 = token
        .replace(/p1L2u3S/g, "+")
        .replace(/s1L2a3S4h/g, "/")
        .replace(/e1Q2u3A4l/g, "=");
      const decodeToken = AES.decrypt(token2, APP_KEY);
      const arrToken = decodeToken.split("|");
      if (arrToken.length != 2) {
        return response.send(Utils.response(false, "Invalid token", null));
      }
      if (arrToken[0] !== file_name) {
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
      const filePath = ROOT_DIR_FILES.replace("/","") + file_name;
      return response.download(filePath);
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async getLogo({ request, response }) {
    let ip = request.header("x-real-ip");
    try {
      if (ip == undefined) {
        ip = request.ip();
      }
      const { token, file_name, proc, pk } = request.get(["token", "file_name", "proc", "pk"]);
      const filePath = Helpers.publicPath("logo/" + file_name);
      if (filePath) {
        if (proc && pk > 0) {
          await DBService.callProcCursor(proc, [pk, ip], "ENG", "anonymous");
        }
        return response.download(filePath);
      } else {
        return response.send(Utils.response(false, "file_not_found", null));
      }
    } catch (e) {
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async UploadFileVMS({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      //console.log(file)
      const fileContent = await Utils.readFile(file.tmpPath);
      const file_size = file.size;
      const file_name = file.clientName;
      const file_ext = file.extname;
      const file_type = file.type;
      const fileBuffer = Buffer.from(fileContent);

      const { para } = request.all();
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      const params = [...JSON.parse(para)];
      const result = await DBService.ExecuteSQLBlob(
        `BEGIN vms_upd_tvm_obj_file(:p_action, :p_tvm_obj_file_pk, :p_tvm_obj_pk, :p_file_size, :p_file_name, :p_file_path, :p_file_ext, :p_file_type, :p_file_content, :p_language, :p_crt_by, :p_rtn_cur); END;`,
        {
          p_action: params[0],
          p_tvm_obj_file_pk: params[1],
          p_tvm_obj_pk: params[2],
          p_file_size: file_size,
          p_file_name: file_name,
          p_file_path: params[3],
          p_file_ext: file_ext,
          p_file_type: file_type,
          p_file_content: fileBuffer,
        },
        p_language,
        p_crt_by
      );
      return response.send(Utils.response(true, "Upload file was sucessfully!", result));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadFileVMS",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async ConvertToPdf({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");
      // // console.log(file)
      // const fileContent = await Utils.readFile(file.tmpPath);
      // const file_size = file.size;
      // const file_name = file.clientName;
      // const file_ext = file.extname;
      // const file_type = file.type;
      // const fileBuffer = Buffer.from(fileContent);

      let rtnFile = await Utils.excelToPdf(file.tmpPath);

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
      const dir = ROOT_DIR_FILES + "/pdf/" + year + "/" + month;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          console.log(err);
        });
      }
      const unixtime = Date.now();
      const rtnFile2 = rtnFile.replace(/\\/g, "/");
      const fileName = "/pdf/" + year + "/" + month + "/rpt-" + unixtime + "-" + rtnFile2.split("/").pop();
      const destinationFile = dir + "/rpt-" + unixtime + "-" + rtnFile2.split("/").pop();
      await Utils.copyFile(rtnFile, destinationFile);
      let token = AES.encrypt(fileName + "|" + year + month + day, APP_KEY);
      token = token.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l");
      return response.send(APP_URL_LOCAL + "/api/dso/getfiletoken?file_name=" + fileName + "&token=" + token);
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "ConvertPdf",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }
  async createDictionaryAuto({ request, response, auth }) {
    try {
      const { fileid, menu_cd, _db2 } = request.all();
      let p_language = request.header("accept-language", "ENG");
      let p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      let path = `/resources/pages/${fileid.substr(0, 2)}/${fileid.substr(2, 2)}/${fileid}.vue`;
      let filePath = Helpers.appRoot(path);
      let liner = new lineByLine(filePath);

      let line;
      let startIdx;
      _message_ids = [];
      while ((line = liner.next())) {
        line = line.toString("ascii");
        startIdx = line.indexOf("$t(");
        if (startIdx > 0) {
          await this.processLineStranslate(line, fileid, p_language, p_crt_by);
        }
      }
      //process file in popup
      let popup_path = `/resources/pages/${fileid.substr(0, 2)}/${fileid.substr(2, 2)}/`;
      popup_path = Helpers.appRoot(popup_path);
      let filenames = await Utils.readDir(popup_path);
      for (let i = 0; i < filenames.length; i++) {
        if (filenames[i].indexOf(fileid) >= 0 && filenames[i].indexOf(".vue") > 0) {
          let filePartPath = popup_path + filenames[i];
          liner = new lineByLine(filePartPath);
          while ((line = liner.next())) {
            line = line.toString("ascii");
            startIdx = line.indexOf("$t(");
            if (startIdx > 0) {
              await this.processLineStranslate(line, fileid, p_language, p_crt_by);
            }
          }
        }
      }

      //process file in /resources/components/part/...
      let part_path = `/resources/components/part/${fileid.substr(0, 2)}/${fileid.substr(2, 2)}/`;
      part_path = Helpers.appRoot(part_path);
      filenames = await Utils.readDir(part_path);
      for (let i = 0; i < filenames.length; i++) {
        if (filenames[i].indexOf(fileid) >= 0 && filenames[i].indexOf(".vue") > 0) {
          let filePartPath = part_path + filenames[i];
          liner = new lineByLine(filePartPath);
          while ((line = liner.next())) {
            line = line.toString("ascii");
            startIdx = line.indexOf("$t(");
            if (startIdx > 0) {
              await this.processLineStranslate(line, fileid, p_language, p_crt_by);
            }
          }
        }
      }

      if (_message_ids.length > 0) {
        await DBService.callProcCursor("sys_upd_dictionary_auto", [_message_ids.join(), menu_cd ? menu_cd : fileid], p_language, p_crt_by, _db2);
      }

      //console.log(_message_ids)
      return response.send(Utils.response(true, "Successfull_call_procedure", filePath));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "createDictionaryAuto",
        CONTENT: e.message,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async processLineStranslate(line, fileid, p_language, p_crt_by) {
    let endIdx, message_id;
    let startIdx = line.indexOf("$t(");
    if (startIdx > 0) {
      endIdx = line.indexOf(")", startIdx);
      if (endIdx > startIdx) {
        message_id = line.substring(startIdx + 3, endIdx - 1);
        const tmp = message_id.split(",");
        message_id = tmp[0];
        message_id = message_id.replace(/\s/g, "");
        message_id = message_id.replace(/[`~!@#$%^&*()|\=?;:'",.<>\{\}\[\]\\\/]/gi, "");

        if (!_message_ids.includes(message_id) && message_id.indexOf("{") < 0) {
          _message_ids.push(message_id);
          //await DBService.callProcCursor("sys_upd_dictionary_auto", [message_id, fileid], p_language, p_crt_by)
        }
        line = line.substring(endIdx + 1, 500);

        startIdx = line.indexOf("$t(");
        if (startIdx > 0) {
          await this.processLineStranslate(line, fileid, p_language, p_crt_by);
        }
      }
    }
  }

  async pushNotification({ request, response, auth }) {
    try {
      const { proc, para, _db2 } = request.all();
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }
      if (API_SESSION_TIMEOUT > 0) {
        const now = new Date();
        const miliseconds = now.getTime();
        const found = _user_last_called.find((e) => e.pk == user.PK);
        if (found) {
          //ignore check session timeout when user login again
          for (let i = 0; i < _user_last_called.length; i++) {
            if (_user_last_called[i].pk == user.PK) {
              const idleTime = (miliseconds - _user_last_called[i].lastcalled) / 1000 / 60;
              if (idleTime >= API_SESSION_TIMEOUT) {
                //response.clearCookie('token')
                if (proc.toUpperCase() != "SYS_SEL_LANGUAGE") {
                  _user_last_called.splice(i, 1);
                  return response.send(Utils.response(false, "your_session_timeout_logout_and_login_to_continue", { lang: p_language }));
                } else {
                  _user_last_called[i].lastcalled = miliseconds;
                }
              } else {
                _user_last_called[i].lastcalled = miliseconds;
              }
              break;
            }
          }
        } else {
          //first call
          _user_last_called.push({
            pk: user.PK,
            userid: user.USER_ID,
            username: user.USER_NAME,
            lastcalled: miliseconds,
          });
        }
      }
      //console.log(_user_last_called)
      if (DB_CONNECTION == "oracle") {
        oracledb.fetchAsBuffer = [oracledb.BLOB];
        oracledb.fetchAsString = [oracledb.CLOB];
      }
      const result = await DBService.callProcCursor(proc, para, p_language, p_crt_by, _db2);
      if (result && result.length > 0) {
        let payload = {};
        const options = {
          // Required for background/quit data-only messages on iOS
          contentAvailable: true,
          // Required for background/quit data-only messages on Android
          priority: "high",
        };
        for (let i = 0; i < result.length; i++) {
          if (result[i].DEVICE_ID && result[i].TITLE) {
            payload = {
              notification: {
                titleLocKey: result[i].TITLE,
                bodyLocKey: result[i].BODY,
                sound: "default",
                priority: "high",
              },
              data: JSON.parse(result[i].DATA),
            };
            //console.log(payload)
            await Firebase.sendToDevice(result[i].DEVICE_ID, payload, options);
            await DBService.callProcCursor("LG_WMS_UPD_NOTICE_LOG", [result[i].PK], p_language, p_crt_by);
          }
        }
      }
      return response.send(Utils.response(true, `[${result.length}] messages was sent`, result.length));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "pushNotification",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async putfiletofolder({ request, response, auth }) {
    let p_crt_by = "";
    console.log("request  ", request);
    const user = await auth.getUser();
    if (user) {
      p_crt_by = user.USER_ID;
    }
    // console.log("request  ", request);
    try {
      var p_language = request.header("accept-language", "ENG");
      const file = request.file("file");  
      let { folder} = request.all();
      if (!folder) {
        return response.send(Utils.response(false, "missing_folder_parameter", null));
      } 
      //let file_path = await Utils.putExcelRootPath(file, folder, 'IMG'); 
      let file_path = await Utils.putFileRandomNameRootPathOut(file, folder, 'WETAXT'); 
      
      if (file_path != "") {  
          file_path = file_path.replace("/resources/", ""); 
      }
      return response.send(Utils.response(true, "Upload file was sucessfull", file_path));
    } catch (e) {
      Utils.ConsoleLogError(e.message);
      Utils.Logger({
        LVL: "error",
        MODULE: "DsoController",
        FUNC: "UploadExcelToFolder",
        CONTENT: e.message,
        CRT_BY: p_crt_by,
      });
      return response.send(Utils.response(false, e.message, null));
    }
  }

  async CallAPIProcedureNoAuthen({ request, response, auth }) {
    const p_crt_by = "anonymous"
    try {
        const { proc, para } = request.all()
        var p_language = request.header("accept-language", "ENG")
        const result = await DBService.callProcCursor(proc, para, p_language, p_crt_by)

        return response.send(Utils.response(true, "api anonymous completed successfull", result))
    } catch (e) {
        console.error(e)
        Utils.Logger({ LVL: "error", MODULE: "DsoController", FUNC: "CallAPIProcedureNoAuthen", CONTENT: e.message, CRT_BY: p_crt_by })
        return response.send(Utils.response(false, e.message, null))
    }
  }
}

module.exports = DsoController;

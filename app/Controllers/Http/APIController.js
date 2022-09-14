'use strict'
const Utils = use("Utils");
const Env = use("Env");
const Helpers = use("Helpers");
const ROOT_DIR_FILES = Env.get("ROOT_DIR_FILES", Helpers.tmpPath());
const fs = use("fs");
const { transform } = require('camaro');
const DB_CONNECTION = Env.get("DB_CONNECTION");
const DBService = use("DBService");
const oracledb = require('oracledb');
const Request = use("Request")

class APIController {

    async FlowAlarmBot({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }
            let { RCVR_USER_ID, CNTN, PREVIEW_LINK, PREVIEW_TTL, PREWIEW_CNTN } = request.all();
            let jsonPara = {
                "JSONData": {
                    "API_KEY": "FLOW_BOT_NOTI_API",
                    "CNTS_CRTC_KEY": "20220531-3be0d0a6-7eeb-4d9e-955f-2beb9043a24e",
                    "REQ_DATA": {
                        "BOT_ID": "genuwinbot",
                        "RCVR_USER_ID": RCVR_USER_ID,
                        "CNTN": CNTN,
                        "PREVIEW_LINK": PREVIEW_LINK,
                        "PREVIEW_TTL": PREVIEW_TTL,
                        "PREWIEW_CNTN": PREWIEW_CNTN
                    }
                }
            };
            const res = await Request.post('https://flowtest.info/OpenGate', jsonPara)
                //console.log(res.data)
            return response.send(Utils.response(true, "error", res.data));
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "EInvoiceController", FUNC: "FlowAlarmBot", CONTENT: e.message })
            return response.send(null)
        }
    }
    async FlowArticleRegister({ request, response, auth }) {
        try {
            var p_language = request.header("accept-language", "ENG")
            var p_crt_by = ""
            const user = await auth.getUser()
            if (user) {
                p_crt_by = user.USER_ID
            }
            let { RCVR_USER_ID, CNTN, PREVIEW_LINK, PREVIEW_TTL, PREWIEW_CNTN } = request.all();
            let jsonPara = {
                "JSONData": {
                    "API_KEY": "FLOW_BOT_NOTI_API",
                    "CNTS_CRTC_KEY": "20220531-3be0d0a6-7eeb-4d9e-955f-2beb9043a24e",
                    "REQ_DATA": {
                        "USER_ID": "genuwinbot",
                        "COLABO_SRNO": RCVR_USER_ID,
                        "RANGE_TYPE": CNTN,
                        "CNTN": PREVIEW_LINK,
                        "BASE64_FILE_RCV": [
                            { "FILE_NAME": "FILE.PNG", "FILE": "BASE64 VALUES" },
                            { "FILE_NAME": "FILE.PNG", "FILE": "BASE64 VALUES" }
                        ]
                    }
                }
            };
            const res = await Request.post('https://flowtest.info/OpenGate', jsonPara)
                //console.log(res.data)
            return response.send(Utils.response(true, "error", res.data));
        } catch (e) {
            Utils.Logger({ LVL: "error", MODULE: "EInvoiceController", FUNC: "FlowAlarmBot", CONTENT: e.message })
            return response.send(null)
        }
    }

}

module.exports = APIController
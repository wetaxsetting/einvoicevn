'use strict'

const Helpers = use('Helpers')
const Utils = use('Utils')
const AES = use("AES")
const Env = use("Env")
const Request = use("Request")
const LOCAL_API_URL = Env.get('LOCAL_API_URL', Env.get('API_URL'))
const fs = require('fs')
const nodemailer = require('nodemailer')
const TOKEN_PATH = '/home/www/sendmail/token/token.json'
const CREDENTIAL_FILE = '/home/www/sendmail/credential-einvoice-mail.json'
const TOKEN_PATH2 = '/home/www/sendmail/token/token2.json'
const CREDENTIAL_FILE2 = '/home/www/sendmail/credential-einvoice-mail2.json'

class SendMailController {
    async test({ request, response }) {
        try {
            const { proc, para } = request.all()
            console.log(para)
            let para2 = ''
            for (let i = 0; i < para.length; i++) {
                para2 += '?,'
            }
            if (para2.length > 1) {
                para2 = para2.substring(0, para2.length - 1)
            }
            const cnt = await Utils.ExecuteSQL(`Call ${proc} (${para2}) `, para)
                //console.log(cnt[0])
            return response.send(Utils.response(true, 'test', cnt[0][0]))
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'test', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async sendMail({ request, response, auth }) {
        try {
            let { mail_option, smtp_host, smtp_port, smtp_user, smtp_pass, tco_buspartner_pk, mail_type, template_pk, template_binding, _db2 } = request.all()
            let smtp_info = {
                host: Env.get(smtp_host),
                port: Env.get(smtp_port),
                secure: true, // true for 465, false for other ports               
                tls: {
                    secureProtocol: "TLSv1_method",
                    secure: false,
                    ignoreTLS: true,
                    rejectUnauthorized: false
                },
                auth: {
                    user: Env.get(smtp_user),
                    pass: Env.get(smtp_pass)
                }
            }
            const bearerToken = request.request.headers.authorization
            const attach_url1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].path : ''
            const attach_url2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].path : ''
            const attach_url3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].path : ''
            const attach_url4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].path : ''
            const attach_url5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].path : ''

            const filename1 = mail_option.attachments.length > 0 ? mail_option.attachments[0].filename : ''
            const filename2 = mail_option.attachments.length > 1 ? mail_option.attachments[1].filename : ''
            const filename3 = mail_option.attachments.length > 2 ? mail_option.attachments[2].filename : ''
            const filename4 = mail_option.attachments.length > 3 ? mail_option.attachments[3].filename : ''
            const filename5 = mail_option.attachments.length > 4 ? mail_option.attachments[4].filename : ''

            // const filePath = Helpers.appRoot(mail_option.html)
            // const templateBodyHTML = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
            mail_option.from = Env.get(smtp_user)
            const res = await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['i', '', tco_buspartner_pk, mail_option.subject, mail_option.html, Env.get(smtp_user), mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'Y', mail_type, template_pk], _db2 }, { headers: { Authorization: bearerToken } })

            if (res.data && res.data.data.length > 0) {
                const PK = res.data.data[0].PK
                template_binding.SYS_SENDMAIL_LOG_PK = PK
                mail_option.html = Utils.replaceString(mail_option.html, template_binding)
                const result = await Utils.smtpSendMail(mail_option, smtp_info)
                if (!result) {
                    await Request.post(LOCAL_API_URL + '/dso/apiproclob', { proc: 'sys_upd_sys_sendmail_log', para: ['u', PK, tco_buspartner_pk, '', '', mail_option.from, mail_option.to, attach_url1, attach_url2, attach_url3, attach_url4, attach_url5, filename1, filename2, filename3, filename4, filename5, 'N', mail_type, template_pk], _db2 }, { headers: { Authorization: bearerToken } })
                    return response.send(
                        Utils.response(false, 'sent_mail_failed', result)
                    )
                } else {
                    return response.send(
                        Utils.response(true, 'sent_mail_successful', result)
                    )
                }
            } else {
                return response.send(
                    Utils.response(true, 'sent_mail_failed', res)
                )
            }
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'sendMail', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
    async wrapedSendMail(mailOptions, p_token_path, p_credential_file, attachfile1, attachfile2) {
        return new Promise((resolve, reject) => {
            const credentials = JSON.parse(fs.readFileSync(p_credential_file))
            const tokens = JSON.parse(fs.readFileSync(p_token_path))
            const auth = {
                    type: 'OAuth2',
                    user: mailOptions.from,
                    clientId: credentials.installed.client_id.toString(),
                    clientSecret: credentials.installed.client_secret.toString(),
                    refreshToken: tokens.refresh_token.toString(),
                    accessToken: tokens.access_token.toString(),
                    expires: tokens.expiry_date,
                }
                //console.log(auth)	
                //console.log(mailOptions)
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: auth
            })

            transporter.sendMail(mailOptions, async function(error, info) {
                if (error) {
                    console.log("error send mail:")
                    console.log(error)
                    Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'wrapedSendMail', CONTENT: JSON.stringify(error) })
                    resolve(false) // or use rejcet(false) but then you will have to handle errors
                } else {
                    let aMailTo = mailOptions.to.split(';')
                    for (let i = 0; i < aMailTo.length; i++) {
                        await Utils.InsertTable('sendmail_log', { mailfrom: mailOptions.from, mailto: aMailTo[i], subject: mailOptions.subject, body: mailOptions.html, attachfile1: attachfile1, attachfile2: attachfile2 })
                    }
                    console.log('Email sent: ' + info.messageId)
                    resolve(true)
                }
            })
        })
    }

    async sendGMail({ request, response }) {
        try {
            const { mail_to, subject, body, attachfile1, attachfile2, filename1, filename2 } = request.all()
            let totalMailTo = mail_to.split(';')
            let mail_from = 'genuwinsolution.einvoice@gmail.com'
            let result = await Utils.ExecuteSQL("select count(*) as cnt from sendmail_log where created_at like concat(date_format(now(),'%Y-%m-%d'),'%') and mailfrom=?", [mail_from])
            let totalSend = result[0][0].cnt
            let m_token_path = TOKEN_PATH
            let m_credentail_file = CREDENTIAL_FILE
            if (totalSend + totalMailTo > 500) {
                m_token_path = TOKEN_PATH2
                m_credentail_file = CREDENTIAL_FILE2
                mail_from = 'genuwinsolution.einvoice2@gmail.com'
                result = await Utils.ExecuteSQL("select count(*) as cnt from sendmail_log where created_at like concat(date_format(now(),'%Y-%m-%d'),'%') and mailfrom=?", [mail_from])
                totalSend = result[0][0].cnt
                if (totalSend + totalMailTo > 500) {
                    Utils.Logger({ LVL: 'info', MODULE: 'SendMailController', FUNC: 'sendGMail', CONTENT: 'Sent mail over quote limitation of Gmail(500 mail/day)' })
                    return response.send(Utils.response(false, 'Sent mail over quote limitation of Gmail(500 mail/day)', null))
                }
            }

            const mailOptions = {
                from: mail_from,
                to: mail_to, // list of receivers, separate by comma(;)
                subject: subject, // Subject line
                text: '', // plain text body
                html: body, // html body
                attachments: [
                    { filename: filename1, path: attachfile1 },
                    { filename: filename2, path: attachfile2 }
                ]
            }
            result = await this.wrapedSendMail(mailOptions, m_token_path, m_credentail_file, attachfile1, attachfile2)
            return response.send(Utils.response(result, result, null))
        } catch (e) {
            Utils.Logger({ LVL: 'error', MODULE: 'SendMailController', FUNC: 'sendGMail', CONTENT: e.message })
            return response.send(Utils.response(false, e.message, null))
        }
    }
}

module.exports = SendMailController
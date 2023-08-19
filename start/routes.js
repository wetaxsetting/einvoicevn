"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const { ioc } = require('@adonisjs/fold')

Route.get('/:controller/:action', ({ auth, view, request, response, params }) => {
    const module = params.module
    const controller = params.controller
    const action = params.action
    const controllerPath = `App/Controllers/Http/report/${controller.substr(3,2)}/${controller.substr(5,2)}/`
    const url = `${controllerPath}/${controller}.${action}`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance, [{ auth, view, request, response }])
}).prefix("api/report").middleware("user");

Route.group(() => {
    Route.post("login", "UserController.logIn");
    Route.post("ssologin", "UserController.ssoLogin");
    Route.get("getuser", "UserController.getUser");
    Route.post("test", "UserController.test");
}).prefix("api/user");

Route.group(() => {
    Route.post("getssotoken", "UserController.getSSOToken");
}).prefix("api/user").middleware("user");

Route.group(() => {
    Route.post("createpassword", "UserController.createPassword")
    Route.post("updatepassword", "UserController.updatePassword");
    Route.post("updateuserpassword", "UserController.updateUserPassword")
}).prefix("api/user").middleware("user");

/**
 * -----------------------------------------------------------------
 * API Dso
 * -----------------------------------------------------------------
 */
Route.group(() => {
    Route.post("sendmail", "SendMailController.sendMail");
    Route.post("test", "DsoController.test");
    Route.post("callproc", "DsoController.CallProcedure");
    Route.post("apipro", "DsoController.CallAPIProcedure");
    Route.post("callproc2", "DsoController.CallProcedureMultiCursor");
    Route.post("apiproclob", "DsoController.CallProcedureCLOB");
    Route.post("apiproclobmulti", "DsoController.CallProcedureCLOBMultiRow");
    Route.post("pushmobilemsg", "DsoController.pushMobileMsg");
    Route.post("execsql", "DsoController.ExecuteSQL");
    Route.post("downloadfile", "DsoController.DownloadFile");
    Route.post("uploadfiledynamic", "DsoController.UploadFileDynamic");
    Route.post("uploadfile", "DsoController.UploadFile");
    Route.post("uploadfile2", "DsoController.UploadFile2");
    Route.post("getblob", "DsoController.GetBlobData");
    Route.post("uploadfilefolder", "DsoController.UploadFileToFolder");
    Route.post("uploadfilefolder2", "DsoController.UploadFileToFolder2");
    Route.post("uploadfile2folder", "DsoController.UploadFileToFolderReturnURLToken");
    Route.post("uploadfilevms", "DsoController.UploadFileVMS");
    Route.post("dictionaryauto", "DsoController.createDictionaryAuto");
    Route.post("uploadmanual", "DsoController.UploadManualFile");
    Route.post("makereport2", "ReportController.MakeReport2")
    Route.post("getfiletemplate", "ReportController.GetFileTemplate")
    Route.get("getfiletemplate2", "ReportController.GetFileTemplate2")
    Route.get("makereport", "ReportController.MakeReport")
    Route.get("importexcel", "ImportController.ImportExcel")
    Route.get("downloadtemp", "ImportController.DownloadTemp")
    Route.get("readmanual", "DsoController.readManualFile")
    Route.get("getsessions", "DsoController.getSessions")
    Route.post("writertdb", "DsoController.writeRTDB")
    Route.post("pushnotification", "DsoController.pushNotification");
    Route.post("clearcache", "DsoController.clearCache");
    Route.get("getfile", "DsoController.getFile")
    Route.post("htmltopdf", "DsoController.htmlToPdf")
    Route.get("importexcelfile", "ImportController.ImportExcelFile")
    Route.post("importeivfile", "ImportController.UploadFileToFolderEInvoice")
    Route.post("importtkhqfile", "ImportController.UploadFileToFolderTKHQ")
    Route.post("converttopdf", "DsoController.ConvertToPdf");
    Route.post("viewpdf", "EInvoiceController.viewPDF")
    // Route.post("viewpdf", "EInvoiceController.viewPDFFromClient")
    Route.post("viewxml", "EInvoiceController.viewPDF")
    Route.post("updateparamtemplate", "EInvoiceController.updateViewTemplate")
    Route.post("viewpdftest", "EInvoiceController.viewPDFTEST")
    Route.post("bulkinsertpro", "DsoController.CallBulkInsertProcedure")
}).prefix("api/dso").middleware("user");

Route.group(() => {
    Route.get("readattachfile", "DsoController.readAttachFile")
    Route.get("getfiletoken", "DsoController.getFileToken")
    Route.get("getfiledbtoken", "DsoController.DownloadFileDBToken")
    Route.get("getlogo", "DsoController.getLogo")
    Route.post("sendmailhr", "SendMailController.sendMailHR");
}).prefix("api/dso")

Route.group(() => {
    Route.post("sendalarmbot", "APIController.FlowAlarmBot")
}).prefix("api/flow").middleware("user");


Route.group(() => {
    Route.post("declare2xml", "EInvoiceController.convertDeclareUsingInvoiceToXML")
    Route.post("invoice2xml", "EInvoiceController.convertInvoiceToXML")
    Route.post("invoice2xmlfromclient", "EInvoiceController.convertInvoiceToXMLClient")
    Route.post("invalidinvoice2xml", "EInvoiceController.convertInvaliInvoiceToXML")
    Route.post("sendinvoice", "EInvoiceController.sendInvoiceToTaxOffice")
    Route.post("sendmail", "EInvoiceController.sendMail")
    Route.post("einvoicepdfconvert", "EinvoiceController.einvoicePdfConvert")
    Route.post("sendinvoicefromclient", "EInvoiceController.sendInvoiceToTaxOfficeFromClient")
    Route.post("checkinvoicestatus", "EInvoiceController.checkInvoiceStatusFromTaxOffice")
    Route.post("checkinvoicestatusfromclient", "EInvoiceController.checkInvoiceStatusFromClient")
    Route.post("senddeclaration", "EInvoiceController.sendDeclarationToTaxOffice")
    Route.post("senddeclarationfromclient", "EInvoiceController.sendDeclarationToTaxOfficeFromClient")
    Route.post("checkingdeclaration", "EInvoiceController.checkingDeclarations")
    Route.post("checkingdeclarationfromclient", "EInvoiceController.checkingDeclarationsFromClient")
    Route.post("sendinformadjustinvoice", "EInvoiceController.sendInformAdjustToTaxOffice")
    Route.post("sendinformadjustinvoicefromclient", "EInvoiceController.sendInformAdjustToTaxOfficeFromClient")
    Route.post("checkinformadjustinvoice", "EInvoiceController.checkInformAdjustToTaxOffice")
    Route.post("checkinformadjustinvoicefromclient", "EInvoiceController.checkInformAdjustToTaxOfficeFromClient")
    Route.post("signxmlesign", "EInvoiceController.SignXml")
    Route.post("checkingstatuseinvoice", "EInvoiceController.checkingStatusEInvoice")
    Route.get("downloadxml", "EInvoiceController.DownloadXML")
    Route.get("downloadpdf", "EInvoiceController.DownloadPDF")
    // WeTax
    Route.post("json-to-excel", "EInvoiceController.renderJsonToExcelFile")
    Route.post("generate-declare-xml", "EInvoiceController.weTaxconvertDeclareUsingInvoiceToXML")
    Route.post("send-declare", "EInvoiceController.weTaxSendDeclarationToTaxOffice")
    Route.post("check-status-declare", "EInvoiceController.weTaxCheckingDeclarations")
    Route.post("send-order-to-invoice", "EInvoiceController.weTaxSendOrderInfo")
    Route.post("get-sendmail-invoice-status", "EInvoiceController.weTaxCheckStausSendMail")

}).prefix("api/einvoice").middleware("user");

// Frontend
Route.any("*", "NuxtController.render");
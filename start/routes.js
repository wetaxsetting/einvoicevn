'use strict';

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
const Route = use('Route');
const {ioc} = require('@adonisjs/fold');
const { version } = require('systeminformation');

Route.get('/:controller/:action', ({auth, view, request, response, params}) => {
  const module = params.module;
  const controller = params.controller;
  const action = params.action;
  const controllerPath = `App/Controllers/Http/report/${controller.substr(3, 2)}/${controller.substr(5, 2)}/`;
  const url = `${controllerPath}/${controller}.${action}`;
  const controllerInstance = ioc.makeFunc(url);
  return controllerInstance.method.apply(controllerInstance.instance, [{auth, view, request, response}]);
})
  .prefix('api/report')
  .middleware('user');

Route.group(() => {
  Route.post('login', 'UserController.logIn');
  Route.post('ssologin', 'UserController.ssoLogin');
  Route.get('getuser', 'UserController.getUser');
  Route.post('test', 'UserController.test');
  Route.post('captchar', 'UserController.captchar');
}).prefix('api/user');

Route.group(() => {
  Route.post('getssotoken', 'UserController.getSSOToken');
})
  .prefix('api/user')
  .middleware('user');

Route.group(() => {
  Route.post('createpassword', 'UserController.createPassword');
  Route.post('updatepassword', 'UserController.updatePassword');
  Route.post('updateuserpassword', 'UserController.updateUserPassword');
  Route.post('enable2fa', 'UserController.enable2FA');
  Route.post('update2fa', 'UserController.update2FA');
  Route.post('get2fakey', 'UserController.get2FAKey');
})
  .prefix('api/user')
  .middleware('user');

/**
 * -----------------------------------------------------------------
 * API Dso
 * -----------------------------------------------------------------
 */
Route.group(() => {
  Route.post('sendmail', 'SendMailController.sendMail');
  Route.post('test', 'DsoController.test');
  Route.post('callproc', 'DsoController.CallProcedure');
  Route.post('apipro', 'DsoController.CallAPIProcedure');
  Route.post('callproc2', 'DsoController.CallProcedureMultiCursor');
  Route.post('apiproclob', 'DsoController.CallProcedureCLOB');
  Route.post('apiproclobmulti', 'DsoController.CallProcedureCLOBMultiRow');
  Route.post('pushmobilemsg', 'DsoController.pushMobileMsg');
  Route.post('execsql', 'DsoController.ExecuteSQL');
  Route.post('downloadfile', 'DsoController.DownloadFile');
  Route.post('uploadfiledynamic', 'DsoController.UploadFileDynamic');
  Route.post('uploadfile', 'DsoController.UploadFile');
  Route.post('uploadfile2', 'DsoController.UploadFile2');
  Route.post('getblob', 'DsoController.GetBlobData');
  Route.post('uploadfilefolder', 'DsoController.UploadFileToFolder');
  Route.post('uploadfilefolder2', 'DsoController.UploadFileToFolder2');
  Route.post('uploadfile2folder', 'DsoController.UploadFileToFolderReturnURLToken');
  Route.post('uploadfilevms', 'DsoController.UploadFileVMS');
  Route.post('dictionaryauto', 'DsoController.createDictionaryAuto');
  Route.post('uploadmanual', 'DsoController.UploadManualFile');
  Route.post('makereport2', 'ReportController.MakeReport2');
  Route.post('getfiletemplate', 'ReportController.GetFileTemplate');
  Route.get('getfiletemplate2', 'ReportController.GetFileTemplate2');
  Route.get('makereport', 'ReportController.MakeReport');
  Route.get('importexcel', 'ImportController.ImportExcel');
  Route.get('downloadtemp', 'ImportController.DownloadTemp');
  Route.get('readmanual', 'DsoController.readManualFile');
  Route.get('getsessions', 'DsoController.getSessions');
  Route.post('writertdb', 'DsoController.writeRTDB');
  Route.post('pushnotification', 'DsoController.pushNotification');
  Route.post('clearcache', 'DsoController.clearCache');
  Route.get('getfile', 'DsoController.getFile');
  Route.post('htmltopdf', 'DsoController.htmlToPdf');
  Route.get('importexcelfile', 'ImportController.ImportExcelFile');
  Route.post('importeivfile', 'ImportController.UploadFileToFolderEInvoice');
  Route.post('importtkhqfile', 'ImportController.UploadFileToFolderTKHQ');
  Route.post('converttopdf', 'DsoController.ConvertToPdf');
  Route.post('viewpdf', 'EInvoiceController.viewPDF');
  // Route.post("viewpdf", "EInvoiceController.viewPDFFromClient")
  Route.post('viewxml', 'EInvoiceController.viewPDF');
  Route.post('updateparamtemplate', 'EInvoiceController.updateViewTemplate');
  Route.post('viewpdftest', 'EInvoiceController.viewPDFTEST');
  Route.post('bulkinsertpro', 'DsoController.CallBulkInsertProcedure');
  Route.post('uploadfileexcel', 'DsoController.UploadExcelToFolder');
  Route.post('putfiletofolder', 'DsoController.putfiletofolder');
})
  .prefix('api/dso')
  .middleware('user');

Route.group(() => {
  Route.get('readattachfile', 'DsoController.readAttachFile');
  Route.get('getfiletoken', 'DsoController.getFileToken');
  Route.get('getfiletoken2', 'DsoController.getFileToken2');
  Route.get('getfiletokenrealtime', 'DsoController.getFileTokenRealTime');

  Route.get('getfiledbtoken', 'DsoController.DownloadFileDBToken');
  Route.get('getlogo', 'DsoController.getLogo');
  Route.post('sendmailhr', 'SendMailController.sendMailHR');
}).prefix('api/dso');

Route.group(() => {
  Route.post('sendalarmbot', 'APIController.FlowAlarmBot');
})
  .prefix('api/flow')
  .middleware('user');

Route.group(() => {
  Route.post('declare2xml', 'EInvoiceController.convertDeclareUsingInvoiceToXML');
  Route.post('invoice2xml', 'EInvoiceController.convertInvoiceToXML');
  Route.post('invoice2xmlfromclient', 'EInvoiceController.convertInvoiceToXMLClient');
  Route.post('invalidinvoice2xml', 'EInvoiceController.convertInvaliInvoiceToXML');
  Route.post('sendinvoice', 'EInvoiceController.sendInvoiceToTaxOffice');
  Route.post('sendmail', 'EInvoiceController.sendMail');
  Route.post('einvoicepdfconvert', 'EInvoiceController.einvoicePdfConvert');
  Route.post('sendinvoicefromclient', 'EInvoiceController.sendInvoiceToTaxOfficeFromClient');
  Route.post('checkinvoicestatus', 'EInvoiceController.checkInvoiceStatusFromTaxOffice');
  Route.post('checkinvoicestatusfromclient', 'EInvoiceController.checkInvoiceStatusFromClient');
  Route.post('senddeclaration', 'EInvoiceController.sendDeclarationToTaxOffice');
  Route.post('senddeclarationfromclient', 'EInvoiceController.sendDeclarationToTaxOfficeFromClient');
  Route.post('checkingdeclaration', 'EInvoiceController.checkingDeclarations');
  Route.post('checkingdeclarationfromclient', 'EInvoiceController.checkingDeclarationsFromClient');
  Route.post('sendinformadjustinvoice', 'EInvoiceController.sendInformAdjustToTaxOffice');
  Route.post('sendinformadjustinvoicefromclient', 'EInvoiceController.sendInformAdjustToTaxOfficeFromClient');
  Route.post('checkinformadjustinvoice', 'EInvoiceController.checkInformAdjustToTaxOffice');
  Route.post('checkinformadjustinvoicefromclient', 'EInvoiceController.checkInformAdjustToTaxOfficeFromClient');
  Route.post('hsm-generate-qr', 'EInvoiceController.HSMGeneralQRCode');
  Route.post('checkingstatuseinvoice', 'EInvoiceController.checkingStatusEInvoice');
  Route.get('downloadxml', 'EInvoiceController.DownloadXML');
  Route.get('downloadpdf', 'EInvoiceController.DownloadPDF');
  Route.post('updatetemplate', 'EInvoiceController.updateViewTemplateFromClient'); //VNG_304

  // WeTax
  Route.post('json-to-excel', 'EInvoiceController.renderJsonToExcelFile');
  Route.post('generate-declare-xml', 'EInvoiceController.weTaxConvertDeclareUsingInvoiceToXML');
  Route.post('send-declare-epit', 'EInvoiceController.weTaxSendDeclarationToTaxOffice');
  //Route.post('send-declare', 'EInvoiceController.weTaxSendDeclarationToTaxOffice');
  //Route.post('check-status-declare', 'EInvoiceController.weTaxCheckingDeclarations');
  //Route.post('send-declare', 'EInvoiceController.weTaxSendDeclarationToTaxOffice2');
  Route.post('check-status-declare', 'EInvoiceController.weTaxCheckingDeclarations2');
  Route.post('generate-notice-cancel-adjust-replace-xml', 'EInvoiceController.weTaxConvertInvalidInvoiceToXML');
  Route.post('send-notice-cancel-adjust-replace', 'EInvoiceController.weTaxSendInformAdjustToTaxOffice2');
  // Route.post('check-notification-status', 'EInvoiceController.weTaxCheckInformAdjustToTaxOffice');
  Route.post('check-notification-status', 'EInvoiceController.weTaxCheckInformAdjustToTaxOffice2'); // version 2.1.0
  Route.post('send-order-info', 'EInvoiceController.weTaxSendOrderInfoV2');
  Route.post('send-order-info-update', 'EInvoiceController.weTaxUpdateSendOrderInfo');
  Route.post('get-sendmail-invoice-status', 'EInvoiceController.weTaxCheckStausSendMail');
  Route.post('generate-pos-invoice-xml', 'EInvoiceController.weTaxConvertPosInvoiceToXML');
  Route.post('send-pos-invoice', 'EInvoiceController.weTaxSendPosInvoiceToTaxOffice');
  Route.post('auto-report-to-tax', 'EInvoiceController.weTaxAutoReportToTaxOffice');
  Route.post('send-invoice', 'EInvoiceController.weTaxSendInvoiceToTaxOffice');
  Route.post('check-status-invoice', 'EInvoiceController.weTaxCheckInvoiceStatusFromTaxOffice');
  Route.post('generate-invoice-xml', 'EInvoiceController.weTaxConvertInvoiceToXML');
  Route.post('generate-delivery-note-xml', 'EInvoiceController.weTaxConvertDeliveryNoteXML');
  Route.post('send-company-info', 'EInvoiceController.weTaxSendCompanyInfo');
  Route.post('re-send-order-info', 'EInvoiceController.weTaxReSendOrderInfoV2');
  Route.post('re-send-normal-invoice', 'EInvoiceController.weTaxReSendNormalInvoice');
  Route.post('send-company-template', 'EInvoiceController.weTaxSendCompanyTemplate');
  // Route.post('generate-records-xml', 'EInvoiceController.weTaxGenerateRecordsXml');
  Route.post('generate-records-xml', 'EInvoiceController.weTaxGenerateRecordsXmlN70');
  //Route.post('send-records', 'EInvoiceController.weTaxSendRecords');
  Route.post('send-records', 'EInvoiceController.weTaxSendRecordsN70');
  Route.post('re-send-mail-records', 'EInvoiceController.weTaxReSendRecords');
  Route.post('view-records', 'EInvoiceController.weTaxViewRecords');

  // e-invoice
  Route.post('general-records-xml-at', 'EInvoiceController.generalRecordsXml');
  Route.post('general-pos-invoice-xml-view', 'EInvoiceController.generalXmlPosInvoiceView');
  Route.post('general-pos-invoice-xml', 'EInvoiceController.generalXmlPosInvoice');
  Route.post('general-invoice-xml', 'EInvoiceController.generalXmlInvoice');
  Route.post('send-invoice-at', 'EInvoiceController.sendInvoice');
  Route.post('send-pos-invoice-at', 'EInvoiceController.sendPosInvoice');
  Route.post('check-status-invoice-at', 'EInvoiceController.checkInvoiceStatus');
  Route.post('general-url-pdf', 'EInvoiceController.viewPDFEPortal');
  Route.post('general-url-pdf-template', 'EInvoiceController.viewPDFTemplateEPortal');
  Route.post('general-url-pdf-einvoice-bb', 'EInvoiceController.viewPDFEinvoiceBBEPortal');
  Route.post('general-url-pdf-einvoice-bb-r', 'EInvoiceController.viewPDFEinvoiceBBReplaceEPortal');
  Route.post('send-mail-invalid-invoice', 'EInvoiceController.sendMailInvalidInvoice');
  Route.post('send-mail-at', 'EInvoiceController.sendMailAt');
  Route.post('general-pdf-template-04SS', 'EInvoiceController.viewPDFTemplate_04SS'); ////VNG-304
  Route.post('general-pdf-template-WT-04SS', 'EInvoiceController.viewPDFTemplate_WT_04SS'); ////VNG-304-6095460
  Route.post('general-url-pdf-einvoice-WT-04SS-bb', 'EInvoiceController.viewPDFTemplate_WT_04SS_BB'); ////VNG-304-6095460
  Route.post('general-url-pdf-einvoice-WT-04SS-bb-r', 'EInvoiceController.viewPDFTemplate_WT_04SS_BBR'); ////VNG-304-6095460
  Route.post('general-pdf-template-WT', 'EInvoiceController.viewPDF_InvoiceWT'); ////VNG-304
  Route.post('general-pdf-template-send-bill', 'EInvoiceController.viewPDF_SaleBillWT'); ////VNG-304
  Route.post('send-data-pos-invoice-erp', 'EInvoiceController.sendPosInvoiceErp');
  Route.post('send-invoice-erp', 'EInvoiceController.sendInvoiceErp');
  Route.post('view-pdf', 'EInvoiceController.viewPDFInvoice');
  Route.post('general-base64-from-url', 'EInvoiceController.getBase64ImgFromUrl');

  // e-invoice C#
  Route.post('declare2xml-c-sharp', 'EInvoiceController.GeneralDeclarationXML');
  Route.post('update-declare-c-sharp', 'EInvoiceController.UpdateDeclarationXML');
  Route.post('check-declare-c-sharp', 'EInvoiceController.CheckDeclarationXML');

  Route.post('invoice2xml-c-sharp', 'EInvoiceController.GeneralInvoiceXML');

  Route.post('invoice2xml-for-hsm-c-sharp', 'EInvoiceController.GeneralInvoiceHsmXML');
  Route.post('update-invoice-c-sharp', 'EInvoiceController.UpdateInvoiceXML');
  Route.post('check-invoice-c-sharp', 'EInvoiceController.CheckInvoiceXML');
  Route.post('sign-invoice-hsm-c-sharp', 'EInvoiceController.SignInvoiceHsmXML');

  Route.post('invalidinvoice2xml-c-sharp', 'EInvoiceController.GeneralInvalidInvoiceToXML');
  Route.post('update-invalid-invoice-c-sharp', 'EInvoiceController.UpdataInvalidInvoiceToXML');
  Route.post('check-invalid-invoice-c-sharp', 'EInvoiceController.CheckInvalidInvoiceToXML');

  Route.post('invalidinvoice2xml-hsm-c-sharp', 'EInvoiceController.GeneralInvalidInvoiceToHsmXML');

  Route.post('invalidinvoice2xml-from-customer-c-sharp', 'EInvoiceController.GeneralInvalidInvoiceToXMLFromCustomer');
  Route.post('update-invalid-invoice-from-customer-c-sharp', 'EInvoiceController.UpdataInvalidInvoiceToXMLFromCustomer');

  Route.post('send-mail-c-sharp', 'EInvoiceController.SendMailCSharp');
  Route.post('update-image-c-sharp', 'EInvoiceController.UpdateImage');
  Route.post('sign-invoice-c-sharp', 'EInvoiceController.SignInvoiceXML');
  Route.post('pit2xml-c-sharp', 'EInvoiceController.SignInvoiceXML');

  Route.post('pit2xml-c-sharp', 'EInvoiceController.SignInvoiceXML');
})
  .prefix('api/einvoice')
  .middleware('user');

Route.group(() => {
  Route.get('download-pdf-c-sharp', 'EInvoiceController.viewPDFInvoiceOut');
  Route.post('call-post-api', 'EInvoiceController.callPostAPI');
  Route.post('call-get-api', 'EInvoiceController.callGetAPI');
  Route.delete('call-delete-api', 'EInvoiceController.callDeleteAPI');
}).prefix('api/out/einvoice');

Route.group(() => {
  //iPOS
  Route.get('ipos-get-partner', 'IPosController.iPosGetPartner');
  Route.get('ipos-get-shop_list', 'IPosController.iPosGetShopList');
  Route.get('ipos-get-product', 'IPosController.iPosGetProduct');
  Route.get('ipos-get-invoice', 'IPosController.iPosGetInvoice');
})
  .prefix('api/ipos')
  .middleware('user');

Route.group(() => {
  //iPOS
  Route.post('hsm-generate-qr', 'HSMController.HSMGeneralQRCode');
  Route.post('hsm-sign-pdf', 'HSMController.signPdf');

  Route.post('hsm-sign-xml', 'HSMController2.HsmSignXml');
  Route.post('hsm-sign-xml-twice', 'HSMController2.HsmSignXmlTwice');
})
  .prefix('api/hsm')
  .middleware('user');

Route.group(() => {
  Route.post('get-certificates', 'HSMController2.getCertificates');
  Route.post('verify-certificate', 'HSMController2.verifyCertificate');
  Route.post('get-qr-2fa', 'HSMController2.getQr2Fa');
})
  .prefix('api/hsm/softdream')
  .middleware('user');

Route.group(() => {
  // WeTax
  Route.post('send-pos-invoice', 'EInvoiceController.weTaxSendPosInvoiceToTaxOffice2');
  Route.post('generate-notification-records-xml', 'EInvoiceController.sendInformAdjustToTaxOffice2');
  Route.post('send-company-template', 'EInvoiceController.weTaxSendCompanyTemplate2');
  Route.post('generate-pos-invoice-xml', 'EInvoiceController.weTaxConvertPosInvoiceToXML2');

  //e-invoice
  Route.post('invalidinvoice2xml', 'EInvoiceController.convertInvaliInvoiceToXML2');
  Route.post('sendinformadjustinvoice', 'EInvoiceController.sendInformAdjustToTaxOffice2');

  Route.post('send-declare', 'EInvoiceController.weTaxSendDeclarationToTaxOffice2');
  Route.post('check-status-declare', 'EInvoiceController.weTaxCheckingDeclarations2');
})
  .prefix('api/einvoice/v2')
  .middleware('user');

Route.group(() => {
  Route.post('lookup-code', 'EInvoiceController.getDataEinvoiceFormLookupCode');
  Route.post('general-convert-einvoice', 'EInvoiceController.generalConvertEinvoice');
  // Route.post('lookup-minutes', 'EInvoiceController.getDataEinvoiceFormLookupMinutesCode');
  Route.post('lookup-minutes', 'EInvoiceController.getDataEinvoiceFormLookupMinutesCode2');
  //Route.post('lookup-minutes-update', 'EInvoiceController.getUpdateXmlBuyerSign');
  Route.post('lookup-minutes-update', 'EInvoiceController.getUpdateXmlBuyerSign2');

}).prefix('api/einvoice');

Route.group(() => {
  Route.get('ReceiveSmsStatus', 'EInvoiceController.receiveSmsStatus');
}).prefix('api/callbackotp');

Route.group(() => {
  Route.post('report-to-tax', 'EInvoiceController2.weTaxPosReportToTax');
})
  .prefix('api/einvoice/pos')
  .middleware('user');

// ======== clone WeTax
Route.group(() => {
  Route.post('login', 'UserController.cloneWeTaxlogIn');
  Route.post('get-token', 'UserController.getTokenWeTaxlogIn');
}).prefix('api/wtx/pa/v1/auth');

// Public api
Route.group(() => {
  Route.post('generate', 'PublicApiController.generateQrPayment');
}).prefix('api/pa/qr-payment');

Route.group(() => {
  Route.post('shops', 'WeTaxController.createShopByPos');
  Route.delete('shops/:shop_id', 'WeTaxController.deleteShopByPos');
  Route.post('invoices', 'WeTaxController.createInvoicesByPos');
  Route.post('sendOrderInfo', 'WeTaxController.sendOrderInfo');
  Route.post('requestEinvoiceInfo', 'WeTaxController.requestEinvoiceInfo');
})
  .prefix('api/wtx/pa/v1/pos')
  .middleware('user');

Route.group(() => {
  Route.post('generate', 'PublicApiController.generateQrPayment');
}).prefix('api/pa/qr-payment');

Route.group(() => {
  Route.post('sync', 'WeTaxController.iposSync');
})
  .prefix('api/wtx/pa/v1/ipos')
  .middleware('user');
// Frontend

Route.any('*', 'NuxtController.render');

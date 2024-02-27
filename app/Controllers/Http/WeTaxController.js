"use strict";
const Utils = use("Utils");
const DBService = use("DBService");

class WeTaxController {

  async iposSysnc({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { data } = request.all();

      if (!data?.length) {
        return response
          .status(400)
          .json(
            Utils.weTaxResponse({ code: 400, message: "Invalid: parameter" })
          );
      }

      for (let i = 0; i < data.length; i++) {
        // const params = {
        //   ref_id: bills[i].ref_id,
        //   tax_id: bills[i].tax_id,
        //   tax_company_name: bills[i].tax_company_name,
        //   tax_address: bills[i].tax_address,
        //   tax_buyer_name: bills[i].tax_buyer_name,
        //   receiver_email: bills[i].receiver_email,
        //   receiver_email_cc: bills[i].receiver_email_cc,
        //   order_date: bills[i].order_date,
        //   store_code: bills[i].store_code,
        //   pos_number: bills[i].pos_number,
        //   order_id: bills[i].order_id,
        // };

        // const res = await DBService.ExecuteSQLBlob(
        //   `BEGIN WETAX_PRO_IPOS_SYNC_SALE(
        //                                 :ref_id,
        //                                 :tax_id,
        //                                 :tax_company_name,
        //                                 :tax_address,
        //                                 :tax_buyer_name,
        //                                 :receiver_email,
        //                                 :receiver_email_cc,
        //                                 :order_date,
        //                                 :store_code,
        //                                 :pos_number,
        //                                 :order_id,
        //                                 :p_language, 
        //                                 :p_crt_by, 
        //                                 :p_rtn_cur); 
        //                                 END;`,
        //   params,
        //   p_language,
        //   p_crt_by
        // );
      }

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "iposSysnc",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }

  async requestEinvoiceInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { bills } = request.all();

      if (!bills?.length) {
        return response
          .status(400)
          .json(
            Utils.weTaxResponse({ code: 400, message: "Invalid: parameter" })
          );
      }

      for (let i = 0; i < bills.length; i++) {
        if (
          // !bills[i].ref_id ||
          // !bills[i].tax_id ||
          // !bills[i].tax_company_name ||
          // !bills[i].tax_address ||
          // !bills[i].tax_buyer_name ||
          // !bills[i].receiver_email ||
          // !bills[i].receiver_email_cc ||
          !bills[i].order_date ||
          !bills[i].store_code ||
          !bills[i].pos_number ||
          !bills[i].order_id
        ) {
          continue;
        }

        const params = {
          ref_id: bills[i].ref_id,
          tax_id: bills[i].tax_id,
          tax_company_name: bills[i].tax_company_name,
          tax_address: bills[i].tax_address,
          tax_buyer_name: bills[i].tax_buyer_name,
          receiver_email: bills[i].receiver_email,
          receiver_email_cc: bills[i].receiver_email_cc,
          order_date: bills[i].order_date,
          store_code: bills[i].store_code,
          pos_number: bills[i].pos_number,
          order_id: bills[i].order_id,
        };

        const res = await DBService.ExecuteSQLBlob(
          `BEGIN WETAX_upd_cus_to_bill(
                                        :ref_id,
                                        :tax_id,
                                        :tax_company_name,
                                        :tax_address,
                                        :tax_buyer_name,
                                        :receiver_email,
                                        :receiver_email_cc,
                                        :order_date,
                                        :store_code,
                                        :pos_number,
                                        :order_id,
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                                        END;`,
          params,
          p_language,
          p_crt_by
        );
      }

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "requestEinvoiceInfo",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }
  async sendOrderInfo({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { bills } = request.all();

      if (!bills?.length) {
        return response
          .status(400)
          .json(
            Utils.weTaxResponse({ code: 400, message: "Invalid: parameter" })
          );
      }

      for (let i = 0; i < bills.length; i++) {
        if (
          !bills[i].ref_id ||
          !bills[i].store_code ||
          !bills[i].store_name ||
          !bills[i].order_date ||
          !bills[i].order_time ||
          !bills[i].pos_number ||
          !bills[i].order_id ||
          !bills[i].trans_type ||
          !bills[i].payment_method
        ) {
          continue;
        }

        const params = {
          ref_id: bills[i].ref_id,
          store_code: bills[i].store_code,
          store_name: bills[i].store_name,
          order_date: bills[i].order_date,
          order_time: bills[i].order_time,
          pos_number: bills[i].pos_number,
          order_id: bills[i].order_id,
          trans_type: bills[i].trans_type,
          payment_method: bills[i].payment_method,
        };

        const res = await DBService.ExecuteSQLBlob(
          `BEGIN WETAX_PRO_create_mst_bill(
                                        :ref_id,
                                        :store_code,
                                        :store_name,
                                        :order_date,
                                        :order_time,
                                        :pos_number,
                                        :order_id,
                                        :trans_type,
                                        :payment_method,
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                                        END;`,
          params,
          p_language,
          p_crt_by
        );

        // console.log(res.p_rtn_cur[0].PK);
        if (res.p_rtn_cur[0].PK) {
          for (let j = 0; j < bills[i].list_product.length; j++) {
            const element = bills[i].list_product[j];

            const params2 = {
              mst_pk: res.p_rtn_cur[0].PK,
              ref_id: bills[i].ref_id,
              store_code: bills[i].store_code,
              order_date: bills[i].order_date,
              order_time: bills[i].order_time,
              pos_number: bills[i].pos_number,
              order_id: bills[i].order_id,

              item_code: element.item_code,
              item_name: element.item_name,
              uom: element.uom,
              unit_price: element.unit_price,
              quantity: element.quantity,
              sale_price: element.sale_price,
              total_amount: element.total_amount,
              vat_rate: element.vat_rate,
              vat_amount: element.vat_amount,
              paying_amount: element.paying_amount,
            };

            const res2 = await DBService.ExecuteSQLBlob(
              `BEGIN WETAX_PRO_create_dtl_bill(
                                            :mst_pk,
                                            :ref_id,
                                            :store_code,
                                            :order_date,
                                            :order_time,
                                            :pos_number,
                                            :order_id,
                                            :item_code,
                                            :item_name,
                                            :uom,
                                            :unit_price,
                                            :quantity,
                                            :sale_price,
                                            :total_amount,
                                            :vat_rate,
                                            :vat_amount,
                                            :paying_amount,
                                            :p_language, 
                                            :p_crt_by, 
                                            :p_rtn_cur); 
                                            END;`,
              params2,
              p_language,
              p_crt_by
            );
          }
        }
      }

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "sendOrderInfo",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }
  async createShopByPos({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { shops } = request.all();

      if (!shops?.length) {
        return response
          .status(400)
          .json(
            Utils.weTaxResponse({ code: 400, message: "Invalid: parameter" })
          );
      }

      for (let i = 0; i < shops.length; i++) {
        if (!shops[i].shop_code || !shops[i].shop_name) {
          continue;
        }

        const params = {
          shop_code: shops[i].shop_code,
          shop_name: shops[i].shop_name,
          address: shops[i].address,
          fax_no: shops[i].fax_no,
          tel_no: shops[i].tel_no,
          email: shops[i].email,
          logo: shops[i].logo,
        };

        await DBService.ExecuteSQLBlob(
          `BEGIN WETAX_PRO_create_shop(
                                        :shop_code,
                                        :shop_name,
                                        :address,
                                        :fax_no,
                                        :tel_no,
                                        :email,
                                        :logo,
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                                        END;`,
          params,
          p_language,
          p_crt_by
        );
      }

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "createShopByPos",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }
  async deleteShopByPos({ request, response, auth, params }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const shop_id = params.shop_id;

      if (!shop_id) {
        return response
          .status(400)
          .json(Utils.weTaxResponse({ code: 400, message: "Bad request!" }));
      }

      const para = {
        shop_id: shop_id,
      };

      await DBService.ExecuteSQLBlob(
        `BEGIN WETAX_del_create_shop(
                                        :shop_id,
                                        :p_language, 
                                        :p_crt_by, 
                                        :p_rtn_cur); 
                                        END;`,
        para,
        p_language,
        p_crt_by
      );

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "deleteShopByPos",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }

  async createInvoicesByPos({ request, response, auth }) {
    try {
      var p_language = request.header("accept-language", "ENG");
      var p_crt_by = "";
      const user = await auth.getUser();
      if (user) {
        p_crt_by = user.USER_ID;
      }

      const { invoices } = request.all();

      if (!invoices.length) {
        return response
          .status(400)
          .json(Utils.weTaxResponse({ code: 400, message: "Bad request!" }));
      }

      for (let i = 0; i < invoices.length; i++) {
        if (
          !invoices[i].shop_code ||
          !invoices[i].order_date ||
          !invoices[i].order_id ||
          !invoices[i].pos_number
        ) {
          continue;
        }

        const para = {
          ref_id: invoices[i].ref_id,
          cqt_code: invoices[i].cqt_code,
          shop_code: invoices[i].shop_code,
          shop_name: invoices[i].shop_name,
          order_date: invoices[i].order_date,
          order_id: invoices[i].order_id,
          pos_number: invoices[i].pos_number,
          trans_type: invoices[i].trans_type,
          currency_code: invoices[i].currency_code,
          exchange_rate: invoices[i].exchange_rate,
          payment_method: invoices[i].payment_method,
          buyer_comp_name: invoices[i].buyer_comp_name,
          buyer_tax_code: invoices[i].buyer_tax_code,
          buyer_address: invoices[i].buyer_address,
          buyer_tel: invoices[i].buyer_tel,
          buyer_email: invoices[i].buyer_email,
          buyer_nm: invoices[i].buyer_nm,
          buyer_cccd: invoices[i].buyer_cccd,
        };

        const res = await DBService.ExecuteSQLBlob(
          `BEGIN WETAX_PRO_CREATE_MST_INVOICE(
                                                :ref_id,
                                                :cqt_code,
                                                :shop_code,
                                                :shop_name,
                                                :order_date,
                                                :order_id,
                                                :pos_number,
                                                :trans_type,
                                                :currency_code,
                                                :exchange_rate,
                                                :payment_method,
                                                :buyer_comp_name,
                                                :buyer_tax_code,
                                                :buyer_address,
                                                :buyer_tel,
                                                :buyer_email,
                                                :buyer_nm,
                                                :buyer_cccd,
                                                :p_language, 
                                                :p_crt_by, 
                                                :p_rtn_cur); 
                                                END;`,
          para,
          p_language,
          p_crt_by
        );

        console.log(res.p_rtn_cur[0].PK);
      }

      return response
        .status(200)
        .json(Utils.weTaxResponse({ code: 200, message: "success" }));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "WeTaxController",
        FUNC: "createInvoicesByPos",
        CONTENT: e.message,
      });
      // console.log("e ", e);
      return response
        .status(409)
        .json(Utils.weTaxResponse({ code: 409, message: e.message }));
    }
  }
}

module.exports = WeTaxController;

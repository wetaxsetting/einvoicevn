"use strict";
const Utils = use("Utils");
const Request = use("Request");
const DBService = use("DBService");

class IPosController {
  async iPosGetPartner({ request, response, auth }) {
    try {
          var p_language = request.header("accept-language", "ENG");
          var p_crt_by = "";
          const user = await auth.getUser();
          if (user) {
            p_crt_by = user.USER_ID;
          }
          const url_api = "https://api.foodbook.vn/ipos/ws/xpartner/pos_parents?access_token=JHTHWPCE6OCZBW0PBH9XRRBC6JTR1UWQ";
          const res_get = await Request.get(url_api);
          
          if (res_get.data.data != null ) {
            //result_res = res_get.data;
            //console.log(partner.id)
            for (const partner of res_get.data.data)
            {
              console.log(partner.id)
              const para_value = {
                p_id : partner.id,
                p_name : partner.name,
                p_is_send_sms : partner.is_send_sms,
                p_logo_img : partner.Logo_Image,
                p_number_total_pos :partner.Number_Total_Pos,
              };
              // console.log("para_value  ", para_value);
      
              const rtnValueMaster = await DBService.ExecuteSQLBlob(
                `BEGIN EI_UPD_IPOS_PARTNER    (  :p_id,
                                              :p_name,
                                              :p_is_send_sms,
                                              :p_logo_img,
                                              :p_number_total_pos,
                                              :p_language, 
                                              :p_crt_by, 
                                              :p_rtn_cur); END;`,
                para_value,
                p_language,
                p_crt_by
              );
            }

          } else {
            //result_res = res_get.data.data;
          }

          return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!"}));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "viewPDF_SaleBillWT",
        CONTENT: e.message,
      });
      console.log(e);
      return response.status(400).json(Utils.responseByRule({success : false, message : "Data faile!"}));
    }
  }

  async iPosGetShopList({ request, response, auth }) {
    try {
          var p_language = request.header("accept-language", "ENG");
          var p_crt_by = "";
          const user = await auth.getUser();
          if (user) {
            p_crt_by = user.USER_ID;
          }
          const url_api = "https://api.foodbook.vn/ipos/ws/xpartner/pos_of_parent?access_token=JHTHWPCE6OCZBW0PBH9XRRBC6JTR1UWQ&pos_parent=SAOBANG";
          const res_get = await Request.get(url_api);

          console.log("res_get  ", res_get.data.data);
          //return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!", res_get}));
          
          if (res_get.data.data != null ) {
            //result_res = res_get.data;
            //console.log(partner.id)
            for (const shop of res_get.data.data)
            {
              console.log(shop.Id)
              const para_value = {
                p_id: shop.Id,
                p_phone_number: shop.Phone_Number,
                p_pos_name: shop.Pos_Name,
                p_pos_longitude: shop.Pos_Longitude,
                p_pos_latitude: shop.Pos_Latitude,
                p_pos_parent: shop.Pos_Parent,
                p_pos_address: shop.Pos_Address,
                p_image_path: shop.Image_Path,
                p_image_path_thumb: shop.Image_Path_Thumb,
                p_active: shop.Active,
                p_partner_register_status: shop.partner_register_status
              };
              // console.log("para_value  ", para_value);
      
              const rtnValueMaster = await DBService.ExecuteSQLBlob(
                `BEGIN EI_UPD_IPOS_SHOP    (  :p_id,
                                              :p_phone_number,
                                              :p_pos_name,
                                              :p_pos_longitude,
                                              :p_pos_latitude,
                                              :p_pos_parent,
                                              :p_pos_address,
                                              :p_image_path,
                                              :p_image_path_thumb,
                                              :p_active,
                                              :p_partner_register_status,
                                              :p_language, 
                                              :p_crt_by, 
                                              :p_rtn_cur); END;`,
                para_value,
                p_language,
                p_crt_by
              );
            }

          } else {
            //result_res = res_get.data.data;
          }

          return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!"}));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "viewPDF_SaleBillWT",
        CONTENT: e.message,
      });
      console.log(e);
      return response.status(400).json(Utils.responseByRule({success : false, message : "Data faile!"}));
    }
  }

  async iPosGetProduct({ request, response, auth }) {
    try {
          var p_language = request.header("accept-language", "ENG");
          var p_crt_by = "";
          const user = await auth.getUser();
          if (user) {
            p_crt_by = user.USER_ID;
          }
          
          const url_api = "https://api.foodbook.vn/ipos/ws/xpartner/v2/items?access_token=JHTHWPCE6OCZBW0PBH9XRRBC6JTR1UWQ&pos_parent=SAOBANG&pos_id=3160&menu_type=ACTIVE";
          const res_get = await Request.get(url_api);
          
          //console.log(res_get)
          if (res_get.data.data.items != null ) {
            //result_res = res_get.data;
            //console.log(partner.id)
            for (const product of res_get.data.data.items)
            {
              console.log(product.id)
              const para_value = {

                p_id: product.id,
                p_name: product.name,
                p_ta_price: product.ta_price,
                p_ots_price: product.ots_price,
                p_sort: product.sort,
                p_store_id: product.store_id,
                p_store_item_id: product.store_item_id,
                p_type_id: product.type_id,
                p_description: product.description,
                p_status: product.status,
                p_is_featured: product.is_featured,
                p_allow_take_away: product.allow_take_away,
                p_allow_self_order: product.allow_self_order,
                p_update_at: product.update_at,
                p_is_eat_with: product.is_eat_with,
                p_time_sale_date_week: product.time_sale_date_week,
                p_time_sale_hour_day: product.time_sale_hour_day,

              };
              // console.log("para_value  ", para_value);
      
              const rtnValueMaster = await DBService.ExecuteSQLBlob(
                `BEGIN EI_UPD_IPOS_ITEM    (  :p_id, 
                                              :p_name, 
                                              :p_ta_price, 
                                              :p_ots_price, 
                                              :p_sort, 
                                              :p_store_id, 
                                              :p_store_item_id, 
                                              :p_type_id, 
                                              :p_description, 
                                              :p_status, 
                                              :p_is_featured, 
                                              :p_allow_take_away, 
                                              :p_allow_self_order, 
                                              :p_update_at, 
                                              :p_is_eat_with, 
                                              :p_time_sale_date_week, 
                                              :p_time_sale_hour_day,
                                              :p_language, 
                                              :p_crt_by, 
                                              :p_rtn_cur); END;`,
                para_value,
                p_language,
                p_crt_by
              );
            }

          } else {
            //result_res = res_get.data.data;
          }

          return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!"}));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "viewPDF_SaleBillWT",
        CONTENT: e.message,
      });
      console.log(e);
      return response.status(400).json(Utils.responseByRule({success : false, message : "Data faile!"}));

    }
  }

  async iPosGetInvoice({ request, response, auth }) {
    try {
          var p_language = request.header("accept-language", "ENG");
          var p_crt_by = "";
          const user = await auth.getUser();
          if (user) {
            p_crt_by = user.USER_ID;
          }
          const config = {
            headers: { access_token : `BNPEG2A7JVVZKBGJZVGKQXYJLY5RXKQ6AMEO` },
          };

          const url_api = "https://dwapis-dev.ipos.vn/api/v1/partners/get-sales?sale_id=1R6GN4JBRW59FOC0QUAU2TUN&store_id=NR6LKZ0BR7AW&brand_id=SPOLHCM4";

          const res_get = await Request.get(url_api, config);
          
          //console.log(res_get.data.data)

          //return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!",  data: res_get.data.data}));

          if (res_get.data.data != null ) {
            //result_res = res_get.data;
            //console.log(partner.id)
            for (const invoice of res_get.data.data)
            {
              const para_value = {
                p_id						 :  invoice.id || '', 
                p_created_at                 :  invoice.created_at || '', 
                p_updated_at                 :  invoice.updated_at || '', 
                p_deleted                    :  invoice.deleted || '', 
                p_datastate                  :  invoice.datastate || '', 
                p_sale_id                    :  invoice.sale_id || '', 
                p_origin_sale_id             :  invoice.origin_sale_id || '', 
                p_tran_date                  :  invoice.tran_date || '', 
                p_is_web                     :  invoice.is_web || '', 
                p_is_group_bill              :  invoice.is_group_bill || '', 
                p_source_fb_id               :  invoice.source_fb_id || '', 
                p_check_sum                  :  invoice.check_sum || '', 
                p_amount_org                 :  invoice.amount_org || '', 
                p_amount                     :  invoice.amount || '', 
                p_amount_discount_price      :  invoice.amount_discount_price || '', 
                p_amount_discount_detail     :  invoice.amount_discount_detail || '', 
                p_amount_discount_extra      :  invoice.amount_discount_extra || '', 
                p_amount_service_charge      :  invoice.amount_service_charge || '', 
                p_amount_vat                 :  invoice.amount_vat || '', 
                p_coupon_amount              :  invoice.coupon_amount || '', 
                p_coupon_amount_paid         :  invoice.coupon_amount_paid || '', 
                p_ship_charge                :  invoice.ship_charge || '', 
                p_commission_amount          :  invoice.commission_amount || '', 
                p_fb_store_id                :  invoice.fb_store_id || '', 
                p_pos_type                   :  invoice.pos_type || '', 
                p_store_id                   :  invoice.store_id || '', 
                p_brand_id                   :  invoice.brand_id || '', 
                p_company_id                 :  invoice.company_id || '', 
              };
      
              const rtnValueMaster = await DBService.ExecuteSQLBlob(
                  `BEGIN EI_UPD_IPOS_DATA    (  :p_id					   ,
                                                :p_created_at              ,
                                                :p_updated_at              ,
                                                :p_deleted                 ,
                                                :p_datastate               ,
                                                :p_sale_id                 ,
                                                :p_origin_sale_id          ,
                                                :p_tran_date               ,
                                                :p_is_web                  ,
                                                :p_is_group_bill           ,
                                                :p_source_fb_id            ,
                                                :p_check_sum               ,
                                                :p_amount_org              ,
                                                :p_amount                  ,
                                                :p_amount_discount_price   ,
                                                :p_amount_discount_detail  ,
                                                :p_amount_discount_extra   ,
                                                :p_amount_service_charge   ,
                                                :p_amount_vat              ,
                                                :p_coupon_amount           ,
                                                :p_coupon_amount_paid      ,
                                                :p_ship_charge             ,
                                                :p_commission_amount       ,
                                                :p_fb_store_id             ,
                                                :p_pos_type                ,
                                                :p_store_id                ,
                                                :p_brand_id                ,
                                                :p_company_id              ,
                                                :p_language,
                                                :p_crt_by,
                                                :p_rtn_cur);END;`,
                para_value,
                p_language,
                p_crt_by
              );

              console.log("rtnValueMaster  ", rtnValueMaster)
              if(rtnValueMaster.p_rtn_cur && rtnValueMaster.p_rtn_cur[0].STATUS == 'OK')
              {
                
                const para_sale = {
                  p_ipos_data_pk            : rtnValueMaster.p_rtn_cur[0].PK,
                  p_vat                     : invoice.sale.vat || '',
                  p_note                    : invoice.sale.note || '',
                  p_pos_id                  : invoice.sale.pos_id || '',
                  p_status                  : invoice.sale.status || '',
                  p_area_id                 : invoice.sale.area_id || '',
                  p_is_temp                 : invoice.sale.is_temp || '',
                  p_room_id                 : invoice.sale.room_id || '',
                  p_sale_id                 : invoice.sale.sale_id || '',
                  p_tran_id                 : invoice.sale.tran_id || '',
                  p_tran_no                 : invoice.sale.tran_no || '',
                  p_user_id                 : invoice.sale.user_id || '',
                  p_shift_id                : invoice.sale.shift_id || '',
                  p_store_id                : invoice.sale.store_id || '',
                  p_vat_sign                : invoice.sale.vat_sign || '',
                  p_date_last               : invoice.sale.date_last || '',
                  p_hour_last               : invoice.sale.hour_last || '',
                  p_sale_sign               : invoice.sale.sale_sign || '',
                  p_source_id               : invoice.sale.source_id || '',
                  p_tran_date               : invoice.sale.tran_date || '',
                  p_user_name               : invoice.sale.user_name || '',
                  p_get_amount              : invoice.sale.get_amount || '',
                  p_session_id              : invoice.sale.session_id || '',
                  p_store_name              : invoice.sale.store_name || '',
                  p_vat_amount              : invoice.sale.vat_amount || '',
                  p_customer_id             : invoice.sale.customer_id || '',
                  p_device_code             : invoice.sale.device_code || '',
                  p_minute_last             : invoice.sale.minute_last || '',
                  p_number_male             : invoice.sale.number_male || '',
                  p_print_count             : invoice.sale.print_count || '',
                  p_vat_content             : invoice.sale.vat_content || '',
                  p_vat_tran_no             : invoice.sale.vat_tran_no || '',
                  p_amount_point            : invoice.sale.amount_point || '',
                  p_coupon_count            : invoice.sale.coupon_count || '',
                  p_last_version            : invoice.sale.last_version || '',
                  p_promotion_id            : invoice.sale.promotion_id || '',
                  p_shift_charge            : invoice.sale.shift_charge || '',
                  p_source_fb_id            : invoice.sale.source_fb_id || '',
                  p_station_code            : invoice.sale.station_code || '',
                  p_tran_no_temp            : invoice.sale.tran_no_temp || '',
                  p_vat_tax_code            : invoice.sale.vat_tax_code || '',
                  p_coupon_amount           : invoice.sale.coupon_amount || '',
                  p_exchange_rate           : invoice.sale.exchange_rate || '',
                  p_membership_id           : invoice.sale.membership_id || '',
                  p_number_female           : invoice.sale.number_female || '',
                  p_number_people           : invoice.sale.number_people || '',
                  p_return_amount           : invoice.sale.return_amount || '',
                  p_store_address           : invoice.sale.store_address.formatted_address || '',
                  p_vat_bank_name           : invoice.sale.vat_bank_name || '',
                  p_vat_tran_date           : invoice.sale.vat_tran_date || '',
                  p_card_info_code          : invoice.sale.card_info_code || '',
                  p_deposit_amount          : invoice.sale.deposit_amount || '',
                  p_discount_extra          : invoice.sale.discount_extra || '',
                  p_origin_sale_id          : invoice.sale.origin_sale_id || '',
                  p_payment_status          : invoice.sale.payment_status || '',
                  p_promotion_name          : invoice.sale.promotion_name || '',
                  p_service_charge          : invoice.sale.service_charge || '',
                  p_store_latitude          : invoice.sale.store_latitude || '',
                  p_tran_date_orig          : invoice.sale.tran_date_orig || '',
                  p_dinner_table_id         : invoice.sale.dinner_table_id || '',
                  p_pr_key_bookings         : invoice.sale.pr_key_bookings || '',
                  p_store_longitude         : invoice.sale.store_longitude || '',
                  p_address_delivery        : invoice.sale.address_delivery || '',
                  p_currency_type_id        : invoice.sale.currency_type_id || '',
                  p_vat_bank_account        : invoice.sale.vat_bank_account || '',
                  p_vat_company_name        : invoice.sale.vat_company_name || '',
                  p_commission_amount       : invoice.sale.commission_amount || '',
                  p_foodbook_order_id       : invoice.sale.foodbook_order_id || '',
                  p_membership_id_new       : invoice.sale.membership_id_new || '',
                  p_source_voucher_id       : invoice.sale.source_voucher_id || '',
                  p_vat_customer_name       : invoice.sale.vat_customer_name || '',
                  p_vat_identity_card       : invoice.sale.vat_identity_card || '',
                  p_membership_type_id      : invoice.sale.membership_type_id || '',
                  p_membership_voucher      : invoice.sale.membership_voucher || '',
                  p_vat_amount_reverse      : invoice.sale.vat_amount_reverse || '',
                  p_vat_customer_email      : invoice.sale.vat_customer_email || '',
                  p_vat_customer_phone      : invoice.sale.vat_customer_phone || '',
                  p_vat_payment_method      : invoice.sale.vat_payment_method || '',
                  p_membership_birthday     : invoice.sale.membership_birthday || '',
                  p_vat_customer_address    : invoice.sale.vat_customer_address || '',
                  p_amount_discount_extra2  : invoice.sale.amount_discount_extra2 || '',
                  p_partner_marketing_amount: invoice.sale.partner_marketing_amount || '',
                };
        
                const rtnValueSale = await DBService.ExecuteSQLBlob(
                    `BEGIN EI_UPD_IPOS_SALE    (  :p_ipos_data_pk,
                                                  :p_vat						,	
                                                  :p_note                      ,
                                                  :p_pos_id                    ,
                                                  :p_status                    ,
                                                  :p_area_id                   ,
                                                  :p_is_temp                   ,
                                                  :p_room_id                   ,
                                                  :p_sale_id                   ,
                                                  :p_tran_id                   ,
                                                  :p_tran_no                   ,
                                                  :p_user_id                   ,
                                                  :p_shift_id                  ,
                                                  :p_store_id                  ,
                                                  :p_vat_sign                  ,
                                                  :p_date_last                 ,
                                                  :p_hour_last                 ,
                                                  :p_sale_sign                 ,
                                                  :p_source_id                 ,
                                                  :p_tran_date                 ,
                                                  :p_user_name                 ,
                                                  :p_get_amount                ,
                                                  :p_session_id                ,
                                                  :p_store_name                ,
                                                  :p_vat_amount                ,
                                                  :p_customer_id               ,
                                                  :p_device_code               ,
                                                  :p_minute_last               ,
                                                  :p_number_male               ,
                                                  :p_print_count               ,
                                                  :p_vat_content               ,
                                                  :p_vat_tran_no               ,
                                                  :p_amount_point              ,
                                                  :p_coupon_count              ,
                                                  :p_last_version              ,
                                                  :p_promotion_id              ,
                                                  :p_shift_charge              ,
                                                  :p_source_fb_id              ,
                                                  :p_station_code              ,
                                                  :p_tran_no_temp              ,
                                                  :p_vat_tax_code              ,
                                                  :p_coupon_amount             ,
                                                  :p_exchange_rate             ,
                                                  :p_membership_id             ,
                                                  :p_number_female             ,
                                                  :p_number_people             ,
                                                  :p_return_amount             ,
                                                  :p_store_address             ,
                                                  :p_vat_bank_name             ,
                                                  :p_vat_tran_date             ,
                                                  :p_card_info_code            ,
                                                  :p_deposit_amount            ,
                                                  :p_discount_extra            ,
                                                  :p_origin_sale_id            ,
                                                  :p_payment_status            ,
                                                  :p_promotion_name            ,
                                                  :p_service_charge            ,
                                                  :p_store_latitude            ,
                                                  :p_tran_date_orig            ,
                                                  :p_dinner_table_id           ,
                                                  :p_pr_key_bookings           ,
                                                  :p_store_longitude           ,
                                                  :p_address_delivery          ,
                                                  :p_currency_type_id          ,
                                                  :p_vat_bank_account          ,
                                                  :p_vat_company_name          ,
                                                  :p_commission_amount         ,
                                                  :p_foodbook_order_id         ,
                                                  :p_membership_id_new         ,
                                                  :p_source_voucher_id         ,
                                                  :p_vat_customer_name         ,
                                                  :p_vat_identity_card         ,
                                                  :p_membership_type_id        ,
                                                  :p_membership_voucher        ,
                                                  :p_vat_amount_reverse        ,
                                                  :p_vat_customer_email        ,
                                                  :p_vat_customer_phone        ,
                                                  :p_vat_payment_method        ,
                                                  :p_membership_birthday       ,
                                                  :p_vat_customer_address      ,
                                                  :p_amount_discount_extra2    ,
                                                  :p_partner_marketing_amount  ,
                                                  :p_language,
                                                  :p_crt_by,
                                                  :p_rtn_cur);END;`,
                                                  para_sale,
                  p_language,
                  p_crt_by
                );
                
                console.log("rtnValueSale  ", rtnValueSale);
                
                for(const invoice_d of invoice.sale_detail)
                {
                  const para_d = {
                    p_ipos_data_pk: rtnValueMaster.p_rtn_cur[0].PK,
                    p_fix: invoice_d.fix || '',
                    p_tax: invoice_d.tax || '',
                    p_note: invoice_d.note || '',
                    p_is_fc: invoice_d.is_fc || '',
                    p_amount: invoice_d.amount || '',
                    p_is_kit: invoice_d.is_kit || '',
                    p_is_set: invoice_d.is_set || '',
                    p_number: invoice_d.number || '',
                    p_ots_ta: invoice_d.ots_ta || '',
                    p_is_gift: invoice_d.is_gift || '',
                    p_item_id: invoice_d.item_id || '',
                    p_payment: invoice_d.payment || '',
                    p_printed: invoice_d.printed || '',
                    p_sale_id: invoice_d.sale_id || '',
                    p_tran_id: invoice_d.tran_id || '',
                    p_unit_id: invoice_d.unit_id || '',
                    p_user_id: invoice_d.user_id || '',
                    p_discount: invoice_d.discount || '',
                    p_end_date: invoice_d.end_date || '',
                    p_hour_end: invoice_d.hour_end || '',
                    p_quantity: invoice_d.quantity || '',
                    p_shift_id: invoice_d.shift_id || '',
                    p_price_org: invoice_d.price_org || '',
                    p_sale_date: invoice_d.sale_date || '',
                    p_unit_name: invoice_d.unit_name || '',
                    p_cost_price: invoice_d.cost_price || '',
                    p_hour_start: invoice_d.hour_start || '',
                    p_is_invoice: invoice_d.is_invoice || '',
                    p_is_service: invoice_d.is_service || '',
                    p_list_order: invoice_d.list_order || '',
                    p_minute_end: invoice_d.minute_end || '',
                    p_package_id: invoice_d.package_id || '',
                    p_price_sale: invoice_d.price_sale || '',
                    p_tax_amount: invoice_d.tax_amount || '',
                    p_description: invoice_d.description || '',
                    p_is_eat_with: invoice_d.is_eat_with || '',
                    p_ship_charge: invoice_d.ship_charge || '',
                    p_amount_point: invoice_d.amount_point || '',
                    p_minute_start: invoice_d.minute_start || '',
                    p_payment_type: invoice_d.payment_type || '',
                    p_pr_key_order: invoice_d.pr_key_order || '',
                    p_promotion_id: invoice_d.promotion_id || '',
                    p_source_fb_id: invoice_d.source_fb_id || '',
                    p_stop_service: invoice_d.stop_service || '',
                    p_coupon_amount: invoice_d.coupon_amount || '',
                    p_printed_label: invoice_d.printed_label || '',
                    p_is_print_label: invoice_d.is_print_label || '',
                    p_parent_item_id: invoice_d.parent_item_id || '',
                    p_promotion_name: invoice_d.promotion_name || '',
                    p_sale_detail_id: invoice_d.sale_detail_id || '',
                    p_temp_calculate: invoice_d.temp_calculate || '',
                    p_discount_amount: invoice_d.discount_amount || '',
                    p_item_id_mapping: invoice_d.item_id_mapping || '',
                    p_quantity_at_temp: invoice_d.quantity_at_temp || '',
                    p_commission_amount: invoice_d.commission_amount || '',
                    p_parent_item_index: invoice_d.parent_item_index || '',
                    p_parent_item_price: invoice_d.parent_item_price || '',
                    p_unit_id_secondary: invoice_d.unit_id_secondary || '',
                    p_quantity_secondary: invoice_d.quantity_secondary || '',
                    p_tax_amount_reverse: invoice_d.tax_amount_reverse || '',
                    p_parent_item_quantity: invoice_d.parent_item_quantity || '',
                    p_amount_discount_extra: invoice_d.amount_discount_extra || '',
                    p_amount_service_charge: invoice_d.amount_service_charge || '',
                    p_amount_discount_values: invoice_d.amount_discount_values || '',
                    p_amount_discount_on_price: invoice_d.amount_discount_on_price || '',
                    p_partner_marketing_amount: invoice_d.partner_marketing_amount || '',
                    p_distribute_discount_extra2: invoice_d.distribute_discount_extra2 || '',
                    p_parent_item_quantity_secondary: invoice_d.parent_item_quantity_secondary || '',
                  }
                  //console.log("para_d  ", para_d)
                  const rtnValueDetail = await DBService.ExecuteSQLBlob(
                    `BEGIN EI_UPD_IPOS_SALE_DETAIL    (  
                                                    :p_ipos_data_pk,
                                                    :p_fix,
                                                    :p_tax,
                                                    :p_note,
                                                    :p_is_fc,
                                                    :p_amount,
                                                    :p_is_kit,
                                                    :p_is_set,
                                                    :p_number,
                                                    :p_ots_ta,
                                                    :p_is_gift,
                                                    :p_item_id,
                                                    :p_payment,
                                                    :p_printed,
                                                    :p_sale_id,
                                                    :p_tran_id,
                                                    :p_unit_id,
                                                    :p_user_id,
                                                    :p_discount,
                                                    :p_end_date,
                                                    :p_hour_end,
                                                    :p_quantity,
                                                    :p_shift_id,
                                                    :p_price_org,
                                                    :p_sale_date,
                                                    :p_unit_name,
                                                    :p_cost_price,
                                                    :p_hour_start,
                                                    :p_is_invoice,
                                                    :p_is_service,
                                                    :p_list_order,
                                                    :p_minute_end,
                                                    :p_package_id,
                                                    :p_price_sale,
                                                    :p_tax_amount,
                                                    :p_description,
                                                    :p_is_eat_with,
                                                    :p_ship_charge,
                                                    :p_amount_point,
                                                    :p_minute_start,
                                                    :p_payment_type,
                                                    :p_pr_key_order,
                                                    :p_promotion_id,
                                                    :p_source_fb_id,
                                                    :p_stop_service,
                                                    :p_coupon_amount,
                                                    :p_printed_label,
                                                    :p_is_print_label,
                                                    :p_parent_item_id,
                                                    :p_promotion_name,
                                                    :p_sale_detail_id,
                                                    :p_temp_calculate,
                                                    :p_discount_amount,
                                                    :p_item_id_mapping,
                                                    :p_quantity_at_temp,
                                                    :p_commission_amount,
                                                    :p_parent_item_index,
                                                    :p_parent_item_price,
                                                    :p_unit_id_secondary,
                                                    :p_quantity_secondary,
                                                    :p_tax_amount_reverse,
                                                    :p_parent_item_quantity,
                                                    :p_amount_discount_extra,
                                                    :p_amount_service_charge,
                                                    :p_amount_discount_values,
                                                    :p_amount_discount_on_price,
                                                    :p_partner_marketing_amount,
                                                    :p_distribute_discount_extra2,
                                                    :p_parent_item_quantity_secondary,
                                                    :p_language,
                                                    :p_crt_by,
                                                    :p_rtn_cur);END;`,
                                                    para_d,
                    p_language,
                    p_crt_by
                  );

                  console.log("rtnValueDetail  ", rtnValueDetail)

                }
                
                for(const invoice_pay_d of invoice.sale_payment_method)
                {
                  const para_pay_d = {
                    p_ipos_data_pk: rtnValueMaster.p_rtn_cur[0].PK,
                    p_amount: invoice_pay_d.amount,
                    p_sale_id: invoice_pay_d.sale_id,
                    p_user_id: invoice_pay_d.user_id,
                    p_shift_id: invoice_pay_d.shift_id,
                    p_trace_no: invoice_pay_d.trace_no,
                    p_tran_date: invoice_pay_d.tran_date,
                    p_tran_hour: invoice_pay_d.tran_hour,
                    p_list_order: invoice_pay_d.list_order,
                    p_amount_orig: invoice_pay_d.amount_orig,
                    p_tran_minute: invoice_pay_d.tran_minute,
                    p_payment_type: invoice_pay_d.payment_type,
                    p_source_fb_id: invoice_pay_d.source_fb_id,
                    p_exchange_rate: invoice_pay_d.exchange_rate,
                    p_amount_orig_get: invoice_pay_d.amount_orig_get,
                    p_currency_type_id: invoice_pay_d.currency_type_id,
                    p_payment_method_id: invoice_pay_d.payment_method_id,
                    p_amount_orig_return: invoice_pay_d.amount_orig_return,
                    p_exchange_rate_return: invoice_pay_d.exchange_rate_return,
                    p_sale_payment_method_id: invoice_pay_d.sale_payment_method_id,
                    p_currency_type_id_return: invoice_pay_d.currency_type_id_return,
                  }

                  const rtnValuePayDetail = await DBService.ExecuteSQLBlob(
                    `BEGIN EI_UPD_IPOS_SALE_PAY_D    (  
                                                        :p_ipos_data_pk,
                                                        :p_amount,
                                                        :p_sale_id,
                                                        :p_user_id,
                                                        :p_shift_id,
                                                        :p_trace_no,
                                                        :p_tran_date,
                                                        :p_tran_hour,
                                                        :p_list_order,
                                                        :p_amount_orig,
                                                        :p_tran_minute,
                                                        :p_payment_type,
                                                        :p_source_fb_id,
                                                        :p_exchange_rate,
                                                        :p_amount_orig_get,
                                                        :p_currency_type_id,
                                                        :p_payment_method_id,
                                                        :p_amount_orig_return,
                                                        :p_exchange_rate_return,
                                                        :p_sale_payment_method_id,
                                                        :p_currency_type_id_return,
                                                    :p_language,
                                                    :p_crt_by,
                                                    :p_rtn_cur);END;`,
                                                    para_pay_d,
                    p_language,
                    p_crt_by
                  );

                  console.log("rtnValuePayDetail  ", rtnValuePayDetail)

                }
              }   
            }

          } else {
            return response.status(400).json(Utils.responseByRule({success : false, message : "No Data!"}));
          }

          return response.status(200).json(Utils.responseByRule({success : true, message : "Data sussces!"}));
    } catch (e) {
      Utils.Logger({
        LVL: "error",
        MODULE: "EInvoiceController",
        FUNC: "viewPDF_SaleBillWT",
        CONTENT: e.message,
      });
      console.log(e);
      return response.status(400).json(Utils.responseByRule({success : false, message : "Data faile!"}));

    }
  }

}

module.exports = IPosController;

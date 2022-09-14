<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters class="pl-2">
      <!--left panel-->
      <v-col class="px-0" v-show="showLeft" :cols="leftCols">
        <v-card class="pa-0">
          <v-container fluid class="pb-0">
            <v-row dense>
              <v-col lg="10" sm="6" cols="12" class="d-flex align-center">
                <v-select
                  dense
                  hide-details
                  outlined
                  item-value="VAL"
                  item-text="NAME"
                  :label="$t('company_name')"
                  :items="lstCompanyMaster"
                  v-model="company"
                ></v-select>
              </v-col>
              <v-col lg="2" sm="6" cols="12" class="d-flex align-center">
                <BaseButton
                  btn_type="icon"
                  icon_type="search"
                  :btn_text="$t('search')"
                  :disabled="false"
                  @onclick="onSearchMaster()"
                />
              </v-col>
            </v-row>
            <!--left table-->
            <v-row dense justify="start">
              <v-col cols="12">
                <BaseGridView
                  ref="grdLeft"
                  :header="grdLeftHeader"
                  sel_procedure="AC_SEL_6095280_DATA"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[this.company]"
                  :height="limitHeight"
                  @cellClick="cellClick"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!--right panel-->
      <v-col class="px-0" :cols="12 - leftCols">
        <v-row no-gutters>
          <v-col lg="1" cols="12" class="text-right">
            <!-- Tongle -->
            <div class="d-flex">
              <v-btn icon tile :color="currentTheme" @click="toggleLeft">
                <v-icon v-if="showLeft">mdi-skip-previous</v-icon>
                <v-icon v-if="!showLeft">mdi-skip-next</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col lg="11" cols="12" class="text-right">
            <div class="d-flex justify-end pt-2">
              <BaseButton
                btn_type="text"
                :btn_text="$t('checking_declaration')"
                @onclick="onCheckingDeclaration()"
              />
              <BaseButton
                btn_type="text"
                :btn_text="$t('general_declaration')"
                @onclick="onDeclaration()"
              />
              <!-- Add -->
              <BaseButton
                btn_type="icon"
                icon_type="add_new"
                :btn_text="$t('btn_add')"
                @onclick="addNewMaster()"
              />
              <!-- Save -->
              <BaseButton
                btn_type="icon"
                icon_type="save"
                :btn_text="$t('save')"
                @onclick="saveMaster()"
              />
              <!-- Delete -->
              <BaseButton
                btn_type="icon"
                icon_type="delete"
                :btn_text="$t('delete')"
                @onclick="deleteMaster()"
              />
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12" class="pt-3">
            <v-card
              v-scroll.self="onScroll"
              class="overflow-y-auto pa-3"
              :max-height="scroll_height"
            >
              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <!-- <v-select :disabled="true" dense hide-details outlined item-value="VAL" item-text="NAME" :label="$t('company_name')"
                  :items="lstCompanyMaster" v-model="company"></v-select> -->
                  <BaseInput
                    :disabled="true"
                    :label="$t('tax_payer_name')"
                    v-model="mstData.TAX_PAYER_NAME"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('tax_office')"
                    v-model="mstData.TAX_OFFICE_CODE"
                    :lstData="lst_Administration_Tax_Agency"
                    item-text="NAME"
                    item-value="CODE"
                  />
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('form_no')"
                    v-model="mstData.FORM_NO_CODE"
                    :lstData="list_form_no"
                    item-text="NAME"
                    item-value="CODE"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('tax_code')"
                    v-model="mstData.TAX_CODE_"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('address')"
                    v-model="mstData.ADDRESS"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <!-- ten to khai -->
                  <BaseSelect
                    :label="$t('declare')"
                    v-model="mstData.DECLARE_NM_CODE"
                    :lstData="list_declaration_name"
                    item-text="NAME"
                    item-value="CODE"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <!-- loai -->
                  <BaseSelect
                    :label="$t('categories')"
                    item-value="CODE"
                    item-text="NAME"
                    :lstData="categories"
                    v-model="mstData.CATEGORY_CODE"
                  />
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseDatePicker
                    :label="$t('register_day')"
                    default
                    v-model="mstData.REGISTER_DATE"
                  ></BaseDatePicker>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!--right table-->
        <v-row no-gutters>
          <v-col cols="12">
            <v-card>
              <v-row no-gutters>
                <v-col lg="3" cols="12" class="text-right pa-3">
                  <BaseSelect
                    :label="$t('type_insert')"
                    item-value="CODE"
                    item-text="NAME"
                    :lstData="list_type_insert"
                    v-model="type_insert"
                  />
                </v-col>
                <v-col lg="9" cols="12" class="text-right">
                  <div class="d-flex justify-end">
                    <!-- Add -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="add_new"
                      :btn_text="$t('btn_add')"
                      @onclick="onAddRight()"
                    />
                    <!-- Save -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      @onclick="onSaveRight()"
                    />
                    <!-- Delete -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      @onclick="onDeleteRight()"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <BaseGridView
                  ref="grdDetails"
                  :header="grdDetails"
                  sel_procedure="AC_SEL_6095280_DETAIL_NOCACHE"
                  upd_procedure="AC_UP_6095280_DETAIL"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[this.mstData.PK]"
                  :max_height="limitHeightGridDetails"
                  :height="limitHeightGridDetails"
                  :update_paras="[
                    'PK',
                    'TEI_EINVOICE_M_PK',
                    'MCQTCAP',
                    'KHMSHDON',
                    'KHHDON',
                    'SHDON',
                    'NGAY',
                    'LADHDDT',
                    'TCTBAO',
                    'LDO',
                    'TEI_EINVOICE_SS_M_PK',
                  ]"
                />
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dlg_View" max-width="1000">
      <v-card outlined tile v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2"
          >{{ $t("popup_get_parter") }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dlg_View = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
          <v-row>
            <v-col md="4">
              <BaseSelect
                :disabled="true"
                :label="$t('company')"
                item-value="VAL"
                item-text="NAME"
                :lstData="lstCompanyMaster"
                v-model="company"
              />
            </v-col>
            <v-col md="3">
              <BaseDatePicker
                :label="$t('form_date')"
                v-model="form_date"
                default
              />
            </v-col>
            <v-col md="3">
              <BaseDatePicker
                :label="$t('form_to')"
                v-model="form_to"
                default
              />
            </v-col>
            <v-col md="1"></v-col>
            <v-col md="1" class="d-flex justify-end">
              <BaseButton
                btn_type="icon"
                icon_type="search"
                @onclick="onClickPopup()"
              />
              <BaseButton
                btn_type="icon"
                icon_type="select"
                :btn_text="$t('select')"
                @onclick="onSelect()"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">
              <BaseSelect
                :label="$t('form_no')"
                v-model="form_no_pop"
                :lstData="list_form_no_pop"
                item-text="NAME"
                item-value="VAL"
              />
            </v-col>
            <v-col md="3">
              <BaseSelect
                :label="$t('serial_no')"
                item-value="VAL"
                item-text="NAME"
                :lstData="serial_no_list"
                v-model="selected_serial_no"
              />
            </v-col>
            <v-col md="3">
              <BaseInput :label="$t('invoice_no')" v-model="invoice_no_pop" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <BaseGridView
                ref="popupGrid"
                :autoresize="false"
                :header="headerGrid_popup"
                :setting="true"
                :multiselect="true"
                :selectionmode="'checkbox'"
                :headertype="1"
                :height="limitHeightGridDetails"
                sel_procedure="AC_SEL_6095280_DATA_POPUP"
                :filter_paras="[
                  this.company,
                  this.form_no_pop,
                  this.selected_serial_no,
                  this.invoice_no_pop,
                  this.form_date,
                  this.form_to,
                ]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
  },
  data: () => ({
    myIcon: "mdi-arrow-down-bold-box-outline",
    leftCols: 3,
    showLeft: true,
    formIsValid: undefined,
    invoice_type_list: [],
    type_invoice_list: [],
    categories: [],
    lst_Administration_Tax_Agency: [],
    list_form_no: [],
    list_declaration_name: [],
    mstData: null,
    mstPara: [],
    company: 0,
    lstCompanyMaster: [],
    dynamicHeader: [],
    list_type_insert: [],
    type_insert: "",
    rtn_value_list: [],
    dlg_View: false,
    serial_no_list: [],
    selected_serial_no: "",
    form_date: "",
    form_to: "",
    list_form_no_pop: [],
    form_no_pop: "0",
    invoice_no_pop: "",
    objInvoice_M: {},
    txtXMl_T: "",
    // txtDN_MST: "",
    selected_declare: "",
  }),

  async created() {
    this.getCompanyInfo();
    this.getCommonCode();
    this.initMasterData();
    this.initPara();
  },
  mounted() {},
  watch: {
    form_no_pop(val) {
      this.getFormNo();
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },

    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 580;
      }
      // return this._calculateHeight(this.formContainerHeight,75)
    },
    scroll_height() {
      return this.windowHeight / 2 - 60;
    },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 410;
      }
    },
    grdDetails() {
      const self = this;
      return [
        {
          field: "NO",
          title: this.$t("no"),
          width: 50,
          alignment: "center",
          type: "text",
          editable: true,
        },
        {
          field: "MCQTCAP",
          title: this.$t("ma_cqt_cap"),
          width: 200,
          alignment: "left",
          type: "text",
          editable: true,
        },
        {
          field: "KHMSHDON",
          title: this.$t("form_no"),
          width: 100,
          alignment: "left",
          type: "text",
          editable: true,
        },
        {
          field: "KHHDON",
          title: this.$t("serial_no"),
          width: 100,
          alignment: "left",
          type: "text",
          editable: true,
        },
        {
          field: "SHDON",
          title: this.$t("invoice_no"),
          width: 100,
          alignment: "left",
          type: "text",
          editable: true,
        },
        {
          field: "NGAY",
          title: this.$t("date"),
          width: 100,
          alignment: "left",
          type: "date",
          editable: true,
        },
        {
          field: "LADHDDT",
          title: this.$t("type_einvoice"),
          width: 200,
          alignment: "left",
          type: "list",
          editable: true,
          datasource: {
            KEY: "CODE",
            VALUE: "NAME",
            data: this.type_invoice_list,
          },
        },
        {
          field: "TCTBAO",
          title: this.$t("einvoice_type"),
          width: 100,
          alignment: "left",
          type: "list",
          editable: true,
          datasource: {
            KEY: "CODE",
            VALUE: "NAME",
            data: this.invoice_type_list,
          },
        },
        {
          field: "LDO",
          title: this.$t("cancel_reason"),
          width: 300,
          alignment: "left",
          type: "text",
          height: "auto",
          editable: true,
        },
      ];
    },
    grdLeftHeader() {
      const self = this;
      return [
        {
          field: "NO",
          title: this.$t("no"),
          width: 50,
          alignment: "center",
          type: "text",
        },
        {
          field: "DECLARE_NM",
          title: this.$t("declare_nm"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 100,
          alignment: "left",
          type: "number",
        },
        {
          field: "STATUS",
          title: this.$t("status"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "TRADE_CODE",
          title: this.$t("trade_code"),
          width: 100,
          alignment: "left",
          type: "text",
        },
      ];
    },
    headerGrid_popup() {
      const self = this;
      return [
        {
          field: "PK",
          title: this.$t("v"),
          width: 50,
          alignment: "center",
          type: "text",
        },
        {
          field: "CQT_MCCQT_ID",
          title: this.$t("cqt_code"),
          width: 250,
          alignment: "left",
          type: "text",
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "NGAY",
          title: this.$t("date"),
          width: 100,
          alignment: "left",
          type: "date",
        },
        {
          field: "LADHDDT",
          title: this.$t("type_invoice"),
          width: 100,
          alignment: "left",
          type: "text",
        },
        {
          field: "LADHDDT_NM",
          title: this.$t("type_invoice_name"),
          width: 200,
          alignment: "left",
          type: "text",
        },
        {
          field: "TCTBAO",
          title: this.$t("invoice_type"),
          width: 300,
          alignment: "left",
          type: "text",
        },
        {
          field: "TCTBAO_NM",
          title: this.$t("invoice_type_name"),
          width: 300,
          alignment: "left",
          type: "text",
        },
        {
          field: "CANCEL_REASON",
          title: this.$t("cancel_reason"),
          width: 300,
          alignment: "left",
          type: "text",
        },
      ];
    },
  },

  methods: {
    handleValidateXML(temptHDon) {
      // if (!temptHDon.HDon.MCQTCap) {
      //   this.showNotification("danger", this.$t('Can_not_be_empty_mcqt_cap'), "");
      //   return false;
      // }
      if (!temptHDon.HDon.KHMSHDon) {
        this.showNotification(
          "danger",
          this.$t("Can_not_be_empty_khmsh_don"),
          ""
        );
        return false;
      }
      if (!temptHDon.HDon.KHHDon) {
        this.showNotification(
          "danger",
          this.$t("Can_not_be_empty_khh_don"),
          ""
        );
        return false;
      }
      if (!temptHDon.HDon.SHDon) {
        this.showNotification("danger", this.$t("Can_not_be_empty_sh_don"), "");
        return false;
      }
      if (!temptHDon.HDon.Ngay) {
        this.showNotification("danger", this.$t("Can_not_be_empty_ngay"), "");
        return false;
      }
      if (!temptHDon.HDon.LADHDDT) {
        this.showNotification(
          "danger",
          this.$t("Can_not_be_empty_type_invoice"),
          ""
        );
        return false;
      }
      // if (temptHDon.HDon.TCTBao != null) {
      //   this.showNotification("danger", this.$t('Can_not_be_empty_invoice_type'), "");
      //   return false;
      // }
      if (!temptHDon.HDon.LDo) {
        this.showNotification("danger", this.$t("Can_not_be_empty_ldo"), "");
        return false;
      }
      return true;
    },

    onGeneralXML() {
      if (!this.checkData() || !this.mstData.PK) {
        return false;
      }
      let xmlStr = "";
      this.contructerOBJ();
      this.objInvoice_M.TBao.DLTBao.PBan = "v2.0.0";
      this.objInvoice_M.TBao.DLTBao.MSo = this.mstData.FORM_NO_NAME;
      this.objInvoice_M.TBao.DLTBao.Ten = this.mstData.DECLARE_NM_NAME;
      this.objInvoice_M.TBao.DLTBao.Loai = this.mstData.CATEGORY_CODE;
      // this.objInvoice_M.TBao.DLTBao.So = this.mstData.;
      // this.objInvoice_M.TBao.DLTBao.NTBCCQT = this.mstData.;
      this.objInvoice_M.TBao.DLTBao.TCQT = this.mstData.TAX_OFFICE_NAME;
      this.objInvoice_M.TBao.DLTBao.MCQT = this.mstData.TAX_OFFICE_CODE;
      this.objInvoice_M.TBao.DLTBao.MST = this.mstData.TAX_CODE_;
      this.objInvoice_M.TBao.DLTBao.TNNT = this.mstData.TAX_PAYER_NAME;
      this.objInvoice_M.TBao.DLTBao.DDanh = this.mstData.ADDRESS;
      this.objInvoice_M.TBao.DLTBao.NTBao = this.mstData.REGISTER_DATE;

      this.objInvoice_M.TBao.DLTBao.DSHDon = {};
      this.objInvoice_M.TBao.DLTBao.DSHDon.HDon = [];

      for (let j = 0; j < this.$refs.grdDetails.getDataSource().length; j++) {
        if (this.$refs.grdDetails.getDataSource()[j]._rowstatus != "") {
          this.showNotification(
            "danger",
            this.$t("please_save_grd_details"),
            ""
          );
          this.objInvoice_M = {};
          return false;
        }

        this.objInvoice_M.TBao.DLTBao.DSHDon.HDon.push({
          MCQTCap: this.$refs.grdDetails.getDataSource()[j].MCQTCAP,
          KHMSHDon: this.$refs.grdDetails.getDataSource()[j].KHMSHDON,
          KHHDon: this.$refs.grdDetails.getDataSource()[j].KHHDON,
          SHDon: this.$refs.grdDetails.getDataSource()[j].SHDON,
          Ngay: this.$refs.grdDetails.getDataSource()[j].NGAY,
          LADHDDT: this.$refs.grdDetails.getDataSource()[j].LADHDDT,
          TCTBao: this.$refs.grdDetails.getDataSource()[j].TCTBAO,
          LDo: this.$refs.grdDetails.getDataSource()[j].LDO,
        });
      }
      // this.objInvoice_M.DSCKS.NNT.Signature = ""
      var convert = require("xml-js");
      var options = { compact: true, ignoreComment: true, spaces: 4 };
      var result = convert.json2xml(this.objInvoice_M, options);
      xmlStr =
        result.toString().replace("<DLTBao>", "<DLTBao Id='ID1'>") +
        "|" +
        xmlStr; //<DLTKhai Id='ID1'>
      this.txtXMl_T = xmlStr;
      return true;
    },

    async onCheckingDeclaration() {
      // let grdSelectedRow = this.$refs.grdDetails.getDataSource();
      // let arrTradecode = []
      // for (var i = 0; i < grdSelectedRow.length; i++) {
      //   if (!grdSelectedRow[i].TRADE_CODE) {
      //     alert(
      //       "Mã giao dịch không đúng. Vui lòng thử lại sau !"
      //     );
      //     return;
      //   }
      //   arrTradecode = [...arrTradecode, grdSelectedRow[i].TRADE_CODE ]
      // }

      var tempTradeCode = this.$refs.grdLeft
        .getDataSource()
        .find((item) => item.PK == this.mstData.PK);

      if (!tempTradeCode?.TRADE_CODE) {
        this.showNotification("danger", this.$t("tradecode_null"), "");
        return;
      }

      if (this.mstData.PK) {
        let res = await this.$axios.$post("/einvoice/checkinformadjustinvoice", {
          responseType: "json",
          para: {
            p_tei_einvoice_issuse_cqt_pk: this.mstData.PK,
            trade_code: [tempTradeCode.TRADE_CODE],
          },
        });
        console.log("checkinformadjustinvoice " + JSON.stringify(res));
        if (res.success) {
          this.$refs.grdLeft.loadData();
          this.showNotification("success", this.$t(res.message), "");
        } else {
          this.showNotification("danger", this.$t(res.message), "");
        }
      }
    },

    async onDeclaration() {

      if(!this.$refs.grdDetails.getDataSource().length){
        this.showNotification("danger", this.$t("no_data"), "");
        return;
      }
      if(this.mstData.TRADE_CODE){
          this.showNotification("danger", this.$t("trade_code_already_exist"), "");
        return;
      }

      if (this.mstData.PK != "" && this.onGeneralXML()) {
        jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/issueXmlList",
          dataType: "text",
          method: "POST",
          data: {
            tei_invoice_m_pk: this.mstData.PK,
            xml: this.txtXMl_T,
          },
          error: this.onErrorissueXmlList,
          success: this.onSuccessissueXmlList,
        });
      }
    },

    async onErrorissueXmlList(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },
    async onSuccessissueXmlList(data) {
      let obj_token = $.parseJSON(data);

      this.txtXMl_T = obj_token.result.replace("|", "");
      // this.txtDN_MST = obj_token.DN_MST;

      this.SerialNoCheck(
        obj_token.SerialNumber,
        obj_token.NotBefore,
        obj_token.NotAfter
      );
    },

    async SerialNoCheck(serialNumber, notBefore, notAfter) {
      const dso_process_check_serialno = {
        type: "list",
        selpro: "EI_SEL_6095090_SERIAL_CHECK",
        para: [this.company, serialNumber, notBefore, notAfter],
      };

      const check_serial_no_result = await this._dsoCall(
        dso_process_check_serialno,
        "select",
        false
      );

      // if (check_serial_no_result[0]?.STATUS == "1") {
      let res = await this.$axios.$post("/einvoice/sendinformadjustinvoice", {
        responseType: "json",
        para: {
          xml_signed: this.txtXMl_T,
          tei_einvoice_ss_m_pk: this.mstData.PK,
        },
      });

      if (res.success) {
      //    setTimeout(() => {
      //   this.$refs.grdDetails.loadData();
      // }, 200);
         this.$refs.grdLeft.loadData();
        this.showNotification("success", this.$t(res.message), "");
      } else {
        this.showNotification("danger", this.$t(res.message), "");
      }
      // } else {
      //   alert("Token not suitable !!!");
      // }
    },

    contructerOBJ() {
      this.objInvoice_M = {
        TBao: {
          DLTBao: {
            PBan: "",
            MSo: "",
            Ten: "",
            Loai: "",
            So: "",
            NTBCCQT: "",
            TCQT: "",
            MCQT: "",
            MST: "",
            TNNT: "",
            DDanh: "",
            NTBao: "",
            DSHDon: {
              HDon: [
                {
                  MCQTCap: "",
                  KHMSHDon: "",
                  KHHDon: "",
                  SHDon: "",
                  Ngay: "",
                  LADHDDT: "",
                  TCTBao: "",
                  LDo: "",
                },
              ],
            },
          },
          DSCKS: {
            NNT: {},
          },
        },
      };
    },

    onScroll() {
      this.scrollInvoked++;
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "TEI_COMPANY_PK",
        "TAX_PAYER_NAME",
        "TAX_OFFICE_CODE",
        "TAX_OFFICE_NAME",
        "FORM_NO_NAME",
        "TAX_CODE_",
        "ADDRESS",
        "DECLARE_NM_CODE",
        "DECLARE_NM_NAME",
        "REGISTER_DATE",
        "TAX_MESS",
        "CATEGORY_CODE",
      ];
    },

    initMasterData() {
      this.mstData = {
        _rowstatus: "i",
        PK: "",
        TEI_COMPANY_PK: "",
        TAX_PAYER_NAME: "",
        TAX_OFFICE_CODE: this.lst_Administration_Tax_Agency.CODE,
        TAX_OFFICE_NAME: this.lst_Administration_Tax_Agency.NAME,
        FORM_NO_CODE: this.list_form_no.CODE,
        FORM_NO_NAME: this.list_form_no.NAME,
        TAX_CODE_: "",
        ADDRESS: "",
        DECLARE_NM_CODE: this.list_declaration_name.CODE,
        DECLARE_NM_NAME: this.list_declaration_name.NAME,
        REGISTER_DATE: "",
        TAX_MESS: "",
        CATEGORY_CODE: this.categories.CODE,
        INVOICE_NO: "",
        FORM_NO_POP: "",
        TRADE_CODE: "",
      };
    },
    onClickPopup() {
      this.$refs.popupGrid.loadData();
    },
    onSelect() {
      let selectedData = this.$refs.popupGrid.getSelectedRows();
      for (let i = 0; i < selectedData.length; i++) {
        this.$refs.grdDetails.addRowStruct({
          _rowstatus: "i",
          NO: selectedData[i].NO,
          PK: selectedData[i].PK,
          TEI_EINVOICE_M_PK: selectedData[i].TEI_EINVOICE_M_PK,
          MCQTCAP: selectedData[i].CQT_MCCQT_ID,
          KHMSHDON: selectedData[i].FORM_NO,
          KHHDON: selectedData[i].SERIAL_NO,
          SHDON: selectedData[i].INVOICE_NO,
          NGAY: selectedData[i].NGAY,
          LADHDDT: selectedData[i].LADHDDT,
          TCTBAO: selectedData[i].TCTBAO,
          LDO: selectedData[i].CANCEL_REASON,
          TEI_EINVOICE_SS_M_PK: this.mstData.PK,
        });
      }
      this.dlg_View = false;
    },
    async cellClick(data) {
      let selectedData = data.data;
      this.mstData.PK = selectedData.PK;
      this.mstData.TEI_COMPANY_PK = selectedData.TEI_COMPANY_PK;
      this.mstData.CATEGORY_CODE = selectedData.LOAI + "";
      this.mstData.FORM_NO_NAME = selectedData.FORM_NO;
      this.mstData.ADDRESS = selectedData.DDANH;
      this.mstData.TAX_CODE_ = selectedData.MST;
      this.mstData.DECLARE_NM_NAME = selectedData.DECLARE_NM;
      this.mstData.TAX_OFFICE_CODE = selectedData.MCQT;
      this.mstData.TRADE_CODE = selectedData.TRADE_CODE;

      var tam = this.list_form_no.find(
        (item) => item.NAME == selectedData.FORM_NO
      );
      this.mstData.FORM_NO_CODE = tam?.CODE || "00";
      var tamDeclare = this.list_declaration_name.find(
        (item) => item.NAME == selectedData.DECLARE_NM
      );
      this.mstData.DECLARE_NM_CODE = tamDeclare?.CODE + "" || "00";

      this.$refs.grdDetails.loadData();
    },
    async onSearchMaster() {
      this.$refs.grdLeft.loadData();
    },

    async getCompanyInfo() {
      const dso_company_list = {
        type: "list",
        selpro: "AC_SEL_6095280_COMPANY",
        para: [this.user.PK],
      };
      const companyInfo = await this._dsoCall(
        dso_company_list,
        "select",
        false
      );
      if (companyInfo.length > 0) {
        this.lstCompanyMaster = companyInfo;
        this.company = companyInfo[0].VAL;
        this.mstData.TAX_PAYER_NAME = companyInfo[0].NAME;
        this.mstData.TEI_COMPANY_PK = companyInfo[0].VAL;
      }
    },

    // lay thong tin master
    async getCommonCode() {
      const commoncode = await this._getCommonCode2(
        [
          "ACEI0170",
          "ACEI0180",
          "ACEI0120",
          "ACEI0190",
          "ACEI0200",
          "ACEI0210",
          "ACEI0020",
        ],
        this.company
      );
      this.categories = commoncode[0];
      this.list_declaration_name = commoncode[1];
      this.lst_Administration_Tax_Agency = commoncode[2];
      this.list_form_no = commoncode[3];
      this.list_type_insert = commoncode[4];
      this.type_invoice_list = commoncode[5];
      this.invoice_type_list = commoncode[6];
      const dso_rtn_value_list = {
        type: "list",
        selpro: "AC_SEL_6095280_RTN_VALUE",
        para: [this.company],
      };
      this.rtn_value_list = await this._dsoCall(
        dso_rtn_value_list,
        "select",
        false
      );
      if (this.rtn_value_list != null) {
        this.mstData.TEI_COMPANY_PK = this.rtn_value_list[0].LSTCOMPANY;
        this.mstData.TAX_PAYER_NAME =
          this.rtn_value_list[0].TXT_TEN_NGUOI_NOP_THUE;
        this.mstData.ADDRESS = this.rtn_value_list[0].TXT_DIA_DANH;
        this.mstData.TAX_CODE_ = this.rtn_value_list[0].TXT_MA_SO_THUE;
        this.mstData.TAX_OFFICE_CODE =
          this.rtn_value_list[0].LST_CO_QUAN_THUE_QUAN_LY;
        this.mstData.TAX_OFFICE_NAME =
          this.rtn_value_list[0].TXT_CO_QUAN_THUE_QUAN_LY;
        this.mstData.FORM_NO_NAME = this.rtn_value_list[0].LST_MAU_SO;
        this.mstData.CATEGORY_CODE = this.rtn_value_list[0].LST_LOAI;
        this.mstData.DECLARE_NM_CODE = this.rtn_value_list[0].LST_TEN_TO_KHAI;
        this.mstData.DECLARE_NM_NAME = this.rtn_value_list[0].TXT_DECLACTION_NM;
        this.mstData.TAX_MESS = "khong co thong bao";
        this.mstData._rowstatus = "i";

        var tam = this.list_form_no.find(
          (item) => item.NAME == this.rtn_value_list[0].LST_MAU_SO
        );
        this.mstData.FORM_NO_CODE = tam.CODE;
      }
    },

    async getSerial() {
      const dso_serial_no_list = {
        type: "list",
        selpro: "AC_SEL_6095280_SERIAL_NO",
        para: [this.company, this.form_no_pop],
      };
      this.serial_no_list = await this._dsoCall(
        dso_serial_no_list,
        "select",
        false
      );
      if (this.serial_no_list != null) {
        this.selected_serial_no = this.serial_no_list[0].VAL;
      }
    },

    async getFormNo() {
      const dso_form_list = {
        type: "list",
        selpro: "AC_SEL_6095280_FORM_NO",
        para: [this.company],
      };
      this.list_form_no_pop = await this._dsoCall(
        dso_form_list,
        "select",
        false
      );
      if (this.list_form_no_pop != null && this.form_no_pop == "0") {
        this.form_no_pop = this.list_form_no_pop[0].VAL;
      }
      this.getSerial();
    },

    async saveMaster() {
      let validate = this.checkData();
      if (validate) {
        if (
          this.mstData._rowstatus !== "i" &&
          this.mstData._rowstatus !== "d"
        ) {
          this.mstData._rowstatus = "u";
        }
        const dso = {
          type: "control",
          selpro: "AC_SEL_6095280_DATA",
          updpro: "AC_UP_6095280_DATA",
          para: [this.mstData.PK],
          elname: this.mstPara,
          data: this.mstData,
        };

        let row = await this._dsoCall(dso, "update", true);
        this.onSearchMaster();
      }
    },

    addNewMaster() {
      ///hàm này phải clean hết các biến + set sattus về "i"
      // if (this.mstData._rowstatus == "i") {
      //   alert("now you can register new");
      // } else {
      this.clearInput();
      alert("now you can register new");
      // }
    },

    clearInput() {
      // const time = new Date();
      // this.mstData.REGISTER_DATE = moment(String(time)).format("YYYYMMDD");

      this.mstData._rowstatus = "i";
      this.mstData.PK = "";
      this.mstData.TAX_CODE_ = "";
      this.mstData.ADDRESS = "";
      this.mstData.TAX_OFFICE_CODE = "00";
      this.mstData.FORM_NO_CODE = "00";
      this.mstData.CATEGORY_CODE = "00";
      this.mstData.DECLARE_NM_CODE = "00";
    },
    checkData() {
      if (this.mstData.TAX_OFFICE_CODE == "00") {
        alert("Vui lòng nhập Cơ Quan Thuế.");
        return false;
      }
      if (this.mstData.FORM_NO_CODE == "00") {
        alert("Vui lòng nhập Mẫu số.");
        return false;
      }
      if (this.mstData.TAX_CODE_ == "") {
        alert("Vui lòng nhập Mã số thuế.");
        return false;
      }
      if (this.mstData.ADDRESS == "") {
        alert("Vui lòng nhập Địa danh.");
        return false;
      }
      if (this.mstData.DECLARE_NM_CODE == "00") {
        alert("Vui lòng nhập Tên tờ khai.");
        return false;
      }
      return true;
    },

    toggleLeft() {
      this.showLeft = this.showLeft ? false : true;
      this.leftCols = !this.showLeft ? 0 : 3;
      this.btnIconType = !this.showLeft ? "skip_next" : "skip_prev";
    },

    onAddRight() {
      if (this.type_insert == "IE") {
        this.$refs.grdDetails.addRowStruct({
          PK: "",
          TEI_EINVOICE_M_PK: "",
          MCQTCAP: "",
          KHMSHDON: "",
          KHHDON: "",
          SHDON: "",
          NGAY: "",
          LADHDDT: "",
          TCTBAO: "",
          LDO: "",
          TEI_EINVOICE_SS_M_PK: this.mstData.PK,
        });
      } else {
        this.getFormNo();
        this.dlg_View = true;
      }
    },
    onSaveRight() {
      this.$refs.grdDetails.saveData();
      setTimeout(() => {
        this.$refs.grdDetails.loadData();
      }, 200);
    },
    onDeleteRight() {
      this.$refs.grdDetails.deleteRows();
    },
  },
};
</script>
<style>
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 10px;
}

.v-select__selections {
  min-height: 10px;
}

#my-list {
  max-height: 720px;
  overflow-y: scroll;
}
</style>
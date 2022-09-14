<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row class="pl-2">
      <!--left panel-->
      <v-col class="px-0" :cols="6">
        <v-card class="pa-0">
          <v-container fluid class="pb-0">
            <v-row dense>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseDatePicker
                  outlined
                  :label="$t('date_from')"
                  start
                  v-model="transDateFrom"
                ></BaseDatePicker>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseDatePicker
                  outlined
                  :label="$t('date_to')"
                  start
                  v-model="transDateTo"
                ></BaseDatePicker>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1">
                <v-sheet class="pa-2 d-flex align-center">
                  <v-checkbox
                    dense
                    hide-details
                    color="#000"
                    class="mt-0 pt-0"
                    true-value="Y"
                    false-value="N"
                    v-model="chkActiveS"
                  ></v-checkbox>
                </v-sheet>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="d-flex align-center">
                <BaseButton
                  btn_type="icon"
                  icon_type="search"
                  :btn_text="$t('search')"
                  :disabled="false"
                  @onclick="onSearchMaster()"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('bill_nos')"
                  v-model="txtBillNoS"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('store')"
                  v-model="lstStoreS"
                  :lstData="lstStoreSMaster"
                  item-text="CODE_NM"
                  item-value="CODE"
                />
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="1" sm="6" cols="12" class="d-flex align-center">
              </v-col>
            </v-row>

            <!--left table-->
            <v-row dense justify="start">
              <v-col cols="12">
                <BaseGridView
                  ref="grdLeft"
                  :header="grdLeftHeader"
                  sel_procedure="SYS_SEL_SYSE018_GetGridData"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[
                    this.lstStoreS,
                    this.transDateFrom,
                    this.transDateTo,
                    this.user.USER_ID,
                    this.chkActiveS,
                    this.txtBillNoS,
                  ]"
                  :height="limitHeight"
                  @cellClick="cellClick"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!--right panel-->
      <v-col class="px-0" :cols="6">
        <v-card class="pa-0">
          <v-container fluid class="pb-0">
            <v-row>
              <v-col lg="11" cols="12" class="text-right">
                <div class="d-flex justify-end">
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
                </div>
              </v-col>
            </v-row>
            <!--row 1-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('company_nm')"
                  v-model="mstData.COMPANY_NM"
                  mandatory
                >
                </BaseInput>
              </v-col>

              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('company_id')"
                  v-model="lstCompany"
                  :lstData="lstCompanyMaster"
                  item-text="NAME"
                  item-value="VAL"
                />
              </v-col>
            </v-row>
            <!--row 2-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('shop_name')"
                  v-model="mstData.SHOP_NAME"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('store_code')"
                  v-model="lstStore"
                  :lstData="lstStoreMaster"
                  item-text="CODE_NM"
                  item-value="CODE"
                />
              </v-col>
            </v-row>

            <!--row 3-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('pos_no')"
                  v-model="mstData.POS_NO"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <v-sheet class="pa-2 d-flex align-center">
                  <v-checkbox
                    dense
                    hide-details
                    color="#000"
                    class="mt-0 pt-0"
                    true-value="Y"
                    false-value="N"
                    v-model="mstData.USER_YN"
                  ></v-checkbox>
                  <span class="">{{ $t("active") }}</span>
                </v-sheet>
              </v-col>
            </v-row>

            <!--row 4-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('cus_id')"
                  v-model="mstData.CUS_ID"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 5-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('tax_code')"
                  v-model="mstData.TAX_CODE"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 6-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('cus_nm')"
                  v-model="mstData.CUS_NM"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 7-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput :label="$t('addr')" v-model="mstData.ADDR" mandatory>
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 8-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('email')"
                  v-model="mstData.EMAIL"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 9-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('bill_no')"
                  v-model="mstData.BILL_NO"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('payment_meth')"
                  v-model="lstPayment"
                  :lstData="lstPaymentMaster"
                  item-text="CODE_NM"
                  item-value="CODE"
                />
              </v-col>
            </v-row>
            <!--row 10-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseDatePicker
                  outlined
                  :label="$t('date_sale')"
                  start
                  v-model="mstData.SALE_DATE"
                ></BaseDatePicker>
              </v-col>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('total_amt')"
                  v-model="mstData.TOTAL_AMT"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 11-->
            <v-row>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <v-sheet class="pa-2 d-flex align-center">
                  <v-checkbox
                    dense
                    hide-details
                    color="#000"
                    class="mt-0 pt-0"
                    true-value="Y"
                    false-value="N"
                    v-model="mstData.COMBINE_YN"
                  ></v-checkbox>
                  <span class="">{{ $t("Combine") }}</span>
                </v-sheet>
              </v-col>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('bill_attach')"
                  v-model="mstData.BILL_ATTACH"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  layout: "default",
  middleware: "user",

  components: {},
  data: () => ({
    lstCompany: 0,
    lstCompanyMaster: [],

    lstStore: 0,
    lstStoreMaster: [],

    lstStoreS: null,
    lstStoreSMaster: [],

    lstPayment: "01",
    lstPaymentMaster: [],

    txtCustomerId: "",
    txtCustomerName: "",

    mstData: null,
    mstPara: [],

    transDateFrom: "",
    transDateTo: "",
    chkActiveS: "Y",
    txtBillNoS: "",
  }),

  async created() {
    this.initMasterData();
    this.initPara();
    this.getCompanyInfo();
  },
  mounted() {},
  watch: {
    lstCompany: function () {
      this.mstData.TEI_COMPANY_PK = this.lstCompany;
    },
    lstStore: function () {
      this.mstData.STORE_CODE = this.lstStore;
    },
    lstPayment: function () {
      this.mstData.PAYMENT_METH = this.lstPayment;
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },

    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 800;
      }
    }, // this.windowHeight },

    grdLeftHeader() {
      const self = this;
      return [
        {
          field: "ROWNUM",
          width: 40,
          title: "rownum",
          alignment: "center",
        },
        {
          field: "sale_date",
          width: 100,
          title: "sale_date",
          alignment: "center",
        },
        {
          field: "shop_name",
          width: 150,
          title: "shop_name",
          alignment: "center",
        },
        {
          field: "bill_no",
          width: 60,
          title: "bill_no",
          alignment: "center",
        },
        {
          field: "total_amt",
          width: 110,
          title: "total_amt",
          alignment: "center",
        },
        {
          field: "cus_nm",
          width: 150,
          title: "cus_nm",
          alignment: "center",
        },
        {
          field: "tax_code",
          width: 100,
          title: "tax_code",
          alignment: "center",
        },
        {
          field: "addr",
          width: 150,
          title: "addr",
          alignment: "center",
        },
        {
          field: "email",
          width: 250,
          title: "email",
          alignment: "center",
        },
      ];
    },
  },

  methods: {
    async getCompanyInfo() {
      const companyInfo = await this._callProcedure(
        "SYS_SEL_SYSE018_GetCompanyLst",
        [this.user.PK]
      );

      if (companyInfo.length > 0) {
        this.lstCompanyMaster = companyInfo;
        this.lstCompany = companyInfo[0].VAL;
        this.getStore(companyInfo[0].VAL);
        this.getStoreS(companyInfo[0].VAL);
        this.getPayment(companyInfo[0].VAL);
      }
    },

    async getStore(x) {
      const storeInfo = await this._callProcedure("SYS_SEL_SYSE018_GSL", [x]);

      if (storeInfo.length > 0) {
        // console.log(storeInfo);
        this.lstStoreMaster = storeInfo;
        this.lstStore = storeInfo[0].CODE;
      }
    },

    async getStoreS(x) {
      const storeSInfo = await this._callProcedure("SYS_SEL_SYSE018_GSSL", [x]);

      if (storeSInfo.length > 0) {
        //console.log(storeSInfo);
        this.lstStoreSMaster = storeSInfo;
        this.lstStoreS = storeSInfo[0].CODE;
      }
    },
    async getPayment(x) {
      const paymentInfo = await this._callProcedure("SYS_SEL_SYSE018_GPL", [x]);

      if (paymentInfo.length > 0) {
        //console.log(paymentInfo);
        this.lstPaymentMaster = paymentInfo;
        this.lstPayment = paymentInfo[0].CODE;
      }
    },
    async saveMaster() {
      //let validate = this.checkData();
      if (this.mstData.PK == "" && this.mstData._rowstatus != "i") {
        alert("Please select a user");
      } else {
        const dso = {
          type: "control",
          selpro: "SYS_SEL_SYSE018_RefetchData",
          updpro: "SYS_UPD_SYSE018_User_Entry",
          para: [this.mstData.PK],
          elname: this.mstPara,
          data: this.mstData,
        };
        if (
          this.mstData._rowstatus !== "i" &&
          this.mstData._rowstatus !== "d"
        ) {
          this.mstData._rowstatus = "u";
        }

        if (this.checkData()) {
          ////////////
          let row = await this._dsoCall(dso, "update", true);
          if (row) {
            this.mstData = {
              ...row,
            };
          }
          ////////////////////
        }
      }
    },

    addNewMaster() {
      ///hàm này phải clean hết các biến + set sattus về "i"
      if (this.mstData._rowstatus == "i") {
        alert("now you can register new");
      } else {
        this.clearInput();
      }
    },

    clearInput() {
      this.mstData._rowstatus = "i"; // p_action
      this.mstData.PK = ""; // p_tes_user_pk
      //  this.mstData.COMPANY_NM = "";
      this.mstData.TEI_COMPANY_PK = 0; // lstCompany,////////////
      this.mstData.TOS_CUSTOMER_PK = ""; // txtTos_Customer_Pk ,
      this.mstData.CUS_ID = ""; // txtCustomerID,
      this.mstData.CUS_NM = ""; // txtCustomerNm,
      this.mstData.TAX_CODE = ""; // txtTaxCode,
      this.mstData.ADDR = ""; // txtAddress ,
      this.mstData.EMAIL = ""; // txtEmail,
      this.mstData.SHOP_NAME = ""; // txtStoreName,
      this.mstData.STORE_CODE = "01"; // lstStore,////////////////
      this.mstData.POS_NO = ""; /// txtPosNo,
      this.mstData.BILL_NO = ""; //  txtBillNo ,
      this.mstData.SALE_DATE = ""; //  dtDateOfSale,
      this.mstData.TOTAL_AMT = ""; ///  txtTotal_Payment,
      this.mstData.PAYMENT_METH = "01"; //  lstPayment_Method,/////////////////
      // this.mstData.BILL_ATTACH = ""; // txtAttach_Bill  ,
      this.mstData.USER_YN = "Y"; //   chkActive,
      this.mstData.COMBINE_TEXT = ""; //  txtCombine,/////////////
      this.mstData.COMBINE_YN = "Y"; //  chkCombine
    },

    async cellClick(data) {
      let selectedData = data.data;
      this.mstData.PK = selectedData.PK;

      const IssueDetail = await this._callProcedure(
        "SYS_SEL_SYSE018_RefetchData",
        [this.mstData.PK]
      );

      console.log(IssueDetail);
    },
    checkData() {
      return true;
    },
    onSearchMaster() {
      this.$refs.grdLeft.loadData();
    },
    initMasterData() {
      this.mstData = {
        _rowstatus: "", // p_action
        PK: "", // p_tes_user_pk
        TEI_COMPANY_PK: this.lstCompany, // lstCompany,////////////
        COMPANY_NM: "",
        STORE_CODE: this.lstStore, // lstStore,////////////////
        SHOP_NAME: "", // txtStoreName,
        POS_NO: "", /// txtPosNo,
        CUS_ID: "", // txtCustomerID,
        TAX_CODE: "", // txtTaxCode,
        CUS_NM: "", // txtCustomerNm,
        ADDR: "", // txtAddress ,
        EMAIL: "", // txtEmail,
        BILL_NO: "", //  txtBillNo ,
        SALE_DATE: "", //  dtDateOfSale,
        BILL_ATTACH: "", // txtAttach_Bill  ,
        TOTAL_AMT: "", ///  txtTotal_Payment,
        PAYMENT_METH: this.lstPayment, //  lstPayment_Method
        TOS_CUSTOMER_PK: "", // txtTos_Customer_Pk ,
        BRANCH_QR_CODE: "",
        USER_YN: "Y",
        COMBINE_YN: "Y",
        COMBINE_TEXT: "",
        STORE_PK: "",
        COMPANY_PK: "",
      };
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "TEI_COMPANY_PK",
        "COMPANY_NM",
        "STORE_CODE",
        "SHOP_NAME",
        "POS_NO",
        "CUS_ID",
        "TAX_CODE",
        "CUS_NM",
        "ADDR",
        "EMAIL",
        "BILL_NO",
        "SALE_DATE",
        "BILL_ATTACH",
        "TOTAL_AMT",
        "PAYMENT_METH",
        "TOS_CUSTOMER_PK",
        "BRANCH_QR_CODE",
        "USER_YN",
        "COMBINE_YN",
        "COMBINE_TEXT",
        "STORE_PK",
        "COMPANY_PK",
      ];
    },
  },
};
</script>

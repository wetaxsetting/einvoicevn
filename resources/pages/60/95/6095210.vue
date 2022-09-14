<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card tile>
              <v-container fluid class="py-1">
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->
                  <v-col lg="8" cols="12" class="py-1">
                    </v-col>
                  <v-col lg="4" cols="12" class="py-1">
                    <div class="d-flex justify-end">
                      <BaseButton
                        btn_type="icon"
                        icon_type="print"
                        :btn_text="$t('')"
                        @onclick="Print()"
                      />
                      <BaseButton
                        btn_type="icon"
                        icon_type="search"
                        :btn_text="$t('search')"
                        :disabled="false"
                        @onclick="onSearch()"
                      />
                      <BaseButton
                        btn_type="text"
                        :btn_text="$t('preview_original')"
                        @onclick="previewOriginal()"
                      />
                      <BaseButton
                        btn_type="text"
                        :btn_text="$t('converted')"
                        @onclick="Converted()"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->
                  <span>{{ cpnData.companyName }}</span>
               
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->
                  <span>{{ cpnData.address }}</span>
                  
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <!-- Company -->
                  <v-col lg="2" sm="6" cols="12">
                    <BaseDatePicker
                      outlined
                      :label="$t('date_from')"
                      start
                      v-model="transDateFrom"
                    ></BaseDatePicker>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <BaseDatePicker
                      outlined
                      :label="$t('date_to')"
                      end
                      v-model="transDateTo"
                    ></BaseDatePicker>
                  </v-col>
                  <v-col lg="1" sm="6" cols="12">
                    <v-select
                      dense
                      hide-details
                      outlined
                      item-value="CODE"
                      item-text="NAME"
                      :label="$t('status')"
                      :items="statusList"
                      v-model="lstStatus"
                    ></v-select>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <v-text-field
                      outlined
                      clearable
                      dense
                      hide-details
                      v-model="txtInvoiceNo"
                      :label="$t('invoice_no')"
                    ></v-text-field>
                  </v-col>
                  <v-col lg="2" sm="6" cols="12">
                    <v-select
                      clearable
                      dense
                      hide-details
                      outlined
                      :label="$t('trading_type')"
                      v-model="lstTradingType"
                      :items="tradingTypeList"
                      item-text="NAME"
                      item-value="CODE"
                    ></v-select>
                  </v-col>

                  <v-col lg="1" sm="6" cols="12">
                    <v-select
                      clearable
                      dense
                      hide-details
                      outlined
                      :label="$t('convertyn')"
                      v-model="lstConvertYn"
                      :items="convertYnList"
                      item-text="NAME"
                      item-value="CODE"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Tabs & Tab Contents -->
        <v-row no-gutters align="center" justify="start" class="mb-2">
          <v-col cols="12">
            <BaseGridView
              column-resizing-mode="widget"
              ref="grdInvoice"
              :auto_load="false"
              :multiselect="true"
              :headertype="1"
              :max_height="limitHeight"
              :header="headerGrid"
              @cellClick="getCellInfo"
              sel_procedure="AC_SEL_6095210_View"
              :filter_paras="[
                this.transDateFrom,
                this.transDateTo,
                this.cpnData.companyName,
                this.txtInvoiceNo,
                this.lstTradingType,
                this.lstStatus,
                this.cpnData.taxCode,
                this.lstConvertYn,
              ]"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog
      ref="confirmDialog"
      @onConfirm="onClickButton('OPTION')"
    ></confirm-dialog>
  </v-container>
</template>

<script>
import DataGridView from "@/components/control/DataGridView";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
    DataGridView,
  },
  data: () => ({
    transDateFrom: "",
    transDateTo: "",
    statusList: [],
    tradingTypeList: [],
    convertYnList: [],
    selectedRow: {},
    cpnData: {
      companyName: "",
      address: "",
      taxCode: "",
    },
    lstConvertYn: "",
    lstTradingType: "",
    lstStatus: "",
    txtInvoiceNo: "",
  }),

  async created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK;
    this.getSelectLists();
    this.getCompanyInfo();
  },
  mounted() {},
  watch: {},
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 650;
      }
    }, // this.windowHeight },
    headerGrid() {
      const self = this;
      return [
        {
          field: "RN",
          width: 50,
          title: "no",
          alignment: "center",
        },
        {
          field: "CUS_CD",
          title: "customer_id",
          alignment: "center",
        },
        {
          field: "CUS_NM",
          title: "customer_name",
          width: 250,
          alignment: "center",
        },
        {
          field: "FORM_NO",
          title: "form_no",

          width: 100,
          alignment: "center",
        },
        {
          field: "SERIAL_NO",
          title: "serial_no",
          width: 80,
          alignment: "center",
        },
        {
          field: "TR_DATE",
          title: "invoice_date",
          // type: "date",
          width: 100,
          alignment: "center",
        },
        {
          field: "INVOICE_NO",
          title: "invoice_no",

          width: 100,
          alignment: "center",
        },
        {
          field: "TR_CCY",
          title: "currency",
          width: 100,
          alignment: "center",
        },
        {
          field: "TR_RATE",
          title: "ex_rate",
          width: 80,
          alignment: "center",
        },
        {
          field: "TOT_NET_TR_AMT",
          title: "amount_trans",
          type: "number",
           width: 120,
          alignment: "center",
        },
        {
          field: "TOT_NET_BK_AMT",
          title: "amount_books",
          type: "number",
           width: 120,
          alignment: "center",
        },
        {
          field: "REMARK",
          title: "description",
          width: 250,
        },
        {
          field: "REMARK2",
          title: "local_description",
          width: 250,
        },
        {
          field: "EI_STATUS",
          title: "ei_status",
          alignment: "center",
        },
        {
          field: "SIGN_BY",
          title: "sign_name",
          alignment: "center",
        },
        {
          field: "SIGN_DT",
          title: "sign_date",
          alignment: "center",
          width: 150,
          // type: "date",
        },
        {
          field: "INVOICE_TYPE",
          title: "invoice_type",

          alignment: "center",
        },
        {
          field: "TAC_CRCA_PK",
          title: "tac_crca_pk",
          alignment: "center",
        },
        {
          field: "REPORT_CODE",
          title: "report_code",
          width: 100,
          alignment: "center",
        },
        {
          field: "CONVERT_YN",
          title: "convert_yn",
          width: 100,
          alignment: "center",
        },
        {
          field: "GET_AP_YN",
          title: "get_ap",
            width: 100,
          alignment: "center",
        },
        {
          field: "E_STATUS",
          title: "e_status",
            width: 100,
          alignment: "center",
        },
        {
          field: "CONVERT_NAME",
          title: "convert_name",
            width: 100,
          alignment: "center",
        },
        {
          field: "TEI_COMPANY_PK",
          title: "tei_company_pk",
            width: 150,
          alignment: "center",
        },
        {
          field: "OLD_YN",
          title: "old_yn",
          alignment: "center",
          type: "checkbox",
        },
      ];
    },
  },

  methods: {
    async getSelectLists() {
      const parentCodes = ["ACEI0040", "ACEI0010", "ACEI0030"];
      const results = await this._getCommonCode2(
        parentCodes,
        this.user.TCO_COMPANY_PK
      );
      if (results.length) {
        if (results[1]) {
          this.statusList = results[1];
          // this.lstStatus = this.statusList[0].CODE;
          this.statusList.forEach(element => {
           
            if(element.CODE==1){
              this.lstStatus=element.CODE
            }
          });
        }
        if (results[0].length) {
          this.tradingTypeList = results[0];
          this.lstTradingType = this.tradingTypeList[0].CODE;
        }
        if (results[2].length) {
          this.convertYnList = results[2];
          this.lstConvertYn = this.convertYnList[0].CODE;
        }
      }
    },
    async getCompanyInfo() {
      const companyInfo = await this._callProcedure(
        "AC_SEL_6095210_CompanyInfo",
        [this.user.USER_ID]
      );
      if (companyInfo.length > 0) {
        // console.log("companyInfo", companyInfo);
        // this.mstData.VOUCHER_TYPE = this.voucherTypeList[0].CODE; //this.voucherTypeList[0].CODE
        this.cpnData.companyName = companyInfo[0].COMPANY_NAME;
        this.cpnData.address = companyInfo[0].ADDRESS;
        this.cpnData.taxCode = companyInfo[0].TAX_CODE;
      }
    },
    onSearch() {
      this.$refs.grdInvoice.loadData();
    },
    async Print() {
     let userID=this.user.USER_ID
    },
    async previewOriginal() {

 const previewOriginalInfo = await this._callProcedure(
        "",
        [
          this.selectedRow.PK,
          this.user.USER_ID,
          this.user.PK,
          this.user.EMP_ID,
          this.user.USER_NAME,
          this.user.TCO_COMPANY_PK,
        ]
      );
      console.log("previewOriginalInfo", previewOriginalInfo);      
    },
    Converted() {},
    getCellInfo(data) {
      console.log("rowData", data.data);
      this.selectedRow = data.data;
      console.log("userInfo", this.user);
      // if(data.column.datafield == 'TAC_ABPL_CD') {
      //   this.workingDataRow = {...data.data};
      //   this.$refs.costcenterdialog.dialogIsShow = true;
      // }
    },
  },
};
</script>

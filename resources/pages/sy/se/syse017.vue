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
                <BaseInput
                  :label="$t('customer_id')"
                  v-model="txtCustomerId"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
              <v-col lg="4" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('customer_name')"
                  v-model="txtCustomerName"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
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

            <!--left table-->
            <v-row dense justify="start">
              <v-col cols="12">
                <BaseGridView
                  ref="grdLeft"
                  :header="grdLeftHeader"
                  sel_procedure="SYS_SEL_SYSE017_GetGridData"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[ this.txtCustomerName,this.txtCustomerId]"
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
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('customer_id')"
                  v-model="mstData.CUS_CD"
                  mandatory
                >
                </BaseInput>
              </v-col>

              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('tax_code')"
                  v-model="mstData.TAX_CODE"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 2-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('cus_nm')"
                  v-model="mstData.CUS_NM"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('cus_fnm')"
                  v-model="mstData.CUS_FNM"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 3-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('user_id')"
                  v-model="mstData.USER_ID"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 4-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput :label="$t('addr')" v-model="mstData.ADDR" mandatory>
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 5-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput :label="$t('tel')" v-model="mstData.TEL" mandatory>
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput :label="$t('fax')" v-model="mstData.FAX" mandatory>
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 6-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('user_type')"
                  v-model="lstRecieveType"
                  :lstData="lstRecieveTypeMaster"
                  item-text="CODE_NM"
                  item-value="CODE"
                />
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <v-sheet class="pa-2 d-flex align-center">
                  <v-checkbox
                    dense
                    hide-details
                    color="#000"
                    class="mt-0 pt-0"
                    true-value="Y"
                    false-value="N"
                    v-model="mstData.USE_YN"
                  ></v-checkbox>
                  <span class="">{{ $t("active") }}</span>
                </v-sheet>
              </v-col>
            </v-row>
            <!--row 7-->
            <v-row>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('email')"
                  v-model="mstData.EMAIL"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 8-->
            <v-row>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('represented_by')"
                  v-model="mstData.REPRESENTED_BY"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 9-->
            <v-row>
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('acc_ccy')"
                  v-model="mstData.ACC_CCY"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 10-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('acc_no')"
                  v-model="mstData.ACC_NO"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('acc_holder')"
                  v-model="mstData.ACC_HOLDER"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 11-->
            <v-row>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('bank_name')"
                  v-model="mstData.BANK_NAME"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('remarks')"
                  v-model="mstData.REMARKS"
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
    lstRecieveType: "01",
    lstRecieveTypeMaster: [],
    txtCustomerId: "",
    txtCustomerName: "",

    mstData: null,
    mstPara: [],
  }),

  async created() {
    this.initMasterData();
    this.initPara();
    this.getRecieveType();
  },
  mounted() {},
  watch: {
    lstRecieveType: function () {
      this.mstData.RECEIVE_BY = this.lstRecieveType;
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
          width: 70,
          title: "rownum",
          alignment: "center",
        },
        {
          field: "CUS_CD",
          width: 100,
          title: "cus_cd",
          alignment: "center",
        },
        {
          field: "CUS_NM",
          width: 150,
          title: "cus_nm",
          alignment: "center",
        },
        {
          field: "TAX_CODE",
          width: 150,
          title: "tax_code",
          alignment: "center",
        },
        {
          field: "FAX",
          width: 200,
          title: "fax",
          alignment: "center",
        },
        {
          field: "EMAIL",
          width: 250,
          title: "email",
          alignment: "center",
        },
        {
          field: "TEL",
          width: 250,
          title: "tel",
          alignment: "center",
        },
        {
          field: "STORE_ID",
          width: 0,
          title: "store_id",
          alignment: "center",
        },
      ];
    },
  },

  methods: {
    async saveMaster() {
      //let validate = this.checkData();
        if(this.mstData.PK == "" && this.mstData._rowstatus!="i"){
alert("Please select a user");
        }else{
      const dso = {
        type: "control",
        selpro: "SYS_SEL_SYSE017_RefetchData",
        updpro: "SYS_UPD_SYSE017_User_Entry",
        para: [this.mstData.PK],
        elname: this.mstPara,
        data: this.mstData,
      };
      if (this.mstData._rowstatus !== "i" && this.mstData._rowstatus !== "d") {
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
      }}
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
      this.lstRecieveType =  "01";

      this.mstData._rowstatus = "i"; // p_action
      this.mstData.PK = ""; // p_tes_user_pk
      this.mstData.CUS_CD = ""; // p_Customer
      this.mstData.TAX_CODE = ""; // p_Tax
      this.mstData.CUS_NM = ""; // p_CustomerID
      this.mstData.CUS_FNM = ""; // p_CustomerNm
      this.mstData.USER_ID = this.user.USER_ID; // p_UserID
      this.mstData.ADDR = ""; // p_Address
      this.mstData.Receive_by = this.lstRecieveType; // p_Receiving
      this.mstData.TEL = ""; // p_Phone
      this.mstData.FAX = ""; // p_Fax
      this.mstData.EMAIL = ""; // p_Email
      this.mstData.REPRESENTED_BY = ""; // p_Represented
      this.mstData.ACC_CCY = ""; // p_ContractNm
      this.mstData.ACC_NO = ""; // p_BankAcc
      this.mstData.ACC_HOLDER = ""; // p_AccHolder
      this.mstData.BANK_NAME = ""; // p_BankName
      this.mstData.REMARKS = ""; // p_Memo
      this.mstData.USE_YN = "Y"; // p_chkActive
    },

    async getRecieveType() {
      const recieveType = await this._callProcedure("SYS_SEL_SYSE017_GRS", [
        " ",
      ]);
      console.log(recieveType);
      if (recieveType.length > 0) {
        this.lstRecieveTypeMaster = recieveType;
        this.lstRecieveType = recieveType[0].CODE;
      }
    },
    async cellClick(data) {
      let selectedData = data.data;
      this.mstData.PK = selectedData.PK;

      const IssueDetail = await this._callProcedure(
        "SYS_SEL_SYSE017_RefetchData",
        [this.mstData.PK]
      );

      console.log(IssueDetail);
       this.lstRecieveType = IssueDetail[0].RECEIVE_BY;

      this.mstData.PK = IssueDetail[0].PK; // p_tes_user_pk
      this.mstData.CUS_CD = IssueDetail[0].CUS_CD; // p_Customer
      this.mstData.TAX_CODE = IssueDetail[0].TAX_CODE; // p_Tax
      this.mstData.CUS_NM = IssueDetail[0].CUS_NM; // p_CustomerID
      this.mstData.CUS_FNM = IssueDetail[0].CUS_FNM; // p_CustomerNm
      this.mstData.USER_ID = IssueDetail[0].USER_ID; // p_UserID
      this.mstData.ADDR = IssueDetail[0].ADDR; // p_Address
      this.mstData.RECEIVE_BY = IssueDetail[0].RECEIVE_BY; // p_Receiving
      this.mstData.TEL = IssueDetail[0].TEL; // p_Phone
      this.mstData.FAX = IssueDetail[0].FAX; // p_Fax
      this.mstData.EMAIL = IssueDetail[0].EMAIL; // p_Email
      this.mstData.REPRESENTED_BY = IssueDetail[0].REPRESENTED_BY; // p_Represented
      this.mstData.ACC_CCY = IssueDetail[0].ACC_CCY; // p_ContractNm
      this.mstData.ACC_NO = IssueDetail[0].RECEIACC_NOVE_BY; // p_BankAcc
      this.mstData.ACC_HOLDER = IssueDetail[0].ACC_HOLDER; // p_AccHolder
      this.mstData.BANK_NAME = IssueDetail[0].BANK_NAME; // p_BankName
      this.mstData.REMARKS = IssueDetail[0].REMARKS; // p_Memo
      this.mstData.USE_YN = IssueDetail[0].USE_YN; // p_chkActive
    },
    checkData() {
      if (this.mstData.USER_ID == "") {
        alert("UserID cann't be blank.");
        return false;
      }

      if (this.mstData.TAX_CODE == "") {
        alert("Tax code cann't be blank.Please input name for this user.");
        return false;
      }
      if (this.mstData.CUS_NM == "") {
        alert("Password cannt be blank.");
        return false;
      }
      if (this.mstData.EMAIL == "") {
        alert("Email cannt be blank.");
        return false;
      }

      return true;
    },
    onSearchMaster() {
      this.$refs.grdLeft.loadData();
    },
    initMasterData() {
      this.mstData = {
        _rowstatus: "", // p_action
        PK: "", // p_tes_user_pk
        CUS_CD: "", // p_Customer
        TAX_CODE: "", // p_Tax
        CUS_NM: "", // p_CustomerID
        CUS_FNM: "", // p_CustomerNm
        USER_ID: this.user.USER_ID, // p_UserID
        ADDR: "", // p_Address
        RECEIVE_BY: this.lstRecieveType, // p_Receiving
        TEL: "", // p_Phone
        FAX: "", // p_Fax
        EMAIL: "", // p_Email
        REPRESENTED_BY: "", // p_Represented
        ACC_CCY: "", // p_ContractNm
        ACC_NO: "", // p_BankAcc
        ACC_HOLDER: "", // p_AccHolder
        BANK_NAME: "", // p_BankName
        REMARKS: "", // p_Memo
        USE_YN: "Y", // p_chkActive
      };
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "CUS_CD",
        "TAX_CODE",
        "CUS_NM",
        "CUS_FNM",
        "USER_ID",
        "ADDR",
        "RECEIVE_BY",
        "TEL",
        "FAX",
        "EMAIL",
        "REPRESENTED_BY",
        "ACC_CCY",
        "ACC_NO",
        "ACC_HOLDER",
        "BANK_NAME",
        "REMARKS",
        "USE_YN",
      ];
    },
  },
};
</script>

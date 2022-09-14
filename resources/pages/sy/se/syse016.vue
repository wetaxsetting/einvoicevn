<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row class="pl-2">
      <!--left panel-->
      <v-col class="px-0" :cols="6">
        <v-card class="pa-0">
          <v-container fluid class="pb-0">
            <v-row dense>
              <v-col lg="6" sm="6" cols="12" class="d-flex align-center">
                <v-select
                  dense
                  hide-details
                  outlined
                  item-value="VAL"
                  item-text="NAME"
                  :label="$t('company_name')"
                  :items="lstCompanyMaster"
                  v-model="lstCompany"
                ></v-select>
              </v-col>
              <v-col lg="2" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('userid_empid')"
                  v-model="txtUserId"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="2" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('user_name')"
                  v-model="txtUserName"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="1" sm="6" cols="12">
                <v-sheet class="pa-2 d-flex align-center">
                  <v-checkbox
                    dense
                    hide-details
                    color="#000"
                    class="mt-0 pt-0"
                    true-value="Y"
                    false-value="N"
                    v-model="chkActiveSearch"
                  ></v-checkbox>
                  <span class="">{{ $t("") }}</span>
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

            <!--left table-->
            <v-row dense justify="start">
              <v-col cols="12">
                <BaseGridView
                  ref="grdLeft"
                  :header="grdLeftHeader"
                  sel_procedure="SYS_SEL_SYSE016_GetGridData"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[
                    txtUserId,
                    txtUserName,
                    chkActiveSearch,
                    'GENUWIN',
                    lstCompany,
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
            <v-row >
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
            <!--row 1-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('user_id')"
                  v-model="mstData.USER_ID"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('user_type')"
                  v-model="lstUserType"
                  :lstData="lstUserTypeMaster"
                  item-text="CODE_NM"
                  item-value="CODE"
                />
              </v-col>
            </v-row>
            <!--row 2-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('password')"
                  v-model="mstData.USER_PW"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('user_name')"
                  v-model="mstData.USER_NAME"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 3-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('confirm_password')"
                  v-model="mstData.CONFIRM_PW"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseSelect
                  :label="$t('user_language')"
                  v-model="lstLang"
                  :lstData="lstLangMaster"
                  item-text="NAME"
                  item-value="ENG"
                />
              </v-col>
            </v-row>

            <!--row 4-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('confirm_password_send')"
                  v-model="mstData.PASSWORDSEND"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12">
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

            <!--row 5-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('partner_id')"
                  v-model="mstData.PARTNER_ID"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('partner_name')"
                  v-model="mstData.PARTNER_NM"
                  mandatory
                >
                </BaseInput>
              </v-col>
            </v-row>

            <!--row 6-->
            <v-row >
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('mobile')"
                  v-model="mstData.MOBILE"
                  mandatory
                >
                </BaseInput>
              </v-col>
              <v-col lg="6" sm="6" cols="12" class="py-1">
                <BaseInput :label="$t('tel')" v-model="mstData.TEL" mandatory>
                </BaseInput>
              </v-col>
            </v-row>
            <!--row 7-->
            <v-row >
              <v-col lg="8" sm="6" cols="12" class="py-1">
                <BaseInput
                  :label="$t('mail')"
                  v-model="mstData.EMAIL"
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
    lstLang: 0,
    lstLangMaster: [],
    lstUserType: 0,
    lstUserTypeMaster: [],
    txtUserId: "",
    txtUserName: "",
    chkActiveSearch: "Y",

    mstData: null,
    mstPara: [],
  }),

  async created() {
    this.initMasterData();
    this.initPara();
    this.getCompanyInfo();
    this.getLangList();
    this.getUserType();
  },
  mounted() {},
  watch: {
    lstLang: function () {
      this.mstData.USER_LANGUAGE = this.lstLang;
    },
    lstUserType: function () {
      this.mstData.USER_TYPE = this.lstUserType;
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
          field: "NO",
          width: 50,
          title: "no",
          alignment: "center",
        },
        {
          field: "PARTNERID",
          width: 100,
          title: "partner_id",
          alignment: "center",
        },
        {
          field: "PARTNERNM",
          width: 150,
          title: "partner_nm",
          alignment: "center",
        },
        {
          field: "USER_ID",
          width: 150,
          title: "user_id",
          alignment: "center",
        },
        {
          field: "MOBILE",
          width: 200,
          title: "mobile",
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
      ];
    },
  },

  methods: {
    async saveMaster() {
        if(this.mstData.PK == ""  && this.mstData._rowstatus!="i"){
alert("Please select a user");
        }else{
      //let validate = this.checkData();
   const dso = {
              type: "control",
              selpro: "SYS_SEL_SYSE016_RefetchData",
              updpro: "SYS_UPD_SYSE016_User_Entry",
              para: [this.mstData.PK],
              elname: this.mstPara,
              data: this.mstData,
            };
      if (this.mstData._rowstatus !== "i" && this.mstData._rowstatus !== "d") {
        this.mstData._rowstatus = "u";
      }
      if (this.mstData._rowstatus !== "d") {
        if ( this.checkData()) {
          if (this.mstData.USER_PW != this.mstData.CONFIRM_PW) {
            this.mstData.CONFIRM_PW = this.b64_md5(this.mstData.USER_PW);
            this.mstData.USER_PW = this.b64_md5(this.mstData.USER_PW);
          }
          if (this.mstData._rowstatus !== "i") {
            if (this.mstData.USER_PW != this.mstData.PASSWORDSEND) {
              alert("Password Send Mail and PassWord is wrong !!!");
              return;
            }
            this.mstData.CONFIRM_PW = this.b64_md5(this.mstData.USER_PW);
            this.mstData.USER_PW = this.b64_md5(this.mstData.USER_PW);
            ////////////  
            let row = await this._dsoCall(dso, "update", true);

            if (row) {
              this.mstData = {
                ...row,
              };
            }
            ////////////////////
          } else {
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
      }else{
  
         let row = await this._dsoCall(dso, "update", true);

            if (row) {
              this.mstData = {
                ...row,
              };
            }
             this.$refs.grdLeft.loadData();
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
    deleteMaster() {
        if(this.mstData.PK == ""){
alert("Please select a user to delete!");
        }else{
      this.mstData._rowstatus = "d"; // p_action
      this.txtUserId= "";
    this.txtUserName= "";
        }

     
    },
    clearInput() {

      this.lstLang = 0;
      this.lstUserType = 0;

      this.mstData._rowstatus = "i"; // p_action
      this.mstData.PK = ""; //p_tes_user_pk
      this.mstData.USER_ID = ""; //p_userid
      this.mstData.USER_TYPE = this.lstUserType; //p_UserType
      this.mstData.USER_PW = ""; //p_password
      this.mstData.USER_NAME = ""; //p_Name,
      this.mstData.CONFIRM_PW = ""; //p_ConfirmPwd
      this.mstData.USER_LANGUAGE = this.lstLang; //p_Language
      this.mstData.PASSWORDSEND = ""; //p_ConfirmPwd_S
      this.mstData.USE_YN = "N"; //p_Active
      this.mstData.PARTNER_ID = ""; // p_ParnerID
      this.mstData.PARTNER_NM = ""; //p_user_name
      this.mstData.TEI_COMPANY_PK = this.lstCompany; //p_Tei_company_Pk
      this.mstData.MOBILE = ""; //p_Mobile
      this.mstData.TEL = ""; //p_Tel
      this.mstData.EMAIL = ""; // p_Mail
    },
    async getCompanyInfo() {
      const companyInfo = await this._callProcedure(
        "SYS_SEL_SYSE016_GetCompanyLst",
        [this.user.PK]
      );

      if (companyInfo.length > 0) {
        this.lstCompanyMaster = companyInfo;
        this.lstCompany = companyInfo[0].VAL;
      }
    },

    async getLangList() {
      const langList = await this._callProcedure("SYS_SEL_SYSE016_GetLangLst");
      if (langList.length > 0) {
        this.lstLangMaster = langList;
        this.lstLang = langList[0].ENG;
      }
    },

    async getUserType() {
      const userType = await this._callProcedure("SYS_SEL_SYSE016_GetUserType");
      if (userType.length > 0) {
        this.lstUserTypeMaster = userType;
        this.lstUserType = userType[0].CODE;
      }
    },
    async cellClick(data) {
      let selectedData = data.data;
      this.mstData.PK = selectedData.PK;

      const IssueDetail = await this._callProcedure(
        "SYS_SEL_SYSE016_RefetchData",
        [this.mstData.PK]
      );
      this.lstLang = IssueDetail[0].USER_LANGUAGE;
      this.lstUserType = IssueDetail[0].USER_TYPE;

      this.mstData.USER_ID = IssueDetail[0].USER_ID; //p_userid
      this.mstData.USER_TYPE = IssueDetail[0].USER_TYPE; //p_UserType
      this.mstData.USER_PW = IssueDetail[0].USER_PW; //p_password
      this.mstData.USER_NAME = IssueDetail[0].USER_NAME; //p_Name,
      this.mstData.CONFIRM_PW = IssueDetail[0].CONFIRM_PW; //p_ConfirmPwd
      this.mstData.USER_LANGUAGE = IssueDetail[0].USER_LANGUAGE; //p_Language
      this.mstData.PASSWORDSEND = IssueDetail[0].PASSWORDSEND; //p_ConfirmPwd_S
      this.mstData.USE_YN = IssueDetail[0].USE_YN; //p_Active
      this.mstData.PARTNER_ID = IssueDetail[0].PARTNER_ID; // p_ParnerID
      this.mstData.PARTNER_NM = IssueDetail[0].PARTNER_NM; //p_user_name
      this.mstData.TEI_COMPANY_PK = IssueDetail[0].TEI_COMPANY_PK; //p_Tei_company_Pk
      this.mstData.MOBILE = IssueDetail[0].MOBILE; //p_Mobile
      this.mstData.TEL = IssueDetail[0].TEL; //p_Tel
      this.mstData.EMAIL = IssueDetail[0].EMAIL; // p_Mail
    },
    checkData() {
      if (this.mstData.USER_ID == "") {
        alert("UserID cann't be blank.");
        return false;
      }
      if (this.user.PK == "" && this.mstData.USER_TYPE == "0") {
        alert(
          "Not found mapping employee. Please remapping employee for this account."
        );
        return false;
      }
      if (this.mstData.USER_NAME == "") {
        alert("Employee name cann't be blank.Please input name for this user.");
        return false;
      }
      if (this.mstData.USER_PW == "") {
        alert("Password cannt be blank.");
        return false;
      }
      if (this.mstData.USER_PW != this.mstData.CONFIRM_PW) {
        alert("Password and Confirm password differ. Please re-enter.");
        return false;
      }
      if (this.mstData.USER_LANGUAGE == "") {
        alert("Default language cannt be blank.");

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
        PK: "", //p_tes_user_pk
        USER_ID: "", //p_userid
        USER_TYPE: this.lstUserType, //p_UserType
        USER_PW: "", //p_password
        USER_NAME: "", //p_Name,
        CONFIRM_PW: "", //p_ConfirmPwd
        USER_LANGUAGE: this.lstLang, //p_Language
        PASSWORDSEND: "", //p_ConfirmPwd_S
        USE_YN: "N", //p_Active
        PARTNER_ID: "", // p_ParnerID
        PARTNER_NM: "", //p_user_name
        TEI_COMPANY_PK: this.lstCompany, //p_Tei_company_Pk
        MOBILE: "", //p_Mobile
        TEL: "", //p_Tel
        EMAIL: "", // p_Mail
      };
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "USER_ID",
        "USER_TYPE",
        "USER_PW",
        "USER_NAME",
        "CONFIRM_PW",
        "USER_LANGUAGE",
        "PASSWORDSEND",
        "USE_YN",
        "PARTNER_ID",
        "PARTNER_NM",
        "TEI_COMPANY_PK",
        "MOBILE",
        "TEL",
        "EMAIL",
      ];
    },
  },
};
</script>

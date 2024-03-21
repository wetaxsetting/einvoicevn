<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="5" :class="isShowLeft ? null : 'd-none'" class="pt-2">
        <v-card>
          <v-row dense class="pt-2">
            <v-col lg="8" cols="12" class="pl-2">
              <v-text-field outlined clearable dense hide-details v-model="txtCompanyName" :label="$t('company')"></v-text-field>
            </v-col>
            <v-col lg="1" cols="12">
              <v-badge offset-x="55" color="green" :content="$t('use_yn')" style="font-size: 0.35rem">
                <v-checkbox v-model="blUseYN" color="red darken-3" true-value="Y" false-value="N" hide-details class="my-0 py-0"></v-checkbox>
              </v-badge>
            </v-col>
            <v-col lg="3" cols="12" class="text-right">
              <div class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('SEARCH')" />
              </div>
            </v-col>
            <v-col md="12" class="pt-2">
              <BaseGridView
                column-resizing-mode="widget"
                ref="grdCompany"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeight"
                :header="headerGrid"
                :onCellPrepared="onCellPrepared"
                @cellClick="grdSearchClick"
                sel_procedure="EI_SEL_6095010_LIST_COMP_NC"
                upd_procedure=""
                :filter_paras="[this.txtCompanyName, this.blUseYN, this.user.PK]"
                :update_paras="[]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col :md="isShowLeft ? 7 : 12">
        <v-row dense>
          <v-col md="12">
            <v-card>
              <v-row dense class="pt-2">
                <v-col md="1" class="d-flex pl-2">
                  <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'" :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')" @onclick="isShowLeft = !isShowLeft" />
                </v-col>
                <v-col lg="3" cols="12"> </v-col>
                <v-col lg="3" cols="12" justify="center"></v-col>
                <v-col lg="5" cols="12" class="pr-3" align="center">
                  <div class="d-flex justify-end">
                    <!-- Add -->
                    <BaseButton icon_type="add_new" :btn_text="$t('btn_add')" :disabled="isProcessing" @onclick="onClickButton('NEW')" />
                    <!-- Save -->
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="onClickButton('SAVE')" />
                    <!-- Delete -->
                    <!-- <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="onClickButton('DELETE')" /> -->
                  </div>
                </v-col>
              </v-row>
              <v-col md="12">
                <v-card v-scroll.self="onScroll" class="overflow-y-auto" :max-height="scroll_height">
                  <v-card-title class="headline primary-gradient white--text py-1">{{ $t("company_info") }} </v-card-title>
                  <v-container fluid class="pt-1">
                    <v-row dense>
                      <v-col md="11">
                        <BaseInput outlined :label="$t('company')" v-model="MasterInfo.COMPANY_NM" />
                      </v-col>
                      <v-col md="1">
                        <v-badge offset-x="55" color="green" :content="$t('use_yn')" style="font-size: 0.35rem">
                          <v-checkbox v-model="MasterInfo.USE_YN" color="red darken-3" true-value="Y" false-value="N" hide-details class="my-0 py-0"></v-checkbox>
                        </v-badge>
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('company_name')" v-model="MasterInfo.TAX_CODE" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('legal_representative')" v-model="MasterInfo.REPRESENT" />
                      </v-col>
                      <v-col md="12">
                        <BaseInput outlined :label="$t('address')" v-model="MasterInfo.ADDR" />
                      </v-col>

                      <v-col md="6">
                        <BaseInput outlined :label="$t('fax')" v-model="MasterInfo.FAX" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('tel')" v-model="MasterInfo.TEL" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('bank_name')" v-model="MasterInfo.BANK_NAME" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('account_no')" v-model="MasterInfo.ACC_NO" />
                      </v-col>
                      <!-- ///// -->
                      <v-col md="6">
                        <BaseInput outlined :label="$t('bank_name_2')" v-model="MasterInfo.BANK_NAME2" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('account_no_2')" v-model="MasterInfo.ACC_NO2" />
                      </v-col>
                      <!-- // -->
                      <v-col md="6">
                        <BaseSelect outlined :label="$t('tax_agency_name')" v-model="MasterInfo.MCQTQLY" :lstData="taxOfficeList" item-text="NAME" item-value="CODE" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('account_holder')" v-model="MasterInfo.ACC_HOLDER" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('email')" v-model="MasterInfo.CONTACT_EMAIL" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('contact_person')" v-model="MasterInfo.CONTACT_PERSON" />
                      </v-col>
                      
                      <v-col md="6">
                        <v-chip label>{{ $t("image_logo") }}</v-chip>
                        <BasePhoto ref="photoLogo" :width="150" :height="100" table_name="TEI_COMPANY_1" v-model="MasterInfo.PK" :procedure="procedure_upload"></BasePhoto>
                      </v-col>
                      <v-col md="6">
                        <v-chip label>{{ $t("image_backgound") }}</v-chip>
                        <BasePhoto ref="photoBackground" :width="150" :height="100" table_name="TEI_COMPANY_2" v-model="MasterInfo.PK" :procedure="procedure_upload"></BasePhoto>
                      </v-col>
                      <v-col md="12">
                        <BaseInput outlined :label="$t('remark')" v-model="MasterInfo.REMARKS" />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>

              <v-col class="my-0 py-0">
                <v-col md="12">
                  <GwFlexBox justify="end">
                    <BaseButton icon_type="import" :btn_text="$t('import_token')" @onclick="onClickButton('addDetailToken')"  />
                    <BaseButton btn_type="icon" icon_type="add_new" :btn_text="$t('add_token_manual')" :disabled="isProcessing" @onclick="onClickButton('addDetail')" />
                    <!-- Save -->
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('saveDetail')" />
                    <!-- Delete -->
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClickButton('deleteDetail')" />
                  </GwFlexBox>
                </v-col>
                <v-col md="12" class="py-0">
                  <BaseGridView
                    ref="grdDetail"
                    :header="grdDetail"
                    sel_procedure="EI_SEL_6095010_01_NC"
                    upd_procedure="EI_UPD_6095010_02"
                    :headertype="1"
                    :filter_paras="[this.MasterInfo.PK]"
                    :update_paras="['PK', 'TEI_COMPANY_PK', 'CA_NAME', 'DN_NAME', 'DN_MST', 'SERIAL_NUMBER', 'NOTAFTER', 'NOTBEFORE', 'TOKEN_TYPE', 'STATUS', 'D_CERTIFICATE_TYPE', 'USERNAME', 'PASSWORD', 'PIN']"
                    :max_height="limitHeightGridDetails"
                  />
                </v-col>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const findValueDeep = require("deepdash/findValueDeep");
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DatePicker: () => import("@/components/control/DatePicker"),
    ConfirmDialog,
  },
  data: () => ({
    isShowLeft: true,
    scrollInvoked: 0,
    txtCompanyName: "",
    dxg_gridCompany: [],
    objClick: "",
    blYN: "",
    txtFile: [],
    blImgLogo: "",
    blImgBackGroup: "",
    blUseYN: "Y",
    txtFileName: "",
    table_name: "TEI_COMPANY",
    folder: "6095010",
    procedure_upload: "EI_UPD_6095010_IMG_v2",

    imp_MultipleTemp: true,
    cboTemplate: [],
    selTemplate: [],

    txtMastersPK: "",
    taxOfficeList: [],
    MasterInfo: {
      COMPANY_NM: "",
      TAX_CODE: "",
      ADDR: "",
      REPRESENT: "",
      BANK_NAME: "",
      BANK_NAME2: "",
      ACC_NO2: "",
      ACC_NO: "",
      TEL: "",
      FAX: "",
      ACC_HOLDER: "",
      CONTACT_PERSON: "",
      CONTACT_EMAIL: "",
      BANK_NAME: "",
      REMARKS: "",
      USE_YN: "",
      IMG_LOGO: "",
      IMG_BACKGROUP: "",

      COMPANY_CD: "",
      COMPANY_NM: "",
      COMPANY_FNM: "",
      ADDR_L: "",
      ADDR_F: "",
      TEL: "",
      FAX: "",
      ACC_CCY: "",
      REP_PERSON: "",
      TAX_NAME: "",
      REMARKS: "",
      ERP_COMPANY_PK: "",
      ERP_COMPANY_NAME: "",
      USE_YN: "",
      WEB_SITE: "",
      TAX_CODE_DISPLAY: "",
      CONTACT_COM_PHONE: "",
      BRIEF_COM_NM: "",
      CONTACT_ADDR: "",
      CONTACT_EMAIL: "",
      CONTACT_MOBI: "",
      WEBSITE_EI: "",
      MCQTQLY: "",
    },
    token_type_list: [],
    d_certificate_type_list: []
  }),

  async created() {
    await this.initDataList();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    scroll_height() {
      return this.windowHeight / 2 + 30;
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return this.windowHeight * 0.8;
      }
    }, // this.windowHeight },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 200;
      }
    },
    headerGrid() {
      const self = this;
      return [
        {
          dataField: "PK",
          width: 80,
          caption: this.$t("pk"),
          visible: false,
        },
        {
          dataField: "COMPANY_CD",
          width: 120,
          caption: this.$t("company_cd"),
          visible: false,
        },
        {
          dataField: "COMPANY_NM",
          width: 300,
          caption: this.$t("company_nm"),
        },
        {
          dataField: "COMPANY_LNM",
          caption: this.$t("company_lnm"),
          visible: false,
        },
        {
          dataField: "COMPANY_FNM",
          caption: this.$t("company_fnm"),
          width: 180,
        },
        {
          dataField: "TAX_CODE",
          caption: this.$t("tax_code"),
          width: 120,
        },
        {
          dataField: "ADDR",
          caption: this.$t("addr"),
          width: 300,
        },
        {
          dataField: "ADDR_L",
          caption: this.$t("addr_l"),
          width: 80,
          visible: false,
        },
        {
          dataField: "ADDR_F",
          caption: this.$t("addr_f"),
          width: 80,
          visible: false,
        },
        {
          dataField: "TEL",
          caption: this.$t("tel"),
          width: 120,
        },
        {
          dataField: "FAX",
          caption: this.$t("fax"),
          width: 80,
        },
        {
          dataField: "ACC_NO",
          caption: this.$t("acc_no"),
          width: 80,
        },
        {
          dataField: "ACC_CCY",
          caption: this.$t("acc_ccy"),
        },
        {
          dataField: "ACC_HOLDER",
          caption: this.$t("acc_holder"),
          visible: false,
        },
        {
          dataField: "BANK_NAME",
          caption: this.$t("bank_name"),
          width: 80,
        },
        {
          dataField: "CONTACT_PERSON",
          caption: this.$t("contact_person"),
        },
        {
          dataField: "REP_PERSON",
          caption: this.$t("rep_person"),
        },
        {
          dataField: "TAX_NAME",
          caption: this.$t("tax_name"),
        },
        {
          dataField: "REMARKS",
          caption: this.$t("remarks"),
        },
        {
          dataField: "ERP_COMPANY_PK",
          caption: this.$t("erp_company_pk"),
          visible: false,
        },
        {
          dataField: "ERP_COMPANY_NAME",
          caption: this.$t("erp_company_name"),
          visible: false,
        },
        {
          dataField: "USE_YN",
          caption: this.$t("use_yn"),
          cssClass: "cell-align-center",
          dataType: "checkbox",
        },
        {
          dataField: "WEB_SITE",
          caption: this.$t("web_site"),
        },
        {
          dataField: "TAX_CODE_DISPLAY",
          caption: this.$t("tax_code_display"),
        },
        {
          dataField: "CONTACT_COM_PHONE",
          caption: this.$t("contact_com_phone"),
        },
        {
          dataField: "BRIEF_COM_NM",
          caption: this.$t("brief_com_nm"),
        },
        {
          dataField: "CONTACT_ADDR",
          caption: this.$t("contact_addr"),
          width: 150,
        },
        {
          dataField: "CONTACT_EMAIL",
          caption: this.$t("contact_email"),
        },
        {
          dataField: "CONTACT_MOBI",
          caption: this.$t("contact_mobi"),
        },
        {
          dataField: "WEBSITE_EI",
          caption: this.$t("website_ei"),
        },
      ];
    },

    grdDetail(){
      const self = this;
      return[
        {
          dataField: "NO",
          caption: this.$t("no"),
          width: 50,
        },
        {
          dataField: "PK",
          caption: this.$t("pk"),
          visible: false,
        },
        {
          dataField: "TEI_COMPANY_PK",
          caption: this.$t("tei_company_pk"),
          visible: false,
        },
        {
          dataField: "CA_NAME",
          caption: this.$t("ttchuc"),
          allowEditing: true,
          width: 100,
        },
        {
          dataField: "DN_MST",
          caption: this.$t("mst"),
          visible: false,
        },
        {
          dataField: "SERIAL_NUMBER",
          caption: this.$t("seti"),
          width: 230,
        },
        {
          dataField: "NOTBEFORE",
          caption: this.$t("tngay"),
          width: 150,
        },
        {
          dataField: "NOTAFTER",
          caption: this.$t("dngay"),
          width: 150,
        },
        {
          dataField: "TOKEN_TYPE",
          caption: this.$t("hthuc"),
          allowEditing: true,
          lookup: {
            dataSource: this.token_type_list,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          width: 100,
        },
        {
          dataField: "D_CERTIFICATE_TYPE",
          caption: this.$t("d_certificate_type"),
          width: 120,
          allowEditing: true,
          lookup: {
            displayExpr: "NAME",
            valueExpr: "CODE",
            dataSource: this.d_certificate_type_list,
          },
        },
        {
          dataField: "USERNAME",
          caption: this.$t("user_name"),
          width: 150,
          allowEditing: true,
        },
        {
          dataField: "PASSWORD",
          caption: this.$t("password"),
          width: 100,
          dataType: "password",
          allowEditing: true,
        },
        {
          dataField: "PIN",
          caption: this.$t("pin"),
          width: 100,
          dataType: "password",
          allowEditing: true,
        },
      ];
    }
  },

  methods: {
    addTokenManual() {
      this.$refs.grdDetail.addRowStruct({
                          PK : '',
                          TEI_COMPANY_PK: this.MasterInfo.PK,
                          CA_NAME: '',
                          DN_NAME: '',
                          DN_MST: '',
                          SERIAL_NUMBER: '',
                          NOTAFTER: '',
                          NOTBEFORE: '',
                          TOKEN_TYPE: '1',
                          STATUS: '',
                          D_CERTIFICATE_TYPE: '2',
                          USERNAME: '',
                          PASSWORD: '',
                          PIN: '',
                        },
                        0
                    );
    },

    onScroll() {
      this.scrollInvoked++;
    },
    async grdSearchClick(cell) {
      this.MasterInfo.PK = await cell.data.PK;
      this.dsoMaster("select");

      await this.$refs.grdDetail.loadData();
    },
    async dsoMaster(action) {
      await this._dsoCall(
        {
          type: "control",
          selpro: "EI_SEL_6095010_M_NC",
          updpro: "EI_UPD_6095010_COMPANY",
          para: [this.MasterInfo.PK],
          elname: [
            "_rowstatus",
            "PK",
            "COMPANY_CD",
            "COMPANY_NM",
            "COMPANY_LNM",
            "COMPANY_FNM",
            "TAX_CODE",
            "ADDR",
            "ADDR_L",
            "ADDR_F",
            "TEL",
            "FAX",
            "ACC_NO",
            "ACC_CCY",
            "ACC_HOLDER",
            "BANK_NAME",
            "CONTACT_PERSON",
            "REP_PERSON",
            "TAX_NAME",
            "REMARKS",
            "ERP_COMPANY_PK",
            "ERP_COMPANY_NAME",
            "USE_YN",
            "WEB_SITE",
            "TAX_CODE_DISPLAY",
            "CONTACT_COM_PHONE",
            "BRIEF_COM_NM",
            "CONTACT_ADDR",
            "CONTACT_EMAIL",
            "CONTACT_MOBI",
            "WEBSITE_EI",
            "REPRESENT",
            "CQTQLY",
            "MCQTQLY",
            "BANK_NAME2",
            "ACC_NO2"
          ],
          data: this.MasterInfo,
        },
        action,
        true
      ).then((res) => {
        if (res) {
          switch (action) {
            case "select":
              this.MasterInfo = { ...res };
              this.MasterInfo._rowstatus = "u";
              break;
            case "update":
              switch (this.MasterInfo._rowstatus) {
                case "i":
                  this.MasterInfo = { ...res };
                  this.MasterInfo._rowstatus = "u";
                  break;
                case "u":
                  this.MasterInfo = { ...res };
                  this.MasterInfo._rowstatus = "u";
                  break;
                case "d":
                  this.onClick("newMaster");
                  break;
              }
              break;
          }
        }
      });
    },
    async onClickButton(obj) {
      switch (obj) {
        case "SEARCH":
          this.$refs.grdCompany.loadData();
          break;
        case "NEW":
          this.addNewMaster(); //
          
          break;
        case "SAVE":
          if (this.MasterInfo.COMPANY_NM == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_company"));
            break;
          } else if (this.MasterInfo.TAX_CODE == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_code"));
            break;
          } else if (this.MasterInfo.REPRESENT == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_represent"));
            break;
          }  else if (this.MasterInfo.ADDR == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_address"));
            break;
          }else if (this.MasterInfo.CONTACT_EMAIL == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_contact_email"));
            break;
          }else if (this.MasterInfo.MCQTQLY == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_authority_name"));
            break;
          }else {
            this.dsoMaster("update");
            let savedPhoto = await this.$refs.photoLogo.Save();
            let savedPhotoBG = await this.$refs.photoBackground.Save();
          }
          break;
        case "DELETE":
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"), "warning");
          break;
        case "addDetailToken":
          this.onGetDetailDeclaration();
          break;
        case "addDetail":
          this.addTokenManual();
          break;
        case "saveDetail":
        let data = this.$refs.grdDetail.getData();
          for (let i = 0; i < data.length; i++) {
            if (data[i]._rowstatus == "i" || data[i]._rowstatus == "u") {
              if (!data[i].D_CERTIFICATE_TYPE) {
                this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_type_of_certificate_at_" + (i + 1)));
                return;
              } 
            }
          }
          this.$refs.grdDetail.saveData();
          break;
        case "deleteDetail":
          this.$refs.grdDetail.deleteRows();
          break;
        case "OPTION":
          if (this.objClick == "btnSave") {
            this.$refs.grdCompany.saveData();
          } else if (this.objClick == "btnDelete") {
            this.$refs.grdCompany.deleteRows2();
          } else if (this.objClick == "btnUpLoad") {
            this.onCallUploadFile();
          }
          break;
      }
    },
    async initDataList() {
      const taxInfo = await this._callProcedure("EI_SEL_6095460_TAXOF");
        if (taxInfo.length > 0) {
          this.taxOfficeList = taxInfo;
        }

      const results = await this._getCommonCode2(["ACEI0120", "ACJS0460", "ACEIS320"], this.txtCompanyName);

      //this.taxOfficeList = results[0];
      this.token_type_list = results[1];
      this.d_certificate_type_list = results[2];
    },
    async addNewMaster() {
      this.MasterInfo._rowstatus = "i";
      this.MasterInfo.COMPANY_NM = "";
      this.MasterInfo.TAX_CODE = "";
      this.MasterInfo.ADDR = "";
      this.MasterInfo.REPRESENT = "";
      this.MasterInfo.FAX = "";
      this.MasterInfo.TEL = "";
      this.MasterInfo.USE_YN = "Y";
      this.MasterInfo.BANK_NAME = "";
      this.MasterInfo.BANK_NAME2 = "";
      this.MasterInfo.ACC_NO2 = "";
      this.MasterInfo.ACC_HOLDER = "";
      this.MasterInfo.ACC_NO = "";
      this.MasterInfo.CONTACT_EMAIL = "";
      this.MasterInfo.CONTACT_PERSON = "";
      this.MasterInfo.REMARKS = "";
      this.MasterInfo.MCQTQLY = "00";
      // this.MasterInfo. = null;
      // this.MasterInfo. = null;
      this.$refs.grdDetail.Clear();
    },
    async onGetDetailDeclaration() {
      if (this.MasterInfo.PK != "") {
        jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/getTokenInfo",
          dataType: "text",
          method: "POST",
          data: {
            crt_by: this.user.USER_ID,
            xml: null,
          },
          error: this.onErrorGetDetailDeclaration,
          success: this.onSuccessGetDetailDeclaration,
        });
      }
    },

    async onErrorGetDetailDeclaration() {
      this.showNotification("warning", this.$t("warning"), this.$t("pls_install_application_or_open_application"));
    },

    async onSuccessGetDetailDeclaration(data) {
      let obj_token = $.parseJSON(data);
      this.$refs.grdDetail.addRowStruct({
        _rowstatus: "i",
        NO: this.$refs.grdDetail.getDataSource().length + 1,
        PK: "",
        TEI_COMPANY_PK: this.MasterInfo.PK,
        CA_NAME: this.getPara("CN", obj_token.issue_by),
        DN_NAME:obj_token.dn_name,
        DN_MST: obj_token.dn_mst,
        SERIAL_NUMBER: obj_token.serial_number,
        NOTAFTER: obj_token.not_after,
        NOTBEFORE: obj_token.not_before,
        TOKEN_TYPE: "1",
        STATUS: obj_token.status,
        D_CERTIFICATE_TYPE: obj_token.d_certificate_type,
      });
    },
    getPara(paraname, data) {
      let result = "";
      let start = data.indexOf(paraname + "=");
      if (start >= 0 && start + paraname.length < data.length) {
        start = start + paraname.length + 1;

        let spa = data.indexOf(",", start);

        if (spa >= 0 && data.length > spa && spa - start > 0) {
          result = data.substring(start, spa);
        } else {
          result = data.substring(start);
        }

        result.replace(paraname + "=", "");
      }
      return result;
    },
    // addNewMaster(item) {
    //   this.$refs.grdCompany.addRowStruct(
    //     {
    //       PK: "",
    //       COMPANY_CD: "",
    //       COMPANY_NM: "",
    //       COMPANY_LNM: "",
    //       COMPANY_FNM: "",
    //       TAX_CODE: "",
    //       ADDR: "",
    //       ADDR_L: "",
    //       ADDR_F: "",
    //       TEL: "",
    //       FAX: "",
    //       ACC_NO: "",
    //       ACC_CCY: "",
    //       ACC_HOLDER: "",
    //       BANK_NAME: "",
    //       CONTACT_PERSON: "",
    //       REP_PERSON: "",
    //       TAX_NAME: "",
    //       REMARKS: "",
    //       ERP_COMPANY_PK: "",
    //       ERP_COMPANY_NAME: "",
    //       USE_YN: "Y",
    //       WEB_SITE: "",
    //       TAX_CODE_DISPLAY: "",
    //       CONTACT_COM_PHONE: "",
    //       BRIEF_COM_NM: "",
    //       CONTACT_ADDR: "",
    //       CONTACT_EMAIL: "",
    //       CONTACT_MOBI: "",
    //       WEBSITE_EI: "",
    //     },
    //     0
    //   );
    //   this.selectedItemAcc = { ...item };
    // },

    onCellPrepared({ column, cellElement, rowType }) {
      if (this.txtInvoice_type === "E") {
        if (
          rowType === "data" &&
          (column.dataField === "ATTRIBUTE1" ||
            column.dataField === "ATTRIBUTE2" ||
            column.dataField === "ATTRIBUTE3" ||
            column.dataField === "ATTRIBUTE4" ||
            column.dataField === "ATTRIBUTE5" ||
            column.dataField === "SEQ_DIS" ||
            column.dataField === "SEQ")
        ) {
          cellElement.style.width = 100;
        }
      }
    },

    onCallUploadFile() {
      console.log(this.txtFile);
      if (this.txtFile.length == 0) {
        return;
      }
      if (this.blImgLogo === "N" && this.blImgBackGroup === "N") {
        this.showNotification("warning", "Information", this.$t("msg_please_select_a_checkbox_data"));
        return;
      }
      this.UploadFile().then(() => {
        this.txtFileName = "";
        this.txtFile = [];
      });
    },
    async UploadFile() {
      if (this.txtMastersPK) {
        let params = [
          this.txtMastersPK, // p_tei_company_pk
          this.blImgLogo, // p_img_logo_yn
          this.blImgBackGroup, // p_img_backgroup_yn
          "TEI_COMPANY", // p_master_table_pk
        ];
        const fd = new FormData();
        fd.append("file", this.txtFileName);
        fd.append("proc", "EI_UPD_6095010_IMG");
        fd.append("folder", "6095010"); //
        fd.append("para", JSON.stringify(params));

        const res = await this.$axios({
          method: "post",
          url: "/dso/uploadfile2",
          data: fd,
        });
        if (res.data.data) {
          this.showNotification("success", this.$t("PROCESS_SUCCESS", "COMMON"), "");
          console.log(res.data.data);
          this.fileSave = null;
          this.txtFile = [];
          //this.$refs.grdAttachFiles.loadData();
        } else {
          this.showNotification("danger", this.$t("ERROR_OCCURS", "COMMON"), "");
        }
      }
    },
    onFilePicked(file) {
      if (file == "" || file == "undefined") {
        return;
      }

      this.txtFileName = file;
      const fr = new FileReader();
      fr.readAsDataURL(this.txtFileName);
      fr.addEventListener("load", () => {
        this.image = fr.result;
      });
    },
  },
};
</script>

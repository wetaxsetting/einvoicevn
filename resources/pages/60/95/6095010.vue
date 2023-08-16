<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="7" :class="isShowLeft ? null : 'd-none'" class="pt-2">
        <v-card>
          <v-row dense class="pt-2">
            <v-col lg="5" cols="12" class="pl-2">
              <v-text-field outlined clearable dense hide-details v-model="txtCompanyName" :label="$t('company')"></v-text-field>
            </v-col>
            <v-col lg="2" cols="12">
              <v-badge offset-x="55" color="green" :content="$t('use_yn')" style="font-size: 0.35rem">
                <v-checkbox v-model="blUseYN" color="red darken-3" true-value="Y" false-value="N" hide-details class="my-0 py-0"></v-checkbox>
              </v-badge>
            </v-col>
            <v-col lg="5" cols="12" class="text-right">
              <div class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('SEARCH')" />
              </div>
            </v-col>
            <v-col md="12" class="pt-2">
              <DataGridView
                column-resizing-mode="widget"
                ref="grdCompany"
                :auto_load="false"
                select_mode="Single"
                :max_height="limitHeight"
                :header="headerGrid"
                :onCellPrepared="onCellPrepared"
                @cellClick="grdSearchClick"
                sel_procedure="AC_SEL_6095010_LIST_COMPANY_NC"
                upd_procedure=""
                :filter_paras="[this.txtCompanyName, this.blUseYN]"
                :update_paras="[]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col :md="isShowLeft ? 5 : 12">
        <v-row dense>
          <v-col md="12">
            <v-card>
              <v-row dense>
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
                        <BaseInput outlined :label="$t('company')" v-model="txtInformation.COMPANY_NM" />
                      </v-col>
                      <v-col md="1">
                        <v-badge offset-x="55" color="green" :content="$t('use_yn')" style="font-size: 0.35rem">
                          <v-checkbox v-model="txtInformation.USE_YN" color="red darken-3" true-value="Y" false-value="N" hide-details class="my-0 py-0"></v-checkbox>
                        </v-badge>
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('company_name')" v-model="txtInformation.TAX_CODE" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('legal_representative')" v-model="txtInformation.REPRESENT" />
                      </v-col>
                      <v-col md="12">
                        <BaseInput outlined :label="$t('address')" v-model="txtInformation.ADDR" />
                      </v-col>
                      
                      <v-col md="6">
                        <BaseInput outlined :label="$t('fax')" v-model="txtInformation.FAX" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('tel')" v-model="txtInformation.TEL" />
                      </v-col>
                      <!-- <v-col md="11">
                        <BaseInput outlined :label="$t('general_info')" />
                      </v-col> -->
                      
                      <v-col md="12">
                        <BaseInput outlined :label="$t('bank_name')" v-model="txtInformation.BANK_NAME" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('account_holder')" v-model="txtInformation.ACC_HOLDER" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('account_no')" v-model="txtInformation.ACC_NO" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('email')" v-model="txtInformation.CONTACT_EMAIL" />
                      </v-col>
                      <v-col md="6">
                        <BaseInput outlined :label="$t('contact_person')" v-model="txtInformation.CONTACT_PERSON" />
                      </v-col>
                      <v-col md="12">
                        <BaseInput outlined :label="$t('tax_agency_name')" />
                      </v-col>
                      <v-col md="12">
                        <BaseInput outlined :label="$t('remark')" v-model="txtInformation.REMARKS" />
                      </v-col>
                      <v-col md="6">
                        <v-chip label>{{ $t("image_logo") }}</v-chip>
                        <BasePhoto ref="photo" v-model="txtInformation.PK" :table_name="'TEI_COMPANY'"></BasePhoto>
                      </v-col>
                      <v-col md="6">
                        <v-chip label>{{ $t("image_backgound") }}</v-chip>
                        <BasePhoto ref="photo" :width="500" v-model="txtInformation.PK" :table_name="'TEI_COMPANY'"></BasePhoto>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>

              <v-col md="12">
                <DataGridView ref="grdDetail" :header="headerList.grdDetail" sel_procedure="AC_SEL_6095010_01_NC" :headertype="1" :filter_paras="['']" :max_height="limitHeightGridDetails" />
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
    procedure_upload: "AC_UPD_6095010_IMG",

    imp_MultipleTemp: true,
    cboTemplate: [],
    selTemplate: [],

    txtMastersPK: "",
    headerList: {
      grdDetail: [],
    },
    txtInformation: {
      COMPANY_NM: "",
      TAX_CODE: "",
      ADDR: "",
      REPRESENT: "",
      BANK_NAME: "",
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
      TAX_CODE: "",
      ADDR: "",
      ADDR_L: "",
      ADDR_F: "",
      TEL: "",
      FAX: "",
      ACC_NO: "",
      ACC_CCY: "",
      ACC_HOLDER: "",
      BANK_NAME: "",
      CONTACT_PERSON: "",
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
    },
  }),

  created() {
    this.initHeaderList();
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
        return 510;
      }
    }, // this.windowHeight },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 220;
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
  },

  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    async grdSearchClick(cell) {
      console.log("file: 6095420.vue:236 [vng-304] grdSearchClick [vng-304] cell:", cell.data);
      this.txtInformation = cell.data;

      await  this.$refs.grdDetail.loadData();
    },
    async dsoMaster(action) {
      await this._dsoCall(
        {
          type: "control",
          selpro: "",
          updpro: "AC_UPD_6095010_LIST_COMPANY",
          para: [this.txtInformation.PK, ""],
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
            "REPRESENT"
          ],
          data: this.txtInformation,
        },
        action,
        true
      ).then((res) => {
        if (res) {
          switch (action) {
            case "select":
              this.txtInformation = { ...res };
              this.txtInformation._rowstatus = "u";
              break;
            case "update":
              switch (this.txtInformation._rowstatus) {
                case "i":
                  this.txtInformation = { ...res };
                  this.txtInformation._rowstatus = "u";
                  break;
                case "u":
                  this.txtInformation = { ...res };
                  this.txtInformation._rowstatus = "u";
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
    onClickButton(obj) {
      switch (obj) {
        case "SEARCH":
          this.$refs.grdCompany.loadData();
          break;
        case "NEW":
          this.addNewMaster(); //
          break;
        case "SAVE":
          this.dsoMaster("update");
          // this.objClick = "btnSave";
          break;
        case "DELETE":
          this.objClick = "btnDelete";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"), "warning");
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
    async addNewMaster() {
      this.txtInformation._rowstatus = "i";
      this.txtInformation.COMPANY_NM = "";
      this.txtInformation.TAX_CODE = "";
      this.txtInformation.ADDR = "";
      this.txtInformation.REPRESENT = "";
      this.txtInformation.FAX = "";
      this.txtInformation.TEL = "";
      this.txtInformation.USE_YN = "Y";
      this.txtInformation.BANK_NAME = "";
      this.txtInformation.ACC_HOLDER = "";
      this.txtInformation.ACC_NO = "";
      this.txtInformation.CONTACT_EMAIL = "";
      this.txtInformation.CONTACT_PERSON = "";
      this.txtInformation.REMARKS = "";
      // this.txtInformation. = null;
      // this.txtInformation. = null;
      // this.txtInformation. = null;
      // this.$refs.grdCompany.Clear();
    },
    async initHeaderList() {
      this.headerList.grdDetail = [
        {
          dataField: "NO",
          caption: this.$t("no"),
          width: 50,
        },
        {
          dataField: "PK",
          caption: this.$t("pk"),
          hidden: true,
        },
        {
          dataField: "tei_declaration_m_pk",
          caption: this.$t("tei_declaration_m_pk"),
          hidden: true,
        },
        {
          dataField: "TTCHUC",
          caption: this.$t("ttchuc"),
          allowEditing: true,
          width: 200,
        },
        {
          dataField: "MST",
          caption: this.$t("mst"),
          width: 150,
          hidden: true,
        },
        {
          dataField: "SERI",
          caption: this.$t("seti"),
          width: 300,
        },
        {
          dataField: "TNGAY",
          caption: this.$t("tngay"),
          width: 200,
        },
        {
          dataField: "DNGAY",
          caption: this.$t("dngay"),
          width: 200,
        },
        {
          dataField: "HTHUC",
          caption: this.$t("hthuc"),
          allowEditing: true,
          lookup: {
            displayExpr: "NAME",
            valueExpr: "CODE",
            dataSource: this.token_type_list,
          },
          width: 230,
        },
      ];
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
        fd.append("proc", "AC_UPD_6095010_IMG");
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

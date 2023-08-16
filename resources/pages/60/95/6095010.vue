<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="7" :class="isShowLeft ? null : 'd-none'">
        <v-card class="pt-1">
          <v-row dense>
            <v-col lg="5" cols="12">
              <v-text-field outlined clearable dense hide-details v-model="txtCompanyName" :label="$t('company')"></v-text-field>
            </v-col>
            <v-col lg="2" cols="12">
              <div class="d-flex justify-end">
                <BaseCheckbox :label="$t('use_yn')" true-value="Y" false-value="N" v-model="blUseYN" />
              </div>
            </v-col>
            <v-col lg="5" cols="12" class="text-right">
              <div class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('SEARCH')" />
              </div>
            </v-col>
            <v-col md="12">
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
                upd_procedure="AC_UPD_6095010_LIST_COMPANY"
                :filter_paras="[this.txtCompanyName, this.blUseYN]"
                :update_paras="[
                  'PK',
                  'COMPANY_CD',
                  'COMPANY_NM',
                  'COMPANY_LNM',
                  'COMPANY_FNM',
                  'TAX_CODE',
                  'ADDR',
                  'ADDR_L',
                  'ADDR_F',
                  'TEL',
                  'FAX',
                  'ACC_NO',
                  'ACC_CCY',
                  'ACC_HOLDER',
                  'BANK_NAME',
                  'CONTACT_PERSON',
                  'REP_PERSON',
                  'TAX_NAME',
                  'REMARKS',
                  'ERP_COMPANY_PK',
                  'ERP_COMPANY_NAME',
                  'USE_YN',
                  'WEB_SITE',
                  'TAX_CODE_DISPLAY',
                  'CONTACT_COM_PHONE',
                  'BRIEF_COM_NM',
                  'CONTACT_ADDR',
                  'CONTACT_EMAIL',
                  'CONTACT_MOBI',
                  'WEBSITE_EI',
                ]"
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
              </v-row>
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

    txtInformation: {
      COMPANY_NM: "",
      TAX_CODE: "",
      ADDR: "",

      BANK_NAME: "",
    },
  }),

  created() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 510;
      }
    }, // this.windowHeight },
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
    onSearch() {
      this.$refs.grdCompany.loadData();
    },
    grdSearchClick(cell) {
      console.log("file: 6095420.vue:236 [vng-304] grdSearchClick [vng-304] cell:", cell.data);
      this.txtInformation = cell.data;
    },
    addNewMaster(item) {
      this.$refs.grdCompany.addRowStruct(
        {
          PK: "",
          COMPANY_CD: "",
          COMPANY_NM: "",
          COMPANY_LNM: "",
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
          USE_YN: "Y",
          WEB_SITE: "",
          TAX_CODE_DISPLAY: "",
          CONTACT_COM_PHONE: "",
          BRIEF_COM_NM: "",
          CONTACT_ADDR: "",
          CONTACT_EMAIL: "",
          CONTACT_MOBI: "",
          WEBSITE_EI: "",
        },
        0
      );
      this.selectedItemAcc = { ...item };
    },

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
    onClickButton(obj) {
      switch (obj) {
        case "SEARCH":
          this.$refs.grdCompany.loadData();
          break;
        case "NEW":
          this.addNewMaster(); //
          break;
        case "SAVE":
          this.objClick = "btnSave";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
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
        case "UPLOAD":
          this.objClick = "btnUpLoad";
          this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_upload_img"), "warning");
          break;
      }
    },
  },
};
</script>

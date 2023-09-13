<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid v-resize="onResize">
    <v-row dense class="pt-1">
      <v-col cols="6" :class="isShowLeft ? null : 'd-none'">
        <v-row dense>
          <v-col md="7">
            <BaseSelect :label="$t('company')" v-model="selected_company" :lstData="company_list" item-text="TEXT" item-value="PK" />
          </v-col>
          <v-col md="5" class="d-flex justify-end">
            <BaseButton icon_type="search" btn_type="icon" :btn_text="$t('search')" @onclick="onClickButton('SEARCH_M')" />
            <BaseButton btn_type="icon" icon_type="copy" @onclick="copyToDialog = true" />
            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" @onclick="onClickButton('NEW_M')" />
            <!-- <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClickButton('DELETE_M')" /> -->
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClickButton('SAVE_M')" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col md="2">
            <BaseDatePicker :label="$t('year')" v-model="year" year today />
          </v-col>
          <v-col md="5">
            <BaseDatePicker :label="$t('fromdate')" v-model="fromDate" />
          </v-col>
          <v-col md="5">
            <BaseDatePicker :label="$t('to_date')" v-model="toDate" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col md="7">
            <BaseInput :label="$t('serial_no')" v-model="txtSerialNo" />
          </v-col>
          <v-col md="5">
            <BaseSelect :label="$t('status')" v-model="lstStatus" :lstData="statusList" item-text="NAME" item-value="CODE" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <BaseGridView
              ref="grdEinvoiceIssue"
              :header="grdHeader"
              sel_procedure="EI_SEL_6095055_1_NC"
              :multiselect="true"
              selectionmode="singlecell"
              :headertype="1"
              :filter_paras="[this.selected_company, this.fromDate, this.toDate, this.txtSerialNo, this.lstStatus]"
              upd_procedure="EI_UPD_6095055_2"
              :editable="true"
              :update_paras="[
                'PK',
                'TCO_COMPANY_PK',
                'INVOICE_KIND',
                'SERIAL_NO_2',
                'FORM_NO',
                'SERIAL_NO',
                'FROM_DT',
                'TO_DT',
                'STATUS',
                'TCO_BUSPLACE_PK',
                'REMARKS',
                'USE_YN',
                'FROM_NO',
                'TEMPLATE_CD',
              ]"
              :height="limitHeight"
              @cellClick="cellClickCell"
            />
          </v-col>
        </v-row>

        <v-row dense class="pt-4">
          <v-col md="7">
            <BaseSelect outlined :label="$t('template_id')" v-model="MasterInfo.TEMPLATE_CD" :lstData="templateID_list" item-text="NAME" item-value="CODE" />
          </v-col>
          <v-col lg="2">
            <v-badge offset-x="55" color="green" :content="$t('use_yn')" style="font-size: 0.35rem">
              <v-checkbox v-model="MasterInfo.USE_YN" color="red darken-3" true-value="Y" false-value="N" hide-details class="my-0 py-0"></v-checkbox>
            </v-badge>
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')" :disabled="!item_pk" @onclick="getImpFile" />
            <BaseButton btn_type="icon" icon_type="view" :btn_text="$t('view')" :disabled="!item_pk" @onclick="onClickButton('VIEW')" />
            <BaseButton btn_type="icon" icon_type="new" :btn_text="$t('new')" :disabled="!item_pk" @onclick="onClickButton('NEW_S')" />
            <!-- <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" :disabled="!item_pk" @onclick="onClickButton('DELETE_S')" /> -->
            <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" :disabled="!item_pk" @onclick="onClickButton('SAVE_S')" />
          </v-col>
        </v-row>
        <v-row dense>
          <!-- <v-col md="4">
            <BaseInput outlined :label="$t('serial_no')" v-model="MasterInfo.TEMPLATE_NM" readonly />
          </v-col>
          <v-col md="4">
            <BaseSelect outlined :label="$t('form_no')" v-model="MasterInfo.FORM_NO" :lstData="formNoList" item-text="NAME" item-value="CODE" readonly />
          </v-col>
          <v-col md="4">
            <BaseInput outlined :label="$t('from_no')" v-model="MasterInfo.FROM_NO" readonly />
          </v-col> -->
        </v-row>

        <BaseTabs>
          <BaseTab :name="$t('logo')">
            <span v-show="showPersonal">
              <v-row dense>
                <v-col md="6">
                  <v-col lg="12">
                    <v-container fluid>
                      <v-row no-gutters align="center" justify="center">
                        <img ref="photoLogo" :src="imageLOGO" :width="200" :height="200" @click="selectImageLOGO" />
                        <input type="file" accept="image/png, image/jpeg, image/bmp" v-show="false" ref="fileLOGO" @change="selectedFileLOGO" />
                      </v-row>
                      <v-row>
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="icon" icon_type="view_origin" :btn_text="$t('view_origin')" mdi-icon="mdi-file-find-outline" onlyIcon @onclick="viewImage" v-show="view_origin" />
                        <v-spacer></v-spacer>
                      </v-row>
                      <!-- //////VIEW Hinh -->
                      <v-dialog v-model="img_dialog">
                        <v-card>
                          <v-container fluid>
                            <v-row no-gutters align="center" justify="center">
                              <img :src="imageLOGO" :height="originHeight" :width="originWidth" />
                            </v-row>
                          </v-container>
                        </v-card>
                      </v-dialog>
                    </v-container>
                  </v-col>
                </v-col>

                <v-col md="6">
                  <v-row dense class="pr-3">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('url_img_logo')" v-model="MasterInfo.URL_IMG_LOGO" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('logo_start_row')" v-model="MasterInfo.LOGO_START_ROW" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('logo_start_col')" v-model="MasterInfo.LOGO_START_COL" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('logo_width')" v-model="MasterInfo.LOGO_WIDTH" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('logo_height')" v-model="MasterInfo.LOGO_HEIGHT" type="number" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </span>
          </BaseTab>
          <BaseTab :name="$t('background')">
            <span v-show="showExp">
              <v-row dense>
                <v-col md="6">
                  <v-col lg="12">
                    <v-container fluid>
                      <v-row no-gutters align="center" justify="center">
                        <img ref="photoBG" :src="imageBG" :width="200" :height="200" @click="selectImageBG" />
                        <input type="file" accept="image/png, image/jpeg, image/bmp" v-show="false" ref="fileBG" @change="selectedFileBG" />
                      </v-row>
                      <v-row>
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="icon" icon_type="view_origin" :btn_text="$t('view_origin')" mdi-icon="mdi-file-find-outline" onlyIcon @onclick="viewImageBG" v-show="view_origin" />
                        <v-spacer></v-spacer>
                      </v-row>
                      <!-- //////VIEW Hinh -->
                      <v-dialog v-model="img_dialogbg">
                        <v-card>
                          <v-container fluid>
                            <v-row no-gutters align="center" justify="center">
                              <img :src="imageBG" :height="originHeight" :width="originWidth" />
                            </v-row>
                          </v-container>
                        </v-card>
                      </v-dialog>
                    </v-container>
                  </v-col>
                </v-col>
                <v-col md="6">
                  <v-row dense class="pr-3">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('url_img_bg')" v-model="MasterInfo.URL_IMG_BG" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('bg_start_row')" v-model="MasterInfo.BG_START_ROW" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('bg_start_col')" v-model="MasterInfo.BG_START_COL" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('bg_width')" v-model="MasterInfo.BG_WIDTH" type="number" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3 numberLeft">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('bg_height')" v-model="MasterInfo.BG_HEIGHT" type="number" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </span>
          </BaseTab>

          <BaseTab :name="$t('sign_position')">
            <span v-show="showSign">
              <v-row dense>
                <v-col md="6">
                  <v-row dense>
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_start_cell')" v-model="MasterInfo.SIGN_START_CELL" number />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_end_cell')" v-model="MasterInfo.SIGN_END_CELL" number />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_by_start_cell')" v-model="MasterInfo.SIGN_BY_START_CELL" number />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_by_end_cell')" v-model="MasterInfo.SIGN_BY_END_CELL" number />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col md="6">
                  <v-row dense class="pr-3">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_cell_box')" v-model="MasterInfo.SIGN_CELL_BOX" />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('details_start_row')" v-model="MasterInfo.DETAILS_START_ROW" number />
                    </v-col>
                  </v-row>
                  <v-row dense class="pr-3">
                    <v-col lg="12">
                      <BaseInput outlined :label="$t('sign_range_details')" v-model="MasterInfo.SIGN_RANGE_DETAILS" number />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </span>
          </BaseTab>
        </BaseTabs>
      </v-col>
      <v-row dense :lg="isShowLeft ? 6 : 12">
        <v-col md="12" class="d-flex">
          <iframe :src="urlPDF" height="825" width="100%"></iframe>
        </v-col>
      </v-row>
    </v-row>
    <GwLoading :visible="showLoading" />
    <!-- <view-einvoice-pdf-dialog ref="ViewEInvoicePDFDialog" :src_pdfUrl="pdfUrl"></view-einvoice-pdf-dialog> -->
    <!-- Copy To Dialog -->
    <v-dialog persistent id="copy-to-dialog" max-width="500" v-model="copyToDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t("copy_template_to") }}</v-card-title>
        <v-card-text class="pa-4 pb-2 d-flex flex-column align-space-between">
          <v-row>
            <v-col md="6">
              <v-select
                cache-items
                dense
                hide-details
                outlined
                clearable
                class="pb-3"
                item-value="PK"
                item-text="TEXT"
                :label="$t('from_company')"
                :items="company_list"
                v-model="selectedCompanyFrom"
                @change="onChangeCompanyFrom"
              ></v-select>
            </v-col>
            <v-col md="6">
              <v-select
                cache-items
                dense
                hide-details
                outlined
                class="pb-3"
                item-value="PK"
                item-text="TEXT"
                :label="$t('to_company')"
                :items="company_list"
                v-model="selectedCompanyTo"
                @change="onChangeCompanyFrom"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-select cache-items dense hide-details outlined class="pb-3" item-value="CODE" item-text="NAME" :label="$t('from_no_from')" :items="fromNoList" v-model="lstFrom_No_From"></v-select>
            </v-col>
            <v-col md="6">
              <BaseInput :label="$t('from_no_to')" w v-model="txtForm_No_To" />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-select
                cache-items
                dense
                hide-details
                outlined
                class="pb-3"
                item-value="CODE"
                item-text="NAME"
                :label="$t('seria_no_from')"
                :items="serialNoList"
                v-model="lstSerial_No_From"
              ></v-select>
            </v-col>
            <v-col md="6">
              <BaseInput :label="$t('seria_no_to')" v-model="txtSerial_No_To" />
            </v-col>
          </v-row>

          <v-checkbox v-show="false" dense hide-details class="my-0 py-0" true-value="Y" false-value="N" :label="$t('overwrite')" v-model="overWriteYN"></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <span class="red--text">{{ copyResult }}</span>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" @click="copyToDialog = false">{{ $t("cancel", "common") }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" @click="onProcessConfirm('copy')">{{ $t("copy") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= -->

<script>
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "vue-pdf-app/dist/icons/main.css";
import VuePdfApp from "vue-pdf-app";
// import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  props: {
    view_origin: { type: Boolean, default: true },
  },
  components: {
    // "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
    GwImportExcelFile: () => import("@/components/control/GwImportExcelFile.vue"),
    VuePdfApp,
  },
  /*############### data ##########################*/
  data: () => ({
    urlPDF: "",
    imageLOGO: "",
    imageBG: "",
    isShowLeft: true,
    showLoading: false,
    item_pk: null,
    itemTemplatePK: "",
    itemTemplatesPK: "",
    file: null,
    selected_company: "",
    company_list: [],
    month: "",
    year: "",
    fromDate: "",
    toDate: "",
    lstStatus: "",
    statusList: [],
    txtSerialNo: "",
    pdfUrl: "",
    leftCols: 5,
    showHilden: true,
    indexTab: 0,
    typeInvoiceList: [],
    invoiceKind: [],
    typeTableList: [],
    typeTemplateList: [],
    typeList: [],
    versionList: [],
    paramList: [],
    paramDList: [],
    styleList: [],
    imp_MultipleTemp: true,
    selTemplate: [],
    cboTemplate: [],
    selInvoiceType: "",
    cboInvoiceType: [],
    copyToDialog: false,
    fromNoList: [],
    lstFrom_No_From: "",
    serialNoList: [],
    lstSerial_No_From: "",
    txtForm_No_To: "",
    txtSerial_No_To: "",
    overWriteYN: "N",
    copyResult: "",
    selectedCompanyTo: "",
    selectedCompanyFrom: "",
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    url_template: "",
    txtParamCodeMaster: "",
    txtParamCodeDetails: "",
    dataIssued: [],
    templateIdList: [],
    dataTemp: [],

    MasterInfo: {
      _rowstatus: null,
      TEI_TEMPLATE_PK: null,
      TEMPLATE_CD: "",
      URL_FILE_EXCEL: "",

      URL_IMG_LOGO: "",
      LOGO_START_ROW: "",
      LOGO_START_COL: "",
      LOGO_WIDTH: "",
      LOGO_HEIGHT: "",
      ////
      URL_IMG_BG: "",
      BG_START_ROW: "",
      BG_START_COL: "",
      BG_WIDTH: "",
      BG_HEIGHT: "",
      ////
      SIGN_START_CELL: "",
      SIGN_END_CELL: "",
      SIGN_BY_START_CELL: "",
      SIGN_BY_END_CELL: "",
      SIGN_CELL_BOX: "",
      DETAILS_START_ROW: "",
      SIGN_RANGE_DETAILS: "",

      TEMPLATE_NM: "",
      SERIAL_NO: "",
      FORM_NO: "",
      FORM_NO: "",
      FROM_NO: "",
      USE_YN: "",
    },
    img_dialog: false,
    img_dialogbg: false,
    originHeight: 400,
    originWidth: 400,

    formNoList: [],
    templateID_list: [],
    //
    showPersonal: true,
    showExp: true,
    showSign: true,
    fileSaveLOGO: null,
    folder: "",
    fileSaveBG: null,
  }),
  /*############### created #######################*/
  async created() {
    console.clear();
    this.imageBG = this.renderImg("assets/images/no_image.png");
    this.imageLOGO = this.renderImg("assets/images/no_image.png");
    await this.getListCodes("company");
    await this.getListCodes("serial_no");
    await this.getListCodes("form_no");
    await this.getListCodes("status");

    this.pdf_handler = require("./js/EiExcelHandlerERPTemplates.js");
    if (!!this.pdf_handler) {
      Object.assign(this, this.pdf_handler.default);
    }
  },
  /*############### watch ######################*/
  watch: {
    month(val) {
      if (val) {
        this.fromDate = val + "01";
        this.toDate = val + this._maxDateOfMonth(val);
      }
    },
    selectedCompanyFrom(val) {
      this.getListCodes("form_no");
    },
    lstFrom_No_From(val) {
      this.getListCodes("serial_no");
    },
    selectedCompanyFrom(val) {
      if (val) {
        this.selectedCompanyTo = val;
      }
    },
    year(val) {
      if (val) {
        this.fromDate = this.year + "0101";
        this.toDate = this.year + "1231";
      }
    },
  },
  /*############### computed ######################*/
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeightT() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.7; //1366x768
      } else {
        return this.windowHeight * 0.8; //1920x1080
      }
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.2; //1366x768
      } else {
        return this.windowHeight * 0.3; //1920x1080
      }
    },
    gridHeight() {
      return this.formContainerHeight - 250;
    },
    masterContainerHeight() {
      return this.formContainerHeight - 250;
    },

    grdHeader() {
      return [
        { dataField: "PK", width: 100, caption: this.$t("pk"), alignment: "left", type: "text", visible: false },
        { dataField: "TCO_COMPANY_PK", width: 100, caption: this.$t("tco_company_pk"), alignment: "left", type: "text", visible: false },
        {
          dataField: "INVOICE_KIND",
          width: 160,
          caption: this.$t("invoice_kind"),
          editable: true,
          lookup: {
            dataSource: this.typeInvoiceList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          alignment: "left",
          type: "text",
        },
        {
          dataField: "SERIAL_NO_2",
          width: 200,
          caption: this.$t("invoice_symbol"),
          editable: true,
          lookup: {
            dataSource: this.invoiceKind,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          alignment: "left",
          type: "text",
        },
        {
          dataField: "FORM_NO",
          width: 110,
          caption: this.$t("form_no"),
          editable: true,
          alignment: "left",
          type: "text",
          lookup: {
            dataSource: this.Form_noList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
        },
        { dataField: "SERIAL_NO", width: 80, caption: this.$t("serial_no"), editable: true, alignment: "left", type: "text" },

        { dataField: "FROM_NO", width: 100, caption: this.$t("from_no"), editable: true, alignment: "center", type: "number" },

        { dataField: "FROM_DT", width: 100, caption: this.$t("from_dt"), editable: true, alignment: "center", type: "date" },
        { dataField: "TO_DT", width: 100, caption: this.$t("to_dt"), editable: true, alignment: "center", type: "date" },
        {
          dataField: "STATUS",
          width: 100,
          caption: this.$t("status"),
          lookup: {
            dataSource: this.statusList,
            displayExpr: "NAME",
            valueExpr: "CODE",
          },
          editable: true,
          alignment: "left",
          type: "text",
        },
        { dataField: "TCO_BUSPLACE_PK", width: 100, caption: this.$t("tco_busplace_pk"), alignment: "left", type: "text", visible: false },
        { dataField: "REMARKS", width: 100, caption: this.$t("remarks"), editable: true, alignment: "left", type: "text" },
        { dataField: "USE_YN", width: 100, caption: this.$t("use_yn"), editable: true, alignment: "center", type: "checkbox" },
      ];
    },

    // grdTemplate() {
    //   return [
    //     {
    //       dataField: "PK",
    //       width: 0,
    //       caption: this.$t("pk"),
    //       alignment: "left",
    //       type: "text",
    //       visible: false,
    //     },
    //     {
    //       dataField: "TEMPLATE_CD",
    //       width: 200,
    //       caption: this.$t("template_id"),
    //       alignment: "center",
    //       type: "text",
    //       editable: true,
    //       lookup: {
    //         dataSource: this.templateIdList,
    //         displayExpr: "NAME",
    //         valueExpr: "CODE",
    //       },
    //     },
    //     {
    //       dataField: "TEMPLATE_NM",
    //       width: 100,
    //       caption: this.$t("template_nm"),
    //       alignment: "left",
    //       type: "text",
    //       editable: true,
    //     },
    //     {
    //       dataField: "TEMPLATE_LNM",
    //       width: 100,
    //       caption: this.$t("template_lnm"),
    //       alignment: "left",
    //       type: "text",
    //       hidden: true,
    //     },
    //     {
    //       dataField: "TEMPLATE_FNM",
    //       width: 100,
    //       caption: this.$t("template_fnm"),
    //       alignment: "left",
    //       type: "text",
    //       hidden: true,
    //     },
    //     {
    //       dataField: "FORM_NO",
    //       width: 100,
    //       caption: this.$t("form_no"),
    //       alignment: "left",
    //       type: "text",
    //       lookup: {
    //         dataSource: this.Form_noList,
    //         displayExpr: "NAME",
    //         valueExpr: "CODE",
    //       },
    //       editable: true,
    //     },
    //     {
    //       dataField: "USE_YN",
    //       width: 100,
    //       caption: this.$t("use_yn"),
    //       alignment: "center",
    //       type: "checkbox",
    //       editable: true,
    //     },
    //     {
    //       dataField: "TCO_COMPANY_PK",
    //       width: 0,
    //       caption: this.$t("tco_company_pk"),
    //       alignment: "left",
    //       type: "text",
    //       editable: true,
    //       visible: false,
    //     },
    //     // {
    //     //   dataField: "URL_FILE_EXCEL",
    //     //   width: 500,
    //     //   caption: this.$t("url_file_excel"),
    //     //   alignment: "left",
    //     //   type: "text",
    //     //   editable: true,
    //     // },
    //     {
    //       dataField: "URL_IMG_LOGO",
    //       width: 400,
    //       caption: this.$t("url_img_logo"),
    //       alignment: "left",
    //       type: "text",
    //       editable: true,
    //     },
    //     {
    //       dataField: "LOGO_START_ROW",
    //       width: 100,
    //       caption: this.$t("logo_start_row"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "LOGO_START_COL",
    //       width: 100,
    //       caption: this.$t("logo_start_col"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "LOGO_WIDTH",
    //       width: 100,
    //       caption: this.$t("logo_width"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "LOGO_HEIGHT",
    //       width: 100,
    //       caption: this.$t("logo_height"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "URL_IMG_BG",
    //       width: 400,
    //       caption: this.$t("url_img_bg"),
    //       alignment: "left",
    //       type: "text",
    //       editable: true,
    //     },
    //     {
    //       dataField: "BG_START_ROW",
    //       width: 100,
    //       caption: this.$t("bg_start_row"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "BG_START_COL",
    //       width: 100,
    //       caption: this.$t("bg_start_col"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },

    //     {
    //       dataField: "BG_WIDTH",
    //       width: 100,
    //       caption: this.$t("bg_width"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //     {
    //       dataField: "BG_HEIGHT",
    //       width: 100,
    //       caption: this.$t("bg_height"),
    //       alignment: "left",
    //       type: "number",
    //       formatFloat: 1,
    //       editable: true,
    //     },
    //   ];
    // },
  },
  /*############### mounted #######################*/
  mounted() {},
  /*############### methods #######################*/
  methods: {
    renderImg(imgUrl, isBase64 = false) {
      if (isBase64) {
        return imgUrl;
      } else {
        return require("@/" + imgUrl);
      }
    },
    async onUploadImgFolder(file, folder, _type) {
      let _path = "";
      try {
        if (file == "" || file == "undefined") {
          return (_path = "");
        }
        let _folderPath = this.cboTemplate.filter((x) => x.CODE == _type);
        if (!_folderPath[0].VAL1) {
          return (_path = "");
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", _folderPath[0].VAL1 + folder);
        await this.$axios({ method: "post", url: "/dso/putfiletofolder", data: formData }).then(async (res) => {
          if (res.data.data) {
            _path = res.data.data;
          }
        });
      } catch (e) {
        console.log(e);
        _path = "";
      }
      return _path;
    },
    async selectedFileLOGO(event) {
      // console.log("selectedFileLOGO", event);
      await this.$nextTick();
      this.fileSaveLOGO = null;
      const files = event.target.files;
      if (files[0] !== undefined) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          console.log("fr.result", fr.result);
          this.imageLOGO = this.renderImg(fr.result, true);
          this.fileSaveLOGO = files[0];
        });
      }
    },
    async selectedFileBG(event) {
      await this.$nextTick();
      this.fileSaveBG = null;
      const files = event.target.files;
      if (files[0] !== undefined) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageBG = this.renderImg(fr.result, true);
          this.fileSaveBG = files[0];
        });
      }
    },
    selectImageBG() {
      this.$refs.fileBG.click();
    },
    selectImageLOGO() {
      this.$refs.fileLOGO.click();
    },
    async cellClickCell(cell) {
      // console.log("file: 6095055.vue:916 [vng-304] cellClickCell [vng-304] cell:", cell);
      this.item_pk = cell.data.PK;
      this.dataIssued = cell.data;

      if (cell.data._rowstatus == "i") {
        // this.MasterInfo.TEMPLATE_CD = "1";
        // this.MasterInfo.SERIAL_NO = cell.data.SERIAL_NO;
        // this.MasterInfo.FORM_NO = cell.data.FORM_NO;
        // this.MasterInfo.FROM_NO = cell.data.FROM_NO;
        this.MasterInfo.USE_YN = cell.data.USE_YN;
      } else {
        this.MasterInfo.PK = cell.data.TEI_TEMPLATE_PK;
        await this.dsoMaster("select");
        if (this.MasterInfo.URL_IMG_LOGO == "" || this.MasterInfo.URL_IMG_BG == "") {
          /////VIew PDF
          this.showLoading = true;
          try {
            const rec = await this.$axios.$get("/dso/makereport", {
              responseType: "blob",
              params: {
                template: this.url_template,
                excel: JSON.stringify([
                  {
                    sheet: 1,
                    // insertRange: [{
                    //   range: "A1:E22", proc: "SP_RPT_SH10070_TAB2_M_NOCACHE", params: [this.modelMaster.PK, this.user.USER_NAME]
                    // }],
                  },
                ]),
                convert: "pdf",
              },
            });
            this.showLoading = true;
            this.urlPDF = window.URL.createObjectURL(rec);
            this.showLoading = false;
            let rtnBase64pdf = await this._blobFileToBase64(rec);
          } catch (e) {
            this.showNotification("danger", this.$t("fail_to_view_pdf"), "", 4000);
          }
        } else {
          ///////////////////////////////////////////////
          this.showLoading = true;
          if (this.itemTemplatesPK != "") {
            let res_url = await this.$axios.$post("/einvoice/general-url-pdf-template", {
              responseType: "json",
              data: this.itemTemplatesPK,
            });
            if (res_url.success) {
              this.urlPDF = res_url.data;
              this.showLoading = false;
            }
          } else {
            this.showNotification("warning", this.$t("no_row_selected"), "");
          }
        }
      }
    },
    async onClickButton(pos) {
      switch (pos) {
        case "VIEW":
          this.onPreview();
          break;
        case "NEW_M":
          this.onNew();
          break;
        case "DELETE_M":
          this.onDelete();
          break;
        case "SAVE_M":
          this.onSave();
          this.dsoMaster("update");
          break;
        case "SEARCH_M":
          this.onSearch();
          break;
        case "SAVE_S":
          this.dsoMaster("update");
          setTimeout(async () => {
            this.showLoading = true;
            let res_url = await this.$axios.$post("/einvoice/general-url-pdf-template", {
              responseType: "json",
              data: this.itemTemplatesPK,
            });
            if (res_url.success) {
              this.urlPDF = res_url.data;
              this.showLoading = false;
            }
          }, 2000);          
          break;
        case "NEW_S":
          this.onNew_T();
          break;
        case "DELETE_T":
          this.onDelete_T();
          break;
        case "NEW_PM":
          this.onNew_PM();
          break;
        case "SAVE_PM":
          this.onSave_PM();
          break;
        case "DELETE_PM":
          this.onDelete_PM();
          break;
        case "NEW_PD":
          this.onNew_PD();
          break;
        case "SAVE_PD":
          this.onSave_PD();
          break;
        case "DELETE_PD":
          this.onDelete_PD();
          break;
      }
    },
    async dsoMaster(action) {
      /// Luu duong dan hinh anh
      let pathLOGOImg = "";
      if (this.fileSaveLOGO) {
        let urlImg = await this.onUploadImgFolder(this.fileSaveLOGO, this.folder, "LOGO");
        pathLOGOImg = urlImg;
        this.fileSaveLOGO = null;
      }
      this.MasterInfo.URL_IMG_LOGO = pathLOGOImg == "" ? this.MasterInfo.URL_IMG_LOGO : pathLOGOImg;
      ////////////////////////////
      let pathBGImg = "";
      if (this.fileSaveBG) {
        let urlBG = await this.onUploadImgFolder(this.fileSaveBG, this.folder, "BG");
        pathBGImg = urlBG;
        this.fileSaveBG = null;
      }
      this.MasterInfo.URL_IMG_BG = pathBGImg == "" ? this.MasterInfo.URL_IMG_BG : pathBGImg;
      this.MasterInfo._rowstatus = this.MasterInfo._rowstatus == "i" ? "i" : action == "update" ? "u" : "d";
      /////////////////////////
      let dsoControl = {
        type: "control",
        selpro: "EI_SEL_6095055_3_NC",
        updpro: "EI_UPD_6095055_4",
        para: [this.MasterInfo.PK],
        elname: [
          "_rowstatus",
          "PK",
          "TEMPLATE_CD",
          "TEMPLATE_NM",
          "TEMPLATE_LNM",
          "TEMPLATE_FNM",
          "FORM_NO",
          "USE_YN",
          "TEI_COMPANY_PK",
          "VALID_DATE_FROM",
          "VALID_DATE_TO",
          "REPORT_ID",
          "ADDR1",
          "ADDR2",
          "BANK_ACCOUNT1",
          "BANK_ACCOUNT2",
          "BANK_NM1",
          "BANK_NM2",
          "TEL",
          "FAX",
          "TAX_CODE",
          "TEI_EINVOICE_ISSUSE_PK",
          "WEBSITE",
          "TAX_CODE_DISPLAY",
          "PBAN",
          "SERIAL_NO_2",
          "URL_FILE_EXCEL",
          "URL_IMG_LOGO",
          "LOGO_START_ROW",
          "LOGO_START_COL",
          "LOGO_WIDTH",
          "LOGO_HEIGHT",
          "URL_IMG_BG",
          "BG_START_ROW",
          "BG_START_COL",
          "BG_WIDTH",
          "BG_HEIGHT",
          "SIGN_START_CELL",
          "SIGN_END_CELL",
          "SIGN_BY_START_CELL",
          "SIGN_BY_END_CELL",
          "DETAILS_START_ROW",
          "SIGN_CELL_BOX",
          "FROM_NO",
          "ATT01",
          "ATT02",
          "ATT03",
          "ATT04",
          "ATT05",
          "ATT06",
          "ATT07",
          "ATT08",
          "ATT09",
          "ATT10",
          "ATT01_NUM",
          "ATT02_NUM",
          "ATT03_NUM",
          "ATT04_NUM",
          "ATT05_NUM",
          "ATT06_NUM",
          "ATT07_NUM",
          "ATT08_NUM",
          "ATT09_NUM",
          "ATT10_NUM",
          "RANGE_DETAILS_SIGN",
        ],
        data: this.MasterInfo,
      };
      await this._dsoCall(dsoControl, action, true).then((res) => {
        if (res) {
          switch (action) {
            case "select":
              this.MasterInfo = { ...res };
              console.log("file: 6095055.vue:1100 [vng-304] awaitthis._dsoCall [vng-304] res:", res);
              this.MasterInfo._rowstatus = "u";
              ///  Load ra được hình ảnh////
              try {
                if (this.MasterInfo.URL_IMG_LOGO == "" || this.MasterInfo.URL_IMG_LOGO == null) {
                  this.imageLOGO = this.renderImg("assets/images/no_image.png");
                } else {
                  let imgLOGO = this.renderImg(this.MasterInfo.URL_IMG_LOGO);
                  this.imageLOGO = imgLOGO;
                }
                ///////
                if (this.MasterInfo.URL_IMG_BG == "" || this.MasterInfo.URL_IMG_BG == null) {
                  this.imageBG = this.renderImg("assets/images/no_image.png");
                } else {
                  // let imgBG = require(`@/${this.MasterInfo?.URL_IMG_BG}.png`);
                  let imgBG = this.renderImg(this.MasterInfo.URL_IMG_BG);
                  this.imageBG = imgBG;
                }
              } catch (e) {
                this.showNotification("danger", this.$t("fail_to_url", "Error"), e.message);
              }
              ////   Bộ data để view pdf
              this.dataTemp = {
                pk: res.PK,
                url: res.URL_FILE_EXCEL,
                logo_url: res.URL_IMG_LOGO,
                logo_start_col: res.LOGO_START_COL,
                logo_start_row: res.LOGO_START_ROW,
                logo_width: res.LOGO_WIDTH,
                logo_height: res.LOGO_HEIGHT,
                bg_url: res.URL_IMG_BG,
                bg_start_row: res.BG_START_ROW,
                bg_start_col: res.BG_START_COL,
                bg_width: res.BG_WIDTH,
                bg_height: res.BG_HEIGHT,
              };
              this.itemTemplatesPK = res.PK;
              this.url_template = res.URL_FILE_EXCEL;
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
                  this.onClick("NEW_T");
                  break;
              }
              break;
          }
        }
      });
    },
    async onSearch() {
      this.$refs.grdEinvoiceIssue.loadData();
    },
    onDelete() {
      this.$refs.grdEinvoiceIssue.onSetMarkedDelete(true);
    },

    async onSave() {
      let data = this.$refs.grdEinvoiceIssue.getData();
      for (let i = 0; i < data.length; i++) {
        if (!data[i].INVOICE_KIND) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_invoice_kind_at_" + (i + 1)));
          return;
        } else if (!data[i].SERIAL_NO_2) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_invoice_symbol_at_" + (i + 1)));
          return;
        } else if (!data[i].FORM_NO) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_form_no_at_" + (i + 1)));
          return;
        } else if (!data[i].SERIAL_NO) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_serial_no_at_" + (i + 1)));
          return;
        } else if (!data[i].FROM_NO) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_start_invoice_no_at_" + (i + 1)));
          return;
        } else if (!data[i].FROM_DT) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_form_date_at_" + (i + 1)));
          return;
        } else if (!data[i].TO_DT) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_to_date_at_" + (i + 1)));
          return;
        } else if (!data[i].STATUS) {
          this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_status_at_" + (i + 1)));
          return;
        }
      }
      this.$refs.grdEinvoiceIssue.saveData();
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "SYS_SEL_LIST_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(dso_company_list, "select", false);
          this.selected_company = this.company_list[0].PK;
          this.selectedCompanyFrom = this.selected_company;
          break;

        case "form_no":
          const dso_from_no = {
            type: "list",
            selpro: "EI_FORM_NO_EI_V2",
            para: [this.selectedCompanyFrom],
          };
          this.fromNoList = await this._dsoCall(dso_from_no, "select", false);
          this.lstFrom_No_From = this.fromNoList.length > 0 ? this.fromNoList[0].CODE : "";
          break;
        case "serial_no":
          const dso_serial_no = {
            type: "list",
            selpro: "EI_SERIAL_NO_EI_V2",
            para: [this.selectedCompanyFrom],
          };
          this.serialNoList = await this._dsoCall(dso_serial_no, "select", false);
          this.lstSerial_No_From = this.serialNoList.length > 0 ? this.serialNoList[0].CODE : "";

          break;

        case "status":
          const dso_status_list = { type: "list", selpro: "EI_GET_STATUS_CREATE_EI_NC", para: [this.selected_company] };
          this.statusList = await this._dsoCall(dso_status_list, "select", false);
          this.lstStatus = "2";

          const dso1 = {
            type: "list",
            updpro: "EI_SEL_EINVOICE_TYPE",
            para: [
              this.selected_company,
              //   this.lstBizplace, //this.lstBizPlace,
              "Y",
              "Y",
            ],
          };

          const parentCodes = [
            "ACEIS020", //0
            "ACEIS030", //1
            "ACEI0390", //2
            "ACJS0400", //3
            "ACJS0410", //4
            "ACEI0220", //5
            "ACJS0430", //6
            "ACJS0470", //7
            "ACJS0480", //8
            "ACJS0490", //9
            "ACEIS330", //10
            "ACEIS340",
          ];
          const results = await this._getCommonCode2(parentCodes, this.selected_company);
          if (results.length) {
            this.typeInvoiceList = results[0];
            this.invoiceKind = results[1];
            this.typeTableList = results[2];
            this.typeTemplateList = results[3];
            this.typeList = results[4];
            this.versionList = results[5];
            this.paramList = results[6];
            this.styleList = results[7];
            this.paramDList = results[8];
            this.cboTemplate = results[9];
            this.Form_noList = results[10];
            this.templateIdList = results[11];
            this.templateID_list = results[11]; ///
            this.formNoList = results[10];
          }
          break;
      }
    },

    onNew() {
      const date = new Date();
      let year = date.getFullYear().toString().substring(2, 4);
      this.$refs.grdEinvoiceIssue.addRowStruct({
        PK: "",
        TCO_COMPANY_PK: this.selected_company,
        INVOICE_KIND: "C",
        SERIAL_NO_2: "T",
        FORM_NO: "1",
        FROM_NO: "1",
        SERIAL_NO: "C" + year + "T",
        FROM_DT: this.fromDate,
        TO_DT: this.toDate,
        STATUS: "2",
        TCO_BUSPLACE_PK: this.lstBizplace,
        REMARKS: "",
        USE_YN: "Y",
        TEI_TEMPLATE_PK: this.MasterInfo.PK,
        TEMPLATE_CD: this.MasterInfo.TEMPLATE_CD,
      });
    },

    onNew_T() {
      this.MasterInfo._rowstatus = "i";
      this.MasterInfo.PK = "";
      this.MasterInfo.TEI_TEMPLATE_PK = "";
      this.MasterInfo.TEMPLATE_CD = "111";
      this.MasterInfo.SERIAL_NO = "";
      this.MasterInfo.FORM_NO = "";
      this.MasterInfo.FROM_NO = "";
      this.MasterInfo.URL_IMG_LOGO = "";
      this.MasterInfo.LOGO_START_ROW = "";
      this.MasterInfo.LOGO_START_COL = "";
      this.MasterInfo.LOGO_WIDTH = "";
      this.MasterInfo.LOGO_HEIGHT = "";
      this.MasterInfo.URL_IMG_BG = "";
      this.MasterInfo.USE_YN = "Y";
      this.MasterInfo.BG_START_ROW = "";
      this.MasterInfo.BG_START_COL = "";
      this.MasterInfo.BG_WIDTH = "";
      this.MasterInfo.BG_HEIGHT = "";
      this.MasterInfo.SIGN_START_CELL = "";
      this.MasterInfo.SIGN_END_CELL = "";
      this.MasterInfo.SIGN_BY_START_CELL = "";
      this.MasterInfo.SIGN_BY_END_CELL = "";
      this.MasterInfo.SIGN_CELL_BOX = "";
      this.MasterInfo.DETAILS_START_ROW = "";
      this.MasterInfo.SIGN_RANGE_DETAILS = "";
    },
    async onPreview() {
      // if (!this.itemTemplatePK) {
      //   return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
      // }
      // try {
      //   this.pdfUrl = await this.pdfUrlGetter(this.itemTemplatePK);
      //   console.log("=====> pdfUrlv", this.pdfUrl);
      //   this.$nextTick(() => {
      //     this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      //   });
      // } catch (e) {
      //   return this.showNotification("danger", e.message);
      // }
      // this.showLoading = true;
      // if (this.itemTemplatesPK != "") {
      //   let res_url = await this.$axios.$post("/einvoice/general-url-pdf-template", {
      //     responseType: "json",
      //     data: this.itemTemplatesPK,
      //   });
      //   if (res_url.success) {
      //     this.urlPDF = res_url.data;
      //     this.showLoading = false;
      //     // this.$nextTick(() => {
      //     //   this.isProcessing = false;
      //     //  // this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
      //     // });
      //   }
      // } else {
      //   this.showNotification("warning", this.$t("no_row_selected"), "");
      // }
    },

    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getEinvoiceERP_V2(this, pk);
      return pdfUrlExcel;
    },
    async onChangeCompanyFrom() {
      //this.selectedCompanyFrom = this.selected_company;
      this.fromNoList = [];
      this.serialNoList = [];
    },

    async onChangeCompanyFromM() {
      //this.selectedCompanyFrom = this.selected_company;
      this.fromNoList = [];
      this.serialNoList = [];
    },
    async getImpFile() {
      // console.log("this.url_template  ", this.url_template);
      // if (!this.url_template.length) {
      //   return this.showNotification("warning", this.$t("error_occurs"), "pls_select_template");
      // }
      // const res = await this.$axios.$get("/dso/downloadtemp", {
      //   responseType: "blob",
      //   params: {
      //     template: this.url_template,
      //   },
      // });
      // if (res && res.size > 0) {
      //   try {
      //     let blob = new Blob([res], {
      //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //     });
      //     // let _gettime = new Date().getTime();
      //     const filenameSplit = this.url_template.split("/");
      //     let filename = this.filterItems(filenameSplit, ".xlsx")[0].split(".")[0] + ".xlsx";
      //     // filename =     this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0] + '.xlsx';
      //     this._ExcelSaveAs(blob, filename);
      //   } catch (e) {
      //     let blob = new Blob([res], {
      //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //     });
      //     const filenameSplit = this.url_template.split("/");
      //     let filename = this.filterItems(filenameSplit, ".xls")[0].split(".")[0] + ".xls";
      //     this._ExcelSaveAs(blob, filename);
      //   }
      // } else {
      //   this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
      // }
    },
    async viewImage() {
      let dimensions = await this.getImageDimensions(this.imageLOGO);
      let maxWidth = window.screen.width * 0.8;
      let maxHeight = window.screen.height * 0.8;

      this.orientation = dimensions.w > dimensions.h ? "landscape" : "portrait";
      this.originWidth = dimensions.w;
      this.originHeight = dimensions.h;

      if (this.orientation == "landscape") {
        if (dimensions.w > maxWidth) {
          let ratio = (maxWidth / dimensions.w).toFixed(2);
          this.originWidth = maxWidth;
          this.originHeight = Math.round(dimensions.h * ratio);
        }
      } else {
        if (dimensions.h > maxHeight) {
          let ratio = (maxHeight / dimensions.h).toFixed(2);
          this.originHeight = maxHeight;
          this.originWidth = Math.round(dimensions.w * ratio);
        }
      }
      await this.wait(50);
      this.img_dialog = true;
    },
    async viewImageBG() {
      let dimensions = await this.getImageDimensions(this.imageBG);
      let maxWidth = window.screen.width * 0.8;
      let maxHeight = window.screen.height * 0.8;

      this.orientation = dimensions.w > dimensions.h ? "landscape" : "portrait";
      this.originWidth = dimensions.w;
      this.originHeight = dimensions.h;

      if (this.orientation == "landscape") {
        if (dimensions.w > maxWidth) {
          let ratio = (maxWidth / dimensions.w).toFixed(2);
          this.originWidth = maxWidth;
          this.originHeight = Math.round(dimensions.h * ratio);
        }
      } else {
        if (dimensions.h > maxHeight) {
          let ratio = (maxHeight / dimensions.h).toFixed(2);
          this.originHeight = maxHeight;
          this.originWidth = Math.round(dimensions.w * ratio);
        }
      }
      await this.wait(50);
      this.img_dialogbg = true;
    },
    getImageDimensions(file) {
      return new Promise(function (resolved, rejected) {
        var i = new Image();
        i.onload = function () {
          resolved({ w: i.width, h: i.height });
        };
        i.src = file;
      });
    },

    async onProcessConfirm(action) {
      this.actionProcess = action;
      //this.actionDialog = true;

      let promise = Swal.fire({
        icon: "question",
        caption: this.$t(`do_you_want_to_${action.toLowerCase()}`),
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t("no"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.onCopy();
        }
      });

      await promise;
    },
    async onCopy() {
      // if (this.selectedCompanyTo === this.selectedCompanyFrom) {
      //     return this.showNotification("danger", this.$t("copy_failed"), this.$t("cannot_select_same_company"))
      // }
      if (!this.selectedCompanyTo) {
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_select_from_company"));
      }
      if (!this.txtForm_No_To) {
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_form_no_to"));
      }
      if (!this.txtSerial_No_To) {
        return this.showNotification("danger", this.$t("copy_failed"), this.$t("must_input_serial_no_to"));
      }
      const dso = {
        type: "process",
        updpro: "EI_PRO_6060230_COPY",
        para: [
          this.selectedCompanyFrom,
          this.selectedCompanyTo,
          //   this.lstBizplaceFrom,
          //   this.lstBizplaceTo,
          this.lstFrom_No_From,
          this.txtForm_No_To,
          this.lstSerial_No_From,
          this.txtSerial_No_To,
          this.overWriteYN,
        ],
      };

      const result = await this._dsoCall(dso, "process", true);
      if (result) {
        const rtn = result[0].RTN;
        this.copyToDialog = false;
        //this.copyResult =  this.$t( rtn);
      }
      this.onSearch();
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->

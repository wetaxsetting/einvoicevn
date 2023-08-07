<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="3" :class="isShowLeft ? null : 'd-none'" class="pt-3">
        <v-card>
          <v-row dense>
            <v-col md="9" class="pl-3 pr-3 pt-2">
              <BaseSelect outlined item-value="CODE" item-text="NAME" :label="$t('company_name')"
                :lstData="dataSearchList.companyList" v-model="modelSearch.COMPANY_PK" />
            </v-col>
            <v-col md="3" class="d-flex justify-end pr-2 pt-2">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onClick('search')" />
            </v-col>
            <v-col md="6" class="pl-3">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="modelSearch.FROM_DATE" />
            </v-col>
            <v-col md="6" class="pr-3">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="modelSearch.TO_DATE" />
            </v-col>
            <v-col md="6" class="pl-3">
              <BaseSelect outlined :label="$t('status')" :lstData="dataSearchList.statusList" v-model="modelSearch.STATUS"
                item-value="CODE" item-text="NAME" />
            </v-col>
            <v-col md="6" class="pr-3">
              <BaseInput outlined :label="$t('voucher_no')" v-model="modelSearch.VOUCHER" number />
            </v-col>

            <v-col md="6" class="pl-3">
              <BaseInput outlined :label="$t('symbols')" v-model="modelSearch.SYMBOLS" number />
            </v-col>
            <v-col md="6" class="pr-3">
              <BaseInput outlined :label="$t('invoice_no')" v-model="modelSearch.INVOICE" number />
            </v-col>
            <v-col md="12">
              <BaseGridView ref="grdSearch" :header="headerList.grdSearch" sel_procedure="AC_SEL_6095280_S_04"
                selectionmode="singlerow" :multiselect="true" :height="limitHeight" :headertype="1" :filter_paras="[
                  this.modelSearch.COMPANY_PK,
                  this.modelSearch.FROM_DATE,
                  this.modelSearch.TO_DATE,
                  this.modelSearch.STATUS,
                  this.modelSearch.VOUCHER_NO,
                  this.modelSearch.SYMBOLS,
                  this.modelSearch.INVOICE
                ]" @cellClick="onClick('grdSearchClick')" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!--right panel-->
      <v-col :md="isShowLeft ? 9 : 12">
        <v-row class="pt-1" dense>
          <v-col md="12">
            <v-card>
              <v-row dense class="pt-1">
                <v-col md="1" class="d-flex">
                  <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'"
                    :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')" @onclick="isShowLeft = !isShowLeft" />
                </v-col>
                <v-col md="4">
                  <b style=" color: red ">{{ modelMaster.TMESS_CQT }}</b>
                </v-col>
                <v-col md="7" class="pr-3">
                  <GwFlexBox justify="end">
                    <BaseButton icon_type="xml" :btn_text="$t('view_xml')" @onclick="onClick('viewXML')" />
                    <BaseButton icon_type="xml" :btn_text="$t('view_dec')" @onclick="onClick('viewDEC')" />

                    <BaseButton icon_type="eye_on" :btn_text="$t('checking_result_CQT')" @onclick="onClick('CHECKCQT')" />
                    <BaseButton icon_type="pensign" :btn_text="$t('sign')" @onclick="onClick()"
                      :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Add -->
                    <BaseButton btn_type="icon" icon_type="add_new" :btn_text="$t('btn_add')"
                      @onclick="onClick('newMaster')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Save -->
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClick('saveMaster')"
                      :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Delete -->
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                      @onclick="onClick('deleteMaster')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <BaseButton icon_type="print" btn_type="icon" @onclick="onClick('btnPrint')"
                      :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                  </GwFlexBox>
                </v-col>
              </v-row>
              <!--  -->
              <v-row dense class="pl-3 pr-3 pt-3">
                <v-col md="2">
                  <BaseSelect outlined :label="$t('version')" :lstData="dataMasterList.versionList"
                    v-model="modelMaster.PBAN" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="2"></v-col>
                <!-- <v-col md="1"></v-col> -->
                <v-col md="4">
                  <BaseInput outlined :label="$t('represent')" v-model="modelMaster.SELLER_REPRESENT" />
                </v-col>
                <v-col md="4">
                  <BaseInput outlined :label="$t('position')" v-model="modelMaster.SELLER_POSITION" />
                </v-col>
              </v-row>
              <v-row dense class="pl-3 pr-3">
                <v-col md="4">
                  <BaseSelect outlined item-value="CODE" item-text="NAME" :label="$t('taxpayer_name')"
                    :lstData="dataMasterList.companyList" v-model="modelMaster.TEI_COMPANY_PK" readonly />
                </v-col>
                <v-col md="4">
                  <BaseSelect outlined :label="$t('tax_office')" v-model="modelMaster.MCQT"
                    :lstData="dataMasterList.taxOfficeList" item-text="NAME" item-value="CODE" mandatory />
                </v-col>
                <v-col md="4">
                  <BaseSelect outlined :label="$t('form_no')" v-model="modelMaster.MSO"
                    :lstData="dataMasterList.fromNoList" item-text="NAME" item-value="CODE" mandatory />
                </v-col>
              </v-row>
              <v-row dense class="pl-3 pr-3">
                <!--  -->
                <v-col md="4">
                  <BaseInput outlined :label="$t('tax_code')" v-model="modelMaster.MST" />
                </v-col>
                <v-col md="4">
                  <BaseInput outlined :label="$t('address')" v-model="modelMaster.DDANH" />
                </v-col>
                <v-col md="4">
                  <BaseSelect outlined :label="$t('declaration_name')" v-model="modelMaster.LTEN"
                    :lstData="dataMasterList.declarationNameList" item-text="NAME" item-value="CODE" mandatory />
                </v-col>
                <v-col md="1"></v-col>
              </v-row>
              <!--  -->
              <v-row dense class="pl-3 pr-3">
                <v-col md="4">
                  <BaseSelect outlined :label="$t('categories')" v-model="modelMaster.LOAI"
                    :lstData="dataMasterList.categoriesList" item-text="NAME" item-value="CODE" mandatory />
                </v-col>
                <v-col md="4">
                  <BaseInput outlined :label="$t('minutes_no')" v-model="modelMaster.VOUCHER_NO" readonly></BaseInput>
                </v-col>
                <v-col md="2">
                  <BaseDatePicker outlined today :label="$t('register_day')" start v-model="modelMaster.NTBAO" />
                </v-col>
                <v-col md="2"></v-col>
              </v-row>
            </v-card>
            <v-card>
              <v-row class="pt-3" dense>
                <v-col md="7" class="d-flex pl-2">
                  <BaseButton icon_type="eye_on" :btn_text="$t('preview_E-invoice')"
                    @onclick="onClick('previewEinvoice')" />
                  <BaseButton icon_type="eye_on" :btn_text="$t('preview_bb')" @onclick="onClick('previewBB')" />
                  <BaseButton icon_type="eye_on" :btn_text="$t('preview_bb_replace')"
                    @onclick="onClick('previewBB_Replace')" />
                  <BaseButton icon_type="email" :btn_text="$t('send_mail')" @onclick="onClick('sendMail')" />
                </v-col>
                <v-col md="3" class="pr-2">
                  <BaseSelect outlined v-model="selectedTable" :lstData="tables" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="2" class="pr-2">
                  <GwFlexBox justify="end">
                    <!-- Add -->
                    <BaseButton btn_type="icon" icon_type="add_new" :btn_text="$t('btn_add')"
                      @onclick="onClick('newDetail')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Save -->
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClick('saveDetail')"
                      :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Delete -->
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')"
                      @onclick="onClick('deleteDetail')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                  </GwFlexBox>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col md="12">
                  <BaseGridView ref="grdDetail" :header="headerList.grdDetail" sel_procedure="AC_SEL_6095280_6"
                    upd_procedure="AC_UP_6095280_7" :multiselect="true" :headertype="1" selectionmode="singlerow"
                    :filter_paras="[this.modelMaster.PK]" :height="limitHeightGridDetails" :update_paras="[
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
                      'CUSTOMER_NM',
                       'BUYER_POSITION',
                       'BUYER_REPRESENT',
                    ]" />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dlg_View" max-width="1000">
      <v-card outlined tile v-resize="onResize">
        <v-card-title class="headline primary-gradient white--text py-2">{{ $t("popup_get_parter") }}
          <v-spacer></v-spacer>
          <v-icon dark @click="dlg_View = false">mdi-close-thick</v-icon>
        </v-card-title>
        <v-container fluid class="pt-0">
          <v-row>
            <v-col md="4">
              <BaseSelect :disabled="true" :label="$t('company')" item-value="CODE" item-text="NAME"
                :lstData="dataMasterList.companyList" v-model="modelSearch.COMPANY_PK" />
            </v-col>
            <v-col md="3">
              <BaseDatePicker :pretoday="7" :label="$t('form_date')" v-model="form_date" default />
            </v-col>
            <v-col md="3">
              <BaseDatePicker :label="$t('form_to')" v-model="form_to" default />
            </v-col>
            <v-col md="1"></v-col>
            <v-col md="1" class="d-flex justify-end">
              <BaseButton btn_type="icon" icon_type="search" @onclick="onClickPopup()" />
              <BaseButton btn_type="icon" icon_type="select" :btn_text="$t('select')" @onclick="onSelect()" />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">
              <BaseSelect :label="$t('form_no')" v-model="form_no_pop" :lstData="list_form_no_pop" item-text="NAME"
                item-value="VAL" />
            </v-col>
            <v-col md="3">
              <BaseSelect :label="$t('serial_no')" item-value="CODE" item-text="NAME" :lstData="serial_no_list"
                v-model="selected_serial_no"  />
            </v-col>
            <v-col md="3">
              <BaseInput :label="$t('invoice_no')" v-model="invoice_no_pop" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <BaseGridView ref="popupGrid" :autoresize="false" :header="headerList.grdPopup" :setting="true"
                :multiselect="true" :selectionmode="'checkbox'" :headertype="1" :height="limitHeightGridDetails"
                sel_procedure="AC_SEL_6095280_DATA_POPUP" :filter_paras="[
                  this.modelSearch.COMPANY_PK,
                  this.form_no_pop,
                  this.selected_serial_no,
                  this.invoice_no_pop,
                  this.form_date,
                  this.form_to,
                ]" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
export default {
  layout: "default",
  middleware: "user",
  components: {

  },
  data: () => ({
    isShowLeft: true,
    headerList: {
      grdSearch: [],
      grdDetail: [],
      grdPopup: [],
    },
    dataSearchList: {
      statusList: [],
      companyList: [],
    },
    modelSearch: {
      COMPANY_PK: null,
      FROM_DATE: null,
      TO_DATE: null,
      STATUS: null,
      VOUCHER: null,
      SYMBOLS: null,
      INVOICE: null,
    },
    dataMasterList: {
      versionList: [],
      companyList: [],
      companyInfoList: [],
      taxOfficeList: [],
      fromNoList: [],
      declarationNameList: [],
      categoriesList: [],
    },
    modelMaster: {
      PK: null,
      TEI_COMPANY_PK: null,
      TNNT: null,
      MCQT: null,
      TCQT: null,
      MSO: null,
      MST: null,
      DDANH: null,
      LOAI: null,
      TEN: null,
      LTEN: null,
      NTBAO: null,
      TMESS_CQT: null,
      VOUCHER_NO: null,
      PBAN: '2.0.0',
      SELLER_POSITION: null,
      SELLER_REPRESENT: null,
    },
    e_invoice_type_list: [],
    type_invoice_list: [],

    /////////////// DIALOG //////////////////
    dlg_View: false,
    lstCompanyMaster: [],
    list_form_no_pop: [],
    serial_no_list: [],


    selectedTable: null,
    company: null,
    form_date: null,
    form_to: null,
    form_no_pop: null,
    selected_serial_no: null,
    invoice_no_pop: null,
    tables: [
      {
        NAME: 'Get Data Form E-invoice',
        CODE: 'G',
      },
      {
        NAME: 'Enter Direct',
        CODE: 'E',
      },
    ]
  }),

  mounted() {
    this.onResize();
  },
  async created() {
    await this.initDataList();
    await this.initModel();
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    await this.getListCodes("e-invoice_type");
    
    await this.initHeaderList();
   
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 339;
    },
    limitHeightGridDetails() {
      return this.windowHeight - 450;
    },
    // grdHeader(){
    //   return await this.initHeaderList();
    // }
  },
  watch: {
    "modelMaster.LTEN"(val) {
      if (val) {
        // console.log("val  ++===>",val);
        // console.log("this.dataMasterList.declarationNameList ++===>", this.dataMasterList.declarationNameList);
        this.dataMasterList.declarationNameList.forEach(item => {
          if (item.CODE == val) {
            this.modelMaster.TEN = item.NAME;
          }
          // console.log("this.modelMaster.TEN +++===> ", this.modelMaster.TEN);
        });
      }
    },
    "modelSearch.COMPANY_PK"(val) {
      if (val) {
        console.log("this.dataMasterList.companyList +++==> ", this.dataMasterList.companyInfoList);
        this.modelMaster.TEI_COMPANY_PK = val;
        this.dataMasterList.companyInfoList.forEach(item => {
          if (item.TEI_COMPANY_PK == val) {
            this.modelMaster.TNNT = item.NAME;
            this.modelMaster.MST = item.TAX_CODE;
            this.modelMaster.DDANH = item.DDANH;
          }
        });
      }

      this.getListCodes("form_no");
    },
    "modelSearch.TCQT"(val) {
      if (val) {

      }
    },
    form_no_pop(val) {
      this.getListCodes("serial_no");
    },

  },
  methods: {
    async onClick(pos) {
      switch (pos) {
        case "search":
          this.$refs.grdSearch.loadData();
          break;
        case "grdSearchClick":
          this.modelMaster.PK = await this.$refs.grdSearch.getSelectedRows()[0].PK;
          await this.dsoMaster("select");
          this.$refs.grdDetail.loadData();
          break;
        case "newMaster":
          this.initModel();
          break;
        case "deleteMaster":
          this.modelMaster._rowstatus = "d";
          this.dsoMaster("update");
          this.$refs.grdSearch.loadData();
          break;
        case "saveMaster":
          if (this.modelMaster.MCQT == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_office"));
            break;
          } else if (this.modelMaster.MSO == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_from_no"));
            break;
          } else if (this.modelMaster.MST == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_from_no"));
            break;
          } else if (this.modelMaster.DDANH == "") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_address"));
            break;
          } else if (this.modelMaster.LOAI == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_type"));
            break;
          } else if (this.modelMaster.LTEN == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_declaration_name"));
            break;
          }

          else {
            this.dsoMaster("update");
            this.onClick("saveDetail");
            // this.onClick("search");
          } break;
        case "btnPrint":
          break;
        case "newDetail":
          this.dlg_View = true;
          break;
        case "saveDetail":
          this.$refs.grdDetail.saveData();
          break;
        case "deleteDetail":
          this.$refs.grdDetail.onSetMarkedDelete();
          break;

          case"CHECKCQT": 
          await this.OnCheckingDec();
          break;
      }
    },
    async dsoMaster(action) {
      await this._dsoCall({
        type: "control",
        selpro: "AC_SEL_6095280_2",
        updpro: "AC_UPD_6095280_3",
        para: [this.modelMaster.PK],
        elname: [
          "_rowstatus",
          "PK",
          "TEI_COMPANY_PK",
          "TNNT",
          "MCQT",
          "TCQT",
          "MSO",
          "MST",
          "DDANH",
          "LTEN",
          "TEN",
          "NTBAO",
          "TMESS_CQT",
          "LOAI",
          "VOUCHER_NO",
          "PBAN",
          "SELLER_REPRESENT",
          "SELLER_POSITION"
        ],
        data: this.modelMaster,
      }, action, true).then((res) => {
        if (res) {
          switch (action) {
            case "select":
              this.modelMaster = { ...res };
              this.modelMaster._rowstatus = "u";

              break;
            case "update":
              switch (this.modelMaster._rowstatus) {
                case "i":
                  this.modelMaster = { ...res };
                  this.modelMaster._rowstatus = "u";
                  break
                case "u":
                  this.modelMaster = { ...res };
                  console.log({ ...res });
                  console.log(this.modelMaster);
                  this.modelMaster._rowstatus = "u";
                  break;
                case "d":
                  this.onClick('newMaster');
                  break;
              }
              break;
          }
        }
      });
    },
    onClickPopup() {
      this.$refs.popupGrid.loadData();
    },
    onSelect() {
      let selectedData = this.$refs.popupGrid.getSelectedRows();
      console.log("file: 6095280.vue:519 [vng-304] onSelect [vng-304] selectedData:", selectedData)
      
      for (let i = 0; i < selectedData.length; i++) {
        this.$refs.grdDetail.onAdd({
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
          LDO: selectedData[i].CANCEL_REASON,
          CUSTOMER_NM: selectedData[i].CUSTOMER_NM,
          TTHAI: selectedData[i].EI_STATUS,
          TEI_EINVOICE_SS_M_PK: this.modelMaster.PK,
        });
      }
      this.dlg_View = false;
    },
    async initHeaderList() {
      this.headerList.grdSearch = [{
        dataField: "NO",
        caption: this.$t("no"),
        width: 50
      },
      // {
      //   dataField: "DECLARE_NM",
      //   caption: this.$t("declare_nm"),
      //   datasource: {
      //     KEY: "CODE",
      //     VALUE: "NAME",
      //     data: this.dataMasterList.declarationNameList,
      //   },
      // },
      // {
      //   dataField: "FORM_NO",
      //   caption: this.$t("form_no"),
      // },
      {
        dataField: "STATUS",
        caption: this.$t("status"),
      },
      {
        dataField: "TRADE_CODE",
        caption: this.$t("trade_code"),
        width: 120
      },
      {
        dataField: "VOUCHER_NO",
        caption: this.$t("voucher"),
      },
      {
        dataField: "NTBAO",
        caption: this.$t("date"),
        dataType: 'date'
      },
      ];

      this.headerList.grdDetail = [{
        dataField: "PK",
        caption: this.$t("pk"),
        hidden: true,
      }, {
        dataField: "NO",
        caption: this.$t("no"),
        allowEditing: true,
        width: 50
      },
      {
        dataField: "MCQTCAP",
        caption: this.$t("ma_cqt_cap"),
        allowEditing: true,
        width: 300
      },
      {
        dataField: "KHMSHDON",
        caption: this.$t("form_no"),
        allowEditing: true,
        width: 80
      },
      {
        dataField: "KHHDON",
        caption: this.$t("serial_no"),
        allowEditing: true,
        width: 100
      },
      {
        dataField: "SHDON",
        caption: this.$t("invoice_no"),
        allowEditing: true,
        width: 80
      },
      {
        dataField: "NGAY",
        caption: this.$t("date"),
        allowEditing: true,
        type: "date",
        width: 180
      },
      {
        dataField: "LADHDDT",
        caption: this.$t("type_e_invoice"),
        allowEditing: true,
        datasource: {
          KEY: "CODE",
          VALUE: "NAME",
          data: this.type_invoice_list,
        },
        width: 200
      },
      {
        dataField: "TCTBAO",
        caption: this.$t("e_invoice_type"),
        allowEditing: true,
        width: 200,
        datasource: {
          KEY: "CODE",
          VALUE: "NAME",
          data: this.e_invoice_type_list,
        },
      },
      {
        dataField: "LDO",
        caption: this.$t("cancel_reason"),
        allowEditing: true,
        width: 300,
        
      },
      {
        dataField: "CUSTOMER_NM",
        caption: this.$t("customer"),
        allowEditing: true,
        width: 200
      },
      {
        dataField: "VOUCHER_NO",
        caption: this.$t("voucher_no"),
        allowEditing: false,
        width: 200
      },
      {
        dataField: "TTHAI",
        caption: this.$t("status"),
        allowEditing: false,
        width: 80
      },
      {
        dataField: "KQUA",
        caption: this.$t("result"),
        allowEditing: false,
        width: 200
      },
      {
        dataField: "BUYER_POSITION",
        caption: this.$t("position"),
        allowEditing: true,
        width: 200
      },
      {
        dataField: "BUYER_REPRESENT",
        caption: this.$t("represent"),
        allowEditing: true,
        width: 200
      },
      ];
      this.headerList.grdPopup = [
        {
          field: "PK",
          title: this.$t("v"),
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
          alignment: "left",
          type: "text",
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          alignment: "left",
          type: "text",
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          alignment: "left",
          type: "text",
        },
        {
          field: "NGAY",
          title: this.$t("date"),
          alignment: "left",
          type: "date",
        },
        {
          field: "LADHDDT",
          title: this.$t("type_invoice"),
          alignment: "left",
          type: "text",
        },
        {
          field: "LADHDDT_NM",
          title: this.$t("type_invoice_name"),
          alignment: "left",
          type: "text",
        },
        {
          field: "TCTBAO",
          title: this.$t("invoice_type"),
          alignment: "left",
          type: "text",
        },
        {
          field: "TCTBAO_NM",
          title: this.$t("invoice_type_name"),
          alignment: "left",
          type: "text",
        },
        {
          field: "CANCEL_REASON",
          title: this.$t("cancel_reason"),
          alignment: "left",
          type: "text",
        },
      ]
    },
    async initDataList() {
      const company = await this._callProcedure("AC_SEL_6095280_COMPANY", [this.user.PK]);
      if (company.length > 0) {
        this.dataSearchList.companyList = company;
        this.dataMasterList.companyList = company;

        this.modelSearch.COMPANY_PK = this.dataSearchList.companyList[0].CODE;
      }

      const companyInfo = await this._callProcedure("AC_SEL_6095280_COMPANYINFO");
      if (companyInfo.length > 0) {
        this.dataMasterList.companyInfoList = companyInfo;
      }


      const results = await this._getCommonCode2(["ACEI0010", "ACEI0120", "ACEI0190", "ACEI0170", "ACEI0180", "ACEIS310", "ACEI0210", "ACEI0220"], this.user.TCO_COMPANY_PK)
      this.dataSearchList.statusList = results[0];
      this.dataMasterList.taxOfficeList = results[1];
      this.dataMasterList.fromNoList = results[2];
      this.dataMasterList.categoriesList = results[3];
      this.dataMasterList.declarationNameList = results[4];
      this.e_invoice_type_list = results[5];
      this.type_invoice_list = results[6];
      this.dataMasterList.versionList = results[7];
      // if (this.serial_no_list.length > 0) {
      //   this.selected_serial_no = this.serial_no_list[0].selected_serial_no;
      // };



    },
    async getListCodes(pos) {
      switch (pos) {
        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "AC_SEL_6095280_FORM_NO",
            para: [this.modelSearch.COMPANY_PK],
          };
          const checkFormNo = await this._dsoCall(dso_form_list, "select", false);
          if (checkFormNo != null) {
            if (checkFormNo.length > 0) {
              this.list_form_no_pop = checkFormNo;
              this.form_no_pop = this.list_form_no_pop[0].VAL;
            }
          }
          break;
        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "AC_SEL_6095280_SERIAL_NO",
            para: [this.modelSearch.COMPANY_PK, this.form_no_pop],
          };
          const checkSerialNo = await this._dsoCall(dso_serial_no_list, "select", false);
          if (checkSerialNo != null) {
            if (checkSerialNo.length > 0) {
              this.serial_no_list = checkSerialNo;
              this.selected_serial_no = this.serial_no_list[0].VAL;
            }
          }
          break;

          // case "type_e-invoice":
          // const dso_e_invoicetype_list = {
          //   type: "list",
          //   selpro: "AC_SEL_6095280_INVOICE_TYPE",
          //   para: [this.modelSearch.COMPANY_PK],
          // };
          // const checke_invoice_type = await this._dsoCall(dso_e_invoicetype_list, "select", false);
          // if (checke_invoice_type != null) {
          //   if (checke_invoice_type.length > 0) {
          //     this.type_invoice_list = checke_invoice_type[0].CODE;
          //   }
          // }
          // break;


          // case "e-invoice_type":
          // const dso_invoicetype_list = {
          //   type: "list",
          //   selpro: "AC_SEL_6095280_INVOICE_TYPE",
          //   para: [this.modelSearch.COMPANY_PK],
          // };
          // const checkinvoice_type = await this._dsoCall(dso_invoicetype_list, "select", false);
          // if (checkinvoice_type != null) {
          //   if (checkinvoice_type.length > 0) {
          //     this.e_invoice_type_list = checkinvoice_type[0].CODE;
          //   }
          // }
          // break;
          
      }
    },
    async initModel() {
      this.modelMaster._rowstatus = "i";
      this.modelMaster.PK = null;
      this.modelMaster.TEI_COMPANY_PK = this.modelSearch.COMPANY_PK;

      this.dataMasterList.companyInfoList.forEach(item => {
        if (item.TEI_COMPANY_PK == this.modelSearch.COMPANY_PK) {
          this.modelMaster.TNNT = item.NAME;
          this.modelMaster.MST = item.TAX_CODE;
          this.modelMaster.DDANH = item.DDANH;
        }
      });
      // this.modelMaster.TNNT = await this.dataMasterList.companyList.find(item => item.TEI_COMPANY_PK == this.modelSearch.COMPANY_PK).NAME;
      // this.modelMaster.MST = await this.dataMasterList.companyList.find(item => item.TEI_COMPANY_PK == this.modelSearch.COMPANY_PK).TAX_CODE;
      // this.modelMaster.DDANH = await this.dataMasterList.companyInfoList.find(item => item.TEI_COMPANY_PK == this.modelSearch.COMPANY_PK).DDANH;

      this.modelMaster.TCQT = null;
      this.modelMaster.MCQT = "00";
      // this.modelMaster.MSO = "00";
      this.modelMaster.LOAI = "1";
      this.modelMaster.TEN = "";
      this.modelMaster.LTEN = "4";
      this.modelMaster.NTBAO = new Date().toISOString().substr(0, 10).replaceAll("-", "");
      this.modelMaster.VOUCHER_NO = null;
      this.modelMaster.PBAN = "2.0.1";
      this.modelMaster.SELLER_REPRESENT = "";
      this.modelMaster.SELLER_POSITION = "";
      this.$refs.grdDetail.Clear();
    },



    OnCheckingDec()
{
	var count = 1;
	if(confirm("Bạn muốn kiểm tra tờ khai này?"))
	{	
		jQuery.support.cors = true;
		$.ajax({
			 url:  "http://genuclouding.com/wseinvoice/BSService.asmx/CheckingDeclationCQT_v3",
			 dataType: 'text',
			 method: 'POST',
			 data: {	tei_einvoice_issuse_cqt_pk: txtPK.value, 
						tei_company_pk: lstCompany.value,  
						tradecode: txtTrade_Code_CQT.value, 
						ctr_by: txtUserName.value },
			 error: function (response, json, textStatus, errorThrown) {
				 alert(' Error :' + errorThrown);
			 },
			 success: function (response) {
				 
				  var xmlDoc = $.parseXML(response);
				  var xml = $(xmlDoc);
				  //alert(xml.text());
				  let obj = $.parseJSON(xml.text());
				if(obj.msg == "OK")
				{
					alert("Checking Ma CQT is OK !!");
					//dso_steafrstea010003_s_01.Call('SELECT');
					//txtXMl_T.value = obj.result;	
					 
				}
			 }
	   });
	}	   
}
  }
}
</script>
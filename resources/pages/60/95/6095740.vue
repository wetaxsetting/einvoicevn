<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col lg="12">
        <v-card>
          <v-row dense class="pt-2">
            <v-col lg="1" class="pl-2">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="form_date" />
            </v-col>
            <v-col lg="1">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="to_date" />
            </v-col>
            <v-col lg="2">
              <BaseInput outlined readonly v-model="sellerTaxcode" :label="$t('seller_taxcode')"></BaseInput>
            </v-col>
            <v-col lg="4" class="pl-2">
              <BaseSelect outlined v-model="sellerName" :lstData="dataSearchList.sellerNameList" item-value="CODE" item-text="NAME" :label="$t('seller_name')"></BaseSelect>
            </v-col>
            <v-col lg="2">
              <BaseInput outlined v-model="symbols" :label="$t('trade_code')"></BaseInput>
            </v-col>

            <v-col lg="2" class="text-right">
              <GwFlexBox class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="onClickButton('search')" />
                <BaseButton icon_type="download" :btn_text="$t('export')" :disabled="isProcessing" @onclick="onClickButton('export')" />
              </GwFlexBox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col lg="12" class="pt-2">
              <BaseGridView
                ref="grdCompany"
                :auto_load="false"
                sel_procedure="EI_SEL_6095740_SEARCH_NC"
                select_mode="Single"
                :max_height="limitHeight"
                :header="headerGridLeft"
                :filter_paras="[this.sellerName, this.form_date, this.to_date, this.symbols]"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <view-einvoice-xml-dialog
      ref="ViewEInvoiceXMLDialog"
      :src_xmlUrl="xmlUrl"
      :xmlFileNm="xmlFileNm"
      dwnFile
      @minimizeDialog="manualIsMinimized = true"
      @closeManualDialog="manualIsMinimized = false"
    ></view-einvoice-xml-dialog>
    <view-einvoice-xml-cqt-dialog ref="ViewEIXMLCQTDialog" @minimizeDialog="manualIsMinimized = true" @closeManualDialog="manualIsMinimized = false"></view-einvoice-xml-cqt-dialog>
    <view-einvoice-transaction-details-dialog ref="ViewTransaction" @minimizeDialog="manualIsMinimized = true" @closeManualDialog="manualIsMinimized = false"></view-einvoice-transaction-details-dialog>
    
    <button type="button" v-show="false" :id="`btnPrview`" @click="previewCellFile"></button>
    <button type="button" v-show="false" :id="`btnPrview1`" @click="previewCellFile1"></button>
    <button type="button" v-show="false" :id="`btnPrview2`" @click="previewCellFile2"></button>
    <input type="textbox" id="tempPK" v-show="false" />
    <input type="textbox" id="tempPK1" v-show="false" />
    <input type="textbox" id="tempPK2" v-show="false" />
    
  </v-container>
</template>

<script>
import ViewEInvoiceXMLDialog from "@/components/dialog/ViewEInvoiceXMLDialog.vue";
import ViewEInvoiceXML_CQTDialog from "@/components/dialog/ViewEInvoiceXML_CQTDialog.vue";
import ViewEInvoice_TransactionDetailsDailog from "@/components/dialog/ViewEInvoice_TransactionDetailsDailog.vue";

export default {
  layout: "default",
  middleware: "user",

  components: {
    "view-einvoice-xml-dialog": ViewEInvoiceXMLDialog,
    "view-einvoice-xml-cqt-dialog": ViewEInvoiceXML_CQTDialog,
    "view-einvoice-transaction-details-dialog":ViewEInvoice_TransactionDetailsDailog
  },
  data: () => ({
    form_date: "",
    to_date: "",
    sellerTaxcode: "",
    dataSearchList: {
      sellerNameList: [],
    },
    sellerName: "",
    symbols: "",

    xmlUrl: "",
    xmlFileNm: "",
    currentRow: "",
  }),

  async created() {
    this.initDataList("company");
    // this.getListCodes();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 750;
      }
    },
    headerGridLeft() {
      const self = this;
      return [
        {
          dataField: "NO",
          caption: this.$t("stt"),
        },
        {
          dataField: "DONVI",
          caption: this.$t("don_vi"),
          width: 100,
        },
        {
          dataField: "DONVIMST",
          caption: this.$t("dvi_mst"),
          width: 100,
        },
        {
          dataField: "TRADE_CODE",
          caption: this.$t("ma_giao_dich"),
          width: 150,
        },
        {
          dataField: "SLLR_COMP_NM",
          caption: this.$t("tennnt"),
          width: 300,
        },
        {
          dataField: "SLLR_TAXCD",
          caption: this.$t("mst"),
          type: "number",
          width: 150,
        },
        {
          dataField: "SEND_DT",
          caption: this.$t("nlap"),
          dataType: "date",
          width: 120,
        },
        {
          dataField: "STATUS",
          caption: this.$t("tthai"),
          width: 160,
        },
        {
          dataField: "CQT_RESULT",
          caption: this.$t("ph_cqt"),
          width: 260,
        },
        { dataField: "TITTLE", caption: "thao_tac", type: "html", width: 150, fixed: true, cellsrenderer: this.myCellHTML },
      ];
    },
  },
  watch: {
    sellerName(val) {
      if (val) {
        this.sellerTaxcode = this.dataSearchList.sellerNameList.find((item) => item.CODE == val).TAX_CODE;
      }
    },
  },
  methods: {
    previewCellFile() {
      this.currentRow = document.getElementById("tempPK").value;
      const ds = this.$refs.grdCompany.getDataSource();
      // console.log("this.currentRow  previewCellFile", this.currentRow);
      // console.log("ds  previewCellFile", ds);
      if (ds.length) {
        const found = ds.find((item) => item.PK == this.currentRow);
        console.log("found", found);
        if (found) {
          this.xmlUrl = found.CQT_DATA_RESULT;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        }
      }
    },
    previewCellFile1() {
      this.currentRow = document.getElementById("tempPK1").value;
      // console.log("this.currentRow  previewCellFile1", this.currentRow);
      const ds = this.$refs.grdCompany.getDataSource();

      if (ds.length) {
        const found = ds.find((item) => item.PK == this.currentRow);
        // console.log("found", found);
        if (found) {
          this.$refs.ViewEIXMLCQTDialog.pk = found.PK;
          this.$refs.ViewEIXMLCQTDialog.dialogIsShow = true;
        }
      }
    },

    previewCellFile2() {
      this.currentRow = document.getElementById("tempPK2").value;
      // console.log("this.currentRow  previewCellFile2", this.currentRow);
      const ds = this.$refs.grdCompany.getDataSource();

      if (ds.length) {
        const found = ds.find((item) => item.PK == this.currentRow);
        // console.log("found", found);
        if (found) {
          this.$refs.ViewTransaction.pk = found.PK;
          this.$refs.ViewTransaction.dialogIsShow = true;
        }
      }
    },
    myCellHTML(row, column, value, cellhtml) {
      let grid = this.$refs.grdCompany.getControl();
      let rowData = grid.getrowdata(row);
      let previewFile = `document.getElementById('btnPrview').click()`;
      let previewFile1 = `document.getElementById('btnPrview1').click()`;
      let previewFile2 = `document.getElementById('btnPrview2').click()`;

      let html = `<button class="v-icon mdi mdi-eye light-blue--text px-4" onclick="document.getElementById('tempPK').value = '${rowData.PK}';${previewFile}"></button>
                  <button class="v-icon mdi mdi-file-document light-blue--text px-1" onclick="document.getElementById('tempPK1').value = '${rowData.PK}';${previewFile1}"></button>
                  <button class="v-icon mdi mdi-checkbox-marked-circle-outline light-blue--text px-4" onclick="document.getElementById('tempPK2').value = '${rowData.PK}';${previewFile2}"></button>`;
      return html;
    },

    async initDataList(pos) {
      switch (pos) {
        case "company":
          const company = await this._callProcedure("EI_SEL_6095450_COMPANY", [this.user.PK]);
          if (company.length > 0) {
            this.dataSearchList.sellerNameList = company;
          }
          break;
      }
    },
    async onClickButton(pos) {
      switch (pos) {
        case "search":
          await this.$refs.grdCompany.loadData();
          break;
      }
    },

    // async getListCodes() {
    //   const results = await this._getCommonCode2(["ACEI0010", "ACEI0040", "ACEI0120", "ACEI0190", "ACEI0140", "ACEIN010", "ACJS0460"], this.user.PK);
    //   this.statusList = results[0];
    //   this.dataSearchList.tradingTypeList = results[1];
    // },
  },
};
</script>

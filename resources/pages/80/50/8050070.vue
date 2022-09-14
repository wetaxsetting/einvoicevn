<template>
<v-container fluid v-resize="onResize">
<v-row dense>
  <v-col md="12">
    <!--Storage Tabs-->
    <BaseTabs>
      <BaseTab :name="$t('storage')">
        <v-row dense v-show="true">
          <v-col cols="12" sm="3">
            <v-row dense>
              <v-col cols="9">
                <BaseSelect
                  :label="$t('company')"
                  v-model="companyStorage_pk"
                  :lstData="lstCompany"
                  item-text="TEXT"
                  item-value="PK"
                />
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="searchStorage"/>
              </v-col>
            </v-row>
            <v-row class="pt-1" dense>
              <v-col cols="12" class="d-flex justify-end">
                <BaseButton icon_type="print" :btn_text="$t('label_type_1')" :disabled="isProcessing" @onclick="printLabel1" />
                <BaseButton icon_type="print" :btn_text="$t('label_type_2')" :disabled="isProcessing" @onclick="printLabel2" />
              </v-col>
            </v-row>
            <v-row class="pt-1" dense>
              <v-col cols="12">
                <v-card-text class="pa-0">
                  <DxTreeList
                    ref="lstStorage"
                    :data-source="lstStorage"
                    :expanded-row-keys="expandedRowKeys"
                    :show-row-lines="true"
                    :show-borders="true"
                    :column-auto-width="true"
                    key-expr="PK"
                    parent-id-expr="PARENT_PK"
                    :row-alternation-enabled="true"
                    :allow-column-resizing="true"
                    column-resizing-mode="widget"
                    :height="windowHeight * 0.7"
                    @row-click="onClickStorage"
                  >
                    <DxPaging :enabled="true" />

                    <DxSelection mode="single" />
                    <DxKeyboardNavigation :edit-on-key-press="true" />
                    <DxColumn
                      data-field="STORAGE_NAME"
                      :caption="$t('storage_name')"
                    />
                  </DxTreeList>
                </v-card-text>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="9">
                <v-row dense>
                  <v-col cols="12" class="d-flex justify-end">
                  <BaseButton
                    icon_type="add_root"
                    :btn_text="$t('add_root')"
                    :disabled="isProcessing"
                    @onclick="addRootStorageFunction"
                  />

                  <BaseButton
                    icon_type="add_branch"
                    :btn_text="$t('add_branch')"
                    :disabled="isProcessing"
                    @onclick="addStorageFunction"
                  />

                  <BaseButton
                    icon_type="add_sub"
                    :btn_text="$t('add_sub')"
                    :disabled="isProcessing"
                    @onclick="addStoragChildeFunction"
                  />

                  <BaseButton
                    icon_type="save"
                    :btn_text="$t('save')"
                    :disabled="isProcessing"
                    @onclick="saveStorageFunction"
                  />

                  <BaseButton
                    icon_type="delete"
                    :btn_text="$t('delete')"
                    :disabled="isProcessing"
                    @onclick="delStorageFunction"
                  />
                  </v-col>
                </v-row>
                <v-row class="pt-1" dense>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <BaseSelect
                      :label="$t('company')"
                      v-model="storagePara.TCO_COMPANY_PK"
                      :lstData="lstCompany"
                      item-text="TEXT"
                      item-value="PK"
                    />                          
                  </v-col>  
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <BaseSelect
                      :label="$t('storage_type')"
                      v-model="storagePara.STORAGE_TYPE"
                      :lstData="lstTypeStorage"
                      item-text="CODEDESC"
                      item-value="CODEKEY"
                    />                          
                  </v-col>                
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <v-text-field
                      v-model="storagePara.SEQ"
                      clearable
                      dense
                      hide-details
                      :label="$t('seq')"
                      :disabled="isProcessing"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <v-text-field
                      v-model="storagePara.STRG_ID"
                      clearable
                      dense
                      hide-details
                      :label="$t('strg_id')"
                      :disabled="isProcessing"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8" lg="8" class="pt-0">
                    <v-text-field
                      v-model="storagePara.STRG_NAME"
                      clearable
                      dense
                      hide-details
                      :label="$t('strg_name')"
                      :disabled="isProcessing"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <DatePicker
                      :defaultType="''"
                      :disabled="isProcessing"
                      :label="$t('st_date')"
                      :inputValue="storagePara.ST_DATE"
                      @returnValue="storagePara.ST_DATE = $event"
                    >
                    </DatePicker>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <DatePicker
                      :defaultType="''"
                      :disabled="isProcessing"
                      :label="$t('end_date')"
                      :inputValue="storagePara.END_DATE"
                      @returnValue="storagePara.END_DATE = $event"
                    >
                    </DatePicker>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <v-row class="pt-1" dense>
                      <v-col cols="6" class="pt-0">
                        <BaseCheckbox :label="$t('use_yn')" true-value="Y" false-value="N" v-model="storagePara.USE_YN" />                        
                      </v-col>
                      <v-col cols="6" class="pt-0">
                        <BaseCheckbox :label="$t('leaf_yn')" true-value="Y" false-value="N" v-model="storagePara.LEAF_YN" />                        
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <BaseInput :label="$t('description')" v-model="storagePara.DESCRIPTION" />                   
                  </v-col>
                  <v-col cols="6" sm="3" md="2" lg="2" class="pt-0">
                    <BaseInput :label="$t('row_no')" v-model="storagePara.ROW_NO" />                   
                  </v-col>
                  <v-col cols="6" sm="3" md="2" lg="2" class="pt-0">
                    <BaseInput :label="$t('column_no')" v-model="storagePara.COLUMN_NO" />                   
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="4" class="pt-0">
                    <v-row class="pt-1" dense>
                      <BaseButton
                        icon_type="add_new"
                        :btn_text="$t('add_detail')"
                        :disabled="isProcessing && _hasValue(storagePara.PK)"
                        @onclick="addStorageDetail"
                      />

                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete_detail')"
                        :disabled="isProcessing && _hasValue(storagePara.PK)"
                        @onclick="delStorageDetail"
                      />
                      <BaseButton
                        icon_type="save"
                        :btn_text="$t('save_detail')"
                        :disabled="isProcessing && _hasValue(storagePara.PK)"
                        @onclick="saveStorageDetail"
                      />
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="pt-1" dense>
                  <v-col cols="12">
                    <DataGridView
                      ref="grdStorage"
                      :header="[                    
                        {dataField: 'PK',caption: 'PK',allowEditing: false, visible: false},
                        {dataField: 'TLG_IN_STORAGE_PK',caption: 'TLG_IN_STORAGE_PK',allowEditing: false, visible: false},
                        {dataField: 'LOC_ID',caption: this.$t('loc_id'),allowEditing: true},
                        {dataField: 'LOC_NAME',caption: this.$t('loc_name'),allowEditing: true},
                        {dataField: 'ROW_NO',caption: this.$t('row_no'),allowEditing: true},
                        {dataField: 'STAIR_NO',caption: this.$t('stair_no'),allowEditing: true},
                        {dataField: 'LOC_ID_MAP',caption: this.$t('mapping_id'),allowEditing: true},
                        {dataField: 'STORE_QTY',caption: this.$t('store_qty'),allowEditing: true, formatFloat: 0},
                        {dataField: 'USE_YN',caption: this.$t('use_yn'),allowEditing: true, dataType: 'checkbox' },
                        {dataField: 'LOC_TYPE',caption: this.$t('loc_type'),allowEditing: true,
                          lookup: {
                            dataSource: this.lstTypeLocation,
                            displayExpr: 'CODEDESC',
                            valueExpr: 'CODEKEY',
                          },
                        },
                        {dataField: 'DESCRIPTION',caption: this.$t('description'),allowEditing: true}
                        
                      ]"
                      sel_procedure="LG_SEL_8050070_3"
                      upd_procedure="LG_UPD_8050070_3"
                      :filter_paras="[storagePara.PK]"
                      :max_height="windowHeight * 0.54"
                      :update_paras="[
                        'PK',
                        'TLG_IN_STORAGE_PK',
                        'LOC_ID',
                        'LOC_NAME',
                        'ROW_NO',
                        'STAIR_NO',
                        'LOC_ID_MAP',
                        'STORE_QTY',
                        'USE_YN',
                        'LOC_TYPE',
                        'DESCRIPTION'                   
                      ]"
                      @is_process="isProcessing = $event"
                      :default_value="{
                        TLG_IN_STORAGE_PK: this.storagePara.PK,
                        USE_YN: 'Y'                    
                      }"
                    >
                    </DataGridView>
                  </v-col>
                </v-row>
          </v-col>
        </v-row>
      </BaseTab>
    </BaseTabs>
  </v-col>
</v-row>

    <v-sheet id="printHTML1" ref="printHTML1" class="d-none">
        
      <body style="margin: 0px; padding: 0px; font-family: Microsoft Sans serif;">
      <div>
        <table
          border="0"
          cellspacing="0"
          cellspadding="0"
          style="height: 100%; width: 100%; margin-bottom:18px" v-for="(page, idx) in printPerPage1" :key="idx"
        >
          <tbody>
        <tr no-gutters valign="top" v-for="(items ,index) in page" :key="index">
          <td v-for="(item ,index2) in items" :key="index2">
              <table
                border="0"
                cellspacing="0"
                cellspadding="0"
                style="height: 3in; width: 2in; table-layout: fixed; /*border: 1px solid black;*/"
              >
                <tbody>
                  <colgroup>
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                  </colgroup>
                  <tr>
                    <td colspan="10" style="text-align: center; height: 3in;">
                      <div >
                          <span style="font-size: 28px; font-weight: bold;">{{item.LOC_ID}}</span>
                          <br>
                          <BaseQRCode height="140" width="140" :value="item.PK" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </td>
        </tr>
      </tbody></table>
     </div>
     </body>
    </v-sheet>

    <v-sheet id="printHTML2" ref="printHTML2" class="d-none">
        
      <body style="margin: 0px; padding: 0px; font-family: Microsoft Sans serif;">
      <div>
        <table
          border="0"
          cellspacing="0"
          cellspadding="0"
          style="height: 100%; width: 100%; margin-bottom:18px" v-for="(page, idx) in printPerPage2" :key="idx"
        >
          <tbody>
        <tr no-gutters valign="top" v-for="(items ,index) in page" :key="index">
          <td v-for="(item ,index2) in items" :key="index2">
              <table
                border="0"
                cellspacing="0"
                cellspadding="0"
                style="height: 3in; width: 2in; table-layout: fixed; /*border: 1px solid black;*/"
              >
                <tbody>
                  <colgroup>
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                  </colgroup>
                  <tr><td colspan="5" style="text-align: center; height: 0.5in;"></td></tr>
                  <tr>
                    <td colspan="5" rowspan="2" style="text-align: center; height: 1in; border: 1px solid black;">
                      <div >
                          <BaseQRCode height="80" width="80" :value="item.PK" />
                          <span style="font-size: 9px; font-weight: bold;">{{item.LOC_ID}}</span>
                      </div>
                    </td>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.3in; border: 1px solid black; font-weight: bold;">
                      <div >
                        RACK
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.7in; border: 1px solid black; font-weight: bold;">
                      <div >
                        {{item.RAC}}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.3in; border: 1px solid black; font-weight: bold;">
                      <div >
                        COLUMN
                      </div>
                    </td>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.3in; border: 1px solid black; font-weight: bold;">
                      <div >
                        FLOOR
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.7in; border: 1px solid black; font-weight: bold;">
                      <div >
                        {{item.COL}}
                      </div>
                    </td>
                    <td colspan="5" style="font-size: 16px; text-align: center; height: 0.7in; border: 1px solid black; font-weight: bold;">
                      <div >
                        {{item.FLO}}
                      </div>
                    </td>
                  </tr>
                  <tr><td colspan="5" style="text-align: center; height: 0.4in;"></td></tr>
                </tbody>
              </table>
          </td>
        </tr>
      </tbody></table>
     </div>
     </body>
    </v-sheet>

    <AlertDialog ref="alertDialog" />

  </v-container>
</template>

<script>
import AlertDialog from "@/components/dialog/AlertDialog";
import { DxTreeList, DxSelection, DxColumn } from "devextreme-vue/tree-list";

export default {
  layout: "default",
  middleware: "user",
  components: {
     DxTreeList,
    DxSelection,
    DxColumn,
    AlertDialog
  },
  data: () => ({
    selectedIndex: 0,

    lstCompany: [],
    companyStorage_pk: null,
    lstStorage: [],
    lstBizStorage: [],
    lstTypeStorage: [],
    expandedRowKeys: [1],
    storagePara: {
      _rowstatus: "",
      PK: "",
      TCO_COMPANY_PK: "",
      TCO_BUSPLACE_PK: "",
      PARENT_PK: "",
      SEQ: "",
      STRG_ID: "",
      STRG_NAME: "",
      STORAGE_TYPE: "",
      USE_YN: "",
      ST_DATE: "",
      END_DATE: "",
      LEAF_YN: "",
      DESCRIPTION: "",
      ROW_NO:"",
      COLUMN_NO:""
    },

    lstTypeLocation: [],

    printHTMLList1: [],
    printHTMLList2: [],
  }),
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    printPerPage1() {
     let tmp = this._chunkArray(this.printHTMLList1, 4);
      let itemPerRow = 2;
      
      let itemReturn = [];
      for( let i = 0; i < tmp.length; i++) {
        let itemsPerPage = tmp[i];
        let _itemPerPageTmp = [];
        for( let j = 0; j < itemsPerPage.length; j+=itemPerRow ) {
          let _itemPerRow = itemsPerPage.filter( (q, idx) => idx >= j && idx < j+ itemPerRow );
          _itemPerPageTmp.push(_itemPerRow);
        }
        console.log(_itemPerPageTmp);
        itemReturn.push(_itemPerPageTmp);
      }

      return itemReturn;
    },
    printHTMLContent1() {
      if(this.printPerPage1.length){
        return this.$refs.printHTML1.$el.innerHTML;
      }
    },
    printPerPage2() {
     let tmp = this._chunkArray(this.printHTMLList2, 4);
      let itemPerRow = 2;
      
      let itemReturn = [];
      for( let i = 0; i < tmp.length; i++) {
        let itemsPerPage = tmp[i];
        let _itemPerPageTmp = [];
        for( let j = 0; j < itemsPerPage.length; j+=itemPerRow ) {
          let _itemPerRow = itemsPerPage.filter( (q, idx) => idx >= j && idx < j+ itemPerRow );
          _itemPerPageTmp.push(_itemPerRow);
        }
        console.log(_itemPerPageTmp);
        itemReturn.push(_itemPerPageTmp);
      }

      return itemReturn;
    },
    printHTMLContent2() {
      if(this.printPerPage2.length){
        return this.$refs.printHTML2.$el.innerHTML;
      }
    },
  },
  created() {
    this.bodyInnit();
  },
  mounted() {},
  watch: {
  
    "storagePara.TCO_COMPANY_PK"(val) {
      //this.loadBizCenterStorage();
    },

  },
  methods: {
    async bodyInnit() {
      this.lstTypeLocation = [{CODEKEY: "",CODEDESC: ""}, {CODEKEY: "C",CODEDESC: this.$t('com')},{CODEKEY: "A",CODEDESC: this.$t('actual')}];

      const promises = [
        (this.lstCompany = await this.getDataList("SYS_SEL_LIST_COMPANY", [
          this.user.PK,
        ])),
      ];

      await Promise.all(promises);
      if (this.lstCompany.length > 0) {
        this.companyStorage_pk = this.lstCompany[0].PK;
        this.storagePara.TCO_COMPANY_PK = this.lstCompany[0].PK;
      }
   
      this.loadStorageTab();
    },

    /*** Storage Tab ***/
    loadStorageTab() {
      //this.loadBizCenterStorage();
      this.loadTypeStorage();
    },
    async searchStorage() {
      this.isProcessing = true;
      let param = [this.companyStorage_pk];
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8050070_1",
        para: param,
      };
      this.lstStorage = await this._dsoCall(dso, "select", false);

      this.isProcessing = false;
    },

    async printLabel1() {
      if (!this.storagePara.PK) {
        this.$refs.alertDialog.showAlert("warning", "Error", "pls_choose_parent_to_print");
        return;
      }
      else
      {
        this.onPrint1();   
      }
    },

    async printLabel2() {
      if (!this.storagePara.PK) {
        this.$refs.alertDialog.showAlert("warning", "Error", "pls_choose_parent_to_print");
        return;
      }
      else
      {
        this.onPrint2();   
      }
    },

    async loadBizCenterStorage() {
      this.isProcessing = true;
      let param = [this.storagePara.TCO_COMPANY_PK];
      const dso = {
        type: "grid",
        selpro: "LG_SEL_WMS_BIZ",
        para: param,
      };
      this.lstBizStorage = await this._dsoCall(dso, "select", false);
      if (this.lstBizStorage.length > 0) {
        this.storagePara.TCO_BUSPLACE_PK = this.lstBizStorage[0]["PK"];
      }

      this.isProcessing = false;
    },

    async loadTypeStorage() {
      this.isProcessing = true;
      let param = ["LGIN0220"];
      const dso = {
        type: "grid",
        selpro: "LG_GET_TCO_COMMCODE_01",
        para: param,
      };
      this.lstTypeStorage = await this._dsoCall(dso, "select", false);
      this.lstTypeStorage.unshift({CODEKEY: "", CODEDESC: ""});
      this.isProcessing = false;
    },
    onClickStorage(row) {
      if (row.isSelected) {
        this.onControlStorage(row.data.PK);
      } else {
      }
    },
    addRootStorageFunction() {
      this.storagePara.PK = "";
      this.storagePara.PARENT_PK = "";
      this.clearbeforeAddNew();
    },
    addStorageFunction() {
      this.storagePara.PK = "";
      //this.storagePara.PARENT_PK = "";
      this.clearbeforeAddNew();
    },
    addStoragChildeFunction() {
      this.storagePara.PARENT_PK = this.storagePara.PK;
      this.storagePara.PK = "";
      this.clearbeforeAddNew();
    },

    clearbeforeAddNew() {
      this.storagePara.SEQ = "";
      this.storagePara.STRG_ID = "";
      this.storagePara.STRG_NAME = "";
      this.storagePara.DESCRIPTION = "";
      this.$refs.grdStorage.Clear();
      //this.$refs.grdStorage.loadData();
    },

    saveStorageFunction() {
      if (this.storagePara.PK != "") {
        this.storagePara._rowstatus = "UPDATE";
        this.onControlStorage(this.storagePara.PK, "update");
      } else {
        this.storagePara._rowstatus = "INSERT";
        this.onControlStorage(this.storagePara.PK, "update");
      }
    },

    delStorageFunction() {
      if (this.storagePara.PK != "") {
        this.storagePara._rowstatus = "DELETE";
        this.onControlStorage(this.storagePara.PK, "delete");
      }
    },

    async onControlStorage(pk, type = "select") {
      const dso = {
        type: "control",
        selpro: "LG_SEL_8050070_2",
        updpro: "LG_UPD_8050070_2",
        para: [pk],
        elname: [
          "_rowstatus",
          "PK",
          "TCO_COMPANY_PK",
          "TCO_BUSPLACE_PK",
          "PARENT_PK",
          "SEQ",
          "STRG_ID",
          "STRG_NAME",
          "STORAGE_TYPE",
          "USE_YN",
          "ST_DATE",
          "END_DATE",
          "LEAF_YN",
          "DESCRIPTION",
          "ROW_NO",
          "COLUMN_NO"
        ],
        data: this.storagePara,
      };
      //"update"
      let row = await this._dsoCall(dso, type, false);
      if (row) {
        // let oldPK =

        this.storagePara = {
          ...row,
        };

        if (type === "select") {
   
          this.$refs.grdStorage.loadData();
        } else if (type === "update") {
          //update parent pk  all row
          let newPK = this.storagePara.PK;
          this.$refs.grdStorage.setCellValue(
            "TLG_IN_STORAGE_PK",
            newPK,
            "",
            "TLG_IN_STORAGE_PK"
          );
          this.$refs.grdStorage.saveData();
        } else if (type === "delete") {
          //update status   all row
          //this.$refs.grdStorage.saveData()
          this.$refs.grdStorage.Clear();
        }

        this.searchStorage();
      }
    },
    addStorageDetail() {
      this.$refs.grdStorage.addRow(-1);
    },
    delStorageDetail() {
      this.$refs.grdStorage.deleteRows();
    },
    saveStorageDetail() {
      this.$refs.grdStorage.saveData();
    },


    /*** MAPPING TAB  ***/

    async getDataList(p_procedure, p_param = []) {
      let dso = {};

      if (p_param.length == 0) {
        dso = {
          type: "list",
          selpro: p_procedure,
        };
      } else {
        dso = {
          type: "list",
          selpro: p_procedure,
          para: p_param,
        };
      }

      let result = await this._dsoCall(dso, "select", false);

      if (result) {
        return result;
      } else {
        return [];
      }
    },

    async onPrint1() {
			const dso1 = {
        type: "list",
        selpro: "LG_RPT_8050070_NOCACHE",//
				para: [this.storagePara.PK]
      };
     //this.printHTMLList1 =[];
			const res = await this._dsoCall(dso1, "select", false);
      this.printHTMLList1 = res ? [...res] : [];
      console.log(this.printHTMLList1)
      var cont = null;
      this.$nextTick(()=>{
        //console.log(this.printHTMLContent1);
        cont = window.open('', '', 'height=500, width=500');
        cont.document.write('<html>');
        cont.document.write('<body>');
        cont.document.write(this.printHTMLContent1);
        cont.document.write('</body></html>');
        cont.document.close();
      })
      await new Promise((resolve) => {setTimeout(resolve, 1000)});
      if(cont){
        cont.print();
        cont.window.close();
      }
    },

    async onPrint2() {
			const dso1 = {
        type: "list",
        selpro: "LG_RPT_8050070_NOCACHE",//
				para: [this.storagePara.PK]
      };
     //this.printHTMLList2 =[];
			const res = await this._dsoCall(dso1, "select", false);
      this.printHTMLList2 = res ? [...res] : [];
      console.log(this.printHTMLList2)
      var cont = null;
      this.$nextTick(()=>{
        //console.log(this.printHTMLContent2);
        cont = window.open('', '', 'height=500, width=500');
        cont.document.write('<html>');
        cont.document.write('<body>');
        cont.document.write(this.printHTMLContent2);
        cont.document.write('</body></html>');
        cont.document.close();
      })
      await new Promise((resolve) => {setTimeout(resolve, 1000)});
      if(cont){
        cont.print();
        cont.window.close();
      }
    },
  },
};
</script>

<style>
</style>

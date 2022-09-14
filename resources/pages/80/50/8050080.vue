<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
  <v-container fluid class="py-0 px-1" v-resize="onResize">
    <v-card v-if="isStart">
      <v-row dense align="center" justify="space-between">
        <v-col cols="12">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container fluid class="">
                  <v-row dense justify="space-start">
                    <v-col lg="3" cols="12">
                      {{ currentDate.toLocaleDateString("en-US") }}
                    </v-col>
                    <v-col lg="3" cols="12">
                      <BaseInput :label="$t('item_code')" v-model="item_code" />
                    </v-col>
                    <v-col lg="3" cols="12">
                      <BaseInput :label="$t('item_name')" v-model="item_name" />
                    </v-col>
                    <v-col lg="3" cols="12">
                      <v-btn
                        :disabled="isProcessing"
                        color="blue-grey"
                        class="white--text"
                        @click="parentMonitoring()"
                      >
                        search
                        <v-icon right dark> mdi-magnify </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense align="center" justify="space-between">
        <v-col cols="12">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container fluid class="">
                  <v-row dense justify="space-start">
                    <v-col lg="4" cols="12">
                    
                        <v-btn color="blue-grey"  @click="onTransactionsClick('IN','income')">IN:{{transactionsObj.INCOME_QTY==undefined?0:transactionsObj.INCOME_QTY.toLocaleString()}}</v-btn>
                     
                    </v-col>
                    <v-col lg="4" cols="12">
                  
                        <v-btn color="blue-grey"   @click="onTransactionsClick('OUT','outcome')">OUT: {{transactionsObj.OUTGO_QTY==undefined?0:transactionsObj.OUTGO_QTY.toLocaleString()}}</v-btn>
                    
                    </v-col>
                    <v-col lg="2" cols="12">
                   
                        <v-btn color="blue-grey"   @click="onTransactionsClick('TRANS_IN','trans-in')">TRANSFER-IN: {{transactionsObj.TRANS_IN_QTY==undefined?0:transactionsObj.TRANS_IN_QTY.toLocaleString()}}</v-btn>
                 
                    </v-col>
                      <v-col lg="2" cols="12">
               
                        <v-btn color="blue-grey"   @click="onTransactionsClick('TRANS_OUT','trans-out')">TRANSFER-OUT: {{transactionsObj.TRANS_OUT_QTY==undefined?0:transactionsObj.TRANS_OUT_QTY.toLocaleString()}}</v-btn>
                   
                    </v-col>
                 
                  </v-row>
                  <v-row dense justify="space-start">
                    <v-col lg="4" cols="12">
                  
                        <v-btn color="blue-grey"  @click="onTransactionsClick('PROD_IN','prod-in')">PRODUCT INCOME: {{transactionsObj.PROD_IN_QTY==undefined?0:transactionsObj.PROD_IN_QTY.toLocaleString()}}</v-btn>
                     
                    </v-col>
                    <v-col lg="4" cols="12">
                   
                        <v-btn color="blue-grey"  @click="onTransactionsClick('DELI','deli')">DELIVERY: {{transactionsObj.DELI_QTY==undefined?0:transactionsObj.DELI_QTY.toLocaleString()}}</v-btn>
                  
                    </v-col>
                    <v-col lg="4" cols="12">
                    
                        <v-btn color="blue-grey" @click="onTransactionsClick('ALL','all')">ALL TRANSACTION: {{transactionsObj.ALL_QTY==undefined?0:transactionsObj.ALL_QTY.toLocaleString()}}</v-btn>
                  
                    </v-col>
                
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined class="abc" :height="masterContainerHeight">
            <v-card fluid :height="detailContainerHeight">
              <table
                border="1"
                cellspacing="0"
                cellspadding="0"
                style="height: 100%; width: 100%"
              >
                <tr style="background-color:#b7dee8" height="20%">
                  <td colspan="1"><div class="itemTable2">SEQ</div></td>
                  <td colspan="3"><div class="itemTable2">STORAGE_TYPE</div></td>
                  <td colspan="2"><div class="itemTable2">TOTAL_LOC</div></td>
                  <td colspan="2"><div class="itemTable2">EMPTY_LOC</div></td>
                  <td colspan="2"><div class="itemTable2">USING_LOC</div></td>
                  <td colspan="2"><div class="itemTable2">USING_PER</div></td>
                  <td colspan="2"><div class="itemTable2">QTY</div></td>
                </tr>
                <tr style="background-color:#ccc0da" height="10%">
                  <td colspan="1"><div class="itemTable2"></div></td>
                  <td colspan="3"><div class="itemTable2">TOTAL</div></td>
                  <td colspan="2"><div class="itemTable2">{{ParentTotalObj.TOTAL_LOC==undefined?0:ParentTotalObj.TOTAL_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ParentTotalObj.EMPTY_LOC==undefined?0:ParentTotalObj.EMPTY_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ParentTotalObj.USING_LOC==undefined?0:ParentTotalObj.USING_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ParentTotalObj.USING_PER!=undefined?ParentTotalObj.USING_PER.toFixed(2):0}}%</div></td>
                  <td colspan="2"><div class="itemTable2">{{ParentTotalObj.QTY==undefined?0:ParentTotalObj.QTY.toLocaleString()}}</div></td>
                </tr>
                <tr v-for="(item, idx) in ParentArr" :key="idx" height="10%">
                  <td colspan="1"><v-btn class="itemTable2">{{ item.SEQ }}</v-btn></td>
                  <td colspan="3"><v-btn class="itemTable3" @click="onParentClick(item)">{{item.STORAGE_TYPE==undefined?0:item.STORAGE_TYPE.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="itemTable" @click="onMonitoringClick('TOTAL',item.PK)">{{ item.TOTAL_LOC==undefined?0:item.TOTAL_LOC.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="itemTable" @click="onMonitoringClick('EMPTY',item.PK)">{{ item.EMPTY_LOC==undefined?0:item.EMPTY_LOC.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="itemTable" @click="onMonitoringClick('USING',item.PK)">{{ item.USING_LOC==undefined?0:item.USING_LOC.toLocaleString() }}</v-btn></td>
                  <td colspan="2"><v-btn class="itemTable">{{item.USING_PER!=undefined?item.USING_PER.toFixed(2):0 }}%</v-btn></td>
                  <td colspan="2"><v-btn class="itemTable" @click="onMonitoringQTYClick(item.PK)">{{item.QTY==undefined?0:item.QTY.toLocaleString()}}</v-btn></td>
                </tr>
              </table>
              <!-- <v-card v-for="(item, idx) in ParentArr" :key="idx">
                <v-btn @click="onParentClick(item)">{{
                  item.STORAGE_NAME
                }}</v-btn>
              </v-card> -->
            </v-card>
             <v-container fluid >
             
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else>
      <v-row   dense   align="center"   justify="space-between"   v-if="mapType == 'warehouse'" >
        <v-col cols="12">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container fluid class="">
                  <v-row dense justify="space-start">
                    <v-col lg="2" cols="12">
                      <BaseInput :label="$t('item_code')" v-model="item_code" />
                    </v-col>
                    <v-col lg="2" cols="12">
                      <BaseInput :label="$t('item_name')" v-model="item_name" />
                    </v-col>

                    <v-col lg="3" cols="12">
                      <!-- <v-slider style="padding-top: 10px" v-model="scale" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline" :max="1" :min="0" step="0.1" @click:append="zoomIn(1)" @click:prepend="zoomOut(1)"
                      ></v-slider> -->
                    </v-col>
                    <v-col lg="5" cols="12" style="padding: 0px" class="align-start"
                    >
                      <v-row class="d-flex flex-row align-start" justify="space-end" >
                        <v-col lg="4" class="d-flex align-end flex-column">
                          <v-btn :disabled="isProcessing" color="blue-grey" class="white--text" @click="parentBack">back<v-icon right dark> mdi-arrow-left </v-icon></v-btn>
                        </v-col>
                        <v-col lg="2">
                          <v-btn :disabled="isProcessing" color="blue-grey" class="white--text" @click="searchStorage('SEARCH')">search<v-icon right dark> mdi-magnify </v-icon></v-btn>
                          
                        </v-col>

                        <v-col lg="3" class="d-flex align-end flex-column">
                          <v-chip style="border: 1px solid black" outlined><v-row>  <v-col><p style="color: black">Qty > 0</p></v-col>  <v-col    ><div      style="        height: 20px;        width: 20px;        background-color: #04d945;        border: 0.5px solid black;      "    ></div  ></v-col></v-row>
                          </v-chip>
                        </v-col>
                        <v-col lg="3" class="d-flex align-end flex-column">
                          <v-chip style="border: 1px solid black" outlined><v-row>  <v-col><p style="color: black">Qty = 0</p></v-col>  <v-col    ><div      style="        height: 20px;        width: 20px;        background-color: white;        border: 0.5px solid black;      "    ></div  ></v-col></v-row>
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row    dense    align="center"    justify="space-between"    v-if="mapType == 'rack'">
        <v-col cols="12">
          <v-card>
            <v-container fluid>
              <div class="d-flex flex-column justify-center">
                <v-container fluid class="">
                  <v-row dense justify="space-start">
                    <v-col lg="2" cols="12">
                      <BaseInput
                        :label="$t('item_code')"
                        v-model="item_code2"
                      />
                    </v-col>
                    <v-col lg="2" cols="12">
                      <BaseInput
                        :label="$t('item_name')"
                        v-model="item_name2"
                      />
                    </v-col>

                    <v-col lg="3" cols="12"> <v-slider   style="padding-top: 10px"   v-model="scale2"   append-icon="mdi-magnify-plus-outline"   prepend-icon="mdi-magnify-minus-outline"   :max="1"   :min="0"   step="0.1"   @click:append="zoomIn(2)"   @click:prepend="zoomOut(2)" ></v-slider>
                    </v-col>
                    <v-col  lg="3"  cols="12"  style="padding: 0px"  class="align-start"
                    ></v-col>
                    <v-col  lg="2"  cols="12"  style="padding: 0px"  class="align-start"
                    >
                      <v-row class="d-flex flex-row align-start justify-end">
                        <v-col lg="5">
                          <v-btn  :disabled="isProcessing"  color="blue-grey"  class="white--text"  @click="onCellClick"  >search<v-icon right dark> mdi-magnify</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col lg="5">
                          <v-btn :disabled="isProcessing" color="success" class="white--text" @click="searchStorage('BACK')" >back<v-icon right dark   >mdi-arrow-left-bold-circle</v-icon >
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense align="stretch" justify="space-between">
        <v-col cols="12">
          <v-card outlined >
            <v-container  :height="masterContainerHeight" class="abc">
              <v-row v-if="mapType == 'warehouse'" >
                 <v-card fluid  style="width: 90%">
              <table
                border="1"
                cellspacing="0"
                cellspadding="0"
                style="height: 100%; width: 100%"
              >
                <tr style="background-color:#b7dee8" height="20%">
                  <td colspan="1"><div class="item2">AREA</div></td>
                  <td colspan="3"><div class="item2">STORAGE_TYPE</div></td>
                  <td colspan="2"><div class="item2">TOTAL_LOC</div></td>
                  <td colspan="2"><div class="item2">EMPTY_LOC</div></td>
                  <td colspan="2"><div class="item2">USING_LOC</div></td>
                  <td colspan="2"><div class="item2">USING_PER</div></td>
                  <td colspan="2"><div class="item2">QTY</div></td>
                </tr>
                <tr style="background-color:#ccc0da" height="10%">
                  <td colspan="1"><div class="itemTable2"></div></td>
                  <td colspan="3"><div class="itemTable2">TOTAL</div></td>
                  <td colspan="2"><div class="itemTable2">{{ChildrenTotalObj.TOTAL_LOC==undefined?0:ChildrenTotalObj.TOTAL_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ChildrenTotalObj.EMPTY_LOC==undefined?0:ChildrenTotalObj.EMPTY_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ChildrenTotalObj.USING_LOC==undefined?0:ChildrenTotalObj.USING_LOC.toLocaleString()}}</div></td>
                  <td colspan="2"><div class="itemTable2">{{ChildrenTotalObj.USING_PER!=undefined?ChildrenTotalObj.USING_PER.toFixed(2):0}}%</div></td>
                  <td colspan="2"><div class="itemTable2">{{ChildrenTotalObj.QTY==undefined?0:ChildrenTotalObj.QTY.toLocaleString()}}</div></td>
                </tr>
                <tr v-for="(item, idx) in ChildrenArr" :key="idx" height="10%">
                  <td colspan="1"><v-btn class="item2">{{ item.AREA }}</v-btn></td>
                  <td colspan="3"><v-btn class="item3">{{ item.STORAGE_TYPE }}</v-btn></td>
                  <td colspan="2"><v-btn class="item" @click="onMonitoringClick('TOTAL',item.PK)">{{item.TOTAL_LOC==undefined?0:item.TOTAL_LOC.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="item" @click="onMonitoringClick('EMPTY',item.PK)">{{item.EMPTY_LOC==undefined?0:item.EMPTY_LOC.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="item" @click="onMonitoringClick('USING',item.PK)">{{item.USING_LOC==undefined?0:item.USING_LOC.toLocaleString()}}</v-btn></td>
                  <td colspan="2"><v-btn class="item">{{item.USING_PER!=undefined?item.USING_PER.toFixed(2):0 }}%</v-btn></td>
                  <td colspan="2"><v-btn class="item"  @click="onMonitoringQTYClick(item.PK)">{{item.QTY==undefined?0:item.QTY.toLocaleString()}}</v-btn></td>
                </tr>
              </table>
            </v-card>
              </v-row>
              <v-row  >
              <warehousegroup v-if="mapType == 'warehouse'" :tmp="tmp" :lstBorder="lstBorder" @onclick="onCellClick " :height="detailContainerHeight" :style="     'transform: scale(' +`${mapType == 'warehouse' ? scale : scale2}` + ');transform-origin: top left'" 
              ></warehousegroup>
              <rackgroup v-else-if="mapType == 'rack'" :tmp="tmp" :lstLabels="lstLabels" :labelsTitle="lstRack[0].LOC_NAME" :style="     'transform: scale(' +`${mapType == 'warehouse' ? scale : scale2}` + ');transform-origin: top left'" 
              ></rackgroup>
              </v-row>
             
             
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <dynamic-dialog
      ref="refDynamicDialog"
      :companyPK="this.lstCompany"
      :header="dynamicHeader"
      :codeLabel="codeLabel"
      :nameLabel="nameLabel"
      :dialogTitle="dialogTitle"
      :procedure="procedure"
      :selectionmode="selectionmode"
      :moreParas="moreParas"
      :autoSearch="autoSearch"
      :multiSelectMode="multiSelectMode"
      @returnData="callBackDynamicDialog"
    ></dynamic-dialog>
  </v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
import moment from "moment";
import Warehouse_group from "@/components/part/80/50/8050080_warehouse_group";
import Rack_group from "@/components/part/80/50/8050080_rack_group";
export default {
  /*############### DEFAULT #######################*/
  layout: "default",
  middleware: "user",
  /*############### components ####################*/
  components: {
    warehousegroup: Warehouse_group,
    rackgroup: Rack_group,
    DynamicDialog: () => import("@/components/dialog/DynamicDialog_B"),
  },
  /*############### data ##########################*/
  data: () => ({
    dynamicHeader: [],
    lstStorage: [],
    lstBorder: [],
    lstRack: [],
    lstLabels: [],
    lstParent: [],

    data: null,
    maxRow: 0,
    maxCol: 0,
    mapType: "warehouse",

    item_code: null,
    item_name: null,
    item_code2: null,
    item_name2: null,
    whPK: null,
    storagePK: 0,
    ParentArr: [],
    ParentTotalObj: {},
    ChildrenArr: [],
    ChildrenTotalObj: {},
    transactionsObj: {},

    scale: 0.6,
    scale2: 0.35,

    currentDate: new Date(),

    tmp: [],
    isStart: true,

    //dynamicDialog
    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    selectionmode: "",
    moreParas: null,
    autoSearch: false,
    multiSelectMode: false,
    isStopLooping: false,
    isLooping: false,
    interval: null,
    interval2: null,
    intervalPopup: null,
    promises: null,
    index: 0,
    index2: 0,
    indexSave: 0,
    indexPopup:0,
    dataBefore: [],
  }),
  /*############### created #######################*/
  created() {
    this.parentMonitoring();
    // this.reLoad()
  },
  /*############### watch ######################*/
  watch: {},
  /*############### computed ######################*/
  computed: {
    masterContainerHeight() {
      return this.formContainerHeight;
    },
    detailContainerHeight() {
      return this.formContainerHeight / 2;
    },
  },
  /*############### mounted #######################*/
  mounted() {},

  /*############### methods #######################*/
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.interval2);
    clearInterval(this.intervalPopup);
  },
  methods: {
    async reLoad() {
      if (this.isStart) {
        this.parentMonitoring();
      } else {
        if (this.mapType == "warehouse") {
          this.searchStorage("SEARCH");
        } else {
          this.onCellClick();
        }
      }
      await this.wait(300000);
      this.reLoad();
    },
    onTransactionsClick(transType, type) {
      //this.$refs.grdTaglists.addRow();

      this.moreParas = [moment(this.currentDate).format("YYYYMMDD"), transType];
      // this.moreParas = ['20220809',transType];
      this.dynamicHeader = this.BuildDynamicHeader("trans", type);
      this.dialogTitle = this.$t("transactions");
      this.codeLabel = this.$t("item_code");
      this.nameLabel = this.$t("item_nm");
      this.procedure = "LG_SEL_8050080_7_NOCACHE";
      // this.selectionmode = "checkbox";

      this.autoSearch = true;
      this.multiSelectMode = false;
      this.$refs.refDynamicDialog.dialogIsShow = true;
    },
    onMonitoringClick(action, pk) {
      //this.$refs.grdTaglists.addRow();

      this.moreParas = [22134, pk, action];

      this.dynamicHeader = this.BuildDynamicHeader("loc");
      this.dialogTitle = this.$t("wms");
      this.codeLabel = this.$t("item_code");
      this.nameLabel = this.$t("item_nm");
      this.procedure = "LG_SEL_8050080_2";
      // this.selectionmode = "checkbox";

      this.autoSearch = true;
      this.multiSelectMode = false;
      this.$refs.refDynamicDialog.dialogIsShow = true;
    },
    onMonitoringQTYClick(pk) {
      this.moreParas = [22134, pk];
      this.dynamicHeader = this.BuildDynamicHeader("qty");
      this.dialogTitle = this.$t("wms QTY");
      this.codeLabel = this.$t("item_code");
      this.nameLabel = this.$t("item_nm");
      this.procedure = "LG_SEL_8050080_5";
      // this.selectionmode = "checkbox";

      this.autoSearch = true;
      this.multiSelectMode = false;
      this.$refs.refDynamicDialog.dialogIsShow = true;
    },
    BuildDynamicHeader(type, transType) {
      let header = [];
      switch (type) {
        case "loc":
          header = [
            { field: "INDEX", width: 50, title: "No", alignment: "center" },
            { field: "AREA", width: 100, title: "area", alignment: "center" },
            {  field: "RACK_NAME",  width: 100,  title: "rack_nm",  alignment: "left",},
            {  field: "RACK_NO",  width: 100,  title: "rack_no",  alignment: "right", type:'number'},
            {  field: "LOC_ID",  width: 150,  title: "loc_id",  alignment: "left",},
            {  field: "LOC_NAME",  width: 150,  title: "loc_nm",  alignment: "left",},
            {  field: "STOCK_QTY",  width: 150,  title: "qty",  alignment: "right",type:'number'},
          ];
          break;
        case "qty":
          header = [{ field: "INDEX", width: 50, title: "No", alignment: "center" },
          {  field: "STORAGE_NAME",  width: 150,  title: "storage",  alignment: "center",},
          {  field: "LOC_ID",  width: 150,  title: "location",  alignment: "center",},
          {  field: "ITEM_CODE",  width: 80,  title: "item_code",  alignment: "left",},
          {  field: "ITEM_NAME",  width: 80,  title: "item_name",  alignment: "left",},
          {  field: "LOT_NO",  width: 80,  title: "lot_no",  alignment: "left",},
          {  field: "PALLET_NO",  width: 80,  title: "pallet_no",  alignment: "left",},
          {  field: "INCOME_DATE",  width: 100,  title: "income_date",  alignment: "left",},
          { field: "UOM", width: 80, title: "uom", alignment: "center" },
          {  field: "STOCK_QTY",  width: 150,  title: "qty",  alignment: "right",type:'number'},
          ];
          break;
        case "trans":
          if (transType == "all") {
            header = [
              { field: "INDEX", width: 50, title: "seq", alignment: "center" },
              {  field: "TRANSACTION",  width: 100,  title: "transaction",  alignment: "left",},
              {  field: "SLIP_STATUS",  width: 100,  title: "slip_status",  alignment: "left",},
              {  field: "SLIP_NO",  width: 100,  title: "slip_no",  alignment: "right",type:'number'},
              {  field: "STORAGE",  width: 100,  title: "storage",  alignment: "center",},
              {  field: "LOCATION",  width: 100,  title: "location",  alignment: "center",},
              {  field: "ITEM_CODE",  width: 100,  title: "item_code",  alignment: "left",},
              {  field: "ITEM_NAME",  width: 100,  title: "item_name",  alignment: "left",},
              { field: "UOM", width: 80, title: "uom", alignment: "center" },
              {  field: "INPUT_QTY",  width: 100,  title: "input_qty",  alignment: "right",type:'number'},
              {  field: "OUTPUT_QTY",  width: 100,  title: "output_qty",  alignment: "right",type:'number'},
            ];
          } else {
            header = [
              { field: "INDEX", width: 50, title: "seq", alignment: "center" },
              {  field: "TRANSACTION",  width: 100,  title: "transaction",  alignment: "left",},
              {  field: "SLIP_STATUS",  width: 100,  title: "slip_status",  alignment: "left",},
              {  field: "SLIP_NO",  width: 100,  title: "slip_no",  alignment: "right",},
              {  field: "STORAGE",  width: 100,  title: "storage",  alignment: "center",},
              {  field: "LOCATION",  width: 100,  title: "location",  alignment: "center",},
              {  field: "ITEM_CODE",  width: 100,  title: "item_code",  alignment: "left",},
              {  field: "ITEM_NAME",  width: 100,  title: "item_name",  alignment: "left",},
              { field: "UOM", width: 80, title: "uom", alignment: "center" },
              { field: "QTY", width: 100, title: "qty", alignment: "right",type:'number' },
            ];
          }

          break;
        default:
          break;
      }

      return header;
    },
    parentBack() {
      this.isStart = true;
      if (this.isLooping) {
        this.isLooping = false;
        this.onClearInterval();
      }
    },
    callBackDynamicDialog(item) {
      let selectedRows = item;
    },
    async onCellClick(celData) {
      let param = [];
      if (this.whPK == null) {
        if (celData.Role == "child") {
          param = [celData.PARENT_PK, this.item_code, this.item_name];
          this.whPK = celData.PARENT_PK;
        } else {
          if (celData.Role == "sub_parent2") {
            param = [celData.PK, this.item_code, this.item_name];
            this.whPK = celData.PK;
          } else param == [];
        }
      } else {
        this.onClearInterval2()
        param = [this.whPK, this.item_code2, this.item_name2];
      }
      if (param.length != 0) {
        const dso = {
          type: "grid",
          selpro: "LG_SEL_8050080_3",
          para: param,
        };
        this.lstRack = await this._dsoCall(dso, "select", false);
        let tlgInPKArray=[]
        this.lstRack.forEach(e => {
          tlgInPKArray.push(e['TLG_IN_STORAGE_PK'])
        });
        tlgInPKArray=[...new Set(tlgInPKArray)]
        let rowArr = [];
        let colArr = [];
        this.lstRack.forEach((_e) => {
          rowArr.push(_e.R);
          colArr.push(_e.C);
        });

        let min = this._Min(rowArr);
        let max = this._Max(rowArr);
        let minCol = this._Min(colArr);
        let maxCol = this._Max(colArr);
        let tmpArr = [];
        for (let i = 0; i <= max; i++) {
          let _row = this.lstRack.filter((q) => q["R"] == i);

          let _arr = [];
          for (let j = 0; j <= maxCol; j++) {
            _arr.push({ R: i, C: j });
            if (_row.findIndex((q) => q["C"] == j) < 0) {
              _row.push({ R: i, C: j });
            }
          }
          _row = _row.length > 0 ? _.sortBy(_row, "C") : _arr;
          _row.forEach((e) => {
            e["Border"] = e.TLG_IN_STORAGE_PK == celData.PK ? "Y" : "N";
          });

          tmpArr.push(_row);
        }
       this.dataSetter(tmpArr, "rack");
       //this.automaticMonitoring2(tlgInPKArray, tmpArr);
        this.lstLabels = [...new Set(colArr)];
      } else {
        alert("nothing");
      }
    },
    async parentMonitoring() {
      if (this.isLooping) {
        this.isLooping = false;
        this.onClearInterval();
      }

      this.lstStorage = [];
      this.lstParent = [];
      this.ParentArr = [];
      let param = [22134, this.item_code, this.item_name, 0];
      let _parents = [];
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8050080_4",
        para: param,
      };

      let param2 = [moment(this.currentDate).format("YYYYMMDD")];

      const dso2 = {
        type: "grid",
        selpro: "LG_SEL_8050080_6",
        para: param2,
      };

      this.lstStorage = await this._dsoCall(dso, "select", false);
      let transactions = await this._dsoCall(dso2, "select", false);

      this.transactionsObj = {
        PROD_IN_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.PROD_IN_QTY;
        }, 0),
        INCOME_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.INCOME_QTY;
        }, 0),
        OUTGO_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.OUTGO_QTY;
        }, 0),
        TRANS_IN_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.TRANS_IN_QTY;
        }, 0),
        TRANS_OUT_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.TRANS_OUT_QTY;
        }, 0),
        DELI_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.DELI_QTY;
        }, 0),
        ALL_QTY: transactions.reduce((accumulator, object) => {
          return accumulator + object.ALL_QTY;
        }, 0),
      };

      let familiesArr = this.familiesGen(this.lstStorage);
      this.lstParent.forEach((_e, i) => {
        _parents.push({ name: _e.STORAGE_NAME, pk: _e.PK, data: [] });
        familiesArr.forEach((e) => {
          if (e.find((q) => q["LVL"] == 2).PARENT_PK == _e.PK) {
            _parents[i]["data"].push(e);
          }
        });
      });
      _parents.forEach((e, i) => {
        let locCount = 0;
        let qty = 0;
        let emptyCount = 0;
        let usingCount = 0;
        let usingPer = 0;
        e["data"].forEach((_e) => {
          locCount += _e.reduce((accumulator, object) => {
            return accumulator + object.ALL_QTY;
          }, 0);
          emptyCount += _e.reduce((accumulator, object) => {
            return accumulator + object.FREE_QTY;
          }, 0);
          usingCount += _e.reduce((accumulator, object) => {
            return accumulator + object.USE_QTY;
          }, 0);
          qty += _e.reduce((accumulator, object) => {
            return accumulator + object.STOCK_QTY;
          }, 0);
        });
        usingPer = usingCount == 0 ? 0 : (usingCount / locCount) * 100;
        let parentObj = {
          SEQ: i + 1,
          STORAGE_TYPE: e.name,
          TOTAL_LOC: locCount,
          EMPTY_LOC: emptyCount,
          USING_LOC: usingCount,
          USING_PER: usingPer,
          QTY: qty,
          PK: e.pk,
        };

        this.ParentArr.push(parentObj);
      });
      this.ParentTotalObj = {
        TOTAL_LOC: this.ParentArr.reduce((accumulator, object) => {
          return accumulator + object.TOTAL_LOC;
        }, 0),
        EMPTY_LOC: this.ParentArr.reduce((accumulator, object) => {
          return accumulator + object.EMPTY_LOC;
        }, 0),
        USING_LOC: this.ParentArr.reduce((accumulator, object) => {
          return accumulator + object.USING_LOC;
        }, 0),
        USING_PER:
          (this.ParentArr.reduce((accumulator, object) => {
            return accumulator + object.USING_LOC;
          }, 0) /
            this.ParentArr.reduce((accumulator, object) => {
              return accumulator + object.TOTAL_LOC;
            }, 0)) *
          100,
        QTY: this.ParentArr.reduce((accumulator, object) => {
          return accumulator + object.QTY;
        }, 0),
      };
    },

    async searchStorage(action) {
      this.ChildrenArr = [];
      let popupArray=[]
      if (action == "BACK") {
        this.whPK = null;
        this.onClearInterval2()
      }
      this.isProcessing = true;
      this.tmp = [];
      let param = [22134, this.item_code, this.item_name, this.storagePK];
      const dso = {
        type: "grid",
        selpro: "LG_SEL_8050080_4",
        para: param,
      };
      let rowArr = [];
      let colArr = [];
      this.lstStorage = await this._dsoCall(dso, "select", false);
      let test = [];
      //console.log(this.lstStorage)
      let familiesArr = this.familiesGen(this.lstStorage);

      let storage_type = this.lstStorage.find(
        (q) => q["LVL"] == 1
      ).STORAGE_NAME;
      familiesArr.forEach((e, i) => {
        let locCount = 0;
        let qty = 0;
        let emptyCount = 0;
        let usingCount = 0;
        let usingPer = 0;
        //let storage_name=e.find((q) => q["LVL"] == 1).STORAGE_NAME
        let name = e.find((q) => q["LVL"] == 2).NAME;
        let pk = e.find((q) => q["LVL"] == 2).PK;
        popupArray.push(pk)
        e.forEach((_e) => {
          locCount += _e.ALL_QTY;
          emptyCount += _e.FREE_QTY;
          usingCount += _e.USE_QTY;
          qty += _e.STOCK_QTY;
        });
        usingPer = usingCount == 0 ? 0 : (usingCount / locCount) * 100;

        let childrenObj = {
          AREA: name,
          STORAGE_TYPE: storage_type,
          TOTAL_LOC: locCount,
          EMPTY_LOC: emptyCount,
          USING_LOC: usingCount,
          USING_PER: usingPer,
          QTY: qty,
          PK: pk,
        };

        this.ChildrenArr.push(childrenObj);
      });
      // console.log(this.ChildrenArr)
      this.ChildrenTotalObj = {
        TOTAL_LOC: this.ChildrenArr.reduce((accumulator, object) => {
          return accumulator + object.TOTAL_LOC;
        }, 0),
        EMPTY_LOC: this.ChildrenArr.reduce((accumulator, object) => {
          return accumulator + object.EMPTY_LOC;
        }, 0),
        USING_LOC: this.ChildrenArr.reduce((accumulator, object) => {
          return accumulator + object.USING_LOC;
        }, 0),
        USING_PER:
          (this.ChildrenArr.reduce((accumulator, object) => {
            return accumulator + object.USING_LOC;
          }, 0) /
            this.ChildrenArr.reduce((accumulator, object) => {
              return accumulator + object.TOTAL_LOC;
            }, 0)) *
          100,
        QTY: this.ChildrenArr.reduce((accumulator, object) => {
          return accumulator + object.QTY;
        }, 0),
      };

      this.lstStorage.forEach((_e) => {
        rowArr.push(_e.R);
        colArr.push(_e.C);
        _e["Border"] = "N";
        if (_e.LEAF_YN == "Y") {
          test.push(_e.PARENT_PK);
          _e["Role"] = "child";
        } else {
          if (_e.PARENT_PK == 0) {
            _e["Role"] = "parent";
          } else {
            if (_e.LVL == 2) {
              _e["Role"] = "sub_parent";
            } else {
              _e["Role"] = "sub_parent2";
            }
          }
        }
      });

      let min = this._Min(rowArr);
      let max = this._Max(rowArr);
      let minCol = this._Min(colArr);
      let maxCol = this._Max(colArr);
      let tmpArr = [];
      for (let i = min; i <= max + 1; i++) {
        let _row = this.lstStorage.filter((q) => q["R"] == i);

        let _arr = [];
        for (let j = minCol; j <= maxCol + 1; j++) {
          _arr.push({ R: i, C: j });
          if (_row.findIndex((q) => q["C"] == j) < 0) {
            _row.push({ R: i, C: j });
          }
        }
        _row = _row.length > 0 ? _.sortBy(_row, "C") : _arr;
        tmpArr.push(_row);
      }
      // this.borderGen(this.lstStorage, rowArr, colArr, "warehouse", tmpArr);
      // let subParentArray = this.lstStorage.filter((x) => x["Role"] == "sub_parent2");
      // let automaticArray = [];
      // subParentArray.forEach((e) => {
      //   automaticArray.push({ Name: e.NAME, Pk: e.PK });
      // });
      // console.log("aAAA+index",this.dataBefore+"-"+this.index)
      // if(this.dataBefore.length<=0)
      // { 
       
      //  this.onSetIntervalPopup(popupArray,automaticArray,tmpArr)
      //  }
      // else{
      //   this.automaticMonitoring(automaticArray, tmpArr);
      // }
     
      this.dataSetter(tmpArr,'warehouse')
      //this.automaticMonitoring(automaticArray, tmpArr);
    },

    async automaticMonitoring(data, tmpArr) {
      
      this.isLooping = true;
      if(this.dataBefore.length>0){
        this.dataSetter(this.dataBefore, "warehouse");
      }
      this.onSetInterval(data, tmpArr);
    },
    async automaticMonitoring2(data, tmpArr) {
       
      this.onSetInterval2(data, tmpArr);
    },

    onSetInterval(data, tmpArr) {
          if (this.index >= data.length) {
          this.onClearInterval();
          this.dataBefore=[]
          this.searchStorage("SEARCH");
         // console.log(this.index+"-aaa-"+data.length-1)
        }else{
      // console.log(this.index+"-"+data.length)
      this.interval = setInterval(() => {
        let cellData = [];
        let e = data[this.index++];
         if (this.index == 1) {
          this.dataBefore = tmpArr;
        }
        if (this.isLooping) {
          let dataWithBorder = JSON.parse(JSON.stringify(tmpArr));
          dataWithBorder.forEach((_e, j) => {
            _e.forEach((_e_) => {
              if (_e_.PARENT_PK != undefined && _e_.PARENT_PK == e.Pk) {
                _e_.Border = "Y";
                cellData=_e_
              }
            });
          });
          this.dataBefore = dataWithBorder;
          setTimeout(() => {
            this.dataSetter(dataWithBorder, "warehouse");
            this.whPK = null;
          }, 1000);
          setTimeout(() => {
            this.onSaveIndex()
            this.onCellClick(cellData)
          }, 1000);
       
          
        }
      }, 3000);
        }

    },
    onClearInterval() {
      clearInterval(this.interval);
      this.index = 0;
     // this.dataBefore = [];
    },
    onSaveIndex(){
      this.indexSave=this.index
      this.onClearInterval()
    },

    onSetInterval2(data, tmpArr) {
     
      this.interval2 = setInterval(() => { 
    
        let e = data[this.index2];
          let dataWithBorder = JSON.parse(JSON.stringify(tmpArr));
          dataWithBorder.forEach((_e, j) => {
              _e.forEach((_e_) => {
              if (_e_.TLG_IN_STORAGE_PK != undefined) {
                _e_["Border"] = e == _e_.TLG_IN_STORAGE_PK ? "Y" : "N";
              }
            });
          });
            this.dataSetter(dataWithBorder, "rack");
        if (this.index2 >=data.length) {
          this.index=this.indexSave
          this.indexSave=0
          this.searchStorage("BACK");
        }else{
          this.index2++
        }
            
   
      }, 2500);
    },
    onClearInterval2() {
      clearInterval(this.interval2);
      this.index2 = 0;
    },
   onSetIntervalPopup(data,automaticArray,tmpArr) {
   
      this.intervalPopup = setInterval(async () => {
 
      
      let e = data[this.indexPopup];
      this.onMonitoringQTYClick(e)
      await this.wait(4000)
       this.$refs.refDynamicDialog.dialogIsShow = false;
      if(this.indexPopup>=data.length-1){
      this.onClearIntervalPopup(automaticArray,tmpArr)
      }else{
      this.indexPopup++
      }
      
      }, 5000);
    
      
    },
     onClearIntervalPopup(automaticArray,tmpArr) {
      clearInterval(this.intervalPopup);
      this.indexPopup=0
      
      this.automaticMonitoring(automaticArray, tmpArr);
    },
    dataSetter(tmpArr, mapType) {
      this.mapType = mapType;
      this.tmp = tmpArr;
    },
    onParentClick(item) {
      this.isStart = false;
      this.storagePK = item.PK;
      this.searchStorage("SEARCH");
    },

    familiesGen(allData) {
      let data = JSON.parse(JSON.stringify(allData));
      let allArr = [];
      let subParentArr = [];
      let childrensArr = [];
      let familiesArr = [];

      data.forEach((e) => {
        if (e.PARENT_PK == 0) {
          this.lstParent.push(e);
        } else {
          let lvl =
            data.find((q) => q["PK"] == e.PARENT_PK && q["PARENT_PK"] == 0) !=
            undefined
              ? data.find((q) => q["PK"] == e.PARENT_PK && q["PARENT_PK"] == 0)
                  .LVL + 1
              : 0;
          if (e.LVL == lvl) {
            subParentArr.push(e);
          } else {
            childrensArr.push(e);
          }
        }
      });
      // console.log(_.groupBy(data, "PARENT_PK"))
      data = _.groupBy(data, "LVL");
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          allArr.push(element);
        }
      }
      subParentArr.forEach((e) => {
        let subParent = [];
        subParent.push(e);
        for (let i = 0; i < childrensArr.length; i++) {
          const _e = childrensArr[i];
          if (_e.PARENT_PK == e.PK) {
            subParent.push(_e);
            if (_e.LEAF_YN != "Y") {
              let abc = childrensArr.filter((q) => q["PARENT_PK"] == _e.PK);
              abc.forEach((_u) => {
                subParent.push(_u);
              });
            }
          }
        }
        familiesArr.push(subParent);
      });

      return familiesArr;
    },

    borderGen(allData, mapType, tmpArr) {
      let rowColRanges = [];
      let minMaxColRows = [];

      let familiesArr = this.familiesGen(allData);
      familiesArr.forEach((e) => {
        let _rowArr = [];
        let _colArr = [];
        e.forEach((_e) => {
          if (_e.R != null) {
            _rowArr.push(_e.R);
          }
          if (_e.C != null) {
            _colArr.push(_e.C);
          }
        });
        rowColRanges.push({ _rowArr: _rowArr, _colArr: _colArr });
      });

      rowColRanges.forEach((e) => {
        let rMin = null;
        let rMax = null;
        let cMin = null;
        let cMax = null;
        if (e._rowArr.length != 0) {
          rMin = this._Min(e._rowArr);
          rMax = this._Max(e._rowArr);
        }
        if (e._colArr.length != 0) {
          cMin = this._Min(e._colArr);
          cMax = this._Max(e._colArr);
        }

        minMaxColRows.push({
          rMin: rMin - 1,
          rMax: rMax + 1,
          cMin: cMin,
          cMax: cMax + 1,
        });
      });
      //console.log(minMaxColRows)
      this.lstBorder = [];
      minMaxColRows.forEach((e) => {
        //console.log(e)
        for (let i = e.cMin + 1; i < e.cMax; i++) {
          this.lstBorder.push({
            R: e.rMin,
            C: i,
            Border: "border-top:3px dashed  black ;",
          });
          this.lstBorder.push({
            R: e.rMax,
            C: i,
            Border: "border-bottom:3px dashed  black ;",
          });
        }

        for (let i = e.rMin; i <= e.rMax; i++) {
          if (i == e.rMin) {
            this.lstBorder.push({
              R: i,
              C: e.cMax,
              Border:
                "border-right:3px dashed  black ;border-top:3px dashed  black ;",
            });
            this.lstBorder.push({
              R: i,
              C: e.cMin,
              Border:
                "border-left:3px dashed  black;border-top:3px dashed  black ;",
            });
          } else if (i == e.rMax) {
            this.lstBorder.push({
              R: i,
              C: e.cMax,
              Border:
                "border-right:3px dashed  black ;border-bottom:3px dashed  black ;",
            });
            this.lstBorder.push({
              R: i,
              C: e.cMin,
              Border:
                "border-left:3px dashed  black;border-bottom:3px dashed  black ;",
            });
          } else {
            this.lstBorder.push({
              R: i,
              C: e.cMax,
              Border: "border-right:3px dashed  black ;",
            });
            this.lstBorder.push({
              R: i,
              C: e.cMin,
              Border: "border-left:3px dashed  black;",
            });
          }
        }
      });

      this.dataSetter(tmpArr, mapType);
    },
    zoomOut(x) {
      if (x == 2) {
        this.scale2 = this.scale2 - 0.01;
      } else {
        this.scale = this.scale - 0.01;
      }
    },
    zoomIn(x) {
      if (x == 2) {
        this.scale2 = this.scale2 + 0.1;
      } else {
        this.scale = this.scale + 0.1;
      }
    },
  },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->
<style>
.abc {
  overflow-x: auto;
}
.itemTable {
  display: flex;
  align-items: right;
  justify-content: right;
  height: 100% !important;
  width: 100% !important;
  text-align: right;
  font-size: 40px;
}
.itemTable3 {
  display: flex;
  align-items: left;
  justify-content: left;
  height: 100% !important;
  width: 100% !important;
  text-align: left;
  font-size: 40px;
}
.itemTable2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100% !important;
  width: 100% !important;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
}
.item {
  display: flex;
  align-items: right;
  justify-content: right;
  height: 100% !important;
  width: 100% !important;
  text-align: right;
  font-size: 15px;
}
.item3 {
  display: flex;
  align-items: left;
  justify-content: left;
  height: 100% !important;
  width: 100% !important;
  text-align: left;
  font-size: 15px;
}
.item2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100% !important;
  width: 100% !important;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
}
.abc ::-webkit-scrollbar {
  background: #fff;
  width: 150px;
  height: 150px;
}
</style>
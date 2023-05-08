<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!--Phần Search Master-->
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="start">
                  <v-col md="2" sm="2" cols="2">
                    <v-select
                      dense
                      cache-items
                      hide-details
                      outlined
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('company')"
                      :items="companyList"
                      v-model="selectedCompany"
                    ></v-select>
                  </v-col>
                  <v-col md="2" sm="3" cols="2">
                    <v-text-field
                      clearable
                      dense
                      hide-details
                      outlined
                      :label="$t('acntid')"
                      v-model="acntCodeID"
                    ></v-text-field>
                  </v-col>
                  <v-col md="2" sm="3" cols="2">
                    <v-text-field
                      clearable
                      dense
                      hide-details
                      outlined
                      :label="$t('acntname')"
                      v-model="acntCodeName"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    md="3"
                    sm="1"
                    cols="3"
                    class="text-left text-caption"
                    v-bind:style="styleObject"
                  >
                    {{this.totalRecords}} record(s) / MaxID: {{this.maxAcntID}}
                  </v-col>
                  <v-col md="3" sm="1" cols="4" class="text-right">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearchMaster()" />
                      <!-- Add -->
                      <BaseButton
                        icon_type="add_new"
                        :btn_text="$t('btn_add')"
                        @onclick="onAddAcntMaster()"
                      />

                      <!-- Save -->
                      <BaseButton
                        icon_type="save"
                        :btn_text="$t('save')"
                        @onclick="onSaveMaster()"
                      />

                      <!-- Delete -->
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete')"
                        @onclick="onDeleteAcntMaster()"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!--Phần DataGrid Master-->
        <v-row justify="start" v-if="showGridMaster">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                column-resizing-mode="widget"
                ref="gridMaster"
                :auto_load="false"
                select_mode="Multiple"
                :max_height="limitHeight"
                @cellClick="onSelectionAcntID"
                @row-updated="checkUpdatedAcntMaster"
                :header="[
                  { dataField: 'ID', caption: $t('acntid'), allowEditing: true, },
                  { dataField: 'CODE_NM', caption: this.$t('acntname'), allowEditing: true, },
                  { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, cssclass:'cell-align-center', dataType:'checkbox' },
                  { dataField: 'REMARK', caption: this.$t('remark'), allowEditing: true, },
                  { dataField: 'NM1_NAME', caption: this.$t('num_1_name'), allowEditing: true, },
                  { dataField: 'NM2_NAME', caption: this.$t('num_2_name'), allowEditing: true, },
                  { dataField: 'NM3_NAME', caption: this.$t('num_3_name'), allowEditing: true, },
                  { dataField: 'NM4_NAME', caption: this.$t('num_4_name'), allowEditing: true, },
                  { dataField: 'NM5_NAME', caption: this.$t('num_5_name'), allowEditing: true, },
                  { dataField: 'NM6_NAME', caption: this.$t('num_6_name'), allowEditing: true, },
                  { dataField: 'NM7_NAME', caption: this.$t('num_7_name'), allowEditing: true, },
                  { dataField: 'NM8_NAME', caption: this.$t('num_8_name'), allowEditing: true, },
                  { dataField: 'NM9_NAME', caption: this.$t('num_9_name'), allowEditing: true, },
                  { dataField: 'NM10_NAME', caption: this.$t('num_10_name'), allowEditing: true, },
                  { dataField: 'CH1_NAME', caption: this.$t('cha_1_name'), allowEditing: true, },
                  { dataField: 'CH2_NAME', caption: this.$t('cha_2_name'), allowEditing: true, },
                  { dataField: 'CH3_NAME', caption: this.$t('cha_3_name'), allowEditing: true, },
                  { dataField: 'CH4_NAME', caption: this.$t('cha_4_name'), allowEditing: true, },
                  { dataField: 'CH5_NAME', caption: this.$t('cha_5_name'), allowEditing: true, },
                  { dataField: 'CH6_NAME', caption: this.$t('cha_6_name'), allowEditing: true, },
                  { dataField: 'CH7_NAME', caption: this.$t('cha_7_name'), allowEditing: true, },
                  { dataField: 'CH8_NAME', caption: this.$t('cha_8_name'), allowEditing: true, },
                  { dataField: 'CH9_NAME', caption: this.$t('cha_9_name'), allowEditing: true, },
                  { dataField: 'CH10_NAME', caption: this.$t('cha_10_name'), allowEditing: true, },
                  { dataField: 'SYS_YN', caption: this.$t('sys_yn'), allowEditing: true, },
                ]"
                @setDataSource="onAfterLoadMaster"
                sel_procedure="ac_sel_6010010_acntidmaster"
                :filter_paras="[
                  this.acntCodeID, this.acntCodeName, this.selectedCompany
                ]"
                upd_procedure="ac_upd_6010010_acntidmaster" 
                :update_paras="[
                                'PK', 
                                'ID', 
                                'CODE_NM', 
                                'USE_YN', 
                                'REMARK', 
                                'NM1_NAME', 
                                'NM2_NAME', 
                                'NM3_NAME', 
                                'NM4_NAME', 
                                'NM5_NAME', 
                                'NM6_NAME',
                                'NM7_NAME', 
                                'NM8_NAME', 
                                'NM9_NAME', 
                                'NM10_NAME', 
                                'CH1_NAME', 
                                'CH2_NAME', 
                                'CH3_NAME', 
                                'CH4_NAME', 
                                'CH5_NAME', 
                                'CH6_NAME', 
                                'CH7_NAME', 
                                'CH8_NAME', 
                                'CH9_NAME', 
                                'CH10_NAME', 
                                'SYS_YN',
                                'TCO_COMPANY_PK' 
                ]"
              />
            </v-card>
          </v-col>
        </v-row>
        <!--Phần Search Details-->
        <v-row justify="start">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="start">
                  <v-col md="3" sm="3" cols="12">
                    <v-btn text icon color="red lighten-2" @click="onShowFullDetails">
                      <v-icon color="orange darken-2">{{ this.myIcon}}</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col md="2" sm="3" cols="12">
                    <v-text-field
                      clearable
                      dense
                      hide-details
                      outlined
                      :label="$t('acntcode')"
                      v-model="detailCode"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    md="5"
                    sm="1"
                    cols="3"
                    class="text-left text-caption"
                    v-bind:style="styleObject"
                  >Name: {{this.focusedAcntName}}</v-col>

                  <v-col md="2" sm="1" cols="3" class="text-right">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onSearchDetails()" />
                      <!-- Add -->
                      <BaseButton
                        icon_type="add_new"
                        :btn_text="$t('btn_add')"
                        @onclick="onAddDetail()"
                      />

                      <!-- Save -->
                      <BaseButton
                        icon_type="save"
                        :btn_text="$t('save')"
                        @onclick="onSaveDetail()"
                      />

                      <!-- Delete -->
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete')"
                        @onclick="markDeleteDetails()"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!--Phần DataGrid Detail-->
        <v-row justify="start">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                column-resizing-mode="widget"
                ref="gridDetail"
                :auto_load="false"
                select_mode="Multiple"
                :max_height="limitHeightGridDetails"
                @row-updated="checkUpdatedAcntDetail"
                :header="[ { dataField: 'ORD', caption: $t('ord'), allowEditing: true, },
                  { dataField: 'USE_YN', caption: this.$t('use_yn'), allowEditing: true, cssclass:'cell-align-center', dataType:'checkbox' },
                  { dataField: 'CODE', caption: this.$t('dtl_code'), allowEditing: true, },
                  { dataField: 'CODE_NM', caption: this.$t('dtl_name'), allowEditing: true, },
                  { dataField: 'CODE_LNM', caption: this.$t('dtl_lname'), allowEditing: true, },
                  { dataField: 'CODE_FNM', caption: this.$t('dtl_fname'), allowEditing: true, },
                  { dataField: 'NM1_NAME', caption: this.$t('num_1_name'), allowEditing: true, },
                  { dataField: 'NM2_NAME', caption: this.$t('num_2_name'), allowEditing: true, },
                  { dataField: 'NM3_NAME', caption: this.$t('num_3_name'), allowEditing: true, },
                  { dataField: 'NM4_NAME', caption: this.$t('num_4_name'), allowEditing: true, },
                  { dataField: 'NM5_NAME', caption: this.$t('num_5_name'), allowEditing: true, },
                  { dataField: 'NM6_NAME', caption: this.$t('num_6_name'), allowEditing: true, },
                  { dataField: 'NM7_NAME', caption: this.$t('num_7_name'), allowEditing: true, },
                  { dataField: 'NM8_NAME', caption: this.$t('num_8_name'), allowEditing: true, },
                  { dataField: 'NM9_NAME', caption: this.$t('num_9_name'), allowEditing: true, },
                  { dataField: 'NM10_NAME', caption: this.$t('num_10_name'), allowEditing: true, },
                  { dataField: 'CH1_NAME', caption: this.$t('cha_1_name'), allowEditing: true, },
                  { dataField: 'CH2_NAME', caption: this.$t('cha_2_name'), allowEditing: true, },
                  { dataField: 'CH3_NAME', caption: this.$t('cha_3_name'), allowEditing: true, },
                  { dataField: 'CH4_NAME', caption: this.$t('cha_4_name'), allowEditing: true, },
                  { dataField: 'CH5_NAME', caption: this.$t('cha_5_name'), allowEditing: true, },
                  { dataField: 'CH6_NAME', caption: this.$t('cha_6_name'), allowEditing: true, },
                  { dataField: 'CH7_NAME', caption: this.$t('cha_7_name'), allowEditing: true, },
                  { dataField: 'CH8_NAME', caption: this.$t('cha_8_name'), allowEditing: true, },
                  { dataField: 'CH9_NAME', caption: this.$t('cha_9_name'), allowEditing: true, },
                  { dataField: 'CH10_NAME', caption: this.$t('cha_10_name'), allowEditing: true, },
                  { dataField: 'SYS_YN', caption: this.$t('sys_yn'), allowEditing: true, },
                ]"
                sel_procedure="ac_sel_6010010_acntid_details"
                :filter_paras="[
                  this.acntId_Pk, this.detailCode
                ]"
                upd_procedure="ac_upd_6010010_acntid_details" 
                :update_paras="[
                                'PK', 
                                'TAC_COMMCODE_MASTER_PK', 
                                'ORD', 
                                'DEF_YN', 
                                'CODE', 
                                'CODE_NM', 
                                'CODE_LNM', 
                                'CODE_FNM', 
                                'NUM_1', 
                                'NUM_2', 
                                'NUM_3',
                                'NUM_4', 
                                'NUM_5', 
                                'NUM_6', 
                                'NUM_7', 
                                'NUM_8', 
                                'NUM_9', 
                                'NUM_10', 
                                'CHAR_1', 
                                'CHAR_2', 
                                'CHAR_3', 
                                'CHAR_4', 
                                'CHAR_5', 
                                'CHAR_6', 
                                'CHAR_7', 
                                'CHAR_8', 
                                'CHAR_9', 
                                'CHAR_10', 
                                'USE_YN', 
                                'REMARK'
                ]"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <delete-dialog ref="deleteDialogMaster" :deleteProps="deletePropsMaster" @returnDeletedItem="removeDeletedItemMaster"></delete-dialog>
    
  </v-container>
</template>

<script>
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import moment from "moment";

export default {

  layout: "default",
  middleware: "user",

  components: {
    CellGridCheckbox,
    DeleteDialog
  },

  data: () => ({
    // data v-select
    companyList: [],
    selectedCompany: "",
    selectedItemKeys: [],

    // Search Options
    acntCodeID: "",
    acntCodeName: "",
    showGridMaster: true,
    detailCode: "",
    acntId_Pk: 0,
    maxAcntID: "",

    //selected rows
    selectedItemKeysMaster: [],
    selectedItemKeysDetail: [],

    //focused row key
    focusedRowKeyMaster: "",
    focusedRowKeyDetail: -1,

    // Table Data
    checkBoxesMode: 'none',
    listAcntID: [],
    listAcntDetails: [],
    selectionMode: "",

    //Delete dialog confirm
    deleteDialogMaster: false,
    deleteConfirm: false,
    deletePropsMaster: [],
    deleteDialogDetail: false,
    deletePropsDetail: [],

    //labels
    totalRecords: 0,
    maxID: "",
    focusedAcntName: "",

    //button icon
    myIcon: "mdi-arrow-down-bold-box-outline",

    //height limit
    decreaseHeight: 170,
    limitHeightGridDetails: 50,
    styleObject: {
    color: 'red',
    fontSize: '40px',
    fontWeight:'800',
    }
  
  }),

  created() {
    this.getCompanyList();
  },

  computed: {
    getUser: function() {
      return this.$store.getters["auth/user"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },

    limitHeight() {
      return this.windowHeight - (320 + this.decreaseHeight);
    }
  },

  methods: {

    // Search master
    onSearchMaster() {
      this.getAcntIDList();
    },

    //add new master
    onAddAcntMaster() {
       this.$refs.gridMaster.addRowStruct({
                          PK: '', 
                          ID: '', 
                          CODE_NM: '', 
                          USE_YN: '', 
                          REMARK: '', 
                          NM1_NAME: '', 
                          NM2_NAME: '', 
                          NM3_NAME: '', 
                          NM4_NAME: '', 
                          NM5_NAME: '', 
                          NM6_NAME: '',
                          NM7_NAME: '', 
                          NM8_NAME: '', 
                          NM9_NAME: '', 
                          NM10_NAME: '', 
                          CH1_NAME: '', 
                          CH2_NAME: '', 
                          CH3_NAME: '', 
                          CH4_NAME: '', 
                          CH5_NAME: '', 
                          CH6_NAME: '', 
                          CH7_NAME: '', 
                          CH8_NAME: '', 
                          CH9_NAME: '', 
                          CH10_NAME: '', 
                          SYS_YN: 'Y',
                          TCO_COMPANY_PK : this.selectedCompany
                        },
                        0
                    );
      
    },

    initNewRowMaster(e) {
      e.data._rowstatus = "i";
    },

    rowInsertedMaster(e) {
      e.data.PK = "";
      e.data.ID = "";
      e.data.CODE_NM = "";
      e.data.USE_YN = "Y";
      e.data.REMARK = "";
      e.data.NM1_NAME = "";
      e.data.NM2_NAME = "";
      e.data.NM3_NAME = "";
      e.data.NM4_NAME = "";
      e.data.NM5_NAME = "";
      e.data.NM6_NAME = "";
      e.data.NM7_NAME = "";
      e.data.NM8_NAME = "";
      e.data.NM9_NAME = "";
      e.data.NM10_NAME = "";
      e.data.CH1_NAME = "";
      e.data.CH2_NAME = "";
      e.data.CH3_NAME = "";
      e.data.CH4_NAME = "";
      e.data.CH5_NAME = "";
      e.data.CH6_NAME = "";
      e.data.CH7_NAME = "";
      e.data.CH8_NAME = "";
      e.data.CH9_NAME = "";
      e.data.CH10_NAME = "";
      e.data.SYS_YN = "N";
      e.data.TCO_COMPANY_PK = this.selectedCompany;

      this.listAcntID.unshift(e.data);
      this.listAcntID.pop();
      this.focusedRowKeyMaster = "";
    },

    checkUpdatedAcntMaster(data) {

      if(!data.cancel) {
        if(data.data._rowstatus !== "i") {
          data.data._rowstatus = 'u'
        }
      }

    },

    valueChangedMaster(e, colName, rowIndex) {
      const newValue = e.value ? "Y" : "N";
      this.changeValueMaster(newValue, colName, rowIndex, true);
      //alert(newValue)
    },

    changeValueMaster(value, key, idx, isModified) {
      this.listAcntID.map((item, index) => {
        if (index === idx) {
          this.$set(item, key, value);
          if (isModified && item.PK) {
            item._rowstatus = "u";
          }
        }
      });

    },

    // save master
    onSaveMaster() {
      this.saveMaster()

    },

    onDeleteAcntMaster() {
        this.$refs.gridMaster.deleteRows();
    },    

    removeDeletedItemMaster(deletedItemPK, arrayName) {
      deletedItemPK = this.focusedRowKeyMaster

      if(deletedItemPK && arrayName) {
        const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK)
        if(idx > -1) {
          this[arrayName].splice(idx, 1)
        }
      }

    },    

    onAddDetail() {
      this.$refs.gridDetail.addRowStruct({
                          PK: '', 
                          TAC_COMMCODE_MASTER_PK: this.acntId_Pk, 
                          ORD: '', 
                          DEF_YN: '', 
                          CODE: '', 
                          CODE_NM: '', 
                          CODE_LNM: '', 
                          CODE_FNM: '', 
                          NUM_1: '', 
                          NUM_2: '', 
                          NUM_3: '',
                          NUM_4: '', 
                          NUM_5: '', 
                          NUM_6: '', 
                          NUM_7: '', 
                          NUM_8: '', 
                          NUM_9: '', 
                          NUM_10: '', 
                          CHAR_1: '', 
                          CHAR_2: '', 
                          CHAR_3: '', 
                          CHAR_4: '', 
                          CHAR_5: '', 
                          CHAR_6: '', 
                          CHAR_7: '', 
                          CHAR_8: '', 
                          CHAR_9: '', 
                          CHAR_10: '', 
                          USE_YN: '', 
                          REMARK:''
                        },
                        0
                    );

    },

    // onDeleteDetail() {

    //   this.$refs.deleteDialogDetail.dialogIsShow = true

    // },

    onSaveDetail() {
      this.saveDetail()

    },

    onSearchDetails() {

      this.getAcntCodeDetailList();

    },

    onSelectionDetail(data){
      this.selectedItemKeysDetail = data.selectedRowKeys
      
    },

    markDeleteDetails() {
       this.$refs.gridDetail.deleteRows();
    },    

    setMarkedDeleteRowColor(isMarked, idx) {

      const element = this.$refs.gridDetail.instance.getRowElement(idx)

      if(element) {
        if(isMarked) {
          // element[0].classList.add('mark-delete')
          element[0].style.background = "#ff5252"
          element[0].style.color = "#fff"

        } else {
          // element[0].classList.remove('mark-delete')
          element[0].style.background = ""
          element[0].style.color = ""

        }
      }
    },

    initNewRowDetail(e){
      e.data._rowstatus = "i";
    }, 
    
    rowInsertedDetail(e){

      e.data.PK = "";
      e.data.TAC_COMMCODE_MASTER_PK = this.acntId_Pk
      e.data.ORD = "";
      e.data.DEF_YN = "N";
      e.data.CODE = "";
      e.data.CODE_NM = "";
      e.data.CODE_LNM = "";
      e.data.CODE_FNM = "";
      e.data.NUM_1 = "";
      e.data.NUM_2 = "";
      e.data.NUM_3 = "";
      e.data.NUM_4 = "";
      e.data.NUM_5 = "";
      e.data.NUM_6 = "";
      e.data.NUM_7 = "";
      e.data.NUM_8 = "";
      e.data.NUM_9 = "";
      e.data.NUM_10 = "";
      e.data.CHAR_1 = "";
      e.data.CHAR_2 = "";
      e.data.CHAR_3 = "";
      e.data.CHAR_4 = "";
      e.data.CHAR_5 = "";
      e.data.CHAR_6 = "";
      e.data.CHAR_7 = "";
      e.data.CHAR_8 = "";
      e.data.CHAR_9 = "";
      e.data.CHAR_10 = "";
      e.data.USE_YN = "Y"
      e.data.REMARK = ""

      this.listAcntDetails.unshift(e.data);
      this.listAcntDetails.pop();
      this.focusedRowKeyDetail = "";

    }, 
    
    checkUpdatedAcntDetail(data){
      if(!data.cancel) {
        if(data.data._rowstatus !== "i") {
          data.data._rowstatus = 'u'
        }
      }

    }, 
    
    valueChangedDetail(e, colName, rowIndex){
      const newValue = e.value ? 'Y' : 'N'
      this.changeValueDetail(newValue, colName, rowIndex, true)

    },

    changeValueDetail(value, key, idx, isModified) {

      this.listAcntDetails.map((item, index) => {
        if(index === idx) {
          this.$set(item, key, value)
          if(isModified && item.PK) {
            item._rowstatus = "u"
          }
        }
      })

    },    
  
    onSelectionAcntID(data) {
      
      console.log(data);
      this.focusedAcntName = data.data.CODE_NM;
      this.focusedRowKeyMaster = data.data.PK;
      this.acntId_Pk = data.data.PK;                           

      this.getAcntCodeDetailList();
    },    

    onShowFullDetails() {
      if (this.myIcon == "mdi-arrow-up-bold-box-outline") {
        this.myIcon = "mdi-arrow-down-bold-box-outline";
        this.showGridMaster = true;
      } else {
        this.myIcon = "mdi-arrow-up-bold-box-outline";
        this.showGridMaster = false;
      }

      if (this.showGridMaster)
        this.limitHeightGridDetails =
          this.windowHeight - (320 + this.decreaseHeight);
      else this.limitHeightGridDetails = this.windowHeight - 320;
    },

    async getCompanyList() {
      const result = await this._getCompanyByUser(this.user.PK);
            if (result) {
                this.companyList = result;
                this.selectedCompany = 1; ///đsd
            }

    },

    async getAcntIDList() {
          this.$refs.gridMaster.loadData();
    },

    async getAcntCodeDetailList() {
      this.detailCode = this.detailCode ? this.detailCode : "";
      this.$refs.gridDetail.loadData();
    },

    async saveMaster() {
        this.$refs.gridMaster.saveData();     
    },

    async saveDetail() { 
      this.$refs.gridDetail.saveData();    
    },

    
    onAfterLoadMaster() {
      if(this.$refs.gridMaster.getDataSource().length > 0)
      {
        this.totalRecords = this.$refs.gridMaster.getDataSource().length;
        this.maxAcntID = this.$refs.gridMaster.getDataSource()[this.$refs.gridMaster.getDataSource().length-1].ID;
      }
        
    },


  },

  mounted() {
    const user = this.getUser;
    //console.log(user);
    this.selectedCompany = user.TCO_COMPANY_PK;

    if (this.showGridMaster)
      this.limitHeightGridDetails =
        this.windowHeight - (320 + this.decreaseHeight);
    else this.limitHeightGridDetails = this.windowHeight - 320;
  }



};



</script>

<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="5">
        <!-- Search Panel -->
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pb-0">
                <v-row dense align="center" justify="space-between">
                  <v-col md="6" sm="6" cols="12">
                    <v-select
                      cache-items
                      clearable
                      dense
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('company')"
                      :items="companyList"
                      v-model="lstCompany"
                      @change="onChangeCompany"
                    ></v-select>
                  </v-col>
                  <v-col md="6" sm="6" cols="12">
                    <div class="d-flex justify-end">
                      <!-- Copy -->
                      <BaseButton
                        icon_type="search"
                        :btn_text="$t('search')"
                        @onclick="onSearch"
                      />

                      <!-- Report -->
                      <BaseButton
                        icon_type="print"
                        :btn_text="$t('report_excel')"
                        @onclick="exportReport('EXCEL')"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <v-col md="6" sm="6" cols="12">
                    <v-text-field
                      dense
                      cache-items
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('biz_code')"
                      v-model="txtBiz_Code"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" sm="6" cols="12">
                    <v-text-field
                      dense
                      cache-items
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('tax_code')"
                      v-model="txtTax_Code"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <v-col md="12" sm="6" cols="12">
                    <v-text-field
                      dense
                      cache-items
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('biz_name')"
                      v-model="txtBiz_Name"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                column-resizing-mode="widget"
                ref="gridMaster"
                :auto_load="false"
                select_mode="Multiple"
                :max_height="limitHeight"
                @cellClick="onCellClickMaster"
                :header="[
                  {
                    dataField: 'NO',
                    caption: $t('stt'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'LOC_ID',
                    caption: this.$t('biz_code'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'LOC_NM',
                    caption: this.$t('biz_name'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'TAX_CD',
                    caption: this.$t('tax_code'),
                    allowEditing: false,
                  },
                ]"
                @setDataSource="onAfterLoad"
                sel_procedure="AC_SEL_8015060_PARTNER_NO_CACHE"
                :filter_paras="[
                  this.lstCompany,
                  this.txtBiz_Code,
                  this.txtBiz_Name,
                  this.txtTax_Code,
                ]"
                :update_paras="[]"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7">
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pb-0">
                <v-row dense align="center" justify="space-between">
                  <v-col md="12" sm="6" cols="12">
                    <div class="d-flex justify-end">
                      <!-- Add -->
                      <BaseButton
                        icon_type="add_new"
                        :btn_text="$t('btn_add')"
                        @onclick="addNewDetails()"
                      />

                      <!-- Save -->
                      <BaseButton
                        icon_type="save"
                        :btn_text="$t('save')"
                        @onclick="saveMaster()"
                      />

                      <!-- Delete -->
                      <BaseButton
                        icon_type="delete"
                        :btn_text="$t('delete')"
                        @onclick="openDeleteDialog()"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="space-between">
                  <v-col md="6" sm="6" cols="12">
                    <v-text-field
                      dense
                      cache-items
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('partner_name')"
                      v-model="txtPartner_Name"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" sm="6" cols="12">
                    <v-text-field
                      dense
                      cache-items
                      hide-details
                      item-value="PK"
                      item-text="TEXT"
                      :label="$t('tax_code')"
                      v-model="txtTax_CodeR"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                column-resizing-mode="widget"
                ref="gridDetails"
                :auto_load="false"
                select_mode="Multiple"
                :max_height="limitHeight1"
                @cellDblClick="onCellDblClickDetails"
                @cellClick="onCellClickDetails"
                @selection-changed="selectionChanged"
                :filterRow="true"
                :header="[
                  {
                    dataField: 'NO',
                    caption: $t('stt'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'BIZ_CODE',
                    caption: this.$t('biz_code'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'BIZ_NAME',
                    caption: this.$t('biz_name'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'BIZ_TAX_CODE',
                    caption: this.$t('biz_tax_code'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'PARTNER_ID',
                    caption: this.$t('partner_id'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'PARTNER_NAME',
                    caption: this.$t('partner_name'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'TAX_CD',
                    caption: this.$t('tax_code'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'ADDR1',
                    caption: this.$t('addr1'),
                    allowEditing: false,
                  },
                  {
                    dataField: 'ACTIVE_YN',
                    caption: this.$t('use_yn'),
                    allowEditing: false,
                    dataType:'checkbox',
                     cssClass: 'cell-align-center'
                  },
                  {
                    dataField: 'TCO_COMPANY_PK', 
                    caption: this.$t('tco_company_pk'),
                    allowEditing: false,
                    visible: false
                  },
                  {
                    dataField: 'TCO_BUSPLACE_PK',
                    caption: this.$t('tco_busplace_pk'),
                    allowEditing: false,
                    visible: false
                  },
                  {
                    dataField: 'TCO_BUSPARTNER_PK',
                    caption: this.$t('tco_buspartner_pk'),
                    allowEditing: false,
                    visible: false
                  },
                ]"
                @setDataSource="onAfterLoad"
                sel_procedure="AC_SEL_8015060_BIZ_PLACE_NO_CACHE"
                :filter_paras="[
                  this.lstCompany,
                  this.txtBus_Place_PK,
                  this.txtPartner_Name,
                  this.txtTax_CodeR,
                ]"
                upd_procedure="AC_UPD_8015060_BIZ_PLACE" 
                :update_paras="[
                'PK',
                'BIZ_CODE',
                'BIZ_NAME',
                'BIZ_TAX_CODE',
                'TCO_BUSPARTNER_PK',
                'PARTNER_ID',
                'PARTNER_NAME',
                'ADDR1',
                'ACTIVE_YN',
                'TCO_COMPANY_PK',
                'TCO_BUSPLACE_PK'
                ]"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Company Dialog -->
    <company-dialog
      v-if="companyDialog"
      @closeCompanyDialog="companyDialog = false"
      @returnCompanyInfo="mappingCompany"
    ></company-dialog>

    <delete-dialog
      ref="deleteDialog"
      :deleteProps="deleteProps"
      @returnDeletedItem="removeDeletedItem"
    ></delete-dialog>

    <partners-list-dialog
      ref="partnersDialog"
      @callBackData="mappingPartners"
      :tco_busplace_pk="txtBus_Place_PK"
    ></partners-list-dialog>
  </v-container>
</template>

<script>
import CellGridCheckbox from "@/components/table/CellGridCheckbox";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import CompanyDialog from "@/components/dialog/CompanyBizplaceDialog";
import moment from "moment";

export default {
  layout: "default",
  middleware: "user",

  components: {
    CellGridCheckbox,
    DeleteDialog,
    CompanyDialog,
    partnersListDialog: () => import("@/components/dialog/PartnerListDialog"),
  },

  data: () => ({
    // Search Options
    txtBiz_Code: "",
    txtBiz_Name: "",
    txtTax_Code: "",
    companyList: [],
    lstCompany: "",

    // Table Data
    userList: [],
    focusedRowKey: 0,
    selectedUserKeys: [],
    selectedUserCompanyKeys: [],
    chkBoxModeGridDetail: "none",
    selectionMode: "none",
    // Company Dialog
    companyDialog: false,
    selectedCompany: "",

    //Delete dialog confirm
    deleteDialog: false,
    deleteConfirm: false,
    deleteProps: [],
    tco_comp_pk: "",
    txtPartner_Name: "",
    txtTax_CodeR: "",
    txtBus_Place_PK: 0,
    itemInfoList:[]
  }),

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    getUser: function () {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 250;
    },
    limitHeight1() {
      return this.windowHeight - 210;
    },
  },
  created() {
    this.getListCodes();
  },

  methods: {
    async getListCodes() {
      const dso_company_list = {
        type: "list",
        selpro: "SYS_SEL_LIST_COMPANY",
        para: [this.user.PK],
      };
      this.companyList = await this._dsoCall(dso_company_list, "select", false);
      this.lstCompany = this.companyList[0].PK;
    },
    onAfterLoad() {},
    onSearch() {
      this.$refs.gridMaster.loadData();
    },
    onCellClickMaster(data) {
      this.txtBus_Place_PK = this.$refs.gridMaster.selectedDatas[0]["PK"];
      this.$refs.gridDetails.loadData();
    },
    
    mappingPartners(item) {
        console.log(item)
      if (this.selectedItemAcc === undefined || this.selectedItemAcc === null) {
        for ( let i = 0; i < item.length; i++ )
          {
            this.$refs.gridDetails.addRowStruct({
              BIZ_CODE : this.$refs.gridMaster.selectedDatas[0]["LOC_ID"],
              BIZ_NAME : this.$refs.gridMaster.selectedDatas[0]["LOC_NM"],
              BIZ_TAX_CODE :this.$refs.gridMaster.selectedDatas[0]["TAX_CD"],
              TAX_CD : item[i].TAX_CODE,
              PARTNER_ID : item[i].PARTNER_ID,
              PARTNER_NAME : item[i].PARTNER_NAME,
              ADDR1 : item[i].ADDR1,
              ACTIVE_YN : item[i].ACTIVE_YN,
              PK : "",
              TCO_BUSPARTNER_PK :item[i].PK ,
              TCO_COMPANY_PK :this.$refs.gridMaster.selectedDatas[0]["TCO_COMPANY_PK"] ,
              TCO_BUSPLACE_PK :this.$refs.gridMaster.selectedDatas[0]["PK"] 
            });
          }
      } else {
        const selItem = this.selectedItemAcc;
        const itemAccIdx = this.itemInfoList.findIndex(
          (x) => x.PK === selItem.PK
        );

        if (itemAccIdx > -1) {
          if (!this.itemInfoList[itemAccIdx]._rowstatus) {
            if (this.itemInfoList[itemAccIdx].PK == "") {
              this.itemInfoList[itemAccIdx]._rowstatus = "i";
              for (let i = 0; i < item.length; i++) {
                this.$refs.gridDetails.addRowStruct({
                    BIZ_CODE : this.$refs.gridMaster.selectedDatas[0]["LOC_ID"],
                    BIZ_NAME : this.$refs.gridMaster.selectedDatas[0]["LOC_NM"],
                    BIZ_TAX_CODE :this.$refs.gridMaster.selectedDatas[0]["TAX_CD"],
                    TAX_CD : item[i].TAX_CODE,
                    PARTNER_ID : item[i].PARTNER_ID,
                    PARTNER_NAME : item[i].PARTNER_NAME,
                    ADDR1 : item[i].ADDR1,
                    ACTIVE_YN : item[i].ACTIVE_YN,
                    PK : "",
                    TCO_BUSPARTNER_PK :item[i].PK ,
                    TCO_COMPANY_PK :this.$refs.gridMaster.selectedDatas[0]["TCO_COMPANY_PK"] ,
                    TCO_BUSPLACE_PK :this.$refs.gridMaster.selectedDatas[0]["PK"] 
                });
              }
            } else {
              this.$refs.gridDetails.setCellSelected("TCO_BUSPARTNER_PK", item.TCO_BUSPARTNER_PK );
              this.$refs.gridDetails.setCellSelected("PARTNER_ID", item.PARTNER_ID );
              this.$refs.gridDetails.setCellSelected("PARTNER_NAME", item.PARTNER_NAME );
              this.$refs.gridDetails.setCellSelected("ADDR1", item.ADDR1 );
              this.$refs.gridDetails.setCellSelected("ACTIVE_YN", item.ACTIVE_YN);
              this.$refs.gridDetails.setCellSelected("TCO_COMPANY_PK", this.$refs.gridMaster.selectedDatas[0]["TCO_COMPANY_PK"] );
              this.$refs.gridDetails.setCellSelected("TCO_BUSPLACE_PK", this.$refs.gridMaster.selectedDatas[0]["PK"] );
            }
          }
        } else {
                 console.log("itemAccIdx");
              this.$refs.gridDetails.setCellSelected("TCO_BUSPARTNER_PK", item.PK );
              this.$refs.gridDetails.setCellSelected("PARTNER_ID", item.PARTNER_ID );
              this.$refs.gridDetails.setCellSelected("PARTNER_NAME", item.PARTNER_NAME );
              this.$refs.gridDetails.setCellSelected("ADDR1", item.ADDR1 );
              this.$refs.gridDetails.setCellSelected("ACTIVE_YN", item.ACTIVE_YN);

              this.$refs.gridDetails.setCellSelected("TCO_COMPANY_PK", this.$refs.gridMaster.selectedDatas[0]["TCO_COMPANY_PK"] );
              this.$refs.gridDetails.setCellSelected("TCO_BUSPLACE_PK", this.$refs.gridMaster.selectedDatas[0]["PK"] );
            }
      }
    },
    onChangeCompany() {
      this.onSearch();
    },
    addNewDetails() {
     this.selectedItemAcc = null
     this.txtBus_Place_PK = this.$refs.gridMaster.selectedDatas[0]["PK"];
     console.log(this.txtBus_Place_PK);
      this.$refs.partnersDialog.dialogIsShow = true;
    },

    onCellDblClickDetails(data) {
        console.log(data);
         this.selectedItemAcc = {...data.data};  
      this.$refs.partnersDialog.dialogIsShow = true;  
    },
    onCellClickDetails(data) {
        this.selectedItemAcc = {...data.data};  
    },
    selectionChanged(data) {
        this.selectedItemAcc = {...data};  
    },
    saveMaster(){
         this.$refs.gridDetails.saveData();
    },
    openDeleteDialog() {
        this.$refs.gridDetails.deleteRows();
    },
    removeDeletedItem(){

    }
  },

  mounted() {},
};
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="5">
        <!-- Search Panel -->
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="end" class="mr-1">
                  <v-col cols="6">
                     <BaseInput :label="$t('user_id')" v-model="userID"  @keypress.enter="searchUser"/>
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex justify-end">
                     <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="searchUser()"/>
                    </div>             
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
                  ref="gridUserID"
                  :max_height="this.windowHeight - 250"
                  :header="[
                      {
                          dataField: 'EMP_ID',
                          caption: this.$t('emp_id'),
                          allowEditing: false
                      }, 
                      {
                          dataField: 'EMP_NAME',
                          caption: this.$t('emp_name'),
                          allowEditing: false
                      },
                      {
                          dataField: 'USER_ID',
                          caption: this.$t('user_id'),
                          allowEditing: false
                      },
                      {
                          dataField: 'TEL',
                          caption: this.$t('tel_no'),
                          allowEditing: false,
                      },
                      {
                          dataField: 'MOBILE',
                          caption: this.$t('mobile'),
                          allowEditing: false,
                      },
                      {
                          dataField: 'ADDR',
                          caption: this.$t('address'),
                          allowEditing: false,
                      },
                  ]" 
                  sel_procedure="ac_sel_6010025_1"
                  :filter_paras="[
                      this.userID, 
                      '', 
                  ]"
                  
                  select_mode="MultipleHideBox"
                  :auto_load="false"
                  @is_process="isProcessing = $event"
                  @cellClick="onSelectionUserID"
              />
              <!-- <DxDataGrid
                id="gridUserID"
                column-resizing-mode="widget"
                :allow-column-resizing="true"
                :data-source="userList"
                :height="limitHeight"
                :show-borders="true"
                :show-row-lines="true"
                :show-column-lines="true"
                :hoverStateEnabled="true"
                key-expr="PK"
                :selection="{ mode: 'single' }"
                :focused-row-enabled="true"
                @selection-changed="onSelectionUserID"
              >
                <DxColumn data-field="EMP_ID" :caption="$t('emp_id')"></DxColumn>
                <DxColumn data-field="EMP_NAME" :caption="$t('emp_name')"></DxColumn>
                <DxColumn data-field="USER_ID" :caption="$t('user_id')"></DxColumn>
                <DxColumn data-field="TEL" :caption="$t('tel_no')"></DxColumn>
                <DxColumn data-field="MOBILE" :caption="$t('mobile')"></DxColumn>
                <DxColumn data-field="ADDR" :caption="$t('address')"></DxColumn>

                <DxScrolling mode="infinite" />
              </DxDataGrid> -->
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7"  class="pl-5">
        <v-row justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="py-0">
                <v-row justify="end" class="mr-1">
                  <v-col cols="12">
                    <div class="d-flex justify-end">
                      <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="openCompanyDialog()"/>
                      <BaseButton icon_type="update" :btn_text="$t('update')" :disabled="isProcessing" @onclick="save()"/>
                      <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"  @onclick="openDeleteDialog()"/>
                    </div>
                  </v-col>
                </v-row>   
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <!-- <DxDataGrid
                id="gridCompanyUser"
                column-resizing-mode="widget"
                :allow-column-resizing="true"
                :data-source="companyList"
                :height="limitHeight"
                :show-borders="true"
                :show-row-lines="true"
                key-expr="PK"
                :focused-row-enabled="true"
                :selection="{ mode: 'single' }"
                :hoverStateEnabled="true"
                @dblclick="onBizPlace"
                :onRowDblClick="onBizPlace" 
                @selection-changed="onSelectionCompany"
              >
                <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')"  width="80"></DxColumn>
                <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')" width="250"></DxColumn>
                <DxColumn data-field="USER_ID" :caption="$t('user_id')" width="80"></DxColumn>
                <DxColumn data-field="LOC_ID" :caption="$t('bizplace_id')" width="80"></DxColumn>
                <DxColumn data-field="LOC_NM" :caption="$t('bizplace_nm')" width="250"></DxColumn>

                <DxScrolling mode="infinite" />
                
              </DxDataGrid> -->
               <DataGridView
                  ref="gridCompanyUser"
                  :max_height="this.windowHeight - 250"
                  :header="[
                   {
                        dataField: 'PARTNER_ID',
                        caption: this.$t('partner_id'),
                        allowEditing: false
                    }, 
                    {
                        dataField: 'PARTNER_NAME',
                        caption: this.$t('partner_name'),
                        allowEditing: false
                    },
                    {
                        dataField: 'USER_ID',
                        caption: this.$t('user_id'),
                        allowEditing: false
                    },
                    {
                        dataField: 'LOC_ID',
                        caption: this.$t('bizplace_id'),
                        allowEditing: false,
                    },
                    {
                        dataField: 'LOC_NM',
                        caption: this.$t('bizplace_nm'),
                        allowEditing: false,
                    }
                  ]" 
                  sel_procedure='ac_sel_6010025_compbyuser_v2'
                  upd_procedure='ac_upd_6010025_compbyuser_v2'
                  :filter_paras="[
                      this.p_user_id
                  ]"
                   :update_paras="[
                    'PK',
                    'TCO_COMPANY_PK',
                    'USER_ID',
                    'TCO_BSUSER_PK',
                    'TCO_BUSPLACE_PK'
                  ] "
                  select_mode="MultipleHideBox"
                  :auto_load="false"
                  @is_process="isProcessing = $event"
                  @cellDblClick="onBizPlace"
								  @onSelectionChanged="onSelectionCompany"
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

    <!-- <delete-dialog
      ref="deleteDialog"
      :deleteProps="deleteProps"
      @returnDeletedItem="removeDeletedItem"
    ></delete-dialog> -->
    <biz-center-dialog ref="bizCenterDialog" :companyPK="tco_comp_pk" @returnBizPlaceEiInfo="handleReturnData"></biz-center-dialog>
  </v-container>
</template>

<script>
import CellGridCheckbox from '@/components/table/CellGridCheckbox'
import DeleteDialog from "@/components/dialog/DeleteDialog"
import CompanyDialog from "@/components/dialog/CompanyBizplaceDialog_6010025"
import moment from "moment"

export default {
  layout: "default",
  middleware: 'user',

  components: {
    CellGridCheckbox,
    DeleteDialog,
    CompanyDialog,
    BizCenterDialog: () => import("@/components/dialog/BizPlaceDialog_6010025"),
  },

  data: () => ({
    // Search Options
    userID: "",
    userPK: "",
    selectionMode: "none",
    selectedUserID: "",
    selectedUserPK: "",

    // Table Data
    userList: [],
    companyList: [],
    focusedRowKey: 0,
    selectedUserKeys: [],
    selectedUserCompanyKeys: [],
    chkBoxModeGridDetail: "none",

    // Company Dialog
    companyDialog: false,
    selectedCompany: "",
    //cell click
    p_user_id : '',
    p_user_pk : null,

    //Delete dialog confirm
    deleteDialog: false,
    deleteConfirm: false,
    deleteProps: [],
    tco_comp_pk:""
  }),

  computed: {
    user() { return this.$store.getters["auth/user"] },
    getUser: function() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 170;
    }
  },

  methods: {
    // async getUserList() {
    //   let pa = [];
    //   let p_user_id =
    //     this.userID == "" || this.userID == "null" || this.userID == undefined
    //       ? ""
    //       : this.userID.trim();
    //   pa = [p_user_id, ""];
    //   const dso = {
    //     type: "grid",
    //     selpro: "ac_sel_6010025_1",
    //     para: pa //type array[]
    //   };
    //   this.userList = await this._dsoCall(dso, "select", false);
    // },

    searchUser() {
      //this.getUserList();
      this.$refs.gridUserID.loadData();
    },

    // async getCompanysByUserID() {
    //   let pa = [];
    //   let p_user_id = this.selectedUserID ? this.selectedUserID : "";
    //   let p_user_pk = this.selectedUserPK ? this.selectedUserPK : "";
    //   pa = [p_user_id, p_user_pk];
    //   const dso = {
    //     type: "grid",
    //     selpro: "ac_sel_6010025_compbyuser_v2",
    //     para: pa //type array[]
    //   };
    //   this.companyList = await this._dsoCall(dso, "select", false);
    // },

    onSelectionUserID(e) {
        this.p_user_id = e.data.USER_ID;
        this.p_user_pk = e.data.PK;
        this.$refs.gridCompanyUser.loadData();
      // this.selectedUserKeys = data.selectedRowKeys;
      // for (let i = 0; i < this.userList.length; i++) {
      //   const userItem = this.userList[i];
      //   for (let j = 0; j < this.selectedUserKeys.length; j++) {
      //     const item = this.selectedUserKeys[j];
      //     if (item == this.userList[i].PK) {
      //       this.selectedUserID = userItem.USER_ID;
      //       this.selectedUserPK = item;

      //       break;
      //     }
      //   }
      // }

      // this.getCompanysByUserID();
    },

    onSelectionCompany(data) {
      // this.selectedUserCompanyKeys = data.selectedRowKeys;
      // let _row_company_pk = this.selectedUserCompanyKeys.PK
      // //alert(this.selectedUserCompanyKeys.length)

      // for (let i = 0; i < this.companyList.length; i++) {
      //   const userCompanyItem = this.companyList[i];
      //   for (let j = 0; j < this.selectedUserCompanyKeys.length; j++) {
      //     const item = this.selectedUserCompanyKeys[j];
      //     if (item == userCompanyItem.PK) {
      //       this.focusedRowKey = item;
      //       break;
      //     }
      //   }
      // }
    },

    openCompanyDialog(item) {
      this.$refs.gridCompanyUser.reRender();
      this.companyDialog = true;
      this.selectedCompany = { ...item };
    },

    //add new row user company
    mappingCompany(item) {
       console.log(item);
         this.$refs.gridCompanyUser.addRowStruct({
              PK          		    : "",
              PARTNER_ID          : item.COMPANY_CD,
              PARTNER_NAME        : item.COMPANY_NM,
              USER_ID           	: this.p_user_id,
              TCO_COMPANY_PK      : item.PK,
              TCO_BSUSER_PK       : this.p_user_pk,
              TCO_BUSPLACE_PK     : item.TCO_BUSPLACE_PK,
              LOC_ID 	            : item.LOC_ID,
              LOC_NM       	      : item.LOC_ID,
          });   
      // this.selectedCompany = item;
      // let newRow = {
      //   PK: 0,
      //   PARTNER_ID: this.selectedCompany.PARTNER_ID,
      //   PARTNER_NAME: this.selectedCompany.PARTNER_NAME,
      //   USER_ID: this.selectedUserID,
      //   TCO_COMPANY_PK: this.selectedCompany.PK,
      //   TCO_BSUSER_PK: this.selectedUserPK,
      //   TCO_BUSPLACE_PK:this.selectedCompany.TCO_BUSPLACE_PK,
      //   LOC_ID:this.selectedCompany.LOC_ID,
      //   LOC_NM:this.selectedCompany.LOC_NM,
      //   _rowstatus: "i"
      // };

      // //focus to row
      // this.companyList.unshift(newRow);
      // this.focusedRowKey = newRow.PK;
    },
    onBizPlace(row)
    {
     // console.log('onBizPlace');
      this.selectedCompany = { ...row };
      if(this.selectedCompany.data.TCO_COMPANY_PK !== "")
      {
        this.tco_comp_pk = this.selectedCompany.data.TCO_COMPANY_PK+ " ";
        console.log(this.selectedCompany.data);
      }
      this.$refs.bizCenterDialog.dialogIsShow = true;
      
    },

    handleReturnData(item) {
         console.log(item);
      let userIdx = this.$refs.gridCompanyUser.getDataSource().findIndex((d) => d["PK"] ==  this.selectedCompany.data.PK);
      if (userIdx > -1) {
          this.$refs.gridCompanyUser.setCellSelected("TCO_BUSPLACE_PK",  item.PK)
          this.$refs.gridCompanyUser.setCellSelected("LOC_ID",  item.LOC_ID)
          this.$refs.gridCompanyUser.setCellSelected("LOC_NM",  item.LOC_NM)
      }
      //  const userIdx = this.companyList.findIndex(x => x.PK === this.selectedCompany.data.PK);
      // if (userIdx > -1) {
      //   if (this.companyList[userIdx]._rowstatus !== "i") {
      //       this.companyList[userIdx]._rowstatus = "u";
      //       this.companyList[userIdx].TCO_BUSPLACE_PK = item.PK;
      //       this.companyList[userIdx].LOC_ID          = item.LOC_ID;
      //       this.companyList[userIdx].LOC_NM          = item.LOC_NM;
      //   }
      // }
    },
     async save() {
       this.$refs.gridCompanyUser.saveData();
    //   const dso = {
    //     type: "grid",
    //     selpro: "ac_sel_6010025_compbyuser_v2",
    //     updpro: "ac_upd_6010025_compbyuser_v2",
    //     para: [
    //       this.selectedUserID ? this.selectedUserID : "",
    //       this.selectedUserPK ? this.selectedUserPK : ""
    //     ],
    //     elname: [
    //       "_rowstatus",
    //       "PK",
    //       "TCO_COMPANY_PK",
    //       "USER_ID",
    //       "TCO_BSUSER_PK",
    //       "TCO_BUSPLACE_PK"
    //     ],
    //     data: this.companyList
    //   };
    //   this.companyList = await this._dsoCall(dso, "update", true);
    },

    openDeleteDialog() {
        this.$refs.gridCompanyUser.deleteRows();
      // this.$refs.deleteDialog.dialogIsShow = true;
      // this.deleteProps = {
      //   proc: "ac_upd_6010025_companybyuser",
      //   para: ["d", this.focusedRowKey, "", "", ""],
      //   arrayName: "companyList"
      // };
      // //alert(this.deleteProps.proc);
      // //alert(this.deleteProps.para[1]);
    },

    // removeDeletedItem(deletedItemPK, arrayName) {
    //   deletedItemPK = this.focusedRowKey;

    //   if (deletedItemPK && arrayName) {
    //     const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK);
    //     if (idx > -1) {
    //       this[arrayName].splice(idx, 1);
    //     }
    //   }
  //    }
  },

  mounted() {
    //this.getUserList();
    this.searchUser();
  }
};
</script>

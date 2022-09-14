<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel & Action Buttons -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pb-0">
                <v-row dense align="center" justify="space-between">
                  <!-- Company Select -->
                  <v-col cols="3" class="pl-2">
                      <BaseSelect outlined :label="$t('company', 'common')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK"/>
                  </v-col>
                  <!-- Emp ID/Name -->
                  <v-col cols="3" class="pl-5">
                    <BaseInput outlined :label="$t('emp_id_name')" v-model="empIdName" @keyPressEnter="searchUser" />
                  </v-col>
                  <!-- Department -->
                  <v-col cols="3" class="pl-5">
                      <BaseSelect outlined :label="$t('department', 'common')" v-model="selectedDepartment" :lstData="departmentList" item-text="TEXT" item-value="PK" @change="searchUser" :text_all="$t('all')"/>
                  </v-col>
                  <!-- Advance Type -->
                  <v-col cols="3" class="pl-5">
                      <BaseSelect outlined :label="$t('advance_type')" v-model="selectedAdvanceType" :lstData="advanceTypeList" item-text="NAME" item-value="CODE" @change="searchUser" :text_all="$t('all')"/>
                  </v-col>
                  <!-- PL Unit -->
                  <v-col cols="3" class="pl-2 pt-3">
                    <BaseInput outlined :label="$t('pl_unit')" v-model="plCodeName" @dblClick="openCostCenterDialog()" :clearable="false">
                        <template v-slot:append>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" :color="currentTheme" @click="openCostCenterDialog()">mdi-window-restore</v-icon>
                                </template>
                            </v-tooltip>
                            <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                              <v-icon v-on="on" :color="currentTheme" @click="plPK = '', plCodeName = ''">mdi-eraser</v-icon>
                            </template>
                            <span>{{ $t('reset') }}</span>
                        </v-tooltip>
                        </template>
                    </BaseInput>
                  </v-col>
                  <!-- Active -->
                  <v-col cols="2">
                     <BaseCheckbox v-model="activeStatus" true-value="Y" false-value="N" :label="$t('active')" />
                  </v-col>
                  <v-spacer></v-spacer>
                  <!-- Action Buttons -->
                   <v-col cols="3" class="pl-7 pt-3 pb-3">
                      <div class="d-flex justify-end">
                          <BaseButton icon_type="search" :btn_text="$t('search')" @onclick="onClickButton('btnOnSearch')" :disabled="isProcessing" />  
                          <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="false" @onclick="onClickButton('btnAddNew')"/> 
                          <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="false"  @onclick="onClickButton('btnSave')"/>                                                                           
                          <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="false"  @onclick="onClickButton('btnDelete')"/> 
                      </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <!-- Data Table -->
        <v-row align="center" justify="center">
          <v-col cols="12" class="py-0">
            <v-card outlined tile v-resize="onResize">
              <DataGridView
                    ref="userDataGrid"
                    :max_height="this.windowHeight - 320"
                    :header="[
                        {
                            dataField: 'EMP_ID',
                            caption: this.$t('emp_id'),
                            allowEditing: false,
                            cellTemplate: 'popup'
                        }, 
                        {
                            dataField: 'FULL_NAME',
                            caption: this.$t('emp_name'),
                            allowEditing: false
                        },
                        {
                            dataField: 'FULL_FNAME',
                            caption: this.$t('emp_f_name'),
                            allowEditing: false
                        },
                        {
                            dataField: 'TCO_COMPANY_PK',
                            caption: this.$t('company'),
                            lookup: { 
                                dataSource: this.companyList, 
                                displayExpr:'TEXT', 
                                valueExpr: 'PK' 
                            },
                        },
                        {
                            dataField: 'TCO_ORG_PK',
                            caption: this.$t('department'),
                            allowEditing: true,
                            lookup: { 
                                dataSource: this.departmentList, 
                                displayExpr:'TEXT', 
                                valueExpr: 'PK' 
                            },
                        },
                        {
                            dataField: 'PL_NM',
                            caption: this.$t('pl_unit'),
                            allowEditing: false,
                            cellTemplate: 'popup'
                        },
                        {
                            dataField: 'ADV_TYPE',
                            caption: this.$t('advance_type'),
                            allowEditing: true,
                            lookup: { 
                                dataSource: this.advanceTypeList, 
                                displayExpr:'NAME', 
                                valueExpr: 'CODE' 
                            },
                        },
                        {
                            dataField: 'DESCRIPTION',
                            caption: this.$t('description'),
                            allowEditing: true,
                        },
                        {
                            dataField: 'USE_YN',
                            caption: this.$t('active', 'common'), 
                            allowEditing: true, 
                            dataType: 'checkbox' 
                        }, 

                    ]" 
                    sel_procedure="AC_SEL_6010030_USER"
                    upd_procedure="AC_UPD_6010030_USER"
                    :filter_paras="[
                       this.selectedCompany, 
                       this.selectedDepartment, 
                       this.empIdName, 
                       this.selectedAdvanceType, 
                       this.plPK, 
                       this.activeStatus
                    ]"
                    :update_paras="[
                        'PK',
                        'EMP_ID',
                        'FULL_NAME',
                        'FULL_FNAME',
                        'TCO_COMPANY_PK',
                        'TCO_ORG_PK',
                        'TAC_ABPL_PK',
                        'ADV_TYPE',
                        'DESCRIPTION',
                        'USE_YN',
                        'THR_EMPLOYEE_PK'
                    ]"
                    select_mode="MultipleHideBox"
                    :auto_load="false"
                    @is_process="isProcessing = $event"
                    @onSelectionChanged="onSelectionChanged"
                    @openpopup="cellDblClick"
                />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <confirm-dialog ref="refConfirmDialog"     @onConfirm="confirmMaster" ></confirm-dialog>
    <cost-center-dialog ref="costCenterDialog" :companyPK="selectedCompany" @returnData="handleReturnedCostCenter"></cost-center-dialog>
    <employee-dialog ref="employeeDialog" :companyPK="selectedCompany" :multiSelectMode="true" @callBackData="handleReturnedEmployees" p_store="AC_SEL_6010030_POPUP"></employee-dialog>
  </v-container>
</template>

<script>
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
    EmployeeDialog: () => import("@/components/dialog/EmployeeDialog"),
  },

  data: () => ({
    selectedCompany: '',
    companyList: [],
    empIdName: '',
    selectedDepartment: '',
    departmentList: [],
    selectedAdvanceType: '',
    advanceTypeList: [],
    activeStatus: 'Y',
    plPK: '',
    plCodeName: '',

    userList: [],
    selectedUserPK: '',
    selectedRowKeys: [],
    action_pl : '',
  }),

  created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK
    this.getListCodes()
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight - 260 }
  },

  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.departmentList = await this._getOrg(this.user.TCO_COMPANY_PK)
      this.advanceTypeList = await this._getCommonCode('ACBG0130', this.user.TCO_COMPANY_PK)
    },

    async searchUser() {
      this.$refs.userDataGrid.loadData();
    },
    /*************on Process Confirm*******************/
    onClickButton(action) {

      this.actionProcess = action;
      this.actionDialog = true;
      //console.log(this.active);
      switch(action)
      { 
          case 'btnOnSearch':
              this.$refs.userDataGrid.loadData();
          break;
          case 'btnAddNew':
            this.$refs.userDataGrid.reRender();
            this.$refs.employeeDialog.dialogIsShow = true
          break;
          case 'btnSave':
             // this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_save"));
            this.$refs.userDataGrid.saveData();
          break;
          case 'btnDelete':
              this.$refs.refConfirmDialog.showConfirm(this.$t("do_you_want_to_delete"));
          break;
      }
  },
  async confirmMaster() {
      if (this.actionProcess === 'btnDelete') 
      {
          this.$refs.userDataGrid.deleteRows2();
      }
  },
  onSelectionChanged({data}) {
    this.selectedRowKeys = data; 
  },
  openCostCenterDialog() {
    this.action_pl = 'search'
    this.$refs.costCenterDialog.dialogIsShow = true
  },
  cellDblClick(row) {
      this.selectedUserPK = row;
      this.multiSelectMode = false;
      if ( row.column.dataField == "EMP_ID") 
      {
        this.actionProcess = '';
        this.$refs.employeeDialog.dialogIsShow = true
      } else if (row.column.dataField == "PL_NM") {
        this.action = '';
        this.$refs.costCenterDialog.dialogIsShow = true
      }
    },
    handleReturnedCostCenter(data) {
      if (this.action_pl == "search") {
          this.plCodeName = data.NAME;
          this.plPK = data.PK;
      } else {
        let userIdx = this.$refs.userDataGrid.getDataSource().findIndex((d) => d["PK"] == this.selectedUserPK.data.PK);
        if(userIdx > -1) {
          this.$refs.userDataGrid.setCellSelected("TAC_ABPL_PK",  data.PK); 
          this.$refs.userDataGrid.setCellSelected("PL_NM",  data.NAME); 
        }
      }
    },
  handleReturnedEmployees(items) {
        if(this.actionProcess == "btnAddNew")
        {
           for (let i = 0;i < items.length; i++)
            {
              this.$refs.userDataGrid.addRowStruct({
                    PK          : "",
                  EMP_ID      : items[i].EMP_ID,
                  FULL_NAME   : items[i].FULL_NAME,
                  FULL_FNAME    : items[i].FULL_FNAME,
                  TCO_COMPANY_PK: this.selectedCompany, 
                  TCO_ORG_PK   : items[i].TCO_ORG_PK,
                  TAC_ABPL_PK  : '', 
                  PL_NM        : '', 
                  ADV_TYPE     : '', 
                  DESCRIPTION  : '', 
                  USE_YN       : 'Y', 
                  THR_EMPLOYEE_PK: items[i].PK
                  }); 
              } 
        }
        else{
          this.$refs.userDataGrid.setCellSelected("EMP_ID",  items[0].EMP_ID); 
          this.$refs.userDataGrid.setCellSelected("FULL_NAME",  items[0].FULL_NAME); 
          this.$refs.userDataGrid.setCellSelected("FULL_FNAME",  items[0].FULL_FNAME); 
          this.$refs.userDataGrid.setCellSelected("TCO_ORG_PK",  items[0].TCO_ORG_PK); 
          this.$refs.userDataGrid.setCellSelected("THR_EMPLOYEE_PK",  items[0].PK); 
        } 
    },
  }
}
</script>

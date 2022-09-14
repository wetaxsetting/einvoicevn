<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Search Panel -->
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card outlined tile>
              <v-container fluid class="pa-1">
                <v-row dense align="center" justify="space-between">
                  <v-col lg="4" md="3" sm="3" cols="12" class="pb-sm-0 pb-2">
                    <v-text-field clearable dense hide-details :label="$t('user_emp_id')" v-model="userEmpID" @keypress.enter="searchUser"></v-text-field>
                  </v-col>
                  <v-col lg="4" md="3" sm="3" cols="12" class="pb-sm-0 pb-0">
                    <v-text-field clearable dense hide-details :label="$t('emp_name')" v-model="empName" @keypress.enter="searchUser"></v-text-field>
                  </v-col>
                  <v-col lg="2" md="2" sm="3" cols="12" class="pb-sm-0 pb-0">
                    <v-checkbox dense hide-details class="mt-0" :color="currentTheme" :label="$t('active')" v-model="activeStatus" @change="searchUser"></v-checkbox>
                  </v-col>
                  <v-col lg="2" md="4" sm="3" cols="12" class="text-sm-right text-center pb-sm-0 pb-0">
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="searchUser">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                    <v-btn icon tile color="error" :disabled="isProcessing" @click="markDeleteItems">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="commitSave">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
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
              <DxDataGrid column-resizing-mode="widget" dateSerializationFormat="yyyyMMdd" key-expr="PK" ref="userDataGrid" 
                :allow-column-resizing="true" :cache-enabled="true"  :data-source="userList" 
                :height="limitHeight" :no-data-text="$t('no_data', 'common')" 
                :onEditorPreparing="onEditorPreparing" :onEditorPrepared="onEditorPrepared" :onRowClick="onRowClick"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true"
                @row-updated="checkUpdatedItem" @selection-changed="selectionChanged">
                  <DxColumn width="100" cell-template="emp-id-template" data-field="EMP_ID" :allow-editing="false" :caption="$t('emp_id')"></DxColumn>
                  <DxColumn width="100" data-field="EMP_NAME" :caption="$t('emp_name')"></DxColumn>
                  <DxColumn width="100" data-field="USER_ID" :caption="$t('user_id')"></DxColumn>
                  <DxColumn width="100" cell-template="user-pw-template" data-field="USER_PW" :allow-editing="false" :caption="$t('user_pw')"></DxColumn>
                  <DxColumn width="100" cell-template="partner-name-template" data-field="PARTNER_NAME" :allow-editing="false" :caption="$t('partner_name')"></DxColumn>
                  <DxColumn width="100" data-field="MOBILE" :caption="$t('mobile')"></DxColumn>
                  <DxColumn width="100" data-field="LIVING_ADDR" :caption="$t('living_addr')"></DxColumn>
                  <DxColumn width="100" data-field="USER_LANGUAGE" :caption="$t('user_language')">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="_languages" />
                  </DxColumn>
                  <DxColumn  width="100" edit-cell-template="use-yn-template" data-field="USE_YN" :caption="$t('active')" :showEditorAlways="true"></DxColumn>
                  <!-- <DxColumn  width="100" edit-cell-template="announce-yn-template" data-field="ANNOUNCE_YN" :caption="$t('announcement')" :showEditorAlways="true"></DxColumn> -->
                  <DxColumn  width="100" edit-cell-template="sysadmin-yn-template" data-field="SYSADMIN_YN" :caption="$t('sysadmin')" :showEditorAlways="true" v-if="user.SYSADMIN_YN === 'Y'"></DxColumn>

                  <DxColumn  data-field="AC_LEVEL" :caption="$t('ac_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn  data-field="FU_LEVEL" :caption="$t('fu_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn  data-field="SA_LEVEL" :caption="$t('sa_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn  data-field="PR_LEVEL" :caption="$t('pr_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn  data-field="IN_LEVEL" :caption="$t('in_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn data-field="PU_LEVEL" :caption="$t('pu_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn  data-field="HR_LEVEL" :caption="$t('hr_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>
                  <DxColumn   data-field="EI_LEVEL" :caption="$t('ei_level')" width="120">
                    <DxLookup display-expr="NAME" value-expr="CODE" :data-source="lstSecurityLevel" />
                  </DxColumn>


                  <DxColumn  width="100" data-field="ST_DATE" data-type="date" :caption="$t('st_date')" :format="curLang.DATE_FORMAT"></DxColumn>
                  <DxColumn  width="100" data-field="END_DATE" data-type="date" :caption="$t('end_date')" :format="curLang.DATE_FORMAT"></DxColumn>

                  <DxSelection mode="multiple" show-check-boxes-mode="none" />
                  <DxKeyboardNavigation :edit-on-key-press="true" />
                  <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" :select-text-on-edit-start="true" />
                  <DxPaging :enable="true" :pageSize="200" />
                  <!-- <DxScrolling mode="infinite" v-else /> -->
                  <!-- <DxStateStoring :enabled="true" type="localStorage" storage-key="storage" /> -->

                  <template #emp-id-template="{ data }">
                    <div class="empty-cell" @dblclick="openEmployeeDialog(data.data)">{{ data.value }}</div>
                  </template>

                  <template #user-pw-template="{ data }">
                    <div class="text-center" v-if="data.data._rowstatus === '' && data.data.USER_PW || data.data._rowstatus === '' && !data.data.USER_PW || data.data._rowstatus === 'i' && !data.data.USER_PW || data.data._rowstatus === 'u' && data.data.USER_PW">
                      <v-icon small :color="currentTheme" @click="openPasswordDialog(data.data.PK, data.data._rowstatus)">mdi-account-key</v-icon>
                    </div>
                    <span @dblclick="openPasswordDialog(data.data.PK, data.data._rowstatus)" v-else>{{ returnedPassword | hidePassword }}</span>
                  </template>

                  <template #partner-name-template="{ data }">
                    <div class="empty-cell" @dblclick="openPartnerDialog(data.data)">{{ data.value }}</div>
                  </template>

                  <template #use-yn-template="{ data }">
                    <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.data.PK)">
                  </template>

                  <!-- <template #announce-yn-template="{ data }">
                    <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.data.PK)">
                  </template> -->

                  <template #sysadmin-yn-template="{ data }">
                    <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.data.PK)">
                  </template>
              </DxDataGrid>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Set Password Dialog -->
    <v-dialog id="set-password-dialog" max-width="500" v-model="setPasswordDialog">
      <v-card>
        <v-card-title class="headline primary-gradient white--text py-2">{{ setPasswordType === "i" ? $t('create_password') : $t('update_password', 'common') }}</v-card-title>
        <v-card-text class="pa-0">
          <v-form lazy-validation ref="setPasswordForm" v-model="setPasswordFormIsValid">
            <v-container>
              <v-row dense align="start" justify="center">
                <v-col cols="12">
                  <v-text-field clearable dense validate-on-blur 
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('password', 'common')" :rules="[validationRule.passwordRules.required]" :type="showPassword ? 'text' : 'password'" 
                    @click:append="showPassword = !showPassword" v-model="password">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field clearable dense validate-on-blur 
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('confirm_password', 'common')" :rules="[validationRule.passwordRules.required, passwordConfirmationRule]" :type="showConfirmPassword ? 'text' : 'password'" 
                    @click:append="showConfirmPassword = !showConfirmPassword" v-model="confirmPassword">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :color="currentTheme" :disabled="isProcessing" @click="setPasswordDialog = false">{{ $t('cancel', 'common') }}</v-btn>
          <v-btn depressed class="white--text" :color="currentTheme" :disabled="isProcessing" :loading="isProcessing" @click="updatePassword">{{ setPasswordType === "i" ? $t('create', 'common') : $t('update', 'common') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Employee Dialog -->
    <employee-dialog ref="employeeDialog" :headers="columnHeaders" @callBackData="mappingEmp"></employee-dialog>
    <!-- Partner Dialog -->
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
  </v-container>
</template>

<script>
import EmployeeDialog from '@/components/dialog/EmployeeDialog';
import PartnerDialog from "@/components/dialog/PartnerDialog";
export default {
  layout: 'default',
  middleware: 'user',

  components: { EmployeeDialog, PartnerDialog },

  data: () => ({
    // Search Options
    userEmpID: '',
    empName: '',
    activeStatus: true,

    // Table Data
    userList: [],
    selectedRowKeys: [],

    // Set Password
    setPasswordDialog: false,
    setPasswordFormIsValid: undefined,
    selectedUserPK: '',
    setPasswordType: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    returnedPassword: "",

    // Delete
    deleteDialog: false,
    deleteProps: {},

    // Employee Dialog
    selectedUser: '',
    columnHeaders: [],

    counter: 0,

    lstSecurityLevel:[],
  }),

  mounted() {
    this.prepareCommonData();
    console.log('SECOND_DB_YN:'+this.SECOND_DB_YN)
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { return this.windowHeight - 220 },
    passwordConfirmationRule() {
      if(this.password === this.confirmPassword) {
        return true
      }
      return this.$t('confirm_pass_not_match', 'common')
    }
  },

  methods: {

    async prepareCommonData(){
      this.lstSecurityLevel = await this._getCommonCode("COBS0010", this.user.TCO_COMPANY_PK);
    },

    async getUserList(paramsData) {
      const dso = {
        type: 'grid',
        selpro: 'SYS_SEL_SYSE004_USER',
        para: paramsData
      }
      const result = await this._dsoCall(dso, 'select', false)
      this.userList = result ? result : []
      this.$refs.userDataGrid.instance.clearSelection()
    },

    searchUser() {
      this.getUserList([ this.userEmpID ? this.userEmpID : '', this.empName ? this.empName : '', this.activeStatus ? -1 : 0, '' ])
    },
    
    addNew() {
      this.userList.unshift({
        _rowstatus: 'i', PK: this._uniqueID(), THR_ABEMP_PK: '', EMP_NAME: '', USER_ID: '', USER_PW: '', TCO_BUSPARTNER_PK: '', PARTNER_NAME: '' , MOBILE: '', LIVING_ADDR: '', USER_LANGUAGE: 'ENG', USE_YN: 'Y', ANNOUNCE_YN: 'N', SYSADMIN_YN: 'N', ST_DATE: '', END_DATE: ''
      })
      console.log(this.userList)
    },

    valueChanged(e, colName, rowPK) {
      const newValue = e ? 'Y' : 'N'
      this.changeValue(newValue, colName, rowPK)
    },

    changeValue(value, key, pk) {
      this.userList.map((item, index) => {
        if(item.PK === pk) {
          this.$set(item, key, value)
          if(item.PK && item._rowstatus !== "i") {
            item._rowstatus = "u"
          }
        }
      })
    },

    commitSave() {
      this.$refs.userDataGrid.instance.saveEditData().then(() => {
        this.save()
      })
    },

    async save() {
      const dataIsModified = this.userList.some(x => x._rowstatus !== "")
      if(dataIsModified) {
        const dso = {
          type: 'grid',
          selpro: 'SYS_SEL_SYSE004_USER',
          updpro: 'SYS_UPD_SYSE004_USER',
          para: [ this.userEmpID ? this.userEmpID : '', this.empName ? this.empName : '', this.activeStatus ? -1 : 0, '' ],
          elname: [ '_rowstatus', 'PK', 'THR_ABEMP_PK', 'EMP_NAME', 'USER_ID', 'USER_PW', 'MOBILE', 'LIVING_ADDR', 'USER_LANGUAGE', 'USE_YN', 'ANNOUNCE_YN', 'SYSADMIN_YN', 'ST_DATE', 'END_DATE',
            "AC_LEVEL", "FU_LEVEL", "SA_LEVEL", "PR_LEVEL", "IN_LEVEL", "PU_LEVEL", "HR_LEVEL", "EI_LEVEL", 'TCO_BUSPARTNER_PK'
          ],
          requirecol: [ 'EMP_NAME', 'USER_ID', 'USER_LANGUAGE' ],
          data: this.userList
        }
        const result = await this._dsoCall(dso, 'update', true)
        if(result) {
          this.userList = result
          const found = this.userList.find(x => x.PK === this.user.PK)
          if(found) {
            await this.$store.dispatch("auth/saveUserInfo")
          }
        }
        this.$refs.userDataGrid.instance.clearSelection()
      }
    },

    openPasswordDialog(userPK, rowStatus) {
      this.selectedUserPK = userPK
      this.setPasswordType = rowStatus
      this.setPasswordDialog = true
      this.$nextTick(() => {
        this.$refs.setPasswordForm.resetValidation()
      })
      this.password = ''
      this.confirmPassword = ''
      this.showPassword = false
      this.showConfirmPassword = false
    },

    updatePassword() {
      if(this.$refs.setPasswordForm.validate()) {
        this.setPasswordFormIsValid = true
        this.isProcessing = true
        if(this.setPasswordType === "i") {
          this.$axios.$post("/user/createpassword", { password: this.password, confirmPassword: this.confirmPassword })
            .then((res) => {
              if(res.data) {
                this.isProcessing = false
                this.setPasswordDialog = false
                this.returnedPassword = res.data
                this.showNotification('success', this.$t('create_password_success'), '')
              } else {
                this.isProcessing = false
                this.returnedPassword = ""
                this.showNotification('danger', this.$t('create_password_failed'), res.message)
              }
              this.changeValue(this.returnedPassword, "USER_PW", this.selectedUserPK)
              console.log(this.userList)
            })
            .catch((e) => {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            })
        } else {
          this.$axios.$post("/user/updatepassword", { proc: "SYS_UPD_SYSE004_USER_PW", userPK: this.selectedUserPK, password: this.password, confirmPassword: this.confirmPassword })
            .then((res) => {
              if(res.data) {
                this.isProcessing = false
                this.setPasswordDialog = false
                this.showNotification('success', this.$t('update_password_success', 'common'), '')
              } else {
                this.isProcessing = false
                this.showNotification('danger', this.$t('update_password_failed', 'common'), res.message)
              }
            })
            .catch((e) => {
              this.isProcessing = false
              this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
            })
        }
      } else {
        this.setPasswordFormIsValid = false
      }
    },

    openEmployeeDialog(item) {
      this.$refs.employeeDialog.dialogIsShow = true
      this.columnHeaders = [
        { field: 'ORG_NM', caption: this.$t('organization', 'common') },
        { field: 'EMP_ID', caption: this.$t('emp_id', 'common') },
        { field: 'FULL_NAME', caption: this.$t('emp_name', 'common') }
      ]
      this.selectedUser = {...item}
    },

    mappingEmp(item) {
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].THR_ABEMP_PK = item.PK
        this.userList[userIdx].EMP_ID = item.EMP_ID
        this.userList[userIdx].EMP_NAME = item.FULL_NAME
      }
    },

    checkUpdatedItem(e) {
      if(!e.cancel) {
        if(e.data._rowstatus !== "i") {
          e.data._rowstatus = 'u'
        }
      }
    },

    onRowClick(e) {
      if(e.rowType === "data" && e.isSelected && e.data._rowstatus === "d") {
        e.rowElement.classList.remove("dx-selection")
      }
    },

    selectionChanged({ selectedRowKeys }) {
      this.selectedRowKeys = selectedRowKeys
    },

    markDeleteItems() {
      if(this.selectedRowKeys.length) {
        for (let i = 0; i < this.userList.length; i++) {
          const user = this.userList[i]
          for (let j = 0; j < this.selectedRowKeys.length; j++) {
            const item = this.selectedRowKeys[j]
            if(item === user.PK) {
              if(user._rowstatus !== "d") {
                user._rowstatus = "d"
                this.setMarkedDeleteRowColor('userDataGrid', true, i)
              } else {
                user._rowstatus = ""
                this.setMarkedDeleteRowColor('userDataGrid', false, i)
              }
            }
          }
        }
      } else {
        this.userList.forEach((item, index) => {
          if(item._rowstatus === "d") {
            item._rowstatus = ""
            this.setMarkedDeleteRowColor('userDataGrid', false, index)
          }
        })
      }
    },

    onEditorPreparing(e) {
      if(e.parentType == "dataRow" && e.dataField == "USER_PW") {
        e.editorOptions.mode = 'password';
      }
    },

    onEditorPrepared(e) {},

    openPartnerDialog(item) {
      this.$refs.partnerDialog.dialogIsShow = true;
      this.selectedUser = {...item}
    },

    handleReturnedPartner(item) {
      const userIdx = this.userList.findIndex(x => x.PK === this.selectedUser.PK)
      if(userIdx > -1) {
        if(!this.userList[userIdx]._rowstatus) {
          this.userList[userIdx]._rowstatus = "u"
        }
        this.userList[userIdx].TCO_BUSPARTNER_PK = item.PK
        this.userList[userIdx].PARTNER_NAME = item.PARTNER_NAME
      }
    },
  }
}
</script>

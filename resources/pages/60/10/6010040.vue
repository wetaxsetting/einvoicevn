<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row>
      <!-- Left Side  -->
      <v-col lg="4" md="4" sm="5" cols="12">
        <v-card outlined tile :height="limitHeight" :style="`overflow-y: scroll;`">
          <v-container fluid>
            <!-- Search Panel -->
            <v-row dense align="center" justify="center">
              <v-col lg="12" cols="12">
                <v-select dense cache-items hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany"></v-select>
              </v-col>
              <v-col lg="6" cols="12">
                <v-text-field clearable dense hide-details :label="$t('biz_center_code')" v-model="searchBizCenterCode" @keypress.enter="search"></v-text-field>
              </v-col>
              <v-col lg="5" cols="10">
                <v-text-field clearable dense hide-details :label="$t('biz_center_name')" v-model="searchBizCenterName" @keypress.enter="search"></v-text-field>
              </v-col>
              <v-col lg="1" cols="2">
                <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <!-- Tree List -->
            <v-row dense>
              <v-col>
                <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="PLC_INFO" 
                  :active.sync="activeNodes" :color="currentTheme" :items="treeList" @update:active="getSelectedNode">
                    <template v-slot:label="{ item, active }">
                      <div @click="active ? $event.stopPropagation() : null">{{ item.PLC_INFO }}</div>
                    </template>
                </v-treeview>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!-- Right Side -->
      <v-col lg="8" md="8" sm="7" cols="12">
        <v-card outlined tile :height="limitHeight" :style="`overflow-y: scroll;`">
          <v-container fluid class="py-0">
            <v-row dense align="start" justify="space-between">
              <!-- Action Buttons -->
              <v-col lg="12" cols="12" class="text-right">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="addNew"/> 
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"  @onclick="save"/>                                                                           
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing"  @onclick="openDeleteDialog"/>                                                     
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing"  @onclick="report"/> 
                </div>
              </v-col>
              <!-- Form -->
              <v-form lazy-validation ref="entryForm" v-model="formIsValid">
                <v-container fluid class="py-0">
                  <v-row dense align="start" justify="space-between">
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field dense hide-details readonly :label="$t('upper_biz_center_code')" v-model="upperBizCenterCode">
                        <template v-slot:append>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" :color="currentTheme" @click="openBizCenterDialog">mdi-window-restore</v-icon>
                            </template>
                            <span>{{ $t('list_upper_code') }}</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" :color="currentTheme" @click="upperBizCenterCode = '', selectedItem.P_PK = ''">mdi-eraser</v-icon>
                            </template>
                            <span>{{ $t('reset_upper_code') }}</span>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col lg="6" v-if="$vuetify.breakpoint.lgAndUp"></v-col>              
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field clearable dense hide-details :label="$t('biz_center_code', 'common')" v-model="selectedItem.PLC_CD"></v-text-field>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field clearable dense hide-details validate-on-blur :label="$t('biz_center_name', 'common')" :rules="validationRule.nameRules" v-model="selectedItem.PLC_NM"></v-text-field>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field clearable dense hide-details :label="$t('biz_center_lname')" v-model="selectedItem.PLC_LNM"></v-text-field>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field clearable dense hide-details :label="$t('biz_center_kname')" v-model="selectedItem.PLC_FNM"></v-text-field>
                    </v-col>
                    <v-col lg="6" cols="8" class="pb-2">
                      <v-select cache-items dense hide-details validate-on-blur item-value="CODE" item-text="NAME" :label="$t('biz_center_type')" :items="bizCenterTypeList" v-model="selectedItem.PLC_TYPE"></v-select>
                    </v-col>
                    <v-col lg="6" cols="4" class="pb-2">
                      <v-checkbox dense hide-details class="my-1" :label="$t('active')" true-value="Y" false-value="N" v-model="selectedItem.USE_YN"></v-checkbox>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="PK" item-text="TEXT" :label="$t('department', 'common')" :items="departmentList" v-model="selectedItem.TCO_DEPT_PK"></v-select>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :label="$t('nation', 'common')" :items="nationList" v-model="selectedItem.NATION"></v-select>
                    </v-col>
                    <v-col lg="4" cols="12" class="pb-2">
                      <v-menu offset-y min-width="290px" transition="scale-transition" :close-on-content-click="false" v-model="fromDateMenu">
                        <template v-slot:activator="{ on }">
                          <v-text-field clearable dense hide-details readonly v-on="on" :label="$t('from_date')" v-model="fromDateFormatted"></v-text-field>
                        </template>
                        <v-date-picker no-title :color="currentTheme" :locale="curLang.CODE" v-model="selectedItem.VALID_FROM" @input="fromDateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col lg="4" cols="12" class="pb-2">
                      <v-menu offset-y min-width="290px" transition="scale-transition" :close-on-content-click="false" v-model="toDateMenu">
                        <template v-slot:activator="{ on }">
                          <v-text-field clearable dense hide-details readonly v-on="on" :label="$t('to_date')" v-model="toDateFormatted"></v-text-field>
                        </template>
                        <v-date-picker no-title :color="currentTheme" :locale="curLang.CODE" v-model="selectedItem.VALID_TO" @input="toDateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col lg="4" cols="12" class="pb-2">
                      <v-menu offset-y min-width="290px" transition="scale-transition" :close-on-content-click="false" v-model="confirmDateMenu">
                        <template v-slot:activator="{ on }">
                          <v-text-field clearable dense hide-details readonly v-on="on" :label="$t('confirm_date')" v-model="confirmDateFormatted"></v-text-field>
                        </template>
                        <v-date-picker no-title :color="currentTheme" :locale="curLang.CODE" v-model="selectedItem.CONFIRM_DATE" @input="confirmDateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col lg="12" cols="12" class="pb-2">
                      <v-textarea clearable dense hide-details rows="2" :label="$t('description')" v-model="selectedItem.REMARK"></v-textarea>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :label="$t('company_group')" :items="companyGroupList" v-model="selectedItem.COM_GRP"></v-select>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :label="$t('profit_loss_group_1')" :items="profitLossGroup1List" v-model="selectedItem.PLC_GRP1"></v-select>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :label="$t('profit_loss_group_2')" :items="profitLossGroup2List" v-model="selectedItem.PLC_GRP2"></v-select>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select cache-items dense hide-details item-value="CODE" item-text="NAME" :label="$t('profit_loss_group_3')" :items="profitLossGroup2List" v-model="selectedItem.PLC_GRP3"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <biz-center-dialog ref="bizCenterDialog" :companyPK="user.TCO_COMPANY_PK" @returnData="handleReturnData"></biz-center-dialog>

    <delete-dialog ref="deleteDialog" :deleteProps="deleteProps" @returnDeletedItem="removeDeletedItem"></delete-dialog>
  </v-container>
</template>

<script>
import listToTree from "list-to-tree-lite"
import moment from "moment"
const findValueDeep = require('deepdash/findValueDeep');
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    BizCenterDialog: () => import("@/components/dialog/BizCenterDialog"),
    DeleteDialog: () => import("@/components/dialog/DeleteDialog")
  },

  data: () => ({
    companyList: [],
    selectedCompany: '',
    searchBizCenterCode: '',
    searchBizCenterName: '',

    treeList: [],
    activeNodes: [],

    upperBizCenterCode: '',
    selectedItem: {},

    bizCenterTypeList: [],
    departmentList: [],
    nationList: [],

    fromDateMenu: false,
    toDateMenu: false,
    confirmDateMenu: false,

    companyGroupList: [],
    profitLossGroup1List: [],
    profitLossGroup2List: [],
    profitLossGroup3List: [],

    formIsValid: undefined,

    actionType: '',

    deleteProps: {},
  }),

  created() {
    this.selectedCompany = this.user.TCO_COMPANY_PK
    this.initBlank()
    this.getListCodes()
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 140 },
    fromDateFormatted: {
      get() { return this._formatDate(this.selectedItem.VALID_FROM) },
      set(newValue) { 
        if(!newValue) this.selectedItem.VALID_FROM = ''
        const date = this._formatDate(newValue)
        return date
      }
    },
    toDateFormatted: {
      get() { return this._formatDate(this.selectedItem.VALID_TO) },
      set(newValue) { 
        if(!newValue) this.selectedItem.VALID_TO = ''
        const date = this._formatDate(newValue)
        return date
      }
    },
    confirmDateFormatted: {
      get() { return this._formatDate(this.selectedItem.CONFIRM_DATE) },
      set(newValue) { 
        if(!newValue) this.selectedItem.CONFIRM_DATE = ''
        const date = this._formatDate(newValue)
        return date
      }
    }
  },

  watch: {
    selectedCompany(val) {
      if(val) {
        this.search()
      }
    }
  },

  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.bizCenterTypeList = await this._getCommonCode('ACAB0150', this.user.TCO_COMPANY_PK)
      this.departmentList = await this._getOrg(this.user.TCO_COMPANY_PK)
      this.nationList = await this._getCommonCode('HR0009', this.user.TCO_COMPANY_PK)
      this.companyGroupList = await this._getCommonCode('COEO0010', this.user.TCO_COMPANY_PK)
      this.profitLossGroup1List = await this._getCommonCode('ACAB0120')
      this.selectedItem.PLC_GRP1 = this.profitLossGroup1List[0].CODE;
      this.profitLossGroup2List = await this._getCommonCode('ACAB0130')
      this.selectedItem.PLC_GRP2 = this.profitLossGroup2List[0].CODE;
      this.profitLossGroup3List = await this._getCommonCode('ACAB0140')
      this.selectedItem.PLC_GRP3 = this.profitLossGroup3List[0].CODE;
    },

    async search() {
      const dso = {
        type: 'list',
        selpro: 'ac_sel_6010040_tree',
        para: [ this.selectedCompany, !this.searchBizCenterCode ? '' : this.searchBizCenterCode, !this.searchBizCenterName ? '' : this.searchBizCenterName ]
      }
      const result = await this._dsoCall(dso, 'select', false)
      if(result) {
        this.treeList = listToTree(result, { idKey: 'PK', parentKey: 'P_PK' })
      } else {
        this.treeList = []
      }
    },

    getSelectedNode() {
      if(this.activeNodes.length) {
        this.getDetail(this.activeNodes[0].PK)
      }
    },

    initBlank() {
      this.upperBizCenterCode = ''
      this.selectedItem = {
        PK: '',
        P_PK: '',
        PLC_CD: '',
        USE_YN: 'Y',
        PLC_NM: '',
        PLC_LNM: '',
        PLC_FNM: '',
        PLC_TYPE: '',
        TCO_DEPT_PK: '',
        NATION: '',
        VALID_FROM: '',
        VALID_TO: '',
        CONFIRM_DATE: '',
        REMARK: '',
        COM_GRP: '',
        PLC_GRP1: '',
        PLC_GRP2: '',
        PLC_GRP3: ''
      }
    },

    getDetail(abCenterPK) {
      this.isProcessing = true
      this.$axios.$post("dso/callproc", { proc: "AC_SEL_6010040_ABCENTER_ENTRY", para: [abCenterPK] })
        .then((res) => {
          if(res.data) {
            this.actionType = "u"
            this.selectedItem = {...res.data[0]}
            this.upperBizCenterCode = this.selectedItem.P_PLC_CD
            this.selectedItem.VALID_FROM = this._formatDateForPicker(this.selectedItem.VALID_FROM)
            this.selectedItem.VALID_TO = this._formatDateForPicker(this.selectedItem.VALID_TO)
            this.selectedItem.CONFIRM_DATE = this._formatDateForPicker(this.selectedItem.CONFIRM_DATE)
          } else {
            this.showNotification('danger', this.$t('error_occurs', 'common'), res.message)
            this.actionType = ""
            this.initBlank()
          }
        })
        .catch((e) => {
          this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
        })
        .then(() => {
          this.isProcessing = false
        })
    },

    openBizCenterDialog() {
      this.$refs.bizCenterDialog.dialogIsShow = true
    },

    handleReturnData(data) {
      this.upperBizCenterCode = data.CODE
      this.selectedItem.P_PK = data.PK
    },

    addNew() {
      this.actionType = "i"
      this.initBlank()
      this.$refs.entryForm.resetValidation()
      this.activeNodes = []
    },

    save() {
      if(this.$refs.entryForm.validate()) {
        this.formIsValid = true
        this.isProcessing = true
        this.selectedItem = this._formatNullValuesToEmpty(this.selectedItem)
        this.$axios.$post("dso/callproc", { 
          proc: "AC_UPD_6010040_ABCENTER_ENTRY", 
          para: [
            !this.actionType ? "i" : this.actionType, this.selectedItem.PK, this.selectedItem.P_PK,
            this.selectedItem.PLC_CD, this.selectedItem.PLC_NM, this.selectedItem.PLC_LNM, this.selectedItem.PLC_FNM,
            this.selectedItem.PLC_TYPE, this.selectedItem.USE_YN, this.selectedItem.TCO_DEPT_PK, this.selectedCompany, this.selectedItem.NATION,
            this._formatDateToSave(this.selectedItem.VALID_FROM), this._formatDateToSave(this.selectedItem.VALID_TO), this._formatDateToSave(this.selectedItem.CONFIRM_DATE),
            this.selectedItem.REMARK, this.selectedItem.COM_GRP, 
            this.selectedItem.PLC_GRP1, this.selectedItem.PLC_GRP2, this.selectedItem.PLC_GRP3
          ] 
        })
        .then((res) => {
          if(res.data) {
            this.isProcessing = false
            this.showNotification('success', this.$t('modify_success', 'common'), '')
            this.search()
          } else {
            this.isProcessing = false
            this.showNotification('danger', this.$t('modify_failed', 'common'), res.message)
          }
        })
        .catch((e) => {
          this.isProcessing = false
          this.showNotification('danger', this.$t('error_occurs', 'common'), e.message)
        })
      } else {
        this.formIsValid = false
      }
    },

    openDeleteDialog() {
      if(!this.selectedItem.PK) {
        return this.showNotification('danger', this.$t('alert', 'common'), this.$t('please_choose_a_node_first', 'common'))
      }
      this.$refs.deleteDialog.dialogIsShow = true
      this.deleteProps = {
        proc: "AC_UPD_6010040_ABCENTER_ENTRY",
        para: [ 'd', this.selectedItem.PK, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ],
        arrayName: 'treeList'
      }
    },

    removeDeletedItem(deletedItemPK, arrayName) {
      if(deletedItemPK && arrayName) {
        findValueDeep(
          this[arrayName],
          (value, index, parent) => {
            if(value && value.PK === deletedItemPK) {
              if(parent.children) {
                parent.children.splice(index, 1)
              } else {
                parent.splice(index, 1)
              }
            }
          },
          { childrenPath: 'children' }
        )
        this.initBlank()
      }
    }
  }
}
</script>

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
                <v-select cache-items clearable outlined dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="companyList" v-model="selectedCompany" @change="onChangeCompany"></v-select>
              </v-col>
              <v-col lg="6" cols="12">
                <v-select cache-items clearable outlined dense hide-details :label="$t('biz_place')" item-value="PK" item-text="TEXT" :items="bizPlaceList" v-model="lstBizPlace" @keypress.enter="search"></v-select>
              </v-col>
              <v-col lg="6" cols="12">
                <v-text-field clearable outlined dense hide-details :label="$t('cost_center_code')" v-model="searchCenterCode" @keypress.enter="search"></v-text-field>
              </v-col>
              <v-col lg="6" cols="12">
                <v-text-field clearable outlined dense hide-details :label="$t('cost_center_name')" v-model="searchCenterName" @keypress.enter="search"></v-text-field>
              </v-col>
              <v-col lg="5" cols="10">
                <v-select cache-items clearable outlined dense hide-details :label="$t('company')" :items="statusList" v-model="searchStatus"></v-select>
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
                <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="PLC_NM"
                  :active.sync="activeNodes" :color="currentTheme" :items="treeList" @update:active="getSelectedNode">
                    <template v-slot:label="{ item, active }">
                      <div @click="active ? $event.stopPropagation() : null">{{ item.PLC_NM }}</div>
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
             
              <v-col lg="12" cols="12">
                <div class="d-flex justify-end">
                    <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="addNew"/>                   
                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing"  @onclick="save"/>                                                  
                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing || selectedItem._rowstatus === 'i' || selectedItem._rowstatus === 'u'"  @onclick="confirmDelete = true"/>      
                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing"  @onclick="exportReport"/>          
                </div>
                 <!-- Action Buttons 
                Add
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on" color="success" :disabled="isProcessing" @click="addNew">
                      <v-icon>mdi-plus-thick</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('add') }}</span>
                </v-tooltip> -->
                <!-- Save
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="save">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('save') }}</span>
                </v-tooltip> -->
                <!-- Delete 
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on" color="error" :disabled="isProcessing || selectedItem._rowstatus === 'i' || selectedItem._rowstatus === 'u'" @click="confirmDelete = true">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('delete') }}</span>
                </v-tooltip>-->
                <!-- Report 
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="exportReport">
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('report') }}</span>
                </v-tooltip>-->
              </v-col>
              <!-- Form -->
              <v-form lazy-validation ref="entryForm" v-model="formIsValid">
                <v-container fluid class="py-0">
                  <v-row dense align="start" justify="space-between">
                    <!-- Upper Cost Center Code -->
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-text-field dense outlined hide-details readonly :label="$t('upper_cost_center_code')" v-model="upperCostCenterCode">
                        <template v-slot:append>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" :color="currentTheme" @click="openCostCenterDialog">mdi-window-restore</v-icon>
                            </template>
                            <span>{{ $t('list_upper_code') }}</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" :color="currentTheme" @click="upperCostCenterCode = '', selectedItem.P_PK = ''">mdi-eraser</v-icon>
                            </template>
                            <span>{{ $t('reset_upper_code') }}</span>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col lg="6" cols="12" class="pb-2">
                      <v-select dense hide-details
                        outlined
                        item-value="PK" 
                        item-text="TEXT" 
                        :label="$t('biz_place')" 
                        :items="bizPlaceList" 
                        v-model="selectedItem.TCO_BUSPLACE_PK" >
                      </v-select>
                    </v-col>
                    <!-- Cost Center Code -->
                    <v-col lg="6" md="6" sm="12" cols="12" class="pb-2">
                      <v-text-field clearable outlined dense hide-details :label="$t('cost_center_code')" v-model="selectedItem.PL_CD"></v-text-field>
                    </v-col>
                    <!-- Active -->
                    <v-col align-self="center" lg="2" md="2" sm="4" cols="4">
                      <v-checkbox dense hide-details class="my-0 py-0" :label="$t('active')" true-value="Y" false-value="N" v-model="selectedItem.USE_YN"></v-checkbox>
                    </v-col>
                    <!-- Leaf YN -->
                    <v-col align-self="center" lg="2" md="2" sm="4" cols="4">
                      <v-checkbox dense hide-details class="my-0 py-0" :label="$t('leaf_yn')" true-value="Y" false-value="N" v-model="selectedItem.LEAF_YN"></v-checkbox>
                    </v-col>
                    <!-- PMS YN -->
                    <v-col align-self="center" lg="2" md="2" sm="4" cols="4">
                      <v-checkbox dense hide-details class="my-0 py-0" :label="$t('pms_yn')" true-value="Y" false-value="N" v-model="selectedItem.PMS_YN"></v-checkbox>
                    </v-col>
                    <!-- Cost Center Name -->
                    <v-col lg="4" md="12" sm="12" cols="12" class="pb-2">
                      <v-text-field clearable dense outlined hide-details validate-on-blur :label="$t('cost_center_name')" :rules="validationRule.nameRules" v-model="selectedItem.PL_NM"></v-text-field>
                    </v-col>
                    <!-- Cost Center LName -->
                    <v-col lg="4" md="12" sm="12" cols="12" class="pb-2">
                      <v-text-field clearable outlined  dense hide-details :label="$t('cost_center_lname')" v-model="selectedItem.PL_LNM"></v-text-field>
                    </v-col>
                    <!-- Cost Center FName -->
                    <v-col lg="4" md="12" sm="12" cols="12" class="pb-2">
                      <v-text-field clearable outlined dense hide-details :label="$t('cost_center_kname')" v-model="selectedItem.PL_FNM"></v-text-field>
                    </v-col>
                    <!-- From Date -->
                    <v-col lg="4" md="4" sm="12" cols="12" class="pb-2">
                      <date-picker outlined :defaultType="'today'" :label="$t('from_date')" :inputValue="selectedItem.VALID_FROM" :rules="validationRule.nameRules" @returnValue="selectedItem.VALID_FROM = $event"></date-picker>
                    </v-col>
                    <!-- To Date -->
                    <v-col lg="4" md="4" sm="12" cols="12" class="pb-2">
                      <date-picker outlined :defaultType="'null'" :label="$t('to_date')" :inputValue="selectedItem.VALID_TO" @returnValue="selectedItem.VALID_TO = $event"></date-picker>
                    </v-col>
                    <!-- Confirm Date Date -->
                    <v-col lg="4" md="4" sm="12" cols="12" class="pb-2">
                      <date-picker outlined :defaultType="'today'" :label="$t('confirm_date')" :inputValue="selectedItem.CONFIRM_DATE" @returnValue="selectedItem.CONFIRM_DATE = $event"></date-picker>
                    </v-col>
                    <!-- Description -->
                    <v-col lg="12" md="12" sm="12" cols="12" class="pb-2">
                      <v-textarea outlined clearable dense hide-details rows="2" :label="$t('description')" v-model="selectedItem.REMARK"></v-textarea>
                    </v-col>
                    <!-- Tabs -->
                    <v-col lg="5" md="12" cols="12">
                      <v-tabs grow height="35" background-color="#EEEEEE" :color="currentTheme" v-model="tab">
                        <v-tab>Tab 1</v-tab>
                        <v-tab>Tab 2</v-tab>
                        <v-tab>{{ $t('tab_bond') }}</v-tab>
                      </v-tabs>
                    </v-col>
                    <!-- Tab Contents -->
                    <v-col lg="12" md="12" cols="12">
                      <v-tabs-items v-model="tab">
                        <!-- Tab 1 Content -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                          <v-container fluid class="pa-0">
                            <v-row dense outlined align="start" justify="space-between">
                              <!-- Customer ID -->
                              <v-col lg="5" sm="12" cols="12">
                                <v-text-field dense outlined hide-details readonly :label="$t('customer_id')" v-model="selectedItem.PARTNER_ID"></v-text-field>
                              </v-col>
                              <!-- Customer Name -->
                              <v-col lg="5" sm="9" cols="8">
                                <v-text-field dense outlined hide-details readonly :label="$t('customer_name')" v-model="selectedItem.PARTNER_NAME"></v-text-field>
                              </v-col>
                              <!-- Open List Customer Btn & Reset Customer Btn -->
                              <v-col lg="2" sm="3" cols="4">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn icon tile v-on="on" :color="currentTheme" @click="openPartnerDialog">
                                      <v-icon>mdi-window-restore</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{ $t('list_customer') }}</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn icon tile v-on="on" :color="currentTheme" @click="selectedItem.PARTNER_ID = '', selectedItem.PARTNER_NAME = '', selectedItem.TCO_BUSPARTNER_PK = ''">
                                      <v-icon>mdi-eraser</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{ $t('reset_customer') }}</span>
                                </v-tooltip>
                              </v-col>
                              <!-- Project Type -->
                              <v-col lg="4" sm="12" cols="12" class="pb-2">
                                <v-select cache-items outlined clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('pj_type')" :items="pjTypeList" v-model="selectedItem.PROJECT_TYPE"></v-select>
                              </v-col>
                              <!-- Contract Amt 1 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('contract_amt_from')" v-model="selectedItem.CONTRACT_AMT"></v-text-field>
                              </v-col>
                              <!-- Contract Amt 2 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('contract_amt_to')" v-model="selectedItem.CONTRACT_AMT2"></v-text-field>
                              </v-col>
                              <!-- Department -->
                              <v-col lg="4" sm="12" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="PK" item-text="TEXT" :label="$t('department')" :items="departmentList" v-model="selectedItem.TCO_DEPT_PK"></v-select>
                              </v-col>
                              <!-- Budget Cost 1 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('budget_cost_1')" v-model="selectedItem.FORECAST_TOTAL"></v-text-field>
                              </v-col>
                              <!-- Budget Cost 2 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('budget_cost_2')" v-model="selectedItem.FORECAST2_TOTAL"></v-text-field>
                              </v-col>
                              <!-- Currency -->
                              <v-col lg="4" sm="12" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="NAME" :label="$t('currency')" :items="currencyList" v-model="selectedItem.CONTRACT_CCY"></v-select>
                              </v-col>
                              <!-- Trans Rate 1 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('trans_rate_1')" v-model="selectedItem.TR_RATE"></v-text-field>
                              </v-col>
                              <!-- Trans Rate 2 -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('trans_rate_2')" v-model="selectedItem.BK_RATE"></v-text-field>
                              </v-col>
                              <!-- Payment Terms -->
                              <v-col lg="4" sm="12" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="CODE_NM" :label="$t('payment_terms')" :items="paymentTermsList" v-model="selectedItem.PAYMENT_TERMS"></v-select>
                              </v-col>
                              <!-- Trans Amt -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('trans_amt')" v-model="selectedItem.TRAMS_AMT"></v-text-field>
                              </v-col>
                              <!-- Book Amt -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('book_amt')" v-model="selectedItem.BOOK_AMT"></v-text-field>
                              </v-col>
                              <!-- Budget Cost -->
                              <v-col lg="4" sm="12" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="NAME" :label="$t('budget_cost')" :items="budgetCostList" v-model="selectedItem.BUDGET"></v-select>
                              </v-col>
                              <!-- Budget Trans -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('budget_trans')" v-model="selectedItem.BUDGED_TRANS"></v-text-field>
                              </v-col>
                              <!-- Budget Book -->
                              <v-col lg="4" sm="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('budget_book')" v-model="selectedItem.BUDGED_BOOK"></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-tab-item>
                        <!-- Tab 2 Content -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                          <v-container fluid class="pa-0">
                            <v-row dense align="start" justify="space-between">
                              <!-- Nation -->
                              <v-col lg="6" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="NAME" :label="$t('nation')" :items="nationList" v-model="selectedItem.NATION"></v-select>
                              </v-col>
                              <!-- Company Group -->
                              <v-col lg="6" cols="12" class="pb-2">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="NAME" :label="$t('company_group')" :items="companyGroupList" v-model="selectedItem.COM_GRP"></v-select>
                              </v-col>
                              <!-- Profit Loss Group 1 -->
                              <v-col lg="4" cols="12">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="CODE_NM" :label="$t('profit_loss_group_1')" :items="profitLossGroup1List" v-model="selectedItem.PL_GRP1"></v-select>
                              </v-col>
                              <!-- Profit Loss Group 2 -->
                              <v-col lg="4" cols="12">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="CODE_NM" :label="$t('profit_loss_group_2')" :items="profitLossGroup2List" v-model="selectedItem.PL_GRP2"></v-select>
                              </v-col>
                              <!-- Profit Loss Group 3 -->
                              <v-col lg="4" cols="12">
                                <v-select cache-items clearable dense outlined hide-details item-value="CODE" item-text="CODE_NM" :label="$t('profit_loss_group_3')" :items="profitLossGroup2List" v-model="selectedItem.PL_GRP3"></v-select>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-tab-item>
                        <!-- Tab Bond Content -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                          <v-container fluid class="pa-0">
                            <v-row dense align="start" justify="space-between">
                              <!-- Performance YN -->
                              <v-col align-self="center" lg="2" md="6" cols="12">
                                <v-checkbox dense hide-details class="my-0 py-0" :label="$t('performance_yn')" true-value="Y" false-value="N" v-model="selectedItem.PERFORMANCE_YN"></v-checkbox>
                              </v-col>
                              <!-- Performance Amount -->
                              <v-col lg="4" md="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('performance_amount')" v-model="selectedItem.PERFORMANCE_AMT"></v-text-field>
                              </v-col>
                              <!-- Performance From -->
                              <v-col lg="3" md="6" cols="12" class="pb-2">
                                <date-picker outlined :defaultType="'null'" :label="$t('performance_from')" :inputValue="selectedItem.PERFORMANCE_FROM" @returnValue="selectedItem.PERFORMANCE_FROM = $event"></date-picker>
                              </v-col>
                              <!-- Performance To -->
                              <v-col lg="3" md="6" cols="12" class="pb-2">
                                <date-picker outlined :defaultType="'null'" :label="$t('performance_to')" :inputValue="selectedItem.PERFORMANCE_TO" @returnValue="selectedItem.PERFORMANCE_TO = $event"></date-picker>
                              </v-col>
                              <!-- Advance YN -->
                              <v-col align-self="center" lg="2" md="6" cols="12">
                                <v-checkbox dense outlined hide-details class="my-0 py-0" :label="$t('advance_yn')" true-value="Y" false-value="N" v-model="selectedItem.ADVANCE_YN"></v-checkbox>
                              </v-col>
                              <!-- Advance Amount -->
                              <v-col lg="4" md="6" cols="12" class="pb-2">
                                <v-text-field dense outlined hide-details type="number" :label="$t('advance_amount')" v-model="selectedItem.ADVANCE_AMT"></v-text-field>
                              </v-col>
                              <!-- Advance From -->
                              <v-col lg="3" md="6" cols="12" class="pb-2">
                                <date-picker outlined :defaultType="'null'" :label="$t('advance_from')" :inputValue="selectedItem.ADVANCE_FROM" @returnValue="selectedItem.ADVANCE_FROM = $event"></date-picker>
                              </v-col>
                              <!-- Advance To -->
                              <v-col lg="3" md="6" cols="12" class="pb-2">
                                <date-picker outlined :defaultType="'null'" :label="$t('advance_to')" :inputValue="selectedItem.ADVANCE_TO" @returnValue="selectedItem.ADVANCE_TO = $event"></date-picker>
                              </v-col>
                              <!-- Warranty YN -->
                              <v-col align-self="center" lg="2" md="6" cols="12">
                                <v-checkbox dense outlined hide-details class="my-0 py-0" :label="$t('warranty_yn')" true-value="Y" false-value="N" v-model="selectedItem.WARRANTY_YN"></v-checkbox>
                              </v-col>
                              <!-- Warranty Amount -->
                              <v-col lg="4" md="6" cols="12">
                                <v-text-field dense outlined hide-details type="number" :label="$t('warranty_amount')" v-model="selectedItem.WARRANTY_AMT"></v-text-field>
                              </v-col>
                              <!-- Warranty From -->
                              <v-col lg="3" md="6" cols="12">
                                <date-picker outlined :defaultType="'null'" :label="$t('warranty_from')" :inputValue="selectedItem.WARRANTY_FROM" @returnValue="selectedItem.WARRANTY_FROM = $event"></date-picker>
                              </v-col>
                              <!-- Warranty To -->
                              <v-col lg="3" md="6" cols="12">
                                <date-picker outlined :defaultType="'null'" :label="$t('warranty_to')" :inputValue="selectedItem.WARRANTY_TO" @returnValue="selectedItem.WARRANTY_TO = $event"></date-picker>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <cost-center-dialog ref="costCenterDialog" :selPro="'SYS_SEL_COST_CENTER_YN_NOCACHE'" :companyPK="selectedCompany" :plcPK="selectedItem._rowstatus === 'i' ? '' : selectedItem.PK" @returnData="handleReturnData"></cost-center-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnPartner"></partner-dialog>
    <action-confirm :action="'DELETE'" v-if="confirmDelete" @onCloseDialog="confirmDelete = false" @onConfirm="deleteItem" />
  </v-container>
</template>

<script>
import listToTree from "list-to-tree-lite"
export default {
  layout: 'default',
  middleware: 'user',

  components: {
    CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
    PartnerDialog:() => import("@/components/dialog/PartnerDialog"),
    DatePicker: () => import("@/components/control/DatePicker"),
    ActionConfirm: () => import("@/components/dialog/ActionConfirmDialog")
  },

  data: () => ({
    companyList: [],
    selectedCompany: '',
    searchCenterCode: '',
    searchCenterName: '',
    searchStatus: 'ALL',

    treeList: [],
    activeNodes: [],
    
    upperCostCenterCode: '',
    elName: [],
    selectedItem: {},

    fromDateMenu: false,
    toDateMenu: false,
    confirmDateMenu: false,

    tab: null,

    pjTypeList: [],
    departmentList: [],
    currencyList: [],
    paymentTermsList: [],
    budgetCostList: [],
    nationList: [],
    companyGroupList: [],
    profitLossGroup1List: [],
    profitLossGroup2List: [],
    profitLossGroup3List: [],

    performanceFromMenu: false,
    performanceToMenu: false,
    advanceFromMenu: false,
    advanceToMenu: false,
    warrantyFromMenu: false,
    warrantyToMenu: false,

    formIsValid: undefined,

    confirmDelete: false,

    bizPlaceList : [],
    lstBizPlace  : "",
    bizPlaceList_V2 : [],
  }),

  created() {
    this.getListCodes().then(() => {
      this.initBlank()
    })
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    limitHeight() { if(this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 140 },
    statusList() {
      return [
        { value: 'ALL', text: this.$t('select_all') },
        { value: 'Y', text: this.$t('active') },
        { value: 'N', text: this.$t('inactive') }
      ]
    }
  },

  watch: {
    selectedCompany(val) {
      if(val) {
        //this.search()
      }
    }
  },

  methods: {
    async getListCodes() {
      const dso_company_list = { type: 'list', selpro: 'SYS_SEL_LIST_COMPANY', para: [ this.user.PK ] }
      this.companyList = await this._dsoCall(dso_company_list, 'select', false)
      this.selectedCompany = this.companyList[0].PK      
      this.pjTypeList = await this._getCommonCode('CODC0150')
      this.departmentList = await this._getOrg(this.user.TCO_COMPANY_PK)
      this.currencyList = await this._getCommonCode('ACAB0110')
      this.paymentTermsList = await this._getCommonCode('ACCR0140')
      this.budgetCostList = await this._getCommonCode('ACCR0110')
      this.nationList = await this._getCommonCode('HR0009', this.user.TCO_COMPANY_PK)
      this.companyGroupList = await this._getCommonCode('COEO0010', this.user.TCO_COMPANY_PK)
      this.profitLossGroup1List = await this._getCommonCode('ACAB0120')
      this.profitLossGroup2List = await this._getCommonCode('ACAB0130')
      this.profitLossGroup3List = await this._getCommonCode('ACAB0140')

      const dso_bizplace_list = {
                        type: 'list',
                        selpro: 'SYS_SEL_BIZ_PLACE_V2',
                        para: [this.selectedCompany,  this.user.PK]
                          }
      this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
      if(this.bizPlaceList.length > 0)
      {
        this.lstBizPlace = this.bizPlaceList[0].PK; 
      };

      const dso_bizplace_list_v2 = {
                      type: 'list',
                      selpro: 'SYS_SEL_BIZ_PLACE_V3',
                      para: [this.selectedCompany,  this.user.PK]
                        }
      this.bizPlaceList_V2 = await this._dsoCall(dso_bizplace_list_v2, 'select', false)
      if(this.bizPlaceList_V2.length > 0)
      {
        this.selectedItem.TCO_BUSPLACE_PK = this.bizPlaceList_V2[0].PK;
      }
      this.search();
    },

    async search() {
      const dso = {
        type: 'list',
        selpro: 'ac_sel_6010050_tree',
        para: [ this.selectedCompany, !this.searchCenterCode ? '' : this.searchCenterCode, !this.searchCenterName ? '' : this.searchCenterName, !this.searchStatus ? 'ALL' : this.searchStatus, this.lstBizPlace ]
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
    async onChangeCompany(){
      this.bizPlaceList = [];
        const dso_bizplace_list = {
                          type: 'list',
                          selpro: 'SYS_SEL_BIZ_PLACE_v2',
                          para: [this.selectedCompany, this.user.PK]
                            }
        this.bizPlaceList = await this._dsoCall(dso_bizplace_list, 'select', false)
        if(this.bizPlaceList.length > 0)
        {
          this.lstBizPlace = this.bizPlaceList[0].PK;
        }
        this.search();
    },
    initBlank() {
      this.upperCostCenterCode = this.activeNodes.length ? this.activeNodes[0].PL_CD : ''
      this.elName = [
        "_rowstatus", "PK", "P_PK", "TCO_COMPANY_PK", "TCO_BUSPARTNER_PK", "PL_CD", "USE_YN", "PL_NM", "PL_LNM", "PL_FNM", "VALID_FROM", "VALID_TO", "CONFIRM_DATE",
        "REMARK", "PARTNER_ID", "PARTNER_NAME", "PROJECT_TYPE", "CONTRACT_AMT", "CONTRACT_AMT2", "TCO_DEPT_PK", "FORECAST_TOTAL", "FORECAST2_TOTAL", "CONTRACT_CCY",
        "TR_RATE", "BK_RATE", "PAYMENT_TERMS", "TRAMS_AMT", "BOOK_AMT", "BUDGET", "BUDGED_TRANS", "BUDGED_BOOK", "NATION", "COM_GRP", "PL_GRP1", "PL_GRP2", "PL_GRP3",
        "PERFORMANCE_YN", "PERFORMANCE_AMT", "PERFORMANCE_FROM", "PERFORMANCE_TO", "ADVANCE_YN", "ADVANCE_AMT", "ADVANCE_FROM", "ADVANCE_TO", 
        "WARRANTY_YN", "WARRANTY_AMT", "WARRANTY_FROM", "WARRANTY_TO", "LEAF_YN", "PMS_YN", "TCO_BUSPLACE_PK"
      ]
      var L_TCO_BUSPLACE_PK = this.selectedItem.TCO_BUSPLACE_PK; 
      
      this.selectedItem = this._initObject(this.elName)
      this.selectedItem.P_PK = this.activeNodes.length ? this.activeNodes[0].PK : 0
      this.selectedItem.TCO_COMPANY_PK = this.selectedCompany
      this.selectedItem.TCO_BUSPLACE_PK = L_TCO_BUSPLACE_PK
      this.selectedItem.ADVANCE_YN = "N"
      this.selectedItem.ALLOW_INPUT_YN = "N"
      this.selectedItem.LEAF_YN = "Y"
      this.selectedItem.PERFORMANCE_YN = "N"
      this.selectedItem.PMS_YN = "Y"
      this.selectedItem.TURNOVER_YN = "Y"
      this.selectedItem.USE_YN = "Y"
      this.selectedItem.WARRANTY_YN = "Y"
      this.selectedItem.CONFIRM_DATE = new Date().toISOString().substr(0, 10)
      this.selectedItem.VALID_FROM = new Date().toISOString().substr(0, 10)
    },

    async getDetail(abpl_pk) {
      this.$refs.entryForm.resetValidation()
      const dso = { type: "control", selpro: "ac_sel_6010050_abpl_uentry", para: [ abpl_pk ] }
      const result = await this._dsoCall(dso, 'select', false)
      this.selectedItem = result ? {...result} : {}
      this.upperCostCenterCode = ''
    },

    openCostCenterDialog() {
      this.$refs.costCenterDialog.dialogIsShow = true
    },

    handleReturnData(data) {
      this.upperCostCenterCode = data.CODE
      this.selectedItem.P_PK = data.PK
    },

    openPartnerDialog() {
      this.$refs.partnerDialog.dialogIsShow = true
    },

    handleReturnPartner(data) {
      this.selectedItem.TCO_BUSPARTNER_PK = data.PK
      this.selectedItem.PARTNER_ID = data.PARTNER_ID
      this.selectedItem.PARTNER_NAME = data.PARTNER_NAME
    },

    addNew() {
      this.initBlank()
      this.$refs.entryForm.resetValidation()
      // this.activeNodes = []
    },

    async save() {
      if(this.$refs.entryForm.validate()) {
        this.formIsValid = true
        if(this.selectedItem._rowstatus === "") {
          this.selectedItem._rowstatus = "u"
        }
        const dso = {
          type: "control", selpro: "ac_sel_6010050_abpl_uentry", updpro: "ac_upd_6010050_abpl_uentry",
          para: [ this.selectedItem.PK ], elname: this.elName, data: this.selectedItem
        }
        const result = await this._dsoCall(dso, "update", true)
        if(result) {
          this.selectedItem = result
          this.search()
        }
      } else {
        this.formIsValid = false
      }
    },

    async deleteItem() {
      if(this.selectedItem._rowstatus !== "i" || this.selectedItem._rowstatus !== "u") {
        this.selectedItem._rowstatus = "d"
      }
      const dso = {
        type: "control", selpro: "ac_sel_6010050_abpl_uentry", updpro: "ac_upd_6010050_abpl_uentry",
        para: [ this.selectedItem.PK ], elname: this.elName, data: this.selectedItem
      }
      const result = await this._dsoCall(dso, "update", true)
      if(result) {
        this.activeNodes = [];
        this.initBlank()
        this.search()
      }
    },
    async exportReport() 
    {
        let report_path = "report/60/10/rpt_6010050.xlsx"; 
        let hiddenCols = [];
        let excel = [];
          //setup allow col
          excel = [
            {
              sheet: 1,
              insertRange: [
                { range: "A1:E3", proc: "ac_rpt_6010050_m", params: [this.selectedCompany, this.lstBizPlace]  },//header
              ],
              insertRows: [
                {   
                  //sequence: "break",
                  startRow: 7, proc: "ac_rpt_6010050", params: [this.selectedCompany, this.lstBizPlace], dateColumns: [] , stringColumns: [ "UPLCD","UPLNM","PL_CD","PL_NM","PL_LNM","PL_FNM"],
                
                /* total: [
                    {   column: "ACCOUNT_NO", isDisplay: true, type: "SUM", text: this.$t("excel_total_record") , isMerge: false, merge: { from: 2, to: 8 }    }, //"Total $[0]: $[1] record(s) "
                    {   column: null, isDisplay: true, type: "SUM", text: this.$t("excel_grand_record"), isMerge: true, isGrandTotal: true , font: {  size: 18, bold: true } , merge: { from: 1, to: 8 }  }, //"Grand total: $[1] record(s) "
                  ]*/
                }
              ],
              hideColumns: hiddenCols
            },
          ];
            if(!report_path) {
            this.salaryStatus = this.$t("template_not_available");
              return;
            }

            const res = await this.$axios.$get('/dso/makereport', { responseType: "blob", params:{ template:  report_path ,excel: JSON.stringify(excel)  } }  );
            if(res && res.size > 0){
              let blob = new Blob([res], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              });
              let url = window.URL.createObjectURL(blob);
              window.open(url);
              this.salaryStatus = this.$t("complete");
            } else {
              //this.showNotification( "danger", this.$t("fail_to_export_report"),  "",  4000 );
              this.salaryStatus = this.$t("fail_to_export_report");
            }   
    },
  }
}
</script>

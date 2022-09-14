<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col cols="12">
            <v-row no-gutters>
                <v-col cols="12" lg='4' v-show="showLeft" class="px-1 py-1"> 
                        <BaseTreeView ref="myTree"
                            :label="'company_entry'" :value="companyTreeList"
                            :height="500"
                            :expand="true"
                            :childrenKey="'items'" :keyExpr="'PK'" :displayExpr="'PLC_NM'"
                            @itemClick="itemClick"
                        >
                        </BaseTreeView>
                </v-col>
                  <v-col cols="12" :lg="showLeft ? 8 : 12" class="px-1 py-1">
                    <v-row no-gutters>
                        <BaseButton btn_type="default" icon_type="hide_search_panel" :btn_text="$t('hide_search_panel')" v-if="showLeft" mdi-icon="mdi-backburger" @onclick="openSearch" />
                        <BaseButton btn_type="default" icon_type="show_search_panel" :btn_text="$t('show_search_panel')"   v-else mdi-icon="mdi-forwardburger" @onclick="openSearch" />
                        <v-spacer></v-spacer>
                        <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing"  @onclick="addNew('Master')"/>
                        <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"      v-bind:disabled.sync="isProcessing"  @onclick="onSave('Master')"/>
                        <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"      v-bind:disabled.sync="isProcessing"  @onclick="onDelete('Master')"/>
                        <BaseButton btn_type="default" icon_type="print" :btn_text="$t('add_sub')"      v-bind:disabled.sync="isProcessing" mdi-icon="mdi-folder-plus"/>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                            <BasePhoto v-model="data.TCO_BPPHOTO_PK" :table_name="'TCO_BPPHOTO'" ref="photo"></BasePhoto>
                        </v-col>
                        <v-col cols='12' lg='8' align='center' class="px-1 py-1">
                            <v-row no-gutters>
                                <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseCheckbox :label="$t('leaf_yn')" true-value="Y" false-value="N"  v-model="data.LEAF_YN"/>
                                </v-col>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false"  :label="$t('parent_company')" v-model="data.PARTNER_COM" ></BaseInput>
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('company')" :lstData="companytypeList" v-model="data.PARTNER_TYPE"> </BaseSelect>   
                                 </v-col>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('tax_code')" v-model="data.TAX_CODE" />    
                                 </v-col>
                            </v-row>

                            <v-row no-gutters>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('company_id')" v-model="data.PARTNER_ID"/>    
                                 </v-col>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('company_nm')" v-model="data.PARTNER_NAME"/>    
                                 </v-col>
                            </v-row>

                            <v-row no-gutters>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false"  :label="$t('short_nm')" v-model="data.SHORT_NM"></BaseInput>    
                                 </v-col>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('representative')" v-model="data.REPRESENTATIVE"/>    
                                 </v-col>
                            </v-row>

                            <v-row no-gutters>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false"  :label="$t('local_nm')" v-model="data.PARTNER_LNAME"></BaseInput>    
                                 </v-col>
                                 <v-col cols="12" lg="6" class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('foreign_nm')" v-model="data.PARTNER_FNAME"/>    
                                 </v-col>
                            </v-row>
                            <v-row no-gutters>
                                 <v-col cols='12' lg='6' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('fax')" v-model="data.FAX_NO"/>
                                </v-col>
                                <v-col cols='12' lg='6' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('email')" v-model="data.EMAIL_ADDRESS"/>
                                </v-col>
                            </v-row>
                            
                        </v-col>
                    </v-row>

                    <BaseTabs>
                        <BaseTab :name="$t('GENERAL_INFOR')">
                            <v-row no-gutters >
                                <v-col cols='12' lg='4' align='center'>
                                    <v-row no-gutters>
                                        <v-col cols="12" lg="4" class="px-1 py-1">
                                            <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="data.ACTIVE_YN"/>
                                        </v-col>
                                        <v-col cols="12" lg="8" class="px-1 py-1">
                                            <BaseDatePicker :outlined="true"  :label="$t('anniversary')"  v-model="data.ANNIVERSARY_DATE"></BaseDatePicker>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseDatePicker :outlined="true"  :label="$t('from_date')"  v-model="data.VALID_FROM"></BaseDatePicker>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseDatePicker :outlined="true"  :label="$t('to_date')" v-model="data.VALID_TO" ></BaseDatePicker>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <!-- Chua có -->
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('bank_account')" />
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('bank_type')"  :lstData="bankTypeList" v-model="data.BANK_TYPE"> </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('tax_office')" v-model="data.TAX_OFFICE"/>     
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('number_of_employee')" v-model="data.NUMBER_EMPLOYEE"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('industrial_zone')"  :lstData="industrialZoneList" v-model="data.COMPANY_INDUSTY"> </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('company_product')" v-model="data.COMPANY_PRODUCT"/>
                                </v-col>
                            </v-row>    
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('caption')" v-model="data.COMPANY_CAPITAL"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('nation')"  :lstData="nationList" v-model="data.NATION"> </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('company_size')"  :lstData="companySizeList" v-model="data.COMPANY_SIZE"> </BaseSelect>
                                </v-col>
                            </v-row>   
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('currency')"  :lstData="currencyList" v-model="data.TRANS_CURRENCY"> </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1" v-show="false">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('serial_no')" v-model="data.SERIAL_NO"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1" v-show="false">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('form_no')" v-model="data.FORM_NO"/>     
                                </v-col>
                            </v-row> 
                        </BaseTab>
                        <!-- <BaseTab :name="$t('CUSTOMER')" v-show="false">
                            <v-row no-gutters >
                                <v-col cols='12' lg='4' align='center'>
                                    <v-row no-gutters>
                                        <v-col cols="12" lg="4" class="px-1 py-1">
                                            <BaseCheckbox :label="$t('active_customer')" true-value="Y" false-value="N" v-model="data.CUST_YN"/>
                                        </v-col>
                                        <v-col cols="12" lg="8" class="px-1 py-1">
                                            <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('payment_form')"  :lstData="paymentFormList" v-model="data.CUST_PAYMENT_FORM"> </BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols='12' lg='4' align='center'>
                                    <v-row no-gutters>
                                        <v-col cols="12" lg="4" class="px-1 py-1">
                                            <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="data.ACTIVE_YN"/>
                                        </v-col>
                                        <v-col cols="12" lg="8" class="px-1 py-1">
                                        <BaseSelect null :outlined="true"  :label="$t('anniversary')" item-value="CODE" item-text="NAME" :lstData="salePresentativeList"  v-model="data.ANNIVERSARY_DATE"></BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('credit_limit')" v-model="data.CREDIT_LIMIT" />
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true"  :label="$t('invoice_terms')" item-value="CODE" item-text="NAME" :lstData="invoiceTermsList"  v-model="data.INVOICE_TERMS" ></BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true"  :label="$t('invoice_schedule')" item-value="CODE" item-text="NAME" :lstData="invoiceScheduleList"  v-model="data.ANNIVERSARY_DATE"></BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true"  :label="$t('sale_default_tax')" item-value="CODE" item-text="NAME" :lstData="saleDefaultTaxList"  v-model="data.ANNIVERSARY_DATE"></BaseSelect>
                                </v-col>
                                
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('invoice_grouping')" :lstData="invoiceGroupingList" v-model="data.INVOICE_GROUPING" > </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('credit_use')" v-model="data.CREDIT_USED" />
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('delivery_terms')" :lstData="deliveryTermsList" v-model="data.DELIVERY_TERMS" > </BaseSelect>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('bank_account')" v-model="data.CUST_BANK_ACCOUNT"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('cust_trade_type')" :lstData="custTradeTypeList" v-model="data.CUST_TRADE_TYPE"> </BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true" item-value="CODE" item-text="NAME" :label="$t('cust_payment_terms')" :lstData="custPaymentTermsList" v-model="data.CUST_PAYMENT_TEMRS"> </BaseSelect>
                                </v-col>
                            </v-row>
                        </BaseTab> -->
                        <!-- <BaseTab :name="$t('VENDOR')" v-show="false">
                            <v-row no-gutters >
                                <v-col cols='12' lg='4' align='center'>
                                    <v-row no-gutters>
                                        <v-col cols="12" lg="4" class="px-1 py-1">
                                            <BaseCheckbox :label="$t('vendor')" true-value="Y" false-value="N" v-model="data.VEN_YN"/>
                                        </v-col>
                                        <v-col cols="12" lg="8" class="px-1 py-1">
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols='12' lg='4' align='center'>
                                    <v-row no-gutters>
                                        <v-col cols="12" lg="4" class="px-1 py-1">
                                            <BaseCheckbox :label="$t('active')" true-value="Y" false-value="N" v-model="data.VEN_ACTIVE_YN"/>
                                        </v-col>
                                        <v-col cols="12" lg="8" class="px-1 py-1">
                                        <BaseSelect null :outlined="true"  :label="$t('payment_form')" item-value="CODE" item-text="NAME" :lstData="paymentFormList"  v-model="data.VEN_PAYMENT_FORM"></BaseSelect>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('payment_terms')" v-model="data.VEN_PAYMENT_TERMS" />
                                </v-col>
                            </v-row>

                            <v-row no-gutters>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true"  :label="$t('trade_type')" item-value="CODE" item-text="NAME" :lstData="tradeTypeList"  v-model="data.VEN_TRADE_TYPE" ></BaseSelect>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('bank_account')" v-model="data.VEN_BANK_ACCOUNT" />
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseSelect null :outlined="true"  :label="$t('default_tax')" item-value="CODE" item-text="NAME" :lstData="defaultTaxList"  v-model="data.PUR_DEFAULT_TAX"></BaseSelect>
                                </v-col>
                                
                            </v-row>
                        </BaseTab> -->
                        <!-- <BaseTab :name="$t('CHANGER')" v-show="false">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="addNew('Changer')"/>
                                    <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Changer')"/>
                                    <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Changer')"/>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseGridView :headertype="1" ref='idGridChanger' 
                                        :height="250" :header="headerChanger" :editable="true" :multiselect="true"  @cellClick="OnClick_Charger" @cellDblClick="onDblClickCell">
                                    </BaseGridView>
                                </v-col>
                            </v-row>
                        </BaseTab> -->
                        <!-- <BaseTab :name="$t('CONTARCT')" v-show="false">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="addNew('Contract')"/>
                                    <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Contract')"/>
                                    <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Contract')"/>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseGridView :headertype="1" ref='idGridContract' 
                                        :height="250" :header="headerContract" :editable="true" :multiselect="true" >
                                    </BaseGridView>
                                </v-col>
                            </v-row>
                        </BaseTab> -->
                        <BaseTab :name="$t('BIZ_PLACE')">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="addNew('BizPlace')"/>
                                    <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('BizPlace')"/>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseGridView :headertype="1" ref='idGrid' 
                                        :height="250" :header="header" :editable="true" :multiselect="true" >
                                    </BaseGridView>
                                </v-col>
                            </v-row>
                        </BaseTab>
                        
                        <!-- <BaseTab :name="$t('LOCATION')" v-show="false">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="addNew('Location')"/>
                                    <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Location')"/>
                                    <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Location')"/>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseGridView :headertype="1" ref='idGridLoca' 
                                        :height="250" :header="headerLoca" :editable="true" :multiselect="true" >
                                    </BaseGridView>
                                </v-col>
                            </v-row>
                        </BaseTab> -->
                        <!-- <BaseTab :name="$t('BANK_ACOUNT')" v-show="false">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                    <BaseButton btn_type="default" icon_type="add" :btn_text="$t('add')" v-bind:disabled.sync="isProcessing" @onclick="addNew('Bank')"/>
                                    <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Bank')"/>
                                    <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')" v-bind:disabled.sync="isProcessing" @onclick="onDelete('Bank')"/>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="px-1 py-1">
                                    <BaseGridView :headertype="1" ref='idGridLoca' 
                                        :height="250" :header="headerLoca" :editable="true" :multiselect="true" >
                                    </BaseGridView>
                                </v-col>
                            </v-row>
                        </BaseTab> -->
                        <BaseTab :name="$t('BASIC_FIRM_BANKING')">
                            <v-row no-gutters>
                            <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('org_no')" v-model="data.HDR_ORG_NO"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('customer_no')" v-model="data.JI_CUSNO"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('org_msg')" v-model="data.HDR_MSG"/>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                            <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('out_file_path')" v-model="data.FILE_PATH"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('backup_file_path')" v-model="data.FILE_PATH_BACKUP"/>
                                </v-col>
                                <v-col cols='12' lg='4' align='center' class="px-1 py-1">
                                    <BaseInput :outlined="true"  :clearable="false" :label="$t('IPBNK_BIC_C')" v-model="data.IPBNK_BIC_C"/>
                                </v-col>
                            </v-row>
                        </BaseTab>
                    </BaseTabs>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <delete-dialog ref="deleteDialog" :deleteProps="deleteProps" @returnDeletedItem="removeDeletedItem"></delete-dialog>
    <employee-dialog ref="employeeDialog" @closeEmployeeDialog="false" @callBackData="CallBack_EMP" :multiSelectMode="true"></employee-dialog>
    
</v-container>
</template>

<script>
import listToTree from "list-to-tree-lite";
const findValueDeep = require('deepdash/findValueDeep');
export default {
    layout: 'default',
    middleware: 'user',

    components: {
        DeleteDialog: () => import("@/components/dialog/DeleteDialog"),
        EmployeeDialog: () => import("@/components/dialog/EmployeeDialog"),
    },

    data: () => ({
        companyTreeList:[],
        companyList:[],
        companytypeList:[],
        bankTypeList:[],
        nationList:[],
        companySizeList:[],
        currencyList:[],
        industrialZoneList:[],
        paymentFormList: [],
        salePresentativeList:[],
        invoiceTermsList:[],
        invoiceTermsList    :[],
        invoiceScheduleList :[],
        saleDefaultTaxList  :[],
        invoiceGroupingList :[],
        deliveryTermsList   :[],
        custTradeTypeList   :[],
        custPaymentTermsList:[],
        elName: [],
        mstPara:[],
        dxg_gridBizPlace:[],
        dxg_gridCharger:[],
        dxg_gridContact:[],
        dxg_gridLocation:[],
        dxg_gridBankAccount:[],
        selectedCompany:'',
        showLeft:true,
        showGeneral: false,
        showBizPlace: false,
        showBasic:false,
        showChanger:false,
        showContract:false,
        showLoca:false,
        showBank:false,
        showContent:false,
        showVendor: false,
        header:[],
        headerChanger:[],
        headerLoca:[],

        data:[],
        selectedItem: [],
        checkAllYn:'',
        P_PK_N: null,
        UPPER_ORG_N: null,
        deleteProps: {},
        sel_row_tab_Charger: '',
        dsoBiz : {
            type: 'grid',
            selpro: 'COMM_SEL_8010081_BIZPLACE', 
        },
    }),

    created() {
        this.getListCodes();
    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
       limitHeight() { return this.windowHeight - 300 },
        
    },

    watch: {
    },

    methods: {
        openSearch(){
            this.showLeft = !this.showLeft;
        },

        onDisplayTab(obj){
        switch(obj){
          case "GENERAL":  {  this.showGeneral  = !this.showGeneral; break; }
          case "BIZPLACE":  {  this.showBizPlace  = !this.showBizPlace; break; }
          case "BASIC":  {  this.showBasic  = !this.showBasic; break; }
          case "CHANGER":  {  this.showChanger  = !this.showChanger; break; }
          case "LOCATION":  {  this.showLoca  = !this.showLoca; break; }
          case "CONTRACT":  {  this.showContract  = !this.showContract; break; }
          case "BANK":  {  this.showBank = !this.showBank; break; }
          case "CUSTOMER":  {  this.showContent = !this.showContent; break; }
          case "VENDOR":  {  this.showVendor = !this.showVendor; break; }
          

        }
      },
        async prepareCommonData(){
            let parentCodes = [
                "COEO0030", "ACCR0140", "ACCR0140", 'ACCR0270',"ACCR0300","HR0009","CODC0040","ACAB0110",
                "ACCR0280", "ACCR0110","ACCR0245","COCI0150","ACCR0150"
            ] ;
            let listCommonCode = await this._getCommonCode2( parentCodes,  this.selectedCompany );
            this.companytypeList = listCommonCode[0];
            this.paymentFormList = listCommonCode[1];
            this.paymentTermsList = listCommonCode[1];
            this.invoiceTermsList = listCommonCode[3];
            this.bankTypeList = listCommonCode[4];
            this.nationList = listCommonCode[5];
            this.companySizeList = listCommonCode[6];
            this.currencyList = listCommonCode[7];
            this.invoiceScheduleList = listCommonCode[8];
            this.saleDefaultTaxList = listCommonCode[9];
            this.defaultTaxList = listCommonCode[9];
            this.deliveryTermsList = listCommonCode[10];
            this.deliveryTermsList = listCommonCode[11];
            this.custPaymentTermsList = listCommonCode[12];
            this.tradeTypeList =listCommonCode[12];
            this.saleDefaultTaxList =listCommonCode[13];
            
            this.header =[
                 { title: ("loc_id"),  field: "LOC_ID",  type: ""},
                 { title: ("loc_nm"),  field: "LOC_NM",  type: ""},
                 { title: ("loc_lnm"),  field: "LOC_LNM",  type: ""},
                 { title: ("loc_fnm"),  field: "LOC_FNM",  type: ""},
                 { title: ("nation"),  field: "NATION",  type: ""},
                 { title: ("reg_no"),  field: "REG_NO",  type: ""},
                 { title: ("tax_code"),  field: "TAX_CD",  type: ""},
                 { title: ("tax_office"),  field: "TAX_OFFICE",  type: ""},
                 { title: ("representative"),  field: "REPRESENTATIVE",  type: ""},
                 { title: ("zip_code"),  field: "ZIP_CODE",  type: ""},
                 { title: ("addr_nm1"),  field: "ADDR_NM1",  type: ""},
                 { title: ("addrlnm_1"),  field: "ADDR_LNM1",  type: ""},
                 { title: ("phone_no"),  field: "PHONE_NO",  type: ""},
                 { title: ("fax_no"),  field: "FAX_NO",  type: ""},
                 { title: ("biz_type"),  field: "BIZ_TYPE",  type: ""},
                 { title: ("biz_item"),  field: "BIZ_ITEM",  type: ""},
                 { title: ("biz_group"),  field: "BIZ_GRP",  type: ""},
                 { title: ("descruption"),  field: "DESCRIPTION",  type: ""},
                 { title: ("use"),  field: "USE_YN",  type: "boolean"},
                 { title: ("start_dt"),  field: "ST_DATE",  type: "date"},
                 { title: ("end_dt"),  field: "END_DATE",  type: "date"},
                 { title: ("table"),  field: "TABLEE",  type: ""},
                 { title: ("tax_ofice_pk"),  field: "TAX_OFFICE_PK",  type: ""},

            ]
            this.headerChanger =[
                 { title: ("tco_company_pk"),  field: "TCO_COMPANY_PK",  type: ""},
                 { title: ("thr_employee_pk"),  field: "THR_EMPLOYEE_PK",  type: ""},
                 { title: ("emp_id"),  field: "EMP_ID",  type: ""},
                 { title: ("full_name"),  field: "FULL_NAME",  type: ""},
                 { title: ("org_nm"),  field: "ORG_NM",  type: ""},
                 { title: ("description"),  field: "DESCRIPTION",  type: ""},
                 { title: ("use_yn"),  field: "USE_YN",  type: "boolean"},
                 { title: ("valid_from"),  field: "VALID_FROM",  type: "date"},
                 { title: ("valid_to"),  field: "VALID_TO",  type: "date"},
                 { title: ("tablee"),  field: "TABLEE",  type: ""},
            ]
            this.headerChanger =[
                 { title: ("tco_company_pk"),  field: "TCO_COMPANY_PK",  type: ""},
                 { title: ("changer_nm"),  field: "CHARGER_NM",  type: ""},
                 { title: ("changer_pos"),  field: "CHARGER_POS",  type: ""},
                 { title: ("phone_noo"),  field: "PHONE_NOO",  type: ""},
                 { title: ("mobile_no"),  field: "MOBILE_NO",  type: ""},
                 { title: ("fax_no"),  field: "FAX_NO",  type: ""},
                 { title: ("email"),  field: "EMAIL",  type: ""},
                 { title: ("urgent_contact"),  field: "URGENT_CONTACT",  type: ""},
                 { title: ("addr"),  field: "ADDR",  type: "date"},
                 { title: ("use_yn"),  field: "USE_YN",  type: "boolean"},
                 { title: ("valid_from"),  field: "VALID_FROM",  type: "date"},
                 { title: ("valid_to"),  field: "VALID_TO",  type: "date"},
                 { title: ("tablee"),  field: "TABLEE",  type: ""},
            ]
            this.headerLoca =[
                 { title: ("tco_company_pk"),  field: "TCO_COMPANY_PK",  type: ""},
                 { title: ("loc_nm"),  field: "LOC_NM",  type: ""},
                 { title: ("loc_lnm"),  field: "LOC_LNM",  type: ""},
                 { title: ("loc_fnm"),  field: "LOC_FNM",  type: ""},
                 { title: ("changer_nm"),  field: "CHARGER_NM",  type: ""},
                 { title: ("saleorderloc_yn"),  field: "SALEORDERLOC_YN",  type: "boolean"},
                 { title: ("diliveryloc_yn"),  field: "DILIVERYLOC_YN",  type: "boolean"},
                 { title: ("collectionloc_yn"),  field: "COLLECTIONLOC_YN",  type: "boolean"},
                 { title: ("zip_code"),  field: "ZIP_CODE",  type: ""},

                 { title: ("addr1"),  field: "urgent_contact",  type: ""},
                 { title: ("addr2"),  field: "ADDR",  type: "date"},
                 { title: ("addr3"),  field: "USE_YN",  type: "boolean"},
                 { title: ("phone_noo"),  field: "PHONE_NOO",  type: ""},
                 { title: ("fax_no"),  field: "FAX_NO",  type: ""},
                 { title: ("email"),  field: "EMAIL",  type: ""},
                 { title: ("addr"),  field: "ADDR",  type: "date"},
                 { title: ("use_yn"),  field: "USE_YN",  type: "boolean"},
                 { title: ("trfr_date"),  field: "TRFR_DATE",  type: "date"},
                 { title: ("trto_date"),  field: "TRTO_DATE",  type: "date"},
                 { title: ("description"),  field: "DESCRIPTION",  type: ""},
            ]

            this.headerBank =[
                 { title: ("tco_company_pk"),  field: "TCO_COMPANY_PK",  type: ""},
                 { title: ("no"),  field: "NO",  type: ""},
                 { title: ("ip"),  field: "IP",  type: ""},
                 { title: ("port"),  field: "PORT",  type: ""},
                 { title: ("company_no"),  field: "COMPANY_NO",  type: ""},
                 { title: ("description"),  field: "DESCRIPTION",  type: ""},
                 { title: ("use_yn"),  field: "USE_YN",  type: "boolean"},

            ]
        },

        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            this.selectedCompany = this.companyList[0].PK
            this.prepareCommonData();
            this.getOrgList();
        },

        async getOrgList() {
            const dso = {
                type: 'list',
                selpro: 'COMM_SEL_8010080_PAR_TREE',
                para: [this.selectedCompany]
            }
            const result = await this._dsoCall(dso, 'select', false);
            if(result) {
                this.companyTreeList = listToTree(result, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'items' });
            } else {
                this.companyTreeList = [];
            }
        },

        async itemClick(event, data){
            if (data) {
                this.selectedItem = data
            }
            this.getOrgInfo();
            this.getBizPlace();
            // this.getCharger();
            // this.getContact();
            
        },

        async getOrgInfo() {
            const dso = {
                type: 'control',
                selpro: 'HR_SEL_8010081_COMPANY_INFO',
                para: [this.selectedItem.PK]
            }
            this.data = await this._dsoCall(dso, 'select', false)
           
        },

        async getBizPlace() {
            this.dsoBiz.para =  [this.selectedItem.PK];   
            this.dxg_gridBizPlace = await this._dsoCall(this.dsoBiz, 'select', false)
            this.$refs.idGrid.onSearch(this.dsoBiz);
        },

        async getCharger() {
            const dsoChanger = {
                type: "grid",
                selpro: "HR_SEL_8010080_COM_CHARGER",
                para: [this.selectedItem.PK]
            }
            this.dxg_gridCharger = await this._dsoCall(dsoChanger, "select", false);
            this.$refs.idGridChanger.onSearch(dsoChanger);
        },

        async getContact() {
            const dsoContract= {
                type: "grid",
                selpro: "HR_SEL_8010080_COMM_CONTACT",
                para: [this.selectedItem.PK]
            }
            this.dxg_gridContact = await this._dsoCall(dsoContract, "select", false);
            this.$refs.idGridContract.onSearch(dsoContract);
        },

        async getLocation() {
            const dsoLoca= {
                type: "grid",
                selpro: "HR_SEL_8010080_COMM_LOCATION",
                para: [this.selectedItem.PK]
            }
            this.dxg_gridLocation = await this._dsoCall(dsoLoca, "select", false);
            this.$refs.idGridLoca.onSearch(dsoLoca);
        },

        async getBankType(abpl_pk) {
            const dsoBank = {
                type: "grid",
                selpro: "COMM_SEL_8010080_BANK_TYPE",
                para: [this.selectedItem.PK]
            }
            this.dxg_gridBankAccount = await this._dsoCall(dsoBank, "select", false);
        },

        
        addNew(type) {
            switch (type) {
                case 'Master':
                    this.initBlank();
                    break;
                case 'BizPlace':
                    this.onAddBizPlace();
                    break;
                case 'Charger':
                    this.onAddCharger();
                    break;
            }

        },
        onAddBizPlace() {
            let newRow={
                _rowstatus: "i",
                PK: '',
                TCO_COMPANY_PK: this.data.PK,
                LOC_ID: '',
                LOC_NM: '',
                LOC_LNM: '',
                LOC_FNM: '',
                NATION: this.data.NATION,
                REG_NO: '',
                TAX_CD: '',
                TAX_OFFICE: '',
                REPRESENTATIVE: '',
                ZIP_CODE: '',
                ADDR_NM1: '',
                ADDR_LNM1: '',
                ADDR_NM2: '',
                ADDR_LNM2: '',
                ADDR_NM3: '',
                ADDR_LNM3: '',
                PHONE_NO: '',
                FAX_NO: '',
                BIZ_TYPE: '',
                BIZ_ITEM: '',
                BIZ_GRP: '',
                DESCRIPTION: '',
                USE_YN: 'Y',
                ST_DATE: new Date().toISOString().substr(0, 10),
                END_DATE: '',
                TABLEE: '',
                TAX_OFFICE_PK: ''
            }
            this.$refs.idGrid.onAdd(newRow);
            //this.dxg_gridBizPlace = {...item};  

        },

        onAddCharger() {
          let newRow={
                _rowstatus: "i",
                PK: '',
                TCO_COMPANY_PK: this.selectedItem.PK,
                THR_EMPLOYEE_PK: '',
                EMP_ID: '',
                FULL_NAME: '',
                ORG_NM: '',
                DESCRIPTION: '',
                USE_YN: 'Y',
                VALID_FROM: new Date().toISOString().substr(0, 10),
                VALID_TO: '',
                TABLEE: ''
            }
            this.$refs.idGridChanger.onAdd(newRow);
            //this.dxg_gridBizPlace = {...item};  

        },
        onSave(type) {
            switch (type) {
                case 'Master':
                    this.initPara();
                    this.saveMaster_M();
                    break;
                case 'BizPlace':
                    this.saveBizPlace();
                    break;
                case 'Charger':
                    this.saveCharger();
                    break;
            }
        },
        async saveCharger(searchParams) {
            this.$refs.idGridChanger.instance.saveEditData();
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_CHARGER",
                updpro: "COMM_UPD_8010080_CHARGER",
                para: [this.selectedItem.PK, 'tco_company'],
                elname: ['_rowstatus',
                    'PK',
                    'TCO_COMPANY_PK',
                    'THR_EMPLOYEE_PK',
                    'DESCRIPTION',
                    'USE_YN',
                    'VALID_FROM',
                    'VALID_TO',
                    'TABLEE'
                ],
                data: this.dxg_gridCharger
            }
            this.dxg_gridCharger = await this._dsoCall(dso, 'update', true)
            this.$emit('retunData', this.selectedItem.PK);
        },
        async saveBizPlace() {
            this.$refs.idGrid.instance.saveEditData();
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_BIZPLACE",
                updpro: "COMM_UPD_8010080_BIZPLACE",
                para: [this.data.PK, 'tco_company'],
                elname: ['_rowstatus',
                    'PK',
                    'TCO_COMPANY_PK',
                    'LOC_ID',
                    'LOC_NM',
                    'LOC_LNM',
                    'LOC_FNM',
                    'NATION',
                    'REG_NO',
                    'TAX_CD',
                    'TAX_OFFICE',
                    'REPRESENTATIVE',
                    'ZIP_CODE',
                    'ADDR_NM1',
                    'ADDR_LNM1',
                    'ADDR_NM2',
                    'ADDR_LNM2',
                    'ADDR_NM3',
                    'ADDR_LNM3',
                    'PHONE_NO',
                    'FAX_NO',
                    'BIZ_TYPE',
                    'BIZ_ITEM',
                    'BIZ_GRP',
                    'DESCRIPTION',
                    'USE_YN',
                    'ST_DATE',
                    'END_DATE',
                    'TABLEE',
                    'TAX_OFFICE_PK'
                ],
                data: this.dxg_gridBizPlace
            }
            this.dxg_gridBizPlace = await this._dsoCall(dso, 'update', true)
            this.$emit('retunData', this.data.PK);
        },
       async saveMaster_M() {
            await this.$refs.photo.Save();
            console.log(12);
            if (this.data._rowstatus !== "i" && this.data._rowstatus !== "d") {
                this.data._rowstatus = "u";
            }
            const dso = {
                type: "control",
                selpro: "COMM_SEL_8010080_MASTER",
                updpro: "COMM_UPD_8010080_MASTER_V2",
                para: [this.data.PK],
                elname: this.mstPara,
                data: this.data
            };
            
            let row = await this._dsoCall(dso, "update", true);
            if (row) {
                this.data = {
                    ...row
                };
            }
            

            
        },
        onDelete(type) {
            switch (type) {
                case 'Master':
                    this.onDeleteMaster();
                    break;
                case 'BizPlace':
                    this.onDeleteBizPlace();
                    break;
                case 'Charger':
                    this.onDeleteCharger();
                    break;
            }
        },
        onDeleteBizPlace() {
            this.$axios.$post("dso/callproc", {
                    proc: ["COMM_UPD_8010080_BIZPLACE"],
                    para: ['d', this.selectedItemKeys[0].PK, this.selectedItem.PK, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
                })
                .then((res) => {
                    if (res.data) {
                        let _flag = true
                        /*if(res.data && res.data[0].ERRCODE) {
                        const errorNo = res.data[0].ERRCODE
                        if(errorNo !== "") {
                            _flag = false
                            this.showNotification('danger', this.$t(errorNo, 'COMMON'), res.message)
                        }
                        }*/
                        if (_flag) {
                            //const deletedItemPK = res.data[0].PK
                            //this.isProcessing = false
                            this.showNotification('success', this.$t('DELETE_SUCCESS', 'COMMON'), '')
                            //this.$emit('returnDeletedItem', deletedItemPK, this.deleteProps.arrayName)

                        }
                        //this.dialogIsShow = false
                    } else {
                        //this.isProcessing = false
                        this.showNotification('danger', this.$t('DELETE_FAILED', 'COMMON'), res.message)
                    }
                })
                .catch((e) => {
                    //this.isProcessing = false
                    this.showNotification('danger', this.$t('ERROR_OCCURS', 'COMMON'), e.message)
                })
            this.getBizPlace(this.selectedItem.PK, 'tco_company');
        },
        onDeleteMaster() {
            console.log(this.data.PK);
            console.log(`OK`);

            if (!this.selectedItem.PK) {
                return this.showNotification('danger', this.$t('alert', 'common'), this.$t('please_choose_a_node_first', 'common'))
            }
            this.$refs.deleteDialog.dialogIsShow = true
            this.deleteProps = {
                proc: "COMM_UPD_8010080_MASTER",
                para: ["d",
                    this.data.PK,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '', '', '', '', ''
                ],
                arrayName: 'companyTreeList' //'companyTreeList'
            }
        },
        
        onDeleteCharger() {
            this.$axios.$post("dso/callproc", {
                    proc: ["COMM_UPD_8010080_CHARGER"],
                    para: ['d', this.selectedItemKeys[0].PK, this.selectedItem.PK, '', '', '', '', '', '']
                }) // this.selectedItemKeys[0].PK
                .then((res) => {
                    if (res.data) {
                        let _flag = true

                        if (_flag) {

                            this.showNotification('success', this.$t('DELETE_SUCCESS', 'COMMON'), '')

                        }

                    } else {

                        this.showNotification('danger', this.$t('DELETE_FAILED', 'COMMON'), res.message)
                    }
                })
                .catch((e) => {

                    this.showNotification('danger', this.$t('ERROR_OCCURS', 'COMMON'), e.message)
                })
            console.log(this.selectedItem.PK);
            this.getCharger(this.selectedItem.PK, 'tco_company');
        },

        
        removeDeletedItem(deletedItemPK, arrayName) {
            console.log(`removeDeletedItem`);
            if (arrayName == 'companyTreeList') {
                if (deletedItemPK && arrayName) {
                    findValueDeep(
                        this[arrayName],
                        (value, index, parent) => {
                            if (value && value.PK === deletedItemPK) {
                                if (parent.children) {
                                    parent.children.splice(index, 1)
                                } else {
                                    parent.splice(index, 1);
                                }
                            }
                        }, {
                            childrenPath: 'children'
                        }
                    )
                    // this.initBlank();
                }
            } else {
                deletedItemPK = this.focusedRowKeyMaster
                if (deletedItemPK && arrayName) {
                    const idx = this[arrayName].findIndex(x => x.PK === deletedItemPK)
                    if (idx > -1) {
                        this[arrayName].splice(idx, 1)
                    }
                }
            }

        },
        initBlank() {
            this.elName = [
                "_rowstatus",
                'PK',
                'PARENT_PK',
                'PARTNER_COM',
                'PARTNER_ID',
                'PARTNER_NAME',
                'PARTNER_LNAME',
                'PARTNER_FNAME',
                'PARTNER_TYPE',
                'TAX_CODE',
                'ADDR1',
                'ADDR2',
                'ADDR3',
                'PHONE_NO',
                'EMAIL_ADDRESS',
                'FAX_NO',
                'WEB_SITE',
                'CUST_YN',
                'CUST_ACTIVE_YN',
                'INVOICE_TERMS',
                'INVOICE_SCHEDULE',
                'INVOICE_GROUPING',
                'DELIVERY_TERMS',
                'CUST_TRADE_TYPE',
                'CUST_PAYMENT_FORM',
                'CUST_PAYMENT_TEMRS',
                'SALE_PRESENTATIVE',
                'CREDIT_LIMIT',
                'CREDIT_USED',
                'CUST_BANK_ACCOUNT',
                'SALE_DEFAULT_TAX',
                'VEN_YN',
                'VEN_ACTIVE_YN',
                'VEN_PAYMENT_FORM',
                'VEN_PAYMENT_TERMS',
                'VEN_BANK_ACCOUNT',
                'PUR_DEFAULT_TAX',
                'VEN_TRADE_TYPE',
                'TRANS_CURRENCY',
                'NATION',
                'ACTIVE_YN',
                'ANNIVERSARY_DATE',
                'NUMBER_EMPLOYEE',
                'COMPANY_SIZE',
                'COMPANY_CAPITAL',
                'COMPANY_INDUSTY',
                'COMPANY_PRODUCT',
                'TAX_OFFICE',
                'VALID_FROM',
                'VALID_TO',
                'DESCRIPTION',
                'SERIAL_NO',
                'SHORT_NM',
                'FORM_NO',
                'TCO_BPPHOTO_PK',
                'TCO_BPPHOTO_PK_1',
                'HDR_ORG_NO',
                'FILE_PATH',
                'FILE_PATH_BACKUP',
                'HDR_MSG',
                'IPBNK_BIC_C',
                'JI_CUSNO',
                'LEAF_YN',
                'BANK_TYPE'
            ]
            this.data = this._initObject(this.elName)
            this.data.P_PK = 0
            this.data.TCO_COMPANY_PK = this.selectedCompany
            this.data.CUST_YN = "Y"
            this.data.CUST_ACTIVE_YN = "Y"
            this.data.VEN_YN = "Y"
            this.data.VEN_ACTIVE_YN = "Y"
            this.data.ACTIVE_YN = "Y"
            this.data.LEAF_YN = "Y"
            this.data.ANNIVERSARY_DATE = new Date().toISOString().substr(0, 10)
            this.data.VALID_TO = new Date().toISOString().substr(0, 10)
            this.data.VALID_FROM = '' //new Date().toISOString().substr(0, 10)
            
        },
        initPara() {
            this.mstPara = [
                "_rowstatus",
                'PK',
                'PARENT_PK',
                'PARTNER_COM',
                'PARTNER_ID',
                'PARTNER_NAME',
                'PARTNER_LNAME',
                'PARTNER_FNAME',
                'PARTNER_TYPE',
                'TAX_CODE',
                'ADDR1',
                'ADDR2',
                'ADDR3',
                'PHONE_NO',
                'EMAIL_ADDRESS',
                'FAX_NO',
                'WEB_SITE',
                'CUST_YN',
                'CUST_ACTIVE_YN',
                'INVOICE_TERMS',
                'INVOICE_SCHEDULE',
                'INVOICE_GROUPING',
                'DELIVERY_TERMS',
                'CUST_TRADE_TYPE',
                'CUST_PAYMENT_FORM',
                'CUST_PAYMENT_TEMRS',
                'SALE_PRESENTATIVE',
                'CREDIT_LIMIT',
                'CREDIT_USED',
                'CUST_BANK_ACCOUNT',
                'SALE_DEFAULT_TAX',
                'VEN_YN',
                'VEN_ACTIVE_YN',
                'VEN_PAYMENT_FORM',
                'VEN_PAYMENT_TERMS',
                'VEN_BANK_ACCOUNT',
                'PUR_DEFAULT_TAX',
                'VEN_TRADE_TYPE',
                'TRANS_CURRENCY',
                'NATION',
                'ACTIVE_YN',
                'ANNIVERSARY_DATE',
                'NUMBER_EMPLOYEE',
                'COMPANY_SIZE',
                'COMPANY_CAPITAL',
                'COMPANY_INDUSTY',
                'COMPANY_PRODUCT',
                'TAX_OFFICE',
                'VALID_FROM',
                'VALID_TO',
                'DESCRIPTION',
                'SERIAL_NO',
                'SHORT_NM',
                'FORM_NO',
                'TCO_BPPHOTO_PK',
                'TCO_BPPHOTO_PK_1',
                'HDR_ORG_NO',
                'FILE_PATH',
                'FILE_PATH_BACKUP',
                'HDR_MSG',
                'IPBNK_BIC_C',
                'JI_CUSNO',
                'LEAF_YN',
                'BANK_TYPE'    
            ];
        },
        openDialogCharger(row) {
            if (row.column.dataField === "EMP_ID" || row.column.dataField === "FULL_NAME") {
                if (this.selectedItem.PK == 0 || this.selectedItem.PK == '' || this.selectedItem.PK == 'null') {
                    this.$refs.alertDialog.showAlert("warning", "Error", "PLS_CHOOSE_ONE_PARTNER_TO_NEW_CHARGER");
                    return;
                }
                this.$refs.employeeDialog.dialogIsShow = true;
                //this.selectedAccount = {...row};
            }
        },
        CallBack_EMP(item) {
            if (item) {
                //console.log(item);
                if (this.sel_row_tab_Charger == -1) {
                    for (var i = 0; i < item.length; i++) {
                        let newRow = {
                            _rowstatus: 'i',
                            PK: 0,
                            TCO_COMPANY_PK: this.U_DATA.PK,
                            THR_EMPLOYEE_PK: item[i].PK,
                            ORG_NM: item[i].ORG_NM,
                            EMP_ID: item[i].EMP_ID,
                            FULL_NAME: item[i].FULL_NAME
                        };
                        this.dxg_gridCharger.unshift(newRow);
                    }
                    this.$refs.grid_Charger.instance.refresh();
                } else {
                    // console.log(this.sel_row_tab_Charger);
                    this.dxg_gridCharger[this.sel_row_tab_Charger].THR_EMPLOYEE_PK = item[0].PK
                    this.dxg_gridCharger[this.sel_row_tab_Charger].ORG_NM = item[0].ORG_NM;
                    this.dxg_gridCharger[this.sel_row_tab_Charger].EMP_ID = item[0].EMP_ID;
                    this.dxg_gridCharger[this.sel_row_tab_Charger].FULL_NAME = item[0].FULL_NAME;
                }
            }
            this.sel_row_tab_Charger = -1;
        },
        OnClick_Charger(e) {
            this.sel_row_tab_Charger = e.rowIndex;
        },
    }
}
</script>

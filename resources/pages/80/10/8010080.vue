<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <!-- Left Side  -->
        <v-col class="px-0" v-show="showLeft" :cols="leftCols">
            <v-card tile :style="`overflow-y: scroll;`" v-resize="onResize">
                <v-container fluid class="pt-0">
                    <!-- Search Panel -->
                    <v-row dense align="center" justify="center">
                        <v-col lg="11" cols="12">
                        </v-col>
                        <v-col lg="1" cols="12">
                            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!-- Tree List -->
                    <v-row dense>
                        <v-col>
                            <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="PLC_NM" :active.sync="activeNodes" :color="currentTheme" :items="treeList" @update:active="getSelectedNode">
                            </v-treeview>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>

        <v-col class="px-0" :cols="rightCols">
            <!-- Search Panel -->
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <v-card outlined tile>
                        <v-container fluid class="pt-lg-1 pt-2 pb-0">
                            <v-row dense align="center" justify="space-between">
                                <!-- Action Buttons -->
                                <v-col lg="1" cols="12" class="text-right">
                                    <!-- Tongle -->
                                    <div class="d-flex">
                                        <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="toggleLeft">
                                            <v-icon v-if="showLeft">mdi-skip-previous</v-icon>
                                            <v-icon v-if="!showLeft">mdi-skip-next</v-icon>
                                        </v-btn>
                                    </div>
                                </v-col>
                                <v-col lg="11" cols="12" class="text-right">
                                    <!-- Add -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" color="success" :disabled="isProcessing" @click="addNew('Master')">
                                                <v-icon>mdi-plus-thick</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('add', 'common') }}</span>
                                    </v-tooltip>
                                    <!-- Save -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="onSave('Master')">
                                                <v-icon>mdi-content-save</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('save', 'common') }}</span>
                                    </v-tooltip>
                                    <!-- Delete -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing" @click="onDelete('Master')">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('delete', 'common') }}</span>
                                    </v-tooltip>
                                    <!-- Report -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon tile v-on="on" :color="currentTheme" :disabled="isProcessing">
                                                <v-icon>mdi-printer</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('report', 'common') }}</span>
                                    </v-tooltip>
                                </v-col>
                                <!-- Form -->
                                <!-- row 1  -->
                                <!-- Upper Cost Center Code -->
                                <v-col lg="3" cols="12">
                                    <v-text-field v-show="false" v-model="selectedItem.PARENT_PK"></v-text-field>
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('parent_com')" v-model="selectedItem.PARTNER_COM"></v-text-field>
                                </v-col>
                                <!-- Leaf YN -->
                                <v-col align-self="center" lg="2" md="2" sm="4" cols="4">
                                    <v-checkbox dense hide-details class="my-0 py-0" :label="$t('leaf_yn')" true-value="Y" false-value="N" v-model="selectedItem.LEAF_YN"></v-checkbox>
                                </v-col>
                                <v-col lg="7" cols="12">
                                </v-col>

                                <!-- Company Type -->
                                <v-col lg="3" cols="12">
                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('company', 'COMMON')" :items="companyTypeList" v-model="selectedItem.PARTNER_TYPE"></v-select>
                                </v-col>
                                <!-- Tax Code -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('tax_code ')" v-model="selectedItem.TAX_CODE"></v-text-field>
                                </v-col>

                                <!-- Company ID/Name -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('company_id ')" v-model="selectedItem.PARTNER_ID"></v-text-field>
                                </v-col>
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('company_nm ')" v-model="selectedItem.PARTNER_NAME"></v-text-field>
                                </v-col>
                                <!-- Short Name -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('short_nm ')" v-model="selectedItem.SHORT_NM"></v-text-field>
                                </v-col>
                                <!-- Representative -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('representative')" v-model="selectedItem.Representative"></v-text-field>
                                </v-col>

                                <!-- Local Name -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('local_name')" v-model="selectedItem.PARTNER_LNAME"></v-text-field>
                                </v-col>
                                <!--  Foreign Name -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('foreign_name')" v-model="selectedItem.PARTNER_FNAME"></v-text-field>
                                </v-col>

                                <!-- Address 1 -->
                                <v-col lg="12" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('address_1')" v-model="selectedItem.ADDR1"></v-text-field>
                                </v-col>
                                <!-- Address 2 -->
                                <v-col lg="12" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('address_2')" v-model="selectedItem.ADDR2"></v-text-field>
                                </v-col>
                                <!-- Address 3 -->
                                <v-col lg="12" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('address_3')" v-model="selectedItem.ADDR3"></v-text-field>
                                </v-col>

                                <!-- Description -->
                                <v-col lg="6" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('description')" v-model="selectedItem.DESCRIPTION"></v-text-field>
                                </v-col>
                                <!-- Web site  -->
                                <v-col lg="6" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('web_site')" v-model="selectedItem.WEB_SITE"></v-text-field>
                                </v-col>

                                <!--  Phone  -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('phone')" v-model="selectedItem.PHONE_NO"></v-text-field>
                                </v-col>
                                <!-- Fax  -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('fax')" v-model="selectedItem.FAX_NO"></v-text-field>
                                </v-col>
                                <!-- Email  -->
                                <v-col lg="3" cols="12">
                                    <v-text-field clearable dense hide-details validate-on-blur :label="$t('email')" v-model="selectedItem.EMAIL_ADDRESS"></v-text-field>
                                </v-col>
                                <!--  Bank Type  -->
                                <v-col lg="3" cols="12">
                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('bank_type', 'COMMON')" :items="bankTypeList" v-model="selectedItem.Bank_Type"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
            <!-- Tabs & Tab Contents -->
            <v-row align="center" justify="center">
                <v-col cols="12" class="py-0">
                    <v-tabs grow height="35" background-color="#EEEEEE" :color="currentTheme" v-model="tab">
                        <v-tab>{{ $t('general_info') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('customer') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('verdor') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('charger') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('contact') }}</v-tab>
                        <v-tab>{{ $t('biz_place') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('location') }}</v-tab>
                        <v-tab  v-show="false">{{ $t('bank_account') }}</v-tab>
                        <v-tab>{{ $t('basic_firm_banking') }}</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <!-- Tab 1 Content -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                            <v-container fluid class="pa-1">
                                <v-row dense align="start" justify="space-between">
                                    <!-- Active -->
                                    <v-col align-self="center" lg="2" md="2" sm="4" cols="12">
                                        <v-checkbox dense hide-details class="my-0 py-0" :label="$t('active')" true-value="Y" false-value="N" v-model="selectedItem.ACTIVE_YN"></v-checkbox>
                                    </v-col>
                                    <!-- Anniversary Date -->
                                    <v-col lg="2" md="4" sm="12" cols="12" class="pb-2">
                                        <date-picker :defaultType="'today'" :label="$t('anniversary')" :inputValue="selectedItem.ANNIVERSARY_DATE" :rules="validationRule.nameRules" @returnValue="selectedItem.ANNIVERSARY_DATE = $event"></date-picker>
                                    </v-col>
                                    <!-- From Date -->
                                    <v-col lg="2" md="4" sm="12" cols="12" class="pb-2">
                                        <date-picker :defaultType="'today'" :label="$t('from_date')" :inputValue="selectedItem.VALID_FROM" :rules="validationRule.nameRules" @returnValue="selectedItem.VALID_FROM = $event"></date-picker>
                                    </v-col>
                                    <!-- To Date -->
                                    <v-col lg="2" md="4" sm="12" cols="12" class="pb-2">
                                        <date-picker :defaultType="'null'" :label="$t('to_date')" :inputValue="selectedItem.VALID_TO" @returnValue="selectedItem.VALID_TO = $event"></date-picker>
                                    </v-col>
                                    <!-- Bank account -->
                                    <v-col lg="4" sm="12" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('bank_account')" v-model="selectedItem.Bank_account"></v-text-field>
                                    </v-col>
                                    <v-row dense align="start" justify="space-between">
                                        <v-col lg="6" md="4" sm="12" cols="12" class="pb-2">
                                            <v-row dense align="start" justify="space-between">
                                                <!-- Tax Code -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-text-field dense hide-details readonly :label="$t('tax_office')" v-model="selectedItem.TAX_OFFICE"></v-text-field>
                                                </v-col>
                                                <!-- Number Of Employee -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-text-field dense hide-details readonly :label="$t('number_of_employee')" v-model="selectedItem.NUMBER_EMPLOYEE"></v-text-field>
                                                </v-col>
                                                <!-- Serial No -->
                                                <v-col lg="6" sm="12" cols="12" v-show="false">
                                                    <v-text-field dense hide-details readonly :label="$t('serial_no')" v-model="selectedItem.SERIAL_NO"></v-text-field>
                                                </v-col>
                                                <!-- Form No -->
                                                <v-col lg="6" sm="12" cols="12" v-show="false">
                                                    <v-text-field dense hide-details readonly :label="$t('form_no')" v-model="selectedItem.FORM_NO"></v-text-field>
                                                </v-col>
                                                <!-- Caption -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-text-field dense hide-details readonly :label="$t('caption')" v-model="selectedItem.COMPANY_CAPITAL"></v-text-field>
                                                </v-col>
                                                <!-- Nation -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('nation')" :items="nationList" v-model="selectedItem.NATION"></v-select>
                                                </v-col>
                                                <!-- Company size -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('company_size')" :items="companySizeList" v-model="selectedItem.COMPANY_SIZE"></v-select>
                                                </v-col>
                                                <!-- Currency -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('currency')" :items="currencyList" v-model="selectedItem.TRANS_CURRENCY"></v-select>
                                                </v-col>
                                                <!-- Industrial zone -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('industrial_zone')" :items="industrialZoneList" v-model="selectedItem.COMPANY_INDUSTY"></v-select>
                                                </v-col>
                                                <!-- Company product -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-text-field dense hide-details readonly :label="$t('company_product')" v-model="selectedItem.COMPANY_PRODUCT"></v-text-field>
                                                </v-col>
                                                <!-- attach file -->
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-file-input prepend-icon="mdi-paperclip" :accept="'image/png, image/jpeg, image/bmp'" :label="$t('attach_File')" @change="onFilePicked" v-model="txtFile"></v-file-input>
                                                </v-col>
                                                <v-col lg="6" sm="12" cols="12">
                                                    <v-btn depressed small color="primary" @click="onCallUploadFile" :disabled="isDisable">{{$t('Upload')}}</v-btn>
                                                    <!--<v-btn color="error" @click="onDeleteDialog" :disabled="isDisable" > <v-icon>mdi-delete</v-icon></v-btn>-->
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col lg="6" md="4" sm="12" cols="12" class="pb-2">
                                            <v-row dense align="start" justify="space-between">
                                                <v-img ref="img" :src="image" max-height="200" max-width="650"></v-img>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <!-- Tab 2 Customer -->
                        <v-tab-item  v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-container fluid class="pa-0">
                                <v-row dense align="start" justify="space-between">
                                    <!-- Customer -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                        <v-checkbox dense hide-details class="my-0 py-0" :label="$t('active_customer')" true-value="Y" false-value="N" v-model="selectedItem.CUST_YN"></v-checkbox>
                                    </v-col>
                                    <!-- Payment form -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_form', 'common')" :items="paymentFormList" v-model="selectedItem.CUST_PAYMENT_FORM"></v-select>
                                    </v-col>
                                    <!-- Active -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                        <v-checkbox dense hide-details class="my-0 py-0" :label="$t('active')" true-value="Y" false-value="N" v-model="selectedItem.CUST_ACTIVE_YN"></v-checkbox>
                                    </v-col>
                                    <!--  Sale Presentative -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('sale_presentative')" :items="salePresentativeList" v-model="selectedItem.SALE_PRESENTATIVE"></v-select>
                                    </v-col>
                                    <!--  Invoice terms -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_terms')" :items="invoiceTermsList" v-model="selectedItem.INVOICE_TERMS"></v-select>
                                    </v-col>
                                    <!-- Invoice_Schedule -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_schedule', 'common')" :items="invoiceScheduleList" v-model="selectedItem.INVOICE_SCHEDULE"></v-select>
                                    </v-col>
                                    <!-- Sale default tax -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('sale_default_tax', 'common')" :items="saleDefaultTaxList" v-model="selectedItem.SALE_DEFAULT_TAX"></v-select>
                                    </v-col>
                                    <!-- Credit limit -->
                                    <v-col lg="6" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('credit_limit')" v-model="selectedItem.CREDIT_LIMIT"></v-text-field>
                                    </v-col>
                                    <!-- Invoice grouping -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_grouping', 'common')" :items="invoiceGroupingList" v-model="selectedItem.INVOICE_GROUPING"></v-select>
                                    </v-col>
                                    <!-- Credit use -->
                                    <v-col lg="6" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('credit_use')" v-model="selectedItem.CREDIT_USED"></v-text-field>
                                    </v-col>
                                    <!-- Delivery Terms -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('delivery_terms', 'common')" :items="deliveryTermsList" v-model="selectedItem.DELIVERY_TERMS"></v-select>
                                    </v-col>
                                    <!-- Bank account -->
                                    <v-col lg="6" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('bank_account')" v-model="selectedItem.CUST_BANK_ACCOUNT"></v-text-field>
                                    </v-col>
                                    <!-- CustTradeType -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('cust_trade_type', 'common')" :items="custTradeTypeList" v-model="selectedItem.CUST_TRADE_TYPE"></v-select>
                                    </v-col>
                                    <!-- Cust payment terms -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('cust_payment_terms', 'common')" :items="custPaymentTermsList" v-model="selectedItem.CUST_PAYMENT_TEMRS"></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <!-- Tab 3 Vendor -->
                        <v-tab-item v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-container fluid class="pa-0">
                                <v-row dense align="start" justify="space-between">
                                    <!-- Vendor -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                        <v-checkbox dense hide-details class="my-0 py-0" :label="$t('vendor')" true-value="Y" false-value="N" v-model="selectedItem.VEN_YN"></v-checkbox>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                    </v-col>
                                    <!-- Active -->
                                    <v-col lg="6" cols="12" class="pb-2">
                                        <v-checkbox dense hide-details class="my-0 py-0" :label="$t('active')" true-value="Y" false-value="N" v-model="selectedItem.VEN_ACTIVE_YN"></v-checkbox>
                                    </v-col>
                                    <!--   -->
                                    <v-col lg="6" cols="12">
                                    </v-col>
                                    <!--  Payment form -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_form')" :items="paymentFormList" v-model="selectedItem.VEN_PAYMENT_FORM"></v-select>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12">
                                    </v-col>
                                    <!-- Payment Terms -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_terms')" :items="paymentTermsList" v-model="selectedItem.VEN_PAYMENT_TERMS"></v-select>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12">
                                    </v-col>
                                    <!-- Trade_Type -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('trade_type', 'common')" :items="tradeTypeList" v-model="selectedItem.VEN_TRADE_TYPE"></v-select>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12">
                                    </v-col>
                                    <!-- Bank account -->
                                    <v-col lg="6" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('bank_account')" v-model="selectedItem.VEN_BANK_ACCOUNT"></v-text-field>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12">
                                    </v-col>
                                    <!--  Default tax -->
                                    <v-col lg="6" cols="12">
                                        <v-select cache-items clearable dense hide-details item-value="CODE" item-text="NAME" :label="$t('default_tax')" :items="defaultTaxList" v-model="selectedItem.PUR_DEFAULT_TAX"></v-select>
                                    </v-col>
                                    <!--  -->
                                    <v-col lg="6" cols="12">
                                        <v-card outlined tile v-resize="onResize">

                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <!-- Tab 4 Charger -->
                        <v-tab-item v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-col cols="12" class="py-0">
                                <v-btn icon tile color="success" :disabled="!btnNew_D" @click="addNew('Charger')">
                                    <v-icon>mdi-plus-thick</v-icon>
                                </v-btn>
                                <v-btn icon depressed tile color="error" :disabled="!btnDel_D" @click="onDelete('Charger')">
                                    <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="!btnSave_D" @click="onSave('Charger')">
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-card tile v-resize="onResize">
                                    <DxDataGrid ref="gridCharger" :data-source="dxg_gridCharger" :column-auto-width="true" column-resizing-mode="widget" :allow-column-resizing="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" :hoverStateEnabled="true" :selection="{ mode: 'single' }" :height="limitHeight_Charger" @row-updated="checkUpdatedItem" @cellDblClick="openDialogCharger" @selection-changed="selectionChanged" @cell-click="OnClick_Charger">
                                        <DxColumn data-field="PK" :caption="$t('PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('tco_company_pk')" :width="0"></DxColumn>
                                        <DxColumn data-field="THR_EMPLOYEE_PK" :caption="$t('thr_employee_pk')" :width="0" alignment="center"></DxColumn>
                                        <DxColumn data-field="EMP_ID" :caption="$t('emp_id')"></DxColumn>
                                        <DxColumn data-field="FULL_NAME" :caption="$t('full_name')"></DxColumn>
                                        <DxColumn data-field="ORG_NM" :caption="$t('org_nm')"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                                        <DxColumn data-field="USE_YN" alignment='center' cell-template="use-yn-template" :caption="$t('use_yn')"></DxColumn>
                                        <DxColumn data-field="VALID_FROM" :caption="$t('valid_from')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="VALID_TO" :caption="$t('valid_to')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="TABLEE" :caption="$t('tablee')"></DxColumn>
                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <template #use-yn-template="{ data }">
                                            <input type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.rowIndex)" />
                                        </template>
                                    </DxDataGrid>
                                </v-card>
                            </v-col>
                        </v-tab-item>
                        <!-- Tab 5 Contact -->
                        <v-tab-item v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-col cols="12" class="py-0">
                                <v-btn icon tile color="success" :disabled="!btnNew_D" @click="addNew('Contact')">
                                    <v-icon>mdi-plus-thick</v-icon>
                                </v-btn>
                                <v-btn icon depressed tile color="error" :disabled="!btnDel_D" @click="onDelete('Contact')">
                                    <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="!btnSave_D" @click="onSave('Contact')">
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-card tile v-resize="onResize">
                                    <DxDataGrid ref="gridContact" :data-source="dxg_gridContact" :column-auto-width="true" column-resizing-mode="widget" :allow-column-resizing="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" :hoverStateEnabled="true" :selection="{ mode: 'single' }" :height="limitHeight_Charger">
                                        <DxColumn data-field="PK" :caption="$t('PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('tco_company_pk')" :width="0"></DxColumn>
                                        <DxColumn data-field="CHARGER_NM" :caption="$t('charger_nm')"></DxColumn>
                                        <DxColumn data-field="CHARGER_POS" :caption="$t('charger_pos')"></DxColumn>
                                        <DxColumn data-field="PHONE_NOO" :caption="$t('phone_no')"></DxColumn>
                                        <DxColumn data-field="MOBILE_NO" :caption="$t('mobile_no')"></DxColumn>
                                        <DxColumn data-field="FAX_NO" :caption="$t('fax_no')"></DxColumn>
                                        <DxColumn data-field="EMAIL" :caption="$t('email')"></DxColumn>
                                        <DxColumn data-field="URGENT_CONTACT" :caption="$t('urgent_contact')" alignment="center"></DxColumn>
                                        <DxColumn data-field="ADDR" :caption="$t('addr')"></DxColumn>
                                        <DxColumn data-field="USE_YN" alignment='center' cell-template="use-yn-template" :caption="$t('use_yn')"></DxColumn>
                                        <DxColumn data-field="VALID_FROM" :caption="$t('valid_from')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="VALID_TO" :caption="$t('valid_to')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                                        <DxColumn data-field="TABLEE" :caption="$t('table')"></DxColumn>
                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <template #use-yn-template="{ data }">
                                            <input type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.rowIndex)" />
                                        </template>
                                    </DxDataGrid>
                                </v-card>
                            </v-col>
                        </v-tab-item>
                        <!-- Tab 6 Biz Place -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                            <v-col cols="12" class="py-0">
                                <v-btn icon tile color="success" :disabled="!btnNew_D" @click="addNew('BizPlace')">
                                    <v-icon>mdi-plus-thick</v-icon>
                                </v-btn>
                                <v-btn v-show="false" icon depressed tile color="error" :disabled="!btnDel_D" @click="onDelete('BizPlace')">
                                    <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="!btnSave_D" @click="onSave('BizPlace')">
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-card tile v-resize="onResize">
                                    <DxDataGrid ref="grdBizPlace" :data-source="dxg_gridBizPlace" :column-auto-width="true" column-resizing-mode="widget" :allow-column-resizing="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" :hoverStateEnabled="true" :selection="{ mode: 'single' }" @selection-changed="selectionChanged" @row-updated="checkUpdatedItem" :height="limitHeight_Charger">
                                        <DxColumn data-field="PK" :caption="$t('PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('tco_company_pk')" :width="0"></DxColumn>
                                        <DxColumn data-field="LOC_ID" :caption="$t('loc_id')" :width="150"></DxColumn>
                                        <DxColumn data-field="LOC_NM" :caption="$t('loc_nm')"></DxColumn>
                                        <DxColumn data-field="LOC_LNM" :caption="$t('loc_lnm')"></DxColumn>
                                        <DxColumn data-field="LOC_FNM" :caption="$t('loc_fnm')"></DxColumn>
                                        <DxColumn data-field="NATION" :caption="$t('nation')"></DxColumn>
                                        <DxColumn data-field="REG_NO" :caption="$t('reg_no')"></DxColumn>
                                        <DxColumn data-field="TAX_CD" :caption="$t('tax_cd')" alignment="center"></DxColumn>
                                        <DxColumn data-field="TAX_OFFICE" :caption="$t('tax_office')"></DxColumn>
                                        <DxColumn data-field="REPRESENTATIVE" :caption="$t('representative')"></DxColumn>
                                        <DxColumn data-field="ZIP_CODE" :caption="$t('zip_code')"></DxColumn>
                                        <DxColumn data-field="ADDR_NM1" :caption="$t('addr_nm1')"></DxColumn>
                                        <DxColumn data-field="ADDR_LNM1" :caption="$t('addr_lnm1')"></DxColumn>
                                        <DxColumn data-field="ADDR_NM2" :caption="$t('addr_nm2')" :width="0"></DxColumn>
                                        <DxColumn data-field="ADDR_LNM2" :caption="$t('addr_lnm2')" :width="0"></DxColumn>
                                        <DxColumn data-field="ADDR_NM3" :caption="$t('addr_nm3')" :width="0"></DxColumn>
                                        <DxColumn data-field="ADDR_LNM3" :caption="$t('addr_lnm3')" :width="0"></DxColumn>
                                        <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')"></DxColumn>
                                        <DxColumn data-field="FAX_NO" :caption="$t('fax_no')"></DxColumn>
                                        <DxColumn data-field="BIZ_TYPE" :caption="$t('biz_type')"></DxColumn>
                                        <DxColumn data-field="BIZ_ITEM" :caption="$t('biz_item')"></DxColumn>
                                        <DxColumn data-field="BIZ_GRP" :caption="$t('biz_grp')"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                                        <DxColumn data-field="USE_YN" alignment='center' cell-template="use-yn-template" :caption="$t('use_yn')"></DxColumn>
                                        <DxColumn data-field="ST_DATE" :caption="$t('st_date')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="END_DATE" :caption="$t('end_date')" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="TABLEE" :caption="$t('table')"></DxColumn>
                                        <DxColumn data-field="TAX_OFFICE_PK" :caption="$t('tax_office_pk')"></DxColumn>
                                        <!--<DxPaging :page-size="dxg_gridBizPlace.length" />-->
                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <template #use-yn-template="{ data }">
                                            <input type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.rowIndex)" />
                                        </template>
                                    </DxDataGrid>
                                </v-card>
                            </v-col>
                        </v-tab-item>
                        <!-- Tab 7 Location -->
                        <v-tab-item v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-col cols="12" class="py-0">
                                <v-btn icon tile color="success" :disabled="!btnNew_D" @click="addNew('Location')">
                                    <v-icon>mdi-plus-thick</v-icon>
                                </v-btn>
                                <v-btn icon depressed tile color="error" :disabled="!btnDel_D" @click="onDelete('Location')">
                                    <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="!btnSave_D" @click="onSave('Location')">
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-card tile v-resize="onResize">
                                    <DxDataGrid ref="gridLocation" :data-source="dxg_gridLocation" :column-auto-width="true" column-resizing-mode="widget" :allow-column-resizing="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" :hoverStateEnabled="true" :selection="{ mode: 'single' }" :focused-row-enabled="true" :height="limitHeight_Charger" key-expr="PK">
                                        <DxColumn data-field="PK" :caption="$t('PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('tco_buspartner_pk')" :width="0"></DxColumn>
                                        <DxColumn data-field="LOC_NM" :caption="$t('loc_nm')"></DxColumn>
                                        <DxColumn data-field="LOC_LNM" :caption="$t('loc_lnm')"></DxColumn>
                                        <DxColumn data-field="LOC_FNM" :caption="$t('loc_fnm')"></DxColumn>
                                        <DxColumn data-field="CHARGER_NM" :caption="$t('charger_nm')"></DxColumn>
                                        <DxColumn data-field="SALEORDERLOC_YN" :caption="$t('saleorderloc_yn')"></DxColumn>
                                        <DxColumn data-field="DILIVERYLOC_YN" :caption="$t('diliveryloc_yn')"></DxColumn>
                                        <DxColumn data-field="COLLECTIONLOC_YN" :caption="$t('collectionloc_yn')" alignment="center"></DxColumn>
                                        <DxColumn data-field="ZIP_CODE" :caption="$t('zip_code')"></DxColumn>
                                        <DxColumn data-field="ADDR1" :caption="$t('addr1')"></DxColumn>
                                        <DxColumn data-field="ADDR2" :caption="$t('addr2')"></DxColumn>
                                        <DxColumn data-field="ADDR3" :caption="$t('addr3')"></DxColumn>
                                        <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')"></DxColumn>
                                        <DxColumn data-field="FAX_NO" :caption="$t('fax_no')"></DxColumn>
                                        <DxColumn data-field="EMAIL" :caption="$t('email')"></DxColumn>
                                        <DxColumn data-field="USE_YN" :caption="$t('use_yn')"></DxColumn>
                                        <DxColumn data-field="TRFR_DATE" :caption="$t('trfr_date')" :width="150" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="TRTO_DATE" :caption="$t('trto_date')" :width="150" dataType="date" format="dd-MM-yyyy" alignment="center"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                                    </DxDataGrid>
                                </v-card>
                            </v-col>
                        </v-tab-item>
                        <!-- Tab 8 Bank Account -->
                        <v-tab-item v-show="false" transition="fade-transition" reverse-transition="fade-transition">
                            <v-col cols="12" class="py-0">
                                <v-btn icon tile color="success" :disabled="!btnNew_D" @click="addNew('BankAccount')">
                                    <v-icon>mdi-plus-thick</v-icon>
                                </v-btn>
                                <v-btn icon depressed tile color="error" :disabled="!btnDel_D" @click="onDelete('BankAccount')">
                                    <v-icon>{{ selectionMode === false ? 'mdi-delete-outline' : 'mdi-delete-empty' }}</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="!btnSave_D" @click="onSave('BankAccount')">
                                    <v-icon>mdi-content-save</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-card tile v-resize="onResize">
                                    <DxDataGrid ref="gridBankAccount" :data-source="dxg_gridBankAccount" :column-auto-width="true" column-resizing-mode="widget" :allow-column-resizing="true" :show-borders="true" :show-row-lines="true" :show-column-lines="true" :hoverStateEnabled="true" :selection="{ mode: 'single' }" :focused-row-enabled="true" :height="limitHeight_Charger" key-expr="PK">
                                        <DxColumn data-field="PK" :caption="$t('PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('TCO_COMPANY_PK')" :width="0"></DxColumn>
                                        <DxColumn data-field="NO" :caption="$t('no')"></DxColumn>
                                        <DxColumn data-field="IP" :caption="$t('ip')"></DxColumn>
                                        <DxColumn data-field="PORT" :caption="$t('port')"></DxColumn>
                                        <DxColumn data-field="COMPANY_NO" :caption="$t('company_no')"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')"></DxColumn>
                                        <DxColumn data-field="USE_YN" :caption="$t('use_yn')"></DxColumn>
                                    </DxDataGrid>
                                </v-card>
                            </v-col>
                        </v-tab-item>
                        <!-- Tab 9 Basic Firm Banking -->
                        <v-tab-item transition="fade-transition" reverse-transition="fade-transition">
                            <v-container fluid class="pa-0">
                                <v-row dense align="start" justify="space-between">
                                    <!-- Org No  -->
                                    <v-col lg="4" cols="12" class="pb-2">
                                        <v-text-field dense hide-details readonly :label="$t('org_no')" v-model="selectedItem.HDR_ORG_NO"></v-text-field>
                                    </v-col>
                                    <!-- Customer No  -->
                                    <v-col lg="4" cols="12" class="pb-2">
                                        <v-text-field dense hide-details readonly :label="$t('customer_no')" v-model="selectedItem.JI_CUSNO"></v-text-field>
                                    </v-col>
                                    <!-- Org Msg  -->
                                    <v-col lg="4" cols="12" class="pb-2">
                                        <v-text-field dense hide-details readonly :label="$t('org_msg')" v-model="selectedItem.HDR_MSG"></v-text-field>
                                    </v-col>
                                    <!-- Out File Path   -->
                                    <v-col lg="4" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('out_file_path')" v-model="selectedItem.FILE_PATH"></v-text-field>
                                    </v-col>
                                    <!-- Backup File Path  -->
                                    <v-col lg="4" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('backup_file_path')" v-model="selectedItem.FILE_PATH_BACKUP"></v-text-field>
                                    </v-col>
                                    <!-- IPBNK BIC C  -->
                                    <v-col lg="4" cols="12">
                                        <v-text-field dense hide-details readonly :label="$t('IPBNK_BIC_C')" v-model="selectedItem.IPBNK_BIC_C"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <v-text-field v-show="false" v-model="selectedItem.PK"></v-text-field>
    <v-select v-show="false" item-value="PK" item-text="TEXT" :items="companyList" v-model="selectedCompany"></v-select>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnPartner"></partner-dialog>
    <delete-dialog ref="deleteDialog" :deleteProps="deleteProps" @returnDeletedItem="removeDeletedItem"></delete-dialog>
    <action-confirm :action="'DELETE'" v-if="confirmDelete" @onCloseDialog="confirmDelete = false" @onConfirm="deleteItem" />
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
        CostCenterDialog: () => import("@/components/dialog/CostCenterDialog"),
        PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
        DatePicker: () => import("@/components/control/DatePicker"),
        ActionConfirm: () => import("@/components/dialog/ActionConfirmDialog"),
        EmployeeDialog: () => import("@/components/dialog/EmployeeDialog"),
        BaseFile: () => import("@/components/control/BaseFile")
    },

    data: () => ({
        btnNew_D: true,
        btnDel_D: true,
        btnSave_D: true,
        leftCols: 0,
        topRows: 0,
        ctlCols: 0,
        showTop: false,
        showLeft: false,
        showCtl: false,
        selectionMode: '',
        bizPlaceist: [],
        companyList: [],
        companyTypeList: [],
        paymentFormList: [],
        salePresentativeList: [],
        invoiceGroupingList: [],
        tradeTypeList: [],
        invoiceTermsList: [],
        selectedCompany: '',
        selectedCompanyType: '',
        treeList: [],
        activeNodes: [],
        elName: [],
        selectedItem: {},
        deleteProps: {},
        fromDateMenu: false,
        toDateMenu: false,
        confirmDateMenu: false,
        tab: null,
        companySizeList: [],
        currencyList: [],
        paymentTermsList: [],
        nationList: [],
        companyGroupList: [],
        bankTypeList: [],
        defaultTaxList: [],
        industrialZoneList: [],
        selectedBankType: '',
        saleDefaultTaxList: [],
        invoiceScheduleList: [],
        custTradeTypeList: [],
        deliveryTermsList: [],
        selectedItemKeys: [],
        custPaymentTermsList: [],
        dxg_gridCharger: [],
        dxg_gridLocation: [],
        dxg_gridBankAccount: [],
        dxg_gridContact: [],
        dxg_gridBizPlace: [],
        performanceFromMenu: false,
        performanceToMenu: false,
        advanceFromMenu: false,
        advanceToMenu: false,
        warrantyFromMenu: false,
        warrantyToMenu: false,
        formIsValid: undefined,
        confirmDelete: false,
        sel_row_tab_Charger: '',
        txtFile: [],
        isDisable: false,
        txtFileName: "",
        table_name: "TCO_COMPANY",
        folder: "8010080",
        procedure_upload: "COMM_UPD_8010080_IMG",
        image: require('@/assets/images/no_image.png'),
        no_image: require('@/assets/images/no_image.png'),
    }),

    created() {
        this.getListCodes().then(() => {
            this.initBlank();
            this.initPara();
        })
    },

    computed: {
        user() {
            return this.$store.getters["auth/user"]
        },
        limitHeight() {
            if (this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 140
        },
        limitHeight_Charger() {
            return 200; //   (this.windowHeight -650)   //if (this.$vuetify.breakpoint.smAndUp) return this.windowHeight - 850
        },
        dtlGridCols() {
            return 12 - this.ctlCols;
        },
        rightCols() {
            return 12 - this.leftCols;
        },
        onImgList() {
            //return this.dataList.filter(item => item.FILE_TYPE == 'image')
        },
        itemInfoHeader() {
            const self = this;
            return [{
                    dataField: "PK",
                    width: 100,
                    allowEditing: false,
                    caption: this.$t('PK')
                },
                {
                    dataField: "TCO_BUSPARTNER_ITF_YN",
                    allowEditing: true,
                    cssClass: "cell-align-center",
                    caption: this.$t('TCO_BUSPARTNER_ITF_YN')
                },
                {
                    dataField: "PARTNER_ID",
                    allowEditing: false,
                    caption: this.$t('PARTNER_ID')
                },
                {
                    dataField: "PARTNER_NAME",
                    allowEditing: false,
                    caption: this.$t('PARTNER_NAME')
                },
                {
                    dataField: "PARTNER_LNAME",
                    allowEditing: "false",
                    caption: this.$t('PARTNER_LNAME')
                },
                {
                    dataField: "PARTNER_FNAME",
                    caption: this.$t('PARTNER_FNAME'),
                    allowEditing: true
                },
                {
                    dataField: "PARTNER_TYPE",
                    caption: this.$t('PARTNER_TYPE')
                },
                {
                    dataField: "TAX_CODE",
                    allowEditing: true,
                    caption: this.$t('TAX_CODE')
                },
                {
                    dataField: "ADDR1",
                    allowEditing: true,
                    width: 120,
                    caption: this.$t('ADDR1')
                },
                {
                    dataField: "ADDR2",
                    width: 0,
                    caption: this.$t('ADDR2')
                },
                {
                    dataField: "ADDR3",
                    allowEditing: true,
                    width: 0,
                    caption: this.$t('ADDR3')
                },
                {
                    dataField: "PHONE_NO",
                    allowEditing: true,
                    caption: this.$t('PHONE_NO')

                },
                {
                    dataField: "EMAIL_ADDRESS",
                    allowEditing: true,
                    caption: this.$t('EMAIL_ADDRESS')

                },
                {
                    dataField: "FAX_NO",
                    allowEditing: true,
                    caption: this.$t('FAX_NO')
                },
                {
                    dataField: "TEI_CUSTOMER_PK",
                    allowEditing: true,
                    caption: this.$t('TEI_CUSTOMER_PK')
                },
                {
                    dataField: "DESCRIPTION",
                    caption: this.$t('DESCRIPTION')
                },
                {
                    dataField: "WEB_SITE",
                    caption: this.$t('WEB_SITE'),
                    allowEditing: true
                },
                {
                    dataField: "TEI_COMPANY_PK",
                    caption: this.$t('TEI_COMPANY_PK'),
                    allowEditing: true
                },
                {
                    dataField: "TAX_CODE_TO_USERID",
                    caption: this.$t('TAX_CODE_TO_USERID')

                },
                {
                    dataField: "TAX_CODE_COMPANY",
                    allowEditing: true,
                    width: 120
                },
                {
                    dataField: "PASSWORD",
                    caption: this.$t('PASSWORD')
                },
                {
                    dataField: "PASSWORDSEND",
                    caption: this.$t('PASSWORDSEND')
                }
            ]
        }
    },

    watch: {
        selectedCompany(val) {
            if (val) {
                this.search()
            }
        }
    },

    methods: {
        async getListCodes() {
            const dso_company_list = {
                type: 'list',
                selpro: 'SYS_SEL_LIST_COMPANY',
                para: [this.user.PK]
            }
            this.companyList = await this._dsoCall(dso_company_list, 'select', false)
            this.selectedCompany = this.companyList[0].PK

            this.companyTypeList = await this._getCommonCode('CODC0010')
            this.bankTypeList = await this._getCommonCode('ACCR0300')
            this.currencyList = await this._getCommonCode('ACAB0110')

            this.paymentTermsList = await this._getCommonCode('ACCR0140')
            this.paymentFormList = await this._getCommonCode('ACCR0140')

            this.nationList = await this._getCommonCode('HR0009', this.user.TCO_COMPANY_PK)
            this.companySizeList = await this._getCommonCode('CODC0040')
            this.invoiceTermsList = await this._getCommonCode('ACCR0270')

            this.saleDefaultTaxList = await this._getCommonCode('ACCR0110')
            this.defaultTaxList = await this._getCommonCode('ACCR0110')

            this.invoiceScheduleList = await this._getCommonCode('ACCR0280')
            this.deliveryTermsList = await this._getCommonCode('ACCR0245')

            this.custTradeTypeList = await this._getCommonCode('COCI0150')
            this.tradeTypeList = await this._getCommonCode('COCI0150')

            this.custPaymentTermsList = await this._getCommonCode('ACCR0150')
        },

        async search() {
            const dso = {
                type: 'list',
                selpro: 'COMM_SEL_8010080_PAR_TREE',
                para: [this.selectedCompany]
            }
            const result = await this._dsoCall(dso, 'select', false)
            if (result) {
                this.treeList = listToTree(result, {
                    idKey: 'PK',
                    parentKey: 'P_PK'
                })
            } else {
                this.treeList = []
            }
        },

        onConfirmM() {
            this.confirm();
        },

        getSelectedNode() {
            if (this.activeNodes.length > 0) {
                this.selectedItem.PK = this.activeNodes[0].PK;
                this.getMaster(this.activeNodes[0].PK);
                this.getCharger(this.activeNodes[0].PK);
                this.getContact(this.activeNodes[0].PK);
                this.getBizPlace(this.activeNodes[0].PK);
                this.getLocation(this.activeNodes[0].PK);
                this.getBankType(this.activeNodes[0].PK);
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
                'LEAF_YN'
            ]
            this.selectedItem = this._initObject(this.elName)
            this.selectedItem.P_PK = 0
            this.selectedItem.TCO_COMPANY_PK = this.selectedCompany
            this.selectedItem.CUST_YN = "Y"
            this.selectedItem.CUST_ACTIVE_YN = "Y"
            this.selectedItem.VEN_YN = "Y"
            this.selectedItem.VEN_ACTIVE_YN = "Y"
            this.selectedItem.ACTIVE_YN = "Y"
            this.selectedItem.LEAF_YN = "Y"
            this.selectedItem.ANNIVERSARY_DATE = new Date().toISOString().substr(0, 10)
            this.selectedItem.VALID_TO = new Date().toISOString().substr(0, 10)
            this.selectedItem.VALID_FROM = '' //new Date().toISOString().substr(0, 10)
        },

        ////////////////////////////////////////////////////////////////////////////////////
        onChageImage(e) {
            if (this.dataList.length > 0) {
                if (this.dataList[e]) {
                    this.tes_fileinfo_pk = this.dataList[e].TES_FILEINFO_PK
                }
            }
        },

        onFilePicked(file) {
            if (file == "" || file == "undefined") {
                return
            }

            this.txtFileName = file;
            const fr = new FileReader();
            fr.readAsDataURL(this.txtFileName);
            fr.addEventListener('load', () => {
                this.image = fr.result;
            });
        },

        onCallUploadFile() {
            if (this.txtFile.length == 0) {
                return
            }
            this.UploadFile().then(() => {
                this.txtFileName = ""
                this.txtFile = []
                //this.onSearch();        
            });
        },

        onDeleteViewImg() {
            this.isProcessing = true;
            this.$axios
                .$post("dso/callproc", {
                    proc: this.procedure_save,
                    para: ["d", this.tes_fileinfo_pk, '']
                })
                .then(res => {

                    if (res.data.length > 0) {
                        this.onSearch()
                    }
                })
                .catch(e => {
                    this.showNotification("danger", this.$t('ERROR_OCCURS'), e.message);
                })
                .then(() => {
                    this.isProcessing = false;
                });
        },
        onDeleteDialog() {
            this.deleteDialog = true
        },

        confirmSave() {
            this.$refs.confirm_dialog.showConfirm(this.$t("do_you_want_save"));
        },

        async UploadFile() {
            if (this.selectedItem.PK) {
                let params = [
                    this.selectedItem.PK, //p_tes_file_pk
                    "", //table_name
                    "TCO_COMPANY", //p_master_table
                    this.selectedItem.PK, //p_master_table_pk
                ];
                const fd = new FormData();
                fd.append("file", this.txtFileName);
                fd.append("proc", "COMM_UPD_8010080_IMG");
                fd.append("folder", "8010080"); //
                fd.append("para", JSON.stringify(params));

                const res = await this.$axios({
                    method: "post",
                    url: "/dso/uploadfile2",
                    data: fd,
                });
                if (res.data.data) {
                    this.showNotification(
                        "success",
                        this.$t("PROCESS_SUCCESS", "COMMON"),
                        ""
                    );
                    console.log(res.data.data);
                    this.fileSave = null;
                    this.txtFile = [];
                    //this.$refs.grdAttachFiles.loadData();
                } else {
                    this.showNotification(
                        "danger",
                        this.$t("ERROR_OCCURS", "COMMON"),
                        ""
                    );
                }
            }
        },

        async onLoad() {
            if (this.selectedItem.PK > 0) {
                if (this.selectedItem.DATA === null) {
                    try {
                        this.image = "";
                    } catch (e) {

                    }
                } else {
                    try {
                        let arrayBuffer = this.selectedItem.DATA;
                        var base64String = this._arrayBufferToBase64(arrayBuffer.data);
                        this.image = "data:image/png;base64, " + base64String;
                    } catch (e) {

                    }
                }

            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        async getMaster(abpl_pk) {
            const dso = {
                type: "control",
                selpro: "COMM_SEL_8010080",
                para: [abpl_pk]
            }
            const result = await this._dsoCall(dso, 'select', false);
            //this.selectedItem = result ? {...result} : {};
            this.selectedItem = {
                ...result
            };
            //console.log(this.selectedItem);
            this.onLoad();
        },
        async getCharger(abpl_pk) {
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_CHARGER",
                para: [abpl_pk, 'tco_company']
            }
            this.dxg_gridCharger = await this._dsoCall(dso, "select", false);
        },
        async getContact(abpl_pk) {
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_CONTACT",
                para: [abpl_pk, 'tco_company']
            }
            this.dxg_gridContact = await this._dsoCall(dso, "select", false);
        },
        async getBizPlace(abpl_pk) {
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_BIZPLACE",
                para: [abpl_pk, 'tco_company']
            }
            this.dxg_gridBizPlace = await this._dsoCall(dso, "select", false);
        },
        async getLocation(abpl_pk) {
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_LOCATION",
                para: [abpl_pk, 'tco_company']
            }
            this.dxg_gridLocation = await this._dsoCall(dso, "select", false);
        },
        async getBankType(abpl_pk) {
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_BANK_TYPE",
                para: [abpl_pk]
            }
            this.dxg_gridBankAccount = await this._dsoCall(dso, "select", false);
        },

        toggleLeft() {
            if (this.showLeft == true) {
                this.showLeft = false;
                this.leftCols = 0;
            } else {
                this.showLeft = true;
                this.leftCols = 4;
            }
        },
        selectionChanged(data) {
            console.log(data);
            this.selectedItemAcc = {
                ...data
            };
            this.selectedItemKeys = data.selectedRowKeys;
            if (data.selectedRowKeys.length > 0) {
                this.focusedRowKeyMaster = this.selectedItemKeys[0].PK;
            }
        },

        checkUpdatedItem(data) {
            //console.log(`checkUpdatedItem: `+data );
            if (!data.cancel) {
                if (data.data._rowstatus !== "i") {
                    data.data._rowstatus = "u";
                }
            }
        },
        onCellPrepared({
            column,
            cellElement,
            rowType
        }) {
            if (this.txtInvoice_type === "E") {
                if (rowType === "data" && (column.dataField === "ATTRIBUTE1" || column.dataField === "ATTRIBUTE2" || column.dataField === "ATTRIBUTE3" || column.dataField === "ATTRIBUTE4" || column.dataField === "ATTRIBUTE5" || column.dataField === "SEQ_DIS" || column.dataField === "SEQ")) {

                    cellElement.style.width = 100;

                }
            }

        },
        openCostCenterDialog() {
            this.$refs.costCenterDialog.dialogIsShow = true
        },

        openPartnerDialog() {
            this.$refs.partnerDialog.dialogIsShow = true
        },

        handleReturnPartner(data) {
            this.selectedItem.TCO_BUSPARTNER_PK = data.PK
            this.selectedItem.PARTNER_ID = data.PARTNER_ID
            this.selectedItem.PARTNER_NAME = data.PARTNER_NAME
        },
        ////////////////////////////////////////// MASTER /////////////////////////////////////////////////////
        addNew(type) {
            switch (type) {
                case 'Master':
                    this.initBlank();
                    //this.activeNodes = [];
                    break;
                case 'BizPlace':
                    this.onAddBizPlace();
                    break;
                case 'Charger':
                    this.onAddCharger();
                    break;
            }

        },
        onSave(type) {
            switch (type) {
                case 'Master':
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
        ////////////////////////////////////////DELETE DETAILS ////////////////////////////////////////////////
        onDeleteMaster() {
            console.log(this.selectedItem.PK);
            console.log(`OK`);

            if (!this.selectedItem.PK) {
                return this.showNotification('danger', this.$t('alert', 'common'), this.$t('please_choose_a_node_first', 'common'))
            }
            this.$refs.deleteDialog.dialogIsShow = true
            this.deleteProps = {
                proc: "COMM_UPD_8010080_MASTER",
                para: ["d",
                    this.selectedItem.PK,
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
                arrayName: 'treeList' //'treeList'
            }
        },
        removeDeletedItem(deletedItemPK, arrayName) {
            console.log(`removeDeletedItem`);
            if (arrayName == 'treeList') {
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
        //////////////////////////////////////////////////////////// SAVE DETAILS //////////////////////////////////////////////
        async saveMaster_M() {
            if (this.selectedItem._rowstatus !== "i" && this.selectedItem._rowstatus !== "d") {
                this.selectedItem._rowstatus = "u";
            }
            const dso = {
                type: "control",
                selpro: "COMM_SEL_8010080_MASTER",
                updpro: "COMM_UPD_8010080_MASTER",
                para: [this.selectedItem.PK],
                elname: this.mstPara,
                data: this.selectedItem
            };
            let row = await this._dsoCall(dso, "update", true);
            if (row) {
                this.selectedItem = {
                    ...row
                };
            }
        },
        async saveBizPlace(searchParams) {
            this.$refs.grdBizPlace.instance.saveEditData();
            const dso = {
                type: "grid",
                selpro: "COMM_SEL_8010080_BIZPLACE",
                updpro: "COMM_UPD_8010080_BIZPLACE",
                para: [this.selectedItem.PK, 'tco_company'],
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
            this.$emit('retunData', this.selectedItem.PK);
        },
        async saveCharger(searchParams) {
            this.$refs.gridCharger.instance.saveEditData();
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
        /////////////////////////////////////////////////////////////////////// ADD DETAILS ///////////////////////////////////////////////////
        onAddBizPlace() {
            this.dxg_gridBizPlace.unshift({
                _rowstatus: "i",
                PK: '',
                TCO_COMPANY_PK: this.selectedItem.PK,
                LOC_ID: '',
                LOC_NM: '',
                LOC_LNM: '',
                LOC_FNM: '',
                NATION: this.selectedItem.NATION,
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
            });
            //this.dxg_gridBizPlace = {...item};  

        },
        onAddCharger() {
            this.dxg_gridCharger.unshift({
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
            });
            //this.dxg_gridBizPlace = {...item};  

        },
        onAddContact() {
            this.dxg_gridContact.unshift({
                _rowstatus: "i",
                PK: '',
                TCO_COMPANY_PK: '',
                CHARGER_NM: '',
                CHARGER_POS: '',
                PHONE_NOO: '',
                MOBILE_NO: '',
                FAX_NO: '',
                EMAIL: '',
                URGENT_CONTACT: '',
                ADDR: '',
                USE_YN: '',
                VALID_FROM: '',
                VALID_TO: '',
                DESCRIPTION: '',
                TABLEE: ''
            });
            //this.dxg_gridBizPlace = {...item};  

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
                'LEAF_YN'
            ];
        },
        ///////////////////////////////////////////////////////////// check box //////////////////////////////////////////////////
        valueChanged(e, colName, rowIndex) {
            const newValue = e ? "Y" : "N";
            this.changeValue(newValue, colName, rowIndex, true);
        },
        changeValue(value, key, idx, isModified) {
            this.dxg_gridBizPlace.map((item, index) => {
                if (index === idx) {
                    this.$set(item, key, value);
                    if (isModified && item.PK) {
                        item._rowstatus = "u";
                    }
                }
            });
        },
        ////////////////////////////////////////////////////////////// get data from PopUP ////////////////////////////////////////
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
        /////////////////////////////////////////////// Click ///////////////////////////////////////
        OnClick_Charger(e) {
            this.sel_row_tab_Charger = e.rowIndex;
        },
    }
}
</script>

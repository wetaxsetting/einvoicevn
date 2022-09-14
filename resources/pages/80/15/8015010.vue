<!-- ================================================================= BEGIN DESIGN LAYOUT======================================================================================= -->
<template>
<v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters class="pl-2">
        <v-col cols="4">
            <v-row class="pt-3" no-gutters>
                <v-card>
                    <v-row>
                        <v-col cols="12" class="pl-5 pr-10">
                            <!-- <v-text-field background-color="blue-grey lighten-5" clearable dense hide-details :label="$t('customer')" v-model="txt_Customer" @keypress.enter="On_Click('SEARCH')"></v-text-field> -->
                            <BaseInput outlined :label="$t('customer')" v-model="txt_Customer" @keyPressEnter="On_Click('SEARCH')"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pl-5 pr-10">
                            <BaseInput outlined :label="$t('tax_code')" v-model="txt_Tax_Code" @keyPressEnter="On_Click('SEARCH')"/>
                            <!-- <v-text-field background-color="blue-grey lighten-5" clearable dense hide-details :label="$t('tax_code')" v-model="txt_Tax_Code" @keypress.enter="On_Click('SEARCH')"></v-text-field> -->
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pl-2">
                            <BaseSelect outlined :label="$t('type')" v-model="sel_Type" :lstData="cbo_Type" item-text="NAME" item-value="CODE" @keyPressEnter="On_Click('SEARCH')"/>
                            <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('type')" :items="cbo_Type" v-model="sel_Type" @change="On_Click('SEARCH')"></v-select> -->
                        </v-col>
                        <v-col cols="3" class="pl-2">
                            <BaseSelect outlined :label="$t('transaction')" v-model="sel_Transaction" :lstData="cbo_Transaction" item-text="NAME" item-value="CODE" @keyPressEnter="On_Click('SEARCH')"/>
                            <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('transaction')" :items="cbo_Transaction" v-model="sel_Transaction" @change="On_Click('SEARCH')"></v-select> -->
                        </v-col>
                        <v-col cols="3" class="pl-5">
                            <BaseSelect outlined :label="$t('use_yn')" v-model="sel_Use_YN" :lstData="cbo_Use_YN" item-text="NAME" item-value="CODE" @keyPressEnter="On_Click('SEARCH')"/>
                            <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('use_yn')" @change="On_Click('SEARCH')" :items="[
                    { CODE: 'Y', NAME: $t('yes') },
                    { CODE: 'N', NAME: $t('no') },
                  ]" v-model="sel_Use_YN"></v-select>-->
                        </v-col> 
                        <v-col cols="2" class="pl-5 pr-10">
                            <div class='d-flex'>
                                <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="On_Click('SEARCH')" />
                            </div>
                            <!-- <v-btn icon tile color="cyan darken-1" :disabled="false" @click="On_Click('SEARCH')">
                                <v-icon dark> mdi-magnify</v-icon>
                            </v-btn> -->
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12" class="pt-2">
                    <DxDataGrid ref="grid_master" :data-source="dxg_gridmaster" :height="limitHeight" @cell-click="On_Change_gridmaster" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" column-resizing-mode="widget" :hoverStateEnabled="true" :no-data-text="$t('no_data')" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                        <DxColumn data-field="PARTNER_ID" :caption="$t('partner_id')" width="200"></DxColumn>
                        <DxColumn data-field="PARTNER_NAME" :caption="$t('partner_name')"></DxColumn>
                        <DxColumn data-field="TAX_CODE" :caption="$t('tax_code')"></DxColumn>
                        <DxEditing mode="cell" start-edit-action="Click" :allow-updating="false" />
                        <DxPaging v-if="dxg_gridmaster.length < 20" :page-size="dxg_gridmaster.length" />
                        <DxScrolling v-else mode="infinite" />
                    </DxDataGrid>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="8" class="pl-5 pt-3">
            <v-row no-gutters>
                <v-col cols="12">
                    <v-card>
                        <v-row class="pt-3" no-gutters>
                            <v-col cols="12" dense align="right" class="pt-3">
                                <div class="d-flex justify-end">
                                    <BaseButton icon_type="add_new" :btn_text="$t('addnew')" :disabled="isProcessing" @onclick="On_Click('NEW_CRT')" /> 
                                    <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="On_Click('SAVE_CRT')" />
                                    <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="On_Click('DELETE_CRT')" />
                                    <BaseButton icon_type="excel" :btn_text="$t('excel')" :disabled="isProcessing" @onclick="On_Click('PRINT_CRT')" />
                                </div>
                            </v-col>
                            <!-- <v-col cols="9" class="pl-50">&nbsp; </v-col>
                            <v-col cols="3" class="pl-5">
                                <v-btn icon tile :color="currentTheme" :disabled="false" @click="On_Click('NEW_CRT')">
                                    <v-icon dark>mdi-plus-box</v-icon>
                                </v-btn>
                                <v-btn icon tile :color="currentTheme" :disabled="false" @click="On_Click('SAVE_CRT')">
                                    <v-icon dark>mdi-content-save</v-icon>
                                </v-btn>
                                <v-btn icon tile color="error" :disabled="false" @click="On_Click('DELETE_CRT')">
                                    <v-icon dark>mdi-delete</v-icon>
                                </v-btn>
                                <v-btn icon tile color="success" :disabled="false" @click="On_Click('PRINT_CRT')">
                                    <v-icon dark>mdi-file-excel</v-icon>
                                </v-btn>
                            </v-col> -->
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <v-card v-scroll.self="onScroll" class="overflow-y-auto" :max-height="scroll_height">
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">     
                                <BaseSelect outlined :label="$t('cust_group')" v-model="U_DATA.CUST_GROUP" :lstData="cbo_cust_group" item-text="NAME" item-value="CODE" />
                                <!-- <v-select :disabled="false" dense hide-details item-value="CODE" item-text="NAME" :label="$t('cust_group')" :items="cbo_cust_group" v-model="U_DATA.CUST_GROUP"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('partner_com')" v-model="U_DATA.PARENT_NM" acntoutline @dblClick="DLG_POP('PARTNER_COM')" @keyPressEnter="search">
                                    <template v-slot:append>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="DLG_POP('PARTNER_COM')">mdi-window-restore</v-icon>
                                            </template>
                                            <span>{{ $t('show_partner') }}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="(U_DATA.PARENT_PK = ''), (U_DATA.PARENT_NM = '')">mdi-eraser</v-icon>
                                            </template>
                                            <span>{{ $t('reset') }}</span>
                                        </v-tooltip>
                                    </template>
                                </BaseInput>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('partner_com')" v-model="U_DATA.PARENT_NM">
                                    <template v-slot:append>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="DLG_POP('PARTNER_COM')">mdi-window-restore</v-icon>
                                            </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="
                                                    (U_DATA.PARENT_PK = ''), (U_DATA.PARENT_NM = '')
                                                    ">mdi-eraser</v-icon>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                </v-text-field> -->
                            </v-col>
                            <v-col cols="3" class="pl-5 pt-3">
                                <BaseSelect outlined :disabled="TF_Voucher_Type" :label="$t('voucher_type')" v-model="U_DATA.VOUCHER_TYPE" :lstData="cbo_Voucher_Type" item-text="NAME" item-value="CODE" />
                            </v-col>
                            <v-col cols="1" class="pl-3">
                                <BaseCheckbox v-model="U_DATA.AUTO_YN" true-value="Y" false-value="N" />
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseSelect outlined :label="$t('company')" v-model="U_DATA.TCO_COMPANY_PK" :lstData="cbo_Company" item-text="TEXT" item-value="PK" />
                                <!-- <v-select dense hide-details item-value="PK" item-text="TEXT" :label="$t('company')" :items="cbo_Company" v-model="U_DATA.TCO_COMPANY_PK"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseSelect outlined :label="$t('partner_type')" v-model="U_DATA.PARTNER_TYPE" :lstData="cbo_Partner_Type" item-text="NAME" item-value="CODE" />
                                <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('partner_type')" :items="cbo_Partner_Type" v-model="U_DATA.PARTNER_TYPE"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('tax_code')" v-model="U_DATA.TAX_CODE" />
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('tax_code')" v-model="U_DATA.TAX_CODE"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('partner_id')" mandatory v-model="U_DATA.PARTNER_ID" @dblClick="On_Click('PARTNER_ID')" :clearable="false">
                                    <template v-slot:append>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="On_Click('PARTNER_ID')">mdi-window-restore</v-icon>
                                            </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="U_DATA.PARTNER_ID = ''">mdi-eraser</v-icon>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                </BaseInput>
                                <!-- <v-text-field background-color="amber lighten-4" color="orange orange-darken-4" dense :readonly="false" hide-details :label="$t('partner_id')" v-model="U_DATA.PARTNER_ID">
                                    <template v-slot:append>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="On_Click('PARTNER_ID')">mdi-window-restore</v-icon>
                                            </template>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :color="currentTheme" @click="U_DATA.PARTNER_ID = ''">mdi-eraser</v-icon>
                                            </template>
                                        </v-tooltip>
                                    </template>
                                </v-text-field> -->
                            </v-col>
                            <v-col cols="8" class="pl-5 pt-3 pr-10">
                                <BaseInput mandatory outlined :label="$t('partner_name')" v-model="U_DATA.PARTNER_NAME" />
                                <!-- <v-text-field background-color="amber lighten-4" color="orange orange-darken-4" dense :readonly="false" hide-details :label="$t('partner_name')" v-model="U_DATA.PARTNER_NAME"></v-text-field> -->
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('local_name')" v-model="U_DATA.PARTNER_LNAME" />
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('local_name')" v-model="U_DATA.PARTNER_LNAME"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3">
                                <v-row no-gutters>
                                    <v-col md="6" class="pr-5">
                                        <BaseInput outlined :label="$t('short_name')" v-model="U_DATA.SHORT_NM"/>
                                        <!-- <v-text-field dense :readonly="false" hide-details :label="$t('short_name')" v-model="U_DATA.SHORT_NM" ></v-text-field> -->
                                    </v-col>
                                    <v-col md="6" class="pr-10">
                                        <BaseInput outlined :label="$t('foreign_name')" v-model="U_DATA.PARTNER_FNAME"/>
                                        <!-- <v-text-field dense :readonly="false" hide-details :label="$t('foreign_name')" v-model="U_DATA.PARTNER_FNAME"></v-text-field> -->
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <!-- <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <v-text-field dense :readonly="false" hide-details :label="$t('foreign_name')" v-model="U_DATA.PARTNER_FNAME"></v-text-field>
                            </v-col>
                        </v-row> -->
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('address1')" v-model="U_DATA.ADDR1"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('address1')" v-model="U_DATA.ADDR1"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('address2')" v-model="U_DATA.ADDR2"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('address2')" v-model="U_DATA.ADDR2"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('address3')" v-model="U_DATA.ADDR3"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('address3')" v-model="U_DATA.ADDR3"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('license_no')" v-model="U_DATA.LICENSE_NO"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('license_no')" v-model="U_DATA.LICENSE_NO"></v-text-field> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseSelect outlined :label="$t('transaction')" v-model="U_DATA.TRANSACTION" :lstData="cbo_Company" item-text="NAME" item-value="CODE" />
                                <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('transaction')" :items="cbo_Transaction_C" v-model="U_DATA.TRANSACTION"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('postal_cdoe')" v-model="U_DATA.POSTAL_CODE"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('postal_cdoe')" v-model="U_DATA.POSTAL_CODE"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseSelect outlined :label="$t('pay_method')" v-model="U_DATA.PAYMENT_METHOD" :lstData="cbo_Pay_Method" item-text="NAME" item-value="CODE" />
                                <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('pay_method')" :items="cbo_Pay_Method" v-model="U_DATA.PAYMENT_METHOD"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('period')" v-model="U_DATA.PERIOD"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('period')" v-model="U_DATA.PERIOD"></v-text-field> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('promissory_dc_rate')" v-model="U_DATA.DC_RATE"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('promissory_dc_rate')" v-model="U_DATA.DC_RATE"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseSelect outlined :label="$t('corporate_yn')" v-model="U_DATA.CORPORATE_YN" :lstData="cbo_Corporate_YN" item-text="NAME" item-value="CODE" />
                                <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('corporate_yn')" :items="[
                      { CODE: 'Y', NAME: $t('yes') },
                      { CODE: 'N', NAME: $t('no') },
                    ]" v-model="U_DATA.CORPORATE_YN"></v-select> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('representative')" v-model="U_DATA.REPRESENTATIVE"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('representative')" v-model="U_DATA.REPRESENTATIVE"></v-text-field> -->
                            </v-col>
                            <v-col cols="4" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('bussiness_item')" v-model="U_DATA.BUSINESS_ITEM"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('bussiness_item')" v-model="U_DATA.BUSINESS_ITEM"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('cust_area')" v-model="U_DATA.CUS_AREA"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('cust_area')" v-model="U_DATA.CUS_AREA"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('description')" v-model="U_DATA.DESCRIPTION"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('description')" v-model="U_DATA.DESCRIPTION"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="3" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('phone')" v-model="U_DATA.PHONE_NO"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('phone')" v-model="U_DATA.PHONE_NO"></v-text-field> -->
                            </v-col>
                            <v-col cols="3" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('fax')" v-model="U_DATA.FAX_NO"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('fax')" v-model="U_DATA.FAX_NO"></v-text-field> -->
                            </v-col>
                            <v-col cols="3" class="pl-5 pt-3">
                                <BaseInput outlined :label="$t('email')" v-model="U_DATA.EMAIL_ADDRESS"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('email')" v-model="U_DATA.EMAIL_ADDRESS"></v-text-field> -->
                            </v-col>
                            <v-col cols="3" class="pl-5 pt-3 pr-10">
                                <BaseInput outlined :label="$t('web_site')" v-model="U_DATA.WEB_SITE"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('web_site')" v-model="U_DATA.WEB_SITE"></v-text-field> -->
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="6" class="pl-5 pt-3 pb-2">
                                <BaseInput outlined :label="$t('no_of_work_classification')" v-model="U_DATA.WORKDIVISION"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('no_of_work_classification')" v-model="U_DATA.WORKDIVISION"></v-text-field> -->
                            </v-col>
                            <v-col cols="6" class="pl-5 pt-3 pr-10 pb-2">
                                <BaseInput outlined :label="$t('no_of_bank_account')" v-model="U_DATA.NUMBER_BANK"/>
                                <!-- <v-text-field dense :readonly="false" hide-details :label="$t('no_of_bank_account')" v-model="U_DATA.NUMBER_BANK"></v-text-field> -->
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12" class="pt-3">
                    <v-tabs dark background-color="#4DB6AC" class="mb-2" height="35" show-arrows next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" color="deep-orange darken-4" v-model="tab_control" @change="On_change_Tab">
                        <v-tab>{{ $t("general_info") }} </v-tab>
                        <v-tab>{{ $t("customer") }} </v-tab>
                        <v-tab>{{ $t("vender") }} </v-tab>
                        <v-tab>{{ $t("biz_place_ei") }} </v-tab>
                        <v-tab>{{ $t("charger") }} </v-tab>
                        <v-tab>{{ $t("contact") }} </v-tab>
                        <v-tab v-show="false">{{ $t("biz_place") }} </v-tab>
                        <v-tab>{{ $t("location") }} </v-tab>
                        <v-tab>{{ $t("meno") }} </v-tab>
                        <v-tab>{{ $t("work_classification") }} </v-tab>
                        <v-tab>{{ $t("bank_account") }} </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab_control" v-resize="onResize">
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="2" class="pl-5 pt-5">
                                    <BaseCheckbox outlined v-model="U_DATA.ACTIVE_YN" :label="$t('active')"  true-value="Y" false-value="N" />
                                    <!-- <v-checkbox v-model="U_DATA.ACTIVE_YN" color="blue darken-3" true-value="Y" false-value="N" :label="$t('active')" class="my-0 py-0">
                                    </v-checkbox> -->
                                </v-col>
                                <v-col cols="4" class="pl-3 pt-3">
                                    <BaseInput outlined :label="$t('tax_office')" v-model="U_DATA.TAX_OFFICE"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('tax_office')" v-model="U_DATA.TAX_OFFICE"></v-text-field> -->
                                </v-col>
                                <v-col cols="2" class="pl-5 pt-3">
                                    <BaseDatePicker outlined v-model="U_DATA.ANNIVERSARY_DATE" :label="$t('anniversary')" default :clearable="true"></BaseDatePicker>
                                    <!-- <date-picker :isClearable="true" :isDisabled="false" :label="$t('anniversary')" :inputValue="U_DATA.ANNIVERSARY_DATE" @returnValue="U_DATA.ANNIVERSARY_DATE = $event"></date-picker> -->
                                </v-col>
                                <v-col cols="2" class="pl-5 pt-3">
                                    <BaseDatePicker outlined v-model="U_DATA.VALID_FROM" :label="$t('valid_from')" default :clearable="true"></BaseDatePicker>
                                    <!-- <date-picker :isClearable="true" :isDisabled="false" :label="$t('valid_from')" :inputValue="U_DATA.VALID_FROM" @returnValue="U_DATA.VALID_FROM = $event"></date-picker> -->
                                </v-col>
                                <v-col cols="2" class="pl-5 pt-3 pr-5">
                                    <BaseDatePicker outlined v-model="U_DATA.VALID_TO" :label="$t('valid_to')"  :clearable="true"></BaseDatePicker>
                                    <!-- <date-picker :isClearable="true" :isDisabled="false" :label="$t('valid_to')" :inputValue="U_DATA.VALID_TO" @returnValue="U_DATA.VALID_TO = $event"></date-picker> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('number_of_employee')" v-model="U_DATA.NUMBER_EMPLOYEE"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('number_of_employee')" v-model="U_DATA.NUMBER_EMPLOYEE"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('capital')" v-model="U_DATA.COMPANY_CAPITAL"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('capital')" v-model="U_DATA.COMPANY_CAPITAL"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('serial_no')" v-model="U_DATA.SERIAL_NO"/>
                                    <v-text-field dense :readonly="false" hide-details :label="$t('serial_no')" v-model="U_DATA.SERIAL_NO"></v-text-field>
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('form_no')" v-model="U_DATA.FORM_NO"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('form_no')" v-model="U_DATA.FORM_NO"></v-text-field> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="4" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('company_size')" v-model="U_DATA.COMPANY_SIZE" :lstData="cbo_company_size" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('company_size')" :items="cbo_company_size" v-model="U_DATA.COMPANY_SIZE"></v-select> -->
                                </v-col>
                                <v-col cols="4" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('nation')" v-model="U_DATA.NATION" :lstData="cbo_nation" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('nation')" :items="cbo_nation" v-model="U_DATA.NATION"></v-select> -->
                                </v-col>
                                <v-col cols="4" class="pl-5 pt-3 pr-5">
                                    <BaseSelect outlined :label="$t('transaction_currency')" v-model="U_DATA.TRANS_CURRENCY" :lstData="cbo_trans_ccy" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('transaction_currency')" :items="cbo_trans_ccy" v-model="U_DATA.TRANS_CURRENCY"></v-select> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="4" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('industrial_zone')" v-model="U_DATA.COMPANY_INDUSTY"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('industrial_zone')" v-model="U_DATA.COMPANY_INDUSTY"></v-text-field> -->
                                </v-col>
                                <v-col cols="4" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('company_product')" v-model="U_DATA.COMPANY_PRODUCT"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('company_product')" v-model="U_DATA.COMPANY_PRODUCT"></v-text-field> -->
                                </v-col>
                                <v-col cols="4" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('represented_by')" v-model="U_DATA.REPRESENTED_BY"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('represented_by')" v-model="U_DATA.REPRESENTED_BY"></v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="2" class="pl-5">
                                    <BaseCheckbox :label="$t('customer')" v-model="U_DATA.CUST_YN" true-value="Y" false-value="N" />
                                    <!-- <v-checkbox v-model="U_DATA.CUST_YN" color="blue darken-3" true-value="Y" false-value="N" :label="$t('customer')" class="my-0 py-0">
                                    </v-checkbox> -->
                                </v-col>
                                <v-col cols="2" class="pl-5">
                                    <BaseCheckbox :label="$t('active')" v-model="U_DATA.AUTO_YN" true-value="Y" false-value="N" />
                                    <!-- <v-checkbox v-model="U_DATA.CUST_ACTIVE_YN" color="blue darken-3" true-value="Y" false-value="N" :label="$t('active')" class="my-0 py-0">
                                    </v-checkbox> -->
                                </v-col>
                                <v-col cols="5" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('payment_form')" v-model="U_DATA.CUST_PAYMENT_FORM" :lstData="cbo_Cpay_form" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_form')" :items="cbo_Cpay_form" v-model="U_DATA.CUST_PAYMENT_FORM"></v-select> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('invoice_terms')" v-model="U_DATA.INVOICE_TERMS" :lstData="cbo_invoice_term" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_terms')" :items="cbo_invoice_term" v-model="U_DATA.INVOICE_TERMS"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('invoice_schedule')" v-model="U_DATA.INVOICE_SCHEDULE" :lstData="cbo_invoice_schedule" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_schedule')" :items="cbo_invoice_schedule" v-model="U_DATA.INVOICE_SCHEDULE"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('invoice_grouping')" v-model="U_DATA.INVOICE_GROUPING" :lstData="cbo_invoice_group" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('invoice_grouping')" :items="cbo_invoice_group" v-model="U_DATA.INVOICE_GROUPING"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3 pr-5">
                                    <BaseSelect outlined :label="$t('delivery_terms')" v-model="U_DATA.DELIVERY_TERMS" :lstData="cbo_delivery_term" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('delivery_terms')" :items="cbo_delivery_term" v-model="U_DATA.DELIVERY_TERMS"></v-select> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('custtradetype')" v-model="U_DATA.CUST_TRADE_TYPE" :lstData="cbo_cust_trade" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('custtradetype')" :items="cbo_cust_trade" v-model="U_DATA.CUST_TRADE_TYPE"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('cust_payment_terms')" v-model="U_DATA.CUST_PAYMENT_TEMRS" :lstData="cbo_cust_pay_term" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('cust_payment_terms')" :items="cbo_cust_pay_term" v-model="U_DATA.CUST_PAYMENT_TEMRS"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('sale_presentative')" v-model="U_DATA.SALE_PRESENTATIVE"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('sale_presentative')" v-model="U_DATA.SALE_PRESENTATIVE"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3 pr-5">
                                    <BaseSelect outlined :label="$t('custtradetype')" v-model="U_DATA.CUST_TRADE_TYPE" :lstData="cbo_cust_trade" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('sale_default_tax')" :items="cbo_sale_dtax" v-model="U_DATA.SALE_DEFAULT_TAX"></v-select> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('credit_limit')" v-model="U_DATA.CREDIT_LIMIT"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('credit_limit')" v-model="U_DATA.CREDIT_LIMIT"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('credit_use')" v-model="U_DATA.CREDIT_USED"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('credit_use')" v-model="U_DATA.CREDIT_USED"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('bank_account')" v-model="U_DATA.CUST_BANK_ACCOUNT"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('bank_account')" v-model="U_DATA.CUST_BANK_ACCOUNT"></v-text-field> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('swift_no')" v-model="U_DATA.CUS_SWIFT_NO"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('swift_no')" v-model="U_DATA.CUS_SWIFT_NO"></v-text-field> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="6" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('bill_to')" v-model="U_DATA.BILL_TO_NAME" @dblClick="On_Click('BILL_TO')" :clearable="false">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="On_Click('BILL_TO')">mdi-window-restore</v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="(U_DATA.BILL_TO_PK = ''),(U_DATA.BILL_TO_NAME = '')">mdi-eraser</v-icon>
                                                </template>
                                            </v-tooltip>
                                        </template>
                                    </BaseInput>
                                    <!-- <v-text-field dense :readonly="true" hide-details :label="$t('bill_to')" v-model="U_DATA.BILL_TO_NAME">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="On_Click('BILL_TO')">mdi-window-restore</v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="
                                (U_DATA.BILL_TO_PK = ''),
                                  (U_DATA.BILL_TO_NAME = '')
                              ">mdi-eraser</v-icon>
                                                </template>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field> -->
                                </v-col>
                                <v-col cols="6" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('deli_to')" v-model="U_DATA.BILL_TO_NAME" @dblClick="On_Click('DELI_TO')" :clearable="false">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="On_Click('DELI_TO')">mdi-window-restore</v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="(U_DATA.DELI_TO_PK = ''),(U_DATA.DELI_TO_NAME = '')">mdi-eraser</v-icon>
                                                </template>
                                            </v-tooltip>
                                        </template>
                                    </BaseInput>
                                    <!-- <v-text-field dense :readonly="true" hide-details :label="$t('deli_to')" v-model="U_DATA.DELI_TO_NAME">
                                        <template v-slot:append>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="On_Click('DELI_TO')">mdi-window-restore</v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on" :color="currentTheme" @click="
                                (U_DATA.DELI_TO_PK = ''),
                                  (U_DATA.DELI_TO_NAME = '')
                              ">mdi-eraser</v-icon>
                                                </template>
                                            </v-tooltip>
                                        </template>
                                    </v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="2" class="pl-5">
                                    <BaseCheckbox  v-model="U_DATA.VEN_YN" :label="$t('vendor')"  true-value="Y" false-value="N" />
                                    <!-- <v-checkbox v-model="U_DATA.VEN_YN" color="blue darken-3" true-value="Y" false-value="N" :label="$t('vendor')" class="my-0 py-0">
                                    </v-checkbox> -->
                                </v-col>
                                <v-col cols="2" class="pl-5">
                                    <BaseCheckbox  v-model="U_DATA.VEN_ACTIVE_YN" :label="$t('active')"  true-value="Y" false-value="N" />
                                    <!-- <v-checkbox v-model="U_DATA.VEN_ACTIVE_YN" color="blue darken-3" true-value="Y" false-value="N" :label="$t('active')" class="my-0 py-0">
                                    </v-checkbox> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('payment_form')" v-model="U_DATA.VEN_PAYMENT_FORM" :lstData="cbo_Vpay_form" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_form')" :items="cbo_Vpay_form" v-model="U_DATA.VEN_PAYMENT_FORM"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('payment_terms')" v-model="U_DATA.VEN_PAYMENT_TERMS" :lstData="cbo_ven_pay_form" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('payment_terms')" :items="cbo_ven_pay_form" v-model="U_DATA.VEN_PAYMENT_TERMS"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('trade_type')" v-model="U_DATA.VEN_TRADE_TYPE" :lstData="cbo_ven_trade" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('trade_type')" :items="cbo_ven_trade" v-model="U_DATA.VEN_TRADE_TYPE"></v-select> -->
                                </v-col>
                                <v-col cols="3" class="pl-5 pt-3">
                                    <BaseSelect outlined :label="$t('default_tax')" v-model="U_DATA.PUR_DEFAULT_TAX" :lstData="cbo_ven_dtax" item-text="NAME" item-value="CODE" />
                                    <!-- <v-select dense hide-details item-value="CODE" item-text="NAME" :label="$t('default_tax')" :items="cbo_ven_dtax" v-model="U_DATA.PUR_DEFAULT_TAX"></v-select> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="6" class="pl-5 pt-3">
                                    <BaseInput outlined :label="$t('bank_account')" v-model="U_DATA.VEN_BANK_ACCOUNT"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('bank_account')" v-model="U_DATA.VEN_BANK_ACCOUNT"></v-text-field> -->
                                </v-col>
                                <v-col cols="6" class="pl-5 pt-3 pr-5">
                                    <BaseInput outlined :label="$t('swift_no')" v-model="U_DATA.VEN_SWIFT_NO"/>
                                    <!-- <v-text-field dense :readonly="false" hide-details :label="$t('swift_no')" v-model="U_DATA.VEN_SWIFT_NO"></v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" dense>
                                    <div class="d-flex justify-end">
                                        <BaseButton icon_type="add_new" :btn_text="$t('add_new')" @onclick="On_Click('BIZ_PLACE_EI')" :disabled="isProcessing" />
                                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="On_Click('BIZ_PLACE_EI_SAVE')" />
                                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="On_Click('BIZ_PLACE_EI_DELETE')" />
                                    </div>
                                    <!-- <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('BIZ_PLACE_EI')">
                                        <v-icon dark>mdi-plus-box</v-icon>
                                    </v-btn>
                                    <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('BIZ_PLACE_EI_SAVE')">
                                        <v-icon dark>mdi-content-save</v-icon>
                                    </v-btn>
                                    <v-btn icon title color="error" :disabled="false" @click="On_Click('BIZ_PLACE_EI_DELETE')">
                                        <v-icon dark>mdi-delete</v-icon>
                                    </v-btn> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="pt-1">
                                    <DxDataGrid ref="grid_Biz_Place_EI" :data-source="dxg_BizPlace_EI" :height="limitHeight3" @cell-click="OnClick_BizPlace_EI" @cellDblClick="OnDBClick_BizPlace_EI" @row-updated="rowUpdated_Contact" dateSerializationFormat="yyyyMMdd" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" column-resizing-mode="widget" :hoverStateEnabled="true" :no-data-text="$t('no_data')" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxColumn data-field="LOC_ID" :caption="$t('loc_id')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="LOC_NM" :caption="$t('loc_nm')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="LOC_LNM" :caption="$t('loc_lnm')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="LOC_FNM" :caption="$t('loc_fnm')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="NATION" :caption="$t('nation')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="REG_NO" :caption="$t('reg_no')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="TAX_CD" :caption="$t('tax_cd')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="TAX_OFFICE" :caption="$t('tax_office')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="TCO_BUSPARTNER_ITF_YN" :caption="$t('tco_buspartner_itf_yn')" :allow-editing="false" edit-cell-template="sysadmin-yn-template" css-class="cell-align-center" :showEditorAlways="true" width="120"></DxColumn>
                                        <DxColumn data-field="INTERFACE_DT" :caption="$t('interface_dt')" :allow-editing="false" data-type="date" css-class="cell-align-center" :format="curLang.DATE_FORMAT" width="120"></DxColumn>
                                        <DxColumn data-field="INTERFACE_BY" :caption="$t('interface_by')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="TAX_CODE_TO_USERID" :caption="$t('tax_code_to_userid')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="PASSWORDSEND" :caption="$t('passwordsend')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="PASSWORD" :caption="$t('password')" :allow-editing="false" width="120"></DxColumn>
                                        <DxColumn data-field="PK" :caption="$t('pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>
                                        <DxColumn data-field="TCO_COMPANY_PK" :caption="$t('tco_company_pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>
                                        <DxColumn data-field="TCO_BUSPLACE_PK" :caption="$t('tco_busplace_pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>
                                        <DxColumn data-field="TEI_COMPANY_PK" :caption="$t('tei_company_pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>
                                        <DxColumn data-field="TCO_BUSPARTNER_PK" :caption="$t('tco_buspartner_pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>
                                        <DxColumn data-field="TEI_CUSTOMER_PK" :caption="$t('tei_customer_pk')" :allow-editing="false" width="120" :visible="false"></DxColumn>

                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <DxPaging v-if="dxg_Contact.length < 500" :page-size="dxg_Contact.length" />
                                        <DxScrolling v-else mode="infinite" />
                                        <template #sysadmin-yn-template="{ data }">
                                            <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="
                            valueChanged(
                              $event.target.checked,
                              data.column.dataField,
                              data.data.PK,
                              'CONTACT'
                            )
                          " />
                                        </template>
                                    </DxDataGrid>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" dense>
                                    <div class="d-flex justify-end">
                                        <BaseButton icon_type="add_new" :btn_text="$t('add_new')" @onclick="On_Click('CHARGER')" :disabled="isProcessing" />
                                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="On_Click('CHARGER_SAVE')" />
                                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="On_Click('CHARGER_DELETE')" />
                                    </div>
                                    <!-- <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('CHARGER')">
                                        <v-icon dark>mdi-plus-box</v-icon>
                                    </v-btn>
                                    <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('CHARGER_SAVE')">
                                        <v-icon dark>mdi-content-save</v-icon>
                                    </v-btn>
                                    <v-btn icon title color="error" :disabled="false" @click="On_Click('CHARGER_DELETE')">
                                        <v-icon dark>mdi-delete</v-icon>
                                    </v-btn> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="pt-1">
                                    <DxDataGrid ref="grid_Charger" :data-source="dxg_Charger" :height="limitHeight3" @cell-click="OnClick_Charger" @row-updated="rowUpdated_Charger" @cellDblClick="OnDBClick_Charger" dateSerializationFormat="yyyyMMdd" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" column-resizing-mode="widget" :hoverStateEnabled="true" :no-data-text="$t('no_data')" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxColumn data-field="EMP_ID" :caption="$t('emp_id')" :allow-editing="false"></DxColumn>
                                        <DxColumn data-field="FULL_NAME" :caption="$t('full_name')" :allow-editing="false"></DxColumn>
                                        <DxColumn data-field="ORG_NM" :caption="$t('org_nm')" :allow-editing="false"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="USE_YN" :caption="$t('use_yn')" :allow-editing="true" edit-cell-template="sysadmin-yn-template" :showEditorAlways="true"></DxColumn>
                                        <DxColumn data-field="VALID_FROM" :caption="$t('valid_from')" :allow-editing="true" data-type="date" css-class="cell-align-center" :format="curLang.DATE_FORMAT"></DxColumn>
                                        <DxColumn data-field="VALID_TO" :caption="$t('valid_to')" :allow-editing="true" data-type="date" css-class="cell-align-center" :format="curLang.DATE_FORMAT"></DxColumn>

                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <DxPaging v-if="dxg_Charger.length < 500" :page-size="dxg_Charger.length" />
                                        <DxScrolling v-else mode="infinite" />
                                        <template #sysadmin-yn-template="{ data }">
                                            <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="
                            valueChanged(
                              $event.target.checked,
                              data.column.dataField,
                              data.data.PK,
                              'CHARGER'
                            )
                          " />
                                        </template>
                                    </DxDataGrid>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" dense>
                                    <div class="d-flex justify-end">
                                        <BaseButton icon_type="add_new" :btn_text="$t('add_new')" @onclick="On_Click('CONTACT')" :disabled="isProcessing" />
                                        <BaseButton icon_type="save" :btn_text="$t('save')" :disabled="isProcessing" @onclick="On_Click('CONTACT_SAVE')" />
                                        <BaseButton icon_type="delete" :btn_text="$t('delete')" :disabled="isProcessing" @onclick="On_Click('CONTACT_DELETE')" />
                                    </div>
                                    <!-- <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('CONTACT')">
                                        <v-icon dark>mdi-plus-box</v-icon>
                                    </v-btn>
                                    <v-btn icon title :color="currentTheme" :disabled="false" @click="On_Click('CONTACT_SAVE')">
                                        <v-icon dark>mdi-content-save</v-icon>
                                    </v-btn>
                                    <v-btn icon title color="error" :disabled="false" @click="On_Click('CONTACT_DELETE')">
                                        <v-icon dark>mdi-delete</v-icon>
                                    </v-btn> -->
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12" class="pt-1">
                                    <DxDataGrid ref="grid_Contact" :data-source="dxg_Contact" :height="limitHeight3" @cell-click="OnClick_Contact" @row-updated="rowUpdated_Contact" dateSerializationFormat="yyyyMMdd" :allow-column-resizing="true" :cache-enabled="false" :column-auto-width="$vuetify.breakpoint.smAndDown" column-resizing-mode="widget" :hoverStateEnabled="true" :no-data-text="$t('no_data')" :selection="{ mode: 'single' }" :show-borders="true" :show-column-lines="true" :show-row-lines="true">
                                        <DxColumn data-field="CHARGER_NM" :caption="$t('charger_nm')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="CHARGER_POS" :caption="$t('charger_pos')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="PHONE_NO" :caption="$t('phone_no')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="MOBILE_NO" :caption="$t('mobile_no')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="FAX_NO" :caption="$t('fax_no')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="EMAIL" :caption="$t('email')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="GROUP_TYPE" :caption="$t('group_type')" :allow-editing="true" dataType="string">
                                            <DxLookup display-expr="NAME" value-expr="CODE" :data-source="cboGroupType" />
                                        </DxColumn>
                                        <DxColumn data-field="URGENT_CONTACT" :caption="$t('urgent_contact')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="ADDR" :caption="$t('addr')" :allow-editing="true"></DxColumn>
                                        <DxColumn data-field="USE_YN" :caption="$t('use_yn')" :allow-editing="true" edit-cell-template="sysadmin-yn-template" :showEditorAlways="true"></DxColumn>
                                        <DxColumn data-field="VALID_FROM" :caption="$t('valid_from')" :allow-editing="true" data-type="date" css-class="cell-align-center" :format="curLang.DATE_FORMAT"></DxColumn>
                                        <DxColumn data-field="VALID_TO" :caption="$t('valid_to')" :allow-editing="true" data-type="date" css-class="cell-align-center" :format="curLang.DATE_FORMAT"></DxColumn>
                                        <DxColumn data-field="DESCRIPTION" :caption="$t('description')" :allow-editing="true"></DxColumn>

                                        <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" />
                                        <DxKeyboardNavigation :edit-on-key-press="true" />
                                        <DxPaging v-if="dxg_Contact.length < 500" :page-size="dxg_Contact.length" />
                                        <DxScrolling v-else mode="infinite" />
                                        <template #sysadmin-yn-template="{ data }">
                                            <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="
                            valueChanged(
                              $event.target.checked,
                              data.column.dataField,
                              data.data.PK,
                              'CONTACT'
                            )
                          " />
                                        </template>
                                    </DxDataGrid>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" class="pl-5 pt-3 pr-5">
                                    Biz_place no data
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" class="pl-5 pt-3 pr-5">
                                    location no data
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" class="pl-5 pt-3 pr-5">
                                    <v-textarea v-model="U_DATA.MEMO" :label="$t('memo')" rows="5" clearable dense hide-details />
                                </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" class="pl-5 pt-3 pr-5"> work no data </v-col>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row no-gutters>
                                <v-col cols="12" class="pl-5 pt-3 pr-5"> bank no data </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <alert-dialog ref="alertDialog"></alert-dialog>
    <dynamic-dialog ref="dlg_pop" :companyPK="Number(U_DATA.TCO_COMPANY_PK)" :header="dynamicHeader" :codeLabel="codeLabel" :nameLabel="nameLabel" :dialogTitle="dialogTitle" :procedure="procedure" :moreParas="moreParas" :autoSearch="autoSearch" @returnData="CallBack_DLG"></dynamic-dialog>
    <partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
    <employee-dialog ref="employeeDialog" @closeEmployeeDialog="false" @callBackData="CallBack_EMP" :multiSelectMode="true"></employee-dialog>
    <employee-dialog ref="employeePartnerDialog" @closeEmployeeDialog="false" @callBackData="CallBack_PARTNEREMP" :multiSelectMode="false"></employee-dialog>
    <confirm-dialog ref="confirm_dialog" @onConfirm="On_Click_action"></confirm-dialog>
    <biz-place-ei-dialog ref="bizPlaceEiDialog" @returnBizPlaceEiInfo="handleReturnedBizPlaceEi" />
</v-container>
</template>

<!-- ================================================================= END DESIGN LAYOUT & BEGIN SCRIPT ========================================================================= --> 

<script>
/*==================================================================== BEGIN IMPORT COMPONENT ======================================================================================*/
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import AlertDialog from "@/components/dialog/AlertDialog";
import DatePicker from "@/components/control/DatePicker";
import DateControl from "@/components/control/DateControl";
import NumberControl from "@/components/control/NumberControl.vue";
import DynamicDialog from "@/components/dialog/DynamicDialog";
import AccountDialog from "@/components/dialog/AccountDialog";
import PartnerDialog from "@/components/dialog/PartnerDialog";
import EmployeeDialog from "@/components/dialog/EmployeeDialog";
import BizPlaceEiDialog from "@/components/dialog/BizPlaceEiDialog";
/*==================================================================== END IMPORT COMPONENT & BEGIN export default==================================================================*/
export default {
    /*############### DEFAULT #######################*/
    layout: "default",
    middleware: "user",
    /*############### components ####################*/
    components: {
        PartnerDialog,
        ConfirmDialog,
        AlertDialog,
        DatePicker,
        DateControl,
        NumberControl,
        DynamicDialog,
        AccountDialog,
        EmployeeDialog,
        BizPlaceEiDialog,
    },
    /*############### data ##########################*/
    data: () => ({
        cbo_Company: [],
        sel_Company: "0",
        scrollInvoked: 0,

        U_PARAM: [
            "_rowstatus",
            "PK",
            "PARENT_PK",
            "PARENT_NM",
            "TCO_COMPANY_PK",
            "PARTNER_ID",
            "PARTNER_NAME",
            "PARTNER_LNAME",
            "PARTNER_FNAME",
            "PARTNER_TYPE",
            "TAX_CODE",
            "ADDR1",
            "ADDR2",
            "ADDR3",
            "PHONE_NO",
            "EMAIL_ADDRESS",
            "FAX_NO",
            "WEB_SITE",
            "CUST_YN",
            "CUST_ACTIVE_YN",
            "INVOICE_TERMS",
            "INVOICE_SCHEDULE",
            "INVOICE_GROUPING",
            "DELIVERY_TERMS",
            "CUST_TRADE_TYPE",
            "CUST_PAYMENT_FORM",
            "CUST_PAYMENT_TEMRS",
            "SALE_PRESENTATIVE",
            "CREDIT_LIMIT",
            "CREDIT_USED",
            "CUST_BANK_ACCOUNT",
            "SALE_DEFAULT_TAX",
            "VEN_YN",
            "VEN_ACTIVE_YN",
            "VEN_PAYMENT_FORM",
            "VEN_PAYMENT_TERMS",
            "VEN_BANK_ACCOUNT",
            "PUR_DEFAULT_TAX",
            "VEN_TRADE_TYPE",
            "TRANS_CURRENCY",
            "NATION",
            "ACTIVE_YN",
            "ANNIVERSARY_DATE",
            "NUMBER_EMPLOYEE",
            "COMPANY_SIZE",
            "COMPANY_CAPITAL",
            "COMPANY_INDUSTY",
            "COMPANY_PRODUCT",
            "TAX_OFFICE",
            "VALID_FROM",
            "VALID_TO",
            "DESCRIPTION",
            "SERIAL_NO",
            "SHORT_NM",
            "FORM_NO",
            "TCO_BPPHOTO_PK",
            "AUTO_YN",
            "VOUCHER_TYPE",
            "VEN_SWIFT_NO",
            "CUS_SWIFT_NO",
            "REPRESENTED_BY",
            "INFO_CRT",
            "MEMO",
            "BILL_TO_PK",
            "BILL_TO_ID",
            "BILL_TO_NAME",
            "DELI_TO_PK",
            "DELI_TO_ID",
            "DELI_TO_NAME",
            "LICENSE_NO",
            "TRANSACTION",
            "CORPORATE_YN",
            "REPRESENTATIVE",
            "WORKDIVISION",
            "NUMBER_BANK",
            "CUST_GROUP",
            "CODE_NM",
            "POSTAL_CODE",
            "PAYMENT_METHOD",
            "PERIOD",
            "DC_RATE",
            "BUSINESS_ITEM",
            "CUS_AREA",
        ],
        U_DATA: null,

        tab_control: 0,
        dynamicHeader: [],
        codeLabel: "",
        nameLabel: "",
        dialogTitle: "",
        procedure: "",
        moreParas: null,
        autoSearch: false,
        action_dlg: "",

        txt_Customer: "",
        txt_Tax_Code: "",
        cbo_Type: [],
        sel_Type: "",
        cbo_Transaction: [],
        sel_Transaction: "",
        sel_Use_YN: "Y",
        dxg_gridmaster: [],
        cbo_Voucher_Type: [],
        chk_Auto: "Y",
        cbo_Pay_Method: [],
        cbo_Transaction_C: [],
        cbo_Partner_Type: [],
        TF_Voucher_Type: false,

        cbo_company_size: [],
        cbo_nation: [],
        cbo_trans_ccy: [],

        cbo_Cpay_form: [],
        cbo_sale_dtax: [],
        cbo_invoice_term: [],
        cbo_invoice_schedule: [],
        cbo_invoice_group: [],
        cbo_delivery_term: [],
        cbo_cust_trade: [],
        cbo_cust_pay_term: [],

        cbo_Vpay_form: [],
        cbo_ven_dtax: [],
        cbo_ven_trade: [],
        cbo_cust_group: [],
        cbo_ven_pay_form: [],
        BODY_INIT: 0,
        dxg_Charger: [],
        sel_row_tab_Charger: -1,
        sel_row_tab_Contact: -1,
        sel_row_tab_BizPlace_EI: -1,
        dxg_Contact: [],
        dxg_BizPlace_EI: [],
        delete_action: "",
        cboGroupType: [],
        txtAuto: "N",
    }),
    /*############### created #######################*/
    created() {
        this.getCompanyList();
        this.U_DATA = this._initArray(this.U_PARAM);
    },
    /*############### watch ######################*/
    watch: {
        async "U_DATA.TCO_COMPANY_PK"(val) {
            if (val) {
                this.getCommonCode("TYPE");
                this.getCommonCode("TRANSACTION");
                this.getCommonCode("VOUCHER_TYPE");
                this.getCommonCode("PAY_METHOD");
                this.getCommonCode("TRANS_CY");
                this.getCommonCode("NATION");
                this.getCommonCode("COMP_SIZE");

                this.getCommonCode("PAY_FORM");
                this.getCommonCode("SALE_DTAX");
                this.getCommonCode("INV_TERM");
                this.getCommonCode("INV_SCHEDULE");
                this.getCommonCode("INV_GROUP");
                this.getCommonCode("DELI_TERM");
                this.getCommonCode("CUST_TRADE");
                this.getCommonCode("PAY_TERM");

                this.getCommonCode("VEN_FORM");
                this.getCommonCode("VEN_PAY");
                this.getCommonCode("VEN_TRADE");
                this.getCommonCode("VEN_DTAX");
                this.getCommonCode("CUST_GROUP");
                this.getCommonCode("GROUP_TYPE");
                this.getCommonCode("AUTO");

                this.sel_Company = val;
                this.U_DATA.AUTO_YN = this.txtAuto;
            }
        },
        async "U_DATA.AUTO_YN"(val) {
            if (val) {
                this.TF_Voucher_Type = val == "Y" ? false : true;
                if (val == "N") {
                    //     this.cbo_Voucher_Type = [{
                    //         CODE: "",
                    //         NAME: ""
                    //     }];
                    this.U_DATA.VOUCHER_TYPE = "";
                } else {
                    this.U_DATA.VOUCHER_TYPE = (this.cbo_Voucher_Type ? this.cbo_Voucher_Type[0].CODE : "");
                    //     this.getCommonCode("VOUCHER_TYPE");
                }
            }
        },
        BODY_INIT(val) {
            if (val == 1) {
                this.BODY_INIT = 0;
                this.CRT_NEW();
            }
        },
    },
    /*############### computed ######################*/
    computed: {
        user() {
            return this.$store.getters["auth/user"];
        },
        limitHeight() {
            return this.windowHeight - 300;
        },
        scroll_height() {
            return this.windowHeight / 2 - 60;
        },
        limitHeight2() {
            return this.windowHeight - 750;
        },
        limitHeight3() {
            return this.windowHeight - 570;
        },
        cbo_Use_YN() {
            return [{
                    CODE: "Y",
                    NAME: this.$t("yes")
                },
                {
                    CODE: "N",
                    NAME: this.$t("no")
                },
            ];
        },
        cbo_Corporate_YN () {
            return [{
                    CODE: "Y",
                    NAME: this.$t("yes")
                },
                {
                    CODE: "N",
                    NAME: this.$t("no")
                },
            ];
        },
    },
    /*############### mounted #######################*/
    mounted() {
        this.sel_Company = this.user.TCO_COMPANY_PK;
        this.BODY_INIT = 1;
    },

    /*############### methods #######################*/
    methods: {
        onScroll() {
            this.scrollInvoked++;
        },
        async getCompanyList() {
            const dso = {
                type: "list",
                selpro: "sys_sel_list_company",
                para: [this.user.PK],
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.cbo_Company = result;
                this.U_DATA.TCO_COMPANY_PK = result[0].PK;
                this.sel_Company = result[0].PK;
            }
        },
        async getCommonCode(obj) {
            var Param = [];
            switch (obj) {
                case "TYPE":
                    this.Param = "CODC0010";
                    break;
                case "TRANSACTION":
                    this.Param = "TPS0023";
                    break;
                case "VOUCHER_TYPE":
                    this.Param = "CODC0160";
                    break;
                case "PAY_METHOD":
                    this.Param = "LGCM0110";
                    break;
                case "TRANS_CY":
                    this.Param = "LGCM0100";
                    break;
                case "NATION":
                    this.Param = "NAT";
                    break;
                case "COMP_SIZE":
                    this.Param = "LGGS0101";
                    break;

                case "PAY_FORM":
                    this.Param = "LGCM0110";
                    break;
                case "SALE_DTAX":
                    this.Param = "LGCM0160";
                    break;
                case "INV_TERM":
                    this.Param = "LGGS0103";
                    break;
                case "INV_SCHEDULE":
                    this.Param = "LGGS0104";
                    break;
                case "INV_GROUP":
                    this.Param = "LGGS0105";
                    break;
                case "DELI_TERM":
                    this.Param = "LGCM0260";
                    break;
                case "CUST_TRADE":
                    this.Param = "LGCM0140";
                    break;
                case "PAY_TERM":
                    this.Param = "LGCM0120";
                    break;

                case "VEN_FORM":
                    this.Param = "LGCM0110";
                    break;
                case "VEN_PAY":
                    this.Param = "LGCM0120";
                    break;
                case "VEN_TRADE":
                    this.Param = "LGCM0141";
                    break;
                case "VEN_DTAX":
                    this.Param = "LGCM0160";
                    break;

                case "CUST_GROUP":
                    this.Param = "BPG002";
                    break;
                case "GROUP_TYPE":
                    this.Param = "SYS0010";
                    break;
                case "AUTO":
                    this.Param = "ACJS0200";
                    this.txtAuto = 'N';
                    // console.log('vng-154-dvg^_^: > file: 8015010.vue > line 997 > getCommonCode > this.txtAuto', this.txtAuto);
                    break;
            }
            //const result = await this._getCommonCode(this.Param, this.U_DATA.TCO_COMPANY_PK);
            const result = (obj == 'INV_TERM' || obj == 'CUST_TRADE' || obj == 'PAY_TERM' || obj == 'INV_SCHEDULE' || obj == 'PAY_FORM' || obj == 'VEN_FORM' || obj == 'VEN_PAY'|| obj == 'VEN_TRADE' || obj == 'VEN_DTAX') ? await this._getCommonCode(this.Param, '') : await this._getCommonCode(this.Param, this.U_DATA.TCO_COMPANY_PK);

            //console.log(result)
            if (result.length > 0) {
                switch (obj) {
                    case "TYPE":
                        this.cbo_Partner_Type = [...result];
                        var para = {
                            CODE: "ALL",
                            NAME: this.$t("-select all-")
                        };
                        var push_result = result;
                        push_result.push(para);
                        this.cbo_Type = push_result;
                        this.sel_Type = "ALL";

                        break;
                    case "TRANSACTION":
                        this.cbo_Transaction_C = [...result];
                        var para = {
                            CODE: "ALL",
                            NAME: this.$t("-select all-")
                        };
                        push_result = result;
                        push_result.push(para);
                        this.cbo_Transaction = push_result;
                        this.sel_Transaction = "ALL";

                        break;
                    case "VOUCHER_TYPE":
                        this.cbo_Voucher_Type = result;
                        break;
                    case "PAY_METHOD":
                        this.cbo_Pay_Method = result;
                        break;
                    case "TRANS_CY":
                        this.cbo_trans_ccy = result;
                        break;
                    case "NATION":
                        this.cbo_nation = result;
                        break;
                    case "COMP_SIZE":
                        this.cbo_company_size = result;
                        break;
                    case "PAY_FORM":
                        this.cbo_Cpay_form = result;
                        break;
                    case "SALE_DTAX":
                        this.cbo_sale_dtax = result;
                        break;
                    case "INV_TERM":
                        this.cbo_invoice_term = result;
                        break;
                    case "INV_SCHEDULE":
                        this.cbo_invoice_schedule = result;
                        break;
                    case "INV_GROUP":
                        this.cbo_invoice_group = result;
                        break;
                    case "DELI_TERM":
                        this.cbo_delivery_term = result;
                        break;
                    case "CUST_TRADE":
                        this.cbo_cust_trade = result;
                        break;
                    case "PAY_TERM":
                        this.cbo_cust_pay_term = result;
                        break;
                    case "VEN_FORM":
                        this.cbo_Vpay_form = result;
                        break;
                    case "VEN_PAY":
                        this.cbo_ven_pay_form = result;
                        break;
                    case "VEN_TRADE":
                        this.cbo_ven_trade = result;
                        break;
                    case "VEN_DTAX":
                        this.cbo_ven_dtax = result;
                        break;
                    case "CUST_GROUP":
                        var copy_cust_group = result;
                        copy_cust_group.unshift({
                            CODE: "",
                            NAME: ""
                        });
                        this.cbo_cust_group = copy_cust_group;
                        break;
                    case "GROUP_TYPE":
                        this.cboGroupType = result;
                        break;
                    case "AUTO":
                        const Auto = result.find(x => x.DEF_YN === "Y");
                        // console.log('vng-154-dvg^_^: > file: 8015010.vue > line 1092 > getCommonCode > result', result);
                        this.txtAuto = Auto ? Auto.CODE : "N";
                        // console.log('vng-154-dvg^_^: > file: 8015010.vue > line 1094 > getCommonCode > this.txtAuto', this.txtAuto);

                        this.U_DATA.AUTO_YN = this.txtAuto;
                        break;
                }
            }
        },
        On_change_Tab() {
            /*if(this.tab === 0) { this.rbStatus = '1' }
                              else if(this.tab === 1) { this.rbStatus = '2' }
                              else { this.rbStatus = '3' }
                              this.search()*/
        },
        On_Click(obj) {
            switch (obj) {
                case "SEARCH":
                    this.DXG_GridData(obj);
                    break;
                case "DETAIL_CRT":
                    this.CRT_DATA();
                    break;
                case "SAVE_CRT":
                    this.CRT_SAVE("SAVE");
                    break;
                case "NEW_CRT":
                    this.CRT_NEW();
                    break;
                case "DELETE_CRT":
                    this.CRT_SAVE("DELETE");
                    break;
                case "BILL_TO":
                    this.action_dlg = obj;
                    this.$refs.partnerDialog.dialogIsShow = true;
                    break;
                case "DELI_TO":
                    this.action_dlg = obj;
                    this.$refs.partnerDialog.dialogIsShow = true;
                    break;
                case "CHARGER":
                    if (
                        this.U_DATA.PK == 0 ||
                        this.U_DATA.PK == "" ||
                        this.U_DATA.PK == "null"
                    ) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_CHOOSE_ONE_PARTNER_TO_NEW_CHARGER"
                        );
                        return;
                    }
                    this.$refs.employeeDialog.dialogIsShow = true;
                    break;
                case "CHARGER_SAVE":
                    this.DXG_GridData("CHARGER_S");
                    break;
                case "CHARGER_DELETE":
                    if (this.sel_row_tab_Charger == -1) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_SELECT_ONE_ROW_TO_DELETE"
                        );
                        return;
                    } else {
                        this.delete_action = "CHARGER_D";
                        this.$refs.confirm_dialog.showConfirm(
                            this.$t("do_you_want_to_delete_data"),
                            "warning"
                        );
                    }
                    break;
                case "CONTACT":
                    if (
                        this.U_DATA.PK == 0 ||
                        this.U_DATA.PK == "" ||
                        this.U_DATA.PK == "null"
                    ) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_CHOOSE_ONE_PARTNER_TO_NEW_CONTACT"
                        );
                        return;
                    }
                    var e = {};
                    e._rowstatus = "I";
                    e.PK = 0;
                    e.TCO_BUSPARTNER_PK = this.U_DATA.PK;
                    e.CHARGER_NM = "";
                    e.CHARGER_POS = "";
                    e.PHONE_NO = "";
                    e.MOBILE_NO = "";
                    e.FAX_NO = "";
                    e.EMAIL = "";
                    e.URGENT_CONTACT = "";
                    e.ADDR = "";
                    e.USE_YN = "Y";
                    e.VALID_FROM = "";
                    e.VALID_TO = "";
                    e.DESCRIPTION = "";
                    this.dxg_Contact.unshift(e);
                    break;
                case "CONTACT_SAVE":
                    this.DXG_GridData("CONTACT_S");
                    break;
                case "CONTACT_DELETE":
                    if (this.sel_row_tab_Contact == -1) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_SELECT_ONE_ROW_TO_DELETE"
                        );
                        return;
                    } else {
                        this.delete_action = "CONTACT_D";
                        this.$refs.confirm_dialog.showConfirm(
                            this.$t("do_you_want_to_delete_data"),
                            "warning"
                        );
                    }
                    break;
                case "PRINT_CRT":
                    this.exportReport();
                    break;
                case "PARTNER_ID":
                    this.$refs.employeePartnerDialog.dialogIsShow = true;
                    break;
                case "BIZ_PLACE_EI":
                    this.OnDBClick_BizPlace_EI();
                    break;
                case "BIZ_PLACE_EI_NEW":
                    this.action_dlg = obj; // bizPlaceEiDialog  partnerDialog
                    this.$refs.bizPlaceEiDialog.dialogIsShow = true;
                    break;
                case "BIZ_PLACE_EI_SAVE":
                    this.DXG_GridData("BIZ_PLACE_EI_S");
                    break;
                case "BIZ_PLACE_EI_DELETE":
                    if (this.sel_row_tab_BizPlace_EI == -1) {
                        this.$refs.alertDialog.showAlert(
                            "warning",
                            "Error",
                            "PLS_SELECT_ONE_ROW_TO_DELETE"
                        );
                        return;
                    } else {
                        this.delete_action = "BIZ_PLACE_EI_D";
                        this.$refs.confirm_dialog.showConfirm(
                            this.$t("do_you_want_to_delete_data"),
                            "warning"
                        );
                    }
                    break;
            }
        },
        On_Click_action() {
            switch (this.delete_action) {
                case "CHARGER_D":
                    this.dxg_Charger[this.sel_row_tab_Charger]._rowstatus = "D";
                    this.DXG_GridData("CHARGER_S");
                    break;
                case "CONTACT_D":
                    this.dxg_Contact[this.sel_row_tab_Contact]._rowstatus = "D";
                    this.DXG_GridData("CONTACT_S");
                    break;
                case "BIZ_PLACE_EI_D":
                    this.dxg_BizPlace_EI[this.sel_row_tab_BizPlace_EI]._rowstatus = "D";
                    this.DXG_GridData("BIZ_PLACE_EI_S");
                    break;
            }
        },
        async CRT_DATA() {
            var sp = "AC_SEL_8015010_02";
            var param = [this.U_DATA.PK];
            const dso = {
                type: "control",
                selpro: sp,
                para: param
            };
            const result = await this._dsoCall(dso, "select", false);
            if (result) {
                this.U_DATA = {
                    ...result
                };
                this.DXG_GridData("CHARGER_V");
                this.DXG_GridData("CONTACT_V");
                this.DXG_GridData("BIZ_PLACE_EI");
            }
        },
        CRT_NEW() {
            this.U_DATA = this._initArray(this.U_PARAM);
            this.U_DATA.PK = 0;

            this.U_DATA.TCO_COMPANY_PK = this.sel_Company;
            this.U_DATA.ACTIVE_YN = "Y";
            this.U_DATA.VALID_FROM = this._CurrentDate("");
            this.U_DATA.VALID_TO = "";
            this.U_DATA.ANNIVERSARY_DATE = this._CurrentDate("");
            this.U_DATA.AUTO_YN = this.txtAuto;

            // this.U_DATA.VOUCHER_TYPE = "NULL";
        },
        async CRT_SAVE(obj) {
            if (
                this.U_DATA.PARTNER_NAME == "" ||
                this.U_DATA.PARTNER_NAME == "null" ||
                this.U_DATA.PARTNER_NAME == null
            ) {
                this.$refs.alertDialog.showAlert(
                    "warning",
                    "Error",
                    "PLS_INPUT_PARTNER_NAME"
                );
                return;
            }
            if (
                this.U_DATA.AUTO_YN == "N" &&
                (this.U_DATA.PARTNER_ID == "" ||
                    this.U_DATA.PARTNER_ID == "null" ||
                    this.U_DATA.PARTNER_ID == null)
            ) {
                this.$refs.alertDialog.showAlert(
                    "warning",
                    "Error",
                    "PLS_INPUT_PARTNER_ID"
                );
                return;
            }
            var p_action = Number(this.U_DATA.PK) > 0 ? "UPDATE" : "INSERT";
            this.U_DATA.PK = p_action == "INSERT" ? 0 : this.U_DATA.PK;
            this.U_DATA._rowstatus = obj != "DELETE" ? p_action : "DELETE";
            const dso = {
                type: "control",
                selpro: "AC_SEL_8015010_02",
                updpro: "AC_UPD_8015010_03",
                para: [this.U_DATA.PK],
                elname: this.U_PARAM,
                data: this.U_DATA,
            };
            const result = await this._dsoCall(dso, "update", true);
            if (result) {
                if (obj == "DELETE") {
                    this.On_Click("SEARCH");
                    this.DXG_GridData("CHARGER_V");
                    this.DXG_GridData("CONTACT_V");
                    this.DXG_GridData("BIZ_PLACE_EI");
                    this.CRT_NEW();
                } else {
                    this.U_DATA = result;
                    this.On_Click("SEARCH");
                    this.DXG_GridData("CHARGER_V");
                    this.DXG_GridData("CONTACT_V");
                    this.DXG_GridData("BIZ_PLACE_EI");
                    // if (result[0].STATUS === "S") {
                    //   //this.DXG_GridData("TAB1");
                    //   //this.DXG_GridData("TAB2");
                    // } else {
                    //   var color_msg2 = result[0].STATUS == "E" ? "warning" : "success";
                    //   this.showNotification(
                    //     color_msg2,
                    //     this.$t(result[0].ERROR_ID) + " " + result[0].ERROR_NM,
                    //     "",
                    //     5000
                    //   );
                    // }
                }
            }
        },
        async DXG_GridData(obj) {
            var sp = "";
            switch (obj) {
                case "SEARCH":
                    this.sp = "AC_SEL_8015010_01";
                    const dso = {
                        type: "grid",
                        selpro: this.sp,
                        para: [
                            this.U_DATA.TCO_COMPANY_PK,
                            this.txt_Customer,
                            this.txt_Tax_Code,
                            this.sel_Type,
                            this.sel_Use_YN,
                            this.sel_Transaction,
                        ],
                    };
                    this.dxg_gridmaster = await this._dsoCall(dso, "select", false);
                    break;
                case "CHARGER_V":
                    this.sp = "AC_SEL_8015010_04";
                    const dso_charger = {
                        type: "grid",
                        selpro: this.sp,
                        para: [this.U_DATA.PK],
                    };
                    this.dxg_Charger = await this._dsoCall(dso_charger, "select", false);
                    break;
                case "CHARGER_S":
                    this.$refs.grid_Charger.instance.saveEditData().then(async () => {
                        const dataIsModifiedR = this.dxg_Charger.some(
                            (x) => x._rowstatus !== ""
                        );
                        if (dataIsModifiedR) {
                            const dso = {
                                type: "grid",
                                selpro: "AC_SEL_8015010_04",
                                updpro: "AC_UPD_8015010_05",
                                para: [this.U_DATA.PK],
                                elname: [
                                    "_rowstatus",
                                    "PK",
                                    "TCO_BUSPARTNER_PK",
                                    "THR_EMPLOYEE_PK",
                                    "EMP_ID",
                                    "FULL_NAME",
                                    "ORG_NM",
                                    "DESCRIPTION",
                                    "USE_YN",
                                    "VALID_FROM",
                                    "VALID_TO",
                                ],
                                data: this.dxg_Charger,
                            };
                            this.dxg_Charger = await this._dsoCall(dso, "update", true);
                        }
                    });
                    this.sel_row_tab_Charger = -1;
                    break;
                case "CONTACT_V":
                    this.sp = "AC_SEL_8015010_06";
                    const dso_contact = {
                        type: "grid",
                        selpro: this.sp,
                        para: [this.U_DATA.PK],
                    };
                    this.dxg_Contact = await this._dsoCall(dso_contact, "select", false);
                    break;

                case "CONTACT_S":
                    this.$refs.grid_Contact.instance.saveEditData().then(async () => {
                        const dataIsModifiedR = this.dxg_Contact.some(
                            (x) => x._rowstatus !== ""
                        );
                        if (dataIsModifiedR) {
                            const dso = {
                                type: "grid",
                                selpro: "AC_SEL_8015010_06",
                                updpro: "AC_UPD_8015010_07",
                                para: [this.U_DATA.PK],
                                elname: [
                                    "_rowstatus",
                                    "PK",
                                    "TCO_BUSPARTNER_PK",
                                    "CHARGER_NM",
                                    "CHARGER_POS",
                                    "PHONE_NO",
                                    "MOBILE_NO",
                                    "FAX_NO",
                                    "EMAIL",
                                    "URGENT_CONTACT",
                                    "ADDR",
                                    "USE_YN",
                                    "VALID_FROM",
                                    "VALID_TO",
                                    "DESCRIPTION",
                                    "GROUP_TYPE"
                                ],
                                data: this.dxg_Contact,
                            };
                            this.dxg_Contact = await this._dsoCall(dso, "update", true);
                        }
                    });
                    this.sel_row_tab_Contact = -1;
                    break;
                case "BIZ_PLACE_EI":
                    this.sp = "AC_SEL_8015010_BIZ_PLACE_EI";
                    const dso_bizplace = {
                        type: "grid",
                        selpro: this.sp,
                        para: [this.U_DATA.PK],
                    };
                    this.dxg_BizPlace_EI = await this._dsoCall(
                        dso_bizplace,
                        "select",
                        false
                    );
                    break;
                case "BIZ_PLACE_EI_S":
                    this.$refs.grid_Biz_Place_EI.instance
                        .saveEditData()
                        .then(async () => {
                            const dataIsModifiedR = this.dxg_BizPlace_EI.some(
                                (x) => x._rowstatus !== ""
                            );
                            if (dataIsModifiedR) {
                                const dso = {
                                    type: "grid",
                                    selpro: "AC_SEL_8015010_BIZ_PLACE_EI",
                                    updpro: "AC_UPD_8015010_BIZ_PLACE_EI",
                                    para: [this.U_DATA.PK],
                                    elname: [
                                        "_rowstatus",
                                        "PK",
                                        "TCO_BUSPLACE_PK",
                                        "LOC_ID",
                                        "LOC_NM",
                                        "LOC_LNM",
                                        "LOC_FNM",
                                        "NATION",
                                        "REG_NO",
                                        "TAX_CD",
                                        "TAX_OFFICE",
                                        "TCO_COMPANY_PK",
                                        "TEI_COMPANY_PK",
                                        "TCO_BUSPARTNER_PK",
                                        "TEI_CUSTOMER_PK",
                                        "TCO_BUSPARTNER_ITF_YN",
                                    ],
                                    data: this.dxg_BizPlace_EI,
                                };
                                this.dxg_BizPlace_EI = await this._dsoCall(dso, "update", true);
                            }
                        });
                    this.sel_row_tab_Contact = -1;
                    break;
            }
        },
        On_Change_gridmaster(e) {
            if (e.rowType == "data") {
                this.U_DATA.PK = e.data.PK;
                this.On_Click("DETAIL_CRT");
            }
        },
        handleReturnedBizPlaceEi(item) {
            console.log(item);
            console.log(this.dxg_BizPlace_EI);
            if (
                this.U_DATA.PK == 0 ||
                this.U_DATA.PK == "" ||
                this.U_DATA.PK == "null"
            ) {
                this.$refs.alertDialog.showAlert(
                    "warning",
                    "Error",
                    "PLS_CHOOSE_ONE_PARTNER_TO_NEW_CONTACT"
                );
                return;
            }
            // this.$refs.grid_Biz_Place_EI.addRowStruct({
            //                 _rowstatus          : "I",
            //                 PK                  : 0,
            //                 TCO_BUSPARTNER_PK   : this.U_DATA.PK,
            //                 LOC_ID              : item.LOC_ID,
            //                 LOC_NM              : item.LOC_NM,
            //                 LOC_LNM             : item.LOC_LNM,
            //                 LOC_FNM             : item.LOC_FNM,
            //                 NATION              : item.NATION,
            //                 REG_NO              : item.REG_NO,
            //                 TAX_CD              : item.TAX_CD,
            //                 TAX_OFFICE          : item.TAX_OFFICE,
            //                 TCO_BUSPARTNER_ITF_YN : "N",
            //                 INTERFACE_DT        : "",
            //                 INTERFACE_BY        : "",
            //                 TAX_CODE_TO_USERID  : "",
            //                 PASSWORDSEND        : "",
            //                 PASSWORD            : "",
            //                 TCO_COMPANY_PK      : item.TCO_COMPANY_PK,
            //                 TCO_BUSPLACE_PK     : item.PK,
            //                 TEI_COMPANY_PK      : item.TEI_COMPANY_PK,
            //                 TEI_CUSTOMER_PK     : ""
            //                 },
            //                 0
            //             );
            //item.forEach(element => {
            this.dxg_BizPlace_EI.push({
                _rowstatus: "I",
                PK: 0,
                TCO_BUSPARTNER_PK: this.U_DATA.PK,
                LOC_ID: item.LOC_ID,
                LOC_NM: item.LOC_NM,
                LOC_LNM: item.LOC_LNM,
                LOC_FNM: item.LOC_FNM,
                NATION: item.NATION,
                REG_NO: item.REG_NO,
                TAX_CD: item.TAX_CD,
                TAX_OFFICE: item.TAX_OFFICE,
                TCO_BUSPARTNER_ITF_YN: "N",
                INTERFACE_DT: "",
                INTERFACE_BY: "",
                TAX_CODE_TO_USERID: "",
                PASSWORDSEND: "",
                PASSWORD: "",
                TCO_COMPANY_PK: item.TCO_COMPANY_PK,
                TCO_BUSPLACE_PK: item.PK,
                TEI_COMPANY_PK: item.TEI_COMPANY_PK,
                TEI_CUSTOMER_PK: "",
            });
            // });
        },
        handleReturnedPartner(data) {
            switch (this.action_dlg) {
                case "BILL_TO":
                    this.U_DATA.BILL_TO_PK = `${data.PK}`;
                    this.U_DATA.BILL_TO_ID = `${data.BILL_TO_ID}`;
                    this.U_DATA.BILL_TO_NAME = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`;
                    break;
                case "DELI_TO":
                    this.U_DATA.DELI_TO_PK = `${data.PK}`;
                    this.U_DATA.DELI_TO_ID = `${data.BILL_TO_ID}`;
                    this.U_DATA.DELI_TO_NAME = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`;
                    break;
            }
            //this.U_DATA.SUPPLIER_NM = `${data.PARTNER_ID} - ${data.PARTNER_NAME}`;
        },
        rowUpdated_Charger(e) {
            if (!e.cancel) {
                if (e.data._rowstatus !== "I") {
                    e.data._rowstatus = "U";
                }
            }
        },
        OnClick_Charger(e) {
            this.sel_row_tab_Charger = e.rowIndex;
        },
        rowUpdated_Contact(e) {
            if (!e.cancel) {
                if (e.data._rowstatus !== "I") {
                    e.data._rowstatus = "U";
                }
            }
        },
        OnClick_Contact(e) {
            this.sel_row_tab_Contact = e.rowIndex;
        },
        OnClick_BizPlace_EI(data) {
            console.log(data);
            this.sel_row_tab_BizPlace_EI = data.rowIndex;
        },
        CallBack_EMP(item) {
            if (item) {
                //console.log(item);
                if (this.sel_row_tab_Charger == -1) {
                    for (var i = 0; i < item.length; i++) {
                        let newRow = {
                            _rowstatus: "I",
                            PK: 0,
                            TCO_BUSPARTNER_PK: this.U_DATA.PK,
                            THR_EMPLOYEE_PK: item[i].PK,
                            ORG_NM: item[i].ORG_NM,
                            EMP_ID: item[i].EMP_ID,
                            FULL_NAME: item[i].FULL_NAME,
                        };
                        this.dxg_Charger.unshift(newRow);
                    }
                    this.$refs.grid_Charger.instance.refresh();
                } else {
                    // console.log(this.sel_row_tab_Charger);
                    this.dxg_Charger[this.sel_row_tab_Charger].THR_EMPLOYEE_PK =
                        item[0].PK;
                    this.dxg_Charger[this.sel_row_tab_Charger].ORG_NM = item[0].ORG_NM;
                    this.dxg_Charger[this.sel_row_tab_Charger].EMP_ID = item[0].EMP_ID;
                    this.dxg_Charger[this.sel_row_tab_Charger].FULL_NAME =
                        item[0].FULL_NAME;
                }
            }
            this.sel_row_tab_Charger = -1;
        },
        CallBack_PARTNEREMP(item) {
            if (item) {
                // console.log(item)
                this.U_DATA.PARTNER_ID = item.EMP_ID;
                this.U_DATA.PARTNER_NAME = item.FULL_NAME;
                this.U_DATA.PARTNER_LNAME = item.FULL_FNAME;
                this.U_DATA.PHONE_NO = item.TEL;
                this.U_DATA.ADDR1 = item.PERMANENT_ADDR;
                this.U_DATA.PARTNER_TYPE = "40";
                this.U_DATA.AUTO_YN = this.txtAuto;
            }
        },
        CallBack_DLG() {},
        OnDBClick_Charger(e) {
            if (e.columnIndex < 3) {
                this.On_Click("CHARGER");
            }
        },
        OnDBClick_BizPlace_EI(e) {
            //if( e.columnIndex < 3 )
            //{
            this.On_Click("BIZ_PLACE_EI_NEW");
            //}
        },
        valueChanged(e, colName, rowPK, p_action) {
            const newValue = e ? "Y" : "N";
            this.changeValue(newValue, colName, rowPK, p_action);
        },
        changeValue(value, key, pk, p_action) {
            if (p_action == "CHARGER") {
                this.dxg_Charger.map((item, index) => {
                    if (item.PK === pk) {
                        this.$set(item, key, value);
                        if (item.PK && item._rowstatus !== "I") {
                            item._rowstatus = "U";
                        }
                    }
                });
            } else {
                this.dxg_Contact.map((item, index) => {
                    if (item.PK === pk) {
                        this.$set(item, key, value);
                        if (item.PK && item._rowstatus !== "I") {
                            item._rowstatus = "U";
                        }
                    }
                });
            }
        },
        DLG_POP() {},
        async exportReport() {
            let report_path = "report/80/15/rpt_80150010.xlsx";
            let hiddenCols = [];
            let excel = [];
            //setup allow col
            excel = [{
                sheet: 1,
                insertRange: [{
                        range: "A1:E3",
                        proc: "ac_rpt_6020020_m",
                        params: [this.U_DATA.TCO_COMPANY_PK, this.U_DATA.TCO_BUSPLACE_PK],
                    }, //header
                ],
                insertRows: [{
                    sequence: "break",
                    startRow: 6,
                    proc: "ac_rpt_80150010",
                    params: [this.U_DATA.TCO_COMPANY_PK],
                    dateColumns: ["CRT_DT", "MOD_DT"],
                    stringColumns: [
                        "PARTNER_ID",
                        "PARTNER_NAME",
                        "PARTNER_LNAME",
                        "PARTNER_FNAME",
                        "ADDR1",
                        "PHONE_NO",
                        "FAX_NO",
                        "WEB_SITE",
                        "TAX_CODE",
                        "CRT_BY",
                        "MOD_BY",
                    ],

                    /* total: [
                                          {   column: "ACCOUNT_NO", isDisplay: true, type: "SUM", text: this.$t("excel_total_record") , isMerge: false, merge: { from: 2, to: 8 }    }, //"Total $[0]: $[1] record(s) "
                                          {   column: null, isDisplay: true, type: "SUM", text: this.$t("excel_grand_record"), isMerge: true, isGrandTotal: true , font: {  size: 18, bold: true } , merge: { from: 1, to: 8 }  }, //"Grand total: $[1] record(s) "
                                          ]*/
                }, ],
                hideColumns: hiddenCols,
            }, ];
            if (!report_path) {
                this.salaryStatus = this.$t("template_not_available");
                return;
            }

            const res = await this.$axios.$get("/dso/makereport", {
                responseType: "blob",
                params: {
                    template: report_path,
                    excel: JSON.stringify(excel)
                },
            });
            if (res && res.size > 0) {
                let blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                let url = window.URL.createObjectURL(blob);
                window.open(url);
                this.salaryStatus = this.$t("complete");
            } else {
                //this.showNotification( "danger", this.$t("fail_to_export_report"),  "",  4000 );
                this.salaryStatus = this.$t("fail_to_export_report");
            }
        },
    },
};
/*==================================================================== END export default  ========================================================================================*/
</script>
<!-- ================================================================= END SCRIPT  ============================================================================================== -->

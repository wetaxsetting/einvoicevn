<template>
  <v-container fluid class="pa-0" v-resize="onResize">
    <v-row no-gutters class="pl-2">
      <!--left panel-->
      <v-col class="px-0" v-show="showLeft" :cols="leftCols">
        <v-card class="pa-0">
          <v-container fluid class="pb-0">
            <v-row dense>
              <v-col lg="10" sm="6" cols="12" class="d-flex align-center">
                <v-select
                  dense
                  hide-details
                  outlined
                  item-value="VAL"
                  item-text="NAME"
                  :label="$t('company_name')"
                  :items="lstCompanyMaster"
                  v-model="lstCompany"
                ></v-select>
              </v-col>
              <v-col lg="2" sm="6" cols="12" class="d-flex align-center">
                <BaseButton
                  btn_type="icon"
                  icon_type="search"
                  :btn_text="$t('search')"
                  :disabled="false"
                  @onclick="onSearchMaster()"
                />
              </v-col>
            </v-row>
            <!--left table-->
            <v-row dense  justify="start">
              <v-col cols="12">
                
                  <BaseGridView
                    ref="grdLeft"
                    :header="grdLeftHeader"
                    sel_procedure="AC_SEL_6095240_GetList"
                    :multiselect="true"
                    :headertype="1"
                    :filter_paras="[this.mstData.TEI_COMPANY_PK]"
                    :height="limitHeight"
                    @cellClick="cellClick"
                  />
               
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!--right panel-->
      <v-col class="px-0" :cols="12 - leftCols">
        <v-row no-gutters>
          <v-col lg="1" cols="12" class="text-right">
            <!-- Tongle -->
            <div class="d-flex">
              <v-btn icon tile :color="currentTheme" @click="toggleLeft">
                <v-icon v-if="showLeft">mdi-skip-previous</v-icon>
                <v-icon v-if="!showLeft">mdi-skip-next</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col lg="11" cols="12" class="text-right">
            <div class="d-flex justify-end">
              <BaseButton
                btn_type="text"
                :btn_text="$t('checking_declaration')"
                @onclick="previewOriginal()"
              />
              <BaseButton
                btn_type="text"
                :btn_text="$t('general_declaration')"
                @onclick="previewOriginal()"
              />
              <!-- Add -->
              <BaseButton
                btn_type="icon"
                icon_type="add_new"
                :btn_text="$t('btn_add')"
                @onclick="addNewMaster()"
              />

              <!-- Save -->
              <BaseButton
                btn_type="icon"
                icon_type="save"
                :btn_text="$t('save')"
                @onclick="saveMaster()"
              />

              <!-- Delete -->
              <BaseButton
                btn_type="icon"
                icon_type="delete"
                :btn_text="$t('delete')"
                @onclick="deleteMaster()"
              />
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12" class="pt-3">
            <v-card
              v-scroll.self="onScroll"
              class="overflow-y-auto"
              :max-height="scroll_height"
            >
              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('taxpayer_name')"
                    v-model="mstData.COMPANY_NM"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('tax_office')"
                    v-model="Administration_Tax_Agency"
                    :lstData="lst_Administration_Tax_Agency"
                    return-object
                    item-text="NAME"
                    item-value="VAL"
                  />
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('form_no')"
                    v-model="Num_Pattern"
                    :lstData="lst_Num_Pattern"
                    return-object
                    item-text="NAME"
                    item-value="VAL"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('tax_code')"
                    v-model="mstData.TAX_CODE"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('address')"
                    v-model="mstData.ADDR"
                    mandatory
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('declaration_name')"
                    v-model="Declaration_Name"
                    :lstData="lst_Declaration_Name"
                    return-object
                    item-text="NAME"
                    item-value="VAL"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('contact_person')"
                    v-model="mstData.CONTACT_PERSON"
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('tax_address')"
                    v-model="mstData.TAX_ADDR"
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseSelect
                    :label="$t('registration_form')"
                    v-model="Registration_Form"
                    :lstData="lst_Registration_Form"
                    return-object
                    item-text="NAME"
                    item-value="VAL"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput
                    :label="$t('phone_number')"
                    v-model="mstData.TEL"
                    :clearable="false"
                  >
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseInput :label="$t('email')" v-model="mstData.TAX_EMAIL">
                  </BaseInput>
                </v-col>
                <v-col lg="1" sm="6" cols="12" class="py-1"> </v-col>
                <v-col lg="3" sm="6" cols="12" class="py-1">
                  <BaseDatePicker
                    :label="$t('register_day')"
                    start
                    v-model="mstData.DECLARE_DATE"
                  ></BaseDatePicker>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <span>1. Hình thức hóa đơn:</span>
              </v-row>

              <v-row no-gutters>
                <v-col cols="12">
                  <v-radio-group
                    v-model="mstData.INVOICE_METHOD_HAVE_CODE"
                    :label="$t('')"
                    :hide-details="true"
                    :row="true"
                    @change="onEditDetail"
                  >
                    <v-col lg="4" sm="4" cols="12">
                      <v-radio
                        label="Có mã của Cơ Quan Thuế"
                        value="1"
                      ></v-radio>
                    </v-col>
                    <v-col lg="2" sm="4" cols="12"> </v-col>
                    <v-col lg="4" sm="4" cols="12">
                      <v-radio
                        label="Không có mã của Cơ Quan Thuế"
                        value="0"
                      ></v-radio>
                    </v-col>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <span>2. Hình thức gửi dữ liệu hóa đơn điện tử:</span>
              </v-row>
              <v-row no-gutters>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.SEND_METHOD_NNTDBKKHAN"
                    ></v-checkbox>
                    <span class="">{{
                      $t(
                        "Doanh nghiệp nhỏ và vừa, hợp tác xã, hộ, cá nhân kinh doanh tại địa bàn có điều kiện kinh tế xã hội khó khăn, địa bàn có điều kiện kinh tế xã hội đặc biệt khó khăn"
                      )
                    }}</span>
                  </v-sheet>
                </v-col>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.SEND_METHOD_NNTKTDNUBND"
                    ></v-checkbox>
                    <span class="">{{
                      $t(
                        "Doanh nghiệp nhỏ và vừa khác theo đề nghị của Ủy ban nhân dân tỉnh, thành phố trực thuộc trung ương gửi Bộ tài chính trừ doanh nghiệp hoạt động tại các khu kinh tế khu công nghiệp, khu công nghệ cao"
                      )
                    }}</span>
                  </v-sheet>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <span>3. Phương thức chuyển dữ liệu hóa đơn điện tử:</span>
              </v-row>

              <v-row no-gutters>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.TRANSFER_METHOD_CDDU"
                    ></v-checkbox>
                    <span class="">{{
                      $t("Chuyển đầy đủ nội dung từng hóa đơn")
                    }}</span>
                  </v-sheet>
                </v-col>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.TRANSFER_METHOD_CBTHOP"
                    ></v-checkbox>
                    <span class="">{{
                      $t(
                        "Chuyển theo bảng tổng hợp dữ liệu hóa đơn điện tử (điểm a, khoản 3, Điều 22 của Nghị định...)"
                      )
                    }}</span>
                  </v-sheet>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <span>4. Loại hóa đơn sử dụng:</span>
              </v-row>

              <v-row no-gutters>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_HDGTGT"
                    ></v-checkbox>
                    <span class="">{{ $t("Hóa đơn giá trị gia tăng") }}</span>
                  </v-sheet>
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_HDBHANG"
                    ></v-checkbox>
                    <span class="">{{ $t("Hóa đơn bán hàng") }}</span>
                  </v-sheet>
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_HDBTSCONG"
                    ></v-checkbox>
                    <span class="">{{ $t("Hóa đơn bán tài sản công") }}</span>
                  </v-sheet>
                </v-col>
                <v-col lg="6" sm="6" cols="12">
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_HDBHDTQGIA"
                    ></v-checkbox>
                    <span class="">{{
                      $t("Hóa đơn bán hàng dự trữ quốc gia")
                    }}</span>
                  </v-sheet>
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_HDKHAC"
                    ></v-checkbox>
                    <span class="">{{ $t("Hóa đơn khác") }}</span>
                  </v-sheet>
                  <v-sheet class="pa-2 d-flex align-center">
                    <v-checkbox
                      dense
                      hide-details
                      color="#000"
                      class="mt-0 pt-0"
                      true-value="Y"
                      false-value="N"
                      v-model="mstData.INVOICE_TYPE_CTU"
                    ></v-checkbox>
                    <span class="">{{
                      $t("Chứng từ điện tử được sử dụng và quản lý như hóa đơn")
                    }}</span>
                  </v-sheet>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <span>5. Danh sách chứng thư số:</span>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!--right table-->
        <v-row no-gutters>
          <v-col cols="12">
            <v-card>
              <v-row no-gutters>
                <v-col lg="2" cols="12" class="text-right"> </v-col>
                <v-col lg="10" cols="12" class="text-right">
                  <div class="d-flex justify-end">
                    <!-- Add -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="add_new"
                      :btn_text="$t('btn_add')"
                      @onclick="onAddRight()"
                    />

                    <!-- Save -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="save"
                      :btn_text="$t('save')"
                      @onclick="onSaveRight()"
                    />

                    <!-- Delete -->
                    <BaseButton
                      btn_type="icon"
                      icon_type="delete"
                      :btn_text="$t('delete')"
                      @onclick="onDeleteRight()"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <BaseGridView
                  ref="grdDetails"
                  :header="grdDetails"
                  sel_procedure="AC_SEL_6095240_GetDetail"
                  upd_procedure="AC_UPD_6095240_Update_Digital_Certificate"
                  :multiselect="true"
                  :headertype="1"
                  :filter_paras="[this.mstData.PK]"
                  :max_height="limitHeightGridDetails"
                  :height="limitHeightGridDetails"
                  :update_paras="[
                    'rowstatus',
                    'PK',
                    'TEI_EINVOICE_ISSUSE_CQT_PK',
                    'CA_NAME',
                    'DN_NAME',
                    'DN_MST',
                    'SERIAL_NUMBER',
                    'NOTAFTER',
                    'NOTBEFORE',
                    'TRADE_CODE',
                    'STATUS',
                    'TEI_COMPANY_PK',
                    'MOD_BY',
                  ]"
                />
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <dynamic-dialog
      ref="refDynamicDialog"
      :companyPK="this.lstCompany"
      :header="dynamicHeader"
      :codeLabel="codeLabel"
      :nameLabel="nameLabel"
      :dialogTitle="dialogTitle"
      :procedure="procedure"
      :moreParas="moreParas"
      :autoSearch="autoSearch"
      :multiSelectMode="multiSelectMode"
      @returnData="callBackDynamicDialog"
    ></dynamic-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  layout: "default",
  middleware: "user",

  components: {
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
  },
  data: () => ({
    myIcon: "mdi-arrow-down-bold-box-outline",
    leftCols: 3,
    showLeft: true,
    formIsValid: undefined,

    lst_Administration_Tax_Agency: [
      { NAME: "--- Please Chose ---", VAL: "00" },
      { NAME: "Cục Thuế Thành Phố Hà Nội", VAL: "10100" },
      { NAME: "Cục Thuế TP Hồ Chí Minh", VAL: "70100" },
      { NAME: "Cục Thuế Tỉnh Bình Dương (Văn phòng Cục)", VAL: "71100" },
      { NAME: "Cục Thuế Tỉnh Bắc Ninh", VAL: "22300" },
    ],
    lst_Num_Pattern: [
      { NAME: "--- Please Chose ---", VAL: "00" },
      { NAME: "01/ĐKTĐ-HĐĐT", VAL: "01/ĐKTĐ-HĐĐT" },
    ],
    lst_Declaration_Name: [
      { NAME: "--- Please Chose ---", VAL: "00" },
      {
        NAME: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
        VAL: "1",
      },
    ],
    lst_Registration_Form: [
      { NAME: "--- Please Chose ---", VAL: "00" },
      { NAME: "Đăng ký mới", VAL: "1" },
      { NAME: "Thay đổi thông tin", VAL: "2" },
    ],
    mstData: null,
    mstPara: [],
    Administration_Tax_Agency: { NAME: "--- Please Chose ---", VAL: "00" },
    Num_Pattern: { NAME: "--- Please Chose ---", VAL: "00" },
    Declaration_Name: { NAME: "--- Please Chose ---", VAL: "00" },
    Registration_Form: { NAME: "--- Please Chose ---", VAL: "00" },
    lstCompany: 0,
    lstCompanyMaster: [],

    //dynamicDialog
    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    moreParas: null,
    autoSearch: false,
    multiSelectMode: false,
  }),

  async created() {
    // this.getSelectInfoList();
    this.getCompanyInfo();
    this.initMasterData();
    this.initPara();
  },
  mounted() {},
  watch: {
    Administration_Tax_Agency: function () {
      this.mstData.TAX_OFFICE_CODE = this.Administration_Tax_Agency.VAL;
      this.mstData.TAX_OFFICE_NAME = this.Administration_Tax_Agency.NAME;
    },
    Num_Pattern: function () {
      this.mstData.FORM_NO = this.Num_Pattern.VAL;
      // this.mstData.FORM_NO = this.Num_Pattern.NAME;
    },
    Declaration_Name: function () {
      this.mstData.DECLARE_CD = this.Declaration_Name.VAL;
      this.mstData.DECLARE_NM = this.Declaration_Name.NAME;
    },
    Registration_Form: function () {
      this.mstData.DECLARE_METHOD = this.Registration_Form.VAL;
      //this.mstData.Registration_Form_NAME = this.Registration_Form.NAME;
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },

    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 800;
      }
    }, // this.windowHeight },
    scroll_height() {
      return this.windowHeight / 2 - 60;
    },
    limitHeightGridDetails() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 360;
      }
    },

    grdDetails() {
      const self = this;
      return [
        {
          field: "NO",
          width: 50,
          title: "no",
          alignment: "center",
        },

        {
          field: "CA_NAME",
          width: 260,
          title: "ca_name",
          alignment: "center",
        },
        {
          field: "DN_NAME",
          width: 350,
          title: "dn_name",
          alignment: "center",
        },
        {
          field: "DN_MST",
          width: 100,
          title: "dn_mst",
          alignment: "center",
        },
        {
          field: "SERIAL_NUMBER",
          width: 300,
          title: "serial_number",
          alignment: "center",
        },
        {
          field: "NOTAFTER",
          width: 200,
          title: "notafter",
          alignment: "center",
        },
        {
          field: "NOTBEFORE",
          width: 200,
          title: "notbefore",
          alignment: "center",
        },
        {
          field: "XML",
          width: 120,
          title: "XML",
          alignment: "center",
        },
        {
          field: "TRADE_CODE",
          width: 200,
          title: "trade_code",
          alignment: "center",
        },
      ];
    },

    grdLeftHeader() {
      const self = this;
      return [
        {
          field: "NO",
          width: 50,
          title: "no",
          alignment: "center",
        },
        {
          field: "DECLARE_NM",
          width: 350,
          title: "declare_nm",
          alignment: "center",
        },
        {
          field: "FORM_NO",
          width: 350,
          title: "form_no",
          alignment: "center",
        },
        {
          field: "STATUS",
          width: 150,
          title: "status",
          alignment: "center",
        },
        {
          field: "TRADE_CODE",
          width: 150,
          title: "trade_code",
          alignment: "center",
        },
      ];
    },
  },

  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    initPara() {
      this.mstPara = [
        "_rowstatus",
        "PK",
        "TEI_COMPANY_PK",
        "COMPANY_NM",
        "TAX_OFFICE_CODE",
        "TAX_OFFICE_NAME",
        "FORM_NO",
        "TAX_CODE",
        "ADDR",
        "DECLARE_CD",
        "DECLARE_NM",
        "CONTACT_PERSON",
        "TAX_ADDR",
        "DECLARE_METHOD",
        "TEL",
        "TAX_EMAIL",
        "DECLARE_DATE",
        "INVOICE_METHOD_HAVE_CODE",
        "INVOICE_METHOD_NO_CODE",
        "SEND_METHOD_NNTDBKKHAN",
        "SEND_METHOD_NNTKTDNUBND",
        "TRANSFER_METHOD_CDDU",
        "TRANSFER_METHOD_CBTHOP",
        "INVOICE_TYPE_HDGTGT",
        "INVOICE_TYPE_HDBHANG",
        "INVOICE_TYPE_HDBTSCONG",
        "INVOICE_TYPE_HDBHDTQGIA",
        "INVOICE_TYPE_HDKHAC",
        "INVOICE_TYPE_CTU",
        "TAX_MESS",
      ];
    },
    initMasterData() {
      this.mstData = {
        _rowstatus: "", // p_action
        // p_tei_einvoice_issuse_cqt_pk
        PK: "",
        TEI_COMPANY_PK: "", // p_tei_Company_pk
        COMPANY_NM: "", // p_Ten_nguoi_nothue
        TAX_OFFICE_CODE: this.Administration_Tax_Agency.VAL, // p_Ma_Co_quan_thue_quan_ly
        TAX_OFFICE_NAME: this.Administration_Tax_Agency.NAME, // p_Ten_Co_quan_thue_quan_ly
        FORM_NO: this.Num_Pattern.VAL, // p_Mau_so
        TAX_CODE: "", // p_Ma_so_thue
        ADDR: "", // p_Dia_danh
        DECLARE_CD: this.Declaration_Name.VAL, // p_Ten_to_khai_cd
        DECLARE_NM: this.Declaration_Name.NAME, // p_Ten_to_khai_nm
        CONTACT_PERSON: "", // p_Nguoi_lien_he
        TAX_ADDR: "", // p_Dia_chi_lien_he
        DECLARE_METHOD: this.Registration_Form.VAL, // p_Hinh_thuc_dang_ky
        TEL: "", // p_Dien_thoai_lien_he
        TAX_EMAIL: "", // p_Email
        DECLARE_DATE: "", // p_Ngay_dang_ky
        INVOICE_METHOD_HAVE_CODE: "1", // p_CoMa
        INVOICE_METHOD_NO_CODE: "0", // p_KCoMa
        SEND_METHOD_NNTDBKKHAN: "N", // p_NNTDBKKhan
        SEND_METHOD_NNTKTDNUBND: "N", // p_NNTKTDNUBND
        TRANSFER_METHOD_CDDU: "N", // p_CDDu
        TRANSFER_METHOD_CBTHOP: "N", // p_CBTHop
        INVOICE_TYPE_HDGTGT: "N", // p_HDGTGT
        INVOICE_TYPE_HDBHANG: "N", // p_HDBHang
        INVOICE_TYPE_HDBTSCONG: "N", // p_HDBTSCong
        INVOICE_TYPE_HDBHDTQGIA: "N", // p_HDBHDTQGia
        INVOICE_TYPE_HDKHAC: "N", // p_HDKhac
        INVOICE_TYPE_CTU: "N", // p_CTu
        TAX_MESS: "", // p_MessCQT
      };
    },
    async cellClick(data) {
      let selectedData = data.data;
      this.mstData.PK = selectedData.PK;
      this.$refs.grdDetails.loadData();

      const IssueDetail = await this._callProcedure(
        "AC_SEL_6095240_RefetchData",
        [this.mstData.PK]
      );

      this.Administration_Tax_Agency = {
        NAME: IssueDetail[0].TAX_OFFICE_NAME,
        VAL: IssueDetail[0].TAX_OFFICE_CODE,
      };
      this.Num_Pattern = {
        NAME: IssueDetail[0].FORM_NO,
        VAL: IssueDetail[0].FORM_NO,
      };

      this.Declaration_Name = {
        VAL: IssueDetail[0].DECLARE_CD,
      };
      this.Registration_Form = {
        VAL: IssueDetail[0].DECLARE_METHOD,
      };

      this.mstData.TAX_OFFICE_CODE = IssueDetail[0].TAX_OFFICE_CODE;
      this.mstData.TAX_OFFICE_NAME = IssueDetail[0].TAX_OFFICE_NAME;
      this.mstData.FORM_NO = IssueDetail[0].FORM_NO;
      this.mstData.DECLARE_CD = IssueDetail[0].DECLARE_CD;
      this.mstData.DECLARE_NM = IssueDetail[0].DECLARE_NM;
      this.mstData.DECLARE_METHOD = IssueDetail[0].DECLARE_METHOD;
      this.mstData.TAX_CODE = IssueDetail[0].TAX_CODE;
      this.mstData.ADDR = IssueDetail[0].ADDR;
      this.mstData.CONTACT_PERSON = IssueDetail[0].CONTACT_PERSON;
      this.mstData.TAX_ADDR = IssueDetail[0].TAX_ADDR;
      this.mstData.TEL = IssueDetail[0].TEL;
      this.mstData.TAX_EMAIL = IssueDetail[0].TAX_EMAIL;
      this.mstData.DECLARE_DATE = IssueDetail[0].DECLARE_DATE;
      this.mstData.INVOICE_METHOD_HAVE_CODE =
        IssueDetail[0].INVOICE_METHOD_HAVE_CODE;
      this.mstData.INVOICE_METHOD_NO_CODE =
        IssueDetail[0].INVOICE_METHOD_NO_CODE;
      this.mstData.SEND_METHOD_NNTDBKKHAN =
        IssueDetail[0].SEND_METHOD_NNTDBKKHAN;
      this.mstData.SEND_METHOD_NNTKTDNUBND =
        IssueDetail[0].SEND_METHOD_NNTKTDNUBND;
      this.mstData.TRANSFER_METHOD_CDDU = IssueDetail[0].TRANSFER_METHOD_CDDU;
      this.mstData.TRANSFER_METHOD_CBTHOP =
        IssueDetail[0].TRANSFER_METHOD_CBTHOP;
      this.mstData.INVOICE_TYPE_HDGTGT = IssueDetail[0].INVOICE_TYPE_HDGTGT;
      this.mstData.INVOICE_TYPE_HDBHANG = IssueDetail[0].INVOICE_TYPE_HDBHANG;
      this.mstData.INVOICE_TYPE_HDBTSCONG =
        IssueDetail[0].INVOICE_TYPE_HDBTSCONG;
      this.mstData.INVOICE_TYPE_HDBHDTQGIA =
        IssueDetail[0].INVOICE_TYPE_HDBHDTQGIA;
      this.mstData.INVOICE_TYPE_HDKHAC = IssueDetail[0].INVOICE_TYPE_HDKHAC;
      this.mstData.INVOICE_TYPE_CTU = IssueDetail[0].INVOICE_TYPE_CTU;
      this.mstData.TAX_MESS = IssueDetail[0].TAX_MESS;
    },
    onEditDetail(a) {
      switch (a) {
        case "1":
          this.mstData.INVOICE_METHOD_NO_CODE = "0";
          break;
        case "0":
          this.mstData.INVOICE_METHOD_NO_CODE = "1";
          break;
      }
    },
    async onSearchMaster() {
      this.$refs.grdLeft.loadData();
    },
    async getCompanyInfo() {
      const companyInfo = await this._callProcedure(
        "AC_SEL_6095240_CompanyInfo",
        [this.user.PK]
      );
      if (companyInfo.length > 0) {
        this.lstCompanyMaster = companyInfo;
        this.lstCompany = companyInfo[0].VAL;
        this.mstData.COMPANY_NM = companyInfo[0].NAME;
        this.mstData.TEI_COMPANY_PK = companyInfo[0].VAL;
      }
    },
    async saveMaster() {
      let validate = this.checkData();
      if (validate) {
        if (
          this.mstData._rowstatus !== "i" &&
          this.mstData._rowstatus !== "d"
        ) {
          this.mstData._rowstatus = "u";
        }

        const dso = {
          type: "control",
          selpro: "AC_SEL_6095240_RefetchData",
          updpro: "AC_UPD_6095240_Einvoice_Issue_CQT",
          para: [this.mstData.PK],
          elname: this.mstPara,
          data: this.mstData,
        };
        let row = await this._dsoCall(dso, "update", true);

        if (row) {
          this.mstData = {
            ...row,
          };
        }
      }
    },

    addNewMaster() {
      ///hàm này phải clean hết các biến + set sattus về "i"
     if (this.mstData._rowstatus == "i") {
        alert("now you can register new");
      } else {
        this.clearInput();
      }
    },
    deleteMaster() {},
    clearInput() {
      const time = new Date();
      this.mstData._rowstatus = "i";
      this.mstData.PK = "";
      this.Administration_Tax_Agency = {
        NAME: "--- Please Chose ---",
        VAL: "00",
      };
      this.Num_Pattern = { NAME: "--- Please Chose ---", VAL: "00" };
      this.Declaration_Name = {
        NAME: "--- Please Chose ---",
        VAL: "00",
      };
      this.Registration_Form = {
        NAME: "--- Please Chose ---",
        VAL: "00",
      };
      this.mstData.TAX_CODE = "";
      this.mstData.ADDR = "";
      this.mstData.CONTACT_PERSON = "";
      this.mstData.TAX_ADDR = "";
      this.mstData.TEL = "";
      this.mstData.TAX_EMAIL = "";
      this.mstData.DECLARE_DATE = moment(String(time)).format("YYYYMMDD");
      this.mstData.INVOICE_METHOD_HAVE_CODE = "1";
      this.mstData.INVOICE_METHOD_NO_CODE = "0";
      this.mstData.SEND_METHOD_NNTDBKKHAN = "N";
      this.mstData.SEND_METHOD_NNTKTDNUBND = "N";
      this.mstData.TRANSFER_METHOD_CDDU = "N";
      this.mstData.TRANSFER_METHOD_CBTHOP = "N";
      this.mstData.INVOICE_TYPE_HDGTGT = "N";
      this.mstData.INVOICE_TYPE_HDBHANG = "N";
      this.mstData.INVOICE_TYPE_HDBTSCONG = "N";
      this.mstData.INVOICE_TYPE_HDBHDTQGIA = "N";
      this.mstData.INVOICE_TYPE_HDKHAC = "N";
      this.mstData.INVOICE_TYPE_CTU = "N";
      this.mstData.TAX_MESS = "";
    },
    checkData() {
      if (this.mstData.TAX_OFFICE_CODE == "00") {
        alert("Vui lòng nhập Cơ Quan Thuế.");
        return false;
      }
      if (this.mstData.FORM_NO == "00") {
        alert("Vui lòng nhập Mẫu số.");
        return false;
      }

      if (this.mstData.TAX_CODE == "") {
        alert("Vui lòng nhập Mã số thuế.");
        return false;
      }

      if (this.mstData.ADDR == "") {
        alert("Vui lòng nhập Địa danh.");
        return false;
      }

      if (this.mstData.DECLARE_CD == "00") {
        alert("Vui lòng nhập Tên tờ khai.");
        return false;
      }

      if (this.mstData.CONTACT_PERSON == "") {
        alert("Vui lòng nhập Người liên hệ.");
        return false;
      }

      if (this.mstData.TAX_ADDR == "") {
        alert("Vui lòng nhập Địa chị liên hệ.");
        return false;
      }

      if (this.mstData.DECLARE_METHOD == "00") {
        alert("Vui lòng nhập Hình thức đăng ký.");
        return false;
      }

      if (this.mstData.TEL == "") {
        alert("Vui lòng nhập Điện thoại liên hệ");
        return false;
      }

      if (this.mstData.TAX_EMAIL == "") {
        alert("Vui lòng nhập Mail");
        return false;
      }

      if (
        this.mstData.TRANSFER_METHOD_CDDU == "N" &&
        this.mstData.TRANSFER_METHOD_CBTHOP == "N"
      ) {
        alert("Vui lòng nhập phương thức chuyển dữ liệu hóa đơn");
        return false;
      }

      if (
        this.mstData.INVOICE_TYPE_HDGTGT == "N" &&
        this.mstData.INVOICE_TYPE_HDBHANG == "N" &&
        this.mstData.INVOICE_TYPE_HDBTSCONG == "N" &&
        this.mstData.INVOICE_TYPE_HDBHDTQGIA == "N" &&
        this.mstData.INVOICE_TYPE_HDKHAC == "N" &&
        this.mstData.INVOICE_TYPE_CTU == "N"
      ) {
        alert("Vui lòng nhập loại hóa đơn sử dụng");
        return false;
      }

      return true;
    },
    onAddRight() {
      this.dynamicHeader = this.BuildDynamicHeader();
      this.dialogTitle = this.$t("control_item");
      this.codeLabel = this.$t("serial_number");
      this.nameLabel = this.$t("ca_name");
      this.procedure = "AC_SEL_6095240_Get_CTRLITEM";
      this.moreParas = null;
      this.autoSearch = true;
      this.multiSelectMode = false;
      this.$refs.refDynamicDialog.dialogIsShow = true;
    },
    BuildDynamicHeader() {
      let header = [];

      header = [
        {
          dataField: "NO",
          caption: this.$t("no"),
        },
        {
          dataField: "TEI_COMPANY_PK",
          caption: this.$t("tco_company_pk"),
        },
        {
          dataField: "SERIAL_NUMBER",
          caption: this.$t("serial_number"),
        },
        {
          dataField: "ISSUER",
          caption: this.$t("issuer"),
        },
        {
          dataField: "ISSUEBY",
          caption: this.$t("issue_by"),
        },

        {
          dataField: "ISSUETO",
          caption: this.$t("issue_to"),
        },
        {
          dataField: "DN_NAME",
          caption: this.$t("dn_name"),
        },
        {
          dataField: "DN_MST",
          caption: this.$t("dn_mst"),
        },
        {
          dataField: "NOTAFTER",
          caption: this.$t("not_after"),
        },
        {
          dataField: "NOTBEFORE",
          caption: this.$t("not_before"),
        },
        {
          dataField: "PHONE_NO",
          caption: this.$t("phone_no"),
        },
        {
          dataField: "FAX_NO",
          caption: this.$t("fax_no"),
        },
      ];
      return header;
    },
    toggleLeft() {
      this.showLeft = this.showLeft ? false : true;
      this.leftCols = !this.showLeft ? 0 : 3;
      this.btnIconType = !this.showLeft ? "skip_next" : "skip_prev";
    },
    callBackDynamicDialog(item) {
      this.$refs.grdDetails.addRowStruct({
        _rowstatus: "u",
        NO: item.NO,
        PK: "",
        TEI_EINVOICE_ISSUSE_CQT_PK: this.mstData.PK,
        CA_NAME: item.CA_NAME,
        DN_NAME: item.DN_NAME,
        DN_MST: item.DN_MST,
        SERIAL_NUMBER: item.SERIAL_NUMBER,
        NOTAFTER: item.NOTAFTER,
        NOTBEFORE: item.NOTBEFORE,
        TRADE_CODE: item.TRADE_CODE,
        STATUS: item.STATUS,
        TEI_COMPANY_PK: item.TEI_COMPANY_PK,
        MOD_BY: "",
      });
    },
    onSaveRight() {
      this.$refs.grdDetails.saveData();
      setTimeout(() => {
        this.$refs.grdDetails.loadData();
      }, 200);
      // this.$nextTick(() => {
      //            this.$refs.grdDetails.loadData();
      //       });
    },
    onDeleteRight() {
      this.$refs.grdDetails.deleteRows();
      setTimeout(() => {
        this.$refs.grdDetails.loadData();
      }, 200);
    },
  },
};
</script>
<style>
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 10px;
}

.v-select__selections {
  min-height: 10px;
}
#my-list {
  max-height: 720px;
  overflow-y: scroll;
}
</style>
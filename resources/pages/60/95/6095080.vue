<template>
  <v-container fluid v-resize="onResize">
    <v-row dense>
      <v-col md="3" :class="isShowLeft ? null : 'd-none'" class="pt-3">
        <v-card>
          <v-row dense>
            <v-col md="12" class="pl-5 pr-5 pt-2">
              <BaseSelect outlined item-value="VAL" item-text="NAME" :label="$t('company_name')" :lstData="dataSearchList.companyList" v-model="modelSearch.COMPANY_PK" />
            </v-col>
            <v-col md="6" class="pl-5 pr-5">
              <BaseDatePicker outlined :pretoday="7" :label="$t('from_date')" v-model="modelSearch.FROM_DATE" />
            </v-col>
            <v-col md="6" class="pl-5 pr-5">
              <BaseDatePicker outlined today :label="$t('to_date')" v-model="modelSearch.TO_DATE" />
            </v-col>
            <v-col md="6" class="pl-5 pr-5">
              <BaseSelect outlined :label="$t('status')" :lstData="dataSearchList.statusList" v-model="modelSearch.STATUS" item-value="CODE" item-text="NAME" />
            </v-col>
            <v-col md="6" class="d-flex justify-end pr-4">
              <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="false" @onclick="onClick('search')" />
            </v-col>
            <v-col md="12">
              <BaseGridView
                ref="grdSearch"
                :header="headerList.grdSearch"
                sel_procedure="EI_SEL_6095080_04"
                selectionmode="singlerow"
                :multiselect="true"
                :height="limitHeight"
                :headertype="1"
                :filter_paras="[this.modelSearch.COMPANY_PK, this.modelSearch.FROM_DATE, this.modelSearch.TO_DATE, this.modelSearch.STATUS]"
                @cellClick="onClick('grdSearchClick')"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col :md="isShowLeft ? 9 : 12">
        <v-row class="pt-1" dense>
          <v-col md="12">
            <v-card>
              <v-row dense>
                <v-col md="1" class="d-flex pl-2">
                  <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'" :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')" @onclick="isShowLeft = !isShowLeft" />
                </v-col>
                <v-col md="4">
                  <b style="color: red">{{ modelMaster.CQT_NOTIFICATION }}</b>
                </v-col>
                <v-col md="7">
                  <GwFlexBox justify="end">
                    <BaseButton icon_type="xml" :btn_text="$t('view_xml')" @onclick="onClick('viewXML')" />
                    
                    <BaseButton icon_type="xml" :btn_text="$t('view_dec')" @onclick="onClick('viewDEC')" />

                    <BaseButton btn_type="text" :btn_text="$t('checking_declaration')" @onclick="onClick('checkingDeclaration')" />
                    <BaseButton btn_type="text" :btn_text="$t('general_declaration')" @onclick="onClick('generalDeclaration')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Add -->
                    <BaseButton btn_type="icon" icon_type="add_new" :btn_text="$t('btn_add')" @onclick="onClick('newMaster')"  />
                    <!-- Save -->
                    <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClick('saveMaster')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                    <!-- Delete -->
                    <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClick('deleteMaster')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                  </GwFlexBox>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col md="2" class="pl-5">
                  <BaseSelect outlined :label="$t('version')" :lstData="dataMasterList.versionList" v-model="modelMaster.PBAN" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="10"></v-col>
                <!--  -->
                <v-col md="4" class="pl-5 pt-1">
                  <BaseSelect outlined item-value="VAL" item-text="NAME" :label="$t('taxpayer_name')" :lstData="dataMasterList.companyList" v-model="modelMaster.TEI_COMPANY_PK" readonly />
                </v-col>
                <v-col md="4" class="pl-5 pt-1">
                  <BaseSelect outlined :label="$t('tax_office')" v-model="modelMaster.MCQTQLY" :lstData="dataMasterList.taxOfficeList" item-text="NAME" item-value="CODE" />
                </v-col>
                <v-col md="4" class="pl-5 pt-1 pr-5">
                  <BaseSelect outlined :label="$t('form_no')" v-model="modelMaster.MSO" :lstData="dataMasterList.fromNoList" item-text="NAME" item-value="CODE" />
                </v-col>
                <!--  -->
                <v-col md="4" class="pl-5 pt-1">
                  <BaseInput outlined :label="$t('tax_code')" v-model="modelMaster.MST" />
                </v-col>
                <v-col md="4" class="pl-5 pt-1">
                  <BaseInput outlined :label="$t('address')" v-model="modelMaster.DDANH"> </BaseInput>
                </v-col>
                <v-col md="4" class="pl-5 pt-1 pr-5">
                  <BaseSelect outlined :label="$t('declaration_name')" v-model="modelMaster.CODE" :lstData="dataMasterList.declarationNameList" item-text="NAME" item-value="CODE" />
                </v-col>
                <!--  -->
                <v-col md="4" class="pl-5 pt-1">
                  <BaseInput outlined :label="$t('contact_person')" v-model="modelMaster.NLHE" />
                </v-col>
                <v-col md="4" class="pl-5 pt-1">
                  <BaseInput outlined :label="$t('contract_address')" v-model="modelMaster.DCLHE" />
                </v-col>
                <v-col md="4" class="pl-5 pt-1 pr-5">
                  <BaseSelect outlined :label="$t('registration_form')" v-model="modelMaster.HTHUC" :lstData="dataMasterList.registrationFormList" item-text="NAME" item-value="CODE" />
                </v-col>
                <!--  -->
                <v-col md="4" class="pl-5 pt-1 pb-2">
                  <BaseInput outlined :label="$t('phone_number')" v-model="modelMaster.DTLHE" />
                </v-col>
                <v-col md="4" class="pl-5 pt-1 pb-2">
                  <BaseInput outlined :label="$t('email')" v-model="modelMaster.DCTDTU" />
                </v-col>
                <v-col md="2" class="pl-5 pt-1 pb-2">
                  <BaseDatePicker outlined today :label="$t('register_day')" start v-model="modelMaster.NLAP" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col md="12">
                  <v-card v-scroll.self="onScroll" class="overflow-y-auto" :max-height="scroll_height">
                    <v-row dense class="pl-5">
                      <span>1. Hình thức hóa đơn:</span>
                    </v-row>
                    <v-row dense>
                      <v-col md="1"></v-col>
                      <v-col md="11">
                        <v-row dense>
                          <v-col md="4">
                            <v-sheet class="d-flex align-center">
                              <BaseCheckbox v-model="modelMaster.CMA" true-value="1" false-value="0" :label="$t('Có mã của Cơ Quan Thuế')" color="#000" />
                            </v-sheet>
                          </v-col>
                          <v-col md="4">
                            <v-sheet class="d-flex align-center">
                              <BaseCheckbox v-model="modelMaster.KCMA" true-value="1" false-value="0" :label="$t('Không có mã của Cơ Quan Thuế')" />
                            </v-sheet>
                          </v-col>
                          <v-col md="4">
                            <v-sheet class="d-flex align-center">
                              <BaseCheckbox
                                v-model="modelMaster.CMTMTTIEN"
                                true-value="1"
                                false-value="0"
                                :label="$t('Hóa đơn có máy khỏi tạo từ máy tính tiền')"
                                color="#000"
                                v-if="modelMaster.PBAN == '2.0.1'"
                              />
                            </v-sheet>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <!--  -->
                    <v-row dense class="pl-5 pt-2">
                      <span>2. Hình thức gửi dữ liệu hóa đơn điện tử:</span>
                    </v-row>
                    <v-row dense>
                      <v-col md="1"></v-col>
                      <v-col md="6">
                        <v-sheet class="d-flex align-center pr-5">
                          <BaseCheckbox
                            v-model="modelMaster.NNTDBKKHAN"
                            true-value="1"
                            false-value="0"
                            :label="
                              $t('Doanh nghiệp nhỏ và vừa, hợp tác xã, hộ, cá nhân kinh doanh tại địa bàn có điều kiện kinh tế xã hội khó khăn, địa bàn có điều kiện kinh tế xã hội đặc biệt khó khăn')
                            "
                          />
                        </v-sheet>
                      </v-col>
                      <v-col md="5">
                        <v-sheet class="d-flex align-center pr-5">
                          <BaseCheckbox
                            v-model="modelMaster.NNTKTDNUBND"
                            color="#000000"
                            true-value="1"
                            false-value="0"
                            :label="
                              $t(
                                'Doanh nghiệp nhỏ và vừa khác theo đề nghị của Ủy ban nhân dân tỉnh, thành phố trực thuộc trung ương gửi Bộ tài chính trừ doanh nghiệp hoạt động tại các khu kinh tế khu công nghiệp, khu công nghệ cao'
                              )
                            "
                          />
                        </v-sheet>
                      </v-col>
                      <v-col md="1" v-if="false"></v-col>
                      <v-col md="6" v-if="false">
                        <v-sheet class="d-flex align-center pr-5">
                          <BaseCheckbox
                            v-model="modelMaster.CDLTTDCQT"
                            true-value="1"
                            false-value="0"
                            :label="$t('Chuyển dữ liệu trực tiếp đến CQT (Chuyển dữ liệu hóa đơn điện tử trực tiếp đến cơ quan thuế (điểm b1, khoản 3, Điều 22 của Nghị định 123/2020/NĐ-CP))')"
                          />
                        </v-sheet>
                      </v-col>
                      <v-col md="5" v-if="false">
                        <v-sheet class="d-flex align-center pr-5">
                          <BaseCheckbox
                            v-model="modelMaster.CDLQTVAN"
                            color="#000000"
                            true-value="1"
                            false-value="0"
                            :label="$t('Chuyển dữ liệu qua TCTN (Thông qua tổ chức cung cấp dịch vụ hóa đơn điện tử (điểm b2, khoản 3, Điều 22 của Nghị định 123/2020/NĐ-CP))')"
                          />
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <!--  -->
                    <v-row dense class="pl-5">
                      <span>3. Phương thức chuyển dữ liệu hóa đơn điện tử:</span>
                    </v-row>
                    <v-row dense>
                      <v-col md="1"></v-col>
                      <v-col md="6">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.CDDU" true-value="1" false-value="0" :label="$t('Chuyển đầy đủ nội dung từng hóa đơn')" />
                        </v-sheet>
                      </v-col>
                      <v-col md="5">
                        <v-sheet class="d-flex align-center pr-5">
                          <BaseCheckbox
                            v-model="modelMaster.CBTHOP"
                            true-value="1"
                            false-value="0"
                            :label="$t('Chuyển theo bảng tổng hợp dữ liệu hóa đơn điện tử (điểm a, khoản 3, Điều 22 của Nghị định...')"
                          />
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <!--  -->
                    <v-row dense class="pl-5">
                      <span>4. Loại hóa đơn sử dụng:</span>
                    </v-row>
                    <v-row dense>
                      <v-col md="1"></v-col>
                      <v-col md="6">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.HDGTGT" true-value="1" false-value="0" :label="$t('Hóa đơn giá trị gia tăng')" />
                        </v-sheet>
                      </v-col>
                      <v-col md="5">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.HDBHANG" true-value="1" false-value="0" :label="$t('Hóa đơn bán hàng')" />
                        </v-sheet>
                      </v-col>

                      <v-col md="1"></v-col>
                      <v-col md="6">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.HDBTSCONG" true-value="1" false-value="0" :label="$t('Hóa đơn bán tài sản công')" />
                        </v-sheet>
                      </v-col>
                      <v-col md="5">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.HDBHDTQGIA" true-value="1" false-value="0" :label="$t('Hóa đơn bán hàng dự trữ quốc gia')" />
                        </v-sheet>
                      </v-col>

                      <v-col md="1"></v-col>
                      <v-col md="6">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.HDKHAC" true-value="1" false-value="0" :label="$t('Hóa đơn khác')" />
                        </v-sheet>
                      </v-col>
                      <v-col md="5">
                        <v-sheet class="d-flex align-center">
                          <BaseCheckbox v-model="modelMaster.CTU" true-value="1" false-value="0" :label="$t('Chứng từ điện tử được sử dụng và quản lý như hóa đơn')" />
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <v-row dense class="pl-5 pb-3">
                      <span>5. Danh sách chứng thư số:</span>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-card>
          <v-row dense>
            <v-col md="12">
              <GwFlexBox justify="end">
                <BaseButton icon_type="import" :btn_text="$t('import_token')" @onclick="onGetDetailDeclaration()" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                <!-- Add -->
                <BaseButton btn_type="icon" icon_type="add_new" :btn_text="$t('btn_add')" @onclick="onClick('newDetail')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                <!-- Save -->
                <BaseButton btn_type="icon" icon_type="save" :btn_text="$t('save')" @onclick="onClick('saveDetail')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
                <!-- Delete -->
                <BaseButton btn_type="icon" icon_type="delete" :btn_text="$t('delete')" @onclick="onClick('deleteDetail')" :disabled="modelSearch.STATUS == 0 || modelSearch.STATUS == 1" />
              </GwFlexBox>
            </v-col>
            <v-col md="12">
              <BaseGridView
                ref="grdDetail"
                :header="headerList.grdDetail"
                sel_procedure="EI_SEL_6095080_s_05_NC"
                upd_procedure="EI_UPD_6095080_u_06"
                :headertype="1"
                :filter_paras="[this.modelMaster.PK]"
                :height="limitHeightGridDetails"
                :update_paras="['PK', 'TEI_DECLARATION_M_PK', 'TTCHUC', 'MST', 'SERI', 'DNGAY', 'TNGAY', 'HTHUC']"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <view-einvoice-pdf-dialog
      ref="ViewEInvoicePDFDialog"
      :src_pdfUrl="pdfUrl"
      @minimizeDialogPDF="manualIsMinimizedPDF = true"
      @closeManualDialog="manualIsMinimizedPDF = false"
    ></view-einvoice-pdf-dialog>
    <view-einvoice-xml-dialog
      ref="ViewEInvoiceXMLDialog"
      :src_xmlUrl="xmlUrl"
      :xmlFileNm="xmlFileNm"
      dwnFile
      @minimizeDialog="manualIsMinimized = true"
      @closeManualDialog="manualIsMinimized = false"
    ></view-einvoice-xml-dialog>
    <div class="squareBox" v-if="false">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon small v-on="on" @click="openManualDialog">
            <v-icon :color="currentTheme">mdi-help-box</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("show_manual") }}</span>
      </v-tooltip>
    </div>
    <v-scale-transition origin="bottom center">
      <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimized" @click="restoreManualDialog">
        <v-icon>mdi-window-restore</v-icon>
      </v-btn>
    </v-scale-transition>

    <v-scale-transition origin="bottom center">
      <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimizedPDF" @click="restoreManualDialogPDF">
        <v-icon>mdi-window-restore</v-icon>
      </v-btn>
    </v-scale-transition>
    <dynamic-dialog
      ref="refDynamicDialog"
      :companyPK="this.modelSearch.COMPANY_PK"
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
import ViewEInvoicePDFDialog from "@/components/dialog/ViewEInvoicePDFDialog.vue";
import ViewEInvoiceXMLDialog from "@/components/dialog/ViewEInvoiceXMLDialog.vue";
export default {
  layout: "default",
  middleware: "user",
  components: {
    "view-einvoice-xml-dialog": ViewEInvoiceXMLDialog,
    "view-einvoice-pdf-dialog": ViewEInvoicePDFDialog,
    DynamicDialog: () => import("@/components/dialog/DynamicDialog"),
  },

  data: () => ({
    xmlFileNm: "",
    xmlUrl: "",
    pdfUrl: "",
    isShowLeft: true,
    scrollInvoked: 0,
    headerList: {
      grdSearch: [],
      grdDetail: [],
    },
    dataSearchList: {
      statusList: [],
      companyList: [],
    },
    modelSearch: {
      COMPANY_PK: null,
      FROM_DATE: null,
      TO_DATE: null,
      STATUS: null,
    },
    dataMasterList: {
      versionList: [],
      companyList: [],
      taxOfficeList: [],
      fromNoList: [],
      declarationNameList: [],
      registrationFormList: [],
    },
    modelMaster: {
      _rowstatus: null,
      PK: null,
      TEI_COMPANY_PK: null,
      TNNT: null,
      CQTQLY: null,
      MCQTQLY: null,
      MSO: null,
      MST: null,
      DDANH: null,
      CODE: null,
      TEN: null,
      NLHE: null,
      DCLHE: null,
      HTHUC: null,
      DTLHE: null,
      DCTDTU: null,
      NLAP: null,
      CMA: null,
      KCMA: null,
      NNTDBKKHAN: null,
      NNTKTDNUBND: null,
      CDDU: null,
      CBTHOP: null,
      HDGTGT: null,
      HDBHANG: null,
      HDBTSCONG: null,
      HDBHDTQGIA: null,
      HDKHAC: null,
      CTU: null,
      CQT_NOTIFICATION: null,
      PBAN: "2.0.1",
      CMTMTTIEN: null,
      CQT_MAGD: null,
      STATUS: null,
      XML_SIGNED: null,
    },
    manualIsMinimized: false,
    manualIsMinimizedPDF: false,
    token_type_list: [],
    dynamicHeader: [],
    codeLabel: "",
    nameLabel: "",
    dialogTitle: "",
    procedure: "",
    moreParas: null,
    autoSearch: false,
    multiSelectMode: false
  }),

  mounted() {
    this.onResize();
  },

  async created() {
    await this.initDataList();
    await this.initHeaderList();
    await this.initModel();

    this.pdf_handler = require("./js/EiExcelDECHandler.js");
    if (!!this.pdf_handler) {
      Object.assign(this, this.pdf_handler.default);
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      return this.windowHeight - 290;
    },
    limitHeightGridDetails() {
      return 215;
    },

    scroll_height() {
      return this.windowHeight / 2 - 200;
    },
  },
  watch: {
    "modelMaster.CODE"(val) {
      if (val) {
        this.modelMaster.TEN = this.dataMasterList.declarationNameList.find((item) => item.CODE == val).NAME;
      }
    },

    "modelSearch.COMPANY_PK"(val) {
      if (val) {
        this.modelMaster.TEI_COMPANY_PK = this.dataMasterList.companyList.find((item) => item.VAL == val).VAL;
        this.modelMaster.MST = this.dataMasterList.companyList.find((item) => item.VAL == val).TAX_CODE;
        this.modelMaster.DCLHE = this.dataMasterList.companyList.find((item) => item.VAL == val).CONTACT_ADDR;

        this.modelMaster.NLHE = this.dataMasterList.companyList.find((item) => item.VAL == val).CONTACT_PERSON;
        this.modelMaster.DTLHE = this.dataMasterList.companyList.find((item) => item.VAL == val).TEL;
        this.modelMaster.DCTDTU = this.dataMasterList.companyList.find((item) => item.VAL == val).CONTACT_EMAIL;
        this.modelMaster.MCQTQLY = this.dataMasterList.companyList.find((item) => item.VAL == val).MCQTQLY;
      }
    },
    "modelMaster.MCQTQLY"(val) {
      if (val) {
        this.modelMaster.CQTQLY = this.dataMasterList.taxOfficeList.find((item) => item.CODE == val).NAME;
      }
    },
  },
  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    async onClick(pos) {
      switch (pos) {
        case "search":
          await this.$refs.grdSearch.loadData();
          await this.$refs.grdDetail.Clear();
          break;
        case "grdSearchClick":
          this.modelMaster.PK = await this.$refs.grdSearch.getSelectedRows()[0].PK;
          this.modelMaster.CQT_MAGD = await this.$refs.grdSearch.getSelectedRows()[0].TRADE_CODE;
          await this.dsoMaster("select");
          this.$refs.grdDetail.loadData();
          break;
        case "newMaster":
          this.initModel();
          break;
        case "deleteMaster":
          this.modelMaster._rowstatus = "d";
          this.dsoMaster("update");
          this.$refs.grdSearch.loadData();
          break;
        case "saveMaster":
          if (this.modelMaster.MCQTQLY == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_office"));
            break;
          } else if (this.modelMaster.MSO == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_from_no"));
            break;
          } else if (this.modelMaster.MST == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_code"));
            break;
          } else if (this.modelMaster.DDANH == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_address"));
            break;
          } else if (this.modelMaster.CODE == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_declaration_name"));
            break;
          } else if (this.modelMaster.NLHE == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_contact"));
            break;
          } else if (this.modelMaster.DCLHE == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_tax_address"));
            break;
          } else if (this.modelMaster.HTHUC == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_registration_form"));
            break;
          } else if (this.modelMaster.DTLHE == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_phone_number"));
            break;
          } else if (this.modelMaster.DCTDTU == "00") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_input_email"));
            break;
          } else if (this.modelMaster.PBAN == "2.0.0" && this.modelMaster.CMA == "0" && this.modelMaster.KCMA == "0") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_enter_invoice_configuration"));
            break;
          } else if (this.modelMaster.PBAN == "2.0.1" && this.modelMaster.CMA == "0" && this.modelMaster.KCMA == "0" && this.modelMaster.CMTMTTIEN == "0") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_enter_invoice_configuration"));
            break;
          } else if (this.modelMaster.CDDU == "0" && this.modelMaster.CBTHOP == "0") {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_enter_invoice_data_transfer_method"));
            break;
          } else if (
            this.modelMaster.HDGTGT == "0" &&
            this.modelMaster.HDBHANG == "0" &&
            this.modelMaster.HDBTSCONG == "0" &&
            this.modelMaster.HDBHDTQGIA == "0" &&
            this.modelMaster.HDKHAC == "0" &&
            this.modelMaster.CTU == "0"
          ) {
            this.showNotification("danger", this.$t("can_not_save"), this.$t("please_enter_invoice_type"));
            break;
          } else {
            this.dsoMaster("update");
            this.onClick("saveDetail");
            this.onClick("search");
          }
          break;
        case "saveDetail":
          this.$refs.grdDetail.saveData();
          break;
        case "deleteDetail":
          this.$refs.grdDetail.deleteRows();
          break;
        case "viewXML":
          this.onPreviewXML();
          break;
        case "viewDEC":
          this.onPreviewDEC();
          break;
        case "generalDeclaration":
          this.SignXML();
          break;
        case "checkingDeclaration":
          this.onCheckingDeckaration();
          break;
        case "newDetail":
          this.onAddRight();
          break;
      }
    },

    onAddRight() {
      this.dynamicHeader = this.BuildDynamicHeader();
      this.dialogTitle = this.$t("control_item");
      this.codeLabel = this.$t("serial_number");
      this.nameLabel = this.$t("ca_name");
      this.procedure = "EI_SEL_6095080_GET_CTRLITEM";
      this.moreParas = null;
      this.autoSearch = true;
      this.multiSelectMode = false;
      this.$refs.refDynamicDialog.dialogIsShow = true;
    },

    async onPreviewDEC() {
      this.isProcessing = true;
      if (this.modelMaster.PK != null) {
        this.pdfUrl = await this.pdfUrlGetter(this.modelMaster.PK);
        //console.log("pdfUrlv", this.pdfUrl);
        this.$nextTick(() => {
          this.isProcessing = false;
          this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
        });
      } else {
        this.showNotification("warning", this.$t("error_occurs"), "pls_select_declaration");
        return;
      }
    },

    async onCheckingDeckaration() {
      if (!this.modelMaster.CQT_MAGD) {
        this.showNotification("danger", this.$t("trade_code_null"), "");
        return;
      }
      let res = await this.$axios.$post("/einvoice/checkingdeclaration", {
        responseType: "json",
        para: {
          p_tei_einvoice_issuse_cqt_pk: this.modelMaster.PK,
          trade_code: [this.modelMaster.CQT_MAGD],
        },
      });
      if (res.success) {
        this.$refs.grdSearch.loadData();
        this.showNotification("success", this.$t(res.message), "");
      } else {
        this.showNotification("danger", this.$t(res.message), "");
      }
    },

    async onPreviewXML() {
      if (!this.modelMaster.PK == null) {
        return this.showNotification("warning", this.$t("error_occurs"), "pls_select_declaration");
      }
      this.isProcessing = true;

      if (!this.modelMaster.CQT_MAGD) {
        let data_xml = this.onGeneralXML();
        let resConvertXML = await this.$axios.$post("/einvoice/declare2xml", {
          responseType: "json",
          declare: data_xml,
        });

        if (resConvertXML.success && resConvertXML.data.length) {
          this.xmlUrl = resConvertXML.data; //new Blob([byteArray], { type: _typeFile });;
          await this.$nextTick();
          this.isProcessing = false;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        } else {
          this.showNotification("danger", res.message);
        }
      } else {
        try {
          this.xmlUrl = this.modelMaster.XML_SIGNED; //new Blob([byteArray], { type: _typeFile });;
          this.$nextTick(() => {
            this.isProcessing = false;
            this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
          });

          this.isProcessing = false;
        } catch (e) {
          this.isProcessing = false;
          return this.showNotification("danger", e.message);
        }
      }
    },

    async dsoMaster(action) {
      await this._dsoCall(
        {
          type: "control",
          selpro: "EI_SEL_6095080_S_02",
          updpro: "EI_UPD_6095080_U_03",
          para: [this.modelMaster.PK],
          elname: [
            "_rowstatus",
            "PK",
            "TEI_COMPANY_PK",
            "TNNT",
            "CQTQLY",
            "MCQTQLY",
            "MSO",
            "MST",
            "DDANH",
            "CODE",
            "TEN",
            "NLHE",
            "DCLHE",
            "HTHUC",
            "DTLHE",
            "DCTDTU",
            "NLAP",
            "CMA",
            "KCMA",
            "NNTDBKKHAN",
            "NNTKTDNUBND",
            "CDLTTDCQT",
            "CDLQTVAN",
            "CDDU",
            "CBTHOP",
            "HDGTGT",
            "HDBHANG",
            "HDBTSCONG",
            "HDBHDTQGIA",
            "HDKHAC",
            "CTU",
            "CQT_NOTIFICATION",
            "PBAN",
            "CMTMTTIEN",
          ],
          data: this.modelMaster,
        },
        action,
        true
      ).then((res) => {
        if (res) {
          switch (action) {
            case "select":
              this.modelMaster = { ...res };
              this.modelMaster._rowstatus = "u";
              break;
            case "update":
              switch (this.modelMaster._rowstatus) {
                case "i":
                  this.modelMaster = { ...res };
                  this.modelMaster._rowstatus = "u";
                  break;
                case "u":
                  this.modelMaster = { ...res };
                  this.modelMaster._rowstatus = "u";
                  break;
                case "d":
                  this.onClick("newMaster");
                  break;
              }
              break;
          }
        }
      });
    },

    BuildDynamicHeader() {
      let header = [];
      header = [
        {
          dataField: "NO",
          caption: this.$t("no"),
        },
        {
          dataField: "SERIAL_NUMBER",
          caption: this.$t("serial_number"),
        },
        {
          dataField: "CA_NAME",
          caption: this.$t("ca_name"),
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
          dataField: "NOTBEFORE",
          caption: this.$t("not_before"),
        }
        ,
        {
          dataField: "TOKEN_TYPE",
          caption: this.$t("hthuc"),
          allowEditing: true,
          lookup: {
            displayExpr: "NAME",
            valueExpr: "CODE",
            dataSource: this.token_type_list,
          },
          width: 230,
        },

        
      ];
      return header;
    },

    async initHeaderList() {
      this.headerList.grdSearch = [
        {
          dataField: "NO",
          caption: this.$t("no"),
        },
        {
          dataField: "DECLARE_NM",
          caption: this.$t("declare_nm"),
          width: 120,
        },
        {
          dataField: "FORM_NO",
          caption: this.$t("form_no"),
        },
        {
          dataField: "STATUS",
          caption: this.$t("status"),
        },
        {
          dataField: "NLAP",
          caption: this.$t("red_date"),
          dataType: "date",
          format: this.curLang.DATE_FORMAT,
        },
        {
          dataField: "TRADE_CODE",
          caption: this.$t("trade_code"),
          width: 200,
        },
        {
          dataField: "CQT_NOTIFICATION",
          caption: this.$t("cqt_notification"),
          width: 200,
          // hidden:true
        },
      ];
      this.headerList.grdDetail = [
        {
          dataField: "NO",
          caption: this.$t("no"),
          width: 50,
        },
        {
          dataField: "PK",
          caption: this.$t("pk"),
          hidden: true,
        },
        {
          dataField: "TEI_DECLARATION_M_PK",
          caption: this.$t("tei_declaration_m_pk"),
          hidden: true,
        },
        {
          dataField: "TTCHUC",
          caption: this.$t("ttchuc"),
          allowEditing: true,
          width: 200,
        },
        {
          dataField: "MST",
          caption: this.$t("mst"),
          width: 150,
          hidden: true,
        },
        {
          dataField: "SERI",
          caption: this.$t("seti"),
          width: 300,
        },
        {
          dataField: "TNGAY",
          caption: this.$t("tngay"),
          width: 200,
        },
        {
          dataField: "DNGAY",
          caption: this.$t("dngay"),
          width: 200,
        },
        {
          dataField: "HTHUC",
          caption: this.$t("hthuc"),
          allowEditing: true,
          lookup: {
            displayExpr: "NAME",
            valueExpr: "CODE",
            dataSource: this.token_type_list,
          },
          width: 230,
        },
      ];
    },

    callBackDynamicDialog(item) {
      console.log(item);
      this.$refs.grdDetail.addRowStruct({
        _rowstatus: "i",
        NO: this.$refs.grdDetail.getDataSource().length + 1,
        PK: "",
        TEI_DECLARATION_M_PK: this.modelMaster.PK,
        TTCHUC: item.CA_NAME,
        MST: item.DN_MST,
        SERI: item.SERIAL_NUMBER,
        DNGAY: item.NOTAFTER,
        TNGAY: item.NOTAFTER,
        HTHUC: item.TOKEN_TYPE,
      });
    },

    onGeneralXML() {
      if (this.modelMaster.PK) {
        const objDataMaster = {
          version: this.modelMaster.PBAN,
          declare_name: this.modelMaster.TEN,
          declare_type: 1,
          seller_company_name: this.modelMaster.TNNT,
          seller_taxcode: this.modelMaster.MST,
          tax_office_name: this.dataMasterList.taxOfficeList.find((item) => item.CODE == this.modelMaster.MCQTQLY)?.NAME || "",
          tax_office_code: this.modelMaster.MCQTQLY,
          contact_person: this.modelMaster.NLHE,
          contact_address: this.modelMaster.DCLHE,
          contact_email: this.modelMaster.DCTDTU,
          contact_phone: this.modelMaster.DTLHE,
          location_name: this.modelMaster.DDANH,
          created_date: this.modelMaster.NLAP,
          has_code: this.modelMaster.CMA,
          no_code: this.modelMaster.KCMA,
          pos_code: this.modelMaster.CMTMTTIEN,
          taxpayer_from_difficult_location: this.modelMaster.NNTDBKKHAN,
          taxpayer_from_people_committee_suggestions: this.modelMaster.NNTKTDNUBND,
          transfer_data_directly_to_tax_office: this.modelMaster.CDLTTDCQT,
          cdlqtvan: this.modelMaster.CDLQTVAN,
          full_transfer: this.modelMaster.CDDU,
          summary_transfer: this.modelMaster.CBTHOP,
          vat_invoice: this.modelMaster.HDGTGT,
          saling_invoice: this.modelMaster.HDBHANG,
          public_asset_invoice: this.modelMaster.HDBTSCONG,
          national_reserve_goods_invoice: this.modelMaster.HDBHDTQGIA,
          other_invoice: this.modelMaster.HDKHAC,
          voucher: this.modelMaster.CTU,
          digital_certificates: [],
        };

        for (let j = 0; j < this.$refs.grdDetail.getDataSource().length; j++) {
          if (this.$refs.grdDetail.getDataSource()[j]._rowstatus != "") {
            return;
          }

          objDataMaster.digital_certificates.push({
            sequence: this.$refs.grdDetail.getDataSource()[j].NO,
            organization_name: this.$refs.grdDetail.getDataSource()[j].TTCHUC,
            serial_no: this.$refs.grdDetail.getDataSource()[j].SERI,
            from_date: this.$refs.grdDetail.getDataSource()[j].TNGAY,
            to_date: this.$refs.grdDetail.getDataSource()[j].DNGAY,
            type: this.$refs.grdDetail.getDataSource()[j].HTHUC,
          });
        }

        return objDataMaster;
      }
    },

    async SignXML() {
      let data_xml = this.onGeneralXML();

      console.log("data_xml  +===>", data_xml);
      let resConvertXML = await this.$axios.$post("/einvoice/declare2xml", {
        responseType: "json",
        declare: data_xml,
      });

      if (resConvertXML.success) {
        const objXml = [
          {
            req_key: this.modelMaster.PK,
            xml: JSON.stringify(resConvertXML.data).toString().replaceAll('"', "").replaceAll("<DLTKhai>", "<DLTKhai Id='ID1'>"),
          },
        ];

        jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/issueXmlList",
          dataType: "text",
          method: "POST",
          data: {
            crt_by: this.user.USER_ID,
            xml: JSON.stringify(objXml).toString(),
          },
          error: this.onErrorissueXmlList,
          success: this.onSuccessissueXmlList,
        });
      }
    },

    async onErrorissueXmlList(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
    },

    async onSuccessissueXmlList(data) {
      let obj_token = $.parseJSON(data);
      // console.log("onSuccessissueXmlList e1 " + JSON.stringify(obj_token));
      // return;

      let resAPI = await this.$axios.$post("/einvoice/senddeclaration", {
        responseType: "json",
        para: {
          xml_signed: obj_token.result[0].xml,
          erp_declaration_m_pk: obj_token.result[0].master_pk,
        },
      });
      if (resAPI.success) {
        this.$refs.grdLeft.loadData();
          this.showNotification("success", this.$t(resDB.message), "");
      } else {
        this.showNotification("danger", this.$t(resAPI.message), "");
      }
    },

    async onGetDetailDeclaration() {
      if (this.modelMaster.PK != "") {
        let xml = `<TKhai>
                    <DLTKhai>
                      <TTChung>
                      </TTChung>		
                      <NDTKhai>
                      </NDTKhai>	
                    </DLTKhai>	
                    <DSCKS>
                      <NNT>
                      </NNT>
                    </DSCKS>
                  </TKhai>`;

        const objXml = [
          {
            master_pk: this.modelMaster.PK,
            xml: JSON.stringify(xml).toString().replaceAll('"', "").replaceAll("<DLTKhai>", "<DLTKhai Id='ID1'>"),
          },
        ];

        jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/getDeclarationData",
          dataType: "text",
          method: "POST",
          data: {
            crt_by: this.user.USER_ID,
            xml: JSON.stringify(objXml).toString(),
          },
          error: this.onErrorGetDetailDeclaration,
          success: this.onSuccessGetDetailDeclaration,
        });
      }
    },

    async onErrorGetDetailDeclaration() {
      this.showNotification("warning", this.$t("warning"), this.$t("pls_install_application_or_open_application"));
    },

    async onSuccessGetDetailDeclaration(data) {
      let obj_token = $.parseJSON(data);
      this.$refs.grdDetail.addRowStruct({
        _rowstatus: "i",
        NO: this.$refs.grdDetail.getDataSource().length + 1,
        PK: "",
        TEI_DECLARATION_M_PK: this.modelMaster.PK,
        TTCHUC: this.getPara("CN", obj_token.issue_by),
        MST: obj_token.dn_mst,
        SERI: obj_token.serial_number,
        DNGAY: obj_token.not_after,
        TNGAY: obj_token.not_before,
        HTHUC: "1",
      });
    },

    getPara(paraname, data) {
      let result = "";
      let start = data.indexOf(paraname + "=");
      if (start >= 0 && start + paraname.length < data.length) {
        start = start + paraname.length + 1;

        let spa = data.indexOf(",", start);

        if (spa >= 0 && data.length > spa && spa - start > 0) {
          result = data.substring(start, spa);
        } else {
          result = data.substring(start);
        }

        result.replace(paraname + "=", "");
      }
      return result;
    },

    async initDataList() {
      const companyInfo = await this._callProcedure("EI_SEL_6095080_Company", [this.user.PK]);
      if (companyInfo.length > 0) {
        this.dataSearchList.companyList = companyInfo;
        this.dataMasterList.companyList = companyInfo;
      }
      const results = await this._getCommonCode2(["ACEI0010", "ACEI0220", "ACEI0120", "ACEI0190", "ACEI0140", "ACEIN010", "ACJS0460"], this.user.TCO_COMPANY_PK);
      this.dataSearchList.statusList = results[0];
      this.modelSearch.STATUS = "7";
      this.dataMasterList.versionList = results[1];
      this.dataMasterList.taxOfficeList = results[2];
      // this.dataMasterList.fromNoList = results[3];
      this.dataMasterList.fromNoList = results[3].filter((x) => x.VAL1 == "6095080");
      this.dataMasterList.fromNoList.forEach((e) => {
        if (e.DEF_YN == "Y") {
          this.modelMaster.MSO = e.CODE;
        }
      });
      this.dataMasterList.declarationNameList = results[4];
      this.dataMasterList.registrationFormList = results[5];

      this.token_type_list = results[6];
    },

    async initModel() {
      this.modelMaster._rowstatus = "i";
      this.modelMaster.PK = null;
      this.modelMaster.TEI_COMPANY_PK = this.modelSearch.COMPANY_PK;
      this.modelMaster.TNNT = this.dataMasterList.companyList.find((item) => item.VAL == this.modelMaster.TEI_COMPANY_PK).NAME;
      this.modelMaster.CQTQLY = null;
      this.modelMaster.MCQTQLY = "00";
      this.modelMaster.MSO = "01/ĐKTĐ-HĐĐT";
      this.modelMaster.MST = this.dataMasterList.companyList.find((item) => item.VAL == this.modelMaster.TEI_COMPANY_PK).TAX_CODE;
      this.modelMaster.DDANH = null;
      this.modelMaster.CODE = "1"; //Declare_CODE//
      this.modelMaster.TEN = null;
      this.modelMaster.NLHE = null;
      this.modelMaster.DCLHE = null;
      this.modelMaster.HTHUC = "1";
      this.modelMaster.DTLHE = null;
      this.modelMaster.DCTDTU = null;
      this.modelMaster.NLAP = new Date().toISOString().substr(0, 10);//.replaceAll("-", "");
      this.modelMaster.CMA = "0";
      this.modelMaster.KCMA = "0";
      this.modelMaster.NNTDBKKHAN = "0";
      this.modelMaster.NNTKTDNUBND = "0";
      this.modelMaster.CDLTTDCQT = "0";
      this.modelMaster.CDLQTVAN = "0";
      this.modelMaster.CDDU = "0";
      this.modelMaster.CBTHOP = "0";
      this.modelMaster.HDGTGT = "0";
      this.modelMaster.HDBHANG = "0";
      this.modelMaster.HDBTSCONG = "0";
      this.modelMaster.HDBHDTQGIA = "0";
      this.modelMaster.HDKHAC = "0";
      this.modelMaster.CTU = "0";
      this.modelMaster.CQT_MAGD = null;
      this.modelMaster.PBAN = "2.0.1";
      this.modelMaster.CMTMTTIEN = "0";
      this.$refs.grdDetail.Clear();
    },

    openManualDialogPDF() {
      if (this.hasForm) {
        if (this.manualIsMinimizedPDF) {
          this.manualIsMinimizedPDF = false;
          this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
        } else {
          this.dialogIsShow = true;
        }
      }
    },

    restoreManualDialogPDF() {
      this.manualIsMinimizedPDF = false;
      this.$refs.ViewEInvoicePDFDialog.dialogIsShow = true;
    },

    openManualDialog() {
      if (this.hasForm) {
        if (this.manualIsMinimized) {
          this.manualIsMinimized = false;
          this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
        } else {
          this.dialogIsShow = true;
        }
      }
    },

    restoreManualDialog() {
      this.manualIsMinimized = false;
      this.$refs.ViewEInvoiceXMLDialog.dialogIsShow = true;
    },

    async pdfUrlGetter(pk) {
      const pdfUrlExcel = await this.getDeclariton(this, pk);
      return pdfUrlExcel;
    },
  },
};
</script>

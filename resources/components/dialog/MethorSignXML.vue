<template>
  <v-dialog id="methor-sign-x-m-l-dialog" max-width="600" v-model="dialogIsShow">
    <v-card>
      <v-card-title class="headline primary-gradient white--text py-2">
        <span>{{ $t("sign_xml") }}</span>
        <v-spacer></v-spacer>
        <v-icon dark @click="dialogIsShow = false">mdi-close-thick</v-icon>
      </v-card-title>
      <v-container fluid class="pt-0">
        <div tabindex="-1" role="dialog" class="ui-dialog ui-corner-all ui-widget ui-widget-content ui-front m-detail-popup ui-draggable" aria-describedby="signatureListDetail" aria-labelledby="ui-id-6" style="height: auto; width: 575px; top: 10411.2px; left: 672.5px; z-index: 107;">
          <div class="ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle">
            <span id="ui-id-6" class="ui-dialog-title">Chọn chứng thư số</span>
            <button type="button" class="ui-dialog-titlebar-close" title="Đóng">
              <i class="s-22 i-close"></i>
            </button>
          </div>
          <div class="popup-detail ui-dialog-content ui-widget-content" id="signatureListDetail" data-root="true" style="width: auto; min-height: 43.4375px; max-height: none; height: auto;">
            <form novalidate="novalidate">
              <div class="content">
                <div class="esgin-container ">
                  <div class="signconfig d-none esign">
                    <div class="signlogo esign"></div>
                    <div class="signcontent">
                      <div class="signtitle">Dịch vụ chữ ký số từ xa MISA eSign</div>
                      <div class="signnote">MST: 0123456</div>
                    </div>
                    <div class="flex-1"></div>
                    <div class="active-icon"></div>
                  </div>
                </div>
                <div class="signconfig usb" @click="keelItWithFire">
                  <div class="signlogo usb"></div>
                  <div class="signcontent">
                    <div class="signtitle">Ký số trực tiếp qua USB TOKEN</div>
                    <div class="signnote">1. Máy tính đang dùng cần cài đặt công cụ MISA KYSO.</div>
                    <div class="signnote">2. Bạn cần cắm USB chứa chứng thư số khi thực hiện ký số.</div>
                  </div>
                  <div class="flex-1"></div>
                  <div class="active-icon"></div>
                </div>
                <div class="signconfig hsm active" @click="keelItWithFire">
                  <div class="signlogo hsm"></div>
                  <div class="signcontent">
                    <div class="signtitle caname-hsm">EASYCA</div>
                    <div class="signnote account-hsm d-flex">
                      <span class="tag-name">Tài khoản</span>
                      <span class="tag-name-value">Công ty Misa ( Test  EasySign)</span>
                    </div>
                    <div class="signnote certificatesn-hsm d-flex">
                      <span class="tag-name">Số chứng thư số</span>
                      <span class="tag-name-value">540110001633BA3B39CB1FF2E370558D</span>
                    </div>
                  </div>
                  <div class="flex-1"></div>
                  <div class="active-icon"></div>
                </div>
                <div class="signconfig d-none nologo">
                  <div class="signlogo nologo"></div>
                  <div class="signcontent">
                    <div class="signtitle">Không ký số khi xuất vé</div>
                    <div class="signnote">Chỉ áp dụng với vé khởi tạo từ máy tính tiền</div>
                  </div>
                  <div class="flex-1"></div>
                  <div class="active-icon"></div>
                </div>
              </div>
              <div class="m-row m-toolbar detail-toolbar a-i-center">
                <div class="flex-1"></div>
                <div class="d-flex flex-row-reverse">
                  <button class="btn btn-primary w120" data-command="Agree" data-original-title="" title="">Đồng ý</button>
                  <button class="btn btn-color-blue mr-8" data-command="Cancel" data-original-title="" title="">Hủy bỏ</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>
 
<script>
  import '../../assets/style/methorsignxml.css';
  export default {
    name: "methor-sign-x-m-l-dialog",
    props: {
      headers: {
        type: Array
      },
      multiSelectMode: {
        type: Boolean,
        default: false
      }
    },

    data: () => ({
      dialogIsShow: false,
      dataList: [],
      selectedDatas: [],

      companyList: [],
      selectedCompany: "",

      p_trtype_pk: 0,
    }),

    computed: {
      defaultHeaders() {
        if (this.headers) return this.headers;

        return [
          {
            field: "SHIFT",
            caption: this.$t("shift"),
            width: "90"
          },
          {
            field: "START_TIME",
            caption: this.$t("start"),
            width: "90"
          },
          {
            field: "END_TIME",
            caption: this.$t("end"),
            width: "90"
          },
          {
            field: "START_MEAL1",
            caption: this.$t("start_meal"),
            width: "90"
          },
          {
            field: "END_MEAL1",
            caption: this.$t("end_meal"),
            width: "90"
          },
          {
            field: "DURING_DAY",
            caption: this.$t("during_day"),
            width: "90"
          },
          {
            field: "WT_PLUS",
            caption: this.$t("wt_plus"),
            width: "90"
          },
          {
            field: "START_OT",
            caption: this.$t("start_ot"),
            width: "90"
          },
        ];
      },
      user() {
        return this.$store.getters["auth/user"];
      },
      limitHeight() {
        return this.windowHeight - 320;
      }
    },

    watch: {
      dialogIsShow(val) {
        if (val === true) {
          this.selectedCompany = this.user.TCO_COMPANY_PK;
          this.getCompanyList();
        }
      },

      selectedCompany(val) {
        if (val) this.onSearch();
      },

      p_trtype_pk(val) {
        if (val == null || val == "" || val == undefined) {
          val = 0;
        }
      }
    },

    methods: {
      keelItWithFire(){
        //document.querySelector(".sithLord").style.display = "none";
        console.log(document.querySelector(".signconfig usb"));
      },
      

      async getCompanyList() {
        const dso = {
          type: "list",
          selpro: "SYS_SEL_LIST_COMPANY",
          para: [this.user.PK]
        };
        const result = await this._dsoCall(dso, "select", false);
        if (result) {
          this.companyList = result;
        } else {
          this.companyList = [];
        }
      },

      async onSearch() {
        const dso = {
          type: "grid",
          selpro: "SYS_SEL_WS_DIALOG",
          para: [this.selectedCompany, this.p_trtype_pk]
        };
        this.dataList = await this._dsoCall(dso, "select", false);
      },

      onSelectionChanged({ selectedRowsData }) {
        this.selectedDatas = selectedRowsData;
      },

      onSelectSingle({ data }) {
        this.returnWSInfo(this.p_trtype_pk == 0 ? data : [data]);
      },

      onSelectMultiple() {
        let rtn_data = this.multiSelectMode
          ? this.selectedDatas
          : this.selectedDatas[0];
        this.returnWSInfo(rtn_data);
      },

      returnWSInfo(datas) {
        this.$emit("returnWSInfo", datas);
        this.$refs.WSGrid.instance.clearSelection()
        this.dialogIsShow = false;
      }
    }
  };
</script>

<template>
  <v-container fluid class="pa-0">
    <v-container fluid v-resize="onResize">
      <v-row dense>
        <v-col md="5" :class="isShowLeft ? null : 'd-none'" class="pt-2">
          <v-card>
            <v-row dense>
              <v-col md="8">
                <BaseInput outlined :label="$t('company_name')" v-model="selCompany"  @keyPressEnter="search"/>
              </v-col>
              <v-col md="4">
                <GwFlexBox class="d-flex justify-end">
                  <BaseButton icon_type="search" :btn_text="$t('search')" :disabled="isProcessing" @onclick="search" />
                </GwFlexBox>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col md="12">
                <BaseGridView
                  ref="grdCompany"
                  select_mode="Single"
                  :max_height="limitHeight"
                  :autoresize="true"
                  :header="headerGrid"
                  @cellClick="grdSearchClick"
                  sel_procedure="AC_SEL_6095420_COMPANY_NC"
                  :filter_paras="[this.selCompany]"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!--right panel-->
        <v-col :md="isShowLeft ? 7 : 12">
          <v-row dense>
            <v-col md="12">
              <v-card>
                <v-row dense>
                  <v-col md="1" class="d-flex">
                    <BaseButton btn_type="icon" :icon_type="isShowLeft ? 'skip_prev' : 'skip_next'" :btn_text="isShowLeft ? $t('hide_left') : $t('show_left')" @onclick="isShowLeft = !isShowLeft" />
                  </v-col>
                  <v-col md="11"></v-col>
                </v-row>
                <v-row dense> </v-row>
                <v-row dense>
                  <v-col md="12">
                    <v-card>
                      <v-card-title class="headline primary-gradient white--text py-2">{{ $t("company_info") }} </v-card-title>

                      <v-container fluid class="pt-3">
                        <v-row dense>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('vietnamese_name')" v-model="txtMastersPK.SELLER_COMP_LNAME" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('english_name')" v-model="txtMastersPK.SELLER_COMP_NAME" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('vat_tin')" v-model="txtMastersPK.SELLER_TAXCODE" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('representative')" v-model="txtMastersPK.REPRESENTATIVE" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('tel')" v-model="txtMastersPK.SELLER_TEL" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('fax')" v-model="txtMastersPK.SELLER_FAX" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('representative_e_mail')" v-model="txtMastersPK.SELLER_EMAIL" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('website')" v-model="txtMastersPK.SELLER_WEBSITE" readonly />
                          </v-col>
                          <v-col md="12">
                            <BaseInput outlined :label="$t('address')" v-model="txtMastersPK.SELLER_ADDRESS" readonly />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {},
  data: () => ({
    isShowLeft: true,
    selCompany: "",

    company_Info: "",

    dlg_View: false,
    txtMastersPK: {
      SELLER_COMP_NAME: "",
      SELLER_COMP_LNAME: "",
      SELLER_TAXCODE: "" ,
      REPRESENTATIVE: "" ,
      SELLER_TEL: "" ,
      SELLER_FAX: "" ,
      SELLER_EMAIL: "" ,
      SELLER_WEBSITE: "" ,
      SELLER_ADDRESS: "" ,
    },
  }),

  created() {},

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return 710;
      }
    }, // this.windowHeight },
    headerGrid() {
      const self = this;
      return [
        {
          dataField: "PK",
          caption: this.$t("pk"),
          hidden: true,
        },
        {
          dataField: "SELLER_COMP_NAME",
          caption: this.$t("seller_comp_name"),
        },
        {
          dataField: "SELLER_TAXCODE",
          caption: this.$t("seller_taxcode"),
        },
        {
          dataField: "REPRESENTATIVE",
          caption: this.$t("representative"),
        },
        {
          dataField: "SELLER_ADDRESS",
          caption: this.$t("seller_address"),
        },
        {
          dataField: "SELLER_TEL",
          caption: this.$t("seller_tel"),
        },
        {
          dataField: "SELLER_FAX",
          caption: this.$t("seller_fax"),
        },
        {
          dataField: "SELLER_EMAIL",
          caption: this.$t("seller_email"),
        },
        {
          dataField: "SELLER_WEBSITE",
          caption: this.$t("seller_website"),
        },
        {
          dataField: "SELLER_BANK_NO",
          caption: this.$t("seller_bank_no"),
        },
        {
          dataField: "SELLER_BANK_NAME",
          caption: this.$t("seller_bank_name"),
        },
      ];
    },
  },

  methods: {
    search() {
      this.$refs.grdCompany.loadData();
    },
    grdSearchClick(cell) {
    //   console.log("file: 6095420.vue:236 [vng-304] grdSearchClick [vng-304] cell:", cell.data);
      this.txtMastersPK = cell.data;
    },
    // async onClick(pos) {
    //     switch (pos) {
    //         case "search":

    //             break;
    //         case "grdSearchClick":
    //             if (this.$refs.grdCompany.getSelectRowsData().length > 0) {
    //                           let row = this.$refs.grdCompany.getSelectRowsData()[0];
    //                           console.log(row);
    //                           this.txtMastersPK = row.PK;
    //                           console.log("file: 6095420.vue:243 [vng-304] onClick [vng-304]  this.txtMastersPK:",  this.txtMastersPK)

    //                         }
    //             break;
    //     }
    // },
    //   onCellPrepared({ column, cellElement, rowType }) {
    //    if (this.txtInvoice_type === "E")
    //     {
    //       if (rowType === "data" && (column.dataField === "ATTRIBUTE1" || column.dataField === "ATTRIBUTE2"|| column.dataField === "ATTRIBUTE3"||column.dataField === "ATTRIBUTE4"||column.dataField === "ATTRIBUTE5"||column.dataField === "SEQ_DIS"||column.dataField === "SEQ")) {
    //            cellElement.style.width =  100;
    //       }
    //     }
    //   },

    //   onCallUploadFile() {
    //     console.log(this.txtFile);
    //     if(this.txtFile.length == 0)
    //     {
    //       return
    //     }
    //     if(this.blImgLogo === 'N' && this.blImgBackGroup === 'N')
    //     {
    //       this.showNotification("warning", "Information", this.$t('msg_please_select_a_checkbox_data'));
    //       return;
    //     }
    //     this.UploadFile().then(() => {
    //       this.txtFileName=""
    //        this.txtFile = []
    //     });
    //   },
    //   async UploadFile() {
    //       if (this.txtMastersPK)
    //       {
    //         let params = [
    //           this.txtMastersPK,    // p_tei_company_pk
    //           this.blImgLogo,       // p_img_logo_yn
    //           this.blImgBackGroup,  // p_img_backgroup_yn
    //           "TEI_COMPANY",        // p_master_table_pk
    //         ];
    //         const fd = new FormData();
    //         fd.append("file", this.txtFileName);
    //         fd.append("proc", "AC_UPD_6095010_IMG");
    //         fd.append("folder", "6095010"); //
    //         fd.append("para", JSON.stringify(params));

    //         const res = await this.$axios({
    //           method: "post",
    //           url: "/dso/uploadfile2",
    //           data: fd,
    //         });
    //         if (res.data.data) {
    //           this.showNotification(
    //             "success",
    //             this.$t("PROCESS_SUCCESS", "COMMON"),
    //             ""
    //           );
    //           console.log(res.data.data);
    //           this.fileSave = null;
    //           this.txtFile = [];
    //           //this.$refs.grdAttachFiles.loadData();
    //         } else {
    //           this.showNotification(
    //             "danger",
    //             this.$t("ERROR_OCCURS", "COMMON"),
    //             ""
    //           );
    //         }
    //       }
    //     },
    //   onFilePicked(file) {
    //     if(file == "" || file == "undefined")
    //     {
    //       return
    //     }

    //     this.txtFileName = file ;
    //     const fr = new FileReader ();
    //       fr.readAsDataURL(this.txtFileName);
    //       fr.addEventListener('load', () => {
    //         this.image = fr.result;
    //       });
    //   },
    //   onClickButton(obj) {
    //     switch (obj) {
    //      case "SEARCH":
    //         this.$refs.grdCompany.loadData();
    //         break;
    //       case "NEW":
    //         this.addNewMaster();//
    //         break;
    //       case "SAVE":
    //         this.objClick = "btnSave";
    //         this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_save"));
    //         break;
    //       case "DELETE":
    //         this.objClick = "btnDelete";
    //         this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_delete"),"warning");
    //         break;
    //       case "OPTION":
    //         if (this.objClick == "btnSave")
    //         {
    //           this.$refs.grdCompany.saveData();
    //         }
    //         else if (this.objClick == "btnDelete")
    //         {
    //           this.$refs.grdCompany.deleteRows2();
    //         }
    //         else if (this.objClick == "btnUpLoad")
    //         {
    //           this.onCallUploadFile();
    //         }
    //         break;
    //       case "UPLOAD":
    //         this.objClick = "btnUpLoad";
    //         this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_upload_img"),"warning");
    //         break;
    //       case "SEARCH_M":
    //         if (this.$refs.grdCompany.getSelectRowsData().length > 0) {
    //               let row = this.$refs.grdCompany.getSelectRowsData()[0];
    //               console.log(row);
    //               this.txtMastersPK = row.PK;
    //             }
    //         break;
    //     }
    //   }
  },
};
</script>

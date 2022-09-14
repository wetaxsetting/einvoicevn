<template>
	<base-wrapper class="overflow-x-hidden">
		<v-container fluid class="pa-0" v-resize="onResize">
			<v-row dense align="center" justify="space-between">
				<v-col lg="3" cols="12">
					<BaseInput :label="$t('partner')" v-model="searchPartner" @keyPressEnter="search" @dblClick="$refs.partnerDialog.dialogIsShow = true" />
				</v-col>
				<v-col lg="3" cols="12">
					<div class="d-flex align-center w-100">
						<BaseDatePicker class="w-100" default :label="$t('from_date')" v-model="fromDate" />
						<div class="mx-2"></div>
						<BaseDatePicker class="w-100" default :label="$t('to_date')" v-model="toDate" />
					</div>
				</v-col>
				<v-col lg="2" cols="12">
					<BaseSelect :label="$t('mail_type')" v-model="selectedMailType" :lstData="mailTypeList" item-text="NAME" item-value="CODE" :text_all="$t('all')" />
				</v-col>
				<v-col lg="1" cols="12" align-self="end">
					<BaseCheckbox row :label="$t('success_yn')" true-value="Y" false-value="N" v-model="successYN" />
				</v-col>
				<v-col lg="1" cols="12" align-self="end">
					<span>{{ `${$t('total_rows')}: ${totalRow}` }}</span>
				</v-col>
				<v-col lg="2" cols="12" class="d-flex justify-center align-center">
					<BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="search" />
					<BaseButton btn_type="icon" icon_type="resend" :btn_text="$t('resend')" @onclick="resend" />
				</v-col>
				<v-col lg="6" cols="12">
					<DataGridView 
						select_mode="Single" 
						ref="dataGrid" 
						:max_height="gridHeight" 
						:header="headers" 
						sel_procedure="SYS_SEL_8015030" 
						:filter_paras="[ searchPartner, fromDate, toDate, selectedMailType, successYN ]" 
						@rowCount="totalRow = $event" 
						@cellClick="onCellClick" 
						@onRowSelectedReturn="onRowSelectedReturn" 
						overflowDiv="overlay" 
						@cellDblClick="gridCellDblClick" 
					/>
				</v-col>
				<v-col lg="6" cols="12">
					<MailPreview 
						:width="mailPreviewWidth" 
						:height="gridHeight" 
						:mailData="selectedMailData" 
						:currentIdx="currentRowIdx" 
						:lastIdx="lastIdx" 
						@onPrevNext="loadPrevNextRow" 
					/>
				</v-col>
			</v-row>
		</v-container>
		<partner-dialog ref="partnerDialog" @callBackData="handleReturnedPartner" />
		<ContactPartner ref="contactPartner" @callBackData="handleReturnedContactPartner" />
		<confirm-dialog ref="confirmDialog" @onConfirm="onConfirmResendMail('resendmail')" />
		<GwLoading :visible="showLoading" />
	</base-wrapper>
</template>

<script>
export default {
  layout: "detault",
  middleware: "user",

  components: {
    PartnerDialog: () => import("@/components/dialog/PartnerDialog"),
    MailPreview: () => import("@/components/part/80/15/MailPreview"),
    ContactPartner: () => import("@/components/part/80/15/ContactPartner"),
  },

  data: () => ({
    searchPartner: "",
    fromDate: "",
    toDate: "",
    selectedMailType: "",
    successYN: "Y",
    selectedMailData: {},
    currentRowIdx: -1,
    totalRow: 0,
    mailTypeList: [],
    showLoading: false,
  }),

  async created() {
    const commoncode = await this._getCommonCode2(["SYS0010"], this.user.TCO_COMPANY_PK);
    this.mailTypeList = commoncode[0];
    this.onLoad();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    dataGridRefs() {
      return this.$refs.dataGrid;
    },
    gridHeight() {
      return Math.floor((this.formContainerHeight * 90) / 100);
    },
    mailPreviewWidth() {
      return Math.floor((this.formContainerWidth * 50) / 100)
    },
    headers() {
      return [
				{
          dataField: "PARTNER_NAME",
          caption: this.$t("partner"),
          allowEditing: false
        },
        {
          dataField: "SUCCESS_YN",
          caption: this.$t("success"),
          allowEditing: false,
          dataType: "checkbox"
        },
        {
          dataField: "SEND_DT",
          caption: this.$t("send_dt"),
          allowEditing: false
        },
        {
          dataField: "READ_TIME",
          caption: this.$t("read_time"),
          allowEditing: false
        },
        {
          dataField: "READ_IP",
          caption: this.$t("read_ip"),
          allowEditing: false
        },
        {
          dataField: "SUBJECT",
          caption: this.$t("subject"),
          allowEditing: false,
          width: "200"
        },
        {
          dataField: "SEND_FROM",
          caption: this.$t("send_from"),
          allowEditing: false
        },
        {
          dataField: "SEND_TO",
          caption: this.$t("send_to"),
          allowEditing: false
        },
      ]
    },
    lastIdx() {
      return this.totalRow - 1;
    }
  },

  methods: {
    async onLoad() {
      try {
        setTimeout(() => {
          this.$nextTick(async () => {
            this.search();
          });
        }, 100);
      } catch (e) {
        // console.log(e);
      }
    },

    async onConfirmResendMail(p_action) {
      this.doResend()
    },

    resend() {
      this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_resend_mail"), "warning", false)
    },

    async doResend() {
      try {
        if (this.selectedMailData.ATTACH1 == null || this.selectedMailData.ATTACH1 == 'null' || this.selectedMailData.ATTACH1 == undefined) {
          this.showNotification("warning", this.$t('please_select_mail_to_resend'), "", 5000)
        }
        this.showLoading = true
        const mail_option = {
          from: '',
          to: arrConsigner[i].EMAIL_ADDRESS, //tranbichlieu142@gmail.com arrConsigner[i].EMAIL_ADDRESS,annqt@ajtotalvn.com accounting@ajtotalvn.com// list of receivers, separate by comma(;)
          cc: 'thai.nguyen@genuwinsolution.com',
          subject: this.selectedMailData.SUBJECT, // Subject line
          text: '', // plain text body
          html: this.selectedMailData.BODY, // html body,
          attachments: [
						{
              filename: this.selectedMailData.FILENAME1,
              path: this.selectedMailData.ATTACH1
            },
            {
              filename: this.selectedMailData.FILENAME2,
              path: this.selectedMailData.ATTACH2
            },
            {
              filename: this.selectedMailData.FILENAME3,
              path: this.selectedMailData.ATTACH3
            },
            {
              filename: this.selectedMailData.FILENAME4,
              path: this.selectedMailData.ATTACH4
            },
            {
              filename: this.selectedMailData.FILENAME5,
              path: this.selectedMailData.ATTACH5
            }
          ],
        }
        const res = await this.$axios.$post("dso/sendmail", {
          mail_option: mail_option,
          smtp_host: 'SMTP_HOST',
          smtp_port: 'SMTP_PORT',
          smtp_user: 'SMTP_USER',
          smtp_pass: 'SMTP_PASS',
          tco_buspartner_pk: this.selectedMailData.TCO_BUSPARTNER_PK,
          mail_type: this.selectedMailData.MAIL_TYPE_CODE,
          template_pk: this.selectedMailData.SYS_MAIL_TEMPLATE_PK,
          template_binding: {
            CUSTOMER_NAME: this.selectedMailData.PARTNER_NAME
          },
          _db2: this.SECOND_DB_YN,
        })
        if (res.success) {
          this.showNotification("success", this.$t(res.message) + ". Sent to: " + mail_option.to, "", 7000)
        } else {
          this.showNotification("error", this.$t(res.message), "", 9000)
        }
        this.showLoading = false
      } catch (e) {
        this.showNotification("error", e.message, "", 9000)
        this.showLoading = false
        console.log(e)
      }
    },

    handleReturnedPartner({ PK, PARTNER_ID, PARTNER_NAME }) {
      this.searchPartner = PARTNER_NAME;
			this.search();
    },

    handleReturnedContactPartner() {
      this.search();
    },

    search() {
      this.dataGridRefs.loadData()
      this.selectedMailData = {}
    },

    onCellClick({ column, data, rowIndex, rowType }) {
      if (rowType === "data") {
        this.selectedMailData = { ...data };
        this.currentRowIdx = rowIndex;
        if (column.name === "ATTACH1" && data.ATTACH1) {
          window.open(data.ATTACH1, "_blank")
        } else if (column.name === "ATTACH2" && data.ATTACH2) {
          window.open(data.ATTACH2, "_blank")
        } else if (column.name === "ATTACH3" && data.ATTACH3) {
          window.open(data.ATTACH3, "_blank")
        }
      }
    },

    loadPrevNextRow(newIdx) {
      this.currentRowIdx = newIdx;
      this.dataGridRefs.selectRowsByIndexes([this.currentRowIdx])
    },

    onRowSelectedReturn(data) {
      this.selectedMailData = { ...data[0] };
    },

    gridCellDblClick(e) {
      if (e.column.dataField == "SEND_TO") {
        this.$refs.contactPartner.PK = this.$refs.dataGrid.selectedDatas[0].PK;
        this.$refs.contactPartner.TCO_PARTNERCONTACT_PK = this.$refs.dataGrid.selectedDatas[0].TCO_BUSPARTNER_PK;
        this.$refs.contactPartner.dialogIsShow = true;
      }
    },
  }
}
</script>

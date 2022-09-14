<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect
          :label="$t('company')"
          item-value="VAL"
          item-text="NAME"
          :lstData="company_list"
          v-model="selected_company"
        />
      </v-col>
      <v-col md="2" >
        <BaseSelect
          :label="$t('date')"
          item-value="VAL"
          item-text="NAME"
          :lstData="type_date_list"
          v-model="selected_type_date"
          filter_off
        />
      </v-col>
      <!-- month -->
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker :label="$t('month')" v-model="month" month />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker :label="$t('from_to')" v-model="to_date" />
      </v-col>
      <!-- ascurrent -->
      <v-col md="2" v-show="selected_type_date == '1'"> </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- year -->
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- Quarter -->

      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseDatePicker :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseSelect
          :label="$t('type_quarter')"
          v-model="selected_type_quarter"
          :lstData="type_quarter_list"
          item-text="NAME"
          item-value="VAL"
          filter_off
        />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <v-col md="1">
        <BaseButton
          btn_type="icon"
          icon_type="search"
          @onclick="onClickButton()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3">
        <BaseSelect
          :label="$t('send_type')"
          item-value="VAL"
          item-text="NAME"
          :lstData="sende_type_list"
          v-model="selected_sende_type"
        />
      </v-col>
      <v-col md="4">
        <BaseInput :label="$t('trade_code')" v-model="trade_code"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView
          ref="gridview"
          :header="this.headerGrid"
          :setting="true"
          :autoresize="false"
          :headertype="1"
          :height="limitHeight"
          sel_procedure="EI_SEL_6095260_DATA"
          :filter_paras="[
            this.selected_company, 
            this.from_date, 
            this.to_date,
            this.selected_sende_type,
            this.trade_code,
            ]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  middleware: "user",

  components: {},

  data: () => ({
    selected_company: null,
    company_list: [],
    from_date: "",
    to_date: "",
    selected_sende_type: "",
    sende_type_list: [],
    trade_code: "",
    headerGrid: [],
    selected_type_date: "",
    type_date_list: [
      {
        NAME: "Monthly",
        VAL: "0",
      },
      {
        NAME: "As current",
        VAL: "1",
      },
      {
        NAME: "Year",
        VAL: "2",
      },
      {
        NAME: "Quarter",
        VAL: "3",
      },
    ],
    selected_type_quarter:"",
    type_quarter_list: [
      {
        NAME: "I",
        VAL: "0",
      },
      {
        NAME: "II",
        VAL: "1",
      },
      {
        NAME: "III",
        VAL: "2",
      },
      {
        NAME: "IV",
        VAL: "3",
      },
    ],
    month: "",
    year: "",
  }),

  async created() {
    await this.getListCodes("company");
    await this.getListCodes("sende_type");
    this.onSetHeader();
  },

  watch: {
    selected_type_date(val) {
      if (val == "0" || val == "2") {
        this.from_date = "";
        this.to_date = "";
      }
      let tmpMonth = new Date().getMonth() + 1;
      if (val == "0" && this.month == "") {
        if (tmpMonth < 10) {
          this.month = "0" + tmpMonth.toString();
        } else {
          this.month = tmpMonth.toString();
        }
        let tmpYear = new Date().getFullYear();
        this.month = tmpYear.toString() + this.month;
      }
      if (val == "2" && this.year == "") {
        let tmpYear = new Date().getFullYear();
        this.year = tmpYear.toString();
      }
      if (val == "3" && this.year == "") {
        let tmpYear = new Date().getFullYear();
        this.year = tmpYear.toString();
      }
      if (this.year != "" && val == "2") {
        this.from_date = this.year + "0101";
        this.to_date = this.year + "1231";
      }
      if (this.month != "" && val == "0") {
        this.from_date = this.month + "01";
        this.to_date = this.month + this._maxDateOfMonth(this.from_date);
      }
      if (val == "3") {
        if (this.selected_type_quarter == "0") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "0331";
        }
        if (this.selected_type_quarter == "1") {
          this.from_date = this.year + "0401";
          this.to_date = this.year + "0630";
        }
        if (this.selected_type_quarter == "2") {
          this.from_date = this.year + "0701";
          this.to_date = this.year + "0930";
        }
        if (this.selected_type_quarter == "3") {
          this.from_date = this.year + "1001";
          this.to_date = this.year + "1231";
        }
      }
    },
    month(val) {
      if (val) {
        this.from_date = val + "01";
        this.to_date = val + this._maxDateOfMonth(val);
      }
    },
    year(val) {
      if (val) {
        if (this.selected_type_date == "2") {
          this.from_date = this.year + "0101";
          this.to_date = this.year + "1231";
        }
        if (this.selected_type_date == "3") {
          if (this.selected_type_quarter == "0") {
            this.from_date = this.year + "0101";
            this.to_date = this.year + "0331";
          }
          if (this.selected_type_quarter == "1") {
            this.from_date = this.year + "0401";
            this.to_date = this.year + "0630";
          }
          if (this.selected_type_quarter == "2") {
            this.from_date = this.year + "0701";
            this.to_date = this.year + "0930";
          }
          if (this.selected_type_quarter == "3") {
            this.from_date = this.year + "1001";
            this.to_date = this.year + "1231";
          }
        }
      }
    },
    selected_type_quarter(val) {
      switch (val) {
        case "0":
          this.from_date = this.year + "0101";
          this.to_date = this.year + "0331";
          break;
        case "1":
          this.from_date = this.year + "0401";
          this.to_date = this.year + "0630";
          break;
        case "2":
          this.from_date = this.year + "0701";
          this.to_date = this.year + "0930";
          break;
        case "3":
          this.from_date = this.year + "1001";
          this.to_date = this.year + "1231";
          break;
      }
    },
  },

  async mounted() {
    let tmpMonth = new Date().getMonth() + 1;
    if (tmpMonth < 10) {
      this.month = "0" + tmpMonth.toString();
    } else {
      this.month = tmpMonth.toString();
    }
    let tmpYear = new Date().getFullYear();
    this.month = tmpYear.toString() + this.month;
    this.year = tmpYear.toString();
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    limitHeight() {
      if (this.windowHeight <= 768) {
        return this.windowHeight * 0.69; //1366x768
      } else {
        return this.windowHeight * 0.82; //1920x18/080
      }
    },
  },
  methods: {
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onSetHeader() {
      this.headerGrid = [
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width:80,
          alignment: "left",
          type:"text",  
          // visible: false                
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          width:100,
          alignment: "center",
          type:"text",         
          // visible: false
        },
        {
          field: "INVOICE_NO",
          title: this.$t("invoice_no"),
          width:100,
          alignment: "left",
          type:"number",
          // visible: false
        },
        {
          field: "INVOICE_DATE",
          title: this.$t("invoice_date"),
          width:100,
          alignment: "center",
          type:"text",
          // visible: false
        },
        {
          field: "TAX_CODE",
          title: this.$t("tax_code"),
          width:100,
          alignment: "left",
          type:"text",
          // visible: false
        },
        {
          field: "COMPANY_NM",
          title: this.$t("company_name"),
          width:250,
          alignment: "left",
          type:"text",
          // visible: false
        },
        {
          field: "TRADE_CODE",
          title: this.$t("trade_code"),
          width:300,
          alignment: "left",
          type:"text",
          // visible: false
        },
        {
          field: "CQT_MCCQT_ID",
          title: this.$t("cqt_code"),
          width:300,
          alignment: "left",
          type:"text",
          // visible: false
        },
        {
          field: "CHECKING_SEND-DATA",
          title: this.$t("checking_send_data"),
          width:300,
          alignment: "right",
          type:"text",
          // visible: false
        },
        {
          field: "CHECKING_RESULT_DATA",
          title: this.$t("checking_result_data"),
          width:300,
          alignment: "right",
          type:"text",
          // visible: false
        },
        {
          field: "NOTIFICATION",
          title: this.$t("notification"),
          width:200,
          alignment: "right",
          type:"text",
          // visible: false
        },
        {
          field: "NOTIFICATION_CONTENT",
          title: this.$t("notification_content"),
          width:200,          
          alignment: "right",
          type:"text",
          // visible: false
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "EI_SEL_6095260_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;
        case "sende_type":
          const dso_sende_type_list = {
            type: "list",
            selpro: "EI_SEL_6095260_SEND_TYPE",
            para: [this.selected_company],
          };
          this.sende_type_list = await this._dsoCall(
            dso_sende_type_list,
            "select",
            false
          );
          if (this.sende_type_list != null) {
            this.selected_sende_type = this.sende_type_list[0].VAL;
          }
          break;
      }
    },
  },
};
</script>

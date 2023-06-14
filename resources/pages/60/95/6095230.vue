<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect outlined :label="$t('company')" item-value="VAL" item-text="NAME" :lstData="company_list"
          v-model="selected_company" />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('date')" item-value="VAL" item-text="NAME" :lstData="type_date_list"
          v-model="selected_type_date" filter_off />
      </v-col>
      <!-- month -->
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker  outlined :label="$t('month')" v-model="month" month />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker outlined  :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '0'">
        <BaseDatePicker outlined :label="$t('from_to')" v-model="to_date" />
      </v-col>
      <!-- ascurrent -->
      <v-col md="2" v-show="selected_type_date == '1'"> </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '1'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- year -->
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '2'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <!-- Quarter -->

      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('year')" v-model="year" year />
      </v-col>
      <v-col md="1" v-show="selected_type_date == '3'">
        <BaseSelect outlined :label="$t('type_quarter')" v-model="selected_type_quarter" :lstData="type_quarter_list"
          item-text="NAME" item-value="VAL" filter_off />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('from_date')" v-model="from_date" />
      </v-col>
      <v-col md="2" v-show="selected_type_date == '3'">
        <BaseDatePicker outlined :label="$t('to_date')" v-model="to_date" />
      </v-col>
      <v-col md="1" class="d-flex justify-end">
        <BaseButton btn_type="icon" icon_type="search" @onclick="onClickButton()" />
        <BaseButton btn_type="icon" icon_type="print" />
      </v-col>
    </v-row>
    <v-row>

      <v-col md="3">
        <BaseSelect outlined :label="$t('')" item-value="VAL" item-text="NAME" :lstData="text_invoice_list"
          v-model="selected_text_invoice" disableSearch />
      </v-col>
      <v-col md="2">
        <BaseInput outlined :label="$t('invoice_type')" v-model="selected_text_invoice" readonly />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('form')" item-value="VAL" item-text="NAME" :lstData="form_list" v-model="selected_form" />
      </v-col>
      <v-col md="2">
        <BaseSelect outlined :label="$t('serial_no')" item-value="VAL" item-text="NAME" :lstData="serial_no_list"
          v-model="selected_serial_no" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView ref="gridview" :header="this.headerGrid" :setting="true" :autoresize="false" :headertype="1"
          :height="limitHeight" sel_procedure="AC_SEL_6095230_DATA_T" :filter_paras="[
            this.selected_company,
            this.from_date,
            this.to_date,
            this.selected_text_invoice,
            this.selected_serial_no,
            this.selected_form,

          ]" />
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
    selected_invoice_type: "",
    invoice_type_list: [],
    selected_form: "",
    text_invoice_list: [],
    selected_text_invoice: "",
    form_list: [],
    selected_serial_no: "",
    serial_no_list: [],
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
    selected_type_quarter: "",
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
    await this.getListCodes("form_no");
    await this.getListCodes("serial_no");
    await this.getListCodes("text_invoice");
    this.onSetHeader();
  },

  watch: {
    selected_company(val) {
      this.getListCodes("form_no");
      this.getListCodes("serial_no");
      this.getListCodes("text_invoice");
    },
    selected_form(val) {
      this.getListCodes("serial_no");
    },
    selected_text_invoice(val) {
      this.getListCodes("invoice_type");
    },
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
          field: "RN",
          title: this.$t("no"),
          width: 80,
          alignment: "right",
          type: "text",
          // visible: false
        },
        {
          field: "INVOICE_TYPE",
          title: this.$t("invoice_type"),
          width: 200,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "INVOICE_NAME",
          title: this.$t("invoice_type_NAME"),
          width: 200,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "FORM_NO",
          title: this.$t("form_no"),
          width: 100,
          alignment: "left",
          type: "number",
          // visible: false
        },
        {
          field: "SERIAL_NO",
          title: this.$t("serial_no"),
          width: 100,
          alignment: "center",
          type: "text",
          // visible: false
        },
        {
          field: "STD_YM",
          title: this.$t("month"),
          width: 100,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "CLOSE_YN",
          title: this.$t("close"),
          width: 100,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "CRT_BY",
          title: this.$t("create_by"),
          width: 100,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "CRT_DT",
          title: this.$t("creaate_date"),
          width: 200,
          alignment: "center",
          type: "text",
          // visible: false
        },
        {
          field: "MOD_BY",
          title: this.$t("modify_by"),
          width: 300,
          alignment: "left",
          type: "text",
          // visible: false
        },
        {
          field: "MOD_DT",
          title: this.$t("modify_date"),
          width: 300,
          alignment: "right",
          type: "text",
          // visible: false
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "AC_SEL_6095260_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;

        case "form_no":
          const dso_form_list = {
            type: "list",
            selpro: "AC_SEL_6095230_FORM_NO",
            para: [this.selected_company],
          };
          this.form_list = await this._dsoCall(dso_form_list, "select", false);
          if (this.form_list != null) {
            this.selected_form = this.form_list[0].VAL;
          }
          break;
        case "serial_no":
          const dso_serial_no_list = {
            type: "list",
            selpro: "AC_SEL_6095230_SERIAL_NO",
            para: [this.selected_company, this.selected_form],
          };
          this.serial_no_list = await this._dsoCall(
            dso_serial_no_list,
            "select",
            false
          );
          if (this.serial_no_list != null) {
            this.selected_serial_no = this.serial_no_list[0].VAL;
          }
          break;
        case "text_invoice":
          const dso_text_invoice_list = {
            type: "list",
            selpro: "AC_SEL_6095230_INVOICE_TYPE",
            para: [this.selected_company],
          };
          this.text_invoice_list = await this._dsoCall(
            dso_text_invoice_list,
            "select",
            false
          );
          if (this.text_invoice_list != null) {
            this.selected_text_invoice = this.text_invoice_list[0].VAL;
          }
          break;

        case "invoice_type":
          const dso_invoice_type_list = {
            type: "list",
            selpro: "AC_SEL_6095230_INVOICE_TYPE_1",
            para: [this.selected_text_invoice],
          };
          this.invoice_type_list = await this._dsoCall(
            dso_invoice_type_list,
            "select",
            false
          );
          if (this.invoice_type_list != null) {
            this.selected_invoice_type = this.invoice_type_list[0].VAL;
          }
          break;
      }
    },
  },
};
</script>

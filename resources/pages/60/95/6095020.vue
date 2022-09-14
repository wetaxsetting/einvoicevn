<template>
  <v-container fluid v-resize="onResize">
    <v-row>
      <v-col md="3">
        <BaseSelect
          :label="$t('company')"
          :lstData="company_list"
          v-model="selected_company"
          item-value="VAL"
          item-text="NAME"
        />
      </v-col>
      <v-col md="2">
        <BaseDatePicker :label="$t('form_date')" v-model="form_date" default />
      </v-col>
      <v-col md="2">
        <BaseDatePicker :label="$t('to_date')" v-model="form_to" default />
      </v-col>
      
      <v-col md="5" class="d-flex justify-end">
        <BaseButton icon_type="import_token" @onclick="InvoiceSign()" />
         <BaseButton
          btn_type="icon"
          icon_type="search"
          @onclick="onClickButton()"
        />
        <BaseButton btn_type="icon" icon_type="save"/>
        <BaseButton btn_type="icon" icon_type="reset"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseGridView
          ref="gridview"
          :header="this.headerGrid"
          :autoresize="false"
          :setting="true"
          :height="limitHeight"
          :headertype="1"
          sel_procedure="EI_SEL_6095020_DATA"
          :filter_paras="[this.selected_company, this.form_date, this.form_to]"
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
    form_date: "",
    form_to: "",
    headerGrid: [],
    txtXMl_T:""
  }),

  async created() {
    await this.getListCodes("company");
    this.onSetHeader();
  },

  watch: {},

  mounted() {},
// meo
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
    InvoiceSign() {
      this.txtXMl_T =
        "<?xml version='1.0' encoding='UTF-8'?>" +
        "<Invoice xmlns='http://genuwinsolution.com/e-invoice' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" +
        "<Content id='ID1'>" +
        "<Inv>" +
        "<key>1943</key>" +
        "<Invoice1>" +
        "</Invoice1>" +
        "</Inv>" +
        "</Content>" +
        "</Invoice>";
      // if(txtPK.value!="")
      // {
      jQuery.support.cors = true;
        $.ajax({
          url: "http://localhost:1080/issueXmlList",
          dataType: "text",
          method: "POST",
          data: {
            tei_invoice_m_pk: this.PKs,
            tei_company_pk: this.selected_company,
            crt_by: this.user.USER_ID,
            xml: this.txtXMl_T,
          },
          error: this.onGetDataError,
          success: this.onGetDataaSuccess,
        });
      },
      async onGetDataError(json, textStatus, errorThrown) {
      alert(" Error :" + errorThrown);
      },

      async onGetDataaSuccess(data) {
      let obj_token = $.parseJSON(data);

      this.txtXMl_T = obj_token.result;
      this.txtSerial_Number = obj_token.SerialNumber;
      this.txtNOTBEFORE = obj_token.NotBefore;
      this.txtNOTAFTER = obj_token.NotAfter;
      this.txtRAWDATA = obj_token.RAWDATA;
      this.txtISSUER = obj_token.IsSuer;
      this.txtISSUEBY = obj_token.IssueBy;
      this.txtISSUETO = obj_token.IssueTo;
      this.txtDN_NAME = obj_token.DN_Name;
      this.txtDN_MST = obj_token.DN_MST;

      const response = await this._callProcedure(
            "EI_UPD_6095020_DATA_TOKEN",
            [ this.selected_company, 
              this.txtRAWDATA,
              this.txtISSUER,
              this.txtISSUEBY,
              this.txtISSUETO,
              this.txtDN_NAME,
              this.txtDN_MST,
              this.txtNOTBEFORE,
              this.txtNOTAFTER,
              this.txtSerial_Number
            ]
          );
          if(response[0].STATUS != "OK")
          {
             this.showNotification(
              "danger",
              "Error! An error occurred. Please try again later!",
              ""
            );
          }else
          {
            this.showNotification(
              "success",
              "Success",
              ""
            );
          }
    },
      
    onClickButton() {
      this.$refs.gridview.loadData();
    },
    onSetHeader() {
      this.headerGrid = [
        {
          field: "RN",
          title: this.$t("no"),
          alignment: "center",
          type:"text",
          width:80,
        },
        {
          field: "DN_NAME",
          title: this.$t("company_name"),
          alignment: "left",
          type:"text",
          width:250,
        },
        {
          field: "ISSUER",
          title: this.$t("issuer"),
          width:300,
          alignment: "left",
          type:"text",
        },
        {
          field: "SERIAL_NUMBER",
          title: this.$t("serial_number"),
          width:300,
          alignment: "left",
          type:"text",
        },
        {
          field: "ISSUEBY",
          title: this.$t("issue_by"),
          width:300,
          alignment: "left",
          type:"text",
        },
        {
          field: "ISSUEBYTO",
          title: this.$t("issueto"),
          alignment: "left",
          type:"text",
          width:100,
        },
        {
          field: "NOTAFTER",
          title: this.$t("not_after"),
          width:250,
          alignment: "left",
          type:"text",
        },
        {
          field: "NOTBEFORE",
          title: this.$t("not_before"),
          alignment: "left",
          type:"text",
          width:200,
        },
        {
          field: "EXPONENT",
          title: this.$t("exponent"),
          alignment: "left",
          type:"text",
          width:100,
        },
      ];
    },
    async getListCodes(pos) {
      switch (pos) {
        case "company":
          const dso_company_list = {
            type: "list",
            selpro: "EI_SEL_6095020_COMPANY",
            para: [this.user.PK],
          };
          this.company_list = await this._dsoCall(
            dso_company_list,
            "select",
            false
          );
          break;
      }
    },
  },
};
</script>

<template>
<v-container fluid v-resize="onResize">
  <v-row dense>
    <v-col cols="4">
      <v-card outlined class="overflow-y-80vh-container" :disabled="isRendering" :loading="isRendering">
        <v-card-text class="pa-1">
          <v-row class="pt-1" dense>
            <v-col md = "12">     
              <BaseSelect :label="$t('company')" v-model="selectedCompany" :lstData="companyList" item-text="TEXT" item-value="PK" />
            </v-col>
          </v-row>
          <v-row class="pt-1" dense>
            <v-col md="10">     
              <v-text-field
                      v-model="searchGroup"
                      :label="$t('group')"
                      dense
                      hide-details
                      clearable
                      @keypress.enter="onClick('searchGroup')"
                    />
            </v-col>
            <v-col md="2" class="d-flex justify-end">
              <BaseButton btn_type="icon" icon_type="search" @onclick="onClick('searchGroup')" :disabled="isRendering"/>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col md="12"> 
              <v-slide-y-transition hide-on-leave>
                <v-skeleton-loader type="list-item@10" v-if="!menuList.length"></v-skeleton-loader>
                <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="GRP" item-children="childMenu"
                            open-all :active.sync="active" :color="currentTheme" :items="menuList" @update:active="getSelectedMenu" v-else>
                  <template v-slot:prepend="{ item, open }">
                    <BaseIcon icon_size icon_color="none" :icon_type="open ? 'folder_open' : 'folder'" v-if="item.LEAF === 0"/>
                    <BaseIcon icon_size icon_color="none"  icon_type="file" v-else/>
                  </template>
                </v-treeview>
              </v-slide-y-transition>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>  
    <v-col cols="8">        
      <v-row class="pt-1" dense>
        <v-col cols="3">
          <BaseInput v-model="searchItem" :label="$t('item')" @keyPressEnter="onClick('searchItem')"/> 
        </v-col>
        <v-col cols="3" class="d-flex justify-center align-center">
          <GwRadioGroup row :items="typeItemList" v-model="selectedType" />
        </v-col>
        <v-col cols="4" class="d-flex justify-center align-center">
          <BaseCheckbox :label="$t('wh_acc')" v-model="whACCYN" true-value="Y" false-value="N"/>
          <BaseCheckbox :label="$t('expense_acc')" v-model="expenseACC" true-value="Y" false-value="N"/>
          <BaseCheckbox :label="$t('rev_acc')" v-model="revACC" true-value="Y" false-value="N"/>
        </v-col>
        <v-col md="2" class="d-flex justify-end">
          <BaseButton icon_type="search" @onclick="onClick('searchItem')" :disabled="isRendering" />
          <BaseButton icon_type="print" @onclick="onClick('print')" :disabled="isRendering" />
        </v-col>
      </v-row>
      <v-row class="pt-1" dense>
        <v-col cols="12">
          <BaseGridView
            ref="grdData"                   
            sel_procedure="LG_SEL_8030040_2"
            selectionmode="checkbox"
            fixselectionmode="checkbox"
            :autocheckbox="false"
            :multiselect="true"
            :max_height="700"
            :filter_paras="[
              this.selectedType,
              this.searchItem,
              this.grpPK,
              this.whACCYN,
              this.expenseACC,
              this.revACC,
            ]"                   
          :header="headerDataList"           
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  
    <v-sheet id="printHTML" ref="printHTML" class="d-none">
        
      <body style="margin: 0px; padding: 0px; font-family: Microsoft Sans serif;">
      <div>
        <table
          border="0"
          cellspacing="0"
          cellspadding="0"
          style="height: 100%; width: 100%; margin-bottom:18px" v-for="(page, idx) in printPerPage" :key="idx"
        >
          <tbody>
        <tr no-gutters valign="top" v-for="(items ,index) in page" :key="index">
          <td v-for="(item ,index2) in items" :key="index2" >
              <table
                border="0"
                cellspacing="0"
                cellspadding="0"
                style="height: 3in; width: 2in; table-layout: fixed; /*border: 1px solid black;*/"
              >
                <tbody>
                  <colgroup>
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                      <col span="1" style="width: 0.2in;">
                  </colgroup>
                  <tr>
                    <td colspan="10" rowspan="1" style="font-size: 20px; text-align: left; width: 2in; height: 0.4in; font-weight: bold; padding: 10px 10px 0px 10px;">
                      <div >
                        {{item.ITEM_CODE}}
                      </div>
                    </td>
                  </tr>
                  <tr valign="top">
                    <td colspan="10" rowspan="1" style="font-size: 16px; text-align: left; width: 2in; height: 1.5in; padding: 10px 10px 0px 10px;">
                      <div style="font-weight: bold;">
                        {{item.ITEM_LNAME}}
                      </div>
                        <br>
                      <div>
                        {{item.ITEM_FNAME}}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" rowspan="1" style="text-align: center; width: 2in; height: 1.1in;">
                      <div >
                          <BaseQRCode height="80" width="80" :value="item.ITEM_BC" />
                      </div>
                    </td>
                    <td colspan="5" rowspan="1" style="text-align: center; width: 2in; height: 1.1in;">
                      <div style="font-size: 12px; text-align: center; width: 86px; font-weight: bold;">Tồn an toàn</div>
                      <div style="width: 80px; height: 40px; border: 3px solid black;"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </td>
        </tr>
      </tbody></table>
     </div>
     </body>
    </v-sheet>
</v-container>
</template>

<script>

import listToTree from "list-to-tree-lite";

export default {
  layout: "default",
  middleware: "user",

  components: {
  },
  data: () => ({
    headerDataList: [],

    companyList: [],
    selectedCompany: null,
    searchGroup: "",
    active: [],
    menuList: [],


    grpPK: "",
    selectedType: "1",
    searchItem: "",
    whACCYN: "N",
    expenseACC: "N",
    revACC: "N",


    selectedMenu: {},
    isRendering: false,
    printHTMLList: [],
  }),
  async created() {
    /*TODO: */
    await this.getCompanyList();
    await this.initHeaderList();
  },

  watch: {
    selectedCompany(value) {
      if (value) {
        this.getMenuList();
      }
    },
    selectedType(value) {
      this.initHeaderList();
      this.onClick('searchItem');
    },
    whACCYN(value) {
      this.onClick('searchItem');
    },
    expenseACC(value) {
      this.onClick('searchItem');
    },
    revACC(value) {
      this.onClick('searchItem');
    },
  },
 
  mounted() {
    
    /*TODO: */
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    typeItemList() {
      return [
        { value: "1", text: this.$t('item') },
        { value: "2", text: this.$t('st_item') }
      ]
    },
    printHTMLContent() {
      console.log(this.printPerPage.length);
      if(this.printPerPage.length){
        return this.$refs.printHTML.$el.innerHTML;
      }
    },
    printPerPage() {
     let tmp = this._chunkArray(this.printHTMLList, 4);
      let itemPerRow = 2;
      
      let itemReturn = [];
      for( let i = 0; i < tmp.length; i++) {
        let itemsPerPage = tmp[i];
        let _itemPerPageTmp = [];
        for( let j = 0; j < itemsPerPage.length; j+=itemPerRow ) {
          let _itemPerRow = itemsPerPage.filter( (q, idx) => idx >= j && idx < j+ itemPerRow );
          _itemPerPageTmp.push(_itemPerRow);
        }
        console.log(_itemPerPageTmp);
        itemReturn.push(_itemPerPageTmp);
      }

      return itemReturn;
    },
  },
  methods: {
    onClick(obj) {
      switch (obj) {
        case "searchGroup":
          this.getMenuList();
        break;
        case "searchItem":
          this.$refs.grdData.loadData();
        break;
        case "print":
          if (this.$refs.grdData.getSelectedRows().length == 0) {
            this.$refs.alertDialog.showAlert("warning", "Error", "pls_choose_one_detail_to_print");
            return;
          }
          else
          {
            this.onPrint();   
          }
        break;
      }
    },

    getSelectedMenu() {
      if (!this.active.length) {
        this.selectedMenu = ''
      } else {
        this.selectedMenu = { ...this.active[0] };
        this.grpPK = this.selectedMenu.PK;
        this.onClick("searchItem");
      }
    },

    async getCompanyList() {
      const dso = {
        type: 'list',
        selpro: 'SYS_SEL_LIST_COMPANY_ALL',
        para: [this.user.PK]
      }
      const result = await this._dsoCall(dso, 'select', false)
      if (result) {
        this.companyList = result;

      } else {
        this.companyList = []
      }
    },

    async getMenuList() {
      try {
        this.isRendering = true
        let { data, success, message } = await this.$axios.$post("dso/callproc", { proc: "LG_SEL_8030040_1", para: [this.selectedCompany, this.searchGroup] })
        if (data) {
          const filteredMenu = listToTree(data, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'childMenu' })
          this.menuList = [...filteredMenu]
          //console.log(filteredMenu);
        } else {
          this.menuList = []
          this.showNotification('danger', this.$t('error_occurs'), message)
        }
      } catch (e) {
        this.showNotification('danger', this.$t('error_occurs'), e.message)
      } finally {
        this.isRendering = false
      }
    },
    
    async onPrint() {
      let lstPK = "";
      let arrRowSelected = this.$refs.grdData.getSelectedRows();
      for(let i = 0; i < arrRowSelected.length; i++){
        lstPK += arrRowSelected[i].ITEM_PK + (i<(arrRowSelected.length-1) ? "," : "");
      }
     // alert(lstPK)
      //console.log(lstPK);
			const dso1 = {
        type: "list",
        selpro: "LG_RPT_8030040_NOCACHE",//
				para: [this.selectedType, lstPK]
      };
     //this.printHTMLList =[];
			const res = await this._dsoCall(dso1, "select", false);
      this.printHTMLList = res ? [...res] : [];
      //console.log(this.printPerPage)
      var cont = null;
      this.$nextTick(()=>{
        //console.log(this.printHTMLContent);
        cont = window.open('', '', 'height=500, width=500');
        cont.document.write('<html>');
        cont.document.write('<body>');
        cont.document.write(this.printHTMLContent);
        cont.document.write('</body></html>');
        cont.document.close();
      })
      await new Promise((resolve) => {setTimeout(resolve, 1000)});
      if(cont){
        cont.print();
        cont.window.close();
      }
    },
    
    async initHeaderList(){
      this.headerDataList = 
      [       
        {
          dataField: 'GRP_NM',
          caption: this.$t('group'),
        },
        {
          dataField: 'ITEM_CODE',
          caption: this.$t('item_code'),
        },
        {
          dataField: 'ITEM_NAME',
          caption: this.$t('item_name_en'),
        },
        {
          dataField: 'ITEM_LNAME',
          caption: this.$t('item_name_vn'),
        },
        {
          dataField: 'ITEM_FNAME',
          caption: this.$t('item_name_kr'),
        },
        {
          dataField: 'VIRTUAL_CODE',
          caption: this.$t('virtual_code'),
          hidden: this.selectedType == "1" ? false : true,
        },
        {
          dataField: 'VIRTUAL_NAME',
          caption: this.$t('virtual_name'),
          hidden: this.selectedType == "1" ? false : true,
        },
        {
          dataField: 'UOM',
          caption: this.$t('uom'),
        },
        {
          dataField: 'USE_YN',
          caption: this.$t('active'),
          dataType: "checkbox",
        },
        {
          dataField: 'ACCT',
          caption: this.$t('wh_acct'),
        },
        {
          dataField: 'EXPENSE',
          caption: this.$t('expense_acc'),
        },
        {
          dataField: 'REVENUE',
          caption: this.$t('revenue_acc'),
        },
        {
          dataField: 'CRT_IF',
          caption: this.$t('create_info'),
        },
        {
          dataField: 'MOD_IF',
          caption: this.$t('modify_info'),
        },
      ];
    }
  }
};
</script>
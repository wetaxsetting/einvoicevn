<template>
<v-container fluid class="py-0 px-1" v-resize="onResize">
  <v-card outlined>
    <v-row dense align="center" justify="space-between">
      <v-col cols="12">
        <v-card outlined>
          <v-container fluid>
            <div class="d-flex flex-column justify-center">
              <v-container fluid class="">
                <v-row dense justify="space-start">
                  <v-col lg="2" cols="12">
                    <BaseInput :label="$t('storage')" v-model="storage" readonly />
                  </v-col>
                  <v-col lg="2" cols="12">
                    <BaseInput :label="$t('location')" v-model="location" />
                  </v-col>
                  <v-col lg="2" cols="12">
                    <BaseInput :label="$t('category_or_item')" v-model="cate_item_code" />
                  </v-col>
                  <v-col lg="2" cols="12">
                  </v-col>
                  <v-col lg="2" cols="12">
                    <v-btn :disabled="isProcessing" color="blue-grey" class="white--text" @click="onClick('search')">
                      search
                      <v-icon right dark> mdi-magnify </v-icon>
                    </v-btn>
                    <v-btn :disabled="isProcessing" color="blue-grey" class="white--text" @click="onClick('print')">
                      print
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense align="center" justify="space-between">
      <v-col cols="12">
        <v-card outlined>
          <v-container fluid>
            <v-row dense align="stretch" justify="space-between">
              <v-col cols="12">
                <v-card fluid>
                  <table border="1" cellspacing="0" cellspadding="0" style="height: 70%; width: 100%">
                    <tr style="background-color:#b7dee8" height="20%">
                      <td colspan="1" rowspan="2">
                        <div class="itemTable2">{{$t('no')}}</div>
                      </td>
                      <td colspan="3" rowspan="2">
                        <div class="itemTable2">{{$t("item_code")}}</div>
                      </td>
                      <td colspan="3" rowspan="2">
                        <div class="itemTable2">{{$t("item_name")}}</div>
                      </td>
                      <td colspan="3" rowspan="2">
                        <div class="itemTable2">{{$t("uom")}}</div>
                      </td>
                      <td colspan="8">
                        <div class="itemTable2">{{$t("stock_status")}}</div>
                      </td>
                      <td colspan="8">
                        <div class="itemTable2">{{$t("in_out_waiting")}}</div>
                      </td>
                      <td colspan="2" rowspan="2">
                        <div class="itemTable2">{{$t("detail")}}</div>
                      </td>
                    </tr>
                    <tr style="background-color:#b7dee8" height="20%">
                      <td colspan="2">
                        <div class="itemTable2">{{$t("total_stock")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("raw_material_storage_stock")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("workshop_stock")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("casting_machine_input")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("stock_in_waiting")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("transfer_casting_workshop_waiting")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("stock_out_waiting")}}</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable2">{{$t("empty")}}</div>
                      </td>
                    </tr>
                    <tr style="background-color:#ffff00" height="10%">
                      <td colspan="1">
                        <div class="itemTable2">0</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable2">{{$t("total")}}</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable4">{{ParentTotalObj.TOTAL_LOC==undefined?0:ParentTotalObj.TOTAL_LOC.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable4">{{ParentTotalObj.EMPTY_LOC==undefined?0:ParentTotalObj.EMPTY_LOC.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ParentTotalObj.USING_LOC==undefined?0:ParentTotalObj.USING_LOC.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ParentTotalObj.USING_PER!=undefined?ParentTotalObj.USING_PER.toFixed(2):0}}%&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ParentTotalObj.QTY==undefined?0:ParentTotalObj.QTY.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ParentTotalObj.ITEM_COUNT==undefined?0:ParentTotalObj.ITEM_COUNT.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ParentTotalObj.PALLET_QTY==undefined?0:ParentTotalObj.PALLET_QTY.toLocaleString("en", {   
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{8}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{9}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{10}}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{11}}&nbsp;&nbsp;</div>
                      </td>
                    </tr>
                    <tr style="background-color:#00ff00" height="10%" v-for="(item, idx) in ParentArr" :key="idx">
                      <td colspan="1">
                        <div class="itemTable2">{{ item.ATT1 }}</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable2">{{ item.ATT1 }}</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="3">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}%&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                      <td colspan="2">
                        <div class="itemTable4">{{ item.ATT1 }}&nbsp;&nbsp;</div>
                      </td>
                    </tr>
                    
                  </table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
     <v-row dense align="center" justify="space-between">
      <v-col cols="12">
        <v-card outlined>
          <v-container fluid>
            <div class="d-flex flex-column justify-center">
              <v-container fluid class="">
                <v-row dense justify="space-start">
                  <v-col cols="4">
                    <p class="font-bold-01">
                      Raw Material Storage
                    </p>
                  </v-col>
                  <v-col cols="8">2</v-col>
                </v-row>
                <v-row dense justify="space-start">
                  <v-col cols="4">Casting Workshop Stock</v-col>
                  <v-col cols="8">4</v-col>
                </v-row>
                <v-row dense justify="space-start">
                  <v-col cols="4">Casting Machine Input</v-col>
                  <v-col cols="8">6</v-col>
                </v-row>
              </v-container>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</v-container>
</template>

<script>
export default {
  name: "location-stock-monitor",
  props: {
    storage: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      ParentArr: [
        {
          ATT1: "TEST",
        },
        {
          ATT1: "TEST",
        },
        {
          ATT1: "TEST",
        },
        {
          ATT1: "TEST",
        },
      ],
      location: "",
      cate_item_code: "",
      ParentTotalObj: {
        TOTAL_LOC: 1,
        EMPTY_LOC: 2,
        USING_LOC: 3,
        USING_PER: 4,
        QTY: 5,
        ITEM_COUNT: 6,
        PALLET_QTY: 7,
      },
    };
  },

  mounted() {},

  computed: {},

  watch: {},

  methods: {
    onClick(str) {
      switch (str) {
        case 'search':

          break;
        case 'print':

          break;
      }
    },
  },
};
</script>

<style scoped>
.abc {
  overflow-x: auto;
}

.itemTable {
  display: flex;
  align-items: right !important;
  justify-content: right !important;
  height: 100% !important;
  width: 100% !important;
  text-align: right !important;
  font-size: 40px;
}

.itemTable3 {
  display: flex;
  align-items: left;
  justify-content: left;
  height: 100% !important;
  width: 100% !important;
  text-align: left;
  font-size: 40px;
}

.itemTable2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100% !important;
  width: 100% !important;
  text-align: center;
  font-size: 15px !important;
  font-weight: bold;
}

.itemTable4 {
  display: flex;
  align-items: right;
  justify-content: right;
  height: 100% !important;
  width: 100% !important;
  text-align: right;
  font-size: 15px !important;
  font-weight: bold;
}

.item {
  display: flex;
  align-items: right;
  justify-content: right;
  height: 100% !important;
  width: 100% !important;
  text-align: right;
  font-size: 15px;
}

.item3 {
  display: flex;
  align-items: left;
  justify-content: left;
  height: 100% !important;
  width: 100% !important;
  text-align: left;
  font-size: 15px;
}

.item2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100% !important;
  width: 100% !important;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
}

.abc ::-webkit-scrollbar {
  background: #fff;
  width: 150px;
  height: 150px;
}
.font-bold-01{
  font-weight: bold;
  font-size: 20px;
}
</style>

<template>
   <v-dialog id="view-einvoice-history-dialog" max-width="800" v-model="dialogIsShow" overlay-opacity="0.1" :origin="origin" :transition="transition" :fullscreen="isMaximized">
    <v-card class="mx-auto" max-width="800" >
      <v-toolbar color="grey" >
        <v-btn icon="mdi-menu"></v-btn>
        <v-toolbar-title>Nhật ký truyền nhận dữ liệu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mdi mdi-close-circle"></v-icon>
      </v-toolbar>

      <v-list lines="three">
        <v-list-item>
          <v-list-item-title>Gửi hóa đơn đến cơ quan thuế để cấp mã hóa đơn</v-list-item-title>
          <v-list-item-subtitle>
            <v-icon class="mdi mdi-eye light-blue--text px-4" ></v-icon>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Ký hiệu: 1C24TFV</v-list-item-title>
          <v-list-item-subtitle>Số: 00000002</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      
      <v-list lines="three" select-strategy="classic">
        <v-list-item value="notifications">
          <v-list-item-title><v-icon class="mdi mdi-arrow-down-bold-circle green--text"></v-icon> 22/08/2024 17:50:18</v-list-item-title> <!--mdi-arrow-up-bold-circle -->
           <v-list-item-title>
            Cơ quan thuế
          </v-list-item-title>
        </v-list-item>
        <v-list-item value="sound">
          <v-list-item-title>[202] Thông điệp thông báo kết quả cấp mã hóa đơn điện tử của cơ quan thuế</v-list-item-title>
          <v-list-item-title>
            Đã cấp mã
          </v-list-item-title>
        </v-list-item>
        <v-list-item value="widgets">
          <v-list-item-title>Mã thông điệp: TCT8BBA1A3EE1D8461DB178E9B4C8B73D30 </v-list-item-title>
          <v-list-item-subtitle>
            <v-icon class="v-icon mdi mdi-download light-blue--text px-4"></v-icon>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<!-- <template>
  <v-card id="view-einvoice-history-dialog">
    <v-layout>
      <v-navigation-drawer
        location="right"
        permanent
      >
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
            subtitle="Logged in"
            title="Jane Smith"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 250px"></v-main>
    </v-layout>
  </v-card>
</template> -->
<script>
import JsonViewer from 'vue-json-viewer'

export default {
  name: "view-einvoice-history-dialog",
  props: {
    data_json: { type: String, default: "" },
  },
  components: {
    'json-viewer' : JsonViewer

  },
  data: () => ({
    dialogIsShow: false,
    isMaximized: false,
    origin: "right right",
    transition: "dialog-transition",
    jsonData: {}
  }),
  created() {  
  },
  computed: {
    limitHeight1() {
      if(this.isMaximized) { 
        return Math.floor(this._calculateHeight(this.windowHeight, 90)); 
      }
      return Math.floor(this._calculateHeight(this.windowHeight,80));
    },
    limitHeight2() {
      if(this.isMaximized) { 
        console.log("isMaximized  ++==>", this.isMaximized);
        return Math.floor(this._calculateHeight(this.limitHeight1, 85)); 
      }
      return Math.floor(this._calculateHeight(this.limitHeight1,90));
    }
  },
  watch: {
    data_json(val) {
            if (val && this.dialogIsShow) {
              this.jsonData = JSON.parse(val);
            }
        },
  },

  methods: {
    minimizeDialog() {
      this.origin = "right bottom"
      this.transition = "scale-transition"
      setTimeout(() => {
        this.dialogIsShow = false
        this.$emit("minimizeDialogPDF")
      }, 100)
    },
    closeDialog() {
      this.dialogIsShow = false
      this.$emit("closeManualDialog")
    },
  },
};
</script>

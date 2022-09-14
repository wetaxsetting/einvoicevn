<template>
  <div id="role-entry-form">
    <v-card outlined v-resize="onResize">
      <v-container fluid>
        <!-- Search & Buttons -->
        <v-row dense align="start" justify="space-between">
          <v-col sm="5" cols="8">
            <v-text-field clearable dense hide-details :label="$t('role_name')" v-model="inputRoleName" @keypress.enter="search"></v-text-field>
          </v-col>
          <v-col sm="1" cols="4">
            <v-checkbox dense hide-details class="mt-0" :label="$t('active')" :color="currentTheme" v-model="activeStatus"></v-checkbox>
          </v-col>
          <v-spacer></v-spacer>
          <v-col sm="3" cols="12" class="text-sm-right text-center">
            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon tile color="success" :disabled="isProcessing" @click="addNew">
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
            <v-btn icon tile color="error" :disabled="isProcessing" @click="markDeleteItems">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- Table -->
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12">
            <DxDataGrid column-resizing-mode="widget" dateSerializationFormat="yyyyMMdd" key-expr="PK" ref="roleGrid"
              :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown"
              :columns="roleTableHeaders" :data-source="roleList" :height="limitHeight" 
              :no-data-text="$t('no_data')" :onRowClick="onRowClick" :onSelectionChanged="onSelectionChanged"
              :selection="{ mode: 'multiple', showCheckBoxesMode: 'none' }" :scrolling="{ mode: 'infinite' }"
              :show-borders="true" :show-column-lines="true" :show-row-lines="true" @row-updated="checkUpdatedItem">
                <DxKeyboardNavigation :edit-on-key-press="true" />
                <DxEditing mode="cell" start-edit-action="dblClick" :allow-updating="true" :select-text-on-edit-start="true" />

                <template #active-template="{ data }">
                  <input class="mx-2" type="checkbox" :checked="data.value === 'Y' ? true : false" @change="valueChanged($event.target.checked, data.column.dataField, data.data.PK)">
                </template>
            </DxDataGrid>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'role-entry',

  data: () => ({
    // Search
    inputRoleName: '',
    activeStatus: true,

    // Table
    roleList: [],
    selectedRowKeys: [],
    isMarked: false
  }),

  computed: {
    limitHeight() { return this.windowHeight - 300 },
    roleTableHeaders() {
      return [
        { dataField: 'ROLE_NM', caption: this.$t('role_name') },
        { 
          dataField: 'USE_YN', 
          caption: this.$t('active'), 
          editCellTemplate: "active-template",
          showEditorAlways: true,
          cssClass: "cell-align-center"
          // allowEditing: false
        },
        { dataField: 'ST_DATE', caption: this.$t('start_date'), dataType: "date", format: this.curLang.DATE_FORMAT },
        { dataField: 'END_DATE', caption: this.$t('end_date'), dataType: "date", format: this.curLang.DATE_FORMAT }
      ]
    }
  },

  methods: {
    search() {
      this.getRoleList([this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? 'Y' : 'N'])
    },

    async getRoleList(paramsData) {
      const dso = { type: "grid", selpro: "SYS_SEL_SYSE002_ROLE", para: paramsData }
      const result = await this._dsoCall(dso, 'select', false)
      this.roleList = result ? result : []
      this.$refs.roleGrid.instance.clearSelection()
    },

    addNew() {
      this.roleList.unshift({ _rowstatus: 'i', PK: this._uniqueID(), ROLE_NM: '', USE_YN: 'N', ST_DATE: '', ST_DATE: '' })
    },

    valueChanged(e, colName, rowPK) {
      const newValue = e ? 'Y' : 'N'
      this.changeValue(newValue, colName, rowPK, true)
    },

    changeValue(value, key, pk, isModified) {
      this.roleList.map((item, index) => {
        if(item.PK === pk) {
          this.$set(item, key, value)
          if(isModified && item.PK && item._rowstatus !== "i") {
            item._rowstatus = "u"
          }
        }
      })
    },

    checkUpdatedItem(e) {
      if(!e.cancel) {
        if(e.data._rowstatus !== "i") {
          e.data._rowstatus = 'u'
        }
      }
    },

    save() {
      this.$refs.roleGrid.instance.saveEditData().then(async () => {
        const dso = {
          type: 'grid',
          selpro: 'SYS_SEL_SYSE002_ROLE',
          updpro: 'SYS_UPD_SYSE002_ROLE',
          para: [ this.inputRoleName ? this.inputRoleName : '', this.activeStatus ? 'Y' : 'N' ],
          elname: [ '_rowstatus', 'PK', 'ROLE_NM', 'USE_YN', 'ST_DATE', 'END_DATE' ],
          requirecol: [ 'ROLE_NM', 'USE_YN' ],
          data: this.roleList
        }
        const result = await this._dsoCall(dso, 'update', true)
        if(result) {
          this.roleList = result
        }
        this.$refs.roleGrid.instance.clearSelection()
      })
    },

    onRowClick(e) {
      if(e.rowType === "data" && e.isSelected && e.data._rowstatus === "d") {
        e.rowElement.classList.remove("dx-selection")
      }
    },

    onSelectionChanged({ selectedRowKeys }) {
      this.selectedRowKeys = selectedRowKeys
    },

    markDeleteItems() {
      this.$refs.roleGrid.instance.cancelEditData().then(() => {
        if(this.selectedRowKeys.length) {
          for (let i = 0; i < this.roleList.length; i++) {
            const role = this.roleList[i]
            for (let j = 0; j < this.selectedRowKeys.length; j++) {
              const item = this.selectedRowKeys[j]
              if(item === role.PK) {
                if(role._rowstatus !== "d") {
                  role._rowstatus = "d"
                  this.setMarkedDeleteRowColor('roleGrid', true, i)
                } else {
                  role._rowstatus = ""
                  this.setMarkedDeleteRowColor('roleGrid', false, i)
                }
              }
            }
          }
        } else {
          this.roleList.forEach((item, index) => {
            if(item._rowstatus === "d") {
              item._rowstatus = ""
              this.setMarkedDeleteRowColor('roleGrid', false, index)
            }
          })
        }
      })
    }
  }
}
</script>

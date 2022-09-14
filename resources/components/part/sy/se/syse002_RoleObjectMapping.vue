<template>
  <div id="role-object-mapping">
    <v-card outlined v-resize="onResize">
      <v-container fluid class="py-0">
        <v-row align="start" justify="space-between">
          <!-- Left Col -->
          <v-col sm="4" cols="12">
            <!-- Role Name List -->
            <v-card raised tile>
              <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="roleGrid"
                :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown"
                :columns="roleTableHeaders" :data-source="roleList" :height="halfHeight"
                :no-data-text="$t('no_data')" :onRowClick="getSelectedRole"
                :paging="{ pageSize: roleList.length }" :selection="{ mode: 'single' }"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true">
              </DxDataGrid>
            </v-card>
            <!-- Divider -->
            <v-divider class="my-4"></v-divider>
            <!-- Menu Treeview -->
            <v-card raised tile :disabled="isLoading2" :loading="isLoading2" :style="`width: 100%; max-height: ${halfHeight}px; overflow-y: scroll;`">
              <v-card-text class="pa-0">
                <v-treeview activatable dense hoverable return-object transition class="pointer" item-key="PK" item-text="FORM_NM" item-children="childMenu" 
                  :active.sync="active" :color="currentTheme" :items="noneLeafMenu" @update:active="getSelectedMenu">
                    <template v-slot:label="{ item, active }">
                      <div @click="active ? $event.stopPropagation() : null">{{ item.FORM_NM }}</div>
                    </template>
                    <template v-slot:prepend="{ item, open }">
                      <v-icon v-if="item.LEAF === 0">
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                      </v-icon>
                      <v-icon v-else>mdi-file</v-icon>            
                    </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Right Col -->
          <v-col sm="8" cols="12">
            <!-- Action Panel -->
            <div class="d-flex flex-row align-center justify-space-between">
              <v-text-field clearable dense hide-details class="mr-2" :label="$t('search_name_or_id')" v-model="inputSearch"></v-text-field>
              <v-select dense hide-details class="mr-2" :items="searchTypeList" v-model="searchType"></v-select>
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="search">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon tile color="success" :disabled="isProcessing" @click="multiAssignMenuToRole">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </div>
            <!-- Table -->
            <v-card raised tile>
              <DxDataGrid column-resizing-mode="widget" key-expr="PK" ref="leafMenuOnlyGrid"
                :allow-column-resizing="true" :column-auto-width="$vuetify.breakpoint.smAndDown"
                :columns="leafMenuOnlyTableHeaders" :data-source="leafMenuOnly" :height="halfHeight - 36" 
                :no-data-text="$t('no_data')" :onSelectionChanged="onSelectionMenu"
                :paging="{ pageSize: leafMenuOnly.length }" :selection="{ mode: 'multiple', showCheckBoxesMode: 'none' }"
                :show-borders="true" :show-column-lines="true" :show-row-lines="true">
              </DxDataGrid>
            </v-card>
            <!-- Divider -->
            <v-divider class="my-4"></v-divider>
            <!-- Action Panel -->
            <div class="d-flex flex-row align-center justify-end">              
              <v-btn icon tile color="error" :disabled="isProcessing" @click="markDeleteItems">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon tile :color="currentTheme" :disabled="isProcessing" @click="save">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </div>
            <v-card raised tile>
              <BaseGridView
                    ref="roleMappingGrid"                   
                    sel_procedure="SYS_SEL_SYSE002_ROLE_MAPPING"
                    upd_procedure="SYS_UPD_SYSE002_ROLE_MAPPING"
                    select_mode="MultipleHideBox"
                    :auto_load="false"
                    :max_height="halfHeight"                   
                    :filter_paras="[this.selectedRole.PK]" 
                    :update_paras="[
                        'PK',
                        'ROLE_PK',
                        'MENU_PK'
                      ]"
                  :header="[  
                   { dataField: 'MENU_CD', caption: this.$t('menu_code'),allowEditing: false },
                   { dataField: 'FORM_NM', caption: this.$t('menu_name'),allowEditing: false },
                   { dataField: 'ROLE_NM', caption: this.$t('role_name'),allowEditing: false }                                                                                                                    
                  ]"           
                  />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import listToTree from "list-to-tree-lite"
export default {
  name: 'role-object-mapping',

  data: () => ({
    // Role Name List
    isLoading1: false,
    roleList: [],
    selectedRole: '',

    // None Leaf Menu
    isLoading2: false,
    noneLeafMenu: [],
    active: [],
    selectedMenu: '',

    // Menu List Leaf Only
    isLoading3: false,
    leafMenuOnly: [],

    // Role - Menu List
    isLoading4: false,
    roleMappingList: [],
    newItemID: 0,

    // deleteProps: {},

    inputSearch: '',
    searchType: 'OBJ_ID',
    selectedMenus: [],
    selectedRoleMappings: []
  }),
  
  mounted() {
    this.getRoleList(['', 'Y'])
    this.getNoneLeafMenu()
  },

  computed: {
    searchTypeList() {
      return [
        { text: this.$t('obj_id'), value: 'OBJ_ID' },
        { text: this.$t('obj_name'), value: 'OBJ_NAME' }
      ]
    },
    limitHeight() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        return this.windowHeight - 260
      } else {
        return this.windowHeight - 300
      }
    },
    halfHeight() { return Math.ceil(this.limitHeight / 2) },
    roleTableHeaders() {
      return [
        { dataField: 'ROLE_NM', caption: this.$t('role_name') }
      ]
    },
    leafMenuOnlyTableHeaders() {
      return [
        { dataField: 'MENU_CD', caption: this.$t('menu_code') },
        { dataField: 'FORM_NM', caption: this.$t('menu_name') },
        { dataField: 'PARENT_NAME', caption: this.$t('parent_menu_name') }
      ]
    },
    roleMappingTableHeaders() {
      return [
        { dataField: 'MENU_CD', caption: this.$t('menu_code') },
        { dataField: 'FORM_NM', caption: this.$t('menu_name') },
        { dataField: 'ROLE_NM', caption: this.$t('role_name') }
      ]
    }
  },

  methods: {
    search() {
      this.getLeafMenuOnly([
        this.selectedRole ? this.selectedRole.PK : '',
        this.searchType === 'OBJ_ID' ? this.inputSearch : '',
        this.searchType === 'OBJ_NAME' ? this.inputSearch : '',
        this.selectedMenu ? this.selectedMenu.PK : 0
      ])
    },

    async getRoleList(paramsData) {
      const dso = { type: "grid", selpro: "SYS_SEL_SYSE002_ROLE", para: paramsData }
      const result = await this._dsoCall(dso, 'select', false)
      this.roleList = result ? result : []
      this.$refs.roleGrid.instance.clearSelection()
    },

    async getNoneLeafMenu() {
      const dso = { type: "grid", selpro: "SYS_SEL_SYSE002_NONE_LEAF_MENU" }
      const result = await this._dsoCall(dso, 'select', false)
      const filteredMenu = result ? listToTree(result, { idKey: 'PK', parentKey: 'P_PK', childrenKey: 'childMenu' }) : []
      this.noneLeafMenu = [...filteredMenu]
    },

    getSelectedRole({ data }) {
      this.selectedRole = data
      this.getLeafMenuOnly([ 
        this.selectedRole.PK, 
        this.searchType === 'OBJ_ID' ? this.inputSearch : '',
        this.searchType === 'OBJ_NAME' ? this.inputSearch : '',
        this.selectedMenu ? this.selectedMenu.PK : 0
      ])
      this.getRoleMapping(this.selectedRole.PK)
    },

    async getLeafMenuOnly(paramsData) {
      const dso = { type: "grid", selpro: "SYS_SEL_SYSE002_LEAF_MENU_ONLY", para: paramsData }
      const result = await this._dsoCall(dso, 'select', false)
      this.leafMenuOnly = result ? result : []
      this.$refs.leafMenuOnlyGrid.instance.clearSelection()
    },

    async getRoleMapping(roleID) {
      this.$refs.roleMappingGrid.loadData();    
    },

    getSelectedMenu() {
      if(!this.selectedRole) {
        return this.showNotification('danger', this.$t('alert'), this.$t('please_select_a_role_fisrt'))
      }
      if(!this.active.length) {
        return this.selectedMenu = ''
      }
      this.selectedMenu = {...this.active[0]}
      this.getLeafMenuOnly([ 
        this.selectedRole.PK, 
        this.searchType === 'OBJ_ID' ? this.inputSearch : '',
        this.searchType === 'OBJ_NAME' ? this.inputSearch : '',
        this.selectedMenu ? this.selectedMenu.PK : 0 
      ])
    },

    onSelectionMenu({ selectedRowsData }) {
      this.selectedMenus = selectedRowsData
    },

    multiAssignMenuToRole() {
      //this.leafMenuOnly = this.leafMenuOnly.filter(x => this.selectedMenus.indexOf(x) == -1);
      
      this.selectedMenus.forEach((item) => {
        this.$refs.roleMappingGrid.addRowStruct({ 
           PK: null, MENU_PK: item.PK, MENU_CD: item.MENU_CD, FORM_NM: item.FORM_NM, ROLE_PK: this.selectedRole.PK, ROLE_NM: this.selectedRole.ROLE_NM 
        });
      })
    },

    async save() {
      this.$refs.roleMappingGrid.saveData(); 
    },

    onSelectionRoleMapping({ selectedRowKeys }) {
      this.selectedRoleMappings = selectedRowKeys
    },

    markDeleteItems() {
      this.$refs.roleMappingGrid.deleteRows();
    }
  }
}
</script>

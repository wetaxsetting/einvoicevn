<template>
  <div>
    <DxTreeView
      id="gw-tree-view"
      ref="treeView"
      :dataStructure="dataStructure"
      :items="myItems"
      :parentIdExpr="dataStructure === 'plain' ? parentKey : ''"
      :keyExpr="keyValue"
      :displayExpr="keyDisplay"
      :width="width"
      :height="height"
      :searchValue="searchValue ? searchValue : ''"
      :searchMode="searchMode"
      :onItemClick="onItemClick"
    />
  </div>
</template>

<script>
export default {
  name: "gw-tree-view",

  props: {
    items: Array,
    dataStructure: {
      type: String,
      default: "tree"
    },
    width: {
      type: [ String, Number],
      default: "100%"
    },
    height: {
      type: [ String, Number ],
      default: 500
    },
    /* Chỉ khai báo props này khi props dataStructure === "plain" */
    parentKey: {
      type: String,
      default: "parentId"
    },
    keyValue: {
      type: String,
      default: "id"
    },
    keyDisplay: {
      type: String,
      default: "text"
    },
    searchValue: String,
    searchMode: {
      type: String,
      default: "contains" // Accepted Values: 'contains' | 'startswith' | 'equals'
    }
  },

  computed: {
    myItems() {
      return this.items;
    },
    treeViewRefs() {
      return this.$refs.treeView;
    },
  },

  methods: {
    onItemClick({ itemData }) {
      this.$emit("onItemClick", itemData);
    }
  }
}
</script>
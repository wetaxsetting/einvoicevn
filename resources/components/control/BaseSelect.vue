<template>
  <v-select
    v-bind="$attrs"
    v-model="my_value"
    dense
    hide-details
    disable-lookup
    :color="currentTheme"
    :error="isError"
    :outlined="curLang.THEME_SUPPORT === 2 || $attrs.hasOwnProperty('outlined') || $attrs.hasOwnProperty('acntoutlined') ? true : false"
    :class="curLang.THEME_SUPPORT === 2 ? 'rounded-0' : ''"
    :clearable="showClearable"
    :background-color="isMandatory ? `yellow lighten-3` : ''"
    :validate-on-blur="rules && rules.length ? true : false"
    :rules="rules"
    :items="itemData"
    @click:prepend-inner="prependIconClick"
  >
    <template v-slot:prepend-item>
      <v-sheet color="white" class="d-flex align-center pa-2" style="position: sticky; top: 0; z-index: 50;" v-if="showSearch">
        <v-sheet width="20%" class="pl-2" v-if="$attrs.hasOwnProperty('multiple')">
          <BaseCheckbox v-model="selectAll" true-value="Y" false-value="N" />
        </v-sheet>
        <v-sheet width="80%">
          <BaseInput :label="$t('search')" v-model="searchInput" />
        </v-sheet>
        <!-- <v-btn icon :color="currentTheme" @click.prevent="onSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->
      </v-sheet>
      <v-divider class="mt-2"></v-divider>
    </template>

    <template v-slot:prepend v-if="showICon">
      <BaseIcon icon_type="list" :icon_size="true" @click="iconclick" />
    </template>

    <template v-slot:append-outer>
      <slot name="append"></slot>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "base-select",
  props: {
    lstData: { type: Array },
    value: { type: [Array, String, Number] },
    text_all: { type: String, default: undefined },
    key_all: { type: String, default: undefined },
    rules: { type: [String, Array], default: undefined },
    checkAll: { type: Boolean, default: false },
  }, //["lstData", "value", "text_all", "key_all", "rules"],

  data() {
    return {
      my_value: "",
      isWatch: false,
      isError: false,
      items: null,
      searchInput: "",
      selectAll: "N",
    };
  },

  computed: {
    showSearch() {
      if (this.$attrs.hasOwnProperty("disableSearch")) {
        if (this.$attrs.disableSearch == "true") {
          return false;
        }
        if (this.$attrs.disableSearch == "false") {
          return true;
        }
        return false;
      }
      return true;
    },
    itemData() {
      if (this.items) {
        return this.items;
      } else {
        let arr = [];
        if (Array.isArray(this.lstData)) {
          arr = [...this.lstData];
        }

        if (this.text_all) {
          let elname = {};
          this.text_all = this.text_all === " " ? "" : this.text_all;
          elname[this.$attrs["item-value"]] = this.key_all ? this.key_all : "";
          elname[this.$attrs["item-text"]] = this.text_all;
          arr.unshift(elname);
        } else {
          if (this.$attrs.hasOwnProperty("null")) {
            let elname = {};
            elname[this.$attrs["item-value"]] = null;
            elname[this.$attrs["item-text"]] = " ";
            arr.unshift(elname);
          }
        }

        if (!this.$attrs.hasOwnProperty("null")) {
          if (arr.length > 0 && this.my_value === "" && !!!this.value) {
            this.$nextTick(() => {
              this.my_value = arr[0][this.$attrs["item-value"]];
            });
          }

          this.$nextTick(() => {
            let idx = -1;
            if (Array.isArray(this.my_value)) {
              arr.forEach((q) => {
                idx = this.my_value.findIndex((x) => x == q[this.$attrs["item-value"]]);
              });
            } else {
              idx = arr.findIndex((x) => x[this.$attrs["item-value"]] == this.my_value);
            }

            if (idx < 0) {
              this.isError = true;
            } else {
              this.isError = false;
            }
          });
        }

        this.items = arr;
        if (this.items.length > 0) {
          if (this.checkAll) {
            this.selectAll = "Y";
          }
        }
        return arr;
      }
    },
    showICon() {
      if (this.$attrs.hasOwnProperty("icon")) {
        if (this.$attrs.icon == "false") {
          return false;
        }
        return true;
      }
      return false;
    },
    showClearable() {
      return false;

      //return this.$attrs.hasOwnProperty('clearable') ? true : false
    },
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") || (this.rules != null && this.rules) ? true : false;
    },
    itemValue() {
      return this.$attrs["item-value"];
    },
    itemText() {
      return this.$attrs["item-text"];
    },
  },
  mounted() {
    if (this.value) {
      this.my_value = this.value;
    } else {
      this.my_value = "";
    }
    this.isWatch = true;
  },
  watch: {
    value(val) {
      if (this.value) {
        this.my_value = this.value;
      } else {
        this.my_value = "";
      }
    },
    my_value(val) {
      if (this.isWatch) {
        this.$emit("input", this.my_value);
        this.$emit("change", this.my_value);
      }
    },
    lstData(val) {
      let flag = false;

      if (val) {
        const idx = val.findIndex((x) => x[this.$attrs["item-value"]] == this.my_value);
        if (idx < 0) {
          flag = true;
        }
      }

      this.items = null;
      if (this.value && !flag) {
        this.my_value = this.value;
      } else {
        //this.my_value = "";
      }
    },
    searchInput(val) {
      this.onSearch();
      /* if (!val) {
        this.onSearch();
      } */
    },
    selectAll() {
      if (this.$attrs.hasOwnProperty("multiple"))
        if (this.selectAll == "Y") {
          let tempArr = [];
          this.itemData.forEach((e) => {
            tempArr.push(e[this.$attrs["item-value"]]);
          });
          this.my_value = tempArr;
        } else {
          this.my_value = [];
        }
    },
  },

  methods: {
    prependIconClick(event) {
      this.$emit("click:prepend-inner", event);
    },
    iconclick() {
      this.$emit("iconclick");
    },
    onSearch() {
      const filterList = this.lstData.filter((item) => {
        if (this.vn_to_en(item[this.itemText].toLowerCase()).includes(this.searchInput ? this.vn_to_en(this.searchInput.toLowerCase()) : "")) {
          return true;
        }
      });
      this.items = filterList ? [...filterList] : [];
      if (this.text_all) {
        let elname = {};
        this.text_all = this.text_all === " " ? "" : this.text_all;
        elname[this.$attrs["item-value"]] = this.key_all ? this.key_all : "";
        elname[this.$attrs["item-text"]] = this.text_all;
        this.items.unshift(elname);
      }
    },
  },
};
</script>

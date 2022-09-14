<template>
  <div :class="isNumber ? 'numberRight' : ''">
    <v-text-field
      ref="baseInput"
      v-bind="$attrs"
      v-model="formatValue"
      dense
      :color="currentTheme"
      :hide-details="showDetails ? false : true"
      :outlined="
        themesuport === 2 ||
        $attrs.hasOwnProperty('outlined') ||
        $attrs.hasOwnProperty('acntoutlined')
          ? true
          : false
      "
      :class="themesuport === 2 ? 'rounded-0' : ''"
      :clearable="showClearable"
      :background-color="
        bgcolor
          ? bgcolor
          : isReadonly
          ? 'grey lighten-2'
          : isMandatory
          ? 'yellow lighten-3'
          : ''
      "
      :validate-on-blur="rules && rules.length ? true : false"
      :error="error"
      :rules="rules"
      :suffix="suffix"
      @blur="onBlur"
      @click="emitOnclick"
      @dblclick="emitOnDblClick"
      @keypress.enter="emitOnKeyPress"
    >
      <template v-slot:prepend v-if="showICon">
        <BaseIcon icon_type="input" :icon_size="true" />
      </template>
      <template v-slot:append>
        <slot name="append"></slot>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: "base-input",
  props: [
    "value",
    "rules",
    "key_name",
    "bgcolor",
    "precision",
    "suffix",
    "error",
    "template",
  ],

  data() {
    return {
      my_value: null,
      isWatch: false,
      isLeave: false,
      timeOnChange: 100,
      timeOut: null,
      onChange: false,
      themesuport: 1,
    };
  },

  mounted() {
    this.my_value = this.value;
    this.isWatch = true;
    this.isLeave = true;

    this._processTheme();
  },

  computed: {
    showClearable() {
      if (this.$attrs.hasOwnProperty("readonly")) {
        return false;
      }

      if (this.$attrs.hasOwnProperty("number")) {
        return false;
      }

      if (
        this.$attrs.hasOwnProperty("clearable") &&
        this.$attrs["clearable"] == false
      ) {
        return false;
      }

      if (this.$attrs.hasOwnProperty("disabled")) {
        try {
          if (String(this.$attrs.disable) === "true") {
            return false;
          } else {
            return true;
          }
        } catch (error) {}
      }
      return true;
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
    isMandatory() {
      return this.$attrs.hasOwnProperty("mandatory") || (this.rules != null && this.rules )? true : false;
    },
    isReadonly() {
      return this.$attrs.hasOwnProperty("readonly") ? true : false;
    },
    isNumber() {
      if (this.$attrs.hasOwnProperty("number")) return true;
      return false;
    },
    formatValue: {
      get: function() {
        if (this.$attrs.hasOwnProperty("number")) {
          try {
            if (this.isLeave) {
              let precision = this.precision;

              if (this.$attrs.number > 0) precision = this.$attrs.number;

              if (  this.my_value == null || this.my_value === "" || isNaN(this.my_value) ) {
                return "";
              }
              var n1 = parseFloat(this.my_value)
                .toFixed(precision)
                .toString();
              var x = n1.split(".");
              var x1 = x[0];
              var x2 = x.length > 1 ? "." + x[1] : "";
              return x1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + x2;
            } else return this.my_value;
          } catch {}
          return null;
        } else {
          return this.my_value;
        }
      },
      set: function(newValue) {
        this.isLeave = false;

        if (this.$attrs.hasOwnProperty("number")) {
          if (newValue === "" || newValue == null) {
            this.my_value = "";
          } else {
            this.my_value = Number((newValue + "").replace(/[^0-9\.]/g, ""));
          }
        } else {
          this.my_value = newValue;
        }
        return this.my_value;
      },
    },
    showDetails() {
      return this.$attrs.hasOwnProperty("showDetails") ? true : false;
    },
  },

  watch: {
    value(val) {
      if (val !== this.my_value) this.my_value = val;
    },
    my_value(val) {
      if (this.isWatch) {
        if (this.value == undefined || val !== this.value) {
          this.processChangeValue(val);
        }
      }
    },
  },

  methods: {
    processChangeValue(val) {
      if (this.timeOut == null) {
        this.timeOut = window.setTimeout(this._onChanged, this.timeOnChange);
      } else {
        clearTimeout(this.timeOut);
        this.$nextTick(() => {
          this.timeOut = window.setTimeout(this._onChanged, this.timeOnChange);
        });
      }
    },

    _onChanged() {
      this.timeOut = null;
      this.$emit("input", this.my_value);
      this.$emit("changed", this.my_value);
      this.$emit("change", this.my_value, this.key_name);
    },

    emitOnclick(val) {
      this.$emit("click", val);
    },
    emitOnKeyPress(val) {
      this.$emit("keyPressEnter", val);
    },
    emitOnDblClick(val) {
      this.$emit("dblClick", val);
    },
    onBlur() {
      this.isLeave = true;
    },
    _processTheme() {
      try {
        if (this.curLang.THEME_SUPPORT > 0) {
          this.themesuport = this.curLang.THEME_SUPPORT;
        } else {
          this.themesuport = 1;
        }
      } catch (error) {
        this.themesuport = 1;
      }

      // test theme
      // this.themesuport = 2;
    },
    focus() {
      this.$refs.baseInput.focus();
    },
  },
};
</script>

<style scoped>
.right-input > div > div > div > input {
  text-align: right;
}
</style>

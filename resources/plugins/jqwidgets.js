import Vue from "vue"
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css"
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue"
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import JqxMaskedInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmaskedinput.vue";
import JqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
import JqxExpander from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxexpander.vue';


Vue.component('jqxgrid', JqxGrid)
Vue.component('jqxmenu', JqxMenu)
Vue.component('JqxMaskedInput', JqxMaskedInput)
Vue.component('JqxTree', JqxTree)
Vue.component('JqxExpander', JqxExpander)
<template>
  <v-row no-gutters>
    <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t(label)" :lstData="lstData" v-model="selectedOrg"
        prepend-inner-icon="mdi-microsoft-xbox-controller-menu" @click:prepend-inner="openOrgList"
    > </BaseSelect>
    <OrganizationDialog ref="orgDialog" :height="400" @callback="callbackOrg"></OrganizationDialog>
  </v-row>
</template>

<script>
import moment from "moment";
import OrganizationDialog from '@/components/dialog/OrganizationDialog.vue';

export default {
    name: "hr-org",
    props: {
        lstData:{
            type: Array,
            default: []
        },
        value:{
            type: Number,
            default: null,
        },
        label: {
            type: String,
            default: 'org',
        }
    },
    components: { 
        OrganizationDialog,
    },
    data: () => ({
        selectedOrg: null,
        selectedCompany:null,
    }),

    watch: {
        value(val){
            this.selectedOrg = val;
        },
        selectedOrg(val) {
            this.$emit("input", val);
            if(val) {
                let selOrg = this.lstData.find( q=> q["PK"]  == val );
                if( this.selectedCompany == selOrg["TCO_COMPANY_PK"]) return;
                this.selectedCompany = selOrg["TCO_COMPANY_PK"];
                this.$emit('orgchanged', val, selOrg);
            }
            
            
        }
    },

    methods: {
        openOrgList(){
          this.$refs.orgDialog.dialogIsShow = true;
        },
        callbackOrg(data) {
            if(data) {
                this.selectedOrg = data.PK;
            }
        },
    }
};
</script>

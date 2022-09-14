<template>
  <v-container fluid class="px-0 pt-0"  v-resize="onResize">
      <v-row no-gutters align="start" justify="center">
          <v-col cols="12" :lg="search_yn ? 3 : 0" class="px-1 py-1" v-show="search_yn">
            <BaseSelect :outlined="true"   item-value="PK" item-text="TEXT" :label="$t('company')" :lstData="companyList" v-model="selectedCompany" class="px-1"> </BaseSelect>
            <BaseGridView :headertype="1" ref='idGrid' :height="limitHeight" :header="header1" ></BaseGridView>
          </v-col>
          <v-col cols="12" :lg="search_yn ? 9 : 12" class="px-1 py-1">
            <v-row no-gutters  class="px-1 py-1">
                <BaseButton btn_type="default" icon_type="hide" :btn_text="$t('hide')" v-if="search_yn" mdi-icon="mdi-backburger" @onclick="search_yn = !search_yn" />
                <BaseButton btn_type="default" icon_type="show" :btn_text="$t('show')"   v-else mdi-icon="mdi-forwardburger" @onclick="search_yn = !search_yn" />

                <v-spacer></v-spacer>

                <BaseButton btn_type="default" icon_type="reset" :btn_text="$t('reset')"  @onclick="onProcessConfirm('RESET')" v-bind:disabled.sync="isProcessing" />
                <BaseButton btn_type="default" icon_type="save" :btn_text="$t('save')"  @onclick="onProcessConfirm('SAVE')" v-bind:disabled.sync="isProcessing" />
                <BaseButton btn_type="default" icon_type="delete" :btn_text="$t('delete')"  @onclick="onProcessConfirm('DELETE')" v-bind:disabled.sync="isProcessing" />
            </v-row>
            <v-row no-gutters>
                <v-col cols="12" lg="4" class="px-1 py-1"> 
                    <BaseInput :outlined="true"   :label="$t('notification_title')" v-model="data.TITLE" ></BaseInput>
                </v-col>
                <v-col cols="12" lg="2" class="px-1 py-1"> 
                    <BaseSelect :outlined="true"   item-value="CODE" item-text="NAME" :label="$t('notification_type')" :lstData="notifyTypes" v-model="data.TYPE" > </BaseSelect>
                </v-col>
                <v-col cols="12" lg="2" class="px-1 py-1"> 
                    <BaseSelect :outlined="true"   item-value="CODE" item-text="NAME" :label="$t('schedule')" :lstData="scheduleTypes" v-model="data.SCHEDULE_TYPE" > </BaseSelect>
                </v-col>
                <v-col cols="12" lg="4" class=""> 
                    <v-row no-gutters align="center" justify="start">
                        <BaseDatePicker v-model="data.NOTIFY_DATE"  outlined default :label="$t('date_time')" class="px-1 py-1"></BaseDatePicker>
                        <JqxMaskedInput  :mask="'##:##'" v-model="data.NOTIFY_TIME" :height="40" :label="$t('time')"> </JqxMaskedInput>
                    </v-row>
                </v-col>
            </v-row>
            <v-row no-gutters  class="px-1 py-1">
                <GwHtmlEditor :imageFromLocal="true" :height="limitHeight2" v-model="data.BODY"  />
            </v-row>
            
          </v-col>
      </v-row>
   
  </v-container>  
</template> 






<script>
import GwHtmlEditor from '@/components/control/GwHtmlEditor';
  export default {
    layout: 'default',
    middleware: 'user',

    components: { 
        GwHtmlEditor
    },

    data: () => ({
        selectedCompany: null,
        header1:[],
        companyList:[],
        notifyTypes:[],
        scheduleTypes:[],
        search_yn: true,
        data:{
            TITLE: null,
            TYPE: null,
            SCHEDULE_TYPE:null,
            NOTIFY_DATE:null,
            BODY:null
        }
    }),

    computed:
    {
      user: function()
      {
          return this.$store.getters["auth/user"];
      },
      limitHeight() { return this.windowHeight - 140},
      limitHeight2() { return this.windowHeight - 210},
     
    },

    created() {
        this.createHeader();
    },


   
    methods: {
        async prepareCommonData(){
            this.companyList = await  this._getCompany();
            
            this.notifyTypes = [
                { CODE: '01' , NAME: this.$t('annoucement') },
            ];

            this.scheduleTypes = [
                { CODE: '01' , NAME: this.$t('date') },
                //{ CODE: '02' , NAME: this.$t('daily') },
                //{ CODE: '03' , NAME: this.$t('monthly') },
            ];

        },

        async createHeader(){

            await this.prepareCommonData();

            this.header1 = [
                { title: this.$t("title"), field: "TITLE", type: "", width: 250 },
                { title: this.$t("time"), field: "TIME", type: "", width: 120 },
            ];

        },
    } 


  }
</script>

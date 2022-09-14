<template>
<div class="d-flex align-center justify-space-between">
    <v-text-field outlined :label="label" dense hide-details prepend-inner-icon="mdi-file-link" readonly v-model="fileName" @click="selectFile"></v-text-field>
    <BaseButton btn_type="icon" icon_type="import" :btn_text="$t('import')" @onclick="onImpFile" />
    <BaseButton btn_type="icon" icon_type="excel" :btn_text="$t('template_file')" @onclick="getImpFile" />
    <input type="file" v-show="false" ref="file" @change="selectedFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
</div>
</template>

<script>
export default {
    name: 'GwImportExcelFile',

    props: {
        impTempFile: String,
        label: String,
        impProc: String,
        impAddParam: {
            type: Array,
            default:[]
        },
        impStartRow: {
            type: Number,
            default: 0
        }, 
        impEndCol: {
            type: Number,
            default: 0
        },
        impValidate: String,
        impSeqTime: {
            type: Boolean,
            default: false
        },
        impTable: {
            type: String,
            default: 'TES_FILE'
        },
        
    },

    data: () => ({
        file: null,
        fileSave: null,
        fileName: "",
        pkImportFile: 0
    }),

    computed: {
        getUser: function () {
            return this.$store.getters["auth/user"];
        },
    },

    methods: {
        selectFile() {
            this.$refs.file.click();
        },

        selectedFile(event) {
            const files = event.target.files;
            // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 71 > selectedFile > files', files);
            if (files[0] !== undefined) {
                const fr = new FileReader();

                fr.readAsDataURL(files[0]);
                fr.addEventListener('load', () => {
                    this.file = fr.result;
                    this.fileSave = files[0];
                    this.fileName = this.fileSave.name;
                });
                // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 74 > selectedFile > fr', fr);
            }
        },

        async getImpFile() {
            const res = await this.$axios.$get('/dso/downloadtemp', {
                responseType: "blob",
                params: {
                    template: this.impTempFile
                }
            });
            if (!!res && res.size > 0) {
                try {
                    let blob = new Blob([res], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    let _gettime = new Date().getTime();
                    const filenameSplit = this.impTempFile.split("/");
                    const filename = this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0]+'_'+ this.getUser.USER_ID + '.xlsx';
                    // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 95 > getImpFile > filename', filename);
                    this._ExcelSaveAs(blob, filename)

                } catch (e) {
                    this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
                }
            } else {
                this.showNotification("danger", this.$t("cannot_find_template"), "", 3001);
            }
        },

        async onImpFile() {
            if (this.impValidate) {
                this.showNotification("danger", this.impValidate, "", 3001);
            } else {
                if (this.fileSave) {
                    let sProd = "sys_upd_file";
                    if(this.impTable == "TAC_FILES")
                    {
                        sProd = "AC_UPD_FILES";
                    } 
                    // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 111 > onImpFile > fileSave', this.fileSave);
                    let params = [
                        0, //p_tes_file_pk
                        this.impTable, //p_table_name
                        '', //p_master_table
                        0 //p_master_table_pk
                    ];
                    const formatData = new FormData();
                    formatData.append('file', this.fileSave);
                    formatData.append('proc', sProd);
                    formatData.append('para', JSON.stringify(params));
                    // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 121 > onImpFile > formatData', formatData);

                    const res = await this.$axios({
                        method: 'post',
                        url: '/dso/uploadfile',
                        data: formatData
                    });
                    // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 127 > onImpFile > res', res);
                    //  console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 134 > onImpFile > res.data.data', res.data.data);
                    if (res.data.data) {

                        this.showNotification("success", this.$t("impProcess_success", "common"), "");
                        this.fileSave = null;
                        let rtnKeys = Object.keys(res.data.data);
                        // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 130 > onImpFile > rtnKeys', rtnKeys);
                        if (rtnKeys.includes("p_rtn_cur")) {
                            if (res.data.data.p_rtn_cur[0].PK > 0) {
                                this.pkImportFile = res.data.data.p_rtn_cur[0].PK;
                            }
                        } else {
                            if (res.data.data[0].PK > 0) {
                                this.pkImportFile = res.data.data[0].PK;
                            }
                        }

                        if (this.pkImportFile > 0) {
                            //Start import data
                            this.onImportData(this.pkImportFile);
                        }

                    } else {
                        this.showNotification("danger", this.$t("error_occurs", "common"), "");
                    }
                }
            }
        },

        async onImportData(_table_pk) {
            let import_info = {
                proc: this.impProc,
                start_row: this.impStartRow,
                end_col: this.impEndCol,
                add_params: this.impAddParam ? this.impAddParam : []
            };
            // const result = await this.$axios.$get(url_path, {
            //             responseType: "blob",
            //             params: {
            //                 para: param
            //             }
            //         });
            //         if (result) {
            //             this._ExcelSaveAs(result, file_nm);
            //         } else {
            //             this.showNotification("danger", this.$t("fail_to_export_report"), "", 4000);
            //         }

            const resultFile = await this.$axios.$get('/dso/importexcelfile', {responseType: "blob",
                params: {
                    table_pk: _table_pk, 
                    table_nm: this.impTable,
                    import_info: JSON.stringify(import_info)
                }
            });
            // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 175 > onImportData > resultFile', resultFile);
           if (resultFile) {
                try {
                    let _gettime = new Date().getTime();
                    const filenameSplit = this.impTempFile.split("/");
                    const filename = 'result_'+this.filterItems(filenameSplit, '.xlsx')[0].split(".")[0]+'_'+_gettime + '.xlsx'; 
                    this._ExcelSaveAs(resultFile, filename)
                    this.$emit('onAfterImport', true);
                } catch (e) {
                    this.showNotification("danger", this.$t("import_fail"), "", 3001);
                }
            } else {
                this.showNotification("danger", this.$t("import_fail"), "", 3001);
            }

            //   if (res) {
            //     // console.log('vng-154-dvg^_^: > file: GwImportExcelFile.vue > line 181 > onImportData > res', res);
            //     // this.showNotification("success", `${this.$t("import_success", "common")} ${res.data} ${this.$t("rows_effeted", "common")}`, "");  
            //     this.file = null;
            //     this.fileSave = null;
            //     this.fileName = "";
            //     this.pkImportFile = 0;
            //     //this.$emit('onReturnMsg', res);
            //     this._ExcelSaveAs(res, "FILENAMESSSS.xlsx")
            //   } else {
            //     this.showNotification("danger", this.$t("import_fail", "common"), "");
            //   }
        },
    }
}
</script>

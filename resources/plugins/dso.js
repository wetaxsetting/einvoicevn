import Vue from "vue";
Vue.mixin({
    data: () => ({
        isProcessing: false,
        POPUP_ERROR_DELAY: 60 * 1000, //60 SECOND ==> ms.Tuyen Phan req down to
        SECOND_DB_YN: null
    }),
    methods: {
        async _getCommonCode(p_parent_code, p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code",
                para: [p_tco_company_pk, p_parent_code],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getCommonCode2(p_parent_code, p_tco_company_pk = 0, p_name_code = false) {
            this._setSecondDBStstus();
            let commonList = [];
            let _para = [p_tco_company_pk, p_parent_code.join(",")];

            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code21",
                para: _para,
                dbname: this.SECOND_DB_YN
            });
            if (res) {
                if (res.data.length > 0) {
                    p_parent_code.forEach((x) => {
                        let codes = res.data.filter((q) => q.PARENT_CODE === x);

                        if (p_name_code) {
                            codes.map((w) => {
                                w.NAME = w.CODE + " - " + w.NAME;
                            });
                        }

                        commonList.push(codes ? codes : []);
                    });
                }
            }

            return commonList;
        },
        async _getCommonCode3(p_parent_code = 0, p_name_code = false) {
            this._setSecondDBStstus();
            let commonList = [];
            let _para = [p_parent_code.join(",")];

            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code22",
                para: _para,
                _db2: this.SECOND_DB_YN
            });
            if (res) {
                if (res.data.length > 0) {
                    p_parent_code.forEach((x) => {
                        let codes = res.data.filter((q) => q.PARENT_CODE === x);

                        if (p_name_code) {
                            codes.map((w) => {
                                w.NAME = w.CODE + " - " + w.NAME;
                            });
                        }

                        commonList.push(codes ? codes : []);
                    });
                }
            }

            return commonList;
        },
        async _getHRCode(p_parent_code, p_tco_company_pk = 0, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_hr_code",
                para: [p_tco_company_pk, p_parent_code, p_tco_busplace_pks ? p_tco_busplace_pks : ''],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getHRCode2(p_parent_code, p_tco_company_pk = 0, p_name_code = false, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let commonList = [];
            let _para = [p_tco_company_pk, p_parent_code.join(","), p_tco_busplace_pks ? p_tco_busplace_pks : ''];

            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_hr_code21",
                para: _para,
                dbname: this.SECOND_DB_YN
            });
            if (res) {
                if (res.data.length > 0) {
                    p_parent_code.forEach((x) => {
                        let codes = res.data.filter((q) => q.PARENT_CODE === x);

                        if (p_name_code) {
                            codes.map((w) => {
                                w.NAME = w.CODE + " - " + w.NAME;
                            });
                        }

                        commonList.push(codes ? codes : []);
                    });
                }
            }

            return commonList;
        },

        async _getDocType() { //p_tco_company_pk = 0
            const dso = {
                type: 'process',
                updpro: "ea_pro_1310010_doc_type",
                para: null//[p_tco_company_pk]
            }

            const result = await this._dsoCall(dso, 'process', false)
            if (result) {
                return result;
            } else {
                return [];
            }
        },

        async _getCustomField(p_user_pk, p_tco_company_pk, p_menu_cd, p_tab_id = '', p_grid_id = '', p_cus_para = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_FORM_CUSTOM_FIELD",
                para: [p_user_pk, p_menu_cd, !!p_tab_id ? p_tab_id : "", !!p_grid_id ? p_grid_id : ""],
                dbname: this.SECOND_DB_YN
            });

            if (res.data && res.data.length > 0) {
                let datas = res.data;
                const promises = datas.map(async (x) => {
                    if (x.FIELD_TYPE == "LIST") {
                        if (!!x.TCO_COMMCODE) {
                            x["dataSource"] = await this._getCommonCode(x.TCO_COMMCODE, p_tco_company_pk)
                        } else {
                            x["dataSource"] = await this._callProcedure(x.PROCEDURE_NAME, p_cus_para);
                        }

                    }
                });
                await Promise.all(promises);

                // console.log(datas);

            }



            return res.data ? res.data : [];
        },

        async _getDataList(p_procedure, p_param = []) {
            let dso = {};
            if (p_param.length == 0) {
                dso = {
                    type: "list",
                    selpro: p_procedure,
                };
            } else {
                dso = {
                    type: "list",
                    selpro: p_procedure,
                    para: p_param,
                };
            }
            const res = await this._dsoCall(dso, "select", false);
            if (res) {
                return res;
            } else {
                return [];
            }
        },

        async _getReportList(p_menu_cd, p_tab, p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "hr_sel_report_list_nocache",
                para: [p_tco_company_pk, p_menu_cd, p_tab],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getCostCenter(p_tco_company_pk = 0, p_plc_pk, p_plc_cd_nm) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "hr_sel_cost_center",
                para: [p_tco_company_pk, p_plc_pk, p_plc_cd_nm],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getSalarySecurity(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_pro_salary_display",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });
            if (res.data) return res.data[0].SALARY_SECURITY;
            return "N";
        },
        async _getSalaryPeriodByMonth(p_tco_company_pk = 0, p_work_mon) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_pro_get_sal_period_by_mon",
                para: [p_tco_company_pk, p_work_mon],
                dbname: this.SECOND_DB_YN
            });
            
            return res.data ? res.data : [];
        },
        async _getAllFactory(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByUsery(p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "gsf20_lg_sys_get_factory",
                para: [p_user_pk, p_pr_level],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByCompanyUser(p_tco_company_pk = 0, p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory_by_com_user",
                para: [p_tco_company_pk, p_user_pk, p_pr_level],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWHTree(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_wh_tree",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrg(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_org",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrgByUser(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_org_user",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkGroup(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WG_NOCACHE",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkGroupByBiz(p_tco_company_pk = 0, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WG_BIZ",
                para: [p_tco_company_pk, p_tco_busplace_pks],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getDepositAccount(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_deposit_account",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkShift(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WS_NOCACHE",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getBank(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_bank",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getTransTypeList(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_trans_type",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExChangRateList(p_tco_company_pk = 0, p_date) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_ex_rate",
                para: [p_tco_company_pk, p_date],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemgrpByGroupType(p_group_type = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_itemgrp_by_group_type",
                para: [p_group_type],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getUOM(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_uom",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemGroup(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_item_group",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExchangeRate(p_date, p_tco_company_pk, p_ccy, p_type = "date") {
            this._setSecondDBStstus();
            if (p_type == "month") {
                let res_m = await this.$axios.$post("dso/callproc", {
                    proc: "AC_PRO_GET_MONTH_RATE",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    dbname: this.SECOND_DB_YN
                });
                if (res_m.data.length > 0) {
                    return res_m.data[0].EX_RATE;
                }
            } else {
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "ac_pro_getrate",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    dbname: this.SECOND_DB_YN
                });
                if (res.data.length > 0) {
                    return res.data[0].EX_RATE;
                }
            }

            return 1;
        },
        async _getCompany() {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_company",
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getCompanyByUser(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_company",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getBizPlaceByCompany(p_tco_company_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place",
                para: [p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getBizPlaceBuUser(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place_user",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _callProcedure(p_proc, p_para, dbcommon) {
            console.log("_callProcedure-dbcommon:", dbcommon)
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: p_proc,
                para: p_para,
                dbname: dbcommon ? dbcommon : this.SECOND_DB_YN
            });
            if (res.data && res.data.length > 0) {
                if (res.data[0].ERRCODE) {
                    if (res.data[0].ERRMSG) {
                        this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                    } else {
                        this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                    }
                    return [];
                }
            }
            return res.data ? res.data : [];
        },
        async _execSQL(p_sql, p_para = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/execsql", {
                sql: p_sql,
                para: p_para,
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        _setSecondDBStstus() {
            if (this._secondDBMenu.some(item => item.FORM_URL == this.$root._route.fullPath)) {
                this.SECOND_DB_YN = 'common';
            }
        },
        async _dsoCall(dso, action = "update", notice = true, acntStyle = '', p_check_db2 = "Y") {
            // console.log("_dsoCall:", dso)
            if (p_check_db2 == "Y") {
                this._setSecondDBStstus();
            } else {
                this.SECOND_DB_YN = 'N';
            }
            if(dso.dbname === "common") {
                this.SECOND_DB_YN = 'common';
            }

            /* dso = {
                      type:'grid|control|process|list'
                      selpro:'ac_sel_6010010_grid',
                      updpro:'ac_upd_6010010_grid',
                      para: para,   //type array[]
                      elname: elname,   //type array[]
                      requirecol: require column //type array[]
                      data: data,  //array json
                  } */
            return await this.dsoCall(dso, action, notice, acntStyle);
        },
        async dsoCall(dso, action, notice, acntStyle = '') {
            try {
                let res = null;
                if (dso.para) {
                    for (let i = 0; i < dso.para.length; i++) {
                        if (dso.para[i] == "null" || dso.para[i] === null || dso.para[i] === undefined) {
                            dso.para[i] = "";
                        }
                        dso.para[i] = typeof dso.para[i] === "string" ? dso.para[i].replace(/\'/g, "''") : dso.para[i];
                    }
                }
                if (action === "select") {
                    this.isProcessing = true;
                    const para = {
                        proc: dso.selpro,
                        para: dso.para,
                        dbname: this.SECOND_DB_YN
                    }
                    res = await this.$axios.$post("dso/callproc", para);

                    this.isProcessing = false;
                    if (res.success == false) {
                        let msg = this.$t(res.message);
                        this.handlingErrorMessage(res.message, '', acntStyle, notice);
                        if (res.message == "your_session_timeout_logout_and_login_to_continue") {
                            this.$store.dispatch("auth/logout");
                            alert(msg);
                            window.location.href = "/login";
                        }
                        return null;
                    } else if (res.data && res.data.length > 0) {
                        if (res.data[0].ERRCODE) {
                            if (res.data[0].ERRMSG) {
                                this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                            } else {
                                this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                            }
                            return null;
                        }
                    }

                    if (res.data) {
                        res.data.forEach((e) => {
                            e._rowstatus = "";
                        });
                    } else {
                        return this.showNotification("warning", this.$t("no_data_found"), "", 3000);
                    }
                    // if (notice) {
                    //     this.showNotification("success", this.$t("get_data_success"), "");
                    // }
                    if (dso.type === "control") {
                        if (res.data.length > 0) return res.data[0];
                    }
                    //console.log(res.data)
                    return res.data;
                } else {
                    // Insert/Update/Delete
                    if (dso.type === "control") {
                        this.isProcessing = true;

                        if (dso.requirecol) {
                            for (let i = 0; i < dso.requirecol.length; i++) {
                                let cell = eval(`dso.data.` + dso.requirecol[i]);
                                if (cell === null || cell === "" || cell === undefined) {
                                    return this.showNotification(acntStyle ? "warning" : "danger", `Field ${this.$t(dso.requirecol[i].toLowerCase())} must not empty!`, "", this.POPUP_ERROR_DELAY);
                                }
                            }
                        }

                        if (dso.data._rowstatus) {
                            const result = await this.delayedDataProcess(dso.data, dso);
                            if (!result) {
                                return null;
                            } else {
                                res = await this.$axios.$post("dso/callproc", {
                                    proc: dso.selpro,
                                    para: dso.para1 ? dso.para1 : [dso.data.PK],
                                    dbname: this.SECOND_DB_YN
                                });
                                let rtn = null;
                                if (res.success == false) {
                                    this.handlingErrorMessage(res.message, '', acntStyle);
                                    // return this.showNotification(
                                    //     "danger",
                                    //     res.message,
                                    //     "",
                                    //     this.POPUP_ERROR_DELAY
                                    // );
                                }
                                if (res.data.length > 0) {
                                    res.data[0]._rowstatus = "";
                                    rtn = res.data[0];
                                } else {
                                    rtn = this._initObject(dso.elname);
                                }
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }

                                return rtn;
                            }
                        } else {
                            this.showNotification("danger", this.$t("missing_rowstatus"), "");
                        }
                    } else if (dso.type === "grid") {
                        if (dso.requirecol) {
                            for (let i = 0; i < dso.requirecol.length; i++) {
                                for (let j = 0; j < dso.data.length; j++) {
                                    let cell = eval(`dso.data[${j}].` + dso.requirecol[i]);
                                    if ((cell === null || cell === "" || cell === undefined) && (dso.data[j]._rowstatus == "i" || dso.data[j]._rowstatus == "u")) {
                                        return this.showNotification(acntStyle ? "warning" : "danger", `Field ${this.$t(dso.requirecol[i].toLowerCase())} at row ${j + 1} must not empty!`, "", this.POPUP_ERROR_DELAY);
                                    }
                                }
                            }
                        }
                        let paras = [];
                        for (let i = 0; i < dso.data.length; i++) {
                            let item=dso.data[i];
                            //console.log(item)
                            if (item._rowstatus) {
                                let para = [];
                                for (let j = 0; j < dso.elname.length; j++) {
                                    let val;
                                    if (dso.elname[j] == "ADDDITION_PARA") {
                                        val = item.ADDDITION_PARA;
                                    } else {
                                        try {
                                            val = item[dso.elname[j]];
                                        } catch (ex) {
                                            val = "";
                                        }
                                    }
                                    if (val == "null" || val == undefined || val == null) {
                                        val = "";
                                    }
                                    val = typeof val === "string" ? val/*.replace(/\'/g, "''")*/.replace(/\?/g, "\?") : val;
                                    para.push(val);
                                }
                                paras.push(para);
                            }
                        }
                        this.isProcessing = true;
                        res = await this.$axios.$post("dso/bulkinsertpro", { /// bulkinsertpro
                            proc: dso.updpro,
                            para: paras,
                            dbname: this.SECOND_DB_YN
                        });
                        if (res.success == false) {
                            this.handlingErrorMessage(res.message);
                            return null;
                        } else if (res.data.length > 0 && res.data[0].ERRCODE) {
                            if (res.data[0].ERRMSG) {
                                this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                            } else {
                                this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                            }
                            return null;
                        } else if (res.data.length > 0 && res.data[0][0].ERRCODE) {
                            if (res.data[0][0].ERRMSG) {
                                this.showNotification("danger", this.$t(res.data[0][0].ERRCODE) + " [" + res.data[0][0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                            } else {
                                this.showNotification("danger", this.$t(res.data[0][0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                            }
                            return null;
                        }else if (res.success == true) {
                            if (dso.selpro) {
                                res = await this.$axios.$post("dso/callproc", {
                                    proc: dso.selpro,
                                    para: dso.para,
                                    para_extra: dso.para_extra,
                                    dbname: this.SECOND_DB_YN
                                });
                                if (res.success == false) {
                                    this.handlingErrorMessage(res.message, '', acntStyle);
                                    return null;
                                }
                                if (res.data.length > 0) {
                                    res.data.forEach((e) => {
                                        e._rowstatus = "";
                                    });
                                }
                                this.isProcessing = false;
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }
                                return res.data;
                            } else {
                                this.isProcessing = false;
                                if (notice) {
                                    this.showNotification("success", this.$t("update_success"), "");
                                }
                                return 1;
                            }
                        }
                    } else {
                        //process
                        this.isProcessing = true;
                        res = await this.$axios.$post("dso/callproc", {
                            proc: dso.updpro,
                            para: dso.para,
                            dbname: this.SECOND_DB_YN
                        });
                        this.isProcessing = false;
                        if (res.success == false) {
                            return this.handlingErrorMessage(res.message, '', acntStyle);
                        } else {
                            if (res.data && res.data.length > 0) {
                                if (res.data[0].ERRCODE) {
                                    if (res.data[0].ERRMSG) {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                                    } else {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                                    }
                                    return null;
                                }
                            }
                        }
                        if (notice) {
                            this.showNotification("success", this.$t("process_success"), "");
                        }
                        return res.data;
                    }
                }
            } catch (e) {
                this.isProcessing = false;
                console.log(e.message)
                if (e.message.indexOf("504") > 0) {
                    this.showNotification("danger", this.$t("timeout"), "server_not_available_now_please_try_later");
                } else if (e.message.indexOf("502") > 0) {
                    this.showNotification("danger", this.$t("restarting"), "server_restarting_please_try_later");
                } else {
                    this.showNotification("danger", this.$t("unexpected_error"), e.message);
                }
                return null
            } finally {
                this.isProcessing = false;
            }
        },
        async delayedDataProcess(item, dso) {
            try {
                let para = [];
                if (item._rowstatus) {
                    for (let j = 0; j < dso.elname.length; j++) {
                        let val;
                        if (dso.elname[j] == "ADDDITION_PARA") {
                            val = item.ADDDITION_PARA;
                        } else {
                            try {
                                val = eval("item." + dso.elname[j]);
                            } catch (ex) {
                                val = "";
                            }
                        }

                        if (val == "null" || val == undefined || val == null) {
                            val = "";
                        }
                        val = typeof val === "string" ? val.replace(/\'/g, "''").replace(/\?/g, "\?") : val;
                        para.push(val);
                    }
                    this.isProcessing = true;
                    const res = await this.$axios.$post("dso/callproc", {
                        proc: dso.updpro,
                        para: para,
                        dbname: this.SECOND_DB_YN
                    });
                    if (res.success == false) {
                        this.handlingErrorMessage(res.message);
                        return false;
                    } else if (res.data[0].ERRCODE) {
                        if (res.data[0].ERRMSG) {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                        } else {
                            this.showNotification("danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                        }
                        return false;
                    }
                    if (dso.type === "control") {
                        let rtnKeys = Object.keys(res.data[0]);
                        rtnKeys.forEach((q) => {
                            item[q] = res.data[0][q];
                        });
                    }
                    return true;
                } else {
                    this.showNotification("danger", this.$t("item_status_no_change"), "", this.POPUP_ERROR_DELAY);
                    return false;
                }
            } catch (e) {
                console.log(e);
                this.showNotification("danger", e.message, "", this.POPUP_ERROR_DELAY);
                return false;
            }
        },
        handlingErrorMessage(val, title = "", acntStyle = "", notice = true) {
            if (notice == false) return;
            const str = `ORA-20999: ORA-20999: [NOI_DNG_TEST]
            ORA-06512: at "WMS1.CW_PRO_CS70030_APPROVE_ALL", line 270
            `;

            var arr = [];
            var vall = val.toLowerCase();
            this.decodeMessage(arr, vall);

            if (arr.length > 0) {
                this.showNotification(acntStyle ? "warning" : "danger", arr.join("  >>>  "), title, this.POPUP_ERROR_DELAY);
                this._callProcedure("sys_upd_sys_user_msg_log", [arr.join("  >>>  "), val, this.$root._route.fullPath], "common");
            } else {
                this.showNotification(acntStyle ? "warning" : "danger", val, title, this.POPUP_ERROR_DELAY);
                this._callProcedure("sys_upd_sys_user_msg_log", [val, '', this.$root._route.fullPath], "common");
            }
        },
        decodeMessage(arr, val) {
            let seft = this;
            const regex = /[ORA|ora]-([\d]*):\s\[(.*)\]/gm; // /ora-([\d]*):\s\[(.*)\]$/gm; 
            var vall = val.toLowerCase().replace(/\n/gm, '');
            let m;
            while ((m = regex.exec(vall)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // console.log(m[2]);
                // console.log(m.length);
                if (m.length == 3) {
                    if (!m[2].startsWith("ora-")) {
                        var strs = m[2].split(",");
                        strs.forEach((s) => {
                            arr[arr.length] = this.$t(s);
                        });
                    } else {
                        seft.decodeMessage(arr, m[2]);
                    }
                }
            }
        },
        // ==============LG=========================
        async _getCompanyByUser2(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_company_by_user",
                para: [p_user_pk],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getCommonCodePar(p_parent_code, p_val1 = '', p_val2 = '', p_val3 = '', p_tco_company_pk = '0') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code_par",
                para: [p_tco_company_pk, p_parent_code, p_val1, p_val2, p_val3],
                dbname: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getItemGroupLG(p_user_pk = 0, p_pr_level = 6, p_leaf_yn = '', p_yn_string = '', p_group_type = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "GSF20_LG_SYS_GET_GROUP_ITEM",
                para: [p_user_pk, p_pr_level, p_leaf_yn, p_yn_string, p_group_type],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        async _getWarehouseLG(p_tlg_in_storage_pk = '', p_user_pk = '', p_type = '', p_wh_type = '', p_tco_company_pk = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "LG_SEL_COMPANY_WH_V3",
                para: [p_tlg_in_storage_pk, p_user_pk, p_type, p_wh_type, p_tco_company_pk],
                dbname: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        // ==============LG=========================  
        async _clearCache(notiYN = "Y") {
            try {
                const { success, data, message } = await this.$axios.$post("dso/clearcache");
                if (success) {
                    if (notiYN === "Y") {
                        this.showNotification("success", message, "");
                        return;
                    }
                    return;
                }
            } catch (error) {
                console.log("catch exception-toggleNocache:", error.message)
            }
        },
        async _sendESign(_eSignInfo={ _groupkey:"", _doc_type:"", _orginal_pdf_base64:"", _sign_by_pk:"", _sign_seq:'', _description:""}) {  
            try{
                console.clear();
                // _eSignInfo ={
                //     _groupkey:'TAX'+busplace_info.TAX_CD+"TAC_HGTRH"+this.mstData.PK, 
                //     _doc_type:ESJS0010_ESIGN_TYPE, 
                //     _orginal_pdf_base64:_rtnBase64PDF, //blob{data:"abx",size 123mb} return file from report pdf excel,....
                //     _sign_by_pk:this.user.PK, 
                //     _sign_seq:'1',  
                //     _description:"Send From Slip Entry [TAX_CD-"+busplace_info.TAX_CD+"][TAC_HGTRH-"+this.mstData.PK+"]"
                //     _tco_company_pk: this.mstData.TCO_COMPANY_PK,
                //     _tco_busplace_pk: this.mstData.TCO_BUSPLACE_PK
                // }  
                let MSG = this.$t('pls_check_group_key_or_doc_type_or_parse_file_pdf_to_base64');
                let MSG_COLOR = "warning";
                if(_eSignInfo._groupkey !="" && _eSignInfo._doc_type !="" && _eSignInfo._orginal_pdf_base64 != ""){
                    /*==[CHK] Check _eSignInfo._orginal_pdf_base64 error or not yet==*/
                    const _result = _eSignInfo._orginal_pdf_base64;
                    if (_result.type) {
                        let _err_print = _result.type.split("/")[1].toLowerCase();
                        if (_result && _err_print == "xml" && _result.size == 0) {
                            this.showNotification(MSG_COLOR, this.$t("no_data_or_report_error"), 3000 );
                            return;
                        }
                        if (_err_print == "json") {
                            MSG = "NO_DATA";
                            _result.text().then((res) => { var _json_msg = JSON.parse(res); MSG = _json_msg["message"];
                                if (MSG == undefined) { MSG = "no_data_or_report_error"; }
                                this.showNotification(MSG_COLOR, this.$t(MSG), "", 5000 );
                            });
                            return;
                        }  
                    }
                    /*===[CVT] Convert blob to base64==================================*/
                    const _orginalPDFBase64 =  await this._blobFileToBase64(_eSignInfo._orginal_pdf_base64);
                    if(!_orginalPDFBase64 || _orginalPDFBase64 == undefined){
                        MSG =  this.$t('can_not_convert_file_pdf_to_base64_pls_check');
                        return this.showNotification(MSG_COLOR, MSG, "", 5000); 
                    }
                    this.showNotification("info", this.$t("begin_send_esign"), "", 500); 
                    _eSignInfo._orginal_pdf_base64 = _orginalPDFBase64;
                    //console.log('[vng-154/dvg] > file: dso.js:1060 > _sendESign > _eSignInfo:', _eSignInfo);
                    let rtnSendESignStatus = await this.$axios.$post("dso/apiproclob", {
                        proc: "SYS_PRO_SEND_ESIGN",
                        para: [_eSignInfo._tco_company_pk,_eSignInfo._tco_busplace_pk, _eSignInfo._groupkey, _eSignInfo._doc_type, _eSignInfo._orginal_pdf_base64, _eSignInfo._sign_by_pk, _eSignInfo._sign_seq, _eSignInfo._description],
                        _db2: this.SECOND_DB_YN
                    }); 
                    //console.log('[vng-154/dvg] > file: dso.js:1066 > _sendESign > rtnSendESignStatus:', rtnSendESignStatus);
                    MSG_COLOR = "info";
                    MSG = this.$t(rtnSendESignStatus.data[0].STATUS+"");
                    let lCode = this.$t(rtnSendESignStatus.data[0].CODE+"");
                    //console.log("[_eSignInfo]",_eSignInfo)
                    return this.showNotification(MSG_COLOR, MSG, lCode, 5000); 
                } 
                //console.log('[_eSignInfo]', _eSignInfo);
                return this.showNotification(MSG_COLOR, MSG, "", 5000); 
            }catch(e){
                console.log('[Error Code _sendESign/_eSignInfo]', _eSignInfo);
                console.log("[Error Code _sendESign]:", e);
                MSG = this.$t('error_when_system_send_esign');
                MSG_COLOR = "warning"; 
                return this.showNotification(MSG_COLOR, MSG, "", 5000);
            }
        },
        async _getFrmSetting(_frmId, _type = "NAME", _tco_company_pk = '') {  
            try{this._setSecondDBStstus();
                let rtnFromSetting = await this.$axios.$post("dso/callproc", {
                    proc: "SYS_SEL_FRM_SETTING_NC",
                    para: [_frmId, _type, _tco_company_pk],
                    _db2: this.SECOND_DB_YN
                }); 
                return rtnFromSetting.data ? rtnFromSetting.data : [];
            }
            catch(e){
                return [];
            }
        },
        async _getInitProc (_crt_id, _listData = [], _defaultProc = '', _contenproc = '', _getcolnm = "PROCEDURE_NAME"){
            let procNM = _defaultProc;
                try{
                    if (_listData && _listData.length > 0) {
                    const rtnFilter = _listData.filter((x) => x.CRT_ID == `${_crt_id}`);
                    if (rtnFilter && rtnFilter[0] && rtnFilter.length>0) {
                        let _getData = rtnFilter[0];
                        if (_getData[`${_getcolnm}`] && _getData[`${_getcolnm}`] != undefined && _getData[`${_getcolnm}`] != '' && _getData[`${_getcolnm}`] != 'null') {
                            if(_contenproc == 'CONTENT'){
                                let rtnContentProc = await this.$axios.$post("dso/callproc", {
                                    proc: "SYS_SEL_CONTENT_PROC",
                                    para: [_defaultProc],
                                    _db2: this.SECOND_DB_YN
                                });  
                                procNM = rtnContentProc;
                            }
                            return procNM = _getData[`${_getcolnm}`]; 
                        }
                    }
                    }
                    return procNM;
                }
                catch(e){
                    return procNM;
                } 
        },
        async _getInitList(_crt_id, _listData = [], _defaultComm = '', _tco_company_pk='', _getcolnm = "PROCEDURE_NAME"){
            let rtnData = [];
                try{
                if (_listData && _listData.length > 0) {
                    const rtnFilter = _listData.filter((x) => x.CRT_ID == `${_crt_id}`);
                    if (rtnFilter && rtnFilter[0] && rtnFilter.length>0) {
                        let _getData = rtnFilter[0];
                        if (_getData[`${_getcolnm}`] && _getData[`${_getcolnm}`] != undefined && _getData[`${_getcolnm}`] != '' && _getData[`${_getcolnm}`] != 'null') {
                            let parentCode = _getData[`${_getcolnm}`]; 
                            let _rtnVal = []
                            switch (_getData.PROCEDURE_TYPE) {
                                case 'COMMCODE': 
                                    _listData.forEach(e => {
                                        if (e.CRT_ID == `${_crt_id}` && e.TCO_COMPANY_PK == _tco_company_pk && _defaultComm == parentCode) {
                                            _rtnVal.push(e);
                                        } 
                                    }); 
                                    rtnData = (_rtnVal && _rtnVal.length > 0)? _rtnVal : [];   
                                    break;
                                case 'COMMCODE_CLOUD':
                                    _listData.forEach(e => {
                                        if (e.CRT_ID == `${_crt_id}` && _defaultComm == parentCode) {
                                            _rtnVal.push(e);
                                        }
                                    }); 
                                    rtnData = (_rtnVal && _rtnVal.length > 0)? _rtnVal : []; 
                                    break;
                                default :
                                    rtnData = [];
                                break;
                            }
                          // return rtnData;
                        }
                    }
                }  
                if(rtnData && rtnData.length == 0 && _defaultComm != ""){
                    rtnData = await this._getCommonCode(`${_defaultComm}`, '');
                }
                return rtnData;
            }
            catch(e){
                return rtnData;
            } 
        }
    },
});
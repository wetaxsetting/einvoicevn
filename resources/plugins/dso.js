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
                _db2: this.SECOND_DB_YN
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
                _db2: this.SECOND_DB_YN
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

        async _getDocType() { //p_tco_company_pk = 0
            const dso = {
                type: 'process',
                updpro: "ea_pro_1310010_doc_type",
                para: null //[p_tco_company_pk]
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
                _db2: this.SECOND_DB_YN
            });

            if (res.data && res.data.length > 0) {
                let datas = res.data;
                const promises = datas.map(async(x) => {
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
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getCostCenter(p_tco_company_pk = 0, p_plc_pk, p_plc_cd_nm) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "hr_sel_cost_center",
                para: [p_tco_company_pk, p_plc_pk, p_plc_cd_nm],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getSalarySecurity(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_pro_salary_display",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            if (res.data) return res.data[0].SALARY_SECURITY;
            return "N";
        },
        async _getAllFactory(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByUsery(p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "gsf20_lg_sys_get_factory",
                para: [p_user_pk, p_pr_level],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getFactoryByCompanyUser(p_tco_company_pk = 0, p_user_pk = 0, p_pr_level = 6) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_factory_by_com_user",
                para: [p_tco_company_pk, p_user_pk, p_pr_level],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWHTree(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_wh_tree",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrg(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_org",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getOrgByUser(p_user_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_org_user",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkGroup(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WG_NOCACHE",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkGroupByBiz(p_tco_company_pk = 0, p_tco_busplace_pks = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WG_BIZ",
                para: [p_tco_company_pk, p_tco_busplace_pks],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getDepositAccount(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_deposit_account",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getWorkShift(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "SYS_SEL_LIST_WS_NOCACHE",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getBank(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_bank",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getTransTypeList(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_trans_type",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExChangRateList(p_tco_company_pk = 0, p_date) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "ac_sel_ex_rate",
                para: [p_tco_company_pk, p_date],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemgrpByGroupType(p_group_type = null) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_itemgrp_by_group_type",
                para: [p_group_type],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getUOM(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "lg_sel_uom",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getItemGroup(p_tco_company_pk = 0) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_get_item_group",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getExchangeRate(p_date, p_tco_company_pk, p_ccy, p_type = "date") {
            this._setSecondDBStstus();
            if (p_type == "month") {
                let res_m = await this.$axios.$post("dso/callproc", {
                    proc: "AC_PRO_GET_MONTH_RATE",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    _db2: this.SECOND_DB_YN
                });
                if (res_m.data.length > 0) {
                    return res_m.data[0].EX_RATE;
                }
            } else {
                let res = await this.$axios.$post("dso/callproc", {
                    proc: "ac_pro_getrate",
                    para: [p_date, p_tco_company_pk, p_ccy],
                    _db2: this.SECOND_DB_YN
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
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _getCompanyByUser(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_company",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getBizPlaceByCompany(p_tco_company_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place",
                para: [p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getBizPlaceBuUser(p_user_pk) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_list_biz_place_user",
                para: [p_user_pk],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _callProcedure(p_proc, p_para, p_db2_yn = 'N') {
            let res;
            if (p_db2_yn == 'Y') {
                res = await this.$axios.$post("dso/callproc", {
                    proc: p_proc,
                    para: p_para,
                    _db2: 'Y'
                });
            } else {
                this._setSecondDBStstus();
                res = await this.$axios.$post("dso/callproc", {
                    proc: p_proc,
                    para: p_para,
                    _db2: this.SECOND_DB_YN
                });
            }
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
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },
        async _callProcedureMultiCursor(p_proc, p_para, p_number_cursor) {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc2", {
                proc: p_proc,
                para: p_para,
                number_cursor: p_number_cursor,
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        _setSecondDBStstus() {
            if (this._secondDBMenu.some(item => item.FORM_URL == this.$root._route.fullPath)) {
                this.SECOND_DB_YN = 'Y';
            }
        },
        async _dsoCall(dso, action = "update", notice = true, acntStyle = '', p_check_db2 = "Y") {
            if (p_check_db2 == "Y") {
                this._setSecondDBStstus();
            } else {
                this.SECOND_DB_YN = 'N';
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
                        para_extra: dso.para_extra,
                        _db2: this.SECOND_DB_YN
                    }
                    res = await this.$axios.$post("dso/callproc", para);

                    this.isProcessing = false;
                    if (res.success == false) {
                        let msg = this.$t(res.message);
                        this.handlingErrorMessage(res.message, '', acntStyle, notice);
                        //this.showNotification("danger", msg, "", this.POPUP_ERROR_DELAY);
                        if (res.message == "your_session_timeout_logout_and_login_to_continue") {
                            //this.$store.commit("auth/FETCH_USER_FAILURE");
                            this.$store.dispatch("auth/logout");
                            //this.$router.push("/login");
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
                                    _db2: this.SECOND_DB_YN
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
                        let next = true;
                        const promises = dso.data.map(async(x) => {
                            if (x._rowstatus && next) {
                                const result = await this.delayedDataProcess(x, dso);
                                if (!result) {
                                    next = false;
                                    return null;
                                }
                            }
                        });

                        return await Promise.all(promises)
                            .then(async(res) => {
                                if (next) {
                                    if (dso.selpro) {
                                        res = await this.$axios.$post("dso/callproc", {
                                            proc: dso.selpro,
                                            para: dso.para,
                                            para_extra: dso.para_extra,
                                            _db2: this.SECOND_DB_YN
                                        });
                                        if (res.success == false) {
                                            this.handlingErrorMessage(res.message, '', acntStyle);
                                            //this.showNotification("danger", res.message, "", this.POPUP_ERROR_DELAY);
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
                                } else {
                                    return null;
                                }
                            })
                            .catch((err) => {
                                return null;
                            });
                    } else {
                        //process
                        this.isProcessing = true;
                        res = await this.$axios.$post("dso/callproc", {
                            proc: dso.updpro,
                            para: dso.para,
                            para_extra: dso.para_extra,
                            _db2: this.SECOND_DB_YN
                        });
                        this.isProcessing = false;
                        if (res.success == false) {
                            //TODO
                            return this.handlingErrorMessage(res.message, '', acntStyle);
                        } else {
                            if (res.data && res.data.length > 0) {
                                if (res.data[0].ERRCODE) {
                                    if (res.data[0].ERRMSG) {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE) + " [" + res.data[0].ERRMSG + "]", "", this.POPUP_ERROR_DELAY);
                                    } else {
                                        this.showNotification(acntStyle ? "warning" : "danger", this.$t(res.data[0].ERRCODE), "", this.POPUP_ERROR_DELAY);
                                    }
                                    return false;
                                }
                            } else {
                                //if (notice) this.showNotification(acntStyle?"warning":"danger", this.$t("no_return_data"), "", this.POPUP_ERROR_DELAY);
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
                if (e.indexOf("504") > 0) {
                    this.showNotification("danger", this.$t("timeout"), "server_not_available_now_please_try_later");
                } else if (e.indexOf("502") > 0) {
                    this.showNotification("danger", this.$t("restarting"), "server_restarting_please_try_later");
                } else {
                    this.showNotification("danger", this.$t("unexpected_error"), "server_meet_internal_error_please_contact_it_for_help");
                }
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
                        //val = typeof val === "string" ? val.replace("'", "''").replace("?", "\\?") : val;

                        val = typeof val === "string" ? val.replace(/\'/g, "''").replace(/\?/g, "\?") : val;

                        para.push(val);
                    }
                    this.isProcessing = true;
                    const res = await this.$axios.$post("dso/callproc", {
                        proc: dso.updpro,
                        para: para,
                        _db2: this.SECOND_DB_YN
                    });
                    if (res.success == false) {
                        this.handlingErrorMessage(res.message);
                        //this.showNotification("danger", res.message, "", this.POPUP_ERROR_DELAY);
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
                this._callProcedure("sys_upd_sys_user_msg_log", [arr.join("  >>>  "), val, this.$root._route.fullPath]);
            } else {
                this.showNotification(acntStyle ? "warning" : "danger", val, title, this.POPUP_ERROR_DELAY);
                this._callProcedure("sys_upd_sys_user_msg_log", [val, '', this.$root._route.fullPath]);
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
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },
        async _getCommonCodePar(p_parent_code, p_val1 = '', p_val2 = '', p_val3 = '', p_tco_company_pk = '0') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "sys_sel_common_code_par",
                para: [p_tco_company_pk, p_parent_code, p_val1, p_val2, p_val3],
                _db2: this.SECOND_DB_YN
            });

            return res.data ? res.data : [];
        },

        async _getItemGroupLG(p_user_pk = 0, p_pr_level = 6, p_leaf_yn = '', p_yn_string = '', p_group_type = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "GSF20_LG_SYS_GET_GROUP_ITEM",
                para: [p_user_pk, p_pr_level, p_leaf_yn, p_yn_string, p_group_type],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        async _getWarehouseLG(p_tlg_in_storage_pk = '', p_user_pk = '', p_type = '', p_wh_type = '', p_tco_company_pk = '') {
            this._setSecondDBStstus();
            let res = await this.$axios.$post("dso/callproc", {
                proc: "LG_SEL_COMPANY_WH_V3",
                para: [p_tlg_in_storage_pk, p_user_pk, p_type, p_wh_type, p_tco_company_pk],
                _db2: this.SECOND_DB_YN
            });
            return res.data ? res.data : [];
        },

        // ==============LG=========================
    },
});
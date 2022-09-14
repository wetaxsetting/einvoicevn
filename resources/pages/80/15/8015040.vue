<template>
	<BaseWrapper class="overflow-x-hidden">
		<v-container fluid class="px-1 py-0" v-resize="onResize">
			<v-row no-gutters align="start" justify="space-between">
				<v-col cols="12">
					<v-card flat :height="formContainerHeight" class="overflow-y-overlay overflow-x-hidden">
						<v-container fluid class="pa-0 fill-height">
							<v-row dense align="start" justify="space-between" class="h-100">
								<v-col lg="3" cols="12" v-show="showGrid">
									<v-container fluild class="px-1 py-0">
										<v-row dense align="center" justify="space-between">
											<v-col cols="11">
												<BaseInput :label="$t('template')" v-model="inputSearch" />
											</v-col>
											<v-col cols="1">
												<BaseButton btn_type="icon" icon_type="search" :btn_text="$t('search')" @onclick="onBtnClick('search')" />
											</v-col>
											<v-col cols="12">
												<DataGridView 
													select_mode="Single" 
													ref="dataGrid" 
													:max_height="gridHeight" 
													:header="headers" 
													sel_procedure="SYS_SEL_MAIL_TEMPLATE_LST_NOCACHE" 
													:filter_paras="[ inputSearch ]"
													@cellClick="onSelectTemplate" 
													overflowDiv="overlay" 
												/>
											</v-col>
										</v-row>
									</v-container>
								</v-col>
								<v-divider vertical></v-divider>
								<v-col :lg="showGrid ? 9 : 12" cols="12">
									<v-container fluild class="pa-1">
										<v-row dense align="center" justify="space-between">
											<v-col cols="12">
												<div class="d-flex align-center justify-end">
													<BaseButton btn_type="icon" :icon_type="showGrid ? 'left' : 'right'" :btn_text="showGrid ? $t('hide') : $t('show')" @onclick="showGrid = !showGrid" />
													<v-spacer></v-spacer>
													<BaseButton btn_type="icon" icon_type="add" :disabled="user.SYSADMIN_YN !== 'Y'" :btn_text="$t('add')" @onclick="onBtnClick('add')" />
													<BaseButton btn_type="icon" icon_type="copy" :disabled="user.SYSADMIN_YN !== 'Y'" :btn_text="$t('copy')" @onclick="onBtnClick('copy')" />
													<BaseButton btn_type="icon" icon_type="save" :disabled="user.SYSADMIN_YN !== 'Y'" :btn_text="$t('save')" @onclick="onBtnClick('save')" />
													<BaseButton btn_type="icon" icon_type="delete" :disabled="user.SYSADMIN_YN !== 'Y'" :btn_text="$t('delete')" @onclick="onBtnClick('confirmDelete')" />
												</div>
											</v-col>
											<v-col cols="4">
												<BaseSelect :label="$t('mail_type')" v-model="templateObject.MAIL_TYPE" :lstData="mailTypeList" item-text="NAME" item-value="CODE" />
											</v-col>
											<v-col lg="4" cols="12">
												<BaseInput :label="$t('template_name')" v-model="templateObject.NAME" />
											</v-col>
											<v-col lg="4" cols="12">
												<BaseInput :label="$t('subject')" v-model="templateObject.SUBJECT" />
											</v-col>
											<v-col lg="4" col="12">
												<BaseInput :label="$t('attach_file_name_1')" v-model="templateObject.ATTACH_FILE_NAME1" />
											</v-col>
											<v-col lg="4" col="12">
												<BaseInput :label="$t('attach_file_name_2')" v-model="templateObject.ATTACH_FILE_NAME2" />
											</v-col>
											<v-col lg="4" col="12">
												<BaseInput :label="$t('attach_file_name_3')" v-model="templateObject.ATTACH_FILE_NAME3" />
											</v-col>
											<v-col lg="4" col="12">
												<BaseInput :label="$t('attach_file_name_4')" v-model="templateObject.ATTACH_FILE_NAME4" />
											</v-col>
											<v-col lg="4" col="12">
												<BaseInput :label="$t('attach_file_name_5')" v-model="templateObject.ATTACH_FILE_NAME5" />
											</v-col>
											<v-col lg="4" col="12" align-self="end">
												<BaseCheckbox :label="$t('default_yn')" true-value="Y" false-value="N" v-model="templateObject.DEFAULT_YN" />
											</v-col>
											<v-col cols="12">
												<GwHtmlEditor :imageFromLocal="true" :height="editorHeight" v-model="templateObject.BODY" />
											</v-col>
										</v-row>
									</v-container>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<confirm-dialog ref="confirmDialog" @onConfirm="onBtnClick('delete')" />
	</BaseWrapper>
</template>

<script>
export default {
	layout: "detault",
	middleware: "user",

	components: {
		GwHtmlEditor: () => import("@/components/control/GwHtmlEditor"),
		ConfirmDialog: () => import("@/components/dialog/ConfirmDialog")
	},

	data: () => ({
		selectedMailType: "",
		inputSearch: "",
		templateObject: {},
		mailTypeList: [],
		initParams: [
			"PK", "MAIL_TYPE", "NAME", "SUBJECT", "BODY",
			"ATTACH_FILE_NAME1", "ATTACH_FILE_NAME2", "ATTACH_FILE_NAME3", "ATTACH_FILE_NAME4", "ATTACH_FILE_NAME5",
			"ATTACH_FILE_NAME6", "ATTACH_FILE_NAME7", "ATTACH_FILE_NAME8", "ATTACH_FILE_NAME9", "ATTACH_FILE_NAME10",
			"DEFAULT_YN"
		],
		showGrid: true
	}),

	async created() {
		const commoncode = await this._getCommonCode2(["SYS0010"], this.user.TCO_COMPANY_PK);
		this.mailTypeList = commoncode[0];
		this.createNewTemplate();
	},

	computed: {
		user() {
			return this.$store.getters["auth/user"];
		},
		limitHeight() {
			return Math.floor(this.formContainerHeight);
		},
		editorHeight() {
			return Math.floor((this.formContainerHeight - 36.77 - (38 * 2) - 32 - 16 - 14));
		},
		gridHeight() {
			return Math.floor(this.formContainerHeight - 38 - 16 - 4);
		},
		headers() {
			return [
				{
					dataField: "MAIL_TYPE",
					caption: this.$t("mail_type"),
					allowEditing: false,
					lookup: {
						dataSource: this.mailTypeList,
						displayExpr: 'NAME',
						valueExpr: 'CODE'
					}
				},
				{
					dataField: "NAME",
					caption: this.$t("template_name"),
					allowEditing: false
				},
				{
					dataField: "SUBJECT",
					caption: this.$t("subject"),
					allowEditing: false
				}
			]
		}
	},

	methods: {
		onBtnClick(type) {
			switch (type) {
				case "search":
					this.$refs.dataGrid.loadData();
					break;
				case "add":
					this.createNewTemplate();
					break;
				case "copy":
					if (this.templateObject._rowstatus !== "u") {
						this.showNotification("danger", this.$t("error_occurs"), this.$t("please_select_a_template"), 3000)
						return;
					}
					this.copyTemplate(this.templateObject.PK);
					break;
				case "save":
					this.saveTemplate();
					break;
				case "confirmDelete":
					if (this.templateObject._rowstatus === "u") {
						if (this.templateObject.DEFAULT_YN === "Y") {
							this.showNotification("danger", this.$t("error_occurs"), this.$t("this_is_a_default_template_you_cannot_delete"), 3000)
							return;
						} else {
							this.$refs.confirmDialog.showConfirm(this.$t("do_you_want_to_delete"), "warning", false);
						}
					}
					break;
				case "delete":
					this.templateObject._rowstatus = "d";
					this.saveTemplate();
					break;
				default:
					break;
			}
		},

		createNewTemplate() {
			const defaultValues = {
				MAIL_TYPE: this.mailTypeList[0].CODE,
				DEFAULT_YN: "N"
			}
			this.templateObject = { ...this._initObject(this.initParams), ...defaultValues };
		},

		async onSelectTemplate({ data, rowType }) {
			if (rowType === "data") {
				if (data) {
					await this.dsoMaster("select", data.PK);
				}
			}
		},

		async dsoMaster(action, PK) {
			await this._dsoCall({
				type: "control",
				selpro: "SYS_SEL_MAIL_TEMPLATE",
				updpro: "SYS_UPD_MAIL_TEMPLATE",
				para: [PK],
				elname: [
					"_rowstatus",
					...this.initParams
				],
				data: this.templateObject,
			}, action, action === "select" ? false : true).then((result) => {
				switch (action) {
					case "select":
						this.templateObject = result ? { ...result, _rowstatus: "u" } : {};
						break;
					default:
						break;
				}
			})
		},

		async saveTemplate() {
			const data = [
					this.templateObject._rowstatus,
					this.templateObject.PK,
					this.templateObject.MAIL_TYPE,
					this.templateObject.NAME,
					this.templateObject.SUBJECT,
					this.templateObject.BODY,
					this.templateObject.ATTACH_FILE_NAME1,
					this.templateObject.ATTACH_FILE_NAME2,
					this.templateObject.ATTACH_FILE_NAME3,
					this.templateObject.ATTACH_FILE_NAME4,
					this.templateObject.ATTACH_FILE_NAME5,
					this.templateObject.ATTACH_FILE_NAME6,
					this.templateObject.ATTACH_FILE_NAME7,
					this.templateObject.ATTACH_FILE_NAME8,
					this.templateObject.ATTACH_FILE_NAME9,
					this.templateObject.ATTACH_FILE_NAME10,
					this.templateObject.DEFAULT_YN
			]
			this.$axios.$post("dso/apiproclob", { proc: "SYS_UPD_MAIL_TEMPLATE", para: data })
			.then(({ data, message }) => {
				if (data && data.length) {
					this.showNotification("success", this.$t("update_success"), "");
					this.dsoMaster("select", data[0].PK);
					this.onBtnClick("search");
				} else {
					this.showNotification("danger", this.$t("error_occurs"), message);
					return;
				}
			})
			.catch((e) => {
				this.showNotification("danger", this.$t("error_occurs"), e.message);
				return;
			})
		},

		async copyTemplate(templatePK) {
			this.$axios.$post("dso/callproc", { proc: "SYS_UPD_MAIL_TEMPLATE_COPY", para: [ templatePK ] })
			.then(({ data, message }) => {
				if (data && data.length) {
					this.showNotification("success", this.$t("update_success"), "");
					this.dsoMaster("select", data[0].PK);
					this.onBtnClick("search");
				} else {
					this.showNotification("danger", this.$t("error_occurs"), message);
					return;
				}
			})
			.catch((e) => {
				this.showNotification("danger", this.$t("error_occurs"), e.message);
				return;
			})
		}
	}
}
</script>

"use strict";
import Cookies from "js-cookie";
import listToTree from "list-to-tree-lite";
const langFromCookies = Cookies.get("language");

export const state = () => ({
  language: langFromCookies || "ENG",
  token: null,
  user: null,
  colorTheme: "rgba(0, 96, 190, 1)", // "rgba(55, 88, 117, 1)",
  textColorTheme: "white--text",
  darkTheme: false,
  flatMenuList: [],
  menuList: [],
  logs: [],
  dictionaryList: [],
  dictionaryFormID: "",
  waitingChangeLang: false,
  activeForm2: null,
  secondDBMenu: [],
  /* btnThemeStyle: {
    isIcon: false,
    isDepressed: true,
    isOutlined: false,
    isRounded: false,
    isShaped: false,
    isText: false,
    isTile: false,
  }, */
  cwCommonParam: [],
  menuDrawerWidth: 0,
  favoriteMenu: [],
  dictionaryList_i18n: {},
  windowHeight: 0,
  windowWidth: 0,
  formContainerHeight: 0,
  componentKey: 1,
});

export const getters = {
  token: (state) => state.token,
  user: (state) => state.user,
  colorTheme: (state) => state.colorTheme,
  textColorTheme: (state) => state.textColorTheme,
  darkTheme: (state) => state.darkTheme,
  menuList: (state) => state.menuList,
  flatMenuList: (state) => state.flatMenuList,
  logs: (state) => state.logs,
  dictionaryList: (state) => state.dictionaryList,
  dictionaryFormID: (state) => state.dictionaryFormID,
  dbType: (state) => state.dbType,
  waitingChangeLang: (state) => state.waitingChangeLang,
  activeForm2: (state) => state.activeForm2,
  dictionaryList_i18n: (state) => state.dictionaryList_i18n,
  cwCommonParam: (state) => state.cwCommonParam,
  menuDrawerWidth: (state) => state.menuDrawerWidth,
  secondDBMenu: (state) => state.secondDBMenu,
  favoriteMenu: (state) => state.favoriteMenu,
  windowHeight: (state) => state.windowHeight,
  windowWidth: (state) => state.windowWidth,
  formContainerHeight: (state) => state.formContainerHeight,
  componentKey: (state) => state.componentKey,
};

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  FETCH_USER_SUCCESS: (state, user) => {
    state.user = user;
  },
  FETCH_USER_FAILURE: (state) => {
    (state.token = null), (state.user = null);
  },
  UPDATE_USER: (state, user) => {
    state.user = user;
  },
  SET_COLOR_THEME: (state, color) => {
    state.colorTheme = color;
  },
  SET_TEXT_COLOR: (state, textColor) => {
    state.textColorTheme = textColor;
  },
  SET_DARK_THEME: (state, isDark) => {
    state.darkTheme = isDark;
  },
  SET_LANG: (state, { app, lang }) => {
    app.i18n.locale = lang;
  },
  FETCH_MENU_LIST_SUCCESS: (state, menuList) => {
    state.menuList = menuList;
  },
  FETCH_MENU_LIST_FAILURE: (state) => {
    state.menuList = [];
  },
  FETCH_FLAT_MENU_LIST_SUCCESS: (state, flatMenuList) => {
    state.flatMenuList = flatMenuList;
  },
  FETCH_FLAT_MENU_LIST_FAILURE: (state) => {
    state.flatMenuList = [];
  },
  WRITE_LOGS: (state, logs) => {
    state.logs = logs;
  },
  CLEAR_LOGS: (state) => {
    state.logs = [];
  },
  FETCH_DICTIONARY_LIST_SUCCESS: (state, dictionaryList) => {
    state.dictionaryList = dictionaryList;
  },
  FETCH_DICTIONARY_LIST_FAILURE: (state) => {
    state.dictionaryList = [];
  },
  SET_DICT_FORM_ID: (state, id) => {
    state.dictionaryFormID = id;
  },
  FETCH_DB_TYPE_SUCCESS: (state, dbType) => {
    state.dbType = dbType;
  },
  FETCH_WAITING_CHANGE_LANG_SUCCESS: (state, waitingChangeLang) => {
    state.waitingChangeLang = waitingChangeLang;
  },
  FETCH_ACTIVE_FORM: (state, activeForm) => {
    state.activeForm2 = activeForm;
  },
  FETCH_DICTIONARY_I18N_SUCCESS: (state, dictionaryList_i18n) => {
    state.dictionaryList_i18n = { ...dictionaryList_i18n };
  },
  FETCH_DICTIONARY_I18N_FAILED: (state, dictionaryList_i18n) => {
    state.dictionaryList_i18n = {};
  },
  FETCH_CW_COMMON_PARAM_SUCCESS: (state, csCommCode) => {
    state.cwCommonParam = csCommCode;
  },
  FETCH_CW_COMMON_PARAM_FAILED: (state) => {
    state.cwCommonParam = [];
  },
  FETCH_MENU_DRAWER_WIDTH_SUCCESS: (state, width) => {
    state.menuDrawerWidth = width;
  },
  FETCH_SECOND_DB_MENU_SUCCESS: (state, secondDBMenu) => {
    state.secondDBMenu = secondDBMenu;
  },
  FETCH_FAV_MENU_SUCCESS: (state, favoriteMenu) => {
    state.favoriteMenu = favoriteMenu;
  },
  FETCH_FAV_MENU_FAILED: (state) => {
    state.favoriteMenu = [];
  },
  UPDATE_WINDOW_HEIGHT: (state, height) => {
    state.windowHeight = height;
  },
  UPDATE_WINDOW_WIDTH: (state, width) => {
    state.windowWidth = width;
  },
  UPDATE_FORM_CONTAINER_HEIGHT: (state, height) => {
    state.formContainerHeight = height;
  },
  UPDATE_COMPONENT_KEY: (state, key) => {
    state.componentKey = key;
  },
};

export const actions = {
  saveToken({ commit }, { token, remember }) {
    var inHalfADay = 0.5;
    var in30Minutes = 1 / 48;
    var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    var inOneMinute = new Date(new Date().getTime() + 1 * 60 * 1000);
    commit("SET_TOKEN", token);
    Cookies.set("token", token, { expires: inHalfADay });
  },

  async getUserInfoServer({ state }) {
    try {
      let instance = this.$axios.create({
        baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
      });

      instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      instance.defaults.headers.common["Accept-Language"] = state.language;
      const user = await instance.$get("/user/getuser");
      // console.log(user)
      return user;
    } catch (e) {
      return false;
    }
  },

  async getMenuListServer({ commit, state }, language) {
    let dataTemp, messageTemp;
    try {
      let instance = this.$axios.create({
        baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
      });
      instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      instance.defaults.headers.common["Accept-Language"] = language;
      let { data, message } = await instance.$post("/dso/callproc", {
        proc: "SYS_SEL_USER_MENU",
        para: [state.user.PK],
      });
      dataTemp = data;
      messageTemp = message;
      if (data && data.length) {
        const secondDBMenu = data.filter((x) => x.SECOND_DB_YN === "Y");
        commit("FETCH_SECOND_DB_MENU_SUCCESS", secondDBMenu);
        const menuList = listToTree(data, {
          idKey: "PK",
          parentKey: "P_PK",
          childrenKey: "childMenu",
        });
        commit("FETCH_FLAT_MENU_LIST_SUCCESS", data);
        commit("FETCH_MENU_LIST_SUCCESS", menuList);
      } else {
        console.log("get menu error-data:", data);
        console.log("get menu error-message: ", message);
        commit("FETCH_FLAT_MENU_LIST_FAILURE");
        commit("FETCH_MENU_LIST_FAILURE");
        // redirect("/login");
        window.location.href = "/login";
      }
    } catch (error) {
      // redirect("/login");
      window.location.href = "/login";
      console.log("dataTemp:", dataTemp);
      console.log("messageTemp:", messageTemp);
      console.error("getMenuListServer-catch exception:", error.message);
    }
  },

  async saveUserInfo({ commit }) {
    const user = await this.$axios.$get("/user/getuser");
    if (!user) {
      Cookies.remove("token");
      commit("FETCH_USER_FAILURE");
    } else {
      commit("FETCH_USER_SUCCESS", user);
    }
  },

  logout({ commit }) {
    Cookies.remove("token");
    Cookies.remove("language");
    commit("FETCH_USER_FAILURE");
    commit("FETCH_DICTIONARY_LIST_FAILURE");
    commit("CLEAR_LOGS");
  },

  setColorTheme({ commit }, { color, textColor }) {
    commit("SET_COLOR_THEME", color);
    commit("SET_TEXT_COLOR", textColor);
  },

  setDarkTheme({ commit }, isDark) {
    commit("SET_DARK_THEME", isDark);
  },

  saveColorTheme({ commit }, theme) {
    try {
      Cookies.remove("user-theme");
      Cookies.set("user-theme", theme);
    } catch (error) {
      console.log("saveColorTheme error:", error.message);
      return false;
    }
  },

  loadColorTheme({ commit }, userTheme) {
    try {
      const userThemeFromCookies = Cookies.get("user-theme");
      if (userThemeFromCookies) {
        return JSON.parse(userThemeFromCookies);
      } else {
        return userTheme ? JSON.parse(userTheme) : null;
      }
    } catch (error) {
      console.log("loadColorTheme error:", error.message);
      return null;
    }
  },

  async getMenuList({ commit, state }) {
    let dataTemp, messageTemp;
    try {
      let { data, message } = await this.$axios.$post("dso/callproc", {
        proc: "SYS_SEL_USER_MENU",
        para: [state.user.PK],
      });
      dataTemp = data;
      messageTemp = message;
      if (data && data.length) {
        const secondDBMenu = data.filter((x) => x.SECOND_DB_YN === "Y");
        commit("FETCH_SECOND_DB_MENU_SUCCESS", secondDBMenu);
        const menuList = listToTree(data, {
          idKey: "PK",
          parentKey: "P_PK",
          childrenKey: "childMenu",
        });
        commit("FETCH_FLAT_MENU_LIST_SUCCESS", data);
        commit("FETCH_MENU_LIST_SUCCESS", menuList);
      } else {
        window.location.href = "/login";
        // redirect("/login");
        console.log("get menu error-data:", data);
        console.log("get menu error-message: ", message);
        commit("FETCH_FLAT_MENU_LIST_FAILURE");
        commit("FETCH_MENU_LIST_FAILURE");
      }
    } catch (error) {
      window.location.href = "/login";
      console.log("dataTemp:", dataTemp);
      console.log("messageTemp:", messageTemp);
      console.error("getMenuListServer-catch exception:", error.message);
    }
  },

  writeLog({ commit, state }, log) {
    var logArr = [];
    var limitArray = [];
    if (state.logs.length) {
      logArr = [...state.logs];
    }
    logArr.unshift(log);
    if (logArr.length > 15) {
      limitArray = logArr.slice(0, 15);
      commit("WRITE_LOGS", limitArray);
    } else {
      commit("WRITE_LOGS", logArr);
    }
  },

  removeCurrentFormDictionary({ commit, state }, form_id) {
    let objDictionary = { ...state.dictionaryList_i18n };
    delete objDictionary[form_id];
    commit("FETCH_DICTIONARY_I18N_SUCCESS", objDictionary);
    // var dictArray = [...state.dictionaryList];
    // if (dictArray.length) {
    //   const idx = dictArray.findIndex(
    //     item => item.hasOwnProperty(form_id) === true
    //   );
    //   if (idx > -1) {
    //     dictArray.splice(idx, 1);
    //     commit("FETCH_DICTIONARY_LIST_SUCCESS", dictArray);
    //   }
    // }
  },

  removeAllFormDictionary({ commit, state }, { app, lang }) {
    // var dictArray = [...state.dictionaryList];
    // if (dictArray.length) {
    //   dictArray = dictArray.filter(
    //     item => item.hasOwnProperty("COMMON") === true
    //   );
    //   commit("FETCH_DICTIONARY_LIST_SUCCESS", dictArray);
    // }
    commit("SET_LANG", { app: app, lang: "COMMON" });
    let objDictionary = { ...state.dictionaryList_i18n };
    let keys = Object.keys(objDictionary);
    keys.forEach((q) => {
      if (q !== "COMMON") {
        //keep common
        delete objDictionary[q];
        app.i18n.mergeLocaleMessage(lang, objDictionary["COMMON"]);
      }
    });
    commit("FETCH_DICTIONARY_I18N_SUCCESS", objDictionary);
  },

  async refreshDictionary({ commit }, form_id_array) {
    var dictArray = [];
    for (let i = 0; i < form_id_array.length; i++) {
      const element = form_id_array[i];
      const res = await this.$axios.$post("dso/callproc", {
        proc: "SYS_SEL_DICTIONARY",
        para: [element.toUpperCase()],
      });
      if (res.data && res.data.length) {
        if (element === null) {
          var key = "COMMON";
          var obj = {};
          obj[key] = res.data;
          dictArray.push(obj);
        } else {
          var key = element;
          var obj = {};
          obj[key] = res.data;
          dictArray.push(obj);
        }
      }
    }
    if (dictArray.length) {
      commit("FETCH_DICTIONARY_LIST_SUCCESS", dictArray);
    }
    //console.log("refresh lang");
  },

  async updateDictionary({ commit, state }, form_id_array) {
    var dictArray = [];
    if (state.dictionaryList.length) {
      dictArray = [...state.dictionaryList];
    }
    for (let i = 0; i < form_id_array.length; i++) {
      const element = form_id_array[i].toUpperCase();
      const res = await this.$axios.$post("dso/callproc", {
        proc: "SYS_SEL_DICTIONARY",
        para: [element],
      });
      if (res.data && res.data.length) {
        const idx = dictArray.findIndex((item) => item.hasOwnProperty(element) === true);
        if (idx > -1) {
          dictArray.splice(idx, 1);
          var key = element;
          var obj = {};
          obj[key] = res.data;
          dictArray.push(obj);
        }
      }
    }
    if (dictArray.length) {
      commit("FETCH_DICTIONARY_LIST_SUCCESS", dictArray);
    }
  },

  setDictionaryFormID({ commit }, form_id) {
    commit("SET_DICT_FORM_ID", form_id);
  },

  setWaitingChangeLang({ commit }, waitingChangeLang) {
    commit("FETCH_WAITING_CHANGE_LANG_SUCCESS", waitingChangeLang);
  },

  setActiveForm({ commit }, formURL) {
    const menuCode = formURL && formURL.split("/").pop() ? formURL.split("/").pop().toUpperCase() : "";
    // console.log("setActiveForm-menuCode:", menuCode)
    commit("FETCH_ACTIVE_FORM", menuCode);
  },

  //use for select language, will reset all dictionary
  async refreshDictionary_i18n({ commit }, { app, lang, openTabs, activeTab, _db2 }) {
    commit("FETCH_DICTIONARY_I18N_FAILED");
    commit("SET_LANG", { app: app, lang: lang });

    let objDictionary = {};

    let openTabDict = [...openTabs];
    openTabDict.push("COMMON");
    openTabDict = openTabDict.join(",");

    try {
      const res = await this.$axios.$post("dso/callproc", {
        proc: "SYS_SEL_DICTIONARY2",
        para: [openTabDict ? openTabDict : "COMMON"],
        _db2: _db2,
      });

      let formDict = {};
      let commonDict = {};
      if (res.data) {
        let dictArray = [...res.data];
        //console.log("dictArray-6050140:", dictArray.filter(x=>x.FORM_ID==="6050140"))
        for (let i = 0; i < dictArray.length; i++) {
          if (dictArray[i].FORM_ID === "COMMON") {
            commonDict[dictArray[i].ID.toLowerCase()] = dictArray[i].MESSAGE;
            //console.log(commonDict[ dictArray[i].ID.toLowerCase()  ] );
            //continue;
          } else {
            //console.log(`${dictArray[i].FORM_ID} - ${dictArray[i].ID}`);
            if (!formDict[dictArray[i].FORM_ID]) {
              formDict[dictArray[i].FORM_ID] = {};
            }
            formDict[dictArray[i].FORM_ID][dictArray[i].ID.toLowerCase()] = dictArray[i].MESSAGE;
            //console.log(formDict[dictArray[i].FORM_ID]);
          }
        }
        //console.log("formDict:", formDict);
      }

      objDictionary["COMMON"] = commonDict;
      openTabs.forEach((q) => {
        //console.log("tab:", q);
        if (q !== "COMMON") {
          objDictionary[q] = { ...formDict[q] };
          //console.log(`objDictionary-${q}:`, objDictionary[q])
          //console.log(`formDict-${q}:`, formDict[q])
        }
      });

      if (activeTab) {
        app.i18n.setLocaleMessage("COMMON", commonDict);
        app.i18n.setLocaleMessage(lang, formDict[activeTab]);
      } else app.i18n.setLocaleMessage("COMMON", commonDict);
      //console.log("objDictionary:", objDictionary)
      commit("FETCH_DICTIONARY_I18N_SUCCESS", objDictionary);
    } catch (e) {
      console.log(e);
    }

    //console.log(app.i18n)
  },

  async setFormDictionary_i18n({ commit, state }, { app, lang, formID, _db2 }) {
    commit("SET_LANG", { app: app, lang: lang });

    let objDictionary = { ...state.dictionaryList_i18n };

    if (objDictionary.hasOwnProperty(formID)) {
      //dictionary has existed (swith tab)
      //console.log( objDictionary[formID])
      //app.i18n.mergeLocaleMessage(lang, objDictionary[formID]);

      //app.i18n.setLocaleMessage(lang, {});
      app.i18n.mergeLocaleMessage(lang, objDictionary[formID]);
    } else {
      try {
        const res = await this.$axios.$post("dso/callproc", {
          proc: "SYS_SEL_DICTIONARY2",
          para: [formID],
          _db2: _db2,
        });

        let formDict = {};
        if (res.data) {
          let dictArray = res.data;
          for (let i = 0; i < dictArray.length; i++) {
            formDict[dictArray[i].ID.toLowerCase()] = dictArray[i].MESSAGE;
          }
        }

        objDictionary[formID] = formDict;

        //app.i18n.setLocaleMessage(lang, {});
        app.i18n.mergeLocaleMessage(lang, formDict);

        commit("FETCH_DICTIONARY_I18N_SUCCESS", objDictionary);
      } catch (e) {
        console.log(e);
      }
    }

    //console.log(app.i18n)
  },

  switchDictionary({ commit, state }, { app, lang, form, _db2 }) {
    let objDictionary = { ...state.dictionaryList_i18n };
    if (objDictionary.hasOwnProperty(form.MENU_CD)) {
      console.log('state.user ', state.user);
      //dictionary has existed (swith tab)
      //console.log( objDictionary[formID])
      //app.i18n.mergeLocaleMessage(lang, objDictionary[formID]);
      setTimeout(async () => {
        //app.i18n.setLocaleMessage(lang, {});
        //app.i18n.mergeLocaleMessage(lang, objDictionary[form.MENU_CD]);
        // console.log(state.user)

        if (!state.user) {
          console.log('state.user ', state.user);
          window.location.href = "/login";
          return;
        }

        const theme = state.user.USER_THEME ? JSON.parse(state.user.USER_THEME) : "";
        if (theme && Object.keys(theme).length) {
          if (theme.mergeDictionary == true) {
            app.i18n.mergeLocaleMessage(lang, objDictionary[form.MENU_CD]);
          }
        } else {
          // default
          app.i18n.mergeLocaleMessage(lang, objDictionary[form.MENU_CD]);
        }

        commit("SET_DICT_FORM_ID", form.MENU_CD);
        const menuCode = form.tabUrl && form.tabUrl.split("/").pop() ? form.tabUrl.split("/").pop().toUpperCase() : "";
        commit("FETCH_ACTIVE_FORM", menuCode);
      }, 1);
    }
  },

  async getCwCommonParam({ commit, state }) {
    let { data, message } = await this.$axios.$post("/dso/callproc", {
      proc: "CW_SEL_COMMON_PARAM",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_CW_COMMON_PARAM_SUCCESS", data[0]);
    } else {
      console.log("getCwCommonParam: " + message);
      commit("FETCH_CW_COMMON_PARAM_FAILED");
    }
  },

  async getCwCommonParamServer({ commit, state }) {
    let instance = this.$axios.create({
      baseURL: process.env.LOCAL_API_URL ? process.env.LOCAL_API_URL : process.env.API_URL,
    });
    instance.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    instance.defaults.headers.common["Accept-Language"] = language;
    let { data, message } = await instance.$post("/dso/callproc", {
      proc: "CW_SEL_COMMON_PARAM",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_CW_COMMON_PARAM_SUCCESS", data[0]);
    } else {
      console.log("getCwCommonParam: " + message);
      commit("FETCH_CW_COMMON_PARAM_FAILED");
    }
  },

  updateMenuDrawerWidth({ commit }, width) {
    commit("FETCH_MENU_DRAWER_WIDTH_SUCCESS", width);
  },

  async getFavMenu({ commit, state }) {
    const { data, message } = await this.$axios.$post("dso/callproc", {
      proc: "SYS_SEL_USER_FAV_MENU",
      para: [state.user.PK],
    });
    if (data && data.length) {
      commit("FETCH_FAV_MENU_SUCCESS", data);
    } else {
      console.log(`getFavMenus error: ${message}`);
      commit("FETCH_FAV_MENU_FAILED");
    }
  },

  updateWindowHeight({ commit }, height) {
    commit("UPDATE_WINDOW_HEIGHT", height);
  },

  updateWindowWidth({ commit }, width) {
    commit("UPDATE_WINDOW_WIDTH", width);
  },

  updateFormContainerHeight({ commit }, height) {
    commit("UPDATE_FORM_CONTAINER_HEIGHT", height);
  },

  updateComponentKey({ commit }, key) {
    commit("UPDATE_COMPONENT_KEY", key);
  },
};

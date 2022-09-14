<template>
  <div id="app">
    <v-app>
      <client-only>
        <notifications></notifications>
      </client-only>

      <v-overlay z-index="9999" :value="isRefreshing">
        <v-progress-circular indeterminate color="#fff" size="64" :width="7"></v-progress-circular>
      </v-overlay>

      <!-- Store Procedure's Logs Panel -->
      <LogPanel :visible="logWindowIsOpen" :user="{...user}" :logDatas=[...logDatas] @togglePanel="logWindowIsOpen = $event" />

      <!-- Navigation Drawer / Left Bar -->
      <v-navigation-drawer app fixed id="left-navigation-drawer" ref="drawer" :bottom="$vuetify.breakpoint.mdAndDown" :permanent="drawer && $vuetify.breakpoint.lgAndUp" :width="navigation.width" v-model="drawer">
        <template v-slot:prepend>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex flex-column justify-center">
              <v-btn icon small @click="logWindowIsOpen = !logWindowIsOpen" v-if="$vuetify.breakpoint.lgAndUp && user && user.SYSADMIN_YN === 'Y' && !logWindowIsOpen">
                <v-icon small>mdi-note-text</v-icon>
              </v-btn>
              <div class="d-flex text-h4 font-weight-bold mx-4" v-if="appName">
                <span class="primaryText">{{ appName }}</span>
              </div>
              <div class="d-flex text-h4 font-weight-bold mx-4" v-else>
                <span class="primaryText">G-</span>
                <span class="primaryText">ERP</span>
              </div>
            </div>
            <div class="align-self-end">
              <v-btn icon :color="currentTheme" class="mr-5" @click="toggleMenu('close')" v-if="$vuetify.breakpoint.lgAndUp">
                <v-icon>mdi-backburger</v-icon>
              </v-btn>
            </div>
          </div>  
        </template>        
        
        <v-list dense expand rounded style="overflow-y: overlay">
          <!-- Favorite Menus -->
          <v-list-group active-class="primary-gradient primaryTextFour" v-if="!!favMenuList ? favMenuList.length : 0">
            <template v-slot:activator>
              <v-list-item-title class="font-weight-bold">{{ $t('favorites') }} ({{ favMenuList.length }})</v-list-item-title>
            </template>

            <v-sheet class="menuGroupBg">
              <v-list-item nuxt active-class="primaryTextThree" v-for="favMenu in favMenuList" :key="favMenu.PK" :to="favMenu.FORM_URL" :disabled="isClicked" @click="openNewTab(favMenu)">
                <v-list-item-content class="ml-3">
                  <v-list-item-title class="font-weight-bold">
                    <v-icon small>{{ favMenu.MENU_CD === currentForm ? 'mdi-minus-thick' : 'mdi-circle-medium'}}</v-icon> {{ favMenu.FORM_NM }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-sheet>
          </v-list-group>
          <!-- Menus -->
          <v-list-group active-class="primary-gradient primaryTextFour" v-for="menu in menuList" :key="menu.PK">
            <template v-slot:activator>
              <v-list-item-title class="font-weight-bold">{{ menu.FORM_NM }} ({{ menu.childMenu.length }})</v-list-item-title>
            </template>
            
            <v-sheet class="menuGroupBg">
              <v-list-group active-class="primaryTextTwo" append-icon="" v-for="(menu2, idx2) in menu.childMenu" :key="menu2.PK">
                <template v-slot:activator>
                  <div class="d-flex flex-column align-start justify-start w-100">
                    <v-list-item-content class="ml-3 w-100">
                      <v-list-item-title class="font-weight-bold">{{ menu2.FORM_NM }} ({{ menu2.childMenu.length }})</v-list-item-title>
                    </v-list-item-content>
                    <v-divider class="w-100" v-if="idx2 !== menu.childMenu.length-1"></v-divider>
                  </div>
                </template>
                
                <v-list-item nuxt active-class="primaryTextThree" v-for="menu3 in menu2.childMenu" :key="menu3.PK" :to="menu3.FORM_URL" :disabled="isClicked" @click="openNewTab(menu3)">
                  <v-list-item-content class="ml-3">
                    <v-list-item-title class="font-weight-bold">
                      <v-icon small>{{ menu3.MENU_CD === currentForm ? 'mdi-minus-thick' : 'mdi-circle-medium'}}</v-icon> {{ menu3.FORM_NM }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-sheet>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar / Top Bar -->
      <v-app-bar app dense flat id="appBar" color="secondary2" height="35" v-model="appBar">
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$vuetify.breakpoint.mdAndDown">
          <template>
            <v-icon :color="currentTheme">mdi-menu</v-icon>
          </template>
        </v-app-bar-nav-icon> -->
        <v-app-bar-nav-icon @click.stop="toggleMenu('open')" v-if="!drawer">
          <template>
            <v-icon :color="currentTheme">mdi-menu</v-icon>
          </template>
        </v-app-bar-nav-icon>
        <div class="d-flex w-100" :style="appBar ? 'border-bottom: 1px solid #bcc6cf;' : ''">
          <!-- User Actions -->
          <div class="d-flex align-center justify-space-between" v-if="user">
            <!-- User Name -->
            <span class="text-subtitle-2 font-weight-bold primaryText">{{ user.USER_NAME }}</span>
            <div class="mx-2"></div>
            <!-- Personal Infos -->
            <v-btn depressed rounded small color="white" class="primaryText font-weight-bold" @click="personalInfoDialog = true">
              <v-icon left small class="mr-1">mdi-account</v-icon> 
              <span>{{ $t("personal_info") }}</span>
            </v-btn>
            <div class="mx-2"></div>
            <!-- Log Out -->
            <v-btn depressed rounded small color="white" class="primaryText font-weight-bold" @click="logOut">
              <v-icon left small class="mr-1">mdi-lock-open-variant</v-icon> 
              <span>{{ $t("log_out") }}</span>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <!-- Add to Favorite Menus -->
          <div class="squareBox" v-if="user && tabList.length">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn small icon v-on="on" @click="addToFavorites">
                  <v-icon :color="currentTheme">{{ isAddedToFavorites ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ !isAddedToFavorites ? $t("add_to_favorite_menus") : $t("remove_from_favorite_menus") }}</span>
            </v-tooltip>
          </div>
          <!-- Show Message History -->
          <div class="squareBox" v-if="user">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="$refs.messageHistoryDialog.dialogIsShow = true">
                  <v-icon :color="currentTheme">mdi-text-box</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("show_message_history") }}</span>
            </v-tooltip>
          </div>
          <!-- Close All Form / Tab Button -->
          <div class="squareBox" v-if="user">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="closeAllTabs">
                  <v-icon :color="currentTheme">mdi-close-thick</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("close_all_tab") }}</span>
            </v-tooltip>
          </div>
          <!-- Open Manual -->
          <div class="squareBox" v-if="user">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="openManualDialog">
                  <v-icon :color="currentTheme">mdi-help-box</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("show_manual") }}</span>
            </v-tooltip>
          </div>
          <!-- Open Dictionary -->
          <div class="squareBox" v-if="user && user.SYSADMIN_YN === 'Y'">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="openDictionaryDialog">
                  <v-icon :color="currentTheme">mdi-book-open-page-variant</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("show_dictionary") }}</span>
            </v-tooltip>
          </div>
          <!-- Refresh Button -->
          <div class="squareBox" v-if="user">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="refreshCurrentTab">
                  <v-icon :color="currentTheme">mdi-cached</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("refresh") }}</span>
            </v-tooltip>
          </div>
          <!-- Change Theme Button -->
          <div class="squareBox themePanelIncluded" v-if="user">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="themeCustomPanel = !themeCustomPanel">
                  <v-icon :color="currentTheme">mdi-cog</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("customize_theme") }}</span>
            </v-tooltip>
          </div>
          <!-- Select Language Menu -->
          <div class="squareBox" v-if="user">
            <v-menu offset-y nudge-bottom="10px" transition="slide-y-transition" v-if="curLang">
              <template v-slot:activator="{ on }">
                <div class="pointer" style="border: 1.5px solid #bcc6cf; border-radius: 50%;" v-on="on">
                  <v-img contain height="25" width="25" style="border-radius: 50%" :src="curLang.ICON"></v-img>
                </div>
              </template>

              <v-list v-if="_languages.length">
                <v-list-item v-for="item in _languages" :key="item.CODE" @click="selectLanguage(item)">
                  <v-list-item-avatar tile size="25">
                    <v-img :src="item.ICON"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.NAME"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <!-- V-Tab / App Bar Extension -->
        <template v-slot:extension v-if="show_ext">
          <v-chip-group  mandatory show-arrows active-class="primaryTextTwo" v-model="tab">
            <template v-slot:prev>
              <v-btn icon :color="currentTheme">
                <v-icon large :color="currentTheme">mdi-menu-left</v-icon>
              </v-btn>
            </template>
            <template v-slot:next>
              <v-btn icon :color="currentTheme">
                <v-icon large :color="currentTheme">mdi-menu-right</v-icon>
              </v-btn>
            </template>
            <v-chip close label link class="font-weight-bold py-0 my-0" color="white" text-color="#A1A1A1" style="height: 35px;" :id="`tab-${item.tabID}`" v-for="item in tabList" :key="item.tabID" @click="switchToTab(item)" @click:close="closeCurrentTab(item)">
              {{ item.tabName }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-app-bar>

      <!-- Customize Theme Panel -->
      <v-sheet>
        <CustomizeThemePanel :visible="themeCustomPanel" @onToggle="themeCustomPanel = $event" />
      </v-sheet>

      <v-main id="mainWrapper" v-resize="onResize">
        <v-window class="h-100" v-model="tab">
          <v-window-item eager class="h-100" transition="fade-transition" reverse-transition="fade-transition" v-for="item in tabList" :key="item.tabID">
            <v-container fluid class="py-0 h-100" :class="appBar ? 'pl-2 pr-0' : 'px-0'">
              <v-row no-gutters align-items="stretch" justify-content="center" class="fill-height">
                <v-col cols="12">
                  <v-card flat class="overflow-y-overlay overflow-x-hidden" :id="`formWrapper-${item.tabID}`" :height="appBar ? formContainerHeight : (formContainerHeight + 90)">
                    <nuxt keep-alive :nuxt-child-key="item.tabID.toString()" role="main" />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-main>

      <v-scale-transition origin="bottom center">
        <v-btn dark depressed fab fixed bottom right small :color="currentTheme" v-if="manualIsMinimized" @click="restoreManualDialog">
          <v-icon>mdi-window-restore</v-icon>
        </v-btn>
      </v-scale-transition>

      <!-- Personal Info Dialog -->
      <personal-info-dialog :userData="{...user}" v-if="personalInfoDialog" @closeDialog="personalInfoDialog = false" />
      <!-- Dictionary Dialog -->
      <dictionary-dialog :formID="this.curTab ? this.curTab.MENU_CD : null" v-if="dictionaryDialog" @closeDictionaryDialog="dictionaryDialog = false"></dictionary-dialog>
      <!-- Manual Dialog -->
      <manual-dialog ref="manualDialog" :formID="this.curTab ? this.curTab.MENU_CD : null" :isAdmin="user.SYSADMIN_YN" v-if="manualDialog" @minimizeDialog="manualIsMinimized = true" @closeManualDialog="manualDialog = false"></manual-dialog>
      <!-- Message History Dialog -->
      <message-history-dialog ref="messageHistoryDialog" />
    </v-app>
  </div>
</template>

<script>
const findValueDeep = require('deepdash/findValueDeep');
const eachDeep = require('deepdash/eachDeep')
export default {
  name: "default",

  components: {
    LogPanel: () => import("@/components/layout/LogPanel"),
    CustomizeThemePanel: () => import("@/components/layout/CustomizeThemePanel"),
    PersonalInfoDialog: () => import("@/components/dialog/PersonalInfoDialog"),
    DictionaryDialog: () => import("@/components/dialog/DictionaryDialog"),
    ManualDialog: () => import("@/components/dialog/ManualDialog"),
    MessageHistoryDialog: () => import("@/components/dialog/MessageHistoryDialog"),
  },

  head() {
    return {
      link: [
        { href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900", rel: "stylesheet" },
        { href: "https://fonts.googleapis.com/css?family=Montserrat:200,400,700", rel: "stylesheet" }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/lodash/lodash.min.js" },
        { src: "https://cdn.jsdelivr.net/npm/deepdash/browser/deepdash.min.js" },
      ],
    };
  },

  data: () => ({
    appName: process.env.APP_NAME,
    logo: require("@/assets/images/gnws_logo.jpg"),
    drawer: null,
    appBar: true,
    show_ext: true,
    navigation: {
      shown: false,
      width: 300,
      borderSize: 2
    },
    tab: null,
    curTab: null,
    tabList: [],
    tempFormArray: ["COMMON"],
    isClicked: false,

    themeCustomPanel: false,

    logWindowIsOpen: false,
    dictionaryDialog: false,
    isRefreshing: false,
    manualDialog: false,
    manualIsMinimized: false,
    personalInfoDialog: false,

    btnThemeStyleList: [
      { value: { isDepressed: true }, text: 'Default' },
      { value: { isOutlined: true }, text: 'Outlined' },
      { value: { isText: true }, text: 'Text' },
      { value: { isIcon: true, isTile: true }, text: 'Icon' }
		],
		defaultBtnThemeStyle: {
			isIcon: false,
			isDepressed: false,
			isOutlined: false,
			isRounded: false,
			isShaped: false,
			isText: false,
			isTile: false
		},
    selectedBtnThemeStyle: { isDepressed: true },
    currentForm: '',
    db2:"N",
  }),
  
  created() {
    this.$nuxt.$on('changeLayout', (layoutName) => {
      if(layoutName === 'monitoring') {
        this.drawer = false;
        this.appBar = false;
        this.show_ext = false;
        this.openFullscreen()
      } else {
        this.drawer = true
        this.appBar = true
        this.show_ext = true;
        this.closeFullscreen()
      }
    })
    this.$nuxt.$on('openFormInLayout', (formID) => {
      this.findMenuFromMenuList(formID);
    })
    this._updateLocale(this._language);
     //get dictionary common first login for i18n
    this.$store.dispatch("auth/refreshDictionary_i18n", {app: this.$store.app, lang: "COMMON", openTabs: [], activeTab:  ""})
  },

  async mounted() {
    const query = this.$route.query;
    if (query) {
      try {
        findValueDeep(
          this.menuList,
          (value) => {
            if (value.FORM_URL) {
              if (value.FORM_URL.split("/").pop() === query.form) {
                this.openNewTabSSO(value);
              }
            }
          },
          { childrenPath: "childMenu" }
        );
      } catch (e) {
        console.log("findDeepValue catch error!");
        console.log(e.message);
      }
    }
    this.$store.dispatch("auth/updateMenuDrawerWidth", this.navigation.width);
  },

  destroyed() {
    this.$nuxt.$off('changeLayout');
    this.$nuxt.$off('openFormInLayout');
  },

  computed: {
    user() { return this.$store.getters["auth/user"] },
    menuList() { return this.$store.getters["auth/menuList"] },
    favMenuList() { return this.$store.getters["auth/favoriteMenu"] },
		logDatas() { return this.$store.getters["auth/logs"] },
    hasForm() {
      const activeForm = this.$route && this.$route.path.split("/")[3] ? this.$route.path.split("/")[3].toUpperCase() : ''
      if(activeForm) {
        return true
      }
      return false
    },
    isAddedToFavorites() {
      if(this.favMenuList.length) {
        const found = this.favMenuList.find(x => x.MENU_CD === this.curTab.MENU_CD);
        if(found) {
          return true;
        }
        return false;
      }
    }
  },

  watch: {
    '$vuetify.breakpoint.lgAndUp': {
      immediate: true,
      handler(val) {
        if(!val) {
          this.$nextTick(function() {
            this.removeBorderWidth()
          })
        } else {
          this.$nextTick(function() {
            this.setBorderWidth();
            this.setEvents();
            this.navigation.width = 300
          })
        }
      }
    },
    '$route'(val) {
      this.currentForm = val && val.path.split("/")[3] ? val.path.split("/")[3].toUpperCase() : ''
    }
  }, 

  methods: {
    setBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(".v-navigation-drawer__border");
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
      i.style.backgroundColor = "green";
    },

    removeBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(".v-navigation-drawer__border");
      i.style.width = 0 + "px";
      i.style.cursor = "";
      i.style.backgroundColor = "";
    },

    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right") ? "right" : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f = direction === "right" ? document.body.scrollWidth - e.clientX : e.clientX;
        if(f < 10) {
          f = 10
        }
        vm.navigation.width = f;
        vm.$store.dispatch("auth/updateMenuDrawerWidth", f)
      }

      drawerBorder.addEventListener(
        "mousedown",
        (e) => {
          if (e.offsetX < minSize) {
            el.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        () => {
          el.style.transition = "";
          this.navigation.width = el.style.width;
          document.body.style.cursor = "";
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    },

    async selectLanguage(item) {
      if (item.CODE === this._language) {
        return
      }
      this.isRefreshing = true
      
      this.$store.dispatch("lang/saveLanguage", { language: item.CODE });
      this.$store.dispatch("auth/setWaitingChangeLang", true);

      let tabIds = Array.from( this.tabList, x => x[ "MENU_CD" ] );
      await this.$store.dispatch("auth/refreshDictionary_i18n", {app: this.$store.app, lang: item.CODE, openTabs: tabIds, activeTab: this.curTab?  this.curTab.MENU_CD : "",_db2:this.db2})
      .then( () => {
        this.$store.dispatch("auth/setWaitingChangeLang", false);
      } );
      await this.$store.dispatch("auth/getMenuList").then(() => {
        if (this.tabList.length) {
          this.refreshTabName();
        }
        this.isRefreshing = false;
        this.$store.dispatch("auth/getFavMenu");
      })
      this._updateLocale(item.CODE)
    },

    refreshTabName() {
      try {
        eachDeep(
          this.menuList,
          (value) => {
            if (value.FORM_URL) {
              //const idx = this.tabList.findIndex((item) => item.tabUrl === value.FORM_URL)
              const idx = this.tabList.findIndex((item) => item.MENU_CD === value.MENU_CD)
              if (idx > -1) {
                this.tabList[idx].tabName = value.FORM_NM
              }
            }
          },
          { childrenPath: "childMenu" }
        )
      } catch (e) {
        console.log("refreshTabName-eachDeep catch error!");
        console.log(e.message);
      }
    },

    async openNewTab(item) {
      this.isClicked = true;
      //get dictionary form for i18n
      //console.log("item.SECOND_DB_YN",item)
      this.db2=item.SECOND_DB_YN;
      await this.$store.dispatch("auth/setFormDictionary_i18n", { app: this.$store.app, lang: this.$store.getters["lang/language"], formID: item.MENU_CD,_db2:"N" });
      const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
      if (idx > -1) {
        this.tab = idx;        
      } else {
        this.tabList.push({
          tabID: item.PK,
          MENU_CD: item.MENU_CD,
          tabName: item.FORM_NM,
          tabUrl: item.FORM_URL,
        });
        const found = this.tempFormArray.find((x) => x === item.MENU_CD);
        if (!found) {
          this.tempFormArray.push(item.MENU_CD);
        }
        this.$nextTick(() => {
          this.tab = this.tabList.length - 1;
        });
      }
      this.curTab = item;
      this.isClicked = false;
    },
    
    async openNewTabSSO(item) {
      this.isClicked = true;
      //get dictionary form for i18n
      this.db2=item.SECOND_DB_YN;
      await this.$store.dispatch("auth/setFormDictionary_i18n", { app: this.$store.app, lang: this.$store.getters["lang/language"], formID: item.MENU_CD,_db2:"N"  } ) ;
      const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
      if (idx > -1) {
        this.tab = idx;
      } else {
        this.tabList.push({
          tabID: item.PK,
          MENU_CD: item.MENU_CD,
          tabName: item.FORM_NM,
          tabUrl: item.FORM_URL,
        });
        const found = this.tempFormArray.find((x) => x === item.MENU_CD);
        if (!found) {
          this.tempFormArray.push(item.MENU_CD);
        }
        this.$nextTick(() => {
          this.tab = this.tabList.length - 1;
          document.getElementById(`tab-${item.PK}`).click();
          this.$router.push({ path: item.FORM_URL });
        });
        setTimeout(() => {
          this.refreshCurrentTab();
        }, 5000);
      }
      this.curTab = item;
      this.isClicked = false;
    },

    async switchToTab(item) {
      this.curTab = item;
      this.db2=item.SECOND_DB_YN;
      //this.$store.dispatch("auth/setWaitingChangeLang", true);
      //get dictionary form for i18n
      await this.$store.dispatch("auth/setFormDictionary_i18n", { app: this.$store.app, lang: this.$store.getters["lang/language"], formID: item.MENU_CD,_db2:"N"  } ) ;
     // this.$store.dispatch("auth/setWaitingChangeLang", false);
      this.$store.dispatch("auth/setDictionaryFormID", item.MENU_CD);
      this.$router.push({ path: item.tabUrl });
    },

    async closeCurrentTab(item) {
      // Remove current tab from tabList array
      this.tabList = this.tabList.filter((x) => x.MENU_CD !== item.MENU_CD);
      this.tempFormArray = this.tempFormArray.filter((x) => x !== item.MENU_CD);
      // Check tabList array and router push
      this.$nextTick(() => {
        if (this.tabList.length) {
          this.tab = 0;
          this.curTab = this.tabList[0];
          this.$store.dispatch("auth/setDictionaryFormID", this.curTab.MENU_CD);
          this.$router.push({ path: this.tabList[0].tabUrl });
        } else {
          this.tab = null;
          this.$router.push("/");
        }
        //set dict to tab active
      });
      this.$store.dispatch("auth/removeCurrentFormDictionary", item.MENU_CD);
      //this.$store.dispatch("auth/setWaitingChangeLang", true);
      await this.$store.dispatch("auth/setFormDictionary_i18n", { app: this.$store.app, lang: this.$store.getters["lang/language"], formID: this.curTab.MENU_CD,_db2:"N" } ) ;
      //this.$store.dispatch("auth/setWaitingChangeLang", false);
    },

    closeAllTabs() {
      if (this.tabList.length) {
        this.tabList = [];
        this.tab = null;
        this.tempFormArray = this.tempFormArray.filter((item) => item === "COMMON");
        this.$store.dispatch("auth/removeAllFormDictionary", { app: this.$store.app, lang: this.$store.getters["lang/language"]} );
        this.$router.push({ path: "/" });
      }
    },

    refreshCurrentTab() {
      if (this.tabList.length) {
        // Save current tab to temp variable
        const tempTab = this.tabList[this.tab];
        const tempIdx = this.tabList[this.tab].tabID;
        if (tempTab) {
          // Remove current tab from tabList array
          this.tabList.splice(this.tab, 1);
          // Push temp tab to tabList array
          this.$nextTick(() => {
            this.tabList.push(tempTab);
            this.$nextTick(() => {
              document.getElementById(`tab-${tempIdx}`).click();
              this.$router.push({ path: tempTab.tabUrl });
            });
          });
        }
      }
    },

    async logOut() {
      await this.$store.dispatch("auth/logout");
      if (!this.$store.getters["auth/token"]) {
        this.$router.push("/login");
      }
    },

    openDictionaryDialog() {
      if(this.hasForm) {
        this.dictionaryDialog = true
      }
    },

    openManualDialog() {
      if(this.hasForm) {
        if(this.manualIsMinimized) {
          this.manualIsMinimized = false
          this.$refs.manualDialog.manualDialog = true
        } else {
          this.manualDialog = true
        }
      }
    },

    restoreManualDialog() {
      this.manualIsMinimized = false
      this.$refs.manualDialog.manualDialog = true
    },

    findMenuFromMenuList(formID) {
      if(formID) {
        try {
          findValueDeep(
            this.menuList,
            (value) => {
              if (value.MENU_CD) {
                if (value.MENU_CD.toUpperCase() === formID.toUpperCase()) {
                  return this.openNewTab2(value)
                }
              }
            },
            { childrenPath: "childMenu" }
          );
        } catch (e) {
          console.log("findDeepValue catch error!");
          console.log(e.message);
        }
      }
    },

    async openNewTab2(item) {
      this.isRefreshing = true
      this.isClicked = true;
      //get dictionary form for i18n
      await this.$store.dispatch("auth/setFormDictionary_i18n", { app: this.$store.app, lang: this.$store.getters["lang/language"], formID: item.MENU_CD,_db2:"N"  });
      const idx = this.tabList.findIndex((x) => x.tabID === item.PK);
      if (idx > -1) {
        this.tab = idx;
      } else {
        this.curTab = item; 
        this.tabList.push({
          tabID: item.PK,
          MENU_CD: item.MENU_CD,
          tabName: item.FORM_NM,
          tabUrl: item.FORM_URL,
        });
        const found = this.tempFormArray.find((x) => x === item.MENU_CD);
        if (!found) {
          this.tempFormArray.push(item.MENU_CD);
        }
        this.$nextTick(() => {
          this.tab = this.tabList.length - 1;
          this.$router.push({ path: item.FORM_URL });
          setTimeout(() => {
            this.refreshCurrentTab();
            this.isRefreshing = false
          }, 2000);
        });
      }
      this.isClicked = false;
    },

    openFullscreen() {
      var elem = document.getElementById("app");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    },

    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    },

    toggleMenu(type) {
      this.drawer = !this.drawer;
      if(type === "close") {
        this.$store.dispatch("auth/updateMenuDrawerWidth", 0);
      } else {
        this.$store.dispatch("auth/updateMenuDrawerWidth", 300)
      }
    },

    async addToFavorites() {
      try {
        const status = !this.isAddedToFavorites ? "i" : "d";
        const menuPK = this.curTab.PK ? this.curTab.PK : this.curTab.tabID;
        const { data, message } = await this.$axios.$post("dso/callproc", {
          proc: "SYS_UPD_USER_FAV_MENU",
          para: [ status, this.user.PK, menuPK ]
        });
        if(data && data.length) {
          this.$store.dispatch("auth/getFavMenu");
          this.showNotification("success", this.$t("update_favorite_menu_successful"), "", 3000);
        } else {
          this.showNotification("danger", this.$t("update_favorite_menu_failed"), message)
        }
      } catch (error) {
        this.showNotification("danger", this.$t("update_favorite_menu_failed"), error.message)
      }
    }
  }
};
</script>
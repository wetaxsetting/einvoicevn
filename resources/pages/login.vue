<template>
  <v-container class="box-conatiner " color="#f2f7ff">
    <v-row align="center" justify="center">
      <v-col cols="7">
        <v-row no-gutters>
          <v-col cols="1" class="circle-ripple"> </v-col>
        </v-row>
        <v-row no-gutters class="">
          <v-col
            cols="10"
            class="formTitle font-weight-bold px-0 white--text text--light-4 pr-10"
            color="#ffffff !important"
            align="center"
          >
            {{ $t(appName) }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" class="">
        <v-container fluid class="pa-0">
          <v-row class="mt-12"><v-col cols="12"></v-col></v-row>
          <v-row class="mt-12" align="center" justify="center">
            <v-col cols="12" class="wrap-input100">
              <v-form lazy-validation ref="logInForm" v-model="formIsValid">
                <v-text-field
                  outlined
                  single-line
                  validate-on-blur
                  class="my-input"
                  label="Username"
                  :color="currentTheme"
                  :rules="inputRule"
                  v-model="userName"
                  @keypress.enter="checkLogIn"
                ></v-text-field>
                <v-text-field
                  outlined
                  single-line
                  validate-on-blur
                  class="my-input"
                  label="Password"
                  :color="currentTheme"
                  :rules="inputRule"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  v-model="password"
                  @keypress.enter="checkLogIn"
                ></v-text-field>
              </v-form>
              <v-btn
                depressed
                class="login100-form-btn white--text"
                height="62"
                :disabled="isProcessing"
                :loading="isProcessing"
                @click="checkLogIn"
                >Log In</v-btn
              >
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="">
            <v-col cols="12" align="center"> </v-col>
          </v-row>
          <v-row align="center" justify="center" class="">
            <v-col cols="12" align="center">
              <v-label class="" align="center">
                <span class="formBottom" align="center">
                  Copyright (c) 2020, Webcash Vietnam JSC. All rights Reserved.
                  <br />Design by Webcash Vietnam JSC.
                </span>
              </v-label>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "login",

  head() {
    return {
      link: [
        {
          href:
            "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
          rel: "stylesheet",
        },
      ],
    };
  },

  asyncData({ env }) {
    return {
      appName: env.APP_NAME,
    };
  },

  data: () => ({
    formIsValid: undefined,
    userName: "vng-067",
    password: "1234567",
    showPassword: false,
    inputRule: [(v) => !!v || "Please fill in this field!"],
    isProcessing: false,
  }),

  created() {
    if (this.$store.getters["auth/user"]) {
      this.$router.push("/");
    }
  },

  methods: {
    async checkLogIn() {
      if (this.$refs.logInForm.validate()) {
        this.formIsValid = true;
        try {
          this.isProcessing = true;
          const res = await this.$axios.$post("user/login", { user_id: this.userName, password: this.password });
          if (res.data) {
            this.showNotification("success", "Log In Successfully!", "");
            await this.$store.dispatch("auth/saveToken", { token: res.data.token });
            await this.$store.dispatch("auth/saveUserInfo");
            if (this.$store.getters["auth/user"]) {
              this.$store.dispatch("lang/saveLanguage", { language: this.$store.getters["auth/user"].USER_LANGUAGE })
							this.$store.dispatch("auth/loadColorTheme", this.$store.getters["auth/user"].USER_THEME).then((userTheme) => {
								if(userTheme && Object.keys(userTheme).length) {
      						this.$store.dispatch("auth/setColorTheme", { color: userTheme.color, textColor: userTheme.textColor });
									document.documentElement.style.setProperty("--primary-color", userTheme.primaryColor);
									document.documentElement.style.setProperty("--primary-color-start", userTheme.primaryColorStart);
									document.documentElement.style.setProperty("--primary-color-stop", userTheme.primaryColorStop);
									document.documentElement.style.setProperty("--primary-color-2", userTheme.primaryColor2);
									document.documentElement.style.setProperty("--primary-color-3", userTheme.primaryColor3);
                  document.documentElement.style.setProperty("--grid-header-color", userTheme.gridHeaderColor);
								}
							})
              await this.$store.dispatch("lang/getLanguages");
              await this.$store.dispatch("lang/getLangMappingList");
              await this.$store.dispatch("auth/getMenuList");
              await this.$store.dispatch("auth/getFavMenu");
              await this.$store.dispatch("auth/getCwCommonParam");
              this.isProcessing = false;
              this.$router.push("/");
            }
          } else {
            this.isProcessing = false;
            this.showNotification("danger", "Log In Failed!", res.message);
          }
        } catch (e) {
          this.isProcessing = false;
          this.showNotification("danger", "Error Occurs!", e.message);
        }
      } else {
        this.formIsValid = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.cardContainer {
  height: auto;
  background-color: #fff;
  border-radius: 28px;
  box-shadow: 8px 8px 43px rgb(0 0 0 / 15%) !important;
  box-sizing: border-box;
  // padding: 68px 53px 80px;
}

.my-input.v-input .v-input__slot {
  border-radius: 100px;
}

.formTitle {
  font-family: "Gmarket Sans";
  font-size: 35px;
  text-shadow: 8px 8px 43px rgb(0 0 0 / 15%);
}

.formBottom {
  font-family: "Gmarket Sans";
  font-size: 8px;
  text-shadow: 8px 8px 43px rgb(0 0 0 / 15%);
  text-align: right;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.main-bg::after {
  background-color: #fef5e4;
  -webkit-border-radius: 0 0 233px 135px;
  -moz-border-radius: 0 0 233px 135px;
  border-radius: 0 0 233px 135px;
  content: "";
  position: absolute;
  right: -119px;
  top: -93px;
  background-color: #fef5e4;
  width: 466px;
  height: 595px;
  -webkit-transform: rotate(45deg);
  transform: rotate(116deg);
  z-index: -2;
}

.box-conatiner {
  contain: content;
  margin: 100px auto;
  height: 500px;
  width: 1220px !important;
  background-color: #5d4ef3;
  border-radius: 0 70px;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03);
  transition-property: background;
  transition-duration: 1s;
}

.box-conatiner::before {
  content: "";
  background: url("~assets/images/shape.png");
  position: absolute;
  right: -20px;
  background-size: 100%;
  top: -80px;
  width: 1220px !important;
  height: 653px !important;
}

/***************************/
#a {
  -webkit-animation: wait 0s alternate infinite;
  animation: wait 0s alternate infinite;
}

.circle-ripple {
  background-color: transparent;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  -webkit-animation: ripple 0.7s linear infinite;
  animation: ripple 0.7s linear infinite;
  left: 60px;
  position: absolute;
  top: 44px;
}

@-webkit-keyframes wait {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 0;
  }

  40% {
    opacity: 0;
  }

  60% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes wait {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 0;
  }

  40% {
    opacity: 0;
  }

  60% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-webkit-keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3),
      0 0 0 1em rgba(255, 255, 255, 0.3), 0 0 0 3em rgba(255, 255, 255, 0.3),
      0 0 0 5em rgba(255, 255, 255, 0.3);
  }

  100% {
    box-shadow: 0 0 0 1em rgba(255, 255, 255, 0.3),
      0 0 0 3em rgba(255, 255, 255, 0.3), 0 0 0 5em rgba(255, 255, 255, 0.3),
      0 0 0 8em rgba(255, 255, 255, 0);
  }
}

@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3),
      0 0 0 1em rgba(255, 255, 255, 0.3), 0 0 0 3em rgba(255, 255, 255, 0.3),
      0 0 0 5em rgba(255, 255, 255, 0.3);
  }

  100% {
    box-shadow: 0 0 0 1em rgba(255, 255, 255, 0.3),
      0 0 0 3em rgba(255, 255, 255, 0.3), 0 0 0 5em rgba(255, 255, 255, 0.3),
      0 0 0 8em rgba(255, 255, 255, 0);
  }
}

.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  position: relative;
  background-color: #fff;
}

.wrap-input100 {
  width: 100%;
  background-color: #fff;
  border-radius: 27px;
  position: relative;
  z-index: 1;
}

.wrap-inputbottom {
  width: 100%;
  background-color: #fff;
  position: relative;
  padding-top: 70px;
  text-align: right;
  font-style: italic;
}

.input100 {
  font-family: Ubuntu-Bold;
  font-size: 15px;
  color: #1b3815;
  line-height: 1.2;
  position: relative;
  display: block;
  width: 100%;
  height: 55px;
  background: #ebebeb;
  border-radius: 25px;
  padding: 0 35px;
}

.login100-form-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  // background-color: #5d4ef3;
  background: linear-gradient(90deg, #5d4ef3 0%, #9f96f8 100%);
  border-radius: 5px;
  font-size: 15px;
  color: #fff;
  line-height: 1.2;
  text-transform: uppercase;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

@media only screen and (max-width: 600px) {
  .wrap-login100 {
    width: 100%;
  }

  .wrap-login100 {
    width: 100%;
    right: -272px;
  }

  .heading-left {
    font-size: 19px;
    line-height: 34px;
  }

  .p-l-55 {
    padding-left: 20px;
  }

  .p-r-55 {
    padding-right: 20px;
  }

  .input100 {
    height: 40px;
  }

  .login100-form-btn {
    height: 40px;
  }

  .wrap-login100 {
    width: 95%;
  }
}

@media only screen and (min-width: 401px) and (max-width: 1070px) {
  .box-conatiner::before {
    background-size: 48%;
    top: -80px;
    background-repeat: no-repeat;
    background: none;
  }

  .heading-left {
    font-size: 24px;
    line-height: 40px;
    margin: 235px auto;
    letter-spacing: 4px;
  }

  .wrap-login100 {
    width: 90%;
  }
}
</style>

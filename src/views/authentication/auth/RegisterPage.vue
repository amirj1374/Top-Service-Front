<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthRegister from '../authForms/AuthRegister.vue';
</script>

<template>
  <v-row class="h-screen" no-gutters>
    <!---Left Part-->
    <v-col cols="12" class="d-flex align-center bg-lightprimary">
      <v-container>
        <div class="pa-7 pa-sm-12">
          <v-row justify="center">
            <div class="colorized-bg-effect-wrapper">
              <img src="/src/assets/images/vectors/colorized-bg.svg" class="colorized-bg-effect" alt="bg effect" draggable="false">
            </div>
            <v-col cols="12" lg="10" xl="6" md="7">
              <v-card elevation="0" class="loginBox">
                <v-card variant="outlined">
                  <v-card-text class="pa-9">
                    <!---Left Part Logo -->
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <Logo />
                        <h2 class="text-secondary text-h2 mt-8">ثبت نام</h2>
                        <h4 class="text-disabled text-h4 mt-3">اطلاعات خود را وارد کنید</h4>
                      </v-col>
                    </v-row>
                    <!---Left Part Logo -->

                    <!---Left Part Form-->
                    <AuthRegister />
                    <!---Left Part Form-->
                  </v-card-text>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Left Part-->
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
.colorized-bg-effect-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.colorized-bg-effect {
  //width: 100%;
  border: unset;
  animation: 6s colorize infinite linear;
  @keyframes colorize {
    0% {
      filter: hue-rotate(0) saturate(0);
    }
    50% {
      filter: hue-rotate(65deg) saturate(100);
    }
    75% {
      filter: hue-rotate(285deg) saturate(100);
    }
    100% {
      filter: hue-rotate(360deg) saturate(0);
    }
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('');
const username = ref('');
const router = useRouter();
const passwordRules = ref([
  (v: string) => !!v || 'رمز عبور وارد نشده است',
]);
/* eslint-disable @typescript-eslint/no-explicit-any */

const emailRules = ref([(v: string) => !!v || 'نام کاربری را وارد نمایید', (v: string) => /.+@.+\..+/.test(v) || 'نام کاربری صحیح نمی باشد']);
async function validate(values: any, { setErrors }: any) {
  try {
    const response = await api.auth.login({
      email: username.value,
      password: password.value
    });

    // Store the access token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    // Redirect to home or dashboard
    router.push('/');
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'ورود با خطا مواجه شد. لطفا دوباره تلاش کنید.';
    setErrors({ apiError: errorMsg });
    console.error('Login error:', error);
  }
}
</script>

<template>
  <!-- Register Link Section -->
  <div class="register-section">
    <span class="register-text">حساب کاربری ندارید؟</span>
    <router-link to="/auth/register" class="register-link">
      ثبت نام
    </router-link>
  </div>

  <h5 class="text-h5 text-center my-4 mb-8"></h5>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="username"
      :rules="emailRules"
      label="نام کاربری"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="رمز عبور"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
    ></v-text-field>
<!--    :append-icon="show1 ? '$eye' : '$eyeOff'"-->


    <div class="d-flex align-center justify-lg-space-between">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="ذخیره رمز عبور"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">فراموشی رمز عبور</a>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      وارد شوید</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
<!--  <div class="mt-5 text-right">-->
<!--    <v-divider />-->
<!--    <v-btn variant="plain" to="/auth/register" class="mt-2 text-capitalize ml-n2">Don't Have an account?</v-btn>-->
<!--  </div>-->
</template>
<style lang="scss" scoped>
.register-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 0;
}

.register-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
}

.register-link {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px 0;

  &:hover {
    color: rgb(var(--v-theme-primary));
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 2px;
    background-color: rgb(var(--v-theme-primary));
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}

// Responsive design
@media (max-width: 600px) {
  .register-link-container {
    padding: 12px;
    margin-bottom: 20px;
  }

  .register-link-content {
    flex-direction: column;
    gap: 8px;
  }

  .register-text {
    font-size: 13px;
  }

  .register-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

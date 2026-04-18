<template>
  <div class="admin-login">
    <form @submit.prevent="login" class="card">
      <h2>管理后台登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" class="input" placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" class="input" placeholder="请输入密码" />
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLoginView',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)

    const login = async () => {
      if (!username.value || !password.value) {
        error.value = '请输入用户名和密码'
        return
      }

      isLoading.value = true
      error.value = ''

      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 实际项目中应调用真实的登录API
        if (username.value === 'admin' && password.value === 'admin123') {
          // 保存token到本地存储
          localStorage.setItem('adminToken', 'admin_token_' + Date.now())
          router.push('/admin/dashboard')
        } else {
          error.value = '用户名或密码错误'
        }
      } catch (err) {
        error.value = '登录失败，请稍后重试'
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      error,
      isLoading,
      login
    }
  }
}
</script>
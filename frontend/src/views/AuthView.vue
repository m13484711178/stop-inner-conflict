<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="card max-w-md w-full">
      <h2 class="text-2xl font-bold mb-6 text-center">{{ isRegister ? '用户注册' : '用户登录' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            class="input" 
            placeholder="请输入用户名" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            class="input" 
            placeholder="请输入密码" 
            required
          />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-full" 
          :disabled="isLoading"
        >
          {{ isLoading ? '处理中...' : (isRegister ? '注册' : '登录') }}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-gray-600">
          {{ isRegister ? '已有账号？' : '还没有账号？' }}
          <button @click="toggleMode" class="text-primary">
            {{ isRegister ? '立即登录' : '立即注册' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveUser, getUser } from '../utils/storage';

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter();
    const isRegister = ref(false);
    const isLoading = ref(false);
    const error = ref('');
    const form = ref({
      username: '',
      password: ''
    });

    const toggleMode = () => {
      isRegister.value = !isRegister.value;
      error.value = '';
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      error.value = '';

      try {
        if (isRegister.value) {
          // 注册逻辑
          const existingUser = await getUser(form.value.username);
          if (existingUser) {
            error.value = '用户名已存在';
            return;
          }
          
          const userId = await saveUser({
            username: form.value.username,
            password: form.value.password,
            createdAt: new Date().toISOString()
          });
          
          // 保存用户信息到localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: userId,
            username: form.value.username
          }));
          
          router.push('/');
        } else {
          // 登录逻辑
          const user = await getUser(form.value.username);
          if (!user || user.password !== form.value.password) {
            error.value = '用户名或密码错误';
            return;
          }
          
          // 保存用户信息到localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username
          }));
          
          router.push('/');
        }
      } catch (err) {
        error.value = '操作失败，请重试';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isRegister,
      isLoading,
      error,
      form,
      toggleMode,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.text-primary {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>
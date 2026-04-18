<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm px-4 py-3">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold text-primary">拒绝内耗</div>
        <div class="flex items-center gap-4">
          <router-link to="/history" class="text-gray-600 hover:text-primary">历史记录</router-link>
          <router-link to="/emergency" class="text-gray-600 hover:text-primary">心理急救包</router-link>
          <router-link to="/ai-counseling" class="text-gray-600 hover:text-primary">AI咨询</router-link>
          <router-link to="/mental-aid" class="text-gray-600 hover:text-primary">心理援助</router-link>
          <span class="text-gray-600">{{ currentUser.username }}</span>
          <button class="text-gray-600 hover:text-primary" @click="logout">退出</button>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-1/2">
          <h1 class="text-4xl font-bold mb-4 text-dark">大学生拒绝内耗<br>心理健康测评</h1>
          <p class="text-gray-600 mb-8">通过科学的测评问卷，帮助你识别和改善内耗问题，找回内心的平静与力量。</p>
          <router-link to="/assessment/basic" class="btn btn-primary text-lg px-8 py-3">开始测评</router-link>
        </div>
        <div class="md:w-1/2">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold mb-6">测评流程</h2>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 class="font-medium">基础筛查问卷</h3>
                  <p class="text-sm text-gray-600">10道题目，快速了解内耗状况</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 class="font-medium">定位核心维度</h3>
                  <p class="text-sm text-gray-600">找出最严重的1-2个内耗维度</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 class="font-medium">精细测评</h3>
                  <p class="text-sm text-gray-600">针对核心维度进行深入评估</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 class="font-medium">生成报告</h3>
                  <p class="text-sm text-gray-600">获取综合雷达图和改善建议</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 核心功能 -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-12">核心功能</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card hover:shadow-lg transition-shadow">
            <div class="text-primary text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold mb-2">科学测评</h3>
            <p class="text-gray-600">基于李克特5点量表，科学评估内耗程度</p>
          </div>
          <div class="card hover:shadow-lg transition-shadow">
            <div class="text-primary text-4xl mb-4">💡</div>
            <h3 class="text-xl font-semibold mb-2">个性化建议</h3>
            <p class="text-gray-600">根据测评结果，提供针对性的改善建议</p>
          </div>
          <div class="card hover:shadow-lg transition-shadow">
            <div class="text-primary text-4xl mb-4">🚨</div>
            <h3 class="text-xl font-semibold mb-2">心理急救包</h3>
            <p class="text-gray-600">提供治愈图片、文案和音乐，缓解负面情绪</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="bg-dark text-white py-8 mt-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="text-xl font-bold">拒绝内耗</div>
            <p class="text-gray-400 text-sm">© 2026 大学生心理健康测评平台</p>
          </div>
          <div class="flex gap-4">
            <router-link to="/emergency" class="text-gray-400 hover:text-white">心理急救包</router-link>
            <router-link to="/ai-counseling" class="text-gray-400 hover:text-white">AI咨询</router-link>
            <router-link to="/mental-aid" class="text-gray-400 hover:text-white">心理援助</router-link>
            <router-link to="/admin/login" class="text-gray-400 hover:text-white">管理后台</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter();
    
    const currentUser = computed(() => {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : { username: '用户' };
    });
    
    const logout = () => {
      localStorage.removeItem('currentUser');
      router.push('/login');
    };
    
    return {
      currentUser,
      logout
    };
  }
}
</script>
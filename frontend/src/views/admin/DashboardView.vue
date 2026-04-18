<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1 class="text-xl font-bold">管理后台</h1>
      <button class="btn btn-outline" @click="logout">退出登录</button>
    </div>
    <div class="admin-page">
      <div class="admin-sidebar">
        <ul>
          <li><router-link to="/admin/dashboard">仪表盘</router-link></li>
          <li><router-link to="/admin/questions">题目管理</router-link></li>
          <li><router-link to="/admin/dimensions">维度管理</router-link></li>
          <li><router-link to="/admin/advice">建议管理</router-link></li>
          <li><router-link to="/admin/emergency">急救包管理</router-link></li>
          <li><router-link to="/admin/statistics">数据统计</router-link></li>
        </ul>
      </div>
      <div class="admin-content">
        <h2 class="text-2xl font-bold mb-6">仪表盘</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">5</div>
            <div class="text-gray-600">核心维度</div>
          </div>
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">35</div>
            <div class="text-gray-600">测评题目</div>
          </div>
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">3</div>
            <div class="text-gray-600">急救包内容</div>
          </div>
        </div>
        <div class="mt-8 card">
          <h3 class="text-lg font-semibold mb-4">最近测评记录</h3>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>总分</th>
                  <th>测评时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in recentResults" :key="result.id">
                  <td>{{ result.id }}</td>
                  <td>{{ result.total_score }}</td>
                  <td>{{ result.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboardView',
  setup() {
    const router = useRouter()
    const recentResults = ref([
      { id: 1, total_score: 25, created_at: '2026-04-15 10:30:00' },
      { id: 2, total_score: 32, created_at: '2026-04-15 09:15:00' },
      { id: 3, total_score: 18, created_at: '2026-04-14 16:45:00' }
    ])

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    return {
      recentResults,
      logout
    }
  }
}
</script>
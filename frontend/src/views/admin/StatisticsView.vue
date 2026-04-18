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
        <h2 class="text-2xl font-bold mb-6">数据统计</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">{{ totalAssessments }}</div>
            <div class="text-gray-600">总测评次数</div>
          </div>
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">{{ averageScore }}</div>
            <div class="text-gray-600">平均得分</div>
          </div>
          <div class="card">
            <div class="text-4xl font-bold text-primary mb-2">{{ todayAssessments }}</div>
            <div class="text-gray-600">今日测评次数</div>
          </div>
        </div>

        <div class="card mb-8">
          <h3 class="text-lg font-semibold mb-4">维度得分分布</h3>
          <div class="h-64">
            <canvas ref="dimensionChart"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">测评记录</h3>
            <button class="btn btn-primary" @click="exportExcel">导出Excel</button>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>总分</th>
                  <th>各维度得分</th>
                  <th>测评时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in assessmentResults" :key="result.id">
                  <td>{{ result.id }}</td>
                  <td>{{ result.total_score }}</td>
                  <td>{{ formatDimensionScores(result.dimension_scores) }}</td>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'StatisticsView',
  setup() {
    const router = useRouter()
    const dimensionChart = ref(null)
    let chartInstance = null

    const assessmentResults = ref([
      {
        id: 1,
        total_score: 25,
        dimension_scores: JSON.stringify({
          '未来不确定性': 7,
          '学业内卷': 6,
          '人际关系': 5,
          '自我认知': 4,
          '价值冲突': 3
        }),
        created_at: '2026-04-15 10:30:00'
      },
      {
        id: 2,
        total_score: 32,
        dimension_scores: JSON.stringify({
          '未来不确定性': 8,
          '学业内卷': 9,
          '人际关系': 7,
          '自我认知': 5,
          '价值冲突': 3
        }),
        created_at: '2026-04-15 09:15:00'
      },
      {
        id: 3,
        total_score: 18,
        dimension_scores: JSON.stringify({
          '未来不确定性': 4,
          '学业内卷': 3,
          '人际关系': 5,
          '自我认知': 3,
          '价值冲突': 3
        }),
        created_at: '2026-04-14 16:45:00'
      }
    ])

    const totalAssessments = computed(() => assessmentResults.value.length)
    const averageScore = computed(() => {
      if (totalAssessments.value === 0) return 0
      const sum = assessmentResults.value.reduce((acc, result) => acc + result.total_score, 0)
      return Math.round(sum / totalAssessments.value)
    })
    const todayAssessments = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return assessmentResults.value.filter(result => 
        result.created_at.startsWith(today)
      ).length
    })

    const formatDimensionScores = (dimensionScores) => {
      try {
        const scores = JSON.parse(dimensionScores)
        return Object.entries(scores)
          .map(([dimension, score]) => `${dimension}: ${score}`)
          .join('\n')
      } catch (e) {
        return dimensionScores
      }
    }

    const renderDimensionChart = () => {
      if (!dimensionChart.value) return

      // 销毁旧图表
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = dimensionChart.value.getContext('2d')
      const dimensions = ['未来不确定性', '学业内卷', '人际关系', '自我认知', '价值冲突']
      const scores = [6, 6, 5.67, 4, 3]

      chartInstance = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: dimensions,
          datasets: [{
            label: '平均得分',
            data: scores,
            backgroundColor: 'rgba(79, 70, 229, 0.6)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 10
            }
          }
        }
      })
    }

    const exportExcel = () => {
      // 模拟导出Excel功能
      alert('导出Excel功能开发中')
    }

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    onMounted(() => {
      // 加载Chart.js
      if (!window.Chart) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
        script.onload = renderDimensionChart
        document.head.appendChild(script)
      } else {
        renderDimensionChart()
      }
    })

    return {
      assessmentResults,
      totalAssessments,
      averageScore,
      todayAssessments,
      dimensionChart,
      formatDimensionScores,
      exportExcel,
      logout
    }
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm px-4 py-3">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold text-primary">拒绝内耗</div>
        <router-link to="/" class="text-gray-600 hover:text-primary">返回首页</router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-8 text-center">测评结果</h1>

        <!-- 总体得分 -->
        <div class="card mb-8">
          <h2 class="text-xl font-semibold mb-4">总体情况</h2>
          <div class="flex items-center justify-center gap-4">
            <div class="text-center">
              <div class="text-4xl font-bold text-primary">{{ totalScore }}</div>
              <div class="text-gray-600">总体得分</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold" :class="overallLevelClass">{{ overallLevel }}</div>
              <div class="text-gray-600">内耗程度</div>
            </div>
          </div>
        </div>

        <!-- 各维度得分 -->
        <div class="card mb-8">
          <h2 class="text-xl font-semibold mb-4">各维度得分</h2>
          <div v-for="(score, dimension) in dimensionScores" :key="dimension" class="result-item">
            <div>{{ dimension }}</div>
            <div class="flex items-center gap-2">
              <span class="result-score">{{ score }}</span>
              <span class="result-level" :class="getLevelClass(score)">{{ getLevel(score) }}</span>
            </div>
          </div>
        </div>

        <!-- 雷达图 -->
        <div class="card mb-8">
          <h2 class="text-xl font-semibold mb-4">综合评估</h2>
          <div class="radar-chart">
            <canvas ref="radarChart"></canvas>
          </div>
        </div>

        <!-- 改善建议 -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">改善建议</h2>
          <div v-if="suggestions.length > 0" class="space-y-3">
            <div v-for="(suggestion, index) in suggestions" :key="index" class="advice-item">
              <h4>{{ index + 1 }}. {{ suggestion }}</h4>
            </div>
          </div>
          <div v-else class="text-gray-600">暂无建议</div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center gap-4 mt-8">
          <router-link to="/assessment/basic" class="btn btn-outline">重新测评</router-link>
          <router-link to="/emergency" class="btn btn-primary">心理急救包</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAssessmentStore } from '../stores/assessment'
import { useRouter } from 'vue-router'
import { saveAssessmentResult } from '../utils/storage'

export default {
  name: 'ResultView',
  setup() {
    const store = useAssessmentStore()
    const router = useRouter()
    const radarChart = ref(null)
    let chartInstance = null

    // 检查是否有测评结果
    if (Object.keys(store.basicResults).length === 0) {
      router.push('/')
    }

    const currentUser = computed(() => {
      const userStr = localStorage.getItem('currentUser')
      return userStr ? JSON.parse(userStr) : null
    })

    const totalScore = computed(() => store.totalScore)
    const dimensionScores = computed(() => store.dimensionScores)
    const suggestions = computed(() => store.suggestions)

    const overallLevel = computed(() => {
      const score = totalScore.value
      if (score <= 20) return '轻度'
      if (score <= 35) return '中度'
      return '重度'
    })

    const overallLevelClass = computed(() => {
      const level = overallLevel.value
      if (level === '轻度') return 'text-green-600'
      if (level === '中度') return 'text-yellow-600'
      return 'text-red-600'
    })

    const getLevel = (score) => {
      if (score <= 4) return '轻度'
      if (score <= 7) return '中度'
      return '重度'
    }

    const getLevelClass = (score) => {
      if (score <= 4) return 'light'
      if (score <= 7) return 'medium'
      return 'heavy'
    }

    const renderRadarChart = () => {
      if (!radarChart.value) return

      // 销毁旧图表
      if (chartInstance) {
        chartInstance.destroy()
      }

      const ctx = radarChart.value.getContext('2d')
      const dimensions = Object.keys(dimensionScores.value)
      const scores = Object.values(dimensionScores.value)

      chartInstance = new window.Chart(ctx, {
        type: 'radar',
        data: {
          labels: dimensions,
          datasets: [{
            label: '内耗程度',
            data: scores,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 70, 229, 1)'
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 2
              }
            }
          }
        }
      })
    }

    const saveResult = async () => {
      if (!currentUser.value) return
      
      try {
        // 保存到本地存储
        const localResult = {
          userId: currentUser.value.id,
          totalScore: totalScore.value,
          dimensionScores: dimensionScores.value,
          suggestions: suggestions.value,
          createdAt: new Date().toISOString()
        }
        await saveAssessmentResult(localResult)
        console.log('测评结果保存到本地成功')
        
        // 同时发送到后端
        try {
          const response = await fetch('/api/assessment/result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              total_score: totalScore.value,
              dimension_scores: dimensionScores.value,
              suggestions: suggestions.value
            })
          })
          if (response.ok) {
            console.log('测评结果发送到后端成功')
          }
        } catch (backendError) {
          console.error('发送到后端失败，使用本地存储作为备用:', backendError)
        }
      } catch (err) {
        console.error('保存测评结果失败:', err)
      }
    }

    onMounted(() => {
      // 保存测评结果
      saveResult()
      
      // 加载Chart.js
      if (!window.Chart) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
        script.onload = renderRadarChart
        document.head.appendChild(script)
      } else {
        renderRadarChart()
      }
    })

    watch(dimensionScores, renderRadarChart, { deep: true })

    return {
      totalScore,
      dimensionScores,
      suggestions,
      overallLevel,
      overallLevelClass,
      getLevel,
      getLevelClass,
      radarChart
    }
  }
}
</script>
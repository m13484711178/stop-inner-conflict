<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm px-4 py-3">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold text-primary">拒绝内耗</div>
        <div class="flex items-center gap-4">
          <span>{{ currentUser.username }}</span>
          <button class="btn btn-outline" @click="logout">退出登录</button>
        </div>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">历史测评记录</h1>
        
        <div v-if="loading" class="loading">
          <span>加载中...</span>
        </div>
        
        <div v-else-if="results.length === 0" class="card text-center py-12">
          <div class="text-4xl mb-4">📊</div>
          <h2 class="text-lg font-semibold mb-2">暂无测评记录</h2>
          <p class="text-gray-600 mb-4">完成测评后，记录会显示在这里</p>
          <router-link to="/assessment/basic" class="btn btn-primary">开始测评</router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="result in results" :key="result.id" class="card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">{{ formatDate(result.createdAt) }}</h3>
              <span class="result-score">{{ result.totalScore }}</span>
            </div>
            
            <div class="space-y-2 mb-4">
              <div v-for="(score, dimension) in result.dimensionScores" :key="dimension" class="result-item">
                <div>{{ dimension }}</div>
                <div class="flex items-center gap-2">
                  <span>{{ score }}</span>
                  <span class="result-level" :class="getLevelClass(score)">{{ getLevel(score) }}</span>
                </div>
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-100">
              <h4 class="font-semibold mb-2">改善建议</h4>
              <ul class="list-disc pl-5 space-y-1">
                <li v-for="(advice, index) in result.suggestions" :key="index">{{ advice }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAssessmentResults } from '../utils/storage';

export default {
  name: 'HistoryView',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const results = ref([]);
    
    const currentUser = computed(() => {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    });

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN');
    };

    const getLevel = (score) => {
      if (score <= 4) return '轻度';
      if (score <= 7) return '中度';
      return '重度';
    };

    const getLevelClass = (score) => {
      if (score <= 4) return 'light';
      if (score <= 7) return 'medium';
      return 'heavy';
    };

    const loadResults = async () => {
      if (!currentUser.value) return;
      
      try {
        loading.value = true;
        const userResults = await getAssessmentResults(currentUser.value.id);
        results.value = userResults.reverse(); // 按时间倒序显示
      } catch (err) {
        console.error('加载历史记录失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const logout = () => {
      localStorage.removeItem('currentUser');
      router.push('/login');
    };

    onMounted(() => {
      loadResults();
    });

    return {
      currentUser,
      loading,
      results,
      formatDate,
      getLevel,
      getLevelClass,
      logout
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

.result-score {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.result-level {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.result-level.light {
  background: #d1fae5;
  color: #065f46;
}

.result-level.medium {
  background: #fef3c7;
  color: #92400e;
}

.result-level.heavy {
  background: #fee2e2;
  color: #b91c1c;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
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

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f3f4f6;
}

.text-primary {
  color: #3b82f6;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}
</style>
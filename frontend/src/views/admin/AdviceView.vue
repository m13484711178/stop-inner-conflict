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
        <h2 class="text-2xl font-bold mb-6">建议管理</h2>
        
        <div class="card mb-6">
          <h3 class="text-lg font-semibold mb-4">添加建议</h3>
          <form @submit.prevent="addAdvice" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="dimension">所属维度</label>
                <select id="dimension" v-model="newAdvice.dimension_id" class="input">
                  <option value="">请选择维度</option>
                  <option v-for="dimension in dimensions" :key="dimension.id" :value="dimension.id">{{ dimension.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="level">内耗程度</label>
                <select id="level" v-model="newAdvice.level" class="input">
                  <option value="light">轻度</option>
                  <option value="medium">中度</option>
                  <option value="heavy">重度</option>
                </select>
              </div>
              <div class="form-group md:col-span-2">
                <label for="content">建议内容</label>
                <textarea id="content" v-model="newAdvice.content" class="input" rows="3" placeholder="请输入建议内容"></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">添加建议</button>
              <button type="button" class="btn btn-outline" @click="resetForm">重置</button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">建议列表</h3>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>所属维度</th>
                  <th>内耗程度</th>
                  <th>建议内容</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="advice in advices" :key="advice.id">
                  <td>{{ advice.id }}</td>
                  <td>{{ getDimensionName(advice.dimension_id) }}</td>
                  <td>{{ getLevelText(advice.level) }}</td>
                  <td>{{ advice.content }}</td>
                  <td>
                    <button class="btn btn-outline text-sm mr-2" @click="editAdvice(advice)">编辑</button>
                    <button class="btn btn-outline text-sm text-danger" @click="deleteAdvice(advice.id)">删除</button>
                  </td>
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
  name: 'AdviceView',
  setup() {
    const router = useRouter()
    const dimensions = ref([
      { id: 1, name: '未来不确定性' },
      { id: 2, name: '学业内卷' },
      { id: 3, name: '人际关系' },
      { id: 4, name: '自我认知' },
      { id: 5, name: '价值冲突' }
    ])
    const advices = ref([
      { id: 1, dimension_id: 1, level: 'light', content: '制定短期目标，逐步实现' },
      { id: 2, dimension_id: 1, level: 'medium', content: '寻求职业规划指导' },
      { id: 3, dimension_id: 1, level: 'heavy', content: '咨询专业心理咨询师' }
    ])
    const newAdvice = ref({
      dimension_id: '',
      level: 'light',
      content: ''
    })

    const getDimensionName = (dimensionId) => {
      const dimension = dimensions.value.find(d => d.id == dimensionId)
      return dimension ? dimension.name : ''
    }

    const getLevelText = (level) => {
      const levelMap = {
        light: '轻度',
        medium: '中度',
        heavy: '重度'
      }
      return levelMap[level] || level
    }

    const addAdvice = () => {
      if (!newAdvice.value.dimension_id || !newAdvice.value.content) {
        alert('请填写完整信息')
        return
      }

      // 模拟添加建议
      const newId = advices.value.length + 1
      advices.value.push({
        id: newId,
        ...newAdvice.value
      })
      
      resetForm()
      alert('建议添加成功')
    }

    const editAdvice = (advice) => {
      // 模拟编辑功能
      alert('编辑功能开发中')
    }

    const deleteAdvice = (id) => {
      if (confirm('确定要删除这个建议吗？')) {
        advices.value = advices.value.filter(a => a.id !== id)
        alert('建议删除成功')
      }
    }

    const resetForm = () => {
      newAdvice.value = {
        dimension_id: '',
        level: 'light',
        content: ''
      }
    }

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    return {
      dimensions,
      advices,
      newAdvice,
      getDimensionName,
      getLevelText,
      addAdvice,
      editAdvice,
      deleteAdvice,
      resetForm,
      logout
    }
  }
}
</script>
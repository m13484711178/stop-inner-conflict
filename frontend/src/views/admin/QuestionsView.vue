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
        <h2 class="text-2xl font-bold mb-6">题目管理</h2>
        
        <div class="card mb-6">
          <h3 class="text-lg font-semibold mb-4">添加题目</h3>
          <form @submit.prevent="addQuestion" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="content">题目内容</label>
                <input type="text" id="content" v-model="newQuestion.content" class="input" placeholder="请输入题目内容" />
              </div>
              <div class="form-group">
                <label for="dimension">所属维度</label>
                <select id="dimension" v-model="newQuestion.dimension_id" class="input">
                  <option value="">请选择维度</option>
                  <option v-for="dimension in dimensions" :key="dimension.id" :value="dimension.id">{{ dimension.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="type">题目类型</label>
                <select id="type" v-model="newQuestion.type" class="input">
                  <option value="basic">基础筛查</option>
                  <option value="detailed">精细测评</option>
                </select>
              </div>
              <div class="form-group">
                <label for="is_reverse">是否反向题</label>
                <select id="is_reverse" v-model="newQuestion.is_reverse" class="input">
                  <option value="0">否</option>
                  <option value="1">是</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">添加题目</button>
              <button type="button" class="btn btn-outline" @click="resetForm">重置</button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">题目列表</h3>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>题目内容</th>
                  <th>所属维度</th>
                  <th>类型</th>
                  <th>是否反向题</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="question in questions" :key="question.id">
                  <td>{{ question.id }}</td>
                  <td>{{ question.content }}</td>
                  <td>{{ getDimensionName(question.dimension_id) }}</td>
                  <td>{{ question.type === 'basic' ? '基础筛查' : '精细测评' }}</td>
                  <td>{{ question.is_reverse ? '是' : '否' }}</td>
                  <td>
                    <button class="btn btn-outline text-sm mr-2" @click="editQuestion(question)">编辑</button>
                    <button class="btn btn-outline text-sm text-danger" @click="deleteQuestion(question.id)">删除</button>
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
  name: 'QuestionsView',
  setup() {
    const router = useRouter()
    const dimensions = ref([
      { id: 1, name: '未来不确定性' },
      { id: 2, name: '学业内卷' },
      { id: 3, name: '人际关系' },
      { id: 4, name: '自我认知' },
      { id: 5, name: '价值冲突' }
    ])
    const questions = ref([
      { id: 1, content: '我经常担心自己的未来发展', dimension_id: 1, type: 'basic', is_reverse: 0 },
      { id: 2, content: '我对自己的人生规划很清晰', dimension_id: 1, type: 'basic', is_reverse: 1 },
      { id: 3, content: '我感到学业竞争压力很大', dimension_id: 2, type: 'basic', is_reverse: 0 }
    ])
    const newQuestion = ref({
      content: '',
      dimension_id: '',
      type: 'basic',
      is_reverse: 0
    })

    const getDimensionName = (dimensionId) => {
      const dimension = dimensions.value.find(d => d.id == dimensionId)
      return dimension ? dimension.name : ''
    }

    const addQuestion = () => {
      if (!newQuestion.value.content || !newQuestion.value.dimension_id) {
        alert('请填写完整信息')
        return
      }

      // 模拟添加题目
      const newId = questions.value.length + 1
      questions.value.push({
        id: newId,
        ...newQuestion.value
      })
      
      resetForm()
      alert('题目添加成功')
    }

    const editQuestion = (question) => {
      // 模拟编辑功能
      alert('编辑功能开发中')
    }

    const deleteQuestion = (id) => {
      if (confirm('确定要删除这个题目吗？')) {
        questions.value = questions.value.filter(q => q.id !== id)
        alert('题目删除成功')
      }
    }

    const resetForm = () => {
      newQuestion.value = {
        content: '',
        dimension_id: '',
        type: 'basic',
        is_reverse: 0
      }
    }

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    return {
      dimensions,
      questions,
      newQuestion,
      getDimensionName,
      addQuestion,
      editQuestion,
      deleteQuestion,
      resetForm,
      logout
    }
  }
}
</script>
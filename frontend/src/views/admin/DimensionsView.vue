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
        <h2 class="text-2xl font-bold mb-6">维度管理</h2>
        
        <div class="card mb-6">
          <h3 class="text-lg font-semibold mb-4">添加维度</h3>
          <form @submit.prevent="addDimension" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="name">维度名称</label>
                <input type="text" id="name" v-model="newDimension.name" class="input" placeholder="请输入维度名称" />
              </div>
              <div class="form-group">
                <label for="description">维度描述</label>
                <input type="text" id="description" v-model="newDimension.description" class="input" placeholder="请输入维度描述" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">添加维度</button>
              <button type="button" class="btn btn-outline" @click="resetForm">重置</button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">维度列表</h3>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>维度名称</th>
                  <th>维度描述</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dimension in dimensions" :key="dimension.id">
                  <td>{{ dimension.id }}</td>
                  <td>{{ dimension.name }}</td>
                  <td>{{ dimension.description }}</td>
                  <td>
                    <button class="btn btn-outline text-sm mr-2" @click="editDimension(dimension)">编辑</button>
                    <button class="btn btn-outline text-sm text-danger" @click="deleteDimension(dimension.id)">删除</button>
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
  name: 'DimensionsView',
  setup() {
    const router = useRouter()
    const dimensions = ref([
      { id: 1, name: '未来不确定性', description: '对未来发展的担忧和不确定性' },
      { id: 2, name: '学业内卷', description: '学业竞争带来的压力和内耗' },
      { id: 3, name: '人际关系', description: '人际关系中的焦虑和冲突' },
      { id: 4, name: '自我认知', description: '对自我的认知和评价' },
      { id: 5, name: '价值冲突', description: '价值观的冲突和困惑' }
    ])
    const newDimension = ref({
      name: '',
      description: ''
    })

    const addDimension = () => {
      if (!newDimension.value.name) {
        alert('请填写维度名称')
        return
      }

      // 模拟添加维度
      const newId = dimensions.value.length + 1
      dimensions.value.push({
        id: newId,
        ...newDimension.value
      })
      
      resetForm()
      alert('维度添加成功')
    }

    const editDimension = (dimension) => {
      // 模拟编辑功能
      alert('编辑功能开发中')
    }

    const deleteDimension = (id) => {
      if (confirm('确定要删除这个维度吗？')) {
        dimensions.value = dimensions.value.filter(d => d.id !== id)
        alert('维度删除成功')
      }
    }

    const resetForm = () => {
      newDimension.value = {
        name: '',
        description: ''
      }
    }

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    return {
      dimensions,
      newDimension,
      addDimension,
      editDimension,
      deleteDimension,
      resetForm,
      logout
    }
  }
}
</script>
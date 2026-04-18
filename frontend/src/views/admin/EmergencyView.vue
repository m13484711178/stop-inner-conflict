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
        <h2 class="text-2xl font-bold mb-6">急救包管理</h2>
        
        <div class="card mb-6">
          <h3 class="text-lg font-semibold mb-4">添加急救包内容</h3>
          <form @submit.prevent="addEmergencyContent" class="space-y-4">
            <div class="form-group">
              <label for="image">图片URL</label>
              <input type="text" id="image" v-model="newContent.image" class="input" placeholder="请输入图片URL" />
            </div>
            <div class="form-group">
              <label for="quote">治愈文案</label>
              <textarea id="quote" v-model="newContent.quote" class="input" rows="3" placeholder="请输入治愈文案"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">添加内容</button>
              <button type="button" class="btn btn-outline" @click="resetForm">重置</button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">急救包内容列表</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="content in emergencyContents" :key="content.id" class="border rounded-lg p-4">
              <img :src="content.image" :alt="content.quote" class="w-full h-40 object-cover rounded mb-4" />
              <p class="text-center">{{ content.quote }}</p>
              <div class="flex justify-end gap-2 mt-4">
                <button class="btn btn-outline text-sm" @click="editContent(content)">编辑</button>
                <button class="btn btn-outline text-sm text-danger" @click="deleteContent(content.id)">删除</button>
              </div>
            </div>
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
  name: 'EmergencyView',
  setup() {
    const router = useRouter()
    const emergencyContents = ref([
      {
        id: 1,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20nature%20landscape%20with%20mountains%20and%20lake%20sunset%20calming%20scene&image_size=landscape_16_9',
        quote: '慢慢来，所有的事情都会好起来的。'
      },
      {
        id: 2,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=serene%20forest%20path%20with%20sunlight%20filtering%20through%20trees%20peaceful%20scene&image_size=landscape_16_9',
        quote: '你已经做得很好了，给自己一些休息的时间。'
      },
      {
        id: 3,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20beach%20with%20clear%20blue%20water%20and%20white%20sand%20calm%20ocean&image_size=landscape_16_9',
        quote: '内心的平静是最重要的，不要被外界的喧嚣所打扰。'
      }
    ])
    const newContent = ref({
      image: '',
      quote: ''
    })

    const addEmergencyContent = () => {
      if (!newContent.value.image || !newContent.value.quote) {
        alert('请填写完整信息')
        return
      }

      // 模拟添加内容
      const newId = emergencyContents.value.length + 1
      emergencyContents.value.push({
        id: newId,
        ...newContent.value
      })
      
      resetForm()
      alert('内容添加成功')
    }

    const editContent = (content) => {
      // 模拟编辑功能
      alert('编辑功能开发中')
    }

    const deleteContent = (id) => {
      if (confirm('确定要删除这个内容吗？')) {
        emergencyContents.value = emergencyContents.value.filter(c => c.id !== id)
        alert('内容删除成功')
      }
    }

    const resetForm = () => {
      newContent.value = {
        image: '',
        quote: ''
      }
    }

    const logout = () => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }

    return {
      emergencyContents,
      newContent,
      addEmergencyContent,
      editContent,
      deleteContent,
      resetForm,
      logout
    }
  }
}
</script>
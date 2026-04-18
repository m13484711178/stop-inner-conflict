<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm px-4 py-3">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold text-primary">拒绝内耗</div>
        <router-link to="/" class="text-gray-600 hover:text-primary">返回首页</router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-8 text-center">AI心理咨询</h1>

        <div v-if="!isOnline" class="card mb-8 text-center">
          <div class="text-xl mb-4">📶</div>
          <h2 class="text-lg font-semibold mb-2">网络连接中断</h2>
          <p class="text-gray-600 mb-4">当前无法连接到AI服务</p>
          <router-link to="/emergency" class="btn btn-primary">前往心理急救包</router-link>
        </div>

        <div v-else>
          <div class="card mb-4 h-96 overflow-y-auto" id="chat-container">
            <div class="p-4 space-y-4">
              <div class="flex gap-3" v-for="(message, index) in messages" :key="index">
                <div v-if="message.role === 'user'" class="flex justify-end w-full">
                  <div class="bg-primary text-white rounded-lg p-3 max-w-[80%]">
                    {{ message.content }}
                  </div>
                </div>
                <div v-else class="flex gap-3 w-full">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">AI</div>
                  <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    {{ message.content }}
                  </div>
                </div>
              </div>
              <div v-if="isLoading" class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">AI</div>
                <div class="bg-gray-100 rounded-lg p-3">
                  <div class="loading">
                    <span>思考中...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-4">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <input
                v-model="inputMessage"
                type="text"
                class="flex-1 input"
                placeholder="请输入您的问题..."
                :disabled="isLoading"
              />
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading || !inputMessage.trim()"
              >
                发送
              </button>
            </form>
          </div>

          <div class="mt-4 text-center text-gray-600 text-sm">
            <p>提示：AI仅提供心理支持，不能替代专业心理咨询</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AICounselingView',
  setup() {
    const router = useRouter()
    const isOnline = ref(navigator.onLine)
    const messages = ref([
      {
        role: 'assistant',
        content: '你好！我是AI心理咨询助手，很高兴为你提供帮助。你可以告诉我你现在的感受或遇到的问题，我会尽力支持你。'
      }
    ])
    const inputMessage = ref('')
    const isLoading = ref(false)

    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return

      // 添加用户消息
      messages.value.push({
        role: 'user',
        content: inputMessage.value.trim()
      })

      const userMessage = inputMessage.value.trim()
      inputMessage.value = ''
      isLoading.value = true

      try {
        // 模拟AI回复
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 示例回复，实际项目中应调用真实的AI API
        let response
        if (userMessage.includes('压力') || userMessage.includes('焦虑')) {
          response = '我理解你现在感到压力和焦虑，这是很正常的情绪。你可以尝试一些放松的方法，比如深呼吸、冥想或者散步。记住，照顾好自己的情绪是最重要的。'
        } else if (userMessage.includes('失眠') || userMessage.includes('睡眠')) {
          response = '睡眠问题确实会影响我们的情绪和精力。建议你保持规律的作息时间，睡前避免使用电子设备，创造一个安静舒适的睡眠环境。如果问题持续存在，建议咨询专业医生。'
        } else if (userMessage.includes('人际关系') || userMessage.includes('朋友')) {
          response = '人际关系是我们生活中重要的一部分。良好的沟通是建立健康关系的关键，尝试与朋友坦诚地交流你的感受，同时也要学会倾听对方的想法。'
        } else {
          response = '谢谢你分享你的感受。记住，你并不孤单，有很多人愿意帮助你。如果你需要更专业的支持，建议咨询学校的心理咨询中心。'
        }

        messages.value.push({
          role: 'assistant',
          content: response
        })
      } catch (error) {
        console.error('AI回复失败:', error)
        messages.value.push({
          role: 'assistant',
          content: '抱歉，我暂时无法回复你的消息，请稍后再试。'
        })
      } finally {
        isLoading.value = false
        // 滚动到底部
        scrollToBottom()
      }
    }

    const scrollToBottom = () => {
      const chatContainer = document.getElementById('chat-container')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }

    const handleOnlineStatusChange = () => {
      isOnline.value = navigator.onLine
      if (!isOnline.value) {
        router.push('/emergency')
      }
    }

    onMounted(() => {
      window.addEventListener('online', handleOnlineStatusChange)
      window.addEventListener('offline', handleOnlineStatusChange)
      scrollToBottom()
    })

    watch(messages, scrollToBottom, { deep: true })

    return {
      isOnline,
      messages,
      inputMessage,
      isLoading,
      sendMessage
    }
  }
}
</script>
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
        <h1 class="text-2xl font-bold mb-8 text-center">心理急救包</h1>

        <div v-if="loading" class="card text-center py-12">
          <div class="text-4xl mb-4">⏳</div>
          <p class="text-gray-600">加载中...</p>
        </div>

        <div v-else class="emergency-package card">
          <img :src="currentContent.image" :alt="currentContent.quote" class="emergency-image" />
          <p class="emergency-quote">{{ currentContent.quote }}</p>
          <button class="btn btn-primary" @click="changeContent">换一个</button>
        </div>

        <div class="music-player mt-8">
          <h2 class="text-lg font-semibold mb-4 text-center">舒缓音乐</h2>
          <div v-if="loading">
            <p class="text-gray-600 text-center">加载音乐中...</p>
          </div>
          <div v-else>
            <audio controls>
              <source :src="musicUrl" type="audio/mpeg">
              您的浏览器不支持音频播放。
            </audio>
          </div>
        </div>

        <div class="mt-8 text-center text-gray-600 text-sm">
          <p>心理急救包内容支持离线使用，后续可通过后台更新</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'EmergencyView',
  setup() {
    const contents = ref([])
    const music = ref([])
    const currentIndex = ref(0)
    const loading = ref(true)

    const currentContent = computed(() => {
      if (contents.value.length === 0) {
        return {
          image: '/images/h1.jpg',
          quote: '慢慢来，所有的事情都会好起来的。'
        }
      }
      return contents.value[currentIndex.value]
    })

    const musicUrl = computed(() => {
      if (music.value.length === 0) {
        return '/music/Ludovico Einaudi - Una Mattina.mp3'
      }
      return music.value[0].url
    })

    const changeContent = () => {
      if (contents.value.length > 0) {
        currentIndex.value = (currentIndex.value + 1) % contents.value.length
      }
    }

    const fetchEmergencyContents = async () => {
      try {
        const response = await fetch('/api/emergency/contents')
        if (response.ok) {
          const data = await response.json()
          contents.value = data
        }
      } catch (error) {
        console.error('获取急救包内容失败:', error)
        // 使用本地默认数据作为 fallback
        contents.value = [
          { image: '/images/h1.jpg', quote: '慢慢来，所有的事情都会好起来的。' },
          { image: '/images/h2.jpg', quote: '你已经做得很好了，给自己一些休息的时间。' },
          { image: '/images/h3.jpg', quote: '内心的平静是最重要的，不要被外界的喧嚣所打扰。' },
          { image: '/images/h4.jpg', quote: '每一个困难都是成长的机会，相信自己的力量。' },
          { image: '/images/h5.jpg', quote: '给自己一个拥抱，你值得被爱和被关心。' },
          { image: '/images/h6.jpg', quote: '今天的努力，是为了明天更好的自己。' },
          { image: '/images/h7.jpg', quote: '不要让焦虑占据你的内心，相信一切都会好起来。' },
          { image: '/images/h8.jpg', quote: '每一次呼吸都是新的开始，享受当下的宁静。' },
          { image: '/images/h9.jpg', quote: '你的价值不取决于他人的评价，你是独一无二的。' },
          { image: '/images/h10.jpg', quote: '给自己一点时间，慢慢来，不着急。' },
          { image: '/images/h11.jpg', quote: '生活中的困难都是暂时的，相信自己的力量。' },
          { image: '/images/h12.jpg', quote: '每一个小小的进步都值得庆祝，你做得很好。' },
          { image: '/images/h13.jpg', quote: '保持内心的平静，一切都会朝着好的方向发展。' }
        ]
      }
    }

    const fetchMusic = async () => {
      try {
        const response = await fetch('/api/music')
        if (response.ok) {
          const data = await response.json()
          music.value = data
        }
      } catch (error) {
        console.error('获取音乐失败:', error)
      }
    }

    onMounted(async () => {
      await Promise.all([
        fetchEmergencyContents(),
        fetchMusic()
      ])
      loading.value = false
    })

    return {
      currentContent,
      musicUrl,
      changeContent,
      loading
    }
  }
}
</script>
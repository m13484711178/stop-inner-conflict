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
        <h1 class="text-2xl font-bold mb-8 text-center">心理援助</h1>

        <div class="mental-aid card">
          <h2 class="text-xl font-semibold mb-6 text-center">武汉大学心理中心</h2>
          
          <div class="mental-aid-item">
            <div class="w-8 text-primary">📞</div>
            <div class="flex-1">
              <h3 class="font-medium">咨询电话</h3>
              <p class="text-gray-600">027-68772152</p>
            </div>
            <button class="btn btn-primary text-sm" @click="callPhone('02768772152')">一键拨打</button>
          </div>

          <div class="mental-aid-item">
            <div class="w-8 text-primary">📍</div>
            <div class="flex-1">
              <h3 class="font-medium">地址</h3>
              <p class="text-gray-600">武汉大学文理学部教五楼5楼</p>
            </div>
            <a href="https://maps.google.com/?q=武汉大学文理学部教五楼" target="_blank" class="btn btn-outline text-sm">查看地图</a>
          </div>

          <div class="mental-aid-item">
            <div class="w-8 text-primary">🕒</div>
            <div class="flex-1">
              <h3 class="font-medium">咨询时间</h3>
              <p class="text-gray-600">周一至周五 8:30-17:30</p>
            </div>
          </div>

          <div class="mental-aid-item">
            <div class="w-8 text-primary">🌐</div>
            <div class="flex-1">
              <h3 class="font-medium">官方网站</h3>
              <p class="text-gray-600">https://xlzx.whu.edu.cn/</p>
            </div>
            <a href="https://xlzx.whu.edu.cn/" target="_blank" class="btn btn-outline text-sm">访问官网</a>
          </div>

          <div class="mental-aid-item">
            <div class="w-8 text-primary">📧</div>
            <div class="flex-1">
              <h3 class="font-medium">邮箱</h3>
              <p class="text-gray-600">xlzx@whu.edu.cn</p>
            </div>
            <a href="mailto:xlzx@whu.edu.cn" class="btn btn-outline text-sm">发送邮件</a>
          </div>
        </div>

        <div class="mt-8 card">
          <h2 class="text-lg font-semibold mb-4">紧急心理援助热线</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <h3 class="font-medium">全国心理援助热线</h3>
                <p class="text-gray-600">24小时服务</p>
              </div>
              <button class="btn btn-primary text-sm" @click="callPhone('4001619995')">400-161-9995</button>
            </div>
            <div class="flex justify-between items-center py-2">
              <div>
                <h3 class="font-medium">北京心理危机干预热线</h3>
                <p class="text-gray-600">24小时服务</p>
              </div>
              <button class="btn btn-primary text-sm" @click="callPhone('01082951332')">010-82951332</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MentalAidView',
  setup() {
    const callPhone = (phone) => {
      window.location.href = `tel:${phone}`
    }

    return {
      callPhone
    }
  }
}
</script>
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
        <h1 class="text-2xl font-bold mb-6 text-center">基础筛查问卷</h1>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            class="bg-primary h-2.5 rounded-full" 
            :style="{ width: `${(currentQuestionIndex / (basicQuestions.length - 1)) * 100}%` }"
          ></div>
        </div>

        <!-- 题目导航 -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="(question, index) in basicQuestions"
            :key="question.id"
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="{
              'bg-primary text-white': index === currentQuestionIndex,
              'bg-gray-200 text-gray-600': index !== currentQuestionIndex && !answers[question.id],
              'bg-green-100 text-green-800': index !== currentQuestionIndex && answers[question.id]
            }"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>

        <!-- 当前题目 -->
        <div class="card mb-8">
          <h2 class="text-lg font-semibold mb-4">
            {{ currentQuestionIndex + 1 }}. {{ currentQuestion.content }}
          </h2>
          <div class="radio-group">
            <label
              v-for="option in options"
              :key="option.value"
              class="radio-option"
              :class="{ selected: answers[currentQuestion.id] === option.value }"
              @click="selectOption(option.value)"
            >
              <input
                type="radio"
                :name="`question-${currentQuestion.id}`"
                :value="option.value"
                v-model="answers[currentQuestion.id]"
                class="hidden"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="flex justify-between">
          <button
            class="btn btn-outline"
            @click="prevQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            上一题
          </button>
          <button
            class="btn btn-primary"
            @click="nextQuestion"
            :disabled="!answers[currentQuestion.id]"
          >
            {{ currentQuestionIndex === basicQuestions.length - 1 ? '提交' : '下一题' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAssessmentStore } from '../stores/assessment'
import { useRouter } from 'vue-router'

export default {
  name: 'BasicAssessmentView',
  setup() {
    const store = useAssessmentStore()
    const router = useRouter()
    const currentQuestionIndex = ref(0)
    const answers = ref({})

    const basicQuestions = computed(() => store.basicQuestions)
    const currentQuestion = computed(() => basicQuestions.value[currentQuestionIndex.value])

    const options = [
      { value: 1, label: '完全不符合' },
      { value: 2, label: '不太符合' },
      { value: 3, label: '一般' },
      { value: 4, label: '比较符合' },
      { value: 5, label: '完全符合' }
    ]

    const selectOption = (value) => {
      answers.value[currentQuestion.value.id] = value
      // 保存答案到store
      store.saveBasicAnswer(currentQuestion.value.id, currentQuestion.value.isReverse ? 6 - value : value)
    }

    const nextQuestion = () => {
      if (currentQuestionIndex.value < basicQuestions.value.length - 1) {
        currentQuestionIndex.value++
      } else {
        // 提交问卷
        store.calculateBasicResults()
        router.push('/assessment/detailed/' + store.coreDimensions[0])
      }
    }

    const prevQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
      }
    }

    const goToQuestion = (index) => {
      currentQuestionIndex.value = index
    }

    onMounted(() => {
      // 重置测评状态
      store.resetAssessment()
    })

    return {
      basicQuestions,
      currentQuestion,
      currentQuestionIndex,
      answers,
      options,
      selectOption,
      nextQuestion,
      prevQuestion,
      goToQuestion
    }
  }
}
</script>
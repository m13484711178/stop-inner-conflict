import { defineStore } from 'pinia'

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    basicQuestions: [
      {
        id: 1,
        dimension: '未来不确定性',
        content: '我经常担心自己的未来发展',
        isReverse: false
      },
      {
        id: 2,
        dimension: '未来不确定性',
        content: '我对自己的人生规划很清晰',
        isReverse: true
      },
      {
        id: 3,
        dimension: '学业内卷',
        content: '我感到学业竞争压力很大',
        isReverse: false
      },
      {
        id: 4,
        dimension: '学业内卷',
        content: '我能轻松应对学业要求',
        isReverse: true
      },
      {
        id: 5,
        dimension: '人际关系',
        content: '我在人际关系中感到焦虑',
        isReverse: false
      },
      {
        id: 6,
        dimension: '人际关系',
        content: '我能与他人建立良好的关系',
        isReverse: true
      },
      {
        id: 7,
        dimension: '自我认知',
        content: '我经常自我怀疑',
        isReverse: false
      },
      {
        id: 8,
        dimension: '自我认知',
        content: '我对自己有清晰的认识',
        isReverse: true
      },
      {
        id: 9,
        dimension: '价值冲突',
        content: '我经常面临价值观念的冲突',
        isReverse: false
      },
      {
        id: 10,
        dimension: '价值冲突',
        content: '我能坚守自己的价值观',
        isReverse: true
      }
    ],
    detailedQuestions: {
      '未来不确定性': [
        {
          id: 11,
          content: '我担心找不到理想的工作',
          isReverse: false
        },
        {
          id: 12,
          content: '我对未来的生活充满信心',
          isReverse: true
        },
        {
          id: 13,
          content: '我经常感到前途渺茫',
          isReverse: false
        },
        {
          id: 14,
          content: '我能为未来制定可行的计划',
          isReverse: true
        },
        {
          id: 15,
          content: '我担心自己的能力不足以应对未来的挑战',
          isReverse: false
        }
      ],
      '学业内卷': [
        {
          id: 16,
          content: '我经常熬夜学习以保持竞争力',
          isReverse: false
        },
        {
          id: 17,
          content: '我能平衡学习和休息',
          isReverse: true
        },
        {
          id: 18,
          content: '我感到同学之间的竞争很激烈',
          isReverse: false
        },
        {
          id: 19,
          content: '我能按照自己的节奏学习',
          isReverse: true
        },
        {
          id: 20,
          content: '我担心自己的成绩不如别人',
          isReverse: false
        }
      ],
      '人际关系': [
        {
          id: 21,
          content: '我担心被朋友孤立',
          isReverse: false
        },
        {
          id: 22,
          content: '我能轻松与他人交流',
          isReverse: true
        },
        {
          id: 23,
          content: '我经常为人际关系问题烦恼',
          isReverse: false
        },
        {
          id: 24,
          content: '我有知心朋友可以倾诉',
          isReverse: true
        },
        {
          id: 25,
          content: '我在社交场合感到紧张',
          isReverse: false
        }
      ],
      '自我认知': [
        {
          id: 26,
          content: '我经常觉得自己不够好',
          isReverse: false
        },
        {
          id: 27,
          content: '我接受自己的优点和缺点',
          isReverse: true
        },
        {
          id: 28,
          content: '我经常与他人比较，感到自卑',
          isReverse: false
        },
        {
          id: 29,
          content: '我对自己的能力有信心',
          isReverse: true
        },
        {
          id: 30,
          content: '我经常反思自己的不足',
          isReverse: false
        }
      ],
      '价值冲突': [
        {
          id: 31,
          content: '我经常面临个人价值观与社会期望的冲突',
          isReverse: false
        },
        {
          id: 32,
          content: '我能清晰地表达自己的价值观',
          isReverse: true
        },
        {
          id: 33,
          content: '我经常为做选择而感到纠结',
          isReverse: false
        },
        {
          id: 34,
          content: '我能坚持自己认为正确的事情',
          isReverse: true
        },
        {
          id: 35,
          content: '我担心自己的价值观不被他人认可',
          isReverse: false
        }
      ]
    },
    basicAnswers: {},
    detailedAnswers: {},
    basicResults: {},
    detailedResults: {},
    coreDimensions: [],
    suggestions: []
  }),
  getters: {
    totalScore: (state) => {
      let total = 0
      Object.values(state.basicAnswers).forEach(score => {
        total += score
      })
      Object.values(state.detailedAnswers).forEach(score => {
        total += score
      })
      return total
    },
    dimensionScores: (state) => {
      const scores = {}
      state.basicQuestions.forEach(question => {
        if (!scores[question.dimension]) {
          scores[question.dimension] = 0
        }
        const score = state.basicAnswers[question.id]
        if (score) {
          scores[question.dimension] += score
        }
      })
      return scores
    }
  },
  actions: {
    saveBasicAnswer(questionId, score) {
      this.basicAnswers[questionId] = score
    },
    saveDetailedAnswer(questionId, score) {
      this.detailedAnswers[questionId] = score
    },
    calculateBasicResults() {
      const scores = {}
      this.basicQuestions.forEach(question => {
        if (!scores[question.dimension]) {
          scores[question.dimension] = 0
        }
        const score = this.basicAnswers[question.id]
        if (score) {
          scores[question.dimension] += score
        }
      })
      this.basicResults = scores
      
      // 找出最严重的1-2个核心维度
      const sortedDimensions = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([dimension]) => dimension)
      this.coreDimensions = sortedDimensions
    },
    calculateDetailedResults(dimension) {
      let score = 0
      const questions = this.detailedQuestions[dimension]
      questions.forEach(question => {
        const answer = this.detailedAnswers[question.id]
        if (answer) {
          score += answer
        }
      })
      this.detailedResults[dimension] = score
    },
    generateSuggestions() {
      // 基于维度和得分生成建议
      const suggestions = []
      
      // 示例建议，后续可通过后台配置
      const suggestionMap = {
        '未来不确定性': {
          light: ['制定短期目标，逐步实现', '与学长学姐交流经验'],
          medium: ['寻求职业规划指导', '参加实习积累经验'],
          heavy: ['咨询专业心理咨询师', '加入职业发展社团']
        },
        '学业内卷': {
          light: ['合理安排学习时间', '寻找适合自己的学习方法'],
          medium: ['与同学合作学习', '调整学习目标'],
          heavy: ['寻求学业辅导', '平衡学习与休息']
        },
        '人际关系': {
          light: ['主动与同学交流', '参加社团活动'],
          medium: ['学习沟通技巧', '建立深度友谊'],
          heavy: ['寻求人际关系辅导', '参加社交技能培训']
        },
        '自我认知': {
          light: ['每天记录自己的优点', '设定合理的自我期望'],
          medium: ['参加自我探索活动', '与信任的人交流'],
          heavy: ['寻求心理咨询', '参加自我成长工作坊']
        },
        '价值冲突': {
          light: ['反思自己的价值观', '与他人讨论不同观点'],
          medium: ['阅读相关书籍', '参加价值观讨论活动'],
          heavy: ['寻求专业指导', '参加价值观澄清工作坊']
        }
      }
      
      // 为每个核心维度生成建议
      this.coreDimensions.forEach(dimension => {
        const score = this.detailedResults[dimension] || this.basicResults[dimension]
        let level
        if (score <= 4) level = 'light'
        else if (score <= 7) level = 'medium'
        else level = 'heavy'
        
        const dimensionSuggestions = suggestionMap[dimension][level]
        suggestions.push(...dimensionSuggestions)
      })
      
      // 确保只返回3-5条建议
      this.suggestions = suggestions.slice(0, 5)
    },
    resetAssessment() {
      this.basicAnswers = {}
      this.detailedAnswers = {}
      this.basicResults = {}
      this.detailedResults = {}
      this.coreDimensions = []
      this.suggestions = []
    }
  }
})
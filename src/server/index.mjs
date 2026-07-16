import { config } from 'dotenv'

import express from 'express'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'

import { CHATBOT_INSTRUCTIONS } from './chatbotPrompt.mjs'

config({ path: '.env' })
config({ path: '.env.local', override: true })

const port = Number(process.env.PORT || 8787)

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY가 없습니다. 프로젝트 루트의 .env 또는 .env.local을 확인해 주세요.')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const app = express()

app.use(express.json({ limit: '100kb' }))

const allowedRoutes = [
  '/',
  '/travel',
  '/course',
  '/course/result',
  '/saved-courses',
  '/community',
  '/community/write',
  '',
]

const allowedCategories = [
  '',
  '관광지',
  '레포츠',
  '문화시설',
  '쇼핑',
  '숙박',
  '음식점',
  '축제·공연행사',
]

const ChatbotResponse = z.object({
  reply: z.string(),
  action: z.object({
    type: z.enum(['navigate', 'none']),
    route: z.enum(allowedRoutes),
    screenName: z.string(),
    label: z.string(),
    category: z.enum(allowedCategories),
    keyword: z.string(),
  }),
})

function normalizeHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .slice(-8)
    .filter((message) => {
      return (
        message &&
        ['user', 'assistant'].includes(message.role) &&
        typeof message.content === 'string'
      )
    })
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 500),
    }))
}

app.get('/api/health', (request, response) => {
  response.json({
    ok: true,
    model: process.env.OPENAI_MODEL || 'gpt-5-mini',
  })
})

app.post('/api/chatbot', async (request, response) => {
  const message = String(request.body?.message || '').trim()
  const currentPath = String(request.body?.currentPath || '/').slice(0, 200)

  if (!message) {
    response.status(400).json({ message: '질문을 입력해 주세요.' })
    return
  }

  if (message.length > 500) {
    response.status(400).json({ message: '질문은 500자 이하로 입력해 주세요.' })
    return
  }

  try {
    const result = await openai.responses.parse({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      instructions: CHATBOT_INSTRUCTIONS,
      input: [
        ...normalizeHistory(request.body?.history),
        {
          role: 'user',
          content: `
현재 사용자가 보고 있는 주소: ${currentPath}

사용자 질문:
${message}
          `.trim(),
        },
      ],
      text: {
        format: zodTextFormat(ChatbotResponse, 'site_map_chatbot_response'),
      },
    })

    if (!result.output_parsed) {
      throw new Error('구조화된 응답을 받지 못했습니다.')
    }

    response.json(result.output_parsed)
  } catch (error) {
    console.error('OpenAI 챗봇 요청 실패:', error)
    response.status(500).json({
      message: 'AI 응답을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.',
    })
  }
})

app.listen(port, () => {
  console.log(`챗봇 서버 실행: http://localhost:${port}`)
})

import OpenAI from 'openai'

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')
    const message = String(body.message || '').trim()
    const history = Array.isArray(body.history) ? body.history : []
    const currentPath = String(body.currentPath || '/')

    if (!message) return { statusCode: 400, body: JSON.stringify({ message: '질문을 입력해 주세요.' }) }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const result = await openai.responses.parse({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      instructions: /* CHATBOT_INSTRUCTIONS string */,
      input: [
        ...history.slice(-8),
        { role: 'user', content: `현재 사용자가 보고 있는 주소: ${currentPath}\n\n사용자 질문:\n${message}` },
      ],
      // text format etc (same as server code)
    })

    if (!result.output_parsed) {
      return { statusCode: 500, body: JSON.stringify({ message: '구조화된 응답을 받지 못했습니다.' }) }
    }

    return { statusCode: 200, body: JSON.stringify(result.output_parsed) }
  } catch (err) {
    console.error('chatbot function error', err)
    return { statusCode: 500, body: JSON.stringify({ message: 'AI 응답 생성 실패' }) }
  }
}
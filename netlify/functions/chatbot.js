export default {
  async fetch(req) {
    try {
      const body = await req.json()
      const message = (body.message || '').slice(0, 500)
      if (!message) return new Response(JSON.stringify({ message: '질문을 입력해 주세요.' }), { status: 400 })

      const currentPath = String(body.currentPath || '/').slice(0, 200)
      const history = Array.isArray(body.history) ? body.history.slice(-8) : []

      // Build input for OpenAI Responses API (adjust model/format as needed)
      const input = [
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: `현재 사용자가 보고 있는 주소: ${currentPath}\n\n사용자 질문:\n${message}` }
      ]

      const resp = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-5-mini',
          input
          // 여기에 format 규칙(zod 등)이 필요하면 추가 구현 필요
        })
      })

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '')
        return new Response(JSON.stringify({ message: 'OpenAI 요청 실패', detail: errText }), { status: 502 })
      }

      const json = await resp.json()
      // 간단: 전체 응답을 클라이언트에 전달
      return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' } })
    } catch (err) {
      console.error('chatbot function error', err)
      return new Response(JSON.stringify({ message: '서버 에러' }), { status: 500 })
    }
  },
}
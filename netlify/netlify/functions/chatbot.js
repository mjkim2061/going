export default {
  async fetch(req) {
    try {
      const body = await req.json();
      const message = String(body.message || '').trim();
      const history = Array.isArray(body.history) ? body.history : [];
      const currentPath = String(body.currentPath || '/');

      if (!message) {
        return new Response(JSON.stringify({ message: '질문을 입력해 주세요.' }), { status: 400 });
      }

      const openaiResp = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-5-mini',
          input: [
            ...history.slice(-8),
            { role: 'user', content: `현재 사용자가 보고 있는 주소: ${currentPath}\n\n사용자 질문:\n${message}` }
          ],
          // 필요하면 text format 옵션 추가
        }),
      });

      if (!openaiResp.ok) {
        const text = await openaiResp.text().catch(() => '');
        return new Response(JSON.stringify({ message: 'OpenAI 요청 실패', detail: text }), { status: 502 });
      }

      const json = await openaiResp.json();
      return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
      console.error('chatbot function error', err);
      return new Response(JSON.stringify({ message: '서버 에러' }), { status: 500 });
    }
  }
}
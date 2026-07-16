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

      // If server-side parsing (responses.parse) was used, prefer structured output
      if (json.output_parsed && typeof json.output_parsed === 'object') {
        return new Response(JSON.stringify(json.output_parsed), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // Fallback: try to extract a readable reply from various OpenAI response shapes
      function extractReply(resp) {
        if (!resp) return '';
        if (typeof resp.output_text === 'string' && resp.output_text.trim()) return resp.output_text.trim();

        if (Array.isArray(resp.output) && resp.output.length) {
          const parts = [];
          for (const item of resp.output) {
            if (typeof item === 'string') parts.push(item);
            else if (item?.text) parts.push(item.text);
            else if (Array.isArray(item?.content)) {
              for (const c of item.content) {
                if (typeof c === 'string') parts.push(c);
                else if (c?.text) parts.push(c.text);
              }
            }
          }
          const joined = parts.join(' ').trim();
          if (joined) return joined;
        }

        if (Array.isArray(resp.choices) && resp.choices.length) {
          for (const choice of resp.choices) {
            if (typeof choice?.message?.content === 'string') return choice.message.content;
            if (typeof choice?.text === 'string') return choice.text;
            if (Array.isArray(choice?.output)) {
              const t = choice.output.map(o => o?.text || '').filter(Boolean).join(' ');
              if (t) return t;
            }
          }
        }

        return '';
      }

      const reply = extractReply(json) || '';
      const action = (json.output_parsed && json.output_parsed.action) || null;

      return new Response(JSON.stringify({ reply, action }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
      console.error('chatbot function error', err);
      return new Response(JSON.stringify({ message: '서버 에러' }), { status: 500 });
    }
  }
}
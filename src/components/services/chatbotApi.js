export async function requestChatbotReply({ message, history, currentPath }) {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
      currentPath,
    }),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || '챗봇 요청에 실패했습니다.')
  }

  return result
}

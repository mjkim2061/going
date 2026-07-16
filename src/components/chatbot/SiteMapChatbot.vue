<script setup>
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { requestChatbotReply } from '@/components/services/chatbotApi'

const route = useRoute()
const router = useRouter()

const quickQuestions = [
  '부모님과 함께 갈 만한 여행지를 추천해줘',
  '광주 맛집을 찾아보고 싶어',
  '여행 코스를 만들고 싶어',
  '저장한 여행 코스는 어디서 봐?',
  '축제 정보를 보고 싶어',
  '여행 후기를 작성하려면 어디로 가야 해?',
]

const isOpen = ref(false)
const isLoading = ref(false)
const inputMessage = ref('')
const messageListElement = ref(null)
const messageInputElement = ref(null)

let messageSequence = 1

function getCurrentTime() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function createInitialMessages() {
  return [
    {
      id: messageSequence++,
      role: 'bot',
      text: '안녕하세요. 가자잉 도우미입니다. 찾고 싶은 관광정보나 필요한 기능을 자연스럽게 말해 주세요.',
      time: getCurrentTime(),
      action: null,
    },
  ]
}

const messages = ref(createInitialMessages())

async function scrollToBottom() {
  await nextTick()
  if (messageListElement.value) {
    messageListElement.value.scrollTop = messageListElement.value.scrollHeight
  }
}

function appendMessage(role, text, action = null) {
  messages.value.push({
    id: messageSequence++,
    role,
    text,
    time: getCurrentTime(),
    action,
  })

  scrollToBottom()
}

function openChatbot() {
  isOpen.value = true
  nextTick(() => {
    messageInputElement.value?.focus()
    scrollToBottom()
  })
}

function makeApiHistory() {
  return messages.value.slice(-8).map((message) => ({
    role: message.role === 'bot' ? 'assistant' : 'user',
    content: message.text,
  }))
}

async function submitMessage(selectedText) {
  const message =
    typeof selectedText === 'string' ? selectedText.trim() : inputMessage.value.trim()

  if (!message || isLoading.value) return

  const history = makeApiHistory()
  appendMessage('user', message)
  inputMessage.value = ''
  isLoading.value = true

  try {
    const result = await requestChatbotReply({
      message,
      history,
      currentPath: route.fullPath,
    })

    const action = result.action?.type === 'navigate' ? result.action : null
    appendMessage('bot', result.reply, action)
  } catch (error) {
    appendMessage(
      'bot',
      error instanceof Error
        ? error.message
        : 'AI 응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    )
  } finally {
    isLoading.value = false
  }
}

async function moveToScreen(message) {
  const action = message.action
  if (!action?.route) return

  const query = {}
  if (action.category) query.category = action.category
  if (action.keyword) query.keyword = action.keyword

  const target = { path: action.route, query }
  const resolvedRoute = router.resolve(target)

  if (resolvedRoute.matched.length === 0) {
    appendMessage('bot', '아직 연결되지 않은 화면입니다.')
    return
  }

  await router.push(target)
  isOpen.value = false
}

function resetChatbot() {
  inputMessage.value = ''
  isLoading.value = false
  messages.value = createInitialMessages()
  nextTick(() => messageInputElement.value?.focus())
}
</script>

<template>
  <div class="site-chatbot">
    <Transition name="chatbot-panel">
      <section v-if="isOpen" class="chatbot-panel" role="dialog" aria-label="가자잉 도우미 챗봇">
        <header class="chatbot-header">
          <div class="chatbot-header__identity">
            <span class="chatbot-header__logo">
              <img src="/logo-gajaing.png" alt="가자잉 로고" class="chatbot-logo-img" />
            </span>
            <div>
              <h2>가자잉 도우미</h2>
              <p>필요한 화면과 관광정보를 안내해 드려요.</p>
            </div>
          </div>

          <div class="chatbot-header__actions">
            <button type="button" class="header-action" title="대화 초기화" @click="resetChatbot">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button type="button" class="header-action" title="닫기" @click="isOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </header>

        <div ref="messageListElement" class="chatbot-messages" aria-live="polite">
          <article
            v-for="message in messages"
            :key="message.id"
            :class="['chat-message', `chat-message--${message.role}`]"
          >
            <div class="chat-message__meta">
              <strong>{{ message.role === 'bot' ? '가자잉 도우미' : '나' }}</strong>
              <time>{{ message.time }}</time>
            </div>

            <div class="chat-message__bubble">
              <p>{{ message.text }}</p>

              <div v-if="message.action" class="screen-guide">
                <div class="screen-guide__information">
                  <span>추천 화면</span>
                  <strong>{{ message.action.screenName }}</strong>
                </div>
                <button type="button" @click="moveToScreen(message)">
                  {{ message.action.label }}
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </article>

          <div v-if="messages.length === 1" class="quick-questions">
            <p>이런 질문을 해보세요</p>
            <div class="quick-questions__buttons">
              <button
                v-for="question in quickQuestions"
                :key="question"
                type="button"
                @click="submitMessage(question)"
              >
                {{ question }}
              </button>
            </div>
          </div>

          <div v-if="isLoading" class="typing-area">
            <span>가자잉 도우미가 응답을 작성하고 있어요.</span>
            <div class="typing-indicator" aria-label="응답 작성 중">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <form class="chatbot-input" @submit.prevent="submitMessage()">
          <label for="chatbot-message" class="sr-only">챗봇 메시지 입력</label>
          <input
            id="chatbot-message"
            ref="messageInputElement"
            v-model="inputMessage"
            type="text"
            maxlength="500"
            placeholder="궁금한 내용을 입력해 주세요"
            autocomplete="off"
            :disabled="isLoading"
          />
          <button type="submit" :disabled="!inputMessage.trim() || isLoading">전송</button>
        </form>
      </section>
    </Transition>

    <button
      v-if="!isOpen"
      type="button"
      class="chatbot-floating-button"
      aria-label="가자잉 도우미 열기"
      @click="openChatbot"
    >
      <span class="chatbot-floating-button__icon"><img src="/logo-gajaing.png" alt="가자잉 로고" style="width:26px;height:26px;object-fit:contain;border-radius:4px;background:#fff;"/></span>
      <span class="chatbot-floating-button__label">가자잉 도우미</span>
    </button>
  </div>
</template>

<style scoped>
.site-chatbot {
  --chat-primary: #e15b35;
  --chat-primary-dark: #b94026;
  --chat-secondary: #f59e52;
  --chat-accent: #234e70;
  --chat-background: #fffaf6;
  --chat-border: #f0ddd3;
  --chat-text: #2c2a29;
  --chat-muted: #80736d;
}

.chatbot-floating-button {
  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 148px;
  height: 58px;
  padding: 8px 18px 8px 8px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--chat-primary), var(--chat-secondary));
  border: 0;
  border-radius: 999px;
  box-shadow: 0 15px 35px rgb(177 64 38 / 32%);
}

.chatbot-floating-button__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--chat-primary-dark);
  font-size: 14px;
  font-weight: 900;
  background: #ffffff;
  border-radius: 50%;
}

.chatbot-floating-button__label {
  font-size: 15px;
  font-weight: 800;
}

.chatbot-panel {
  position: fixed;
  right: 26px;
  bottom: 98px;
  z-index: 1200;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  width: min(460px, calc(100vw - 32px));
  height: min(680px, calc(100vh - 130px));
  color: var(--chat-text);
  background: var(--chat-background);
  border: 1px solid rgb(225 91 53 / 18%);
  border-radius: 8px;
  box-shadow: 0 28px 75px rgb(76 42 31 / 25%);
}

.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88px;
  padding: 17px 18px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--chat-primary-dark), var(--chat-primary), var(--chat-secondary));
}

.chatbot-header__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chatbot-header__logo {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: var(--chat-primary-dark);
  font-weight: 900;
  background: #ffffff;
  border-radius: 8px;
}

.chatbot-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.chatbot-header h2,
.chatbot-header p {
  margin: 0;
}

.chatbot-header p {
  margin-top: 4px;
  color: rgb(255 255 255 / 84%);
  font-size: 12px;
}

.chatbot-header__actions {
  display: flex;
  gap: 4px;
}

.header-action {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #ffffff;
  background: transparent;
  border: 0;
  border-radius: 8px;
}

.chatbot-messages {
  overflow-y: auto;
  padding: 22px 18px 26px;
}

.chat-message {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.chat-message--user {
  align-items: flex-end;
}

.chat-message__meta {
  display: flex;
  gap: 7px;
  margin-bottom: 6px;
  color: var(--chat-muted);
  font-size: 11px;
}

.chat-message__bubble {
  max-width: 88%;
  padding: 13px 14px;
  background: #ffffff;
  border: 1px solid var(--chat-border);
  border-radius: 8px;
}

.chat-message--user .chat-message__bubble {
  color: #ffffff;
  background: linear-gradient(135deg, var(--chat-accent), #34759f);
  border-color: transparent;
}

.chat-message__bubble p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.screen-guide {
  overflow: hidden;
  margin-top: 13px;
  background: #fff1e9;
  border: 1px solid #f3cdbd;
  border-radius: 8px;
}

.screen-guide__information {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 13px;
}

.screen-guide button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 43px;
  padding: 9px 13px;
  color: #ffffff;
  font-weight: 800;
  background: var(--chat-primary);
  border: 0;
}

.quick-questions p,
.typing-area span {
  color: var(--chat-muted);
  font-size: 12px;
}

.quick-questions__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.quick-questions button {
  padding: 8px 11px;
  color: var(--chat-primary-dark);
  font-size: 12px;
  font-weight: 700;
  background: #fff0e7;
  border: 1px solid #f0c6b5;
  border-radius: 999px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  width: 62px;
  margin-top: 6px;
  padding: 12px 15px;
  background: #ffffff;
  border: 1px solid var(--chat-border);
  border-radius: 8px;
}

.typing-indicator span {
  width: 7px;
  height: 7px;
  background: var(--chat-primary);
  border-radius: 50%;
  animation: typing 1.1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.14s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.28s;
}

.chatbot-input {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  padding: 13px;
  background: #ffffff;
  border-top: 1px solid var(--chat-border);
}

.chatbot-input input {
  min-width: 0;
  height: 48px;
  padding: 0 15px;
  background: #fffbf8;
  border: 1px solid #ebd8ce;
  border-radius: 8px;
}

.chatbot-input button {
  min-width: 67px;
  color: #ffffff;
  font-weight: 800;
  background: var(--chat-primary);
  border: 0;
  border-radius: 8px;
  transition: filter 140ms ease, transform 120ms ease, background-color 120ms ease;
}

.chatbot-input button:disabled {
  color: #a89d98;
  background: #e9e2de;
}

.chatbot-input button:hover:not(:disabled) {
  filter: saturate(1.35);
  transform: translateY(-2px);
}

.sr-only {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.chatbot-panel-enter-active,
.chatbot-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.chatbot-panel-enter-from,
.chatbot-panel-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

@media (max-width: 640px) {
  .chatbot-panel {
    inset: 0;
    width: 100%;
    height: 100dvh;
    border: 0;
    border-radius: 0;
  }

  .chatbot-floating-button {
    right: 16px;
    bottom: 76px;
    min-width: 58px;
    padding-right: 8px;
  }

  .chatbot-floating-button__label {
    display: none;
  }
}
</style>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  title: { type: String, default: '' },
})

const mapElement = ref(null)
const mapError = ref('')

let kakaoMapsPromise = null

function loadKakaoMaps() {
  if (window.kakao?.maps?.LatLng) {
    return Promise.resolve(window.kakao)
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise
  }

  if (window.kakao?.maps?.load) {
    kakaoMapsPromise = new Promise((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao))
    })
    return kakaoMapsPromise
  }

  const appKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

  // Try to read the key from Vite env first, then fall back to a runtime window variable.
  // The Vite env value requires restarting the dev server after editing `.env`.
  let finalAppKey = appKey
  if (!finalAppKey) {
    finalAppKey = window.__KAKAO_JAVASCRIPT_KEY__ || ''
  }

  if (!finalAppKey) {
    return Promise.reject(
      new Error(
        '.env에 VITE_KAKAO_JAVASCRIPT_KEY를 입력하거나 window.__KAKAO_JAVASCRIPT_KEY__에 JS키를 설정하세요. (env 변경 후 `npm run dev` 재시작 필요)'
      )
    )
  }

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script =
      document.querySelector('script[data-kakao-map-sdk="true"]') ||
      document.createElement('script')

    script.dataset.kakaoMapSdk = 'true'
    script.async = true
    // Set script src using the resolved key and add a data attribute to identify it.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${finalAppKey}&autoload=false`
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => {
      kakaoMapsPromise = null
      // Provide a helpful error message for likely causes (key/referrer)
      reject(
        new Error(
          'Kakao 지도 SDK를 불러오지 못했습니다. (키가 올바른지, 리퍼러(http://localhost:5173) 등록 여부를 확인하세요)'
        )
      )
    }

    if (!script.parentNode) {
      document.head.appendChild(script)
    }
  })

  return kakaoMapsPromise
}

async function renderMap() {
  mapError.value = ''

  if (!Number.isFinite(props.latitude) || !Number.isFinite(props.longitude)) {
    mapError.value = '등록된 위치 좌표가 없습니다.'
    return
  }

  try {
    const kakao = await loadKakaoMaps()
    await nextTick()

    if (!mapElement.value) return

    const position = new kakao.maps.LatLng(props.latitude, props.longitude)
    const map = new kakao.maps.Map(mapElement.value, {
      center: position,
      level: 4,
    })

    new kakao.maps.Marker({
      map,
      position,
      title: props.title,
    })
  } catch (error) {
    // Show the raw error message and log for easier debugging
    const msg = error instanceof Error ? error.message : '지도를 표시하지 못했습니다.'
    mapError.value = msg
    // Expose more info in console for debugging
    // eslint-disable-next-line no-console
    console.error('[PlaceMap] Kakao map render error:', error)
  }
}

onMounted(renderMap)
watch(() => [props.latitude, props.longitude], renderMap)
</script>

<template>
  <div class="place-map">
    <div v-if="mapError" class="place-map__error">
      <strong>위치 지도</strong>
      <p>{{ mapError }}</p>
    </div>

    <div
      v-else
      ref="mapElement"
      class="place-map__canvas"
      :aria-label="`${title} 위치 지도`"
    />
  </div>
</template>

<style scoped>
.place-map {
  overflow: hidden;
  width: 100%;
  min-height: 330px;
  background: #e8efef;
}

.place-map__canvas {
  width: 100%;
  height: 330px;
}

.place-map__error {
  display: grid;
  min-height: 330px;
  padding: 30px;
  place-content: center;
  color: var(--color-muted);
  text-align: center;
}

.place-map__error strong {
  color: var(--color-primary);
  font-size: 20px;
}
</style>

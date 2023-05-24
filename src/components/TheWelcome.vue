<template>
  <div>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const items = ref([])

const webSocket = new WebSocket('wss://stream.binance.com:9443/ws/bnbbtc@depth10');

webSocket.addEventListener('open', () => {
  console.log('WebSocket connected');
});

webSocket.addEventListener('message', event => {
  console.log(`Received message: ${event.data}`);
  items.value = event.data
});

webSocket.addEventListener('close', event => {
  console.log(`WebSocket closed with code ${event.code}`);
});

webSocket.addEventListener('error', error => {
  console.error('WebSocket error:', error);
});
</script>
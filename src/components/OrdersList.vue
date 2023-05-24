<template>
  <div class="order-book">
    <div v-if="errorInfo.show">
      <h3>{{ errorInfo.title }}</h3>
      <p>{{ errorInfo.footer }}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Bids</th>
          <th>Spread</th>
          <th>Asks</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="index in bids.length" :key="index">
          <td>
            <div class="price-cell" v-if="bids[index - 1]">
              <span v-if="bids[index - 1][2]">
                <img
                  title="It is our order"
                  alt="our order"
                  class="our-order-icon"
                  :src="group"
                />
              </span>
              <span>{{ parseFloat(bids[index - 1][0]) }}</span>
              <span>-</span>
              <span>
                {{ bids[index - 1][1] }}
              </span>
            </div>
          </td>
          <td>
            <span v-if="index === 1">
              <span>{{ priceDif }}</span>
              <span>({{ spread }}%)</span>
            </span>
          </td>
          <td>
            <div class="price-cell" v-if="asks[index - 1]">
              <span v-if="asks[index - 1][2]">
                <img
                  title="It is our order"
                  alt="our order"
                  class="our-order-icon"
                  :src="group"
                />
              </span>
              <span>{{ parseFloat(asks[index - 1][0]) }}</span>
              <span>-</span>
              <span>
                {{ asks[index - 1][1] }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useOrdersStore } from "../stores/orders"
import group from "../assets/group.png"

const store = useOrdersStore()
const bids = computed(() => store.bids)
const asks = computed(() => store.asks)
const spread = computed(() => store.spread)
const priceDif = computed(() => store.priceDif)
const errorInfo = computed(() => store.errorInfo)
const api = computed(() => store.api)

onMounted(() => {
  api.value.get("/orders")
  api.value.get("/orderbook-stream", {
    symbol: "BTC_USDT",
    levels: 20,
    updateSpeed: "1000ms",
  })
})
</script>

<style>
.order-book {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

table {
  border-collapse: collapse;
  margin: 16px;
}

th,
td {
  padding: 8px;
  text-align: center;
}

td {
  min-width: 14rem;
}

th {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.highlighted {
  background-color: #e6f7ff;
}

.spread {
  margin-top: 16px;
  font-size: 18px;
}

.our-order-icon {
  margin-right: 14px;
}

.price-cell {
  display: flex;
  align-items: center;
}
</style>

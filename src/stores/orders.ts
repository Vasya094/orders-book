import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { SoketPayload } from "./types"
import { testDataOurOrders } from "../helpers"

export const useOrdersStore = defineStore("orders", () => {
  const bids = ref([])
  const asks = ref([])
  const ourOrders = ref([])
  const errorInfo = ref({
      show: false,
      title: "An error has occurred",
      footer: 'Please refresh the page'
  })
  const priceDif = ref<string | number>(0)

  const spread = computed(() => {
    if (bids.value.length && asks.value.length) {
      const mean = (Number(bids.value[0][0]) + Number(asks.value[0][0])) / 2;

      priceDif.value = (
        Number(asks.value[0][0]) - Number(bids.value[0][0])
      ).toFixed(6)
      const realSpread = (Number(priceDif.value) / mean) * 100

      return realSpread.toFixed(6)
    } else {
      return 0
    }
  })

  function checkIsOur(orders: Array<Array<string>>): Array<Array<string>> {
    const ordersWithOurInfo = []
    for (let i = 0; i < orders.length; i++) {
      if (
        ourOrders.value.some(
          (ourOrd) => ourOrd.price.toFixed(1) === parseInt(orders[i][0]).toFixed(1)
        )
      ) {
        ordersWithOurInfo.push([...orders[i], "1"])
      } else {
        ordersWithOurInfo.push(orders[i])
      }
    }
    return ordersWithOurInfo
  }

  function startOrdersStream({ symbol, levels }: SoketPayload) {
    const webSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol
        .replace("_", "")
        .toLowerCase()}@depth${levels}`
    )

    webSocket.addEventListener("open", () => {
      console.log("WebSocket connected")
    })

    webSocket.addEventListener("message", (event) => {
      const dateObj = JSON.parse(event.data)
      bids.value = checkIsOur(dateObj.bids)
      asks.value = checkIsOur(dateObj.asks)
    })

    webSocket.addEventListener("close", (event) => {
      console.log(`WebSocket closed with code ${event.code}`)
    })

    webSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error)
      errorInfo.value.show = true;
    })
  }

  function getOurOrdes() {
    setTimeout(() => {
      ourOrders.value = testDataOurOrders
    }, 500)
  }

  const api = {
    get(route: string, payload?: unknown) {
      switch (route) {
        case "/orderbook-stream": {
          startOrdersStream(payload as SoketPayload)
          break
        }
        case "/orders": {
          getOurOrdes()
          break
        }
        default: {
          break
        }
      }
    },
  }

  return { bids, asks, api, spread, priceDif, errorInfo }
})

<!--查询订单组件-->
<template>
  <el-form class="order-form" style="display: flex;margin-top: 20px">
    <el-input size="large" v-model="orderId"
              placeholder="input the order Id（dont share the order Id to anyone!!!）"></el-input>
    <el-button size="large" style="margin-left: 10px;" type="primary" @click="getOrderList">search</el-button>
  </el-form>
  <!--  <div class="order-info">-->
  <!--    <div class="order-detail">-->
  <!--      <span>orderId:</span>-->
  <!--    </div>-->
  <!--    <div class="order-detail">-->
  <!--      <span>payment btc address:</span>-->
  <!--    </div>-->
  <!--    <div class="order-detail">-->
  <!--      <span>payment status:</span>-->
  <!--    </div>-->
  <!--    <div class="order-detail">-->
  <!--      <span>receive ordinal address:</span>-->
  <!--    </div>-->
  <!--    <div class="order-detail">-->
  <!--      <span>inscription id:</span>-->
  <!--    </div>-->
  <!--  </div>-->
  <el-table :data="orderData" style="margin-top: 30px;">
    <el-table-column property="orderId" label="OrderId" width="200"/>
    <el-table-column property="payStatus" label="PayStatus" width="150"/>
    <el-table-column property="receiveAddress" label="ReceiveAddress" width="600"/>
  </el-table>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {getOrder} from '../api/order';

interface OrderData {
  orderId: string;
  payStatus: boolean;
  receiveAddress: string;
}

const orderId = ref('')
const orderData = ref<OrderData[]>([]);

async function getOrderList() {
  console.log("进入方法")
  try {
    const res = await getOrder(orderId.value);
    orderData.value = res;
    console.log(orderData.value)
  } catch (error) {
    console.error(error);
  }
  console.log("结束")
}

// function handleSearch() {
//   console.log("进入方法")
//   const getOrderList = async () => {
//     try {
//       const res = await getOrder(String(orderId)); // 调用接口方法
//       orderList.value = res as OrderData[];
//       console.log(orderList.value)
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log("结束");
//   return {orderList, getOrderList};
// }
</script>

<script lang="ts">
export default {
  name: "InsOrder.vue"
}
</script>

<style scoped>

</style>
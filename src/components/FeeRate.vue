<!--费率选择组件-->
<!--功能说明
1：
-->
<template>
  <el-card class="box-card" :class="{ selected: isSelected }">
    <template #header>
      <div class="card-header">
        <span class="fee-type"><span ref="feeType">{{ feeType }}</span>(<span ref="feeRate">{{ feeRate }}</span>sats/vB)</span>
        <br>
      </div>
    </template>
    <div class="fee-detail">
      <div><span id="total">total:{{ total }}sats({{ totalUsd }}$)</span></div>
      <div><span id="network">network:{{ network }}sats({{ networkUsd }}$)</span></div>
      <div><span id="service">fee:{{ service }}sats({{ serviceUsd }}$)</span></div>
      <div><span style="font-style: italic;color: #409EFF">usd for reference only</span></div>
    </div>
  </el-card>
  <!--  <span id="tmpSat" v-model="tmpSat1">{{satPrice}}</span>-->
</template>

<script setup lang="ts">
import {defineProps, toRefs, watchEffect, provide, nextTick, ref, onMounted} from 'vue';

let total, network, service, tmpSatPrice, tmpFeeRate, tmpFileSize;
let totalUsd, networkUsd, serviceUsd;
const props = defineProps<{
  feeType: String,
  feeRate: Number,
  fileSize: Number,
  satPrice: Number,
  isSelected: Boolean,
}>()

const {satPrice, feeRate, fileSize} = toRefs(props);
let totalReturn;
watchEffect(() => {
  console.log(satPrice.value); //
  const tmpSatPrice = satPrice.value;
  const tmpFeeRate = feeRate.value;
  const tmpFileSize = fileSize.value;
  network = Number(tmpFeeRate) * Number(tmpFileSize);
  networkUsd = (network * Number(tmpSatPrice)).toFixed(2);
  service = (10000 + Number(network) * 0.08).toFixed(0);//
  serviceUsd = (Number(service) * Number(tmpSatPrice)).toFixed(2);
  total = (Number(network) + Number(service)) + 10000;//utxo 10000sats
  totalReturn = total;
  console.log(total);
  totalUsd = (total * Number(tmpSatPrice)).toFixed(2);
  console.log(networkUsd + "," + serviceUsd + "." + totalUsd)
});

defineExpose({
  total
})

// nextTick(() => {
//   defineExpose({
//     totalReturn
//   })
// });

// onMounted(() => {
//   nextTick(() => {
//     totalReturn.value = total; // 在nextTick的回调函数中去获取子组件的值
//   });
// });


// provide('my-data', 'hello world');
// function handleClick() {
//   provide('my-data', 'hello world');
// }

</script>
<script lang="ts">
export default {
  name: "FeeRate.vue"
}
</script>
<style scoped>
.selected {
  background-color: #ccc;
}
</style>
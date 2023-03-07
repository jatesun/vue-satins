<!--订单支付组件-->
<template>
  <div class="pay-info">
    <div>
      <span class="pay-trans">complete your transaction</span><br>
      <span class="pay-tips">this info is very important,you must send your payment in a single transaction.</span>
    </div>
    <div class="pay-copy">
      <span class="pay-type">copy to pay</span><br>
      <span>SEND AMOUNT</span>
      <!--      <input id="foo" value="https://github.com/zenorocha/clipboard.js.gitddd">-->
      <!--      <button class="clipboard" data-clipboard-target="#foo" @click="clipCopyText">  Copy to clipboard</button>-->
      <div class="pay-amount" style="display: flex">
        <el-input v-model="payAmount" style="width: 20%" readonly id="payAmount">{{ payAmount }}</el-input>
        <el-button class="clipboard" data-clipboard-target="#payAmount" @click="clipCopyText">copy</el-button>
      </div>
      <span>BTC  ADDRESS</span>
      <div class="pay-address" style="display: flex">
        <el-input v-model="payAddress" style="width: 80%" readonly id="payAddress">{{ payAddress }}
        </el-input>
        <el-button class="clipboard" data-clipboard-target="#payAddress" @click="clipCopyText">copy</el-button>
      </div>
    </div>
    <div class="pay-type">
      <span>scan to pay</span>
      <div>
        <canvas ref="qrCodeEl"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {defineProps, onMounted, ref, toRefs, watchEffect} from "vue";
import ClipboardJS from "clipboard";
import QRCode from "qrcode";

const props = defineProps<{
  payAddress: String,
  payAmount: Number,
}>()
const {payAddress, payAmount} = toRefs(props);
// const address = "bc1pcz757333z8hauexzdk867n3cpht09ahnnulfkk8vdtmnfva49u8spfnsjp";
// const amount = 0.00034812; // 指定付款金额
const request = `bitcoin:${payAddress.value}?amount=${payAmount.value}`;

function clipCopyText() {
  let clipboard = new ClipboardJS('.clipboard')
  clipboard.on('success', e => {
    console.log('复制成功')
    // 释放内存
    clipboard.destroy()
  })
  clipboard.on('error', e => {
    // 不支持复制
    // errorTip('copied fied')
    // 释放内存
    clipboard.destroy()
  })
}

const qrCodeEl = ref(null);
onMounted(() => {
  if (qrCodeEl.value) {
    console.log(request)
    QRCode.toCanvas(qrCodeEl.value, request, {
      width: 246,
      height: 246,
    });
  }
});
// return {qrCodeEl};
watchEffect(() => {

});

</script>

<script lang="ts">

// import ClipboardJS from 'clipboard';
// import QRCode from 'qrcode';
// import {ref, onMounted} from "vue";

const address = "bc1pcz757333z8hauexzdk867n3cpht09ahnnulfkk8vdtmnfva49u8spfnsjp";
const amount = 0.00034812; // 指定付款金额
const request = `bitcoin:${address}?amount=${amount}`;

export default {
  name: "PayOrder.vue",
  // methods: {
  // //   clipCopyText() {
  // //     let clipboard = new ClipboardJS('.clipboard')
  // //     clipboard.on('success', e => {
  // //       console.log('复制成功')
  // //       // 释放内存
  // //       clipboard.destroy()
  // //     })
  // //     clipboard.on('error', e => {
  // //       // 不支持复制
  // //       // errorTip('copied fied')
  // //       // 释放内存
  // //       clipboard.destroy()
  // //     })
  // //   }
  // // },
  // // setup() {
  // //   const qrCodeEl = ref(null);
  // //   onMounted(() => {
  // //     if (qrCodeEl.value) {
  // //       QRCode.toCanvas(qrCodeEl.value, request, {
  // //         width: 246,
  // //         height: 246,
  // //       });
  // //     }
  // //   });
  // //   return {qrCodeEl};
  // }
}

</script>

<style scoped>
.pay-type {
  font-size: 30px;
}

.pay-tips {
  font-size: 20px;
  font-style: italic;
  color: #409EFF;
}

.pay-trans {
  font-size: 30px;
}

.pay-info {
  position: fixed;
  left: 30%;
  top: 15%;
  width: 700px;
}
</style>
<template>
  <div class="nav-container">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
      <!--      <el-menu-item index="0">LOGO</el-menu-item>-->
      <el-menu-item index="0"><img class="logo" src="./components/icons/satinslogo.jpg" alt="satins logo">
      </el-menu-item>
      <div class="flex-grow"/>
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
  <div class="form-container">
    <el-form class="search-form">
      <p>first,you need to upload your file to inscribe.</p>
      <el-upload
          class="upload-demo"
          drag
          :on-success="handleUploadSuccess"
          :action="uploadUrl"
          multiple
          :data="{ size: '' }"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div>
          <span>File size: {{ fileSize }}</span>
        </div>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em><br>
          jpg/png files with a size less than 500kb
        </div>
      </el-upload>
      <el-input v-model="receiveAddress" required placeholder="second,you should input your receive btc address"/>
      <div class="fee-rate">
        <FeeRate @click="handleClick('economy')" ref="feeRateCmp" class="rat-box click-element" feeType="economy"
                 :isSelected="selected === 'economy'"
                 :feeRate="economy" :satPrice="satPrice" :fileSize="fileSize"/>
        <FeeRate @click="handleClick('regular')" class="rat-box click-element" feeType="normal" :feeRate="regular"
                 :isSelected="selected === 'regular'"
                 :satPrice="satPrice" :fileSize="fileSize"/>
        <FeeRate @click="handleClick('priority')" v-model="showInputNumber" class="rat-box click-element"
                 :isSelected="selected === 'priority'"
                 feeType="custom" :feeRate="priority"
                 :satPrice="satPrice" :fileSize="fileSize"/>
        <!--        <FeeRate class="rat-box" feeType="economy"-->
        <!--                 :feeRate="economy" :satPrice="satPrice" :fileSize="fileSize"/>-->
        <!--        <FeeRate class="rat-box" feeType="normal" :feeRate="regular"-->
        <!--                 :satPrice="satPrice" :fileSize="fileSize"/>-->
        <!--        <FeeRate class="rat-box" feeType="custom" :feeRate="priority" :satPrice="satPrice" :fileSize="fileSize"/>-->
      </div>
      <el-input-number v-if="showInputNumber" class="hidden" v-model="priority" placeholder="input the feerate"/>
      <p>final,choose your fee-rat and pay for inscribe.</p>
      <div class="pay-order">
        <el-button size="large" class="pay-button" type="primary" plain @click="() => { payAndCheck(); }">
          Pay
          and Inscribe
        </el-button>
        <!--        @click="payInfo;visible=true"-->
        <el-button size="large" class="order-button" type="success" plain @click="orderVisible=true">check order info
        </el-button>
      </div>
    </el-form>
    <!--    <InsOrder/>-->
    <!--    <PayOrder/>-->
  </div>
  <el-dialog v-model="visible" width="60%" center>
    <div style="height: 500px">
      <PayOrder :payAddress="payAddress" :payAmount="payAmount" :orderId="orderId"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="visible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--order info dialog-->
  <el-dialog v-model="orderVisible" width="60%" center>
    <div style="height: 500px">
      <!--      <PayOrder :payAddress="payAddress" :payAmount="payAmount"/>-->
      <InsOrder/>
    </div>
    <!--    <template #footer>-->
    <!--      <span class="dialog-footer">-->
    <!--        <el-button @click="visible = false">Cancel</el-button>-->
    <!--        <el-button type="primary" @click="visible = false">-->
    <!--          Confirm-->
    <!--        </el-button>-->
    <!--      </span>-->
    <!--    </template>-->
  </el-dialog>


  <!--  <el-dialog v-model="visible" :show-close="false">-->
  <!--    <template #header="{ close }">-->
  <!--      <div >-->
  <!--        <h4>payment info</h4>-->
  <!--        <el-button type="danger" @click="close">-->
  <!--          <el-icon class="el-icon&#45;&#45;left">-->
  <!--          </el-icon>-->
  <!--          Close-->
  <!--        </el-button>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--    This is dialog content.-->
  <!--  </el-dialog>-->
</template>

<script lang="ts" setup>

import feeRate from "@/components/FeeRate.vue";

interface Fees {
  regular: number;
  priority: number;
  economy: number;
  satPrice: number;
}

const visible = ref(false)
const orderVisible = ref(false)
import {ref, onMounted, toRefs, watchEffect, nextTick, inject, watch} from 'vue'
import {UploadFilled} from '@element-plus/icons-vue'
import FeeRate from "./components/FeeRate.vue";
import InsOrder from "./components/InsOrder.vue";
import PayOrder from "./components/PayOrder.vue";

const sessionId = ref('');
const receiveAddress = ref('')
const activeIndex = ref('1')
const regular = ref<number>(0)
const priority = ref<number>(1)
const economy = ref<number>(2)
const satPrice = ref<number>(3)
// const fileSize = 2214;//文件大小
const showInputNumber = ref(false);
// const feeRateCmp = ref(null);
const feeRateCmp = ref<null | typeof feeRate>(null);
// const feeRateProps = toRefs((feeRateCmp.value as any)?.props)
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
// upload file
const fileSize = ref(0);
const uploadUrl = "http://localhost:8080/upload"; // 设置上传地址
// 上传成功后执行的函数，response 参数为后端返回的数据
const handleUploadSuccess = (response: any) => {
  console.log("上传成功", response);
  const resp = String(response).split(",");
  fileSize.value = Number(resp[0]);
  sessionId.value = resp[1];
  console.log(sessionId.value)
};
const receivedData = ref('');
watch(priority, (newVal, oldVal) => {
  totalSat = getTotalSats(priority.value, Number(fileSize.value));
})

// const childData = inject<string>('my-data');

function onDataReceived(data: string) {
  receivedData.value = data;
  console.log(receivedData);
}

function test() {
  nextTick(() => {
    const total = (feeRateCmp.value as any).total;
    console.log(total);
  });
}

let totalSat: number;
const selected = ref<string | null>(null);

function handleClick(type: string) {
  if (selected.value === type) {
    selected.value = null;
  } else {
    selected.value = type;
  }
  if (type == "economy") {
    showInputNumber.value = false;
    totalSat = getTotalSats(economy.value, fileSize.value);
    console.log(totalSat);
  } else if (type == "regular") {
    showInputNumber.value = false;
    totalSat = getTotalSats(regular.value, fileSize.value);
    console.log(totalSat);
  } else if (type = "priority") {
    totalSat = getTotalSats(priority.value, fileSize.value);
    showInputNumber.value = true;
    console.log(totalSat)
  }
  console.log(showInputNumber.value)
}

// const payAddress = "1HnopzK1rKj7z3KsfDYCc3P1M3U4SJHoyk";
const payAddress = ref("");
const payAmount = ref(0);
import {getOrder} from './api/order';
import {getPayInfo} from "@/api/pay";

interface PayData {
  receiveAddress: string;
}

const orderId = ref("");

function payAndCheck() {
  if (!receiveAddress.value||!fileSize.value) {
    alert("receive address and file is required");
    visible.value = false;
    return;
  } else {
    visible.value = true;
    payInfo();
  }
}

async function payInfo() {

  //get payinfo,paysats
  console.log("付款时：" + totalSat)
  payAmount.value = totalSat / 100000000;
  const network = Number(finalNetwork.value) / 100000000;
  const service = Number(finalService.value) / 100000000;
  console.log(network)
  console.log(service)
  // call backend to get btc new address TODO
  const res = await getPayInfo(payAmount.value, fileSize.value, sessionId.value, finalFeeRate.value, service, network, receiveAddress.value);
  console.log(res)
  const resp = String(res).split(",");
  payAddress.value = String(resp[0]);
  orderId.value = resp[1];
  // console.log(orderData.value)
  // payAddress.value = res
  // payAddress.value = res;
}

const finalNetwork = ref(0);
const finalService = ref(0);
const finalFeeRate = ref(0);

function getTotalSats(feeRate: number, fileSize: number) {
  finalFeeRate.value = feeRate;
  const network = feeRate * Math.ceil(fileSize / 4);
  finalNetwork.value = network
  // const service = (7000 + Number(network) * 0.08).toFixed(0);//
  const service = 0;//
  finalService.value = Number(service);
  const totalSat = (Number(network) + Number(service)) + 10000;//utxo 10000sats
  return totalSat;
}

// function handleClick() {
//   test();
//   // console.log((feeRateCmp.value as any)?.totalReturn)
//   // console.log((feeRateCmp.value as any)?.$refs.componentRef.total)
// }

// function handleClick(this: any) {
//   this.$nextTick(() => {
//     // childCount.value = this.$refs.child.count.value
//     const test = this.$refs.feeRateCmp.total.value;
//     console.log(test);
//   })
// nextTick(() => {
//   console.log((feeRateCmp.value as any)?.total);
// })
// }

//
// async function getSatPrice() {
//   try {
//     const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
//     const data = await response.json();
//     const usd = data.bitcoin.usd;
//     const sat = usd / 100000000;
//     return sat;
//   } catch (error) {
//     console.error(error);
//     return 0;
//   }
// }

onMounted(async () => {
      const response = await fetch('https://api.blockchain.info/mempool/fees')
      const respJson = await response.json();
      const data: Fees = respJson;
      const satRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const satJson = await satRes.json();
      const usd = satJson.bitcoin.usd;
      const sat = usd / 100000000;
      data.economy = respJson.limits.min;
      satPrice.value = sat;
      regular.value = data.regular
      priority.value = data.priority
      economy.value = data.economy;
    }
)

</script>

<script lang="ts">
import {ref} from "vue";

</script>

<style>
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100; /* 设置一个较高的 z-index，使导航栏置于其他元素之上 */
}

.logo {
  height: 60px;
}

/*.form-container{*/
/*  position: relative;*/
/*}*/
.fee-rate {
  display: flex;
  justify-content: space-between;
}

.rat-box {
  flex: 1;
  /*height: 100px;*/
  /*background-color: #ccc;*/
  margin: 10px;
  width: calc(33.33% - 20px);
}

.search-form {
  position: fixed;
  left: 30%;
  top: 15%;
  width: 700px;
}

.flex-grow {
  flex-grow: 1;
}

.pay-order {
  position: relative;
  left: 20%;
}

.click-element {
  cursor: pointer;
}
</style>

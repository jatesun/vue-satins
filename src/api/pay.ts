// @ts-ignore
import axios from 'axios';

// 定义订单接口返回的数据类型

// 获取订单信息的函数，接收订单 ID 参数
export async function getPayInfo(payAmount: number, fileSize: number, sessionId: string, feeRate: number, network: number, service: number,receiveAddress:string): Promise<string> {
    console.log("调用getorder方法")
    const response = await axios.get(`http://localhost:8080/getBtcAddress?payAmount=${payAmount}&fileSize=${fileSize}
    &sessionId=${sessionId}&feeRate=${feeRate}&network=${network}&service=${service}&receiveAddress=${receiveAddress}`);
    return response.data;
}
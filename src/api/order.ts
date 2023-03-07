// @ts-ignore
import axios from 'axios';

// 定义订单接口返回的数据类型
interface OrderData {
    orderId: string;
    payStatus: boolean;
    receiveAddress: string;
}

// 获取订单信息的函数，接收订单 ID 参数
export async function getOrder(orderId: string): Promise<OrderData[]> {
    console.log("调用getorder方法")
    const response = await axios.get(`http://localhost:8080/getOrder?orderId=${orderId}`);
    return response.data;
}
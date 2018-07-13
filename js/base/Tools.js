// 工具类
export class Tools {

    // 获取区间随机数
    static randomFrom(lowerValue,upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    }
}
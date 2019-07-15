import coin0_05 from "../assets/img/coins/9.png";
import coin0_1 from "../assets/img/coins/8.png";
import coin0_2 from "../assets/img/coins/7.png";
import coin0_3 from "../assets/img/coins/6.png";
import coin0_5 from "../assets/img/coins/5.png";
import coin0_7 from "../assets/img/coins/4.png";
import coin1 from "../assets/img/coins/3.png";
import coin1_5 from "../assets/img/coins/2.png";
import coin2 from "../assets/img/coins/1.png";

export interface AnyObject {
    [k: string]: any
}

export interface IOpenedCaseEvent {
    transactionHash: string
    returnValues: {
        amount: number
        prize: number
        user: string
    }
}

export const coinsMap: AnyObject = {
    0.05: coin0_05,
    0.1: coin0_1,
    0.2: coin0_2,
    0.3: coin0_3,
    0.5: coin0_5,
    0.7: coin0_7,
    1: coin1,
    1.5: coin1_5,
    2: coin2
};
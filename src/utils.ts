export default class Utils {
    static formatNumber(n: number): number | string {
        return Number(n) === n && n % 1 !== 0 ? n.toFixed(4).replace(/0+$/, '') : n;
    }
}
import * as React from 'react';
import Ethereum from "../ethereum";
import {IOpenedCaseEvent} from "../shared/types";
import config from "../config";
import moment from "moment";
import Contract from "web3/eth/contract";

const {Provider, Consumer} = React.createContext({} as IProviderState);
export const consumer = Consumer;
const date = moment.utc(moment().format('YYYY-MM-DD HH'));

export default class ProviderComponent extends React.PureComponent<IProvider> {
    state: IProviderState = {
        usersCount: undefined,
        openedCasesCount: undefined,
        openedCases: [],
        usersStats: {},
        casesWins: {},
        prizes: {}
    };

    componentDidMount(): void {
        if (!this.props.contract) return;
        this.getTotalStats();
        this.monitorEvents();
        this.getPastEvents();
    }

    private getPastEvents() {
        let timestamp: number[] = [parseInt(date.format('X'))];
        for (let i = 1; i <= 24; i++) timestamp.push(parseInt(date.subtract(1, 'hour').format('X')));
        this.props.contract.getPastEvents('CaseOpened', {filter: {timestamp}, fromBlock: 0})
            .then((events: IOpenedCaseEvent[]) =>
                this.setState(events.reduce((pv, cv) => ProviderComponent.getStatFromEvent(cv, pv),
                    {openedCases: [], usersStats: {}} as IDailyStats)))
            .catch(console.error);
    }

    private monitorEvents() {
        this.props.contract.events.CaseOpened({fromBlock: this.props.blockNumber},
            (err: Error, data: IOpenedCaseEvent) => {
                if (err) return console.error(err);
                this.getTotalStats();
                this.setState(ProviderComponent.getStatFromEvent(data, this.state))
            });
    }

    private getTotalStats(cases: { price: number, name: string }[] = config.coins) {
        Promise.all([
            Ethereum.callContract(this.props.contract, 'usersCount'),
            Ethereum.callContract(this.props.contract, 'openedCases'),
            this.getPrizes(),
            ...cases.map(c => Ethereum.callContract(this.props.contract, 'caseWins', [(c.price * 10 ** 18).toString()])
                .then(r => ({[c.price]: parseInt(r.toString()) / 10 ** 18}))),
        ]).then(result => {
            const [usersCount, openedCasesCount, prizesArr, ...casesWinsArr] = result;
            const casesWins = casesWinsArr.reduce((pv, cv) => ({...pv, ...cv}), {});
            const prizes = (prizesArr as { [k: number]: number[] }[]).reduce((pv, cv) => ({...pv, ...cv}), {});
            this.setState({
                usersCount: usersCount.toNumber(),
                openedCasesCount: openedCasesCount.toNumber(),
                prizes,
                casesWins: {...this.state.casesWins, ...casesWins}
            })
        });
    }

    private getPrizes(): Promise<{ [k: number]: number[] }[]> {
        return Promise.all(config.coins.map(c => Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
            Ethereum.callContract(this.props.contract, "betsPrizes", [(c.price * 10 ** 18).toString(), i])
                .then(m => m.toNumber() / 10000))).then(prizes => ({[c.price]: prizes}))));
    }

    private static getStatFromEvent(event: IOpenedCaseEvent, pv: IDailyStats): IDailyStats {
        const {amount, prize, user} = event.returnValues;
        return {
            openedCases: pv.openedCases.find(oc => oc.tx === event.transactionHash)
                ? pv.openedCases
                : [{prize: prize / 10 ** 18, amount: amount / 10 ** 18, tx: event.transactionHash}, ...pv.openedCases],
            usersStats: {
                ...pv.usersStats,
                ...{
                    [user]: {
                        bets: (pv.usersStats[user] || {bets: 0}).bets + 1,
                        wins: (pv.usersStats[user] || {wins: 0}).wins + prize / 10 ** 18
                    }
                }
            }
        }
    }

    render() {
        return <Provider value={this.state}>
            {this.props.children}
        </Provider>
    }
}

interface IProvider {
    contract: Contract
    blockNumber: number
    children: any[]
}

interface IDailyStats {
    openedCases: { amount: number, prize: number, tx: string }[]
    usersStats: {
        [k: string]: {
            wins: number
            bets: number
        }
    }
}

interface IProviderState extends IDailyStats {
    usersCount: undefined | number
    openedCasesCount: undefined | number
    casesWins: { [k: number]: number }
    prizes: { [k: number]: number[] }
}
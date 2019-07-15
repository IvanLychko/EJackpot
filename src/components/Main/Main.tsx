import * as React from 'react';
import config from '../../config';
import Ethereum from "../../ethereum";
import {coinsMap} from "../../shared/types";
import StatsRows from "./partials/StatsRows";
import {consumer as Consumer} from "../Provider";
import Contract from "web3/eth/contract";
import {WithTranslation, withTranslation} from "react-i18next";
import Utils from "../../utils";

class Main extends React.PureComponent<T> {
    private readonly onResize = (() => this.setState({windowWidth: window.innerWidth}));
    state: IMainState = {totalWins: undefined, caseOpenings: [], windowWidth: window.innerWidth};

    componentDidMount(): void {
        window.addEventListener("resize", this.onResize);
        if (!this.props.contract) return;
        Promise.all([
            Ethereum.callContract(this.props.contract, 'totalWins'),
            ...config.coins.map(c => Ethereum.callContract(this.props.contract, 'caseOpenings', [(c.price * 10 ** 18).toString()])
                .then(openings => ({price: c.price, openings: parseInt(openings.toString())})))
        ]).then(data => {
            const [totalWins, ...caseOpenings] = data;
            this.setState({
                totalWins: parseInt(totalWins.toString()) / 10 ** 18,
                caseOpenings: [...this.state.caseOpenings, ...caseOpenings]
                    .sort((a, b) => a.openings < b.openings ? 1 : (a.openings > b.openings ? -1 : 0))
            });
        })
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.onResize)
    }

    render() {
        const caseOpenings = this.state.caseOpenings;
        const popular = caseOpenings.length && caseOpenings.filter(c => c.openings > 0) ? caseOpenings[0].price : "";
        let profit: number;
        let prizes: number[];
        let tmp: number[] | undefined;

        return <React.Fragment>
            <div className="stock">
                <div className="stock__block">
                    <div className="stock__block-header">{this.props.t('popular')}</div>
                    <div className="coin">
                        <img className="coin__img" src={popular ? coinsMap[popular] : ""} alt=""/>
                        <span
                            className="coin__value">{popular}</span>
                    </div>
                </div>
                <div className="stock__block">
                    <div className="stock__block-header">{this.props.t('profit')}</div>
                    <div className="coin">
                        <Consumer>{context =>
                            <img className="coin__img"
                                 src={caseOpenings.length > 0 ? coinsMap[profit = (tmp = caseOpenings
                                     .filter(c => c.openings > 0)
                                     .map(c => [context.casesWins[c.price] / c.openings, c.price])
                                     .sort((a, b) => a[0] < b[0] ? 1 : (a[0] > b[0] ? -1 : 0))[0]) ? tmp[1] : 0.7] : ""}
                                 alt=""/>
                        }</Consumer>
                        <Consumer>{() =>
                            <span className="coin__value">{profit || ""}</span>
                        }</Consumer>
                    </div>
                </div>
            </div>
            <div className="cases-container">
                {config.coins.map((coin, i) =>
                    <div className="case" key={i}>
                        <div className="case__header">{this.props.t('case')} "{this.props.t(coin.name)}"</div>
                        <div className="case__price">
                            <div className="case__price-count">{coin.price}</div>
                            <div>{this.props.t('price')}</div>
                        </div>
                        <div className="case__export">
                            <div>
                                {this.props.t('given')}: <br/>
                                <Consumer>{context => context.casesWins[coin.price]}</Consumer>&nbsp;
                                <span className="eth">ETH</span>
                            </div>
                        </div>
                        <div className="coin">
                            <img className="case__coin coin__img" src={coinsMap[coin.price]} alt=""/>
                            <span className="coin__value">{coin.price}</span>
                        </div>
                        {coin.price === 1.5 || coin.price === 2 ? "" :
                             <a className="button case__button" href={"/cases/" + coin.price}>{this.props.t('more')}</a>}
                        <Consumer>
                            {context => <div className="case__range">
                                {this.props.t('from')} {(prizes = (context.prizes[coin.price] || [])).length
                                ? prizes[0] : "—"} до&nbsp;{prizes.length ? prizes[prizes.length - 1] : "—"}
                                <span className="eth">&nbsp;ETH</span>
                            </div>}
                        </Consumer>
                    </div>
                )}
            </div>
            <div className="accounts-container">
                <div className="accounts">
                    <div className="accounts__header">{this.props.t('24-wagers')}</div>
                    <div>
                        <Consumer>
                            {context => Utils.formatNumber(Object.keys(context.usersStats).length > 0
                                ? Object.keys(context.usersStats).map(address => context.usersStats[address].wins)
                                    .reduce((pv, cv) => pv + cv, 0) : 0)}
                        </Consumer>
                        <span className="eth eth--account"> ETH</span>
                    </div>
                    <div><Consumer>
                        {context => Object.keys(context.usersStats).length > 0
                            ? Object.keys(context.usersStats).map(address => context.usersStats[address].bets)
                                .reduce((pv, cv) => pv + cv, 0) : 0}
                    </Consumer>
                        <span className="eth eth--account"> {this.props.t('bets')}</span>
                    </div>
                </div>
                <div className="accounts">
                    <div className="accounts__header">{this.props.t('total')}</div>
                    <div>{this.state.totalWins === undefined ? '—' : this.state.totalWins}
                        <span className="eth eth--account"> ETH</span></div>
                    <div>
                        <Consumer>
                            {context => context.openedCasesCount === undefined ? '—' : context.openedCasesCount}
                        </Consumer>
                        <span className="eth eth--account"> {this.props.t('bets')}</span>
                    </div>
                </div>
            </div>
            <div className="history-container">
                <div className="history-block">
                    <div className="history-block__visor">{this.props.t('total-betting-24')}</div>
                    <table className="table table--responsive">
                        <thead className="table__thead">
                        <tr className="table__row">
                            <th className="table__cell table__cell--th table__cell--column-1">{this.props.t('rank')}</th>
                            <th className="table__cell table__cell--th table__cell--column-2">{this.props.t('address')}</th>
                            <th className="table__cell table__cell--amount table__cell--th table__cell--column-3">
                                {this.props.t('betting-amount')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <Consumer>{context =>
                            <StatsRows windowWidth={this.state.windowWidth} obj={context.usersStats} prop="bets"/>}
                        </Consumer>
                        </tbody>
                    </table>
                </div>
                <div className="history-block">
                    <div className="history-block__visor">{this.props.t('winners-24')}</div>
                    <table className="table table--responsive">
                        <thead className="table__thead">
                        <tr className="table__row">
                            <th className="table__cell table__cell--th table__cell--column-1">{this.props.t('rank')}</th>
                            <th className="table__cell table__cell--th table__cell--column-2">{this.props.t('address')}</th>
                            <th className="table__cell table__cell--amount table__cell--th table__cell--column-3">
                                {this.props.t('winning-amount')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <Consumer>{context =>
                            <StatsRows windowWidth={this.state.windowWidth} obj={context.usersStats} prop="wins"/>}
                        </Consumer>
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>;
    }
}

export default withTranslation()(Main)

interface IMain {
    contract: Contract
}

interface IMainState {
    totalWins: undefined | number
    caseOpenings: { price: number, openings: number }[]
    windowWidth: number
}

interface T extends IMain, WithTranslation {
}
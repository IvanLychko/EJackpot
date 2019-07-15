import * as React from 'react';
import {coinsMap, IOpenedCaseEvent} from "../../shared/types";
import Contract from "web3/eth/contract";
import {WithTranslation, withTranslation} from "react-i18next";
import Utils from "../../utils";
import Ethereum from "../../ethereum";

class Profile extends React.PureComponent<T> {
    state: IProfileState = {bets: [], tab: "stats", profit: 0, count: 0};

    componentDidMount(): void {
        this.props.contract.getPastEvents('CaseOpened', {filter: {user: this.props.address}, fromBlock: 0})
            .then((events: IOpenedCaseEvent[]) => this.setState({
                bets: events.reverse().map(e => ({
                    bet: e.returnValues.amount / 10 ** 18,
                    prize: e.returnValues.prize / 10 ** 18
                }))
            })).catch(console.error);
        Ethereum.callContract(this.props.contract, 'referralStats', [this.props.address])
            .then(result => this.setState({
                profit: parseInt(result.profit.toString()) / 10 ** 18,
                count: parseInt(result.count)
            })).catch(console.error);
    }

    render() {
        return (
            <div className="profile">
                <h2 className="profile__header">{this.props.t('profile')}</h2>
                <div className="breadcrumbs">
                    <a className="breadcrumbs__link" href="/">{this.props.t('all-cases')}</a>
                    <span className="breadcrumbs__sep">&#8249;</span>
                    <a className="breadcrumbs__link">{this.props.t('profile')}</a>
                </div>
                <div className="profile__container">
                    <div className="profile__photo"/>
                    <div className="profile__info">
                        <h3 className="profile__h3">{this.props.address}</h3>
                        <div>{this.props.t('opened')} {this.props.t('cases2')}: <span
                            className="profile__value">{this.state.bets.length} {this.props.t('pieces')}</span></div>
                        <div>
                            {this.props.t('opened')} {this.props.t('sum')}:&nbsp;
                            <span
                                className="profile__value">
                                {Utils.formatNumber(this.state.bets.map(b => b.prize).reduce((pv, cv) => pv + cv, 0))}&nbsp;
                                <span className="eth">ETH</span>
                        </span>
                        </div>
                    </div>
                </div>
                <div className="profile__links">
                    <a className="profile__link-item" style={{cursor: "pointer"}}
                       onClick={() => this.setState({tab: "stats"})}>{this.props.t('stats')}</a>
                    <a className="profile__link-item" style={{cursor: "pointer"}}
                       onClick={() => this.setState({tab: "referral"})}>{this.props.t('referral')}</a>
                </div>
                <div className="profile__table">
                    <table className="table table--fixed">
                        {this.state.tab === "stats"
                            ? <React.Fragment>
                                <thead>
                                <tr>
                                    <th className="table__cell table__cell--th2">{this.props.t('bet')}</th>
                                    <th className="table__cell table__cell--th2">{this.props.t('result')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.bets.slice(0, 30).map((bet, i) =>
                                    <tr key={i}>
                                        <td className="table__cell table__cell--coin">
                                            <div className="coin coin--small">
                                                <img className="coin__img" src={coinsMap[bet.bet]} alt=""/>
                                                <span className="coin__value">{bet.bet}</span>
                                            </div>
                                        </td>
                                        <td className="table__cell table__cell--coin">
                                            <div className="coin coin--small">
                                                <img className="coin__img" src={coinsMap[bet.bet]} alt=""/>
                                                <span className="coin__value">{bet.prize}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </React.Fragment>
                            : <tbody>
                            <tr>
                                <td colSpan={2} className="table__cell--th2"
                                    style={{textAlign: "center", padding: "30px 0px 0px 15px"}}>
                                    {this.props.t('referral-title')}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="table__cell" style={{textAlign: "center"}}>
                                    {this.props.t('referral-description1')}
                                    <br/>
                                    <br/>
                                    <b>{this.props.t('referral-description2')}</b>
                                    {this.props.t('referral-description3')}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="table__cell table__cell--coin">
                                    <input type="text" readOnly
                                           style={{width: "50%", textAlign: "center", padding: "10px 0 10px 0"}}
                                           value={`${window.location.origin}?ref=${this.props.address}`}
                                    onClick={(e) => (e.target as HTMLInputElement).select()}/>
                                </td>
                            </tr>
                            <tr>
                                <td className="table__cell table__cell--coin">
                                    {this.props.t('referral-profit')} {this.state.profit} ETH
                                </td>
                                <td className="table__cell table__cell--coin">
                                    {this.state.count} {this.props.t('people')}
                                </td>
                            </tr>
                            </tbody>
                        }
                    </table>
                </div>
            </div>
        )
    }
}

export default withTranslation()(Profile)

interface IProfile {
    address: string
    contract: Contract
}

interface IProfileState {
    bets: { bet: number, prize: number }[]
    tab: 'stats' | 'referral'
    profit: number
    count: number
}

interface T extends IProfile, WithTranslation {
}
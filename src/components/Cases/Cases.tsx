import * as React from 'react'
import Popup from 'reactjs-popup'
import MetaMaskPopup from '../Popups/MetaMask'
import lottery from '../../assets/img/lottery.png'
import config from "../../config";
import {AnyObject, coinsMap} from "../../shared/types";
import {consumer as Consumer} from "../Provider";
import PromiEvent from "web3/promiEvent";
import {TransactionReceipt} from 'web3-core';
import {WithTranslation, withTranslation} from "react-i18next";
import Utils from '../../utils';

class Cases extends React.PureComponent<T> {
    state: ICasesState = {price: this.props.price, prize: undefined, popup: false};

    private openCase() {
        this.setState({popup: true});
        if (!window.ethereum) return;
        (document.getElementsByClassName('case-rookie__button--open')[0] as HTMLAnchorElement).style.display = "none";

        this.props.openCase((this.props.price * 10 ** 18).toString(), (_this: PromiEvent<TransactionReceipt>) =>
            _this.on("transactionHash", () => {
                this.setState({price: undefined, prize: undefined, popup: false});
                (document.querySelector('#flip-toggle') as HTMLDivElement).classList.toggle('loading');
            }).then(receipt => {
                const data = this.props.decodeLog(receipt);
                console.log(data);
                this.setState({price: this.props.price, prize: parseInt(data.prize.toString()) / 10 ** 18});
                (document.querySelector('#flip-toggle') as HTMLDivElement).classList.toggle('loading');
                (document.getElementsByClassName('case-rookie__button--open')[0] as HTMLAnchorElement).style.display = "block";
            }).catch(e => {
                this.setState({popup: false});
                (document.getElementsByClassName('case-rookie__button--open')[0] as HTMLAnchorElement).style.display = "block";
                console.error(e);
            }))
    }

    private closePopup() {
        this.setState({popup: false});
    }

    render() {
        let prizes: number[];
        return <React.Fragment>
            <div id="open" className="dark-mode"/>
            <section className="case-rookie">
                <h2 className="case-rookie__header">{this.props.t('case').toUpperCase()} "{this.props.t(config.coins.find(c => c.price == this.props.price)!.name)}"</h2>
                <div className="breadcrumbs">
                    <a className="breadcrumbs__link" href="/">{this.props.t('all-cases')}</a>
                    <span className="breadcrumbs__sep">&#8249;</span>
                    <a className="breadcrumbs__link">
                        {this.props.t('case').toUpperCase()} "{this.props.t(config.coins.find(c => c.price == this.props.price)!.name)}"
                    </a>
                </div>

                <div className="case-rookie__container">
                    <div className="case-rookie__item case-rookie__item--lottery">
                        <div className="case-rookie__lottery">
                            <div className="case-rookie__lottery-result">
                                <div className="flip-container" id="flip-toggle">
                                    <div className="flipper">
                                        <div className="coin coin--big front">
                                            <img className="coin__img" src={coinsMap[this.props.price]}
                                                 alt="Окно лотереи"/>
                                            <span className="coin__value">{this.state.prize || this.state.price}</span>
                                        </div>
                                        <div className="coin coin--big back">
                                            <img className="coin__img" src={coinsMap[this.props.price]}
                                                 alt="Окно лотереи"/>
                                            <span className="coin__value">{this.state.prize}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <img className="case-rookie__lottery-background" src={lottery}
                                 alt="Окно лотереи"/>

                            <div className="case-rookie__button-panel">
                                <a onClick={this.openCase.bind(this)} style={{cursor: "pointer"}}
                                   className="case-rookie__button case-rookie__button--open button">
                                    {this.props.t('open-for')}&nbsp;
                                    <span className="case-rookie__value">{this.props.price} ETH</span>
                                </a>
                                <a className="case-rookie__button case-rookie__button--close button">забрать</a>
                            </div>
                        </div>
                    </div>
                    <div className="case-rookie__item case-rookie__item--info">
                        <div className="lottery-info">
                            <div className="lottery-info__item">
                                <div className="lottery-info__header">{this.props.t('contains')}</div>
                                <div>{this.props.t('from')}&nbsp;
                                    <Consumer>{context =>
                                        (prizes = (context.prizes[this.props.price] || [])).length ? prizes[0] : "—"
                                    }</Consumer>&nbsp;
                                    <span className="eth">ETH</span>&nbsp;
                                    – <Consumer>{() => prizes.length ? prizes[prizes.length - 1] : "—"}</Consumer>&nbsp;
                                    <span className="eth">ETH</span></div>
                            </div>
                            <div className="lottery-info__item">
                                <div className="lottery-info__header">{this.props.t('given')}</div>
                                &nbsp;
                                <div><Consumer>{context => context.casesWins[this.props.price]}</Consumer>
                                    <span className="eth">&nbsp;ETH</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="case-rookie">
                <h2 className="case-rookie__header">{this.props.t('case-prizes')}</h2>
                <div className="case-rookie__container case-rookie__container--coins">
                    <Consumer>{() => prizes.map((prize, i) =>
                        <div key={i} className="case-rookie__coin">
                            <div className="coin">
                                <img className="coin__img" src={coinsMap[this.props.price]} alt=""/>
                                <span
                                    className="coin__value coin__variant">{Utils.formatNumber(prize)}</span>
                            </div>
                        </div>
                    )}</Consumer>
                </div>
            </section>
            <Popup open={this.state.popup} onClose={() => this.setState({popup: false})}>
                <MetaMaskPopup
                    closePopup={this.closePopup.bind(this)}
                    title={window.ethereum ? this.props.t('confirmation') : this.props.t('no-metamask')}
                    text={window.ethereum ? this.props.t('confirm-metamask') : this.props.t('install-metamask')}
                />
            </Popup>
        </React.Fragment>
    }
}

export default withTranslation()(Cases)

interface ICasesState {
    price: number | undefined
    prize: number | undefined
    popup: boolean
}

interface ICases {
    openCase: ((value: string, callback: (_this: PromiEvent<TransactionReceipt>) => Promise<void>) => PromiEvent<TransactionReceipt>)
    decodeLog: (receipt: AnyObject) => AnyObject
    price: number
    address: string
}

interface T extends ICases, WithTranslation {
}
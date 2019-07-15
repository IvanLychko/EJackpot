import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import Popup from 'reactjs-popup'
import MetaMaskPopup from './Popups/MetaMask'
import logo from '../assets/img/logo/logo.png';
import en from '../assets/img/languages/en.svg';
import ru from '../assets/img/languages/ru.svg';
import ch from '../assets/img/languages/ch.svg';
import {consumer as Consumer} from "./Provider";
import {coinsMap} from "../shared/types";

const languages: { [k: string]: { icon: string, name: string } } =
    {en: {icon: en, name: "English"}, ru: {icon: ru, name: "Русский"}
    //, ch: {icon: ch, name: "中國"}
  };

class Header extends React.PureComponent<T> {
    state: IHeaderState = {popup: false};

    private changeLanguage(locale: string) {
        document.getElementById('js-languages-current')!.className = `languages__current languages__current--${locale}`;
        this.props.i18n.changeLanguage(locale).then(() => {
            document.getElementById('js-languages-list')!.classList.toggle('languages__list--display');
            window.localStorage.setItem('locale', locale);
        }).catch(console.error)
    }

    private togglePopup() {
        this.setState({popup: !this.state.popup});
    }

    render() {
        const locale = window.localStorage.getItem('locale') || 'ru';
        return (
            <React.Fragment>
                <header className="header">
                    <a href="/"><img className="logo" src={logo} alt="логотип E-Jackpot"/></a>
                    <nav className="nav">
                        <a className="nav__link nav__link--home" href="/">{this.props.t('cases')}</a>
                        <a className="nav__link nav__link--about" href={"/about"}>{this.props.t('about')}</a>
                        <a className="nav__link nav__link--question" href={"/faq"}>FAQ</a>
                        <a className="nav__link nav__link--shield" href={"/guarantees"}>{this.props.t('guarantees')}</a>

                        {this.props.address
                            ? <a className="nav__link nav__link--wallet" href={"/profile"}>
                                {`${this.props.address.slice(0, 3)}...${this.props.address.slice(this.props.address.length - 4)}`}
                            </a>
                            : <a className="nav__link nav__link--fox button button--header" style={{cursor: "pointer"}}
                                 onClick={window.ethereum ? this.props.authorize : this.togglePopup.bind(this)}>
                                {this.props.t('login')}
                            </a>
                        }

                        <div className="languages">
                            <div id="js-languages-current"
                                 className={"languages__current languages__current--" + locale}
                                 onClick={() => document.getElementById('js-languages-list')!.classList.toggle('languages__list--display')}
                            />
                            <ul id="js-languages-list" className="languages__list">
                                {Object.keys(languages).map((lang, i) =>
                                    <li key={i} className="languages__item">
                                        <a href="#" className="languages__link"
                                           onClick={() => this.changeLanguage(lang)}>
                                            <img src={languages[lang].icon} alt="" className="languages__image"/>
                                            <span style={{marginLeft: "5px"}}>{languages[lang].name}</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </header>
                <div className="prizes">
                    <div className="prizes__container-block">
                        <div className="prizes-block">
                            <div className="prizes-block__text">{this.props.t('users')}</div>
                            <div className="prizes-block__count">
                                <Consumer>
                                    {context => context.usersCount === undefined ? '—' : context.usersCount}
                                </Consumer>
                            </div>
                        </div>
                        <div className="prizes-block">
                            <div
                                className="prizes-block__text">{this.props.t('opened')}&nbsp;{this.props.t('cases2')}</div>
                            <div className="prizes-block__count">
                                <Consumer>
                                    {context => context.usersCount === undefined ? '—' : context.openedCasesCount}
                                </Consumer>
                            </div>
                        </div>
                    </div>
                    <div className="prizes-live">
                        <div className="prizes-live__online">LIVE</div>
                        <div>{this.props.t('prizes')}</div>
                    </div>
                    <div className="prizes-board">
                        <Consumer>
                            {context => context.openedCases.slice(0, 8).map((coin, i) =>
                                <div key={i} className="prizes-board__item">
                                    <div className="coin coin--small">
                                        <img className="coin__img" src={coinsMap[coin.amount]} alt=""/>
                                        <span className="coin__value">{coin.prize}</span>
                                    </div>
                                </div>
                            )}
                        </Consumer>
                    </div>
                </div>
                <Popup open={this.state.popup} onClose={() => this.setState({popup: false})}>
                    <MetaMaskPopup
                        closePopup={this.togglePopup.bind(this)}
                        title={this.props.t('no-metamask')}
                        text={this.props.t('install-metamask')}
                    />
                </Popup>
            </React.Fragment>
        )
    }
}

export default withTranslation()(Header);

interface IHeader {
    address: string
    authorize: () => void
}

interface IHeaderState {
    popup: boolean
}

interface T extends IHeader, WithTranslation {
}

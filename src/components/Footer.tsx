import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import logoWhite from '../assets/img/logo/logo-white.png';
import dappRadar from '../assets/img/partners/dappradar.png';
import dappVolume from '../assets/img/partners/dappvolume.png';
import stateOfDrafs from '../assets/img/partners/stateofdrafs.png';
import S from '../assets/img/partners/s.png';
import goDapp from '../assets/img/partners/godapp.png';
import dapp from '../assets/img/partners/dapp.png';

class Footer extends React.PureComponent<WithTranslation> {
    render() {
        return <footer className="footer">
            <div className="footer__container">
                <div><img className="logo logo--footer" src={logoWhite} alt="логотип E-Jackpot"/></div>
                <div className="nav">
                    <a className="nav__link" href="/">{this.props.t('cases')}</a>
                    <a className="nav__link" href={"/faq"}>FAQ</a>
                    <a className="nav__link" href={"/guarantees"}>{this.props.t('guarantees')}</a>
                    <a className="nav__link" href={"/about"}>{this.props.t('support')}</a>
                    <div className="nav__link footer-feedback">
                        <a style={{color: "white"}} href={"/feedback"}>{this.props.t('feedback')}</a>
                        <ul>
                            <li><a target="_blank" href="https://vk.com/ejackpoteth">VK</a></li>
                            <li><a target="_blank" href="https://t.me/E_Jackpot">Telegram</a></li>
                            <li><a target="_blank" href="https://twitter.com/e_jackpot">Twitter</a></li>
                            <li><a target="_blank" href="#">Facebook</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer__copy">
                <div>Copyright &copy; 2019 E-JACKPOT. {this.props.t('rights')}</div>
                <div><a style={{color: "white"}} href={"/agreement"}>{this.props.t('auth-agreement')}</a></div>
            </div>
            <br/>
            <br/>
            <div className="partners">
                <a href="https://dappradar.com/app/1612/e-jackpot" target="_blank">
                    <img style={{marginRight: "8px"}} src={dappRadar} alt=""/>
                </a>
                <a href="https://www.stateofthedapps.com/dapps/e-jackpot" target="_blank">
                    <img style={{marginRight: "8px"}} src={stateOfDrafs} alt=""/>
                </a>
                <a href="https://superdapps.com/dapp/e-jackpot-cc/" target="_blank">
                    <img style={{marginRight: "8px"}} src={S} alt=""/>
                </a>
                <a href="https://www.dapp.com/ru/dapp/e-jackpot" target="_blank">
                    <img style={{marginRight: "8px"}} src={dapp} alt=""/>
                </a>
            </div>
        </footer>
    }
}

export default withTranslation()(Footer);
import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

class FAQ extends React.PureComponent<WithTranslation> {
    render() {
       return <section className="case-rookie">
           <h2 className="case-rookie__header">FAQ</h2>
            <ul>
                <li>
                    <p>{this.props.t("how-it-works")}</p>
                    <span>{this.props.t("how-it-works-ans")}</span>
                </li>
                <li>
                    <p>{this.props.t("how-to-play")}</p>
                    <span>{this.props.t("how-to-play-ans")}</span>
                </li>
                <li>
                    <p>{this.props.t("how-to-play-metamask")}</p>
                    <ol>
                        <li>
                            {this.props.t("how-to-play-metamask-ans1")}&nbsp;
                            <a href="https://metamask.io" style={{color:"white"}}>https://metamask.io</a>
                        </li>
                        <li>{this.props.t("how-to-play-metamask-ans2")}</li>
                        <li>{this.props.t("how-to-play-metamask-ans3")}</li>
                        <li>{this.props.t("how-to-play-metamask-ans4")}</li>
                        <li>{this.props.t("how-to-play-metamask-ans5")}</li>
                    </ol>
                </li>
                <li>
                    <p>{this.props.t("why-cant-bet")}</p>
                    <span>{this.props.t("why-cant-bet-ans")}</span>
                </li>
                <li>
                    <p>{this.props.t("how-to-ref")}</p>
                    <ol>
                        <li>{this.props.t("how-to-ref-ans")}</li>
                        <li>{this.props.t("how-to-ref-ans2")}</li>
                        <li>{this.props.t("how-to-ref-ans3")}</li>
                    </ol>
                </li>
                <li>
                    <p>{this.props.t("bet-no-result")}</p>
                    <span>{this.props.t("bet-no-result-ans1")}</span>
                    <span>{this.props.t("bet-no-result-ans2")}</span>
                    <ol>
                        <li>{this.props.t("bet-no-result-ans3")}</li>
                        <li>{this.props.t("bet-no-result-ans4")}</li>
                        <li>{this.props.t("bet-no-result-ans5")}</li>
                    </ol>
                    <span>{this.props.t("bet-no-result-ans6")}</span>
                </li>
                <li>
                    <p>{this.props.t("contact")}</p>
                    <span>{this.props.t("contact-ans")}</span>
                </li>
            </ul>
       </section>
    }
}

export default withTranslation()(FAQ);
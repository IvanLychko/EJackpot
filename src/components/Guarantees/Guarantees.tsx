import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

class Guarantees extends React.PureComponent<WithTranslation> {
    render() {
        return <section className="case-rookie">
            <h2 className="case-rookie__header">{this.props.t("guarantees")}</h2>
            <div style={{paddingLeft: "15px"}}>
                <p>{this.props.t("why-trust")}</p>
                <ol>
                    <li>{this.props.t("smart-contract")}</li>
                    <li>{this.props.t("ethereum")}</li>
                    <li>{this.props.t("no-influence")}</li>
                    <li>{this.props.t("no-register")}</li>
                    <li>{this.props.t("no-private-keys")}</li>
                    <li>{this.props.t("100-withdrawal")}</li>
                </ol>
                <p>{this.props.t("smart-contract-link")} — <a href="https://etherscan.io/address/0x252B0789De92CF785a1E5855d8aC6C9ca641d7F8#code">Etherscan</a></p>
                <p>{this.props.t("github")} — <a href="https://github.com/IvanLychko/EJackpot">EJackpot</a></p>
            </div>
        </section>
    }
}

export default withTranslation()(Guarantees);

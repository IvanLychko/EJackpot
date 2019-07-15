import * as React from 'react'
import {WithTranslation, withTranslation} from 'react-i18next';

class Agreement extends React.PureComponent<WithTranslation> {
    render() {
        return <section className="case-rookie">
            <h2 className="case-rookie__header">{this.props.t("agreement")}</h2>
            <div style={{paddingLeft: "15px"}}>
                <p>{this.props.t("agreement-text")}</p>
            </div>
        </section>
    }
}

export default withTranslation()(Agreement)
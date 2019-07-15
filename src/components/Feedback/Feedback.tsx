import * as React from 'react'
import {WithTranslation, withTranslation} from 'react-i18next';

class Feedback extends React.PureComponent<WithTranslation> {
    render() {
        return <section className="case-rookie">
            <h2 className="case-rookie__header">{this.props.t("feedback")}</h2>
            <div style={{paddingLeft: "15px"}}>
                <p>{this.props.t("feedback-text")}</p>
            </div>
        </section>
    }
}

export default withTranslation()(Feedback)
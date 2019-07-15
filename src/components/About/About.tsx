import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

class About extends React.PureComponent<WithTranslation> {
    render() {
        return <section className="case-rookie">
            <h2 className="case-rookie__header">{this.props.t("about")}</h2>
            <div style={{paddingLeft: "15px"}}>
                <p>{this.props.t("fair-game")}</p>
                <p>{this.props.t("what-is")}</p>
                <p>{this.props.t("questions")}</p>
            </div>
        </section>
    }
}

export default withTranslation()(About);
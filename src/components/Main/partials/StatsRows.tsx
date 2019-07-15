import * as React from 'react';
import {AnyObject} from "../../../shared/types";
import place1 from '../../../assets/img/place-1.png';
import place2 from '../../../assets/img/place-2.png';
import place3 from '../../../assets/img/place-3.png';
import Utils from "../../../utils";

const placesMap: AnyObject = {1: place1, 2: place2, 3: place3};

export default class StatsRows extends React.PureComponent<{ obj: AnyObject, prop: string, windowWidth: number }> {
    render() {
        const {obj, prop} = this.props;
        return <React.Fragment>
            {Object.keys(obj)
                .sort((a, b) => obj[a][prop] < obj[b][prop] ? 1 : (obj[a][prop] > obj[b][prop] ? -1 : 0))
                .slice(0, 3).map((key, i) =>
                    <tr className="table__row" key={i}>
                        <td className="table__cell" data-label="Ranking">
                            <img src={placesMap[i + 1]} alt={"place-" + (i + 1)}/>
                        </td>
                        <td className="table__cell" data-label="Address">
                            <a target="_blank" className="table__text" href={`https://etherscan.io/address/${key}`} style={{color: "white"}}>
                                {this.props.windowWidth > 500 ? key : `${key.slice(0, 3)}...${key.slice(key.length - 4)}`}
                            </a>
                        </td>
                        <td className="table__cell table__cell--amount"
                            data-label="Betting Amount">{prop === 'wins'
                            ? Utils.formatNumber(obj[key][prop])
                            : obj[key][prop]
                        }</td>
                    </tr>
                )}
        </React.Fragment>
    }
}
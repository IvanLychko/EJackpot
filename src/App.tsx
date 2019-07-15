import * as React from 'react';
import Web3 from 'web3';
import * as qs from 'querystring'
import './assets/sass/style.scss'
import Header from "./components/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer";
import config from "./config";
import ContractABI from './abi/BangCash.json';
import {Route, Switch} from "react-router";
import Profile from "./components/Profile/Profile";
import ProviderComponent from "./components/Provider";
import Cases from "./components/Cases/Cases";
import {AbiItem, AbiInput} from 'web3-utils';
import Contract from "web3/eth/contract";
import {AnyObject} from "./shared/types";
import FAQ from "./components/Faq/FAQ";
import Guarantees from "./components/Guarantees/Guarantees";
import About from "./components/About/About";
import Feedback from "./components/Feedback/Feedback";
import Agreement from "./components/Agreement/Agreement";

const emptyAddress = "0x0000000000000000000000000000000000000000";

export default class App extends React.Component {
    private readonly web3: Web3 = new Web3(window.web3
        ? window.web3.currentProvider
        : new Web3.providers.HttpProvider("https://rinkeby.infura.io"),
        undefined, {transactionConfirmationBlocks: 1});
    state: IAppState = {address: "", contract: undefined, blockNumber: 0};

    componentDidMount(): void {
        const referrer = qs.parse(window.location.search.replace('?', '')).ref;
        if (referrer) window.localStorage.setItem("ref", referrer as string);
        if (window.ethereum) window.ethereum.on('accountsChanged',
            (accounts: string[]) => this.setState({address: accounts[0]}));
        Promise.all([
            this.web3.eth.getBlockNumber(),
            this.web3.eth.getAccounts()
        ]).then(([bn, addresses]) => this.setState({
            address: addresses[0],
            blockNumber: bn,
            contract: new this.web3.eth.Contract(ContractABI.abi as AbiItem[], config.contract)
        })).catch((err: Error) => {
            console.error(err);
            return alert("Error on loading page");
        });
    }

    private authorize(): Promise<string> {
        return this.state.address ? Promise.resolve(this.state.address) : window.ethereum.enable()
            .then((accounts: string[]) => {
                if (window.ethereum.networkVersion !== config.network) {
                    alert('This application requires the main network, please switch it in your MetaMask UI.');
                    return Promise.reject("invalid network");
                }
                this.setState({address: accounts[0]});
                return accounts[0];
            }).catch(console.error);
    }

    private openCase(value: string, callback: (_this: any) => Promise<void>): any {
        const ref = window.localStorage.getItem("ref");
        return this.authorize().then(from => callback(this.state.contract!.methods.play(ref || emptyAddress)
            .send({from, to: config.contract, value, gas: 600000})))
    }

    private decodeLog(receipt: AnyObject): AnyObject {
        const eventAbi = ContractABI.abi.find(item => item.name === "CaseOpened" && item.type === "event")!.inputs;
        const {data, topics} = receipt.events.CaseOpened.raw;
        return this.web3.eth.abi.decodeLog((eventAbi as AbiInput[]), data, topics as string[])
    }

    render() {
        return (this.state.contract
            ? <ProviderComponent contract={this.state.contract} blockNumber={this.state.blockNumber}>
                <Header address={this.state.address} authorize={this.authorize.bind(this)}/>
                <Switch>
                    <Route exact path="/" render={() => this.state.contract
                        ? <Main contract={this.state.contract}/> : ""}/>
                    {this.state.address ? <Route exact path="/profile" render={() =>
                        <Profile contract={this.state.contract as Contract} address={this.state.address}/>}/> : ""}
                    <Route exact path="/cases/:price" render={props =>
                        props.match.params.price === '1.5' || props.match.params.price === '2' ? "" :
                            <Cases
                                openCase={this.openCase.bind(this)}
                                decodeLog={this.decodeLog.bind(this)}
                                price={props.match.params.price}
                                address={this.state.address as string}
                            />
                    }/>
                    <Route exact path="/faq" component={FAQ}/>
                    <Route exact path="/guarantees" component={Guarantees}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/feedback" component={Feedback}/>
                    <Route exact path="/agreement" component={Agreement}/>
                </Switch>
                <Footer/>
            </ProviderComponent>
            : "Loading");
    }
}

interface IAppState {
    address: string
    contract: undefined | Contract
    blockNumber: number
}

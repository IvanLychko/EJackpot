module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*",
            gas: 4600000,
            gasPrice: 0
        },
        rinkeby: {
            provider: () => new HDWalletProvider("", "https://rinkeby.infura.io/v3/06f89295e1a449199c214abd79efa954"),
            network_id: 4,
            gas: 4600000,
            gasPrice: 20000000000
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
const Ownable = artifacts.require("Ownable");
const DateTime = artifacts.require("DateTime");
const BangCash = artifacts.require("BangCash");

module.exports = (deployer) => {
    deployer.deploy(Ownable)
        .then(() => deployer.deploy(DateTime))
        .then(() => deployer.deploy(BangCash, DateTime.address))
};


pragma solidity 0.5.8;

/*
    Contract is needed only for test. Should not be deployed.
*/
contract DummyContract {
    function() external payable {}
    function bangCashCall(address payable bangCash) external {
        bangCash.transfer(1);
    }
}

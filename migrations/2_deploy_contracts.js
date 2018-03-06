var FlagFactory = artifacts.require("./FlagFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(FlagFactory);
};

var User = artifacts.require('User');
var ShastaMarket = artifacts.require('ShastaMarket');

module.exports = function(deployer) {
 deployer.deploy(User, ShastaMarket.address);
};
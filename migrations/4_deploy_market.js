var ShastaMarket = artifacts.require('ShastaMarket');
var User = artifacts.require('User');

module.exports = function(deployer) {
 deployer.deploy(ShastaMarket);
};
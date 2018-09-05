var SharedMap = artifacts.require('SharedMap');
var SharedMapPrice = artifacts.require('SharedMapPrice');
var ShastaMarket = artifacts.require('ShastaMarket');
var User = artifacts.require('User');

module.exports = function(deployer) {
 deployer.deploy(SharedMap, User.address);
 deployer.deploy(SharedMapPrice, User.address, ShastaMarket.address);
};
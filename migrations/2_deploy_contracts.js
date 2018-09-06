var SharedMapPrice = artifacts.require('shasta-os/SharedMapPrice');
var User = artifacts.require('shasta-os/User');
var ShastaMarket = artifacts.require('shasta-os/ShastaMarket');

module.exports = function(deployer) {
  deployer.deploy(ShastaMarket).then(function() {
    return deployer.deploy(User, ShastaMarket.address).then(function() {
      return deployer.deploy(SharedMapPrice, User.address, ShastaMarket.address);
    })
  })
};
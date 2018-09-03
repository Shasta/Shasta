var SharedMap = artifacts.require('SharedMap');
var User = artifacts.require('User');

module.exports = function(deployer) {
 deployer.deploy(SharedMap, User.address);
};
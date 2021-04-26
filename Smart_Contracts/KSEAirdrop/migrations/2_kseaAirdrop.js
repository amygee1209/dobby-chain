const KSEAirdrop = artifacts.require("KSEAirdrop");
const KSEAToken = artifacts.require("KSEAToken");

module.exports = function(deployer) {
  deployer.then(function() {
    return deployer.deploy(KSEAToken, 10000, "KSEA DOBBY Token", "DOBBY");
  }).then(function() {
    return deployer.deploy(KSEAirdrop, KSEAToken.address);
  });
};

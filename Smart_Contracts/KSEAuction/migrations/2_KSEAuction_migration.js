const KSEAToken = artifacts.require("KSEAToken");
const KSEAirdrop = artifacts.require("KSEAirdrop");
const AuctionFactory = artifacts.require("AuctionFactory")
module.exports = function(deployer) {
    deployer.then(function() {
        return deployer.deploy(KSEAToken, 10000, "KSEA DOBBY Token", "DOBBY");
      }).then(function() {
        return deployer.deploy(AuctionFactory);
      }).then(function () {
        return deployer.deploy(KSEAirdrop, KSEAToken.address)
      });
};

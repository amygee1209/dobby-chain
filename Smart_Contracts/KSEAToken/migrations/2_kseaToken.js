const KSEAToken = artifacts.require("KSEAToken");

module.exports = function(deployer) {
    deployer.deploy(KSEAToken, 10000, "KSEA DOBBY Token", "DOBBY");
};
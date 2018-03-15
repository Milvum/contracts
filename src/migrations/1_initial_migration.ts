// tslint:disable-next-line:no-reference
/// <reference path="../typings/truffle-types.d.ts" />

const Migrations = artifacts.require('./Migrations.sol');

module.exports = (deployer) => {
  deployer.deploy(Migrations);
};

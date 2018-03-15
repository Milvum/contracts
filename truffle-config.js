module.exports = {
  networks: {
    development: {
      host: process.env.npm_config_web3_host || "127.0.0.1",
      port: process.env.npm_config_web3_port || '8545',
      network_id: "9351", // Match any network id
      gas: 4712388
    }
  }
};

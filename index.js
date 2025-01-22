const { ClusterManager } = require('discord-hybrid-sharding');
const clusters = require("./cluster-names.js")
const c = require("colors");
const manager = new ClusterManager(`${__dirname}/MiniWorldBOT.js`, {
    totalShards: 2, // or numeric shard count
    /// Check below for more options
    shardsPerClusters: 1, // 2 shards per process
    totalClusters: 2,
    mode: 'process', // you can also choose "worker"
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => console.log(c.yellow(`Launched Cluster [${cluster.id}]: ${clusters[cluster.id]}`)));
manager.spawn({ timeout: -1 });
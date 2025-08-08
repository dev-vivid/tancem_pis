module.exports = {

  apps: [
  {
    name: 'tancem_pis_express',
    script: './dist/src/index.js',
    node_args: '-r ts-node/register -r tsconfig-paths/register',
    env: {
      "TS_NODE_BASEURL": "./dist/src"
    }

  },
]
};

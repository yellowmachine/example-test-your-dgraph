const {context: C, w, SHOW_QUIT_MESSAGE} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

SHOW_QUIT_MESSAGE.v = true

function test(){
    npm().run('tap');
}

const {up, down} = docker({name: "my-container-dgraph-v13", 
                           image: "dgraph/standalone:master", 
                           port: "8080"
                        })

const dql = dgraph(config)

async function main() {
    const run = C({up, dql, test, down}, {w: w(["./tests/*.js", "./schema/*.*"])});
    await run(`up[
                      w[ dql? | test ]
                      down`
    );
}

main()


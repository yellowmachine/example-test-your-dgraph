const {compile, w, SHOW_QUIT_MESSAGE} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

SHOW_QUIT_MESSAGE.v = true

function test(){
    npm().run('tap');
}

const {up, down} = docker({name: "my-container-dgraph-v17", 
                           image: "dgraph/standalone:master", 
                           port: "8080"
                        })

const dql = dgraph(config)

async function main() {
    const t = `up[
                    w'[ dql? | test ]
                    down
                 ]`;
    const f = compile(t, {
                            namespace: {up, dql, test, down}, 
                            plugins: {w: w(["./tests/*.js", "./schema/*.*"])}
        });
    await f();
}

main()


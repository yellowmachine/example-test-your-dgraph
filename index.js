const {pipe, watch} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

function test(){
    npm().run('test');
}

const {up, down} = docker({name: "my-container-dgraph-v6", 
                           image: "dgraph/standalone:master", 
                           port: "8080", 
                           waitOn: "http://localhost:8080"
                        })

async function main(){
    let ok = await pipe(up)
    if(!ok){
        console.log("No se ha podido comenzar la imagen de docker")
    }
    else{
        await watch({files: ["./tests/*.js", "./schema/*.*"], 
                     quit: 'q', 
                     f: async (quit)=>{
            ok = await pipe(dgraph(config), test) 
            //if(!ok)   
            //    quit()
        }})
        await pipe(down)
    }
}

main()


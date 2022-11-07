const {pipe, watch} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')


function test(){
    npm().run('test');
}

const {up, down} = docker({name: "my-container-dgraph-v5", 
                           image: "dgraph/standalone:master", 
                           port: "8080", 
                           waitOn: "http://localhost:8080"
                        })

async function main(){
    let ok = await pipe(up)

    if(ok){
        await watch({files: ["./tests/*.js", "./schema/*.graphql"], quit: 'q', f: async (quit)=>{
            ok = await pipe(dgraph('http://localhost:8080/admin', 
                                   './schema/schema.graphql'), 
                            test
                        ) 
            //if(!ok)   
            //    quit()
        }})
        await pipe(down)
    }else{
        console.log("No se ha podido comenzar la imagen de docker")
    }
}

main()


const { GraphQLClient, gql } = require('graphql-request')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const config = require("../config.js")

async function dropData(){
    await axios.post(`${config.url}:${config.port}` + "/alter", {drop_op: "DATA"})
}

function token(claims){
    return jwt.sign({ [config.claims]: claims }, config.secret);
}

function tokenizedGraphQLClient(token){
    return new GraphQLClient(`${config.url}:${config.port}` + "/graphql", { headers: {Authorization: `Bearer ${token}`} })
}

function client(claims){
    return tokenizedGraphQLClient(token(claims))
}

module.exports = {
    dropData,
    gql,
    client
}
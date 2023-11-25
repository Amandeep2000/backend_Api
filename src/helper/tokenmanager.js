
const invalidatedTokens = new Set();

module.exports={
    invalidatedTokens ,
    addToInvalidatedTokens:(token)=>
    {
        invalidatedTokens.add(token);   
    },
};




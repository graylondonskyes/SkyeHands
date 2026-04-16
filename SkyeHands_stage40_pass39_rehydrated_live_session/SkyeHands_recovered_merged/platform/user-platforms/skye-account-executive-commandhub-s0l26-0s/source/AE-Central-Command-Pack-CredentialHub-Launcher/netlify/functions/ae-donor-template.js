const shared=require('./_shared/ae_donor_template'); module.exports.handler=async()=>({statusCode:200,body:JSON.stringify(shared.getTemplate())});

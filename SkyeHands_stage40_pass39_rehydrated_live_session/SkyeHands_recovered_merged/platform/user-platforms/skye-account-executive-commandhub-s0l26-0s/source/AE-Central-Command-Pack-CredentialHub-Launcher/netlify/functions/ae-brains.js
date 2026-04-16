const {getMergedAeProfile}=require('./_shared/ae_brain'); module.exports.handler=async()=>({statusCode:200,body:JSON.stringify({getMergedAeProfile:!!getMergedAeProfile})});

const {listUsageSummary}=require('./_shared/ae_state'); module.exports.handler=async()=>({statusCode:200,body:JSON.stringify(await listUsageSummary())});

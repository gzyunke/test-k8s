let Koa = require('koa');
let app = new Koa();
let Router = require('koa-router');
const koaBody = require('koa-body');
let router = new Router;

app.use(koaBody({multipart: true}));

let log4js = require('log4js');
log4js.configure('./log4js.json');
log4js.level = 'DEBUG';
let logger = log4js.getLogger('app');

// 获取服务器 ip、hostname
function getServerInfo() {
	let os = require("os");
	let ifaces = os.networkInterfaces();
	let adresses = Object.keys(ifaces).reduce(function (result, dev) {
		return result.concat(ifaces[dev].reduce(function (result, details) {
			return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
		}, []));
	});
	return `IP ${adresses}, hostname: ${os.hostname()}`
}

router.all('/', async ctx =>{
    logger.info('on index page')
	ctx.body = `index page \n\n${getServerInfo()}\n`
});

router.all('/hello/:name', async ctx =>{
	let name = ctx.params.name
    logger.info('on hello page')
	ctx.body = `hello ${name ? name : 'world'} \n\n${getServerInfo()}\n`
});

// let isDocker = false;
// try{
// 	const fs = require('fs')
// 	// 判断是否在 Docker 里面运行
// 	fs.accessSync('/.dockerenv');
// 	isDocker = true;
// 	logger.info('run in docker')
// }
// catch (e) {
// 	isDocker = false
// 	logger.info('not in docker')
// }
//
// let url = `mongodb://localhost:27017`;
// if(isDocker)
// {
// 	url = 'mongodb://mongodb-0.mongodb:27017'
// 	// url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}`
// }
//
// const MongoDB = require('mongodb')
// const mongoClient = new MongoDB.MongoClient(url);
// mongoClient.connect((err) =>{
// 	if(!err)
// 	{
// 		logger.info(`MongoDB Connected successfully`);
// 		app.context.db = mongoClient.db("testdb");
// 	}
// 	else {
// 		logger.error('connect mongo failed:%s', err)
// 	}
// });
//
//
// router.all('/regist', async ctx =>{
// 	let username = ctx.request.body.username
// 	let password = ctx.request.body.password
// 	if(!username || !password){
// 		ctx.body = {code: -1, msg: '参数不全'}
// 		return
// 	}
// 	try{
// 		await ctx.db.collection("users").updateOne({_id: username}, {'$set': {password: password}}, {upsert: true})
// 		ctx.body = {code: 0, msg: 'success'}
// 	}
// 	catch (e) {
// 		ctx.body = {code: -10, msg: `注册失败 ${e}`}
// 	}
// });
//
// router.all('/login', async ctx =>{
// 	let username = ctx.request.body.username
// 	let password = ctx.request.body.password
// 	if(!username || !password){
// 		ctx.body = {code: -1, msg: '参数不全'}
// 		return
// 	}
// 	try{
// 		let user = await ctx.db.collection("users").findOne({_id: username, password})
// 		if(user)
// 			ctx.body = user
// 		else
// 			ctx.body = {code: -10, msg: '登录失败'}
// 	}
// 	catch (e) {
// 		ctx.body = {code: -20, msg: `登录失败 ${e}`}
// 	}
// });

app.use(router.routes());

let port = process.env.PORT || 8080;
try{
	app.listen(port);
	logger.info('Server started successfully and listened on '+ port +'\n'+'http://localhost:'+port);
}catch(err){
	console.error(err);
}

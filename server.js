var tinyLr = require('tiny-lr'),
    express = require('express'),
    connectLr = require('connect-livereload'),
    serveStatic = require('serve-static'),
    serveIndex = require('serve-index'),
    path = require('path'),
    injector = require('connect-injector'),
    react = require('react-tools'),
    fs = require('fs');

module.exports = function(){

	var port=5000,
		serverPort = 35729,
		moduleDirs=[],
		ignore = [],
		dir = __dirname,
		middleware = [],
		server,
		expr=express();

	function self(){
		startLivereload();
		startServer();
		return self;
	}

	function startLivereload(){
		server = tinyLr();
		server.listen(serverPort);
	}

	function has(str, arr){
		return arr.filter(function(el){
			return str.indexOf(el) > -1; }).length >0;
	}
	function module(req){
		return has(req.url,moduleDirs) && /.js[x]?$/.test(req.url) && !has(req.url,ignore);
	}
	function hasJsx(req, res, next){
		if(module(req)){
			fs.exists(dir + req.url + 'x', function(exists){
				if(exists){
					req.url = req.url + 'x';
				}
				next();
			});
		}else {
			next();
		}
	}

	function startServer(){
		var inject = injector(function(req, res){
			return module(req);
		}, function(data, req, res, callBack){
			try{
				callBack(null, 'define(function(require, exports, module){\n' +
					react.transform(data.toString(), {harmony:true}) + '\n});');
			}catch(e){
				console.log(req.url,e);
				callBack(null, data, req, res);
			}
		});
		expr.use(hasJsx)
		.use(inject)
		.use(connectLr({port: serverPort}));

		middleware.forEach(function(m){
			expr.use(m);
		});
		return expr.use(serveStatic(dir))
					.use(serveIndex(dir))
					.listen(port);
	}
	function notify(event){
		var fileName = path.relative(dir, event.path);
		server.changed({body: {files: [fileName] } });
		return self;
	}
	self.notify=notify;
	self.port=function(_){
		if(!arguments.length) return port;
		port=_;
		return self;
	};
	self.server=function(_){
		if(!arguments.length) return expr;
		return 'server is read only';
	};
	self.middleware = function(_) {
		if(!arguments.length) return middleware;
		middleware = _;
		return self;
	};

	self.serverPort = function(_) {
		if(!arguments.length) return serverPort;
		serverPort = _;
		return self;
	};

	self.moduleDirs = function(_) {
		if(!arguments.length) return moduleDirs;
		moduleDirs = _;
		return self;
	};

	self.ignore = function(_) {
		if(!arguments.length) return ignore;
		ignore = _;
		return self;
	};

	self.dir = function(_) {
		if(!arguments.length) return dir;
		dir = _;
		return self;
	};

	return self;
};	


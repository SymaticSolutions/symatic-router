/**
 * @name Symatic Router
 * @description A simple yet extensive REST router - useful for quick API development
 * @author Symatic Solutions (http://www.symaticsolutions.com)
 * @license The MIT License (MIT)
 * @copyright Copyright(c) 2016 Symatic Solutions
 *
 * @type {exports|module.exports}
 */

var http = require('http'),
    url = require('url');

module.exports = {

    _port: 999,

    _registeredGetURLs: {},

    _registeredPostURLs:{},

    _APIVersion: 001,

    _APIFunction: '',

    config: function(conf){
        this._port = (conf.port === undefined) ? this._port : conf.port;
    },

    executeGet: function(req, res){
        if(this.registeredGetURLs[this._APIVersion] === undefined){
            res.end({responseCode: 400, responseMsg: 'Bad request', event: ''});
        }else{
            if(!(this._APIFunction in this.registeredGetURLs[this._APIVersion])){
                res.end({responseCode: 400, responseMsg: 'Bad request', event: ''});
            }else{
                this.registeredGetURLs[this._APIVersion][this._APIFunction](req, res);
            }
        }
    },

    executePost: function(req, res){
        console.log(this.registeredPostURLs);
        if(this.registeredPostURLs[this._APIVersion] === undefined){
            res.end(JSON.stringify({responseCode: 400, responseMsg: 'Bad request', event: ''}));
        }else{
            if(!(this._APIFunction in this.registeredPostURLs[this._APIVersion])){
                res.end(JSON.stringify({responseCode: 400, responseMsg: 'Bad request', event: ''}));
            }else{
                this.registeredPostURLs[this._APIVersion][this._APIFunction](req, res);
            }
        }
    },

    get: function(url, version,  callback){
        if(this.registeredGetURLs[version] === undefined)
            this.registeredGetURLs[version] = {};
        this.registeredGetURLs[version][url] = callback;
    },

    post: function(url, version,  callback){
        if(this.registeredPostURLs[version] === undefined)
            this.registeredPostURLs[version] = {};
        this.registeredPostURLs[version][url] = callback;
    },

    urlCheck: function(req){
        // If url is invalid (ie: '/', '/register')
        if(req.url.length<='4'){
            res.end({responseCode: 400, responseMsg: 'Bad request', event: ''});
        }else{
            if(req.url.charAt(0) !== '/'){
                res.end({responseCode: 400, responseMsg: 'Bad request', event: ''});
            }else{
                var url = req.url.substr(1);
                var urlseg = url.split('/');

                //register API version
                this._APIVersion = urlseg[0];
                console.log('API version : ' + this._APIVersion);

                //register API function
                this._APIFunction = '/' + urlseg[1];
                console.log('API function : ' + this._APIFunction);
            }
        }
    },

    createServer: function(clb){
        var that = this;

        http.createServer(function(req, res){

            // check for url for API version and API function requested.
            that.urlCheck(req);

            console.log('Requested Method : ' + req.method);

            switch (req.method){
                case 'POST':
                    that.executePost(req, res);
                    break;

                case 'GET':
                default:
                    that.executeGet(req, res);
                    break;
            }
        }).server.listen(port, function(){
            console.log("Server listning at " + port);
        });
    }
};

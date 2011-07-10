/**
 * abaaso.flickr
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2011 avoidwork inc.
 * @link http://avoidwork.com
 * @requires abaaso 1.6.003
 * @version 1.0
 */
abaaso.on("ready",function(){abaaso.un("ready","abaaso.flickr"),abaaso.define("flickr",{config:{data:{},id:null,key:null,photo:null,loaded:null,sets:[""]},display:function(a){if(a==this.config.photo){var b=this.data.get(a).data,c=abaaso.create("img",{style:"display:none;","class":"photo",src:b.sizes.last().source},$("#photo"));c.on("load",function(){$(".photo").length>1?$(".photo:first").destroy():void 0,this.style.display="block",abaaso.flickr.resize(abaaso.client.size),this.un("load").opacity(0).fade(1e3)})}},init:function(){try{abaaso.un("render","abaaso.flickr");switch(!0){case this.config.id===null:case this.config.key===null:throw Error(abaaso.label.error)}var a=this,b=a.config.sets.length>1?Math.floor(Math.random()*a.config.sets.length+1):0,c="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+a.config.key+"&photoset_id="+a.config.sets[b]+"&format=json&jsoncallback=?",d,e,f;a.config.loaded=a.config.sets[b],$("#year").text((new Date).getFullYear()),$("#next").on("click",function(){this.next()},"next",this),$("#prev").on("click",function(){this.prev()},"prev",this),abaaso.on("resize",function(a){this.resize(a)},"photo",this),e=function(b){try{a.config.data[a.config.loaded]=b.photoset.photo,abaaso.store(a,a.config.data[a.config.loaded]),f=a.next();for(var c=0,d=a.data.records.length;c<d;c++){if(c==f)continue;a.load(a.data.records[c].data,c,!1)}delete a.init}catch(e){abaaso.error(e,arguments,this),a.init()}},abaaso.jsonp(c,e,"jsoncallback")}catch(g){abaaso.error(g,arguments,this)}},key:function(a){var b=a.keyCode?a.keyCode:a.charCode;switch(b){case 37:case 40:this.prev();break;case 38:case 39:this.next()}},load:function(a,b,c){c=c||!0;var d="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+this.config.key+"&photo_id="+a.id+"&format=json&jsoncallback=?",e=this,f;typeof a.sizes=="undefined"?(f=function(d){a.sizes=[].concat(d.sizes.size),c===!0?e.display(b):void 0},abaaso.jsonp(d,f,"jsoncallback")):c===!0?e.display(b):void 0},next:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)+1;a>this.data.records.length?a=0:void 0,this.config.photo=a,this.load(this.data.get(a).data,a);return a},prev:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)-1;a<0?a=this.data.records.length:void 0,this.config.photo=a,this.load(this.data.get(a).data,a);return a},resize:function(a){var b=$("#photo"),c=$("#cover");b.style.height=a.y,b.style.width=a.x,c.style.height=a.y,c.style.width=a.x},version:"1.0"})},"abaaso.flickr",abaaso),abaaso.on("render",function(){abaaso.flickr.init()},"abaaso.flickr",abaaso)
/**
 * Copyright (c) 2011, Jason Mulligan <jason.mulligan@avoidwork.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Jason Mulligan nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL JASON MULLIGAN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * abaaso.flickr
 *
 * Note: Internet Explorer 8 is not supported
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 1.6.015
 * @requires abaaso.fx 1.1
 * @version 1.0.beta
 */
abaaso.on("ready",function(){abaaso.un("ready","abaaso.flickr"),abaaso.define("flickr",{config:{data:{},id:null,key:null,photo:null,loaded:null,timer:undefined,timeout:3e4,sets:[""],slide:!1},display:function(a){if(a==this.config.photo){clearTimeout(this.config.timer);var b=this,c=b.data.get(a).data,d=abaaso.create("img",{style:"display:none;","class":"photo",src:c.sizes.last().source},$("#photo"));d.on("load",function(){$(".photo").length>1?$(".photo:first").destroy():void 0,this.style.display="block",b.resize($.client.size),this.un("load").opacity(0).fade(1e3),b.config.slide===!0?b.config.timer=setTimeout(function(){b.next.call(b)},b.config.timeout):void 0})}},init:function(){try{switch(!0){case this.config.id===null:case this.config.key===null:case $.client.ie&&$.client.version==8:throw Error($.label.error.invalidArguments)}var a=this,b=a.config.sets.length>1?Math.floor(Math.random()*a.config.sets.length+1):0,c="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+a.config.key+"&photoset_id="+a.config.sets[b]+"&format=json&jsoncallback=?",d,e,f;a.config.loaded=a.config.sets[b],$("#year").text((new Date).getFullYear());switch(!0){case $.client.mobile&&$.client.tablet:default:abaaso.on("resize",function(a){this.resize(a)},"photo",this),$("#next").on("click",function(){this.next()},"next",this),$("#prev").on("click",function(){this.prev()},"prev",this),$("#slideshow").on("click",function(){switch(!0){case this.config.slide:$("#slideshow").text("Start"),this.config.slide=!1,clearTimeout(this.config.timer);break;default:$("#slideshow").text("Stop"),this.config.slide=!0,this.next()}},"slideshow",this)}e=function(b){try{a.config.data[a.config.loaded]=b.photoset.photo,$.store(a,a.config.data[a.config.loaded]),f=a.next();for(var c=0,d=a.data.records.length;c<d;c++){if(c==f)continue;a.load(a.data.records[c].data,c,!1)}delete a.init}catch(e){$.error(e,arguments,this),a.init()}},$.jsonp(c,e,"jsoncallback")}catch(g){$.error(g,arguments,this)}},key:function(a){var b=a.keyCode?a.keyCode:a.charCode;switch(b){case 37:case 40:this.prev();break;case 38:case 39:this.next()}},load:function(a,b,c){c=c||!0;var d="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+this.config.key+"&photo_id="+a.id+"&format=json&jsoncallback=?",e=this,f;typeof a.sizes=="undefined"?(f=function(d){a.sizes=[].concat(d.sizes.size),c===!0?e.display(b):void 0},$.jsonp(d,f,"jsoncallback")):c===!0?e.display(b):void 0},next:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)+1;a>this.data.records.length?a=0:void 0,this.config.photo=a,this.load(this.data.get(a).data,a);return a},prev:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)-1;a<0?a=this.data.records.length:void 0,this.config.photo=a,this.load(this.data.get(a).data,a);return a},resize:function(a){var b=$("#photo"),c=$("#cover");b.style.height=a.y,b.style.width=a.x,c.style.height=a.y,c.style.width=a.x},version:"1.0.beta"})},"abaaso.flickr",abaaso)
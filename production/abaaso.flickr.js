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
 *     * Neither the name of abaaso.flickr nor the
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
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @link http://avoidwork.com
 * @requires abaaso 1.9
 * @version 1.3
 */
(function(a){"use strict";var b=function(){var b=a[abaaso.aliased],c,d,e,f,g,h,i;return c={data:{},id:null,key:null,photo:null,loaded:null,timer:null,timeout:15e3,sets:[""],slide:!1,version:"1.3"},d=function(a){if(a!=c.photo)return;var d=b.flickr,e=d.data.get(a).data,f=b("#photo"),g=b.create("img",{style:"display:none;",src:e.sizes.last().source},f);f.css("opacity",0),g.on("load",function(){this.un("load"),f.css("background-image","url("+this.src+")"),this.destroy(),f.css("opacity",1)}),typeof b.timer.flickr!="undefined"&&(b.timer.flickr=setTimeout(function(){h()},b.flickr.config.timeout))},e=function(){if(c.id===null||c.key===null)throw Error(b.label.error.invalidArguments);var a=b.flickr,d=c.sets.length>1?Math.floor(Math.random()*c.sets.length+1):0,e="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+c.key+"&photoset_id="+c.sets[d]+"&format=json&jsoncallback=?",j,k;j=function(){switch(!0){case typeof b.timer.flickr!="undefined":clearTimeout(b.timer.flickr),delete b.timer.flickr;break;default:b.timer.flickr=null,h()}},c.loaded=c.sets[d],typeof b("#year")!="undefined"&&b("#year").text((new Date).getFullYear()),b.on(document,"keydown",function(a){f(a),typeof a.keyCode=="number"&&a.keyCode===32&&j()}),b.on(document,"keyup",function(a){b(".click").removeClass("click")}),b("#next").on("click",function(a){h(a)}),b("#prev").on("click",function(a){i(a)}),b("#play").on("mousedown",j),b.store(a),a.on("afterDataSet",function(a){g(a,!1)},"photo").on("afterDataSync",function(a){c.data[c.loaded]=a.photo,k=h(),delete abaaso.flickr.init},"photoset"),a.data.source="photoset",a.data.key="id",a.data.uri=e},f=function(a){var c=a.keyCode?a.keyCode:a.charCode;if(typeof b.timer.flickr!="undefined")return;switch(c){case 37:case 40:i(),b("#prev").addClass("click");break;case 38:case 39:h(),b("#next").addClass("click")}return a},g=function(a,e){if(typeof a=="undefined"||typeof a.key=="undefined")return h();e=e!==!1;var f=b.flickr,g="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+c.key+"&photo_id="+a.key+"&format=json&jsoncallback=?",i=f.data.keys[a.key].index,j,k,l;switch(!0){case typeof a.data.sizes=="undefined":j=function(a){k=f.data.get(i),k.data.sizes=a.sizes.size.clone(),f.data.set(k.key,k.data,!0);switch(e){case!0:d(i);break;case!1:l=new Image,l.src=k.data.sizes.last().source}},g.jsonp(j);break;case e:d(i)}return a},h=function(a){var d=b.flickr,e=c.photo===null?Math.floor(Math.random()*d.data.records.length+1):parseInt(c.photo)+1;return e>d.data.total&&(e=0),c.photo=e,g(d.data.get(e)),e},i=function(a){var d=b.flickr,e=c.photo===null?Math.floor(Math.random()*d.data.records.length+1):parseInt(c.photo)-1;return e<0&&(e=d.data.total-1),c.photo=e,g(d.data.get(e)),e},{config:c,display:d,init:e,key:f,load:g,next:h,prev:i}},c=function(){abaaso.module("flickr",b())};typeof define=="function"?define("abaaso.flickr",["abaaso"],c):abaaso.on("render",c,"abaaso.flickr")})(window)
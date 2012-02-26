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
(function(a){"use strict";var b=function(){var b=a[abaaso.aliased],c,d,e,f,g,h,i;return c={data:{},id:null,key:null,photo:null,loaded:null,timer:undefined,timeout:3e4,sets:[""],slide:!1,version:"1.3"},d=function(a){if(a!=this.config.photo)return;clearTimeout(this.config.timer);var c=this,d=c.data.get(a).data,e=b("#photo"),f=b.create("img",{style:"display:none;",src:d.sizes.last().source},e);e.css("opacity",0),f.on("load",function(){this.un("load"),e.style.backgroundImage="url("+this.src+")",this.destroy(),e.css("opacity",1),c.config.slide===!0&&(b.flickr.config.timer=setTimeout(function(){c.next.call(c)},b.flickr.config.timeout))})},e=function(){if(this.config.id===null||this.config.key===null)throw Error(b.label.error.invalidArguments);var a=this,c=a.config.sets.length>1?Math.floor(Math.random()*a.config.sets.length+1):0,d="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+a.config.key+"&photoset_id="+a.config.sets[c]+"&format=json&jsoncallback=?",e,f,g;a.config.loaded=a.config.sets[c],typeof b("#year")!="undefined"&&b("#year").text((new Date).getFullYear()),b.on(document,"keydown",this.key,"keyboard",this),b("nav a").on("mousedown",function(){this.addClass("click")}).on("mouseup",function(){this.removeClass("click")}),b("#next").on("click",this.next,"next",this),b("#prev").on("click",this.prev,"prev",this),b("#play").on("click",function(){switch(!0){case this.config.slide:b("#play").removeClass("pause"),clearTimeout(this.config.timer);break;default:b("#play").addClass("pause"),this.next()}this.config.slide=!this.config.slide},"slideshow",this),b.store(this),this.on("afterDataSet",function(a){this.load(a,!1)},"photo").on("afterDataSync",function(a){var b=this.parentNode;b.config.data[b.config.loaded]=a.photo,g=b.next(),delete b.init},"photoset",this.data),this.data.source="photoset",this.data.key="id",this.data.uri=d},f=function(a){var b=a.keyCode?a.keyCode:a.charCode;switch(b){case 37:case 40:this.prev();break;case 38:case 39:this.next()}return a},g=function(a,b){if(typeof a=="undefined"||typeof a.key=="undefined")return this.next();b=b!==!1;var c="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+this.config.key+"&photo_id="+a.key+"&format=json&jsoncallback=?",d=this.data.keys[a.key].index,e=this,f,g;switch(!0){case typeof a.data.sizes=="undefined":f=function(a){g=e.data.get(d),g.data.sizes=a.sizes.size.clone(),e.data.set(g.key,g.data,!0),b===!0&&e.display(d)},c.jsonp(f);break;case b:this.display(d)}return a},h=function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)+1;return a>this.data.records.length&&(a=0),this.config.photo=a,this.load(this.data.get(a)),a},i=function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)-1;return a<0&&(a=this.data.total-1),this.config.photo=a,this.load(this.data.get(a)),a},{active:active,create:create}},c=function(){abaaso.module("flickr",b())};typeof define=="function"?define("abaaso.flickr",["abaaso"],c):abaaso.on("init",c,"abaaso.flickr")})(window)
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
 * @requires abaaso 1.7.000
 * @requires abaaso.fx 1.1
 * @version 1.0.beta
 */
$.on("init",function(){this.flickr={config:{data:{},id:null,key:null,photo:null,loaded:null,timer:undefined,timeout:3e4,sets:[""],slide:!1},display:function(a){if(a!=this.config.photo)return;clearTimeout(this.config.timer);var b=this,c=b.data.get(a).data,d=$("#photo"),e=$.create("img",{style:"display:none;",src:c.sizes.last().source},d);e.on("load",function(){this.un("load"),d.hide(),d.style.backgroundImage="url("+this.src+")",this.destroy(),d.opacity(0).show().fade(1e3),b.config.slide===!0&&(b.config.timer=setTimeout(function(){b.next.call(b)},b.config.timeout))})},grid:function(a){var b=typeof $("#grid")!="undefined"?$("#grid"):$.create("div",{id:"grid","class":"right"}).hide(),c=this,d,e,f,g;c.grid.resize=function(){/left|right/.test(this.className)&&(this.style.height=$.client.size.y-75+"px")};if(b.childNodes.length===0&&!c.data.total>0){this.grid.resize.call($("#grid")),$.on("resize",function(){this.grid.resize.call($("#grid"))},"grid",this),g=c.data.total;for(f=0;f<g;f++)b.create("a",{id:"grid-"+f}).on("click",function(){c.config.photo=parseInt(this.id.replace(/grid-/,"")),c.display(this.id.replace(/grid-/,""))}).create("img",{src:c.data.get(f).data.sizes.first().source})}return a?b.show():b.hide(),b},init:function(){if(this.config.id===null||this.config.key===null||$.client.ie&&$.client.version==8)throw Error($.label.error.invalidArguments);var a=this,b=a.config.sets.length>1?Math.floor(Math.random()*a.config.sets.length+1):0,c="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+a.config.key+"&photoset_id="+a.config.sets[b]+"&format=json&jsoncallback=?",d,e,f;a.config.loaded=a.config.sets[b],typeof $("#year")!="undefined"&&$("#year").text((new Date).getFullYear());switch(!0){case $.client.mobile||$.client.tablet:default:$("#next").on("click",function(){this.next()},"next",this),$("#prev").on("click",function(){this.prev()},"prev",this),$("#slideshow").on("click",function(){switch(!0){case this.config.slide:$("#slideshow").update({innerHTML:"Start"}),this.config.slide=!1,clearTimeout(this.config.timer);break;default:$("#slideshow").update({innerHTML:"Stop"}),this.config.slide=!0,this.next()}},"slideshow",this)}e=function(b){try{a.config.data[a.config.loaded]=b.photoset.photo,$.store(a),a.data.key="id",a.data.batch("set",b.photoset.photo),f=a.next();for(var c=0,d=a.data.total;c<d;c++){if(c==f)continue;a.load(a.data.records[c],c,!1)}delete a.init}catch(e){$.error(e,arguments,this),a.init()}},$.jsonp(c,e)},key:function(a){var b=a.keyCode?a.keyCode:a.charCode;switch(b){case 37:case 40:this.prev();break;case 38:case 39:this.next()}},load:function(a,b,c){c=c||!0;var d="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+this.config.key+"&photo_id="+a.key+"&format=json&jsoncallback=?",e=this,f;typeof a.sizes=="undefined"?(f=function(d){a.data.sizes=[].concat(d.sizes.size),c===!0&&e.display(b)},$.jsonp(d,f)):c===!0&&e.display(b)},next:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)+1;return a>this.data.records.length&&(a=0),this.config.photo=a,this.load(this.data.get(a),a),a},prev:function(){var a=this.config.photo===null?Math.floor(Math.random()*this.data.records.length+1):parseInt(this.config.photo)-1;return a<0&&(a=this.data.total-1),this.config.photo=a,this.load(this.data.get(a),a),a},version:"1.0.beta"}},"abaaso.flickr")
/**
 * Copyright (c) 2011 - 2012, Jason Mulligan <jason.mulligan@avoidwork.com>
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
 * @requires abaaso 2.4.1
 * @version 1.4.beta
 */
(function(e){"use strict";var t,n,r;n=function(e){var n=this;return n.id=null,n.key=null,n.loaded=null,n.photo=null,n.sets=[],n.timer=null,n.timeout=15e3,e instanceof Object&&t.iterate(e,function(e,t){n[t]=e}),n},n.prototype.init=function(){if(this.id===null||this.key===null)throw Error(t.label.error.invalidArguments);var e=this,n=e.sets.length>1?Math.floor(Math.random()*e.sets.length+1):0,r="http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+e.key+"&photoset_id="+e.sets[n]+"&format=json&jsoncallback=?";e.loaded=e.sets[n],t.store(e),e.on("afterDataSet",function(e){this.load(e)},"photo").on("afterDataSync",function(e){this.data[this.loaded]=e.photo},"photoset"),e.data.source="photoset",e.data.key="id",e.data.uri=r},n.prototype.load=function(e){if(typeof e=="undefined"||typeof e.key=="undefined")return;var t=this,n="http://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+this.key+"&photo_id="+this.key+"&format=json&jsoncallback=?",r=t.data.keys[e.key].index,i,s,o;return i=function(e){s=t.data.get(r),s.data.sizes=e.sizes.size.clone(),t.data.set(s.key,s.data,!0),t.fire("flickrImage",s)},typeof e.data.sizes=="undefined"&&n.jsonp(i),e},r=function(r){return t=e[r.aliased],r.module("flickr",n)},typeof define=="function"?define(["abaaso"],function(e){return r(e)}):abaaso.on("init",function(){return r(abaaso)},"abaaso.flickr")})(this)
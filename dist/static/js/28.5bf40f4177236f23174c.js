webpackJsonp([28],{"0xDb":function(e,t,r){"use strict";r.d(t,"a",function(){return o});var n=r("ZLEe"),a=(r.n(n),r("hRKE")),o=(r.n(a),function(e){0})},"3Xzz":function(e,t,r){"use strict";var n=r("P9l9"),a=r("Ch4/"),o=r("0xDb"),i={name:"navpath",data:function(){return{projectName:"gic-clique",navpath:[{name:"首页",path:""},{name:"",path:""},{name:"",path:""}]}},props:{navtip:{type:Boolean,default:!1}},methods:{changeRoute:function(e){Object(o.a)(e),this.$router.push(e)},getNavPath:function(){var e=this,t={project:e.projectName,path:e.$route.path.split("/")[1]};Object(n.e)("/api-auth/get-current-memu-data",t).then(function(t){var r=t.data;if(0==r.errorCode)return r.result?(e.navpath=[],r.result.list&&r.result.list.length&&r.result.list.forEach(function(t,n){t.name=t.menuName,t.path="",n==r.result.list.length-1&&(t.path="/"+t.menuUrl),n>0&&e.navpath.push(t)}),void Object(o.a)("///>>>>",e.navpath)):void Object(o.a)("resData.result: ",r.result);a.a.errorMsg(r)}).catch(function(t){Object(o.a)(t),e.$message.error({duration:1e3,message:t.message})})}},mounted:function(){this.getNavPath()}},s={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"navwrap boxbttom"},[r("el-breadcrumb",{attrs:{separator:"/"}},[e._l(e.navpath,function(t,n){return[t.path?[r("el-breadcrumb-item",{key:n,attrs:{to:{path:t.path}},on:{click:function(r){return e.changeRoute(t.path)}}},[r("span",{staticClass:"el-breadcrumb__inner is-link",on:{click:function(r){return e.changeRoute(t.path)}}},[e._v(e._s(t.name))])])]:[r("el-breadcrumb-item",{key:n},[e._v(e._s(t.name))])]]})],2),e._v(" "),r("h1",{staticClass:"navtitle"},[e._v(e._s(e.navpath[e.navpath.length-1].name))]),e._v(" "),1==e.navtip?r("div",{staticClass:"navtip navmTop"},[r("i",{staticClass:"el-icon-info navtipcolor"}),e._v("变更导航个数，移动顺序，更换页面链接均需提交小程序审核后重新发布生效，其他变更立即生效。小程序审核请联系品牌项目经理。")]):e._e()],1)},staticRenderFns:[]};var c=r("C7Lr")(i,s,!1,function(e){r("pTUQ")},"data-v-320a30ce",null);t.a=c.exports},"6iV/":function(e,t,r){"use strict";var n=r("H9GB"),a=r("Ml8i"),o=r("qFr1");e.exports={formats:o,parse:a,stringify:n}},"Ch4/":function(e,t,r){"use strict";var n=r("Ip9M");r.n(n);t.a={errorMsg:function(e){var t=window.location.origin;if(t.indexOf("localhost")&&(t="http://gicdev.demogic.com"),0!=e.errorCode){if(401==e.errorCode)return window.location.href=t+"/gic-web/#/",!1;n.Message.error({duration:1e3,message:e.message})}}}},H9GB:function(e,t,r){"use strict";var n=r("JNAD"),a=r("qFr1"),o={brackets:function(e){return e+"[]"},indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},i=Date.prototype.toISOString,s={delimiter:"&",encode:!0,encoder:n.encode,encodeValuesOnly:!1,serializeDate:function(e){return i.call(e)},skipNulls:!1,strictNullHandling:!1},c=function e(t,r,a,o,i,c,l,u,p,f,d,h){var m=t;if("function"==typeof l)m=l(r,m);else if(m instanceof Date)m=f(m);else if(null===m){if(o)return c&&!h?c(r,s.encoder):r;m=""}if("string"==typeof m||"number"==typeof m||"boolean"==typeof m||n.isBuffer(m))return c?[d(h?r:c(r,s.encoder))+"="+d(c(m,s.encoder))]:[d(r)+"="+d(String(m))];var v,g=[];if(void 0===m)return g;if(Array.isArray(l))v=l;else{var y=Object.keys(m);v=u?y.sort(u):y}for(var b=0;b<v.length;++b){var j=v[b];i&&null===m[j]||(g=Array.isArray(m)?g.concat(e(m[j],a(r,j),a,o,i,c,l,u,p,f,d,h)):g.concat(e(m[j],r+(p?"."+j:"["+j+"]"),a,o,i,c,l,u,p,f,d,h)))}return g};e.exports=function(e,t){var r=e,i=t?n.assign({},t):{};if(null!==i.encoder&&void 0!==i.encoder&&"function"!=typeof i.encoder)throw new TypeError("Encoder has to be a function.");var l=void 0===i.delimiter?s.delimiter:i.delimiter,u="boolean"==typeof i.strictNullHandling?i.strictNullHandling:s.strictNullHandling,p="boolean"==typeof i.skipNulls?i.skipNulls:s.skipNulls,f="boolean"==typeof i.encode?i.encode:s.encode,d="function"==typeof i.encoder?i.encoder:s.encoder,h="function"==typeof i.sort?i.sort:null,m=void 0!==i.allowDots&&i.allowDots,v="function"==typeof i.serializeDate?i.serializeDate:s.serializeDate,g="boolean"==typeof i.encodeValuesOnly?i.encodeValuesOnly:s.encodeValuesOnly;if(void 0===i.format)i.format=a.default;else if(!Object.prototype.hasOwnProperty.call(a.formatters,i.format))throw new TypeError("Unknown format option provided.");var y,b,j=a.formatters[i.format];"function"==typeof i.filter?r=(b=i.filter)("",r):Array.isArray(i.filter)&&(y=b=i.filter);var w,O=[];if("object"!=typeof r||null===r)return"";w=i.arrayFormat in o?i.arrayFormat:"indices"in i?i.indices?"indices":"repeat":"indices";var S=o[w];y||(y=Object.keys(r)),h&&y.sort(h);for(var x=0;x<y.length;++x){var C=y[x];p&&null===r[C]||(O=O.concat(c(r[C],C,S,u,p,f?d:null,b,h,m,v,j,g)))}var N=O.join(l),A=!0===i.addQueryPrefix?"?":"";return N.length>0?A+N:""}},JNAD:function(e,t,r){"use strict";var n=Object.prototype.hasOwnProperty,a=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),o=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r};e.exports={arrayToObject:o,assign:function(e,t){return Object.keys(t).reduce(function(e,r){return e[r]=t[r],e},e)},compact:function(e){for(var t=[{obj:{o:e},prop:"o"}],r=[],n=0;n<t.length;++n)for(var a=t[n],o=a.obj[a.prop],i=Object.keys(o),s=0;s<i.length;++s){var c=i[s],l=o[c];"object"==typeof l&&null!==l&&-1===r.indexOf(l)&&(t.push({obj:o,prop:c}),r.push(l))}return function(e){for(var t;e.length;){var r=e.pop();if(t=r.obj[r.prop],Array.isArray(t)){for(var n=[],a=0;a<t.length;++a)void 0!==t[a]&&n.push(t[a]);r.obj[r.prop]=n}}return t}(t)},decode:function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(t){return e}},encode:function(e){if(0===e.length)return e;for(var t="string"==typeof e?e:String(e),r="",n=0;n<t.length;++n){var o=t.charCodeAt(n);45===o||46===o||95===o||126===o||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122?r+=t.charAt(n):o<128?r+=a[o]:o<2048?r+=a[192|o>>6]+a[128|63&o]:o<55296||o>=57344?r+=a[224|o>>12]+a[128|o>>6&63]+a[128|63&o]:(n+=1,o=65536+((1023&o)<<10|1023&t.charCodeAt(n)),r+=a[240|o>>18]+a[128|o>>12&63]+a[128|o>>6&63]+a[128|63&o])}return r},isBuffer:function(e){return null!==e&&void 0!==e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))},isRegExp:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},merge:function e(t,r,a){if(!r)return t;if("object"!=typeof r){if(Array.isArray(t))t.push(r);else{if("object"!=typeof t)return[t,r];(a.plainObjects||a.allowPrototypes||!n.call(Object.prototype,r))&&(t[r]=!0)}return t}if("object"!=typeof t)return[t].concat(r);var i=t;return Array.isArray(t)&&!Array.isArray(r)&&(i=o(t,a)),Array.isArray(t)&&Array.isArray(r)?(r.forEach(function(r,o){n.call(t,o)?t[o]&&"object"==typeof t[o]?t[o]=e(t[o],r,a):t.push(r):t[o]=r}),t):Object.keys(r).reduce(function(t,o){var i=r[o];return n.call(t,o)?t[o]=e(t[o],i,a):t[o]=i,t},i)}}},Ml8i:function(e,t,r){"use strict";var n=r("JNAD"),a=Object.prototype.hasOwnProperty,o={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:n.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},i=function(e,t,r){if(e){var n=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,o=/(\[[^[\]]*])/g,i=/(\[[^[\]]*])/.exec(n),s=i?n.slice(0,i.index):n,c=[];if(s){if(!r.plainObjects&&a.call(Object.prototype,s)&&!r.allowPrototypes)return;c.push(s)}for(var l=0;null!==(i=o.exec(n))&&l<r.depth;){if(l+=1,!r.plainObjects&&a.call(Object.prototype,i[1].slice(1,-1))&&!r.allowPrototypes)return;c.push(i[1])}return i&&c.push("["+n.slice(i.index)+"]"),function(e,t,r){for(var n=t,a=e.length-1;a>=0;--a){var o,i=e[a];if("[]"===i)o=(o=[]).concat(n);else{o=r.plainObjects?Object.create(null):{};var s="["===i.charAt(0)&&"]"===i.charAt(i.length-1)?i.slice(1,-1):i,c=parseInt(s,10);!isNaN(c)&&i!==s&&String(c)===s&&c>=0&&r.parseArrays&&c<=r.arrayLimit?(o=[])[c]=n:o[s]=n}n=o}return n}(c,t,r)}};e.exports=function(e,t){var r=t?n.assign({},t):{};if(null!==r.decoder&&void 0!==r.decoder&&"function"!=typeof r.decoder)throw new TypeError("Decoder has to be a function.");if(r.ignoreQueryPrefix=!0===r.ignoreQueryPrefix,r.delimiter="string"==typeof r.delimiter||n.isRegExp(r.delimiter)?r.delimiter:o.delimiter,r.depth="number"==typeof r.depth?r.depth:o.depth,r.arrayLimit="number"==typeof r.arrayLimit?r.arrayLimit:o.arrayLimit,r.parseArrays=!1!==r.parseArrays,r.decoder="function"==typeof r.decoder?r.decoder:o.decoder,r.allowDots="boolean"==typeof r.allowDots?r.allowDots:o.allowDots,r.plainObjects="boolean"==typeof r.plainObjects?r.plainObjects:o.plainObjects,r.allowPrototypes="boolean"==typeof r.allowPrototypes?r.allowPrototypes:o.allowPrototypes,r.parameterLimit="number"==typeof r.parameterLimit?r.parameterLimit:o.parameterLimit,r.strictNullHandling="boolean"==typeof r.strictNullHandling?r.strictNullHandling:o.strictNullHandling,""===e||null===e||void 0===e)return r.plainObjects?Object.create(null):{};for(var s="string"==typeof e?function(e,t){for(var r={},n=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,i=t.parameterLimit===1/0?void 0:t.parameterLimit,s=n.split(t.delimiter,i),c=0;c<s.length;++c){var l,u,p=s[c],f=p.indexOf("]="),d=-1===f?p.indexOf("="):f+1;-1===d?(l=t.decoder(p,o.decoder),u=t.strictNullHandling?null:""):(l=t.decoder(p.slice(0,d),o.decoder),u=t.decoder(p.slice(d+1),o.decoder)),a.call(r,l)?r[l]=[].concat(r[l]).concat(u):r[l]=u}return r}(e,r):e,c=r.plainObjects?Object.create(null):{},l=Object.keys(s),u=0;u<l.length;++u){var p=l[u],f=i(p,s[p],r);c=n.merge(c,f,r)}return n.compact(c)}},P9l9:function(e,t,r){"use strict";r.d(t,"a",function(){return p}),r.d(t,"e",function(){return f}),r.d(t,"d",function(){return d}),r.d(t,"c",function(){return h}),r.d(t,"b",function(){return m});var n=r("rVsN"),a=r.n(n),o=r("lRwf"),i=r.n(o),s=r("6iV/"),c=r.n(s),l=r("Ip9M"),u=(r.n(l),window.location.origin);-1!=u.indexOf("localhost")&&(u="http://gicdev.demogic.com"),i.a.axios.interceptors.request.use(function(e){return e},function(e){return l.Message.error({message:"请求超时!"}),a.a.resolve(e)}),i.a.axios.interceptors.response.use(function(e){if(!e.status||200!=e.status||"error"!=e.data.status)return e;l.Message.error({message:e.data.msg})},function(e){return 504==e.response.status||404==e.response.status||e.response.status,a.a.resolve(e)});var p=function(e,t){return t.requestProject="gic-clique",i.a.axios({method:"get",url:""+u+e,data:{},params:t,headers:{"content-type":"application/x-www-form-urlencoded"}})},f=function(e,t){return t.requestProject="gic-clique",i.a.axios({method:"post",url:""+u+e,data:c.a.stringify(t),headers:{"content-type":"application/x-www-form-urlencoded"}})},d=function(e,t){return t.requestProject="gic-clique",i.a.axios({method:"post",url:""+u+e,data:"{}",params:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})},h=function(e,t){return i.a.axios({method:"post",url:""+u+e,data:t,params:{requestProject:"gic-clique"},headers:{"Content-Type":"application/json;charset=UTF-8"}})},m=function(e,t){return t.requestProject="gic-clique",i.a.axios({method:"post",url:""+u+e,data:t,headers:{}})}},"Z9/t":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("3Xzz"),a=r("P9l9"),o=r("0xDb"),i={name:"nearStoreSet",data:function(){return{projectName:"gic-clique",navpath:[{name:"首页",path:"/"},{name:"附近门店",path:""}],nearStoreSwithFlag:!0}},created:function(){},methods:{changeRoute:function(e){Object(o.a)("route-change"),this.$router.push(e)},nearStoreSwitch:function(){Object(o.a)(this.nearStoreSwithFlag),this.setNearStore()},setNearStore:function(){var e=this,t={requestProject:e.projectName,isShowCliqueStore:1==e.nearStoreSwithFlag?1:0};Object(a.e)("/api-admin/save-clique-show-store",t).then(function(t){var r=t.data;0!=r.errorCode?(e.nearStoreSwithFlag=!1,e.$message.error({duration:1e3,message:r.message})):e.$message({message:"修改附近门店显示配置成功",type:"success"})}).catch(function(t){Object(o.a)(t),e.nearStoreSwithFlag=!1,e.$message.error({duration:1e3,message:t.message})})},getNearStore:function(){var e=this,t={requestProject:e.projectName};Object(a.e)("/api-admin/clique-show-store",t).then(function(t){var r=t.data;0!=r.errorCode?e.$message.error({duration:1e3,message:r.message}):e.nearStoreSwithFlag=1==r.result.isShowCliqueStore}).catch(function(t){Object(o.a)(t),e.$message.error({duration:1e3,message:t.message})})}},mounted:function(){this.getNearStore()},components:{topNav:n.a}},s={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"right-wrap near-store-contain"},[r("topNav",{attrs:{navpath:e.navpath}}),e._v(" "),r("div",{staticClass:"right-content"},[r("div",{staticClass:"right-box"},[r("div",{staticClass:"attention-wrap"},[r("label",{staticClass:"near-store-tip"},[e._v("单商户小程序中附近门店是否展示集团其他商户门店")]),e._v(" "),r("div",{staticClass:"item-label"},[r("span",[e._v("展示")]),e._v(" "),r("el-switch",{on:{change:e.nearStoreSwitch},model:{value:e.nearStoreSwithFlag,callback:function(t){e.nearStoreSwithFlag=t},expression:"nearStoreSwithFlag"}})],1)])])]),e._v(" "),r("vue-gic-footer")],1)},staticRenderFns:[]};var c=r("C7Lr")(i,s,!1,function(e){r("Zo4r")},"data-v-2d9ea200",null);t.default=c.exports},Zo4r:function(e,t){},pTUQ:function(e,t){},qFr1:function(e,t,r){"use strict";var n=String.prototype.replace,a=/%20/g;e.exports={default:"RFC3986",formatters:{RFC1738:function(e){return n.call(e,a,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"}}});
//# sourceMappingURL=28.5bf40f4177236f23174c.js.map
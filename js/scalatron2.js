/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	document.addEventListener("DOMContentLoaded", function() {
	  var ScalatronSocket = __webpack_require__(1);
	  var Textures = __webpack_require__(2);
	  var MeshFactory = __webpack_require__(4);
	  var Audio = __webpack_require__(8);
	  var Simulation = __webpack_require__(9);
	  var KeyboardListener = __webpack_require__(31);

	  var socket;

	  Textures.preload(function () {
	    Audio.load();
	    MeshFactory.initMesh();
	    var sim = new Simulation();
	    KeyboardListener.load(sim);
	    socket = new ScalatronSocket(__onConnect, sim.addTick.bind(sim));
	  });

	  /**
	   * On socket connected.
	   * Request live stream from server.
	   * @param evt
	   * @private
	   */
	  var __onConnect = function () {
	    socket.sendMessage("live");
	  };
	});






	///*
	// * Global madness.
	// */
	//var log = function (out) {
	//  console.log(out)
	//};
	//
	//requirejs.onError = function (err) {
	//  log(err.requireType);
	//  log(err.requireModules);
	//  log(err.stack);
	//  throw err;
	//};
	//
	///**
	// * App Main.
	// */
	//define([
	//    "app/ScalatronSocket",
	//    "app/3d/Resources/MeshFactory",
	//    "app/3d/Resources/Textures",
	//    "app/Audio",
	//    "app/Simulation/Simulation",
	//    "app/KeyboardListener"
	//  ],
	//
	//  function (ScalatronSocket, MeshFactory, Textures, Audio, Simulation, KeyboardListener) {
	//
	//    var socket;
	//
	//    Textures.preload(function () {
	//      Audio.load();
	//      MeshFactory.initMesh();
	//      var sim = new Simulation();
	//      KeyboardListener.load(sim);
	//      socket = new ScalatronSocket(__onConnect, sim.addTick.bind(sim));
	//    });
	//
	//    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    /**
	//     * On socket connected.
	//     * Request live stream from server.
	//     * @param evt
	//     * @private
	//     */
	//    var __onConnect = function () {
	//      socket.sendMessage("live");
	//    };
	//  }
	//);

/***/ },
/* 1 */
/***/ function(module, exports) {

	var wsUri = "ws://localhost:8888/room";

	/**
	 *  Create a Scalatron socket.
	 * @constructor
	 */
	function ScalatronSocket(onConnectedCallback, onMessageCallback) {
	  this.onConnectedCallback = onConnectedCallback;
	  this.onMessageCallback = onMessageCallback;

	  this.socket = new WebSocket(wsUri);
	  this.socket.onopen = this.__onOpen.bind(this);
	  this.socket.onclose = this.__onClose.bind(this);
	  this.socket.onerror = this.__onError.bind(this);
	  this.socket.onmessage = this.__onMessage.bind(this);
	}

	/**
	 * Send message using socket.
	 */
	ScalatronSocket.prototype.sendMessage = function (message) {
	  this.socket.send(message);
	};

	/// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * On web socket open.
	 */
	ScalatronSocket.prototype.__onOpen = function (evt) {
	  this.onConnectedCallback(evt);
	};

	/**
	 * On web socket close.
	 */
	ScalatronSocket.prototype.__onClose = function (evt) {
	  console.log("onClose!");
	};

	/**
	 * On web socket error.
	 */
	ScalatronSocket.prototype.__onError = function (evt) {
	  console.log("onError!");
	};

	/**
	 * On web socket error.
	 */
	ScalatronSocket.prototype.__onMessage = function (evt) {
	  if (evt.data.indexOf("ReceivedMessage") === -1) {
	    var data = JSON.parse(evt.data);
	    if (data.constructor !== Array) {
	      this.onMessageCallback(data);
	    }
	  }
	};

	// Export "class"
	module.exports = ScalatronSocket;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);

	/**
	* Texture manager.
	*/
	// Object
	var Textures = {};

	var noOfTextures = 6;
	var textureCount = 0;

	var doneCallback = null;

	/**
	 * Preload all textures
	 * @param callback
	 */
	Textures.preload = function (callback) {
	  doneCallback = callback;
	  var loader = new THREE.TextureLoader();

	  loader.load("textures/floor.jpg", function (texture) {
	      texture.wrapS = THREE.RepeatWrapping;
	      texture.wrapT = THREE.RepeatWrapping;
	      texture.repeat.set(7.5, 7.5);
	      Textures.Floor = texture;
	      textureCount++;
	      __done();
	    }
	  );

	  loader.load("textures/wall.jpg", function (texture) {
	      texture.wrapS = THREE.RepeatWrapping;
	      texture.wrapT = THREE.RepeatWrapping;
	      texture.repeat.set(0.2, 0.4);
	      Textures.Wall = texture;
	      textureCount++;
	      __done();
	    }
	  );

	  loader.load("textures/mini-bot.jpg", function (texture) {
	      texture.wrapS = THREE.RepeatWrapping;
	      texture.wrapT = THREE.RepeatWrapping;
	      texture.repeat.set(1.5, 1);
	      Textures.MiniBot = texture;
	      textureCount++;
	      __done();
	    }
	  );

	  loader.load("textures/bot.jpg", function (texture) {
	      texture.wrapS = THREE.RepeatWrapping;
	      texture.wrapT = THREE.RepeatWrapping;
	      texture.repeat.set(0.5, 0.5);
	      Textures.Bot = texture;
	      textureCount++;
	      __done();
	    }
	  );

	  loader.load("textures/firetexture.jpg", function (texture) {
	      Textures.Explosion = texture;
	      textureCount++;
	      __done();
	    }
	  );

	  loader.load("textures/plant.jpg", function (texture) {
	      Textures.Plant = texture;
	      textureCount++;
	      __done();
	    }
	  );
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Called every time a texture is done loading.
	 * @private
	 */
	function __done() {
	  if (textureCount == noOfTextures) {
	    doneCallback();
	  }
	}

	// Export object
	module.exports = Textures;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// threejs.org/license
	(function(h,pa){ true?pa(exports):"function"===typeof define&&define.amd?define(["exports"],pa):pa(h.THREE=h.THREE||{})})(this,function(h){function pa(){}function C(a,b){this.x=a||0;this.y=b||0}function ba(a,b,c,d,e,f,g,k,l,m){Object.defineProperty(this,"id",{value:Pd++});this.uuid=h.Math.generateUUID();this.sourceFile=this.name="";this.image=void 0!==a?a:ba.DEFAULT_IMAGE;this.mipmaps=[];this.mapping=void 0!==b?b:ba.DEFAULT_MAPPING;this.wrapS=void 0!==
	c?c:1001;this.wrapT=void 0!==d?d:1001;this.magFilter=void 0!==e?e:1006;this.minFilter=void 0!==f?f:1008;this.anisotropy=void 0!==l?l:1;this.format=void 0!==g?g:1023;this.type=void 0!==k?k:1009;this.offset=new C(0,0);this.repeat=new C(1,1);this.generateMipmaps=!0;this.premultiplyAlpha=!1;this.flipY=!0;this.unpackAlignment=4;this.encoding=void 0!==m?m:3E3;this.version=0;this.onUpdate=null}function da(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=void 0!==d?d:1}function zb(a,b,c){this.uuid=h.Math.generateUUID();
	  this.width=a;this.height=b;this.scissor=new da(0,0,a,b);this.scissorTest=!1;this.viewport=new da(0,0,a,b);c=c||{};void 0===c.minFilter&&(c.minFilter=1006);this.texture=new ba(void 0,void 0,c.wrapS,c.wrapT,c.magFilter,c.minFilter,c.format,c.type,c.anisotropy,c.encoding);this.depthBuffer=void 0!==c.depthBuffer?c.depthBuffer:!0;this.stencilBuffer=void 0!==c.stencilBuffer?c.stencilBuffer:!0;this.depthTexture=void 0!==c.depthTexture?c.depthTexture:null}function Ab(a,b,c){zb.call(this,a,b,c);this.activeMipMapLevel=
	  this.activeCubeFace=0}function ca(a,b,c,d){this._x=a||0;this._y=b||0;this._z=c||0;this._w=void 0!==d?d:1}function q(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0}function P(){this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);0<arguments.length&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}function Ta(a,b,c,d,e,f,g,k,l,m){a=void 0!==a?a:[];ba.call(this,a,void 0!==b?b:301,c,d,e,f,g,k,l,m);this.flipY=!1}function Bb(a,b,c){var d=a[0];if(0>=
	  d||0<d)return a;var e=b*c,f=Qd[e];void 0===f&&(f=new Float32Array(e),Qd[e]=f);if(0!==b)for(d.toArray(f,0),d=1,e=0;d!==b;++d)e+=c,a[d].toArray(f,e);return f}function Rd(a,b){var c=Sd[b];void 0===c&&(c=new Int32Array(b),Sd[b]=c);for(var d=0;d!==b;++d)c[d]=a.allocTextureUnit();return c}function se(a,b){a.uniform1f(this.addr,b)}function te(a,b){a.uniform1i(this.addr,b)}function ue(a,b){void 0===b.x?a.uniform2fv(this.addr,b):a.uniform2f(this.addr,b.x,b.y)}function ve(a,b){void 0!==b.x?a.uniform3f(this.addr,
	  b.x,b.y,b.z):void 0!==b.r?a.uniform3f(this.addr,b.r,b.g,b.b):a.uniform3fv(this.addr,b)}function we(a,b){void 0===b.x?a.uniform4fv(this.addr,b):a.uniform4f(this.addr,b.x,b.y,b.z,b.w)}function xe(a,b){a.uniformMatrix2fv(this.addr,!1,b.elements||b)}function ye(a,b){a.uniformMatrix3fv(this.addr,!1,b.elements||b)}function ze(a,b){a.uniformMatrix4fv(this.addr,!1,b.elements||b)}function Ae(a,b,c){var d=c.allocTextureUnit();a.uniform1i(this.addr,d);c.setTexture2D(b||Td,d)}function Be(a,b,c){var d=c.allocTextureUnit();
	  a.uniform1i(this.addr,d);c.setTextureCube(b||Ud,d)}function Vd(a,b){a.uniform2iv(this.addr,b)}function Wd(a,b){a.uniform3iv(this.addr,b)}function Xd(a,b){a.uniform4iv(this.addr,b)}function Ce(a){switch(a){case 5126:return se;case 35664:return ue;case 35665:return ve;case 35666:return we;case 35674:return xe;case 35675:return ye;case 35676:return ze;case 35678:return Ae;case 35680:return Be;case 5124:case 35670:return te;case 35667:case 35671:return Vd;case 35668:case 35672:return Wd;case 35669:case 35673:return Xd}}
	  function De(a,b){a.uniform1fv(this.addr,b)}function Ee(a,b){a.uniform1iv(this.addr,b)}function Fe(a,b){a.uniform2fv(this.addr,Bb(b,this.size,2))}function Ge(a,b){a.uniform3fv(this.addr,Bb(b,this.size,3))}function He(a,b){a.uniform4fv(this.addr,Bb(b,this.size,4))}function Ie(a,b){a.uniformMatrix2fv(this.addr,!1,Bb(b,this.size,4))}function Je(a,b){a.uniformMatrix3fv(this.addr,!1,Bb(b,this.size,9))}function Ke(a,b){a.uniformMatrix4fv(this.addr,!1,Bb(b,this.size,16))}function Le(a,b,c){var d=b.length,
	    e=Rd(c,d);a.uniform1iv(this.addr,e);for(a=0;a!==d;++a)c.setTexture2D(b[a]||Td,e[a])}function Me(a,b,c){var d=b.length,e=Rd(c,d);a.uniform1iv(this.addr,e);for(a=0;a!==d;++a)c.setTextureCube(b[a]||Ud,e[a])}function Ne(a){switch(a){case 5126:return De;case 35664:return Fe;case 35665:return Ge;case 35666:return He;case 35674:return Ie;case 35675:return Je;case 35676:return Ke;case 35678:return Le;case 35680:return Me;case 5124:case 35670:return Ee;case 35667:case 35671:return Vd;case 35668:case 35672:return Wd;
	    case 35669:case 35673:return Xd}}function Oe(a,b,c){this.id=a;this.addr=c;this.setValue=Ce(b.type)}function Pe(a,b,c){this.id=a;this.addr=c;this.size=b.size;this.setValue=Ne(b.type)}function Yd(a){this.id=a;this.seq=[];this.map={}}function Ga(a,b,c){this.seq=[];this.map={};this.renderer=c;c=a.getProgramParameter(b,a.ACTIVE_UNIFORMS);for(var d=0;d!==c;++d){var e=a.getActiveUniform(b,d),f=a.getUniformLocation(b,e.name),g=this,k=e.name,l=k.length;for(kd.lastIndex=0;;){var m=kd.exec(k),u=kd.lastIndex,
	    p=m[1],n=m[3];"]"===m[2]&&(p|=0);if(void 0===n||"["===n&&u+2===l){k=g;e=void 0===n?new Oe(p,e,f):new Pe(p,e,f);k.seq.push(e);k.map[e.id]=e;break}else n=g.map[p],void 0===n&&(n=new Yd(p),p=g,g=n,p.seq.push(g),p.map[g.id]=g),g=n}}}function H(a,b,c){return void 0===b&&void 0===c?this.set(a):this.setRGB(a,b,c)}function cc(a,b){this.min=void 0!==a?a:new C(Infinity,Infinity);this.max=void 0!==b?b:new C(-Infinity,-Infinity)}function Qe(a,b){var c,d,e,f,g,k,l,m,u,p,n=a.context,h=a.state,t,v,A,w,x,T;this.render=
	    function(y,F,G){if(0!==b.length){y=new q;var E=G.w/G.z,J=.5*G.z,Ma=.5*G.w,N=16/G.w,ea=new C(N*E,N),xa=new q(1,1,0),ab=new C(1,1),Ea=new cc;Ea.min.set(0,0);Ea.max.set(G.z-16,G.w-16);if(void 0===w){var N=new Float32Array([-1,-1,0,0,1,-1,1,0,1,1,1,1,-1,1,0,1]),L=new Uint16Array([0,1,2,0,2,3]);t=n.createBuffer();v=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,t);n.bufferData(n.ARRAY_BUFFER,N,n.STATIC_DRAW);n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,v);n.bufferData(n.ELEMENT_ARRAY_BUFFER,L,n.STATIC_DRAW);x=n.createTexture();
	      T=n.createTexture();h.bindTexture(n.TEXTURE_2D,x);n.texImage2D(n.TEXTURE_2D,0,n.RGB,16,16,0,n.RGB,n.UNSIGNED_BYTE,null);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST);h.bindTexture(n.TEXTURE_2D,T);n.texImage2D(n.TEXTURE_2D,0,n.RGBA,16,16,0,n.RGBA,n.UNSIGNED_BYTE,null);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,
	        n.CLAMP_TO_EDGE);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST);n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST);var N=A={vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif ( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility =        visibility.r / 9.0;\nvVisibility *= 1.0 - visibility.g / 9.0;\nvVisibility *=       visibility.b / 9.0;\nvVisibility *= 1.0 - visibility.a / 9.0;\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
	          fragmentShader:"uniform lowp int renderType;\nuniform sampler2D map;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif ( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if ( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},L=n.createProgram(),M=n.createShader(n.FRAGMENT_SHADER),
	        O=n.createShader(n.VERTEX_SHADER),Q="precision "+a.getPrecision()+" float;\n";n.shaderSource(M,Q+N.fragmentShader);n.shaderSource(O,Q+N.vertexShader);n.compileShader(M);n.compileShader(O);n.attachShader(L,M);n.attachShader(L,O);n.linkProgram(L);w=L;u=n.getAttribLocation(w,"position");p=n.getAttribLocation(w,"uv");c=n.getUniformLocation(w,"renderType");d=n.getUniformLocation(w,"map");e=n.getUniformLocation(w,"occlusionMap");f=n.getUniformLocation(w,"opacity");g=n.getUniformLocation(w,"color");k=n.getUniformLocation(w,
	        "scale");l=n.getUniformLocation(w,"rotation");m=n.getUniformLocation(w,"screenPosition")}n.useProgram(w);h.initAttributes();h.enableAttribute(u);h.enableAttribute(p);h.disableUnusedAttributes();n.uniform1i(e,0);n.uniform1i(d,1);n.bindBuffer(n.ARRAY_BUFFER,t);n.vertexAttribPointer(u,2,n.FLOAT,!1,16,0);n.vertexAttribPointer(p,2,n.FLOAT,!1,16,8);n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,v);h.disable(n.CULL_FACE);h.setDepthWrite(!1);L=0;for(M=b.length;L<M;L++)if(N=16/G.w,ea.set(N*E,N),O=b[L],y.set(O.matrixWorld.elements[12],
	        O.matrixWorld.elements[13],O.matrixWorld.elements[14]),y.applyMatrix4(F.matrixWorldInverse),y.applyProjection(F.projectionMatrix),xa.copy(y),ab.x=G.x+xa.x*J+J-8,ab.y=G.y+xa.y*Ma+Ma-8,!0===Ea.containsPoint(ab)){h.activeTexture(n.TEXTURE0);h.bindTexture(n.TEXTURE_2D,null);h.activeTexture(n.TEXTURE1);h.bindTexture(n.TEXTURE_2D,x);n.copyTexImage2D(n.TEXTURE_2D,0,n.RGB,ab.x,ab.y,16,16,0);n.uniform1i(c,0);n.uniform2f(k,ea.x,ea.y);n.uniform3f(m,xa.x,xa.y,xa.z);h.disable(n.BLEND);h.enable(n.DEPTH_TEST);n.drawElements(n.TRIANGLES,
	      6,n.UNSIGNED_SHORT,0);h.activeTexture(n.TEXTURE0);h.bindTexture(n.TEXTURE_2D,T);n.copyTexImage2D(n.TEXTURE_2D,0,n.RGBA,ab.x,ab.y,16,16,0);n.uniform1i(c,1);h.disable(n.DEPTH_TEST);h.activeTexture(n.TEXTURE1);h.bindTexture(n.TEXTURE_2D,x);n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0);O.positionScreen.copy(xa);O.customUpdateCallback?O.customUpdateCallback(O):O.updateLensFlares();n.uniform1i(c,2);h.enable(n.BLEND);for(var Q=0,Re=O.lensFlares.length;Q<Re;Q++){var V=O.lensFlares[Q];.001<V.opacity&&.001<
	    V.scale&&(xa.x=V.x,xa.y=V.y,xa.z=V.z,N=V.size*V.scale/G.w,ea.x=N*E,ea.y=N,n.uniform3f(m,xa.x,xa.y,xa.z),n.uniform2f(k,ea.x,ea.y),n.uniform1f(l,V.rotation),n.uniform1f(f,V.opacity),n.uniform3f(g,V.color.r,V.color.g,V.color.b),h.setBlending(V.blending,V.blendEquation,V.blendSrc,V.blendDst),a.setTexture2D(V.texture,1),n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0))}}h.enable(n.CULL_FACE);h.enable(n.DEPTH_TEST);h.setDepthWrite(!0);a.resetGLState()}}}function Se(a,b){var c,d,e,f,g,k,l,m,u,h,n,r,t,v,
	    A,w,x;function T(a,b){return a.renderOrder!==b.renderOrder?a.renderOrder-b.renderOrder:a.z!==b.z?b.z-a.z:b.id-a.id}var y=a.context,F=a.state,G,E,J,Ma,N=new q,ea=new ca,xa=new q;this.render=function(q,Ea){if(0!==b.length){if(void 0===J){var L=new Float32Array([-.5,-.5,0,0,.5,-.5,1,0,.5,.5,1,1,-.5,.5,0,1]),M=new Uint16Array([0,1,2,0,2,3]);G=y.createBuffer();E=y.createBuffer();y.bindBuffer(y.ARRAY_BUFFER,G);y.bufferData(y.ARRAY_BUFFER,L,y.STATIC_DRAW);y.bindBuffer(y.ELEMENT_ARRAY_BUFFER,E);y.bufferData(y.ELEMENT_ARRAY_BUFFER,
	    M,y.STATIC_DRAW);var L=y.createProgram(),M=y.createShader(y.VERTEX_SHADER),O=y.createShader(y.FRAGMENT_SHADER);y.shaderSource(M,["precision "+a.getPrecision()+" float;","uniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position * scale;\nvec2 rotatedPosition;\nrotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\nrotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\nvec4 finalPosition;\nfinalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition;\nfinalPosition = projectionMatrix * finalPosition;\ngl_Position = finalPosition;\n}"].join("\n"));
	    y.shaderSource(O,["precision "+a.getPrecision()+" float;","uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\nif ( texture.a < alphaTest ) discard;\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\nif ( fogType > 0 ) {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = 0.0;\nif ( fogType == 1 ) {\nfogFactor = smoothstep( fogNear, fogFar, depth );\n} else {\nconst float LOG2 = 1.442695;\nfogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n}\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}"].join("\n"));
	    y.compileShader(M);y.compileShader(O);y.attachShader(L,M);y.attachShader(L,O);y.linkProgram(L);J=L;w=y.getAttribLocation(J,"position");x=y.getAttribLocation(J,"uv");c=y.getUniformLocation(J,"uvOffset");d=y.getUniformLocation(J,"uvScale");e=y.getUniformLocation(J,"rotation");f=y.getUniformLocation(J,"scale");g=y.getUniformLocation(J,"color");k=y.getUniformLocation(J,"map");l=y.getUniformLocation(J,"opacity");m=y.getUniformLocation(J,"modelViewMatrix");u=y.getUniformLocation(J,"projectionMatrix");h=
	      y.getUniformLocation(J,"fogType");n=y.getUniformLocation(J,"fogDensity");r=y.getUniformLocation(J,"fogNear");t=y.getUniformLocation(J,"fogFar");v=y.getUniformLocation(J,"fogColor");A=y.getUniformLocation(J,"alphaTest");L=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");L.width=8;L.height=8;M=L.getContext("2d");M.fillStyle="white";M.fillRect(0,0,8,8);Ma=new ba(L);Ma.needsUpdate=!0}y.useProgram(J);F.initAttributes();F.enableAttribute(w);F.enableAttribute(x);F.disableUnusedAttributes();
	    F.disable(y.CULL_FACE);F.enable(y.BLEND);y.bindBuffer(y.ARRAY_BUFFER,G);y.vertexAttribPointer(w,2,y.FLOAT,!1,16,0);y.vertexAttribPointer(x,2,y.FLOAT,!1,16,8);y.bindBuffer(y.ELEMENT_ARRAY_BUFFER,E);y.uniformMatrix4fv(u,!1,Ea.projectionMatrix.elements);F.activeTexture(y.TEXTURE0);y.uniform1i(k,0);M=L=0;(O=q.fog)?(y.uniform3f(v,O.color.r,O.color.g,O.color.b),O&&O.isFog?(y.uniform1f(r,O.near),y.uniform1f(t,O.far),y.uniform1i(h,1),M=L=1):O&&O.isFogExp2&&(y.uniform1f(n,O.density),y.uniform1i(h,2),M=L=2)):
	      (y.uniform1i(h,0),M=L=0);for(var O=0,Q=b.length;O<Q;O++){var C=b[O];C.modelViewMatrix.multiplyMatrices(Ea.matrixWorldInverse,C.matrixWorld);C.z=-C.modelViewMatrix.elements[14]}b.sort(T);for(var V=[],O=0,Q=b.length;O<Q;O++){var C=b[O],W=C.material;!1!==W.visible&&(y.uniform1f(A,W.alphaTest),y.uniformMatrix4fv(m,!1,C.modelViewMatrix.elements),C.matrixWorld.decompose(N,ea,xa),V[0]=xa.x,V[1]=xa.y,C=0,q.fog&&W.fog&&(C=M),L!==C&&(y.uniform1i(h,C),L=C),null!==W.map?(y.uniform2f(c,W.map.offset.x,W.map.offset.y),
	      y.uniform2f(d,W.map.repeat.x,W.map.repeat.y)):(y.uniform2f(c,0,0),y.uniform2f(d,1,1)),y.uniform1f(l,W.opacity),y.uniform3f(g,W.color.r,W.color.g,W.color.b),y.uniform1f(e,W.rotation),y.uniform2fv(f,V),F.setBlending(W.blending,W.blendEquation,W.blendSrc,W.blendDst),F.setDepthTest(W.depthTest),F.setDepthWrite(W.depthWrite),W.map?a.setTexture2D(W.map,0):a.setTexture2D(Ma,0),y.drawElements(y.TRIANGLES,6,y.UNSIGNED_SHORT,0))}F.enable(y.CULL_FACE);a.resetGLState()}}}function S(){Object.defineProperty(this,
	    "id",{value:Zd++});this.uuid=h.Math.generateUUID();this.name="";this.type="Material";this.lights=this.fog=!0;this.blending=1;this.side=0;this.shading=2;this.vertexColors=0;this.opacity=1;this.transparent=!1;this.blendSrc=204;this.blendDst=205;this.blendEquation=100;this.blendEquationAlpha=this.blendDstAlpha=this.blendSrcAlpha=null;this.depthFunc=3;this.depthWrite=this.depthTest=!0;this.clippingPlanes=null;this.clipShadows=!1;this.colorWrite=!0;this.precision=null;this.polygonOffset=!1;this.alphaTest=
	    this.polygonOffsetUnits=this.polygonOffsetFactor=0;this.premultipliedAlpha=!1;this.overdraw=0;this._needsUpdate=this.visible=!0}function Da(a){S.call(this);this.type="ShaderMaterial";this.defines={};this.uniforms={};this.vertexShader="void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";this.fragmentShader="void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}";this.linewidth=1;this.wireframe=!1;this.wireframeLinewidth=1;this.morphNormals=this.morphTargets=
	    this.skinning=this.clipping=this.lights=this.fog=!1;this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1};this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]};this.index0AttributeName=void 0;void 0!==a&&(void 0!==a.attributes&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(a))}function Ua(a){S.call(this);this.type="MeshDepthMaterial";this.depthPacking=3200;this.morphTargets=this.skinning=
	    !1;this.displacementMap=this.alphaMap=this.map=null;this.displacementScale=1;this.displacementBias=0;this.wireframe=!1;this.wireframeLinewidth=1;this.lights=this.fog=!1;this.setValues(a)}function Ha(a,b){this.min=void 0!==a?a:new q(Infinity,Infinity,Infinity);this.max=void 0!==b?b:new q(-Infinity,-Infinity,-Infinity)}function Aa(a,b){this.center=void 0!==a?a:new q;this.radius=void 0!==b?b:0}function ya(){this.elements=new Float32Array([1,0,0,0,1,0,0,0,1]);0<arguments.length&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}
	  function fa(a,b){this.normal=void 0!==a?a:new q(1,0,0);this.constant=void 0!==b?b:0}function dc(a,b,c,d,e,f){this.planes=[void 0!==a?a:new fa,void 0!==b?b:new fa,void 0!==c?c:new fa,void 0!==d?d:new fa,void 0!==e?e:new fa,void 0!==f?f:new fa]}function $d(a,b,c,d){function e(b,c,d,e){var f=b.geometry,g;g=A;var k=b.customDepthMaterial;d&&(g=w,k=b.customDistanceMaterial);k?g=k:(k=!1,c.morphTargets&&(f&&f.isBufferGeometry?k=f.morphAttributes&&f.morphAttributes.position&&0<f.morphAttributes.position.length:
	  f&&f.isGeometry&&(k=f.morphTargets&&0<f.morphTargets.length)),b=b.isSkinnedMesh&&c.skinning,f=0,k&&(f|=1),b&&(f|=2),g=g[f]);a.localClippingEnabled&&!0===c.clipShadows&&0!==c.clippingPlanes.length&&(f=g.uuid,k=c.uuid,b=x[f],void 0===b&&(b={},x[f]=b),f=b[k],void 0===f&&(f=g.clone(),b[k]=f),g=f);g.visible=c.visible;g.wireframe=c.wireframe;k=c.side;ea.renderSingleSided&&2==k&&(k=0);ea.renderReverseSided&&(0===k?k=1:1===k&&(k=0));g.side=k;g.clipShadows=c.clipShadows;g.clippingPlanes=c.clippingPlanes;g.wireframeLinewidth=
	    c.wireframeLinewidth;g.linewidth=c.linewidth;d&&void 0!==g.uniforms.lightPos&&g.uniforms.lightPos.value.copy(e);return g}function f(a,b,c){if(!1!==a.visible){0!==(a.layers.mask&b.layers.mask)&&(a.isMesh||a.isLine||a.isPoints)&&a.castShadow&&(!1===a.frustumCulled||!0===l.intersectsObject(a))&&!0===a.material.visible&&(a.modelViewMatrix.multiplyMatrices(c.matrixWorldInverse,a.matrixWorld),v.push(a));a=a.children;for(var d=0,e=a.length;d<e;d++)f(a[d],b,c)}}var g=a.context,k=a.state,l=new dc,m=new P,
	    u=b.shadows,p=new C,n=new C(d.maxTextureSize,d.maxTextureSize),r=new q,t=new q,v=[],A=Array(4),w=Array(4),x={},T=[new q(1,0,0),new q(-1,0,0),new q(0,0,1),new q(0,0,-1),new q(0,1,0),new q(0,-1,0)],y=[new q(0,1,0),new q(0,1,0),new q(0,1,0),new q(0,1,0),new q(0,0,1),new q(0,0,-1)],F=[new da,new da,new da,new da,new da,new da];b=new Ua;b.depthPacking=3201;b.clipping=!0;d=Cb.distanceRGBA;for(var G=h.UniformsUtils.clone(d.uniforms),E=0;4!==E;++E){var J=0!==(E&1),Ma=0!==(E&2),N=b.clone();N.morphTargets=
	    J;N.skinning=Ma;A[E]=N;J=new Da({defines:{USE_SHADOWMAP:""},uniforms:G,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,morphTargets:J,skinning:Ma,clipping:!0});w[E]=J}var ea=this;this.enabled=!1;this.autoUpdate=!0;this.needsUpdate=!1;this.type=1;this.renderSingleSided=this.renderReverseSided=!0;this.render=function(b,d){if(!1!==ea.enabled&&(!1!==ea.autoUpdate||!1!==ea.needsUpdate)&&0!==u.length){k.clearColor(1,1,1,1);k.disable(g.BLEND);k.setDepthTest(!0);k.setScissorTest(!1);for(var h,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      x,w=0,A=u.length;w<A;w++){var q=u[w],G=q.shadow;if(void 0===G)console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");else{var E=G.camera;p.copy(G.mapSize);p.min(n);if(q&&q.isPointLight){h=6;x=!0;var J=p.x,N=p.y;F[0].set(2*J,N,J,N);F[1].set(0,N,J,N);F[2].set(3*J,N,J,N);F[3].set(J,N,J,N);F[4].set(3*J,0,J,N);F[5].set(J,0,J,N);p.x*=4;p.y*=2}else h=1,x=!1;null===G.map&&(G.map=new zb(p.x,p.y,{minFilter:1003,magFilter:1003,format:1023}),E.updateProjectionMatrix());G&&G.isSpotLightShadow&&G.update(q);J=
	    G.map;G=G.matrix;t.setFromMatrixPosition(q.matrixWorld);E.position.copy(t);a.setRenderTarget(J);a.clear();for(J=0;J<h;J++){x?(r.copy(E.position),r.add(T[J]),E.up.copy(y[J]),E.lookAt(r),k.viewport(F[J])):(r.setFromMatrixPosition(q.target.matrixWorld),E.lookAt(r));E.updateMatrixWorld();E.matrixWorldInverse.getInverse(E.matrixWorld);G.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);G.multiply(E.projectionMatrix);G.multiply(E.matrixWorldInverse);m.multiplyMatrices(E.projectionMatrix,E.matrixWorldInverse);
	    l.setFromMatrix(m);v.length=0;f(b,d,E);for(var N=0,Ma=v.length;N<Ma;N++){var C=v[N],z=c.update(C),D=C.material;if(D&&D.isMultiMaterial)for(var Va=z.groups,D=D.materials,ld=0,Ba=Va.length;ld<Ba;ld++){var Qa=Va[ld],Na=D[Qa.materialIndex];!0===Na.visible&&(Na=e(C,Na,x,t),a.renderBufferDirect(E,null,z,Na,C,Qa))}else Na=e(C,D,x,t),a.renderBufferDirect(E,null,z,Na,C,null)}}}}h=a.getClearColor();x=a.getClearAlpha();a.setClearColor(h,x);ea.needsUpdate=!1}}}function Wa(a,b){this.origin=void 0!==a?a:new q;
	    this.direction=void 0!==b?b:new q}function Xa(a,b,c,d){this._x=a||0;this._y=b||0;this._z=c||0;this._order=d||Xa.DefaultOrder}function Kc(){this.mask=1}function D(){Object.defineProperty(this,"id",{value:ae++});this.uuid=h.Math.generateUUID();this.name="";this.type="Object3D";this.parent=null;this.children=[];this.up=D.DefaultUp.clone();var a=new q,b=new Xa,c=new ca,d=new q(1,1,1);b.onChange(function(){c.setFromEuler(b,!1)});c.onChange(function(){b.setFromQuaternion(c,void 0,!1)});Object.defineProperties(this,
	    {position:{enumerable:!0,value:a},rotation:{enumerable:!0,value:b},quaternion:{enumerable:!0,value:c},scale:{enumerable:!0,value:d},modelViewMatrix:{value:new P},normalMatrix:{value:new ya}});this.matrix=new P;this.matrixWorld=new P;this.matrixAutoUpdate=D.DefaultMatrixAutoUpdate;this.matrixWorldNeedsUpdate=!1;this.layers=new Kc;this.visible=!0;this.receiveShadow=this.castShadow=!1;this.frustumCulled=!0;this.renderOrder=0;this.userData={};this.onBeforeRender=null}function cb(a,b){this.start=void 0!==
	  a?a:new q;this.end=void 0!==b?b:new q}function Fa(a,b,c){this.a=void 0!==a?a:new q;this.b=void 0!==b?b:new q;this.c=void 0!==c?c:new q}function ga(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d&&d.isVector3?d:new q;this.vertexNormals=Array.isArray(d)?d:[];this.color=e&&e.isColor?e:new H;this.vertexColors=Array.isArray(e)?e:[];this.materialIndex=void 0!==f?f:0}function Ia(a){S.call(this);this.type="MeshBasicMaterial";this.color=new H(16777215);this.aoMap=this.map=null;this.aoMapIntensity=1;
	    this.envMap=this.alphaMap=this.specularMap=null;this.combine=0;this.reflectivity=1;this.refractionRatio=.98;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.lights=this.morphTargets=this.skinning=!1;this.setValues(a)}function z(a,b,c){if(Array.isArray(a))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.uuid=h.Math.generateUUID();this.array=a;this.itemSize=b;this.count=void 0!==a?a.length/b:0;this.normalized=!0===
	    c;this.dynamic=!1;this.updateRange={offset:0,count:-1};this.version=0}function be(a,b){return new z(new Uint16Array(a),b)}function ce(a,b){return new z(new Uint32Array(a),b)}function ma(a,b){return new z(new Float32Array(a),b)}function R(){Object.defineProperty(this,"id",{value:Lc++});this.uuid=h.Math.generateUUID();this.name="";this.type="Geometry";this.vertices=[];this.colors=[];this.faces=[];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=
	    [];this.lineDistances=[];this.boundingSphere=this.boundingBox=null;this.groupsNeedUpdate=this.lineDistancesNeedUpdate=this.colorsNeedUpdate=this.normalsNeedUpdate=this.uvsNeedUpdate=this.verticesNeedUpdate=this.elementsNeedUpdate=!1}function de(){Object.defineProperty(this,"id",{value:Lc++});this.uuid=h.Math.generateUUID();this.name="";this.type="DirectGeometry";this.indices=[];this.vertices=[];this.normals=[];this.colors=[];this.uvs=[];this.uvs2=[];this.groups=[];this.morphTargets={};this.skinWeights=
	    [];this.skinIndices=[];this.boundingSphere=this.boundingBox=null;this.groupsNeedUpdate=this.uvsNeedUpdate=this.colorsNeedUpdate=this.normalsNeedUpdate=this.verticesNeedUpdate=!1}function I(){Object.defineProperty(this,"id",{value:Lc++});this.uuid=h.Math.generateUUID();this.name="";this.type="BufferGeometry";this.index=null;this.attributes={};this.morphAttributes={};this.groups=[];this.boundingSphere=this.boundingBox=null;this.drawRange={start:0,count:Infinity}}function va(a,b){D.call(this);this.type=
	    "Mesh";this.geometry=void 0!==a?a:new I;this.material=void 0!==b?b:new Ia({color:16777215*Math.random()});this.drawMode=0;this.updateMorphTargets()}function db(a,b,c,d,e,f){function g(a,b,c,d,e,f,g,l,m,C,D){var z=f/m,L=g/C,M=f/2,O=g/2,Q=l/2;g=m+1;for(var H=C+1,V=f=0,W=new q,K=0;K<H;K++)for(var P=K*L-O,I=0;I<g;I++)W[a]=(I*z-M)*d,W[b]=P*e,W[c]=Q,h[t]=W.x,h[t+1]=W.y,h[t+2]=W.z,W[a]=0,W[b]=0,W[c]=0<l?1:-1,n[t]=W.x,n[t+1]=W.y,n[t+2]=W.z,r[v]=I/m,r[v+1]=1-K/C,t+=3,v+=2,f+=1;for(K=0;K<C;K++)for(I=0;I<m;I++)a=
	    w+I+g*(K+1),b=w+(I+1)+g*(K+1),c=w+(I+1)+g*K,u[A]=w+I+g*K,u[A+1]=a,u[A+2]=c,u[A+3]=a,u[A+4]=b,u[A+5]=c,A+=6,V+=6;k.addGroup(x,V,D);x+=V;w+=f}I.call(this);this.type="BoxBufferGeometry";this.parameters={width:a,height:b,depth:c,widthSegments:d,heightSegments:e,depthSegments:f};var k=this;d=Math.floor(d)||1;e=Math.floor(e)||1;f=Math.floor(f)||1;var l=function(a,b,c){return a=0+(a+1)*(b+1)*2+(a+1)*(c+1)*2+(c+1)*(b+1)*2}(d,e,f),m=function(a,b,c){a=0+a*b*2+a*c*2+c*b*2;return 6*a}(d,e,f),u=new (65535<m?Uint32Array:
	    Uint16Array)(m),h=new Float32Array(3*l),n=new Float32Array(3*l),r=new Float32Array(2*l),t=0,v=0,A=0,w=0,x=0;g("z","y","x",-1,-1,c,b,a,f,e,0);g("z","y","x",1,-1,c,b,-a,f,e,1);g("x","z","y",1,1,a,c,b,d,f,2);g("x","z","y",1,-1,a,c,-b,d,f,3);g("x","y","z",1,-1,a,b,c,d,e,4);g("x","y","z",-1,-1,a,b,-c,d,e,5);this.setIndex(new z(u,1));this.addAttribute("position",new z(h,3));this.addAttribute("normal",new z(n,3));this.addAttribute("uv",new z(r,2))}function eb(a,b,c,d){I.call(this);this.type="PlaneBufferGeometry";
	    this.parameters={width:a,height:b,widthSegments:c,heightSegments:d};var e=a/2,f=b/2;c=Math.floor(c)||1;d=Math.floor(d)||1;var g=c+1,k=d+1,l=a/c,m=b/d;b=new Float32Array(g*k*3);a=new Float32Array(g*k*3);for(var u=new Float32Array(g*k*2),h=0,n=0,r=0;r<k;r++)for(var t=r*m-f,v=0;v<g;v++)b[h]=v*l-e,b[h+1]=-t,a[h+2]=1,u[n]=v/c,u[n+1]=1-r/d,h+=3,n+=2;h=0;e=new (65535<b.length/3?Uint32Array:Uint16Array)(c*d*6);for(r=0;r<d;r++)for(v=0;v<c;v++)f=v+g*(r+1),k=v+1+g*(r+1),l=v+1+g*r,e[h]=v+g*r,e[h+1]=f,e[h+2]=
	      l,e[h+3]=f,e[h+4]=k,e[h+5]=l,h+=6;this.setIndex(new z(e,1));this.addAttribute("position",new z(b,3));this.addAttribute("normal",new z(a,3));this.addAttribute("uv",new z(u,2))}function qa(){D.call(this);this.type="Camera";this.matrixWorldInverse=new P;this.projectionMatrix=new P}function Ca(a,b,c,d){qa.call(this);this.type="PerspectiveCamera";this.fov=void 0!==a?a:50;this.zoom=1;this.near=void 0!==c?c:.1;this.far=void 0!==d?d:2E3;this.focus=10;this.aspect=void 0!==b?b:1;this.view=null;this.filmGauge=
	    35;this.filmOffset=0;this.updateProjectionMatrix()}function Db(a,b,c,d,e,f){qa.call(this);this.type="OrthographicCamera";this.zoom=1;this.view=null;this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=void 0!==e?e:.1;this.far=void 0!==f?f:2E3;this.updateProjectionMatrix()}function Te(a,b,c){var d,e,f;return{setMode:function(a){d=a},setIndex:function(c){c.array instanceof Uint32Array&&b.get("OES_element_index_uint")?(e=a.UNSIGNED_INT,f=4):(e=a.UNSIGNED_SHORT,f=2)},render:function(b,k){a.drawElements(d,
	    k,e,b*f);c.calls++;c.vertices+=k;d===a.TRIANGLES&&(c.faces+=k/3)},renderInstances:function(g,k,l){var m=b.get("ANGLE_instanced_arrays");null===m?console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays."):(m.drawElementsInstancedANGLE(d,l,e,k*f,g.maxInstancedCount),c.calls++,c.vertices+=l*g.maxInstancedCount,d===a.TRIANGLES&&(c.faces+=g.maxInstancedCount*l/3))}}}function Ue(a,b,c){var d;return{setMode:function(a){d=
	    a},render:function(b,f){a.drawArrays(d,b,f);c.calls++;c.vertices+=f;d===a.TRIANGLES&&(c.faces+=f/3)},renderInstances:function(e){var f=b.get("ANGLE_instanced_arrays");if(null===f)console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");else{var g=e.attributes.position,g=g&&g.isInterleavedBufferAttribute?g.data.count:g.count;f.drawArraysInstancedANGLE(d,0,g,e.maxInstancedCount);c.calls++;c.vertices+=g*e.maxInstancedCount;
	    d===a.TRIANGLES&&(c.faces+=e.maxInstancedCount*g/3)}}}}function Ve(){var a={};return{get:function(b){if(void 0!==a[b.id])return a[b.id];var c;switch(b.type){case "DirectionalLight":c={direction:new q,color:new H,shadow:!1,shadowBias:0,shadowRadius:1,shadowMapSize:new C};break;case "SpotLight":c={position:new q,direction:new q,color:new H,distance:0,coneCos:0,penumbraCos:0,decay:0,shadow:!1,shadowBias:0,shadowRadius:1,shadowMapSize:new C};break;case "PointLight":c={position:new q,color:new H,distance:0,
	    decay:0,shadow:!1,shadowBias:0,shadowRadius:1,shadowMapSize:new C};break;case "HemisphereLight":c={direction:new q,skyColor:new H,groundColor:new H}}return a[b.id]=c}}}function We(a){a=a.split("\n");for(var b=0;b<a.length;b++)a[b]=b+1+": "+a[b];return a.join("\n")}function ee(a,b,c){var d=a.createShader(b);a.shaderSource(d,c);a.compileShader(d);!1===a.getShaderParameter(d,a.COMPILE_STATUS)&&console.error("THREE.WebGLShader: Shader couldn't compile.");""!==a.getShaderInfoLog(d)&&console.warn("THREE.WebGLShader: gl.getShaderInfoLog()",
	    b===a.VERTEX_SHADER?"vertex":"fragment",a.getShaderInfoLog(d),We(c));return d}function fe(a){switch(a){case 3E3:return["Linear","( value )"];case 3001:return["sRGB","( value )"];case 3002:return["RGBE","( value )"];case 3004:return["RGBM","( value, 7.0 )"];case 3005:return["RGBM","( value, 16.0 )"];case 3006:return["RGBD","( value, 256.0 )"];case 3007:return["Gamma","( value, float( GAMMA_FACTOR ) )"];default:throw Error("unsupported encoding: "+a);}}function md(a,b){var c=fe(b);return"vec4 "+a+"( vec4 value ) { return "+
	    c[0]+"ToLinear"+c[1]+"; }"}function Xe(a,b){var c=fe(b);return"vec4 "+a+"( vec4 value ) { return LinearTo"+c[0]+c[1]+"; }"}function Ye(a,b){var c;switch(b){case 1:c="Linear";break;case 2:c="Reinhard";break;case 3:c="Uncharted2";break;case 4:c="OptimizedCineon";break;default:throw Error("unsupported toneMapping: "+b);}return"vec3 "+a+"( vec3 color ) { return "+c+"ToneMapping( color ); }"}function Ze(a,b,c){a=a||{};return[a.derivatives||b.envMapCubeUV||b.bumpMap||b.normalMap||b.flatShading?"#extension GL_OES_standard_derivatives : enable":
	    "",(a.fragDepth||b.logarithmicDepthBuffer)&&c.get("EXT_frag_depth")?"#extension GL_EXT_frag_depth : enable":"",a.drawBuffers&&c.get("WEBGL_draw_buffers")?"#extension GL_EXT_draw_buffers : require":"",(a.shaderTextureLOD||b.envMap)&&c.get("EXT_shader_texture_lod")?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ec).join("\n")}function $e(a){var b=[],c;for(c in a){var d=a[c];!1!==d&&b.push("#define "+c+" "+d)}return b.join("\n")}function ec(a){return""!==a}function ge(a,b){return a.replace(/NUM_DIR_LIGHTS/g,
	    b.numDirLights).replace(/NUM_SPOT_LIGHTS/g,b.numSpotLights).replace(/NUM_POINT_LIGHTS/g,b.numPointLights).replace(/NUM_HEMI_LIGHTS/g,b.numHemiLights)}function nd(a){return a.replace(/#include +<([\w\d.]+)>/g,function(a,c){var d=Z[c];if(void 0===d)throw Error("Can not resolve #include <"+c+">");return nd(d)})}function he(a){return a.replace(/for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,function(a,c,d,e){a="";for(c=parseInt(c);c<parseInt(d);c++)a+=e.replace(/\[ i \]/g,"[ "+c+
	    " ]");return a})}function af(a,b,c,d){var e=a.context,f=c.extensions,g=c.defines,k=c.__webglShader.vertexShader,l=c.__webglShader.fragmentShader,m="SHADOWMAP_TYPE_BASIC";1===d.shadowMapType?m="SHADOWMAP_TYPE_PCF":2===d.shadowMapType&&(m="SHADOWMAP_TYPE_PCF_SOFT");var h="ENVMAP_TYPE_CUBE",p="ENVMAP_MODE_REFLECTION",n="ENVMAP_BLENDING_MULTIPLY";if(d.envMap){switch(c.envMap.mapping){case 301:case 302:h="ENVMAP_TYPE_CUBE";break;case 306:case 307:h="ENVMAP_TYPE_CUBE_UV";break;case 303:case 304:h="ENVMAP_TYPE_EQUIREC";
	    break;case 305:h="ENVMAP_TYPE_SPHERE"}switch(c.envMap.mapping){case 302:case 304:p="ENVMAP_MODE_REFRACTION"}switch(c.combine){case 0:n="ENVMAP_BLENDING_MULTIPLY";break;case 1:n="ENVMAP_BLENDING_MIX";break;case 2:n="ENVMAP_BLENDING_ADD"}}var r=0<a.gammaFactor?a.gammaFactor:1,f=Ze(f,d,a.extensions),t=$e(g),v=e.createProgram();c.isRawShaderMaterial?(g=[t,"\n"].filter(ec).join("\n"),m=[f,t,"\n"].filter(ec).join("\n")):(g=["precision "+d.precision+" float;","precision "+d.precision+" int;","#define SHADER_NAME "+
	  c.__webglShader.name,t,d.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define GAMMA_FACTOR "+r,"#define MAX_BONES "+d.maxBones,d.map?"#define USE_MAP":"",d.envMap?"#define USE_ENVMAP":"",d.envMap?"#define "+p:"",d.lightMap?"#define USE_LIGHTMAP":"",d.aoMap?"#define USE_AOMAP":"",d.emissiveMap?"#define USE_EMISSIVEMAP":"",d.bumpMap?"#define USE_BUMPMAP":"",d.normalMap?"#define USE_NORMALMAP":"",d.displacementMap&&d.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",d.specularMap?"#define USE_SPECULARMAP":
	    "",d.roughnessMap?"#define USE_ROUGHNESSMAP":"",d.metalnessMap?"#define USE_METALNESSMAP":"",d.alphaMap?"#define USE_ALPHAMAP":"",d.vertexColors?"#define USE_COLOR":"",d.flatShading?"#define FLAT_SHADED":"",d.skinning?"#define USE_SKINNING":"",d.useVertexTexture?"#define BONE_TEXTURE":"",d.morphTargets?"#define USE_MORPHTARGETS":"",d.morphNormals&&!1===d.flatShading?"#define USE_MORPHNORMALS":"",d.doubleSided?"#define DOUBLE_SIDED":"",d.flipSided?"#define FLIP_SIDED":"","#define NUM_CLIPPING_PLANES "+
	  d.numClippingPlanes,d.shadowMapEnabled?"#define USE_SHADOWMAP":"",d.shadowMapEnabled?"#define "+m:"",d.sizeAttenuation?"#define USE_SIZEATTENUATION":"",d.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",d.logarithmicDepthBuffer&&a.extensions.get("EXT_frag_depth")?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","attribute vec3 position;",
	    "attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_COLOR","\tattribute vec3 color;","#endif","#ifdef USE_MORPHTARGETS","\tattribute vec3 morphTarget0;","\tattribute vec3 morphTarget1;","\tattribute vec3 morphTarget2;","\tattribute vec3 morphTarget3;","\t#ifdef USE_MORPHNORMALS","\t\tattribute vec3 morphNormal0;","\t\tattribute vec3 morphNormal1;","\t\tattribute vec3 morphNormal2;","\t\tattribute vec3 morphNormal3;","\t#else","\t\tattribute vec3 morphTarget4;","\t\tattribute vec3 morphTarget5;",
	    "\t\tattribute vec3 morphTarget6;","\t\tattribute vec3 morphTarget7;","\t#endif","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif","\n"].filter(ec).join("\n"),m=[f,"precision "+d.precision+" float;","precision "+d.precision+" int;","#define SHADER_NAME "+c.__webglShader.name,t,d.alphaTest?"#define ALPHATEST "+d.alphaTest:"","#define GAMMA_FACTOR "+r,d.useFog&&d.fog?"#define USE_FOG":"",d.useFog&&d.fogExp?"#define FOG_EXP2":"",d.map?"#define USE_MAP":
	    "",d.envMap?"#define USE_ENVMAP":"",d.envMap?"#define "+h:"",d.envMap?"#define "+p:"",d.envMap?"#define "+n:"",d.lightMap?"#define USE_LIGHTMAP":"",d.aoMap?"#define USE_AOMAP":"",d.emissiveMap?"#define USE_EMISSIVEMAP":"",d.bumpMap?"#define USE_BUMPMAP":"",d.normalMap?"#define USE_NORMALMAP":"",d.specularMap?"#define USE_SPECULARMAP":"",d.roughnessMap?"#define USE_ROUGHNESSMAP":"",d.metalnessMap?"#define USE_METALNESSMAP":"",d.alphaMap?"#define USE_ALPHAMAP":"",d.vertexColors?"#define USE_COLOR":
	    "",d.flatShading?"#define FLAT_SHADED":"",d.doubleSided?"#define DOUBLE_SIDED":"",d.flipSided?"#define FLIP_SIDED":"","#define NUM_CLIPPING_PLANES "+d.numClippingPlanes,d.shadowMapEnabled?"#define USE_SHADOWMAP":"",d.shadowMapEnabled?"#define "+m:"",d.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",d.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",d.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",d.logarithmicDepthBuffer&&a.extensions.get("EXT_frag_depth")?"#define USE_LOGDEPTHBUF_EXT":
	    "",d.envMap&&a.extensions.get("EXT_shader_texture_lod")?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;",0!==d.toneMapping?"#define TONE_MAPPING":"",0!==d.toneMapping?Z.tonemapping_pars_fragment:"",0!==d.toneMapping?Ye("toneMapping",d.toneMapping):"",d.outputEncoding||d.mapEncoding||d.envMapEncoding||d.emissiveMapEncoding?Z.encodings_pars_fragment:"",d.mapEncoding?md("mapTexelToLinear",d.mapEncoding):"",d.envMapEncoding?md("envMapTexelToLinear",d.envMapEncoding):
	    "",d.emissiveMapEncoding?md("emissiveMapTexelToLinear",d.emissiveMapEncoding):"",d.outputEncoding?Xe("linearToOutputTexel",d.outputEncoding):"",d.depthPacking?"#define DEPTH_PACKING "+c.depthPacking:"","\n"].filter(ec).join("\n"));k=nd(k,d);k=ge(k,d);l=nd(l,d);l=ge(l,d);c.isShaderMaterial||(k=he(k),l=he(l));l=m+l;k=ee(e,e.VERTEX_SHADER,g+k);l=ee(e,e.FRAGMENT_SHADER,l);e.attachShader(v,k);e.attachShader(v,l);void 0!==c.index0AttributeName?e.bindAttribLocation(v,0,c.index0AttributeName):!0===d.morphTargets&&
	  e.bindAttribLocation(v,0,"position");e.linkProgram(v);d=e.getProgramInfoLog(v);h=e.getShaderInfoLog(k);p=e.getShaderInfoLog(l);r=n=!0;if(!1===e.getProgramParameter(v,e.LINK_STATUS))n=!1,console.error("THREE.WebGLProgram: shader error: ",e.getError(),"gl.VALIDATE_STATUS",e.getProgramParameter(v,e.VALIDATE_STATUS),"gl.getProgramInfoLog",d,h,p);else if(""!==d)console.warn("THREE.WebGLProgram: gl.getProgramInfoLog()",d);else if(""===h||""===p)r=!1;r&&(this.diagnostics={runnable:n,material:c,programLog:d,
	    vertexShader:{log:h,prefix:g},fragmentShader:{log:p,prefix:m}});e.deleteShader(k);e.deleteShader(l);var A;this.getUniforms=function(){void 0===A&&(A=new Ga(e,v,a));return A};var w;this.getAttributes=function(){if(void 0===w){for(var a={},b=e.getProgramParameter(v,e.ACTIVE_ATTRIBUTES),c=0;c<b;c++){var d=e.getActiveAttrib(v,c).name;a[d]=e.getAttribLocation(v,d)}w=a}return w};this.destroy=function(){e.deleteProgram(v);this.program=void 0};Object.defineProperties(this,{uniforms:{get:function(){console.warn("THREE.WebGLProgram: .uniforms is now .getUniforms().");
	    return this.getUniforms()}},attributes:{get:function(){console.warn("THREE.WebGLProgram: .attributes is now .getAttributes().");return this.getAttributes()}}});this.id=bf++;this.code=b;this.usedTimes=1;this.program=v;this.vertexShader=k;this.fragmentShader=l;return this}function cf(a,b){function c(a,b){var c;a?a&&a.isTexture?c=a.encoding:a&&a.isWebGLRenderTarget&&(console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."),
	    c=a.texture.encoding):c=3E3;3E3===c&&b&&(c=3007);return c}var d=[],e={MeshDepthMaterial:"depth",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points"},f="precision supportsVertexTextures map mapEncoding envMap envMapMode envMapEncoding lightMap aoMap emissiveMap emissiveMapEncoding bumpMap normalMap displacementMap specularMap roughnessMap metalnessMap alphaMap combine vertexColors fog useFog fogExp flatShading sizeAttenuation logarithmicDepthBuffer skinning maxBones useVertexTexture morphTargets morphNormals maxMorphTargets maxMorphNormals premultipliedAlpha numDirLights numPointLights numSpotLights numHemiLights shadowMapEnabled shadowMapType toneMapping physicallyCorrectLights alphaTest doubleSided flipSided numClippingPlanes depthPacking".split(" ");
	    this.getParameters=function(d,f,l,m,h){var p=e[d.type],n;b.floatVertexTextures&&h&&h.skeleton&&h.skeleton.useVertexTexture?n=1024:(n=Math.floor((b.maxVertexUniforms-20)/4),void 0!==h&&h&&h.isSkinnedMesh&&(n=Math.min(h.skeleton.bones.length,n),n<h.skeleton.bones.length&&console.warn("WebGLRenderer: too many bones - "+h.skeleton.bones.length+", this GPU supports just "+n+" (try OpenGL instead of ANGLE)")));var r=a.getPrecision();null!==d.precision&&(r=b.getMaxPrecision(d.precision),r!==d.precision&&
	    console.warn("THREE.WebGLProgram.getParameters:",d.precision,"not supported, using",r,"instead."));var t=a.getCurrentRenderTarget();return{shaderID:p,precision:r,supportsVertexTextures:b.vertexTextures,outputEncoding:c(t?t.texture:null,a.gammaOutput),map:!!d.map,mapEncoding:c(d.map,a.gammaInput),envMap:!!d.envMap,envMapMode:d.envMap&&d.envMap.mapping,envMapEncoding:c(d.envMap,a.gammaInput),envMapCubeUV:!!d.envMap&&(306===d.envMap.mapping||307===d.envMap.mapping),lightMap:!!d.lightMap,aoMap:!!d.aoMap,
	      emissiveMap:!!d.emissiveMap,emissiveMapEncoding:c(d.emissiveMap,a.gammaInput),bumpMap:!!d.bumpMap,normalMap:!!d.normalMap,displacementMap:!!d.displacementMap,roughnessMap:!!d.roughnessMap,metalnessMap:!!d.metalnessMap,specularMap:!!d.specularMap,alphaMap:!!d.alphaMap,combine:d.combine,vertexColors:d.vertexColors,fog:!!l,useFog:d.fog,fogExp:l&&l.isFogExp2,flatShading:1===d.shading,sizeAttenuation:d.sizeAttenuation,logarithmicDepthBuffer:b.logarithmicDepthBuffer,skinning:d.skinning,maxBones:n,useVertexTexture:b.floatVertexTextures&&
	      h&&h.skeleton&&h.skeleton.useVertexTexture,morphTargets:d.morphTargets,morphNormals:d.morphNormals,maxMorphTargets:a.maxMorphTargets,maxMorphNormals:a.maxMorphNormals,numDirLights:f.directional.length,numPointLights:f.point.length,numSpotLights:f.spot.length,numHemiLights:f.hemi.length,numClippingPlanes:m,shadowMapEnabled:a.shadowMap.enabled&&h.receiveShadow&&0<f.shadows.length,shadowMapType:a.shadowMap.type,toneMapping:a.toneMapping,physicallyCorrectLights:a.physicallyCorrectLights,premultipliedAlpha:d.premultipliedAlpha,
	      alphaTest:d.alphaTest,doubleSided:2===d.side,flipSided:1===d.side,depthPacking:void 0!==d.depthPacking?d.depthPacking:!1}};this.getProgramCode=function(a,b){var c=[];b.shaderID?c.push(b.shaderID):(c.push(a.fragmentShader),c.push(a.vertexShader));if(void 0!==a.defines)for(var d in a.defines)c.push(d),c.push(a.defines[d]);for(d=0;d<f.length;d++)c.push(b[f[d]]);return c.join()};this.acquireProgram=function(b,c,e){for(var f,h=0,p=d.length;h<p;h++){var n=d[h];if(n.code===e){f=n;++f.usedTimes;break}}void 0===
	    f&&(f=new af(a,e,b,c),d.push(f));return f};this.releaseProgram=function(a){if(0===--a.usedTimes){var b=d.indexOf(a);d[b]=d[d.length-1];d.pop();a.destroy()}};this.programs=d}function df(a,b,c){function d(a){var k=a.target;a=f[k.id];null!==a.index&&e(a.index);var l=a.attributes,m;for(m in l)e(l[m]);k.removeEventListener("dispose",d);delete f[k.id];m=b.get(k);m.wireframe&&e(m.wireframe);b["delete"](k);k=b.get(a);k.wireframe&&e(k.wireframe);b["delete"](a);c.memory.geometries--}function e(c){var d;d=c.isInterleavedBufferAttribute?
	    b.get(c.data).__webglBuffer:b.get(c).__webglBuffer;void 0!==d&&(a.deleteBuffer(d),c.isInterleavedBufferAttribute?b["delete"](c.data):b["delete"](c))}var f={};return{get:function(a){var b=a.geometry;if(void 0!==f[b.id])return f[b.id];b.addEventListener("dispose",d);var e;b.isBufferGeometry?e=b:b.isGeometry&&(void 0===b._bufferGeometry&&(b._bufferGeometry=(new I).setFromObject(a)),e=b._bufferGeometry);f[b.id]=e;c.memory.geometries++;return e}}}function ef(a,b,c){function d(c,d){var e=c.isInterleavedBufferAttribute?
	    c.data:c,l=b.get(e);void 0===l.__webglBuffer?(l.__webglBuffer=a.createBuffer(),a.bindBuffer(d,l.__webglBuffer),a.bufferData(d,e.array,e.dynamic?a.DYNAMIC_DRAW:a.STATIC_DRAW),l.version=e.version):l.version!==e.version&&(a.bindBuffer(d,l.__webglBuffer),!1===e.dynamic||-1===e.updateRange.count?a.bufferSubData(d,0,e.array):0===e.updateRange.count?console.error("THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually."):
	    (a.bufferSubData(d,e.updateRange.offset*e.array.BYTES_PER_ELEMENT,e.array.subarray(e.updateRange.offset,e.updateRange.offset+e.updateRange.count)),e.updateRange.count=0),l.version=e.version)}var e=new df(a,b,c);return{getAttributeBuffer:function(a){return a.isInterleavedBufferAttribute?b.get(a.data).__webglBuffer:b.get(a).__webglBuffer},getWireframeAttribute:function(c){var e=b.get(c);if(void 0!==e.wireframe)return e.wireframe;var k=[],l=c.index,m=c.attributes;c=m.position;if(null!==l)for(var l=l.array,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    m=0,h=l.length;m<h;m+=3){var p=l[m+0],n=l[m+1],r=l[m+2];k.push(p,n,n,r,r,p)}else for(l=m.position.array,m=0,h=l.length/3-1;m<h;m+=3)p=m+0,n=m+1,r=m+2,k.push(p,n,n,r,r,p);k=new z(new (65535<c.count?Uint32Array:Uint16Array)(k),1);d(k,a.ELEMENT_ARRAY_BUFFER);return e.wireframe=k},update:function(b){var c=e.get(b);b.geometry.isGeometry&&c.updateFromObject(b);b=c.index;var k=c.attributes;null!==b&&d(b,a.ELEMENT_ARRAY_BUFFER);for(var l in k)d(k[l],a.ARRAY_BUFFER);b=c.morphAttributes;for(l in b)for(var k=
	    b[l],m=0,h=k.length;m<h;m++)d(k[m],a.ARRAY_BUFFER);return c}}}function ff(a,b,c,d,e,f,g){function k(a,b){if(a.width>b||a.height>b){var c=b/Math.max(a.width,a.height),d=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");d.width=Math.floor(a.width*c);d.height=Math.floor(a.height*c);d.getContext("2d").drawImage(a,0,0,a.width,a.height,0,0,d.width,d.height);console.warn("THREE.WebGLRenderer: image is too big ("+a.width+"x"+a.height+"). Resized to "+d.width+"x"+d.height,a);return d}return a}
	    function l(a){return h.Math.isPowerOfTwo(a.width)&&h.Math.isPowerOfTwo(a.height)}function m(b){return 1003===b||1004===b||1005===b?a.NEAREST:a.LINEAR}function u(b){b=b.target;b.removeEventListener("dispose",u);a:{var c=d.get(b);if(b.image&&c.__image__webglTextureCube)a.deleteTexture(c.__image__webglTextureCube);else{if(void 0===c.__webglInit)break a;a.deleteTexture(c.__webglTexture)}d["delete"](b)}A.textures--}function p(b){b=b.target;b.removeEventListener("dispose",p);var c=d.get(b),e=d.get(b.texture);
	      if(b){void 0!==e.__webglTexture&&a.deleteTexture(e.__webglTexture);b.depthTexture&&b.depthTexture.dispose();if(b&&b.isWebGLRenderTargetCube)for(e=0;6>e;e++)a.deleteFramebuffer(c.__webglFramebuffer[e]),c.__webglDepthbuffer&&a.deleteRenderbuffer(c.__webglDepthbuffer[e]);else a.deleteFramebuffer(c.__webglFramebuffer),c.__webglDepthbuffer&&a.deleteRenderbuffer(c.__webglDepthbuffer);d["delete"](b.texture);d["delete"](b)}A.textures--}function n(b,g){var m=d.get(b);if(0<b.version&&m.__version!==b.version){var n=
	      b.image;if(void 0===n)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined",b);else if(!1===n.complete)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete",b);else{void 0===m.__webglInit&&(m.__webglInit=!0,b.addEventListener("dispose",u),m.__webglTexture=a.createTexture(),A.textures++);c.activeTexture(a.TEXTURE0+g);c.bindTexture(a.TEXTURE_2D,m.__webglTexture);a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,b.flipY);a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
	      b.premultiplyAlpha);a.pixelStorei(a.UNPACK_ALIGNMENT,b.unpackAlignment);var p=k(b.image,e.maxTextureSize);if((1001!==b.wrapS||1001!==b.wrapT||1003!==b.minFilter&&1006!==b.minFilter)&&!1===l(p))if(n=p,n instanceof HTMLImageElement||n instanceof HTMLCanvasElement){var t=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");t.width=h.Math.nearestPowerOfTwo(n.width);t.height=h.Math.nearestPowerOfTwo(n.height);t.getContext("2d").drawImage(n,0,0,t.width,t.height);console.warn("THREE.WebGLRenderer: image is not power of two ("+
	      n.width+"x"+n.height+"). Resized to "+t.width+"x"+t.height,n);p=t}else p=n;var n=l(p),t=f(b.format),v=f(b.type);r(a.TEXTURE_2D,b,n);var q=b.mipmaps;if(b&&b.isDepthTexture){q=a.DEPTH_COMPONENT;if(1015===b.type){if(!w)throw Error("Float Depth Texture only supported in WebGL2.0");q=a.DEPTH_COMPONENT32F}else w&&(q=a.DEPTH_COMPONENT16);1027===b.format&&(q=a.DEPTH_STENCIL);c.texImage2D(a.TEXTURE_2D,0,q,p.width,p.height,0,t,v,null)}else if(b&&b.isDataTexture)if(0<q.length&&n){for(var N=0,C=q.length;N<C;N++)p=
	      q[N],c.texImage2D(a.TEXTURE_2D,N,t,p.width,p.height,0,t,v,p.data);b.generateMipmaps=!1}else c.texImage2D(a.TEXTURE_2D,0,t,p.width,p.height,0,t,v,p.data);else if(b&&b.isCompressedTexture)for(N=0,C=q.length;N<C;N++)p=q[N],1023!==b.format&&1022!==b.format?-1<c.getCompressedTextureFormats().indexOf(t)?c.compressedTexImage2D(a.TEXTURE_2D,N,t,p.width,p.height,0,p.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):c.texImage2D(a.TEXTURE_2D,
	      N,t,p.width,p.height,0,t,v,p.data);else if(0<q.length&&n){N=0;for(C=q.length;N<C;N++)p=q[N],c.texImage2D(a.TEXTURE_2D,N,t,t,v,p);b.generateMipmaps=!1}else c.texImage2D(a.TEXTURE_2D,0,t,t,v,p);b.generateMipmaps&&n&&a.generateMipmap(a.TEXTURE_2D);m.__version=b.version;if(b.onUpdate)b.onUpdate(b);return}}c.activeTexture(a.TEXTURE0+g);c.bindTexture(a.TEXTURE_2D,m.__webglTexture)}function r(c,g,k){k?(a.texParameteri(c,a.TEXTURE_WRAP_S,f(g.wrapS)),a.texParameteri(c,a.TEXTURE_WRAP_T,f(g.wrapT)),a.texParameteri(c,
	      a.TEXTURE_MAG_FILTER,f(g.magFilter)),a.texParameteri(c,a.TEXTURE_MIN_FILTER,f(g.minFilter))):(a.texParameteri(c,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(c,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),1001===g.wrapS&&1001===g.wrapT||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.",g),a.texParameteri(c,a.TEXTURE_MAG_FILTER,m(g.magFilter)),a.texParameteri(c,a.TEXTURE_MIN_FILTER,m(g.minFilter)),1003!==g.minFilter&&
	    1006!==g.minFilter&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.",g));!(k=b.get("EXT_texture_filter_anisotropic"))||1015===g.type&&null===b.get("OES_texture_float_linear")||1016===g.type&&null===b.get("OES_texture_half_float_linear")||!(1<g.anisotropy||d.get(g).__currentAnisotropy)||(a.texParameterf(c,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,e.getMaxAnisotropy())),d.get(g).__currentAnisotropy=
	      g.anisotropy)}function t(b,e,g,k){var l=f(e.texture.format),m=f(e.texture.type);c.texImage2D(k,0,l,e.width,e.height,0,l,m,null);a.bindFramebuffer(a.FRAMEBUFFER,b);a.framebufferTexture2D(a.FRAMEBUFFER,g,k,d.get(e.texture).__webglTexture,0);a.bindFramebuffer(a.FRAMEBUFFER,null)}function v(b,c){a.bindRenderbuffer(a.RENDERBUFFER,b);c.depthBuffer&&!c.stencilBuffer?(a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT16,c.width,c.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,
	      b)):c.depthBuffer&&c.stencilBuffer?(a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_STENCIL,c.width,c.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,b)):a.renderbufferStorage(a.RENDERBUFFER,a.RGBA4,c.width,c.height);a.bindRenderbuffer(a.RENDERBUFFER,null)}var A=g.memory,w="undefined"!==typeof WebGL2RenderingContext&&a instanceof WebGL2RenderingContext;this.setTexture2D=n;this.setTextureCube=function(b,g){var m=d.get(b);if(6===b.image.length)if(0<b.version&&
	      m.__version!==b.version){m.__image__webglTextureCube||(b.addEventListener("dispose",u),m.__image__webglTextureCube=a.createTexture(),A.textures++);c.activeTexture(a.TEXTURE0+g);c.bindTexture(a.TEXTURE_CUBE_MAP,m.__image__webglTextureCube);a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,b.flipY);for(var h=b&&b.isCompressedTexture,n=b.image[0]&&b.image[0].isDataTexture,p=[],t=0;6>t;t++)p[t]=h||n?n?b.image[t].image:b.image[t]:k(b.image[t],e.maxCubemapSize);var v=l(p[0]),q=f(b.format),w=f(b.type);r(a.TEXTURE_CUBE_MAP,
	      b,v);for(t=0;6>t;t++)if(h)for(var C,D=p[t].mipmaps,z=0,L=D.length;z<L;z++)C=D[z],1023!==b.format&&1022!==b.format?-1<c.getCompressedTextureFormats().indexOf(q)?c.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+t,z,q,C.width,C.height,0,C.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):c.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+t,z,q,C.width,C.height,0,q,w,C.data);else n?c.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,q,p[t].width,
	      p[t].height,0,q,w,p[t].data):c.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,q,q,w,p[t]);b.generateMipmaps&&v&&a.generateMipmap(a.TEXTURE_CUBE_MAP);m.__version=b.version;if(b.onUpdate)b.onUpdate(b)}else c.activeTexture(a.TEXTURE0+g),c.bindTexture(a.TEXTURE_CUBE_MAP,m.__image__webglTextureCube)};this.setTextureCubeDynamic=function(b,e){c.activeTexture(a.TEXTURE0+e);c.bindTexture(a.TEXTURE_CUBE_MAP,d.get(b).__webglTexture)};this.setupRenderTarget=function(b){var e=d.get(b),f=d.get(b.texture);b.addEventListener("dispose",
	      p);f.__webglTexture=a.createTexture();A.textures++;var g=b&&b.isWebGLRenderTargetCube,k=l(b);if(g){e.__webglFramebuffer=[];for(var m=0;6>m;m++)e.__webglFramebuffer[m]=a.createFramebuffer()}else e.__webglFramebuffer=a.createFramebuffer();if(g){c.bindTexture(a.TEXTURE_CUBE_MAP,f.__webglTexture);r(a.TEXTURE_CUBE_MAP,b.texture,k);for(m=0;6>m;m++)t(e.__webglFramebuffer[m],b,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+m);b.texture.generateMipmaps&&k&&a.generateMipmap(a.TEXTURE_CUBE_MAP);c.bindTexture(a.TEXTURE_CUBE_MAP,
	      null)}else c.bindTexture(a.TEXTURE_2D,f.__webglTexture),r(a.TEXTURE_2D,b.texture,k),t(e.__webglFramebuffer,b,a.COLOR_ATTACHMENT0,a.TEXTURE_2D),b.texture.generateMipmaps&&k&&a.generateMipmap(a.TEXTURE_2D),c.bindTexture(a.TEXTURE_2D,null);if(b.depthBuffer){e=d.get(b);f=b&&b.isWebGLRenderTargetCube;if(b.depthTexture){if(f)throw Error("target.depthTexture not supported in Cube render targets");if(b&&b.isWebGLRenderTargetCube)throw Error("Depth Texture with cube render targets is not supported!");a.bindFramebuffer(a.FRAMEBUFFER,
	      e.__webglFramebuffer);if(!b.depthTexture||!b.depthTexture.isDepthTexture)throw Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");d.get(b.depthTexture).__webglTexture&&b.depthTexture.image.width===b.width&&b.depthTexture.image.height===b.height||(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0);n(b.depthTexture,0);e=d.get(b.depthTexture).__webglTexture;if(1026===b.depthTexture.format)a.framebufferTexture2D(a.FRAMEBUFFER,
	      a.DEPTH_ATTACHMENT,a.TEXTURE_2D,e,0);else if(1027===b.depthTexture.format)a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,e,0);else throw Error("Unknown depthTexture format");}else if(f)for(e.__webglDepthbuffer=[],f=0;6>f;f++)a.bindFramebuffer(a.FRAMEBUFFER,e.__webglFramebuffer[f]),e.__webglDepthbuffer[f]=a.createRenderbuffer(),v(e.__webglDepthbuffer[f],b);else a.bindFramebuffer(a.FRAMEBUFFER,e.__webglFramebuffer),e.__webglDepthbuffer=a.createRenderbuffer(),v(e.__webglDepthbuffer,
	      b);a.bindFramebuffer(a.FRAMEBUFFER,null)}};this.updateRenderTargetMipmap=function(b){var e=b.texture;e.generateMipmaps&&l(b)&&1003!==e.minFilter&&1006!==e.minFilter&&(b=b&&b.isWebGLRenderTargetCube?a.TEXTURE_CUBE_MAP:a.TEXTURE_2D,e=d.get(e).__webglTexture,c.bindTexture(b,e),a.generateMipmap(b),c.bindTexture(b,null))}}function gf(){var a={};return{get:function(b){b=b.uuid;var c=a[b];void 0===c&&(c={},a[b]=c);return c},"delete":function(b){delete a[b.uuid]},clear:function(){a={}}}}function hf(a,b,c){function d(b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        c,d){var e=new Uint8Array(4),f=a.createTexture();a.bindTexture(b,f);a.texParameteri(b,a.TEXTURE_MIN_FILTER,a.NEAREST);a.texParameteri(b,a.TEXTURE_MAG_FILTER,a.NEAREST);for(b=0;b<d;b++)a.texImage2D(c+b,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,e);return f}function e(b){!0!==F[b]&&(a.enable(b),F[b]=!0)}function f(b){!1!==F[b]&&(a.disable(b),F[b]=!1)}function g(b,d,g,k,l,m,h,n){if(0!==b){e(a.BLEND);if(b!==E||n!==Ea)2===b?n?(a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD),a.blendFuncSeparate(a.ONE,a.ONE,a.ONE,
	    a.ONE)):(a.blendEquation(a.FUNC_ADD),a.blendFunc(a.SRC_ALPHA,a.ONE)):3===b?n?(a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD),a.blendFuncSeparate(a.ZERO,a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ONE_MINUS_SRC_ALPHA)):(a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ZERO,a.ONE_MINUS_SRC_COLOR)):4===b?n?(a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD),a.blendFuncSeparate(a.ZERO,a.SRC_COLOR,a.ZERO,a.SRC_ALPHA)):(a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ZERO,a.SRC_COLOR)):n?(a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD),
	    a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA)):(a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD),a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA)),E=b,Ea=n;if(5===b){l=l||d;m=m||g;h=h||k;if(d!==J||l!==ea)a.blendEquationSeparate(c(d),c(l)),J=d,ea=l;if(g!==C||k!==N||m!==z||h!==D)a.blendFuncSeparate(c(g),c(k),c(m),c(h)),C=g,N=k,z=m,D=h}else D=z=ea=N=C=J=null}else f(a.BLEND),E=b}function k(a){v.setFunc(a)}function l(b){L!==b&&(b?a.frontFace(a.CW):
	    a.frontFace(a.CCW),L=b)}function m(b){0!==b?(e(a.CULL_FACE),b!==M&&(1===b?a.cullFace(a.BACK):2===b?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):f(a.CULL_FACE);M=b}function h(b){void 0===b&&(b=a.TEXTURE0+W-1);K!==b&&(a.activeTexture(b),K=b)}function p(a,b,c,d){t.setClear(a,b,c,d)}function n(a){v.setClear(a)}function r(a){q.setClear(a)}var t=new function(){var b=!1,c=new da,d=null,e=new da;return{setMask:function(c){d===c||b||(a.colorMask(c,c,c,c),d=c)},setLocked:function(a){b=a},setClear:function(b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               d,f,g){c.set(b,d,f,g);!1===e.equals(c)&&(a.clearColor(b,d,f,g),e.copy(c))},reset:function(){b=!1;d=null;e.set(0,0,0,1)}}},v=new function(){var b=!1,c=null,d=null,g=null;return{setTest:function(b){b?e(a.DEPTH_TEST):f(a.DEPTH_TEST)},setMask:function(d){c===d||b||(a.depthMask(d),c=d)},setFunc:function(b){if(d!==b){if(b)switch(b){case 0:a.depthFunc(a.NEVER);break;case 1:a.depthFunc(a.ALWAYS);break;case 2:a.depthFunc(a.LESS);break;case 3:a.depthFunc(a.LEQUAL);break;case 4:a.depthFunc(a.EQUAL);break;case 5:a.depthFunc(a.GEQUAL);
	    break;case 6:a.depthFunc(a.GREATER);break;case 7:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}else a.depthFunc(a.LEQUAL);d=b}},setLocked:function(a){b=a},setClear:function(b){g!==b&&(a.clearDepth(b),g=b)},reset:function(){b=!1;g=d=c=null}}},q=new function(){var b=!1,c=null,d=null,g=null,k=null,l=null,m=null,h=null,n=null;return{setTest:function(b){b?e(a.STENCIL_TEST):f(a.STENCIL_TEST)},setMask:function(d){c===d||b||(a.stencilMask(d),c=d)},setFunc:function(b,c,e){if(d!==b||g!==c||k!==
	    e)a.stencilFunc(b,c,e),d=b,g=c,k=e},setOp:function(b,c,d){if(l!==b||m!==c||h!==d)a.stencilOp(b,c,d),l=b,m=c,h=d},setLocked:function(a){b=a},setClear:function(b){n!==b&&(a.clearStencil(b),n=b)},reset:function(){b=!1;n=h=m=l=k=g=d=c=null}}},w=a.getParameter(a.MAX_VERTEX_ATTRIBS),x=new Uint8Array(w),T=new Uint8Array(w),y=new Uint8Array(w),F={},G=null,E=null,J=null,C=null,N=null,ea=null,z=null,D=null,Ea=!1,L=null,M=null,O=null,Q=null,I=null,V=null,W=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),K=null,H=
	  {},P=new da,S=new da,bb={};bb[a.TEXTURE_2D]=d(a.TEXTURE_2D,a.TEXTURE_2D,1);bb[a.TEXTURE_CUBE_MAP]=d(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6);return{buffers:{color:t,depth:v,stencil:q},init:function(){p(0,0,0,1);n(1);r(0);e(a.DEPTH_TEST);k(3);l(!1);m(1);e(a.CULL_FACE);e(a.BLEND);g(1)},initAttributes:function(){for(var a=0,b=x.length;a<b;a++)x[a]=0},enableAttribute:function(c){x[c]=1;0===T[c]&&(a.enableVertexAttribArray(c),T[c]=1);0!==y[c]&&(b.get("ANGLE_instanced_arrays").vertexAttribDivisorANGLE(c,
	    0),y[c]=0)},enableAttributeAndDivisor:function(b,c,d){x[b]=1;0===T[b]&&(a.enableVertexAttribArray(b),T[b]=1);y[b]!==c&&(d.vertexAttribDivisorANGLE(b,c),y[b]=c)},disableUnusedAttributes:function(){for(var b=0,c=T.length;b!==c;++b)T[b]!==x[b]&&(a.disableVertexAttribArray(b),T[b]=0)},enable:e,disable:f,getCompressedTextureFormats:function(){if(null===G&&(G=[],b.get("WEBGL_compressed_texture_pvrtc")||b.get("WEBGL_compressed_texture_s3tc")||b.get("WEBGL_compressed_texture_etc1")))for(var c=a.getParameter(a.COMPRESSED_TEXTURE_FORMATS),
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          d=0;d<c.length;d++)G.push(c[d]);return G},setBlending:g,setColorWrite:function(a){t.setMask(a)},setDepthTest:function(a){v.setTest(a)},setDepthWrite:function(a){v.setMask(a)},setDepthFunc:k,setStencilTest:function(a){q.setTest(a)},setStencilWrite:function(a){q.setMask(a)},setStencilFunc:function(a,b,c){q.setFunc(a,b,c)},setStencilOp:function(a,b,c){q.setOp(a,b,c)},setFlipSided:l,setCullFace:m,setLineWidth:function(b){b!==O&&(a.lineWidth(b),O=b)},setPolygonOffset:function(b,c,d){if(b){if(e(a.POLYGON_OFFSET_FILL),
	    Q!==c||I!==d)a.polygonOffset(c,d),Q=c,I=d}else f(a.POLYGON_OFFSET_FILL)},getScissorTest:function(){return V},setScissorTest:function(b){(V=b)?e(a.SCISSOR_TEST):f(a.SCISSOR_TEST)},activeTexture:h,bindTexture:function(b,c){null===K&&h();var d=H[K];void 0===d&&(d={type:void 0,texture:void 0},H[K]=d);if(d.type!==b||d.texture!==c)a.bindTexture(b,c||bb[b]),d.type=b,d.texture=c},compressedTexImage2D:function(){try{a.compressedTexImage2D.apply(a,arguments)}catch(b){console.error(b)}},texImage2D:function(){try{a.texImage2D.apply(a,
	    arguments)}catch(b){console.error(b)}},clearColor:p,clearDepth:n,clearStencil:r,scissor:function(b){!1===P.equals(b)&&(a.scissor(b.x,b.y,b.z,b.w),P.copy(b))},viewport:function(b){!1===S.equals(b)&&(a.viewport(b.x,b.y,b.z,b.w),S.copy(b))},reset:function(){for(var b=0;b<T.length;b++)1===T[b]&&(a.disableVertexAttribArray(b),T[b]=0);F={};K=G=null;H={};M=L=E=null;t.reset();v.reset();q.reset()}}}function jf(a,b,c){function d(b){if("highp"===b){if(0<a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision&&
	    0<a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision)return"highp";b="mediump"}return"mediump"===b&&0<a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision&&0<a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision?"mediump":"lowp"}var e,f=void 0!==c.precision?c.precision:"highp",g=d(f);g!==f&&(console.warn("THREE.WebGLRenderer:",f,"not supported, using",g,"instead."),f=g);c=!0===c.logarithmicDepthBuffer&&!!b.get("EXT_frag_depth");var g=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),
	    k=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),l=a.getParameter(a.MAX_TEXTURE_SIZE),m=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),h=a.getParameter(a.MAX_VERTEX_ATTRIBS),p=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),n=a.getParameter(a.MAX_VARYING_VECTORS),r=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),t=0<k,v=!!b.get("OES_texture_float");return{getMaxAnisotropy:function(){if(void 0!==e)return e;var c=b.get("EXT_texture_filter_anisotropic");return e=null!==c?a.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT):
	    0},getMaxPrecision:d,precision:f,logarithmicDepthBuffer:c,maxTextures:g,maxVertexTextures:k,maxTextureSize:l,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:p,maxVaryings:n,maxFragmentUniforms:r,vertexTextures:t,floatFragmentTextures:v,floatVertexTextures:t&&v}}function kf(a){var b={};return{get:function(c){if(void 0!==b[c])return b[c];var d;switch(c){case "WEBGL_depth_texture":d=a.getExtension("WEBGL_depth_texture")||a.getExtension("MOZ_WEBGL_depth_texture")||a.getExtension("WEBKIT_WEBGL_depth_texture");
	    break;case "EXT_texture_filter_anisotropic":d=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("MOZ_EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case "WEBGL_compressed_texture_s3tc":d=a.getExtension("WEBGL_compressed_texture_s3tc")||a.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case "WEBGL_compressed_texture_pvrtc":d=a.getExtension("WEBGL_compressed_texture_pvrtc")||
	    a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;case "WEBGL_compressed_texture_etc1":d=a.getExtension("WEBGL_compressed_texture_etc1");break;default:d=a.getExtension(c)}null===d&&console.warn("THREE.WebGLRenderer: "+c+" extension not supported.");return b[c]=d}}}function lf(){function a(){m.value!==d&&(m.value=d,m.needsUpdate=0<e);c.numPlanes=e}function b(a,b,d,e){var f=null!==a?a.length:0,g=null;if(0!==f){g=m.value;if(!0!==e||null===g){e=d+4*f;b=b.matrixWorldInverse;l.getNormalMatrix(b);
	    if(null===g||g.length<e)g=new Float32Array(e);for(e=0;e!==f;++e,d+=4)k.copy(a[e]).applyMatrix4(b,l),k.normal.toArray(g,d),g[d+3]=k.constant}m.value=g;m.needsUpdate=!0}c.numPlanes=f;return g}var c=this,d=null,e=0,f=!1,g=!1,k=new fa,l=new ya,m={value:null,needsUpdate:!1};this.uniform=m;this.numPlanes=0;this.init=function(a,c,g){var k=0!==a.length||c||0!==e||f;f=c;d=b(a,g,0);e=a.length;return k};this.beginShadows=function(){g=!0;b(null)};this.endShadows=function(){g=!1;a()};this.setState=function(c,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       k,l,h,t){if(!f||null===c||0===c.length||g&&!k)g?b(null):a();else{k=g?0:e;var v=4*k,q=h.clippingState||null;m.value=q;q=b(c,l,v,t);for(c=0;c!==v;++c)q[c]=d[c];h.clippingState=q;this.numPlanes+=k}}}function od(a){function b(a,b,c,d){!0===J&&(a*=d,b*=d,c*=d);X.clearColor(a,b,c,d)}function c(){X.init();X.scissor(Z.copy(ha).multiplyScalar(Oa));X.viewport(Va.copy(ga).multiplyScalar(Oa));b(Ba.r,Ba.g,Ba.b,Qa)}function d(){U=S=null;R="";K=-1;X.reset()}function e(a){a.preventDefault();d();c();fa.clear()}function f(a){a=
	    a.target;a.removeEventListener("dispose",f);g(a);fa["delete"](a)}function g(a){var b=fa.get(a).program;a.program=void 0;void 0!==b&&ta.releaseProgram(b)}function k(a,b){return Math.abs(b[0])-Math.abs(a[0])}function l(a,b){return a.object.renderOrder!==b.object.renderOrder?a.object.renderOrder-b.object.renderOrder:a.material.program&&b.material.program&&a.material.program!==b.material.program?a.material.program.id-b.material.program.id:a.material.id!==b.material.id?a.material.id-b.material.id:a.z!==
	  b.z?a.z-b.z:a.id-b.id}function m(a,b){return a.object.renderOrder!==b.object.renderOrder?a.object.renderOrder-b.object.renderOrder:a.z!==b.z?b.z-a.z:a.id-b.id}function u(a,b,c,d,e){var f;c.transparent?(d=D,f=++Ea):(d=ea,f=++z);f=d[f];void 0!==f?(f.id=a.id,f.object=a,f.geometry=b,f.material=c,f.z=Y.z,f.group=e):(f={id:a.id,object:a,geometry:b,material:c,z:Y.z,group:e},d.push(f))}function p(a){if(!na.intersectsSphere(a))return!1;var b=ca.numPlanes;if(0===b)return!0;var c=Q.clippingPlanes,d=a.center;
	    a=-a.radius;var e=0;do if(c[e].distanceToPoint(d)<a)return!1;while(++e!==b);return!0}function n(a,b){if(!1!==a.visible){if(0!==(a.layers.mask&b.layers.mask))if(a.isLight)N.push(a);else if(a.isSprite){var c;(c=!1===a.frustumCulled)||(la.center.set(0,0,0),la.radius=.7071067811865476,la.applyMatrix4(a.matrixWorld),c=!0===p(la));c&&M.push(a)}else if(a.isLensFlare)O.push(a);else if(a.isImmediateRenderObject)!0===Q.sortObjects&&(Y.setFromMatrixPosition(a.matrixWorld),Y.applyProjection(qa)),u(a,null,a.material,
	    Y.z,null);else if(a.isMesh||a.isLine||a.isPoints)if(a.isSkinnedMesh&&a.skeleton.update(),(c=!1===a.frustumCulled)||(c=a.geometry,null===c.boundingSphere&&c.computeBoundingSphere(),la.copy(c.boundingSphere).applyMatrix4(a.matrixWorld),c=!0===p(la)),c){var d=a.material;if(!0===d.visible)if(!0===Q.sortObjects&&(Y.setFromMatrixPosition(a.matrixWorld),Y.applyProjection(qa)),c=ra.update(a),d.isMultiMaterial)for(var e=c.groups,f=d.materials,d=0,g=e.length;d<g;d++){var k=e[d],l=f[k.materialIndex];!0===l.visible&&
	  u(a,c,l,Y.z,k)}else u(a,c,d,Y.z,null)}c=a.children;d=0;for(g=c.length;d<g;d++)n(c[d],b)}}function r(a,b,c,d){for(var e=0,f=a.length;e<f;e++){var g=a[e],k=g.object,l=g.geometry,m=void 0===d?g.material:d,g=g.group;k.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,k.matrixWorld);k.normalMatrix.getNormalMatrix(k.modelViewMatrix);if(k.isImmediateRenderObject){t(m);var h=v(b,c,m,k);R="";k.render(function(a){Q.renderBufferImmediate(a,h,m)})}else{if(null!==k.onBeforeRender)k.onBeforeRender();Q.renderBufferDirect(b,
	    c,l,m,k,g)}}}function t(a){2===a.side?X.disable(B.CULL_FACE):X.enable(B.CULL_FACE);X.setFlipSided(1===a.side);!0===a.transparent?X.setBlending(a.blending,a.blendEquation,a.blendSrc,a.blendDst,a.blendEquationAlpha,a.blendSrcAlpha,a.blendDstAlpha,a.premultipliedAlpha):X.setBlending(0);X.setDepthFunc(a.depthFunc);X.setDepthTest(a.depthTest);X.setDepthWrite(a.depthWrite);X.setColorWrite(a.colorWrite);X.setPolygonOffset(a.polygonOffset,a.polygonOffsetFactor,a.polygonOffsetUnits)}function v(a,b,c,d){ba=
	    0;var e=fa.get(c);oa&&(pa||a!==U)&&ca.setState(c.clippingPlanes,c.clipShadows,a,e,a===U&&c.id===K);!1===c.needsUpdate&&(void 0===e.program?c.needsUpdate=!0:c.fog&&e.fog!==b?c.needsUpdate=!0:c.lights&&e.lightsHash!==aa.hash?c.needsUpdate=!0:void 0!==e.numClippingPlanes&&e.numClippingPlanes!==ca.numPlanes&&(c.needsUpdate=!0));if(c.needsUpdate){a:{var k=fa.get(c),l=ta.getParameters(c,aa,b,ca.numPlanes,d),m=ta.getProgramCode(c,l),n=k.program,p=!0;if(void 0===n)c.addEventListener("dispose",f);else if(n.code!==
	    m)g(c);else if(void 0!==l.shaderID)break a;else p=!1;p&&(l.shaderID?(n=Cb[l.shaderID],k.__webglShader={name:c.type,uniforms:h.UniformsUtils.clone(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}):k.__webglShader={name:c.type,uniforms:c.uniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader},c.__webglShader=k.__webglShader,n=ta.acquireProgram(c,l,m),k.program=n,c.program=n);l=n.getAttributes();if(c.morphTargets)for(m=c.numSupportedMorphTargets=0;m<Q.maxMorphTargets;m++)0<=
	  l["morphTarget"+m]&&c.numSupportedMorphTargets++;if(c.morphNormals)for(m=c.numSupportedMorphNormals=0;m<Q.maxMorphNormals;m++)0<=l["morphNormal"+m]&&c.numSupportedMorphNormals++;l=k.__webglShader.uniforms;if(!c.isShaderMaterial&&!c.isRawShaderMaterial||!0===c.clipping)k.numClippingPlanes=ca.numPlanes,l.clippingPlanes=ca.uniform;k.fog=b;k.lightsHash=aa.hash;c.lights&&(l.ambientLightColor.value=aa.ambient,l.directionalLights.value=aa.directional,l.spotLights.value=aa.spot,l.pointLights.value=aa.point,
	    l.hemisphereLights.value=aa.hemi,l.directionalShadowMap.value=aa.directionalShadowMap,l.directionalShadowMatrix.value=aa.directionalShadowMatrix,l.spotShadowMap.value=aa.spotShadowMap,l.spotShadowMatrix.value=aa.spotShadowMatrix,l.pointShadowMap.value=aa.pointShadowMap,l.pointShadowMatrix.value=aa.pointShadowMatrix);m=k.program.getUniforms();m=Ga.seqWithValue(m.seq,l);k.uniformsList=m;k.dynamicUniforms=Ga.splitDynamic(m,l)}c.needsUpdate=!1}var u=!1,p=n=!1,k=e.program,m=k.getUniforms(),l=e.__webglShader.uniforms;
	    k.id!==S&&(B.useProgram(k.program),S=k.id,p=n=u=!0);c.id!==K&&(K=c.id,n=!0);if(u||a!==U){m.set(B,a,"projectionMatrix");ja.logarithmicDepthBuffer&&m.setValue(B,"logDepthBufFC",2/(Math.log(a.far+1)/Math.LN2));a!==U&&(U=a,p=n=!0);if(c.isShaderMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.envMap)u=m.map.cameraPosition,void 0!==u&&u.setValue(B,Y.setFromMatrixPosition(a.matrixWorld));(c.isMeshPhongMaterial||c.isMeshLambertMaterial||c.isMeshBasicMaterial||c.isMeshStandardMaterial||c.isShaderMaterial||
	    c.skinning)&&m.setValue(B,"viewMatrix",a.matrixWorldInverse);m.set(B,Q,"toneMappingExposure");m.set(B,Q,"toneMappingWhitePoint")}c.skinning&&(m.setOptional(B,d,"bindMatrix"),m.setOptional(B,d,"bindMatrixInverse"),u=d.skeleton)&&(ja.floatVertexTextures&&u.useVertexTexture?(m.set(B,u,"boneTexture"),m.set(B,u,"boneTextureWidth"),m.set(B,u,"boneTextureHeight")):m.setOptional(B,u,"boneMatrices"));if(n){c.lights&&(n=p,l.ambientLightColor.needsUpdate=n,l.directionalLights.needsUpdate=n,l.pointLights.needsUpdate=
	      n,l.spotLights.needsUpdate=n,l.hemisphereLights.needsUpdate=n);b&&c.fog&&(l.fogColor.value=b.color,b.isFog?(l.fogNear.value=b.near,l.fogFar.value=b.far):b.isFogExp2&&(l.fogDensity.value=b.density));if(c.isMeshBasicMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isMeshDepthMaterial){l.opacity.value=c.opacity;l.diffuse.value=c.color;c.emissive&&l.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity);l.map.value=c.map;l.specularMap.value=c.specularMap;
	      l.alphaMap.value=c.alphaMap;c.aoMap&&(l.aoMap.value=c.aoMap,l.aoMapIntensity.value=c.aoMapIntensity);var r;c.map?r=c.map:c.specularMap?r=c.specularMap:c.displacementMap?r=c.displacementMap:c.normalMap?r=c.normalMap:c.bumpMap?r=c.bumpMap:c.roughnessMap?r=c.roughnessMap:c.metalnessMap?r=c.metalnessMap:c.alphaMap?r=c.alphaMap:c.emissiveMap&&(r=c.emissiveMap);void 0!==r&&(r.isWebGLRenderTarget&&(r=r.texture),b=r.offset,r=r.repeat,l.offsetRepeat.value.set(b.x,b.y,r.x,r.y));l.envMap.value=c.envMap;l.flipEnvMap.value=
	        c.envMap&&c.envMap.isCubeTexture?-1:1;l.reflectivity.value=c.reflectivity;l.refractionRatio.value=c.refractionRatio}c.isLineBasicMaterial?(l.diffuse.value=c.color,l.opacity.value=c.opacity):c.isLineDashedMaterial?(l.diffuse.value=c.color,l.opacity.value=c.opacity,l.dashSize.value=c.dashSize,l.totalSize.value=c.dashSize+c.gapSize,l.scale.value=c.scale):c.isPointsMaterial?(l.diffuse.value=c.color,l.opacity.value=c.opacity,l.size.value=c.size*Oa,l.scale.value=.5*x.clientHeight,l.map.value=c.map,null!==
	    c.map&&(r=c.map.offset,b=c.map.repeat,l.offsetRepeat.value.set(r.x,r.y,b.x,b.y))):c.isMeshLambertMaterial?(c.lightMap&&(l.lightMap.value=c.lightMap,l.lightMapIntensity.value=c.lightMapIntensity),c.emissiveMap&&(l.emissiveMap.value=c.emissiveMap)):c.isMeshPhongMaterial?(l.specular.value=c.specular,l.shininess.value=Math.max(c.shininess,1E-4),c.lightMap&&(l.lightMap.value=c.lightMap,l.lightMapIntensity.value=c.lightMapIntensity),c.emissiveMap&&(l.emissiveMap.value=c.emissiveMap),c.bumpMap&&(l.bumpMap.value=
	      c.bumpMap,l.bumpScale.value=c.bumpScale),c.normalMap&&(l.normalMap.value=c.normalMap,l.normalScale.value.copy(c.normalScale)),c.displacementMap&&(l.displacementMap.value=c.displacementMap,l.displacementScale.value=c.displacementScale,l.displacementBias.value=c.displacementBias)):c.isMeshPhysicalMaterial?(l.clearCoat.value=c.clearCoat,l.clearCoatRoughness.value=c.clearCoatRoughness,A(l,c)):c.isMeshStandardMaterial?A(l,c):c.isMeshDepthMaterial?c.displacementMap&&(l.displacementMap.value=c.displacementMap,
	      l.displacementScale.value=c.displacementScale,l.displacementBias.value=c.displacementBias):c.isMeshNormalMaterial&&(l.opacity.value=c.opacity);Ga.upload(B,e.uniformsList,l,Q)}m.set(B,d,"modelViewMatrix");m.set(B,d,"normalMatrix");m.setValue(B,"modelMatrix",d.matrixWorld);e=e.dynamicUniforms;null!==e&&(Ga.evalDynamic(e,l,d,c,a),Ga.upload(B,e,l,Q));return k}function A(a,b){a.roughness.value=b.roughness;a.metalness.value=b.metalness;b.roughnessMap&&(a.roughnessMap.value=b.roughnessMap);b.metalnessMap&&
	  (a.metalnessMap.value=b.metalnessMap);b.lightMap&&(a.lightMap.value=b.lightMap,a.lightMapIntensity.value=b.lightMapIntensity);b.emissiveMap&&(a.emissiveMap.value=b.emissiveMap);b.bumpMap&&(a.bumpMap.value=b.bumpMap,a.bumpScale.value=b.bumpScale);b.normalMap&&(a.normalMap.value=b.normalMap,a.normalScale.value.copy(b.normalScale));b.displacementMap&&(a.displacementMap.value=b.displacementMap,a.displacementScale.value=b.displacementScale,a.displacementBias.value=b.displacementBias);b.envMap&&(a.envMapIntensity.value=
	    b.envMapIntensity)}function w(a){var b;if(1E3===a)return B.REPEAT;if(1001===a)return B.CLAMP_TO_EDGE;if(1002===a)return B.MIRRORED_REPEAT;if(1003===a)return B.NEAREST;if(1004===a)return B.NEAREST_MIPMAP_NEAREST;if(1005===a)return B.NEAREST_MIPMAP_LINEAR;if(1006===a)return B.LINEAR;if(1007===a)return B.LINEAR_MIPMAP_NEAREST;if(1008===a)return B.LINEAR_MIPMAP_LINEAR;if(1009===a)return B.UNSIGNED_BYTE;if(1017===a)return B.UNSIGNED_SHORT_4_4_4_4;if(1018===a)return B.UNSIGNED_SHORT_5_5_5_1;if(1019===a)return B.UNSIGNED_SHORT_5_6_5;
	    if(1010===a)return B.BYTE;if(1011===a)return B.SHORT;if(1012===a)return B.UNSIGNED_SHORT;if(1013===a)return B.INT;if(1014===a)return B.UNSIGNED_INT;if(1015===a)return B.FLOAT;b=ia.get("OES_texture_half_float");if(null!==b&&1016===a)return b.HALF_FLOAT_OES;if(1021===a)return B.ALPHA;if(1022===a)return B.RGB;if(1023===a)return B.RGBA;if(1024===a)return B.LUMINANCE;if(1025===a)return B.LUMINANCE_ALPHA;if(1026===a)return B.DEPTH_COMPONENT;if(1027===a)return B.DEPTH_STENCIL;if(100===a)return B.FUNC_ADD;
	    if(101===a)return B.FUNC_SUBTRACT;if(102===a)return B.FUNC_REVERSE_SUBTRACT;if(200===a)return B.ZERO;if(201===a)return B.ONE;if(202===a)return B.SRC_COLOR;if(203===a)return B.ONE_MINUS_SRC_COLOR;if(204===a)return B.SRC_ALPHA;if(205===a)return B.ONE_MINUS_SRC_ALPHA;if(206===a)return B.DST_ALPHA;if(207===a)return B.ONE_MINUS_DST_ALPHA;if(208===a)return B.DST_COLOR;if(209===a)return B.ONE_MINUS_DST_COLOR;if(210===a)return B.SRC_ALPHA_SATURATE;b=ia.get("WEBGL_compressed_texture_s3tc");if(null!==b){if(2001===
	      a)return b.COMPRESSED_RGB_S3TC_DXT1_EXT;if(2002===a)return b.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(2003===a)return b.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(2004===a)return b.COMPRESSED_RGBA_S3TC_DXT5_EXT}b=ia.get("WEBGL_compressed_texture_pvrtc");if(null!==b){if(2100===a)return b.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(2101===a)return b.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(2102===a)return b.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(2103===a)return b.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}b=ia.get("WEBGL_compressed_texture_etc1");
	    if(null!==b&&2151===a)return b.COMPRESSED_RGB_ETC1_WEBGL;b=ia.get("EXT_blend_minmax");if(null!==b){if(103===a)return b.MIN_EXT;if(104===a)return b.MAX_EXT}b=ia.get("WEBGL_depth_texture");return null!==b&&1020===a?b.UNSIGNED_INT_24_8_WEBGL:0}console.log("THREE.WebGLRenderer","81");a=a||{};var x=void 0!==a.canvas?a.canvas:document.createElementNS("http://www.w3.org/1999/xhtml","canvas"),T=void 0!==a.context?a.context:null,y=void 0!==a.alpha?a.alpha:!1,F=void 0!==a.depth?a.depth:!0,G=void 0!==a.stencil?
	    a.stencil:!0,E=void 0!==a.antialias?a.antialias:!1,J=void 0!==a.premultipliedAlpha?a.premultipliedAlpha:!0,C=void 0!==a.preserveDrawingBuffer?a.preserveDrawingBuffer:!1,N=[],ea=[],z=-1,D=[],Ea=-1,L=new Float32Array(8),M=[],O=[];this.domElement=x;this.context=null;this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=!0;this.clippingPlanes=[];this.localClippingEnabled=!1;this.gammaFactor=2;this.physicallyCorrectLights=this.gammaOutput=this.gammaInput=!1;this.toneMappingWhitePoint=
	    this.toneMappingExposure=this.toneMapping=1;this.maxMorphTargets=8;this.maxMorphNormals=4;var Q=this,S=null,V=null,W=null,K=-1,R="",U=null,Z=new da,bb=null,Va=new da,ba=0,Ba=new H(0),Qa=0,Na=x.width,Mc=x.height,Oa=1,ha=new da(0,0,Na,Mc),ka=!1,ga=new da(0,0,Na,Mc),na=new dc,ca=new lf,oa=!1,pa=!1,la=new Aa,qa=new P,Y=new q,aa={hash:"",ambient:[0,0,0],directional:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadowMap:[],spotShadowMatrix:[],point:[],pointShadowMap:[],pointShadowMatrix:[],
	    hemi:[],shadows:[]},ma={calls:0,vertices:0,faces:0,points:0};this.info={render:ma,memory:{geometries:0,textures:0},programs:null};var B;try{y={alpha:y,depth:F,stencil:G,antialias:E,premultipliedAlpha:J,preserveDrawingBuffer:C};B=T||x.getContext("webgl",y)||x.getContext("experimental-webgl",y);if(null===B){if(null!==x.getContext("webgl"))throw"Error creating WebGL context with your selected attributes.";throw"Error creating WebGL context.";}void 0===B.getShaderPrecisionFormat&&(B.getShaderPrecisionFormat=
	    function(){return{rangeMin:1,rangeMax:1,precision:1}});x.addEventListener("webglcontextlost",e,!1)}catch(mf){console.error("THREE.WebGLRenderer: "+mf)}var ia=new kf(B);ia.get("WEBGL_depth_texture");ia.get("OES_texture_float");ia.get("OES_texture_float_linear");ia.get("OES_texture_half_float");ia.get("OES_texture_half_float_linear");ia.get("OES_standard_derivatives");ia.get("ANGLE_instanced_arrays");ia.get("OES_element_index_uint")&&(I.MaxIndex=4294967296);var ja=new jf(B,ia,a),X=new hf(B,ia,w),fa=
	    new gf,sa=new ff(B,ia,X,fa,ja,w,this.info),ra=new ef(B,fa,this.info),ta=new cf(this,ja),ya=new Ve;this.info.programs=ta.programs;var Fa=new Ue(B,ia,ma),Ha=new Te(B,ia,ma),Ja=new Db(-1,1,1,-1,0,1),wa=new Ca,za=new va(new eb(2,2),new Ia({depthTest:!1,depthWrite:!1,fog:!1}));a=Cb.cube;var ua=new va(new db(5,5,5),new Da({uniforms:a.uniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1}));c();this.context=B;this.capabilities=ja;this.extensions=ia;
	    this.properties=fa;this.state=X;var Ka=new $d(this,aa,ra,ja);this.shadowMap=Ka;var La=new Se(this,M),Pa=new Qe(this,O);this.getContext=function(){return B};this.getContextAttributes=function(){return B.getContextAttributes()};this.forceContextLoss=function(){ia.get("WEBGL_lose_context").loseContext()};this.getMaxAnisotropy=function(){return ja.getMaxAnisotropy()};this.getPrecision=function(){return ja.precision};this.getPixelRatio=function(){return Oa};this.setPixelRatio=function(a){void 0!==a&&(Oa=
	      a,this.setSize(ga.z,ga.w,!1))};this.getSize=function(){return{width:Na,height:Mc}};this.setSize=function(a,b,c){Na=a;Mc=b;x.width=a*Oa;x.height=b*Oa;!1!==c&&(x.style.width=a+"px",x.style.height=b+"px");this.setViewport(0,0,a,b)};this.setViewport=function(a,b,c,d){X.viewport(ga.set(a,b,c,d))};this.setScissor=function(a,b,c,d){X.scissor(ha.set(a,b,c,d))};this.setScissorTest=function(a){X.setScissorTest(ka=a)};this.getClearColor=function(){return Ba};this.setClearColor=function(a,c){Ba.set(a);Qa=void 0!==
	    c?c:1;b(Ba.r,Ba.g,Ba.b,Qa)};this.getClearAlpha=function(){return Qa};this.setClearAlpha=function(a){Qa=a;b(Ba.r,Ba.g,Ba.b,Qa)};this.clear=function(a,b,c){var d=0;if(void 0===a||a)d|=B.COLOR_BUFFER_BIT;if(void 0===b||b)d|=B.DEPTH_BUFFER_BIT;if(void 0===c||c)d|=B.STENCIL_BUFFER_BIT;B.clear(d)};this.clearColor=function(){this.clear(!0,!1,!1)};this.clearDepth=function(){this.clear(!1,!0,!1)};this.clearStencil=function(){this.clear(!1,!1,!0)};this.clearTarget=function(a,b,c,d){this.setRenderTarget(a);
	      this.clear(b,c,d)};this.resetGLState=d;this.dispose=function(){D=[];Ea=-1;ea=[];z=-1;x.removeEventListener("webglcontextlost",e,!1)};this.renderBufferImmediate=function(a,b,c){X.initAttributes();var d=fa.get(a);a.hasPositions&&!d.position&&(d.position=B.createBuffer());a.hasNormals&&!d.normal&&(d.normal=B.createBuffer());a.hasUvs&&!d.uv&&(d.uv=B.createBuffer());a.hasColors&&!d.color&&(d.color=B.createBuffer());b=b.getAttributes();a.hasPositions&&(B.bindBuffer(B.ARRAY_BUFFER,d.position),B.bufferData(B.ARRAY_BUFFER,
	      a.positionArray,B.DYNAMIC_DRAW),X.enableAttribute(b.position),B.vertexAttribPointer(b.position,3,B.FLOAT,!1,0,0));if(a.hasNormals){B.bindBuffer(B.ARRAY_BUFFER,d.normal);if(!c.isMeshPhongMaterial&&!c.isMeshStandardMaterial&&1===c.shading)for(var e=0,f=3*a.count;e<f;e+=9){var g=a.normalArray,k=(g[e+0]+g[e+3]+g[e+6])/3,l=(g[e+1]+g[e+4]+g[e+7])/3,m=(g[e+2]+g[e+5]+g[e+8])/3;g[e+0]=k;g[e+1]=l;g[e+2]=m;g[e+3]=k;g[e+4]=l;g[e+5]=m;g[e+6]=k;g[e+7]=l;g[e+8]=m}B.bufferData(B.ARRAY_BUFFER,a.normalArray,B.DYNAMIC_DRAW);
	      X.enableAttribute(b.normal);B.vertexAttribPointer(b.normal,3,B.FLOAT,!1,0,0)}a.hasUvs&&c.map&&(B.bindBuffer(B.ARRAY_BUFFER,d.uv),B.bufferData(B.ARRAY_BUFFER,a.uvArray,B.DYNAMIC_DRAW),X.enableAttribute(b.uv),B.vertexAttribPointer(b.uv,2,B.FLOAT,!1,0,0));a.hasColors&&0!==c.vertexColors&&(B.bindBuffer(B.ARRAY_BUFFER,d.color),B.bufferData(B.ARRAY_BUFFER,a.colorArray,B.DYNAMIC_DRAW),X.enableAttribute(b.color),B.vertexAttribPointer(b.color,3,B.FLOAT,!1,0,0));X.disableUnusedAttributes();B.drawArrays(B.TRIANGLES,
	      0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){t(d);var g=v(a,b,d,e),l=!1;a=c.id+"_"+g.id+"_"+d.wireframe;a!==R&&(R=a,l=!0);b=e.morphTargetInfluences;if(void 0!==b){var m=[];a=0;for(var h=b.length;a<h;a++)l=b[a],m.push([l,a]);m.sort(k);8<m.length&&(m.length=8);var n=c.morphAttributes;a=0;for(h=m.length;a<h;a++)l=m[a],L[a]=l[0],0!==l[0]?(b=l[1],!0===d.morphTargets&&n.position&&c.addAttribute("morphTarget"+a,n.position[b]),!0===d.morphNormals&&n.normal&&c.addAttribute("morphNormal"+
	      a,n.normal[b])):(!0===d.morphTargets&&c.removeAttribute("morphTarget"+a),!0===d.morphNormals&&c.removeAttribute("morphNormal"+a));a=m.length;for(b=L.length;a<b;a++)L[a]=0;g.getUniforms().setValue(B,"morphTargetInfluences",L);l=!0}b=c.index;h=c.attributes.position;m=1;!0===d.wireframe&&(b=ra.getWireframeAttribute(c),m=2);null!==b?(a=Ha,a.setIndex(b)):a=Fa;if(l){a:{var l=void 0,p;if(c&&c.isInstancedBufferGeometry&&(p=ia.get("ANGLE_instanced_arrays"),null===p)){console.error("THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
	      break a}void 0===l&&(l=0);X.initAttributes();var n=c.attributes,g=g.getAttributes(),u=d.defaultAttributeValues,r;for(r in g){var x=g[r];if(0<=x){var q=n[r];if(void 0!==q){var w=B.FLOAT,y=q.array,A=q.normalized;y instanceof Float32Array?w=B.FLOAT:y instanceof Float64Array?console.warn("Unsupported data buffer format: Float64Array"):y instanceof Uint16Array?w=B.UNSIGNED_SHORT:y instanceof Int16Array?w=B.SHORT:y instanceof Uint32Array?w=B.UNSIGNED_INT:y instanceof Int32Array?w=B.INT:y instanceof Int8Array?
	      w=B.BYTE:y instanceof Uint8Array&&(w=B.UNSIGNED_BYTE);var y=q.itemSize,G=ra.getAttributeBuffer(q);if(q&&q.isInterleavedBufferAttribute){var E=q.data,J=E.stride,q=q.offset;E&&E.isInstancedInterleavedBuffer?(X.enableAttributeAndDivisor(x,E.meshPerAttribute,p),void 0===c.maxInstancedCount&&(c.maxInstancedCount=E.meshPerAttribute*E.count)):X.enableAttribute(x);B.bindBuffer(B.ARRAY_BUFFER,G);B.vertexAttribPointer(x,y,w,A,J*E.array.BYTES_PER_ELEMENT,(l*J+q)*E.array.BYTES_PER_ELEMENT)}else q&&q.isInstancedBufferAttribute?
	      (X.enableAttributeAndDivisor(x,q.meshPerAttribute,p),void 0===c.maxInstancedCount&&(c.maxInstancedCount=q.meshPerAttribute*q.count)):X.enableAttribute(x),B.bindBuffer(B.ARRAY_BUFFER,G),B.vertexAttribPointer(x,y,w,A,0,l*y*q.array.BYTES_PER_ELEMENT)}else if(void 0!==u&&(w=u[r],void 0!==w))switch(w.length){case 2:B.vertexAttrib2fv(x,w);break;case 3:B.vertexAttrib3fv(x,w);break;case 4:B.vertexAttrib4fv(x,w);break;default:B.vertexAttrib1fv(x,w)}}}X.disableUnusedAttributes()}null!==b&&B.bindBuffer(B.ELEMENT_ARRAY_BUFFER,
	      ra.getAttributeBuffer(b))}p=0;null!==b?p=b.count:void 0!==h&&(p=h.count);b=c.drawRange.start*m;h=null!==f?f.start*m:0;r=Math.max(b,h);f=Math.max(0,Math.min(p,b+c.drawRange.count*m,h+(null!==f?f.count*m:Infinity))-1-r+1);if(0!==f){if(e.isMesh)if(!0===d.wireframe)X.setLineWidth(d.wireframeLinewidth*(null===V?Oa:1)),a.setMode(B.LINES);else switch(e.drawMode){case 0:a.setMode(B.TRIANGLES);break;case 1:a.setMode(B.TRIANGLE_STRIP);break;case 2:a.setMode(B.TRIANGLE_FAN)}else e.isLine?(d=d.linewidth,void 0===
	    d&&(d=1),X.setLineWidth(d*(null===V?Oa:1)),e.isLineSegments?a.setMode(B.LINES):a.setMode(B.LINE_STRIP)):e.isPoints&&a.setMode(B.POINTS);c&&c.isInstancedBufferGeometry?0<c.maxInstancedCount&&a.renderInstances(c,r,f):a.render(r,f)}};this.render=function(a,c,d,e){if(void 0!==c&&!0!==c.isCamera)console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");else{var f=a.fog;R="";K=-1;U=null;!0===a.autoUpdate&&a.updateMatrixWorld();null===c.parent&&c.updateMatrixWorld();c.matrixWorldInverse.getInverse(c.matrixWorld);
	      qa.multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse);na.setFromMatrix(qa);N.length=0;Ea=z=-1;M.length=0;O.length=0;pa=this.localClippingEnabled;oa=ca.init(this.clippingPlanes,pa,c);n(a,c);ea.length=z+1;D.length=Ea+1;!0===Q.sortObjects&&(ea.sort(l),D.sort(m));oa&&ca.beginShadows();for(var g=N,k=0,h=0,p=g.length;h<p;h++){var u=g[h];u.castShadow&&(aa.shadows[k++]=u)}aa.shadows.length=k;Ka.render(a,c);for(var g=N,t=u=0,v=0,q,x,w,y,A=c.matrixWorldInverse,E=0,G=0,J=0,T=0,k=0,h=g.length;k<h;k++)if(p=
	          g[k],q=p.color,x=p.intensity,w=p.distance,y=p.shadow&&p.shadow.map?p.shadow.map.texture:null,p.isAmbientLight)u+=q.r*x,t+=q.g*x,v+=q.b*x;else if(p.isDirectionalLight){var F=ya.get(p);F.color.copy(p.color).multiplyScalar(p.intensity);F.direction.setFromMatrixPosition(p.matrixWorld);Y.setFromMatrixPosition(p.target.matrixWorld);F.direction.sub(Y);F.direction.transformDirection(A);if(F.shadow=p.castShadow)F.shadowBias=p.shadow.bias,F.shadowRadius=p.shadow.radius,F.shadowMapSize=p.shadow.mapSize;aa.directionalShadowMap[E]=
	        y;aa.directionalShadowMatrix[E]=p.shadow.matrix;aa.directional[E++]=F}else if(p.isSpotLight){F=ya.get(p);F.position.setFromMatrixPosition(p.matrixWorld);F.position.applyMatrix4(A);F.color.copy(q).multiplyScalar(x);F.distance=w;F.direction.setFromMatrixPosition(p.matrixWorld);Y.setFromMatrixPosition(p.target.matrixWorld);F.direction.sub(Y);F.direction.transformDirection(A);F.coneCos=Math.cos(p.angle);F.penumbraCos=Math.cos(p.angle*(1-p.penumbra));F.decay=0===p.distance?0:p.decay;if(F.shadow=p.castShadow)F.shadowBias=
	        p.shadow.bias,F.shadowRadius=p.shadow.radius,F.shadowMapSize=p.shadow.mapSize;aa.spotShadowMap[J]=y;aa.spotShadowMatrix[J]=p.shadow.matrix;aa.spot[J++]=F}else if(p.isPointLight){F=ya.get(p);F.position.setFromMatrixPosition(p.matrixWorld);F.position.applyMatrix4(A);F.color.copy(p.color).multiplyScalar(p.intensity);F.distance=p.distance;F.decay=0===p.distance?0:p.decay;if(F.shadow=p.castShadow)F.shadowBias=p.shadow.bias,F.shadowRadius=p.shadow.radius,F.shadowMapSize=p.shadow.mapSize;aa.pointShadowMap[G]=
	        y;void 0===aa.pointShadowMatrix[G]&&(aa.pointShadowMatrix[G]=new P);Y.setFromMatrixPosition(p.matrixWorld).negate();aa.pointShadowMatrix[G].identity().setPosition(Y);aa.point[G++]=F}else p.isHemisphereLight&&(F=ya.get(p),F.direction.setFromMatrixPosition(p.matrixWorld),F.direction.transformDirection(A),F.direction.normalize(),F.skyColor.copy(p.color).multiplyScalar(x),F.groundColor.copy(p.groundColor).multiplyScalar(x),aa.hemi[T++]=F);aa.ambient[0]=u;aa.ambient[1]=t;aa.ambient[2]=v;aa.directional.length=
	        E;aa.spot.length=J;aa.point.length=G;aa.hemi.length=T;aa.hash=E+","+G+","+J+","+T+","+aa.shadows.length;oa&&ca.endShadows();ma.calls=0;ma.vertices=0;ma.faces=0;ma.points=0;void 0===d&&(d=null);this.setRenderTarget(d);g=a.background;null===g?b(Ba.r,Ba.g,Ba.b,Qa):g&&g.isColor&&(b(g.r,g.g,g.b,1),e=!0);(this.autoClear||e)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);g&&g.isCubeTexture?(wa.projectionMatrix.copy(c.projectionMatrix),wa.matrixWorld.extractRotation(c.matrixWorld),
	        wa.matrixWorldInverse.getInverse(wa.matrixWorld),ua.material.uniforms.tCube.value=g,ua.modelViewMatrix.multiplyMatrices(wa.matrixWorldInverse,ua.matrixWorld),ra.update(ua),Q.renderBufferDirect(wa,null,ua.geometry,ua.material,ua,null)):g&&g.isTexture&&(za.material.map=g,ra.update(za),Q.renderBufferDirect(Ja,null,za.geometry,za.material,za,null));a.overrideMaterial?(e=a.overrideMaterial,r(ea,c,f,e),r(D,c,f,e)):(X.setBlending(0),r(ea,c,f),r(D,c,f));La.render(a,c);Pa.render(a,c,Va);d&&sa.updateRenderTargetMipmap(d);
	      X.setDepthTest(!0);X.setDepthWrite(!0);X.setColorWrite(!0)}};this.setFaceCulling=function(a,b){X.setCullFace(a);X.setFlipSided(0===b)};this.allocTextureUnit=function(){var a=ba;a>=ja.maxTextures&&console.warn("WebGLRenderer: trying to use "+a+" texture units while this GPU supports only "+ja.maxTextures);ba+=1;return a};this.setTexture2D=function(){var a=!1;return function(b,c){b&&b.isWebGLRenderTarget&&(a||(console.warn("THREE.WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead."),
	      a=!0),b=b.texture);sa.setTexture2D(b,c)}}();this.setTexture=function(){var a=!1;return function(b,c){a||(console.warn("THREE.WebGLRenderer: .setTexture is deprecated, use setTexture2D instead."),a=!0);sa.setTexture2D(b,c)}}();this.setTextureCube=function(){var a=!1;return function(b,c){b&&b.isWebGLRenderTargetCube&&(a||(console.warn("THREE.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead."),a=!0),b=b.texture);b&&b.isCubeTexture||Array.isArray(b.image)&&
	    6===b.image.length?sa.setTextureCube(b,c):sa.setTextureCubeDynamic(b,c)}}();this.getCurrentRenderTarget=function(){return V};this.setRenderTarget=function(a){(V=a)&&void 0===fa.get(a).__webglFramebuffer&&sa.setupRenderTarget(a);var b=a&&a.isWebGLRenderTargetCube,c;a?(c=fa.get(a),c=b?c.__webglFramebuffer[a.activeCubeFace]:c.__webglFramebuffer,Z.copy(a.scissor),bb=a.scissorTest,Va.copy(a.viewport)):(c=null,Z.copy(ha).multiplyScalar(Oa),bb=ka,Va.copy(ga).multiplyScalar(Oa));W!==c&&(B.bindFramebuffer(B.FRAMEBUFFER,
	      c),W=c);X.scissor(Z);X.setScissorTest(bb);X.viewport(Va);b&&(b=fa.get(a.texture),B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+a.activeCubeFace,b.__webglTexture,a.activeMipMapLevel))};this.readRenderTargetPixels=function(a,b,c,d,e,f){if(!1===(a&&a.isWebGLRenderTarget))console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");else{var g=fa.get(a).__webglFramebuffer;if(g){var k=!1;g!==W&&(B.bindFramebuffer(B.FRAMEBUFFER,
	      g),k=!0);try{var l=a.texture,m=l.format,h=l.type;1023!==m&&w(m)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)?console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."):1009===h||w(h)===B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)||1015===h&&(ia.get("OES_texture_float")||ia.get("WEBGL_color_buffer_float"))||1016===h&&ia.get("EXT_color_buffer_half_float")?B.checkFramebufferStatus(B.FRAMEBUFFER)===B.FRAMEBUFFER_COMPLETE?0<=b&&
	    b<=a.width-d&&0<=c&&c<=a.height-e&&B.readPixels(b,c,d,e,w(m),w(h),f):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."):console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.")}finally{k&&B.bindFramebuffer(B.FRAMEBUFFER,W)}}}}}function Eb(a,b){this.name="";this.color=new H(a);this.density=void 0!==b?b:2.5E-4}function Fb(a,b,c){this.name="";this.color=
	    new H(a);this.near=void 0!==b?b:1;this.far=void 0!==c?c:1E3}function fb(){D.call(this);this.type="Scene";this.overrideMaterial=this.fog=this.background=null;this.autoUpdate=!0}function pd(a,b,c,d,e){D.call(this);this.lensFlares=[];this.positionScreen=new q;this.customUpdateCallback=void 0;void 0!==a&&this.add(a,b,c,d,e)}function gb(a){S.call(this);this.type="SpriteMaterial";this.color=new H(16777215);this.map=null;this.rotation=0;this.lights=this.fog=!1;this.setValues(a)}function fc(a){D.call(this);
	    this.type="Sprite";this.material=void 0!==a?a:new gb}function gc(){D.call(this);this.type="LOD";Object.defineProperties(this,{levels:{enumerable:!0,value:[]}})}function hb(a,b,c,d,e,f,g,k,l,m,h,p){ba.call(this,null,f,g,k,l,m,d,e,h,p);this.image={data:a,width:b,height:c};this.magFilter=void 0!==l?l:1003;this.minFilter=void 0!==m?m:1003;this.generateMipmaps=this.flipY=!1}function Nc(a,b,c){this.useVertexTexture=void 0!==c?c:!0;this.identityMatrix=new P;a=a||[];this.bones=a.slice(0);this.useVertexTexture?
	    (a=Math.sqrt(4*this.bones.length),a=h.Math.nextPowerOfTwo(Math.ceil(a)),this.boneTextureHeight=this.boneTextureWidth=a=Math.max(a,4),this.boneMatrices=new Float32Array(this.boneTextureWidth*this.boneTextureHeight*4),this.boneTexture=new hb(this.boneMatrices,this.boneTextureWidth,this.boneTextureHeight,1023,1015)):this.boneMatrices=new Float32Array(16*this.bones.length);if(void 0===b)this.calculateInverses();else if(this.bones.length===b.length)this.boneInverses=b.slice(0);else for(console.warn("THREE.Skeleton bonInverses is the wrong length."),
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            this.boneInverses=[],b=0,a=this.bones.length;b<a;b++)this.boneInverses.push(new P)}function Oc(a){D.call(this);this.type="Bone";this.skin=a}function Pc(a,b,c){va.call(this,a,b);this.type="SkinnedMesh";this.bindMode="attached";this.bindMatrix=new P;this.bindMatrixInverse=new P;a=[];if(this.geometry&&void 0!==this.geometry.bones){for(var d,e=0,f=this.geometry.bones.length;e<f;++e)d=this.geometry.bones[e],b=new Oc(this),a.push(b),b.name=d.name,b.position.fromArray(d.pos),b.quaternion.fromArray(d.rotq),
	  void 0!==d.scl&&b.scale.fromArray(d.scl);e=0;for(f=this.geometry.bones.length;e<f;++e)d=this.geometry.bones[e],-1!==d.parent&&null!==d.parent&&void 0!==a[d.parent]?a[d.parent].add(a[e]):this.add(a[e])}this.normalizeSkinWeights();this.updateMatrixWorld(!0);this.bind(new Nc(a,void 0,c),this.matrixWorld)}function na(a){S.call(this);this.type="LineBasicMaterial";this.color=new H(16777215);this.linewidth=1;this.linejoin=this.linecap="round";this.lights=!1;this.setValues(a)}function Pa(a,b,c){if(1===c)return console.warn("THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead."),
	    new ha(a,b);D.call(this);this.type="Line";this.geometry=void 0!==a?a:new I;this.material=void 0!==b?b:new na({color:16777215*Math.random()})}function ha(a,b){Pa.call(this,a,b);this.type="LineSegments"}function Ja(a){S.call(this);this.type="PointsMaterial";this.color=new H(16777215);this.map=null;this.size=1;this.sizeAttenuation=!0;this.lights=!1;this.setValues(a)}function Gb(a,b){D.call(this);this.type="Points";this.geometry=void 0!==a?a:new I;this.material=void 0!==b?b:new Ja({color:16777215*Math.random()})}
	  function hc(){D.call(this);this.type="Group"}function Qc(a,b,c,d,e,f,g,k,l){function m(){requestAnimationFrame(m);a.readyState>=a.HAVE_CURRENT_DATA&&(h.needsUpdate=!0)}ba.call(this,a,b,c,d,e,f,g,k,l);this.generateMipmaps=!1;var h=this;m()}function Hb(a,b,c,d,e,f,g,k,l,m,h,p){ba.call(this,null,f,g,k,l,m,d,e,h,p);this.image={width:b,height:c};this.mipmaps=a;this.generateMipmaps=this.flipY=!1}function Rc(a,b,c,d,e,f,g,k,l){ba.call(this,a,b,c,d,e,f,g,k,l);this.needsUpdate=!0}function ic(a,b,c,d,e,f,g,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          k,l,m){m=void 0!==m?m:1026;if(1026!==m&&1027!==m)throw Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");ba.call(this,null,d,e,f,g,k,m,c,l);this.image={width:a,height:b};this.type=void 0!==c?c:1012;this.magFilter=void 0!==g?g:1003;this.minFilter=void 0!==k?k:1003;this.generateMipmaps=this.flipY=!1}function Ib(a){function b(a,b){return a-b}I.call(this);var c=[0,0],d={},e=["a","b","c"];if(a&&a.isGeometry){var f=a.vertices,g=a.faces,k=0,l=new Uint32Array(6*g.length);
	    a=0;for(var m=g.length;a<m;a++)for(var h=g[a],p=0;3>p;p++){c[0]=h[e[p]];c[1]=h[e[(p+1)%3]];c.sort(b);var n=c.toString();void 0===d[n]&&(l[2*k]=c[0],l[2*k+1]=c[1],d[n]=!0,k++)}c=new Float32Array(6*k);a=0;for(m=k;a<m;a++)for(p=0;2>p;p++)d=f[l[2*a+p]],k=6*a+3*p,c[k+0]=d.x,c[k+1]=d.y,c[k+2]=d.z;this.addAttribute("position",new z(c,3))}else if(a&&a.isBufferGeometry){if(null!==a.index){m=a.index.array;f=a.attributes.position;e=a.groups;k=0;0===e.length&&a.addGroup(0,m.length);l=new Uint32Array(2*m.length);
	    g=0;for(h=e.length;g<h;++g){a=e[g];p=a.start;n=a.count;a=p;for(var r=p+n;a<r;a+=3)for(p=0;3>p;p++)c[0]=m[a+p],c[1]=m[a+(p+1)%3],c.sort(b),n=c.toString(),void 0===d[n]&&(l[2*k]=c[0],l[2*k+1]=c[1],d[n]=!0,k++)}c=new Float32Array(6*k);a=0;for(m=k;a<m;a++)for(p=0;2>p;p++)k=6*a+3*p,d=l[2*a+p],c[k+0]=f.getX(d),c[k+1]=f.getY(d),c[k+2]=f.getZ(d)}else for(f=a.attributes.position.array,k=f.length/3,l=k/3,c=new Float32Array(6*k),a=0,m=l;a<m;a++)for(p=0;3>p;p++)k=18*a+6*p,l=9*a+3*p,c[k+0]=f[l],c[k+1]=f[l+1],
	    c[k+2]=f[l+2],d=9*a+(p+1)%3*3,c[k+3]=f[d],c[k+4]=f[d+1],c[k+5]=f[d+2];this.addAttribute("position",new z(c,3))}}function jc(a,b,c){R.call(this);this.type="ParametricGeometry";this.parameters={func:a,slices:b,stacks:c};var d=this.vertices,e=this.faces,f=this.faceVertexUvs[0],g,k,l,m,h=b+1;for(g=0;g<=c;g++)for(m=g/c,k=0;k<=b;k++)l=k/b,l=a(l,m),d.push(l);var p,n,r,t;for(g=0;g<c;g++)for(k=0;k<b;k++)a=g*h+k,d=g*h+k+1,m=(g+1)*h+k+1,l=(g+1)*h+k,p=new C(k/b,g/c),n=new C((k+1)/b,g/c),r=new C((k+1)/b,(g+1)/
	    c),t=new C(k/b,(g+1)/c),e.push(new ga(a,d,l)),f.push([p,n,t]),e.push(new ga(d,m,l)),f.push([n.clone(),r,t.clone()]);this.computeFaceNormals();this.computeVertexNormals()}function sa(a,b,c,d){function e(a){var b=a.normalize().clone();b.index=l.vertices.push(b)-1;b.uv=new C(Math.atan2(a.z,-a.x)/2/Math.PI+.5,1-(Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+.5));return b}function f(a,b,c){var d=new ga(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);l.faces.push(d);A.copy(a).add(b).add(c).divideScalar(3);
	    d=Math.atan2(A.z,-A.x);l.faceVertexUvs[0].push([k(a.uv,a,d),k(b.uv,b,d),k(c.uv,c,d)])}function g(a,b){for(var c=Math.pow(2,b),d=e(l.vertices[a.a]),g=e(l.vertices[a.b]),k=e(l.vertices[a.c]),m=[],h=0;h<=c;h++){m[h]=[];for(var n=e(d.clone().lerp(k,h/c)),p=e(g.clone().lerp(k,h/c)),u=c-h,r=0;r<=u;r++)m[h][r]=0===r&&h===c?n:e(n.clone().lerp(p,r/u))}for(h=0;h<c;h++)for(r=0;r<2*(c-h)-1;r++)d=Math.floor(r/2),0===r%2?f(m[h][d+1],m[h+1][d],m[h][d]):f(m[h][d+1],m[h+1][d+1],m[h+1][d])}function k(a,b,c){0>c&&1===
	  a.x&&(a=new C(a.x-1,a.y));0===b.x&&0===b.z&&(a=new C(c/2/Math.PI+.5,a.y));return a.clone()}R.call(this);this.type="PolyhedronGeometry";this.parameters={vertices:a,indices:b,radius:c,detail:d};c=c||1;d=d||0;for(var l=this,m=0,h=a.length;m<h;m+=3)e(new q(a[m],a[m+1],a[m+2]));a=this.vertices;for(var p=[],n=m=0,h=b.length;m<h;m+=3,n++){var r=a[b[m]],t=a[b[m+1]],v=a[b[m+2]];p[n]=new ga(r.index,t.index,v.index,[r.clone(),t.clone(),v.clone()])}for(var A=new q,m=0,h=p.length;m<h;m++)g(p[m],d);m=0;for(h=this.faceVertexUvs[0].length;m<
	  h;m++)b=this.faceVertexUvs[0][m],d=b[0].x,a=b[1].x,p=b[2].x,n=Math.min(d,a,p),.9<Math.max(d,a,p)&&.1>n&&(.2>d&&(b[0].x+=1),.2>a&&(b[1].x+=1),.2>p&&(b[2].x+=1));m=0;for(h=this.vertices.length;m<h;m++)this.vertices[m].multiplyScalar(c);this.mergeVertices();this.computeFaceNormals();this.boundingSphere=new Aa(new q,c)}function kc(a,b){sa.call(this,[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],a,b);this.type="TetrahedronGeometry";this.parameters={radius:a,detail:b}}function lc(a,b){sa.call(this,
	    [1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],a,b);this.type="OctahedronGeometry";this.parameters={radius:a,detail:b}}function mc(a,b){var c=(1+Math.sqrt(5))/2;sa.call(this,[-1,c,0,1,c,0,-1,-c,0,1,-c,0,0,-1,c,0,1,c,0,-1,-c,0,1,-c,c,0,-1,c,0,1,-c,0,-1,-c,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],a,b);this.type="IcosahedronGeometry";this.parameters={radius:a,detail:b}}
	  function nc(a,b){var c=(1+Math.sqrt(5))/2,d=1/c;sa.call(this,[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-d,-c,0,-d,c,0,d,-c,0,d,c,-d,-c,0,-d,c,0,d,-c,0,d,c,0,-c,0,-d,c,0,-d,-c,0,d,c,0,d],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],a,b);this.type="DodecahedronGeometry";
	    this.parameters={radius:a,detail:b}}function wa(a,b,c,d,e,f){R.call(this);this.type="TubeGeometry";this.parameters={path:a,segments:b,radius:c,radialSegments:d,closed:e,taper:f};b=b||64;c=c||1;d=d||8;e=e||!1;f=f||wa.NoTaper;var g=[],k,l,m=b+1,h,p,n,r,t,v=new q,A,w,x;A=new wa.FrenetFrames(a,b,e);w=A.normals;x=A.binormals;this.tangents=A.tangents;this.normals=w;this.binormals=x;for(A=0;A<m;A++)for(g[A]=[],h=A/(m-1),t=a.getPointAt(h),k=w[A],l=x[A],n=c*f(h),h=0;h<d;h++)p=h/d*2*Math.PI,r=-n*Math.cos(p),
	    p=n*Math.sin(p),v.copy(t),v.x+=r*k.x+p*l.x,v.y+=r*k.y+p*l.y,v.z+=r*k.z+p*l.z,g[A][h]=this.vertices.push(new q(v.x,v.y,v.z))-1;for(A=0;A<b;A++)for(h=0;h<d;h++)f=e?(A+1)%b:A+1,m=(h+1)%d,a=g[A][h],c=g[f][h],f=g[f][m],m=g[A][m],v=new C(A/b,h/d),w=new C((A+1)/b,h/d),x=new C((A+1)/b,(h+1)/d),k=new C(A/b,(h+1)/d),this.faces.push(new ga(a,c,m)),this.faceVertexUvs[0].push([v,w,k]),this.faces.push(new ga(c,f,m)),this.faceVertexUvs[0].push([w.clone(),x,k.clone()]);this.computeFaceNormals();this.computeVertexNormals()}
	  function Jb(a,b,c,d,e,f){function g(a,b,c,d,e){var f=Math.sin(a);b=c/b*a;c=Math.cos(b);e.x=d*(2+c)*.5*Math.cos(a);e.y=d*(2+c)*f*.5;e.z=d*Math.sin(b)*.5}I.call(this);this.type="TorusKnotBufferGeometry";this.parameters={radius:a,tube:b,tubularSegments:c,radialSegments:d,p:e,q:f};a=a||100;b=b||40;c=Math.floor(c)||64;d=Math.floor(d)||8;e=e||2;f=f||3;var k=(d+1)*(c+1),l=d*c*6,l=new z(new (65535<l?Uint32Array:Uint16Array)(l),1),m=new z(new Float32Array(3*k),3),h=new z(new Float32Array(3*k),3),k=new z(new Float32Array(2*
	    k),2),p,n,r=0,t=0,v=new q,A=new q,w=new C,x=new q,T=new q,y=new q,F=new q,G=new q;for(p=0;p<=c;++p)for(n=p/c*e*Math.PI*2,g(n,e,f,a,x),g(n+.01,e,f,a,T),F.subVectors(T,x),G.addVectors(T,x),y.crossVectors(F,G),G.crossVectors(y,F),y.normalize(),G.normalize(),n=0;n<=d;++n){var E=n/d*Math.PI*2,J=-b*Math.cos(E),E=b*Math.sin(E);v.x=x.x+(J*G.x+E*y.x);v.y=x.y+(J*G.y+E*y.y);v.z=x.z+(J*G.z+E*y.z);m.setXYZ(r,v.x,v.y,v.z);A.subVectors(v,x).normalize();h.setXYZ(r,A.x,A.y,A.z);w.x=p/c;w.y=n/d;k.setXY(r,w.x,w.y);
	    r++}for(n=1;n<=c;n++)for(p=1;p<=d;p++)a=(d+1)*n+(p-1),b=(d+1)*n+p,e=(d+1)*(n-1)+p,l.setX(t,(d+1)*(n-1)+(p-1)),t++,l.setX(t,a),t++,l.setX(t,e),t++,l.setX(t,a),t++,l.setX(t,b),t++,l.setX(t,e),t++;this.setIndex(l);this.addAttribute("position",m);this.addAttribute("normal",h);this.addAttribute("uv",k)}function oc(a,b,c,d,e,f,g){R.call(this);this.type="TorusKnotGeometry";this.parameters={radius:a,tube:b,tubularSegments:c,radialSegments:d,p:e,q:f};void 0!==g&&console.warn("THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.");
	    this.fromBufferGeometry(new Jb(a,b,c,d,e,f));this.mergeVertices()}function Kb(a,b,c,d,e){I.call(this);this.type="TorusBufferGeometry";this.parameters={radius:a,tube:b,radialSegments:c,tubularSegments:d,arc:e};a=a||100;b=b||40;c=Math.floor(c)||8;d=Math.floor(d)||6;e=e||2*Math.PI;var f=(c+1)*(d+1),g=c*d*6,g=new (65535<g?Uint32Array:Uint16Array)(g),k=new Float32Array(3*f),l=new Float32Array(3*f),f=new Float32Array(2*f),m=0,h=0,p=0,n=new q,r=new q,t=new q,v,A;for(v=0;v<=c;v++)for(A=0;A<=d;A++){var w=
	    A/d*e,x=v/c*Math.PI*2;r.x=(a+b*Math.cos(x))*Math.cos(w);r.y=(a+b*Math.cos(x))*Math.sin(w);r.z=b*Math.sin(x);k[m]=r.x;k[m+1]=r.y;k[m+2]=r.z;n.x=a*Math.cos(w);n.y=a*Math.sin(w);t.subVectors(r,n).normalize();l[m]=t.x;l[m+1]=t.y;l[m+2]=t.z;f[h]=A/d;f[h+1]=v/c;m+=3;h+=2}for(v=1;v<=c;v++)for(A=1;A<=d;A++)a=(d+1)*(v-1)+A-1,b=(d+1)*(v-1)+A,e=(d+1)*v+A,g[p]=(d+1)*v+A-1,g[p+1]=a,g[p+2]=e,g[p+3]=a,g[p+4]=b,g[p+5]=e,p+=6;this.setIndex(new z(g,1));this.addAttribute("position",new z(k,3));this.addAttribute("normal",
	    new z(l,3));this.addAttribute("uv",new z(f,2))}function pc(a,b,c,d,e){R.call(this);this.type="TorusGeometry";this.parameters={radius:a,tube:b,radialSegments:c,tubularSegments:d,arc:e};this.fromBufferGeometry(new Kb(a,b,c,d,e))}function ra(a,b){"undefined"!==typeof a&&(R.call(this),this.type="ExtrudeGeometry",a=Array.isArray(a)?a:[a],this.addShapeList(a,b),this.computeFaceNormals())}function qc(a,b){b=b||{};var c=b.font;if(!1===(c&&c.isFont))return console.error("THREE.TextGeometry: font parameter is not an instance of THREE.Font."),
	    new R;c=c.generateShapes(a,b.size,b.curveSegments);b.amount=void 0!==b.height?b.height:50;void 0===b.bevelThickness&&(b.bevelThickness=10);void 0===b.bevelSize&&(b.bevelSize=8);void 0===b.bevelEnabled&&(b.bevelEnabled=!1);ra.call(this,c,b);this.type="TextGeometry"}function ib(a,b,c,d,e,f,g){I.call(this);this.type="SphereBufferGeometry";this.parameters={radius:a,widthSegments:b,heightSegments:c,phiStart:d,phiLength:e,thetaStart:f,thetaLength:g};a=a||50;b=Math.max(3,Math.floor(b)||8);c=Math.max(2,Math.floor(c)||
	    6);d=void 0!==d?d:0;e=void 0!==e?e:2*Math.PI;f=void 0!==f?f:0;g=void 0!==g?g:Math.PI;for(var k=f+g,l=(b+1)*(c+1),m=new z(new Float32Array(3*l),3),h=new z(new Float32Array(3*l),3),l=new z(new Float32Array(2*l),2),p=0,n=[],r=new q,t=0;t<=c;t++){for(var v=[],A=t/c,w=0;w<=b;w++){var x=w/b,T=-a*Math.cos(d+x*e)*Math.sin(f+A*g),y=a*Math.cos(f+A*g),F=a*Math.sin(d+x*e)*Math.sin(f+A*g);r.set(T,y,F).normalize();m.setXYZ(p,T,y,F);h.setXYZ(p,r.x,r.y,r.z);l.setXY(p,x,1-A);v.push(p);p++}n.push(v)}d=[];for(t=0;t<
	  c;t++)for(w=0;w<b;w++)e=n[t][w+1],g=n[t][w],p=n[t+1][w],r=n[t+1][w+1],(0!==t||0<f)&&d.push(e,g,r),(t!==c-1||k<Math.PI)&&d.push(g,p,r);this.setIndex(new (65535<m.count?ce:be)(d,1));this.addAttribute("position",m);this.addAttribute("normal",h);this.addAttribute("uv",l);this.boundingSphere=new Aa(new q,a)}function Lb(a,b,c,d,e,f,g){R.call(this);this.type="SphereGeometry";this.parameters={radius:a,widthSegments:b,heightSegments:c,phiStart:d,phiLength:e,thetaStart:f,thetaLength:g};this.fromBufferGeometry(new ib(a,
	    b,c,d,e,f,g))}function Mb(a,b,c,d,e,f){I.call(this);this.type="RingBufferGeometry";this.parameters={innerRadius:a,outerRadius:b,thetaSegments:c,phiSegments:d,thetaStart:e,thetaLength:f};a=a||20;b=b||50;e=void 0!==e?e:0;f=void 0!==f?f:2*Math.PI;c=void 0!==c?Math.max(3,c):8;d=void 0!==d?Math.max(1,d):1;var g=(c+1)*(d+1),k=c*d*6,k=new z(new (65535<k?Uint32Array:Uint16Array)(k),1),l=new z(new Float32Array(3*g),3),m=new z(new Float32Array(3*g),3),g=new z(new Float32Array(2*g),2),h=0,p=0,n,r=a,t=(b-a)/
	    d,v=new q,A=new C,w;for(a=0;a<=d;a++){for(w=0;w<=c;w++)n=e+w/c*f,v.x=r*Math.cos(n),v.y=r*Math.sin(n),l.setXYZ(h,v.x,v.y,v.z),m.setXYZ(h,0,0,1),A.x=(v.x/b+1)/2,A.y=(v.y/b+1)/2,g.setXY(h,A.x,A.y),h++;r+=t}for(a=0;a<d;a++)for(b=a*(c+1),w=0;w<c;w++)e=n=w+b,f=n+c+1,h=n+c+2,n+=1,k.setX(p,e),p++,k.setX(p,f),p++,k.setX(p,h),p++,k.setX(p,e),p++,k.setX(p,h),p++,k.setX(p,n),p++;this.setIndex(k);this.addAttribute("position",l);this.addAttribute("normal",m);this.addAttribute("uv",g)}function rc(a,b,c,d,e,f){R.call(this);
	    this.type="RingGeometry";this.parameters={innerRadius:a,outerRadius:b,thetaSegments:c,phiSegments:d,thetaStart:e,thetaLength:f};this.fromBufferGeometry(new Mb(a,b,c,d,e,f))}function sc(a,b,c,d){R.call(this);this.type="PlaneGeometry";this.parameters={width:a,height:b,widthSegments:c,heightSegments:d};this.fromBufferGeometry(new eb(a,b,c,d))}function Nb(a,b,c,d){I.call(this);this.type="LatheBufferGeometry";this.parameters={points:a,segments:b,phiStart:c,phiLength:d};b=Math.floor(b)||12;c=c||0;d=d||
	    2*Math.PI;d=h.Math.clamp(d,0,2*Math.PI);for(var e=(b+1)*a.length,f=b*a.length*6,g=new z(new (65535<f?Uint32Array:Uint16Array)(f),1),k=new z(new Float32Array(3*e),3),l=new z(new Float32Array(2*e),2),m=0,u=0,p=1/b,n=new q,r=new C,e=0;e<=b;e++)for(var f=c+e*p*d,t=Math.sin(f),v=Math.cos(f),f=0;f<=a.length-1;f++)n.x=a[f].x*t,n.y=a[f].y,n.z=a[f].x*v,k.setXYZ(m,n.x,n.y,n.z),r.x=e/b,r.y=f/(a.length-1),l.setXY(m,r.x,r.y),m++;for(e=0;e<b;e++)for(f=0;f<a.length-1;f++)c=f+e*a.length,m=c+a.length,p=c+a.length+
	    1,n=c+1,g.setX(u,c),u++,g.setX(u,m),u++,g.setX(u,n),u++,g.setX(u,m),u++,g.setX(u,p),u++,g.setX(u,n),u++;this.setIndex(g);this.addAttribute("position",k);this.addAttribute("uv",l);this.computeVertexNormals();if(d===2*Math.PI)for(d=this.attributes.normal.array,g=new q,k=new q,l=new q,c=b*a.length*3,f=e=0;e<a.length;e++,f+=3)g.x=d[f+0],g.y=d[f+1],g.z=d[f+2],k.x=d[c+f+0],k.y=d[c+f+1],k.z=d[c+f+2],l.addVectors(g,k).normalize(),d[f+0]=d[c+f+0]=l.x,d[f+1]=d[c+f+1]=l.y,d[f+2]=d[c+f+2]=l.z}function tc(a,b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      c,d){R.call(this);this.type="LatheGeometry";this.parameters={points:a,segments:b,phiStart:c,phiLength:d};this.fromBufferGeometry(new Nb(a,b,c,d));this.mergeVertices()}function Ya(a,b){R.call(this);this.type="ShapeGeometry";!1===Array.isArray(a)&&(a=[a]);this.addShapeList(a,b);this.computeFaceNormals()}function Ob(a,b){function c(a,b){return a-b}I.call(this);var d=Math.cos(h.Math.DEG2RAD*(void 0!==b?b:1)),e=[0,0],f={},g=["a","b","c"],k;a&&a.isBufferGeometry?(k=new R,k.fromBufferGeometry(a)):k=a.clone();
	    k.mergeVertices();k.computeFaceNormals();var l=k.vertices;k=k.faces;for(var m=0,u=k.length;m<u;m++)for(var p=k[m],n=0;3>n;n++){e[0]=p[g[n]];e[1]=p[g[(n+1)%3]];e.sort(c);var r=e.toString();void 0===f[r]?f[r]={vert1:e[0],vert2:e[1],face1:m,face2:void 0}:f[r].face2=m}e=[];for(r in f)if(g=f[r],void 0===g.face2||k[g.face1].normal.dot(k[g.face2].normal)<=d)m=l[g.vert1],e.push(m.x),e.push(m.y),e.push(m.z),m=l[g.vert2],e.push(m.x),e.push(m.y),e.push(m.z);this.addAttribute("position",new z(new Float32Array(e),
	      3))}function Za(a,b,c,d,e,f,g,k){function l(c){var e,f,l,h=new C,n=new q,p=0,u=!0===c?a:b,T=!0===c?1:-1;f=w;for(e=1;e<=d;e++)t.setXYZ(w,0,y*T,0),v.setXYZ(w,0,T,0),h.x=.5,h.y=.5,A.setXY(w,h.x,h.y),w++;l=w;for(e=0;e<=d;e++){var D=e/d*k+g,z=Math.cos(D),D=Math.sin(D);n.x=u*D;n.y=y*T;n.z=u*z;t.setXYZ(w,n.x,n.y,n.z);v.setXYZ(w,0,T,0);h.x=.5*z+.5;h.y=.5*D*T+.5;A.setXY(w,h.x,h.y);w++}for(e=0;e<d;e++)h=f+e,n=l+e,!0===c?(r.setX(x,n),x++,r.setX(x,n+1)):(r.setX(x,n+1),x++,r.setX(x,n)),x++,r.setX(x,h),x++,p+=
	    3;m.addGroup(F,p,!0===c?1:2);F+=p}I.call(this);this.type="CylinderBufferGeometry";this.parameters={radiusTop:a,radiusBottom:b,height:c,radialSegments:d,heightSegments:e,openEnded:f,thetaStart:g,thetaLength:k};var m=this;a=void 0!==a?a:20;b=void 0!==b?b:20;c=void 0!==c?c:100;d=Math.floor(d)||8;e=Math.floor(e)||1;f=void 0!==f?f:!1;g=void 0!==g?g:0;k=void 0!==k?k:2*Math.PI;var h=0;!1===f&&(0<a&&h++,0<b&&h++);var p=function(){var a=(d+1)*(e+1);!1===f&&(a+=(d+1)*h+d*h);return a}(),n=function(){var a=d*
	    e*6;!1===f&&(a+=d*h*3);return a}(),r=new z(new (65535<n?Uint32Array:Uint16Array)(n),1),t=new z(new Float32Array(3*p),3),v=new z(new Float32Array(3*p),3),A=new z(new Float32Array(2*p),2),w=0,x=0,T=[],y=c/2,F=0;(function(){var f,l,h=new q,n=new q,p=0,u=(b-a)/c;for(l=0;l<=e;l++){var C=[],D=l/e,z=D*(b-a)+a;for(f=0;f<=d;f++){var L=f/d,M=L*k+g,O=Math.sin(M),M=Math.cos(M);n.x=z*O;n.y=-D*c+y;n.z=z*M;t.setXYZ(w,n.x,n.y,n.z);h.set(O,u,M).normalize();v.setXYZ(w,h.x,h.y,h.z);A.setXY(w,L,1-D);C.push(w);w++}T.push(C)}for(f=
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       0;f<d;f++)for(l=0;l<e;l++)h=T[l+1][f],n=T[l+1][f+1],u=T[l][f+1],r.setX(x,T[l][f]),x++,r.setX(x,h),x++,r.setX(x,u),x++,r.setX(x,h),x++,r.setX(x,n),x++,r.setX(x,u),x++,p+=6;m.addGroup(F,p,0);F+=p})();!1===f&&(0<a&&l(!0),0<b&&l(!1));this.setIndex(r);this.addAttribute("position",t);this.addAttribute("normal",v);this.addAttribute("uv",A)}function jb(a,b,c,d,e,f,g,k){R.call(this);this.type="CylinderGeometry";this.parameters={radiusTop:a,radiusBottom:b,height:c,radialSegments:d,heightSegments:e,openEnded:f,
	    thetaStart:g,thetaLength:k};this.fromBufferGeometry(new Za(a,b,c,d,e,f,g,k));this.mergeVertices()}function uc(a,b,c,d,e,f,g){jb.call(this,0,a,b,c,d,e,f,g);this.type="ConeGeometry";this.parameters={radius:a,height:b,radialSegments:c,heightSegments:d,openEnded:e,thetaStart:f,thetaLength:g}}function vc(a,b,c,d,e,f,g){Za.call(this,0,a,b,c,d,e,f,g);this.type="ConeBufferGeometry";this.parameters={radius:a,height:b,radialSegments:c,heightSegments:d,thetaStart:f,thetaLength:g}}function Pb(a,b,c,d){I.call(this);
	    this.type="CircleBufferGeometry";this.parameters={radius:a,segments:b,thetaStart:c,thetaLength:d};a=a||50;b=void 0!==b?Math.max(3,b):8;c=void 0!==c?c:0;d=void 0!==d?d:2*Math.PI;var e=b+2,f=new Float32Array(3*e),g=new Float32Array(3*e),e=new Float32Array(2*e);g[2]=1;e[0]=.5;e[1]=.5;for(var k=0,l=3,m=2;k<=b;k++,l+=3,m+=2){var h=c+k/b*d;f[l]=a*Math.cos(h);f[l+1]=a*Math.sin(h);g[l+2]=1;e[m]=(f[l]/a+1)/2;e[m+1]=(f[l+1]/a+1)/2}c=[];for(l=1;l<=b;l++)c.push(l,l+1,0);this.setIndex(new z(new Uint16Array(c),
	      1));this.addAttribute("position",new z(f,3));this.addAttribute("normal",new z(g,3));this.addAttribute("uv",new z(e,2));this.boundingSphere=new Aa(new q,a)}function wc(a,b,c,d){R.call(this);this.type="CircleGeometry";this.parameters={radius:a,segments:b,thetaStart:c,thetaLength:d};this.fromBufferGeometry(new Pb(a,b,c,d))}function kb(a,b,c,d,e,f){R.call(this);this.type="BoxGeometry";this.parameters={width:a,height:b,depth:c,widthSegments:d,heightSegments:e,depthSegments:f};this.fromBufferGeometry(new db(a,
	    b,c,d,e,f));this.mergeVertices()}function Qb(){Da.call(this,{uniforms:h.UniformsUtils.merge([U.lights,{opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag});this.transparent=this.lights=!0;Object.defineProperties(this,{opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(a){this.uniforms.opacity.value=a}}})}function Rb(a){Da.call(this,a);this.type="RawShaderMaterial"}function xc(a){this.uuid=h.Math.generateUUID();this.type="MultiMaterial";
	    this.materials=a instanceof Array?a:[];this.visible=!0}function Ka(a){S.call(this);this.defines={STANDARD:""};this.type="MeshStandardMaterial";this.color=new H(16777215);this.metalness=this.roughness=.5;this.lightMap=this.map=null;this.lightMapIntensity=1;this.aoMap=null;this.aoMapIntensity=1;this.emissive=new H(0);this.emissiveIntensity=1;this.bumpMap=this.emissiveMap=null;this.bumpScale=1;this.normalMap=null;this.normalScale=new C(1,1);this.displacementMap=null;this.displacementScale=1;this.displacementBias=
	    0;this.envMap=this.alphaMap=this.metalnessMap=this.roughnessMap=null;this.envMapIntensity=1;this.refractionRatio=.98;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)}function lb(a){Ka.call(this);this.defines={PHYSICAL:""};this.type="MeshPhysicalMaterial";this.reflectivity=.5;this.clearCoatRoughness=this.clearCoat=0;this.setValues(a)}function $a(a){S.call(this);this.type="MeshPhongMaterial";
	    this.color=new H(16777215);this.specular=new H(1118481);this.shininess=30;this.lightMap=this.map=null;this.lightMapIntensity=1;this.aoMap=null;this.aoMapIntensity=1;this.emissive=new H(0);this.emissiveIntensity=1;this.bumpMap=this.emissiveMap=null;this.bumpScale=1;this.normalMap=null;this.normalScale=new C(1,1);this.displacementMap=null;this.displacementScale=1;this.displacementBias=0;this.envMap=this.alphaMap=this.specularMap=null;this.combine=0;this.reflectivity=1;this.refractionRatio=.98;this.wireframe=
	      !1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)}function mb(a){S.call(this,a);this.type="MeshNormalMaterial";this.wireframe=!1;this.wireframeLinewidth=1;this.morphTargets=this.lights=this.fog=!1;this.setValues(a)}function nb(a){S.call(this);this.type="MeshLambertMaterial";this.color=new H(16777215);this.lightMap=this.map=null;this.lightMapIntensity=1;this.aoMap=null;this.aoMapIntensity=1;this.emissive=
	    new H(0);this.emissiveIntensity=1;this.envMap=this.alphaMap=this.specularMap=this.emissiveMap=null;this.combine=0;this.reflectivity=1;this.refractionRatio=.98;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)}function ob(a){S.call(this);this.type="LineDashedMaterial";this.color=new H(16777215);this.scale=this.linewidth=1;this.dashSize=3;this.gapSize=1;this.lights=!1;this.setValues(a)}
	  function qd(a,b,c){var d=this,e=!1,f=0,g=0;this.onStart=void 0;this.onLoad=a;this.onProgress=b;this.onError=c;this.itemStart=function(a){g++;if(!1===e&&void 0!==d.onStart)d.onStart(a,f,g);e=!0};this.itemEnd=function(a){f++;if(void 0!==d.onProgress)d.onProgress(a,f,g);if(f===g&&(e=!1,void 0!==d.onLoad))d.onLoad()};this.itemError=function(a){if(void 0!==d.onError)d.onError(a)}}function za(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function ie(a){this.manager=void 0!==a?a:h.DefaultLoadingManager;
	    this._parser=null}function rd(a){this.manager=void 0!==a?a:h.DefaultLoadingManager;this._parser=null}function yc(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function sd(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function Sc(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function oa(a,b){D.call(this);this.type="Light";this.color=new H(a);this.intensity=void 0!==b?b:1;this.receiveShadow=void 0}function Tc(a,b,c){oa.call(this,a,c);this.type="HemisphereLight";this.castShadow=
	    void 0;this.position.copy(D.DefaultUp);this.updateMatrix();this.groundColor=new H(b)}function pb(a){this.camera=a;this.bias=0;this.radius=1;this.mapSize=new C(512,512);this.map=null;this.matrix=new P}function Uc(){pb.call(this,new Ca(50,1,.5,500))}function Vc(a,b,c,d,e,f){oa.call(this,a,b);this.type="SpotLight";this.position.copy(D.DefaultUp);this.updateMatrix();this.target=new D;Object.defineProperty(this,"power",{get:function(){return this.intensity*Math.PI},set:function(a){this.intensity=a/Math.PI}});
	    this.distance=void 0!==c?c:0;this.angle=void 0!==d?d:Math.PI/3;this.penumbra=void 0!==e?e:0;this.decay=void 0!==f?f:1;this.shadow=new Uc}function Wc(a,b,c,d){oa.call(this,a,b);this.type="PointLight";Object.defineProperty(this,"power",{get:function(){return 4*this.intensity*Math.PI},set:function(a){this.intensity=a/(4*Math.PI)}});this.distance=void 0!==c?c:0;this.decay=void 0!==d?d:1;this.shadow=new pb(new Ca(90,1,.5,500))}function Xc(a){pb.call(this,new Db(-5,5,5,-5,.5,500))}function Yc(a,b){oa.call(this,
	    a,b);this.type="DirectionalLight";this.position.copy(D.DefaultUp);this.updateMatrix();this.target=new D;this.shadow=new Xc}function Zc(a,b){oa.call(this,a,b);this.type="AmbientLight";this.castShadow=void 0}function ja(a,b,c,d){this.parameterPositions=a;this._cachedIndex=0;this.resultBuffer=void 0!==d?d:new b.constructor(c);this.sampleValues=b;this.valueSize=c}function $c(a,b,c,d){ja.call(this,a,b,c,d);this._offsetNext=this._weightNext=this._offsetPrev=this._weightPrev=-0}function zc(a,b,c,d){ja.call(this,
	    a,b,c,d)}function ad(a,b,c,d){ja.call(this,a,b,c,d)}function qb(a,b,c,d){if(void 0===a)throw Error("track name is undefined");if(void 0===b||0===b.length)throw Error("no keyframes in track named "+a);this.name=a;this.times=h.AnimationUtils.convertArray(b,this.TimeBufferType);this.values=h.AnimationUtils.convertArray(c,this.ValueBufferType);this.setInterpolation(d||this.DefaultInterpolation);this.validate();this.optimize()}function Sb(a,b,c,d){qb.call(this,a,b,c,d)}function bd(a,b,c,d){ja.call(this,
	    a,b,c,d)}function Ac(a,b,c,d){qb.call(this,a,b,c,d)}function Tb(a,b,c,d){qb.call(this,a,b,c,d)}function cd(a,b,c,d){qb.call(this,a,b,c,d)}function dd(a,b,c){qb.call(this,a,b,c)}function ed(a,b,c,d){qb.call(this,a,b,c,d)}function rb(a,b,c,d){qb.apply(this,arguments)}function ta(a,b,c){this.name=a;this.tracks=c;this.duration=void 0!==b?b:-1;this.uuid=h.Math.generateUUID();0>this.duration&&this.resetDuration();this.optimize()}function fd(a){this.manager=void 0!==a?a:h.DefaultLoadingManager;this.textures=
	  {}}function td(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function sb(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}}function ud(a){"boolean"===typeof a&&(console.warn("THREE.JSONLoader: showStatus parameter has been removed from constructor."),a=void 0);this.manager=void 0!==a?a:h.DefaultLoadingManager;this.withCredentials=!1}function je(a){this.manager=void 0!==a?a:h.DefaultLoadingManager;this.texturePath=""}function Y(){}function La(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       b){this.v1=a;this.v2=b}function Bc(){this.curves=[];this.autoClose=!1}function Ra(a,b,c,d,e,f,g,k){this.aX=a;this.aY=b;this.xRadius=c;this.yRadius=d;this.aStartAngle=e;this.aEndAngle=f;this.aClockwise=g;this.aRotation=k||0}function tb(a){this.points=void 0===a?[]:a}function ub(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d}function vb(a,b,c){this.v0=a;this.v1=b;this.v2=c}function wb(){Cc.apply(this,arguments);this.holes=[]}function Cc(a){Bc.call(this);this.currentPoint=new C;a&&this.fromPoints(a)}
	  function vd(){this.subPaths=[];this.currentPath=null}function wd(a){this.data=a}function ke(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function xd(){void 0===yd&&(yd=new (window.AudioContext||window.webkitAudioContext));return yd}function zd(a){this.manager=void 0!==a?a:h.DefaultLoadingManager}function le(){this.type="StereoCamera";this.aspect=1;this.eyeSep=.064;this.cameraL=new Ca;this.cameraL.layers.enable(1);this.cameraL.matrixAutoUpdate=!1;this.cameraR=new Ca;this.cameraR.layers.enable(2);
	    this.cameraR.matrixAutoUpdate=!1}function gd(a,b,c){D.call(this);this.type="CubeCamera";var d=new Ca(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new q(1,0,0));this.add(d);var e=new Ca(90,1,a,b);e.up.set(0,-1,0);e.lookAt(new q(-1,0,0));this.add(e);var f=new Ca(90,1,a,b);f.up.set(0,0,1);f.lookAt(new q(0,1,0));this.add(f);var g=new Ca(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new q(0,-1,0));this.add(g);var k=new Ca(90,1,a,b);k.up.set(0,-1,0);k.lookAt(new q(0,0,1));this.add(k);var l=new Ca(90,1,a,b);l.up.set(0,-1,
	    0);l.lookAt(new q(0,0,-1));this.add(l);this.renderTarget=new Ab(c,c,{format:1022,magFilter:1006,minFilter:1006});this.updateCubeMap=function(a,b){null===this.parent&&this.updateMatrixWorld();var c=this.renderTarget,h=c.texture.generateMipmaps;c.texture.generateMipmaps=!1;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,e,c);c.activeCubeFace=2;a.render(b,f,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,k,c);c.texture.generateMipmaps=h;c.activeCubeFace=5;a.render(b,
	    l,c);a.setRenderTarget(null)}}function Ad(){D.call(this);this.type="AudioListener";this.context=xd();this.gain=this.context.createGain();this.gain.connect(this.context.destination);this.filter=null}function Ub(a){D.call(this);this.type="Audio";this.context=a.context;this.source=this.context.createBufferSource();this.source.onended=this.onEnded.bind(this);this.gain=this.context.createGain();this.gain.connect(a.getInput());this.autoplay=!1;this.startTime=0;this.playbackRate=1;this.isPlaying=!1;this.hasPlaybackControl=
	    !0;this.sourceType="empty";this.filters=[]}function Bd(a){Ub.call(this,a);this.panner=this.context.createPanner();this.panner.connect(this.gain)}function Cd(a,b){this.analyser=a.context.createAnalyser();this.analyser.fftSize=void 0!==b?b:2048;this.data=new Uint8Array(this.analyser.frequencyBinCount);a.getOutput().connect(this.analyser)}function hd(a,b,c){this.binding=a;this.valueSize=c;a=Float64Array;switch(b){case "quaternion":b=this._slerp;break;case "string":case "bool":a=Array;b=this._select;
	    break;default:b=this._lerp}this.buffer=new a(4*c);this._mixBufferRegion=b;this.referenceCount=this.useCount=this.cumulativeWeight=0}function ka(a,b,c){this.path=b;this.parsedPath=c||ka.parseTrackName(b);this.node=ka.findNode(a,this.parsedPath.nodeName)||a;this.rootNode=a}function Dd(a){this.uuid=h.Math.generateUUID();this._objects=Array.prototype.slice.call(arguments);this.nCachedObjects_=0;var b={};this._indicesByUUID=b;for(var c=0,d=arguments.length;c!==d;++c)b[arguments[c].uuid]=c;this._paths=
	    [];this._parsedPaths=[];this._bindings=[];this._bindingsIndicesByPath={};var e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}function Ed(a,b,c){this._mixer=a;this._clip=b;this._localRoot=c||null;a=b.tracks;b=a.length;c=Array(b);for(var d={endingStart:2400,endingEnd:2400},e=0;e!==b;++e){var f=a[e].createInterpolant(null);c[e]=f;f.settings=d}this._interpolantSettings=d;this._interpolants=
	    c;this._propertyBindings=Array(b);this._weightInterpolant=this._timeScaleInterpolant=this._byClipCacheIndex=this._cacheIndex=null;this.loop=2201;this._loopCount=-1;this._startTime=null;this.time=0;this._effectiveWeight=this.weight=this._effectiveTimeScale=this.timeScale=1;this.repetitions=Infinity;this.paused=!1;this.enabled=!0;this.clampWhenFinished=!1;this.zeroSlopeAtEnd=this.zeroSlopeAtStart=!0}function Fd(a){this._root=a;this._initMemoryManager();this.time=this._accuIndex=0;this.timeScale=1}function Gd(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    b){"string"===typeof a&&(console.warn("THREE.Uniform: Type parameter is no longer needed."),a=b);this.value=a;this.dynamic=!1}function xb(){I.call(this);this.type="InstancedBufferGeometry";this.maxInstancedCount=void 0}function Hd(a,b,c,d){this.uuid=h.Math.generateUUID();this.data=a;this.itemSize=b;this.offset=c;this.normalized=!0===d}function Vb(a,b){this.uuid=h.Math.generateUUID();this.array=a;this.stride=b;this.count=void 0!==a?a.length/b:0;this.dynamic=!1;this.updateRange={offset:0,count:-1};
	    this.version=0}function Wb(a,b,c){Vb.call(this,a,b);this.meshPerAttribute=c||1}function Xb(a,b,c){z.call(this,a,b);this.meshPerAttribute=c||1}function Id(a,b,c,d){this.ray=new Wa(a,b);this.near=c||0;this.far=d||Infinity;this.params={Mesh:{},Line:{},LOD:{},Points:{threshold:1},Sprite:{}};Object.defineProperties(this.params,{PointCloud:{get:function(){console.warn("THREE.Raycaster: params.PointCloud has been renamed to params.Points.");return this.Points}}})}function me(a,b){return a.distance-b.distance}
	  function Jd(a,b,c,d){if(!1!==a.visible&&(a.raycast(b,c),!0===d)){a=a.children;d=0;for(var e=a.length;d<e;d++)Jd(a[d],b,c,!0)}}function Kd(a){this.autoStart=void 0!==a?a:!0;this.elapsedTime=this.oldTime=this.startTime=0;this.running=!1}function Ld(a,b,c){this.radius=void 0!==a?a:1;this.phi=void 0!==b?b:0;this.theta=void 0!==c?c:0;return this}function la(a,b){va.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,
	    c/1);this.setAnimationWeight("__default",1)}function Dc(a){D.call(this);this.material=a;this.render=function(a){}}function Ec(a,b,c,d){this.object=a;this.size=void 0!==b?b:1;a=void 0!==c?c:16711680;d=void 0!==d?d:1;b=0;(c=this.object.geometry)&&c.isGeometry?b=3*c.faces.length:c&&c.isBufferGeometry&&(b=c.attributes.normal.count);c=new I;b=new ma(6*b,3);c.addAttribute("position",b);ha.call(this,c,new na({color:a,linewidth:d}));this.matrixAutoUpdate=!1;this.update()}function Yb(a){D.call(this);this.light=
	    a;this.light.updateMatrixWorld();this.matrix=a.matrixWorld;this.matrixAutoUpdate=!1;a=new I;for(var b=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1],c=0,d=1;32>c;c++,d++){var e=c/32*Math.PI*2,f=d/32*Math.PI*2;b.push(Math.cos(e),Math.sin(e),1,Math.cos(f),Math.sin(f),1)}a.addAttribute("position",new ma(b,3));b=new na({fog:!1});this.cone=new ha(a,b);this.add(this.cone);this.update()}function Zb(a){this.bones=this.getBoneList(a);for(var b=new R,c=0;c<this.bones.length;c++){var d=this.bones[c];
	    d.parent&&d.parent.isBone&&(b.vertices.push(new q),b.vertices.push(new q),b.colors.push(new H(0,0,1)),b.colors.push(new H(0,1,0)))}b.dynamic=!0;c=new na({vertexColors:2,depthTest:!1,depthWrite:!1,transparent:!0});ha.call(this,b,c);this.root=a;this.matrix=a.matrixWorld;this.matrixAutoUpdate=!1;this.update()}function $b(a,b){this.light=a;this.light.updateMatrixWorld();var c=new ib(b,4,2),d=new Ia({wireframe:!0,fog:!1});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);va.call(this,
	    c,d);this.matrix=this.light.matrixWorld;this.matrixAutoUpdate=!1}function ac(a,b){D.call(this);this.light=a;this.light.updateMatrixWorld();this.matrix=a.matrixWorld;this.matrixAutoUpdate=!1;this.colors=[new H,new H];var c=new Lb(b,4,2);c.rotateX(-Math.PI/2);for(var d=0;8>d;d++)c.faces[d].color=this.colors[4>d?0:1];d=new Ia({vertexColors:1,wireframe:!0});this.lightSphere=new va(c,d);this.add(this.lightSphere);this.update()}function Fc(a,b,c,d){b=b||1;c=new H(void 0!==c?c:4473924);d=new H(void 0!==
	  d?d:8947848);for(var e=b/2,f=2*a/b,g=[],k=[],l=0,m=0,h=-a;l<=b;l++,h+=f){g.push(-a,0,h,a,0,h);g.push(h,0,-a,h,0,a);var p=l===e?c:d;p.toArray(k,m);m+=3;p.toArray(k,m);m+=3;p.toArray(k,m);m+=3;p.toArray(k,m);m+=3}a=new I;a.addAttribute("position",new ma(g,3));a.addAttribute("color",new ma(k,3));g=new na({vertexColors:2});ha.call(this,a,g)}function Gc(a,b,c,d){this.object=a;this.size=void 0!==b?b:1;a=void 0!==c?c:16776960;d=void 0!==d?d:1;b=0;(c=this.object.geometry)&&c.isGeometry?b=c.faces.length:console.warn("THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.");
	    c=new I;b=new ma(6*b,3);c.addAttribute("position",b);ha.call(this,c,new na({color:a,linewidth:d}));this.matrixAutoUpdate=!1;this.update()}function bc(a,b){D.call(this);this.light=a;this.light.updateMatrixWorld();this.matrix=a.matrixWorld;this.matrixAutoUpdate=!1;void 0===b&&(b=1);var c=new I;c.addAttribute("position",new ma([-b,b,0,b,b,0,b,-b,0,-b,-b,0,-b,b,0],3));var d=new na({fog:!1});this.add(new Pa(c,d));c=new I;c.addAttribute("position",new ma([0,0,0,0,0,1],3));this.add(new Pa(c,d));this.update()}
	  function Hc(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.vertices.push(new q);d.colors.push(new H(b));void 0===f[a]&&(f[a]=[]);f[a].push(d.vertices.length-1)}var d=new R,e=new na({color:16777215,vertexColors:1}),f={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4","n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);b("n1","f1",16755200);b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);
	    b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);ha.call(this,d,e);this.camera=a;this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix();this.matrix=a.matrixWorld;this.matrixAutoUpdate=!1;this.pointMap=f;this.update()}function Ic(a,b){var c=void 0!==b?b:8947848;this.object=a;this.box=
	    new Ha;va.call(this,new kb(1,1,1),new Ia({color:c,wireframe:!0}))}function Jc(a,b){void 0===b&&(b=16776960);var c=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),d=new Float32Array(24),e=new I;e.setIndex(new z(c,1));e.addAttribute("position",new z(d,3));ha.call(this,e,new na({color:b}));void 0!==a&&this.update(a)}function yb(a,b,c,d,e,f){D.call(this);void 0===d&&(d=16776960);void 0===c&&(c=1);void 0===e&&(e=.2*c);void 0===f&&(f=.2*e);this.position.copy(b);this.line=new Pa(ne,new na({color:d}));
	    this.line.matrixAutoUpdate=!1;this.add(this.line);this.cone=new va(oe,new Ia({color:d}));this.cone.matrixAutoUpdate=!1;this.add(this.cone);this.setDirection(a);this.setLength(c,e,f)}function id(a){a=a||1;var b=new Float32Array([0,0,0,a,0,0,0,0,0,0,a,0,0,0,0,0,0,a]),c=new Float32Array([1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1]);a=new I;a.addAttribute("position",new z(b,3));a.addAttribute("color",new z(c,3));b=new na({vertexColors:2});ha.call(this,a,b)}function pe(a){console.warn("THREE.ClosedSplineCurve3 has been deprecated. Please use THREE.CatmullRomCurve3.");
	    h.CatmullRomCurve3.call(this,a);this.type="catmullrom";this.closed=!0}function jd(a,b,c,d,e,f){Ra.call(this,a,b,c,c,d,e,f)}void 0===Number.EPSILON&&(Number.EPSILON=Math.pow(2,-52));void 0===Math.sign&&(Math.sign=function(a){return 0>a?-1:0<a?1:+a});void 0===Function.prototype.name&&Object.defineProperty(Function.prototype,"name",{get:function(){return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]}});void 0===Object.assign&&function(){Object.assign=function(a){if(void 0===a||null===a)throw new TypeError("Cannot convert undefined or null to object");
	    for(var b=Object(a),c=1;c<arguments.length;c++){var d=arguments[c];if(void 0!==d&&null!==d)for(var e in d)Object.prototype.hasOwnProperty.call(d,e)&&(b[e]=d[e])}return b}}();Object.assign(pa.prototype,{addEventListener:function(a,b){void 0===this._listeners&&(this._listeners={});var c=this._listeners;void 0===c[a]&&(c[a]=[]);-1===c[a].indexOf(b)&&c[a].push(b)},hasEventListener:function(a,b){if(void 0===this._listeners)return!1;var c=this._listeners;return void 0!==c[a]&&-1!==c[a].indexOf(b)?!0:!1},
	    removeEventListener:function(a,b){if(void 0!==this._listeners){var c=this._listeners[a];if(void 0!==c){var d=c.indexOf(b);-1!==d&&c.splice(d,1)}}},dispatchEvent:function(a){if(void 0!==this._listeners){var b=this._listeners[a.type];if(void 0!==b){a.target=this;var c=[],d,e=b.length;for(d=0;d<e;d++)c[d]=b[d];for(d=0;d<e;d++)c[d].call(this,a)}}}});var qe={NoBlending:0,NormalBlending:1,AdditiveBlending:2,SubtractiveBlending:3,MultiplyBlending:4,CustomBlending:5},re={UVMapping:300,CubeReflectionMapping:301,
	    CubeRefractionMapping:302,EquirectangularReflectionMapping:303,EquirectangularRefractionMapping:304,SphericalReflectionMapping:305,CubeUVReflectionMapping:306,CubeUVRefractionMapping:307},Md={RepeatWrapping:1E3,ClampToEdgeWrapping:1001,MirroredRepeatWrapping:1002},Nd={NearestFilter:1003,NearestMipMapNearestFilter:1004,NearestMipMapLinearFilter:1005,LinearFilter:1006,LinearMipMapNearestFilter:1007,LinearMipMapLinearFilter:1008};h.Math={DEG2RAD:Math.PI/180,RAD2DEG:180/Math.PI,generateUUID:function(){var a=
	    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),b=Array(36),c=0,d;return function(){for(var e=0;36>e;e++)8===e||13===e||18===e||23===e?b[e]="-":14===e?b[e]="4":(2>=c&&(c=33554432+16777216*Math.random()|0),d=c&15,c>>=4,b[e]=a[19===e?d&3|8:d]);return b.join("")}}(),clamp:function(a,b,c){return Math.max(b,Math.min(c,a))},euclideanModulo:function(a,b){return(a%b+b)%b},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},smoothstep:function(a,b,c){if(a<=b)return 0;if(a>=
	    c)return 1;a=(a-b)/(c-b);return a*a*(3-2*a)},smootherstep:function(a,b,c){if(a<=b)return 0;if(a>=c)return 1;a=(a-b)/(c-b);return a*a*a*(a*(6*a-15)+10)},random16:function(){console.warn("THREE.Math.random16() has been deprecated. Use Math.random() instead.");return Math.random()},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(.5-Math.random())},degToRad:function(a){return a*h.Math.DEG2RAD},
	    radToDeg:function(a){return a*h.Math.RAD2DEG},isPowerOfTwo:function(a){return 0===(a&a-1)&&0!==a},nearestPowerOfTwo:function(a){return Math.pow(2,Math.round(Math.log(a)/Math.LN2))},nextPowerOfTwo:function(a){a--;a|=a>>1;a|=a>>2;a|=a>>4;a|=a>>8;a|=a>>16;a++;return a}};C.prototype={constructor:C,isVector2:!0,get width(){return this.x},set width(a){this.x=a},get height(){return this.y},set height(a){this.y=a},set:function(a,b){this.x=a;this.y=b;return this},setScalar:function(a){this.y=this.x=a;return this},
	    setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+a);}},clone:function(){return new this.constructor(this.x,this.y)},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,b){if(void 0!==b)return console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),
	      this.addVectors(a,b);this.x+=a.x;this.y+=a.y;return this},addScalar:function(a){this.x+=a;this.y+=a;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addScaledVector:function(a,b){this.x+=a.x*b;this.y+=a.y*b;return this},sub:function(a,b){if(void 0!==b)return console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=a.y;return this},subScalar:function(a){this.x-=a;this.y-=a;return this},
	    subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},multiply:function(a){this.x*=a.x;this.y*=a.y;return this},multiplyScalar:function(a){isFinite(a)?(this.x*=a,this.y*=a):this.y=this.x=0;return this},divide:function(a){this.x/=a.x;this.y/=a.y;return this},divideScalar:function(a){return this.multiplyScalar(1/a)},min:function(a){this.x=Math.min(this.x,a.x);this.y=Math.min(this.y,a.y);return this},max:function(a){this.x=Math.max(this.x,a.x);this.y=Math.max(this.y,a.y);return this},clamp:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       b){this.x=Math.max(a.x,Math.min(b.x,this.x));this.y=Math.max(a.y,Math.min(b.y,this.y));return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new C,b=new C);a.set(c,c);b.set(d,d);return this.clamp(a,b)}}(),clampLength:function(a,b){var c=this.length();return this.multiplyScalar(Math.max(a,Math.min(b,c))/c)},floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this},round:function(){this.x=
	      Math.round(this.x);this.y=Math.round(this.y);return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);return this},negate:function(){this.x=-this.x;this.y=-this.y;return this},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)},normalize:function(){return this.divideScalar(this.length())},
	    angle:function(){var a=Math.atan2(this.y,this.x);0>a&&(a+=2*Math.PI);return a},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x;a=this.y-a.y;return b*b+a*a},distanceToManhattan:function(a){return Math.abs(this.x-a.x)+Math.abs(this.y-a.y)},setLength:function(a){return this.multiplyScalar(a/this.length())},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;return this},lerpVectors:function(a,b,c){return this.subVectors(b,
	      a).multiplyScalar(c).add(a)},equals:function(a){return a.x===this.x&&a.y===this.y},fromArray:function(a,b){void 0===b&&(b=0);this.x=a[b];this.y=a[b+1];return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this.x;a[b+1]=this.y;return a},fromAttribute:function(a,b,c){void 0===c&&(c=0);b=b*a.itemSize+c;this.x=a.array[b];this.y=a.array[b+1];return this},rotateAround:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=this.x-a.x,f=this.y-a.y;this.x=e*c-f*d+a.x;this.y=e*d+f*c+a.y;return this}};
	  ba.DEFAULT_IMAGE=void 0;ba.DEFAULT_MAPPING=300;ba.prototype={constructor:ba,isTexture:!0,set needsUpdate(a){!0===a&&this.version++},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.image=a.image;this.mipmaps=a.mipmaps.slice(0);this.mapping=a.mapping;this.wrapS=a.wrapS;this.wrapT=a.wrapT;this.magFilter=a.magFilter;this.minFilter=a.minFilter;this.anisotropy=a.anisotropy;this.format=a.format;this.type=a.type;this.offset.copy(a.offset);this.repeat.copy(a.repeat);this.generateMipmaps=
	    a.generateMipmaps;this.premultiplyAlpha=a.premultiplyAlpha;this.flipY=a.flipY;this.unpackAlignment=a.unpackAlignment;this.encoding=a.encoding;return this},toJSON:function(a){if(void 0!==a.textures[this.uuid])return a.textures[this.uuid];var b={metadata:{version:4.4,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],wrap:[this.wrapS,this.wrapT],minFilter:this.minFilter,magFilter:this.magFilter,
	    anisotropy:this.anisotropy,flipY:this.flipY};if(void 0!==this.image){var c=this.image;void 0===c.uuid&&(c.uuid=h.Math.generateUUID());if(void 0===a.images[c.uuid]){var d=a.images,e=c.uuid,f=c.uuid,g;void 0!==c.toDataURL?g=c:(g=document.createElementNS("http://www.w3.org/1999/xhtml","canvas"),g.width=c.width,g.height=c.height,g.getContext("2d").drawImage(c,0,0,c.width,c.height));g=2048<g.width||2048<g.height?g.toDataURL("image/jpeg",.6):g.toDataURL("image/png");d[e]={uuid:f,url:g}}b.image=c.uuid}return a.textures[this.uuid]=
	    b},dispose:function(){this.dispatchEvent({type:"dispose"})},transformUv:function(a){if(300===this.mapping){a.multiply(this.repeat);a.add(this.offset);if(0>a.x||1<a.x)switch(this.wrapS){case 1E3:a.x-=Math.floor(a.x);break;case 1001:a.x=0>a.x?0:1;break;case 1002:a.x=1===Math.abs(Math.floor(a.x)%2)?Math.ceil(a.x)-a.x:a.x-Math.floor(a.x)}if(0>a.y||1<a.y)switch(this.wrapT){case 1E3:a.y-=Math.floor(a.y);break;case 1001:a.y=0>a.y?0:1;break;case 1002:a.y=1===Math.abs(Math.floor(a.y)%2)?Math.ceil(a.y)-a.y:
	  a.y-Math.floor(a.y)}this.flipY&&(a.y=1-a.y)}}};Object.assign(ba.prototype,pa.prototype);var Pd=0;da.prototype={constructor:da,isVector4:!0,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},setScalar:function(a){this.w=this.z=this.y=this.x=a;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setW:function(a){this.w=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=
	    b;break;case 2:this.z=b;break;case 3:this.w=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+a);}},clone:function(){return new this.constructor(this.x,this.y,this.z,this.w)},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=void 0!==a.w?a.w:1;return this},add:function(a,b){if(void 0!==b)return console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),
	    this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;this.w+=a;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addScaledVector:function(a,b){this.x+=a.x*b;this.y+=a.y*b;this.z+=a.z*b;this.w+=a.w*b;return this},sub:function(a,b){if(void 0!==b)return console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,
	    b);this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;return this},subScalar:function(a){this.x-=a;this.y-=a;this.z-=a;this.w-=a;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},multiplyScalar:function(a){isFinite(a)?(this.x*=a,this.y*=a,this.z*=a,this.w*=a):this.w=this.z=this.y=this.x=0;return this},applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z,e=this.w;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12]*e;this.y=a[1]*b+a[5]*c+a[9]*
	    d+a[13]*e;this.z=a[2]*b+a[6]*c+a[10]*d+a[14]*e;this.w=a[3]*b+a[7]*c+a[11]*d+a[15]*e;return this},divideScalar:function(a){return this.multiplyScalar(1/a)},setAxisAngleFromQuaternion:function(a){this.w=2*Math.acos(a.w);var b=Math.sqrt(1-a.w*a.w);1E-4>b?(this.x=1,this.z=this.y=0):(this.x=a.x/b,this.y=a.y/b,this.z=a.z/b);return this},setAxisAngleFromRotationMatrix:function(a){var b,c,d;a=a.elements;var e=a[0];d=a[4];var f=a[8],g=a[1],k=a[5],l=a[9];c=a[2];b=a[6];var m=a[10];if(.01>Math.abs(d-g)&&.01>
	    Math.abs(f-c)&&.01>Math.abs(l-b)){if(.1>Math.abs(d+g)&&.1>Math.abs(f+c)&&.1>Math.abs(l+b)&&.1>Math.abs(e+k+m-3))return this.set(1,0,0,0),this;a=Math.PI;e=(e+1)/2;k=(k+1)/2;m=(m+1)/2;d=(d+g)/4;f=(f+c)/4;l=(l+b)/4;e>k&&e>m?.01>e?(b=0,d=c=.707106781):(b=Math.sqrt(e),c=d/b,d=f/b):k>m?.01>k?(b=.707106781,c=0,d=.707106781):(c=Math.sqrt(k),b=d/c,d=l/c):.01>m?(c=b=.707106781,d=0):(d=Math.sqrt(m),b=f/d,c=l/d);this.set(b,c,d,a);return this}a=Math.sqrt((b-l)*(b-l)+(f-c)*(f-c)+(g-d)*(g-d));.001>Math.abs(a)&&
	  (a=1);this.x=(b-l)/a;this.y=(f-c)/a;this.z=(g-d)/a;this.w=Math.acos((e+k+m-1)/2);return this},min:function(a){this.x=Math.min(this.x,a.x);this.y=Math.min(this.y,a.y);this.z=Math.min(this.z,a.z);this.w=Math.min(this.w,a.w);return this},max:function(a){this.x=Math.max(this.x,a.x);this.y=Math.max(this.y,a.y);this.z=Math.max(this.z,a.z);this.w=Math.max(this.w,a.w);return this},clamp:function(a,b){this.x=Math.max(a.x,Math.min(b.x,this.x));this.y=Math.max(a.y,Math.min(b.y,this.y));this.z=Math.max(a.z,Math.min(b.z,
	    this.z));this.w=Math.max(a.w,Math.min(b.w,this.w));return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new da,b=new da);a.set(c,c,c,c);b.set(d,d,d,d);return this.clamp(a,b)}}(),floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);this.w=Math.floor(this.w);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);this.w=Math.ceil(this.w);return this},round:function(){this.x=Math.round(this.x);
	    this.y=Math.round(this.y);this.z=Math.round(this.z);this.w=Math.round(this.w);return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);this.z=0>this.z?Math.ceil(this.z):Math.floor(this.z);this.w=0>this.w?Math.ceil(this.w):Math.floor(this.w);return this},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z;this.w=-this.w;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.x*
	    this.x+this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.multiplyScalar(a/this.length())},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;this.w+=(a.w-this.w)*b;return this},lerpVectors:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            b,c){return this.subVectors(b,a).multiplyScalar(c).add(a)},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z&&a.w===this.w},fromArray:function(a,b){void 0===b&&(b=0);this.x=a[b];this.y=a[b+1];this.z=a[b+2];this.w=a[b+3];return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this.x;a[b+1]=this.y;a[b+2]=this.z;a[b+3]=this.w;return a},fromAttribute:function(a,b,c){void 0===c&&(c=0);b=b*a.itemSize+c;this.x=a.array[b];this.y=a.array[b+1];this.z=a.array[b+2];this.w=
	    a.array[b+3];return this}};Object.assign(zb.prototype,pa.prototype,{isWebGLRenderTarget:!0,setSize:function(a,b){if(this.width!==a||this.height!==b)this.width=a,this.height=b,this.dispose();this.viewport.set(0,0,a,b);this.scissor.set(0,0,a,b)},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.width=a.width;this.height=a.height;this.viewport.copy(a.viewport);this.texture=a.texture.clone();this.depthBuffer=a.depthBuffer;this.stencilBuffer=a.stencilBuffer;this.depthTexture=
	    a.depthTexture;return this},dispose:function(){this.dispatchEvent({type:"dispose"})}});Ab.prototype=Object.create(zb.prototype);Ab.prototype.constructor=Ab;Ab.prototype.isWebGLRenderTargetCube=!0;ca.prototype={constructor:ca,get x(){return this._x},set x(a){this._x=a;this.onChangeCallback()},get y(){return this._y},set y(a){this._y=a;this.onChangeCallback()},get z(){return this._z},set z(a){this._z=a;this.onChangeCallback()},get w(){return this._w},set w(a){this._w=a;this.onChangeCallback()},set:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  b,c,d){this._x=a;this._y=b;this._z=c;this._w=d;this.onChangeCallback();return this},clone:function(){return new this.constructor(this._x,this._y,this._z,this._w)},copy:function(a){this._x=a.x;this._y=a.y;this._z=a.z;this._w=a.w;this.onChangeCallback();return this},setFromEuler:function(a,b){if(!1===(a&&a.isEuler))throw Error("THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.");var c=Math.cos(a._x/2),d=Math.cos(a._y/2),e=Math.cos(a._z/2),f=Math.sin(a._x/
	    2),g=Math.sin(a._y/2),k=Math.sin(a._z/2),l=a.order;"XYZ"===l?(this._x=f*d*e+c*g*k,this._y=c*g*e-f*d*k,this._z=c*d*k+f*g*e,this._w=c*d*e-f*g*k):"YXZ"===l?(this._x=f*d*e+c*g*k,this._y=c*g*e-f*d*k,this._z=c*d*k-f*g*e,this._w=c*d*e+f*g*k):"ZXY"===l?(this._x=f*d*e-c*g*k,this._y=c*g*e+f*d*k,this._z=c*d*k+f*g*e,this._w=c*d*e-f*g*k):"ZYX"===l?(this._x=f*d*e-c*g*k,this._y=c*g*e+f*d*k,this._z=c*d*k-f*g*e,this._w=c*d*e+f*g*k):"YZX"===l?(this._x=f*d*e+c*g*k,this._y=c*g*e+f*d*k,this._z=c*d*k-f*g*e,this._w=c*d*
	    e-f*g*k):"XZY"===l&&(this._x=f*d*e-c*g*k,this._y=c*g*e-f*d*k,this._z=c*d*k+f*g*e,this._w=c*d*e+f*g*k);if(!1!==b)this.onChangeCallback();return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);this._x=a.x*d;this._y=a.y*d;this._z=a.z*d;this._w=Math.cos(c);this.onChangeCallback();return this},setFromRotationMatrix:function(a){var b=a.elements,c=b[0];a=b[4];var d=b[8],e=b[1],f=b[5],g=b[9],k=b[2],l=b[6],b=b[10],m=c+f+b;0<m?(c=.5/Math.sqrt(m+1),this._w=.25/c,this._x=(l-g)*c,this._y=(d-k)*c,
	    this._z=(e-a)*c):c>f&&c>b?(c=2*Math.sqrt(1+c-f-b),this._w=(l-g)/c,this._x=.25*c,this._y=(a+e)/c,this._z=(d+k)/c):f>b?(c=2*Math.sqrt(1+f-c-b),this._w=(d-k)/c,this._x=(a+e)/c,this._y=.25*c,this._z=(g+l)/c):(c=2*Math.sqrt(1+b-c-f),this._w=(e-a)/c,this._x=(d+k)/c,this._y=(g+l)/c,this._z=.25*c);this.onChangeCallback();return this},setFromUnitVectors:function(){var a,b;return function(c,d){void 0===a&&(a=new q);b=c.dot(d)+1;1E-6>b?(b=0,Math.abs(c.x)>Math.abs(c.z)?a.set(-c.y,c.x,0):a.set(0,-c.z,c.y)):a.crossVectors(c,
	    d);this._x=a.x;this._y=a.y;this._z=a.z;this._w=b;return this.normalize()}}(),inverse:function(){return this.conjugate().normalize()},conjugate:function(){this._x*=-1;this._y*=-1;this._z*=-1;this.onChangeCallback();return this},dot:function(a){return this._x*a._x+this._y*a._y+this._z*a._z+this._w*a._w},lengthSq:function(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w},length:function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)},normalize:function(){var a=
	    this.length();0===a?(this._z=this._y=this._x=0,this._w=1):(a=1/a,this._x*=a,this._y*=a,this._z*=a,this._w*=a);this.onChangeCallback();return this},multiply:function(a,b){return void 0!==b?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(a,b)):this.multiplyQuaternions(this,a)},premultiply:function(a){return this.multiplyQuaternions(a,this)},multiplyQuaternions:function(a,b){var c=a._x,d=a._y,e=a._z,f=a._w,
	    g=b._x,k=b._y,l=b._z,m=b._w;this._x=c*m+f*g+d*l-e*k;this._y=d*m+f*k+e*g-c*l;this._z=e*m+f*l+c*k-d*g;this._w=f*m-c*g-d*k-e*l;this.onChangeCallback();return this},slerp:function(a,b){if(0===b)return this;if(1===b)return this.copy(a);var c=this._x,d=this._y,e=this._z,f=this._w,g=f*a._w+c*a._x+d*a._y+e*a._z;0>g?(this._w=-a._w,this._x=-a._x,this._y=-a._y,this._z=-a._z,g=-g):this.copy(a);if(1<=g)return this._w=f,this._x=c,this._y=d,this._z=e,this;var k=Math.sqrt(1-g*g);if(.001>Math.abs(k))return this._w=
	    .5*(f+this._w),this._x=.5*(c+this._x),this._y=.5*(d+this._y),this._z=.5*(e+this._z),this;var l=Math.atan2(k,g),g=Math.sin((1-b)*l)/k,k=Math.sin(b*l)/k;this._w=f*g+this._w*k;this._x=c*g+this._x*k;this._y=d*g+this._y*k;this._z=e*g+this._z*k;this.onChangeCallback();return this},equals:function(a){return a._x===this._x&&a._y===this._y&&a._z===this._z&&a._w===this._w},fromArray:function(a,b){void 0===b&&(b=0);this._x=a[b];this._y=a[b+1];this._z=a[b+2];this._w=a[b+3];this.onChangeCallback();return this},
	    toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this._x;a[b+1]=this._y;a[b+2]=this._z;a[b+3]=this._w;return a},onChange:function(a){this.onChangeCallback=a;return this},onChangeCallback:function(){}};Object.assign(ca,{slerp:function(a,b,c,d){return c.copy(a).slerp(b,d)},slerpFlat:function(a,b,c,d,e,f,g){var k=c[d+0],l=c[d+1],m=c[d+2];c=c[d+3];d=e[f+0];var h=e[f+1],p=e[f+2];e=e[f+3];if(c!==e||k!==d||l!==h||m!==p){f=1-g;var n=k*d+l*h+m*p+c*e,r=0<=n?1:-1,t=1-n*n;t>Number.EPSILON&&(t=
	    Math.sqrt(t),n=Math.atan2(t,n*r),f=Math.sin(f*n)/t,g=Math.sin(g*n)/t);r*=g;k=k*f+d*r;l=l*f+h*r;m=m*f+p*r;c=c*f+e*r;f===1-g&&(g=1/Math.sqrt(k*k+l*l+m*m+c*c),k*=g,l*=g,m*=g,c*=g)}a[b]=k;a[b+1]=l;a[b+2]=m;a[b+3]=c}});q.prototype={constructor:q,isVector3:!0,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setScalar:function(a){this.z=this.y=this.x=a;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setComponent:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+a);}},clone:function(){return new this.constructor(this.x,this.y,this.z)},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){if(void 0!==b)return console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),
	    this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addScaledVector:function(a,b){this.x+=a.x*b;this.y+=a.y*b;this.z+=a.z*b;return this},sub:function(a,b){if(void 0!==b)return console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=a.y;this.z-=a.z;
	    return this},subScalar:function(a){this.x-=a;this.y-=a;this.z-=a;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},multiply:function(a,b){if(void 0!==b)return console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(a,b);this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){isFinite(a)?(this.x*=a,this.y*=a,this.z*=a):this.z=this.y=this.x=0;return this},multiplyVectors:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},applyEuler:function(){var a;return function(b){!1===(b&&b.isEuler)&&console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.");void 0===a&&(a=new ca);return this.applyQuaternion(a.setFromEuler(b))}}(),applyAxisAngle:function(){var a;return function(b,c){void 0===a&&(a=new ca);return this.applyQuaternion(a.setFromAxisAngle(b,c))}}(),applyMatrix3:function(a){var b=this.x,c=this.y,d=this.z;
	    a=a.elements;this.x=a[0]*b+a[3]*c+a[6]*d;this.y=a[1]*b+a[4]*c+a[7]*d;this.z=a[2]*b+a[5]*c+a[8]*d;return this},applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12];this.y=a[1]*b+a[5]*c+a[9]*d+a[13];this.z=a[2]*b+a[6]*c+a[10]*d+a[14];return this},applyProjection:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;var e=1/(a[3]*b+a[7]*c+a[11]*d+a[15]);this.x=(a[0]*b+a[4]*c+a[8]*d+a[12])*e;this.y=(a[1]*b+a[5]*c+a[9]*d+a[13])*e;this.z=(a[2]*b+a[6]*
	    c+a[10]*d+a[14])*e;return this},applyQuaternion:function(a){var b=this.x,c=this.y,d=this.z,e=a.x,f=a.y,g=a.z;a=a.w;var k=a*b+f*d-g*c,l=a*c+g*b-e*d,m=a*d+e*c-f*b,b=-e*b-f*c-g*d;this.x=k*a+b*-e+l*-g-m*-f;this.y=l*a+b*-f+m*-e-k*-g;this.z=m*a+b*-g+k*-f-l*-e;return this},project:function(){var a;return function(b){void 0===a&&(a=new P);a.multiplyMatrices(b.projectionMatrix,a.getInverse(b.matrixWorld));return this.applyProjection(a)}}(),unproject:function(){var a;return function(b){void 0===a&&(a=new P);
	    a.multiplyMatrices(b.matrixWorld,a.getInverse(b.projectionMatrix));return this.applyProjection(a)}}(),transformDirection:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d;this.y=a[1]*b+a[5]*c+a[9]*d;this.z=a[2]*b+a[6]*c+a[10]*d;return this.normalize()},divide:function(a){this.x/=a.x;this.y/=a.y;this.z/=a.z;return this},divideScalar:function(a){return this.multiplyScalar(1/a)},min:function(a){this.x=Math.min(this.x,a.x);this.y=Math.min(this.y,a.y);this.z=Math.min(this.z,
	    a.z);return this},max:function(a){this.x=Math.max(this.x,a.x);this.y=Math.max(this.y,a.y);this.z=Math.max(this.z,a.z);return this},clamp:function(a,b){this.x=Math.max(a.x,Math.min(b.x,this.x));this.y=Math.max(a.y,Math.min(b.y,this.y));this.z=Math.max(a.z,Math.min(b.z,this.z));return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new q,b=new q);a.set(c,c,c);b.set(d,d,d);return this.clamp(a,b)}}(),clampLength:function(a,b){var c=this.length();return this.multiplyScalar(Math.max(a,
	      Math.min(b,c))/c)},floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);return this},round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);this.z=0>this.z?Math.ceil(this.z):
	    Math.floor(this.z);return this},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.multiplyScalar(a/
	    this.length())},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;return this},lerpVectors:function(a,b,c){return this.subVectors(b,a).multiplyScalar(c).add(a)},cross:function(a,b){if(void 0!==b)return console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(a,b);var c=this.x,d=this.y,e=this.z;this.x=d*a.z-e*a.y;this.y=e*a.x-c*a.z;this.z=c*a.y-d*a.x;return this},crossVectors:function(a,b){var c=
	    a.x,d=a.y,e=a.z,f=b.x,g=b.y,k=b.z;this.x=d*k-e*g;this.y=e*f-c*k;this.z=c*g-d*f;return this},projectOnVector:function(a){var b=a.dot(this)/a.lengthSq();return this.copy(a).multiplyScalar(b)},projectOnPlane:function(){var a;return function(b){void 0===a&&(a=new q);a.copy(this).projectOnVector(b);return this.sub(a)}}(),reflect:function(){var a;return function(b){void 0===a&&(a=new q);return this.sub(a.copy(b).multiplyScalar(2*this.dot(b)))}}(),angleTo:function(a){a=this.dot(a)/Math.sqrt(this.lengthSq()*
	      a.lengthSq());return Math.acos(h.Math.clamp(a,-1,1))},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return b*b+c*c+a*a},distanceToManhattan:function(a){return Math.abs(this.x-a.x)+Math.abs(this.y-a.y)+Math.abs(this.z-a.z)},setFromSpherical:function(a){var b=Math.sin(a.phi)*a.radius;this.x=b*Math.sin(a.theta);this.y=Math.cos(a.phi)*a.radius;this.z=b*Math.cos(a.theta);return this},setFromMatrixPosition:function(a){return this.setFromMatrixColumn(a,
	    3)},setFromMatrixScale:function(a){var b=this.setFromMatrixColumn(a,0).length(),c=this.setFromMatrixColumn(a,1).length();a=this.setFromMatrixColumn(a,2).length();this.x=b;this.y=c;this.z=a;return this},setFromMatrixColumn:function(a,b){if("number"===typeof a){console.warn("THREE.Vector3: setFromMatrixColumn now expects ( matrix, index ).");var c=a;a=b;b=c}return this.fromArray(a.elements,4*b)},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},fromArray:function(a,b){void 0===b&&
	  (b=0);this.x=a[b];this.y=a[b+1];this.z=a[b+2];return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this.x;a[b+1]=this.y;a[b+2]=this.z;return a},fromAttribute:function(a,b,c){void 0===c&&(c=0);b=b*a.itemSize+c;this.x=a.array[b];this.y=a.array[b+1];this.z=a.array[b+2];return this}};P.prototype={constructor:P,isMatrix4:!0,set:function(a,b,c,d,e,f,g,k,l,m,h,p,n,r,t,v){var q=this.elements;q[0]=a;q[4]=b;q[8]=c;q[12]=d;q[1]=e;q[5]=f;q[9]=g;q[13]=k;q[2]=l;q[6]=m;q[10]=h;q[14]=p;q[3]=
	    n;q[7]=r;q[11]=t;q[15]=v;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},clone:function(){return(new P).fromArray(this.elements)},copy:function(a){this.elements.set(a.elements);return this},copyPosition:function(a){var b=this.elements;a=a.elements;b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractBasis:function(a,b,c){a.setFromMatrixColumn(this,0);b.setFromMatrixColumn(this,1);c.setFromMatrixColumn(this,2);return this},makeBasis:function(a,b,c){this.set(a.x,
	    b.x,c.x,0,a.y,b.y,c.y,0,a.z,b.z,c.z,0,0,0,0,1);return this},extractRotation:function(){var a;return function(b){void 0===a&&(a=new q);var c=this.elements,d=b.elements,e=1/a.setFromMatrixColumn(b,0).length(),f=1/a.setFromMatrixColumn(b,1).length();b=1/a.setFromMatrixColumn(b,2).length();c[0]=d[0]*e;c[1]=d[1]*e;c[2]=d[2]*e;c[4]=d[4]*f;c[5]=d[5]*f;c[6]=d[6]*f;c[8]=d[8]*b;c[9]=d[9]*b;c[10]=d[10]*b;return this}}(),makeRotationFromEuler:function(a){!1===(a&&a.isEuler)&&console.error("THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
	    var b=this.elements,c=a.x,d=a.y,e=a.z,f=Math.cos(c),c=Math.sin(c),g=Math.cos(d),d=Math.sin(d),k=Math.cos(e),e=Math.sin(e);if("XYZ"===a.order){a=f*k;var l=f*e,m=c*k,h=c*e;b[0]=g*k;b[4]=-g*e;b[8]=d;b[1]=l+m*d;b[5]=a-h*d;b[9]=-c*g;b[2]=h-a*d;b[6]=m+l*d;b[10]=f*g}else"YXZ"===a.order?(a=g*k,l=g*e,m=d*k,h=d*e,b[0]=a+h*c,b[4]=m*c-l,b[8]=f*d,b[1]=f*e,b[5]=f*k,b[9]=-c,b[2]=l*c-m,b[6]=h+a*c,b[10]=f*g):"ZXY"===a.order?(a=g*k,l=g*e,m=d*k,h=d*e,b[0]=a-h*c,b[4]=-f*e,b[8]=m+l*c,b[1]=l+m*c,b[5]=f*k,b[9]=h-a*c,b[2]=
	      -f*d,b[6]=c,b[10]=f*g):"ZYX"===a.order?(a=f*k,l=f*e,m=c*k,h=c*e,b[0]=g*k,b[4]=m*d-l,b[8]=a*d+h,b[1]=g*e,b[5]=h*d+a,b[9]=l*d-m,b[2]=-d,b[6]=c*g,b[10]=f*g):"YZX"===a.order?(a=f*g,l=f*d,m=c*g,h=c*d,b[0]=g*k,b[4]=h-a*e,b[8]=m*e+l,b[1]=e,b[5]=f*k,b[9]=-c*k,b[2]=-d*k,b[6]=l*e+m,b[10]=a-h*e):"XZY"===a.order&&(a=f*g,l=f*d,m=c*g,h=c*d,b[0]=g*k,b[4]=-e,b[8]=d*k,b[1]=a*e+h,b[5]=f*k,b[9]=l*e-m,b[2]=m*e-l,b[6]=c*k,b[10]=h*e+a);b[3]=0;b[7]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return this},makeRotationFromQuaternion:function(a){var b=
	    this.elements,c=a.x,d=a.y,e=a.z,f=a.w,g=c+c,k=d+d,l=e+e;a=c*g;var h=c*k,c=c*l,u=d*k,d=d*l,e=e*l,g=f*g,k=f*k,f=f*l;b[0]=1-(u+e);b[4]=h-f;b[8]=c+k;b[1]=h+f;b[5]=1-(a+e);b[9]=d-g;b[2]=c-k;b[6]=d+g;b[10]=1-(a+u);b[3]=0;b[7]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return this},lookAt:function(){var a,b,c;return function(d,e,f){void 0===a&&(a=new q,b=new q,c=new q);var g=this.elements;c.subVectors(d,e).normalize();0===c.lengthSq()&&(c.z=1);a.crossVectors(f,c).normalize();0===a.lengthSq()&&(c.z+=1E-4,
	    a.crossVectors(f,c).normalize());b.crossVectors(c,a);g[0]=a.x;g[4]=b.x;g[8]=c.x;g[1]=a.y;g[5]=b.y;g[9]=c.y;g[2]=a.z;g[6]=b.z;g[10]=c.z;return this}}(),multiply:function(a,b){return void 0!==b?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(a,b)):this.multiplyMatrices(this,a)},premultiply:function(a){return this.multiplyMatrices(a,this)},multiplyMatrices:function(a,b){var c=a.elements,d=b.elements,e=this.elements,
	    f=c[0],g=c[4],k=c[8],l=c[12],h=c[1],u=c[5],p=c[9],n=c[13],r=c[2],t=c[6],v=c[10],q=c[14],w=c[3],x=c[7],T=c[11],c=c[15],y=d[0],F=d[4],G=d[8],E=d[12],J=d[1],C=d[5],N=d[9],D=d[13],z=d[2],I=d[6],H=d[10],L=d[14],M=d[3],O=d[7],Q=d[11],d=d[15];e[0]=f*y+g*J+k*z+l*M;e[4]=f*F+g*C+k*I+l*O;e[8]=f*G+g*N+k*H+l*Q;e[12]=f*E+g*D+k*L+l*d;e[1]=h*y+u*J+p*z+n*M;e[5]=h*F+u*C+p*I+n*O;e[9]=h*G+u*N+p*H+n*Q;e[13]=h*E+u*D+p*L+n*d;e[2]=r*y+t*J+v*z+q*M;e[6]=r*F+t*C+v*I+q*O;e[10]=r*G+t*N+v*H+q*Q;e[14]=r*E+t*D+v*L+q*d;e[3]=w*y+
	    x*J+T*z+c*M;e[7]=w*F+x*C+T*I+c*O;e[11]=w*G+x*N+T*H+c*Q;e[15]=w*E+x*D+T*L+c*d;return this},multiplyToArray:function(a,b,c){var d=this.elements;this.multiplyMatrices(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[4]*=a;b[8]*=a;b[12]*=a;b[1]*=a;b[5]*=a;b[9]*=a;b[13]*=a;b[2]*=a;b[6]*=a;b[10]*=a;b[14]*=a;
	    b[3]*=a;b[7]*=a;b[11]*=a;b[15]*=a;return this},applyToVector3Array:function(){var a;return function(b,c,d){void 0===a&&(a=new q);void 0===c&&(c=0);void 0===d&&(d=b.length);for(var e=0;e<d;e+=3,c+=3)a.fromArray(b,c),a.applyMatrix4(this),a.toArray(b,c);return b}}(),applyToBuffer:function(){var a;return function(b,c,d){void 0===a&&(a=new q);void 0===c&&(c=0);void 0===d&&(d=b.length/b.itemSize);for(var e=0;e<d;e++,c++)a.x=b.getX(c),a.y=b.getY(c),a.z=b.getZ(c),a.applyMatrix4(this),b.setXYZ(a.x,a.y,a.z);
	    return b}}(),determinant:function(){var a=this.elements,b=a[0],c=a[4],d=a[8],e=a[12],f=a[1],g=a[5],k=a[9],l=a[13],h=a[2],u=a[6],p=a[10],n=a[14];return a[3]*(+e*k*u-d*l*u-e*g*p+c*l*p+d*g*n-c*k*n)+a[7]*(+b*k*n-b*l*p+e*f*p-d*f*n+d*l*h-e*k*h)+a[11]*(+b*l*u-b*g*n-e*f*u+c*f*n+e*g*h-c*l*h)+a[15]*(-d*g*h-b*k*u+b*g*p+d*f*u-c*f*p+c*k*h)},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];
	    a[11]=a[14];a[14]=b;return this},flattenToArrayOffset:function(a,b){console.warn("THREE.Matrix3: .flattenToArrayOffset is deprecated - just use .toArray instead.");return this.toArray(a,b)},getPosition:function(){var a;return function(){void 0===a&&(a=new q);console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");return a.setFromMatrixColumn(this,3)}}(),setPosition:function(a){var b=this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},
	    getInverse:function(a,b){var c=this.elements,d=a.elements,e=d[0],f=d[1],g=d[2],k=d[3],l=d[4],h=d[5],u=d[6],p=d[7],n=d[8],r=d[9],t=d[10],v=d[11],q=d[12],w=d[13],x=d[14],d=d[15],T=r*x*p-w*t*p+w*u*v-h*x*v-r*u*d+h*t*d,y=q*t*p-n*x*p-q*u*v+l*x*v+n*u*d-l*t*d,F=n*w*p-q*r*p+q*h*v-l*w*v-n*h*d+l*r*d,G=q*r*u-n*w*u-q*h*t+l*w*t+n*h*x-l*r*x,E=e*T+f*y+g*F+k*G;if(0===E){if(!0===b)throw Error("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0");console.warn("THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0");
	      return this.identity()}E=1/E;c[0]=T*E;c[1]=(w*t*k-r*x*k-w*g*v+f*x*v+r*g*d-f*t*d)*E;c[2]=(h*x*k-w*u*k+w*g*p-f*x*p-h*g*d+f*u*d)*E;c[3]=(r*u*k-h*t*k-r*g*p+f*t*p+h*g*v-f*u*v)*E;c[4]=y*E;c[5]=(n*x*k-q*t*k+q*g*v-e*x*v-n*g*d+e*t*d)*E;c[6]=(q*u*k-l*x*k-q*g*p+e*x*p+l*g*d-e*u*d)*E;c[7]=(l*t*k-n*u*k+n*g*p-e*t*p-l*g*v+e*u*v)*E;c[8]=F*E;c[9]=(q*r*k-n*w*k-q*f*v+e*w*v+n*f*d-e*r*d)*E;c[10]=(l*w*k-q*h*k+q*f*p-e*w*p-l*f*d+e*h*d)*E;c[11]=(n*h*k-l*r*k-n*f*p+e*r*p+l*f*v-e*h*v)*E;c[12]=G*E;c[13]=(n*w*g-q*r*g+q*f*t-e*w*
	      t-n*f*x+e*r*x)*E;c[14]=(q*h*g-l*w*g-q*f*u+e*w*u+l*f*x-e*h*x)*E;c[15]=(l*r*g-n*h*g+n*f*u-e*r*u-l*f*t+e*h*t)*E;return this},scale:function(a){var b=this.elements,c=a.x,d=a.y;a=a.z;b[0]*=c;b[4]*=d;b[8]*=a;b[1]*=c;b[5]*=d;b[9]*=a;b[2]*=c;b[6]*=d;b[10]*=a;b[3]*=c;b[7]*=d;b[11]*=a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+a[2]*a[2],a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10]))},makeTranslation:function(a,b,c){this.set(1,
	      0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},makeRotationX:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,k=a.z,l=e*f,h=e*g;this.set(l*f+c,l*
	      g-d*k,l*k+d*g,0,l*g+d*k,h*g+c,h*k-d*f,0,l*k-d*g,h*k+d*f,e*k*k+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},compose:function(a,b,c){this.makeRotationFromQuaternion(b);this.scale(c);this.setPosition(a);return this},decompose:function(){var a,b;return function(c,d,e){void 0===a&&(a=new q,b=new P);var f=this.elements,g=a.set(f[0],f[1],f[2]).length(),k=a.set(f[4],f[5],f[6]).length(),l=a.set(f[8],f[9],f[10]).length();0>this.determinant()&&(g=
	      -g);c.x=f[12];c.y=f[13];c.z=f[14];b.elements.set(this.elements);c=1/g;var f=1/k,h=1/l;b.elements[0]*=c;b.elements[1]*=c;b.elements[2]*=c;b.elements[4]*=f;b.elements[5]*=f;b.elements[6]*=f;b.elements[8]*=h;b.elements[9]*=h;b.elements[10]*=h;d.setFromRotationMatrix(b);e.x=g;e.y=k;e.z=l;return this}}(),makeFrustum:function(a,b,c,d,e,f){var g=this.elements;g[0]=2*e/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*e/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(f+e)/(f-e);g[14]=-2*f*e/(f-e);
	      g[3]=0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,b,c,d){a=c*Math.tan(h.Math.DEG2RAD*a*.5);var e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,b,c,d,e,f){var g=this.elements,k=1/(b-a),l=1/(c-d),h=1/(f-e);g[0]=2*k;g[4]=0;g[8]=0;g[12]=-((b+a)*k);g[1]=0;g[5]=2*l;g[9]=0;g[13]=-((c+d)*l);g[2]=0;g[6]=0;g[10]=-2*h;g[14]=-((f+e)*h);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},equals:function(a){var b=this.elements;a=a.elements;for(var c=0;16>c;c++)if(b[c]!==a[c])return!1;
	      return!0},fromArray:function(a,b){void 0===b&&(b=0);for(var c=0;16>c;c++)this.elements[c]=a[c+b];return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a}};Ta.prototype=Object.create(ba.prototype);Ta.prototype.constructor=Ta;Ta.prototype.isCubeTexture=!0;
	  Object.defineProperty(Ta.prototype,"images",{get:function(){return this.image},set:function(a){this.image=a}});var Td=new ba,Ud=new Ta,Qd=[],Sd=[];Yd.prototype.setValue=function(a,b){for(var c=this.seq,d=0,e=c.length;d!==e;++d){var f=c[d];f.setValue(a,b[f.id])}};var kd=/([\w\d_]+)(\])?(\[|\.)?/g;Ga.prototype.setValue=function(a,b,c){b=this.map[b];void 0!==b&&b.setValue(a,c,this.renderer)};Ga.prototype.set=function(a,b,c){var d=this.map[c];void 0!==d&&d.setValue(a,b[c],this.renderer)};Ga.prototype.setOptional=
	    function(a,b,c){b=b[c];void 0!==b&&this.setValue(a,c,b)};Ga.upload=function(a,b,c,d){for(var e=0,f=b.length;e!==f;++e){var g=b[e],k=c[g.id];!1!==k.needsUpdate&&g.setValue(a,k.value,d)}};Ga.seqWithValue=function(a,b){for(var c=[],d=0,e=a.length;d!==e;++d){var f=a[d];f.id in b&&c.push(f)}return c};Ga.splitDynamic=function(a,b){for(var c=null,d=a.length,e=0,f=0;f!==d;++f){var g=a[f],k=b[g.id];k&&!0===k.dynamic?(null===c&&(c=[]),c.push(g)):(e<f&&(a[e]=g),++e)}e<d&&(a.length=e);return c};Ga.evalDynamic=
	    function(a,b,c,d,e){for(var f=0,g=a.length;f!==g;++f){var k=b[a[f].id],l=k.onUpdateCallback;void 0!==l&&l.call(k,c,d,e)}};h.UniformsUtils={merge:function(a){for(var b={},c=0;c<a.length;c++){var d=this.clone(a[c]),e;for(e in d)b[e]=d[e]}return b},clone:function(a){var b={},c;for(c in a){b[c]={};for(var d in a[c]){var e=a[c][d];e&&e.isColor||e&&e.isVector2||e&&e.isVector3||e&&e.isVector4||e&&e.isMatrix3||e&&e.isMatrix4||e&&e.isTexture?b[c][d]=e.clone():Array.isArray(e)?b[c][d]=e.slice():b[c][d]=e}}return b}};
	  var Z={alphamap_fragment:"#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, vUv ).g;\n#endif\n",alphamap_pars_fragment:"#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif\n",alphatest_fragment:"#ifdef ALPHATEST\n\tif ( diffuseColor.a < ALPHATEST ) discard;\n#endif\n",aomap_fragment:"#ifdef USE_AOMAP\n\tfloat ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\treflectedLight.indirectDiffuse *= ambientOcclusion;\n\t#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n\t#endif\n#endif\n",
	    aomap_pars_fragment:"#ifdef USE_AOMAP\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n#endif",begin_vertex:"\nvec3 transformed = vec3( position );\n",beginnormal_vertex:"\nvec3 objectNormal = vec3( normal );\n",bsdfs:"bool testLightInRange( const in float lightDistance, const in float cutoffDistance ) {\n\treturn any( bvec2( cutoffDistance == 0.0, lightDistance < cutoffDistance ) );\n}\nfloat punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n\t\tif( decayExponent > 0.0 ) {\n#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n\t\t\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\t\t\tfloat maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\t\t\treturn distanceFalloff * maxDistanceCutoffFactor;\n#else\n\t\t\treturn pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n#endif\n\t\t}\n\t\treturn 1.0;\n}\nvec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n\treturn RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n\tfloat fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n}\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\treturn 1.0 / ( gl * gv );\n}\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\treturn 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\tfloat a2 = pow2( alpha );\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n}\nvec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\tfloat alpha = pow2( roughness );\n\tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\tfloat dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\tfloat D = D_GGX( alpha, dotNH );\n\treturn F * ( G * D );\n}\nvec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\tvec4 r = roughness * c0 + c1;\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\tvec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\treturn specularColor * AB.x + AB.y;\n}\nfloat G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n\tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n\tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, dotLH );\n\tfloat G = G_BlinnPhong_Implicit( );\n\tfloat D = D_BlinnPhong( shininess, dotNH );\n\treturn F * ( G * D );\n}\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n\treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n\treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}\n",
	    bumpmap_pars_fragment:"#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd() {\n\t\tvec2 dSTdx = dFdx( vUv );\n\t\tvec2 dSTdy = dFdy( vUv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\t\tvec3 vSigmaX = dFdx( surf_pos );\n\t\tvec3 vSigmaY = dFdy( surf_pos );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif\n",
	    clipping_planes_fragment:"#if NUM_CLIPPING_PLANES > 0\n\tfor ( int i = 0; i < NUM_CLIPPING_PLANES; ++ i ) {\n\t\tvec4 plane = clippingPlanes[ i ];\n\t\tif ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n\t}\n#endif\n",clipping_planes_pars_fragment:"#if NUM_CLIPPING_PLANES > 0\n\t#if ! defined( PHYSICAL ) && ! defined( PHONG )\n\t\tvarying vec3 vViewPosition;\n\t#endif\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif\n",clipping_planes_pars_vertex:"#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\tvarying vec3 vViewPosition;\n#endif\n",
	    clipping_planes_vertex:"#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\tvViewPosition = - mvPosition.xyz;\n#endif\n",color_fragment:"#ifdef USE_COLOR\n\tdiffuseColor.rgb *= vColor;\n#endif",color_pars_fragment:"#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif\n",color_pars_vertex:"#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n\tvColor.xyz = color.xyz;\n#endif",common:"#define PI 3.14159265359\n#define PI2 6.28318530718\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\nhighp float rand( const in vec2 uv ) {\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\treturn fract(sin(sn) * c);\n}\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n};\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\tfloat distance = dot( planeNormal, point - pointOnPlane );\n\treturn - distance * planeNormal + point;\n}\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn sign( dot( point - pointOnPlane, planeNormal ) );\n}\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\treturn lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n}\n",
	    cube_uv_reflection_fragment:"#ifdef ENVMAP_TYPE_CUBE_UV\n#define cubeUV_textureSize (1024.0)\nint getFaceFromDirection(vec3 direction) {\n\tvec3 absDirection = abs(direction);\n\tint face = -1;\n\tif( absDirection.x > absDirection.z ) {\n\t\tif(absDirection.x > absDirection.y )\n\t\t\tface = direction.x > 0.0 ? 0 : 3;\n\t\telse\n\t\t\tface = direction.y > 0.0 ? 1 : 4;\n\t}\n\telse {\n\t\tif(absDirection.z > absDirection.y )\n\t\t\tface = direction.z > 0.0 ? 2 : 5;\n\t\telse\n\t\t\tface = direction.y > 0.0 ? 1 : 4;\n\t}\n\treturn face;\n}\n#define cubeUV_maxLods1  (log2(cubeUV_textureSize*0.25) - 1.0)\n#define cubeUV_rangeClamp (exp2((6.0 - 1.0) * 2.0))\nvec2 MipLevelInfo( vec3 vec, float roughnessLevel, float roughness ) {\n\tfloat scale = exp2(cubeUV_maxLods1 - roughnessLevel);\n\tfloat dxRoughness = dFdx(roughness);\n\tfloat dyRoughness = dFdy(roughness);\n\tvec3 dx = dFdx( vec * scale * dxRoughness );\n\tvec3 dy = dFdy( vec * scale * dyRoughness );\n\tfloat d = max( dot( dx, dx ), dot( dy, dy ) );\n\td = clamp(d, 1.0, cubeUV_rangeClamp);\n\tfloat mipLevel = 0.5 * log2(d);\n\treturn vec2(floor(mipLevel), fract(mipLevel));\n}\n#define cubeUV_maxLods2 (log2(cubeUV_textureSize*0.25) - 2.0)\n#define cubeUV_rcpTextureSize (1.0 / cubeUV_textureSize)\nvec2 getCubeUV(vec3 direction, float roughnessLevel, float mipLevel) {\n\tmipLevel = roughnessLevel > cubeUV_maxLods2 - 3.0 ? 0.0 : mipLevel;\n\tfloat a = 16.0 * cubeUV_rcpTextureSize;\n\tvec2 exp2_packed = exp2( vec2( roughnessLevel, mipLevel ) );\n\tvec2 rcp_exp2_packed = vec2( 1.0 ) / exp2_packed;\n\tfloat powScale = exp2_packed.x * exp2_packed.y;\n\tfloat scale = rcp_exp2_packed.x * rcp_exp2_packed.y * 0.25;\n\tfloat mipOffset = 0.75*(1.0 - rcp_exp2_packed.y) * rcp_exp2_packed.x;\n\tbool bRes = mipLevel == 0.0;\n\tscale =  bRes && (scale < a) ? a : scale;\n\tvec3 r;\n\tvec2 offset;\n\tint face = getFaceFromDirection(direction);\n\tfloat rcpPowScale = 1.0 / powScale;\n\tif( face == 0) {\n\t\tr = vec3(direction.x, -direction.z, direction.y);\n\t\toffset = vec2(0.0+mipOffset,0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n\t}\n\telse if( face == 1) {\n\t\tr = vec3(direction.y, direction.x, direction.z);\n\t\toffset = vec2(scale+mipOffset, 0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n\t}\n\telse if( face == 2) {\n\t\tr = vec3(direction.z, direction.x, direction.y);\n\t\toffset = vec2(2.0*scale+mipOffset, 0.75 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  a : offset.y;\n\t}\n\telse if( face == 3) {\n\t\tr = vec3(direction.x, direction.z, direction.y);\n\t\toffset = vec2(0.0+mipOffset,0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n\t}\n\telse if( face == 4) {\n\t\tr = vec3(direction.y, direction.x, -direction.z);\n\t\toffset = vec2(scale+mipOffset, 0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n\t}\n\telse {\n\t\tr = vec3(direction.z, -direction.x, direction.y);\n\t\toffset = vec2(2.0*scale+mipOffset, 0.5 * rcpPowScale);\n\t\toffset.y = bRes && (offset.y < 2.0*a) ?  0.0 : offset.y;\n\t}\n\tr = normalize(r);\n\tfloat texelOffset = 0.5 * cubeUV_rcpTextureSize;\n\tvec2 s = ( r.yz / abs( r.x ) + vec2( 1.0 ) ) * 0.5;\n\tvec2 base = offset + vec2( texelOffset );\n\treturn base + s * ( scale - 2.0 * texelOffset );\n}\n#define cubeUV_maxLods3 (log2(cubeUV_textureSize*0.25) - 3.0)\nvec4 textureCubeUV(vec3 reflectedDirection, float roughness ) {\n\tfloat roughnessVal = roughness* cubeUV_maxLods3;\n\tfloat r1 = floor(roughnessVal);\n\tfloat r2 = r1 + 1.0;\n\tfloat t = fract(roughnessVal);\n\tvec2 mipInfo = MipLevelInfo(reflectedDirection, r1, roughness);\n\tfloat s = mipInfo.y;\n\tfloat level0 = mipInfo.x;\n\tfloat level1 = level0 + 1.0;\n\tlevel1 = level1 > 5.0 ? 5.0 : level1;\n\tlevel0 += min( floor( s + 0.5 ), 5.0 );\n\tvec2 uv_10 = getCubeUV(reflectedDirection, r1, level0);\n\tvec4 color10 = envMapTexelToLinear(texture2D(envMap, uv_10));\n\tvec2 uv_20 = getCubeUV(reflectedDirection, r2, level0);\n\tvec4 color20 = envMapTexelToLinear(texture2D(envMap, uv_20));\n\tvec4 result = mix(color10, color20, t);\n\treturn vec4(result.rgb, 1.0);\n}\n#endif\n",
	    defaultnormal_vertex:"#ifdef FLIP_SIDED\n\tobjectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;\n",displacementmap_pars_vertex:"#ifdef USE_DISPLACEMENTMAP\n\tuniform sampler2D displacementMap;\n\tuniform float displacementScale;\n\tuniform float displacementBias;\n#endif\n",displacementmap_vertex:"#ifdef USE_DISPLACEMENTMAP\n\ttransformed += normal * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n#endif\n",emissivemap_fragment:"#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D( emissiveMap, vUv );\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif\n",
	    emissivemap_pars_fragment:"#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif\n",encodings_fragment:"  gl_FragColor = linearToOutputTexel( gl_FragColor );\n",encodings_pars_fragment:"\nvec4 LinearToLinear( in vec4 value ) {\n  return value;\n}\nvec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n}\nvec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n  return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n}\nvec4 sRGBToLinear( in vec4 value ) {\n  return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n}\nvec4 LinearTosRGB( in vec4 value ) {\n  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n}\nvec4 RGBEToLinear( in vec4 value ) {\n  return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n}\nvec4 LinearToRGBE( in vec4 value ) {\n  float maxComponent = max( max( value.r, value.g ), value.b );\n  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n}\nvec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n  return vec4( value.xyz * value.w * maxRange, 1.0 );\n}\nvec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n  float maxRGB = max( value.x, max( value.g, value.b ) );\n  float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n  M            = ceil( M * 255.0 ) / 255.0;\n  return vec4( value.rgb / ( M * maxRange ), M );\n}\nvec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n    return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n}\nvec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n    float maxRGB = max( value.x, max( value.g, value.b ) );\n    float D      = max( maxRange / maxRGB, 1.0 );\n    D            = min( floor( D ) / 255.0, 1.0 );\n    return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n}\nconst mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\nvec4 LinearToLogLuv( in vec4 value )  {\n  vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n  Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n  vec4 vResult;\n  vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n  float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n  vResult.w = fract(Le);\n  vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n  return vResult;\n}\nconst mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\nvec4 LogLuvToLinear( in vec4 value ) {\n  float Le = value.z * 255.0 + value.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n  Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n  vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n  return vec4( max(vRGB, 0.0), 1.0 );\n}\n",
	    envmap_fragment:"#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#else\n\t\tvec3 reflectVec = vReflect;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tvec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#elif defined( ENVMAP_TYPE_EQUIREC )\n\t\tvec2 sampleUV;\n\t\tsampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n\t\tsampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\t\tvec4 envColor = texture2D( envMap, sampleUV );\n\t#elif defined( ENVMAP_TYPE_SPHERE )\n\t\tvec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0, 0.0, 1.0 ) );\n\t\tvec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n\t#else\n\t\tvec4 envColor = vec4( 0.0 );\n\t#endif\n\tenvColor = envMapTexelToLinear( envColor );\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\t#endif\n#endif\n",
	    envmap_pars_fragment:"#if defined( USE_ENVMAP ) || defined( PHYSICAL )\n\tuniform float reflectivity;\n\tuniform float envMapIntenstiy;\n#endif\n#ifdef USE_ENVMAP\n\t#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )\n\t\tvarying vec3 vWorldPosition;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\tuniform float flipEnvMap;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n#endif\n",
	    envmap_pars_vertex:"#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvarying vec3 vWorldPosition;\n\t#else\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\t#endif\n#endif\n",envmap_vertex:"#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\t\tvWorldPosition = worldPosition.xyz;\n\t#else\n\t\tvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#endif\n#endif\n",
	    fog_fragment:"#ifdef USE_FOG\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tfloat depth = gl_FragDepthEXT / gl_FragCoord.w;\n\t#else\n\t\tfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n\t#endif\n\t#ifdef FOG_EXP2\n\t\tfloat fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );\n\t#else\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n\t#endif\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif\n",fog_pars_fragment:"#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif",
	    lightmap_fragment:"#ifdef USE_LIGHTMAP\n\treflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n#endif\n",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n#endif",lights_lambert_vertex:"vec3 diffuse = vec3( 1.0 );\nGeometricContext geometry;\ngeometry.position = mvPosition.xyz;\ngeometry.normal = normalize( transformedNormal );\ngeometry.viewDir = normalize( -mvPosition.xyz );\nGeometricContext backGeometry;\nbackGeometry.position = geometry.position;\nbackGeometry.normal = -geometry.normal;\nbackGeometry.viewDir = geometry.viewDir;\nvLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n\tvLightBack = vec3( 0.0 );\n#endif\nIncidentLight directLight;\nfloat dotNL;\nvec3 directLightColor_Diffuse;\n#if NUM_POINT_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tgetPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tgetSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_DIR_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tgetDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );\n\t\tdotNL = dot( geometry.normal, directLight.direction );\n\t\tdirectLightColor_Diffuse = PI * directLight.color;\n\t\tvLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\t\t#endif\n\t}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\tvLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );\n\t\t#endif\n\t}\n#endif\n",
	    lights_pars:"uniform vec3 ambientLightColor;\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\tvec3 irradiance = ambientLightColor;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treturn irradiance;\n}\n#if NUM_DIR_LIGHTS > 0\n\tstruct DirectionalLight {\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t};\n\tuniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\tvoid getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tdirectLight.color = directionalLight.color;\n\t\tdirectLight.direction = directionalLight.direction;\n\t\tdirectLight.visible = true;\n\t}\n#endif\n#if NUM_POINT_LIGHTS > 0\n\tstruct PointLight {\n\t\tvec3 position;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t};\n\tuniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n\tvoid getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\t\tvec3 lVector = pointLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tif ( testLightInRange( lightDistance, pointLight.distance ) ) {\n\t\t\tdirectLight.color = pointLight.color;\n\t\t\tdirectLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n\t\t\tdirectLight.visible = true;\n\t\t} else {\n\t\t\tdirectLight.color = vec3( 0.0 );\n\t\t\tdirectLight.visible = false;\n\t\t}\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tstruct SpotLight {\n\t\tvec3 position;\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tfloat coneCos;\n\t\tfloat penumbraCos;\n\t\tint shadow;\n\t\tfloat shadowBias;\n\t\tfloat shadowRadius;\n\t\tvec2 shadowMapSize;\n\t};\n\tuniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n\tvoid getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n\t\tvec3 lVector = spotLight.position - geometry.position;\n\t\tdirectLight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tfloat angleCos = dot( directLight.direction, spotLight.direction );\n\t\tif ( all( bvec2( angleCos > spotLight.coneCos, testLightInRange( lightDistance, spotLight.distance ) ) ) ) {\n\t\t\tfloat spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\t\t\tdirectLight.color = spotLight.color;\n\t\t\tdirectLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n\t\t\tdirectLight.visible = true;\n\t\t} else {\n\t\t\tdirectLight.color = vec3( 0.0 );\n\t\t\tdirectLight.visible = false;\n\t\t}\n\t}\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tstruct HemisphereLight {\n\t\tvec3 direction;\n\t\tvec3 skyColor;\n\t\tvec3 groundColor;\n\t};\n\tuniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n\tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n\t\tfloat dotNL = dot( geometry.normal, hemiLight.direction );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tirradiance *= PI;\n\t\t#endif\n\t\treturn irradiance;\n\t}\n#endif\n#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\tvec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {\n\t\t#include <normal_flip>\n\t\tvec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryVec = flipNormal * vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\t\t\tvec4 envMapColor = textureCubeUV( queryVec, 1.0 );\n\t\t#else\n\t\t\tvec4 envMapColor = vec4( 0.0 );\n\t\t#endif\n\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\t}\n\tfloat getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\tfloat maxMIPLevelScalar = float( maxMIPLevel );\n\t\tfloat desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n\t\treturn clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n\t}\n\tvec3 getLightProbeIndirectRadiance( const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n\t\t#endif\n\t\t#include <normal_flip>\n\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\tfloat specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n\t\t#ifdef ENVMAP_TYPE_CUBE\n\t\t\tvec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\t\tvec3 queryReflectVec = flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\t\t\tvec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));\n\t\t#elif defined( ENVMAP_TYPE_EQUIREC )\n\t\t\tvec2 sampleUV;\n\t\t\tsampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n\t\t\tsampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#elif defined( ENVMAP_TYPE_SPHERE )\n\t\t\tvec3 reflectView = flipNormal * normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );\n\t\t\t#ifdef TEXTURE_LOD_EXT\n\t\t\t\tvec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n\t\t\t#else\n\t\t\t\tvec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n\t\t\t#endif\n\t\t\tenvMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\t\t#endif\n\t\treturn envMapColor.rgb * envMapIntensity;\n\t}\n#endif\n",
	    lights_phong_fragment:"BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;\n",lights_phong_pars_fragment:"varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\nstruct BlinnPhongMaterial {\n\tvec3\tdiffuseColor;\n\tvec3\tspecularColor;\n\tfloat\tspecularShininess;\n\tfloat\tspecularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\treflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\treflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_BlinnPhong\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_BlinnPhong\n#define Material_LightProbeLOD( material )\t(0)\n",
	    lights_physical_fragment:"PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.specularRoughness = clamp( roughnessFactor, 0.04, 1.0 );\n#ifdef STANDARD\n\tmaterial.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb, metalnessFactor );\n#else\n\tmaterial.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );\n\tmaterial.clearCoat = saturate( clearCoat );\tmaterial.clearCoatRoughness = clamp( clearCoatRoughness, 0.04, 1.0 );\n#endif\n",
	    lights_physical_pars_fragment:"struct PhysicalMaterial {\n\tvec3\tdiffuseColor;\n\tfloat\tspecularRoughness;\n\tvec3\tspecularColor;\n\t#ifndef STANDARD\n\t\tfloat clearCoat;\n\t\tfloat clearCoatRoughness;\n\t#endif\n};\n#define MAXIMUM_SPECULAR_COEFFICIENT 0.16\n#define DEFAULT_SPECULAR_COEFFICIENT 0.04\nfloat clearCoatDHRApprox( const in float roughness, const in float dotNL ) {\n\treturn DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );\n}\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\tirradiance *= PI;\n\t#endif\n\t#ifndef STANDARD\n\t\tfloat clearCoatDHR = material.clearCoat * clearCoatDHRApprox( material.clearCoatRoughness, dotNL );\n\t#else\n\t\tfloat clearCoatDHR = 0.0;\n\t#endif\n\treflectedLight.directSpecular += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );\n\treflectedLight.directDiffuse += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\t#ifndef STANDARD\n\t\treflectedLight.directSpecular += irradiance * material.clearCoat * BRDF_Specular_GGX( directLight, geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearCoatRoughness );\n\t#endif\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 clearCoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\t#ifndef STANDARD\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\t\tfloat dotNL = dotNV;\n\t\tfloat clearCoatDHR = material.clearCoat * clearCoatDHRApprox( material.clearCoatRoughness, dotNL );\n\t#else\n\t\tfloat clearCoatDHR = 0.0;\n\t#endif\n\treflectedLight.indirectSpecular += ( 1.0 - clearCoatDHR ) * radiance * BRDF_Specular_GGX_Environment( geometry, material.specularColor, material.specularRoughness );\n\t#ifndef STANDARD\n\t\treflectedLight.indirectSpecular += clearCoatRadiance * material.clearCoat * BRDF_Specular_GGX_Environment( geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearCoatRoughness );\n\t#endif\n}\n#define RE_Direct\t\t\t\tRE_Direct_Physical\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular\t\tRE_IndirectSpecular_Physical\n#define Material_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.specularRoughness )\n#define Material_ClearCoat_BlinnShininessExponent( material )   GGXRoughnessToBlinnExponent( material.clearCoatRoughness )\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}\n",
	    lights_template:"\nGeometricContext geometry;\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = normalize( vViewPosition );\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\tPointLight pointLight;\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight = pointLights[ i ];\n\t\tgetPointDirectLightIrradiance( pointLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\tdirectLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\tSpotLight spotLight;\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight = spotLights[ i ];\n\t\tgetSpotDirectLightIrradiance( spotLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\tdirectLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\tDirectionalLight directionalLight;\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight = directionalLights[ i ];\n\t\tgetDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n\t\t#ifdef USE_SHADOWMAP\n\t\tdirectLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\t}\n#endif\n#if defined( RE_IndirectDiffuse )\n\tvec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\t#ifdef USE_LIGHTMAP\n\t\tvec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n\t\t\tlightMapIrradiance *= PI;\n\t\t#endif\n\t\tirradiance += lightMapIrradiance;\n\t#endif\n\t#if ( NUM_HEMI_LIGHTS > 0 )\n\t\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\t\tirradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n\t\t}\n\t#endif\n\t#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )\n\t \tirradiance += getLightProbeIndirectIrradiance( geometry, 8 );\n\t#endif\n\tRE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\tvec3 radiance = getLightProbeIndirectRadiance( geometry, Material_BlinnShininessExponent( material ), 8 );\n\t#ifndef STANDARD\n\t\tvec3 clearCoatRadiance = getLightProbeIndirectRadiance( geometry, Material_ClearCoat_BlinnShininessExponent( material ), 8 );\n\t#else\n\t\tvec3 clearCoatRadiance = vec3( 0.0 );\n\t#endif\n\t\t\n\tRE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );\n#endif\n",
	    logdepthbuf_fragment:"#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\tgl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n#endif",logdepthbuf_pars_fragment:"#ifdef USE_LOGDEPTHBUF\n\tuniform float logDepthBufFC;\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvarying float vFragDepth;\n\t#endif\n#endif\n",logdepthbuf_pars_vertex:"#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvarying float vFragDepth;\n\t#endif\n\tuniform float logDepthBufFC;\n#endif",logdepthbuf_vertex:"#ifdef USE_LOGDEPTHBUF\n\tgl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvFragDepth = 1.0 + gl_Position.w;\n\t#else\n\t\tgl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\t#endif\n#endif\n",
	    map_fragment:"#ifdef USE_MAP\n\tvec4 texelColor = texture2D( map, vUv );\n\ttexelColor = mapTexelToLinear( texelColor );\n\tdiffuseColor *= texelColor;\n#endif\n",map_pars_fragment:"#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif\n",map_particle_fragment:"#ifdef USE_MAP\n\tvec4 mapTexel = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\tdiffuseColor *= mapTexelToLinear( mapTexel );\n#endif\n",map_particle_pars_fragment:"#ifdef USE_MAP\n\tuniform vec4 offsetRepeat;\n\tuniform sampler2D map;\n#endif\n",
	    metalnessmap_fragment:"float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n\tvec4 texelMetalness = texture2D( metalnessMap, vUv );\n\tmetalnessFactor *= texelMetalness.r;\n#endif\n",metalnessmap_pars_fragment:"#ifdef USE_METALNESSMAP\n\tuniform sampler2D metalnessMap;\n#endif",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\n\tobjectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n\tobjectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n\tobjectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n\tobjectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n#endif\n",
	    morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n\t#ifndef USE_MORPHNORMALS\n\tuniform float morphTargetInfluences[ 8 ];\n\t#else\n\tuniform float morphTargetInfluences[ 4 ];\n\t#endif\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\n\ttransformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n\ttransformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n\ttransformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n\ttransformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\t#ifndef USE_MORPHNORMALS\n\ttransformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n\ttransformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n\ttransformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n\ttransformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\t#endif\n#endif\n",
	    normal_flip:"#ifdef DOUBLE_SIDED\n\tfloat flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n#else\n\tfloat flipNormal = 1.0;\n#endif\n",normal_fragment:"#ifdef FLAT_SHADED\n\tvec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n\tvec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n#else\n\tvec3 normal = normalize( vNormal ) * flipNormal;\n#endif\n#ifdef USE_NORMALMAP\n\tnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\n\tnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n",
	    normalmap_pars_fragment:"#ifdef USE_NORMALMAP\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\t\tvec3 q0 = dFdx( eye_pos.xyz );\n\t\tvec3 q1 = dFdy( eye_pos.xyz );\n\t\tvec2 st0 = dFdx( vUv.st );\n\t\tvec2 st1 = dFdy( vUv.st );\n\t\tvec3 S = normalize( q0 * st1.t - q1 * st0.t );\n\t\tvec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n\t\tvec3 N = normalize( surf_norm );\n\t\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\t\tmapN.xy = normalScale * mapN.xy;\n\t\tmat3 tsn = mat3( S, T, N );\n\t\treturn normalize( tsn * mapN );\n\t}\n#endif\n",
	    packing:"vec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 1.0 - 2.0 * rgb.xyz;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n\tvec4 r = vec4( fract( v * PackFactors ), v );\n\tr.yzw -= r.xyz * ShiftRight8;\treturn r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\treturn dot( v, UnpackFactors );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n",
	    premultiplied_alpha_fragment:"#ifdef PREMULTIPLIED_ALPHA\n\tgl_FragColor.rgb *= gl_FragColor.a;\n#endif\n",project_vertex:"#ifdef USE_SKINNING\n\tvec4 mvPosition = modelViewMatrix * skinned;\n#else\n\tvec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n#endif\ngl_Position = projectionMatrix * mvPosition;\n",roughnessmap_fragment:"float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n\tvec4 texelRoughness = texture2D( roughnessMap, vUv );\n\troughnessFactor *= texelRoughness.r;\n#endif\n",
	    roughnessmap_pars_fragment:"#ifdef USE_ROUGHNESSMAP\n\tuniform sampler2D roughnessMap;\n#endif",shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\t\tuniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\t\tuniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\t\tuniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\t#endif\n\tfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\t\treturn step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\t}\n\tfloat texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\t\tconst vec2 offset = vec2( 0.0, 1.0 );\n\t\tvec2 texelSize = vec2( 1.0 ) / size;\n\t\tvec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\t\tfloat lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n\t\tfloat lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n\t\tfloat rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n\t\tfloat rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\t\tvec2 f = fract( uv * size + 0.5 );\n\t\tfloat a = mix( lb, lt, f.y );\n\t\tfloat b = mix( rb, rt, f.y );\n\t\tfloat c = mix( a, b, f.x );\n\t\treturn c;\n\t}\n\tfloat getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\t\tshadowCoord.xyz /= shadowCoord.w;\n\t\tshadowCoord.z += shadowBias;\n\t\tbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n\t\tbool inFrustum = all( inFrustumVec );\n\t\tbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\t\tbool frustumTest = all( frustumTestVec );\n\t\tif ( frustumTest ) {\n\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\treturn (\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\treturn (\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#else\n\t\t\treturn texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#endif\n\t\t}\n\t\treturn 1.0;\n\t}\n\tvec2 cubeToUV( vec3 v, float texelSizeY ) {\n\t\tvec3 absV = abs( v );\n\t\tfloat scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\t\tabsV *= scaleToCube;\n\t\tv *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\t\tvec2 planar = v.xy;\n\t\tfloat almostATexel = 1.5 * texelSizeY;\n\t\tfloat almostOne = 1.0 - almostATexel;\n\t\tif ( absV.z >= almostOne ) {\n\t\t\tif ( v.z > 0.0 )\n\t\t\t\tplanar.x = 4.0 - v.x;\n\t\t} else if ( absV.x >= almostOne ) {\n\t\t\tfloat signX = sign( v.x );\n\t\t\tplanar.x = v.z * signX + 2.0 * signX;\n\t\t} else if ( absV.y >= almostOne ) {\n\t\t\tfloat signY = sign( v.y );\n\t\t\tplanar.x = v.x + 2.0 * signY + 2.0;\n\t\t\tplanar.y = v.z * signY - 2.0;\n\t\t}\n\t\treturn vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\t}\n\tfloat getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\t\tvec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\t\tvec3 lightToPosition = shadowCoord.xyz;\n\t\tvec3 bd3D = normalize( lightToPosition );\n\t\tfloat dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n\t\t#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\t\t\treturn (\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#else\n\t\t\treturn texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\t\t#endif\n\t}\n#endif\n",
	    shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\t\tuniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\t\tuniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n\t\tvarying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\t\tuniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\t#endif\n#endif\n",
	    shadowmap_vertex:"#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tvDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tvSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tvPointShadowCoord[ i ] = pointShadowMatrix[ i ] * worldPosition;\n\t}\n\t#endif\n#endif\n",
	    shadowmask_pars_fragment:"float getShadowMask() {\n\tfloat shadow = 1.0;\n\t#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHTS > 0\n\tDirectionalLight directionalLight;\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight = directionalLights[ i ];\n\t\tshadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t}\n\t#endif\n\t#if NUM_SPOT_LIGHTS > 0\n\tSpotLight spotLight;\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight = spotLights[ i ];\n\t\tshadow *= bool( spotLight.shadow ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\t}\n\t#endif\n\t#if NUM_POINT_LIGHTS > 0\n\tPointLight pointLight;\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight = pointLights[ i ];\n\t\tshadow *= bool( pointLight.shadow ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n\t}\n\t#endif\n\t#endif\n\treturn shadow;\n}\n",
	    skinbase_vertex:"#ifdef USE_SKINNING\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\n\tuniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n\t#ifdef BONE_TEXTURE\n\t\tuniform sampler2D boneTexture;\n\t\tuniform int boneTextureWidth;\n\t\tuniform int boneTextureHeight;\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tfloat j = i * 4.0;\n\t\t\tfloat x = mod( j, float( boneTextureWidth ) );\n\t\t\tfloat y = floor( j / float( boneTextureWidth ) );\n\t\t\tfloat dx = 1.0 / float( boneTextureWidth );\n\t\t\tfloat dy = 1.0 / float( boneTextureHeight );\n\t\t\ty = dy * ( y + 0.5 );\n\t\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\t\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\t\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\t\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\t\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\t\t\treturn bone;\n\t\t}\n\t#else\n\t\tuniform mat4 boneMatrices[ MAX_BONES ];\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tmat4 bone = boneMatrices[ int(i) ];\n\t\t\treturn bone;\n\t\t}\n\t#endif\n#endif\n",
	    skinning_vertex:"#ifdef USE_SKINNING\n\tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\tskinned  = bindMatrixInverse * skinned;\n#endif\n",skinnormal_vertex:"#ifdef USE_SKINNING\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\tskinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n#endif\n",
	    specularmap_fragment:"float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, vUv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",specularmap_pars_fragment:"#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",tonemapping_fragment:"#if defined( TONE_MAPPING )\n  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif\n",tonemapping_pars_fragment:"#define saturate(a) clamp( a, 0.0, 1.0 )\nuniform float toneMappingExposure;\nuniform float toneMappingWhitePoint;\nvec3 LinearToneMapping( vec3 color ) {\n  return toneMappingExposure * color;\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( color / ( vec3( 1.0 ) + color ) );\n}\n#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )\nvec3 Uncharted2ToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n  color *= toneMappingExposure;\n  color = max( vec3( 0.0 ), color - 0.004 );\n  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\n",
	    uv_pars_fragment:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\tvarying vec2 vUv;\n#endif",uv_pars_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\tvarying vec2 vUv;\n\tuniform vec4 offsetRepeat;\n#endif\n",
	    uv_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\tvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",uv2_pars_fragment:"#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tvarying vec2 vUv2;\n#endif",uv2_pars_vertex:"#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tattribute vec2 uv2;\n\tvarying vec2 vUv2;\n#endif",
	    uv2_vertex:"#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\tvUv2 = uv2;\n#endif",worldpos_vertex:"#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( PHYSICAL ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\t#ifdef USE_SKINNING\n\t\tvec4 worldPosition = modelMatrix * skinned;\n\t#else\n\t\tvec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n\t#endif\n#endif\n",cube_frag:"uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldPosition;\n#include <common>\nvoid main() {\n\tgl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n\tgl_FragColor.a *= opacity;\n}\n",
	    cube_vert:"varying vec3 vWorldPosition;\n#include <common>\nvoid main() {\n\tvWorldPosition = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n}\n",depth_frag:"#if DEPTH_PACKING == 3200\n\tuniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( 1.0 );\n\t#if DEPTH_PACKING == 3200\n\t\tdiffuseColor.a = opacity;\n\t#endif\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <logdepthbuf_fragment>\n\t#if DEPTH_PACKING == 3200\n\t\tgl_FragColor = vec4( vec3( gl_FragCoord.z ), opacity );\n\t#elif DEPTH_PACKING == 3201\n\t\tgl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n\t#endif\n}\n",
	    depth_vert:"#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <skinbase_vertex>\n\t#include <begin_vertex>\n\t#include <displacementmap_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n}\n",
	    distanceRGBA_frag:"uniform vec3 lightPos;\nvarying vec4 vWorldPosition;\n#include <common>\n#include <packing>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n\t#include <clipping_planes_fragment>\n\tgl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - lightPos.xyz ) / 1000.0 );\n}\n",distanceRGBA_vert:"varying vec4 vWorldPosition;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <skinbase_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\tvWorldPosition = worldPosition;\n}\n",
	    equirect_frag:"uniform sampler2D tEquirect;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\n#include <common>\nvoid main() {\n\tvec3 direction = normalize( vWorldPosition );\n\tvec2 sampleUV;\n\tsampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );\n\tsampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\n\tgl_FragColor = texture2D( tEquirect, sampleUV );\n}\n",equirect_vert:"varying vec3 vWorldPosition;\n#include <common>\nvoid main() {\n\tvWorldPosition = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n}\n",
	    linedashed_frag:"uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tif ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <color_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    linedashed_vert:"uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <color_vertex>\n\tvLineDistance = scale * lineDistance;\n\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\tgl_Position = projectionMatrix * mvPosition;\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n}\n",meshbasic_frag:"uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\tReflectedLight reflectedLight;\n\treflectedLight.directDiffuse = vec3( 0.0 );\n\treflectedLight.directSpecular = vec3( 0.0 );\n\treflectedLight.indirectDiffuse = diffuseColor.rgb;\n\treflectedLight.indirectSpecular = vec3( 0.0 );\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.indirectDiffuse;\n\t#include <normal_flip>\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    meshbasic_vert:"#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <skinbase_vertex>\n\t#ifdef USE_ENVMAP\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <envmap_vertex>\n}\n",
	    meshlambert_frag:"uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <emissivemap_fragment>\n\treflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );\n\t#include <lightmap_fragment>\n\treflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );\n\t#ifdef DOUBLE_SIDED\n\t\treflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;\n\t#else\n\t\treflectedLight.directDiffuse = vLightFront;\n\t#endif\n\treflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\t#include <normal_flip>\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    meshlambert_vert:"#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <envmap_pars_vertex>\n#include <bsdfs>\n#include <lights_pars>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <lights_lambert_vertex>\n\t#include <shadowmap_vertex>\n}\n",
	    meshphong_frag:"#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_flip>\n\t#include <normal_fragment>\n\t#include <emissivemap_fragment>\n\t#include <lights_phong_fragment>\n\t#include <lights_template>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\t#include <envmap_fragment>\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    meshphong_vert:"#define PHONG\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n#endif\n\t#include <begin_vertex>\n\t#include <displacementmap_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n}\n",
	    meshphysical_frag:"#define PHYSICAL\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifndef STANDARD\n\tuniform float clearCoat;\n\tuniform float clearCoatRoughness;\n#endif\nuniform float envMapIntensity;\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <lights_pars>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <roughnessmap_fragment>\n\t#include <metalnessmap_fragment>\n\t#include <normal_flip>\n\t#include <normal_fragment>\n\t#include <emissivemap_fragment>\n\t#include <lights_physical_fragment>\n\t#include <lights_template>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    meshphysical_vert:"#define PHYSICAL\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n#endif\n\t#include <begin_vertex>\n\t#include <displacementmap_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n}\n",
	    normal_frag:"uniform float opacity;\nvarying vec3 vNormal;\n#include <common>\n#include <packing>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tgl_FragColor = vec4( packNormalToRGB( vNormal ), opacity );\n\t#include <logdepthbuf_fragment>\n}\n",normal_vert:"varying vec3 vNormal;\n#include <common>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\tvNormal = normalize( normalMatrix * normal );\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n}\n",
	    points_frag:"uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <fog_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\t#include <clipping_planes_fragment>\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <logdepthbuf_fragment>\n\t#include <map_particle_fragment>\n\t#include <color_fragment>\n\t#include <alphatest_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n}\n",
	    points_vert:"uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <color_vertex>\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\t#ifdef USE_SIZEATTENUATION\n\t\tgl_PointSize = size * ( scale / - mvPosition.z );\n\t#else\n\t\tgl_PointSize = size;\n\t#endif\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n}\n",
	    shadow_frag:"uniform float opacity;\n#include <common>\n#include <packing>\n#include <bsdfs>\n#include <lights_pars>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n\tgl_FragColor = vec4( 0.0, 0.0, 0.0, opacity * ( 1.0  - getShadowMask() ) );\n}\n",shadow_vert:"#include <shadowmap_pars_vertex>\nvoid main() {\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n}\n"};H.prototype={constructor:H,
	    isColor:!0,r:1,g:1,b:1,set:function(a){a&&a.isColor?this.copy(a):"number"===typeof a?this.setHex(a):"string"===typeof a&&this.setStyle(a);return this},setScalar:function(a){this.b=this.g=this.r=a},setHex:function(a){a=Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSL:function(){function a(a,c,d){0>d&&(d+=1);1<d&&--d;return d<1/6?a+6*(c-a)*d:.5>d?c:d<2/3?a+6*(c-a)*(2/3-d):a}return function(b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           c,d){b=h.Math.euclideanModulo(b,1);c=h.Math.clamp(c,0,1);d=h.Math.clamp(d,0,1);0===c?this.r=this.g=this.b=d:(c=.5>=d?d*(1+c):d+c-d*c,d=2*d-c,this.r=a(d,c,b+1/3),this.g=a(d,c,b),this.b=a(d,c,b-1/3));return this}}(),setStyle:function(a){function b(b){void 0!==b&&1>parseFloat(b)&&console.warn("THREE.Color: Alpha component of "+a+" will be ignored.")}var c;if(c=/^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(a)){var d=c[2];switch(c[1]){case "rgb":case "rgba":if(c=/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(d))return this.r=
	      Math.min(255,parseInt(c[1],10))/255,this.g=Math.min(255,parseInt(c[2],10))/255,this.b=Math.min(255,parseInt(c[3],10))/255,b(c[5]),this;if(c=/^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(d))return this.r=Math.min(100,parseInt(c[1],10))/100,this.g=Math.min(100,parseInt(c[2],10))/100,this.b=Math.min(100,parseInt(c[3],10))/100,b(c[5]),this;break;case "hsl":case "hsla":if(c=/^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(d)){var d=parseFloat(c[1])/
	      360,e=parseInt(c[2],10)/100,f=parseInt(c[3],10)/100;b(c[5]);return this.setHSL(d,e,f)}}}else if(c=/^\#([A-Fa-f0-9]+)$/.exec(a)){c=c[1];d=c.length;if(3===d)return this.r=parseInt(c.charAt(0)+c.charAt(0),16)/255,this.g=parseInt(c.charAt(1)+c.charAt(1),16)/255,this.b=parseInt(c.charAt(2)+c.charAt(2),16)/255,this;if(6===d)return this.r=parseInt(c.charAt(0)+c.charAt(1),16)/255,this.g=parseInt(c.charAt(2)+c.charAt(3),16)/255,this.b=parseInt(c.charAt(4)+c.charAt(5),16)/255,this}a&&0<a.length&&(c=h.ColorKeywords[a],
	      void 0!==c?this.setHex(c):console.warn("THREE.Color: Unknown color "+a));return this},clone:function(){return new this.constructor(this.r,this.g,this.b)},copy:function(a){this.r=a.r;this.g=a.g;this.b=a.b;return this},copyGammaToLinear:function(a,b){void 0===b&&(b=2);this.r=Math.pow(a.r,b);this.g=Math.pow(a.g,b);this.b=Math.pow(a.b,b);return this},copyLinearToGamma:function(a,b){void 0===b&&(b=2);var c=0<b?1/b:1;this.r=Math.pow(a.r,c);this.g=Math.pow(a.g,c);this.b=Math.pow(a.b,c);return this},convertGammaToLinear:function(){var a=
	      this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);this.b=Math.sqrt(this.b);return this},getHex:function(){return 255*this.r<<16^255*this.g<<8^255*this.b<<0},getHexString:function(){return("000000"+this.getHex().toString(16)).slice(-6)},getHSL:function(a){a=a||{h:0,s:0,l:0};var b=this.r,c=this.g,d=this.b,e=Math.max(b,c,d),f=Math.min(b,c,d),g,k=(f+e)/2;if(f===e)f=g=0;else{var l=e-f,f=.5>=k?l/(e+f):
	    l/(2-e-f);switch(e){case b:g=(c-d)/l+(c<d?6:0);break;case c:g=(d-b)/l+2;break;case d:g=(b-c)/l+4}g/=6}a.h=g;a.s=f;a.l=k;return a},getStyle:function(){return"rgb("+(255*this.r|0)+","+(255*this.g|0)+","+(255*this.b|0)+")"},offsetHSL:function(a,b,c){var d=this.getHSL();d.h+=a;d.s+=b;d.l+=c;this.setHSL(d.h,d.s,d.l);return this},add:function(a){this.r+=a.r;this.g+=a.g;this.b+=a.b;return this},addColors:function(a,b){this.r=a.r+b.r;this.g=a.g+b.g;this.b=a.b+b.b;return this},addScalar:function(a){this.r+=
	      a;this.g+=a;this.b+=a;return this},sub:function(a){this.r=Math.max(0,this.r-a.r);this.g=Math.max(0,this.g-a.g);this.b=Math.max(0,this.b-a.b);return this},multiply:function(a){this.r*=a.r;this.g*=a.g;this.b*=a.b;return this},multiplyScalar:function(a){this.r*=a;this.g*=a;this.b*=a;return this},lerp:function(a,b){this.r+=(a.r-this.r)*b;this.g+=(a.g-this.g)*b;this.b+=(a.b-this.b)*b;return this},equals:function(a){return a.r===this.r&&a.g===this.g&&a.b===this.b},fromArray:function(a,b){void 0===b&&(b=
	      0);this.r=a[b];this.g=a[b+1];this.b=a[b+2];return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this.r;a[b+1]=this.g;a[b+2]=this.b;return a},toJSON:function(){return this.getHex()}};h.ColorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,
	    cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,
	    dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,
	    lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,
	    mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,
	    seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};var U={common:{diffuse:{value:new H(15658734)},opacity:{value:1},map:{value:null},offsetRepeat:{value:new da(0,0,1,1)},specularMap:{value:null},alphaMap:{value:null},
	      envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new C(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},
	      metalnessmap:{metalnessMap:{value:null}},fog:{fogDensity:{value:2.5E-4},fogNear:{value:1},fogFar:{value:2E3},fogColor:{value:new H(16777215)}},lights:{ambientLightColor:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{},shadow:{},shadowBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{},shadow:{},shadowBias:{},
	        shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{},shadow:{},shadowBias:{},shadowRadius:{},shadowMapSize:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}}},points:{diffuse:{value:new H(15658734)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},offsetRepeat:{value:new da(0,0,1,1)}}},
	    Cb={basic:{uniforms:h.UniformsUtils.merge([U.common,U.aomap,U.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:h.UniformsUtils.merge([U.common,U.aomap,U.lightmap,U.emissivemap,U.fog,U.lights,{emissive:{value:new H(0)}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:h.UniformsUtils.merge([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.fog,U.lights,{emissive:{value:new H(0)},specular:{value:new H(1118481)},
	      shininess:{value:30}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:h.UniformsUtils.merge([U.common,U.aomap,U.lightmap,U.emissivemap,U.bumpmap,U.normalmap,U.displacementmap,U.roughnessmap,U.metalnessmap,U.fog,U.lights,{emissive:{value:new H(0)},roughness:{value:.5},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},points:{uniforms:h.UniformsUtils.merge([U.points,U.fog]),vertexShader:Z.points_vert,
	      fragmentShader:Z.points_frag},dashed:{uniforms:h.UniformsUtils.merge([U.common,U.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:h.UniformsUtils.merge([U.common,U.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:{opacity:{value:1}},vertexShader:Z.normal_vert,fragmentShader:Z.normal_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,
	      fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null},tFlip:{value:-1}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distanceRGBA:{uniforms:{lightPos:{value:new q}},vertexShader:Z.distanceRGBA_vert,fragmentShader:Z.distanceRGBA_frag}};Cb.physical={uniforms:h.UniformsUtils.merge([Cb.standard.uniforms,{clearCoat:{value:0},clearCoatRoughness:{value:0}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};cc.prototype={constructor:cc,set:function(a,b){this.min.copy(a);
	    this.max.copy(b);return this},setFromPoints:function(a){this.makeEmpty();for(var b=0,c=a.length;b<c;b++)this.expandByPoint(a[b]);return this},setFromCenterAndSize:function(){var a=new C;return function(b,c){var d=a.copy(c).multiplyScalar(.5);this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=this.min.y=Infinity;this.max.x=this.max.y=
	    -Infinity;return this},isEmpty:function(){return this.max.x<this.min.x||this.max.y<this.min.y},getCenter:function(a){a=a||new C;return this.isEmpty()?a.set(0,0):a.addVectors(this.min,this.max).multiplyScalar(.5)},getSize:function(a){a=a||new C;return this.isEmpty()?a.set(0,0):a.subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);
	    this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y?!0:!1},getParameter:function(a,b){return(b||new C).set((a.x-this.min.x)/(this.max.x-this.min.x),(a.y-this.min.y)/(this.max.y-this.min.y))},intersectsBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y?
	    !1:!0},clampPoint:function(a,b){return(b||new C).copy(a).clamp(this.min,this.max)},distanceToPoint:function(){var a=new C;return function(b){return a.copy(b).clamp(this.min,this.max).sub(b).length()}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);return this},union:function(a){this.min.min(a.min);this.max.max(a.max);return this},translate:function(a){this.min.add(a);this.max.add(a);return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)}};S.prototype=
	  {constructor:S,isMaterial:!0,get needsUpdate(){return this._needsUpdate},set needsUpdate(a){!0===a&&this.update();this._needsUpdate=a},setValues:function(a){if(void 0!==a)for(var b in a){var c=a[b];if(void 0===c)console.warn("THREE.Material: '"+b+"' parameter is undefined.");else{var d=this[b];void 0===d?console.warn("THREE."+this.type+": '"+b+"' is not a property of this material."):d&&d.isColor?d.set(c):d&&d.isVector3&&c&&c.isVector3?d.copy(c):this[b]="overdraw"===b?Number(c):c}}},toJSON:function(a){function b(a){var b=
	    [],c;for(c in a){var d=a[c];delete d.metadata;b.push(d)}return b}var c=void 0===a;c&&(a={textures:{},images:{}});var d={metadata:{version:4.4,type:"Material",generator:"Material.toJSON"}};d.uuid=this.uuid;d.type=this.type;""!==this.name&&(d.name=this.name);this.color&&this.color.isColor&&(d.color=this.color.getHex());void 0!==this.roughness&&(d.roughness=this.roughness);void 0!==this.metalness&&(d.metalness=this.metalness);this.emissive&&this.emissive.isColor&&(d.emissive=this.emissive.getHex());
	    this.specular&&this.specular.isColor&&(d.specular=this.specular.getHex());void 0!==this.shininess&&(d.shininess=this.shininess);this.map&&this.map.isTexture&&(d.map=this.map.toJSON(a).uuid);this.alphaMap&&this.alphaMap.isTexture&&(d.alphaMap=this.alphaMap.toJSON(a).uuid);this.lightMap&&this.lightMap.isTexture&&(d.lightMap=this.lightMap.toJSON(a).uuid);this.bumpMap&&this.bumpMap.isTexture&&(d.bumpMap=this.bumpMap.toJSON(a).uuid,d.bumpScale=this.bumpScale);this.normalMap&&this.normalMap.isTexture&&
	    (d.normalMap=this.normalMap.toJSON(a).uuid,d.normalScale=this.normalScale.toArray());this.displacementMap&&this.displacementMap.isTexture&&(d.displacementMap=this.displacementMap.toJSON(a).uuid,d.displacementScale=this.displacementScale,d.displacementBias=this.displacementBias);this.roughnessMap&&this.roughnessMap.isTexture&&(d.roughnessMap=this.roughnessMap.toJSON(a).uuid);this.metalnessMap&&this.metalnessMap.isTexture&&(d.metalnessMap=this.metalnessMap.toJSON(a).uuid);this.emissiveMap&&this.emissiveMap.isTexture&&
	    (d.emissiveMap=this.emissiveMap.toJSON(a).uuid);this.specularMap&&this.specularMap.isTexture&&(d.specularMap=this.specularMap.toJSON(a).uuid);this.envMap&&this.envMap.isTexture&&(d.envMap=this.envMap.toJSON(a).uuid,d.reflectivity=this.reflectivity);void 0!==this.size&&(d.size=this.size);void 0!==this.sizeAttenuation&&(d.sizeAttenuation=this.sizeAttenuation);1!==this.blending&&(d.blending=this.blending);2!==this.shading&&(d.shading=this.shading);0!==this.side&&(d.side=this.side);0!==this.vertexColors&&
	    (d.vertexColors=this.vertexColors);1>this.opacity&&(d.opacity=this.opacity);!0===this.transparent&&(d.transparent=this.transparent);d.depthFunc=this.depthFunc;d.depthTest=this.depthTest;d.depthWrite=this.depthWrite;0<this.alphaTest&&(d.alphaTest=this.alphaTest);!0===this.premultipliedAlpha&&(d.premultipliedAlpha=this.premultipliedAlpha);!0===this.wireframe&&(d.wireframe=this.wireframe);1<this.wireframeLinewidth&&(d.wireframeLinewidth=this.wireframeLinewidth);"round"!==this.wireframeLinecap&&(d.wireframeLinecap=
	      this.wireframeLinecap);"round"!==this.wireframeLinejoin&&(d.wireframeLinejoin=this.wireframeLinejoin);d.skinning=this.skinning;d.morphTargets=this.morphTargets;c&&(c=b(a.textures),a=b(a.images),0<c.length&&(d.textures=c),0<a.length&&(d.images=a));return d},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.name=a.name;this.fog=a.fog;this.lights=a.lights;this.blending=a.blending;this.side=a.side;this.shading=a.shading;this.vertexColors=a.vertexColors;this.opacity=a.opacity;
	    this.transparent=a.transparent;this.blendSrc=a.blendSrc;this.blendDst=a.blendDst;this.blendEquation=a.blendEquation;this.blendSrcAlpha=a.blendSrcAlpha;this.blendDstAlpha=a.blendDstAlpha;this.blendEquationAlpha=a.blendEquationAlpha;this.depthFunc=a.depthFunc;this.depthTest=a.depthTest;this.depthWrite=a.depthWrite;this.colorWrite=a.colorWrite;this.precision=a.precision;this.polygonOffset=a.polygonOffset;this.polygonOffsetFactor=a.polygonOffsetFactor;this.polygonOffsetUnits=a.polygonOffsetUnits;this.alphaTest=
	      a.alphaTest;this.premultipliedAlpha=a.premultipliedAlpha;this.overdraw=a.overdraw;this.visible=a.visible;this.clipShadows=a.clipShadows;a=a.clippingPlanes;var b=null;if(null!==a)for(var c=a.length,b=Array(c),d=0;d!==c;++d)b[d]=a[d].clone();this.clippingPlanes=b;return this},update:function(){this.dispatchEvent({type:"update"})},dispose:function(){this.dispatchEvent({type:"dispose"})}};Object.assign(S.prototype,pa.prototype);var Zd=0;Da.prototype=Object.create(S.prototype);Da.prototype.constructor=
	    Da;Da.prototype.isShaderMaterial=!0;Da.prototype.copy=function(a){S.prototype.copy.call(this,a);this.fragmentShader=a.fragmentShader;this.vertexShader=a.vertexShader;this.uniforms=h.UniformsUtils.clone(a.uniforms);this.defines=a.defines;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;this.lights=a.lights;this.clipping=a.clipping;this.skinning=a.skinning;this.morphTargets=a.morphTargets;this.morphNormals=a.morphNormals;this.extensions=a.extensions;return this};Da.prototype.toJSON=
	    function(a){a=S.prototype.toJSON.call(this,a);a.uniforms=this.uniforms;a.vertexShader=this.vertexShader;a.fragmentShader=this.fragmentShader;return a};Ua.prototype=Object.create(S.prototype);Ua.prototype.constructor=Ua;Ua.prototype.isMeshDepthMaterial=!0;Ua.prototype.copy=function(a){S.prototype.copy.call(this,a);this.depthPacking=a.depthPacking;this.skinning=a.skinning;this.morphTargets=a.morphTargets;this.map=a.map;this.alphaMap=a.alphaMap;this.displacementMap=a.displacementMap;this.displacementScale=
	    a.displacementScale;this.displacementBias=a.displacementBias;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;return this};Ha.prototype={constructor:Ha,isBox3:!0,set:function(a,b){this.min.copy(a);this.max.copy(b);return this},setFromArray:function(a){for(var b=Infinity,c=Infinity,d=Infinity,e=-Infinity,f=-Infinity,g=-Infinity,k=0,l=a.length;k<l;k+=3){var h=a[k],u=a[k+1],p=a[k+2];h<b&&(b=h);u<c&&(c=u);p<d&&(d=p);h>e&&(e=h);u>f&&(f=u);p>g&&(g=p)}this.min.set(b,c,d);this.max.set(e,
	    f,g)},setFromPoints:function(a){this.makeEmpty();for(var b=0,c=a.length;b<c;b++)this.expandByPoint(a[b]);return this},setFromCenterAndSize:function(){var a=new q;return function(b,c){var d=a.copy(c).multiplyScalar(.5);this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),setFromObject:function(){var a=new q;return function(b){var c=this;b.updateMatrixWorld(!0);this.makeEmpty();b.traverse(function(b){var e=b.geometry;if(void 0!==e)if(e&&e.isGeometry)for(var e=e.vertices,f=0,g=e.length;f<
	  g;f++)a.copy(e[f]),a.applyMatrix4(b.matrixWorld),c.expandByPoint(a);else if(e&&e.isBufferGeometry&&(g=e.attributes.position,void 0!==g)){var k;g&&g.isInterleavedBufferAttribute?(e=g.data.array,f=g.offset,k=g.data.stride):(e=g.array,f=0,k=3);for(g=e.length;f<g;f+=k)a.fromArray(e,f),a.applyMatrix4(b.matrixWorld),c.expandByPoint(a)}});return this}}(),clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=
	    this.min.y=this.min.z=Infinity;this.max.x=this.max.y=this.max.z=-Infinity;return this},isEmpty:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z},getCenter:function(a){a=a||new q;return this.isEmpty()?a.set(0,0,0):a.addVectors(this.min,this.max).multiplyScalar(.5)},getSize:function(a){a=a||new q;return this.isEmpty()?a.set(0,0,0):a.subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);
	    this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y||a.z<this.min.z||a.z>this.max.z?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y&&this.min.z<=a.min.z&&a.max.z<=this.max.z?!0:!1},getParameter:function(a,b){return(b||new q).set((a.x-this.min.x)/(this.max.x-this.min.x),
	    (a.y-this.min.y)/(this.max.y-this.min.y),(a.z-this.min.z)/(this.max.z-this.min.z))},intersectsBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y||a.max.z<this.min.z||a.min.z>this.max.z?!1:!0},intersectsSphere:function(){var a;return function(b){void 0===a&&(a=new q);this.clampPoint(b.center,a);return a.distanceToSquared(b.center)<=b.radius*b.radius}}(),intersectsPlane:function(a){var b,c;0<a.normal.x?(b=a.normal.x*this.min.x,c=a.normal.x*this.max.x):
	    (b=a.normal.x*this.max.x,c=a.normal.x*this.min.x);0<a.normal.y?(b+=a.normal.y*this.min.y,c+=a.normal.y*this.max.y):(b+=a.normal.y*this.max.y,c+=a.normal.y*this.min.y);0<a.normal.z?(b+=a.normal.z*this.min.z,c+=a.normal.z*this.max.z):(b+=a.normal.z*this.max.z,c+=a.normal.z*this.min.z);return b<=a.constant&&c>=a.constant},clampPoint:function(a,b){return(b||new q).copy(a).clamp(this.min,this.max)},distanceToPoint:function(){var a=new q;return function(b){return a.copy(b).clamp(this.min,this.max).sub(b).length()}}(),
	    getBoundingSphere:function(){var a=new q;return function(b){b=b||new Aa;this.getCenter(b.center);b.radius=.5*this.size(a).length();return b}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);this.isEmpty()&&this.makeEmpty();return this},union:function(a){this.min.min(a.min);this.max.max(a.max);return this},applyMatrix4:function(){var a=[new q,new q,new q,new q,new q,new q,new q,new q];return function(b){if(this.isEmpty())return this;a[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(b);
	      a[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(b);a[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(b);a[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(b);a[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(b);a[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(b);a[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(b);a[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(b);this.setFromPoints(a);return this}}(),translate:function(a){this.min.add(a);this.max.add(a);
	      return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)}};Aa.prototype={constructor:Aa,set:function(a,b){this.center.copy(a);this.radius=b;return this},setFromPoints:function(){var a=new Ha;return function(b,c){var d=this.center;void 0!==c?d.copy(c):a.setFromPoints(b).getCenter(d);for(var e=0,f=0,g=b.length;f<g;f++)e=Math.max(e,d.distanceToSquared(b[f]));this.radius=Math.sqrt(e);return this}}(),clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.center.copy(a.center);
	    this.radius=a.radius;return this},empty:function(){return 0>=this.radius},containsPoint:function(a){return a.distanceToSquared(this.center)<=this.radius*this.radius},distanceToPoint:function(a){return a.distanceTo(this.center)-this.radius},intersectsSphere:function(a){var b=this.radius+a.radius;return a.center.distanceToSquared(this.center)<=b*b},intersectsBox:function(a){return a.intersectsSphere(this)},intersectsPlane:function(a){return Math.abs(this.center.dot(a.normal)-a.constant)<=this.radius},
	    clampPoint:function(a,b){var c=this.center.distanceToSquared(a),d=b||new q;d.copy(a);c>this.radius*this.radius&&(d.sub(this.center).normalize(),d.multiplyScalar(this.radius).add(this.center));return d},getBoundingBox:function(a){a=a||new Ha;a.set(this.center,this.center);a.expandByScalar(this.radius);return a},applyMatrix4:function(a){this.center.applyMatrix4(a);this.radius*=a.getMaxScaleOnAxis();return this},translate:function(a){this.center.add(a);return this},equals:function(a){return a.center.equals(this.center)&&
	      a.radius===this.radius}};ya.prototype={constructor:ya,isMatrix3:!0,set:function(a,b,c,d,e,f,g,k,l){var h=this.elements;h[0]=a;h[1]=d;h[2]=g;h[3]=b;h[4]=e;h[5]=k;h[6]=c;h[7]=f;h[8]=l;return this},identity:function(){this.set(1,0,0,0,1,0,0,0,1);return this},clone:function(){return(new this.constructor).fromArray(this.elements)},copy:function(a){a=a.elements;this.set(a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]);return this},setFromMatrix4:function(a){a=a.elements;this.set(a[0],a[4],a[8],a[1],a[5],a[9],
	    a[2],a[6],a[10]);return this},applyToVector3Array:function(){var a;return function(b,c,d){void 0===a&&(a=new q);void 0===c&&(c=0);void 0===d&&(d=b.length);for(var e=0;e<d;e+=3,c+=3)a.fromArray(b,c),a.applyMatrix3(this),a.toArray(b,c);return b}}(),applyToBuffer:function(){var a;return function(b,c,d){void 0===a&&(a=new q);void 0===c&&(c=0);void 0===d&&(d=b.length/b.itemSize);for(var e=0;e<d;e++,c++)a.x=b.getX(c),a.y=b.getY(c),a.z=b.getZ(c),a.applyMatrix3(this),b.setXYZ(a.x,a.y,a.z);return b}}(),multiplyScalar:function(a){var b=
	    this.elements;b[0]*=a;b[3]*=a;b[6]*=a;b[1]*=a;b[4]*=a;b[7]*=a;b[2]*=a;b[5]*=a;b[8]*=a;return this},determinant:function(){var a=this.elements,b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],k=a[6],l=a[7],a=a[8];return b*f*a-b*g*l-c*e*a+c*g*k+d*e*l-d*f*k},getInverse:function(a,b){a&&a.isMatrix4&&console.error("THREE.Matrix3.getInverse no longer takes a Matrix4 argument.");var c=a.elements,d=this.elements,e=c[0],f=c[1],g=c[2],k=c[3],l=c[4],h=c[5],u=c[6],p=c[7],c=c[8],n=c*l-h*p,r=h*u-c*k,t=p*k-l*u,q=e*n+f*
	    r+g*t;if(0===q){if(!0===b)throw Error("THREE.Matrix3.getInverse(): can't invert matrix, determinant is 0");console.warn("THREE.Matrix3.getInverse(): can't invert matrix, determinant is 0");return this.identity()}q=1/q;d[0]=n*q;d[1]=(g*p-c*f)*q;d[2]=(h*f-g*l)*q;d[3]=r*q;d[4]=(c*e-g*u)*q;d[5]=(g*k-h*e)*q;d[6]=t*q;d[7]=(f*u-p*e)*q;d[8]=(l*e-f*k)*q;return this},transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},flattenToArrayOffset:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          b){console.warn("THREE.Matrix3: .flattenToArrayOffset is deprecated - just use .toArray instead.");return this.toArray(a,b)},getNormalMatrix:function(a){return this.setFromMatrix4(a).getInverse(this).transpose()},transposeIntoArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this},fromArray:function(a,b){void 0===b&&(b=0);for(var c=0;9>c;c++)this.elements[c]=a[c+b];return this},toArray:function(a,b){void 0===a&&(a=
	    []);void 0===b&&(b=0);var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];return a}};fa.prototype={constructor:fa,set:function(a,b){this.normal.copy(a);this.constant=b;return this},setComponents:function(a,b,c,d){this.normal.set(a,b,c);this.constant=d;return this},setFromNormalAndCoplanarPoint:function(a,b){this.normal.copy(a);this.constant=-b.dot(this.normal);return this},setFromCoplanarPoints:function(){var a=new q,b=new q;
	    return function(c,d,e){d=a.subVectors(e,d).cross(b.subVectors(c,d)).normalize();this.setFromNormalAndCoplanarPoint(d,c);return this}}(),clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.normal.copy(a.normal);this.constant=a.constant;return this},normalize:function(){var a=1/this.normal.length();this.normal.multiplyScalar(a);this.constant*=a;return this},negate:function(){this.constant*=-1;this.normal.negate();return this},distanceToPoint:function(a){return this.normal.dot(a)+
	    this.constant},distanceToSphere:function(a){return this.distanceToPoint(a.center)-a.radius},projectPoint:function(a,b){return this.orthoPoint(a,b).sub(a).negate()},orthoPoint:function(a,b){var c=this.distanceToPoint(a);return(b||new q).copy(this.normal).multiplyScalar(c)},intersectLine:function(){var a=new q;return function(b,c){var d=c||new q,e=b.delta(a),f=this.normal.dot(e);if(0===f){if(0===this.distanceToPoint(b.start))return d.copy(b.start)}else return f=-(b.start.dot(this.normal)+this.constant)/
	    f,0>f||1<f?void 0:d.copy(e).multiplyScalar(f).add(b.start)}}(),intersectsLine:function(a){var b=this.distanceToPoint(a.start);a=this.distanceToPoint(a.end);return 0>b&&0<a||0>a&&0<b},intersectsBox:function(a){return a.intersectsPlane(this)},intersectsSphere:function(a){return a.intersectsPlane(this)},coplanarPoint:function(a){return(a||new q).copy(this.normal).multiplyScalar(-this.constant)},applyMatrix4:function(){var a=new q,b=new ya;return function(c,d){var e=this.coplanarPoint(a).applyMatrix4(c),
	    f=d||b.getNormalMatrix(c),f=this.normal.applyMatrix3(f).normalize();this.constant=-e.dot(f);return this}}(),translate:function(a){this.constant-=a.dot(this.normal);return this},equals:function(a){return a.normal.equals(this.normal)&&a.constant===this.constant}};dc.prototype={constructor:dc,set:function(a,b,c,d,e,f){var g=this.planes;g[0].copy(a);g[1].copy(b);g[2].copy(c);g[3].copy(d);g[4].copy(e);g[5].copy(f);return this},clone:function(){return(new this.constructor).copy(this)},copy:function(a){for(var b=
	    this.planes,c=0;6>c;c++)b[c].copy(a.planes[c]);return this},setFromMatrix:function(a){var b=this.planes,c=a.elements;a=c[0];var d=c[1],e=c[2],f=c[3],g=c[4],k=c[5],l=c[6],h=c[7],u=c[8],p=c[9],n=c[10],r=c[11],t=c[12],q=c[13],A=c[14],c=c[15];b[0].setComponents(f-a,h-g,r-u,c-t).normalize();b[1].setComponents(f+a,h+g,r+u,c+t).normalize();b[2].setComponents(f+d,h+k,r+p,c+q).normalize();b[3].setComponents(f-d,h-k,r-p,c-q).normalize();b[4].setComponents(f-e,h-l,r-n,c-A).normalize();b[5].setComponents(f+e,
	    h+l,r+n,c+A).normalize();return this},intersectsObject:function(){var a=new Aa;return function(b){var c=b.geometry;null===c.boundingSphere&&c.computeBoundingSphere();a.copy(c.boundingSphere).applyMatrix4(b.matrixWorld);return this.intersectsSphere(a)}}(),intersectsSprite:function(){var a=new Aa;return function(b){a.center.set(0,0,0);a.radius=.7071067811865476;a.applyMatrix4(b.matrixWorld);return this.intersectsSphere(a)}}(),intersectsSphere:function(a){var b=this.planes,c=a.center;a=-a.radius;for(var d=
	    0;6>d;d++)if(b[d].distanceToPoint(c)<a)return!1;return!0},intersectsBox:function(){var a=new q,b=new q;return function(c){for(var d=this.planes,e=0;6>e;e++){var f=d[e];a.x=0<f.normal.x?c.min.x:c.max.x;b.x=0<f.normal.x?c.max.x:c.min.x;a.y=0<f.normal.y?c.min.y:c.max.y;b.y=0<f.normal.y?c.max.y:c.min.y;a.z=0<f.normal.z?c.min.z:c.max.z;b.z=0<f.normal.z?c.max.z:c.min.z;var g=f.distanceToPoint(a),f=f.distanceToPoint(b);if(0>g&&0>f)return!1}return!0}}(),containsPoint:function(a){for(var b=this.planes,c=0;6>
	  c;c++)if(0>b[c].distanceToPoint(a))return!1;return!0}};Wa.prototype={constructor:Wa,set:function(a,b){this.origin.copy(a);this.direction.copy(b);return this},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.origin.copy(a.origin);this.direction.copy(a.direction);return this},at:function(a,b){return(b||new q).copy(this.direction).multiplyScalar(a).add(this.origin)},lookAt:function(a){this.direction.copy(a).sub(this.origin).normalize();return this},recast:function(){var a=
	    new q;return function(b){this.origin.copy(this.at(b,a));return this}}(),closestPointToPoint:function(a,b){var c=b||new q;c.subVectors(a,this.origin);var d=c.dot(this.direction);return 0>d?c.copy(this.origin):c.copy(this.direction).multiplyScalar(d).add(this.origin)},distanceToPoint:function(a){return Math.sqrt(this.distanceSqToPoint(a))},distanceSqToPoint:function(){var a=new q;return function(b){var c=a.subVectors(b,this.origin).dot(this.direction);if(0>c)return this.origin.distanceToSquared(b);
	    a.copy(this.direction).multiplyScalar(c).add(this.origin);return a.distanceToSquared(b)}}(),distanceSqToSegment:function(){var a=new q,b=new q,c=new q;return function(d,e,f,g){a.copy(d).add(e).multiplyScalar(.5);b.copy(e).sub(d).normalize();c.copy(this.origin).sub(a);var k=.5*d.distanceTo(e),l=-this.direction.dot(b),h=c.dot(this.direction),u=-c.dot(b),p=c.lengthSq(),n=Math.abs(1-l*l),r;0<n?(d=l*u-h,e=l*h-u,r=k*n,0<=d?e>=-r?e<=r?(k=1/n,d*=k,e*=k,l=d*(d+l*e+2*h)+e*(l*d+e+2*u)+p):(e=k,d=Math.max(0,-(l*
	  e+h)),l=-d*d+e*(e+2*u)+p):(e=-k,d=Math.max(0,-(l*e+h)),l=-d*d+e*(e+2*u)+p):e<=-r?(d=Math.max(0,-(-l*k+h)),e=0<d?-k:Math.min(Math.max(-k,-u),k),l=-d*d+e*(e+2*u)+p):e<=r?(d=0,e=Math.min(Math.max(-k,-u),k),l=e*(e+2*u)+p):(d=Math.max(0,-(l*k+h)),e=0<d?k:Math.min(Math.max(-k,-u),k),l=-d*d+e*(e+2*u)+p)):(e=0<l?-k:k,d=Math.max(0,-(l*e+h)),l=-d*d+e*(e+2*u)+p);f&&f.copy(this.direction).multiplyScalar(d).add(this.origin);g&&g.copy(b).multiplyScalar(e).add(a);return l}}(),intersectSphere:function(){var a=new q;
	    return function(b,c){a.subVectors(b.center,this.origin);var d=a.dot(this.direction),e=a.dot(a)-d*d,f=b.radius*b.radius;if(e>f)return null;f=Math.sqrt(f-e);e=d-f;d+=f;return 0>e&&0>d?null:0>e?this.at(d,c):this.at(e,c)}}(),intersectsSphere:function(a){return this.distanceToPoint(a.center)<=a.radius},distanceToPlane:function(a){var b=a.normal.dot(this.direction);if(0===b)return 0===a.distanceToPoint(this.origin)?0:null;a=-(this.origin.dot(a.normal)+a.constant)/b;return 0<=a?a:null},intersectPlane:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                b){var c=this.distanceToPlane(a);return null===c?null:this.at(c,b)},intersectsPlane:function(a){var b=a.distanceToPoint(this.origin);return 0===b||0>a.normal.dot(this.direction)*b?!0:!1},intersectBox:function(a,b){var c,d,e,f,g;d=1/this.direction.x;f=1/this.direction.y;g=1/this.direction.z;var k=this.origin;0<=d?(c=(a.min.x-k.x)*d,d*=a.max.x-k.x):(c=(a.max.x-k.x)*d,d*=a.min.x-k.x);0<=f?(e=(a.min.y-k.y)*f,f*=a.max.y-k.y):(e=(a.max.y-k.y)*f,f*=a.min.y-k.y);if(c>f||e>d)return null;if(e>c||c!==c)c=e;
	    if(f<d||d!==d)d=f;0<=g?(e=(a.min.z-k.z)*g,g*=a.max.z-k.z):(e=(a.max.z-k.z)*g,g*=a.min.z-k.z);if(c>g||e>d)return null;if(e>c||c!==c)c=e;if(g<d||d!==d)d=g;return 0>d?null:this.at(0<=c?c:d,b)},intersectsBox:function(){var a=new q;return function(b){return null!==this.intersectBox(b,a)}}(),intersectTriangle:function(){var a=new q,b=new q,c=new q,d=new q;return function(e,f,g,k,l){b.subVectors(f,e);c.subVectors(g,e);d.crossVectors(b,c);f=this.direction.dot(d);if(0<f){if(k)return null;k=1}else if(0>f)k=
	    -1,f=-f;else return null;a.subVectors(this.origin,e);e=k*this.direction.dot(c.crossVectors(a,c));if(0>e)return null;g=k*this.direction.dot(b.cross(a));if(0>g||e+g>f)return null;e=-k*a.dot(d);return 0>e?null:this.at(e/f,l)}}(),applyMatrix4:function(a){this.direction.add(this.origin).applyMatrix4(a);this.origin.applyMatrix4(a);this.direction.sub(this.origin);this.direction.normalize();return this},equals:function(a){return a.origin.equals(this.origin)&&a.direction.equals(this.direction)}};Xa.RotationOrders=
	    "XYZ YZX ZXY XZY YXZ ZYX".split(" ");Xa.DefaultOrder="XYZ";Xa.prototype={constructor:Xa,isEuler:!0,get x(){return this._x},set x(a){this._x=a;this.onChangeCallback()},get y(){return this._y},set y(a){this._y=a;this.onChangeCallback()},get z(){return this._z},set z(a){this._z=a;this.onChangeCallback()},get order(){return this._order},set order(a){this._order=a;this.onChangeCallback()},set:function(a,b,c,d){this._x=a;this._y=b;this._z=c;this._order=d||this._order;this.onChangeCallback();return this},
	    clone:function(){return new this.constructor(this._x,this._y,this._z,this._order)},copy:function(a){this._x=a._x;this._y=a._y;this._z=a._z;this._order=a._order;this.onChangeCallback();return this},setFromRotationMatrix:function(a,b,c){var d=h.Math.clamp,e=a.elements;a=e[0];var f=e[4],g=e[8],k=e[1],l=e[5],m=e[9],u=e[2],p=e[6],e=e[10];b=b||this._order;"XYZ"===b?(this._y=Math.asin(d(g,-1,1)),.99999>Math.abs(g)?(this._x=Math.atan2(-m,e),this._z=Math.atan2(-f,a)):(this._x=Math.atan2(p,l),this._z=0)):"YXZ"===
	    b?(this._x=Math.asin(-d(m,-1,1)),.99999>Math.abs(m)?(this._y=Math.atan2(g,e),this._z=Math.atan2(k,l)):(this._y=Math.atan2(-u,a),this._z=0)):"ZXY"===b?(this._x=Math.asin(d(p,-1,1)),.99999>Math.abs(p)?(this._y=Math.atan2(-u,e),this._z=Math.atan2(-f,l)):(this._y=0,this._z=Math.atan2(k,a))):"ZYX"===b?(this._y=Math.asin(-d(u,-1,1)),.99999>Math.abs(u)?(this._x=Math.atan2(p,e),this._z=Math.atan2(k,a)):(this._x=0,this._z=Math.atan2(-f,l))):"YZX"===b?(this._z=Math.asin(d(k,-1,1)),.99999>Math.abs(k)?(this._x=
	      Math.atan2(-m,l),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(g,e))):"XZY"===b?(this._z=Math.asin(-d(f,-1,1)),.99999>Math.abs(f)?(this._x=Math.atan2(p,l),this._y=Math.atan2(g,a)):(this._x=Math.atan2(-m,e),this._y=0)):console.warn("THREE.Euler: .setFromRotationMatrix() given unsupported order: "+b);this._order=b;if(!1!==c)this.onChangeCallback();return this},setFromQuaternion:function(){var a;return function(b,c,d){void 0===a&&(a=new P);a.makeRotationFromQuaternion(b);return this.setFromRotationMatrix(a,
	      c,d)}}(),setFromVector3:function(a,b){return this.set(a.x,a.y,a.z,b||this._order)},reorder:function(){var a=new ca;return function(b){a.setFromEuler(this);return this.setFromQuaternion(a,b)}}(),equals:function(a){return a._x===this._x&&a._y===this._y&&a._z===this._z&&a._order===this._order},fromArray:function(a){this._x=a[0];this._y=a[1];this._z=a[2];void 0!==a[3]&&(this._order=a[3]);this.onChangeCallback();return this},toArray:function(a,b){void 0===a&&(a=[]);void 0===b&&(b=0);a[b]=this._x;a[b+1]=
	      this._y;a[b+2]=this._z;a[b+3]=this._order;return a},toVector3:function(a){return a?a.set(this._x,this._y,this._z):new q(this._x,this._y,this._z)},onChange:function(a){this.onChangeCallback=a;return this},onChangeCallback:function(){}};Kc.prototype={constructor:Kc,set:function(a){this.mask=1<<a},enable:function(a){this.mask|=1<<a},toggle:function(a){this.mask^=1<<a},disable:function(a){this.mask&=~(1<<a)},test:function(a){return 0!==(this.mask&a.mask)}};D.DefaultUp=new q(0,1,0);D.DefaultMatrixAutoUpdate=
	    !0;Object.assign(D.prototype,pa.prototype,{isObject3D:!0,applyMatrix:function(a){this.matrix.multiplyMatrices(a,this.matrix);this.matrix.decompose(this.position,this.quaternion,this.scale)},setRotationFromAxisAngle:function(a,b){this.quaternion.setFromAxisAngle(a,b)},setRotationFromEuler:function(a){this.quaternion.setFromEuler(a,!0)},setRotationFromMatrix:function(a){this.quaternion.setFromRotationMatrix(a)},setRotationFromQuaternion:function(a){this.quaternion.copy(a)},rotateOnAxis:function(){var a=
	    new ca;return function(b,c){a.setFromAxisAngle(b,c);this.quaternion.multiply(a);return this}}(),rotateX:function(){var a=new q(1,0,0);return function(b){return this.rotateOnAxis(a,b)}}(),rotateY:function(){var a=new q(0,1,0);return function(b){return this.rotateOnAxis(a,b)}}(),rotateZ:function(){var a=new q(0,0,1);return function(b){return this.rotateOnAxis(a,b)}}(),translateOnAxis:function(){var a=new q;return function(b,c){a.copy(b).applyQuaternion(this.quaternion);this.position.add(a.multiplyScalar(c));
	    return this}}(),translateX:function(){var a=new q(1,0,0);return function(b){return this.translateOnAxis(a,b)}}(),translateY:function(){var a=new q(0,1,0);return function(b){return this.translateOnAxis(a,b)}}(),translateZ:function(){var a=new q(0,0,1);return function(b){return this.translateOnAxis(a,b)}}(),localToWorld:function(a){return a.applyMatrix4(this.matrixWorld)},worldToLocal:function(){var a=new P;return function(b){return b.applyMatrix4(a.getInverse(this.matrixWorld))}}(),lookAt:function(){var a=
	    new P;return function(b){a.lookAt(b,this.position,this.up);this.quaternion.setFromRotationMatrix(a)}}(),add:function(a){if(1<arguments.length){for(var b=0;b<arguments.length;b++)this.add(arguments[b]);return this}if(a===this)return console.error("THREE.Object3D.add: object can't be added as a child of itself.",a),this;a&&a.isObject3D?(null!==a.parent&&a.parent.remove(a),a.parent=this,a.dispatchEvent({type:"added"}),this.children.push(a)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",
	    a);return this},remove:function(a){if(1<arguments.length)for(var b=0;b<arguments.length;b++)this.remove(arguments[b]);b=this.children.indexOf(a);-1!==b&&(a.parent=null,a.dispatchEvent({type:"removed"}),this.children.splice(b,1))},getObjectById:function(a){return this.getObjectByProperty("id",a)},getObjectByName:function(a){return this.getObjectByProperty("name",a)},getObjectByProperty:function(a,b){if(this[a]===b)return this;for(var c=0,d=this.children.length;c<d;c++){var e=this.children[c].getObjectByProperty(a,
	    b);if(void 0!==e)return e}},getWorldPosition:function(a){a=a||new q;this.updateMatrixWorld(!0);return a.setFromMatrixPosition(this.matrixWorld)},getWorldQuaternion:function(){var a=new q,b=new q;return function(c){c=c||new ca;this.updateMatrixWorld(!0);this.matrixWorld.decompose(a,c,b);return c}}(),getWorldRotation:function(){var a=new ca;return function(b){b=b||new Xa;this.getWorldQuaternion(a);return b.setFromQuaternion(a,this.rotation.order,!1)}}(),getWorldScale:function(){var a=new q,b=new ca;
	    return function(c){c=c||new q;this.updateMatrixWorld(!0);this.matrixWorld.decompose(a,b,c);return c}}(),getWorldDirection:function(){var a=new ca;return function(b){b=b||new q;this.getWorldQuaternion(a);return b.set(0,0,1).applyQuaternion(a)}}(),raycast:function(){},traverse:function(a){a(this);for(var b=this.children,c=0,d=b.length;c<d;c++)b[c].traverse(a)},traverseVisible:function(a){if(!1!==this.visible){a(this);for(var b=this.children,c=0,d=b.length;c<d;c++)b[c].traverseVisible(a)}},traverseAncestors:function(a){var b=
	    this.parent;null!==b&&(a(b),b.traverseAncestors(a))},updateMatrix:function(){this.matrix.compose(this.position,this.quaternion,this.scale);this.matrixWorldNeedsUpdate=!0},updateMatrixWorld:function(a){!0===this.matrixAutoUpdate&&this.updateMatrix();if(!0===this.matrixWorldNeedsUpdate||!0===a)null===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,a=!0;for(var b=this.children,c=0,d=b.length;c<d;c++)b[c].updateMatrixWorld(a)},
	    toJSON:function(a){function b(a){var b=[],c;for(c in a){var d=a[c];delete d.metadata;b.push(d)}return b}var c=void 0===a||""===a,d={};c&&(a={geometries:{},materials:{},textures:{},images:{}},d.metadata={version:4.4,type:"Object",generator:"Object3D.toJSON"});var e={};e.uuid=this.uuid;e.type=this.type;""!==this.name&&(e.name=this.name);"{}"!==JSON.stringify(this.userData)&&(e.userData=this.userData);!0===this.castShadow&&(e.castShadow=!0);!0===this.receiveShadow&&(e.receiveShadow=!0);!1===this.visible&&
	    (e.visible=!1);e.matrix=this.matrix.toArray();void 0!==this.geometry&&(void 0===a.geometries[this.geometry.uuid]&&(a.geometries[this.geometry.uuid]=this.geometry.toJSON(a)),e.geometry=this.geometry.uuid);void 0!==this.material&&(void 0===a.materials[this.material.uuid]&&(a.materials[this.material.uuid]=this.material.toJSON(a)),e.material=this.material.uuid);if(0<this.children.length){e.children=[];for(var f=0;f<this.children.length;f++)e.children.push(this.children[f].toJSON(a).object)}if(c){var c=
	      b(a.geometries),f=b(a.materials),g=b(a.textures);a=b(a.images);0<c.length&&(d.geometries=c);0<f.length&&(d.materials=f);0<g.length&&(d.textures=g);0<a.length&&(d.images=a)}d.object=e;return d},clone:function(a){return(new this.constructor).copy(this,a)},copy:function(a,b){void 0===b&&(b=!0);this.name=a.name;this.up.copy(a.up);this.position.copy(a.position);this.quaternion.copy(a.quaternion);this.scale.copy(a.scale);this.matrix.copy(a.matrix);this.matrixWorld.copy(a.matrixWorld);this.matrixAutoUpdate=
	      a.matrixAutoUpdate;this.matrixWorldNeedsUpdate=a.matrixWorldNeedsUpdate;this.visible=a.visible;this.castShadow=a.castShadow;this.receiveShadow=a.receiveShadow;this.frustumCulled=a.frustumCulled;this.renderOrder=a.renderOrder;this.userData=JSON.parse(JSON.stringify(a.userData));if(!0===b)for(var c=0;c<a.children.length;c++)this.add(a.children[c].clone());return this}});var ae=0;cb.prototype={constructor:cb,set:function(a,b){this.start.copy(a);this.end.copy(b);return this},clone:function(){return(new this.constructor).copy(this)},
	    copy:function(a){this.start.copy(a.start);this.end.copy(a.end);return this},getCenter:function(a){return(a||new q).addVectors(this.start,this.end).multiplyScalar(.5)},delta:function(a){return(a||new q).subVectors(this.end,this.start)},distanceSq:function(){return this.start.distanceToSquared(this.end)},distance:function(){return this.start.distanceTo(this.end)},at:function(a,b){var c=b||new q;return this.delta(c).multiplyScalar(a).add(this.start)},closestPointToPointParameter:function(){var a=new q,
	      b=new q;return function(c,d){a.subVectors(c,this.start);b.subVectors(this.end,this.start);var e=b.dot(b),e=b.dot(a)/e;d&&(e=h.Math.clamp(e,0,1));return e}}(),closestPointToPoint:function(a,b,c){a=this.closestPointToPointParameter(a,b);c=c||new q;return this.delta(c).multiplyScalar(a).add(this.start)},applyMatrix4:function(a){this.start.applyMatrix4(a);this.end.applyMatrix4(a);return this},equals:function(a){return a.start.equals(this.start)&&a.end.equals(this.end)}};Fa.normal=function(){var a=new q;
	    return function(b,c,d,e){e=e||new q;e.subVectors(d,c);a.subVectors(b,c);e.cross(a);b=e.lengthSq();return 0<b?e.multiplyScalar(1/Math.sqrt(b)):e.set(0,0,0)}}();Fa.barycoordFromPoint=function(){var a=new q,b=new q,c=new q;return function(d,e,f,g,k){a.subVectors(g,e);b.subVectors(f,e);c.subVectors(d,e);d=a.dot(a);e=a.dot(b);f=a.dot(c);var l=b.dot(b);g=b.dot(c);var h=d*l-e*e;k=k||new q;if(0===h)return k.set(-2,-1,-1);h=1/h;l=(l*f-e*g)*h;d=(d*g-e*f)*h;return k.set(1-l-d,d,l)}}();Fa.containsPoint=function(){var a=
	    new q;return function(b,c,d,e){b=Fa.barycoordFromPoint(b,c,d,e,a);return 0<=b.x&&0<=b.y&&1>=b.x+b.y}}();Fa.prototype={constructor:Fa,set:function(a,b,c){this.a.copy(a);this.b.copy(b);this.c.copy(c);return this},setFromPointsAndIndices:function(a,b,c,d){this.a.copy(a[b]);this.b.copy(a[c]);this.c.copy(a[d]);return this},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.a.copy(a.a);this.b.copy(a.b);this.c.copy(a.c);return this},area:function(){var a=new q,b=new q;return function(){a.subVectors(this.c,
	    this.b);b.subVectors(this.a,this.b);return.5*a.cross(b).length()}}(),midpoint:function(a){return(a||new q).addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)},normal:function(a){return Fa.normal(this.a,this.b,this.c,a)},plane:function(a){return(a||new fa).setFromCoplanarPoints(this.a,this.b,this.c)},barycoordFromPoint:function(a,b){return Fa.barycoordFromPoint(a,this.a,this.b,this.c,b)},containsPoint:function(a){return Fa.containsPoint(a,this.a,this.b,this.c)},closestPointToPoint:function(){var a,
	    b,c,d;return function(e,f){void 0===a&&(a=new fa,b=[new cb,new cb,new cb],c=new q,d=new q);var g=f||new q,k=Infinity;a.setFromCoplanarPoints(this.a,this.b,this.c);a.projectPoint(e,c);if(!0===this.containsPoint(c))g.copy(c);else{b[0].set(this.a,this.b);b[1].set(this.b,this.c);b[2].set(this.c,this.a);for(var l=0;l<b.length;l++){b[l].closestPointToPoint(c,!0,d);var h=c.distanceToSquared(d);h<k&&(k=h,g.copy(d))}}return g}}(),equals:function(a){return a.a.equals(this.a)&&a.b.equals(this.b)&&a.c.equals(this.c)}};
	  ga.prototype={constructor:ga,clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.a=a.a;this.b=a.b;this.c=a.c;this.normal.copy(a.normal);this.color.copy(a.color);this.materialIndex=a.materialIndex;for(var b=0,c=a.vertexNormals.length;b<c;b++)this.vertexNormals[b]=a.vertexNormals[b].clone();b=0;for(c=a.vertexColors.length;b<c;b++)this.vertexColors[b]=a.vertexColors[b].clone();return this}};Ia.prototype=Object.create(S.prototype);Ia.prototype.constructor=Ia;Ia.prototype.isMeshBasicMaterial=
	    !0;Ia.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.map=a.map;this.aoMap=a.aoMap;this.aoMapIntensity=a.aoMapIntensity;this.specularMap=a.specularMap;this.alphaMap=a.alphaMap;this.envMap=a.envMap;this.combine=a.combine;this.reflectivity=a.reflectivity;this.refractionRatio=a.refractionRatio;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;this.wireframeLinecap=a.wireframeLinecap;this.wireframeLinejoin=a.wireframeLinejoin;this.skinning=
	    a.skinning;this.morphTargets=a.morphTargets;return this};z.prototype={constructor:z,isBufferAttribute:!0,set needsUpdate(a){!0===a&&this.version++},setDynamic:function(a){this.dynamic=a;return this},copy:function(a){this.array=new a.array.constructor(a.array);this.itemSize=a.itemSize;this.count=a.count;this.normalized=a.normalized;this.dynamic=a.dynamic;return this},copyAt:function(a,b,c){a*=this.itemSize;c*=b.itemSize;for(var d=0,e=this.itemSize;d<e;d++)this.array[a+d]=b.array[c+d];return this},
	    copyArray:function(a){this.array.set(a);return this},copyColorsArray:function(a){for(var b=this.array,c=0,d=0,e=a.length;d<e;d++){var f=a[d];void 0===f&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",d),f=new H);b[c++]=f.r;b[c++]=f.g;b[c++]=f.b}return this},copyIndicesArray:function(a){for(var b=this.array,c=0,d=0,e=a.length;d<e;d++){var f=a[d];b[c++]=f.a;b[c++]=f.b;b[c++]=f.c}return this},copyVector2sArray:function(a){for(var b=this.array,c=0,d=0,e=a.length;d<e;d++){var f=
	      a[d];void 0===f&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",d),f=new C);b[c++]=f.x;b[c++]=f.y}return this},copyVector3sArray:function(a){for(var b=this.array,c=0,d=0,e=a.length;d<e;d++){var f=a[d];void 0===f&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",d),f=new q);b[c++]=f.x;b[c++]=f.y;b[c++]=f.z}return this},copyVector4sArray:function(a){for(var b=this.array,c=0,d=0,e=a.length;d<e;d++){var f=a[d];void 0===f&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",
	      d),f=new da);b[c++]=f.x;b[c++]=f.y;b[c++]=f.z;b[c++]=f.w}return this},set:function(a,b){void 0===b&&(b=0);this.array.set(a,b);return this},getX:function(a){return this.array[a*this.itemSize]},setX:function(a,b){this.array[a*this.itemSize]=b;return this},getY:function(a){return this.array[a*this.itemSize+1]},setY:function(a,b){this.array[a*this.itemSize+1]=b;return this},getZ:function(a){return this.array[a*this.itemSize+2]},setZ:function(a,b){this.array[a*this.itemSize+2]=b;return this},getW:function(a){return this.array[a*
	    this.itemSize+3]},setW:function(a,b){this.array[a*this.itemSize+3]=b;return this},setXY:function(a,b,c){a*=this.itemSize;this.array[a+0]=b;this.array[a+1]=c;return this},setXYZ:function(a,b,c,d){a*=this.itemSize;this.array[a+0]=b;this.array[a+1]=c;this.array[a+2]=d;return this},setXYZW:function(a,b,c,d,e){a*=this.itemSize;this.array[a+0]=b;this.array[a+1]=c;this.array[a+2]=d;this.array[a+3]=e;return this},clone:function(){return(new this.constructor).copy(this)}};Object.assign(R.prototype,pa.prototype,
	    {isGeometry:!0,applyMatrix:function(a){for(var b=(new ya).getNormalMatrix(a),c=0,d=this.vertices.length;c<d;c++)this.vertices[c].applyMatrix4(a);c=0;for(d=this.faces.length;c<d;c++){a=this.faces[c];a.normal.applyMatrix3(b).normalize();for(var e=0,f=a.vertexNormals.length;e<f;e++)a.vertexNormals[e].applyMatrix3(b).normalize()}null!==this.boundingBox&&this.computeBoundingBox();null!==this.boundingSphere&&this.computeBoundingSphere();this.normalsNeedUpdate=this.verticesNeedUpdate=!0;return this},rotateX:function(){var a;
	      return function(b){void 0===a&&(a=new P);a.makeRotationX(b);this.applyMatrix(a);return this}}(),rotateY:function(){var a;return function(b){void 0===a&&(a=new P);a.makeRotationY(b);this.applyMatrix(a);return this}}(),rotateZ:function(){var a;return function(b){void 0===a&&(a=new P);a.makeRotationZ(b);this.applyMatrix(a);return this}}(),translate:function(){var a;return function(b,c,d){void 0===a&&(a=new P);a.makeTranslation(b,c,d);this.applyMatrix(a);return this}}(),scale:function(){var a;return function(b,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,d){void 0===a&&(a=new P);a.makeScale(b,c,d);this.applyMatrix(a);return this}}(),lookAt:function(){var a;return function(b){void 0===a&&(a=new D);a.lookAt(b);a.updateMatrix();this.applyMatrix(a.matrix)}}(),fromBufferGeometry:function(a){function b(a,b,d,e){var f=void 0!==g?[u[a].clone(),u[b].clone(),u[d].clone()]:[],r=void 0!==k?[c.colors[a].clone(),c.colors[b].clone(),c.colors[d].clone()]:[];e=new ga(a,b,d,f,r,e);c.faces.push(e);void 0!==l&&c.faceVertexUvs[0].push([p[a].clone(),p[b].clone(),p[d].clone()]);
	      void 0!==h&&c.faceVertexUvs[1].push([n[a].clone(),n[b].clone(),n[d].clone()])}var c=this,d=null!==a.index?a.index.array:void 0,e=a.attributes,f=e.position.array,g=void 0!==e.normal?e.normal.array:void 0,k=void 0!==e.color?e.color.array:void 0,l=void 0!==e.uv?e.uv.array:void 0,h=void 0!==e.uv2?e.uv2.array:void 0;void 0!==h&&(this.faceVertexUvs[1]=[]);for(var u=[],p=[],n=[],r=e=0;e<f.length;e+=3,r+=2)c.vertices.push(new q(f[e],f[e+1],f[e+2])),void 0!==g&&u.push(new q(g[e],g[e+1],g[e+2])),void 0!==k&&
	    c.colors.push(new H(k[e],k[e+1],k[e+2])),void 0!==l&&p.push(new C(l[r],l[r+1])),void 0!==h&&n.push(new C(h[r],h[r+1]));if(void 0!==d)if(f=a.groups,0<f.length)for(e=0;e<f.length;e++)for(var t=f[e],v=t.start,A=t.count,r=v,v=v+A;r<v;r+=3)b(d[r],d[r+1],d[r+2],t.materialIndex);else for(e=0;e<d.length;e+=3)b(d[e],d[e+1],d[e+2]);else for(e=0;e<f.length/3;e+=3)b(e,e+1,e+2);this.computeFaceNormals();null!==a.boundingBox&&(this.boundingBox=a.boundingBox.clone());null!==a.boundingSphere&&(this.boundingSphere=
	      a.boundingSphere.clone());return this},center:function(){this.computeBoundingBox();var a=this.boundingBox.getCenter().negate();this.translate(a.x,a.y,a.z);return a},normalize:function(){this.computeBoundingSphere();var a=this.boundingSphere.center,b=this.boundingSphere.radius,b=0===b?1:1/b,c=new P;c.set(b,0,0,-b*a.x,0,b,0,-b*a.y,0,0,b,-b*a.z,0,0,0,1);this.applyMatrix(c);return this},computeFaceNormals:function(){for(var a=new q,b=new q,c=0,d=this.faces.length;c<d;c++){var e=this.faces[c],f=this.vertices[e.a],
	      g=this.vertices[e.b];a.subVectors(this.vertices[e.c],g);b.subVectors(f,g);a.cross(b);a.normalize();e.normal.copy(a)}},computeVertexNormals:function(a){void 0===a&&(a=!0);var b,c,d;d=Array(this.vertices.length);b=0;for(c=this.vertices.length;b<c;b++)d[b]=new q;if(a){var e,f,g,k=new q,l=new q;a=0;for(b=this.faces.length;a<b;a++)c=this.faces[a],e=this.vertices[c.a],f=this.vertices[c.b],g=this.vertices[c.c],k.subVectors(g,f),l.subVectors(e,f),k.cross(l),d[c.a].add(k),d[c.b].add(k),d[c.c].add(k)}else for(a=
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 0,b=this.faces.length;a<b;a++)c=this.faces[a],d[c.a].add(c.normal),d[c.b].add(c.normal),d[c.c].add(c.normal);b=0;for(c=this.vertices.length;b<c;b++)d[b].normalize();a=0;for(b=this.faces.length;a<b;a++)c=this.faces[a],e=c.vertexNormals,3===e.length?(e[0].copy(d[c.a]),e[1].copy(d[c.b]),e[2].copy(d[c.c])):(e[0]=d[c.a].clone(),e[1]=d[c.b].clone(),e[2]=d[c.c].clone());0<this.faces.length&&(this.normalsNeedUpdate=!0)},computeMorphNormals:function(){var a,b,c,d,e;c=0;for(d=this.faces.length;c<d;c++)for(e=
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        this.faces[c],e.__originalFaceNormal?e.__originalFaceNormal.copy(e.normal):e.__originalFaceNormal=e.normal.clone(),e.__originalVertexNormals||(e.__originalVertexNormals=[]),a=0,b=e.vertexNormals.length;a<b;a++)e.__originalVertexNormals[a]?e.__originalVertexNormals[a].copy(e.vertexNormals[a]):e.__originalVertexNormals[a]=e.vertexNormals[a].clone();var f=new R;f.faces=this.faces;a=0;for(b=this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=
	      [];this.morphNormals[a].vertexNormals=[];e=this.morphNormals[a].faceNormals;var g=this.morphNormals[a].vertexNormals,k,l;c=0;for(d=this.faces.length;c<d;c++)k=new q,l={a:new q,b:new q,c:new q},e.push(k),g.push(l)}g=this.morphNormals[a];f.vertices=this.morphTargets[a].vertices;f.computeFaceNormals();f.computeVertexNormals();c=0;for(d=this.faces.length;c<d;c++)e=this.faces[c],k=g.faceNormals[c],l=g.vertexNormals[c],k.copy(e.normal),l.a.copy(e.vertexNormals[0]),l.b.copy(e.vertexNormals[1]),l.c.copy(e.vertexNormals[2])}c=
	      0;for(d=this.faces.length;c<d;c++)e=this.faces[c],e.normal=e.__originalFaceNormal,e.vertexNormals=e.__originalVertexNormals},computeTangents:function(){console.warn("THREE.Geometry: .computeTangents() has been removed.")},computeLineDistances:function(){for(var a=0,b=this.vertices,c=0,d=b.length;c<d;c++)0<c&&(a+=b[c].distanceTo(b[c-1])),this.lineDistances[c]=a},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new Ha);this.boundingBox.setFromPoints(this.vertices)},computeBoundingSphere:function(){null===
	    this.boundingSphere&&(this.boundingSphere=new Aa);this.boundingSphere.setFromPoints(this.vertices)},merge:function(a,b,c){if(!1===(a&&a.isGeometry))console.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.",a);else{var d,e=this.vertices.length,f=this.vertices,g=a.vertices,k=this.faces,l=a.faces,h=this.faceVertexUvs[0],u=a.faceVertexUvs[0],p=this.colors,n=a.colors;void 0===c&&(c=0);void 0!==b&&(d=(new ya).getNormalMatrix(b));a=0;for(var r=g.length;a<r;a++){var t=g[a].clone();
	      void 0!==b&&t.applyMatrix4(b);f.push(t)}a=0;for(r=n.length;a<r;a++)p.push(n[a].clone());a=0;for(r=l.length;a<r;a++){var g=l[a],q=g.vertexNormals,n=g.vertexColors,p=new ga(g.a+e,g.b+e,g.c+e);p.normal.copy(g.normal);void 0!==d&&p.normal.applyMatrix3(d).normalize();b=0;for(f=q.length;b<f;b++)t=q[b].clone(),void 0!==d&&t.applyMatrix3(d).normalize(),p.vertexNormals.push(t);p.color.copy(g.color);b=0;for(f=n.length;b<f;b++)t=n[b],p.vertexColors.push(t.clone());p.materialIndex=g.materialIndex+c;k.push(p)}a=
	      0;for(r=u.length;a<r;a++)if(c=u[a],d=[],void 0!==c){b=0;for(f=c.length;b<f;b++)d.push(c[b].clone());h.push(d)}}},mergeMesh:function(a){!1===(a&&a.isMesh)?console.error("THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.",a):(a.matrixAutoUpdate&&a.updateMatrix(),this.merge(a.geometry,a.matrix))},mergeVertices:function(){var a={},b=[],c=[],d,e=Math.pow(10,4),f,g;f=0;for(g=this.vertices.length;f<g;f++)d=this.vertices[f],d=Math.round(d.x*e)+"_"+Math.round(d.y*e)+"_"+Math.round(d.z*e),void 0===
	    a[d]?(a[d]=f,b.push(this.vertices[f]),c[f]=b.length-1):c[f]=c[a[d]];a=[];f=0;for(g=this.faces.length;f<g;f++)for(e=this.faces[f],e.a=c[e.a],e.b=c[e.b],e.c=c[e.c],e=[e.a,e.b,e.c],d=0;3>d;d++)if(e[d]===e[(d+1)%3]){a.push(f);break}for(f=a.length-1;0<=f;f--)for(e=a[f],this.faces.splice(e,1),c=0,g=this.faceVertexUvs.length;c<g;c++)this.faceVertexUvs[c].splice(e,1);f=this.vertices.length-b.length;this.vertices=b;return f},sortFacesByMaterialIndex:function(){for(var a=this.faces,b=a.length,c=0;c<b;c++)a[c]._id=
	      c;a.sort(function(a,b){return a.materialIndex-b.materialIndex});var d=this.faceVertexUvs[0],e=this.faceVertexUvs[1],f,g;d&&d.length===b&&(f=[]);e&&e.length===b&&(g=[]);for(c=0;c<b;c++){var k=a[c]._id;f&&f.push(d[k]);g&&g.push(e[k])}f&&(this.faceVertexUvs[0]=f);g&&(this.faceVertexUvs[1]=g)},toJSON:function(){function a(a,b,c){return c?a|1<<b:a&~(1<<b)}function b(a){var b=a.x.toString()+a.y.toString()+a.z.toString();if(void 0!==h[b])return h[b];h[b]=l.length/3;l.push(a.x,a.y,a.z);return h[b]}function c(a){var b=
	      a.r.toString()+a.g.toString()+a.b.toString();if(void 0!==p[b])return p[b];p[b]=u.length;u.push(a.getHex());return p[b]}function d(a){var b=a.x.toString()+a.y.toString();if(void 0!==r[b])return r[b];r[b]=n.length/2;n.push(a.x,a.y);return r[b]}var e={metadata:{version:4.4,type:"Geometry",generator:"Geometry.toJSON"}};e.uuid=this.uuid;e.type=this.type;""!==this.name&&(e.name=this.name);if(void 0!==this.parameters){var f=this.parameters,g;for(g in f)void 0!==f[g]&&(e[g]=f[g]);return e}f=[];for(g=0;g<
	    this.vertices.length;g++){var k=this.vertices[g];f.push(k.x,k.y,k.z)}var k=[],l=[],h={},u=[],p={},n=[],r={};for(g=0;g<this.faces.length;g++){var t=this.faces[g],q=void 0!==this.faceVertexUvs[0][g],A=0<t.normal.length(),w=0<t.vertexNormals.length,x=1!==t.color.r||1!==t.color.g||1!==t.color.b,T=0<t.vertexColors.length,y=0,y=a(y,0,0),y=a(y,1,!0),y=a(y,2,!1),y=a(y,3,q),y=a(y,4,A),y=a(y,5,w),y=a(y,6,x),y=a(y,7,T);k.push(y);k.push(t.a,t.b,t.c);k.push(t.materialIndex);q&&(q=this.faceVertexUvs[0][g],k.push(d(q[0]),
	      d(q[1]),d(q[2])));A&&k.push(b(t.normal));w&&(A=t.vertexNormals,k.push(b(A[0]),b(A[1]),b(A[2])));x&&k.push(c(t.color));T&&(t=t.vertexColors,k.push(c(t[0]),c(t[1]),c(t[2])))}e.data={};e.data.vertices=f;e.data.normals=l;0<u.length&&(e.data.colors=u);0<n.length&&(e.data.uvs=[n]);e.data.faces=k;return e},clone:function(){return(new R).copy(this)},copy:function(a){this.vertices=[];this.faces=[];this.faceVertexUvs=[[]];this.colors=[];for(var b=a.vertices,c=0,d=b.length;c<d;c++)this.vertices.push(b[c].clone());
	      b=a.colors;c=0;for(d=b.length;c<d;c++)this.colors.push(b[c].clone());b=a.faces;c=0;for(d=b.length;c<d;c++)this.faces.push(b[c].clone());c=0;for(d=a.faceVertexUvs.length;c<d;c++){b=a.faceVertexUvs[c];void 0===this.faceVertexUvs[c]&&(this.faceVertexUvs[c]=[]);for(var e=0,f=b.length;e<f;e++){for(var g=b[e],k=[],l=0,h=g.length;l<h;l++)k.push(g[l].clone());this.faceVertexUvs[c].push(k)}}return this},dispose:function(){this.dispatchEvent({type:"dispose"})}});var Lc=0;Object.assign(de.prototype,pa.prototype,
	    {computeBoundingBox:R.prototype.computeBoundingBox,computeBoundingSphere:R.prototype.computeBoundingSphere,computeFaceNormals:function(){console.warn("THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.")},computeVertexNormals:function(){console.warn("THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.")},computeGroups:function(a){var b,c=[],d;a=a.faces;for(var e=0;e<a.length;e++){var f=a[e];f.materialIndex!==d&&(d=f.materialIndex,
	    void 0!==b&&(b.count=3*e-b.start,c.push(b)),b={start:3*e,materialIndex:d})}void 0!==b&&(b.count=3*e-b.start,c.push(b));this.groups=c},fromGeometry:function(a){var b=a.faces,c=a.vertices,d=a.faceVertexUvs,e=d[0]&&0<d[0].length,f=d[1]&&0<d[1].length,g=a.morphTargets,k=g.length,l;if(0<k){l=[];for(var h=0;h<k;h++)l[h]=[];this.morphTargets.position=l}var u=a.morphNormals,p=u.length,n;if(0<p){n=[];for(h=0;h<p;h++)n[h]=[];this.morphTargets.normal=n}for(var r=a.skinIndices,t=a.skinWeights,q=r.length===c.length,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                        A=t.length===c.length,h=0;h<b.length;h++){var w=b[h];this.vertices.push(c[w.a],c[w.b],c[w.c]);var x=w.vertexNormals;3===x.length?this.normals.push(x[0],x[1],x[2]):(x=w.normal,this.normals.push(x,x,x));x=w.vertexColors;3===x.length?this.colors.push(x[0],x[1],x[2]):(x=w.color,this.colors.push(x,x,x));!0===e&&(x=d[0][h],void 0!==x?this.uvs.push(x[0],x[1],x[2]):(console.warn("THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ",h),this.uvs.push(new C,new C,new C)));!0===f&&(x=d[1][h],void 0!==x?
	      this.uvs2.push(x[0],x[1],x[2]):(console.warn("THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ",h),this.uvs2.push(new C,new C,new C)));for(x=0;x<k;x++){var T=g[x].vertices;l[x].push(T[w.a],T[w.b],T[w.c])}for(x=0;x<p;x++)T=u[x].vertexNormals[h],n[x].push(T.a,T.b,T.c);q&&this.skinIndices.push(r[w.a],r[w.b],r[w.c]);A&&this.skinWeights.push(t[w.a],t[w.b],t[w.c])}this.computeGroups(a);this.verticesNeedUpdate=a.verticesNeedUpdate;this.normalsNeedUpdate=a.normalsNeedUpdate;this.colorsNeedUpdate=
	      a.colorsNeedUpdate;this.uvsNeedUpdate=a.uvsNeedUpdate;this.groupsNeedUpdate=a.groupsNeedUpdate;return this},dispose:function(){this.dispatchEvent({type:"dispose"})}});Object.assign(I.prototype,pa.prototype,{isBufferGeometry:!0,getIndex:function(){return this.index},setIndex:function(a){this.index=a},addAttribute:function(a,b,c){if(!1===(b&&b.isBufferAttribute)&&!1===(b&&b.isInterleavedBufferAttribute))console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.addAttribute(a,
	    new z(b,c));else if("index"===a)console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."),this.setIndex(b);else return this.attributes[a]=b,this},getAttribute:function(a){return this.attributes[a]},removeAttribute:function(a){delete this.attributes[a];return this},addGroup:function(a,b,c){this.groups.push({start:a,count:b,materialIndex:void 0!==c?c:0})},clearGroups:function(){this.groups=[]},setDrawRange:function(a,b){this.drawRange.start=a;this.drawRange.count=b},applyMatrix:function(a){var b=
	    this.attributes.position;void 0!==b&&(a.applyToVector3Array(b.array),b.needsUpdate=!0);b=this.attributes.normal;void 0!==b&&((new ya).getNormalMatrix(a).applyToVector3Array(b.array),b.needsUpdate=!0);null!==this.boundingBox&&this.computeBoundingBox();null!==this.boundingSphere&&this.computeBoundingSphere();return this},rotateX:function(){var a;return function(b){void 0===a&&(a=new P);a.makeRotationX(b);this.applyMatrix(a);return this}}(),rotateY:function(){var a;return function(b){void 0===a&&(a=
	    new P);a.makeRotationY(b);this.applyMatrix(a);return this}}(),rotateZ:function(){var a;return function(b){void 0===a&&(a=new P);a.makeRotationZ(b);this.applyMatrix(a);return this}}(),translate:function(){var a;return function(b,c,d){void 0===a&&(a=new P);a.makeTranslation(b,c,d);this.applyMatrix(a);return this}}(),scale:function(){var a;return function(b,c,d){void 0===a&&(a=new P);a.makeScale(b,c,d);this.applyMatrix(a);return this}}(),lookAt:function(){var a;return function(b){void 0===a&&(a=new D);
	    a.lookAt(b);a.updateMatrix();this.applyMatrix(a.matrix)}}(),center:function(){this.computeBoundingBox();var a=this.boundingBox.getCenter().negate();this.translate(a.x,a.y,a.z);return a},setFromObject:function(a){var b=a.geometry;if(a&&a.isPoints||a&&a.isLine){a=new ma(3*b.vertices.length,3);var c=new ma(3*b.colors.length,3);this.addAttribute("position",a.copyVector3sArray(b.vertices));this.addAttribute("color",c.copyColorsArray(b.colors));b.lineDistances&&b.lineDistances.length===b.vertices.length&&
	  (a=new ma(b.lineDistances.length,1),this.addAttribute("lineDistance",a.copyArray(b.lineDistances)));null!==b.boundingSphere&&(this.boundingSphere=b.boundingSphere.clone());null!==b.boundingBox&&(this.boundingBox=b.boundingBox.clone())}else a&&a.isMesh&&b&&b.isGeometry&&this.fromGeometry(b);return this},updateFromObject:function(a){var b=a.geometry;if(a&&a.isMesh){var c=b.__directGeometry;!0===b.elementsNeedUpdate&&(c=void 0,b.elementsNeedUpdate=!1);if(void 0===c)return this.fromGeometry(b);c.verticesNeedUpdate=
	    b.verticesNeedUpdate;c.normalsNeedUpdate=b.normalsNeedUpdate;c.colorsNeedUpdate=b.colorsNeedUpdate;c.uvsNeedUpdate=b.uvsNeedUpdate;c.groupsNeedUpdate=b.groupsNeedUpdate;b.verticesNeedUpdate=!1;b.normalsNeedUpdate=!1;b.colorsNeedUpdate=!1;b.uvsNeedUpdate=!1;b.groupsNeedUpdate=!1;b=c}!0===b.verticesNeedUpdate&&(c=this.attributes.position,void 0!==c&&(c.copyVector3sArray(b.vertices),c.needsUpdate=!0),b.verticesNeedUpdate=!1);!0===b.normalsNeedUpdate&&(c=this.attributes.normal,void 0!==c&&(c.copyVector3sArray(b.normals),
	    c.needsUpdate=!0),b.normalsNeedUpdate=!1);!0===b.colorsNeedUpdate&&(c=this.attributes.color,void 0!==c&&(c.copyColorsArray(b.colors),c.needsUpdate=!0),b.colorsNeedUpdate=!1);b.uvsNeedUpdate&&(c=this.attributes.uv,void 0!==c&&(c.copyVector2sArray(b.uvs),c.needsUpdate=!0),b.uvsNeedUpdate=!1);b.lineDistancesNeedUpdate&&(c=this.attributes.lineDistance,void 0!==c&&(c.copyArray(b.lineDistances),c.needsUpdate=!0),b.lineDistancesNeedUpdate=!1);b.groupsNeedUpdate&&(b.computeGroups(a.geometry),this.groups=
	    b.groups,b.groupsNeedUpdate=!1);return this},fromGeometry:function(a){a.__directGeometry=(new de).fromGeometry(a);return this.fromDirectGeometry(a.__directGeometry)},fromDirectGeometry:function(a){var b=new Float32Array(3*a.vertices.length);this.addAttribute("position",(new z(b,3)).copyVector3sArray(a.vertices));0<a.normals.length&&(b=new Float32Array(3*a.normals.length),this.addAttribute("normal",(new z(b,3)).copyVector3sArray(a.normals)));0<a.colors.length&&(b=new Float32Array(3*a.colors.length),
	    this.addAttribute("color",(new z(b,3)).copyColorsArray(a.colors)));0<a.uvs.length&&(b=new Float32Array(2*a.uvs.length),this.addAttribute("uv",(new z(b,2)).copyVector2sArray(a.uvs)));0<a.uvs2.length&&(b=new Float32Array(2*a.uvs2.length),this.addAttribute("uv2",(new z(b,2)).copyVector2sArray(a.uvs2)));0<a.indices.length&&(b=new (65535<a.vertices.length?Uint32Array:Uint16Array)(3*a.indices.length),this.setIndex((new z(b,1)).copyIndicesArray(a.indices)));this.groups=a.groups;for(var c in a.morphTargets){for(var b=
	    [],d=a.morphTargets[c],e=0,f=d.length;e<f;e++){var g=d[e],k=new ma(3*g.length,3);b.push(k.copyVector3sArray(g))}this.morphAttributes[c]=b}0<a.skinIndices.length&&(c=new ma(4*a.skinIndices.length,4),this.addAttribute("skinIndex",c.copyVector4sArray(a.skinIndices)));0<a.skinWeights.length&&(c=new ma(4*a.skinWeights.length,4),this.addAttribute("skinWeight",c.copyVector4sArray(a.skinWeights)));null!==a.boundingSphere&&(this.boundingSphere=a.boundingSphere.clone());null!==a.boundingBox&&(this.boundingBox=
	    a.boundingBox.clone());return this},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new Ha);var a=this.attributes.position.array;void 0!==a?this.boundingBox.setFromArray(a):this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)},computeBoundingSphere:function(){var a=
	    new Ha,b=new q;return function(){null===this.boundingSphere&&(this.boundingSphere=new Aa);var c=this.attributes.position;if(c){var c=c.array,d=this.boundingSphere.center;a.setFromArray(c);a.getCenter(d);for(var e=0,f=0,g=c.length;f<g;f+=3)b.fromArray(c,f),e=Math.max(e,d.distanceToSquared(b));this.boundingSphere.radius=Math.sqrt(e);isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
	    this)}}}(),computeFaceNormals:function(){},computeVertexNormals:function(){var a=this.index,b=this.attributes,c=this.groups;if(b.position){var d=b.position.array;if(void 0===b.normal)this.addAttribute("normal",new z(new Float32Array(d.length),3));else for(var e=b.normal.array,f=0,g=e.length;f<g;f++)e[f]=0;var e=b.normal.array,k,l,h,u=new q,p=new q,n=new q,r=new q,t=new q;if(a){a=a.array;0===c.length&&this.addGroup(0,a.length);for(var v=0,A=c.length;v<A;++v)for(f=c[v],g=f.start,k=f.count,f=g,g+=k;f<
	  g;f+=3)k=3*a[f+0],l=3*a[f+1],h=3*a[f+2],u.fromArray(d,k),p.fromArray(d,l),n.fromArray(d,h),r.subVectors(n,p),t.subVectors(u,p),r.cross(t),e[k]+=r.x,e[k+1]+=r.y,e[k+2]+=r.z,e[l]+=r.x,e[l+1]+=r.y,e[l+2]+=r.z,e[h]+=r.x,e[h+1]+=r.y,e[h+2]+=r.z}else for(f=0,g=d.length;f<g;f+=9)u.fromArray(d,f),p.fromArray(d,f+3),n.fromArray(d,f+6),r.subVectors(n,p),t.subVectors(u,p),r.cross(t),e[f]=r.x,e[f+1]=r.y,e[f+2]=r.z,e[f+3]=r.x,e[f+4]=r.y,e[f+5]=r.z,e[f+6]=r.x,e[f+7]=r.y,e[f+8]=r.z;this.normalizeNormals();b.normal.needsUpdate=
	    !0}},merge:function(a,b){if(!1===(a&&a.isBufferGeometry))console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",a);else{void 0===b&&(b=0);var c=this.attributes,d;for(d in c)if(void 0!==a.attributes[d])for(var e=c[d].array,f=a.attributes[d],g=f.array,k=0,f=f.itemSize*b;k<g.length;k++,f++)e[f]=g[k];return this}},normalizeNormals:function(){for(var a=this.attributes.normal.array,b,c,d,e=0,f=a.length;e<f;e+=3)b=a[e],c=a[e+1],d=a[e+2],b=1/Math.sqrt(b*b+c*c+d*d),
	    a[e]*=b,a[e+1]*=b,a[e+2]*=b},toNonIndexed:function(){if(null===this.index)return console.warn("THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed."),this;var a=new I,b=this.index.array,c=this.attributes,d;for(d in c){for(var e=c[d],f=e.array,e=e.itemSize,g=new f.constructor(b.length*e),k,l=0,h=0,u=b.length;h<u;h++){k=b[h]*e;for(var p=0;p<e;p++)g[l++]=f[k++]}a.addAttribute(d,new z(g,e))}return a},toJSON:function(){var a={metadata:{version:4.4,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};
	    a.uuid=this.uuid;a.type=this.type;""!==this.name&&(a.name=this.name);if(void 0!==this.parameters){var b=this.parameters,c;for(c in b)void 0!==b[c]&&(a[c]=b[c]);return a}a.data={attributes:{}};var d=this.index;null!==d&&(b=Array.prototype.slice.call(d.array),a.data.index={type:d.array.constructor.name,array:b});d=this.attributes;for(c in d){var e=d[c],b=Array.prototype.slice.call(e.array);a.data.attributes[c]={itemSize:e.itemSize,type:e.array.constructor.name,array:b,normalized:e.normalized}}c=this.groups;
	    0<c.length&&(a.data.groups=JSON.parse(JSON.stringify(c)));c=this.boundingSphere;null!==c&&(a.data.boundingSphere={center:c.center.toArray(),radius:c.radius});return a},clone:function(){return(new I).copy(this)},copy:function(a){var b=a.index;null!==b&&this.setIndex(b.clone());var b=a.attributes,c;for(c in b)this.addAttribute(c,b[c].clone());a=a.groups;c=0;for(b=a.length;c<b;c++){var d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}return this},dispose:function(){this.dispatchEvent({type:"dispose"})}});
	  I.MaxIndex=65535;va.prototype=Object.assign(Object.create(D.prototype),{constructor:va,isMesh:!0,setDrawMode:function(a){this.drawMode=a},copy:function(a){D.prototype.copy.call(this,a);this.drawMode=a.drawMode;return this},updateMorphTargets:function(){var a=this.geometry.morphTargets;if(void 0!==a&&0<a.length){this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var b=0,c=a.length;b<c;b++)this.morphTargetInfluences.push(0),this.morphTargetDictionary[a[b].name]=b}},raycast:function(){function a(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 b,c,d,e,f,g){Fa.barycoordFromPoint(a,b,c,d,v);e.multiplyScalar(v.x);f.multiplyScalar(v.y);g.multiplyScalar(v.z);e.add(f).add(g);return e.clone()}function b(a,b,c,d,e,f,g){var k=a.material;if(null===(1===k.side?c.intersectTriangle(f,e,d,!0,g):c.intersectTriangle(d,e,f,2!==k.side,g)))return null;w.copy(g);w.applyMatrix4(a.matrixWorld);c=b.ray.origin.distanceTo(w);return c<b.near||c>b.far?null:{distance:c,point:w.clone(),object:a}}function c(c,d,e,f,m,p,u,q){g.fromArray(f,3*p);k.fromArray(f,3*u);h.fromArray(f,
	    3*q);if(c=b(c,d,e,g,k,h,A))m&&(n.fromArray(m,2*p),r.fromArray(m,2*u),t.fromArray(m,2*q),c.uv=a(A,g,k,h,n,r,t)),c.face=new ga(p,u,q,Fa.normal(g,k,h)),c.faceIndex=p;return c}var d=new P,e=new Wa,f=new Aa,g=new q,k=new q,h=new q,m=new q,u=new q,p=new q,n=new C,r=new C,t=new C,v=new q,A=new q,w=new q;return function(q,v){var w=this.geometry,F=this.material,G=this.matrixWorld;if(void 0!==F&&(null===w.boundingSphere&&w.computeBoundingSphere(),f.copy(w.boundingSphere),f.applyMatrix4(G),!1!==q.ray.intersectsSphere(f)&&
	    (d.getInverse(G),e.copy(q.ray).applyMatrix4(d),null===w.boundingBox||!1!==e.intersectsBox(w.boundingBox)))){var E,J;if(w&&w.isBufferGeometry){var C,D,F=w.index,G=w.attributes,w=G.position.array;void 0!==G.uv&&(E=G.uv.array);if(null!==F)for(var G=F.array,z=0,I=G.length;z<I;z+=3){if(F=G[z],C=G[z+1],D=G[z+2],J=c(this,q,e,w,E,F,C,D))J.faceIndex=Math.floor(z/3),v.push(J)}else for(z=0,I=w.length;z<I;z+=9)if(F=z/3,C=F+1,D=F+2,J=c(this,q,e,w,E,F,C,D))J.index=F,v.push(J)}else if(w&&w.isGeometry){var H,P,G=
	    F&&F.isMultiMaterial,z=!0===G?F.materials:null,I=w.vertices;C=w.faces;D=w.faceVertexUvs[0];0<D.length&&(E=D);for(var L=0,M=C.length;L<M;L++){var O=C[L];J=!0===G?z[O.materialIndex]:F;if(void 0!==J){D=I[O.a];H=I[O.b];P=I[O.c];if(!0===J.morphTargets){J=w.morphTargets;var Q=this.morphTargetInfluences;g.set(0,0,0);k.set(0,0,0);h.set(0,0,0);for(var S=0,V=J.length;S<V;S++){var W=Q[S];if(0!==W){var K=J[S].vertices;g.addScaledVector(m.subVectors(K[O.a],D),W);k.addScaledVector(u.subVectors(K[O.b],H),W);h.addScaledVector(p.subVectors(K[O.c],
	    P),W)}}g.add(D);k.add(H);h.add(P);D=g;H=k;P=h}if(J=b(this,q,e,D,H,P,A))E&&(Q=E[L],n.copy(Q[0]),r.copy(Q[1]),t.copy(Q[2]),J.uv=a(A,D,H,P,n,r,t)),J.face=O,J.faceIndex=L,v.push(J)}}}}}}(),clone:function(){return(new this.constructor(this.geometry,this.material)).copy(this)}});db.prototype=Object.create(I.prototype);db.prototype.constructor=db;eb.prototype=Object.create(I.prototype);eb.prototype.constructor=eb;qa.prototype=Object.create(D.prototype);qa.prototype.constructor=qa;qa.prototype.isCamera=!0;
	  qa.prototype.getWorldDirection=function(){var a=new ca;return function(b){b=b||new q;this.getWorldQuaternion(a);return b.set(0,0,-1).applyQuaternion(a)}}();qa.prototype.lookAt=function(){var a=new P;return function(b){a.lookAt(this.position,b,this.up);this.quaternion.setFromRotationMatrix(a)}}();qa.prototype.clone=function(){return(new this.constructor).copy(this)};qa.prototype.copy=function(a){D.prototype.copy.call(this,a);this.matrixWorldInverse.copy(a.matrixWorldInverse);this.projectionMatrix.copy(a.projectionMatrix);
	    return this};Ca.prototype=Object.assign(Object.create(qa.prototype),{constructor:Ca,isPerspectiveCamera:!0,copy:function(a){qa.prototype.copy.call(this,a);this.fov=a.fov;this.zoom=a.zoom;this.near=a.near;this.far=a.far;this.focus=a.focus;this.aspect=a.aspect;this.view=null===a.view?null:Object.assign({},a.view);this.filmGauge=a.filmGauge;this.filmOffset=a.filmOffset;return this},setFocalLength:function(a){a=.5*this.getFilmHeight()/a;this.fov=2*h.Math.RAD2DEG*Math.atan(a);this.updateProjectionMatrix()},
	    getFocalLength:function(){var a=Math.tan(.5*h.Math.DEG2RAD*this.fov);return.5*this.getFilmHeight()/a},getEffectiveFOV:function(){return 2*h.Math.RAD2DEG*Math.atan(Math.tan(.5*h.Math.DEG2RAD*this.fov)/this.zoom)},getFilmWidth:function(){return this.filmGauge*Math.min(this.aspect,1)},getFilmHeight:function(){return this.filmGauge/Math.max(this.aspect,1)},setViewOffset:function(a,b,c,d,e,f){this.aspect=a/b;this.view={fullWidth:a,fullHeight:b,offsetX:c,offsetY:d,width:e,height:f};this.updateProjectionMatrix()},
	    clearViewOffset:function(){this.view=null;this.updateProjectionMatrix()},updateProjectionMatrix:function(){var a=this.near,b=a*Math.tan(.5*h.Math.DEG2RAD*this.fov)/this.zoom,c=2*b,d=this.aspect*c,e=-.5*d,f=this.view;if(null!==f)var g=f.fullWidth,k=f.fullHeight,e=e+f.offsetX*d/g,b=b-f.offsetY*c/k,d=f.width/g*d,c=f.height/k*c;f=this.filmOffset;0!==f&&(e+=a*f/this.getFilmWidth());this.projectionMatrix.makeFrustum(e,e+d,b-c,b,a,this.far)},toJSON:function(a){a=D.prototype.toJSON.call(this,a);a.object.fov=
	      this.fov;a.object.zoom=this.zoom;a.object.near=this.near;a.object.far=this.far;a.object.focus=this.focus;a.object.aspect=this.aspect;null!==this.view&&(a.object.view=Object.assign({},this.view));a.object.filmGauge=this.filmGauge;a.object.filmOffset=this.filmOffset;return a}});Db.prototype=Object.assign(Object.create(qa.prototype),{constructor:Db,isOrthographicCamera:!0,copy:function(a){qa.prototype.copy.call(this,a);this.left=a.left;this.right=a.right;this.top=a.top;this.bottom=a.bottom;this.near=
	    a.near;this.far=a.far;this.zoom=a.zoom;this.view=null===a.view?null:Object.assign({},a.view);return this},setViewOffset:function(a,b,c,d,e,f){this.view={fullWidth:a,fullHeight:b,offsetX:c,offsetY:d,width:e,height:f};this.updateProjectionMatrix()},clearViewOffset:function(){this.view=null;this.updateProjectionMatrix()},updateProjectionMatrix:function(){var a=(this.right-this.left)/(2*this.zoom),b=(this.top-this.bottom)/(2*this.zoom),c=(this.right+this.left)/2,d=(this.top+this.bottom)/2,e=c-a,c=c+a,
	    a=d+b,b=d-b;if(null!==this.view)var c=this.zoom/(this.view.width/this.view.fullWidth),b=this.zoom/(this.view.height/this.view.fullHeight),f=(this.right-this.left)/this.view.width,d=(this.top-this.bottom)/this.view.height,e=e+this.view.offsetX/c*f,c=e+this.view.width/c*f,a=a-this.view.offsetY/b*d,b=a-this.view.height/b*d;this.projectionMatrix.makeOrthographic(e,c,a,b,this.near,this.far)},toJSON:function(a){a=D.prototype.toJSON.call(this,a);a.object.zoom=this.zoom;a.object.left=this.left;a.object.right=
	    this.right;a.object.top=this.top;a.object.bottom=this.bottom;a.object.near=this.near;a.object.far=this.far;null!==this.view&&(a.object.view=Object.assign({},this.view));return a}});var bf=0;Eb.prototype.isFogExp2=!0;Eb.prototype.clone=function(){return new Eb(this.color.getHex(),this.density)};Eb.prototype.toJSON=function(a){return{type:"FogExp2",color:this.color.getHex(),density:this.density}};Fb.prototype.isFog=!0;Fb.prototype.clone=function(){return new Fb(this.color.getHex(),this.near,this.far)};
	  Fb.prototype.toJSON=function(a){return{type:"Fog",color:this.color.getHex(),near:this.near,far:this.far}};fb.prototype=Object.create(D.prototype);fb.prototype.constructor=fb;fb.prototype.copy=function(a,b){D.prototype.copy.call(this,a,b);null!==a.background&&(this.background=a.background.clone());null!==a.fog&&(this.fog=a.fog.clone());null!==a.overrideMaterial&&(this.overrideMaterial=a.overrideMaterial.clone());this.autoUpdate=a.autoUpdate;this.matrixAutoUpdate=a.matrixAutoUpdate;return this};fb.prototype.toJSON=
	    function(a){var b=D.prototype.toJSON.call(this,a);null!==this.background&&(b.object.background=this.background.toJSON(a));null!==this.fog&&(b.object.fog=this.fog.toJSON());return b};pd.prototype=Object.assign(Object.create(D.prototype),{constructor:pd,isLensFlare:!0,copy:function(a){D.prototype.copy.call(this,a);this.positionScreen.copy(a.positionScreen);this.customUpdateCallback=a.customUpdateCallback;for(var b=0,c=a.lensFlares.length;b<c;b++)this.lensFlares.push(a.lensFlares[b]);return this},add:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    b,c,d,e,f){void 0===b&&(b=-1);void 0===c&&(c=0);void 0===f&&(f=1);void 0===e&&(e=new H(16777215));void 0===d&&(d=1);c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:0,opacity:f,color:e,blending:d})},updateLensFlares:function(){var a,b=this.lensFlares.length,c,d=2*-this.positionScreen.x,e=2*-this.positionScreen.y;for(a=0;a<b;a++)c=this.lensFlares[a],c.x=this.positionScreen.x+d*c.distance,c.y=this.positionScreen.y+e*c.distance,c.wantedRotation=
	    c.x*Math.PI*.25,c.rotation+=.25*(c.wantedRotation-c.rotation)}});gb.prototype=Object.create(S.prototype);gb.prototype.constructor=gb;gb.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.map=a.map;this.rotation=a.rotation;return this};fc.prototype=Object.assign(Object.create(D.prototype),{constructor:fc,isSprite:!0,raycast:function(){var a=new q;return function(b,c){a.setFromMatrixPosition(this.matrixWorld);var d=b.ray.distanceSqToPoint(a);d>this.scale.x*this.scale.y/
	  4||c.push({distance:Math.sqrt(d),point:this.position,face:null,object:this})}}(),clone:function(){return(new this.constructor(this.material)).copy(this)}});gc.prototype=Object.assign(Object.create(D.prototype),{constructor:gc,copy:function(a){D.prototype.copy.call(this,a,!1);a=a.levels;for(var b=0,c=a.length;b<c;b++){var d=a[b];this.addLevel(d.object.clone(),d.distance)}return this},addLevel:function(a,b){void 0===b&&(b=0);b=Math.abs(b);for(var c=this.levels,d=0;d<c.length&&!(b<c[d].distance);d++);
	    c.splice(d,0,{distance:b,object:a});this.add(a)},getObjectForDistance:function(a){for(var b=this.levels,c=1,d=b.length;c<d&&!(a<b[c].distance);c++);return b[c-1].object},raycast:function(){var a=new q;return function(b,c){a.setFromMatrixPosition(this.matrixWorld);var d=b.ray.origin.distanceTo(a);this.getObjectForDistance(d).raycast(b,c)}}(),update:function(){var a=new q,b=new q;return function(c){var d=this.levels;if(1<d.length){a.setFromMatrixPosition(c.matrixWorld);b.setFromMatrixPosition(this.matrixWorld);
	    c=a.distanceTo(b);d[0].object.visible=!0;for(var e=1,f=d.length;e<f;e++)if(c>=d[e].distance)d[e-1].object.visible=!1,d[e].object.visible=!0;else break;for(;e<f;e++)d[e].object.visible=!1}}}(),toJSON:function(a){a=D.prototype.toJSON.call(this,a);a.object.levels=[];for(var b=this.levels,c=0,d=b.length;c<d;c++){var e=b[c];a.object.levels.push({object:e.object.uuid,distance:e.distance})}return a}});hb.prototype=Object.create(ba.prototype);hb.prototype.constructor=hb;hb.prototype.isDataTexture=!0;Object.assign(Nc.prototype,
	    {calculateInverses:function(){this.boneInverses=[];for(var a=0,b=this.bones.length;a<b;a++){var c=new P;this.bones[a]&&c.getInverse(this.bones[a].matrixWorld);this.boneInverses.push(c)}},pose:function(){for(var a,b=0,c=this.bones.length;b<c;b++)(a=this.bones[b])&&a.matrixWorld.getInverse(this.boneInverses[b]);b=0;for(c=this.bones.length;b<c;b++)if(a=this.bones[b])a.parent&&a.parent.isBone?(a.matrix.getInverse(a.parent.matrixWorld),a.matrix.multiply(a.matrixWorld)):a.matrix.copy(a.matrixWorld),a.matrix.decompose(a.position,
	      a.quaternion,a.scale)},update:function(){var a=new P;return function(){for(var b=0,c=this.bones.length;b<c;b++)a.multiplyMatrices(this.bones[b]?this.bones[b].matrixWorld:this.identityMatrix,this.boneInverses[b]),a.toArray(this.boneMatrices,16*b);this.useVertexTexture&&(this.boneTexture.needsUpdate=!0)}}(),clone:function(){return new Nc(this.bones,this.boneInverses,this.useVertexTexture)}});Oc.prototype=Object.assign(Object.create(D.prototype),{constructor:Oc,isBone:!0,copy:function(a){D.prototype.copy.call(this,
	    a);this.skin=a.skin;return this}});Pc.prototype=Object.assign(Object.create(va.prototype),{constructor:Pc,isSkinnedMesh:!0,bind:function(a,b){this.skeleton=a;void 0===b&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),b=this.matrixWorld);this.bindMatrix.copy(b);this.bindMatrixInverse.getInverse(b)},pose:function(){this.skeleton.pose()},normalizeSkinWeights:function(){if(this.geometry&&this.geometry.isGeometry)for(var a=0;a<this.geometry.skinWeights.length;a++){var b=this.geometry.skinWeights[a],
	    c=1/b.lengthManhattan();Infinity!==c?b.multiplyScalar(c):b.set(1,0,0,0)}else if(this.geometry&&this.geometry.isBufferGeometry)for(var b=new da,d=this.geometry.attributes.skinWeight,a=0;a<d.count;a++)b.x=d.getX(a),b.y=d.getY(a),b.z=d.getZ(a),b.w=d.getW(a),c=1/b.lengthManhattan(),Infinity!==c?b.multiplyScalar(c):b.set(1,0,0,0),d.setXYZW(a,b.x,b.y,b.z,b.w)},updateMatrixWorld:function(a){va.prototype.updateMatrixWorld.call(this,!0);"attached"===this.bindMode?this.bindMatrixInverse.getInverse(this.matrixWorld):
	    "detached"===this.bindMode?this.bindMatrixInverse.getInverse(this.bindMatrix):console.warn("THREE.SkinnedMesh unrecognized bindMode: "+this.bindMode)},clone:function(){return(new this.constructor(this.geometry,this.material,this.skeleton.useVertexTexture)).copy(this)}});na.prototype=Object.create(S.prototype);na.prototype.constructor=na;na.prototype.isLineBasicMaterial=!0;na.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.linewidth=a.linewidth;this.linecap=a.linecap;
	    this.linejoin=a.linejoin;return this};Pa.prototype=Object.assign(Object.create(D.prototype),{constructor:Pa,isLine:!0,raycast:function(){var a=new P,b=new Wa,c=new Aa;return function(d,e){var f=d.linePrecision,f=f*f,g=this.geometry,k=this.matrixWorld;null===g.boundingSphere&&g.computeBoundingSphere();c.copy(g.boundingSphere);c.applyMatrix4(k);if(!1!==d.ray.intersectsSphere(c)){a.getInverse(k);b.copy(d.ray).applyMatrix4(a);var h=new q,m=new q,k=new q,u=new q,p=this&&this.isLineSegments?2:1;if(g&&g.isBufferGeometry){var n=
	    g.index,r=g.attributes.position.array;if(null!==n)for(var n=n.array,g=0,t=n.length-1;g<t;g+=p){var v=n[g+1];h.fromArray(r,3*n[g]);m.fromArray(r,3*v);v=b.distanceSqToSegment(h,m,u,k);v>f||(u.applyMatrix4(this.matrixWorld),v=d.ray.origin.distanceTo(u),v<d.near||v>d.far||e.push({distance:v,point:k.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this}))}else for(g=0,t=r.length/3-1;g<t;g+=p)h.fromArray(r,3*g),m.fromArray(r,3*g+3),v=b.distanceSqToSegment(h,m,u,k),v>f||(u.applyMatrix4(this.matrixWorld),
	    v=d.ray.origin.distanceTo(u),v<d.near||v>d.far||e.push({distance:v,point:k.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this}))}else if(g&&g.isGeometry)for(h=g.vertices,m=h.length,g=0;g<m-1;g+=p)v=b.distanceSqToSegment(h[g],h[g+1],u,k),v>f||(u.applyMatrix4(this.matrixWorld),v=d.ray.origin.distanceTo(u),v<d.near||v>d.far||e.push({distance:v,point:k.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this}))}}}(),clone:function(){return(new this.constructor(this.geometry,
	    this.material)).copy(this)}});ha.prototype=Object.assign(Object.create(Pa.prototype),{constructor:ha,isLineSegments:!0});Ja.prototype=Object.create(S.prototype);Ja.prototype.constructor=Ja;Ja.prototype.isPointsMaterial=!0;Ja.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.map=a.map;this.size=a.size;this.sizeAttenuation=a.sizeAttenuation;return this};Gb.prototype=Object.assign(Object.create(D.prototype),{constructor:Gb,isPoints:!0,raycast:function(){var a=new P,
	    b=new Wa,c=new Aa;return function(d,e){function f(a,c){var f=b.distanceSqToPoint(a);if(f<u){var k=b.closestPointToPoint(a);k.applyMatrix4(h);var n=d.ray.origin.distanceTo(k);n<d.near||n>d.far||e.push({distance:n,distanceToRay:Math.sqrt(f),point:k.clone(),index:c,face:null,object:g})}}var g=this,k=this.geometry,h=this.matrixWorld,m=d.params.Points.threshold;null===k.boundingSphere&&k.computeBoundingSphere();c.copy(k.boundingSphere);c.applyMatrix4(h);if(!1!==d.ray.intersectsSphere(c)){a.getInverse(h);
	    b.copy(d.ray).applyMatrix4(a);var m=m/((this.scale.x+this.scale.y+this.scale.z)/3),u=m*m,m=new q;if(k&&k.isBufferGeometry){var p=k.index,k=k.attributes.position.array;if(null!==p)for(var n=p.array,p=0,r=n.length;p<r;p++){var t=n[p];m.fromArray(k,3*t);f(m,t)}else for(p=0,n=k.length/3;p<n;p++)m.fromArray(k,3*p),f(m,p)}else for(m=k.vertices,p=0,n=m.length;p<n;p++)f(m[p],p)}}}(),clone:function(){return(new this.constructor(this.geometry,this.material)).copy(this)}});hc.prototype=Object.assign(Object.create(D.prototype),
	    {constructor:hc});Qc.prototype=Object.create(ba.prototype);Qc.prototype.constructor=Qc;Hb.prototype=Object.create(ba.prototype);Hb.prototype.constructor=Hb;Hb.prototype.isCompressedTexture=!0;Rc.prototype=Object.create(ba.prototype);Rc.prototype.constructor=Rc;ic.prototype=Object.create(ba.prototype);ic.prototype.constructor=ic;ic.prototype.isDepthTexture=!0;Ib.prototype=Object.create(I.prototype);Ib.prototype.constructor=Ib;jc.prototype=Object.create(R.prototype);jc.prototype.constructor=jc;sa.prototype=
	    Object.create(R.prototype);sa.prototype.constructor=sa;kc.prototype=Object.create(sa.prototype);kc.prototype.constructor=kc;lc.prototype=Object.create(sa.prototype);lc.prototype.constructor=lc;mc.prototype=Object.create(sa.prototype);mc.prototype.constructor=mc;nc.prototype=Object.create(sa.prototype);nc.prototype.constructor=nc;wa.prototype=Object.create(R.prototype);wa.prototype.constructor=wa;wa.NoTaper=function(a){return 1};wa.SinusoidalTaper=function(a){return Math.sin(Math.PI*a)};wa.FrenetFrames=
	    function(a,b,c){var d=new q,e=[],f=[],g=[],k=new q,l=new P;b+=1;var m,u,p;this.tangents=e;this.normals=f;this.binormals=g;for(m=0;m<b;m++)u=m/(b-1),e[m]=a.getTangentAt(u),e[m].normalize();f[0]=new q;g[0]=new q;a=Number.MAX_VALUE;m=Math.abs(e[0].x);u=Math.abs(e[0].y);p=Math.abs(e[0].z);m<=a&&(a=m,d.set(1,0,0));u<=a&&(a=u,d.set(0,1,0));p<=a&&d.set(0,0,1);k.crossVectors(e[0],d).normalize();f[0].crossVectors(e[0],k);g[0].crossVectors(e[0],f[0]);for(m=1;m<b;m++)f[m]=f[m-1].clone(),g[m]=g[m-1].clone(),
	      k.crossVectors(e[m-1],e[m]),k.length()>Number.EPSILON&&(k.normalize(),d=Math.acos(h.Math.clamp(e[m-1].dot(e[m]),-1,1)),f[m].applyMatrix4(l.makeRotationAxis(k,d))),g[m].crossVectors(e[m],f[m]);if(c)for(d=Math.acos(h.Math.clamp(f[0].dot(f[b-1]),-1,1)),d/=b-1,0<e[0].dot(k.crossVectors(f[0],f[b-1]))&&(d=-d),m=1;m<b;m++)f[m].applyMatrix4(l.makeRotationAxis(e[m],d*m)),g[m].crossVectors(e[m],f[m])};Jb.prototype=Object.create(I.prototype);Jb.prototype.constructor=Jb;oc.prototype=Object.create(R.prototype);
	  oc.prototype.constructor=oc;Kb.prototype=Object.create(I.prototype);Kb.prototype.constructor=Kb;pc.prototype=Object.create(R.prototype);pc.prototype.constructor=pc;h.ShapeUtils={area:function(a){for(var b=a.length,c=0,d=b-1,e=0;e<b;d=e++)c+=a[d].x*a[e].y-a[e].x*a[d].y;return.5*c},triangulate:function(){return function(a,b){var c=a.length;if(3>c)return null;var d=[],e=[],f=[],g,k,l;if(0<h.ShapeUtils.area(a))for(k=0;k<c;k++)e[k]=k;else for(k=0;k<c;k++)e[k]=c-1-k;var m=2*c;for(k=c-1;2<c;){if(0>=m--){console.warn("THREE.ShapeUtils: Unable to triangulate polygon! in triangulate()");
	    break}g=k;c<=g&&(g=0);k=g+1;c<=k&&(k=0);l=k+1;c<=l&&(l=0);var q;a:{var p,n,r,t,v,A,w,x;p=a[e[g]].x;n=a[e[g]].y;r=a[e[k]].x;t=a[e[k]].y;v=a[e[l]].x;A=a[e[l]].y;if(Number.EPSILON>(r-p)*(A-n)-(t-n)*(v-p))q=!1;else{var C,y,F,G,E,J,D,z,I,H;C=v-r;y=A-t;F=p-v;G=n-A;E=r-p;J=t-n;for(q=0;q<c;q++)if(w=a[e[q]].x,x=a[e[q]].y,!(w===p&&x===n||w===r&&x===t||w===v&&x===A)&&(D=w-p,z=x-n,I=w-r,H=x-t,w-=v,x-=A,I=C*H-y*I,D=E*z-J*D,z=F*x-G*w,I>=-Number.EPSILON&&z>=-Number.EPSILON&&D>=-Number.EPSILON)){q=!1;break a}q=!0}}if(q){d.push([a[e[g]],
	    a[e[k]],a[e[l]]]);f.push([e[g],e[k],e[l]]);g=k;for(l=k+1;l<c;g++,l++)e[g]=e[l];c--;m=2*c}}return b?f:d}}(),triangulateShape:function(a,b){function c(a){var b=a.length;2<b&&a[b-1].equals(a[0])&&a.pop()}function d(a,b,c){return a.x!==b.x?a.x<b.x?a.x<=c.x&&c.x<=b.x:b.x<=c.x&&c.x<=a.x:a.y<b.y?a.y<=c.y&&c.y<=b.y:b.y<=c.y&&c.y<=a.y}function e(a,b,c,e,f){var g=b.x-a.x,k=b.y-a.y,h=e.x-c.x,l=e.y-c.y,n=a.x-c.x,m=a.y-c.y,p=k*h-g*l,q=k*n-g*m;if(Math.abs(p)>Number.EPSILON){if(0<p){if(0>q||q>p)return[];h=l*n-h*
	    m;if(0>h||h>p)return[]}else{if(0<q||q<p)return[];h=l*n-h*m;if(0<h||h<p)return[]}if(0===h)return!f||0!==q&&q!==p?[a]:[];if(h===p)return!f||0!==q&&q!==p?[b]:[];if(0===q)return[c];if(q===p)return[e];f=h/p;return[{x:a.x+f*g,y:a.y+f*k}]}if(0!==q||l*n!==h*m)return[];k=0===g&&0===k;h=0===h&&0===l;if(k&&h)return a.x!==c.x||a.y!==c.y?[]:[a];if(k)return d(c,e,a)?[a]:[];if(h)return d(a,b,c)?[c]:[];0!==g?(a.x<b.x?(g=a,h=a.x,k=b,a=b.x):(g=b,h=b.x,k=a,a=a.x),c.x<e.x?(b=c,p=c.x,l=e,c=e.x):(b=e,p=e.x,l=c,c=c.x)):
	    (a.y<b.y?(g=a,h=a.y,k=b,a=b.y):(g=b,h=b.y,k=a,a=a.y),c.y<e.y?(b=c,p=c.y,l=e,c=e.y):(b=e,p=e.y,l=c,c=c.y));return h<=p?a<p?[]:a===p?f?[]:[b]:a<=c?[b,k]:[b,l]:h>c?[]:h===c?f?[]:[g]:a<=c?[g,k]:[g,l]}function f(a,b,c,d){var e=b.x-a.x,f=b.y-a.y;b=c.x-a.x;c=c.y-a.y;var g=d.x-a.x;d=d.y-a.y;a=e*c-f*b;e=e*d-f*g;return Math.abs(a)>Number.EPSILON?(b=g*c-d*b,0<a?0<=e&&0<=b:0<=e||0<=b):0<e}c(a);b.forEach(c);var g,k,l,m,q,p={};l=a.concat();g=0;for(k=b.length;g<k;g++)Array.prototype.push.apply(l,b[g]);g=0;for(k=
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          l.length;g<k;g++)q=l[g].x+":"+l[g].y,void 0!==p[q]&&console.warn("THREE.ShapeUtils: Duplicate point",q,g),p[q]=g;g=function(a,b){function c(a,b){var d=k.length-1,e=a-1;0>e&&(e=d);var g=a+1;g>d&&(g=0);d=f(k[a],k[e],k[g],h[b]);if(!d)return!1;d=h.length-1;e=b-1;0>e&&(e=d);g=b+1;g>d&&(g=0);return(d=f(h[b],h[e],h[g],k[a]))?!0:!1}function d(a,b){var c,f;for(c=0;c<k.length;c++)if(f=c+1,f%=k.length,f=e(a,b,k[c],k[f],!0),0<f.length)return!0;return!1}function g(a,c){var d,f,k,h;for(d=0;d<l.length;d++)for(f=
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                b[l[d]],k=0;k<f.length;k++)if(h=k+1,h%=f.length,h=e(a,c,f[k],f[h],!0),0<h.length)return!0;return!1}var k=a.concat(),h,l=[],n,m,p,q,u,C=[],D,z,I,H=0;for(n=b.length;H<n;H++)l.push(H);D=0;for(var L=2*l.length;0<l.length;){L--;if(0>L){console.log("Infinite Loop! Holes left:"+l.length+", Probably Hole outside Shape!");break}for(m=D;m<k.length;m++){p=k[m];n=-1;for(H=0;H<l.length;H++)if(q=l[H],u=p.x+":"+p.y+":"+q,void 0===C[u]){h=b[q];for(z=0;z<h.length;z++)if(q=h[z],c(m,z)&&!d(p,q)&&!g(p,q)){n=z;l.splice(H,
	    1);D=k.slice(0,m+1);q=k.slice(m);z=h.slice(n);I=h.slice(0,n+1);k=D.concat(z).concat(I).concat(q);D=m;break}if(0<=n)break;C[u]=!0}if(0<=n)break}}return k}(a,b);var n=h.ShapeUtils.triangulate(g,!1);g=0;for(k=n.length;g<k;g++)for(m=n[g],l=0;3>l;l++)q=m[l].x+":"+m[l].y,q=p[q],void 0!==q&&(m[l]=q);return n.concat()},isClockWise:function(a){return 0>h.ShapeUtils.area(a)},b2:function(){return function(a,b,c,d){var e=1-a;return e*e*b+2*(1-a)*a*c+a*a*d}}(),b3:function(){return function(a,b,c,d,e){var f=1-
	    a,g=1-a;return f*f*f*b+3*g*g*a*c+3*(1-a)*a*a*d+a*a*a*e}}()};ra.prototype=Object.create(R.prototype);ra.prototype.constructor=ra;ra.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};ra.prototype.addShape=function(a,b){function c(a,b,c){b||console.error("THREE.ExtrudeGeometry: vec does not exist");return b.clone().multiplyScalar(c).add(a)}function d(a,b,c){var d,e,f;e=a.x-b.x;f=a.y-b.y;d=c.x-a.x;var g=c.y-a.y,k=e*e+f*f;if(Math.abs(e*g-f*d)>Number.EPSILON){var h=
	    Math.sqrt(k),l=Math.sqrt(d*d+g*g),k=b.x-f/h;b=b.y+e/h;g=((c.x-g/l-k)*g-(c.y+d/l-b)*d)/(e*g-f*d);d=k+e*g-a.x;e=b+f*g-a.y;f=d*d+e*e;if(2>=f)return new C(d,e);f=Math.sqrt(f/2)}else a=!1,e>Number.EPSILON?d>Number.EPSILON&&(a=!0):e<-Number.EPSILON?d<-Number.EPSILON&&(a=!0):Math.sign(f)===Math.sign(g)&&(a=!0),a?(d=-f,f=Math.sqrt(k)):(d=e,e=f,f=Math.sqrt(k/2));return new C(d/f,e/f)}function e(a,b){var c,d;for(K=a.length;0<=--K;){c=K;d=K-1;0>d&&(d=a.length-1);var e,f=r+2*u;for(e=0;e<f;e++){var g=U*e,k=U*
	    (e+1),h=b+c+g,g=b+d+g,l=b+d+k,k=b+c+k,h=h+N,g=g+N,l=l+N,k=k+N;I.faces.push(new ga(h,g,k,null,null,1));I.faces.push(new ga(g,l,k,null,null,1));h=w.generateSideWallUV(I,h,g,l,k);I.faceVertexUvs[0].push([h[0],h[1],h[3]]);I.faceVertexUvs[0].push([h[1],h[2],h[3]])}}}function f(a,b,c){I.vertices.push(new q(a,b,c))}function g(a,b,c){a+=N;b+=N;c+=N;I.faces.push(new ga(a,b,c,null,null,0));a=w.generateTopUV(I,a,b,c);I.faceVertexUvs[0].push(a)}var k=void 0!==b.amount?b.amount:100,l=void 0!==b.bevelThickness?
	    b.bevelThickness:6,m=void 0!==b.bevelSize?b.bevelSize:l-2,u=void 0!==b.bevelSegments?b.bevelSegments:3,p=void 0!==b.bevelEnabled?b.bevelEnabled:!0,n=void 0!==b.curveSegments?b.curveSegments:12,r=void 0!==b.steps?b.steps:1,t=b.extrudePath,v,A=!1,w=void 0!==b.UVGenerator?b.UVGenerator:ra.WorldUVGenerator,x,D,y,F;t&&(v=t.getSpacedPoints(r),A=!0,p=!1,x=void 0!==b.frames?b.frames:new wa.FrenetFrames(t,r,!1),D=new q,y=new q,F=new q);p||(m=l=u=0);var G,E,z,I=this,N=this.vertices.length,t=a.extractPoints(n),
	    n=t.shape,H=t.holes;if(t=!h.ShapeUtils.isClockWise(n)){n=n.reverse();E=0;for(z=H.length;E<z;E++)G=H[E],h.ShapeUtils.isClockWise(G)&&(H[E]=G.reverse());t=!1}var P=h.ShapeUtils.triangulateShape(n,H),S=n;E=0;for(z=H.length;E<z;E++)G=H[E],n=n.concat(G);var R,L,M,O,Q,U=n.length,V,W=P.length,t=[],K=0;M=S.length;R=M-1;for(L=K+1;K<M;K++,R++,L++)R===M&&(R=0),L===M&&(L=0),t[K]=d(S[K],S[R],S[L]);var Z=[],Y,ba=t.concat();E=0;for(z=H.length;E<z;E++){G=H[E];Y=[];K=0;M=G.length;R=M-1;for(L=K+1;K<M;K++,R++,L++)R===
	  M&&(R=0),L===M&&(L=0),Y[K]=d(G[K],G[R],G[L]);Z.push(Y);ba=ba.concat(Y)}for(R=0;R<u;R++){M=R/u;O=l*Math.cos(M*Math.PI/2);L=m*Math.sin(M*Math.PI/2);K=0;for(M=S.length;K<M;K++)Q=c(S[K],t[K],L),f(Q.x,Q.y,-O);E=0;for(z=H.length;E<z;E++)for(G=H[E],Y=Z[E],K=0,M=G.length;K<M;K++)Q=c(G[K],Y[K],L),f(Q.x,Q.y,-O)}L=m;for(K=0;K<U;K++)Q=p?c(n[K],ba[K],L):n[K],A?(y.copy(x.normals[0]).multiplyScalar(Q.x),D.copy(x.binormals[0]).multiplyScalar(Q.y),F.copy(v[0]).add(y).add(D),f(F.x,F.y,F.z)):f(Q.x,Q.y,0);for(M=1;M<=
	  r;M++)for(K=0;K<U;K++)Q=p?c(n[K],ba[K],L):n[K],A?(y.copy(x.normals[M]).multiplyScalar(Q.x),D.copy(x.binormals[M]).multiplyScalar(Q.y),F.copy(v[M]).add(y).add(D),f(F.x,F.y,F.z)):f(Q.x,Q.y,k/r*M);for(R=u-1;0<=R;R--){M=R/u;O=l*Math.cos(M*Math.PI/2);L=m*Math.sin(M*Math.PI/2);K=0;for(M=S.length;K<M;K++)Q=c(S[K],t[K],L),f(Q.x,Q.y,k+O);E=0;for(z=H.length;E<z;E++)for(G=H[E],Y=Z[E],K=0,M=G.length;K<M;K++)Q=c(G[K],Y[K],L),A?f(Q.x,Q.y+v[r-1].y,v[r-1].x+O):f(Q.x,Q.y,k+O)}(function(){if(p){var a=0*U;for(K=0;K<
	  W;K++)V=P[K],g(V[2]+a,V[1]+a,V[0]+a);a=U*(r+2*u);for(K=0;K<W;K++)V=P[K],g(V[0]+a,V[1]+a,V[2]+a)}else{for(K=0;K<W;K++)V=P[K],g(V[2],V[1],V[0]);for(K=0;K<W;K++)V=P[K],g(V[0]+U*r,V[1]+U*r,V[2]+U*r)}})();(function(){var a=0;e(S,a);a+=S.length;E=0;for(z=H.length;E<z;E++)G=H[E],e(G,a),a+=G.length})()};ra.WorldUVGenerator={generateTopUV:function(a,b,c,d){a=a.vertices;b=a[b];c=a[c];d=a[d];return[new C(b.x,b.y),new C(c.x,c.y),new C(d.x,d.y)]},generateSideWallUV:function(a,b,c,d,e){a=a.vertices;b=a[b];c=a[c];
	    d=a[d];e=a[e];return.01>Math.abs(b.y-c.y)?[new C(b.x,1-b.z),new C(c.x,1-c.z),new C(d.x,1-d.z),new C(e.x,1-e.z)]:[new C(b.y,1-b.z),new C(c.y,1-c.z),new C(d.y,1-d.z),new C(e.y,1-e.z)]}};qc.prototype=Object.create(ra.prototype);qc.prototype.constructor=qc;ib.prototype=Object.create(I.prototype);ib.prototype.constructor=ib;Lb.prototype=Object.create(R.prototype);Lb.prototype.constructor=Lb;Mb.prototype=Object.create(I.prototype);Mb.prototype.constructor=Mb;rc.prototype=Object.create(R.prototype);rc.prototype.constructor=
	    rc;sc.prototype=Object.create(R.prototype);sc.prototype.constructor=sc;Nb.prototype=Object.create(I.prototype);Nb.prototype.constructor=Nb;tc.prototype=Object.create(R.prototype);tc.prototype.constructor=tc;Ya.prototype=Object.create(R.prototype);Ya.prototype.constructor=Ya;Ya.prototype.addShapeList=function(a,b){for(var c=0,d=a.length;c<d;c++)this.addShape(a[c],b);return this};Ya.prototype.addShape=function(a,b){void 0===b&&(b={});var c=b.material,d=void 0===b.UVGenerator?ra.WorldUVGenerator:b.UVGenerator,
	    e,f,g,k=this.vertices.length;e=a.extractPoints(void 0!==b.curveSegments?b.curveSegments:12);var l=e.shape,m=e.holes;if(!h.ShapeUtils.isClockWise(l))for(l=l.reverse(),e=0,f=m.length;e<f;e++)g=m[e],h.ShapeUtils.isClockWise(g)&&(m[e]=g.reverse());var u=h.ShapeUtils.triangulateShape(l,m);e=0;for(f=m.length;e<f;e++)g=m[e],l=l.concat(g);m=l.length;f=u.length;for(e=0;e<m;e++)g=l[e],this.vertices.push(new q(g.x,g.y,0));for(e=0;e<f;e++)m=u[e],l=m[0]+k,g=m[1]+k,m=m[2]+k,this.faces.push(new ga(l,g,m,null,null,
	    c)),this.faceVertexUvs[0].push(d.generateTopUV(this,l,g,m))};Ob.prototype=Object.create(I.prototype);Ob.prototype.constructor=Ob;Za.prototype=Object.create(I.prototype);Za.prototype.constructor=Za;jb.prototype=Object.create(R.prototype);jb.prototype.constructor=jb;uc.prototype=Object.create(jb.prototype);uc.prototype.constructor=uc;vc.prototype=Object.create(I.prototype);vc.prototype.constructor=vc;Pb.prototype=Object.create(I.prototype);Pb.prototype.constructor=Pb;wc.prototype=Object.create(R.prototype);
	  wc.prototype.constructor=wc;kb.prototype=Object.create(R.prototype);kb.prototype.constructor=kb;var ua=Object.freeze({WireframeGeometry:Ib,ParametricGeometry:jc,TetrahedronGeometry:kc,OctahedronGeometry:lc,IcosahedronGeometry:mc,DodecahedronGeometry:nc,PolyhedronGeometry:sa,TubeGeometry:wa,TorusKnotGeometry:oc,TorusKnotBufferGeometry:Jb,TorusGeometry:pc,TorusBufferGeometry:Kb,TextGeometry:qc,SphereBufferGeometry:ib,SphereGeometry:Lb,RingGeometry:rc,RingBufferGeometry:Mb,PlaneBufferGeometry:eb,PlaneGeometry:sc,
	    LatheGeometry:tc,LatheBufferGeometry:Nb,ShapeGeometry:Ya,ExtrudeGeometry:ra,EdgesGeometry:Ob,ConeGeometry:uc,ConeBufferGeometry:vc,CylinderGeometry:jb,CylinderBufferGeometry:Za,CircleBufferGeometry:Pb,CircleGeometry:wc,BoxBufferGeometry:db,BoxGeometry:kb});Qb.prototype=Object.create(Da.prototype);Qb.prototype.constructor=Qb;Qb.prototype.isShadowMaterial=!0;Rb.prototype=Object.create(Da.prototype);Rb.prototype.constructor=Rb;Rb.prototype.isRawShaderMaterial=!0;xc.prototype={constructor:xc,isMultiMaterial:!0,
	    toJSON:function(a){for(var b={metadata:{version:4.2,type:"material",generator:"MaterialExporter"},uuid:this.uuid,type:this.type,materials:[]},c=this.materials,d=0,e=c.length;d<e;d++){var f=c[d].toJSON(a);delete f.metadata;b.materials.push(f)}b.visible=this.visible;return b},clone:function(){for(var a=new this.constructor,b=0;b<this.materials.length;b++)a.materials.push(this.materials[b].clone());a.visible=this.visible;return a}};Ka.prototype=Object.create(S.prototype);Ka.prototype.constructor=Ka;
	  Ka.prototype.isMeshStandardMaterial=!0;Ka.prototype.copy=function(a){S.prototype.copy.call(this,a);this.defines={STANDARD:""};this.color.copy(a.color);this.roughness=a.roughness;this.metalness=a.metalness;this.map=a.map;this.lightMap=a.lightMap;this.lightMapIntensity=a.lightMapIntensity;this.aoMap=a.aoMap;this.aoMapIntensity=a.aoMapIntensity;this.emissive.copy(a.emissive);this.emissiveMap=a.emissiveMap;this.emissiveIntensity=a.emissiveIntensity;this.bumpMap=a.bumpMap;this.bumpScale=a.bumpScale;this.normalMap=
	    a.normalMap;this.normalScale.copy(a.normalScale);this.displacementMap=a.displacementMap;this.displacementScale=a.displacementScale;this.displacementBias=a.displacementBias;this.roughnessMap=a.roughnessMap;this.metalnessMap=a.metalnessMap;this.alphaMap=a.alphaMap;this.envMap=a.envMap;this.envMapIntensity=a.envMapIntensity;this.refractionRatio=a.refractionRatio;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;this.wireframeLinecap=a.wireframeLinecap;this.wireframeLinejoin=a.wireframeLinejoin;
	    this.skinning=a.skinning;this.morphTargets=a.morphTargets;this.morphNormals=a.morphNormals;return this};lb.prototype=Object.create(Ka.prototype);lb.prototype.constructor=lb;lb.prototype.isMeshPhysicalMaterial=!0;lb.prototype.copy=function(a){Ka.prototype.copy.call(this,a);this.defines={PHYSICAL:""};this.reflectivity=a.reflectivity;this.clearCoat=a.clearCoat;this.clearCoatRoughness=a.clearCoatRoughness;return this};$a.prototype=Object.create(S.prototype);$a.prototype.constructor=$a;$a.prototype.isMeshPhongMaterial=
	    !0;$a.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.specular.copy(a.specular);this.shininess=a.shininess;this.map=a.map;this.lightMap=a.lightMap;this.lightMapIntensity=a.lightMapIntensity;this.aoMap=a.aoMap;this.aoMapIntensity=a.aoMapIntensity;this.emissive.copy(a.emissive);this.emissiveMap=a.emissiveMap;this.emissiveIntensity=a.emissiveIntensity;this.bumpMap=a.bumpMap;this.bumpScale=a.bumpScale;this.normalMap=a.normalMap;this.normalScale.copy(a.normalScale);
	    this.displacementMap=a.displacementMap;this.displacementScale=a.displacementScale;this.displacementBias=a.displacementBias;this.specularMap=a.specularMap;this.alphaMap=a.alphaMap;this.envMap=a.envMap;this.combine=a.combine;this.reflectivity=a.reflectivity;this.refractionRatio=a.refractionRatio;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;this.wireframeLinecap=a.wireframeLinecap;this.wireframeLinejoin=a.wireframeLinejoin;this.skinning=a.skinning;this.morphTargets=a.morphTargets;
	    this.morphNormals=a.morphNormals;return this};mb.prototype=Object.create(S.prototype);mb.prototype.constructor=mb;mb.prototype.isMeshNormalMaterial=!0;mb.prototype.copy=function(a){S.prototype.copy.call(this,a);this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;return this};nb.prototype=Object.create(S.prototype);nb.prototype.constructor=nb;nb.prototype.isMeshLambertMaterial=!0;nb.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.map=a.map;
	    this.lightMap=a.lightMap;this.lightMapIntensity=a.lightMapIntensity;this.aoMap=a.aoMap;this.aoMapIntensity=a.aoMapIntensity;this.emissive.copy(a.emissive);this.emissiveMap=a.emissiveMap;this.emissiveIntensity=a.emissiveIntensity;this.specularMap=a.specularMap;this.alphaMap=a.alphaMap;this.envMap=a.envMap;this.combine=a.combine;this.reflectivity=a.reflectivity;this.refractionRatio=a.refractionRatio;this.wireframe=a.wireframe;this.wireframeLinewidth=a.wireframeLinewidth;this.wireframeLinecap=a.wireframeLinecap;
	    this.wireframeLinejoin=a.wireframeLinejoin;this.skinning=a.skinning;this.morphTargets=a.morphTargets;this.morphNormals=a.morphNormals;return this};ob.prototype=Object.create(S.prototype);ob.prototype.constructor=ob;ob.prototype.isLineDashedMaterial=!0;ob.prototype.copy=function(a){S.prototype.copy.call(this,a);this.color.copy(a.color);this.linewidth=a.linewidth;this.scale=a.scale;this.dashSize=a.dashSize;this.gapSize=a.gapSize;return this};var nf=Object.freeze({ShadowMaterial:Qb,SpriteMaterial:gb,
	    RawShaderMaterial:Rb,ShaderMaterial:Da,PointsMaterial:Ja,MultiMaterial:xc,MeshPhysicalMaterial:lb,MeshStandardMaterial:Ka,MeshPhongMaterial:$a,MeshNormalMaterial:mb,MeshLambertMaterial:nb,MeshDepthMaterial:Ua,MeshBasicMaterial:Ia,LineDashedMaterial:ob,LineBasicMaterial:na,Material:S});h.Cache={enabled:!1,files:{},add:function(a,b){!1!==this.enabled&&(this.files[a]=b)},get:function(a){if(!1!==this.enabled)return this.files[a]},remove:function(a){delete this.files[a]},clear:function(){this.files={}}};
	  h.DefaultLoadingManager=new qd;Object.assign(za.prototype,{load:function(a,b,c,d){void 0!==this.path&&(a=this.path+a);var e=this,f=h.Cache.get(a);if(void 0!==f)return e.manager.itemStart(a),setTimeout(function(){b&&b(f);e.manager.itemEnd(a)},0),f;var g=new XMLHttpRequest;g.open("GET",a,!0);g.addEventListener("load",function(c){var f=c.target.response;h.Cache.add(a,f);200===this.status?(b&&b(f),e.manager.itemEnd(a)):0===this.status?(console.warn("THREE.XHRLoader: HTTP Status 0 received."),b&&b(f),
	    e.manager.itemEnd(a)):(d&&d(c),e.manager.itemError(a))},!1);void 0!==c&&g.addEventListener("progress",function(a){c(a)},!1);g.addEventListener("error",function(b){d&&d(b);e.manager.itemError(a)},!1);void 0!==this.responseType&&(g.responseType=this.responseType);void 0!==this.withCredentials&&(g.withCredentials=this.withCredentials);g.overrideMimeType&&g.overrideMimeType("text/plain");g.send(null);e.manager.itemStart(a);return g},setPath:function(a){this.path=a;return this},setResponseType:function(a){this.responseType=
	    a;return this},setWithCredentials:function(a){this.withCredentials=a;return this}});Object.assign(ie.prototype,{load:function(a,b,c,d){function e(e){h.load(a[e],function(a){a=f._parser(a,!0);g[e]={width:a.width,height:a.height,format:a.format,mipmaps:a.mipmaps};m+=1;6===m&&(1===a.mipmapCount&&(k.minFilter=1006),k.format=a.format,k.needsUpdate=!0,b&&b(k))},c,d)}var f=this,g=[],k=new Hb;k.image=g;var h=new za(this.manager);h.setPath(this.path);h.setResponseType("arraybuffer");if(Array.isArray(a))for(var m=
	    0,q=0,p=a.length;q<p;++q)e(q);else h.load(a,function(a){a=f._parser(a,!0);if(a.isCubemap)for(var c=a.mipmaps.length/a.mipmapCount,d=0;d<c;d++){g[d]={mipmaps:[]};for(var e=0;e<a.mipmapCount;e++)g[d].mipmaps.push(a.mipmaps[d*a.mipmapCount+e]),g[d].format=a.format,g[d].width=a.width,g[d].height=a.height}else k.image.width=a.width,k.image.height=a.height,k.mipmaps=a.mipmaps;1===a.mipmapCount&&(k.minFilter=1006);k.format=a.format;k.needsUpdate=!0;b&&b(k)},c,d);return k},setPath:function(a){this.path=a;
	    return this}});Object.assign(rd.prototype,{load:function(a,b,c,d){var e=this,f=new hb,g=new za(this.manager);g.setResponseType("arraybuffer");g.load(a,function(a){if(a=e._parser(a))void 0!==a.image?f.image=a.image:void 0!==a.data&&(f.image.width=a.width,f.image.height=a.height,f.image.data=a.data),f.wrapS=void 0!==a.wrapS?a.wrapS:1001,f.wrapT=void 0!==a.wrapT?a.wrapT:1001,f.magFilter=void 0!==a.magFilter?a.magFilter:1006,f.minFilter=void 0!==a.minFilter?a.minFilter:1008,f.anisotropy=void 0!==a.anisotropy?
	    a.anisotropy:1,void 0!==a.format&&(f.format=a.format),void 0!==a.type&&(f.type=a.type),void 0!==a.mipmaps&&(f.mipmaps=a.mipmaps),1===a.mipmapCount&&(f.minFilter=1006),f.needsUpdate=!0,b&&b(f,a)},c,d);return f}});Object.assign(yc.prototype,{load:function(a,b,c,d){var e=this,f=document.createElementNS("http://www.w3.org/1999/xhtml","img");f.onload=function(){f.onload=null;URL.revokeObjectURL(f.src);b&&b(f);e.manager.itemEnd(a)};if(0===a.indexOf("data:"))f.src=a;else{var g=new za;g.setPath(this.path);
	    g.setResponseType("blob");g.setWithCredentials(this.withCredentials);g.load(a,function(a){f.src=URL.createObjectURL(a)},c,d)}e.manager.itemStart(a);return f},setCrossOrigin:function(a){this.crossOrigin=a;return this},setWithCredentials:function(a){this.withCredentials=a;return this},setPath:function(a){this.path=a;return this}});Object.assign(sd.prototype,{load:function(a,b,c,d){function e(c){g.load(a[c],function(a){f.images[c]=a;k++;6===k&&(f.needsUpdate=!0,b&&b(f))},void 0,d)}var f=new Ta,g=new yc(this.manager);
	    g.setCrossOrigin(this.crossOrigin);g.setPath(this.path);var k=0;for(c=0;c<a.length;++c)e(c);return f},setCrossOrigin:function(a){this.crossOrigin=a;return this},setPath:function(a){this.path=a;return this}});Object.assign(Sc.prototype,{load:function(a,b,c,d){var e=new ba,f=new yc(this.manager);f.setCrossOrigin(this.crossOrigin);f.setWithCredentials(this.withCredentials);f.setPath(this.path);f.load(a,function(c){var d=0<a.search(/\.(jpg|jpeg)$/)||0===a.search(/^data\:image\/jpeg/);e.format=d?1022:
	    1023;e.image=c;e.needsUpdate=!0;void 0!==b&&b(e)},c,d);return e},setCrossOrigin:function(a){this.crossOrigin=a;return this},setWithCredentials:function(a){this.withCredentials=a;return this},setPath:function(a){this.path=a;return this}});oa.prototype=Object.assign(Object.create(D.prototype),{constructor:oa,isLight:!0,copy:function(a){D.prototype.copy.call(this,a);this.color.copy(a.color);this.intensity=a.intensity;return this},toJSON:function(a){a=D.prototype.toJSON.call(this,a);a.object.color=this.color.getHex();
	    a.object.intensity=this.intensity;void 0!==this.groundColor&&(a.object.groundColor=this.groundColor.getHex());void 0!==this.distance&&(a.object.distance=this.distance);void 0!==this.angle&&(a.object.angle=this.angle);void 0!==this.decay&&(a.object.decay=this.decay);void 0!==this.penumbra&&(a.object.penumbra=this.penumbra);void 0!==this.shadow&&(a.object.shadow=this.shadow.toJSON());return a}});Tc.prototype=Object.assign(Object.create(oa.prototype),{constructor:Tc,isHemisphereLight:!0,copy:function(a){oa.prototype.copy.call(this,
	    a);this.groundColor.copy(a.groundColor);return this}});Object.assign(pb.prototype,{copy:function(a){this.camera=a.camera.clone();this.bias=a.bias;this.radius=a.radius;this.mapSize.copy(a.mapSize);return this},clone:function(){return(new this.constructor).copy(this)},toJSON:function(){var a={};0!==this.bias&&(a.bias=this.bias);1!==this.radius&&(a.radius=this.radius);if(512!==this.mapSize.x||512!==this.mapSize.y)a.mapSize=this.mapSize.toArray();a.camera=this.camera.toJSON(!1).object;delete a.camera.matrix;
	    return a}});Uc.prototype=Object.assign(Object.create(pb.prototype),{constructor:Uc,isSpotLightShadow:!0,update:function(a){var b=2*h.Math.RAD2DEG*a.angle,c=this.mapSize.width/this.mapSize.height;a=a.distance||500;var d=this.camera;if(b!==d.fov||c!==d.aspect||a!==d.far)d.fov=b,d.aspect=c,d.far=a,d.updateProjectionMatrix()}});Vc.prototype=Object.assign(Object.create(oa.prototype),{constructor:Vc,isSpotLight:!0,copy:function(a){oa.prototype.copy.call(this,a);this.distance=a.distance;this.angle=a.angle;
	    this.penumbra=a.penumbra;this.decay=a.decay;this.target=a.target.clone();this.shadow=a.shadow.clone();return this}});Wc.prototype=Object.assign(Object.create(oa.prototype),{constructor:Wc,isPointLight:!0,copy:function(a){oa.prototype.copy.call(this,a);this.distance=a.distance;this.decay=a.decay;this.shadow=a.shadow.clone();return this}});Xc.prototype=Object.assign(Object.create(pb.prototype),{constructor:Xc});Yc.prototype=Object.assign(Object.create(oa.prototype),{constructor:Yc,isDirectionalLight:!0,
	    copy:function(a){oa.prototype.copy.call(this,a);this.target=a.target.clone();this.shadow=a.shadow.clone();return this}});Zc.prototype=Object.assign(Object.create(oa.prototype),{constructor:Zc,isAmbientLight:!0});h.AnimationUtils={arraySlice:function(a,b,c){return h.AnimationUtils.isTypedArray(a)?new a.constructor(a.subarray(b,c)):a.slice(b,c)},convertArray:function(a,b,c){return!a||!c&&a.constructor===b?a:"number"===typeof b.BYTES_PER_ELEMENT?new b(a):Array.prototype.slice.call(a)},isTypedArray:function(a){return ArrayBuffer.isView(a)&&
	    !(a instanceof DataView)},getKeyframeOrder:function(a){for(var b=a.length,c=Array(b),d=0;d!==b;++d)c[d]=d;c.sort(function(b,c){return a[b]-a[c]});return c},sortedArray:function(a,b,c){for(var d=a.length,e=new a.constructor(d),f=0,g=0;g!==d;++f)for(var k=c[f]*b,h=0;h!==b;++h)e[g++]=a[k+h];return e},flattenJSON:function(a,b,c,d){for(var e=1,f=a[0];void 0!==f&&void 0===f[d];)f=a[e++];if(void 0!==f){var g=f[d];if(void 0!==g)if(Array.isArray(g)){do g=f[d],void 0!==g&&(b.push(f.time),c.push.apply(c,g)),
	    f=a[e++];while(void 0!==f)}else if(void 0!==g.toArray){do g=f[d],void 0!==g&&(b.push(f.time),g.toArray(c,c.length)),f=a[e++];while(void 0!==f)}else{do g=f[d],void 0!==g&&(b.push(f.time),c.push(g)),f=a[e++];while(void 0!==f)}}}};ja.prototype={constructor:ja,evaluate:function(a){var b=this.parameterPositions,c=this._cachedIndex,d=b[c],e=b[c-1];a:{b:{c:{d:if(!(a<d)){for(var f=c+2;;){if(void 0===d){if(a<e)break d;this._cachedIndex=c=b.length;return this.afterEnd_(c-1,a,e)}if(c===f)break;e=d;d=b[++c];
	    if(a<d)break b}d=b.length;break c}if(a>=e)break a;else{f=b[1];a<f&&(c=2,e=f);for(f=c-2;;){if(void 0===e)return this._cachedIndex=0,this.beforeStart_(0,a,d);if(c===f)break;d=e;e=b[--c-1];if(a>=e)break b}d=c;c=0}}for(;c<d;)e=c+d>>>1,a<b[e]?d=e:c=e+1;d=b[c];e=b[c-1];if(void 0===e)return this._cachedIndex=0,this.beforeStart_(0,a,d);if(void 0===d)return this._cachedIndex=c=b.length,this.afterEnd_(c-1,e,a)}this._cachedIndex=c;this.intervalChanged_(c,e,d)}return this.interpolate_(c,e,a,d)},settings:null,
	    DefaultSettings_:{},getSettings_:function(){return this.settings||this.DefaultSettings_},copySampleValue_:function(a){var b=this.resultBuffer,c=this.sampleValues,d=this.valueSize;a*=d;for(var e=0;e!==d;++e)b[e]=c[a+e];return b},interpolate_:function(a,b,c,d){throw Error("call to abstract method");},intervalChanged_:function(a,b,c){}};Object.assign(ja.prototype,{beforeStart_:ja.prototype.copySampleValue_,afterEnd_:ja.prototype.copySampleValue_});$c.prototype=Object.assign(Object.create(ja.prototype),
	    {constructor:$c,DefaultSettings_:{endingStart:2400,endingEnd:2400},intervalChanged_:function(a,b,c){var d=this.parameterPositions,e=a-2,f=a+1,g=d[e],k=d[f];if(void 0===g)switch(this.getSettings_().endingStart){case 2401:e=a;g=2*b-c;break;case 2402:e=d.length-2;g=b+d[e]-d[e+1];break;default:e=a,g=c}if(void 0===k)switch(this.getSettings_().endingEnd){case 2401:f=a;k=2*c-b;break;case 2402:f=1;k=c+d[1]-d[0];break;default:f=a-1,k=b}a=.5*(c-b);d=this.valueSize;this._weightPrev=a/(b-g);this._weightNext=
	      a/(k-c);this._offsetPrev=e*d;this._offsetNext=f*d},interpolate_:function(a,b,c,d){var e=this.resultBuffer,f=this.sampleValues,g=this.valueSize;a*=g;var k=a-g,h=this._offsetPrev,m=this._offsetNext,q=this._weightPrev,p=this._weightNext,n=(c-b)/(d-b);c=n*n;d=c*n;b=-q*d+2*q*c-q*n;q=(1+q)*d+(-1.5-2*q)*c+(-.5+q)*n+1;n=(-1-p)*d+(1.5+p)*c+.5*n;p=p*d-p*c;for(c=0;c!==g;++c)e[c]=b*f[h+c]+q*f[k+c]+n*f[a+c]+p*f[m+c];return e}});zc.prototype=Object.assign(Object.create(ja.prototype),{constructor:zc,interpolate_:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      b,c,d){var e=this.resultBuffer,f=this.sampleValues,g=this.valueSize;a*=g;var k=a-g;b=(c-b)/(d-b);c=1-b;for(d=0;d!==g;++d)e[d]=f[k+d]*c+f[a+d]*b;return e}});ad.prototype=Object.assign(Object.create(ja.prototype),{constructor:ad,interpolate_:function(a,b,c,d){return this.copySampleValue_(a-1)}});var Sa;Sa={TimeBufferType:Float32Array,ValueBufferType:Float32Array,DefaultInterpolation:2301,InterpolantFactoryMethodDiscrete:function(a){return new ad(this.times,this.values,this.getValueSize(),a)},InterpolantFactoryMethodLinear:function(a){return new zc(this.times,
	    this.values,this.getValueSize(),a)},InterpolantFactoryMethodSmooth:function(a){return new $c(this.times,this.values,this.getValueSize(),a)},setInterpolation:function(a){var b;switch(a){case 2300:b=this.InterpolantFactoryMethodDiscrete;break;case 2301:b=this.InterpolantFactoryMethodLinear;break;case 2302:b=this.InterpolantFactoryMethodSmooth}if(void 0===b){b="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(void 0===this.createInterpolant)if(a!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);
	  else throw Error(b);console.warn(b)}else this.createInterpolant=b},getInterpolation:function(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302}},getValueSize:function(){return this.values.length/this.times.length},shift:function(a){if(0!==a)for(var b=this.times,c=0,d=b.length;c!==d;++c)b[c]+=a;return this},scale:function(a){if(1!==a)for(var b=this.times,c=
	    0,d=b.length;c!==d;++c)b[c]*=a;return this},trim:function(a,b){for(var c=this.times,d=c.length,e=0,f=d-1;e!==d&&c[e]<a;)++e;for(;-1!==f&&c[f]>b;)--f;++f;if(0!==e||f!==d)e>=f&&(f=Math.max(f,1),e=f-1),d=this.getValueSize(),this.times=h.AnimationUtils.arraySlice(c,e,f),this.values=h.AnimationUtils.arraySlice(this.values,e*d,f*d);return this},validate:function(){var a=!0,b=this.getValueSize();0!==b-Math.floor(b)&&(console.error("invalid value size in track",this),a=!1);var c=this.times,b=this.values,
	    d=c.length;0===d&&(console.error("track is empty",this),a=!1);for(var e=null,f=0;f!==d;f++){var g=c[f];if("number"===typeof g&&isNaN(g)){console.error("time is not a valid number",this,f,g);a=!1;break}if(null!==e&&e>g){console.error("out of order keys",this,f,g,e);a=!1;break}e=g}if(void 0!==b&&h.AnimationUtils.isTypedArray(b))for(f=0,c=b.length;f!==c;++f)if(d=b[f],isNaN(d)){console.error("value is not a valid number",this,f,d);a=!1;break}return a},optimize:function(){for(var a=this.times,b=this.values,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c=this.getValueSize(),d=2302===this.getInterpolation(),e=1,f=a.length-1,g=1;g<f;++g){var k=!1,l=a[g];if(l!==a[g+1]&&(1!==g||l!==l[0]))if(d)k=!0;else for(var m=g*c,q=m-c,p=m+c,l=0;l!==c;++l){var n=b[m+l];if(n!==b[q+l]||n!==b[p+l]){k=!0;break}}if(k){if(g!==e)for(a[e]=a[g],k=g*c,m=e*c,l=0;l!==c;++l)b[m+l]=b[k+l];++e}}if(0<f){a[e]=a[f];k=f*c;m=e*c;for(l=0;l!==c;++l)b[m+l]=b[k+l];++e}e!==a.length&&(this.times=h.AnimationUtils.arraySlice(a,0,e),this.values=h.AnimationUtils.arraySlice(b,0,e*c));return this}};
	  Sb.prototype=Object.assign(Object.create(Sa),{constructor:Sb,ValueTypeName:"vector"});bd.prototype=Object.assign(Object.create(ja.prototype),{constructor:bd,interpolate_:function(a,b,c,d){var e=this.resultBuffer,f=this.sampleValues,g=this.valueSize;a*=g;b=(c-b)/(d-b);for(c=a+g;a!==c;a+=4)ca.slerpFlat(e,0,f,a-g,f,a,b);return e}});Ac.prototype=Object.assign(Object.create(Sa),{constructor:Ac,ValueTypeName:"quaternion",DefaultInterpolation:2301,InterpolantFactoryMethodLinear:function(a){return new bd(this.times,
	    this.values,this.getValueSize(),a)},InterpolantFactoryMethodSmooth:void 0});Tb.prototype=Object.assign(Object.create(Sa),{constructor:Tb,ValueTypeName:"number"});cd.prototype=Object.assign(Object.create(Sa),{constructor:cd,ValueTypeName:"string",ValueBufferType:Array,DefaultInterpolation:2300,InterpolantFactoryMethodLinear:void 0,InterpolantFactoryMethodSmooth:void 0});dd.prototype=Object.assign(Object.create(Sa),{constructor:dd,ValueTypeName:"bool",ValueBufferType:Array,DefaultInterpolation:2300,
	    InterpolantFactoryMethodLinear:void 0,InterpolantFactoryMethodSmooth:void 0});ed.prototype=Object.assign(Object.create(Sa),{constructor:ed,ValueTypeName:"color"});rb.prototype=Sa;Sa.constructor=rb;Object.assign(rb,{parse:function(a){if(void 0===a.type)throw Error("track type undefined, can not parse");var b=rb._getTrackTypeForValueTypeName(a.type);if(void 0===a.times){var c=[],d=[];h.AnimationUtils.flattenJSON(a.keys,c,d,"value");a.times=c;a.values=d}return void 0!==b.parse?b.parse(a):new b(a.name,
	    a.times,a.values,a.interpolation)},toJSON:function(a){var b=a.constructor;if(void 0!==b.toJSON)b=b.toJSON(a);else{var b={name:a.name,times:h.AnimationUtils.convertArray(a.times,Array),values:h.AnimationUtils.convertArray(a.values,Array)},c=a.getInterpolation();c!==a.DefaultInterpolation&&(b.interpolation=c)}b.type=a.ValueTypeName;return b},_getTrackTypeForValueTypeName:function(a){switch(a.toLowerCase()){case "scalar":case "double":case "float":case "number":case "integer":return Tb;case "vector":case "vector2":case "vector3":case "vector4":return Sb;
	    case "color":return ed;case "quaternion":return Ac;case "bool":case "boolean":return dd;case "string":return cd}throw Error("Unsupported typeName: "+a);}});ta.prototype={constructor:ta,resetDuration:function(){for(var a=0,b=0,c=this.tracks.length;b!==c;++b)var d=this.tracks[b],a=Math.max(a,d.times[d.times.length-1]);this.duration=a},trim:function(){for(var a=0;a<this.tracks.length;a++)this.tracks[a].trim(0,this.duration);return this},optimize:function(){for(var a=0;a<this.tracks.length;a++)this.tracks[a].optimize();
	    return this}};Object.assign(ta,{parse:function(a){for(var b=[],c=a.tracks,d=1/(a.fps||1),e=0,f=c.length;e!==f;++e)b.push(rb.parse(c[e]).scale(d));return new ta(a.name,a.duration,b)},toJSON:function(a){var b=[],c=a.tracks;a={name:a.name,duration:a.duration,tracks:b};for(var d=0,e=c.length;d!==e;++d)b.push(rb.toJSON(c[d]));return a},CreateFromMorphTargetSequence:function(a,b,c,d){for(var e=b.length,f=[],g=0;g<e;g++){var k=[],l=[];k.push((g+e-1)%e,g,(g+1)%e);l.push(0,1,0);var m=h.AnimationUtils.getKeyframeOrder(k),
	    k=h.AnimationUtils.sortedArray(k,1,m),l=h.AnimationUtils.sortedArray(l,1,m);d||0!==k[0]||(k.push(e),l.push(l[0]));f.push((new Tb(".morphTargetInfluences["+b[g].name+"]",k,l)).scale(1/c))}return new ta(a,-1,f)},findByName:function(a,b){var c=a;Array.isArray(a)||(c=a.geometry&&a.geometry.animations||a.animations);for(var d=0;d<c.length;d++)if(c[d].name===b)return c[d];return null},CreateClipsFromMorphTargetSequences:function(a,b,c){for(var d={},e=/^([\w-]*?)([\d]+)$/,f=0,g=a.length;f<g;f++){var k=a[f],
	    h=k.name.match(e);if(h&&1<h.length){var m=h[1];(h=d[m])||(d[m]=h=[]);h.push(k)}}a=[];for(m in d)a.push(ta.CreateFromMorphTargetSequence(m,d[m],b,c));return a},parseAnimation:function(a,b){if(!a)return console.error("  no animation in JSONLoader data"),null;for(var c=function(a,b,c,d,e){if(0!==c.length){var f=[],g=[];h.AnimationUtils.flattenJSON(c,f,g,d);0!==f.length&&e.push(new a(b,f,g))}},d=[],e=a.name||"default",f=a.length||-1,g=a.fps||30,k=a.hierarchy||[],l=0;l<k.length;l++){var m=k[l].keys;if(m&&
	    0!==m.length)if(m[0].morphTargets){for(var f={},q=0;q<m.length;q++)if(m[q].morphTargets)for(var p=0;p<m[q].morphTargets.length;p++)f[m[q].morphTargets[p]]=-1;for(var n in f){for(var r=[],t=[],p=0;p!==m[q].morphTargets.length;++p){var v=m[q];r.push(v.time);t.push(v.morphTarget===n?1:0)}d.push(new Tb(".morphTargetInfluence["+n+"]",r,t))}f=f.length*(g||1)}else q=".bones["+b[l].name+"]",c(Sb,q+".position",m,"pos",d),c(Ac,q+".quaternion",m,"rot",d),c(Sb,q+".scale",m,"scl",d)}return 0===d.length?null:new ta(e,
	    f,d)}});Object.assign(fd.prototype,{load:function(a,b,c,d){var e=this;(new za(e.manager)).load(a,function(a){b(e.parse(JSON.parse(a)))},c,d)},setTextures:function(a){this.textures=a},parse:function(a){function b(a){void 0===c[a]&&console.warn("THREE.MaterialLoader: Undefined texture",a);return c[a]}var c=this.textures,d=new nf[a.type];void 0!==a.uuid&&(d.uuid=a.uuid);void 0!==a.name&&(d.name=a.name);void 0!==a.color&&d.color.setHex(a.color);void 0!==a.roughness&&(d.roughness=a.roughness);void 0!==
	  a.metalness&&(d.metalness=a.metalness);void 0!==a.emissive&&d.emissive.setHex(a.emissive);void 0!==a.specular&&d.specular.setHex(a.specular);void 0!==a.shininess&&(d.shininess=a.shininess);void 0!==a.uniforms&&(d.uniforms=a.uniforms);void 0!==a.vertexShader&&(d.vertexShader=a.vertexShader);void 0!==a.fragmentShader&&(d.fragmentShader=a.fragmentShader);void 0!==a.vertexColors&&(d.vertexColors=a.vertexColors);void 0!==a.fog&&(d.fog=a.fog);void 0!==a.shading&&(d.shading=a.shading);void 0!==a.blending&&
	  (d.blending=a.blending);void 0!==a.side&&(d.side=a.side);void 0!==a.opacity&&(d.opacity=a.opacity);void 0!==a.transparent&&(d.transparent=a.transparent);void 0!==a.alphaTest&&(d.alphaTest=a.alphaTest);void 0!==a.depthTest&&(d.depthTest=a.depthTest);void 0!==a.depthWrite&&(d.depthWrite=a.depthWrite);void 0!==a.colorWrite&&(d.colorWrite=a.colorWrite);void 0!==a.wireframe&&(d.wireframe=a.wireframe);void 0!==a.wireframeLinewidth&&(d.wireframeLinewidth=a.wireframeLinewidth);void 0!==a.wireframeLinecap&&
	  (d.wireframeLinecap=a.wireframeLinecap);void 0!==a.wireframeLinejoin&&(d.wireframeLinejoin=a.wireframeLinejoin);void 0!==a.skinning&&(d.skinning=a.skinning);void 0!==a.morphTargets&&(d.morphTargets=a.morphTargets);void 0!==a.size&&(d.size=a.size);void 0!==a.sizeAttenuation&&(d.sizeAttenuation=a.sizeAttenuation);void 0!==a.map&&(d.map=b(a.map));void 0!==a.alphaMap&&(d.alphaMap=b(a.alphaMap),d.transparent=!0);void 0!==a.bumpMap&&(d.bumpMap=b(a.bumpMap));void 0!==a.bumpScale&&(d.bumpScale=a.bumpScale);
	    void 0!==a.normalMap&&(d.normalMap=b(a.normalMap));if(void 0!==a.normalScale){var e=a.normalScale;!1===Array.isArray(e)&&(e=[e,e]);d.normalScale=(new C).fromArray(e)}void 0!==a.displacementMap&&(d.displacementMap=b(a.displacementMap));void 0!==a.displacementScale&&(d.displacementScale=a.displacementScale);void 0!==a.displacementBias&&(d.displacementBias=a.displacementBias);void 0!==a.roughnessMap&&(d.roughnessMap=b(a.roughnessMap));void 0!==a.metalnessMap&&(d.metalnessMap=b(a.metalnessMap));void 0!==
	    a.emissiveMap&&(d.emissiveMap=b(a.emissiveMap));void 0!==a.emissiveIntensity&&(d.emissiveIntensity=a.emissiveIntensity);void 0!==a.specularMap&&(d.specularMap=b(a.specularMap));void 0!==a.envMap&&(d.envMap=b(a.envMap));void 0!==a.reflectivity&&(d.reflectivity=a.reflectivity);void 0!==a.lightMap&&(d.lightMap=b(a.lightMap));void 0!==a.lightMapIntensity&&(d.lightMapIntensity=a.lightMapIntensity);void 0!==a.aoMap&&(d.aoMap=b(a.aoMap));void 0!==a.aoMapIntensity&&(d.aoMapIntensity=a.aoMapIntensity);if(void 0!==
	      a.materials)for(var e=0,f=a.materials.length;e<f;e++)d.materials.push(this.parse(a.materials[e]));return d}});Object.assign(td.prototype,{load:function(a,b,c,d){var e=this;(new za(e.manager)).load(a,function(a){b(e.parse(JSON.parse(a)))},c,d)},parse:function(a){var b=new I,c=a.data.index,d={Int8Array:Int8Array,Uint8Array:Uint8Array,Uint8ClampedArray:Uint8ClampedArray,Int16Array:Int16Array,Uint16Array:Uint16Array,Int32Array:Int32Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array};
	    void 0!==c&&(c=new d[c.type](c.array),b.setIndex(new z(c,1)));var e=a.data.attributes,f;for(f in e){var g=e[f],c=new d[g.type](g.array);b.addAttribute(f,new z(c,g.itemSize,g.normalized))}d=a.data.groups||a.data.drawcalls||a.data.offsets;if(void 0!==d)for(f=0,c=d.length;f!==c;++f)e=d[f],b.addGroup(e.start,e.count,e.materialIndex);a=a.data.boundingSphere;void 0!==a&&(d=new q,void 0!==a.center&&d.fromArray(a.center),b.boundingSphere=new Aa(d,a.radius));return b}});sb.prototype={constructor:sb,crossOrigin:void 0,
	    extractUrlBase:function(a){a=a.split("/");if(1===a.length)return"./";a.pop();return a.join("/")+"/"},initMaterials:function(a,b,c){for(var d=[],e=0;e<a.length;++e)d[e]=this.createMaterial(a[e],b,c);return d},createMaterial:function(){var a,b,c;return function(d,e,f){function g(a,c,d,g,l){a=e+a;var m=sb.Handlers.get(a);null!==m?a=m.load(a):(b.setCrossOrigin(f),a=b.load(a));void 0!==c&&(a.repeat.fromArray(c),1!==c[0]&&(a.wrapS=1E3),1!==c[1]&&(a.wrapT=1E3));void 0!==d&&a.offset.fromArray(d);void 0!==
	    g&&("repeat"===g[0]&&(a.wrapS=1E3),"mirror"===g[0]&&(a.wrapS=1002),"repeat"===g[1]&&(a.wrapT=1E3),"mirror"===g[1]&&(a.wrapT=1002));void 0!==l&&(a.anisotropy=l);c=h.Math.generateUUID();k[c]=a;return c}void 0===a&&(a=new H);void 0===b&&(b=new Sc);void 0===c&&(c=new fd);var k={},l={uuid:h.Math.generateUUID(),type:"MeshLambertMaterial"},m;for(m in d){var q=d[m];switch(m){case "DbgColor":case "DbgIndex":case "opticalDensity":case "illumination":break;case "DbgName":l.name=q;break;case "blending":l.blending=
	      qe[q];break;case "colorAmbient":case "mapAmbient":console.warn("THREE.Loader.createMaterial:",m,"is no longer supported.");break;case "colorDiffuse":l.color=a.fromArray(q).getHex();break;case "colorSpecular":l.specular=a.fromArray(q).getHex();break;case "colorEmissive":l.emissive=a.fromArray(q).getHex();break;case "specularCoef":l.shininess=q;break;case "shading":"basic"===q.toLowerCase()&&(l.type="MeshBasicMaterial");"phong"===q.toLowerCase()&&(l.type="MeshPhongMaterial");"standard"===q.toLowerCase()&&
	    (l.type="MeshStandardMaterial");break;case "mapDiffuse":l.map=g(q,d.mapDiffuseRepeat,d.mapDiffuseOffset,d.mapDiffuseWrap,d.mapDiffuseAnisotropy);break;case "mapDiffuseRepeat":case "mapDiffuseOffset":case "mapDiffuseWrap":case "mapDiffuseAnisotropy":break;case "mapEmissive":l.emissiveMap=g(q,d.mapEmissiveRepeat,d.mapEmissiveOffset,d.mapEmissiveWrap,d.mapEmissiveAnisotropy);break;case "mapEmissiveRepeat":case "mapEmissiveOffset":case "mapEmissiveWrap":case "mapEmissiveAnisotropy":break;case "mapLight":l.lightMap=
	      g(q,d.mapLightRepeat,d.mapLightOffset,d.mapLightWrap,d.mapLightAnisotropy);break;case "mapLightRepeat":case "mapLightOffset":case "mapLightWrap":case "mapLightAnisotropy":break;case "mapAO":l.aoMap=g(q,d.mapAORepeat,d.mapAOOffset,d.mapAOWrap,d.mapAOAnisotropy);break;case "mapAORepeat":case "mapAOOffset":case "mapAOWrap":case "mapAOAnisotropy":break;case "mapBump":l.bumpMap=g(q,d.mapBumpRepeat,d.mapBumpOffset,d.mapBumpWrap,d.mapBumpAnisotropy);break;case "mapBumpScale":l.bumpScale=q;break;case "mapBumpRepeat":case "mapBumpOffset":case "mapBumpWrap":case "mapBumpAnisotropy":break;
	      case "mapNormal":l.normalMap=g(q,d.mapNormalRepeat,d.mapNormalOffset,d.mapNormalWrap,d.mapNormalAnisotropy);break;case "mapNormalFactor":l.normalScale=[q,q];break;case "mapNormalRepeat":case "mapNormalOffset":case "mapNormalWrap":case "mapNormalAnisotropy":break;case "mapSpecular":l.specularMap=g(q,d.mapSpecularRepeat,d.mapSpecularOffset,d.mapSpecularWrap,d.mapSpecularAnisotropy);break;case "mapSpecularRepeat":case "mapSpecularOffset":case "mapSpecularWrap":case "mapSpecularAnisotropy":break;case "mapMetalness":l.metalnessMap=
	        g(q,d.mapMetalnessRepeat,d.mapMetalnessOffset,d.mapMetalnessWrap,d.mapMetalnessAnisotropy);break;case "mapMetalnessRepeat":case "mapMetalnessOffset":case "mapMetalnessWrap":case "mapMetalnessAnisotropy":break;case "mapRoughness":l.roughnessMap=g(q,d.mapRoughnessRepeat,d.mapRoughnessOffset,d.mapRoughnessWrap,d.mapRoughnessAnisotropy);break;case "mapRoughnessRepeat":case "mapRoughnessOffset":case "mapRoughnessWrap":case "mapRoughnessAnisotropy":break;case "mapAlpha":l.alphaMap=g(q,d.mapAlphaRepeat,
	        d.mapAlphaOffset,d.mapAlphaWrap,d.mapAlphaAnisotropy);break;case "mapAlphaRepeat":case "mapAlphaOffset":case "mapAlphaWrap":case "mapAlphaAnisotropy":break;case "flipSided":l.side=1;break;case "doubleSided":l.side=2;break;case "transparency":console.warn("THREE.Loader.createMaterial: transparency has been renamed to opacity");l.opacity=q;break;case "depthTest":case "depthWrite":case "colorWrite":case "opacity":case "reflectivity":case "transparent":case "visible":case "wireframe":l[m]=q;break;case "vertexColors":!0===
	      q&&(l.vertexColors=2);"face"===q&&(l.vertexColors=1);break;default:console.error("THREE.Loader.createMaterial: Unsupported",m,q)}}"MeshBasicMaterial"===l.type&&delete l.emissive;"MeshPhongMaterial"!==l.type&&delete l.specular;1>l.opacity&&(l.transparent=!0);c.setTextures(k);return c.parse(l)}}()};sb.Handlers={handlers:[],add:function(a,b){this.handlers.push(a,b)},get:function(a){for(var b=this.handlers,c=0,d=b.length;c<d;c+=2){var e=b[c+1];if(b[c].test(a))return e}return null}};Object.assign(ud.prototype,
	    {load:function(a,b,c,d){var e=this,f=this.texturePath&&"string"===typeof this.texturePath?this.texturePath:sb.prototype.extractUrlBase(a),g=new za(this.manager);g.setWithCredentials(this.withCredentials);g.load(a,function(c){c=JSON.parse(c);var d=c.metadata;if(void 0!==d&&(d=d.type,void 0!==d)){if("object"===d.toLowerCase()){console.error("THREE.JSONLoader: "+a+" should be loaded with THREE.ObjectLoader instead.");return}if("scene"===d.toLowerCase()){console.error("THREE.JSONLoader: "+a+" should be loaded with THREE.SceneLoader instead.");
	      return}}c=e.parse(c,f);b(c.geometry,c.materials)},c,d)},setTexturePath:function(a){this.texturePath=a},parse:function(a,b){var c=new R,d=void 0!==a.scale?1/a.scale:1;(function(b){var d,g,k,h,m,u,p,n,r,t,v,A,w,x=a.faces;u=a.vertices;var z=a.normals,y=a.colors,F=0;if(void 0!==a.uvs){for(d=0;d<a.uvs.length;d++)a.uvs[d].length&&F++;for(d=0;d<F;d++)c.faceVertexUvs[d]=[]}h=0;for(m=u.length;h<m;)d=new q,d.x=u[h++]*b,d.y=u[h++]*b,d.z=u[h++]*b,c.vertices.push(d);h=0;for(m=x.length;h<m;)if(b=x[h++],r=b&1,k=
	        b&2,d=b&8,p=b&16,t=b&32,u=b&64,b&=128,r){r=new ga;r.a=x[h];r.b=x[h+1];r.c=x[h+3];v=new ga;v.a=x[h+1];v.b=x[h+2];v.c=x[h+3];h+=4;k&&(k=x[h++],r.materialIndex=k,v.materialIndex=k);k=c.faces.length;if(d)for(d=0;d<F;d++)for(A=a.uvs[d],c.faceVertexUvs[d][k]=[],c.faceVertexUvs[d][k+1]=[],g=0;4>g;g++)n=x[h++],w=A[2*n],n=A[2*n+1],w=new C(w,n),2!==g&&c.faceVertexUvs[d][k].push(w),0!==g&&c.faceVertexUvs[d][k+1].push(w);p&&(p=3*x[h++],r.normal.set(z[p++],z[p++],z[p]),v.normal.copy(r.normal));if(t)for(d=0;4>
	    d;d++)p=3*x[h++],t=new q(z[p++],z[p++],z[p]),2!==d&&r.vertexNormals.push(t),0!==d&&v.vertexNormals.push(t);u&&(u=x[h++],u=y[u],r.color.setHex(u),v.color.setHex(u));if(b)for(d=0;4>d;d++)u=x[h++],u=y[u],2!==d&&r.vertexColors.push(new H(u)),0!==d&&v.vertexColors.push(new H(u));c.faces.push(r);c.faces.push(v)}else{r=new ga;r.a=x[h++];r.b=x[h++];r.c=x[h++];k&&(k=x[h++],r.materialIndex=k);k=c.faces.length;if(d)for(d=0;d<F;d++)for(A=a.uvs[d],c.faceVertexUvs[d][k]=[],g=0;3>g;g++)n=x[h++],w=A[2*n],n=A[2*n+
	    1],w=new C(w,n),c.faceVertexUvs[d][k].push(w);p&&(p=3*x[h++],r.normal.set(z[p++],z[p++],z[p]));if(t)for(d=0;3>d;d++)p=3*x[h++],t=new q(z[p++],z[p++],z[p]),r.vertexNormals.push(t);u&&(u=x[h++],r.color.setHex(y[u]));if(b)for(d=0;3>d;d++)u=x[h++],r.vertexColors.push(new H(y[u]));c.faces.push(r)}})(d);(function(){var b=void 0!==a.influencesPerVertex?a.influencesPerVertex:2;if(a.skinWeights)for(var d=0,g=a.skinWeights.length;d<g;d+=b)c.skinWeights.push(new da(a.skinWeights[d],1<b?a.skinWeights[d+1]:0,
	      2<b?a.skinWeights[d+2]:0,3<b?a.skinWeights[d+3]:0));if(a.skinIndices)for(d=0,g=a.skinIndices.length;d<g;d+=b)c.skinIndices.push(new da(a.skinIndices[d],1<b?a.skinIndices[d+1]:0,2<b?a.skinIndices[d+2]:0,3<b?a.skinIndices[d+3]:0));c.bones=a.bones;c.bones&&0<c.bones.length&&(c.skinWeights.length!==c.skinIndices.length||c.skinIndices.length!==c.vertices.length)&&console.warn("When skinning, number of vertices ("+c.vertices.length+"), skinIndices ("+c.skinIndices.length+"), and skinWeights ("+c.skinWeights.length+
	      ") should match.")})();(function(b){if(void 0!==a.morphTargets)for(var d=0,g=a.morphTargets.length;d<g;d++){c.morphTargets[d]={};c.morphTargets[d].name=a.morphTargets[d].name;c.morphTargets[d].vertices=[];for(var k=c.morphTargets[d].vertices,h=a.morphTargets[d].vertices,m=0,u=h.length;m<u;m+=3){var p=new q;p.x=h[m]*b;p.y=h[m+1]*b;p.z=h[m+2]*b;k.push(p)}}if(void 0!==a.morphColors&&0<a.morphColors.length)for(console.warn('THREE.JSONLoader: "morphColors" no longer supported. Using them as face colors.'),
	                                                                                                                                                                                                                                                                                                                                                                                                                                  b=c.faces,k=a.morphColors[0].colors,d=0,g=b.length;d<g;d++)b[d].color.fromArray(k,3*d)})(d);(function(){var b=[],d=[];void 0!==a.animation&&d.push(a.animation);void 0!==a.animations&&(a.animations.length?d=d.concat(a.animations):d.push(a.animations));for(var g=0;g<d.length;g++){var k=ta.parseAnimation(d[g],c.bones);k&&b.push(k)}c.morphTargets&&(d=ta.CreateClipsFromMorphTargetSequences(c.morphTargets,10),b=b.concat(d));0<b.length&&(c.animations=b)})();c.computeFaceNormals();c.computeBoundingSphere();
	      if(void 0===a.materials||0===a.materials.length)return{geometry:c};d=sb.prototype.initMaterials(a.materials,b,this.crossOrigin);return{geometry:c,materials:d}}});Object.assign(je.prototype,{load:function(a,b,c,d){""===this.texturePath&&(this.texturePath=a.substring(0,a.lastIndexOf("/")+1));var e=this;(new za(e.manager)).load(a,function(a){e.parse(JSON.parse(a),b)},c,d)},setTexturePath:function(a){this.texturePath=a},setCrossOrigin:function(a){this.crossOrigin=a},parse:function(a,b){var c=this.parseGeometries(a.geometries),
	    d=this.parseImages(a.images,function(){void 0!==b&&b(e)}),d=this.parseTextures(a.textures,d),d=this.parseMaterials(a.materials,d),e=this.parseObject(a.object,c,d);a.animations&&(e.animations=this.parseAnimations(a.animations));void 0!==a.images&&0!==a.images.length||void 0===b||b(e);return e},parseGeometries:function(a){var b={};if(void 0!==a)for(var c=new ud,d=new td,e=0,f=a.length;e<f;e++){var g,k=a[e];switch(k.type){case "PlaneGeometry":case "PlaneBufferGeometry":g=new ua[k.type](k.width,k.height,
	    k.widthSegments,k.heightSegments);break;case "BoxGeometry":case "BoxBufferGeometry":case "CubeGeometry":g=new ua[k.type](k.width,k.height,k.depth,k.widthSegments,k.heightSegments,k.depthSegments);break;case "CircleGeometry":case "CircleBufferGeometry":g=new ua[k.type](k.radius,k.segments,k.thetaStart,k.thetaLength);break;case "CylinderGeometry":case "CylinderBufferGeometry":g=new ua[k.type](k.radiusTop,k.radiusBottom,k.height,k.radialSegments,k.heightSegments,k.openEnded,k.thetaStart,k.thetaLength);
	    break;case "ConeGeometry":case "ConeBufferGeometry":g=new ua[k.type](k.radius,k.height,k.radialSegments,k.heightSegments,k.openEnded,k.thetaStart,k.thetaLength);break;case "SphereGeometry":case "SphereBufferGeometry":g=new ua[k.type](k.radius,k.widthSegments,k.heightSegments,k.phiStart,k.phiLength,k.thetaStart,k.thetaLength);break;case "DodecahedronGeometry":case "IcosahedronGeometry":case "OctahedronGeometry":case "TetrahedronGeometry":g=new ua[k.type](k.radius,k.detail);break;case "RingGeometry":case "RingBufferGeometry":g=
	    new ua[k.type](k.innerRadius,k.outerRadius,k.thetaSegments,k.phiSegments,k.thetaStart,k.thetaLength);break;case "TorusGeometry":case "TorusBufferGeometry":g=new ua[k.type](k.radius,k.tube,k.radialSegments,k.tubularSegments,k.arc);break;case "TorusKnotGeometry":case "TorusKnotBufferGeometry":g=new ua[k.type](k.radius,k.tube,k.tubularSegments,k.radialSegments,k.p,k.q);break;case "LatheGeometry":case "LatheBufferGeometry":g=new ua[k.type](k.points,k.segments,k.phiStart,k.phiLength);break;case "BufferGeometry":g=
	    d.parse(k);break;case "Geometry":g=c.parse(k.data,this.texturePath).geometry;break;default:console.warn('THREE.ObjectLoader: Unsupported geometry type "'+k.type+'"');continue}g.uuid=k.uuid;void 0!==k.name&&(g.name=k.name);b[k.uuid]=g}return b},parseMaterials:function(a,b){var c={};if(void 0!==a){var d=new fd;d.setTextures(b);for(var e=0,f=a.length;e<f;e++){var g=d.parse(a[e]);c[g.uuid]=g}}return c},parseAnimations:function(a){for(var b=[],c=0;c<a.length;c++){var d=ta.parse(a[c]);b.push(d)}return b},
	    parseImages:function(a,b){function c(a){d.manager.itemStart(a);return g.load(a,function(){d.manager.itemEnd(a)},void 0,function(){d.manager.itemError(a)})}var d=this,e={};if(void 0!==a&&0<a.length){var f=new qd(b),g=new yc(f);g.setCrossOrigin(this.crossOrigin);for(var f=0,k=a.length;f<k;f++){var h=a[f],m=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(h.url)?h.url:d.texturePath+h.url;e[h.uuid]=c(m)}}return e},parseTextures:function(a,b){function c(a,b){if("number"===typeof a)return a;console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",
	      a);return b[a]}var d={};if(void 0!==a)for(var e=0,f=a.length;e<f;e++){var g=a[e];void 0===g.image&&console.warn('THREE.ObjectLoader: No "image" specified for',g.uuid);void 0===b[g.image]&&console.warn("THREE.ObjectLoader: Undefined image",g.image);var k=new ba(b[g.image]);k.needsUpdate=!0;k.uuid=g.uuid;void 0!==g.name&&(k.name=g.name);void 0!==g.mapping&&(k.mapping=c(g.mapping,re));void 0!==g.offset&&k.offset.fromArray(g.offset);void 0!==g.repeat&&k.repeat.fromArray(g.repeat);void 0!==g.wrap&&(k.wrapS=
	      c(g.wrap[0],Md),k.wrapT=c(g.wrap[1],Md));void 0!==g.minFilter&&(k.minFilter=c(g.minFilter,Nd));void 0!==g.magFilter&&(k.magFilter=c(g.magFilter,Nd));void 0!==g.anisotropy&&(k.anisotropy=g.anisotropy);void 0!==g.flipY&&(k.flipY=g.flipY);d[g.uuid]=k}return d},parseObject:function(){var a=new P;return function(b,c,d){function e(a){void 0===c[a]&&console.warn("THREE.ObjectLoader: Undefined geometry",a);return c[a]}function f(a){if(void 0!==a)return void 0===d[a]&&console.warn("THREE.ObjectLoader: Undefined material",
	      a),d[a]}var g;switch(b.type){case "Scene":g=new fb;void 0!==b.background&&Number.isInteger(b.background)&&(g.background=new H(b.background));void 0!==b.fog&&("Fog"===b.fog.type?g.fog=new Fb(b.fog.color,b.fog.near,b.fog.far):"FogExp2"===b.fog.type&&(g.fog=new Eb(b.fog.color,b.fog.density)));break;case "PerspectiveCamera":g=new Ca(b.fov,b.aspect,b.near,b.far);void 0!==b.focus&&(g.focus=b.focus);void 0!==b.zoom&&(g.zoom=b.zoom);void 0!==b.filmGauge&&(g.filmGauge=b.filmGauge);void 0!==b.filmOffset&&(g.filmOffset=
	      b.filmOffset);void 0!==b.view&&(g.view=Object.assign({},b.view));break;case "OrthographicCamera":g=new Db(b.left,b.right,b.top,b.bottom,b.near,b.far);break;case "AmbientLight":g=new Zc(b.color,b.intensity);break;case "DirectionalLight":g=new Yc(b.color,b.intensity);break;case "PointLight":g=new Wc(b.color,b.intensity,b.distance,b.decay);break;case "SpotLight":g=new Vc(b.color,b.intensity,b.distance,b.angle,b.penumbra,b.decay);break;case "HemisphereLight":g=new Tc(b.color,b.groundColor,b.intensity);
	      break;case "Mesh":g=e(b.geometry);var k=f(b.material);g=g.bones&&0<g.bones.length?new Pc(g,k):new va(g,k);break;case "LOD":g=new gc;break;case "Line":g=new Pa(e(b.geometry),f(b.material),b.mode);break;case "LineSegments":g=new ha(e(b.geometry),f(b.material));break;case "PointCloud":case "Points":g=new Gb(e(b.geometry),f(b.material));break;case "Sprite":g=new fc(f(b.material));break;case "Group":g=new hc;break;default:g=new D}g.uuid=b.uuid;void 0!==b.name&&(g.name=b.name);void 0!==b.matrix?(a.fromArray(b.matrix),
	      a.decompose(g.position,g.quaternion,g.scale)):(void 0!==b.position&&g.position.fromArray(b.position),void 0!==b.rotation&&g.rotation.fromArray(b.rotation),void 0!==b.quaternion&&g.quaternion.fromArray(b.quaternion),void 0!==b.scale&&g.scale.fromArray(b.scale));void 0!==b.castShadow&&(g.castShadow=b.castShadow);void 0!==b.receiveShadow&&(g.receiveShadow=b.receiveShadow);b.shadow&&(void 0!==b.shadow.bias&&(g.shadow.bias=b.shadow.bias),void 0!==b.shadow.radius&&(g.shadow.radius=b.shadow.radius),void 0!==
	    b.shadow.mapSize&&g.shadow.mapSize.fromArray(b.shadow.mapSize),void 0!==b.shadow.camera&&(g.shadow.camera=this.parseObject(b.shadow.camera)));void 0!==b.visible&&(g.visible=b.visible);void 0!==b.userData&&(g.userData=b.userData);if(void 0!==b.children)for(var h in b.children)g.add(this.parseObject(b.children[h],c,d));if("LOD"===b.type)for(b=b.levels,k=0;k<b.length;k++){var m=b[k];h=g.getObjectByProperty("uuid",m.object);void 0!==h&&g.addLevel(h,m.distance)}return g}}()});Y.prototype={constructor:Y,
	    getPoint:function(a){console.warn("THREE.Curve: Warning, getPoint() not implemented!");return null},getPointAt:function(a){a=this.getUtoTmapping(a);return this.getPoint(a)},getPoints:function(a){a||(a=5);for(var b=[],c=0;c<=a;c++)b.push(this.getPoint(c/a));return b},getSpacedPoints:function(a){a||(a=5);for(var b=[],c=0;c<=a;c++)b.push(this.getPointAt(c/a));return b},getLength:function(){var a=this.getLengths();return a[a.length-1]},getLengths:function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:
	      200);if(this.cacheArcLengths&&this.cacheArcLengths.length===a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var b=[],c,d=this.getPoint(0),e,f=0;b.push(0);for(e=1;e<=a;e++)c=this.getPoint(e/a),f+=c.distanceTo(d),b.push(f),d=c;return this.cacheArcLengths=b},updateArcLengths:function(){this.needsUpdate=!0;this.getLengths()},getUtoTmapping:function(a,b){var c=this.getLengths(),d,e=c.length,f;f=b?b:a*c[e-1];for(var g=0,k=e-1,h;g<=k;)if(d=Math.floor(g+(k-g)/2),h=c[d]-f,0>h)g=d+1;
	    else if(0<h)k=d-1;else{k=d;break}d=k;if(c[d]===f)return d/(e-1);g=c[d];return(d+(f-g)/(c[d+1]-g))/(e-1)},getTangent:function(a){var b=a-1E-4;a+=1E-4;0>b&&(b=0);1<a&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().sub(b).normalize()},getTangentAt:function(a){a=this.getUtoTmapping(a);return this.getTangent(a)}};Y.create=function(a,b){a.prototype=Object.create(Y.prototype);a.prototype.constructor=a;a.prototype.getPoint=b;return a};La.prototype=Object.create(Y.prototype);La.prototype.constructor=
	    La;La.prototype.isLineCurve=!0;La.prototype.getPoint=function(a){if(1===a)return this.v2.clone();var b=this.v2.clone().sub(this.v1);b.multiplyScalar(a).add(this.v1);return b};La.prototype.getPointAt=function(a){return this.getPoint(a)};La.prototype.getTangent=function(a){return this.v2.clone().sub(this.v1).normalize()};Bc.prototype=Object.assign(Object.create(Y.prototype),{constructor:Bc,add:function(a){this.curves.push(a)},closePath:function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-
	  1].getPoint(1);a.equals(b)||this.curves.push(new La(b,a))},getPoint:function(a){var b=a*this.getLength(),c=this.getCurveLengths();for(a=0;a<c.length;){if(c[a]>=b)return b=c[a]-b,a=this.curves[a],c=a.getLength(),a.getPointAt(0===c?0:1-b/c);a++}return null},getLength:function(){var a=this.getCurveLengths();return a[a.length-1]},updateArcLengths:function(){this.needsUpdate=!0;this.cacheLengths=null;this.getLengths()},getCurveLengths:function(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;
	    for(var a=[],b=0,c=0,d=this.curves.length;c<d;c++)b+=this.curves[c].getLength(),a.push(b);return this.cacheLengths=a},getSpacedPoints:function(a){a||(a=40);for(var b=[],c=0;c<=a;c++)b.push(this.getPoint(c/a));this.autoClose&&b.push(b[0]);return b},getPoints:function(a){a=a||12;for(var b=[],c,d=0,e=this.curves;d<e.length;d++)for(var f=e[d],f=f.getPoints(f&&f.isEllipseCurve?2*a:f&&f.isLineCurve?1:f&&f.isSplineCurve?a*f.points.length:a),g=0;g<f.length;g++){var k=f[g];c&&c.equals(k)||(b.push(k),c=k)}this.autoClose&&
	  1<b.length&&!b[b.length-1].equals(b[0])&&b.push(b[0]);return b},createPointsGeometry:function(a){a=this.getPoints(a);return this.createGeometry(a)},createSpacedPointsGeometry:function(a){a=this.getSpacedPoints(a);return this.createGeometry(a)},createGeometry:function(a){for(var b=new R,c=0,d=a.length;c<d;c++){var e=a[c];b.vertices.push(new q(e.x,e.y,e.z||0))}return b}});Ra.prototype=Object.create(Y.prototype);Ra.prototype.constructor=Ra;Ra.prototype.isEllipseCurve=!0;Ra.prototype.getPoint=function(a){for(var b=
	    2*Math.PI,c=this.aEndAngle-this.aStartAngle,d=Math.abs(c)<Number.EPSILON;0>c;)c+=b;for(;c>b;)c-=b;c<Number.EPSILON&&(c=d?0:b);!0!==this.aClockwise||d||(c=c===b?-b:c-b);b=this.aStartAngle+a*c;a=this.aX+this.xRadius*Math.cos(b);var e=this.aY+this.yRadius*Math.sin(b);0!==this.aRotation&&(b=Math.cos(this.aRotation),c=Math.sin(this.aRotation),d=a-this.aX,e-=this.aY,a=d*b-e*c+this.aX,e=d*c+e*b+this.aY);return new C(a,e)};h.CurveUtils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-
	    c)},tangentCubicBezier:function(a,b,c,d,e){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*e},tangentSpline:function(a,b,c,d,e){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,e){a=.5*(c-a);d=.5*(d-b);var f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}};tb.prototype=Object.create(Y.prototype);tb.prototype.constructor=tb;tb.prototype.isSplineCurve=!0;tb.prototype.getPoint=function(a){var b=this.points;a*=b.length-1;var c=Math.floor(a);
	    a-=c;var d=b[0===c?c:c-1],e=b[c],f=b[c>b.length-2?b.length-1:c+1],b=b[c>b.length-3?b.length-1:c+2],c=h.CurveUtils.interpolate;return new C(c(d.x,e.x,f.x,b.x,a),c(d.y,e.y,f.y,b.y,a))};ub.prototype=Object.create(Y.prototype);ub.prototype.constructor=ub;ub.prototype.getPoint=function(a){var b=h.ShapeUtils.b3;return new C(b(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x),b(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y))};ub.prototype.getTangent=function(a){var b=h.CurveUtils.tangentCubicBezier;return(new C(b(a,
	    this.v0.x,this.v1.x,this.v2.x,this.v3.x),b(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y))).normalize()};vb.prototype=Object.create(Y.prototype);vb.prototype.constructor=vb;vb.prototype.getPoint=function(a){var b=h.ShapeUtils.b2;return new C(b(a,this.v0.x,this.v1.x,this.v2.x),b(a,this.v0.y,this.v1.y,this.v2.y))};vb.prototype.getTangent=function(a){var b=h.CurveUtils.tangentQuadraticBezier;return(new C(b(a,this.v0.x,this.v1.x,this.v2.x),b(a,this.v0.y,this.v1.y,this.v2.y))).normalize()};var Od=Object.assign(Object.create(Bc.prototype),
	    {fromPoints:function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)},moveTo:function(a,b){this.currentPoint.set(a,b)},lineTo:function(a,b){var c=new La(this.currentPoint.clone(),new C(a,b));this.curves.push(c);this.currentPoint.set(a,b)},quadraticCurveTo:function(a,b,c,d){a=new vb(this.currentPoint.clone(),new C(a,b),new C(c,d));this.curves.push(a);this.currentPoint.set(c,d)},bezierCurveTo:function(a,b,c,d,e,f){a=new ub(this.currentPoint.clone(),new C(a,b),
	      new C(c,d),new C(e,f));this.curves.push(a);this.currentPoint.set(e,f)},splineThru:function(a){var b=[this.currentPoint.clone()].concat(a),b=new tb(b);this.curves.push(b);this.currentPoint.copy(a[a.length-1])},arc:function(a,b,c,d,e,f){this.absarc(a+this.currentPoint.x,b+this.currentPoint.y,c,d,e,f)},absarc:function(a,b,c,d,e,f){this.absellipse(a,b,c,c,d,e,f)},ellipse:function(a,b,c,d,e,f,g,k){this.absellipse(a+this.currentPoint.x,b+this.currentPoint.y,c,d,e,f,g,k)},absellipse:function(a,b,c,d,e,f,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                g,k){a=new Ra(a,b,c,d,e,f,g,k);0<this.curves.length&&(b=a.getPoint(0),b.equals(this.currentPoint)||this.lineTo(b.x,b.y));this.curves.push(a);a=a.getPoint(1);this.currentPoint.copy(a)}});wb.prototype=Object.assign(Object.create(Od),{constructor:wb,getPointsHoles:function(a){for(var b=[],c=0,d=this.holes.length;c<d;c++)b[c]=this.holes[c].getPoints(a);return b},extractAllPoints:function(a){return{shape:this.getPoints(a),holes:this.getPointsHoles(a)}},extractPoints:function(a){return this.extractAllPoints(a)}});
	  Cc.prototype=Od;Od.constructor=Cc;vd.prototype={moveTo:function(a,b){this.currentPath=new Cc;this.subPaths.push(this.currentPath);this.currentPath.moveTo(a,b)},lineTo:function(a,b){this.currentPath.lineTo(a,b)},quadraticCurveTo:function(a,b,c,d){this.currentPath.quadraticCurveTo(a,b,c,d)},bezierCurveTo:function(a,b,c,d,e,f){this.currentPath.bezierCurveTo(a,b,c,d,e,f)},splineThru:function(a){this.currentPath.splineThru(a)},toShapes:function(a,b){function c(a){for(var b=[],c=0,d=a.length;c<d;c++){var e=
	    a[c],f=new wb;f.curves=e.curves;b.push(f)}return b}function d(a,b){for(var c=b.length,d=!1,e=c-1,f=0;f<c;e=f++){var g=b[e],k=b[f],h=k.x-g.x,l=k.y-g.y;if(Math.abs(l)>Number.EPSILON){if(0>l&&(g=b[f],h=-h,k=b[e],l=-l),!(a.y<g.y||a.y>k.y))if(a.y===g.y){if(a.x===g.x)return!0}else{e=l*(a.x-g.x)-h*(a.y-g.y);if(0===e)return!0;0>e||(d=!d)}}else if(a.y===g.y&&(k.x<=a.x&&a.x<=g.x||g.x<=a.x&&a.x<=k.x))return!0}return d}var e=h.ShapeUtils.isClockWise,f=this.subPaths;if(0===f.length)return[];if(!0===b)return c(f);
	    var g,k,l,m=[];if(1===f.length)return k=f[0],l=new wb,l.curves=k.curves,m.push(l),m;var q=!e(f[0].getPoints()),q=a?!q:q;l=[];var p=[],n=[],r=0,t;p[r]=void 0;n[r]=[];for(var v=0,A=f.length;v<A;v++)k=f[v],t=k.getPoints(),g=e(t),(g=a?!g:g)?(!q&&p[r]&&r++,p[r]={s:new wb,p:t},p[r].s.curves=k.curves,q&&r++,n[r]=[]):n[r].push({h:k,p:t[0]});if(!p[0])return c(f);if(1<p.length){v=!1;k=[];e=0;for(f=p.length;e<f;e++)l[e]=[];e=0;for(f=p.length;e<f;e++)for(g=n[e],q=0;q<g.length;q++){r=g[q];t=!0;for(A=0;A<p.length;A++)d(r.p,
	      p[A].p)&&(e!==A&&k.push({froms:e,tos:A,hole:q}),t?(t=!1,l[A].push(r)):v=!0);t&&l[e].push(r)}0<k.length&&(v||(n=l))}v=0;for(e=p.length;v<e;v++)for(l=p[v].s,m.push(l),k=n[v],f=0,g=k.length;f<g;f++)l.holes.push(k[f].h);return m}};Object.assign(wd.prototype,{isFont:!0,generateShapes:function(a,b,c){void 0===b&&(b=100);void 0===c&&(c=4);var d=this.data;a=String(a).split("");var e=b/d.resolution,f=0;b=[];for(var g=0;g<a.length;g++){var k;k=e;var l=f,m=d.glyphs[a[g]]||d.glyphs["?"];if(m){var q=new vd,p=
	    [],n=h.ShapeUtils.b2,r=h.ShapeUtils.b3,t,v,A,w,x,z,y,C;if(m.o)for(var D=m._cachedOutline||(m._cachedOutline=m.o.split(" ")),E=0,J=D.length;E<J;)switch(D[E++]){case "m":t=D[E++]*k+l;v=D[E++]*k;q.moveTo(t,v);break;case "l":t=D[E++]*k+l;v=D[E++]*k;q.lineTo(t,v);break;case "q":t=D[E++]*k+l;v=D[E++]*k;x=D[E++]*k+l;z=D[E++]*k;q.quadraticCurveTo(x,z,t,v);if(w=p[p.length-1]){A=w.x;w=w.y;for(var H=1;H<=c;H++){var I=H/c;n(I,A,x,t);n(I,w,z,v)}}break;case "b":if(t=D[E++]*k+l,v=D[E++]*k,x=D[E++]*k+l,z=D[E++]*
	      k,y=D[E++]*k+l,C=D[E++]*k,q.bezierCurveTo(x,z,y,C,t,v),w=p[p.length-1])for(A=w.x,w=w.y,H=1;H<=c;H++)I=H/c,r(I,A,x,y,t),r(I,w,z,C,v)}k={offset:m.ha*k,path:q}}else k=void 0;f+=k.offset;b.push(k.path)}c=[];d=0;for(a=b.length;d<a;d++)Array.prototype.push.apply(c,b[d].toShapes());return c}});Object.assign(ke.prototype,{load:function(a,b,c,d){var e=this;(new za(this.manager)).load(a,function(a){var c;try{c=JSON.parse(a)}catch(d){console.warn("THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead."),
	    c=JSON.parse(a.substring(65,a.length-2))}a=e.parse(c);b&&b(a)},c,d)},parse:function(a){return new wd(a)}});var yd;Object.assign(zd.prototype,{load:function(a,b,c,d){var e=new za(this.manager);e.setResponseType("arraybuffer");e.load(a,function(a){xd().decodeAudioData(a,function(a){b(a)})},c,d)}});Object.assign(le.prototype,{update:function(){var a,b,c,d,e,f,g,k=new P,l=new P;return function(m){if(a!==this||b!==m.focus||c!==m.fov||d!==m.aspect*this.aspect||e!==m.near||f!==m.far||g!==m.zoom){a=this;
	    b=m.focus;c=m.fov;d=m.aspect*this.aspect;e=m.near;f=m.far;g=m.zoom;var q=m.projectionMatrix.clone(),p=this.eyeSep/2,n=p*e/b,r=e*Math.tan(h.Math.DEG2RAD*c*.5)/g,t;l.elements[12]=-p;k.elements[12]=p;p=-r*d+n;t=r*d+n;q.elements[0]=2*e/(t-p);q.elements[8]=(t+p)/(t-p);this.cameraL.projectionMatrix.copy(q);p=-r*d-n;t=r*d-n;q.elements[0]=2*e/(t-p);q.elements[8]=(t+p)/(t-p);this.cameraR.projectionMatrix.copy(q)}this.cameraL.matrixWorld.copy(m.matrixWorld).multiply(l);this.cameraR.matrixWorld.copy(m.matrixWorld).multiply(k)}}()});
	  gd.prototype=Object.create(D.prototype);gd.prototype.constructor=gd;Ad.prototype=Object.assign(Object.create(D.prototype),{constructor:Ad,getInput:function(){return this.gain},removeFilter:function(){null!==this.filter&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null)},getFilter:function(){return this.filter},setFilter:function(a){null!==this.filter?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):
	    this.gain.disconnect(this.context.destination);this.filter=a;this.gain.connect(this.filter);this.filter.connect(this.context.destination)},getMasterVolume:function(){return this.gain.gain.value},setMasterVolume:function(a){this.gain.gain.value=a},updateMatrixWorld:function(){var a=new q,b=new ca,c=new q,d=new q;return function(e){D.prototype.updateMatrixWorld.call(this,e);e=this.context.listener;var f=this.up;this.matrixWorld.decompose(a,b,c);d.set(0,0,-1).applyQuaternion(b);e.setPosition(a.x,a.y,
	    a.z);e.setOrientation(d.x,d.y,d.z,f.x,f.y,f.z)}}()});Ub.prototype=Object.assign(Object.create(D.prototype),{constructor:Ub,getOutput:function(){return this.gain},setNodeSource:function(a){this.hasPlaybackControl=!1;this.sourceType="audioNode";this.source=a;this.connect();return this},setBuffer:function(a){this.source.buffer=a;this.sourceType="buffer";this.autoplay&&this.play();return this},play:function(){if(!0===this.isPlaying)console.warn("THREE.Audio: Audio is already playing.");else if(!1===this.hasPlaybackControl)console.warn("THREE.Audio: this Audio has no playback control.");
	  else{var a=this.context.createBufferSource();a.buffer=this.source.buffer;a.loop=this.source.loop;a.onended=this.source.onended;a.start(0,this.startTime);a.playbackRate.value=this.playbackRate;this.isPlaying=!0;this.source=a;return this.connect()}},pause:function(){if(!1===this.hasPlaybackControl)console.warn("THREE.Audio: this Audio has no playback control.");else return this.source.stop(),this.startTime=this.context.currentTime,this.isPlaying=!1,this},stop:function(){if(!1===this.hasPlaybackControl)console.warn("THREE.Audio: this Audio has no playback control.");
	  else return this.source.stop(),this.startTime=0,this.isPlaying=!1,this},connect:function(){if(0<this.filters.length){this.source.connect(this.filters[0]);for(var a=1,b=this.filters.length;a<b;a++)this.filters[a-1].connect(this.filters[a]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this},disconnect:function(){if(0<this.filters.length){this.source.disconnect(this.filters[0]);for(var a=1,b=this.filters.length;a<b;a++)this.filters[a-
	  1].disconnect(this.filters[a]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this},getFilters:function(){return this.filters},setFilters:function(a){a||(a=[]);!0===this.isPlaying?(this.disconnect(),this.filters=a,this.connect()):this.filters=a;return this},getFilter:function(){return this.getFilters()[0]},setFilter:function(a){return this.setFilters(a?[a]:[])},setPlaybackRate:function(a){if(!1===this.hasPlaybackControl)console.warn("THREE.Audio: this Audio has no playback control.");
	  else return this.playbackRate=a,!0===this.isPlaying&&(this.source.playbackRate.value=this.playbackRate),this},getPlaybackRate:function(){return this.playbackRate},onEnded:function(){this.isPlaying=!1},getLoop:function(){return!1===this.hasPlaybackControl?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.source.loop},setLoop:function(a){!1===this.hasPlaybackControl?console.warn("THREE.Audio: this Audio has no playback control."):this.source.loop=a},getVolume:function(){return this.gain.gain.value},
	    setVolume:function(a){this.gain.gain.value=a;return this}});Bd.prototype=Object.assign(Object.create(Ub.prototype),{constructor:Bd,getOutput:function(){return this.panner},getRefDistance:function(){return this.panner.refDistance},setRefDistance:function(a){this.panner.refDistance=a},getRolloffFactor:function(){return this.panner.rolloffFactor},setRolloffFactor:function(a){this.panner.rolloffFactor=a},getDistanceModel:function(){return this.panner.distanceModel},setDistanceModel:function(a){this.panner.distanceModel=
	    a},getMaxDistance:function(){return this.panner.maxDistance},setMaxDistance:function(a){this.panner.maxDistance=a},updateMatrixWorld:function(){var a=new q;return function(b){D.prototype.updateMatrixWorld.call(this,b);a.setFromMatrixPosition(this.matrixWorld);this.panner.setPosition(a.x,a.y,a.z)}}()});Object.assign(Cd.prototype,{getFrequencyData:function(){this.analyser.getByteFrequencyData(this.data);return this.data},getAverageFrequency:function(){for(var a=0,b=this.getFrequencyData(),c=0;c<b.length;c++)a+=
	    b[c];return a/b.length}});hd.prototype={constructor:hd,accumulate:function(a,b){var c=this.buffer,d=this.valueSize,e=a*d+d,f=this.cumulativeWeight;if(0===f){for(f=0;f!==d;++f)c[e+f]=c[f];f=b}else f+=b,this._mixBufferRegion(c,e,0,b/f,d);this.cumulativeWeight=f},apply:function(a){var b=this.valueSize,c=this.buffer;a=a*b+b;var d=this.cumulativeWeight,e=this.binding;this.cumulativeWeight=0;1>d&&this._mixBufferRegion(c,a,3*b,1-d,b);for(var d=b,f=b+b;d!==f;++d)if(c[d]!==c[d+b]){e.setValue(c,a);break}},
	    saveOriginalState:function(){var a=this.buffer,b=this.valueSize,c=3*b;this.binding.getValue(a,c);for(var d=b;d!==c;++d)a[d]=a[c+d%b];this.cumulativeWeight=0},restoreOriginalState:function(){this.binding.setValue(this.buffer,3*this.valueSize)},_select:function(a,b,c,d,e){if(.5<=d)for(d=0;d!==e;++d)a[b+d]=a[c+d]},_slerp:function(a,b,c,d,e){ca.slerpFlat(a,b,a,b,a,c,d)},_lerp:function(a,b,c,d,e){for(var f=1-d,g=0;g!==e;++g){var k=b+g;a[k]=a[k]*f+a[c+g]*d}}};ka.prototype={constructor:ka,getValue:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             b){this.bind();this.getValue(a,b)},setValue:function(a,b){this.bind();this.setValue(a,b)},bind:function(){var a=this.node,b=this.parsedPath,c=b.objectName,d=b.propertyName,e=b.propertyIndex;a||(this.node=a=ka.findNode(this.rootNode,b.nodeName)||this.rootNode);this.getValue=this._getValue_unavailable;this.setValue=this._setValue_unavailable;if(a){if(c){var f=b.objectIndex;switch(c){case "materials":if(!a.material){console.error("  can not bind to material as node does not have a material",this);return}if(!a.material.materials){console.error("  can not bind to material.materials as node.material does not have a materials array",
	    this);return}a=a.material.materials;break;case "bones":if(!a.skeleton){console.error("  can not bind to bones as node does not have a skeleton",this);return}a=a.skeleton.bones;for(c=0;c<a.length;c++)if(a[c].name===f){f=c;break}break;default:if(void 0===a[c]){console.error("  can not bind to objectName of node, undefined",this);return}a=a[c]}if(void 0!==f){if(void 0===a[f]){console.error("  trying to bind to objectIndex of objectName, but is undefined:",this,a);return}a=a[f]}}f=a[d];if(void 0===f)console.error("  trying to update property for track: "+
	    b.nodeName+"."+d+" but it wasn't found.",a);else{b=this.Versioning.None;void 0!==a.needsUpdate?(b=this.Versioning.NeedsUpdate,this.targetObject=a):void 0!==a.matrixWorldNeedsUpdate&&(b=this.Versioning.MatrixWorldNeedsUpdate,this.targetObject=a);c=this.BindingType.Direct;if(void 0!==e){if("morphTargetInfluences"===d){if(!a.geometry){console.error("  can not bind to morphTargetInfluences becasuse node does not have a geometry",this);return}if(!a.geometry.morphTargets){console.error("  can not bind to morphTargetInfluences becasuse node does not have a geometry.morphTargets",
	    this);return}for(c=0;c<this.node.geometry.morphTargets.length;c++)if(a.geometry.morphTargets[c].name===e){e=c;break}}c=this.BindingType.ArrayElement;this.resolvedProperty=f;this.propertyIndex=e}else void 0!==f.fromArray&&void 0!==f.toArray?(c=this.BindingType.HasFromToArray,this.resolvedProperty=f):void 0!==f.length?(c=this.BindingType.EntireArray,this.resolvedProperty=f):this.propertyName=d;this.getValue=this.GetterByBindingType[c];this.setValue=this.SetterByBindingTypeAndVersioning[c][b]}}else console.error("  trying to update node for track: "+
	    this.path+" but it wasn't found.")},unbind:function(){this.node=null;this.getValue=this._getValue_unbound;this.setValue=this._setValue_unbound}};Object.assign(ka.prototype,{_getValue_unavailable:function(){},_setValue_unavailable:function(){},_getValue_unbound:ka.prototype.getValue,_setValue_unbound:ka.prototype.setValue,BindingType:{Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Versioning:{None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},GetterByBindingType:[function(a,b){a[b]=this.node[this.propertyName]},
	    function(a,b){for(var c=this.resolvedProperty,d=0,e=c.length;d!==e;++d)a[b++]=c[d]},function(a,b){a[b]=this.resolvedProperty[this.propertyIndex]},function(a,b){this.resolvedProperty.toArray(a,b)}],SetterByBindingTypeAndVersioning:[[function(a,b){this.node[this.propertyName]=a[b]},function(a,b){this.node[this.propertyName]=a[b];this.targetObject.needsUpdate=!0},function(a,b){this.node[this.propertyName]=a[b];this.targetObject.matrixWorldNeedsUpdate=!0}],[function(a,b){for(var c=this.resolvedProperty,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  d=0,e=c.length;d!==e;++d)c[d]=a[b++]},function(a,b){for(var c=this.resolvedProperty,d=0,e=c.length;d!==e;++d)c[d]=a[b++];this.targetObject.needsUpdate=!0},function(a,b){for(var c=this.resolvedProperty,d=0,e=c.length;d!==e;++d)c[d]=a[b++];this.targetObject.matrixWorldNeedsUpdate=!0}],[function(a,b){this.resolvedProperty[this.propertyIndex]=a[b]},function(a,b){this.resolvedProperty[this.propertyIndex]=a[b];this.targetObject.needsUpdate=!0},function(a,b){this.resolvedProperty[this.propertyIndex]=a[b];
	    this.targetObject.matrixWorldNeedsUpdate=!0}],[function(a,b){this.resolvedProperty.fromArray(a,b)},function(a,b){this.resolvedProperty.fromArray(a,b);this.targetObject.needsUpdate=!0},function(a,b){this.resolvedProperty.fromArray(a,b);this.targetObject.matrixWorldNeedsUpdate=!0}]]});ka.Composite=function(a,b,c){c=c||ka.parseTrackName(b);this._targetGroup=a;this._bindings=a.subscribe_(b,c)};ka.Composite.prototype={constructor:ka.Composite,getValue:function(a,b){this.bind();var c=this._bindings[this._targetGroup.nCachedObjects_];
	    void 0!==c&&c.getValue(a,b)},setValue:function(a,b){for(var c=this._bindings,d=this._targetGroup.nCachedObjects_,e=c.length;d!==e;++d)c[d].setValue(a,b)},bind:function(){for(var a=this._bindings,b=this._targetGroup.nCachedObjects_,c=a.length;b!==c;++b)a[b].bind()},unbind:function(){for(var a=this._bindings,b=this._targetGroup.nCachedObjects_,c=a.length;b!==c;++b)a[b].unbind()}};ka.create=function(a,b,c){return a&&a.isAnimationObjectGroup?new ka.Composite(a,b,c):new ka(a,b,c)};ka.parseTrackName=function(a){var b=
	    /^((?:\w+[\/:])*)(\w+)?(?:\.(\w+)(?:\[(.+)\])?)?\.(\w+)(?:\[(.+)\])?$/.exec(a);if(!b)throw Error("cannot parse trackName at all: "+a);b={nodeName:b[2],objectName:b[3],objectIndex:b[4],propertyName:b[5],propertyIndex:b[6]};if(null===b.propertyName||0===b.propertyName.length)throw Error("can not parse propertyName from trackName: "+a);return b};ka.findNode=function(a,b){if(!b||""===b||"root"===b||"."===b||-1===b||b===a.name||b===a.uuid)return a;if(a.skeleton){var c=function(a){for(var c=0;c<a.bones.length;c++){var d=
	    a.bones[c];if(d.name===b)return d}return null}(a.skeleton);if(c)return c}if(a.children){var d=function(a){for(var c=0;c<a.length;c++){var g=a[c];if(g.name===b||g.uuid===b||(g=d(g.children)))return g}return null};if(c=d(a.children))return c}return null};Dd.prototype={constructor:Dd,isAnimationObjectGroup:!0,add:function(a){for(var b=this._objects,c=b.length,d=this.nCachedObjects_,e=this._indicesByUUID,f=this._paths,g=this._parsedPaths,k=this._bindings,h=k.length,m=0,q=arguments.length;m!==q;++m){var p=
	    arguments[m],n=p.uuid,r=e[n];if(void 0===r){r=c++;e[n]=r;b.push(p);for(var n=0,t=h;n!==t;++n)k[n].push(new ka(p,f[n],g[n]))}else if(r<d){var v=b[r],A=--d,t=b[A];e[t.uuid]=r;b[r]=t;e[n]=A;b[A]=p;n=0;for(t=h;n!==t;++n){var w=k[n],x=w[r];w[r]=w[A];void 0===x&&(x=new ka(p,f[n],g[n]));w[A]=x}}else b[r]!==v&&console.error("Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes...")}this.nCachedObjects_=d},remove:function(a){for(var b=this._objects,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               c=this.nCachedObjects_,d=this._indicesByUUID,e=this._bindings,f=e.length,g=0,k=arguments.length;g!==k;++g){var h=arguments[g],m=h.uuid,q=d[m];if(void 0!==q&&q>=c){var p=c++,n=b[p];d[n.uuid]=q;b[q]=n;d[m]=p;b[p]=h;h=0;for(m=f;h!==m;++h){var n=e[h],r=n[q];n[q]=n[p];n[p]=r}}}this.nCachedObjects_=c},uncache:function(a){for(var b=this._objects,c=b.length,d=this.nCachedObjects_,e=this._indicesByUUID,f=this._bindings,g=f.length,k=0,h=arguments.length;k!==h;++k){var m=arguments[k].uuid,q=e[m];if(void 0!==
	    q)if(delete e[m],q<d){var m=--d,p=b[m],n=--c,r=b[n];e[p.uuid]=q;b[q]=p;e[r.uuid]=m;b[m]=r;b.pop();p=0;for(r=g;p!==r;++p){var t=f[p],v=t[n];t[q]=t[m];t[m]=v;t.pop()}}else for(n=--c,r=b[n],e[r.uuid]=q,b[q]=r,b.pop(),p=0,r=g;p!==r;++p)t=f[p],t[q]=t[n],t.pop()}this.nCachedObjects_=d},subscribe_:function(a,b){var c=this._bindingsIndicesByPath,d=c[a],e=this._bindings;if(void 0!==d)return e[d];var f=this._paths,g=this._parsedPaths,k=this._objects,h=this.nCachedObjects_,m=Array(k.length),d=e.length;c[a]=
	    d;f.push(a);g.push(b);e.push(m);c=h;for(d=k.length;c!==d;++c)m[c]=new ka(k[c],a,b);return m},unsubscribe_:function(a){var b=this._bindingsIndicesByPath,c=b[a];if(void 0!==c){var d=this._paths,e=this._parsedPaths,f=this._bindings,g=f.length-1,k=f[g];b[a[g]]=c;f[c]=k;f.pop();e[c]=e[g];e.pop();d[c]=d[g];d.pop()}}};Ed.prototype={constructor:Ed,play:function(){this._mixer._activateAction(this);return this},stop:function(){this._mixer._deactivateAction(this);return this.reset()},reset:function(){this.paused=
	    !1;this.enabled=!0;this.time=0;this._loopCount=-1;this._startTime=null;return this.stopFading().stopWarping()},isRunning:function(){return this.enabled&&!this.paused&&0!==this.timeScale&&null===this._startTime&&this._mixer._isActiveAction(this)},isScheduled:function(){return this._mixer._isActiveAction(this)},startAt:function(a){this._startTime=a;return this},setLoop:function(a,b){this.loop=a;this.repetitions=b;return this},setEffectiveWeight:function(a){this.weight=a;this._effectiveWeight=this.enabled?
	    a:0;return this.stopFading()},getEffectiveWeight:function(){return this._effectiveWeight},fadeIn:function(a){return this._scheduleFading(a,0,1)},fadeOut:function(a){return this._scheduleFading(a,1,0)},crossFadeFrom:function(a,b,c){a.fadeOut(b);this.fadeIn(b);if(c){c=this._clip.duration;var d=a._clip.duration,e=c/d;a.warp(1,d/c,b);this.warp(e,1,b)}return this},crossFadeTo:function(a,b,c){return a.crossFadeFrom(this,b,c)},stopFading:function(){var a=this._weightInterpolant;null!==a&&(this._weightInterpolant=
	    null,this._mixer._takeBackControlInterpolant(a));return this},setEffectiveTimeScale:function(a){this.timeScale=a;this._effectiveTimeScale=this.paused?0:a;return this.stopWarping()},getEffectiveTimeScale:function(){return this._effectiveTimeScale},setDuration:function(a){this.timeScale=this._clip.duration/a;return this.stopWarping()},syncWith:function(a){this.time=a.time;this.timeScale=a.timeScale;return this.stopWarping()},halt:function(a){return this.warp(this._effectiveTimeScale,0,a)},warp:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              b,c){var d=this._mixer,e=d.time,f=this._timeScaleInterpolant,g=this.timeScale;null===f&&(this._timeScaleInterpolant=f=d._lendControlInterpolant());d=f.parameterPositions;f=f.sampleValues;d[0]=e;d[1]=e+c;f[0]=a/g;f[1]=b/g;return this},stopWarping:function(){var a=this._timeScaleInterpolant;null!==a&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(a));return this},getMixer:function(){return this._mixer},getClip:function(){return this._clip},getRoot:function(){return this._localRoot||
	    this._mixer._root},_update:function(a,b,c,d){var e=this._startTime;if(null!==e){b=(a-e)*c;if(0>b||0===c)return;this._startTime=null;b*=c}b*=this._updateTimeScale(a);c=this._updateTime(b);a=this._updateWeight(a);if(0<a){b=this._interpolants;for(var e=this._propertyBindings,f=0,g=b.length;f!==g;++f)b[f].evaluate(c),e[f].accumulate(d,a)}},_updateWeight:function(a){var b=0;if(this.enabled){var b=this.weight,c=this._weightInterpolant;if(null!==c){var d=c.evaluate(a)[0],b=b*d;a>c.parameterPositions[1]&&
	  (this.stopFading(),0===d&&(this.enabled=!1))}}return this._effectiveWeight=b},_updateTimeScale:function(a){var b=0;if(!this.paused){var b=this.timeScale,c=this._timeScaleInterpolant;if(null!==c){var d=c.evaluate(a)[0],b=b*d;a>c.parameterPositions[1]&&(this.stopWarping(),0===b?this.paused=!0:this.timeScale=b)}}return this._effectiveTimeScale=b},_updateTime:function(a){var b=this.time+a;if(0===a)return b;var c=this._clip.duration,d=this.loop,e=this._loopCount;if(2200===d)a:{if(-1===e&&(this.loopCount=
	      0,this._setEndings(!0,!0,!1)),b>=c)b=c;else if(0>b)b=0;else break a;this.clampWhenFinished?this.paused=!0:this.enabled=!1;this._mixer.dispatchEvent({type:"finished",action:this,direction:0>a?-1:1})}else{d=2202===d;-1===e&&(0<=a?(e=0,this._setEndings(!0,0===this.repetitions,d)):this._setEndings(0===this.repetitions,!0,d));if(b>=c||0>b){var f=Math.floor(b/c),b=b-c*f,e=e+Math.abs(f),g=this.repetitions-e;0>g?(this.clampWhenFinished?this.paused=!0:this.enabled=!1,b=0<a?c:0,this._mixer.dispatchEvent({type:"finished",
	    action:this,direction:0<a?1:-1})):(0===g?(a=0>a,this._setEndings(a,!a,d)):this._setEndings(!1,!1,d),this._loopCount=e,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:f}))}if(d&&1===(e&1))return this.time=b,c-b}return this.time=b},_setEndings:function(a,b,c){var d=this._interpolantSettings;c?(d.endingStart=2401,d.endingEnd=2401):(d.endingStart=a?this.zeroSlopeAtStart?2401:2400:2402,d.endingEnd=b?this.zeroSlopeAtEnd?2401:2400:2402)},_scheduleFading:function(a,b,c){var d=this._mixer,e=d.time,
	    f=this._weightInterpolant;null===f&&(this._weightInterpolant=f=d._lendControlInterpolant());d=f.parameterPositions;f=f.sampleValues;d[0]=e;f[0]=b;d[1]=e+a;f[1]=c;return this}};Object.assign(Fd.prototype,pa.prototype,{clipAction:function(a,b){var c=b||this._root,d=c.uuid,e="string"===typeof a?ta.findByName(c,a):a,c=null!==e?e.uuid:a,f=this._actionsByClip[c],g=null;if(void 0!==f){g=f.actionByRoot[d];if(void 0!==g)return g;g=f.knownActions[0];null===e&&(e=g._clip)}if(null===e)return null;e=new Ed(this,
	    e,b);this._bindAction(e,g);this._addInactiveAction(e,c,d);return e},existingAction:function(a,b){var c=b||this._root,d=c.uuid,c="string"===typeof a?ta.findByName(c,a):a,c=this._actionsByClip[c?c.uuid:a];return void 0!==c?c.actionByRoot[d]||null:null},stopAllAction:function(){for(var a=this._actions,b=this._nActiveActions,c=this._bindings,d=this._nActiveBindings,e=this._nActiveBindings=this._nActiveActions=0;e!==b;++e)a[e].reset();for(e=0;e!==d;++e)c[e].useCount=0;return this},update:function(a){a*=
	    this.timeScale;for(var b=this._actions,c=this._nActiveActions,d=this.time+=a,e=Math.sign(a),f=this._accuIndex^=1,g=0;g!==c;++g){var k=b[g];k.enabled&&k._update(d,a,e,f)}a=this._bindings;b=this._nActiveBindings;for(g=0;g!==b;++g)a[g].apply(f);return this},getRoot:function(){return this._root},uncacheClip:function(a){var b=this._actions;a=a.uuid;var c=this._actionsByClip,d=c[a];if(void 0!==d){for(var d=d.knownActions,e=0,f=d.length;e!==f;++e){var g=d[e];this._deactivateAction(g);var k=g._cacheIndex,
	    h=b[b.length-1];g._cacheIndex=null;g._byClipCacheIndex=null;h._cacheIndex=k;b[k]=h;b.pop();this._removeInactiveBindingsForAction(g)}delete c[a]}},uncacheRoot:function(a){a=a.uuid;var b=this._actionsByClip,c;for(c in b){var d=b[c].actionByRoot[a];void 0!==d&&(this._deactivateAction(d),this._removeInactiveAction(d))}c=this._bindingsByRootAndName[a];if(void 0!==c)for(var e in c)a=c[e],a.restoreOriginalState(),this._removeInactiveBinding(a)},uncacheAction:function(a,b){var c=this.existingAction(a,b);
	    null!==c&&(this._deactivateAction(c),this._removeInactiveAction(c))}});Object.assign(Fd.prototype,{_bindAction:function(a,b){var c=a._localRoot||this._root,d=a._clip.tracks,e=d.length,f=a._propertyBindings,g=a._interpolants,k=c.uuid,h=this._bindingsByRootAndName,m=h[k];void 0===m&&(m={},h[k]=m);for(h=0;h!==e;++h){var q=d[h],p=q.name,n=m[p];if(void 0===n){n=f[h];if(void 0!==n){null===n._cacheIndex&&(++n.referenceCount,this._addInactiveBinding(n,k,p));continue}n=new hd(ka.create(c,p,b&&b._propertyBindings[h].binding.parsedPath),
	    q.ValueTypeName,q.getValueSize());++n.referenceCount;this._addInactiveBinding(n,k,p)}f[h]=n;g[h].resultBuffer=n.buffer}},_activateAction:function(a){if(!this._isActiveAction(a)){if(null===a._cacheIndex){var b=(a._localRoot||this._root).uuid,c=a._clip.uuid,d=this._actionsByClip[c];this._bindAction(a,d&&d.knownActions[0]);this._addInactiveAction(a,c,b)}b=a._propertyBindings;c=0;for(d=b.length;c!==d;++c){var e=b[c];0===e.useCount++&&(this._lendBinding(e),e.saveOriginalState())}this._lendAction(a)}},
	    _deactivateAction:function(a){if(this._isActiveAction(a)){for(var b=a._propertyBindings,c=0,d=b.length;c!==d;++c){var e=b[c];0===--e.useCount&&(e.restoreOriginalState(),this._takeBackBinding(e))}this._takeBackAction(a)}},_initMemoryManager:function(){this._actions=[];this._nActiveActions=0;this._actionsByClip={};this._bindings=[];this._nActiveBindings=0;this._bindingsByRootAndName={};this._controlInterpolants=[];this._nActiveControlInterpolants=0;var a=this;this.stats={actions:{get total(){return a._actions.length},
	      get inUse(){return a._nActiveActions}},bindings:{get total(){return a._bindings.length},get inUse(){return a._nActiveBindings}},controlInterpolants:{get total(){return a._controlInterpolants.length},get inUse(){return a._nActiveControlInterpolants}}}},_isActiveAction:function(a){a=a._cacheIndex;return null!==a&&a<this._nActiveActions},_addInactiveAction:function(a,b,c){var d=this._actions,e=this._actionsByClip,f=e[b];void 0===f?(f={knownActions:[a],actionByRoot:{}},a._byClipCacheIndex=0,e[b]=f):(b=
	      f.knownActions,a._byClipCacheIndex=b.length,b.push(a));a._cacheIndex=d.length;d.push(a);f.actionByRoot[c]=a},_removeInactiveAction:function(a){var b=this._actions,c=b[b.length-1],d=a._cacheIndex;c._cacheIndex=d;b[d]=c;b.pop();a._cacheIndex=null;var c=a._clip.uuid,d=this._actionsByClip,e=d[c],f=e.knownActions,g=f[f.length-1],k=a._byClipCacheIndex;g._byClipCacheIndex=k;f[k]=g;f.pop();a._byClipCacheIndex=null;delete e.actionByRoot[(b._localRoot||this._root).uuid];0===f.length&&delete d[c];this._removeInactiveBindingsForAction(a)},
	    _removeInactiveBindingsForAction:function(a){a=a._propertyBindings;for(var b=0,c=a.length;b!==c;++b){var d=a[b];0===--d.referenceCount&&this._removeInactiveBinding(d)}},_lendAction:function(a){var b=this._actions,c=a._cacheIndex,d=this._nActiveActions++,e=b[d];a._cacheIndex=d;b[d]=a;e._cacheIndex=c;b[c]=e},_takeBackAction:function(a){var b=this._actions,c=a._cacheIndex,d=--this._nActiveActions,e=b[d];a._cacheIndex=d;b[d]=a;e._cacheIndex=c;b[c]=e},_addInactiveBinding:function(a,b,c){var d=this._bindingsByRootAndName,
	      e=d[b],f=this._bindings;void 0===e&&(e={},d[b]=e);e[c]=a;a._cacheIndex=f.length;f.push(a)},_removeInactiveBinding:function(a){var b=this._bindings,c=a.binding,d=c.rootNode.uuid,c=c.path,e=this._bindingsByRootAndName,f=e[d],g=b[b.length-1];a=a._cacheIndex;g._cacheIndex=a;b[a]=g;b.pop();delete f[c];a:{for(var k in f)break a;delete e[d]}},_lendBinding:function(a){var b=this._bindings,c=a._cacheIndex,d=this._nActiveBindings++,e=b[d];a._cacheIndex=d;b[d]=a;e._cacheIndex=c;b[c]=e},_takeBackBinding:function(a){var b=
	      this._bindings,c=a._cacheIndex,d=--this._nActiveBindings,e=b[d];a._cacheIndex=d;b[d]=a;e._cacheIndex=c;b[c]=e},_lendControlInterpolant:function(){var a=this._controlInterpolants,b=this._nActiveControlInterpolants++,c=a[b];void 0===c&&(c=new zc(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),c.__cacheIndex=b,a[b]=c);return c},_takeBackControlInterpolant:function(a){var b=this._controlInterpolants,c=a.__cacheIndex,d=--this._nActiveControlInterpolants,e=b[d];a.__cacheIndex=
	      d;b[d]=a;e.__cacheIndex=c;b[c]=e},_controlInterpolantsResultBuffer:new Float32Array(1)});Gd.prototype={constructor:Gd,onUpdate:function(a){this.dynamic=!0;this.onUpdateCallback=a;return this}};xb.prototype=Object.create(I.prototype);xb.prototype.constructor=xb;xb.prototype.isInstancedBufferGeometry=!0;xb.prototype.addGroup=function(a,b,c){this.groups.push({start:a,count:b,instances:c})};xb.prototype.copy=function(a){var b=a.index;null!==b&&this.setIndex(b.clone());var b=a.attributes,c;for(c in b)this.addAttribute(c,
	    b[c].clone());a=a.groups;c=0;for(b=a.length;c<b;c++){var d=a[c];this.addGroup(d.start,d.count,d.instances)}return this};Hd.prototype={constructor:Hd,isInterleavedBufferAttribute:!0,get count(){return this.data.count},get array(){return this.data.array},setX:function(a,b){this.data.array[a*this.data.stride+this.offset]=b;return this},setY:function(a,b){this.data.array[a*this.data.stride+this.offset+1]=b;return this},setZ:function(a,b){this.data.array[a*this.data.stride+this.offset+2]=b;return this},
	    setW:function(a,b){this.data.array[a*this.data.stride+this.offset+3]=b;return this},getX:function(a){return this.data.array[a*this.data.stride+this.offset]},getY:function(a){return this.data.array[a*this.data.stride+this.offset+1]},getZ:function(a){return this.data.array[a*this.data.stride+this.offset+2]},getW:function(a){return this.data.array[a*this.data.stride+this.offset+3]},setXY:function(a,b,c){a=a*this.data.stride+this.offset;this.data.array[a+0]=b;this.data.array[a+1]=c;return this},setXYZ:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    b,c,d){a=a*this.data.stride+this.offset;this.data.array[a+0]=b;this.data.array[a+1]=c;this.data.array[a+2]=d;return this},setXYZW:function(a,b,c,d,e){a=a*this.data.stride+this.offset;this.data.array[a+0]=b;this.data.array[a+1]=c;this.data.array[a+2]=d;this.data.array[a+3]=e;return this}};Vb.prototype={constructor:Vb,isInterleavedBuffer:!0,set needsUpdate(a){!0===a&&this.version++},setDynamic:function(a){this.dynamic=a;return this},copy:function(a){this.array=new a.array.constructor(a.array);this.count=
	    a.count;this.stride=a.stride;this.dynamic=a.dynamic;return this},copyAt:function(a,b,c){a*=this.stride;c*=b.stride;for(var d=0,e=this.stride;d<e;d++)this.array[a+d]=b.array[c+d];return this},set:function(a,b){void 0===b&&(b=0);this.array.set(a,b);return this},clone:function(){return(new this.constructor).copy(this)}};Wb.prototype=Object.create(Vb.prototype);Wb.prototype.constructor=Wb;Wb.prototype.isInstancedInterleavedBuffer=!0;Wb.prototype.copy=function(a){Vb.prototype.copy.call(this,a);this.meshPerAttribute=
	    a.meshPerAttribute;return this};Xb.prototype=Object.create(z.prototype);Xb.prototype.constructor=Xb;Xb.prototype.isInstancedBufferAttribute=!0;Xb.prototype.copy=function(a){z.prototype.copy.call(this,a);this.meshPerAttribute=a.meshPerAttribute;return this};Id.prototype={constructor:Id,linePrecision:1,set:function(a,b){this.ray.set(a,b)},setFromCamera:function(a,b){b&&b.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(b.matrixWorld),this.ray.direction.set(a.x,a.y,.5).unproject(b).sub(this.ray.origin).normalize()):
	    b&&b.isOrthographicCamera?(this.ray.origin.set(a.x,a.y,(b.near+b.far)/(b.near-b.far)).unproject(b),this.ray.direction.set(0,0,-1).transformDirection(b.matrixWorld)):console.error("THREE.Raycaster: Unsupported camera type.")},intersectObject:function(a,b){var c=[];Jd(a,this,c,b);c.sort(me);return c},intersectObjects:function(a,b){var c=[];if(!1===Array.isArray(a))return console.warn("THREE.Raycaster.intersectObjects: objects is not an Array."),c;for(var d=0,e=a.length;d<e;d++)Jd(a[d],this,c,b);c.sort(me);
	    return c}};Kd.prototype={constructor:Kd,start:function(){this.oldTime=this.startTime=(performance||Date).now();this.running=!0},stop:function(){this.getElapsedTime();this.running=!1},getElapsedTime:function(){this.getDelta();return this.elapsedTime},getDelta:function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=(performance||Date).now(),a=(b-this.oldTime)/1E3;this.oldTime=b;this.elapsedTime+=a}return a}};Ld.prototype={constructor:Ld,set:function(a,b,c){this.radius=
	    a;this.phi=b;this.theta=c;return this},clone:function(){return(new this.constructor).copy(this)},copy:function(a){this.radius.copy(a.radius);this.phi.copy(a.phi);this.theta.copy(a.theta);return this},makeSafe:function(){this.phi=Math.max(1E-6,Math.min(Math.PI-1E-6,this.phi));return this},setFromVector3:function(a){this.radius=a.length();0===this.radius?this.phi=this.theta=0:(this.theta=Math.atan2(a.x,a.z),this.phi=Math.acos(h.Math.clamp(a.y/this.radius,-1,1)));return this}};la.prototype=Object.create(va.prototype);
	  la.prototype.constructor=la;la.prototype.createAnimation=function(a,b,c,d){b={start:b,end:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:!1,time:0,direction:1,weight:1,directionBackwards:!1,mirroredLoop:!1};this.animationsMap[a]=b;this.animationsList.push(b)};la.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)_?(\d+)/i,c,d={},e=this.geometry,f=0,g=e.morphTargets.length;f<g;f++){var k=e.morphTargets[f].name.match(b);if(k&&1<k.length){var h=k[1];d[h]||(d[h]={start:Infinity,
	    end:-Infinity});k=d[h];f<k.start&&(k.start=f);f>k.end&&(k.end=f);c||(c=h)}}for(h in d)k=d[h],this.createAnimation(h,k.start,k.end,a);this.firstAnimation=c};la.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a])a.direction=1,a.directionBackwards=!1};la.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a])a.direction=-1,a.directionBackwards=!0};la.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];c&&(c.fps=b,c.duration=(c.end-c.start)/
	    c.fps)};la.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];c&&(c.duration=b,c.fps=(c.end-c.start)/c.duration)};la.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];c&&(c.weight=b)};la.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];c&&(c.time=b)};la.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};la.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;
	    return b};la.prototype.playAnimation=function(a){var b=this.animationsMap[a];b?(b.time=0,b.active=!0):console.warn("THREE.MorphBlendMesh: animation["+a+"] undefined in .playAnimation()")};la.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=!1};la.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var e=d.duration/d.length;d.time+=d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||0>d.time)d.direction*=
	    -1,d.time>d.duration&&(d.time=d.duration,d.directionBackwards=!0),0>d.time&&(d.time=0,d.directionBackwards=!1)}else d.time%=d.duration,0>d.time&&(d.time+=d.duration);var f=d.start+h.Math.clamp(Math.floor(d.time/e),0,d.length-1),g=d.weight;f!==d.currentFrame&&(this.morphTargetInfluences[d.lastFrame]=0,this.morphTargetInfluences[d.currentFrame]=1*g,this.morphTargetInfluences[f]=0,d.lastFrame=d.currentFrame,d.currentFrame=f);e=d.time%e/e;d.directionBackwards&&(e=1-e);d.currentFrame!==d.lastFrame?(this.morphTargetInfluences[d.currentFrame]=
	    e*g,this.morphTargetInfluences[d.lastFrame]=(1-e)*g):this.morphTargetInfluences[d.currentFrame]=g}}};Dc.prototype=Object.create(D.prototype);Dc.prototype.constructor=Dc;Dc.prototype.isImmediateRenderObject=!0;Ec.prototype=Object.create(ha.prototype);Ec.prototype.constructor=Ec;Ec.prototype.update=function(){var a=new q,b=new q,c=new ya;return function(){var d=["a","b","c"];this.object.updateMatrixWorld(!0);c.getNormalMatrix(this.object.matrixWorld);var e=this.object.matrixWorld,f=this.geometry.attributes.position,
	    g=this.object.geometry;if(g&&g.isGeometry)for(var k=g.vertices,h=g.faces,m=g=0,q=h.length;m<q;m++)for(var p=h[m],n=0,r=p.vertexNormals.length;n<r;n++){var t=p.vertexNormals[n];a.copy(k[p[d[n]]]).applyMatrix4(e);b.copy(t).applyMatrix3(c).normalize().multiplyScalar(this.size).add(a);f.setXYZ(g,a.x,a.y,a.z);g+=1;f.setXYZ(g,b.x,b.y,b.z);g+=1}else if(g&&g.isBufferGeometry)for(d=g.attributes.position,k=g.attributes.normal,n=g=0,r=d.count;n<r;n++)a.set(d.getX(n),d.getY(n),d.getZ(n)).applyMatrix4(e),b.set(k.getX(n),
	    k.getY(n),k.getZ(n)),b.applyMatrix3(c).normalize().multiplyScalar(this.size).add(a),f.setXYZ(g,a.x,a.y,a.z),g+=1,f.setXYZ(g,b.x,b.y,b.z),g+=1;f.needsUpdate=!0;return this}}();Yb.prototype=Object.create(D.prototype);Yb.prototype.constructor=Yb;Yb.prototype.dispose=function(){this.cone.geometry.dispose();this.cone.material.dispose()};Yb.prototype.update=function(){var a=new q,b=new q;return function(){var c=this.light.distance?this.light.distance:1E3,d=c*Math.tan(this.light.angle);this.cone.scale.set(d,
	    d,c);a.setFromMatrixPosition(this.light.matrixWorld);b.setFromMatrixPosition(this.light.target.matrixWorld);this.cone.lookAt(b.sub(a));this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)}}();Zb.prototype=Object.create(ha.prototype);Zb.prototype.constructor=Zb;Zb.prototype.getBoneList=function(a){var b=[];a&&a.isBone&&b.push(a);for(var c=0;c<a.children.length;c++)b.push.apply(b,this.getBoneList(a.children[c]));return b};Zb.prototype.update=function(){for(var a=this.geometry,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 b=(new P).getInverse(this.root.matrixWorld),c=new P,d=0,e=0;e<this.bones.length;e++){var f=this.bones[e];f.parent&&f.parent.isBone&&(c.multiplyMatrices(b,f.matrixWorld),a.vertices[d].setFromMatrixPosition(c),c.multiplyMatrices(b,f.parent.matrixWorld),a.vertices[d+1].setFromMatrixPosition(c),d+=2)}a.verticesNeedUpdate=!0;a.computeBoundingSphere()};$b.prototype=Object.create(va.prototype);$b.prototype.constructor=$b;$b.prototype.dispose=function(){this.geometry.dispose();this.material.dispose()};$b.prototype.update=
	    function(){this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)};ac.prototype=Object.create(D.prototype);ac.prototype.constructor=ac;ac.prototype.dispose=function(){this.lightSphere.geometry.dispose();this.lightSphere.material.dispose()};ac.prototype.update=function(){var a=new q;return function(){this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity);this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity);this.lightSphere.lookAt(a.setFromMatrixPosition(this.light.matrixWorld).negate());
	    this.lightSphere.geometry.colorsNeedUpdate=!0}}();Fc.prototype=Object.create(ha.prototype);Fc.prototype.constructor=Fc;Fc.prototype.setColors=function(){console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")};Gc.prototype=Object.create(ha.prototype);Gc.prototype.constructor=Gc;Gc.prototype.update=function(){var a=new q,b=new q,c=new ya;return function(){this.object.updateMatrixWorld(!0);c.getNormalMatrix(this.object.matrixWorld);for(var d=this.object.matrixWorld,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              e=this.geometry.attributes.position,f=this.object.geometry,g=f.vertices,f=f.faces,k=0,h=0,m=f.length;h<m;h++){var q=f[h],p=q.normal;a.copy(g[q.a]).add(g[q.b]).add(g[q.c]).divideScalar(3).applyMatrix4(d);b.copy(p).applyMatrix3(c).normalize().multiplyScalar(this.size).add(a);e.setXYZ(k,a.x,a.y,a.z);k+=1;e.setXYZ(k,b.x,b.y,b.z);k+=1}e.needsUpdate=!0;return this}}();bc.prototype=Object.create(D.prototype);bc.prototype.constructor=bc;bc.prototype.dispose=function(){var a=this.children[0],b=this.children[1];
	    a.geometry.dispose();a.material.dispose();b.geometry.dispose();b.material.dispose()};bc.prototype.update=function(){var a=new q,b=new q,c=new q;return function(){a.setFromMatrixPosition(this.light.matrixWorld);b.setFromMatrixPosition(this.light.target.matrixWorld);c.subVectors(b,a);var d=this.children[0],e=this.children[1];d.lookAt(c);d.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);e.lookAt(c);e.scale.z=c.length()}}();Hc.prototype=Object.create(ha.prototype);Hc.prototype.constructor=
	    Hc;Hc.prototype.update=function(){function a(a,g,k,h){d.set(g,k,h).unproject(e);a=c[a];if(void 0!==a)for(g=0,k=a.length;g<k;g++)b.vertices[a[g]].copy(d)}var b,c,d=new q,e=new qa;return function(){b=this.geometry;c=this.pointMap;e.projectionMatrix.copy(this.camera.projectionMatrix);a("c",0,0,-1);a("t",0,0,1);a("n1",-1,-1,-1);a("n2",1,-1,-1);a("n3",-1,1,-1);a("n4",1,1,-1);a("f1",-1,-1,1);a("f2",1,-1,1);a("f3",-1,1,1);a("f4",1,1,1);a("u1",.7,1.1,-1);a("u2",-.7,1.1,-1);a("u3",0,2,-1);a("cf1",-1,0,1);
	    a("cf2",1,0,1);a("cf3",0,-1,1);a("cf4",0,1,1);a("cn1",-1,0,-1);a("cn2",1,0,-1);a("cn3",0,-1,-1);a("cn4",0,1,-1);b.verticesNeedUpdate=!0}}();Ic.prototype=Object.create(va.prototype);Ic.prototype.constructor=Ic;Ic.prototype.update=function(){this.box.setFromObject(this.object);this.box.size(this.scale);this.box.getCenter(this.position)};Jc.prototype=Object.create(ha.prototype);Jc.prototype.constructor=Jc;Jc.prototype.update=function(){var a=new Ha;return function(b){b&&b.isBox3?a.copy(b):a.setFromObject(b);
	    if(!a.isEmpty()){b=a.min;var c=a.max,d=this.geometry.attributes.position,e=d.array;e[0]=c.x;e[1]=c.y;e[2]=c.z;e[3]=b.x;e[4]=c.y;e[5]=c.z;e[6]=b.x;e[7]=b.y;e[8]=c.z;e[9]=c.x;e[10]=b.y;e[11]=c.z;e[12]=c.x;e[13]=c.y;e[14]=b.z;e[15]=b.x;e[16]=c.y;e[17]=b.z;e[18]=b.x;e[19]=b.y;e[20]=b.z;e[21]=c.x;e[22]=b.y;e[23]=b.z;d.needsUpdate=!0;this.geometry.computeBoundingSphere()}}}();var ne=new I;ne.addAttribute("position",new ma([0,0,0,0,1,0],3));var oe=new Za(0,.5,1,5,1);oe.translate(0,-.5,0);yb.prototype=Object.create(D.prototype);
	  yb.prototype.constructor=yb;yb.prototype.setDirection=function(){var a=new q,b;return function(c){.99999<c.y?this.quaternion.set(0,0,0,1):-.99999>c.y?this.quaternion.set(1,0,0,0):(a.set(c.z,0,-c.x).normalize(),b=Math.acos(c.y),this.quaternion.setFromAxisAngle(a,b))}}();yb.prototype.setLength=function(a,b,c){void 0===b&&(b=.2*a);void 0===c&&(c=.2*b);this.line.scale.set(1,Math.max(0,a-b),1);this.line.updateMatrix();this.cone.scale.set(c,b,c);this.cone.position.y=a;this.cone.updateMatrix()};yb.prototype.setColor=
	    function(a){this.line.material.color.copy(a);this.cone.material.color.copy(a)};id.prototype=Object.create(ha.prototype);id.prototype.constructor=id;h.CatmullRomCurve3=function(){function a(){}var b=new q,c=new a,d=new a,e=new a;a.prototype.init=function(a,b,c,d){this.c0=a;this.c1=c;this.c2=-3*a+3*b-2*c-d;this.c3=2*a-2*b+c+d};a.prototype.initNonuniformCatmullRom=function(a,b,c,d,e,h,p){this.init(b,c,((b-a)/e-(c-a)/(e+h)+(c-b)/h)*h,((c-b)/h-(d-b)/(h+p)+(d-c)/p)*h)};a.prototype.initCatmullRom=function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            b,c,d,e){this.init(b,c,e*(c-a),e*(d-b))};a.prototype.calc=function(a){var b=a*a;return this.c0+this.c1*a+this.c2*b+this.c3*b*a};return Y.create(function(a){this.points=a||[];this.closed=!1},function(a){var g=this.points,k,h;h=g.length;2>h&&console.log("duh, you need at least 2 points");a*=h-(this.closed?0:1);k=Math.floor(a);a-=k;this.closed?k+=0<k?0:(Math.floor(Math.abs(k)/g.length)+1)*g.length:0===a&&k===h-1&&(k=h-2,a=1);var m,u,p;this.closed||0<k?m=g[(k-1)%h]:(b.subVectors(g[0],g[1]).add(g[0]),
	    m=b);u=g[k%h];p=g[(k+1)%h];this.closed||k+2<h?g=g[(k+2)%h]:(b.subVectors(g[h-1],g[h-2]).add(g[h-1]),g=b);if(void 0===this.type||"centripetal"===this.type||"chordal"===this.type){var n="chordal"===this.type?.5:.25;h=Math.pow(m.distanceToSquared(u),n);k=Math.pow(u.distanceToSquared(p),n);n=Math.pow(p.distanceToSquared(g),n);1E-4>k&&(k=1);1E-4>h&&(h=k);1E-4>n&&(n=k);c.initNonuniformCatmullRom(m.x,u.x,p.x,g.x,h,k,n);d.initNonuniformCatmullRom(m.y,u.y,p.y,g.y,h,k,n);e.initNonuniformCatmullRom(m.z,u.z,
	    p.z,g.z,h,k,n)}else"catmullrom"===this.type&&(h=void 0!==this.tension?this.tension:.5,c.initCatmullRom(m.x,u.x,p.x,g.x,h),d.initCatmullRom(m.y,u.y,p.y,g.y,h),e.initCatmullRom(m.z,u.z,p.z,g.z,h));return new q(c.calc(a),d.calc(a),e.calc(a))})}();pe.prototype=Object.create(h.CatmullRomCurve3.prototype);var of=Y.create(function(a){console.warn("THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3");this.points=void 0===a?[]:a},function(a){var b=this.points;a*=b.length-1;var c=Math.floor(a);
	    a-=c;var d=b[0==c?c:c-1],e=b[c],f=b[c>b.length-2?b.length-1:c+1],b=b[c>b.length-3?b.length-1:c+2],c=h.CurveUtils.interpolate;return new q(c(d.x,e.x,f.x,b.x,a),c(d.y,e.y,f.y,b.y,a),c(d.z,e.z,f.z,b.z,a))});h.CubicBezierCurve3=Y.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b=h.ShapeUtils.b3;return new q(b(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x),b(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y),b(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z))});h.QuadraticBezierCurve3=
	    Y.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b=h.ShapeUtils.b2;return new q(b(a,this.v0.x,this.v1.x,this.v2.x),b(a,this.v0.y,this.v1.y,this.v2.y),b(a,this.v0.z,this.v1.z,this.v2.z))});h.LineCurve3=Y.create(function(a,b){this.v1=a;this.v2=b},function(a){if(1===a)return this.v2.clone();var b=new q;b.subVectors(this.v2,this.v1);b.multiplyScalar(a);b.add(this.v1);return b});jd.prototype=Object.create(Ra.prototype);jd.prototype.constructor=jd;h.SceneUtils={createMultiMaterialObject:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          b){for(var c=new hc,d=0,e=b.length;d<e;d++)c.add(new va(a,b[d]));return c},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new P;d.getInverse(c.matrixWorld);a.applyMatrix(d);b.remove(a);c.add(a)}};Object.assign(cc.prototype,{center:function(a){console.warn("THREE.Box2: .center() has been renamed to .getCenter().");return this.getCenter(a)},empty:function(){console.warn("THREE.Box2: .empty() has been renamed to .isEmpty().");return this.isEmpty()},
	    isIntersectionBox:function(a){console.warn("THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox().");return this.intersectsBox(a)},size:function(a){console.warn("THREE.Box2: .size() has been renamed to .getSize().");return this.getSize(a)}});Object.assign(Ha.prototype,{center:function(a){console.warn("THREE.Box3: .center() has been renamed to .getCenter().");return this.getCenter(a)},empty:function(){console.warn("THREE.Box3: .empty() has been renamed to .isEmpty().");return this.isEmpty()},
	    isIntersectionBox:function(a){console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox().");return this.intersectsBox(a)},isIntersectionSphere:function(a){console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere().");return this.intersectsSphere(a)},size:function(a){console.warn("THREE.Box3: .size() has been renamed to .getSize().");return this.getSize(a)}});Object.assign(cb.prototype,{center:function(a){console.warn("THREE.Line3: .center() has been renamed to .getCenter().");
	    return this.getCenter(a)}});Object.assign(ya.prototype,{multiplyVector3:function(a){console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.");return a.applyMatrix3(this)},multiplyVector3Array:function(a){console.warn("THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");return this.applyToVector3Array(a)}});Object.assign(P.prototype,{extractPosition:function(a){console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().");
	    return this.copyPosition(a)},setRotationFromQuaternion:function(a){console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().");return this.makeRotationFromQuaternion(a)},multiplyVector3:function(a){console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.");return a.applyProjection(this)},multiplyVector4:function(a){console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.");
	    return a.applyMatrix4(this)},multiplyVector3Array:function(a){console.warn("THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");return this.applyToVector3Array(a)},rotateAxis:function(a){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.");a.transformDirection(this)},crossVector:function(a){console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.");
	    return a.applyMatrix4(this)},translate:function(a){console.error("THREE.Matrix4: .translate() has been removed.")},rotateX:function(a){console.error("THREE.Matrix4: .rotateX() has been removed.")},rotateY:function(a){console.error("THREE.Matrix4: .rotateY() has been removed.")},rotateZ:function(a){console.error("THREE.Matrix4: .rotateZ() has been removed.")},rotateByAxis:function(a,b){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")}});Object.assign(fa.prototype,{isIntersectionLine:function(a){console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine().");
	    return this.intersectsLine(a)}});Object.assign(ca.prototype,{multiplyVector3:function(a){console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.");return a.applyQuaternion(this)}});Object.assign(Wa.prototype,{isIntersectionBox:function(a){console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox().");return this.intersectsBox(a)},isIntersectionPlane:function(a){console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane().");
	    return this.intersectsPlane(a)},isIntersectionSphere:function(a){console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere().");return this.intersectsSphere(a)}});Object.assign(wb.prototype,{extrude:function(a){console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead.");return new ra(this,a)},makeGeometry:function(a){console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead.");return new Ya(this,a)}});Object.assign(q.prototype,
	    {setEulerFromRotationMatrix:function(){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")},setEulerFromQuaternion:function(){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")},getPositionFromMatrix:function(a){console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().");return this.setFromMatrixPosition(a)},getScaleFromMatrix:function(a){console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().");
	      return this.setFromMatrixScale(a)},getColumnFromMatrix:function(a,b){console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().");return this.setFromMatrixColumn(b,a)}});Object.assign(D.prototype,{getChildByName:function(a){console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().");return this.getObjectByName(a)},renderDepth:function(a){console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")},translate:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           b){console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.");return this.translateOnAxis(b,a)}});Object.defineProperties(D.prototype,{eulerOrder:{get:function(){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order.");return this.rotation.order},set:function(a){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order.");this.rotation.order=a}},useQuaternion:{get:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},
	    set:function(a){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")}}});Object.defineProperties(gc.prototype,{objects:{get:function(){console.warn("THREE.LOD: .objects has been renamed to .levels.");return this.levels}}});Ca.prototype.setLens=function(a,b){console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup.");void 0!==b&&(this.filmGauge=b);this.setFocalLength(a)};Object.defineProperties(oa.prototype,
	    {onlyShadow:{set:function(a){console.warn("THREE.Light: .onlyShadow has been removed.")}},shadowCameraFov:{set:function(a){console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov.");this.shadow.camera.fov=a}},shadowCameraLeft:{set:function(a){console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left.");this.shadow.camera.left=a}},shadowCameraRight:{set:function(a){console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right.");this.shadow.camera.right=a}},
	      shadowCameraTop:{set:function(a){console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top.");this.shadow.camera.top=a}},shadowCameraBottom:{set:function(a){console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom.");this.shadow.camera.bottom=a}},shadowCameraNear:{set:function(a){console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near.");this.shadow.camera.near=a}},shadowCameraFar:{set:function(a){console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far.");
	      this.shadow.camera.far=a}},shadowCameraVisible:{set:function(a){console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")}},shadowBias:{set:function(a){console.warn("THREE.Light: .shadowBias is now .shadow.bias.");this.shadow.bias=a}},shadowDarkness:{set:function(a){console.warn("THREE.Light: .shadowDarkness has been removed.")}},shadowMapWidth:{set:function(a){console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width.");
	      this.shadow.mapSize.width=a}},shadowMapHeight:{set:function(a){console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height.");this.shadow.mapSize.height=a}}});Object.defineProperties(z.prototype,{length:{get:function(){console.warn("THREE.BufferAttribute: .length has been deprecated. Please use .count.");return this.array.length}}});Object.assign(I.prototype,{addIndex:function(a){console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex().");this.setIndex(a)},addDrawCall:function(a,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             b,c){void 0!==c&&console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset.");console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup().");this.addGroup(a,b)},clearDrawCalls:function(){console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups().");this.clearGroups()},computeTangents:function(){console.warn("THREE.BufferGeometry: .computeTangents() has been removed.")},computeOffsets:function(){console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")}});
	  Object.defineProperties(I.prototype,{drawcalls:{get:function(){console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups.");return this.groups}},offsets:{get:function(){console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups.");return this.groups}}});Object.defineProperties(S.prototype,{wrapAround:{get:function(){console.warn("THREE."+this.type+": .wrapAround has been removed.")},set:function(a){console.warn("THREE."+this.type+": .wrapAround has been removed.")}},
	    wrapRGB:{get:function(){console.warn("THREE."+this.type+": .wrapRGB has been removed.");return new H}}});Object.defineProperties($a.prototype,{metal:{get:function(){console.warn("THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead.");return!1},set:function(a){console.warn("THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead")}}});Object.defineProperties(Da.prototype,{derivatives:{get:function(){console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives.");
	    return this.extensions.derivatives},set:function(a){console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives.");this.extensions.derivatives=a}}});pa.prototype=Object.assign(Object.create({constructor:pa,apply:function(a){console.warn("THREE.EventDispatcher: .apply is deprecated, just inherit or Object.assign the prototype to mix-in.");Object.assign(a,this)}}),pa.prototype);Object.assign(od.prototype,{supportsFloatTextures:function(){console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' ).");
	    return this.extensions.get("OES_texture_float")},supportsHalfFloatTextures:function(){console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' ).");return this.extensions.get("OES_texture_half_float")},supportsStandardDerivatives:function(){console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' ).");return this.extensions.get("OES_standard_derivatives")},supportsCompressedTextureS3TC:function(){console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' ).");
	    return this.extensions.get("WEBGL_compressed_texture_s3tc")},supportsCompressedTexturePVRTC:function(){console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' ).");return this.extensions.get("WEBGL_compressed_texture_pvrtc")},supportsBlendMinMax:function(){console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' ).");return this.extensions.get("EXT_blend_minmax")},supportsVertexTextures:function(){return this.capabilities.vertexTextures},
	    supportsInstancedArrays:function(){console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' ).");return this.extensions.get("ANGLE_instanced_arrays")},enableScissorTest:function(a){console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest().");this.setScissorTest(a)},initMaterial:function(){console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")},addPrePlugin:function(){console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")},
	    addPostPlugin:function(){console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")},updateShadowMap:function(){console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")}});Object.defineProperties(od.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(a){console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled.");this.shadowMap.enabled=a}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(a){console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type.");
	    this.shadowMap.type=a}},shadowMapCullFace:{get:function(){return this.shadowMap.cullFace},set:function(a){console.warn("THREE.WebGLRenderer: .shadowMapCullFace is now .shadowMap.cullFace.");this.shadowMap.cullFace=a}}});Object.defineProperties($d.prototype,{cullFace:{get:function(){return this.renderReverseSided?2:1},set:function(a){a=1!==a;console.warn("WebGLRenderer: .shadowMap.cullFace is deprecated. Set .shadowMap.renderReverseSided to "+a+".");this.renderReverseSided=a}}});Object.defineProperties(zb.prototype,
	    {wrapS:{get:function(){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.");return this.texture.wrapS},set:function(a){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.");this.texture.wrapS=a}},wrapT:{get:function(){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.");return this.texture.wrapT},set:function(a){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.");this.texture.wrapT=a}},magFilter:{get:function(){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.");
	      return this.texture.magFilter},set:function(a){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.");this.texture.magFilter=a}},minFilter:{get:function(){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.");return this.texture.minFilter},set:function(a){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.");this.texture.minFilter=a}},anisotropy:{get:function(){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.");
	      return this.texture.anisotropy},set:function(a){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.");this.texture.anisotropy=a}},offset:{get:function(){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset.");return this.texture.offset},set:function(a){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset.");this.texture.offset=a}},repeat:{get:function(){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat.");return this.texture.repeat},
	      set:function(a){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat.");this.texture.repeat=a}},format:{get:function(){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format.");return this.texture.format},set:function(a){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format.");this.texture.format=a}},type:{get:function(){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type.");return this.texture.type},set:function(a){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type.");
	      this.texture.type=a}},generateMipmaps:{get:function(){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.");return this.texture.generateMipmaps},set:function(a){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.");this.texture.generateMipmaps=a}}});Object.assign(Ub.prototype,{load:function(a){console.warn("THREE.Audio: .load has been deprecated. Please use THREE.AudioLoader.");var b=this;(new zd).load(a,function(a){b.setBuffer(a)});
	    return this}});Object.assign(Cd.prototype,{getData:function(a){console.warn("THREE.AudioAnalyser: .getData() is now .getFrequencyData().");return this.getFrequencyData()}});Object.defineProperty(h,"AudioContext",{get:function(){return h.getAudioContext()}});h.WebGLRenderTargetCube=Ab;h.WebGLRenderTarget=zb;h.WebGLRenderer=od;h.ShaderLib=Cb;h.UniformsLib=U;h.ShaderChunk=Z;h.FogExp2=Eb;h.Fog=Fb;h.Scene=fb;h.LensFlare=pd;h.Sprite=fc;h.LOD=gc;h.SkinnedMesh=Pc;h.Skeleton=Nc;h.Bone=Oc;h.Mesh=va;h.LineSegments=
	    ha;h.Line=Pa;h.Points=Gb;h.Group=hc;h.VideoTexture=Qc;h.DataTexture=hb;h.CompressedTexture=Hb;h.CubeTexture=Ta;h.CanvasTexture=Rc;h.DepthTexture=ic;h.TextureIdCount=function(){return Pd++};h.Texture=ba;h.MaterialIdCount=function(){return Zd++};h.CompressedTextureLoader=ie;h.BinaryTextureLoader=rd;h.DataTextureLoader=rd;h.CubeTextureLoader=sd;h.TextureLoader=Sc;h.ObjectLoader=je;h.MaterialLoader=fd;h.BufferGeometryLoader=td;h.LoadingManager=qd;h.JSONLoader=ud;h.ImageLoader=yc;h.FontLoader=ke;h.XHRLoader=
	    za;h.Loader=sb;h.AudioLoader=zd;h.SpotLightShadow=Uc;h.SpotLight=Vc;h.PointLight=Wc;h.HemisphereLight=Tc;h.DirectionalLightShadow=Xc;h.DirectionalLight=Yc;h.AmbientLight=Zc;h.LightShadow=pb;h.Light=oa;h.StereoCamera=le;h.PerspectiveCamera=Ca;h.OrthographicCamera=Db;h.CubeCamera=gd;h.Camera=qa;h.AudioListener=Ad;h.PositionalAudio=Bd;h.getAudioContext=xd;h.AudioAnalyser=Cd;h.Audio=Ub;h.VectorKeyframeTrack=Sb;h.StringKeyframeTrack=cd;h.QuaternionKeyframeTrack=Ac;h.NumberKeyframeTrack=Tb;h.ColorKeyframeTrack=
	    ed;h.BooleanKeyframeTrack=dd;h.PropertyMixer=hd;h.PropertyBinding=ka;h.KeyframeTrack=rb;h.AnimationObjectGroup=Dd;h.AnimationMixer=Fd;h.AnimationClip=ta;h.Uniform=Gd;h.InstancedBufferGeometry=xb;h.BufferGeometry=I;h.GeometryIdCount=function(){return Lc++};h.Geometry=R;h.InterleavedBufferAttribute=Hd;h.InstancedInterleavedBuffer=Wb;h.InterleavedBuffer=Vb;h.InstancedBufferAttribute=Xb;h.DynamicBufferAttribute=function(a,b){console.warn("THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setDynamic( true ) instead.");
	    return(new z(a,b)).setDynamic(!0)};h.Float64Attribute=function(a,b){return new z(new Float64Array(a),b)};h.Float32Attribute=ma;h.Uint32Attribute=ce;h.Int32Attribute=function(a,b){return new z(new Int32Array(a),b)};h.Uint16Attribute=be;h.Int16Attribute=function(a,b){return new z(new Int16Array(a),b)};h.Uint8ClampedAttribute=function(a,b){return new z(new Uint8ClampedArray(a),b)};h.Uint8Attribute=function(a,b){return new z(new Uint8Array(a),b)};h.Int8Attribute=function(a,b){return new z(new Int8Array(a),
	    b)};h.BufferAttribute=z;h.Face3=ga;h.Object3DIdCount=function(){return ae++};h.Object3D=D;h.Raycaster=Id;h.Layers=Kc;h.EventDispatcher=pa;h.Clock=Kd;h.QuaternionLinearInterpolant=bd;h.LinearInterpolant=zc;h.DiscreteInterpolant=ad;h.CubicInterpolant=$c;h.Interpolant=ja;h.Triangle=Fa;h.Spline=function(a){function b(a,b,c,d,e,f,g){a=.5*(c-a);d=.5*(d-b);return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b}this.points=a;var c=[],d={x:0,y:0,z:0},e,f,g,h,l,m,u,p,n;this.initFromArray=function(a){this.points=[];
	    for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){e=(this.points.length-1)*a;f=Math.floor(e);g=e-f;c[0]=0===f?f:f-1;c[1]=f;c[2]=f>this.points.length-2?this.points.length-1:f+1;c[3]=f>this.points.length-3?this.points.length-1:f+2;m=this.points[c[0]];u=this.points[c[1]];p=this.points[c[2]];n=this.points[c[3]];h=g*g;l=g*h;d.x=b(m.x,u.x,p.x,n.x,g,h,l);d.y=b(m.y,u.y,p.y,n.y,g,h,l);d.z=b(m.z,u.z,p.z,n.z,g,h,l);return d};this.getControlPointsArray=function(){var a,
	    b,c=this.points.length,d=[];for(a=0;a<c;a++)b=this.points[a],d[a]=[b.x,b.y,b.z];return d};this.getLength=function(a){var b,c,d,e=0,f=new q,g=new q,h=[],k=0;h[0]=0;a||(a=100);c=this.points.length*a;f.copy(this.points[0]);for(a=1;a<c;a++)b=a/c,d=this.getPoint(b),g.copy(d),k+=g.distanceTo(f),f.copy(d),b*=this.points.length-1,b=Math.floor(b),b!==e&&(h[b]=k,e=b);h[h.length]=k;return{chunks:h,total:k}};this.reparametrizeByArcLength=function(a){var b,c,d,e,f,g,h=[],k=new q,l=this.getLength();h.push(k.copy(this.points[0]).clone());
	    for(b=1;b<this.points.length;b++){c=l.chunks[b]-l.chunks[b-1];g=Math.ceil(a*c/l.total);e=(b-1)/(this.points.length-1);f=b/(this.points.length-1);for(c=1;c<g-1;c++)d=e+1/g*c*(f-e),d=this.getPoint(d),h.push(k.copy(d).clone());h.push(k.copy(this.points[b]).clone())}this.points=h}};h.Spherical=Ld;h.Plane=fa;h.Frustum=dc;h.Sphere=Aa;h.Ray=Wa;h.Matrix4=P;h.Matrix3=ya;h.Box3=Ha;h.Box2=cc;h.Line3=cb;h.Euler=Xa;h.Vector4=da;h.Vector3=q;h.Vector2=C;h.Quaternion=ca;h.Color=H;h.MorphBlendMesh=la;h.ImmediateRenderObject=
	    Dc;h.VertexNormalsHelper=Ec;h.SpotLightHelper=Yb;h.SkeletonHelper=Zb;h.PointLightHelper=$b;h.HemisphereLightHelper=ac;h.GridHelper=Fc;h.FaceNormalsHelper=Gc;h.DirectionalLightHelper=bc;h.CameraHelper=Hc;h.BoundingBoxHelper=Ic;h.BoxHelper=Jc;h.ArrowHelper=yb;h.AxisHelper=id;h.ClosedSplineCurve3=pe;h.SplineCurve3=of;h.ArcCurve=jd;h.EllipseCurve=Ra;h.SplineCurve=tb;h.CubicBezierCurve=ub;h.QuadraticBezierCurve=vb;h.LineCurve=La;h.Shape=wb;h.ShapePath=vd;h.Path=Cc;h.Font=wd;h.CurvePath=Bc;h.Curve=Y;h.WireframeGeometry=
	    Ib;h.ParametricGeometry=jc;h.TetrahedronGeometry=kc;h.OctahedronGeometry=lc;h.IcosahedronGeometry=mc;h.DodecahedronGeometry=nc;h.PolyhedronGeometry=sa;h.TubeGeometry=wa;h.TorusKnotGeometry=oc;h.TorusKnotBufferGeometry=Jb;h.TorusGeometry=pc;h.TorusBufferGeometry=Kb;h.TextGeometry=qc;h.SphereBufferGeometry=ib;h.SphereGeometry=Lb;h.RingGeometry=rc;h.RingBufferGeometry=Mb;h.PlaneBufferGeometry=eb;h.PlaneGeometry=sc;h.LatheGeometry=tc;h.LatheBufferGeometry=Nb;h.ShapeGeometry=Ya;h.ExtrudeGeometry=ra;h.EdgesGeometry=
	    Ob;h.ConeGeometry=uc;h.ConeBufferGeometry=vc;h.CylinderGeometry=jb;h.CylinderBufferGeometry=Za;h.CircleBufferGeometry=Pb;h.CircleGeometry=wc;h.BoxBufferGeometry=db;h.BoxGeometry=kb;h.ShadowMaterial=Qb;h.SpriteMaterial=gb;h.RawShaderMaterial=Rb;h.ShaderMaterial=Da;h.PointsMaterial=Ja;h.MultiMaterial=xc;h.MeshPhysicalMaterial=lb;h.MeshStandardMaterial=Ka;h.MeshPhongMaterial=$a;h.MeshNormalMaterial=mb;h.MeshLambertMaterial=nb;h.MeshDepthMaterial=Ua;h.MeshBasicMaterial=Ia;h.LineDashedMaterial=ob;h.LineBasicMaterial=
	    na;h.Material=S;h.REVISION="81";h.MOUSE={LEFT:0,MIDDLE:1,RIGHT:2};h.CullFaceNone=0;h.CullFaceBack=1;h.CullFaceFront=2;h.CullFaceFrontBack=3;h.FrontFaceDirectionCW=0;h.FrontFaceDirectionCCW=1;h.BasicShadowMap=0;h.PCFShadowMap=1;h.PCFSoftShadowMap=2;h.FrontSide=0;h.BackSide=1;h.DoubleSide=2;h.FlatShading=1;h.SmoothShading=2;h.NoColors=0;h.FaceColors=1;h.VertexColors=2;h.NoBlending=0;h.NormalBlending=1;h.AdditiveBlending=2;h.SubtractiveBlending=3;h.MultiplyBlending=4;h.CustomBlending=5;h.BlendingMode=
	    qe;h.AddEquation=100;h.SubtractEquation=101;h.ReverseSubtractEquation=102;h.MinEquation=103;h.MaxEquation=104;h.ZeroFactor=200;h.OneFactor=201;h.SrcColorFactor=202;h.OneMinusSrcColorFactor=203;h.SrcAlphaFactor=204;h.OneMinusSrcAlphaFactor=205;h.DstAlphaFactor=206;h.OneMinusDstAlphaFactor=207;h.DstColorFactor=208;h.OneMinusDstColorFactor=209;h.SrcAlphaSaturateFactor=210;h.NeverDepth=0;h.AlwaysDepth=1;h.LessDepth=2;h.LessEqualDepth=3;h.EqualDepth=4;h.GreaterEqualDepth=5;h.GreaterDepth=6;h.NotEqualDepth=
	    7;h.MultiplyOperation=0;h.MixOperation=1;h.AddOperation=2;h.NoToneMapping=0;h.LinearToneMapping=1;h.ReinhardToneMapping=2;h.Uncharted2ToneMapping=3;h.CineonToneMapping=4;h.UVMapping=300;h.CubeReflectionMapping=301;h.CubeRefractionMapping=302;h.EquirectangularReflectionMapping=303;h.EquirectangularRefractionMapping=304;h.SphericalReflectionMapping=305;h.CubeUVReflectionMapping=306;h.CubeUVRefractionMapping=307;h.TextureMapping=re;h.RepeatWrapping=1E3;h.ClampToEdgeWrapping=1001;h.MirroredRepeatWrapping=
	    1002;h.TextureWrapping=Md;h.NearestFilter=1003;h.NearestMipMapNearestFilter=1004;h.NearestMipMapLinearFilter=1005;h.LinearFilter=1006;h.LinearMipMapNearestFilter=1007;h.LinearMipMapLinearFilter=1008;h.TextureFilter=Nd;h.UnsignedByteType=1009;h.ByteType=1010;h.ShortType=1011;h.UnsignedShortType=1012;h.IntType=1013;h.UnsignedIntType=1014;h.FloatType=1015;h.HalfFloatType=1016;h.UnsignedShort4444Type=1017;h.UnsignedShort5551Type=1018;h.UnsignedShort565Type=1019;h.UnsignedInt248Type=1020;h.AlphaFormat=
	    1021;h.RGBFormat=1022;h.RGBAFormat=1023;h.LuminanceFormat=1024;h.LuminanceAlphaFormat=1025;h.RGBEFormat=1023;h.DepthFormat=1026;h.DepthStencilFormat=1027;h.RGB_S3TC_DXT1_Format=2001;h.RGBA_S3TC_DXT1_Format=2002;h.RGBA_S3TC_DXT3_Format=2003;h.RGBA_S3TC_DXT5_Format=2004;h.RGB_PVRTC_4BPPV1_Format=2100;h.RGB_PVRTC_2BPPV1_Format=2101;h.RGBA_PVRTC_4BPPV1_Format=2102;h.RGBA_PVRTC_2BPPV1_Format=2103;h.RGB_ETC1_Format=2151;h.LoopOnce=2200;h.LoopRepeat=2201;h.LoopPingPong=2202;h.InterpolateDiscrete=2300;h.InterpolateLinear=
	    2301;h.InterpolateSmooth=2302;h.ZeroCurvatureEnding=2400;h.ZeroSlopeEnding=2401;h.WrapAroundEnding=2402;h.TrianglesDrawMode=0;h.TriangleStripDrawMode=1;h.TriangleFanDrawMode=2;h.LinearEncoding=3E3;h.sRGBEncoding=3001;h.GammaEncoding=3007;h.RGBEEncoding=3002;h.LogLuvEncoding=3003;h.RGBM7Encoding=3004;h.RGBM16Encoding=3005;h.RGBDEncoding=3006;h.BasicDepthPacking=3200;h.RGBADepthPacking=3201;h.CubeGeometry=kb;h.Face4=function(a,b,c,d,e,f,g){console.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead.");
	    return new ga(a,b,c,e,f,g)};h.LineStrip=0;h.LinePieces=1;h.MeshFaceMaterial=xc;h.PointCloud=function(a,b){console.warn("THREE.PointCloud has been renamed to THREE.Points.");return new Gb(a,b)};h.Particle=fc;h.ParticleSystem=function(a,b){console.warn("THREE.ParticleSystem has been renamed to THREE.Points.");return new Gb(a,b)};h.PointCloudMaterial=function(a){console.warn("THREE.PointCloudMaterial has been renamed to THREE.PointsMaterial.");return new Ja(a)};h.ParticleBasicMaterial=function(a){console.warn("THREE.ParticleBasicMaterial has been renamed to THREE.PointsMaterial.");
	    return new Ja(a)};h.ParticleSystemMaterial=function(a){console.warn("THREE.ParticleSystemMaterial has been renamed to THREE.PointsMaterial.");return new Ja(a)};h.Vertex=function(a,b,c){console.warn("THREE.Vertex has been removed. Use THREE.Vector3 instead.");return new q(a,b,c)};h.EdgesHelper=function(a,b){console.warn("THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead.");return new ha(new Ob(a.geometry),new na({color:void 0!==b?b:16777215}))};h.WireframeHelper=function(a,b){console.warn("THREE.WireframeHelper has been removed. Use THREE.WireframeGeometry instead.");
	    return new ha(new Ib(a.geometry),new na({color:void 0!==b?b:16777215}))};h.GeometryUtils={merge:function(a,b,c){console.warn("THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.");var d;b.isMesh&&(b.matrixAutoUpdate&&b.updateMatrix(),d=b.matrix,b=b.geometry);a.merge(b,d,c)},center:function(a){console.warn("THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.");return a.center()}};h.ImageUtils=
	  {crossOrigin:void 0,loadTexture:function(a,b,c,d){console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");var e=new Sc;e.setCrossOrigin(this.crossOrigin);a=e.load(a,c,void 0,d);b&&(a.mapping=b);return a},loadTextureCube:function(a,b,c,d){console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");var e=new sd;e.setCrossOrigin(this.crossOrigin);a=e.load(a,c,void 0,d);b&&(a.mapping=b);return a},loadCompressedTexture:function(){console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")},
	    loadCompressedTextureCube:function(){console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")}};h.Projector=function(){console.error("THREE.Projector has been moved to /examples/js/renderers/Projector.js.");this.projectVector=function(a,b){console.warn("THREE.Projector: .projectVector() is now vector.project().");a.project(b)};this.unprojectVector=function(a,b){console.warn("THREE.Projector: .unprojectVector() is now vector.unproject().");a.unproject(b)};
	    this.pickingRay=function(a,b){console.error("THREE.Projector: .pickingRay() is now raycaster.setFromCamera().")}};h.CanvasRenderer=function(){console.error("THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js");this.domElement=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");this.clear=function(){};this.render=function(){};this.setClearColor=function(){};this.setSize=function(){}};Object.defineProperty(h,"__esModule",{value:!0})});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var PositionConverter = __webpack_require__(5);
	var Textures = __webpack_require__(2);
	var Static = __webpack_require__(6);
	var Colors = __webpack_require__(7);

	/**
	 * Factory for reusable meshes and materials.
	 */

	var masterBotGeometry, masterBotStripesGeometry, miniBotGeometry, beastGeometry, flowerGeometry;
	var masterBotMaterials, masterBotStripeMaterials, miniBotMaterials, goodBeastMaterial, badBeastMaterial,
	  goodFlowerMaterial, badFlowerMaterial, wallMaterial, floorMaterial;

	// Object
	var MeshFactory = {};
	MeshFactory.explosionMeshes = {};

	/**
	 * Init mesh factory
	 */
	MeshFactory.initMesh = function () {
	  masterBotGeometry = new THREE.SphereBufferGeometry(9.5, 32, 32);
	  masterBotStripesGeometry = new THREE.DodecahedronGeometry(10.8);
	  miniBotGeometry = new THREE.SphereBufferGeometry(5, 6, 6);
	  beastGeometry = new THREE.TorusBufferGeometry(3.8, 1.3, 3, 5);
	  flowerGeometry = new THREE.ConeBufferGeometry(4.4, 5, 5);

	  masterBotMaterials = __generateMasterBotMaterials();
	  masterBotStripeMaterials = __generateMasterBotStripeMaterials();
	  miniBotMaterials = __generateMiniBotMaterials();

	  goodBeastMaterial = new THREE.MeshPhongMaterial({
	    color: 0x0000ff,
	    specular: 0x888888,
	    shininess: 30
	  });
	  badBeastMaterial = new THREE.MeshPhongMaterial({
	    color: 0xff0000,
	    specular: 0x888888,
	    shininess: 30
	  });
	  goodFlowerMaterial = new THREE.MeshPhongMaterial({
	    color: 0x00ff00,
	    specular: 0xffffff,
	    shininess: 10,
	    shading: THREE.FlatShading
	  });
	  badFlowerMaterial = new THREE.MeshPhongMaterial({
	    color: 0xffff00,
	    specular: 0xffffff,
	    shininess: 10,
	    shading: THREE.FlatShading
	  });
	  floorMaterial = new THREE.MeshPhongMaterial({
	    color: 0x888888,
	    shininess: 80,
	    shading: THREE.FlatShading,
	    map: Textures.Floor
	  });
	  wallMaterial = new THREE.MeshPhongMaterial({
	    color: 0x383838,
	    shininess: 200,
	    shading: THREE.FlatShading
	  });

	  MeshFactory.explosionMeshes = __generateExplosionMeshes();
	};

	/**
	 * Creates a master bot body mesh.
	 * @param masterBotId - Number
	 * @returns THREE.Mesh
	 */
	MeshFactory.createBotBodyMesh = function (masterBotId) {
	  var color = Colors.getColor(masterBotId);
	  var material = masterBotMaterials[color.sec];
	  return new THREE.Mesh(masterBotGeometry, material);
	};

	/**
	 * Creates a master bot stripe mesh.
	 * @param masterBotId - Number
	 * @returns THREE.Mesh
	 */
	MeshFactory.createBotStripeMesh = function (masterBotId) {
	  var color = Colors.getColor(masterBotId);
	  var material = masterBotStripeMaterials[color.pri];
	  return new THREE.Mesh(masterBotStripesGeometry, material);
	};

	/**
	 * Creates a mini bot body mesh.
	 * @param masterBotId - Number
	 * @returns THREE.Mesh
	 */
	MeshFactory.createMiniBotMesh = function (masterBotId) {
	  var color = Colors.getColor(masterBotId);
	  var priMaterial = miniBotMaterials[color.sec];
	  return new THREE.Mesh(miniBotGeometry, priMaterial);
	};

	/**
	 * Creates a good beast mesh
	 * @returns THREE.Mesh
	 */
	MeshFactory.createGoodBeastMesh = function () {
	  return new THREE.Mesh(beastGeometry, goodBeastMaterial);
	};

	/**
	 * Creates a bad beast mesh
	 * @returns THREE.Mesh
	 */
	MeshFactory.createBadBeastMesh = function () {
	  return new THREE.Mesh(beastGeometry, badBeastMaterial);
	};

	/**
	 * Creates a good flower mesh
	 * @returns THREE.Mesh
	 */
	MeshFactory.createGoodFlowerMesh = function () {
	  return new THREE.Mesh(flowerGeometry, goodFlowerMaterial);
	};

	/**
	 * Creates a bad flower mesh
	 * @returns THREE.Mesh
	 */
	MeshFactory.createBadFlowerMesh = function () {
	  return new THREE.Mesh(flowerGeometry, badFlowerMaterial);
	};

	/**
	 * Creates a floor mesh
	 * @params width - Size in 2d tiles
	 * @params height - Size in 2d tiles
	 * @returns THREE.Mesh
	 */
	MeshFactory.createFloorMesh = function (width, height) {
	  var geometry = new THREE.BoxBufferGeometry(width * Static.TileSize, height * Static.TileSize, 1);
	  var mesh = new THREE.Mesh(geometry, material);
	  mesh.position.x = ((width * Static.TileSize) / 2) - (Static.TileSize / 2);
	  mesh.position.y = ((height * Static.TileSize) / 2) + (Static.TileSize / 2);
	  return mesh;
	};

	/**
	 * Creates a floor mesh
	 * @params boardData
	 * @returns THREE.Object3D
	 */
	MeshFactory.createBoard = function (boardData) {
	  var floorGeometry = new THREE.BoxBufferGeometry(boardData.width * Static.TileSize, boardData.height * Static.TileSize, 1);
	  var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
	  floorMesh.position.x = ((boardData.width * Static.TileSize) / 2) - (Static.TileSize / 2);
	  floorMesh.position.y = ((boardData.height * Static.TileSize) / 2) + (Static.TileSize / 2);
	  floorMesh.position.z = -4;

	  var combinedGeo = new THREE.Geometry();
	  for (var i = 0; i < boardData.walls.length; i++) {
	    var wall = boardData.walls[i];
	    var width = wall.e.x * Static.TileSize;
	    var height = wall.e.y * Static.TileSize;

	    var wallGeometry = new THREE.BoxGeometry(width, height, 12);
	    var wallMesh = new THREE.Mesh(wallGeometry);
	    var vec3d = PositionConverter.convert(new THREE.Vector2(wall.x, wall.y), true);
	    wallMesh.position.x = vec3d.x + (width / 2);
	    wallMesh.position.y = vec3d.y - (height / 2);
	    wallMesh.position.z = 0;
	    wallMesh.updateMatrix();
	    combinedGeo.merge(wallMesh.geometry, wallMesh.matrix);
	  }

	  var combinedWallMesh = new THREE.Mesh(combinedGeo, wallMaterial);
	  var boardObj = new THREE.Object3D();
	  boardObj.add(floorMesh);
	  boardObj.add(combinedWallMesh);
	  return boardObj;
	};


	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Generates master bot base materials.
	 * @returns Array of materials
	 * @private
	 */
	function __generateMasterBotMaterials() {
	  var materials = [];
	  for (var i = 1; i <= Colors.count; i++) {
	    materials.push(
	      new THREE.MeshPhongMaterial({
	        color: Colors.col[i],
	        specular: 0x555555,
	        shininess: 800,
	        map: Textures.Bot
	      })
	    );
	  }
	  return materials;
	}

	/**
	 * Generates master bot stripe materials.
	 * @returns Array of materials
	 * @private
	 */
	function __generateMasterBotStripeMaterials() {
	  var materials = [];
	  for (var i = Colors.count; i > 0; i--) {
	    materials.push(
	      new THREE.MeshPhongMaterial({
	        color: Colors.col[i],
	        specular: 0x222222,
	        shininess: 10,
	        shading: THREE.FlatShading
	      })
	    );
	  }
	  return materials;
	}

	/**
	 * Generates mini bot base materials.
	 * @returns Array of materials
	 * @private
	 */
	function __generateMiniBotMaterials() {
	  var materials = [];
	  for (var i = 1; i <= Colors.count; i++) {
	    materials.push(
	      new THREE.MeshStandardMaterial({
	        color: Colors.col[i],
	        map: Textures.MiniBot,
	        roughness: 0.35,
	        metalness: 0.52
	      })
	    );
	  }
	  return materials;
	}

	/**
	 * Pre create explosion meshes.
	 * @returns Object collection of meshes
	 * @private
	 */
	function __generateExplosionMeshes() {
	  var meshes = {};
	  for(var rad = 1; rad <= 10; rad++) {
	    meshes[rad] = MeshFactory.createExplosion(rad);
	  }
	  return meshes;
	}

	/**
	 * Creates a explosion mesh
	 * @returns THREE.Mesh
	 */
	MeshFactory.createExplosion = function(tileRadius) {
	  var geometry = new THREE.SphereBufferGeometry(tileRadius * Static.TileSize, 16, 16);

	  var material = new THREE.MeshLambertMaterial({
	    transparent: true,
	    map: Textures.Explosion,
	    opacity: 0.5
	  });
	  return new THREE.Mesh(geometry, material);
	};

	// Export object
	module.exports = MeshFactory;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var Static = __webpack_require__(6);

	/**
	 * Converts 2d grid position to 3d world vector.
	 */

	var boardHeight = 0;

	// Object
	var PositionConverter = {};

	/**
	 * Init, should run after board setup.
	 * @param height - board height
	 */
	PositionConverter.init = function (height) {
	  boardHeight = height;
	};

	/**
	 * Coverts tile 2d position to world 3d position.
	 * @param pos - THREE.Vector2, tile position on board
	 * @param offset - Use tile offset?
	 * @returns THREE.Vector3 - Position in 3d space
	 */
	PositionConverter.convert = function (pos, noOffset) {
	  var offset = (noOffset) ? 0 : (Static.TileSize / 2);
	  return new THREE.Vector3(
	    (pos.x * Static.TileSize) + offset,
	    (-(pos.y * Static.TileSize)) + (boardHeight * Static.TileSize) - offset,
	    0
	  );
	};

	// Export object
	module.exports = PositionConverter;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Static shared constants.
	 */

	// Export object
	module.exports = {
	  TileSize: 10,
	  TimePerTick: 100
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);

	/**
	 * Bot colors
	 */

	var botColors = {};
	var usedCount = 0;
	var colorCount = 7;

	// Object
	var Colors = {
	  count: colorCount,
	  col: {
	    1: new THREE.Color(0x000000),
	    2: new THREE.Color(0xd90d0d),
	    3: new THREE.Color(0x29ff03),
	    4: new THREE.Color(0x2d03ff),
	    5: new THREE.Color(0xec08d9),
	    6: new THREE.Color(0x03fbff),
	    7: new THREE.Color(0xffffff)
	  },
	  combinations: __generateColorCombinations()
	};

	/**
	 * Reserve a color for a bot.
	 * @param tickData
	 */
	Colors.reserveColors = function(tickData) {
	  for(var i = 0; i < tickData.bots.length; i++) {
	    var entity = tickData.bots[i];
	    if(entity.t == "M") {
	      usedCount++;
	      botColors[entity.t + entity.id] = Colors.combinations[usedCount];
	    }
	  }
	};

	/**
	 * Get color for a id.
	 * @param id
	 */
	Colors.getColor = function(id) {
	  return botColors[id];
	};


	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Generates color combination matrix.
	 * @returns Object - color matrix
	 * @private
	 */
	function __generateColorCombinations() {
	  var combinations = {};
	  for (var s = 1; s <= colorCount; s++) {
	    for (var p = 1; p <= colorCount; p++) {
	      combinations[(s + (p * colorCount)) - colorCount] = {pri: p - 1, sec: s - 1}
	    }
	  }
	  return combinations;
	}


	// Export object
	module.exports = Colors;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Audio manager.
	 */
	// Object
	var Audio = {};

	var soundFX = {};
	var soundFXCount = {};
	var MaxChannels = 10;
	var music;

	/**
	 * Load sounds
	 * TODO: Check how to preload.
	 */
	Audio.load = function () {
	  if(hasAudio()) {
	    //music = createAudio("audio/music/blipstream.mp3", 0.5, true);
	    /*
	    soundFX["DIE"] = createFxAudio("audio/sound-fx/die.mp3");
	    soundFX["EAT"] = createFxAudio("audio/sound-fx/eat.mp3");
	    soundFX["EXPLOSION"] = createFxAudio("audio/sound-fx/explosion.mp3");
	    soundFX["WALL-HIT"] = createFxAudio("audio/sound-fx/wall-hit.mp3");
	    soundFXCount["DIE"] = 0;
	    soundFXCount["EAT"] = 0;
	    soundFXCount["EXPLOSION"] = 0;
	    soundFXCount["WALL-HIT"] = 0;
	    */

	     //music.play();
	  }
	};

	/**
	 * Play sound effect.
	 */
	Audio.playSound = function(key) {
	  if(soundFX[key] !== undefined)
	  soundFX[key][soundFXCount[key]].play();
	  soundFXCount[key]++;
	  if(soundFXCount[key] >= MaxChannels) {
	    soundFXCount[key] = 0;
	  }
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


	/**
	 * Create an audio element.
	 * @param src
	 * @param volume
	 * @param isLooping
	 * @returns {Element} - Audio
	 */
	function createAudio(src, volume, isLooping) {
	  var audio = document.createElement('audio');
	  audio.volume = volume || 0.5;
	  audio.loop = isLooping;
	  audio.src = src;
	  return audio;
	}

	/**
	 * Prepares polyphonic channels.
	 * @returns {Array} - of Audio elements
	 */
	function createFxAudio(src, volume) {
	  var audio = createAudio(src, volume, false);
	  var audioArr = [];
	  for(var i = 0; i < MaxChannels; i++) {
	    var copy = audio.cloneNode();
	    copy.volume = audio.volume;
	    audioArr.push(audio.cloneNode());
	  }
	  return audioArr;
	}

	/**
	 * Check if audio is supported.
	 * @returns bool
	 */
	function hasAudio() {
	  var audio = document.createElement('audio');
	  return audio && audio.canPlayType;
	}

	// Export object
	module.exports =  Audio;




/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(10);
	var BoardCreator = __webpack_require__(29);
	var Static = __webpack_require__(6);
	var Colors = __webpack_require__(7);

	/**
	 * The simulation is the main "game engine".
	 * It is responsible for managing each Scalatron server tick.
	 */
	var board = new Board();
	var tickCount = 0;
	var isRunning = false;
	var tickQueue = [];
	var queueLength = 0;
	var mainLoopId;

	/**
	 * Create a simulation.
	 * @constructor
	 */
	function Simulation() {
	}

	/**
	 * Starts the main "tick loop".
	 * Tick loop matches each "Scalatron tick", not to be confused
	 * with the main render loop that draws on screen.
	 */
	Simulation.prototype.runSimulation = function () {
	  isRunning = true;
	  if (tickQueue.length > 0) {
	    var firstTick = tickQueue[0];
	    board.init(BoardCreator.create(firstTick));
	    Colors.reserveColors(firstTick);
	    board.runSimulation();
	    __startMainTickLoop();
	    return;
	  }
	  throw new Error("Could not run simulation. No initial tick data.");
	};

	/**
	 * Adds tick to the queue
	 * @param tickData
	 */
	Simulation.prototype.addTick = function (tickData) {
	  tickQueue.push(tickData);
	  queueLength++;
	  if (!isRunning) {
	    this.runSimulation();
	  }
	};

	/**
	 * Change the simulation speed
	 * @param tickData
	 */
	Simulation.prototype.changeSpeed = function (timePerTick) {
	  Static.TimePerTick = timePerTick;
	  clearInterval(mainLoopId);
	  __startMainTickLoop();
	};


	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Starts the main tick loop.
	 * @private
	 */
	function __startMainTickLoop() {
	  mainLoopId = setInterval(function () {
	    if (tickCount < queueLength) {
	      __tick(tickQueue[tickCount]);
	    } else {
	      log("Not ticks.. Skip");
	      clearInterval(mainLoopId);
	      setTimeout(__startMainTickLoop, 5000);
	    }
	  }.bind(this), Static.TimePerTick);
	}

	/**
	 * Perform a tick.
	 * @param tickData
	 * @private
	 */
	function __tick(tickData) {
	  var targetTime = new Date().getTime() + Static.TimePerTick;
	  board.tick(tickCount, targetTime, tickData);
	  tickCount++;
	}

	// Export "class"
	module.exports =  Simulation;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var PositionConverter = __webpack_require__(5);
	var Manipulator = __webpack_require__(11);
	var Instructor = __webpack_require__(26);
	var World = __webpack_require__(27);
	var MeshFactory = __webpack_require__(4);

	/**
	 * Board is a 2d representation the Scalatron board.
	 */

	var world = new World();
	var boardData = null;
	var node = new THREE.Object3D();

	/**
	 *  Create the 3d board
	 * @constructor
	 */
	function Board() {
	}

	/**
	 * Init the board
	 * @param board - Object containing board/tile data.
	 */
	Board.prototype.init = function (board) {
	  boardData = board;
	  PositionConverter.init(boardData.height);
	  node = MeshFactory.createBoard(boardData);
	  world.init(boardData);
	  world.addStatic(node);
	};

	/**
	 * Starts the simulation.
	 */
	Board.prototype.runSimulation = function () {
	  world.render();
	};

	/**
	 * Handle a Scalatron server tick.
	 * @param tickCount
	 * @param targetTime - Target time for tick completion (in ms).
	 * @param tickData
	 */
	Board.prototype.tick = function (tickCount, targetTime, tickData) {
	  Manipulator.tickCount = tickCount;
	  Manipulator.tickStartTime = new Date().getTime();
	  Manipulator.nextTickTargetTime = targetTime;
	  Instructor.handleTick(tickData);
	};


	// Export "class"
	module.exports = Board;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var MoveBehaviour = __webpack_require__(12);
	var SpinBehaviour = __webpack_require__(14);
	var SpawningBehaviour = __webpack_require__(17);
	var SpawnedBehaviour = __webpack_require__(18);
	var BeastBehaviour = __webpack_require__(19);
	var ExplosionBehaviour = __webpack_require__(21);
	var DyingBehaviour = __webpack_require__(22);
	var ExplosionNode = __webpack_require__(23);
	var FlowerNode = __webpack_require__(24);
	var MiniBotNode = __webpack_require__(15);
	var MasterBotNode = __webpack_require__(25);
	var State = __webpack_require__(13);

	/**
	 * Manages and manipulates objects in the 3d world.
	 */

	var simulationObjects = {};

	// Object
	var Manipulator = {};

	/**
	 * Is last frame done?
	 */
	Manipulator.isLastDone = true;

	/**
	 * The World
	 */
	Manipulator.world = null;

	/**
	 * The Camera
	 */
	Manipulator.camera = null;

	/**
	 * Current tick number
	 */
	Manipulator.frameCount = 0;

	/**
	 * Current tick number
	 */
	Manipulator.tickCount = 0;

	/**
	 * Tick started (in ms.)
	 */
	Manipulator.tickStartTime = 0;

	/**
	 * Target time for next tick completion (in ms).
	 */
	Manipulator.nextTickTargetTime = 0;

	/**
	 * Array of players master bots.
	 */
	Manipulator.players = [];

	/**
	 * Array of players master bots.
	 */
	Manipulator.cameraFollow = -1;
	Manipulator.raceCam = false;
	Manipulator.raceCamCount = 0;

	/**
	 * Manipulates all objects for each frame draw.
	 * Call this on every frame request.
	 * TODO: Refactoring, smaller method.
	 */
	Manipulator.updateFrame = function () {
	  Manipulator.isLastDone = false;
	  Manipulator.frameCount++;
	  var timeFraction = __calculateTimeFraction();
	  for (var index in simulationObjects) {
	    if (simulationObjects.hasOwnProperty(index)) {
	      var obj = simulationObjects[index];
	      MoveBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
	      SpinBehaviour.apply(obj);
	      SpawningBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
	      SpawnedBehaviour.apply(obj, timeFraction);
	      BeastBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
	      DyingBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
	      ExplosionBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
	    }
	  }
	  __moveCamera();
	  __cleanSimulationObjects();
	  Manipulator.isLastDone = true;
	};

	/**
	 * Adds a 3d object
	 * @param obj
	 */
	Manipulator.add = function (obj) {
	  simulationObjects[obj.id] = obj;
	  Manipulator.world.scene.add(obj.node);
	  if(obj.constructor === MasterBotNode) {
	    Manipulator.players.push(obj);
	  }
	};

	/**
	 * Retrieves a 3d object
	 * @param id
	 * @returns Objects - if found, else null
	 */
	Manipulator.retrieve = function (id) {
	  return simulationObjects[id];
	};

	/**
	 * Clears unused objects.
	 * @param ids - ids (index) for object
	 */
	Manipulator.clearUnused = function (ids) {
	  for (var index in simulationObjects) {
	    if (simulationObjects.hasOwnProperty(index)) {
	      if (ids[index] === undefined) {
	        if (simulationObjects[index].constructor === FlowerNode) {
	          simulationObjects[index].state = State.DYING;
	        } else if (simulationObjects[index].constructor === MiniBotNode) {
	          simulationObjects[index].state = State.DYING;
	        } else if (simulationObjects[index].constructor !== ExplosionNode) {
	          simulationObjects[index].state = State.REMOVE;
	        }
	      }
	    }
	  }
	};

	/**
	 * Cycle player camera follow
	 */
	Manipulator.cyclePlayerCamera = function () {
	  Manipulator.cameraFollow = (Manipulator.cameraFollow >= Manipulator.players.length - 1) ? -1 : Manipulator.cameraFollow + 1;
	};

	/**
	 * Toggle race cam
	 */
	Manipulator.toggleRaceCam = function () {
	  Manipulator.raceCam = !Manipulator.raceCam;
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Calculate time fraction of frame.
	 * @returns Number
	 * @private
	 */
	function __calculateTimeFraction() {
	  var now = new Date().getTime();
	  var tickLength = (Manipulator.nextTickTargetTime - Manipulator.tickStartTime);
	  return (now - Manipulator.tickStartTime) / tickLength;
	}

	/**
	 * Removes simulation objects that are not part
	 * of simulation any more.
	 * @private
	 */
	function __cleanSimulationObjects() {
	  for (var index in simulationObjects) {
	    if (simulationObjects.hasOwnProperty(index)) {
	      var obj = simulationObjects[index];
	      if (obj.state == State.REMOVE) {
	        Manipulator.world.scene.remove(obj.node);
	        delete simulationObjects[index];
	      }
	    }
	  }
	}

	/**
	 * Moves the camera (if player follow)
	 * @private
	 */
	function __moveCamera() {
	  if(Manipulator.cameraFollow >= 0) {
	    var cam = Manipulator.camera;
	    var bot = Manipulator.players[Manipulator.cameraFollow];

	    var x = bot.node.position.x;
	    var y = bot.node.position.y;

	    if(Manipulator.raceCam) {
	      Manipulator.raceCamCount++;
	      cam.position.z = 60;
	      if(Manipulator.raceCamCount > 350) {
	        cam.position.set(x, y - 50, 60);
	        Manipulator.raceCamCount = 0;
	      }
	      cam.up = new THREE.Vector3(0,0,1);

	    } else {
	      cam.position.set(x, y - (y / 20), 300);
	    }
	    cam.lookAt(new THREE.Vector3(x, y, 0));
	  } else {
	    Manipulator.world.resetCamera();
	  }
	}

	// Export object
	module.exports = Manipulator;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);

	/**
	 * Moves 3d objects in world.
	 * Requires the target object to have a property
	 * "move" of type MoveResponder
	 */

	// Object
	var MoveVisitor = {};

	/**
	 * Set up move instruction for 3d objects.
	 * @param simObj - simulation object to be moved
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 */
	MoveVisitor.apply = function (simObj, tickCount, timeFraction) {
	  timeFraction = __calcTimeFraction(simObj, tickCount, timeFraction);
	  if (simObj.move !== undefined && simObj.state == State.MOVING) {
	    simObj.node.position.x = __calculateVelocity(
	      simObj.move.originPosition.x, simObj.move.targetPosition.x, timeFraction);
	    simObj.node.position.y = __calculateVelocity(
	      simObj.move.originPosition.y, simObj.move.targetPosition.y, timeFraction);
	  }
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Calculate simulation velocity (per frame draw) for 3d object.
	 * @param origin - Number
	 * @param destination - Number
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * @returns {number}
	 * @private
	 */
	function __calculateVelocity(origin, destination, timeFraction) {
	  var distance = destination - origin;
	  return origin + (distance * timeFraction);
	}

	/**
	 * Calculate simulation object's real time fraction.
	 * Master bots only move every other, and beast every 4th etc.
	 * @param simObj - simulation object to be moved
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * @returns {number}
	 * @private
	 */
	function __calcTimeFraction(simObj, tickCount, timeFraction) {
	  if (simObj.move === undefined) {
	    return timeFraction;
	  }
	  return simObj.move.calcTimeFraction(tickCount, timeFraction);
	}

	// Export object
	module.exports = MoveVisitor;

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Simulation object state enum.
	 */

	// Return object
	module.exports = Object.freeze({
	  "IDLING": 1,
	  "MOVING": 2,
	  "SPAWNING": 3,
	  "SPAWNED": 4,
	  "DYING": 5,
	  "WALL_BUMPING": 6,
	  "EXPLODE": 7,
	  "EXPLODING": 8,
	  "REMOVE": 9
	});


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var MiniBotNode = __webpack_require__(15);
	var MasterBotNode = __webpack_require__(25);

	/**
	 * Behaviour for constantly spinning 3d objects.
	 */

	// Object
	var SpinBehaviour = {};

	/**
	 * Create move behaviour
	 * @param obj - Simulation object
	 */
	SpinBehaviour.apply = function (obj) {
	  if (obj !== undefined) {
	    if (obj instanceof MiniBotNode) {
	      obj.node.rotation.x += (Math.random() * (0.12) + 0.010);
	      obj.node.rotation.z += (Math.random() * (0.012) + 0.010);
	    } else if (obj instanceof MasterBotNode) {
	      var speed = 0.06

	      if (obj.move.originPosition.x > obj.move.targetPosition.x) {
	        obj.node.rotation.z -= speed;
	      } else if (obj.move.originPosition.x < obj.move.targetPosition.x) {
	        obj.node.rotation.z += speed;
	      }

	      if (obj.move.originPosition.y > obj.move.targetPosition.y) {
	        obj.node.rotation.x += speed;
	      } else if (obj.move.originPosition.y < obj.move.targetPosition.y) {
	        obj.node.rotation.x -= speed;
	      }

	    }
	  }
	};

	// Export Object
	module.exports = SpinBehaviour;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var State = __webpack_require__(13);
	var MeshFactory = __webpack_require__(4);
	var MoveResponder = __webpack_require__(16);

	/**
	 * Represents a Mini Bot (Spawn)
	 */


	/**
	 * Create a Mini bot
	 * @param id - String, object's id
	 * @param mid - String, master bot id
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @constructor
	 */
	function MiniBotNode(id, mid, initialPos) {
	  this.id = id;
	  this.mid = mid;
	  this.state = State.IDLING;
	  this.node = new THREE.Object3D();
	  this.node.add(MeshFactory.createMiniBotMesh(this.mid));
	  this.node.position.z = 3.5;
	  this.move = new MoveResponder(initialPos);
	  this.move.placeOrigin(this.node);
	  this.move.stepOffset = 1;
	  this.explodedTick = -1;

	  this.node.rotation.y = 50;
	}

	// Export "class"
	module.exports = MiniBotNode;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var PositionConverter = __webpack_require__(5);

	/**
	 * Responder for movable 3d objects.
	 * Reacts to the Mover visitor.
	 * Should always be stored in a property named "move"
	 * on target object.
	 */

	/**
	 * Create move behaviour
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @constructor
	 */
	function MoveResponder(initialPos) {
	  this.stepCount = -1;
	  this.stepOffset = 1;
	  this.gridPos = initialPos;
	  this.originPosition = PositionConverter.convert(initialPos);
	  this.targetPosition = PositionConverter.convert(initialPos);
	}

	/**
	 * Sets a new target (using 2d grid position)
	 * @param target - THREE.Vector2
	 */
	MoveResponder.prototype.setTargetPosition = function (target) {
	  this.stepCount++;
	  if ((this.stepCount % this.stepOffset) == 0) {
	    if (!__isWarp(target, this.gridPos)) {
	      this.originPosition = this.targetPosition;
	      this.targetPosition = PositionConverter.convert(target);
	    } else {
	      this.originPosition = PositionConverter.convert(target);
	      this.targetPosition = PositionConverter.convert(target);
	    }
	    this.gridPos = target;
	  }
	};

	/**
	 * Instantly move the node to origin position.
	 * @param node - 3d object
	 */
	MoveResponder.prototype.placeOrigin = function (node) {
	  node.position.x = this.originPosition.x;
	  node.position.y = this.originPosition.y;
	};

	/**
	 * Calculate this move objects
	 * Some objects move offset from global tick count.
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * @returns {number}
	 */
	MoveResponder.prototype.calcTimeFraction = function (tickCount, timeFraction) {
	  var mod = (this.stepCount % this.stepOffset) / this.stepOffset;
	  return (timeFraction / this.stepOffset) + mod;
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


	/**
	 * Checks if move "warps" the board.
	 * @param target
	 * @param gridPos
	 * @returns {boolean}
	 * @private
	 */
	function __isWarp(target, gridPos) {

	  var xDif = Math.abs(target.x - gridPos.x);
	  var yDif = Math.abs(target.y - gridPos.y);
	  return (xDif + yDif) > 2;
	}

	// Export "class"
	module.exports = MoveResponder;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);

	/**
	 * Behaviour for Master Bot when spawning.
	 */

	// Object
	var SpawningBehaviour = {};

	/**
	 * Create move behaviour
	 * @param obj - MasterBotNode
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * TODO: More functions...
	 */
	SpawningBehaviour.apply = function (obj, tickCount, timeFraction) {
	  if (obj !== undefined && obj.state == State.SPAWNING) {
	    if (obj.calcTimeFraction !== undefined) {
	      timeFraction = obj.calcTimeFraction(tickCount, timeFraction);
	    }
	    if (timeFraction < 0.35) {
	      var scale = 1 - (timeFraction / 4);
	      obj.node.scale.x = Math.max(scale , 0.1);
	      obj.node.scale.y = Math.max(scale , 0.1);
	    } else if (timeFraction < 0.5) {
	      obj.node.scale.x = Math.max((timeFraction * 2) + 0.25, 0.1);
	      obj.node.scale.y = Math.max((timeFraction * 2) + 0.25, 0.1);
	    } else if (timeFraction < 0.75) {
	      obj.node.scale.x = 1;
	      obj.node.scale.y = 1;
	    }
	  }
	};

	// Export Object
	module.exports = SpawningBehaviour;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);

	/**
	 * Behaviour for 3d object when spawned.
	 */

	// Object
	var SpawnedBehaviour = {};

	/**
	 * Create spawned behaviour
	 * @param obj - MasterBotNode
	 * @param timeFraction - Time fraction of current tick (in ms)
	 */
	SpawnedBehaviour.apply = function (obj, timeFraction) {
	  if (obj !== undefined && obj.state == State.SPAWNED) {
	    obj.node.scale.x = Math.max(timeFraction, 0.01);
	    obj.node.scale.y = Math.max(timeFraction, 0.01);

	  } else {
	    obj.node.scale.x = 1.0;
	    obj.node.scale.y = 1.0;
	    obj.node.scale.z = 1.0;
	  }
	};

	// Export Object
	module.exports = SpawnedBehaviour;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var BeastNode = __webpack_require__(20);
	var State = __webpack_require__(13);

	/**
	 * Behaviour for beast
	 */

	// Object
	var BeastBehaviour = {};

	/**
	 * Create move behaviour
	 * @param obj - Simulation object
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 */
	BeastBehaviour.apply = function (obj, tickCount, timeFraction) {
	  if (obj !== undefined && obj instanceof BeastNode && obj.state != State.DYING) {
	    timeFraction = obj.move.calcTimeFraction(tickCount, timeFraction);
	    obj.node.rotation.z -= (Math.random() * (0.019) + 0.015);
	    if (timeFraction < 0.5) {
	      __scaleDown(obj, timeFraction);
	    } else {
	      __scaleUp(obj, timeFraction);
	    }
	  }
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Scale down animation
	 * @param obj - MasterBotNode
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * @private
	 */
	function __scaleDown(obj, timeFraction) {
	  var scale = 1 - timeFraction;
	  obj.node.scale.x = Math.max(0.75, scale);
	  obj.node.scale.y = Math.max(0.75, scale);
	}

	/**
	 * Scale up animation
	 * @param obj
	 * @param timeFraction
	 * @private
	 */
	function __scaleUp(obj, timeFraction) {
	  obj.node.scale.x = Math.min(1.0, timeFraction + 0.25);
	  obj.node.scale.y = Math.min(1.0, timeFraction + 0.25);
	}

	// Export Object
	module.exports = BeastBehaviour;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);
	var MeshFactory = __webpack_require__(4);
	var MoveResponder = __webpack_require__(16);

	/**
	 * Represents a Beast.
	 * This object represents both Bad and Good beasts.
	 */

	/**
	 * Create a Beast
	 * @param id - String, object's id
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @param type - BeastNode.Type
	 * @constructor
	 */
	function BeastNode(id, initialPos, type) {
	  this.id = id;
	  this.state = State.IDLING;
	  this.type = type;
	  if (type == BeastNode.Type.GOOD) {
	    this.node = MeshFactory.createGoodBeastMesh();
	  } else {
	    this.node = MeshFactory.createBadBeastMesh();
	  }
	  this.move = new MoveResponder(initialPos);
	  this.move.placeOrigin(this.node);
	  this.move.stepOffset = 4;
	  this.node.position.z = -2;
	}


	BeastNode.Type = Object.freeze({
	  "GOOD": 0,
	  "BAD": 1
	});

	// Export "class"
	module.exports = BeastNode;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);

	/**
	 * Behaviour for explosion.
	 */

	// Object
	var ExplosionBehaviour = {};

	/**
	 * Create explosion behaviour
	 * @param obj - Simulation object
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * TODO: More functions
	 */
	ExplosionBehaviour.apply = function (obj, tickCount, timeFraction) {
	  if (obj.state == State.EXPLODING) {
	    var frame = tickCount - obj.birthTick;
	    obj.node.rotation.z += (Math.random() * (0.022) + 0.015);
	    /*
	    switch (frame) {
	      case 0:
	        obj.node.scale.x = Math.max(timeFraction, 0.005);
	        obj.node.scale.y = Math.max(timeFraction, 0.005);
	        break;
	      case 7:
	        obj.node.scale.x = 1;
	        obj.node.scale.y = 1;
	        break;
	      case 16:
	        var scale = 1 - timeFraction;
	        obj.node.scale.x = Math.max(scale, 0.005);
	        obj.node.scale.y = Math.max(scale, 0.005);
	        break;
	      case 18:
	        obj.node.scale.x = 0.0001;
	        obj.node.scale.y = 0.0001;
	        break;
	    }
	    */

	    obj.node.scale.z = 0.5;
	    if (frame <= 3) {
	      obj.node.scale.x = (frame / 3) + (timeFraction * 0.2);
	      obj.node.scale.y = (frame / 3) + (timeFraction * 0.2);
	    } else if (frame >= 18) {
	      obj.node.scale.x = 1.0 - (((frame - 15) * 2) * 0.1 + (timeFraction * 0.1));
	      obj.node.scale.y = 1.0 - (((frame - 15) * 2) * 0.1 + (timeFraction * 0.1));

	    } else {
	      obj.node.scale.x = 1;
	      obj.node.scale.y = 1;
	    }



	    if (frame > 20) {
	      obj.state = State.REMOVE;
	    }
	  }
	};

	// Export Object
	module.exports = ExplosionBehaviour;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var State = __webpack_require__(13);
	var Static = __webpack_require__(6);

	/**
	 * Behaviour for 3d object when dying.
	 */

	// Object
	var DyingBehaviour = {};

	/**
	 * Create move behaviour
	 * @param obj - MasterBotNode
	 * @param tickCount - Current tick count
	 * @param timeFraction - Time fraction of current tick (in ms)
	 */
	DyingBehaviour.apply = function (obj, tickCount, timeFraction) {
	  if (obj !== undefined && obj.state == State.DYING) {
	    __handleDeathOccured(obj, tickCount);
	    if (tickCount > obj.deathOccuredTick) {
	      obj.state = State.REMOVE;
	      return;
	    } else if (Static.TimePerTick < 30) {
	      obj.state = State.REMOVE;
	      return;
	    }
	    __performAnimation(obj, timeFraction);
	  }
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


	/**
	 * Set when death occured.
	 * Used to calculate when the object should be removed,
	 * ie when die animation is completed.
	 * @param obj - MasterBotNode
	 * @param tickCount - Current tick count
	 * @private
	 */
	function __handleDeathOccured(obj, tickCount) {
	  if (obj.deathOccuredTick === undefined) {
	    obj.deathOccuredTick = tickCount;
	  }
	}

	/**
	 * Perform die animation.
	 * @param obj - MasterBotNode
	 * @param timeFraction - Time fraction of current tick (in ms)
	 * @private
	 */
	function __performAnimation(obj, timeFraction) {
	  var scale = 1 - (timeFraction * 1.5);
	  obj.node.scale.x = Math.max(scale, 0.01);
	  obj.node.scale.y = Math.max(scale, 0.01);
	  obj.node.scale.z = Math.max(scale, 0.01);
	}

	// Export Object
	module.exports = DyingBehaviour;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var State = __webpack_require__(13);
	var MeshFactory = __webpack_require__(4);
	var PositionConverter = __webpack_require__(5);

	/**
	 * Represents a Explosion.
	 */

	/**
	 * Create a Explosion
	 * @param id - String, object's id
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @param tileRadius - Number, radius in 2d grid tiles.
	 * @param birthTick - Tick when this explosion was created
	 * @constructor
	 */
	function ExplosionNode(id, initialPos, tileRadius, birthTick) {
	  this.id = id;
	  this.birthTick = birthTick;
	  this.state = State.EXPLODING;
	  this.node = new THREE.Object3D();
	  this.node.add(MeshFactory.createExplosion(tileRadius));

	  var position = PositionConverter.convert(initialPos);
	  this.node.position.x = position.x;
	  this.node.position.y = position.y;
	  this.node.position.z = 0;

	  this.node.scale.x = 0.01;
	  this.node.scale.y = 0.01;

	  this.node.scale.z = 0.2;
	}

	// Export "class"
	module.exports = ExplosionNode;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var State = __webpack_require__(13);
	var MeshFactory = __webpack_require__(4);
	var PositionConverter = __webpack_require__(5);

	/**
	 * Represents a Flower.
	 * This object represents both Bad and Good flowers.
	 */

	/**
	 * Create a Flower
	 * @param id - String, object's id
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @param type - FlowerNode.Type
	 * @constructor
	 */
	function FlowerNode(id, initialPos, type) {
	  this.id = id;
	  this.state = State.SPAWNED;
	  this.type = type;
	  if (type == FlowerNode.Type.GOOD) {
	    this.node = MeshFactory.createGoodFlowerMesh();
	  } else {
	    this.node = MeshFactory.createBadFlowerMesh();
	  }

	  var position = PositionConverter.convert(initialPos);
	  this.node.position.x = position.x;
	  this.node.position.y = position.y;
	  this.node.position.z = 0;

	  this.node.rotation.x = THREE.Math.degToRad(270);
	}

	FlowerNode.Type = Object.freeze({
	  "GOOD": 0,
	  "BAD": 1
	});

	// Export "class"
	module.exports = FlowerNode;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var State = __webpack_require__(13);
	var MeshFactory = __webpack_require__(4);
	var MoveResponder = __webpack_require__(16);

	/**
	 * Represents a Master Bot
	 */

	/**
	 * Create a Master bot
	 * @param id - String, object's id
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @constructor
	 */
	function MasterBotNode(id, initialPos) {
	  this.id = id;
	  this.state = State.IDLING;
	  this.node = new THREE.Object3D();
	  this.node.add(MeshFactory.createBotBodyMesh(this.id));
	  this.node.add(MeshFactory.createBotStripeMesh(this.id));
	  this.node.scale.z = 0.75;
	  this.node.position.z = 5.5;

	  this.move = new MoveResponder(initialPos);
	  this.move.placeOrigin(this.node);
	  this.move.stepOffset = 2;
	}

	// Export "class"
	module.exports = MasterBotNode;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var Manipulator = __webpack_require__(11);
	var MasterBotNode = __webpack_require__(25);
	var MiniBotNode = __webpack_require__(15);
	var BeastNode = __webpack_require__(20);
	var FlowerNode = __webpack_require__(24);
	var ExplosionNode = __webpack_require__(23);
	var State = __webpack_require__(13);
	var Audio = __webpack_require__(8);

	/**
	 * Manages data feed and is responsible
	 * for creating new simulation objects, and
	 * managing their states.
	 */

	// Object
	var Instructor = {};

	/**
	 * The Scene
	 */
	Instructor.scene = null;

	/**
	 * Manages the tick data from server.
	 * Instructs all simulation objects about changes,
	 * and creates/removes objects as needed.
	 * @param tickData
	 */
	Instructor.handleTick = function (tickData) {
	  var hash = __extractHash(tickData);
	  Manipulator.clearUnused(hash);
	  for (var i = 0, iLen = tickData.bots.length; i < iLen; i++) {
	    var entity = tickData.bots[i];
	    if (__isPlant(entity)) {
	      __handlePlant(entity);
	    } else if (__isBot(entity)) {
	      __handleEntity(entity);
	    }
	  }

	  // TODO: Refactoring here...
	  for (var j = 0, jLen = tickData.decorations.length; j < jLen; j++) {
	    var dec = tickData.decorations[j];
	    if (dec.t == "E") {
	      var id = "E" + dec.r + dec.x + dec.y;
	      if (Manipulator.retrieve(id) === undefined) {
	        var explosion = new ExplosionNode(id, new THREE.Vector2(dec.x, dec.y), dec.r, Manipulator.tickCount);
	        Manipulator.add(explosion);
	      }
	    }

	  }
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Handle plant entities.
	 * @param entity
	 * @private
	 */
	function __handlePlant(entity) {
	  var id = __createPlantId(entity);
	  var obj3d = Manipulator.retrieve(id);

	  if (obj3d === undefined) {
	    var type = (entity.t == "P") ? FlowerNode.Type.GOOD : FlowerNode.Type.BAD;
	    var flowerNode = new FlowerNode(id, new THREE.Vector2(entity.x, entity.y), type);
	    flowerNode.state = State.SPAWNED;
	    Manipulator.add(flowerNode);
	    return;
	  }
	  obj3d.state = State.IDLING;
	}

	/**
	 * Handle moving entities (Beast & Bots)
	 * @param entity
	 * @private
	 */
	function __handleEntity(entity) {
	  var entity3d = Manipulator.retrieve(entity.t + entity.id);
	  if (entity3d === undefined) {
	    entity3d = __createEntity(entity);
	  }

	  if (entity3d.move !== undefined) {
	    entity3d.state = State.MOVING;
	    entity3d.move.setTargetPosition(new THREE.Vector2(entity.x, entity.y));
	  }
	}

	/**
	 * Creates 3d entity.
	 * @param entity
	 * @returns {*}
	 * @private
	 */
	function __createEntity(entity) {
	  var entity3d;
	  if (entity.t == "M") {
	    entity3d = new MasterBotNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), 6);
	  } else if (entity.t == "S") {
	    entity3d = new MiniBotNode(entity.t + entity.id, "M" + entity.mId, new THREE.Vector2(entity.x, entity.y), 6)
	  } else if (entity.t == "B") {
	    entity3d = new BeastNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), BeastNode.Type.GOOD)
	  } else if (entity.t == "b") {
	    entity3d = new BeastNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), BeastNode.Type.BAD)
	  } else {
	    throw new Error('Unknowed entity type: ' + entity.t);
	  }
	  if (entity3d !== null) {
	    Manipulator.add(entity3d);
	  }
	  return entity3d;
	}

	/**
	 * Extracts a hash of entity ids.
	 * @param tickData
	 * @private
	 * @returns Object - Hash of ids
	 */
	function __extractHash(tickData) {
	  var hash = {};
	  for (var i = 0, len = tickData.bots.length; i < len; i++) {
	    var entity = tickData.bots[i];
	    if (__isPlant(entity)) {
	      hash[__createPlantId(entity)] = entity;
	    } else {
	      hash[entity.id] = entity;
	    }
	  }

	  return hash;
	}

	/**
	 * Creates id for plant
	 * @param entity
	 * @private
	 * @returns String
	 */
	function __createPlantId(entity) {
	  return "PLANT-" + entity.x + entity.y;
	}

	/**
	 * Checks if entity is a plant.
	 * @param entity
	 * @private
	 * @returns Boolean
	 */
	function __isPlant(entity) {
	  var t = entity.t;
	  return (t == "P" || t == "p");
	}

	/**
	 * Checks if entity is a bot or beast.
	 * @param entity
	 * @private
	 * @returns Boolean
	 */
	function __isBot(entity) {
	  var t = entity.t;
	  return (t == "M" || t == "S" || t == "b" || t == "B");
	}

	/**
	 * Creates and adds a new master bot.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @param colorId - Number
	 * @returns {MasterBotNode}
	 */
	Instructor.addMasterBot = function (id, initialPos, colorId) {
	  var botNode = new MasterBotNode(id, initialPos, colorId);
	  __addObj(botNode);
	  return botNode;
	};

	/**
	 * Creates and adds a new mini bot.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @param colorId - Number
	 * @returns {MiniBotNode}
	 */
	Instructor.addMiniBot = function (id, initialPos, colorId) {
	  var botNode = new MiniBotNode(id, initialPos, colorId);
	  __addObj(botNode);
	  return botNode;
	};

	/**
	 * Creates and adds a good beast.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @returns {BeastNode}
	 */
	Instructor.addGoodBeast = function (id, initialPos) {
	  var beastNode = new BeastNode(id, initialPos, BeastNode.Type.GOOD);
	  __addObj(beastNode);
	  return beastNode;
	};

	/**
	 * Creates and adds a bad beast.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @returns {BeastNode}
	 */
	Instructor.addBadBeast = function (id, initialPos) {
	  var beastNode = new BeastNode(id, initialPos, BeastNode.Type.BAD);
	  __addObj(beastNode);
	  return beastNode;
	};

	/**
	 * Creates and adds a good flower.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @returns {FlowerNode}
	 */
	Instructor.addGoodFlower = function (id, initialPos) {
	  var flowerNode = new FlowerNode(id, initialPos, FlowerNode.Type.GOOD);
	  __addObj(flowerNode);
	  return flowerNode;
	};

	/**
	 * Creates and adds a bad beast.
	 * @param id - String
	 * @param initialPos - THREE.Vector2, position on 2d grid
	 * @returns {FlowerNode}
	 */
	Instructor.addBadFlower = function (id, initialPos) {
	  var flowerNode = new FlowerNode(id, initialPos, FlowerNode.Type.BAD);
	  __addObj(flowerNode);
	  return flowerNode;
	};


	// Export object
	module.exports = Instructor;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var THREE = __webpack_require__(3);
	var THREEx = __webpack_require__(28);
	var Manipulator = __webpack_require__(11);
	var Instructor = __webpack_require__(26);
	var Static = __webpack_require__(6);

	/**
	 * Represents the 3d World.
	 */
	var viewPort = {width: window.innerWidth, height: window.innerHeight};
	var canvas = document.getElementById("simulation-canvas");
	var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
	var camera = null;
	var board = null;

	/**
	 *  Create a 3d world
	 * @constructor
	 */
	function World() {
	  this.scene = new THREE.Scene();
	  renderer.setSize(viewPort.width - 250, viewPort.height);
	  document.body.appendChild(renderer.domElement);
	  __addFullScreenShortcut();
	  Manipulator.world = this;
	  Instructor.scene = this.scene;
	}

	/**
	 * Init the world
	 * @param boardData - Object containing board/tile data.
	 */
	World.prototype.init = function (boardData) {
	  board = boardData;
	  __createCamera();
	  this.resetCamera();
	  _initLights(this.scene);
	  Manipulator.camera = camera;
	};

	/**
	 * Start the render loop.
	 */
	World.prototype.render = function () {
	  if (Manipulator.isLastDone) {
	    Manipulator.updateFrame();
	    requestAnimationFrame(this.render.bind(this));
	    renderer.render(this.scene, camera);
	  } else {
	    log("Render skip.");
	  }
	};

	/**
	 * Adds a static node to the scene.
	 * Typical static nodes are background objects etc.
	 * These objects will not be process by the draw loop.
	 * @param node - 3d object
	 */
	World.prototype.addStatic = function (node) {
	  this.scene.add(node);
	};

	/**
	 * Resets camera to default position.
	 */
	World.prototype.resetCamera = function () {
	  var x = ((board.width * Static.TileSize) / 2);
	  var y = ((board.height * Static.TileSize) / 2) - (Static.TileSize / 2);
	  camera.position.set(x, y - (y / 30), y * 1.40);
	  camera.lookAt(new THREE.Vector3(x, y, 0));
	};

	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds event handler for "f" key = Set browser fullscreen.
	 * @private
	 */
	function __addFullScreenShortcut() {
	  if (THREEx.FullScreen.available()) {
	    document.onkeypress = function (e) {
	      // detect "f"
	      e = e || window.event;
	      if (e.keyCode == 102) {
	        THREEx.FullScreen.request(renderer.domElement);
	      }
	    }.bind(this);
	  }
	}

	/**
	 * Create camera.
	 */
	function __createCamera() {
	  camera = new THREE.PerspectiveCamera(75,
	    viewPort.width / viewPort.height,
	    0.1,
	    2000);
	}

	/**
	 * Init lights.
	 */
	function _initLights(scene) {
	  var x = (board.width * Static.TileSize);
	  var y = (board.height * Static.TileSize);

	  var blueLight = new THREE.PointLight(0x773322, 1.3, y + (y / 3), 1.1);
	  blueLight.position.set(x / 10, y / 10, y / 2);
	  scene.add(blueLight);

	  var redLight = new THREE.PointLight(0x333388, 1.3, y + (y / 3), 1.1);
	  redLight.position.set(x - (x / 10), y - (y / 10), y / 2);
	  scene.add(redLight);


	  var ambient = new THREE.AmbientLight(0xaaaaaa);
	  scene.add(ambient);
	}

	// Export "class"
	module.exports = World;


/***/ },
/* 28 */
/***/ function(module, exports) {

	// This THREEx helper makes it easy to handle the fullscreen API
	// * it hides the prefix for each browser
	// * it hides the little discrepencies of the various vendor API
	// * at the time of this writing (nov 2011) it is available in 
	//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
	//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
	//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).

	// 
	// # Code

	//

	/** @namespace */

	var THREEx = {};
	THREEx.FullScreen = {};

	/**
	 * test if it is possible to have fullscreen
	 * 
	 * @returns {Boolean} true if fullscreen API is available, false otherwise
	*/
	THREEx.FullScreen.available	= function()
	{
		return this._hasWebkitFullScreen || this._hasMozFullScreen;
	}

	/**
	 * test if fullscreen is currently activated
	 * 
	 * @returns {Boolean} true if fullscreen is currently activated, false otherwise
	*/
	THREEx.FullScreen.activated	= function()
	{
		if( this._hasWebkitFullScreen ){
			return document.webkitIsFullScreen;
		}else if( this._hasMozFullScreen ){
			return document.mozFullScreen;
		}else{
			console.assert(false);
		}
	}

	/**
	 * Request fullscreen on a given element
	 * @param {DomElement} element to make fullscreen. optional. default to document.body
	*/
	THREEx.FullScreen.request	= function(element)
	{
		element	= element	|| document.body;
		if( this._hasWebkitFullScreen ){
			element.webkitRequestFullScreen();
		}else if( this._hasMozFullScreen ){
			element.mozRequestFullScreen();
		}else{
			console.assert(false);
		}
	}

	/**
	 * Cancel fullscreen
	*/
	THREEx.FullScreen.cancel	= function()
	{
		if( this._hasWebkitFullScreen ){
			document.webkitCancelFullScreen();
		}else if( this._hasMozFullScreen ){
			document.mozCancelFullScreen();
		}else{
			console.assert(false);
		}
	}

	// internal functions to know which fullscreen API implementation is available
	THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
	THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;	


	module.exports = THREEx;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Range = __webpack_require__(30);

	/**
	 * Creates a board using the initial tick data.
	 */

	// Object
	var BoardCreator = {};

	/**
	 * Create the board data.
	 * @param tickData
	 * @return
	 */
	BoardCreator.create = function (tickData) {
	  var boardData = {
	    width: tickData.size.x,
	    height: tickData.size.y,
	    walls: []
	  };

	  for (var i = 0, len = tickData.bots.length; i < len; i++) {
	    var entity = tickData.bots[i];
	    if (entity.t == "W") {
	      boardData.walls.push(entity);
	    }
	  }

	  return boardData;
	};

	// Export Object
	module.exports = BoardCreator;

/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Range.
	 * Creates a range array between start and stop.
	 */

	// Export function
	module.exports = function (start, end, step) {
	  var range = [];
	  var typeofStart = typeof start;
	  var typeofEnd = typeof end;

	  if (step === 0) {
	    throw TypeError("Step cannot be zero.");
	  }

	  if (typeofStart == "undefined" || typeofEnd == "undefined") {
	    throw TypeError("Must pass start and end arguments.");
	  } else if (typeofStart != typeofEnd) {
	    throw TypeError("Start and end arguments must be of same type.");
	  }

	  typeof step == "undefined" && (step = 1);

	  if (end < start) {
	    step = -step;
	  }

	  if (typeofStart == "number") {

	    while (step > 0 ? end >= start : end <= start) {
	      range.push(start);
	      start += step;
	    }

	  } else if (typeofStart == "string") {

	    if (start.length != 1 || end.length != 1) {
	      throw TypeError("Only strings with one character are supported.");
	    }

	    start = start.charCodeAt(0);
	    end = end.charCodeAt(0);

	    while (step > 0 ? end >= start : end <= start) {
	      range.push(String.fromCharCode(start));
	      start += step;
	    }

	  } else {
	    throw TypeError("Only string and number types are supported");
	  }

	  return range;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Manipulator = __webpack_require__(11);

	/**
	 * Keyboard Listener.
	 */

	// Object
	  var KeyboardListener = {};
	  var simulation;

	  /**
	   * Register keyboard key listners.
	   */
	  KeyboardListener.load = function (sim) {
	    simulation = sim;
	    document.addEventListener('keydown', function (event) {
	      switch (event.keyCode) {
	        case 49: // Key 1
	          simulation.changeSpeed(800);
	          break;
	        case 50: // Key 2
	          simulation.changeSpeed(200);
	          break;
	        case 51: // Key 3
	          simulation.changeSpeed(100);
	          break;
	        case 52: // Key 4
	          simulation.changeSpeed(60);
	          break;
	        case 53: // Key 5
	          simulation.changeSpeed(35);
	          break;
	        case 54: // Key 6
	          simulation.changeSpeed(18);
	          break;
	        case 55: // Key 7
	          simulation.changeSpeed(5);
	          break;
	        case 32: // Key Space
	          Manipulator.cyclePlayerCamera();
	          break;
	        case 82: // Key R
	          Manipulator.toggleRaceCam();
	          break;
	      }
	    });
	  };


	/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


	// Export object
	  module.exports = KeyboardListener;




/***/ }
/******/ ]);
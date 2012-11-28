OuterSpace.baseModel = function() {

  var scope = this;

  this.scale = 1;

  // animation parameters
  this.animationFPS = 30;
  this.transitionFrames = 15;

  // rig
  this.root = new THREE.Object3D();

  this.meshBody = null;
  this.meshHelmet = null;
  this.controls = null;

  // textures
  this.texturesBody = [];
  this.texturesHelmet = [];
  this.helmets = [];
  this.currentTexture = undefined;

  //
  this.onLoadComplete = function() {};

  // internals
  this.meshes = [];
  this.animations = {};

  this.loadCounter = 0;

  // internal animation parameters
  this.activeAnimation = null;
  this.oldAnimation = null;

  // API
  this.enableShadows = function(enable) {

    for(var i = 0; i < this.meshes.length; i++) {

      this.meshes[i].castShadow = enable;
      this.meshes[i].receiveShadow = enable;

    }

  };

  this.setVisible = function(enable) {

    for(var i = 0; i < this.meshes.length; i++) {

      this.meshes[i].visible = enable;
      this.meshes[i].visible = enable;

    }

  };

  this.loadParts = function(config) {

    this.animations = config.animations;
    // this.walkSpeed = config.walkSpeed;
    // this.crouchSpeed = config.crouchSpeed;
    this.loadCounter = config.helmets.length * 2 + config.textures.length + 1;
    this.loadCounter = config.textures.length + 1;

    var helmetsTextures = []
    for ( var i = 0; i < config.helmets.length; i ++ ) helmetsTextures[ i ] = config.helmets[ i ][ 1 ];
    // SKINS
    this.texturesBody = loadTextures(config.baseUrl + "textures/", config.textures);
    this.texturesHelmet = loadTextures( config.baseUrl + "textures/", helmetsTextures );
    // BODY
    var loader = new THREE.JSONLoader();

    loader.load(config.baseUrl + config.body, function(geo) {

      geo.computeBoundingBox();
      // scope.root.position.y = -scope.scale * geo.boundingBox.min.y;
      var mesh = createPart(geo, scope.texturesBody[0]);
      // var mesh = createPart(geo, new THREE.MeshBasicMaterial());
      mesh.scale.set(scope.scale, scope.scale, scope.scale);

      scope.root.add(mesh);

      scope.meshBody = mesh;
      scope.meshes.push(mesh);

      checkLoadingComplete();

    });

    // helmets
    var generateCallback = function ( index, name ) {
     return function( geo ) {
       var mesh = createPart( geo, scope.texturesHelmet[ index ] );
       mesh.scale.set( scope.scale, scope.scale, scope.scale );
       mesh.visible = false;
       mesh.name = name;
       scope.root.add( mesh );
       scope.helmets[ index ] = mesh;
       scope.meshHelmet = mesh;
       scope.meshes.push( mesh );
       checkLoadingComplete();
     }
    }
    for ( var i = 0; i < config.helmets.length; i ++ ) {
     loader.load( config.baseUrl + config.helmets[ i ][ 0 ], generateCallback( i, config.helmets[ i ][ 0 ] ) );
    }
  };

  this.setPlaybackRate = function(rate) {

    if(this.meshBody) this.meshBody.duration = this.meshBody.baseDuration / rate;
    if ( this.meshHelmet ) this.meshHelmet.duration = this.meshHelmet.baseDuration / rate;
  };

  this.setTexture = function(index) {

    if(this.meshBody && this.meshBody.material.wireframe === false) {

      this.meshBody.material.map = this.texturesBody[index];
      this.currentTexture = index;

    }

  };

  this.setHelmet = function ( index ) {
   for ( var i = 0; i < this.helmets.length; i ++ ) this.helmets[ i ].visible = false;
   var activeWeapon = this.helmets[ index ];
   if ( activeWeapon ) {
     activeWeapon.visible = true;
     this.meshHelmet = activeWeapon;
     if ( this.activeAnimation ) {
       activeWeapon.playAnimation( this.activeAnimation );
       this.meshHelmet.setAnimationTime( this.activeAnimation, this.meshBody.getAnimationTime( this.activeAnimation ) );
     }
   }
  };

  this.setAnimation = function(animationName) {

    if(animationName === this.activeAnimation || !animationName) return;

    if(this.meshBody) {

      this.meshBody.setAnimationWeight(animationName, 0);
      this.meshBody.playAnimation(animationName);

      this.oldAnimation = this.activeAnimation;
      this.activeAnimation = animationName;

      this.blendCounter = this.transitionFrames;

    }

    if ( this.meshHelmet ) {
     this.meshHelmet.setAnimationWeight( animationName, 0 );
     this.meshHelmet.playAnimation( animationName );
    }
  };

  this.update = function(delta) {

    // if(this.controls) this.updateMovementModel(delta);
    if(this.animations) {

      this.updateBehaviors(delta);
      this.updateAnimations(delta);

    }

  };

  this.updateAnimations = function(delta) {

    var mix = 1;

    if(this.blendCounter > 0) {

      mix = (this.transitionFrames - this.blendCounter) / this.transitionFrames;
      this.blendCounter -= 1;

    }

    if(this.meshBody) {

      this.meshBody.update(delta);

      this.meshBody.setAnimationWeight(this.activeAnimation, mix);
      this.meshBody.setAnimationWeight(this.oldAnimation, 1 - mix);

    }

    if ( this.meshHelmet ) {
     this.meshHelmet.update( delta );
     this.meshHelmet.setAnimationWeight( this.activeAnimation, mix );
     this.meshHelmet.setAnimationWeight( this.oldAnimation,  1 - mix );
    }
  };

  this.updateBehaviors = function(delta) {

    var controls = this.controls;
    var animations = this.animations;

    var moveAnimation, idleAnimation;

    if(controls.run) {
      if(this.activeAnimation !== animations["run"]) {
        this.setAnimation(animations["run"]);
      }
    } else if(controls.jump) {
      if(this.activeAnimation !== animations["jump"]) {
        this.setAnimation(animations["jump"]);
      }
    } else {
      if(this.activeAnimation !== animations["stand"]) {
        this.setAnimation(animations["stand"]);
      }
    }

  };

  // internal helpers

  function loadTextures(baseUrl, textureUrls) {

    var mapping = new THREE.UVMapping();
    var textures = [];

    for(var i = 0; i < textureUrls.length; i++) {

      textures[i] = THREE.ImageUtils.loadTexture(baseUrl + textureUrls[i], mapping, checkLoadingComplete);
      textures[i].name = textureUrls[i];

    }

    return textures;

  };

  function createPart(geometry, textureMap) {

    geometry.computeMorphNormals();

    // var whiteMap = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color( 0xffffff ) );
    // var materialWireframe = new THREE.MeshPhongMaterial( { color: 0xffaa00, specular: 0x111111, shininess: 50, wireframe: true, shading: THREE.SmoothShading, map: whiteMap, morphTargets: true, morphNormals: true, perPixel: true, metal: true } );
    var materialTexture = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x111111,
      shininess: 50,
      wireframe: false,
      shading: THREE.SmoothShading,
      map: textureMap,
      morphTargets: true,
      morphNormals: true,
      perPixel: true,
      metal: true
    });
    materialTexture.wrapAround = true;

    //
    var mesh = new THREE.MorphBlendMesh(geometry, materialTexture);
    mesh.rotation.y = -Math.PI / 2;

    //
    mesh.materialTexture = materialTexture;
    // mesh.materialWireframe = materialWireframe;
    //
    mesh.autoCreateAnimations(scope.animationFPS);

    return mesh;

  };

  function checkLoadingComplete() {

    scope.loadCounter -= 1;
    if(scope.loadCounter === 0) scope.onLoadComplete();

  };

};
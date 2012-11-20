OuterSpace.spaceScene = function (container) {
  this.container = container;
  this.scene = new THREE.Scene();

  this.renderer = null;
  if( Detector.webgl ){
    // this.renderer = new THREE.WebGLRenderer();
    this.renderer = new THREE.WebGLRenderer({
      antialias : true, // to get smoother output
      preserveDrawingBuffer : true  // to allow screenshot
    });
    // this.renderer.setClearColorHex( 0xBBBBBB, 1 );
  // uncomment if webgl is required
  //}else{
  // Detector.addGetWebGLMessage();
  // return true;
  }
  else{
    this.renderer  = new THREE.CanvasRenderer();
  }
  this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
  this.container.appendChild(this.renderer.domElement);

  this.camera = null;
  this.cameraControls = null;
  this.clock = new THREE.Clock();
  // objects
  this.earth = null;
  this.clouds = null;
  this.radius = 6371;
  this.tilt = 0.41;
  this.rotationSpeed = 0.02;
  this.cloudsScale = 1.005;

  this.stats = null;

  this._init();
};

OuterSpace.spaceScene.prototype = {

	constructor: OuterSpace.spaceScene,

  _init: function () {
    this.scene.fog = new THREE.FogExp2( 0x0000, 0.00000025);

    this._setCamera();
    this._setLights();
    this._addObjects();
    this._animate();
  },

  _setCamera: function () {
    // put a camera in the scene
    this.camera = new THREE.PerspectiveCamera(25, this.container.clientWidth / this.container.clientHeight, 50, 1e7 );
    this.camera.position.set(0, 0, this.radius*5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  },

  _setLights: function () {
    // create light
    // var pointLight = new THREE.PointLight(0xFFFFFF);
    // pointLight.position.x = 0;
    // pointLight.position.y = 100;
    // pointLight.position.z = 50;

    // this.scene.add(pointLight);

    var dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( -1, 0, 1).normalize();
    this.scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight( 0x000000 );
    this.scene.add(ambientLight);
  },

  _addObjects: function () {
    // Earth
    var planetTexture = THREE.ImageUtils.loadTexture( "textures/planets/earth_atmos_2048.jpg" );
    var normalTexture = THREE.ImageUtils.loadTexture( "textures/planets/earth_normal_2048.jpg" );
    var specularTexture = THREE.ImageUtils.loadTexture( "textures/planets/earth_specular_2048.jpg" );
    
    var shader = THREE.ShaderUtils.lib[ "normal" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms[ "tNormal" ].value = normalTexture;
    uniforms[ "uNormalScale" ].value.set( 0.85, 0.85 );
    uniforms[ "tDiffuse" ].value = planetTexture;
    uniforms[ "tSpecular" ].value = specularTexture;
    uniforms[ "enableAO" ].value = false;
    uniforms[ "enableDiffuse" ].value = true;
    uniforms[ "enableSpecular" ].value = true;
    uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
    uniforms[ "uSpecularColor" ].value.setHex( 0x333333 );
    uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );
    uniforms[ "uShininess" ].value = 15;
    var parameters = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      lights: true,
      fog: true
    };
    var materialNormalMap = new THREE.ShaderMaterial( parameters );
    var geometry = new THREE.SphereGeometry( this.radius, 100, 50 );
    geometry.computeTangents();
    this.earth = new THREE.Mesh( geometry, materialNormalMap );
    this.earth.rotation.y = 0;
    this.earth.rotation.z = this.tilt;
    this.scene.add( this.earth );

    // clouds
    var cloudsTexture = THREE.ImageUtils.loadTexture( "textures/planets/earth_clouds_1024.png" );
    var materialClouds = new THREE.MeshLambertMaterial( { color: 0xffffff, map: cloudsTexture, transparent: true } );
    this.clouds = new THREE.Mesh( geometry, materialClouds );
    this.clouds.scale.set( this.cloudsScale, this.cloudsScale, this.cloudsScale );
    this.clouds.rotation.z = this.tilt;
    this.scene.add( this.clouds );
  },

  _animate: function () {
    requestAnimationFrame(this._animate.bind(this));
    this._render();

    if (this.stats) {
      this.stats.update();
    }
  },

  _render: function () {
    var delta = this.clock.getDelta();

    this.earth.rotation.y += this.rotationSpeed * delta;
    this.clouds.rotation.y += 1.25 * this.rotationSpeed * delta;
    
    this.renderer.render(this.scene, this.camera);
  },

  showStats: function () {
    // add Stats.js - https://github.com/mrdoob/stats.js
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    document.body.appendChild( this.stats.domElement );
  }
};
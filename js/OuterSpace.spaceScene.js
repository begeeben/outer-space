OuterSpace.spaceScene = function(container) {
  this.container = container;
  this.scene = new THREE.Scene();

  this.renderer = null;
  if(Detector.webgl) {
    // this.renderer = new THREE.WebGLRenderer();
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      // to get smoother output
      preserveDrawingBuffer: true // to allow screenshot
    });
    // this.renderer.setClearColorHex( 0xBBBBBB, 1 );
    // uncomment if webgl is required
    //}else{
    // Detector.addGetWebGLMessage();
    // return true;
  } else {
    this.renderer = new THREE.CanvasRenderer();
  }
  this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  this.container.appendChild(this.renderer.domElement);

  this.camera = null;
  this.cameraControls = null;
  this.clock = new THREE.Clock();

  this.loadCount = 3;
  // objects
  this.earth = null;
  this.clouds = null;
  this.radius = 6371;
  this.tilt = 0.41;
  this.rotationSpeed = 0.02;
  this.cloudsScale = 1.005;

  this.starCount = 667;
  this.starMaterialCount = 8;
  this.particleSystemCount = 24;

  this.ufo = null;

  this.animateCount = 0;

  this.stats = null;

  this._init();
};

OuterSpace.spaceScene.prototype = {

  constructor: OuterSpace.spaceScene,

  _init: function() {
    this.scene.fog = new THREE.FogExp2(0x0000, 0.00000025);

    this._setCamera();
    this._setLights();
    this._addObjects();
    this._createStars(this.radius * 4);
    // this._checkLoadComplete();
  },

  _checkLoadComplete: function() {
    if (this.loadCount===0){
      this._animate();
    }
  },

  _setCamera: function() {
    // put a camera in the scene
    this.camera = new THREE.PerspectiveCamera(25, this.container.clientWidth / this.container.clientHeight, 50, 1e7);
    this.camera.position.set(0, 0, this.radius * 4);
    // this.camera.lookAt(new THREE.Vector3(-this.radius/2, this.radius/2, 0));
    this.camera.rotation = new THREE.Vector3(0.08, 0.25, 0.5);
    this.scene.add(this.camera);
  },

  _setLights: function() {
    // create light
    // var pointLight = new THREE.PointLight(0xFFFFFF);
    // pointLight.position.x = 0;
    // pointLight.position.y = 100;
    // pointLight.position.z = 50;
    // this.scene.add(pointLight);
    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-1, 0, 1).normalize();
    this.scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight(0x444444);
    this.scene.add(ambientLight);
  },

  _addObjects: function() {
    // Earth
    var planetTexture = THREE.ImageUtils.loadTexture("textures/planets/earth_atmos_2048.jpg");
    var normalTexture = THREE.ImageUtils.loadTexture("textures/planets/earth_normal_2048.jpg");
    var specularTexture = THREE.ImageUtils.loadTexture("textures/planets/earth_specular_2048.jpg");

    var shader = THREE.ShaderUtils.lib["normal"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms["tNormal"].value = normalTexture;
    uniforms["uNormalScale"].value.set(0.85, 0.85);
    uniforms["tDiffuse"].value = planetTexture;
    uniforms["tSpecular"].value = specularTexture;
    uniforms["enableAO"].value = false;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = true;
    uniforms["uDiffuseColor"].value.setHex(0xffffff);
    uniforms["uSpecularColor"].value.setHex(0x333333);
    uniforms["uAmbientColor"].value.setHex(0x000000);
    uniforms["uShininess"].value = 15;
    var parameters = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      lights: true,
      fog: true
    };
    var materialNormalMap = new THREE.ShaderMaterial(parameters);
    var geometry = new THREE.SphereGeometry(this.radius, 100, 50);
    geometry.computeTangents();
    this.earth = new THREE.Mesh(geometry, materialNormalMap);
    this.earth.rotation.y = 0;
    this.earth.rotation.z = this.tilt;
    this.scene.add(this.earth);

    // clouds
    var cloudsTexture = THREE.ImageUtils.loadTexture("textures/planets/earth_clouds_1024.png");
    var materialClouds = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: cloudsTexture,
      transparent: true
    });
    this.clouds = new THREE.Mesh(geometry, materialClouds);
    this.clouds.scale.set(this.cloudsScale, this.cloudsScale, this.cloudsScale);
    this.clouds.rotation.z = this.tilt;
    this.scene.add(this.clouds);
    this.loadCount -= 1;

    this._addUfo();
    this._checkLoadComplete();
  },

  _addUfo: function() {
    var that = this
    var loader = new THREE.JSONLoader();
    loader.load("js/models/ufo/ufo.js", function(geometry) {

      // geometry.computeTangents();
      var surfaceMap = THREE.ImageUtils.loadTexture("js/models/ufo/textures/ufo.png");
      var shaderMaterial = new THREE.MeshPhongMaterial({map:surfaceMap})

      var mesh = new THREE.Mesh(geometry, shaderMaterial);
      mesh.position.x = -60;
      mesh.position.y = 20;
      mesh.position.z = that.radius*4 -150;
      // mesh.rotation.x = Math.PI * 15/180;
      // mesh.rotation.z = Math.PI * 60/180;
      // mesh.rotation.y = 0.3;
      // mesh.scale.x = mesh.scale.y = mesh.scale.z = 10;
      // mesh.matrixAutoUpdate = false;
      // mesh.rotation = new THREE.Vector3(-1,1,0);
      mesh.useQuaternion = true;
      // mesh.up = new THREE.Vector3(-1,1,0).normalize();
      mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1).normalize(), 60*Math.PI/180);
      mesh.updateMatrix();
      that.ufo = mesh;
      that.scene.add(that.ufo);
      that.loadCount -= 1;
      that._checkLoadComplete();
    });
  },

  _createStars: function(minDistance) {
    // Create a group to hold our Stars particles
    var starsGroup = new THREE.Object3D();

    var i;
    var starsGeometry = new THREE.Geometry();

    // Create random particle locations
    for(i = 0; i < this.starCount; i++) {

      var vector = new THREE.Vector3((Math.random() * 2 - 1) * minDistance, (Math.random() * 2 - 1) * minDistance, (Math.random() * 2 - 1) * minDistance);

      if(vector.length() < minDistance) {
        vector = vector.setLength(minDistance);
      }

      starsGeometry.vertices.push(new THREE.Vertex(vector));

    }

    // Create a range of sizes and colors for the stars
    var starsMaterials = [];
    for(i = 0; i < this.starMaterialCount; i++) {
      starsMaterials.push(
      new THREE.ParticleBasicMaterial({
        color: 0x101010 * (i + 1),
        size: i % 2 + 1,
        sizeAttenuation: false
      }));
    }

    // Create several particle systems spread around in a circle, cover the sky
    for(i = 0; i < this.particleSystemCount; i++) {

      var stars = new THREE.ParticleSystem(starsGeometry, starsMaterials[i % this.starMaterialCount]);

      stars.rotation.y = i / (Math.PI * 2);

      starsGroup.add(stars);

    }

    this.scene.add(starsGroup);
    this.loadCount -= 1;
    this._checkLoadComplete();
  },

  _animate: function() {
    requestAnimationFrame(this._animate.bind(this));
    this._render();

    if(this.stats) {
      this.stats.update();
    }
  },

  _render: function() {
    var delta = this.clock.getDelta();

    this.earth.rotation.y += this.rotationSpeed * delta;
    this.clouds.rotation.y += 1.5 * this.rotationSpeed * delta;
    // this.ufo.rotation.y -= 0.2 * delta;

    var temp = new THREE.Quaternion();
    temp.setFromAxisAngle(new THREE.Vector3(0,1,0).normalize(), Math.PI/180);
    this.ufo.quaternion.multiplySelf(temp);
    this.ufo.position.x += Math.cos(this.animateCount + delta)*this.ufo.up.x/20;
    this.ufo.position.y += Math.cos(this.animateCount + delta)*this.ufo.up.y/20;
    this.ufo.position.z += Math.cos(this.animateCount + delta)*this.ufo.up.z/20;
    // this.ufo.position.z += Math.cos(this.animateCount + delta)/20;
    this.animateCount += 0.01;

    this.renderer.render(this.scene, this.camera);
  },

  showStats: function() {
    // add Stats.js - https://github.com/mrdoob/stats.js
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    document.body.appendChild(this.stats.domElement);
  }
};
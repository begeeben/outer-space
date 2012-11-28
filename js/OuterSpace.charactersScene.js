OuterSpace.charactersScene = function(container) {
  this.container = container;
  this.scene = new THREE.Scene();

  this.renderer = null;
  if(Detector.webgl) {
    // this.renderer = new THREE.WebGLRenderer();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
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
  this.dog = null;
  this.boy = null;
  this.pig = null;
  this.stats = null;

  this.objects = [];

  this._init();
};

OuterSpace.charactersScene.prototype = {

  constructor: OuterSpace.charactersScene,

  _init: function() {
    this._setCamera();
    this._setLights();
    this._addObjects();
    this._animate();
  },

  _setCamera: function() {
    // put a camera in the scene
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 10000);
    this.camera.position.set(0, 0, 150);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  },

  _setLights: function() {
    // create light
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 0;
    pointLight.position.y = 100;
    pointLight.position.z = 50;

    this.scene.add(pointLight);
  },

  _addObjects: function() {
    var that = this;
    
    this.dog = new OuterSpace.baseModel();
    this.dog.scale = 1;
    this.dog.controls = {
      run: false,
      jump: false
    };
    this.dog.loadParts({
      baseUrl: "js/models/dog/",
      body: "dog.js",
      textures: ["dog.png"],
      helmets: [
        ["helmet.js", "helmet.png"]
      ],
      animations: {
        stand: "stand"
      }
    });

    this.dog.onLoadComplete = function() {
      that.dog.setHelmet(0);
      that.dog.enableShadows(true);

      that.dog.root.position.x = -65;
      that.dog.root.position.y = 12;
      that.dog.root.position.z = 0;

      that.dog.root.rotation.x = 0.5;
      that.dog.root.rotation.y = -0.5;

      that.scene.add(that.dog.root);
    };

    this.boy = new OuterSpace.baseModel();
    this.boy.scale = 1;
    this.boy.controls = {
      run: false,
      jump: false
    };
    this.boy.loadParts({
      baseUrl: "js/models/boy/",
      body: "boy.js",
      textures: ["boy.png"],
      helmets: [],
      animations: {
        stand: "stand"
      }
    });

    this.boy.enableShadows(true);
    this.boy.root.position.x = 60;
    this.boy.root.position.y = -30;
    this.boy.root.rotation.y = -2.5;
    this.scene.add(this.boy.root);

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
    this.dog.update(delta);
    this.boy.update(delta);
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
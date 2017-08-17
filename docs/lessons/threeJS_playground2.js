  var scene, camera, renderer;
  var geometry, material, mesh;

  // ObjectLoader
  var customObject;

  // ShaderFrog Runtime
  var runtime = new ShaderRuntime()
  var clock = new THREE.Clock()
  
  // DAT GUI
  var gui = new dat.GUI({ autoPlace: false });
  var objectFolder = gui.addFolder('Object');

  // HTML Port
  var bodyId = "body"
  var canvasContainerId = "canvasContainer"
  var glslCodeContainerId = "glslCodeContainer"
  var cppCodeContainerId = "cppCodeContainer"
  var aspectRatio = 0.75;
  var modelScale = 0.002;

  init();
  animate();

  function init() {
    
    // Init
    var canvasContainer = document.getElementById(canvasContainerId);
    var body = document.getElementById(bodyId);

    loadHighlightCode("language-glsl","../codes/default_shader.glsl",glslCodeContainerId);
    loadHighlightCode("language-cpp","../codes/triangles.cpp",cppCodeContainerId);
    loadStatsUI(canvasContainer)
    loadDATGUI(gui,customObject,reset)

    // Scene & Cam & Tex
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 1/aspectRatio, 1, -1 );
    camera.position.z = 2.5;
    camera.position.y = 0;
    runtime.registerCamera( camera );
    //loadMaterialnModel(scene,"../models/stanford-bunny.json",customObject,new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true }),objectFolder,0.75)
    
    loadShadernModel(scene,'../jsons/default_shader.json',"../models/teapot.json",customObject,objectFolder,-0.75)
    //loadTexturenModel(scene,"../models/stanford-bunny.json",'../textures/metal.jpg',customObject,objectFolder,0.);
    scene.add( customObject );



    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize((body.offsetWidth-40),(body.offsetWidth-40)*aspectRatio);
    canvasContainer.appendChild( renderer.domElement );
    
    // Controls
    controls = new THREE.OrbitControls(camera,renderer.domElement)
    controls.reset;
    addZoomCondition(controls,renderer)
    addLight(scene)
    resizeWindow(renderer,gui)

  }

  function reset(){
    controls.reset();
    customObject.scale.x = 1.;
    customObject.scale.y = 1.;
    customObject.scale.z = 1.;
    customObject.material.wireframe = false;
    customObject.position.y = 0.;
  }


  function animate() {

    requestAnimationFrame( animate );
    updateDATGUI()
    //### Uniform update can refer this - https://github.com/AndrewRayCode/ShaderFrog-Runtime
    time = clock.getElapsedTime();
    runtime.updateShaders(time);

    renderer.render( scene, camera );

  }







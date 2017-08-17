  var scene, camera, renderer;
  var geometry, material, mesh;

  // HTML Port
  var bodyId = "body"
  var canvasContainerId = "canvasContainer"
  var glslCodeContainerId = "glslCodeContainer"
  var cppCodeContainerId = "cppCodeContainer"
  var aspectRatio = 0.75;

  // ShaderLoader
  var runtime = new ShaderRuntime()
  var clock = new THREE.Clock()
  var customShader;
  
  // ObjectLoader
  var objectLoader = new THREE.ObjectLoader();
  var customObject;

  // TextureLoader
  var textureLoader = new THREE.TextureLoader();
  var customTexture;

  // DAT GUI
  var options;
  var gui = new dat.GUI({ autoPlace: false });
  var color = gui.addFolder('Color');
  var cam = gui.addFolder('Camera');
  var teapot = gui.addFolder('Teapot');

  init();
  animate();

  function init() {

    var canvasContainer = document.getElementById(canvasContainerId);
    var body = document.getElementById(bodyId);

    //Load & Highlight Code
    loadHighlightCode()

    //Stats
    loadStatsUI()

    //Scene & Cam
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 1/aspectRatio, 1, -1 );
    camera.position.z = 2.5;
    camera.position.y = 0;
    runtime.registerCamera( camera );


    // Load Custom Texure Obj || Custom Shader & Shape Obj
    loadShaer()
    loadObject()


    //DAT GUI
    loadDATGUI()

    //Render
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize((body.offsetWidth-40),(body.offsetWidth-40)*aspectRatio);
    canvasContainer.appendChild( renderer.domElement );
    
    //Oribit
    controls = new THREE.OrbitControls(camera,renderer.domElement)
    controls.reset;
    //Zoom
    addZoomCondition()

    //Lights
    addLight()

    //Resize
    resizeWindow()

  }

  function loadDATGUI() {
    options = {
      color:{
        background: "#3f403b"
      },
      camera: {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        positionX: 0,
        positionY: 1,
        positionZ: 2.5
      },
      teapot:{
        //positionY: 0.75,
      },
      cone:{
        //positionY: -0.75,
      },
      reset: function() {
        controls.reset();
        customObject.position.y = -0.75;
        customObject.scale.x = 1;
        customObject.scale.y = 1;
        customObject.scale.z = 1;
        customObject.material.wireframe = false;
      }
    }

    gui.domElement.style.right = (window.innerWidth - body.offsetWidth+40)/2 + 'px';
    gui.domElement.style.position = "absolute";
    color.addColor(options.color,'background').listen();
    cam.add(options.camera, 'rotationX', 0, 50).listen();
    cam.add(options.camera, 'rotationY', 0, 50).listen();
    cam.add(options.camera, 'rotationZ', 0, 50).listen();
    cam.add(options.camera, 'positionX', 0, 50).listen();
    cam.add(options.camera, 'positionY', 0, 50).listen();
    cam.add(options.camera, 'positionZ', 0, 50).listen();
    gui.add(options, 'reset');
    gui.close()
    canvasContainer.appendChild( gui.domElement );
  }

  function animate() {

    requestAnimationFrame( animate );

    //listen
    options.camera.rotationX = camera.rotation.x
    options.camera.rotationY = camera.rotation.y
    options.camera.rotationZ = camera.rotation.z
    options.camera.positionX = camera.position.x
    options.camera.positionY = camera.position.y
    options.camera.positionZ = camera.position.z

    renderer.setClearColor( options.color.background, 1 );

    //### Uniform update can refer this - https://github.com/AndrewRayCode/ShaderFrog-Runtime
    time = clock.getElapsedTime();
    runtime.updateShaders(time);
    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.005;

    renderer.render( scene, camera );

  }

  function loadStatsUI(){
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    canvasContainer.appendChild( stats.dom );

    stats.dom.style.top = "";
    stats.dom.style.left = "";
    stats.dom.style.position = "absolute";

    function animate() {
      stats.begin();
      // monitored code goes here
      stats.end();
      requestAnimationFrame( animate );
    }

    requestAnimationFrame( animate );
  }

  function loadHighlightCode(){
    var glslpre=document.createElement('pre');
    var glslcode=document.createElement('code');
    glslcode.className += "language-glsl"
    // code.innerText = '../codes/light.glsl'
    glslpre.appendChild(glslcode)
    var glslCodeContainer = document.getElementById(glslCodeContainerId);
    glslCodeContainer.appendChild( glslpre );

    // Get glsl code from local file
    var glslTxtFile = new XMLHttpRequest();
    glslTxtFile.open("GET", "../codes/default_shader.glsl", true);
    glslTxtFile.onreadystatechange = function() {
      if (glslTxtFile.readyState === 4) {  // Makes sure the document is ready to parse.
        if (glslTxtFile.status === 200) {  // Makes sure it's found the file.
          allText = glslTxtFile.responseText; 
          //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
          var customTextElement = document.getElementById('textHolder');
          glslcode.innerHTML = glslTxtFile.responseText;
        }
      }
    }
    glslTxtFile.send(null);


    var cpppre=document.createElement('pre');
    var cppcode=document.createElement('code');
    cppcode.className += "language-glsl"
    // code.innerText = '../codes/light.glsl'
    cpppre.appendChild(cppcode)
    var cppCodeContainer = document.getElementById(cppCodeContainerId);
    cppCodeContainer.appendChild( cpppre );

    // Get glsl code from local file
    var cppTxtFile = new XMLHttpRequest();
    cppTxtFile.open("GET", "../codes/triangles.cpp", true);
    cppTxtFile.onreadystatechange = function() {
      if (cppTxtFile.readyState === 4) {  // Makes sure the document is ready to parse.
        if (cppTxtFile.status === 200) {  // Makes sure it's found the file.
          allText = cppTxtFile.responseText; 
          //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
          var customTextElement = document.getElementById('textHolder');
          cppcode.innerHTML = cppTxtFile.responseText;
        }
      }
    }
    cppTxtFile.send(null);


    // Add Highlight
    window.onload = function() {
      var aCodes = document.getElementsByTagName('pre');
      for (var i=0; i < aCodes.length; i++) {
          hljs.highlightBlock(aCodes[i]);
          hljs.lineNumbersBlock(aCodes[i]);
      }
    };
  
  }

  function loadShaer(){
    runtime.load([
        // 'https://raw.githubusercontent.com/MartinRGB/OpenGL_Shading_Launguage_Notes/master/docs/jsons/Water_or_Oil.json'
        '../jsons/default_shader.json'
        //'../jsons/Water_or_Oil.json'
    ], function( shaders ) {

        //### OBJ1 - Shader
        customShader = runtime.get( shaders[0].name );
        // No texture Uniform in this example
        //customShader.uniforms.u_texture.value = THREE.ImageUtils.loadTexture( '../textures/jade.jpg' );
        //mesh.material = customShader
    });
  }


  function loadObject() {
    // BEGIN Clara.io JSON loader code
    //### OBJ2 - Load Obj
    objectLoader.load("../models/teapot.json", function ( obj ) {
       //### OBJ2 - Shape
      customObject = obj
      customObject.material = customShader

      customObject.position.y = -0.75;
      scene.add( customObject );

      teapot.add(customObject.position, 'y', 0, 2).name('positionY').listen();
      teapot.add(customObject.scale, 'x', 0, 3).name('width').listen();
      teapot.add(customObject.scale, 'y', 0, 3).name('height').listen();
      teapot.add(customObject.scale, 'z', 0, 3).name('length').listen();
      teapot.add(customObject.material, 'wireframe').listen();
    } );
    // END Clara.io JSON loader code
  }


  function addLight(){
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );
    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
  }

  function addZoomCondition(){
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;
    renderer.domElement.onmouseover = function(){
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
    }
    renderer.domElement.onmouseleave = function(){
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.enablePan = false;
    }

  }

  function resizeWindow(){
    window.addEventListener("resize", function() {
      renderer.setSize((body.offsetWidth-40),(body.offsetWidth-40)*aspectRatio);
      gui.domElement.style.right = (window.innerWidth - body.offsetWidth+40)/2 + 'px';
    });
  }




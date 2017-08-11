  var scene, camera, renderer;
  var geometry, material, mesh;

  // HTML Port
  var bodyId = "body"
  var canvasContainerId = "canvasContainer"
  var codeContainerId = "codeContainer"
  var aspectRatio = 0.75;

  // ShaderLoader
  var runtime = new ShaderRuntime()
  var clock = new THREE.Clock()
  var customShader;
  
  // ObjectLoader
  var objectLoader = new THREE.ObjectLoader();
  var customObject;

  //TextureLoader
  var textureLoader = new THREE.TextureLoader();
  var customTexture;

  init();
  animate();
  // setDATGU();


  function init() {

    //Load & Highlight Code
    loadHighlightCode()

    //Stats
    loadStatsUI()

    //Scene & Cam
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 1/aspectRatio, 1, 10000 );
    camera.position.z = 5;
    runtime.registerCamera( camera );

    //Oribit
    controls = new THREE.OrbitControls(camera)
    controls.enableZoom = false;

    // Load Custom Texure Obj || Custom Shader & Shape Obj
    loadShaer()
    loadTexture()
    loadObject()

    //Render
    var body = document.getElementById(bodyId);
    var canvasContainer = document.getElementById(canvasContainerId);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize((body.offsetWidth-40),(body.offsetWidth-40)*aspectRatio);
    canvasContainer.appendChild( renderer.domElement );

    //Lights
    addLight()

    //Zoom
    addZoomCondition()

    //Resize
    resizeWindow()

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
    var pre=document.createElement('pre');
    var code=document.createElement('code');
    code.className += "language-glsl"
    // code.innerText = '../codes/light.glsl'
    pre.appendChild(code)
    var codeContainer = document.getElementById(codeContainerId);
    codeContainer.appendChild( pre );

    // Get code from local file
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "../codes/light_frag.glsl", true);
    txtFile.onreadystatechange = function() {
      if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
        if (txtFile.status === 200) {  // Makes sure it's found the file.
          allText = txtFile.responseText; 
          //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
          var customTextElement = document.getElementById('textHolder');
          code.innerHTML = txtFile.responseText;
        }
      }
    }
    txtFile.send(null);

    // Add Highlight
    window.onload = function() {
      var aCodes = document.getElementsByTagName('pre');
      for (var i=0; i < aCodes.length; i++) {
          hljs.highlightBlock(aCodes[i]);
      }
    };
  
  }

  function loadShaer(){
    runtime.load([
        // 'https://raw.githubusercontent.com/MartinRGB/OpenGL_Shading_Launguage_Notes/master/docs/jsons/Water_or_Oil.json'
        '../jsons/perfrag_light.json'
        //'../jsons/Water_or_Oil.json'
    ], function( shaders ) {

        //### OBJ1 - Shader
        customShader = runtime.get( shaders[0].name );
        customShader.uniforms.u_texture.value = THREE.ImageUtils.loadTexture( '../textures/jade.jpg' );
        //mesh.material = customShader
    });
  }

  function loadTexture() {
    textureLoader.load(
      '../textures/metal.jpg',
      function ( texture ) {
        //### OBJ1 - Shape
        geometry = new THREE.ConeGeometry( 1, 2,32 );
        //### OBJ1 - Load Texture
        material = new THREE.MeshBasicMaterial( {
          map: texture
        } );

        //material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );
        customTexture = material
        mesh = new THREE.Mesh( geometry,customTexture); //material

        //### OBJ1 - Wireframe
        var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
        var wireframe = new THREE.LineSegments( geo, mat );
        mesh.add( wireframe );
        mesh.position.y -= 0.75;
        //mesh.rotation.x = 0.5;
        //mesh.rotation.y = 0.5;
        scene.add( mesh );
        
      },
      // Function called when download progresses
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      // Function called when download errors
      function ( xhr ) {
        console.log( 'An error happened' );
      }
    );
  }

  function loadObject() {
    // BEGIN Clara.io JSON loader code
    //### OBJ2 - Load Obj
    objectLoader.load("../models/teapot.json", function ( obj ) {
       //### OBJ2 - Shape
      customObject = obj
      customObject.material = customShader

       //### OBJ2 - Wireframe
      var geoT = new THREE.EdgesGeometry( customObject.geometry ); // or WireframeGeometry
      var matT = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10 } );
      var wireframeT = new THREE.LineSegments( geoT, matT );
      customObject.add( wireframeT );
      customObject.position.y += 0.75;
      scene.add( customObject );
    } );
    // END Clara.io JSON loader code
  }

  function animate() {

    requestAnimationFrame( animate );

    time = clock.getElapsedTime();
    //### Uniform update can refer this - https://github.com/AndrewRayCode/ShaderFrog-Runtime
    runtime.updateShaders(time);
    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.005;

    renderer.render( scene, camera );

  }

  // function setDATGU(){
  //   var gui = new dat.GUI();
  //   gui.add(text, 'num1')
  // }

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
    canvasContainer.onmouseover = function(){
      controls.enableZoom = true;
    }
    canvasContainer.onmouseleave = function(){
      controls.enableZoom = false;
    }
  }

  function resizeWindow(){
    window.addEventListener("resize", function() {
    renderer.setSize((body.offsetWidth-40),(body.offsetWidth-40)*aspectRatio);
    });
  }


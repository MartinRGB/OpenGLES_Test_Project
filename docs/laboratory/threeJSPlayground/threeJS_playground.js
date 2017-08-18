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

  // TextureLoader
  var textureLoader = new THREE.TextureLoader();
  var customTexture;

  // DAT GUI
  var options;
  var gui = new dat.GUI({ autoPlace: false });
  var color = gui.addFolder('Color');
  var cam = gui.addFolder('Camera');
  var teapot = gui.addFolder('Teapot');
  var cone = gui.addFolder('Cone');

  init();
  animate();

  function init() {

    var canvasContainer = document.getElementById(canvasContainerId);
    var body = document.getElementById(bodyId);

    //Load & Highlight Code
    loadHighlightCode("language-glsl","../../codes/light_frag.glsl",codeContainerId);

    //Stats
    loadStatsUI()

    //Scene & Cam
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 1/aspectRatio, 1, 10000 );
    camera.position.z = 5;
    runtime.registerCamera( camera );


    // Load Custom Texure Obj || Custom Shader & Shape Obj
    loadShaer()
    loadTexture()
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
        positionY: 0,
        positionZ: 0
      },
      teapot:{
        //positionY: 0.75,
      },
      cone:{
        //positionY: -0.75,
      },
      reset: function() {
        controls.reset();
        mesh.position.y = -0.75;
        mesh.scale.x = 1;
        mesh.scale.y = 1;
        mesh.scale.z = 1;
        customObject.position.y = 0.75;
        customObject.scale.x = 1;
        customObject.scale.y = 1;
        customObject.scale.z = 1;
        mesh.material.wireframe = false;
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

  // function loadHighlightCode(){
  //   var pre=document.createElement('pre');
  //   var code=document.createElement('code');
  //   code.className += "language-glsl"
  //   // code.innerText = '../codes/light.glsl'
  //   pre.appendChild(code)
  //   var codeContainer = document.getElementById(codeContainerId);
  //   codeContainer.appendChild( pre );

  //   // Get code from local file
  //   var txtFile = new XMLHttpRequest();
  //   txtFile.open("GET", "../codes/light_frag.glsl", true);
  //   txtFile.onreadystatechange = function() {
  //     if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
  //       if (txtFile.status === 200) {  // Makes sure it's found the file.
  //         allText = txtFile.responseText; 
  //         //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
  //         var customTextElement = document.getElementById('textHolder');
  //         code.innerHTML = txtFile.responseText;
  //       }
  //     }
  //   }
  //   txtFile.send(null);

  //   // Add Highlight
  //   window.onload = function() {
  //     var aCodes = document.getElementsByTagName('pre');
  //     for (var i=0; i < aCodes.length; i++) {
  //         hljs.highlightBlock(aCodes[i]);
  //     }
  //   };
  
  // }

  function loadShaer(){
    runtime.load([
        // 'https://raw.githubusercontent.com/MartinRGB/OpenGL_Shading_Launguage_Notes/master/docs/jsons/Water_or_Oil.json'
        '../../jsons/perfrag_light.json'
        //'../jsons/Water_or_Oil.json'
    ], function( shaders ) {

        //### OBJ1 - Shader
        customShader = runtime.get( shaders[0].name );
        customShader.uniforms.u_texture.value = THREE.ImageUtils.loadTexture( '../../textures/jade.jpg' );
        //mesh.material = customShader
    });
  }

  function loadTexture() {
    textureLoader.load(
      '../../textures/metal.jpg',
      function ( texture ) {
        //### OBJ1 - Shape
        texture.repeat.x = 0.5;
        texture.repeat.y = 0.25;
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
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
        var wireframe = new THREE.LineSegments( geo, mat );
        //mesh.add( wireframe );
        mesh.position.y -= 0.75;
        //mesh.rotation.x = 0.5;
        //mesh.rotation.y = 0.5;
        scene.add( mesh );

        cone.add(mesh.position, 'y', -2, 0).name('positionY').listen();
        cone.add(mesh.scale, 'x', 0, 3).name('width').listen();
        cone.add(mesh.scale, 'y', 0, 3).name('height').listen();
        cone.add(mesh.scale, 'z', 0, 3).name('length').listen();
        cone.add(mesh.material, 'wireframe').listen();
        
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
    objectLoader.load("../../models/teapot.json", function ( obj ) {
       //### OBJ2 - Shape
      customObject = obj
      customObject.material = customShader

       //### OBJ2 - Wireframe
      var geoT = new THREE.EdgesGeometry( customObject.geometry ); // or WireframeGeometry
      var matT = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
      var wireframeT = new THREE.LineSegments( geoT, matT );
      //customObject.add( wireframeT );
      customObject.position.y += 0.75;
      scene.add( customObject );

      teapot.add(customObject.position, 'y', 0, 2).name('positionY').listen();
      teapot.add(customObject.scale, 'x', 0, 3).name('width').listen();
      teapot.add(customObject.scale, 'y', 0, 3).name('height').listen();
      teapot.add(customObject.scale, 'z', 0, 3).name('length').listen();
      teapot.add(customObject.material, 'wireframe').listen();
    } );
    // END Clara.io JSON loader code
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




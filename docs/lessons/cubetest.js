  var scene, camera, renderer;
  var geometry, material, mesh;

  var colck = clock = new THREE.Clock()
  var bodyId = "body"
  var canvasContainerId = "canvasContainer"
  var aspectRatio = 0.75;

  var runtime = new ShaderRuntime()
  var materialTopShader;


  runtime.load([
      // 'https://raw.githubusercontent.com/MartinRGB/OpenGL_Shading_Launguage_Notes/master/docs/jsons/Water_or_Oil.json'
      '../jsons/perfrag_light.json'
      // '../jsons/Water_or_Oil.json'
  ], function( shaders ) {

      materialTopShader = runtime.get( shaders[0].name );
      mesh.material = materialTopShader
  });

  init();
  animate();
  

  


  function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 1/aspectRatio, 1, 10000 );
    camera.position.z = 1000;

    //Oribit
    controls = new THREE.OrbitControls(camera)
    //controls.enableZoom = false;

    runtime.registerCamera( camera );

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );
    mesh = new THREE.Mesh( geometry); //material
    scene.add( mesh );


    //Render & Append
    var body = document.getElementById(bodyId);
    var canvasContainer = document.getElementById(canvasContainerId);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize(body.offsetWidth,body.offsetWidth*aspectRatio);
    canvasContainer.appendChild( renderer.domElement );

    //Lights
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

    //window Resize Func
    window.addEventListener("resize", function() {
    renderer.setSize(body.offsetWidth,body.offsetWidth*aspectRatio);
    });


  }

  function animate() {

    requestAnimationFrame( animate );

    time = clock.getElapsedTime();
    runtime.updateShaders( time );
    mesh.rotation.x = time;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

  }
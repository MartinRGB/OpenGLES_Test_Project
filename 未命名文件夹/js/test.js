  var scene, camera, renderer;
  var geometry, material, mesh;
  var runtime = new ShaderFrogRuntime();

  var bodyId = "body"
  var canvasContainerId = "canvasContainer"
  var aspectRatio = 0.75;


  init();
  animate();


  // Load multiple ShaderFrog shaders
  runtime.load([
      'http://andrewray.me/stuff/Reflection_Cube_Map.json',
      'https://s3-us-west-1.amazonaws.com/shader-frog/example/Water_or_Oil.json'
  ], function( shaders ) {


      // ShaderFrog shader 2 (oily effect)
      var materialBottom = runtime.get( shaders[ 1 ].name );
      mesh.material = materialBottom;
  });

  

  // ### window Resize Func
  var windowOnResize = function() {
   renderer.setSize(body.offsetWidth,body.offsetWidth*aspectRatio);
  }

  window.addEventListener("resize", windowOnResize);


  function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry ); //material
    scene.add( mesh );

    // renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );

    //My Way
    var body = document.getElementById(bodyId);
    var canvasContainer = document.getElementById(canvasContainerId);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(body.offsetWidth,body.offsetWidth*aspectRatio);
    canvasContainer.appendChild( renderer.domElement );


  }

  function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

  }
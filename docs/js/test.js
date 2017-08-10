var camera, scene, renderer;
var geometry, material, mesh;
var uniforms;
var startTime;

var container = document.getElementById( 'canvasContainer' );
var body = document.getElementById('body');
var aspectRatio = 0.75;

init();
animate();

function init() {


  startTime = Date.now();
  
  scene = new THREE.Scene();

  camera = new THREE.Camera();
  camera.position.z = 1;

  uniforms = {
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v2", value: new THREE.Vector2() }
  };

  geometry = new THREE.PlaneBufferGeometry( 2., 2. );

  material = new THREE.ShaderMaterial( {

    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent

  } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  container.appendChild( renderer.domElement );
  renderer.setSize( body.offsetWidth, body.offsetWidth*aspectRatio);

  onWindowResize();

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize( event ) {

  uniforms.iResolution.value.x = body.offsetWidth;
  uniforms.iResolution.value.y = body.offsetWidth;

  renderer.setSize( body.offsetWidth, body.offsetWidth*aspectRatio);

}

function animate() {

  requestAnimationFrame( animate );

  mesh.rotation.x += 0.1;
  mesh.rotation.y += 0.2;

  render();

}

function render() {

  var currentTime = Date.now();
  uniforms.iGlobalTime.value = (currentTime - startTime) * 0.001;
  renderer.render( scene, camera );

}
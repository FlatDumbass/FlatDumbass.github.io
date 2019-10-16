var camera,scene;
const canvas  = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
});

scene = new THREE.Scene();
//fov, aspect, near, far
camera = new THREE.PerspectiveCamera( 75, 2, 0.1, 200 );
camera.position.set( 0, 5, 16 );
camera.lookAt(  0, 5, 0 );
const cameraPole = new THREE.Object3D();
scene.add(cameraPole);
cameraPole.add(camera);

var loader = new THREE.GLTFLoader();
loader.load( 'js/scene.glb', function ( gltf ) {
  const root = gltf.scene;
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );
} );


function resizeRendererToDisplaySize(renderer) {
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
  }

function animate(time) {
  time *= 0.001;
  if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  cameraPole.rotation.y = time * .2;
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}


animate();

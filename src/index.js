import * as THREE from 'three'
import {ParametricGeometry} from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';

let container, camera, scene, renderer, effect;

			const spheres = [];

			let mouseX = 0;
			let mouseY = 0;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			document.addEventListener( 'mousemove', onDocumentMouseMove );

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100 );
				camera.position.z = 3;
				camera.focalLength = 3;

				scene = new THREE.Scene();

				const geometry = new ParametricGeometry(hyperbolicHelicoidEquantion, 10, 16);
				//  const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
        const material = new THREE.MeshNormalMaterial();

				console.log(geometry);

				for ( let i = 0; i < 50; i ++ ) {

					const mesh = new THREE.Mesh( geometry, material );

					mesh.position.x = Math.random() * 10 - 5;
					mesh.position.y = Math.random() * 10 - 5;
					mesh.position.z = Math.random() * 10 - 5;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.5 + 1;

					scene.add( mesh );

					spheres.push( mesh );

				}

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				container.appendChild( renderer.domElement );

				const width = window.innerWidth || 2;
				const height = window.innerHeight || 2;

				effect = new AnaglyphEffect( renderer );
				effect.setSize( width, height );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				effect.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 100;
				mouseY = ( event.clientY - windowHalfY ) / 100;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				const timer = 0.0001 * Date.now();

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				for ( let i = 0, il = spheres.length; i < il; i ++ ) {

					const sphere = spheres[ i ];

					sphere.position.x = 5 * Math.cos( timer + i );
					sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

				}

				effect.render( scene, camera );

			}

      function hyperbolicHelicoidEquantion(u, v, target) {
        let alpha = Math.PI * 2 *(u - 0.5);
        let theta = Math.PI * 2 *(v - 0.5);
        let t = 5;
        let bottom = 1 + Math.cosh(alpha)*Math.cosh(theta);
      
        let x = Math.sinh(alpha)*Math.cos(t*theta)/bottom;
        let z = Math.sinh(alpha)*Math.sin(t*theta)/bottom;
        let y = 1.5*Math.cosh(alpha)*Math.sinh(theta)/bottom;  
      
        return  target.set(x,y,z);
      }

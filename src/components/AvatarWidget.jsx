import { useEffect, useRef, useState } from 'react';

function AvatarWidget() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const hasWavedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically load Three.js and create avatar
    const initAvatar = async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader');

        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width || 960;
        const height = rect.height || 1200;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 1.6, 3);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);

        // Lights
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        let mixer = null;
        let idleAction = null;
        let headBone = null;
        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let interactiveMeshes = [];
        let shadowPlane = null;

        // Load Avatar
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        // Helper to load GLTF with Cache API
        const loadGLB = async (url) => {
          try {
            const cacheName = 'avatar-cache-v1';
            let blob;

            // Try to find in cache first
            if ('caches' in window) {
              try {
                const cache = await caches.open(cacheName);
                const cachedResponse = await cache.match(url);

                if (cachedResponse) {
                  console.log(`Loading ${url} from cache`);
                  blob = await cachedResponse.blob();
                } else {
                  console.log(`Downloading ${url} and caching...`);
                  const response = await fetch(url);
                  if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

                  // Clone response to put in cache
                  cache.put(url, response.clone());
                  blob = await response.blob();
                }
              } catch (e) {
                console.warn('Cache API error, falling back to network', e);
                // Fallback to fetch if cache fails
                const response = await fetch(url);
                blob = await response.blob();
              }
            } else {
              // Fallback for browsers without Cache API
              const response = await fetch(url);
              blob = await response.blob();
            }

            // Create object URL from blob
            const objectUrl = URL.createObjectURL(blob);

            return new Promise((resolve, reject) => {
              loader.load(
                objectUrl,
                (gltf) => {
                  // Clean up blob URL after loading to free memory
                  // URL.revokeObjectURL(objectUrl); 
                  resolve(gltf);
                },
                undefined,
                (error) => {
                  reject(error);
                }
              );
            });

          } catch (err) {
            console.error(`Error loading ${url}:`, err);
            // Last resort fallback
            return new Promise((resolve, reject) => {
              loader.load(url, resolve, undefined, reject);
            });
          }
        };

        let gltf, waveGltf;
        try {
          // Load both files in parallel
          [gltf, waveGltf] = await Promise.all([
            loadGLB('/Breathing Idle.glb'),
            loadGLB('/Wave.glb')
          ]);
        } catch (err) {
          console.warn('Failed to load avatar assets:', err);
          setIsLoading(false);
          return;
        }

        const model = gltf.scene;
        scene.add(model);


        // Frame model
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        const radius = Math.max(size.x, size.y, size.z) * 0.5;
        // Find this section in AvatarWidget.jsx and update the distance
        const distance = (size.y * 1.0) / Math.tan((camera.fov * Math.PI) / 360); // Changed 1.3 to 1.0
        const safeDistance = Math.min(Math.max(distance * 1.1, 2.0), 5); // Tighten the zoom range
        camera.position.set(0, 0, safeDistance);
        camera.lookAt(0, 0, 0);

        // Soft floor shadow under avatar to ground it
        const makeShadowTexture = () => {
          const c = document.createElement('canvas');
          c.width = 256; c.height = 256;
          const ctx = c.getContext('2d');
          const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 120);
          g.addColorStop(0.0, 'rgba(0,0,0,0.35)');
          g.addColorStop(0.5, 'rgba(0,0,0,0.18)');
          g.addColorStop(1.0, 'rgba(0,0,0,0.0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 256, 256);
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        const shadowWidth = Math.max(size.x, size.z) * 1.6;
        const shadowHeight = shadowWidth * 0.6;
        const shadowMat = new THREE.MeshBasicMaterial({
          map: makeShadowTexture(),
          transparent: true,
          depthWrite: false,
          opacity: 0.9,
        });
        const shadowGeo = new THREE.PlaneGeometry(shadowWidth, shadowHeight);
        shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.set(0, -size.y * 0.52, 0);
        shadowPlane.renderOrder = 0;
        scene.add(shadowPlane);

        // Cache meshes
        model.traverse((obj) => {
          if (obj.isMesh) interactiveMeshes.push(obj);
        });

        // Find head bone
        model.traverse((obj) => {
          if (obj.isBone && /head|neck/i.test(obj.name)) {
            headBone = obj;
          }
        });

        // Animations
        mixer = new THREE.AnimationMixer(model);
        const actions = {};
        gltf.animations.forEach((clip) => {
          actions[clip.name] = mixer.clipAction(clip);
        });

        if (gltf.animations.length > 0) {
          const waveClip = waveGltf.animations[0];
          const waveAction = mixer.clipAction(waveClip);
          actions['manual_wave'] = waveAction;
        }
        const idleClip = gltf.animations.find((c) => /idle|breath/i.test(c.name)) || gltf.animations[0];
        idleAction = actions[idleClip.name];
        if (idleAction) idleAction.play();

        // Event handlers
        const handleResize = () => {
          if (!container.parentElement) return;
          const rect = container.getBoundingClientRect();
          const w = rect.width || 320;
          const h = rect.height || 420;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        const handlePointerMove = (event) => {
          const rect = renderer.domElement.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            return;
          }

          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          if (!headBone || interactiveMeshes.length === 0) return;

          raycaster.setFromCamera(pointer, camera);
          const intersects = raycaster.intersectObjects(interactiveMeshes, true);
          if (intersects.length === 0) return;

          const rx = (event.clientX - rect.left) / rect.width - 0.5;
          const ry = (event.clientY - rect.top) / rect.height - 0.5;
          const targetY = THREE.MathUtils.clamp(rx * 0.5, -0.35, 0.35);
          const targetX = THREE.MathUtils.clamp(ry * 0.5, -0.25, 0.25);

          headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetY, 0.15);
          headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetX, 0.12);
        };

        const handleClick = () => {
          if (!mixer) return;

          const wave = actions['Wave'] || actions['wave'];
          if (wave) {
            wave.reset().setLoop(THREE.LoopOnce, 1);
            wave.clampWhenFinished = true;
            if (idleAction) idleAction.crossFadeTo(wave, 0.25, false);
            wave.play();

            mixer.addEventListener('finished', () => {
              if (idleAction) idleAction.reset().fadeIn(0.25).play();
            });
            return;
          }

          if (headBone) {
            const start = headBone.rotation.x;
            headBone.rotation.x = start + 0.2;
            setTimeout(() => {
              if (headBone) headBone.rotation.x = start;
            }, 250);
          }
        };

        const triggerWave = () => {
          if (!mixer || hasWavedRef.current) return;

          const wave = actions['manual_wave'];
          if (wave) {
            console.log("Wave triggered!"); // Check your console to see this
            hasWavedRef.current = true;

            wave.reset();
            wave.setLoop(THREE.LoopOnce, 1);
            wave.clampWhenFinished = true;

            if (idleAction) idleAction.crossFadeTo(wave, 0.4, false);
            wave.play();

            const returnToIdle = (e) => {
              if (e.action === wave) {
                if (idleAction) {
                  wave.crossFadeTo(idleAction, 0.4, false);
                  idleAction.reset().fadeIn(0.4).play();
                }
                hasWavedRef.current = false;
                mixer.removeEventListener('finished', returnToIdle);
              }
            };
            mixer.addEventListener('finished', returnToIdle);
          } else {
            console.error("Wave animation clip not found in Wave.glb");
          }
        };



        const handleMouseEnter = () => {
          setIsHovering(true);
          triggerWave();
        };

        const handleMouseLeave = () => {
          setIsHovering(false);
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handlePointerMove);
        renderer.domElement.addEventListener('click', handleClick);
        renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
        renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

        // Animation loop
        let frameId;
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          const dt = clock.getDelta();
          if (mixer) mixer.update(dt);
          renderer.render(scene, camera);
        };
        animate();

        // Mark as loaded!
        setIsLoading(false);

        // Cleanup
        return () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', handleResize);
          document.removeEventListener('mousemove', handlePointerMove);
          renderer.domElement.removeEventListener('click', handleClick);
          renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
          renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
          // dispose shadow plane
          try {
            if (shadowPlane) {
              shadowPlane.geometry.dispose();
              if (shadowPlane.material.map) shadowPlane.material.map.dispose();
              shadowPlane.material.dispose();
            }
          } catch (_) { }
          try {
            container.removeChild(renderer.domElement);
          } catch (e) { }
          renderer.dispose();
        };
      } catch (error) {
        console.error('Avatar error:', error);
        setIsLoading(false);
      }
    };

    const cleanup = initAvatar();
    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, []);

  return (
    <div className="relative">
      {/* Dialogue Box & Chat Option */}
      {/* Bot Chat Icon */}
      {/* Permanent display to avoid flickering */}
      {/* Dialogue Box & Chat Option */}
      {/* Bot Chat Icon removed - moved to Layout.jsx */}

      <div className="relative">
        {/* Aura Effect for Home Page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan/5 blur-[80px] rounded-full animate-pulse delay-0 transition-all duration-1000 mix-blend-screen pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-cyan/10 blur-[50px] rounded-full animate-pulse delay-150 transition-all duration-1000 mix-blend-screen pointer-events-none -z-10" />

        {/* LOADING STATE - BREATHING GIF */}
        {/* We keep this visible until isLoading is false, then fade it out */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src="/Breathing-Gif.gif"
            alt="Loading..."
            className="w-full h-full object-contain scale-[1.8] brightness-[0.6]"
          />
        </div>

        {/* 3D CONTAINER */}
        {/* We fade this IN when loading is done */}
        <div
          ref={containerRef}
          className={`w-[300px] h-[600px] rounded-xl overflow-hidden cursor-pointer relative z-10 transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
    </div>
  );
}

export default AvatarWidget;

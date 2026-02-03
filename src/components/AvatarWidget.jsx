import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
function AvatarWidget() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showChatOption, setShowChatOption] = useState(false);
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

        const loadGLB = (url) => {
          return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          });
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
          setShowChatOption(prev => !prev);
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
      <button
        onClick={() => navigate('/chat')}
        className="absolute bottom-4 right-4 z-50 group"
        aria-label="Chat with Dextora"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-cyan rounded-full animate-ping opacity-20 group-hover:opacity-40 duration-1000" />

        {/* Icon Container */}
        <div className="relative bg-charcoal border border-cyan/50 p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-all duration-300">
          <Bot className="w-8 h-8 text-cyan group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Simple tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <span className="text-cyan text-xs font-mono tracking-widest bg-charcoal/90 px-2 py-1 rounded border border-cyan/20">CHAT</span>
        </div>
      </button>

      <div className="relative">
        {/* Aura Effect for Home Page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan/5 blur-[80px] rounded-full animate-pulse delay-0 transition-all duration-1000 mix-blend-screen pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-cyan/10 blur-[50px] rounded-full animate-pulse delay-150 transition-all duration-1000 mix-blend-screen pointer-events-none -z-10" />

        <div
          ref={containerRef}
          className="w-[300px] h-[600px] rounded-xl overflow-hidden cursor-pointer relative z-10"
        />
      </div>
    </div>
  );
}

export default AvatarWidget;

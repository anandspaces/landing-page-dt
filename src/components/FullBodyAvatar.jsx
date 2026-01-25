import { useEffect, useRef, useState } from 'react';

function FullBodyAvatar({ isTalking }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const actionsRef = useRef({ idle: null, talk: null });
  const mixerRef = useRef(null);

  // Handle Animation State Changes
  useEffect(() => {
    const { idle, talk } = actionsRef.current;
    if (!idle || !talk) return;

    const fadeDuration = 0.3;

    if (isTalking) {
      console.log("Switching to Talk animation");
      idle.fadeOut(fadeDuration);
      talk.reset().fadeIn(fadeDuration).play();
    } else {
      console.log("Switching to Idle animation");
      talk.fadeOut(fadeDuration);
      idle.reset().fadeIn(fadeDuration).play();
    }
  }, [isTalking]);

  useEffect(() => {
    if (!containerRef.current) return;

    const initAvatar = async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader');

        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 800;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera - adjusted for full body view
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0.8, 4);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Lights
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(5, 10, 7);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);
        const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
        backLight.position.set(0, 5, -5);
        scene.add(backLight);
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));

        const clock = new THREE.Clock();
        let shadowPlane = null;

        // Loaders
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        console.log('Loading avatars...');

        // Helper to load GLTF
        const loadGltf = (url) => new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });

        try {
          const [idleGltf, talkGltf] = await Promise.all([
            loadGltf('/Breathing Idle.glb'),
            loadGltf('/Talking01.glb')
          ]);

          console.log('Avatars loaded successfully!');

          // Use the Idle model as the visual mesh
          const model = idleGltf.scene;
          scene.add(model);

          // Frame model
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);

          // Camera pos
          const fov = camera.fov * (Math.PI / 180);
          const distance = Math.abs(size.y / (2 * Math.tan(fov / 2))) * 1.5;
          camera.position.set(0, size.y * 0.15, distance);
          camera.lookAt(0, size.y * 0.15, 0);

          // Shadow
          const makeShadowTexture = () => {
            const c = document.createElement('canvas');
            c.width = 256; height: 256;
            c.height = 256;
            const ctx = c.getContext('2d');
            const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 120);
            g.addColorStop(0.0, 'rgba(0,0,0,0.5)');
            g.addColorStop(0.5, 'rgba(0,0,0,0.25)');
            g.addColorStop(1.0, 'rgba(0,0,0,0.0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 256, 256);
            return new THREE.CanvasTexture(c);
          };

          const shadowWidth = Math.max(size.x, size.z) * 2.5;
          const shadowHeight = shadowWidth * 0.6;
          const shadowMat = new THREE.MeshBasicMaterial({
            map: makeShadowTexture(),
            transparent: true,
            depthWrite: false,
            opacity: 0.7,
          });
          shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(shadowWidth, shadowHeight), shadowMat);
          shadowPlane.rotation.x = -Math.PI / 2;
          shadowPlane.position.set(0, -size.y * 0.5, 0);
          scene.add(shadowPlane);

          // Animations
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const idleClip = idleGltf.animations.find((c) => /idle|breath/i.test(c.name)) || idleGltf.animations[0];
          const talkClip = talkGltf.animations[0]; // Assuming first animation is the talk one

          if (idleClip) {
            const action = mixer.clipAction(idleClip);
            action.play();
            actionsRef.current.idle = action;
          }
          if (talkClip) {
            const action = mixer.clipAction(talkClip);
            // Don't play yet, just store
            action.loop = THREE.LoopRepeat;
            actionsRef.current.talk = action;
          }

          setIsLoading(false);

        } catch (err) {
          console.error('Failed to load avatars:', err);
          setError(`Failed to load avatar: ${err.message}`);
          setIsLoading(false);
          return;
        }

        // Resize
        const handleResize = () => {
          if (!container.parentElement) return;
          const rect = container.getBoundingClientRect();
          const w = rect.width || 800;
          const h = rect.height || 800;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Loop
        let frameId;
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          const dt = clock.getDelta();
          if (mixerRef.current) mixerRef.current.update(dt);
          renderer.render(scene, camera);
        };
        animate();

        return () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', handleResize);
          try {
            if (shadowPlane) {
              shadowPlane.geometry.dispose();
              if (shadowPlane.material.map) shadowPlane.material.map.dispose();
              shadowPlane.material.dispose();
            }
          } catch (_) { }
          try { container.removeChild(renderer.domElement); } catch (e) { }
          renderer.dispose();
        };

      } catch (error) {
        console.error('Init error:', error);
        setError(`Error: ${error.message}`);
        setIsLoading(false);
      }
    };

    const cleanup = initAvatar();
    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, []); // Run once on mount

  return (
    <div className="relative w-full h-full flex items-center justify-center rounded-2xl">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
          <div className="w-20 h-20 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-2xl font-semibold">Loading avatar...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4 bg-red-900/20">
          <div className="text-white text-center px-4">
            <p className="text-3xl font-bold mb-4">⚠️ Error</p>
            <p className="text-xl text-red-300">{error}</p>
            <p className="text-sm mt-2 text-slate-300">Check console for details (F12)</p>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
}

export default FullBodyAvatar;

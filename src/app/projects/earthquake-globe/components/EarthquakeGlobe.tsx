import { useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import { WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, AmbientLight, PointLight } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EarthquakePoint, getMagnitudeColor } from '@/utils/earthquakeData';

interface EarthquakeGlobeProps {
  earthquakes: EarthquakePoint[];
  width?: number;
  height?: number;
}

export default function EarthquakeGlobe({ earthquakes, width = 1320, height = 924 }: EarthquakeGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 225;

    // Create renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe@2.27.1/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe@2.27.1/example/img/earth-topology.png');

    // Transform earthquakes to globe points
    const pointsData = earthquakes.map(eq => ({
      lat: eq.lat,
      lng: eq.lng,
      size: Math.max(0.15, eq.magnitude * 0.08),
      color: getMagnitudeColor(eq.magnitude),
      altitude: 0.01,
      magnitude: eq.magnitude,
      place: eq.place,
    }));

    // Add earthquake points
    globe
      .pointsData(pointsData)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointAltitude('altitude')
      .pointRadius('size')
      .pointsMerge(false);

    scene.add(globe);

    // Add lights
    const ambientLight = new AmbientLight(0xbbbbbb, 0.3);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new PointLight(0xffffff, 0.5);
    pointLight.position.set(-200, 500, 200);
    scene.add(pointLight);

    // Add orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.minDistance = 135;
    controls.maxDistance = 360;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Animation loop
    let animationId: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    setIsLoading(false);
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [earthquakes, width, height]);

  return (
    <div style={{ position: 'relative', width, height }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '18px',
          }}
        >
          Loading Globe...
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Preload , useScroll, ScrollControls} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";

import { TextSection } from "./TextSection";
import CanvasLoader from "../Loader";
import { fetchPlanetsData, fetchPeopleData } from '../Api';
const LINE_NB_POINTS = 2000;

const Planets = () => {
  const obj = useLoader(FBXLoader, "./solar-system-paint-3d/source/Solar System.fbx");

  return (
    <mesh>
      <hemisphereLight intensity={2} groundColor='black' />
      <primitive
        object={obj}
        scale={100}
        rotation={[0,90,0]}
      />
    </mesh>
  );
};

const UniverseCanvas = () => {
  const [config, setConfig] = useState({ fov: 60, position: [0, 0, 5] });
  const [planetData, setPlanetData] = useState([]);
  const [textSections, setTextSections] = useState([]);

  useEffect(() => {
    fetchGenerateText();
  }, []);

  async function fetchGenerateText() {
    try {
      const { data, length } = await fetchPeopleData();
      const fetchedPlanetData = await fetchPlanetsData();
      setPlanetData(fetchedPlanetData);
      // console.log(planetData);                              

      const sections = [
        {
          cameraRailDist: -1,
          position: new Vector3(
            curvePoints[0].x - 3,
            curvePoints[0].y,
            curvePoints[0].z-1
          ),
          rotation: new THREE.Euler( 0, -0.2768,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        {
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[2].x +3,
            curvePoints[2].y,
            curvePoints[2].z-1
          ),
          rotation: new THREE.Euler( -0.005, -1.047,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        {
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[3].x-3,
            curvePoints[3].y,
            curvePoints[3].z-1
          ),
          rotation: new THREE.Euler( -0.0039, -1.047,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        // {
        //   cameraRailDist: 1,
        //   position: new Vector3(
        //     curvePoints[4].x +3,
        //     curvePoints[4].y,
        //     curvePoints[4].z-1
        //   ),
        //   rotation: new THREE.Euler( 0,0,0, 'XYZ' ),
        //   title: "Welcome to your ride",
        //   subtitle: `Did you know that there's ${length} people in space right now?`,
        // },
        { // earth
          cameraRailDist: 1,
          position: new Vector3(33-3,3-2,-19
            // curvePoints[4].x +3,
            // curvePoints[4].y,
            // curvePoints[4].z-1
          ),
          rotation: new THREE.Euler( -0.013,0.787,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        { // mars
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[5].x-3,
            curvePoints[5].y-1,
            curvePoints[5].z+2
          ),
          rotation: new THREE.Euler( -0.01,1.05,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        {
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[6].x,
            curvePoints[6].y-1,
            curvePoints[6].z+2
          ),
          rotation: new THREE.Euler( 0.0018,1.05,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        {
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[7].x-1,
            curvePoints[7].y,
            curvePoints[7].z-2
          ),
          rotation: new THREE.Euler( 0.013,-0.32,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        },
        {
          cameraRailDist: 1,
          position: new Vector3(
            curvePoints[8].x-3,
            curvePoints[8].y,
            curvePoints[8].z
          ),
          rotation: new THREE.Euler( 0.002,-0.109,0, 'XYZ' ),
          title: "Welcome to your ride",
          subtitle: `Did you know that there's ${length} people in space right now?`,
        }
      ];

      setTextSections(sections);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // responsive perspective camera setup according to window size 
  useEffect(() => {
    function handleWindowResize() {
      const { innerWidth, innerHeight } = window;
      if (innerWidth > innerHeight) {
        // LANDSCAPE
        setConfig({ fov: 60, position: [-1, 0, 5] });
      } else {
        // PORTRAIT
        setConfig({ fov: 100, position: [-1, 0, 9] });
      }
    }

    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(20, 0, 10),
      new THREE.Vector3(21, 0, 0),
      // new THREE.Vector3(28, 0, -8),
      new THREE.Vector3(28.5, 0.5, -11),
      new THREE.Vector3(30, 1, -13),
      new THREE.Vector3(33, 2, -16),
      // new THREE.Vector3(34, 2.5, -17),
      new THREE.Vector3(27, 5, -33),  // 28 4 -31
      new THREE.Vector3(18, 5, -40), // 19 6 -39/40
      new THREE.Vector3(5, 3, -50), // 5 2 -52
      new THREE.Vector3(7, 0, -60), // yes
      new THREE.Vector3(7, 0, -62),
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvePoints,
      false,
      "centripetal",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.015);
    shape.lineTo(0, 0.018);

    return shape;
  }, [curve]);

  function kelvinToFahrenheit(kelvin) {
    if (typeof kelvin !== 'number') {
      throw new Error('Invalid, must be a number.');
    }
  
    const f = (kelvin - 273.15) * (9 / 5) + 32;
    return f;
  }

  const cameraGroup = useRef();

  function UpdateFrame() {

    const scroll = useScroll();
    const update = useFrame((_state, delta) => {
      const curPointIndex = Math.min(
        Math.round(scroll.offset * linePoints.length),
        linePoints.length - 1
      );
      const curPoint = linePoints[curPointIndex];
      const pointAhead =
      linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];

      const xDisplacement = (pointAhead.x - curPoint.x) * 80;
      const yDisplacement = (pointAhead.y - curPoint.y) * 80;

      // Math.PI / 2 -> LEFT & -Math.PI / 2 -> RIGHT
      const angleRotation =
        (xDisplacement < 0 ? 1 : -1) *
        Math.min(Math.abs(xDisplacement), Math.PI / 3);
      
      const Y_angleRotation =
        (yDisplacement < 0 ? 1 : -1) *
        Math.min(Math.abs(yDisplacement), Math.PI / 3);

      const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          Y_angleRotation/80,
          angleRotation,
          cameraGroup.current.rotation.z
        )
      );
      cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta);
      cameraGroup.current.position.lerp(curPoint, delta*24);
      // console.log(cameraGroup.current.rotation);
      // console.log(cameraGroup.current.position);
    });

  }

  return (
    <Canvas>

      <Suspense fallback={<CanvasLoader />}>
        <ScrollControls pages={30} damping={1}>

          {/* line */}
          <group position-y={-2}>
            <mesh>
              <extrudeGeometry
                args={[
                  shape,
                  {
                    steps: LINE_NB_POINTS,
                    bevelEnabled: false,
                    extrudePath: curve,
                  },
                ]}
              />
              <meshStandardMaterial color={"white"} opacity={0.7} transparent />
            </mesh>
          </group>
          {/* text */}
          {textSections.map((textSection, index) => (
            <TextSection {...textSection} key={index} />
          ))}
          <group ref={cameraGroup}>
            <UpdateFrame />
            <PerspectiveCamera position={config.position} fov={config.pov} rotation={[0,0,0]} makeDefault />
          </group>
          <Planets />
        </ScrollControls>
      </Suspense>
      <Preload all />
    </Canvas>
  );
 }

export default UniverseCanvas
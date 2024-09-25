import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {Float, PerspectiveCamera, Preload , useScroll, ScrollControls} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from "three";
import { Euler, Group,Vector3 } from "three";

import { TextSection } from "./TextSection";
import { Cloud } from "../3d components/Cloud";
import { Background } from "../3d components/Background";
import CanvasLoader from "../Loader";
import { fetchPlanetsData } from '../Api';
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

const Rocket = (props) => {
  const obj = useLoader(FBXLoader, "./ship/Rocket Ship.fbx");
  
  return (
    <mesh>
      <hemisphereLight intensity={2} groundColor='black' />
      <primitive
        object={obj}
        scale={10}
        rotation={[0,90,0]}
      />
    </mesh>
  );
};


const UniverseCanvas = () => {
  const [config, setConfig] = useState({ fov: 100, position: [1, 0, -1.75] });
  const [planetData, setPlanetData] = useState([]);
  const [textSections, setTextSections] = useState([]);
  const firstFrame = useRef(true);

  useEffect(() => {
    fetchGenerateText();
  }, []);

  const fetchGenerateText = async () => {
    try {
      const planetDataFetched = await fetchPlanetsData();
      setPlanetData(planetDataFetched);
    } catch (error) {
      console.error(error);
    }
  }
  
  // responsive perspective camera setup according to window size 
  useEffect(() => {
    function handleWindowResize() {
      const { innerWidth, innerHeight } = window;
      if (innerWidth > innerHeight) {
        // LANDSCAPE
        setConfig({ fov: 60, position: [1, 0, 5] });
      } else {
        // PORTRAIT
        setConfig({ fov: 100, position: [1, 0, 9] });
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
      new THREE.Vector3(28.5, 0.5, -11),
      new THREE.Vector3(30, 0, -13),
      new THREE.Vector3(33, 0, -30),
      new THREE.Vector3(27, 0, -33),  // 28 4 -31
      new THREE.Vector3(18, 0, -40), // 19 6 -39/40
      new THREE.Vector3(10, 0, -50), // 5 2 -52
      new THREE.Vector3(7, 0, -60), // yes
      new THREE.Vector3(10, 0, -62),
    ],
    []
  );

  const backgroundColors = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  });

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

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

  const clouds = useMemo(
    () => [
      // STARTING
      {
        position: new Vector3(-3.5, -3.2, -7),
      },
      {
        position: new Vector3(3.5, -4, -10),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(-18, 0.2, -68),
        rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(10, -1.2, -52),
      },
      // FIRST POINT
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x - 13,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
      },
      {
        rotation: new Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      // THIRD POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      // FINAL
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new Euler(Math.PI / 4, Math.PI / 6, 0),
      },
    ],
    []
  );

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.015);
    shape.lineTo(0, 0.018);

    return shape;
  }, [curve]);

  function kelvinToFahrenheit(kelvin) {
    const f = (kelvin - 273.15) * (9 / 5) + 32;
    return f.toFixed(1);
  }

  useEffect(() => {
    if (cameraGroup.current) {
      cameraGroup.current.position.set(0, 0, 0); 
      cameraGroup.current.rotation.set(0, 0, 1.75);
    }
  }, []);

  const cameraGroup = useRef();
  function UpdateFrame() {
    if (planetData.length != 0 && textSections.length === 0) {
      const sections = [
        {
          position: new Vector3(
            curvePoints[0].x - 3,
            curvePoints[0].y,
            curvePoints[0].z-1
          ),
          rotation: new THREE.Euler( 0,0,0, 'XYZ' ),
          title: "Welcome!",
          subtitle: `I was very into space as a kid... Scroll to start flying!`,
        },
        {
          position: new Vector3(
            curvePoints[1].x,
            curvePoints[1].y,
            curvePoints[1].z-5
          ),
          rotation: new THREE.Euler( 0,-0.02,0, 'XYZ' ),
          title: "Texts pop ups!",
          subtitle: `They are in a custom shader that fades in and out as you scroll`,
        },
        {
          position: new Vector3(
            curvePoints[2].x +3,
            curvePoints[2].y,
            curvePoints[2].z-1
          ),
          rotation: new THREE.Euler( -0.005, -1.047,0, 'XYZ' ),
          title: `${planetData[0].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[0].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[0].avgTemp)} in Fahrenheit`,
        },
        {
          position: new Vector3(
            curvePoints[3].x,
            curvePoints[3].y+1,
            curvePoints[3].z-2
          ),
          rotation: new THREE.Euler( -0.0039, -1.047,0, 'XYZ' ),
          title: `${planetData[1].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[1].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[1].avgTemp)} in Fahrenheit`,
        },
        { // earth
          position: new Vector3(30,1,-19),
          rotation: new THREE.Euler( -0.013,0.787,0, 'XYZ' ),
          title: `${planetData[2].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[2].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[2].avgTemp)} in Fahrenheit`,
        },
        { // mars
          position: new Vector3(
            curvePoints[5].x-3,
            curvePoints[5].y,
            curvePoints[5].z+2
          ),
          rotation: new THREE.Euler( -0.01,1.05,0, 'XYZ' ),
          title: `${planetData[4].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[4].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[4].avgTemp)} in Fahrenheit`,
        },
        {
          position: new Vector3(
            curvePoints[6].x,
            curvePoints[6].y-1,
            curvePoints[6].z+2
          ),
          rotation: new THREE.Euler( 0.0018,1.05,0, 'XYZ' ),
          title: `${planetData[5].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[5].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[5].avgTemp)} in Fahrenheit`,
        },
        {
          position: new Vector3(
            curvePoints[7].x-1,
            curvePoints[7].y,
            curvePoints[7].z+1
          ),
          rotation: new THREE.Euler( 0.1,0.50,0, 'XYZ' ),
          title: `${planetData[6].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[6].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[6].avgTemp)} in Fahrenheit`,
        },
        {
          position: new Vector3(
            curvePoints[8].x-3,
            curvePoints[8].y,
            curvePoints[8].z
          ),
          rotation: new THREE.Euler( 0.002,-0.109,0, 'XYZ' ),
          title: `${planetData[7].englishName}`,
          subtitle: `The planet has an average temperature of ${planetData[7].avgTemp} Kelvin, which is ${kelvinToFahrenheit(planetData[7].avgTemp)} in Fahrenheit`,
        }
      ];
      setTextSections(sections);
    }


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

      if (firstFrame.current) {
        // Directly set position and rotation on the first frame
        cameraGroup.current.position.copy(curPoint);
        cameraGroup.current.quaternion.copy(targetCameraQuaternion);
        firstFrame.current = false; // Reset after the first frame
      } else {
        // Interpolate camera position and rotation for subsequent frames
        cameraGroup.current.position.lerp(curPoint, delta * 24);
        cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta);
      }

      if (sceneOpacity.current < 0.8) {
        sceneOpacity.current = THREE.MathUtils.lerp(
          sceneOpacity.current,
          1,
          delta * 0.1
        );
      }
    
      if (sceneOpacity.current > 0.2) {
        sceneOpacity.current = THREE.MathUtils.lerp(
          sceneOpacity.current,
          0,
          delta
        );
      }
    
    });

  }


  return (
    <Canvas>

      <Suspense fallback={<CanvasLoader />}>
        <ScrollControls pages={30} damping={1}>

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

          {textSections.length === 0 ? (
            <TextSection
            position={new Vector3(curvePoints[0].x - 3, curvePoints[0].y, curvePoints[0].z - 1)}
            rotation={new THREE.Euler(0, -0.2768, 0, 'XYZ')}
            title="Welcome to the ride"
            subtitle="Loading the text..."
          />
            ) : (
              textSections.map((textSection, index) => (
                <TextSection {...textSection} key={index} />
              ))
            )
          }

          <group ref={cameraGroup}>
          <Background backgroundColors={backgroundColors} />
            <UpdateFrame />
            <PerspectiveCamera position={config.position} fov={config.pov} rotation={[0,0,0]} makeDefault />
          </group>
          {/* <Planets /> */}
          {clouds.map((cloud, index) => (
          <Cloud sceneOpacity={sceneOpacity} {...cloud} key={index} />
        ))}
        </ScrollControls>
      </Suspense>
      <Preload all />
    </Canvas>
  );
 }

export default UniverseCanvas
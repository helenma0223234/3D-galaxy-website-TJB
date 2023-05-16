import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Preload , useScroll, ScrollControls} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";

import { TextSection } from "./TextSection";
import CanvasLoader from "../Loader";
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

  console.log(config);

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(20, 0, 10),
      new THREE.Vector3(21, 0, 0),
      new THREE.Vector3(28, 0, -8),
      new THREE.Vector3(28, 5, -33),
      new THREE.Vector3(18, 6, -40),
      new THREE.Vector3(5, 0, -50),
      new THREE.Vector3(7, 0, -60),
      new THREE.Vector3(7, 0, -64),
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvePoints,
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);

    return shape;
  }, [curve]);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[0].x - 3,
          curvePoints[0].y,
          curvePoints[0].z
        ),
        title: "Welcome",
        subtitle: `Have a seat and enjoy the ride!`,
      }
    ]
  });

  const cameraGroup = useRef();

  // function SetPerspectiveCamera() {
  //   // const camera = useThree(state => state.camera)
  //   useEffect(() => {
  //     function handleWindowResize() {
  //       if (window.innerWidth > window.innerHeight) {
  //         // LANDSCAPE
  //         useThree(({camera}) => {
  //           camera.position.set(0, 0, 5);
  //           camera.fov.set(60);
  //         });
  //         // camera.current.fov = 60;
  //         // camera.current.position.z = 5;
  //       } else {
  //         // PORTRAIT
  //         // camera.current.fov = 80;
  //         // camera.current.position.z = 2;
  //         useThree(({camera}) => {
  //           camera.position.set(0, 0, 5);
  //           camera.fov.set(60);
  //         });
  //       }
  //       // camera.current.updateProjectionMatrix();
  //     }
  //     handleWindowResize();

  //     window.addEventListener('resize', handleWindowResize);
  //     return () => {
  //       window.removeEventListener('resize', handleWindowResize);
  //     };
  //   }, []);
  
  //   //   window.addEventListener('resize', handleWindowResize);
  //   //   return () => {
  //   //     window.removeEventListener('resize', handleWindowResize);
  //   //   };
  //   // }, [camera]);
  // }

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
            {/* <SetPerspectiveCamera /> */}
            {/* <PerspectiveCamera {...config} /> */}
          </group>
          <Planets />
        </ScrollControls>
      </Suspense>
      <Preload all />
    </Canvas>
  );
 }

export default UniverseCanvas
import { Text } from "@react-three/drei";
// import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";

export const TextSection = ({ title, subtitle, ...props }) => {
  return (
    <group {...props}>
      {!!title && (
        <Text
          color="white"
          anchorX={"left"}
          anchorY="bottom"
          fontSize={0.52}
          maxWidth={2.5}
          lineHeight={1}
          outlineWidth = {0.03}
          characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        >
          {title}
          <meshStandardMaterial
            color={"white"}
            // onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY="top"
        fontSize={0.2}
        maxWidth={2.5}
        outlineWidth = {0.02}
        // font={"./fonts/Inter-Regular.ttf"}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
      >
        {subtitle}
        <meshStandardMaterial
          color={"white"}
        //   onBeforeCompile={fadeOnBeforeCompileFlat}
        />
      </Text>
    </group>
  );
};
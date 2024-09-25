import { Text } from "@react-three/drei";
import { createDerivedMaterial } from 'troika-three-utils';
import { MeshStandardMaterial } from 'three';

export const TextSection = ({ title, subtitle, ...props }) => {
  const baseMaterial = new MeshStandardMaterial({ color: 0xffcc00 });

  const customMaterial = createDerivedMaterial(
    baseMaterial, {
      fragmentDefs: `
      float exponentialEasing(float x, float a) {
        float epsilon = 0.00001;
        float min_param_a = 0.0 + epsilon;
        float max_param_a = 1.0 - epsilon;
        a = max(min_param_a, min(max_param_a, a));

        if (a < 0.5) {
          // emphasis
          a = 2.0 * (a);
          float y = pow(x, a);
          return y;
        } else {
          // de-emphasis
          a = 2.0 * (a - 0.5);
          float y = pow(x, 1.0 / (1.0 - a));
          return y;
        }
      }
      `,
      fragmentMainOutro: `
        float fadeInDist = 60.0;  // Start fading in at this distance
        float fadeOutDist = 6.0;  // Start fading out at this distance

        float dist = length(vViewPosition);

        // Calculate fade opacity based on distance ranges
        float fadeOpacity = smoothstep(fadeInDist, fadeOutDist, dist); // Fade in between fadeInDist and fadeOutDist
        fadeOpacity *= 1.0 - smoothstep(fadeOutDist, 0.0, dist);  // Fade out when too close

        fadeOpacity = exponentialEasing(fadeOpacity, 0.99);
        vec4 diffuseColor = vec4(diffuse, fadeOpacity * opacity);
        gl_FragColor = diffuseColor;
      `,
    }
  );

  const customMaterial_sub = createDerivedMaterial(
    baseMaterial, {
      fragmentDefs: `
      float exponentialEasing(float x, float a) {
        float epsilon = 0.00001;
        float min_param_a = 0.0 + epsilon;
        float max_param_a = 1.0 - epsilon;
        a = max(min_param_a, min(max_param_a, a));

        if (a < 0.5) {
          // emphasis
          a = 2.0 * (a);
          float y = pow(x, a);
          return y;
        } else {
          // de-emphasis
          a = 2.0 * (a - 0.5);
          float y = pow(x, 1.0 / (1.0 - a));
          return y;
        }
      }
      `,
      fragmentMainOutro: `
        float fadeInDist = 60.0;  // Start fading in at this distance
        float fadeOutDist = 6.0;  // Start fading out at this distance

        float dist = length(vViewPosition);

        // Calculate fade opacity based on distance ranges
        float fadeOpacity = smoothstep(fadeInDist, fadeOutDist, dist); // Fade in between fadeInDist and fadeOutDist
        fadeOpacity *= 1.0 - smoothstep(fadeOutDist, 0.0, dist);  // Fade out when too close

        fadeOpacity = exponentialEasing(fadeOpacity, 0.99);
        vec4 diffuseColor = vec4(diffuse, fadeOpacity * opacity);
        gl_FragColor = diffuseColor;
      `,
    }
  );

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
          outlineWidth={0.03}
          characters="abcdefghijklmnopqrstuvwxyz0123456789!"
          material={customMaterial}
        >
          {title}
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY="top"
        fontSize={0.2}
        maxWidth={2.5}
        outlineWidth={0.02}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        material={customMaterial_sub}
      >
        {subtitle}
      </Text>
    </group>
  );
};

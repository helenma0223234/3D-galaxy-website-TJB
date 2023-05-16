import { motion } from "framer-motion";

import { styles } from "../styles";
import { UniverseCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <UniverseCanvas />
    </section>
  )
}

export default Hero
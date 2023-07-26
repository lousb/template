import React, { useState } from "react";
import styles from './header.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { height, margintop } from "./anim";
import Nav from "./nav";
import Hamburger from "../../../atoms/buttons/hamburger/hamburger.js";

function Header() {
  // State variables to manage header and navigation visibility
  const [isActive, setIsActive] = useState(false); // Header active (toggled) state
  const [isNavVisible, setIsNavVisible] = useState(false); // Navigation visibility state

  // Function to handle header toggling
  const handleHeaderToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive); // Toggle isActive state
    setIsNavVisible(true); // Set navigation visibility to true
  };

  // Function called when navigation exit animation completes
  const handleNavExitComplete = () => {
    setIsNavVisible(false); // Set navigation visibility to false after exit animation
  };

  return (
    // Framer Motion header element
    <motion.header
      key="header"
      variants={height} // Use the height animation variants
      initial='initial' // Set initial animation state
      animate={isActive ? 'open' : 'closed'} // Toggle between open and closed states
      exit='closed' // Animation state when header is being removed from the DOM
      className={`${styles["minimal-header"]} ${
        isActive ? styles["header-toggled"] : ''
      }`} // Set class names based on isActive state
      onExitComplete={handleNavExitComplete} // Callback when navigation exit animation completes
    >
      {/* Inner content of the header */}
      <motion.div
        variants={margintop} // Use the margintop animation variants
        initial="initial" // Set initial animation state
        animate={!isActive ? 'closed' : 'open'} // Toggle between open and closed states
        className={styles["header-inner-content"]} // Set class name for inner content
      >
        {/* Header logo */}
        <div className={styles["header-logo"]}>
          <img src="/LOGO-DESKTOP.svg" alt="Logo"></img>
        </div>

        {/* Hamburger menu icon */}
        <div
          className={styles["header-hamburger"]}
          onClick={handleHeaderToggle} // Call handleHeaderToggle when clicked
        >
          <Hamburger isActive={isActive} /> {/* Pass isActive prop to Hamburger component */}
        </div>
      </motion.div>

      {/* Render the Nav component */}
      <Nav isActive={isActive} /> {/* Pass isActive prop to Nav component */}
    </motion.header>
  );
}

export default Header;

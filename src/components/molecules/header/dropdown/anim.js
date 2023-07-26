import React from "react";
const transition = {duration: 1, ease:[0.76, 0, 0.24, 1]}

// Define opacity animation variants with initial, open, and closed states
export const opacity = {
    initial:{
        opacity: 0
    },
    open:{
        opacity:1,
        transition:{duration:0.65, delay: 0.55}
    },
    closed:{
        opacity:0,
        transition:{duration:0.65},
        
    }
}

// Define height animation variants with initial, open, and closed states
export const height ={
    initial:{
        height:120
    },
    open:{
        height:'100vh',
        transition,
    },
    closed:{
        height:120,
        transition: {...transition, delay:0.2}
    }
}

// Define translate animation variants with initial, open, and closed states

export const translate ={
    initial:{
        y:'150%'
    },
    open:(i)=>({
        y:'0%',
        opacity:1,
        transition: {...transition, delay:i[0]}
    }),
    closed:(i)=>({
        y:'150%',
        opacity:0,
        transition: {...transition, delay:i[1]}

    })
}

// Define margintop animation variants with initial, open, and closed states
export const margintop = {
    initial: {
      y: '0px'
    },
    open: (i) => ({
        y: i === 0 ? '18px' : '10px',
      opacity: 1,
      transition: { ...transition }
    }),
    closed: (i) => ({
      y: '0px',
      opacity: i === 1 ? 1 : i,
      transition: { ...transition, delay:[0.2] },
      
    })
  };


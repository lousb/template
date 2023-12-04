import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useFooter } from '../../../context/FooterContext';
import styles from './films.module.css';
import { db } from '../../../firebase/firebase';
import { collection, query, getDocs, limit, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MouseCursor from "../../../utils/mouseCursor";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { AnimatePresence , motion} from "framer-motion";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

gsap.registerPlugin(ScrollTrigger);

function Films() {
    const { dispatch } = useFooter();
    const [data, setData] = useState([]);
    const filmProjectItemsRef = useRef([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeView, setActiveView] = useState('slow'); // State to manage active view

    // Function to toggle between views
    const handleViewChange = (view) => {
        setActiveView(view);
    };

    useEffect(() => {
        // Update the footer state when the component is mounted
        dispatch({ type: "Small" });

        // Clean up the state when the component is unmounted
        return () => {
            dispatch({ type: "Default" });
        };
    }, [dispatch]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "projects"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        }, (error) => {
            console.log(error);
        });

        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, scrollPosition);
    }, [activeView]);

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };


    const slowViewAnimations = (handleScroll, handleScrollDebounced) => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScrollDebounced);

        const filmProjectItems = document.querySelectorAll('.film-project-item');

        if (data.length > 0) {
            const itemHeight = window.innerHeight * 0.8 - 90;
            const totalHeight = (data.length - 1) * itemHeight; // Total distance to cover
            const maxTranslateY = (data.length - 1) * 100 - 20.8; // Maximum translateY needed

            

            ScrollTrigger.create({
                trigger: '.film-page-wrap',
                start: 'top top',
                pin: '.page-content',
                end: () => `+=${totalHeight}`,
                onUpdate: (self) => {
                    const progress = self.progress * maxTranslateY;

                    filmProjectItems.forEach((item) => {
                        gsap.to(item, { y: `-${progress}%`, ease: 'none' });
                    });
                },

                
            });

            gsap.to('large-arrow-cursor',{
                y:'+=300',
                scrollTrigger: {
                    start:`${totalHeight} top`,
                    end: () => totalHeight + 200,
                    scrub: true,
                    id: "scrub",
          
                }
            })
        }

       
        
        gsap.fromTo('.film-project-scroll-container',{
            height: 'calc(70svh - 90px)',
        },{
    
          height: 'calc(100svh - 4vw - 90px)',
          scrollTrigger: {
            trigger:'.film-page-wrap', 
            start: 'top top',
            end: '600',
            scrub: true,
            id: "scrub",
          },
        });

        gsap.fromTo('.film-project-item',{
          height: 'calc(70svh - 90px)'
        },{
    
            height: 'calc(80svh - 90px)',
          scrollTrigger: {
            trigger:'.film-page-wrap', 
            start: 'top top',
            end: '200',
            scrub: true,
            id: "scrub",
          },
        });

        gsap.fromTo('.film-page-title-wrap',{
            y: '90px'
          },{
      
              y: '0px',
             
            scrollTrigger: {
              trigger:'.film-page-wrap', 
              start: 'top top',
              end: '500',
              scrub: true,
              id: "scrub",
            },
          });

    };

    const mediumViewAnimations = () => {
        // Animations for medium view
        // ...
    };

    const fastViewAnimations = () => {
   

        const filmProjectItems = document.querySelectorAll('.film-project-item');

        if (data.length > 0) {
            const itemHeight = window.innerHeight * 0.8 - 90;
            const totalHeight = (data.length - 1) * itemHeight; // Total distance to cover
            const maxTranslateY = (data.length - 1) * 100 - 20.8; // Maximum translateY needed

            

            ScrollTrigger.create({
                trigger: '.infinite-project-scroll-wrap',
                start: 'top top',
                pin: '.infinite-project-scroll-map-wrap',
                end: `max`,

            
            });
        }
 
    

        gsap.fromTo('.infinite-scroll-map-wrap',{
            marginTop: '10vw'
        },{
            marginTop: '0px',
            scrollTrigger: {
                trigger:'.film-page-wrap', 
                start: 'top top',
                end: '1000',
                scrub: true,
                id: "scrub",
            },
        });

    };


    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        };

        const handleScrollDebounced = debounce(() => {
            setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        }, 100); // Adjust the delay as needed

        switch (activeView) {
            case 'slow':
                slowViewAnimations();
                break;
            case 'medium':
                mediumViewAnimations();
                break;
            case 'fast':
                fastViewAnimations();
                break;
            default:
                // Handle default view animations
                break;
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollDebounced);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [data, activeView]);

    return (
        <div className={`${styles['film-page-wrap']} film-page-wrap ${activeView === 'fast' && 'fast-active'}`}>
            <MouseCursor/>
             <div className={`${styles['view-switcher-wrap']} view-switcher-wrap`}>
                <div className={`${styles['view-bracket-wrap']} view-bracket-wrap`}>
                    <div className={`${styles['view-bracket']} body`}>
                        (
                    </div>
                    <div className={`${styles['view-bracket']} body`}>
                        )
                    </div>
                </div>

                <button className={`body ${styles['slow-toggle']} ${activeView === 'slow' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('slow')}>Row</button>
                <button className={`body ${styles['fast-toggle']} ${activeView === 'fast' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('fast')}>List</button>
                <button className={`body ${styles['medium-toggle']} ${activeView === 'medium' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('medium')}>Grid</button>
            </div>
    
            <div className={`${styles['film-page-title-wrap']} film-page-title-wrap high-z-index-layer`}>
                <h2 className={`title`}>
                    ARCHIVE:
                </h2>
                <div className={`${styles['film-page-intro-desc-wrap']} film-page-intro-desc-wrap`}>
                    <Reveal elementClass={`body ${styles['film-page-intro-desc']}`} element={'p'} textContent={'USE THIS SPACE TO TALK GENRALLY ABOUT YOUR PROJECTS, INTENTIONS OR INSPIRATIONS - MAKE IT CLEAR WHAT THEY MEAN TO YOU!'}/>
                   
                </div>

       
            </div>
            <div className={`${styles['project-nav-wrap']}`}>
            <AnimatePresence>
                {activeView === 'slow' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="slow"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'50%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                    >
                        <SlowView data={data} filmProjectItemsRef={filmProjectItemsRef} />
                    </motion.div>
                )}
               
                {activeView === 'fast' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="fast"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'20%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                        
                    >
                        <FastView data={data} filmProjectItemsRef={filmProjectItemsRef}/>
                    </motion.div>
                )}
                 {activeView === 'medium' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="medium"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'20%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                    >
                        <MediumView data={data} filmProjectItemsRef={filmProjectItemsRef}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
}

const SlowView = ({ data, filmProjectItemsRef }) => {

    return (
        <div className={`slow-view ${styles['film-project-scroll-wrap']}`}>
        <div className={`body film-project-scroll-container ${styles['film-project-scroll-container']}`}>
            {data.map((project, index) => (
                <Link to={`/projects/${project.id}`} className="view-list-item-link" key={project.id}>
                    <div
                        ref={(el) => (filmProjectItemsRef.current[index] = el)}
                        className={`${styles['film-project-item']} film-project-item`}
                    >
                        
                        <h2 className={`header-reduced ${styles['film-project-title']} ${styles['film-project-desc-item']}`}>
                        <Reveal custom={-0} textContent={project.displayName} element={"span"} elementClass={`heading`}/>
                        </h2>
                        <h3 className={`body ${styles['film-project-director']} ${styles['film-project-desc-item']}`} >
                            <Reveal custom={1} textContent={"Directed by Max Dona"} element={'p'} elementClass={"body"}/>
                        </h3>
                        <div className={`body ${styles['film-project-video-name']} ${styles['film-project-desc-item']}`} >
                            <Reveal custom={2} textContent={`${project.videoName} (${new Date(project.releaseDate).getFullYear()})`} element={'p'} elementClass={"body"}/>
                        </div>
                        <div className={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} >
                            <Reveal custom={3} textContent={`FULL PROJECT HERE`} element={'p'} elementClass={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`}/>

                        </div>
                        
                    </div>
                </Link>
            ))}
        </div>
        </div>
    );
};

const MediumView = () => {
    const [randomImages, setRandomImages] = useState([]);

    useEffect(() => {
        const fetchRandomImages = async () => {
            const imagesCollectionRef = collection(db, "projects");
            const querySnapshot = await getDocs(imagesCollectionRef);

            const allImageUrls = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Extract all image URLs from different folders (image1, image2, etc.)
                for (let i = 1; i <= 3; i++) { // Adjust the loop range based on your max folders
                    const imageUrls = data.imageUrls[`image${i}`];
                    if (imageUrls && Array.isArray(imageUrls)) {
                        allImageUrls.push(...imageUrls);
                    }
                }
            });

            // Shuffle allImageUrls array to randomize the images
            const shuffledImages = shuffleArray(allImageUrls);
            // Get the first 20 (or desired number) images for display
            const randomImageUrls = shuffledImages.slice(0, 20);

            setRandomImages(randomImageUrls);
        };

        fetchRandomImages();
    }, []);

    // Helper function to shuffle an array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Use randomImages state to render the images in your component
    return (
        <div>
            <h2>Random Images</h2>
            {/* Your rendering logic for displaying the images */}
            {/* For example: */}
            {randomImages.map((imageUrl, index) => (
                 <Link key={index} to={`/${index}`}>
                <img key={index} src={imageUrl} alt={`Random Image ${index + 1}`} />
                </Link>
            ))}
        </div>
    );
};



const FastView = ({ data, filmProjectItemsRef }) => {
    // Infinite scroll logic
    const infiniteScrollData = [...data];


    // Assuming there's enough data to create a continuous loop
    if (infiniteScrollData.length < 5) {
      infiniteScrollData.push(...data.slice(0, 5 - infiniteScrollData.length));
    }
  
    return (

        <div className={`${styles['infinite-scroll-map-wrap']} infinite-scroll-map-wrap`}>
          {infiniteScrollData.map((project, index) => (
            <Link to={`/projects/${project.id}`} className="view-list-item-link" key={project.id}>
            <div key={index} className={`${styles['infinite-film-project-item']} film-project-item infinite-film-project-item`}>
              <h2 className={`title ${styles['infinite-film-title']}`} >
                {project.displayName}
              </h2>
            </div>
            </Link>
          ))}
          </div>

    );
  };
  

export default Films;

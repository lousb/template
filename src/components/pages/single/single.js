import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styles from './single.module.css';
import { useParams ,useNavigate} from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { getImageUrlByIndex, getTotalImageCount } from './helpers';
import SingleImageView from '../image/image';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import MouseCursor from '../../../utils/mouseCursor';
import Reveal from '../../../utils/textElementReveal/textElementReveal';
import YouTube from 'react-youtube';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './single.css'


gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  
  const initialObjectPosition = "center center";

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const { clientX, clientY, target } = e;

    const { left, top, width, height } = target.getBoundingClientRect();

    const maskCenterX = left + width / 2;
    const maskCenterY = top + height / 2;

    const distanceX = clientX - maskCenterX;
    const distanceY = clientY - maskCenterY;

    const sensitivity = 0.01;

    const x = distanceX * sensitivity;
    const y = distanceY * sensitivity;

    setMaskPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (imageRef.current) {
      imageRef.current.style.transition =
        "ease all 200ms";
      setIsHovered(true);
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition =
            "cubic-bezier(0.76, 0, 0.24, 1) all 0ms, object-position 0s ease";
        }
      }, 600);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (imageRef.current) {
      imageRef.current.style.transition =
        "ease all 200ms";
        imageRef.current.style.transform = "translate(0px, 0px) scale(1.1)";
    }
  };

  return (
    <div
      className={styles['parallax-image-wrap']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Parallax Image"
        className={styles['masonry-image']}
        style={{
          transform: `translate(${maskPosition.x}px, ${maskPosition.y}px) scale(1.1)`,
        }}
      />
    </div>
  );
};



const Single = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [viewToggle, setViewToggle] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollPositionRef = useRef(0);
  const sectionRef = useRef(null);
  const masonrySection = useRef(null);



  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []); 



  useLayoutEffect(() => {
    let pinScrollTrigger, pinScrollControlsTrigger;
  
    const pinVideoSection = () => {
      pinScrollTrigger = ScrollTrigger.create({
        trigger: '.project-page-section-1',
    
        start: 'top top',
        end: () => sectionRef.current.clientHeight * 1.5,
        pin: `.${styles['main-section-image-wrap']}`,
      });
    };

    const pinVideoControls = () => {
      pinScrollControlsTrigger = ScrollTrigger.create({
        trigger: '',
    
        start: 'top top',
        end: () => sectionRef.current.clientHeight * 1.5,
        pin: `.${styles['main-video-controls-overlay']}`,
      });
    };
  
    const setupAnimations = () => {
      gsap.to(`.${styles['main-section-details']}`, {
        y: '-100',
        scrollTrigger: {
          start: 'top top',
          end: sectionRef.current.clientHeight,
          scrub: 2,
          id: 'scrub',
          trigger: sectionRef.current,
        },
      });
  
      gsap.to(`.${styles['main-section-details text-reveal-element']}`, {
        y: '200%',
        scrollTrigger: {
          start: 'top top',
          end: sectionRef.current.clientHeight,
          scrub: 2,
          id: 'scrub',
          trigger: sectionRef.current,
        },
      });
  
      gsap.to(`.${styles['main-section-image']}`, {
        width: '100%',
        scrollTrigger: {
          start: '100px',
          end: () => sectionRef.current.clientHeight / 0.75,
          scrub: 1.5,
          id: 'scrub',
          trigger: sectionRef.current,
        },
      });

      gsap.to(`.${styles['project-page-section-1']}`, {
        marginBottom: 'calc(150vh - 2.4vw)',
        scrollTrigger: {
          start: '100vh',
          end: '150vh',
          scrub: 2,
          id: 'scrub',
          trigger: sectionRef.current,
        },
      });

 

      // gsap.to(`.masonry-column`, {
      //   marginTop: '1000px',
      //   scrollTrigger: {
      //     trigger: masonrySection.current,
      //     start: '100px',
      //     end: 'bottom bottom',

      //     markers:true
      //   },
      // });
  
    };

    
  
    // Setup animations and pin section when viewToggle is false
    if (!viewToggle) {
      setupAnimations();
      pinVideoSection();
      pinVideoControls();
    }
  
    return () => {
      if (pinScrollTrigger) {
        pinScrollTrigger.kill(); // Kill the ScrollTrigger instance on unmount
      }
      if(pinScrollControlsTrigger){
        pinScrollControlsTrigger.kill();
      }
    };
  }, [sectionRef, viewToggle]);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.main-description-right-wrap');
      if (element) {
        if (window.scrollY > 190) {
          element.style.filter = 'invert(1)';
        } else {
          element.style.filter = 'invert(0)';
        }
      }
    };

    console.log(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectDoc = doc(db, 'projects', projectId);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
          console.log(data);
        } else {
          console.error('Project not found.');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

 

    fetchProjectData();
  }, [projectId]);



  const navigate = useNavigate();

  const handleImageClick = (groupIndex, imageIndex) => {
    let clickedIndex = 0;
    for (let i = 0; i < groupIndex; i++) {
      if (projectData?.imageUrls[`image${i + 1}`]) {
        clickedIndex += projectData.imageUrls[`image${i + 1}`].length;
      }
    }
    clickedIndex += imageIndex;
  
    // Log the click
    console.log(`Image clicked - Group Index: ${groupIndex}, Image Index: ${imageIndex}, Total Index: ${clickedIndex}`);
  
    // Store the current scroll position
    scrollPositionRef.current = window.scrollY;
  
    setSelectedImageIndex(clickedIndex);
    console.log('Before setViewToggle');
    setViewToggle(true);

  
  };
  
  
  
  
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlayingProp, setIsPlayingProp] = useState(false);




  return (
    <div className={styles['project-page']}>
      
      <MouseCursor />
      <div className={`main-video-controls-overlay ${styles['main-video-controls-overlay']}`}>
        {projectData ? 
          <div className={`body main-description-right-wrap ${styles['main-description-right-wrap']}`} onClick={()=>scrollToPercentageOfViewportHeight(140)}>
            <span>{projectData.videoName} (2022)</span>
            <span className='primary-button'>
            Full Video
            </span>
          </div>
        :
          <></>
        }  
        <div className={`body scroll-notification scroll-notification-single ${styles['scroll-notification']}`} onClick={()=>scrollToPercentageOfViewportHeight(140)}>
          <p>
            (<div><span>SCROLL</span></div>)
          </p>
          <p className={`body single-click-anywhere`}>
            Click Anywhere To 
            <p className={`play-text ${ isPlayingProp ? 'play-text-toggle':''}`}>
              <p>play</p>
              <p>pause</p>
            </p> 
          </p>
         
        </div>
        <div className={`${styles['progress-bar']} ${ isPlayingProp ? '':'stop-progress-toggle'}`}>
            <div className={`${styles['progress']}  `} style={{ width: `${videoProgress}%` }}></div>
        </div>
      </div>
      <div>
        {viewToggle ? (
          <SingleImageView
            projectData={projectData}
            selectedImageIndex={selectedImageIndex}
            getTotalImageCount={getTotalImageCount}
            getImageUrlByIndex={getImageUrlByIndex}
            setSelectedImageIndex={setSelectedImageIndex}
          />
        ) : (
          <>
            <section className={`${styles['project-page-section-1']} project-page-section-1`} ref={sectionRef}>
              <div className={`${styles['main-section-details']} main-section-details`}>
                {projectData ? (
                  <div className={`${styles['main-description']} main-description`}>
                    <span>
                      <Reveal textContent={projectData.displayName} element={"h1"} elementClass={`heading`}/>
                    </span>
                    <span>
                      <Reveal custom={2} textContent={'Directed by Max Dona'} element={"h2"} elementClass={`body ${styles['directed-subtext']}`}/>
                    </span>
                    <div className={`${styles['main-description-wrap']}`}>
                    <div className={`${styles['main-description-wrap-left']}`}>
                      <span>
                        <Reveal custom={3} textContent={projectData.mainDescription1} element={"div"} elementClass={`body ${styles['main-description-1']}`}/>
                      </span>
                      <span>
                        <Reveal custom={3} textContent={projectData.mainDescription2} element={"div"} elementClass={`body ${styles['main-description-2']}`}/>
                      </span>
                    </div>
                    </div>
                  </div>
                  
                ) : (
                  <p>Loading project data...</p>
                )}
              </div>
              
            </section>
            <div className={`${styles['main-section-image-wrap']} main-section-image-wrap`}>
                <div className={`${styles['main-section-image']} main-section-image`}>
                <div className={`${styles['main-section-image-overlay']} main-section-image-overlay`}>

                </div>
                  <div className={styles['video-container']}>
                    <div className={`player__wrapper ${styles['player__wrapper']}`}>
                      <CustomYouTubePlayer setVideoProgress={setVideoProgress} setIsPlayingProp={setIsPlayingProp}/>

                    </div>
                  </div> 
                </div>
                
              </div>

            
            <section>
            {projectData && (
              Object.entries(projectData.imageUrls).map(([groupKey, groupImages], groupIndex) => (
                <div ref={masonrySection}>
                  <ImageSection
                    key={groupKey}
                    groupKey={groupKey}
                    groupImages={groupImages}
                    groupIndex={groupIndex}
                    handleImageClick={handleImageClick}
                    projectData={projectData}
                  />
                
                </div>
              ))
      
            )}

       
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Single;


const ImageSection=({ groupKey, groupImages, groupIndex, handleImageClick, projectData })=>{
  const column = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const masonrySection = document.querySelector(`.${styles['masonry-section']}.${groupKey} > div > div`);
  
      if (masonrySection) {
        const childCount = masonrySection.childElementCount;
  
        for (let i = 0; i < childCount; i++) {
          const child = masonrySection.children[i];
          child.classList.add(`column-${i + 1}`);
          child.classList.add(`masonry-column`);
        }
      } else {
        console.log('No masonry section found.');
      }
    }, 1000); // Adjust the delay as needed
  }, []);
  
  
  

  <div className={`${styles['masonry-section']} ${groupKey}`} key={groupKey}  >
  <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 900: 4 }}>
    <Masonry columnsCount={4} gutter="1.4vw">
    {groupImages.map((imageUrl, imageIndex) => {


        return (
          <div className='column' key={imageIndex} onClick={() => handleImageClick(groupIndex, imageIndex)}>
            <ParallaxImage key={imageIndex} imageUrl={imageUrl} />
            
          </div>
        );
      })}
    </Masonry>
  </ResponsiveMasonry>
 
{projectData.details && <DetailsSection key={`detail-${groupIndex}`} value={projectData?.details?.[`detail${groupIndex + 1}`]} />}

</div>
  return(
    <div className={`masonry-section ${styles['masonry-section']} ${groupKey}`} key={groupKey}  >
    <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 900: 4 }}>
      <Masonry columnsCount={4} gutter="1.4vw">
      {groupImages.map((imageUrl, imageIndex) => (
            <div
              ref={column}
              className="column"
              key={imageIndex}
              onClick={() => handleImageClick(groupIndex, imageIndex)} // Corrected onClick event
            >
              <ParallaxImage key={imageIndex} imageUrl={imageUrl} />
            </div>
          ))}
      </Masonry>
    </ResponsiveMasonry>
   
    {projectData.details && <DetailsSection key={`detail-${groupIndex}`} value={projectData?.details?.[`detail${groupIndex + 1}`]} />}
  
  </div>
  );

};


const DetailsSection = ({ sectionKey, value }) => {
  if (!value) {
    return null; // or return a placeholder like <p>No details available</p>
  }

  const { firstDescription, secondDescription, title } = value;

  return (
    <div key={sectionKey} className={styles['details-section']}>
      <div className={`${styles['details-section-wrap']}`} >
        <h2 key="title" className={`heading ${styles['details-title']}`}>{title}</h2>
        <div className={`${styles['details-description-wrap']}`}>
          <p className={`${styles['details-description']} body`} key="firstDescription"><span>{firstDescription}</span></p>
          <p className={`${styles['details-description']} body`} key="secondDescription"><span>{secondDescription}</span></p>
        </div>
      </div>
      <div className={styles['details-section-image']}>
                
      </div>
    </div>
  );
};


const CustomYouTubePlayer = ({ setVideoProgress, setIsPlayingProp }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); // New state for progress
  const playerRef = useRef(null);

  const videoId = 'xuQhwS6j18s';

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0,
      modestbranding: 1,
      fs: 0,
      rel: 0,
    }
  };

  const onReady = (event) => {
    event.target.addEventListener('onStateChange', (e) => {
      if (e.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        setIsBuffering(false);
        startProgressTracking(event.target);
      } else if (e.data === window.YT.PlayerState.BUFFERING) {
        setIsBuffering(true);
      } else {
        setIsPlaying(false);
        setIsBuffering(false);
      }
    });
  };

  const startProgressTracking = (player) => {
    const interval = 500;
    const updateProgress = () => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const newProgress = (currentTime / duration) * 100;
      setVideoProgress(newProgress); // Update the progress in the Single component
    };

    const progressTracker = setInterval(updateProgress, interval);

    return () => {
      clearInterval(progressTracker);
    };
  };




  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
      setIsPlayingProp(false);
      setIsPlaying(false);
    } else {
      playerRef.current.internalPlayer.playVideo();
      scrollToPercentageOfViewportHeight(140);
      setIsPlayingProp(true);
      setIsPlaying(true);
    }
  };

  return (
    <div className={`${styles['player']} ${isPlaying && styles['playing']} ${isBuffering && styles['buffering']}`} onClick={togglePlayPause}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        ref={playerRef}
        
      />
      <div className={styles['progress-bar']}>
        <div className={styles['progress']} style={{ width: `${progress}%` }}></div>
        <p onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</p>
      </div>
   
    </div>
  );
};


const scrollToPercentageOfViewportHeight = (percentage) => {
  const vh = window.innerHeight * (percentage / 100);
  window.scrollTo({
    top: vh,
    behavior: 'smooth'  // Add smooth scrolling behavior
  });
};
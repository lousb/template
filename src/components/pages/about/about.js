import React, {useEffect, useRef, useLayoutEffect, useState} from "react";
import styles from './about.module.css'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MouseCursor from "../../../utils/mouseCursor";



function About(){

    const imagesWrap1 = useRef(null);
    const imagesWrap2 = useRef(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);
    const processWrap = useRef(null);
    const aboutProcess = useRef(null);
    let xPercent = 0;
    let direction = -1;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: aboutProcess.current,
            start: "-80px top",
            pin: processWrap.current,
            end: 'bottom bottom',
        });
    }, processWrap);

    gsap.to('.about-process-index span', {
  
        scrollTrigger: {
            trigger: aboutProcess.current,
            scrub: 0.5,
            start: '100px top',
            end: 'bottom bottom',
        },
        y:'-200%'
        
    })

    gsap.to(`.about-process-slides`, {
  
        scrollTrigger: {
            trigger: aboutProcess.current,
            scrub: 0.5,
            start: 'bottom bottom',
            end: 'bottom 300px',

        },
        y:'-190px',
        opacity:'0',
        
    })

    gsap.to('.about-process-inner-image-wrap', {
  
        scrollTrigger: {
            trigger: aboutProcess.current,
            scrub: 0.8,
            start: '100px top',
            end: 'bottom bottom',
        },
        y:'-70%'
        
    })
    


    gsap.to(slider1.current, {
        scrollTrigger: {
            trigger: document.body,
            scrub: 1,
            start: 0,
            end: 'bottom bottom',

            onUpdate: e => direction = e.direction * -1
        },
        x: "-2000px",
        })

        // Animation for the second slide
        gsap.to(slider2.current, {
            scrollTrigger: {
                trigger: document.body,
                scrub: 1,
                start: 0,
                end: 'bottom bottom',
                onUpdate: (e) => {
                    direction = e.direction * -1;
                },
            },
            x: "-2000px",
        });

        requestAnimationFrame(animation);
        return () => ctx.revert();
    }, []);



    useEffect(() => {
        // Function to handle window resize
        function handleResize() {
          setWindowWidth(window.innerWidth);
        }
    
        // Add event listener for window resize
        window.addEventListener("resize", handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);


    const animation = () =>{
        if(xPercent <= -100){
            xPercent = 0
        }
        if(xPercent > 0){
            xPercent = -100;
        }
        gsap.set(imagesWrap1.current, {xPercent: xPercent})
        gsap.set(imagesWrap2.current, {xPercent: xPercent})
        xPercent += 0.06 * direction;
        requestAnimationFrame(animation);
    }
    
    return(
        <main className={`${styles['about-page']}`}>
            <MouseCursor/>

            <section className={`${styles['about-page-section-1']}`}>
                <div className={`${styles['section-1-content']}`}  >
                    <h2 className={`title ${styles['section-1-heading']}`}>
                        TELLING STORIES WORTH TOLD
                    </h2>
                    <div className={`${styles['section-1-image']}`}>
                    
                    </div>
                    <div>
                        <p className={`body ${styles['section-1-text']}`}>
                            MY WORK AIMS TO STANDOUT FROM THE NOISE; THIS IS DONE BY HIGHLIGHTING THE AUTHENTICITY OF MY CLIENTS. 
                        </p>
                        <p className={`body ${styles['section-1-text']}`}>
                            I STRIVE TO CURATE IDENTITY AND PERSONALITY THROUGH VISUAL EXPERIENCES. 
                        </p>
                    </div>

                </div>

            </section>

            <div className={`${styles["portfolio-slide"]} ${styles["about-page-slide"]}`} ref={slider1}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap1}>
                    {portfolioImages(1)}
                    {portfolioImages(2)}
                </div>
               
            </div>

            <div className={`${styles["portfolio-slide-subtext"]}`}>
                    <div className={`${styles["portfolio-slide-subtext-left"]}`}>
                        <p className="body">
                        DEVELOPING VISUALS TO HELP CREATIVE’S EXPRESS THEMSELVES THROUGH MEDIA.
                        </p>
                    </div>
                    <div className={`${styles["portfolio-slide-subtext-right"]}`}>
                        <p className="body">
                            ( Click project to expand )
                        </p>
                        <button className="primary-button">
                            Full Archive
                        </button>
                    </div>
                </div>

            <section className={`${styles['about-page-section-2']} ${styles['about-process']} about-process`} ref={aboutProcess}>
                 
                    <div className={`${styles['about-process-wrap']}`} ref={processWrap}>
                        <h2 className={`${styles['my-process-title']} heading`}>My Process:</h2>
                        <div className={`${styles['about-process-image-wrap']} about-process-image-wrap`}>
                            <div className={`${styles['about-process-inner-image-wrap']} about-process-inner-image-wrap`}>
                                <img src='/max-about.png' alt="max-image"></img>
                                <img src='/Max-Headshot.png' alt="max-image"></img>
                                <img src='/Franco.png' alt="max-image"></img>
                            </div>
                            <div className={`${styles['about-process-image-wrap']} about-process-image-wrap`}>
                            <p className={`${styles['about-process-count']} heading`}>
                                0
                                <p className={`${styles['about-process-index']} about-process-index`}>
                                    <span className="heading">1</span>
                                    <span className="heading">2</span>
                                    <span className="heading">3</span>
                                </p>
                            </p>
                        </div>
                    </div>
                     
           
                
                </div>
                <div className={`${styles['about-process-slides']} about-process-slides`}>
                    <div className={`${styles['about-process-slide-1']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/max-about.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Discover:</div>
                        <div className={`${styles['about-process-slide-text']} body`}>STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.<br/><br/> MY mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.</div>
                    </div>

                    <div className={`${styles['about-process-slide-2']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/Max-Headshot.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Design:</div>
                        <div className={`${styles['about-process-slide-text']} body`}>STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.<br/><br/> MY mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.</div>
                    </div>

                    <div className={`${styles['about-process-slide-3']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/Franco.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Define:</div>
                        <div className={`${styles['about-process-slide-text']} body`}>STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.<br/><br/> MY mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.</div>
                    </div>
                </div>
                        
            </section>

            <div className={`${styles["testimonial-slide-subtext"]}`}>
                <div className={`${styles["testimonial-subtext-col-1"]}`}>
                    <p className="body">
                        Recent<br/>
                        Succesful<br/>
                        Clients
                    </p>
                    <p className={`body ${styles["testimonial-click"]}`}>
                        ( Click to View )
                    </p>
                </div>
                <div className={`${styles["testimonial-subtext-col-2"]}`}>
                    <p className="heading">
                        COLLABORATIVE<br/>Outcome's
                    </p>

                </div>
                <div className={`${styles["testimonial-subtext-col-3"]}`}>
                    <button className="primary-button">
                        Lets Work
                    </button>
                </div>
            </div>

            <div className={`${styles["testimonials-slide"]} ${styles["about-page-slide"]}`} ref={slider2}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap2}>
                    {portfolioImages(1)}
                    {portfolioImages(2)}
                </div>
            </div>
            
            <section className={`${styles["about-page-section-3"]}`}>
                <p className="heading">Keen to start a <br/>project?</p>
                <div className={`${styles["about-last-cta-wrap"]}`}>
                    <p className={`body ${styles["body"]}`}>Click my email<br/>
                        To get in touch!
                    </p>
                    <p className={`heading ${styles["about-last-cta-wrap-heading"]}`}>
                        Maxdona@gmail.com
                    </p>
                </div>
            </section>
        </main>
    )
}



const portfolioImages = (i) => {

    return(
        <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' :''}slide-projects`} >
            <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Franco</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Domengo</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Cormac</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Teji</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>

            {i===2?<>
                <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Franco</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            </>:<>
                
            </>}
        </div>
    )
    
}

export default About;
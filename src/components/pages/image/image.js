import React, { useEffect } from 'react';
import styles from './image.module.css';

const Image = ({
  projectData,
  selectedImageIndex,
  getTotalImageCount,
  getImageUrlByIndex,
  setSelectedImageIndex,
  setViewToggle,
  scrollPosition,
}) => {
  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  

  return (
    <section className={`single-image-page ${styles['projectPageSection1']}`}>

      <div className={styles.mainSectionDetails}>
        <div className={styles.mainSectionTopDetails}>
          <h1 className={`title ${styles['project-title']}`}>{projectData.displayName}</h1>
          <h2 className={`body ${styles['directed-subtext']}`}>Directed by Max Dona</h2>
        </div>
      </div>
      <div className={styles.imageWrap}>
        {projectData && (
          
          <img
            src={getImageUrlByIndex(projectData, selectedImageIndex)}
            alt={`Image ${selectedImageIndex}`}
            className={styles.image}
          />
          
        )}
      </div>
      <div className={styles.buttonWrap}>
      <div className={styles.buttonWrapRight}>
      <div className={styles.buttonContainer}>
          <button
            className={`primary-button ${styles['navigationButton']}`}
            onClick={() => setViewToggle(false)}
          >
            Grid View
          </button>
        </div>
      <div  className={`primary-button ${styles['mainSectionButtonDetails']}`}>
            Full Video
          </div>

     
        </div>
        <div className={styles.buttonWrapLeft}>
          <button
              className={`primary-button ${styles['navigationButton']}`}
              onClick={() =>
                setSelectedImageIndex((prevIndex) =>
                  prevIndex === 0 ? getTotalImageCount(projectData) - 1 : prevIndex - 1
                )
              }
            >
              Prev Image
            </button>
            <button
              className={`primary-button ${styles['navigationButton']}`}
              onClick={() =>
                setSelectedImageIndex((prevIndex) =>
                  prevIndex === getTotalImageCount(projectData) - 1 ? 0 : prevIndex + 1
                )
              }
            >
              Next Image
            </button>
        </div>
      </div>
    </section>
  );
};

export default Image;

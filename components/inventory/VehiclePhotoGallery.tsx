"use client";

import { useEffect, useState } from "react";

type VehiclePhotoGalleryProps = {
  photos: string[];
  title: string;
};

export function VehiclePhotoGallery({ photos, title }: VehiclePhotoGalleryProps) {
  const cleanPhotos = photos.filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight" && selectedIndex !== null && cleanPhotos.length > 1) {
        setSelectedIndex((selectedIndex + 1) % cleanPhotos.length);
      }

      if (event.key === "ArrowLeft" && selectedIndex !== null && cleanPhotos.length > 1) {
        setSelectedIndex((selectedIndex - 1 + cleanPhotos.length) % cleanPhotos.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cleanPhotos.length, selectedIndex]);

  if (cleanPhotos.length === 0) {
    return (
      <div className="vehiclePhotoStack">
        <div className="vehicleDetailMedia">
          <div className="vehiclePlaceholder">Photo coming soon</div>
        </div>
      </div>
    );
  }

  const selectedPhoto = selectedIndex !== null ? cleanPhotos[selectedIndex] : null;

  function openPhoto(index: number) {
    setSelectedIndex(index);
  }

  function closePhoto() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + cleanPhotos.length) % cleanPhotos.length);
  }

  function showNext() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % cleanPhotos.length);
  }

  return (
    <div className="vehiclePhotoStack">
      <button
        type="button"
        className="vehicleDetailMedia vehicleMainPhotoButton"
        onClick={() => openPhoto(0)}
        aria-label={`Open larger photo of ${title}`}
      >
        <img src={cleanPhotos[0]} alt={title} />
      </button>

      {cleanPhotos.length > 1 ? (
        <div className="vehicleThumbnailGrid" aria-label={`${title} photo gallery`}>
          {cleanPhotos.map((photo, index) => (
            <button
              type="button"
              className="vehicleThumbnail"
              key={`${photo}-${index}`}
              onClick={() => openPhoto(index)}
              aria-label={`Open ${title} photo ${index + 1}`}
            >
              <img src={photo} alt={`${title} photo ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}

      {selectedPhoto ? (
        <div className="vehiclePhotoModal" role="dialog" aria-modal="true" onClick={closePhoto}>
          <div className="vehiclePhotoModalContent" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="vehiclePhotoModalClose"
              onClick={closePhoto}
              aria-label="Close photo viewer"
            >
              ×
            </button>

            <div className="vehiclePhotoModalImageFrame">
              <img src={selectedPhoto} alt={`${title} large view`} />
            </div>

            {cleanPhotos.length > 1 ? (
              <div className="vehiclePhotoModalControls">
                <button type="button" className="buttonGhost" onClick={showPrevious}>
                  ← Previous
                </button>

                <span>
                  Photo {selectedIndex! + 1} of {cleanPhotos.length}
                </span>

                <button type="button" className="buttonGhost" onClick={showNext}>
                  Next →
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

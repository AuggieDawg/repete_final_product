"use client";

import { useEffect, useRef, useState } from "react";

type VehiclePhotoGalleryProps = {
  photos: string[];
  title: string;
};

const SWIPE_THRESHOLD_PX = 45;

function getWrappedIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return (index + length) % length;
}

export function VehiclePhotoGallery({ photos, title }: VehiclePhotoGalleryProps) {
  const cleanPhotos = photos.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const ignoreNextClickRef = useRef(false);

  useEffect(() => {
    if (activeIndex >= cleanPhotos.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, cleanPhotos.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight" && cleanPhotos.length > 1) {
        setSelectedIndex((current) =>
          current === null ? current : getWrappedIndex(current + 1, cleanPhotos.length)
        );
      }

      if (event.key === "ArrowLeft" && cleanPhotos.length > 1) {
        setSelectedIndex((current) =>
          current === null ? current : getWrappedIndex(current - 1, cleanPhotos.length)
        );
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

  const activePhoto = cleanPhotos[activeIndex] || cleanPhotos[0];
  const selectedPhoto = selectedIndex !== null ? cleanPhotos[selectedIndex] : null;

  function openPhoto(index: number) {
    setActiveIndex(index);
    setSelectedIndex(index);
  }

  function closePhoto() {
    setSelectedIndex(null);
  }

  function showPreviousMain() {
    setActiveIndex((current) => getWrappedIndex(current - 1, cleanPhotos.length));
  }

  function showNextMain() {
    setActiveIndex((current) => getWrappedIndex(current + 1, cleanPhotos.length));
  }

  function showPreviousModal() {
    setSelectedIndex((current) =>
      current === null ? current : getWrappedIndex(current - 1, cleanPhotos.length)
    );
  }

  function showNextModal() {
    setSelectedIndex((current) =>
      current === null ? current : getWrappedIndex(current + 1, cleanPhotos.length)
    );
  }

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function getSwipeDelta(event: React.TouchEvent) {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];

    touchStartRef.current = null;

    if (!start || !touch) return null;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return null;
    if (Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return null;

    return deltaX;
  }

  function markSwipeHandled() {
    ignoreNextClickRef.current = true;

    window.setTimeout(() => {
      ignoreNextClickRef.current = false;
    }, 350);
  }

  function handleMainTouchEnd(event: React.TouchEvent) {
    if (cleanPhotos.length <= 1) return;

    const deltaX = getSwipeDelta(event);
    if (deltaX === null) return;

    markSwipeHandled();

    if (deltaX < 0) {
      showNextMain();
    } else {
      showPreviousMain();
    }
  }

  function handleModalTouchEnd(event: React.TouchEvent) {
    if (cleanPhotos.length <= 1) return;

    const deltaX = getSwipeDelta(event);
    if (deltaX === null) return;

    if (deltaX < 0) {
      showNextModal();
    } else {
      showPreviousModal();
    }
  }

  function handleMainClick() {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }

    openPhoto(activeIndex);
  }

  return (
    <div className="vehiclePhotoStack">
      <button
        type="button"
        className="vehicleDetailMedia vehicleMainPhotoButton"
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMainTouchEnd}
        aria-label={`Open larger photo of ${title}`}
      >
        <img src={activePhoto} alt={title} />

        {cleanPhotos.length > 1 ? (
          <span className="vehicleSwipeHint">Swipe photos</span>
        ) : null}
      </button>

      {cleanPhotos.length > 1 ? (
        <div className="vehicleThumbnailGrid" aria-label={`${title} photo gallery`}>
          {cleanPhotos.map((photo, index) => (
            <button
              type="button"
              className={`vehicleThumbnail ${index === activeIndex ? "vehicleThumbnailActive" : ""}`}
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

            <div
              className="vehiclePhotoModalImageFrame"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleModalTouchEnd}
            >
              <img src={selectedPhoto} alt={`${title} large view`} />
            </div>

            {cleanPhotos.length > 1 ? (
              <div className="vehiclePhotoModalControls">
                <button type="button" className="buttonGhost" onClick={showPreviousModal}>
                  ← Previous
                </button>

                <span>
                  Photo {selectedIndex! + 1} of {cleanPhotos.length}
                </span>

                <button type="button" className="buttonGhost" onClick={showNextModal}>
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

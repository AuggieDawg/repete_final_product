"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

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
  const photoCount = cleanPhotos.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const ignoreNextClickRef = useRef(false);

  const safeActiveIndex = photoCount > 0 ? Math.min(activeIndex, photoCount - 1) : 0;
  const safeSelectedIndex =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < photoCount
      ? selectedIndex
      : null;

  const activePhoto = cleanPhotos[safeActiveIndex] || cleanPhotos[0];
  const selectedPhoto = safeSelectedIndex !== null ? cleanPhotos[safeSelectedIndex] : null;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (safeSelectedIndex === null) return;

      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight" && photoCount > 1) {
        const nextIndex = getWrappedIndex(safeSelectedIndex + 1, photoCount);
        setActiveIndex(nextIndex);
        setSelectedIndex(nextIndex);
      }

      if (event.key === "ArrowLeft" && photoCount > 1) {
        const previousIndex = getWrappedIndex(safeSelectedIndex - 1, photoCount);
        setActiveIndex(previousIndex);
        setSelectedIndex(previousIndex);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photoCount, safeSelectedIndex]);

  if (photoCount === 0) {
    return (
      <div className="vehiclePhotoStack">
        <div className="vehicleDetailMedia">
          <div className="vehiclePlaceholder">Photo coming soon</div>
        </div>
      </div>
    );
  }

  function openPhoto(index: number) {
    const nextIndex = getWrappedIndex(index, photoCount);
    setActiveIndex(nextIndex);
    setSelectedIndex(nextIndex);
  }

  function closePhoto() {
    setSelectedIndex(null);
  }

  function showPreviousMain() {
    setActiveIndex((current) => getWrappedIndex(current - 1, photoCount));
  }

  function showNextMain() {
    setActiveIndex((current) => getWrappedIndex(current + 1, photoCount));
  }

  function showPreviousModal() {
    if (safeSelectedIndex === null) return;

    const nextIndex = getWrappedIndex(safeSelectedIndex - 1, photoCount);
    setActiveIndex(nextIndex);
    setSelectedIndex(nextIndex);
  }

  function showNextModal() {
    if (safeSelectedIndex === null) return;

    const nextIndex = getWrappedIndex(safeSelectedIndex + 1, photoCount);
    setActiveIndex(nextIndex);
    setSelectedIndex(nextIndex);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function getSwipeDelta(event: TouchEvent<HTMLElement>) {
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

  function handleMainTouchEnd(event: TouchEvent<HTMLElement>) {
    if (photoCount <= 1) return;

    const deltaX = getSwipeDelta(event);
    if (deltaX === null) return;

    markSwipeHandled();

    if (deltaX < 0) {
      showNextMain();
    } else {
      showPreviousMain();
    }
  }

  function handleModalTouchEnd(event: TouchEvent<HTMLElement>) {
    if (photoCount <= 1) return;

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

    openPhoto(safeActiveIndex);
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
        <Image
          src={activePhoto}
          alt={title}
          fill
          priority
          unoptimized
          sizes="(max-width: 900px) 100vw, 50vw"
          className="vehicleGalleryImage"
        />

        {photoCount > 1 ? (
          <span className="vehicleSwipeHint">Swipe photos</span>
        ) : null}
      </button>

      {photoCount > 1 ? (
        <div className="vehicleThumbnailGrid" aria-label={`${title} photo gallery`}>
          {cleanPhotos.map((photo, index) => (
            <button
              type="button"
              className={`vehicleThumbnail ${index === safeActiveIndex ? "vehicleThumbnailActive" : ""}`}
              key={`${photo}-${index}`}
              onClick={() => openPhoto(index)}
              aria-label={`Open ${title} photo ${index + 1}`}
            >
              <Image
                src={photo}
                alt={`${title} photo ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 700px) 33vw, 160px"
                className="vehicleThumbnailImage"
              />
            </button>
          ))}
        </div>
      ) : null}

      {selectedPhoto && safeSelectedIndex !== null ? (
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
              <Image
                src={selectedPhoto}
                alt={`${title} large view`}
                fill
                unoptimized
                sizes="100vw"
                className="vehicleModalImage"
              />
            </div>

            {photoCount > 1 ? (
              <div className="vehiclePhotoModalControls">
                <button type="button" className="buttonGhost" onClick={showPreviousModal}>
                  ← Previous
                </button>

                <span>
                  Photo {safeSelectedIndex + 1} of {photoCount}
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

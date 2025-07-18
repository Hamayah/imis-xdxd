import React, { useRef, useState } from 'react';

interface MediaPanelProps {
  highlightUrl: string;
  highlightDuration: number;
  fullUrl: string;
  fullDuration: number;
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const MediaPanel: React.FC<MediaPanelProps> = ({ highlightUrl, highlightDuration, fullUrl, fullDuration }) => {
  const [highlightAspect, setHighlightAspect] = useState(16 / 9);
  const [fullAspect, setFullAspect] = useState(16 / 9);
  const highlightRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);

  const handleHighlightMeta = () => {
    const v = highlightRef.current;
    if (v && v.videoWidth && v.videoHeight) {
      setHighlightAspect(v.videoWidth / v.videoHeight);
    }
  };
  const handleFullMeta = () => {
    const v = fullRef.current;
    if (v && v.videoWidth && v.videoHeight) {
      setFullAspect(v.videoWidth / v.videoHeight);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Card 1: LLM Highlight */}
      <div className="bg-white rounded-md shadow-sm p-4 flex-1 min-w-0">
        <div
          className="rounded overflow-hidden mb-2 mx-auto"
          style={{
            width: '100%',
            maxWidth: '100%',
            aspectRatio: highlightAspect,
            background: '#000',
          }}
        >
          <video
            ref={highlightRef}
            src={highlightUrl}
            autoPlay
            muted
            loop
            controls
            className="w-full h-full object-contain bg-black"
            aria-label="LLM Highlight Preview"
            onLoadedMetadata={handleHighlightMeta}
          />
        </div>
        <div className="text-xs text-gray-500">LLM Highlight &middot; {formatDuration(highlightDuration)}</div>
      </div>
      {/* Card 2: Room Live Record */}
      <div className="bg-white rounded-md shadow-sm p-4 flex-1 min-w-0">
        <div
          className="rounded overflow-hidden mb-2 mx-auto"
          style={{
            width: '100%',
            maxWidth: '100%',
            aspectRatio: fullAspect,
            background: '#000',
          }}
        >
          <video
            ref={fullRef}
            src={fullUrl}
            controls
            className="w-full h-full object-contain bg-black"
            aria-label="Room Live Record Preview"
            onLoadedMetadata={handleFullMeta}
          />
        </div>
        <div className="text-xs text-gray-500">Room Live Record &middot; {formatDuration(fullDuration)}</div>
      </div>
    </div>
  );
};

export default MediaPanel; 
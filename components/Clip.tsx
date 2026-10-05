'use client';

import { Play } from '@phosphor-icons/react';
import { useRef, useState } from 'react';

/** A short silent film. It waits to be asked, plays once, and goes back to its still. */
export function Clip({ name, seconds, label }: { name: string; seconds: number; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    video.current?.play().catch(() => setPlaying(false));
  };
  const rewind = () => {
    setPlaying(false);
    video.current?.load();
  };

  return (
    <div className="clip">
      <video ref={video} src={`/film/${name}.mp4`} poster={`/film/${name}.jpg`} width={960} height={540} muted playsInline preload="none" controls={playing} aria-label={label} onEnded={rewind} />
      {!playing && (
        <button type="button" className="clip__play" onClick={play}>
          <Play size={18} weight="fill" aria-hidden="true" />
          Play
          <span className="sr-only">: {label}</span>
          <span className="clip__length">{seconds} s</span>
        </button>
      )}
    </div>
  );
}

"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Styles from './video.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
const Video = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTogglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };
    return (
        <div className={Styles.videoContainer} onClick={handleTogglePlay}>
            {!isPlaying && (
                <>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/video-preview.jpg`}
                        alt="Video Poster"
                        fill
                        className={Styles.poster}
                    />
                    <button className={Styles.playButton}><FontAwesomeIcon icon={faPlay} /></button>
                </>
            )}
            <video
                ref={videoRef}
                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/diamond-video.mp4`}
                className={Styles.video}
                muted
                playsInline
            />

        </div>
    )
}

export default Video

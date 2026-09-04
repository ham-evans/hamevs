"use client";

import { useEffect } from "react";

// The native controls park a small play button in the bottom-left corner, which
// is easy to miss on a still frame. Swap it for a centered button that hands off
// to the native controls once playback starts.
export default function VideoPlayOverlay() {
  useEffect(() => {
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(".prose figure video"),
    );

    const teardowns = videos.map((video) => {
      const figure = video.parentElement;
      if (!figure || figure.querySelector(".video-wrap")) return () => {};

      const wrap = document.createElement("div");
      wrap.className = "video-wrap";
      figure.insertBefore(wrap, video);
      wrap.appendChild(video);

      const hadControls = video.controls;
      video.controls = false;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "video-play";
      button.setAttribute("aria-label", "Play video");
      button.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>';
      wrap.appendChild(button);

      const start = () => {
        video.controls = true;
        wrap.classList.add("started");
        void video.play();
      };
      button.addEventListener("click", start);

      return () => {
        button.removeEventListener("click", start);
        button.remove();
        video.controls = hadControls;
        figure.insertBefore(video, wrap);
        wrap.remove();
      };
    });

    return () => teardowns.forEach((teardown) => teardown());
  }, []);

  return null;
}

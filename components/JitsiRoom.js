'use client';
import { useEffect, useRef } from 'react';

// Embeds Jitsi Meet (WebRTC). Public meet.jit.si is fine for demos; for production use
// your own Jitsi server or 8x8 JaaS (https://jaas.8x8.vc) with JWT-signed rooms.
export default function JitsiRoom({ room, displayName }) {
  const ref = useRef(null);
  useEffect(() => {
    let api;
    const s = document.createElement('script');
    s.src = 'https://meet.jit.si/external_api.js';
    s.async = true;
    s.onload = () => {
      api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: room,
        parentNode: ref.current,
        width: '100%',
        height: 600,
        userInfo: { displayName },
      });
    };
    document.body.appendChild(s);
    return () => { api?.dispose(); s.remove(); };
  }, [room, displayName]);
  return <div ref={ref} style={{ minHeight: 600, background: '#000', borderRadius: 10 }} />;
}

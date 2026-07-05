import { nanoid } from "nanoid";

interface JitsiRoom {
  roomId: string;
  roomName: string;
  url: string;
  createdAt: Date;
  expiresAt: Date;
}

const JITSI_SERVER = "https://meet.jit.si";
const ROOM_DURATION_MINUTES = 120; // 2 hours

export function generateJitsiRoom(consultationId: number, therapistName: string): JitsiRoom {
  const roomId = `tinas-${consultationId}-${nanoid(8).toLowerCase()}`;
  const roomName = `Consultation-${therapistName.replace(/\s+/g, "-")}-${consultationId}`;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ROOM_DURATION_MINUTES * 60000);

  const url = `${JITSI_SERVER}/${encodeURIComponent(roomName)}`;

  return {
    roomId,
    roomName,
    url,
    createdAt: now,
    expiresAt,
  };
}

export function buildJitsiEmbedUrl(roomName: string, userInfo?: { name: string; email: string }): string {
  const params = new URLSearchParams();

  if (userInfo) {
    params.append("userInfo.displayName", userInfo.name);
    params.append("userInfo.email", userInfo.email);
  }

  // Configure Jitsi options
  params.append("config.startWithAudioMuted", "false");
  params.append("config.startWithVideoMuted", "false");
  params.append("config.disableModeratorIndicator", "false");
  params.append("config.enableWelcomePage", "true");

  const url = `${JITSI_SERVER}/${encodeURIComponent(roomName)}`;
  return params.toString() ? `${url}?${params.toString()}` : url;
}

export function isRoomExpired(room: JitsiRoom): boolean {
  return new Date() > room.expiresAt;
}

export function getJitsiEmbedCode(roomName: string, width: string = "100%", height: string = "600px"): string {
  return `
    <iframe
      allow="camera; microphone; display-capture; fullscreen"
      src="${JITSI_SERVER}/${encodeURIComponent(roomName)}"
      width="${width}"
      height="${height}"
      style="border-radius: 8px; border: 1px solid rgba(212, 165, 116, 0.3);"
    ></iframe>
  `;
}

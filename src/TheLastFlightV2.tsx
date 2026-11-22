import {
  Audio,
  Composition,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// THE LAST FLIGHT v2 — 15 detik, 9:16 vertikal.
// Sama seperti v1 (slow push-in 1.00 -> 1.12 di gambar Reaper malam),
// tapi dengan narasi Bahasa Indonesia (13,8 detik) dan kartu judul
// emas yang fade-in di 3 detik terakhir. Komposisi v1 tidak diubah.
export const TheLastFlightV2Composition = () => {
  return (
    <Composition
      id="TheLastFlightV2"
      component={TheLastFlightV2}
      durationInFrames={360}
      fps={24}
      width={1080}
      height={1920}
    />
  );
};

export const TheLastFlightV2: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 360], [1, 1.12]);
  const titleOpacity = interpolate(frame, [288, 312], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ flex: 1, overflow: "hidden", backgroundColor: "#000000", position: "relative" }}>
      <Audio src={staticFile("narration-id.mp3")} volume={1} />
      <Img
        src={staticFile("reaper-night.webp")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "18%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 72,
            fontWeight: "bold",
            letterSpacing: 8,
            color: "#D9A441",
            textShadow:
              "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(217,164,65,0.45)",
            padding: "0 40px",
          }}
        >
          THE LAST FLIGHT
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 36,
            letterSpacing: 6,
            color: "#F5E9C8",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            marginTop: 12,
          }}
        >
          PENERBANGAN TERAKHIR
        </div>
      </div>
    </div>
  );
};

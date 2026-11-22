import {
  Audio,
  Composition,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// UNDUR-UNDUR — Siklus Hidup: dari Telur sampai Dewasa.
// 70 detik, 9:16 vertikal, 7 segmen x 10 detik (240 frame).
// Tiap segmen: satu gambar macro + slow push-in 1.00 -> 1.10,
// narasi Bahasa Indonesia, subtitle teks di bawah, kartu akhir
// "Ikuti untuk fakta hewan luar biasa setiap hari." di 3 detik terakhir.
// Gambar: public/undur-seg1..7. Narasi: public/undur-narration-full.mp3 (70 detik).
const SEGMENTS: { img: string; text: string }[] = [
  {
    img: "undur-seg1-hatch.webp",
    text: "Di pasir kering, sebutir telur kecil terkubur. Dari dalamnya, larva mungil menetas, dan langsung berjalan mundur.",
  },
  {
    img: "undur-seg2-dig.webp",
    text: "Ia berjalan mundur meninggalkan jejak melingkar, lalu menggali lubang kerucut dengan rahang sabitnya.",
  },
  {
    img: "undur-seg3-jaws.webp",
    text: "Di dasar lubang ia bersembunyi, hanya rahang sabitnya yang terlihat, menunggu mangsa terpeleset.",
  },
  {
    img: "undur-seg4-trap.webp",
    text: "Seekor semut terpeleset dan pasir berjatuhan. Undur-undur melemparkan pasir, hingga mangsanya jatuh semakin dalam.",
  },
  {
    img: "undur-seg5-cocoon.webp",
    text: "Rahang menjepit, racun melumpuhkan, cairan mangsa diisap. Setelah tumbuh, ia membungkus diri dalam kepompong sutra berlapis pasir.",
  },
  {
    img: "undur-seg6-emerge.webp",
    text: "Berminggu di dalam kepompong, tubuhnya berubah. Sayap bening merekah, capung halus merangkak keluar dari pasir.",
  },
  {
    img: "undur-seg7-adult.webp",
    text: "Kini ia terbang di senja hari, capung halus penari senja. Ia bertelur kembali di pasir, dan siklus pun berulang.",
  },
];

export const UndurUndurComposition = () => {
  return (
    <Composition
      id="UndurUndur"
      component={UndurUndur}
      durationInFrames={1680}
      fps={24}
      width={1080}
      height={1920}
    />
  );
};

export const UndurUndur: React.FC = () => {
  const frame = useCurrentFrame();
  const segIndex = Math.min(SEGMENTS.length - 1, Math.floor(frame / 240));
  const localFrame = frame - segIndex * 240;
  const scale = interpolate(localFrame, [0, 240], [1, 1.1]);
  const ctaOpacity = interpolate(frame, [1608, 1656], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg = SEGMENTS[segIndex];
  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      <Audio src={staticFile("undur-narration-full.mp3")} volume={1} />
      <Img
        src={staticFile(seg.img)}
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
          bottom: 130,
          textAlign: "center",
          padding: "0 40px",
          fontFamily: "sans-serif",
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.35,
          color: "#FFFFFF",
          textShadow:
            "0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {seg.text}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 420,
          textAlign: "center",
          padding: "0 40px",
          fontFamily: "sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#FFFFFF",
          textShadow: "0 2px 6px rgba(0,0,0,0.9)",
          opacity: ctaOpacity,
        }}
      >
        Ikuti untuk fakta hewan luar biasa setiap hari.
      </div>
    </div>
  );
};

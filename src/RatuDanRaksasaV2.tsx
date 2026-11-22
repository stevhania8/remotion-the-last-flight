import {
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

const SEG = 240; // 10 detik @ 24fps
const TOTAL = 1440; // 60 detik @ 24fps

// ---------------------------------------------------------------------------
// Teknik lapisan: tiap lapisan adalah gambar UTUH yang sama, ditumpuk persis
// di posisi yang sama, dibatasi mask-image linear/radial-gradient dengan tepi
// dilembutkan (feather). Gerakan tiap lapisan KECIL (rotasi <= 2 derajat,
// geser <= 6px, skala <= 1.5%) sehingga sambungan tidak terlihat.
// ---------------------------------------------------------------------------

type LayerProps = {
  src: string;
  mask: string;
  transform: string;
  opacity?: number;
};

const Layer: React.FC<LayerProps> = ({ src, mask, transform, opacity = 1 }) => {
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform,
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
};

// Masker dengan tepi dilembutkan (feather).
const MASK = {
  // Garuda: area atas 0–32% tinggi.
  garuda:
    "linear-gradient(to bottom, black 0%, black 16%, transparent 32%)",
  // Naga kiri: 0–38% lebar.
  nagaLeft: "linear-gradient(to right, black 0%, black 20%, transparent 38%)",
  // Naga kanan: 62–100% lebar.
  nagaRight:
    "linear-gradient(to left, black 0%, black 20%, transparent 38%)",
  // Ratu: elips tengah.
  ratu:
    "radial-gradient(ellipse 52% 42% at 50% 55%, black 52%, transparent 78%)",
  // Barong: kanan bawah.
  barong:
    "radial-gradient(ellipse 46% 34% at 78% 84%, black 48%, transparent 80%)",
  // Rantai depan: bawah 30%.
  rantai: "linear-gradient(to top, black 0%, black 52%, transparent 76%)",
  // Raksasa: elips tengah.
  raksasa:
    "radial-gradient(ellipse 55% 48% at 50% 52%, black 55%, transparent 80%)",
};

// Osilasi halus berulang: 1 siklus penuh selama satu segmen (10 detik).
const sway = (frame: number, amp: number, phase = 0) =>
  Math.sin((frame / SEG) * Math.PI * 2 + phase) * amp;

// Partikel deterministik (tanpa Math.random supaya render stabil).
const GOLD_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 53 + 37) % 100, // % lebar
  size: 3 + ((i * 7) % 5),
  speed: 4 + ((i * 3) % 4), // px per frame
  offset: (i * 37) % SEG,
  drift: ((i * 29) % 20) - 10,
}));

const DUST_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 71 + 11) % 100,
  size: 2 + ((i * 5) % 4),
  speed: 1.5 + ((i * 2) % 3),
  offset: (i * 53) % SEG,
  drift: ((i * 17) % 14) - 7,
}));

const Particles: React.FC<{ gold: boolean }> = ({ gold }) => {
  const frame = useCurrentFrame();
  const list = gold ? GOLD_PARTICLES : DUST_PARTICLES;
  return (
    <>
      {list.map((p, i) => {
        const cycle = (frame + p.offset) % SEG;
        const y = gold ? 1850 - cycle * p.speed : 200 + cycle * p.speed;
        const opacity =
          Math.sin((cycle / SEG) * Math.PI) * (gold ? 0.9 : 0.5);
        const x = p.x + (cycle / SEG) * p.drift;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: gold ? "#D9A441" : "#C9C2B4",
              boxShadow: gold
                ? "0 0 12px 3px rgba(217,164,65,0.6)"
                : "0 0 8px 2px rgba(201,194,180,0.4)",
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Lapisan dasar: gambar utuh, zoom sangat pelan.
const BaseLayer: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SEG], [1, 1.05]);
  return (
    <Layer src={src} mask="none" transform={`scale(${scale})`} />
  );
};

// --- Segmen Ratu (1, 3, 5) -------------------------------------------------
const RatuLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.0075 * (1 + Math.sin((frame / SEG) * Math.PI * 2));
  const bob = sway(frame, 2); // naik-turun 4px
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <BaseLayer src="ratu.jpg" />
      <Layer
        src="ratu.jpg"
        mask={MASK.garuda}
        transform={`rotate(${sway(frame, 2)}deg)`}
      />
      <Layer
        src="ratu.jpg"
        mask={MASK.nagaLeft}
        transform={`rotate(${sway(frame, 1.5)}deg)`}
      />
      <Layer
        src="ratu.jpg"
        mask={MASK.nagaRight}
        transform={`rotate(${sway(frame, 1.5, Math.PI)}deg)`}
      />
      <Layer
        src="ratu.jpg"
        mask={MASK.ratu}
        transform={`scale(${breathe}) translateY(${bob}px)`}
      />
      <Layer
        src="ratu.jpg"
        mask={MASK.barong}
        transform={`rotate(${sway(frame, 1)}deg) translateY(${sway(frame, 2.5, Math.PI / 2)}px)`}
      />
      <Particles gold />
    </div>
  );
};

// --- Segmen Raksasa (2, 4) -------------------------------------------------
const RaksasaLayers: React.FC<{ deep: boolean }> = ({ deep }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.0075 * (1 + Math.sin((frame / SEG) * Math.PI * 2));
  // Denyut jantung cahaya merah: ~1 denyut per 1,2 detik.
  const glow = 0.6 + 0.2 * Math.sin(frame * 0.22);
  const zoomTo = deep ? 1.1 : 1.05;
  const scale = interpolate(frame, [0, SEG], [1, zoomTo]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Layer src="raksasa.jpg" mask="none" transform={`scale(${scale})`} />
      <Layer
        src="raksasa.jpg"
        mask={MASK.raksasa}
        transform={`scale(${breathe})`}
      />
      <Layer
        src="raksasa.jpg"
        mask={MASK.rantai}
        transform={`rotate(${sway(frame, 1)}deg)`}
      />
      {/* Cahaya merah di dada: radial-gradient, berdenyut seperti jantung. */}
      <div
        style={{
          position: "absolute",
          left: "48%",
          top: "36%",
          width: "46%",
          height: "32%",
          background:
            "radial-gradient(circle, rgba(255,45,20,0.55) 0%, rgba(200,20,10,0.25) 45%, transparent 70%)",
          opacity: glow,
        }}
      />
      <Particles gold={false} />
    </div>
  );
};

// --- Segmen 6: Ratu + judul emas fade-in ------------------------------------
const TitleSegmentV2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <RatuLayers />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "22%",
          textAlign: "center",
          opacity,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 64,
            fontWeight: "bold",
            letterSpacing: 6,
            color: "#D9A441",
            textShadow:
              "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(217,164,65,0.45)",
            padding: "0 40px",
          }}
        >
          RATU DAN RAKSASA TERBELENGGU
        </div>
      </div>
    </div>
  );
};

export const RatuDanRaksasaV2Composition = () => {
  return (
    <Composition
      id="RatuDanRaksasaV2"
      component={RatuDanRaksasaV2}
      durationInFrames={TOTAL}
      fps={24}
      width={1080}
      height={1920}
    />
  );
};

// RATU DAN RAKSASA TERBELENGGU V2 — 60 detik, 9:16 vertikal.
// Versi lapisan: tiap elemen gambar bergerak sendiri-sendiri (Garuda, naga,
// ratu, Barong, rantai, cahaya merah, partikel), bukan hanya kameranya.
// Enam segmen @ 10 detik dengan hard cut. Narasi dari frame 0.
export const RatuDanRaksasaV2: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      <Audio src={staticFile("ratu-raksasa-narration.mp3")} volume={1} />
      {/* Segmen 1 (0–10 dtk): Ratu berlapis */}
      <Sequence from={0} durationInFrames={SEG}>
        <RatuLayers />
      </Sequence>
      {/* Segmen 2 (10–20 dtk): Raksasa berlapis */}
      <Sequence from={SEG} durationInFrames={SEG}>
        <RaksasaLayers deep={false} />
      </Sequence>
      {/* Segmen 3 (20–30 dtk): Ratu berlapis */}
      <Sequence from={SEG * 2} durationInFrames={SEG}>
        <RatuLayers />
      </Sequence>
      {/* Segmen 4 (30–40 dtk): Raksasa berlapis, zoom lebih dalam */}
      <Sequence from={SEG * 3} durationInFrames={SEG}>
        <RaksasaLayers deep />
      </Sequence>
      {/* Segmen 5 (40–50 dtk): Ratu berlapis */}
      <Sequence from={SEG * 4} durationInFrames={SEG}>
        <RatuLayers />
      </Sequence>
      {/* Segmen 6 (50–60 dtk): Ratu berlapis + judul emas fade-in */}
      <Sequence from={SEG * 5} durationInFrames={SEG}>
        <TitleSegmentV2 />
      </Sequence>
    </div>
  );
};

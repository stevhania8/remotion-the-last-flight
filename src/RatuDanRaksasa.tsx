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

// Gerakan Ken Burns generik: zoom + pan (dalam % ukuran gambar).
// useCurrentFrame di dalam Sequence sudah relatif terhadap awal segmen (0..239).
const KenBurns: React.FC<{
  src: string;
  fromScale: number;
  toScale: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
}> = ({
  src,
  fromScale,
  toScale,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SEG], [fromScale, toScale]);
  const x = interpolate(frame, [0, SEG], [fromX, toX]);
  const y = interpolate(frame, [0, SEG], [fromY, toY]);
  return (
    <div style={{ flex: 1, overflow: "hidden", backgroundColor: "#000000" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${x}%, ${y}%)`,
        }}
      />
    </div>
  );
};

// Segmen 6: gambar Ratu + judul yang fade-in di awal segmen.
const TitleSegment: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SEG], [1, 1.1]);
  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ flex: 1, overflow: "hidden", backgroundColor: "#000000" }}>
      <Img
        src={staticFile("ratu.jpg")}
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
            textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(217,164,65,0.45)",
            padding: "0 40px",
          }}
        >
          RATU DAN RAKSASA TERBELENGGU
        </div>
      </div>
    </div>
  );
};

export const RatuDanRaksasaComposition = () => {
  return (
    <Composition
      id="RatuDanRaksasa"
      component={RatuDanRaksasa}
      durationInFrames={TOTAL}
      fps={24}
      width={1080}
      height={1920}
    />
  );
};

// RATU DAN RAKSASA TERBELENGGU — 60 detik, 9:16 vertikal.
// Enam segmen @ 10 detik dengan hard cut (Sequence).
// Segmen 1, 3, 5, 6: gambar Ratu. Segmen 2, 4: gambar Raksasa.
// Narasi Bahasa Indonesia dari frame 0.
export const RatuDanRaksasa: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      <Audio src={staticFile("ratu-raksasa-narration.mp3")} volume={1} />
      {/* Segmen 1 (0–10 dtk): Ratu, slow push-in 1.00 -> 1.12 */}
      <Sequence from={0} durationInFrames={SEG}>
        <KenBurns src="ratu.jpg" fromScale={1} toScale={1.12} />
      </Sequence>
      {/* Segmen 2 (10–20 dtk): Raksasa, push-in 1.00 -> 1.12,
          framing digeser ke atas supaya dada yang berlubang jadi fokus */}
      <Sequence from={SEG} durationInFrames={SEG}>
        <KenBurns
          src="raksasa.jpg"
          fromScale={1}
          toScale={1.12}
          fromY={0}
          toY={-5}
        />
      </Sequence>
      {/* Segmen 3 (20–30 dtk): Ratu, slow pan ke kanan + zoom ringan */}
      <Sequence from={SEG * 2} durationInFrames={SEG}>
        <KenBurns
          src="ratu.jpg"
          fromScale={1.02}
          toScale={1.08}
          fromX={2}
          toX={-6}
        />
      </Sequence>
      {/* Segmen 4 (30–40 dtk): Raksasa, push-in lebih cepat 1.00 -> 1.18 */}
      <Sequence from={SEG * 3} durationInFrames={SEG}>
        <KenBurns
          src="raksasa.jpg"
          fromScale={1}
          toScale={1.18}
          fromY={0}
          toY={-4}
        />
      </Sequence>
      {/* Segmen 5 (40–50 dtk): Ratu, slow pull-back 1.12 -> 1.00 */}
      <Sequence from={SEG * 4} durationInFrames={SEG}>
        <KenBurns src="ratu.jpg" fromScale={1.12} toScale={1} />
      </Sequence>
      {/* Segmen 6 (50–60 dtk): Ratu, push-in 1.00 -> 1.10 + judul fade-in */}
      <Sequence from={SEG * 5} durationInFrames={SEG}>
        <TitleSegment />
      </Sequence>
    </div>
  );
};

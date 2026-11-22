import {
  Audio,
  CalculateMetadataFunction,
  Composition,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="TheLastFlight"
      component={MyComponent}
      durationInFrames={360}
      fps={24}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
    />
  );
};

// THE LAST FLIGHT — 15 detik, 9:16 vertikal.
// Gambar malam Grim Reaper di karpet terbang sebagai frame dasar,
// dengan slow push-in (Ken Burns) dari skala 1.00 ke 1.12 selama 15 detik.
export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 360], [1, 1.12]);
  return (
    <div style={{ flex: 1, overflow: "hidden", backgroundColor: "#000000" }}>
      <Audio src={staticFile("narration.mp3")} volume={1} />
      <Img
        src={staticFile("reaper-night.webp")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
};

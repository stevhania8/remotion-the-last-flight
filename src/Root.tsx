import { MyComposition } from "./Composition";
import { RatuDanRaksasaComposition } from "./RatuDanRaksasa";
import { RatuDanRaksasaV2Composition } from "./RatuDanRaksasaV2";
import { TheLastFlightV2Composition } from "./TheLastFlightV2";
import { UndurUndurComposition } from "./UndurUndur";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <TheLastFlightV2Composition />
      <RatuDanRaksasaComposition />
      <RatuDanRaksasaV2Composition />
      <UndurUndurComposition />
    </>
  );
};

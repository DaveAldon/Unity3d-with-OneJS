import { useEventfulState } from "onejs";
import { parseColor } from "onejs/utils/color-parser";
import { h, render } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { Easing, Tween, update } from "tweenjs";
import { Mathf, Vector2 } from "UnityEngine";
import {
  MeshGenerationContext,
  Angle,
  ArcDirection,
} from "UnityEngine/UIElements";

const RadialProgress = ({ progress }: { progress: number }) => {
  const ref = useRef<Dom>();
  const labelRef = useRef<Dom>();
  const prev = useRef(progress); // using this to persist data between renders

  useEffect(() => {
    ref.current.ve.generateVisualContent = onGenerateVisualContent;
    const resolvedStyle = ref.current.ve.resolvedStyle;
    const minSize = Mathf.Min(resolvedStyle.width, resolvedStyle.height);
    ref.current.style.fontSize = minSize * 0.3;
  }, []);

  useEffect(() => {
    ref.current.ve.generateVisualContent = onGenerateVisualContent;
    ref.current.ve.MarkDirtyRepaint();

    new Tween(prev)
      .to({ current: progress }, 300)
      .easing(Easing.Quadratic.InOut)
      .onUpdate(() => {
        ref.current.ve.MarkDirtyRepaint();
        labelRef.current.ve.text = Math.round(prev.current * 100);
      })
      .start();
  }, [progress]);

  function onGenerateVisualContent(mgc: MeshGenerationContext) {
    var painter2D = mgc.painter2D;

    const resolvedStyle = ref.current.ve.resolvedStyle;
    let radius = Mathf.Min(resolvedStyle.width, resolvedStyle.height) / 2;
    let dx = resolvedStyle.width / 2 - radius;
    let dy = resolvedStyle.height / 2 - radius;

    painter2D.strokeColor = parseColor("#305fbc");
    painter2D.lineWidth = radius * 0.2;
    painter2D.BeginPath();
    painter2D.Arc(
      new Vector2(radius + dx, radius + dy),
      radius * 0.8,
      new Angle(0),
      new Angle(prev.current * 360),
      ArcDirection.Clockwise
    );
    painter2D.Stroke();
    painter2D.ClosePath();
  }

  return (
    <div
      ref={ref}
      class="w-full h-full flex justify-center items-center text-[#305fbc]"
    >
      <label ref={labelRef} />
    </div>
  );
};

const App = () => {
  const pman = require("pman");
  const [progress, _] = useEventfulState(pman, "Progress");

  return <RadialProgress progress={progress} />;
};

render(<App />, document.body);

function animate(time) {
  requestAnimationFrame(animate);
  update(time);
}
requestAnimationFrame(animate);

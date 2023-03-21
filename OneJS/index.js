Object.defineProperty(exports, "__esModule", { value: true });
var onejs_1 = require("onejs");
var color_parser_1 = require("onejs/utils/color-parser");
var preact_1 = require("preact");
var hooks_1 = require("preact/hooks");
var tweenjs_1 = require("tweenjs");
var UnityEngine_1 = require("UnityEngine");
var UIElements_1 = require("UnityEngine/UIElements");
var RadialProgress = function (_a) {
    var progress = _a.progress;
    var ref = (0, hooks_1.useRef)();
    var labelRef = (0, hooks_1.useRef)();
    var prev = (0, hooks_1.useRef)(progress);
    (0, hooks_1.useEffect)(function () {
        ref.current.ve.generateVisualContent = onGenerateVisualContent;
        var resolvedStyle = ref.current.ve.resolvedStyle;
        var minSize = UnityEngine_1.Mathf.Min(resolvedStyle.width, resolvedStyle.height);
        ref.current.style.fontSize = minSize * 0.3;
    }, []);
    (0, hooks_1.useEffect)(function () {
        ref.current.ve.generateVisualContent = onGenerateVisualContent;
        ref.current.ve.MarkDirtyRepaint();
        new tweenjs_1.Tween(prev)
            .to({ current: progress }, 300)
            .easing(tweenjs_1.Easing.Quadratic.InOut)
            .onUpdate(function () {
            ref.current.ve.MarkDirtyRepaint();
            labelRef.current.ve.text = Math.round(prev.current * 100);
        })
            .start();
    }, [progress]);
    function onGenerateVisualContent(mgc) {
        var painter2D = mgc.painter2D;
        var resolvedStyle = ref.current.ve.resolvedStyle;
        var radius = UnityEngine_1.Mathf.Min(resolvedStyle.width, resolvedStyle.height) / 2;
        var dx = resolvedStyle.width / 2 - radius;
        var dy = resolvedStyle.height / 2 - radius;
        painter2D.strokeColor = (0, color_parser_1.parseColor)("#305fbc");
        painter2D.lineWidth = radius * 0.2;
        painter2D.BeginPath();
        painter2D.Arc(new UnityEngine_1.Vector2(radius + dx, radius + dy), radius * 0.8, new UIElements_1.Angle(0), new UIElements_1.Angle(prev.current * 360), UIElements_1.ArcDirection.Clockwise);
        painter2D.Stroke();
        painter2D.ClosePath();
    }
    return ((0, preact_1.h)("div", { ref: ref, class: "w-full h-full flex justify-center items-center text-[#305fbc]" },
        (0, preact_1.h)("label", { ref: labelRef })));
};
var App = function () {
    var pman = require("pman");
    var _a = (0, onejs_1.useEventfulState)(pman, "Progress"), progress = _a[0], _ = _a[1];
    return (0, preact_1.h)(RadialProgress, { progress: progress });
};
(0, preact_1.render)((0, preact_1.h)(App, null), document.body);
function animate(time) {
    requestAnimationFrame(animate);
    (0, tweenjs_1.update)(time);
}
requestAnimationFrame(animate);

import type { OptionSet } from "../types";

export const cameraMovementOptions: OptionSet = {
  id: "camera_movement",
  version: "0.1.0",
  label: { zh: "镜头运动", en: "Camera movement" },
  options: [
    {
      id: "camera_movement:static_locked",
      version: "0.1.0",
      label: { zh: "固定不动", en: "Static / Locked-off" },
      plain: { zh: "三脚架式稳定，画面完全不晃", en: "Tripod-stable, zero camera movement" },
      professionalTerms: ["static camera", "locked-off", "tripod shot"],
      promptFragment: { zh: "镜头固定不动，画面完全稳定", en: "a static locked-off shot with zero camera movement" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:slow_push_in",
      version: "0.1.0",
      label: { zh: "缓慢推进", en: "Slow push-in" },
      plain: { zh: "镜头慢慢靠近主体，增强情绪", en: "Camera slowly moves closer for emotional build" },
      professionalTerms: ["slow push-in", "dolly in", "gradual approach"],
      promptFragment: { zh: "镜头缓慢向主体推进，逐渐加强视觉重点和情绪", en: "the camera slowly pushes in toward the subject, gradually intensifying focus and emotion" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:slow_pull_out",
      version: "0.1.0",
      label: { zh: "缓慢拉远", en: "Slow pull-out" },
      plain: { zh: "镜头慢慢远离主体，揭示更大环境", en: "Camera slowly moves away to reveal larger context" },
      professionalTerms: ["pull-out", "dolly out", "context reveal"],
      promptFragment: { zh: "镜头缓慢拉远，从主体逐渐揭示更大的环境和空间关系", en: "the camera slowly pulls out, gradually revealing the larger environment and spatial context" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:handheld_tracking",
      version: "0.1.0",
      label: { zh: "手持跟拍", en: "Handheld tracking" },
      plain: { zh: "镜头跟随主体走，轻微晃动有现场感", en: "Camera follows subject with subtle natural shake" },
      professionalTerms: ["handheld tracking", "natural shake", "following shot"],
      promptFragment: { zh: "手持跟拍镜头，轻微自然晃动，跟随主体移动，增强现场感", en: "a handheld tracking shot with subtle natural shake, following the subject for an immersive in-the-moment feel" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:smooth_pan",
      version: "0.1.0",
      label: { zh: "平稳横摇", en: "Smooth pan" },
      plain: { zh: "镜头水平转动扫过场景", en: "Camera sweeps horizontally across the scene" },
      professionalTerms: ["pan", "horizontal sweep", "scene reveal"],
      promptFragment: { zh: "镜头平稳水平横摇，从左到右扫过场景", en: "a smooth horizontal pan sweeping across the scene from left to right" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:tilt_up_down",
      version: "0.1.0",
      label: { zh: "垂直摇镜", en: "Tilt up/down" },
      plain: { zh: "镜头上下移动，展示高度或层次", en: "Camera moves vertically to show height or layers" },
      professionalTerms: ["tilt", "vertical reveal", "height emphasis"],
      promptFragment: { zh: "镜头垂直摇动，逐步展示物体的高度或空间的纵向层次", en: "a vertical tilt gradually revealing the height or vertical layering of the subject" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:orbit_around",
      version: "0.1.0",
      label: { zh: "环绕主体", en: "Orbit around subject" },
      plain: { zh: "镜头围绕主体旋转，完整展示", en: "Camera rotates around subject for full reveal" },
      professionalTerms: ["orbit shot", "360 reveal", "parallax movement"],
      promptFragment: { zh: "镜头围绕主体缓慢环绕旋转，形成视差运动，完整展示轮廓和空间关系", en: "the camera slowly orbits around the subject, creating parallax movement for a complete spatial reveal" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "camera_movement:pedestal_up_down",
      version: "0.1.0",
      label: { zh: "升降镜头", en: "Pedestal up/down" },
      plain: { zh: "镜头垂直升降，改变观察高度", en: "Camera rises or descends to change viewing height" },
      professionalTerms: ["pedestal", "crane shot", "height shift"],
      promptFragment: { zh: "镜头垂直升降，改变观察高度和画面层次", en: "a pedestal shot rising or descending to shift viewing height and visual layering" },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};

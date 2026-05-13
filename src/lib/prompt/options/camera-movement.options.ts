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
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" },
      suppresses: [
        "camera_movement:slow_push_in",
        "camera_movement:slow_pull_out",
        "camera_movement:handheld_tracking",
        "camera_movement:smooth_pan",
        "camera_movement:tilt_up_down",
        "camera_movement:orbit_around",
        "camera_movement:pedestal_up_down",
        "camera_movement:zoom_in",
        "camera_movement:zoom_out",
        "camera_movement:whip_pan",
        "camera_movement:crane_up",
        "camera_movement:rack_focus",
        "camera_movement:steadicam_float",
        "camera_movement:tracking_dolly"
      ]
    },
    {
      id: "camera_movement:slow_push_in",
      version: "0.1.0",
      label: { zh: "缓慢推进", en: "Slow push-in" },
      plain: { zh: "镜头慢慢靠近主体，增强情绪", en: "Camera slowly moves closer for emotional build" },
      professionalTerms: ["slow push-in", "dolly in", "gradual approach"],
      promptFragment: { zh: "镜头缓慢向主体推进，逐渐加强视觉重点和情绪", en: "the camera slowly pushes in toward the subject, gradually intensifying focus and emotion" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" },
      suppresses: ["camera_movement:slow_pull_out", "camera_movement:static_locked"]
    },
    {
      id: "camera_movement:slow_pull_out",
      version: "0.1.0",
      label: { zh: "缓慢拉远", en: "Slow pull-out" },
      plain: { zh: "镜头慢慢远离主体，揭示更大环境", en: "Camera slowly moves away to reveal larger context" },
      professionalTerms: ["pull-out", "dolly out", "context reveal"],
      promptFragment: { zh: "镜头缓慢拉远，从主体逐渐揭示更大的环境和空间关系", en: "the camera slowly pulls out, gradually revealing the larger environment and spatial context" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" },
      suppresses: ["camera_movement:slow_push_in", "camera_movement:static_locked"]
    },
    {
      id: "camera_movement:handheld_tracking",
      version: "0.1.0",
      label: { zh: "手持跟拍", en: "Handheld tracking" },
      plain: { zh: "镜头跟随主体走，轻微晃动有现场感", en: "Camera follows subject with subtle natural shake" },
      professionalTerms: ["handheld tracking", "natural shake", "following shot"],
      promptFragment: { zh: "手持跟拍镜头，轻微自然晃动，跟随主体移动，增强现场感", en: "a handheld tracking shot with subtle natural shake, following the subject for an immersive in-the-moment feel" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:smooth_pan",
      version: "0.1.0",
      label: { zh: "平稳横摇", en: "Smooth pan" },
      plain: { zh: "镜头水平转动扫过场景", en: "Camera sweeps horizontally across the scene" },
      professionalTerms: ["pan", "horizontal sweep", "scene reveal"],
      promptFragment: { zh: "镜头平稳水平横摇，从左到右扫过场景", en: "a smooth horizontal pan sweeping across the scene from left to right" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:tilt_up_down",
      version: "0.1.0",
      label: { zh: "垂直摇镜", en: "Tilt up/down" },
      plain: { zh: "镜头上下移动，展示高度或层次", en: "Camera moves vertically to show height or layers" },
      professionalTerms: ["tilt", "vertical reveal", "height emphasis"],
      promptFragment: { zh: "镜头垂直摇动，逐步展示物体的高度或空间的纵向层次", en: "a vertical tilt gradually revealing the height or vertical layering of the subject" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:orbit_around",
      version: "0.1.0",
      label: { zh: "环绕主体", en: "Orbit around subject" },
      plain: { zh: "镜头围绕主体旋转，完整展示", en: "Camera rotates around subject for full reveal" },
      professionalTerms: ["orbit shot", "360 reveal", "parallax movement"],
      promptFragment: { zh: "镜头围绕主体缓慢环绕旋转，形成视差运动，完整展示轮廓和空间关系", en: "the camera slowly orbits around the subject, creating parallax movement for a complete spatial reveal" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:pedestal_up_down",
      version: "0.1.0",
      label: { zh: "升降镜头", en: "Pedestal up/down" },
      plain: { zh: "镜头垂直升降，改变观察高度", en: "Camera rises or descends to change viewing height" },
      professionalTerms: ["pedestal", "crane shot", "height shift"],
      promptFragment: { zh: "镜头垂直升降，改变观察高度和画面层次", en: "a pedestal shot rising or descending to shift viewing height and visual layering" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:zoom_in",
      version: "0.1.0",
      label: { zh: "推近变焦", en: "Zoom in" },
      plain: { zh: "镜头向主体推近，引导注意力聚焦", en: "Zoom in toward the subject to focus viewer attention" },
      professionalTerms: ["zoom in", "focal length push", "magnification"],
      promptFragment: { zh: "镜头向主体推近，景别从宽变紧，引导观众注意力聚焦", en: "zoom in toward the subject, tightening the frame to focus viewer attention" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" },
      suppresses: ["camera_movement:zoom_out"]
    },
    {
      id: "camera_movement:zoom_out",
      version: "0.1.0",
      label: { zh: "拉远变焦", en: "Zoom out" },
      plain: { zh: "镜头从主体拉远，展现更广阔的环境", en: "Zoom out from the subject to reveal wider context" },
      professionalTerms: ["zoom out", "reveal shot", "contextual pull"],
      promptFragment: { zh: "镜头从主体拉远，逐步展现更广阔的环境和场景关系", en: "zoom out from the subject, gradually revealing a wider environment and scene context" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" },
      suppresses: ["camera_movement:zoom_in"]
    },
    {
      id: "camera_movement:whip_pan",
      version: "0.1.0",
      label: { zh: "快速甩镜头", en: "Whip pan" },
      plain: { zh: "快速水平甩镜，制造速度感和转场动势", en: "Fast horizontal whip pan for speed-blur scene transitions" },
      professionalTerms: ["whip pan", "swish pan", "speed transition"],
      promptFragment: { zh: "快速水平甩镜，制造速度感和场景切换的动势过渡", en: "fast horizontal whip pan, creating a speed-blur transition between scenes" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "快速甩镜在视频模型中容易产生画面撕裂和运动模糊伪影。建议控制甩镜速度。", en: "Fast whip pans in video models often produce frame tearing and motion blur artifacts. Control pan speed for best results." }
    },
    {
      id: "camera_movement:crane_up",
      version: "0.1.0",
      label: { zh: "摇臂上升", en: "Crane up" },
      plain: { zh: "摄影机随摇臂平稳上升，过渡到俯瞰视角", en: "Camera rises smoothly on a crane to overhead view" },
      professionalTerms: ["crane up", "jib rise", "vertical boom"],
      promptFragment: { zh: "摄影机随摇臂平稳上升，从低角度过渡到俯瞰视角", en: "camera rises smoothly on a crane, transitioning from low angle to overhead perspective" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:rack_focus",
      version: "0.1.0",
      label: { zh: "移焦/拉焦", en: "Rack focus" },
      plain: { zh: "焦点在前后景之间转移，引导视觉重心", en: "Focus shifts between foreground and background to guide attention" },
      professionalTerms: ["rack focus", "pull focus", "depth shift"],
      promptFragment: { zh: "焦点在前后景之间平滑转移，引导观众注意力的视觉重心", en: "focus shifts smoothly between foreground and background, guiding the viewer's visual attention" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "移焦效果可能在视频模型中不够平滑，焦点转移可能出现跳变。", en: "Rack focus effects may not be smooth in video models; focus transitions may jump." }
    },
    {
      id: "camera_movement:steadicam_float",
      version: "0.1.0",
      label: { zh: "稳定器漂浮感", en: "Steadicam float" },
      plain: { zh: "稳定器跟随主体平滑漂浮，画面流畅有呼吸感", en: "Steadicam follows subject with smooth floating motion" },
      professionalTerms: ["steadicam", "gimbal float", "smooth tracking"],
      promptFragment: { zh: "稳定器跟随主体平滑漂浮移动，画面流畅无抖动，带有呼吸感", en: "steadicam follows the subject with smooth floating motion, fluid and breathing-like without shake" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "camera_movement:tracking_dolly",
      version: "0.1.0",
      label: { zh: "横向轨道跟移", en: "Side tracking dolly" },
      plain: { zh: "摄影机在轨道上平行跟随主体移动", en: "Camera on a dolly tracking parallel to the subject" },
      professionalTerms: ["tracking dolly", "lateral tracking", "parallel follow"],
      promptFragment: { zh: "摄影机在轨道上横向平行移动，跟随主体保持固定构图关系", en: "the camera moves laterally on a dolly track, following the subject while maintaining a fixed composition" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    }
  ]
};

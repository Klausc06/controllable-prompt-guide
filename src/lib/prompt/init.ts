// Barrel file — triggers all module registrations in dependency order.
// Import order matters: option sets must register before work types
// (work type validation checks optionSetId references against registry).

// 1. Option sets — register via options/index.ts module-level loop
import "./options";

// 2. Targets — register via targets/index.ts module-level loop
import "./targets";

// 3. Adapters — register via renderer module-level registerAdapter() calls
import "./renderers/seedance.renderer";
import "./renderers/generic-video.renderer";
import "./renderers/veo3.renderer";

// 4. Work types — register with question validation (checks optionSetId refs)
import "./work-types/video-prompt.worktype";
import "./work-types/image-prompt.worktype";

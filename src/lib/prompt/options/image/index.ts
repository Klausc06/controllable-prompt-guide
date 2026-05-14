import { registerOptionSet } from "../../registry";
import type { OptionSet } from "../../types";
import { imageUseCaseOptions } from "./image-use-case.options";
import { imageSubjectOptions } from "./image-subject.options";
import { imageSceneOptions } from "./image-scene.options";
import { imageCompositionOptions } from "./image-composition.options";
import { imageArtStyleOptions } from "./image-art-style.options";
import { imageColorPaletteOptions } from "./image-color-palette.options";
import { imageLightingOptions } from "./image-lighting.options";
import { imageMoodOptions } from "./image-mood.options";
import { imagePerspectiveOptions } from "./image-perspective.options";
import { imageAspectRatioOptions } from "./image-aspect-ratio.options";
import { imageDetailLevelOptions } from "./image-detail-level.options";
import { imagePostProcessingOptions } from "./image-post-processing.options";
import { imageConstraintsOptions } from "./image-constraints.options";
import { imageTimeSeasonOptions } from "./image-time-season.options";

const imageOptionSets = [
  imageUseCaseOptions,
  imageSubjectOptions,
  imageSceneOptions,
  imageCompositionOptions,
  imageArtStyleOptions,
  imageColorPaletteOptions,
  imageLightingOptions,
  imageMoodOptions,
  imagePerspectiveOptions,
  imageAspectRatioOptions,
  imageDetailLevelOptions,
  imagePostProcessingOptions,
  imageConstraintsOptions,
  imageTimeSeasonOptions,
] satisfies OptionSet[];

for (const set of imageOptionSets) {
  registerOptionSet(set);
}

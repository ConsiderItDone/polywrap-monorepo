/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/index-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/index-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  DeployManifest as DeployManifest_0_1
} from "./0.1";

export {
  DeployManifest_0_1,
};

export enum DeployManifestFormats {
  // NOTE: Patch fix for backwards compatability
  "v0.1.0" = "0.1.0",
  "v0.1" = "0.1",
}

export type AnyDeployManifest =
  | DeployManifest_0_1

export type DeployManifest = DeployManifest_0_1;

export const latestDeployManifestFormat = DeployManifestFormats["v0.1"]

export { migrateDeployManifest } from "./migrate";

export { deserializeDeployManifest } from "./deserialize";

export { validateDeployManifest } from "./validate";

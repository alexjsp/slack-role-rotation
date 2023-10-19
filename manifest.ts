import { Manifest } from "deno-slack-sdk/mod.ts";

import { RoleRotationFunction } from "./functions/role_rotation.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Role Rotation",
  description: "An app that adds a role rotation function for workflows",
  icon: "assets/app_icon.png",
  functions: [RoleRotationFunction],
  workflows: [],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:write.topic",
    "groups:write.topic",
  ],
});

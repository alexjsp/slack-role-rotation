import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const RoleRotationFunction = DefineFunction({
  callback_id: "role_rotation_function",
  source_file: "functions/role_rotation.ts",
  title: "Role Rotation",
  description:
    "Automatically pick a person from a list based on the current date, for rotating a role.",
  input_parameters: {
    properties: {
      users: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
        description: "All the users to be included in the role rotation",
      },
      number_of_weeks: {
        type: Schema.types.integer,
        description:
          "How frequently the role will rotate in weeks (default: 1)",
      },
      role_title: {
        type: Schema.types.string,
        description:
          "This is just for your reference, it doesn't effect the outcome.",
      },
      start_timestamp: {
        type: Schema.types.integer,
        description:
          "A unix timestamp for when the rotation started, blank for default.",
      },
    },
    required: ["users"],
  },
  output_parameters: {
    properties: {
      chosen_user: {
        type: Schema.slack.types.user_id,
        description: "The user chosen by the rotation based on the date.",
      },
    },
    required: ["chosen_user"],
  },
});

export default SlackFunction(
  RoleRotationFunction,
  ({ inputs }) => {
    const users = inputs.users;
    const numberOfUsers = users.length;
    console.log("Users: " + users);
    const numberOfWeeks = inputs.number_of_weeks ?? 1;
    const rotationStartDate = inputs.start_timestamp ?? 1697328300;
    console.log("Start date: " + rotationStartDate);
    const now = Date.now() / 1000;
    const rotationsPassed = Math.floor(
      (now - rotationStartDate) / 60 / 60 / 24 / 7 / numberOfWeeks,
    );
    console.log("Number of rotations passed: " + rotationsPassed);
    // This shit handles start dates in the future.
    const chosenIndex = ((rotationsPassed % numberOfUsers) + numberOfUsers) %
      numberOfUsers;
    const chosenUser = users[chosenIndex];
    console.log("Chosen User " + chosenIndex + ": " + chosenUser);
    return {
      outputs: {
        users,
        chosen_user: chosenUser,
      },
    };
  },
);

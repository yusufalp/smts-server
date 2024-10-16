// export const ROLES = ["admin", "mentor", "coach", "mentee", "alumni", "guest"];

export const ROLES = Object.freeze({
  admin: { key: "admin" },
  mentor: {key: "mentor"},
  coach: { key: "coach" },
  mentee: { key: "mentee" },
  alumni: { key: "alumni" },
  guest: { key: "guest" },
});

// export const ROLES = new Map([
//   ["admin", { key: "admin", desc: "" }],
//   ["mentor", { key: "mentor", desc: "" }],
//   ["coach", { key: "coach", desc: "" }],
//   ["mentee", { key: "mentee", desc: "" }],
//   ["alumni", { key: "alumni", desc: "" }],
//   ["guest", { key: "guest", desc: "" }],
// ]);

// currently not imported in main menu
// will decide later, if its too granuel , i will delete this file

export interface MainMenuItem {
  id: string;
  label: string;
  type: "item" | "divider";
  submenu?: "appearance" | "language" | "help";
  danger?: boolean;
}

export const mainMenuItems: MainMenuItem[] = [
  {
    id: "appearance",
    label: "Appearance",
    type: "item",
    submenu: "appearance",
  },

  {
    id: "language",
    label: "Language",
    type: "item",
    submenu: "language",
  },

  {
    id: "divider-1",
    type: "divider",
    label: "",
  },

  {
    id: "notifications",
    label: "Notifications",
    type: "item",
  },

  {
    id: "account",
    label: "Account",
    type: "item",
  },

  {
    id: "privacy",
    label: "Privacy",
    type: "item",
  },

  {
    id: "divider-2",
    type: "divider",
    label: "",
  },

  {
    id: "help",
    label: "Help",
    type: "item",
    submenu: "help",
  },

  {
    id: "feedback",
    label: "Send Feedback",
    type: "item",
  },

  {
    id: "divider-3",
    type: "divider",
    label: "",
  },

  {
    id: "logout",
    label: "Logout",
    type: "item",
    danger: true,
  },
];

import type { ComponentType } from "react";

import {
  HomeIcon,
  SearchIcon,
  ProjectIcon,
  SavedIcon,
  ProfileIcon,
  CreateIcon,
} from "../assets/icons";

type NavigationItem = {
  id: "home" | "discover" | "create" | "projects" | "saved" | "profile";

  labelKey: "home" | "discover" | "create" | "projects" | "saved" | "profile";

  icon: ComponentType<{
    size: number;
    className?: string;
  }>;

  to: string | null;

  requiresAuth: boolean;

  disabledAction?: string;
  disabledTitle?: string;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "home",
    labelKey: "home",
    icon: HomeIcon,
    to: "/",
    requiresAuth: false,
  },
  {
    id: "discover",
    labelKey: "discover",
    icon: SearchIcon,
    to: "/discover",
    requiresAuth: false,
  },
  {
    id: "create",
    labelKey: "create",
    icon: CreateIcon,
    to: "/create",
    requiresAuth: true,
    disabledAction: "create or publish projects",
    disabledTitle: "Sign in to publish projects",
  },
  {
    id: "projects",
    labelKey: "projects",
    icon: ProjectIcon,
    to: "/projects",
    requiresAuth: true,
    disabledAction: "manage your projects",
    disabledTitle: "Sign in to manage your projects",
  },
  {
    id: "saved",
    labelKey: "saved",
    icon: SavedIcon,
    to: "/saved",
    requiresAuth: true,
    disabledAction: "save projects",
    disabledTitle: "Sign in to save projects",
  },
  {
    id: "profile",
    labelKey: "profile",
    icon: ProfileIcon,
    to: null,
    requiresAuth: true,
  },
];

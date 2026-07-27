import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import CheckIcon from "../components/CheckIcon";
import { useTheme } from "../../../hooks/useTheme";

import "./AppearanceMenu.css";

interface AppearanceMenuProps {
  onBack: () => void;
}

export default function AppearanceMenu({ onBack }: AppearanceMenuProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <MenuHeader title="Appearance" onBack={onBack} />

      <div className="appearance-menu">
        <MenuItem
          label="System"
          onClick={() => setTheme("system")}
          rightSlot={theme === "system" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Light"
          onClick={() => setTheme("light")}
          rightSlot={theme === "light" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Dark"
          onClick={() => setTheme("dark")}
          rightSlot={theme === "dark" ? <CheckIcon /> : undefined}
        />

        <MenuItem label="Kiwi Comfort (coming soon...)" disabled />
      </div>
    </>
  );
}

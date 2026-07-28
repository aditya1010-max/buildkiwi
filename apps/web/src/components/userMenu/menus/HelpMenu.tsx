import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";

interface HelpMenuProps {
  onBack: () => void;
  onDocumentation: () => void;
}

export default function HelpMenu({ onBack, onDocumentation }: HelpMenuProps) {
  return (
    <>
      <MenuHeader title="Help" onBack={onBack} />

      <div className="help-menu">
        <MenuItem label="Documentation" onClick={onDocumentation} />

        <MenuItem label="Keyboard Shortcuts" disabled />

        <MenuItem label="Report a Bug" disabled />

        <MenuItem label="About BuildKiwi" disabled />
      </div>
    </>
  );
}

import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";

interface HelpMenuProps {
  onBack: () => void;
}

export default function HelpMenu({ onBack }: HelpMenuProps) {
  return (
    <>
      <MenuHeader title="Help" onBack={onBack} />

      <div className="help-menu">
        <MenuItem label="Documentation" onClick={() => {}} />

        <MenuItem label="Keyboard Shortcuts" onClick={() => {}} />

        <MenuItem label="Report a Bug" onClick={() => {}} />

        <MenuItem label="About BuildKiwi" onClick={() => {}} />
      </div>
    </>
  );
}

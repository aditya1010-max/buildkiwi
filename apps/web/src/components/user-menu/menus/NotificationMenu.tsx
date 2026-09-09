import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import { useLanguage } from "../../../hooks/useLanguage";

interface NotificationsMenuProps {
  onBack: () => void;
}

export default function NotificationsMenu({ onBack }: NotificationsMenuProps) {
  const { t } = useLanguage();

  return (
    <>
      <MenuHeader title={t("notifications")} onBack={onBack} />

      <MenuItem label={t("pushNotifications")} disabled />

      <MenuItem label={t("emailNotifications")} disabled />

      <MenuItem label={t("projectActivity")} disabled />

      <MenuItem label={t("marketingEmails")} disabled />
    </>
  );
}

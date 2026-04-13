import { PrimaryButton, RajulScreen, TopBar } from '@/components/rajul-ui';

export default function ModalScreen() {
  return (
    <RajulScreen>
      <TopBar title="Prototype modal" />
      <PrimaryButton label="Back to app" href="/(tabs)" />
    </RajulScreen>
  );
}

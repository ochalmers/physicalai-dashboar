import { RequestCustomSceneForm } from "@/components/environments/RequestCustomSceneForm";
import { CenterModal } from "@/components/ui/CenterModal";

type RequestCustomSceneModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RequestCustomSceneModal({ open, onClose }: RequestCustomSceneModalProps) {
  return (
    <CenterModal
      open={open}
      title="Request a Custom Scene"
      onClose={onClose}
      size="lg"
      contentAlign="start"
    >
      <RequestCustomSceneForm onRequestClose={onClose} showCloseAfterSuccess />
    </CenterModal>
  );
}

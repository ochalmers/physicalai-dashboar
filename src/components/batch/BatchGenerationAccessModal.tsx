import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { CenterModal } from "@/components/ui/CenterModal";
import { Button } from "@/components/ui/Button";
import { ACCESS_COPY } from "@/lib/access";

type BatchGenerationAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BatchGenerationAccessModal({ open, onClose }: BatchGenerationAccessModalProps) {
  const navigate = useNavigate();
  const [talkOpen, setTalkOpen] = useState(false);

  return (
    <>
    <CenterModal open={open} title="Batch variations require access" onClose={onClose} size="xl">
      <div className="space-y-[var(--s-400)]">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">{ACCESS_COPY.batchModalIntro}</p>
        <ul className="list-disc space-y-[var(--s-100)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-heading)]">
          <li>Large-scale environment generation</li>
          <li>Structured variation sets</li>
          <li>Training-ready outputs</li>
          <li>Batch export workflows</li>
        </ul>
        <p className="text-[13px] text-[var(--text-default-body)]">
          Your team can enable this for your organization after scoping.
        </p>
        <div className="flex flex-col items-stretch gap-[var(--s-300)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Button
            variant="primary"
            className="w-full sm:w-auto sm:min-w-[200px]"
            type="button"
            onClick={() => {
              onClose();
              navigate("/environments/request-custom");
            }}
          >
            Request access
          </Button>
          <Button
            variant="secondary"
            className="w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] sm:w-auto sm:min-w-[200px]"
            type="button"
            onClick={() => {
              onClose();
              setTalkOpen(true);
            }}
          >
            Talk to Team
          </Button>
        </div>
      </div>
    </CenterModal>
    <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="batch" />
    </>
  );
}

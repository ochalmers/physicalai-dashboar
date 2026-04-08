import { useState } from "react";
import { Callout } from "@/components/system/Callout";
import { Button } from "@/components/ui/Button";

const txInput =
  "w-full rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--surface-primary-default-subtle)]";

const ROBOT_TYPES = [
  { value: "manipulator", label: "Manipulator / arm" },
  { value: "mobile", label: "Mobile base" },
  { value: "humanoid", label: "Humanoid" },
  { value: "dual-arm", label: "Dual-arm" },
  { value: "other", label: "Other / not sure" },
] as const;

const SIM_PLATFORMS = [
  { value: "isaac-sim", label: "Isaac Sim" },
  { value: "isaac-lab", label: "Isaac Lab" },
  { value: "gazebo", label: "Gazebo" },
  { value: "mujoco", label: "MuJoCo" },
  { value: "unity", label: "Unity" },
  { value: "other", label: "Other" },
] as const;

type RequestCustomSceneFormProps = {
  /** Called after successful submit (e.g. close modal) */
  onRequestClose?: () => void;
  /** When true, success state shows a Done button that calls onRequestClose */
  showCloseAfterSuccess?: boolean;
};

export function RequestCustomSceneForm({ onRequestClose, showCloseAfterSuccess }: RequestCustomSceneFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [robotType, setRobotType] = useState("");
  const [simulationPlatform, setSimulationPlatform] = useState("isaac-sim");
  const [timeline, setTimeline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-[var(--s-400)]">
        <Callout variant="success" title="Request received">
          <p className="text-[14px] leading-[22px]">
            Your team will follow up with scoping and access next steps.
          </p>
        </Callout>
        {showCloseAfterSuccess && onRequestClose ? (
          <Button variant="primary" type="button" className="w-full" onClick={onRequestClose}>
            Done
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form className="space-y-[var(--s-300)]" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className={txInput}
          placeholder="Name"
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={txInput}
          placeholder="Email"
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Company
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          className={txInput}
          placeholder="Company"
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Description
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${txInput} min-h-[100px] resize-y`}
          placeholder="Describe the environment you need.."
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Robot type
        <select
          required
          value={robotType}
          onChange={(e) => setRobotType(e.target.value)}
          className={txInput}
        >
          <option value="" disabled>
            Robot type
          </option>
          {ROBOT_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Simulation platform
        <select
          required
          value={simulationPlatform}
          onChange={(e) => setSimulationPlatform(e.target.value)}
          className={txInput}
        >
          {SIM_PLATFORMS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Timeline
        <input
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className={txInput}
          placeholder="Timeline"
        />
      </label>
      <Button variant="primary" type="submit" className="mt-[var(--s-200)] w-full py-[var(--s-300)] text-[15px]">
        Submit Request
      </Button>
    </form>
  );
}

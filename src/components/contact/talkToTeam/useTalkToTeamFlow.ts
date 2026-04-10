import { useCallback, useEffect, useMemo, useState } from "react";
import type { TalkToTeamContext } from "./topics";
import { TOPICS } from "./topics";

export function useTalkToTeamFlow(open: boolean, context: TalkToTeamContext) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(0);
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");
      setMessage("");
      setScheduleNote("");
      return;
    }
    setStep(0);
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setScheduleNote("");
  }, [open, context]);

  const topicLabel = TOPICS.find((t) => t.id === context)?.label ?? "General";

  const displayName = useMemo(() => `${firstName} ${lastName}`.trim(), [firstName, lastName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const reset = useCallback(() => {
    setStep(0);
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setScheduleNote("");
  }, []);

  return {
    step,
    setStep,
    topic: context,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    company,
    setCompany,
    message,
    setMessage,
    scheduleNote,
    setScheduleNote,
    topicLabel,
    displayName,
    handleSubmit,
    reset,
  };
}

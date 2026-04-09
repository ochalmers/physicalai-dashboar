import { useCallback, useEffect, useState } from "react";
import type { TalkToTeamContext } from "./topics";
import { TOPICS } from "./topics";

export function useTalkToTeamFlow(open: boolean, context: TalkToTeamContext) {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<TalkToTeamContext>(context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(0);
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      return;
    }
    setStep(0);
    setTopic(context);
  }, [open, context]);

  const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? "General";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const reset = useCallback(() => {
    setStep(0);
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setTopic(context);
  }, [context]);

  return {
    step,
    setStep,
    topic,
    setTopic,
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    message,
    setMessage,
    topicLabel,
    handleSubmit,
    reset,
  };
}

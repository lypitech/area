import { useState, useEffect } from "react";
import { useArea } from "../context/AreaContext";
import Input from "./Input";
import { Button } from "./Button";

interface DynamicReactionFormProps {
  parameters: {
    name: string;
    type?: string;
    description?: string;
    content?: string;
  }[];
  requiredPayload?: boolean;
  serviceName: string;
  type: string;
  onClose?: () => void;
}

export default function DynamicReactionForm({
  parameters,
  serviceName,
  requiredPayload,
  type,
  onClose,
}: DynamicReactionFormProps) {
  const { setResourceId, setInput, setPayload } = useArea();
  const [values, setValues] = useState<Record<string, string>>({});

  const [payloadValue, setPayloadValue] = useState<string>("");

  useEffect(() => {
    const prefilled: Record<string, string> = {};
    parameters.forEach((param) => {
      if (param.content) prefilled[param.name] = param.content;
    });
    setValues(prefilled);
  }, [parameters]);

  useEffect(() => {
    if (
      parameters.length === 1 &&
      parameters[0].name === "event" &&
      parameters[0].content
    ) {
      if (type === "action") {
        setInput({ event: parameters[0].content });
      } else {
        setResourceId({ event: parameters[0].content });
      }
      onClose?.();
    }
  }, [parameters, setResourceId, onClose]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (type === "action") setInput(values);
    else setResourceId(values);
    if (requiredPayload) setPayload(payloadValue);
    onClose?.();
  };

  const visibleParams = parameters.filter((p) => !p.content);

  if (
    parameters.length === 1 &&
    parameters[0].name === "event" &&
    parameters[0].content
  )
    return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">
        {serviceName} Parameters
      </h2>

      {visibleParams.map((param) => (
        <div key={param.name}>
          <Input
            type={param.type === "number" ? "number" : "text"}
            placeholder={`${param.name} — ${param.description || ""}`}
            value={values[param.name] || ""}
            onChange={(e) => handleChange(param.name, e.target.value)}
          />
        </div>
      ))}

      {requiredPayload && (
        <div>
          <Input
            type="text"
            placeholder="Write your message to send here"
            value={payloadValue}
            onChange={(e) => setPayloadValue(e.target.value)}
          />
        </div>
      )}

      <Button className="bg-black text-white" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

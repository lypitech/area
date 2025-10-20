import { useState } from "react";
import Input from "../Input";
import { useArea } from "../../context/AreaContext";
import { Button } from "../Button";

interface EveryMinutesProps {
  onClose?: () => void;
}

function EveryMinutes({ onClose }: EveryMinutesProps) {
  const [time, setTime] = useState("");
  const { setInput } = useArea();

  const handleSave = () => {
    setInput(time);
    console.log("Saved time:", time);
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center text-2xl font-bold">
        Required informations
      </div>
      <Input
        type="text"
        placeholder="Time interval (in minutes)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Button className="bg-black text-white" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default EveryMinutes;

import { useState } from "react";
import Input from "../Input";
import { Button } from "../Button";
import { useArea } from "../../context/AreaContext";

interface DiscordReactionProps {
  onClose?: () => void;
}

export default function DiscordReaction({ onClose }: DiscordReactionProps) {
  const [channelId, setChannelId] = useState("");
  const [message, setMessage] = useState("");
  const { setRessourceId, setPayload } = useArea();

  const handleSave = () => {
    setRessourceId(channelId);
    setPayload(message);
    console.log("Saved Discord reaction:", { channelId, message });
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">Discord Message</h2>
      <Input
        type="text"
        placeholder="Channel ID (ex: 1234567890123456789)"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Message content (ex: Hello world!)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className="bg-black text-white" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

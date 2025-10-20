import { useState } from "react";
import Input from "../Input";
import { useArea } from "../../context/AreaContext";
import { Button } from "../Button";

interface PushOnRepoProps {
  onClose?: () => void;
}

function PushOnRepo({ onClose }: PushOnRepoProps) {
  const [repo, setRepo] = useState("");
  const [owner, setOwner] = useState("");
  const { setInput } = useArea();

  const handleSave = () => {
    const data = { repo, owner };
    setInput(data);
    console.log("Saved data:", data);
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center text-2xl font-bold">
        Required informations
      </div>
      <Input
        type="text"
        placeholder="Owner name (username or organization)"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Repository name (ex: user/your-repo)"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <Button className="bg-black text-white" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default PushOnRepo;

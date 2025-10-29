import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { createArea } from "../services/areaService";
import { useArea } from "../context/AreaContext";
import { useNavigate } from "react-router-dom";

export default function SaveArea() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    userUuid,
    selectedAction,
    selectedReaction,
    selectedActionService,
    selectedReactionService,
    input,
    ressourceId,
    payload,
  } = useArea();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createArea(
        name,
        description,
        selectedAction,
        selectedReaction,
        selectedActionService,
        selectedReactionService,
        userUuid,
        input,
        ressourceId,
        payload
      );

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/area");
    }
  }, [success]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-accent">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Finalize your AREA
        </h1>
        <p className="text-gray-600 text-center">
          Fill in the details before saving your automation.
        </p>

        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name of your AREA"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
          />

          <textarea
            className="outline-1 outline-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder:opacity-50"
            placeholder="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            required
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-center">AREA saved successfully!</p>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white hover:bg-neutral-700 hover:scale-105 transition duration-300 ease-in-out"
          >
            {isLoading ? "Saving..." : "Save AREA"}
          </Button>
        </div>
      </form>
    </div>
  );
}

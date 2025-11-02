import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useArea } from "../context/AreaContext";
import { isOauthNeeded } from "../utils/isOauthNeeded";
import { getServices } from "../services/serviceService";
import OAuthParser from "../services/OAuth/oauthParser";
import Footer from "../components/Footer";

export default function Apps() {
  const navigate = useNavigate();
  const { services, setServices } = useArea();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="flex flex-col justify-between p-8 pb-0 h-full bg-accent">
      <h1 className="text-3xl font-bold mb-6">Available Apps</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((app) => {
          return (
            <div
              key={app.name}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center p-6"
            >
              <img
                src={`data:image/png;base64,${app.icon}`}
                alt={app.name}
                className="w-16 h-16 object-contain mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold">{app.name}</h3>

              {isOauthNeeded(app.name.toLowerCase()) ? (
                <Button
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                  onClick={() => {
                    OAuthParser(app.name.toLowerCase());
                  }}
                >
                  Connect
                </Button>
              ) : (
                <Button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  onClick={() => navigate(`/apps/${app.name}`, { state: app })}
                >
                  View Details
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

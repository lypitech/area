import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";

const features = [
  {
    title: "Automate your tasks",
    desc: "Create workflows like Zapier/IFTTT.",
    destination: "/create",
  },
  {
    title: "View your Areas",
    desc: "See all the ares you have created.",
    destination: "/area",
  },
  {
    title: "Connect your apps",
    desc: "Slack, Discord, Gmail and more.",
    destination: "/apps",
  },
];

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Hero */}
      <div className="text-white bg-black py-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-6 px-4 text-center">
          <img src={logo} className="rounded-xl shadow w-24 h-24 mx-auto" />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Welcome to AREA
            </h1>
            <p className="mt-4 text-lg md:text-xl opacity-90">
              Build and automate your own workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Functionnalities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              role="button"
              tabIndex={0}
              onClick={() => {
                nav(f.destination);
              }}
              className="p-6 bg-white rounded-2xl shadow-black shadow-md transition-all duration-100 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
              aria-label={f.title}
            >
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

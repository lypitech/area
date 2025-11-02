export default function Footer() {
  return (
    <footer className="w-full bg-accent text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-2">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Area — All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a
            href="/home"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Home
          </a>
          <a
            href="/create"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Create
          </a>
          <a
            href="/area"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Areas
          </a>
          <a
            href="/apps"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Apps
          </a>
          <a
            href="/profile"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Profile
          </a>
        </div>
      </div>
    </footer>
  );
}

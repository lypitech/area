import Loader from "./Loader";

export default function LoadingLogin() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-8">
      <img src="/src/assets/logo.png" className="rounded-xl shadow w-24 h-24" />
      <p className="text-3xl font-bold">Hold tight, we are looking for you !</p>
      <div className="w-fit h-fit">
        <Loader />
      </div>
    </div>
  );
}

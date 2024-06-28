const Loader = () => {
  return (
    <div className=" fixed z-[10010] top-0 left-0 h-screen w-screen">
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;

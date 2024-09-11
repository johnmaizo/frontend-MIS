/* eslint-disable react/prop-types */
const SmallLoader = ({ width, height }) => {
  return (
    <span
      aria-label="Loading..."
      className={`${width && height ? `w-${width} h-${height}` : "h-5 w-5"} animate-spin rounded-full border-4 border-solid border-[#3b82f6] border-t-transparent`}
    ></span>
  );
};

export default SmallLoader;

// eslint-disable-next-line react/prop-types
export const ErrorMessage = ({ children }) => {
    return (
      <span className="mt-2 inline-block text-sm font-medium text-red-600">
        {children}
      </span>
    );
  };
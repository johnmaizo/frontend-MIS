import { useFormContext } from "react-hook-form";
import { Input } from "../../../../../components/ui/input";

const ApplicantComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 text-start">
      <div className="flex gap-10">
        
        
      </div>

      
    </div>
  );
};

export default ApplicantComponent;
/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const ConfirmCloseDialog = ({ isOpen, onConfirmClose, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to close this?</DialogTitle>
          <DialogDescription className="pt-2">
            <span className="inline-block font-bold text-red-700">*</span>
            All changes will be lost.
          </DialogDescription>
          <div className="flex w-full justify-between gap-10 pt-5">
            <input
              type="button"
              onClick={onConfirmClose}
              className="w-full cursor-pointer rounded-md bg-red-600 px-4 py-2 text-white hover:underline hover:underline-offset-2"
              value={"Yes, Close"}
            />

            <button
              onClick={onCancel}
              className="bg-gray-600 w-full rounded-md bg-strokedark px-4 py-2 text-white hover:underline hover:underline-offset-2"
            >
              Cancel
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCloseDialog;

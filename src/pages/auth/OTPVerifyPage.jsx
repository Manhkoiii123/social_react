import FormField from "@components/FormField";
import OTPInput from "@components/FormInputs/OTPInput";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const OTPVerifyPage = () => {
  const { control } = useForm();

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">
        Two-Step Verification
      </p>
      <form className="flex flex-col gap-4">
        <FormField
          name="otp"
          label="Type your 6 digit security code"
          control={control}
          Component={OTPInput}
        />
        <Button variant="contained">Verify my account</Button>
      </form>
      <p className="mt-4">
        Didn&apos;t get the code? <Link to="/login">Resend</Link>
      </p>
    </div>
  );
};
export default OTPVerifyPage;

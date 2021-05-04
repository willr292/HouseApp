import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  NumberInputFieldProps,
} from "@chakra-ui/react";

type PriceFieldProps = NumberInputFieldProps & {
  name: string;
};

export const PriceField: React.FC<PriceFieldProps> = ({ name, ...props }) => {
  const [field, { error }] = useField(name);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>💵</FormLabel>
      <NumberInput max={1000} min={0}>
        <NumberInputField {...field} {...props} id={field.name} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

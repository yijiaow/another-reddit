import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, meta] = useField(props);

  return (
    <FormControl id={field.name} isInvalid={!!meta.error}>
      <FormLabel>{props.label}</FormLabel>
      <Input {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

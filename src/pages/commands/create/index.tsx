import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCommand } from 'apiSdk/commands';
import { Error } from 'components/error';
import { commandValidationSchema } from 'validationSchema/commands';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CommandInterface } from 'interfaces/command';

function CommandCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CommandInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCommand(values);
      resetForm();
      router.push('/commands');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CommandInterface>({
    initialValues: {
      command_text: '',
      result_text: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: commandValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Command
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="command_text" mb="4" isInvalid={!!formik.errors?.command_text}>
            <FormLabel>Command Text</FormLabel>
            <Input type="text" name="command_text" value={formik.values?.command_text} onChange={formik.handleChange} />
            {formik.errors.command_text && <FormErrorMessage>{formik.errors?.command_text}</FormErrorMessage>}
          </FormControl>
          <FormControl id="result_text" mb="4" isInvalid={!!formik.errors?.result_text}>
            <FormLabel>Result Text</FormLabel>
            <Input type="text" name="result_text" value={formik.values?.result_text} onChange={formik.handleChange} />
            {formik.errors.result_text && <FormErrorMessage>{formik.errors?.result_text}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'command',
    operation: AccessOperationEnum.CREATE,
  }),
)(CommandCreatePage);

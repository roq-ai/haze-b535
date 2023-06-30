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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCommandById, updateCommandById } from 'apiSdk/commands';
import { Error } from 'components/error';
import { commandValidationSchema } from 'validationSchema/commands';
import { CommandInterface } from 'interfaces/command';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function CommandEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CommandInterface>(
    () => (id ? `/commands/${id}` : null),
    () => getCommandById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CommandInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCommandById(id, values);
      mutate(updated);
      resetForm();
      router.push('/commands');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CommandInterface>({
    initialValues: data,
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
            Edit Command
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="command_text" mb="4" isInvalid={!!formik.errors?.command_text}>
              <FormLabel>Command Text</FormLabel>
              <Input
                type="text"
                name="command_text"
                value={formik.values?.command_text}
                onChange={formik.handleChange}
              />
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(CommandEditPage);

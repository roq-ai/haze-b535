import * as yup from 'yup';

export const commandValidationSchema = yup.object().shape({
  command_text: yup.string().required(),
  result_text: yup.string().required(),
  user_id: yup.string().nullable(),
});

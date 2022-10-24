import * as Yup from 'yup';

export const schema = Yup.object().shape({
  email: Yup.string().email('Formato de e-mail inválido.').required('Campo Obrigatório.'),
  password: Yup.string().required('Campo Obrigatório.')
});

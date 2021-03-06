import React from 'react';
import { Formik, Form } from 'formik';
import { TextFormField } from '../../elements/TextFormField';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { useAuth } from 'context/auth-context';

const RegisterSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^\S*$/, 'no spaces allowed')
    .required()
    .trim(),
  email: Yup.string().email('invalid email').required('email is required'),
  password: Yup.string().required('password is required').min(5)
});

function RegisterForm({ showRegisterForm }) {
  const { register } = useAuth();
  const initialValues = {
    userName: '',
    email: '',
    password: ''
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        validateOnChange={false}
        onSubmit={(values, { setFieldError }) => {
          register(values).catch((err) =>
            setFieldError('email', err.response.data)
          );
        }}
      >
        <Form>
          <TextFormField label="User Name" srOnlyLabel={true} name="userName" />
          <TextFormField label="Email" srOnlyLabel={true} name="email" />
          <TextFormField
            label="Password"
            srOnlyLabel={true}
            name="password"
            type="password"
          />
          <Button variant="secondary" type="submit" block>
            Register
          </Button>
        </Form>
      </Formik>
      <div className="mt-2">
        <Button
          className=" d-block w-100 bg-white text-secondary text-center font-weight-bold p-1 rounded"
          onClick={() => showRegisterForm(false)}
        >
          Login
        </Button>
      </div>
    </>
  );
}

export default RegisterForm;

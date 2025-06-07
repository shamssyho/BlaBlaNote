import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const FormLogin: React.FC = () => (
  <Form
    name="login-form"
    layout="vertical"
    style={{
      maxWidth: 400,
      margin: '0 auto',
    }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    requiredMark={(label, { required }) => (
      <>
        {label}
        {required && <span style={{ color: '#ff4d4f' }}> *</span>}
      </>
    )}
  >
    <Form.Item<FieldType>
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Veuillez saisir votre email' }]}
    >
      <Input placeholder="Votre adresse email" />
    </Form.Item>

    <Form.Item<FieldType>
      label="Mot de passe"
      name="password"
      rules={[
        { required: true, message: 'Veuillez saisir votre mot de passe' },
      ]}
    >
      <Input.Password placeholder="Votre mot de passe" />
    </Form.Item>

    <Form.Item<FieldType> name="remember" valuePropName="checked">
      <Checkbox>Se souvenir de moi</Checkbox>
    </Form.Item>

    <Form.Item>
      <Button
        type="primary"
        color="default"
        variant="solid"
        htmlType="submit"
        block
      >
        Valider
      </Button>
    </Form.Item>
  </Form>
);

export default FormLogin;

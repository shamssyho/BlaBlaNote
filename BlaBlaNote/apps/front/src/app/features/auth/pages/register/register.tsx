import React from 'react';
import { FormRegister } from '../../components/register/form-register';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

export const Register = () => {
  return (
    <div>
      <Card style={{ width: 500, margin: 'auto' }}>
        <h1 className="text-2xl text-center mb-2 font-bold">Blabla Note</h1>
        <p className="text-center mb-4 text-gray-500">
          Créer un compte et commencez votre expérience
        </p>
        <FormRegister />

        <p className="text-center mb-4">
          Vous avez déjà un compte ?{' '}
          <Link to="/register" className="text-blue-500 underline">
            <span>Connectez-vous</span>
          </Link>
        </p>
      </Card>
    </div>
  );
};

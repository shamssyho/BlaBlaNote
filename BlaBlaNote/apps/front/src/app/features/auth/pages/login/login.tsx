import { Card } from 'antd';
import FormLogin from '../../components/login/form-login';
import { Link } from 'react-router';

const Login: React.FC = () => {
  return (
    <Card style={{ width: 500, margin: 'auto' }}>
      <h1 className="text-2xl text-center mb-2 font-bold">Blabla Note</h1>
      <p className="text-center mb-4 text-gray-500">
        Connectez-vous pour voir vos enregistrements
      </p>
      <FormLogin />
      <p className="text-center mb-4">
        Vous n'avez pas encore de compte ?{' '}
        <Link to="/register" className="text-blue-500 underline">
          <span>Incrivez-vous</span>
        </Link>
      </p>
    </Card>
  );
};

export default Login;

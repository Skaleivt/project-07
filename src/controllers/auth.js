import { userRegisterService,userLoginService } from '../services/auth.js';

export const userRegisterController = async (req, res) => {
  const user = await userRegisterService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
export const userLoginController = async (req, res) => {
  const loginData = await userLoginService(req.body);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: loginData,
  });
};
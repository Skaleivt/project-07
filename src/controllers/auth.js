import { userRegisterService } from '../services/auth.js';

export const userRegisterController = async (req, res) => {
  const user = await userRegisterService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

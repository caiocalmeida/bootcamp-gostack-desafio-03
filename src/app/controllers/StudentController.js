import * as Yup from 'yup';

import Student from '../models/Student';
import constants from '../../config/constants';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .min(0),
      weight: Yup.number()
        .required()
        .min(0),
      height: Yup.number()
        .required()
        .min(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }
}

export default new StudentController();

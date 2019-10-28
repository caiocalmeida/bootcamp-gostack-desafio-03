import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import constants from '../../config/constants';

class HelpOrderController {
  async store(req, res) {
    const { studentId } = req.params;

    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'A student could not be found with the provided id.',
      });
    }

    const order = await HelpOrder.create({ student_id: studentId, question });

    return res.json(order);
  }

  async index(req, res) {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'A student could not be found with the provided id.',
      });
    }

    const orders = await HelpOrder.findAll({
      where: { student_id: studentId },
    });

    return res.json(orders);
  }
}

export default new HelpOrderController();

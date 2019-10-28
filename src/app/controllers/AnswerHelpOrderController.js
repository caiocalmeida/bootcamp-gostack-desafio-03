import { parseISO } from 'date-fns';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrderMail from '../jobs/HelpOrderMail';
import constants from '../../config/constants';

class AnswerHelpOrderController {
  async store(req, res) {
    const { helpOrderId } = req.params;

    const { answer } = req.body;

    if (!answer) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const helpOrder = await HelpOrder.findByPk(helpOrderId, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(404).json({
        error: 'A help order could not be found with the provided id.',
      });
    }

    const helpOrderUpdate = {
      answer,
      answered_at: parseISO(new Date().toISOString()),
    };

    await HelpOrder.update(helpOrderUpdate, { where: { id: helpOrderId } });

    const mailData = {
      studentName: helpOrder.student.name,
      studentEmail: helpOrder.student.email,
      question: helpOrder.question,
      answer: helpOrder.answer,
    };

    await Queue.add(HelpOrderMail.key, {
      mailData,
    });

    return res.json({ ok: true });
  }
}

export default new AnswerHelpOrderController();

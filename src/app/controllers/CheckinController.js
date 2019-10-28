import { addDays, parseISO } from 'date-fns';

import Checkin from '../schemas/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'A student could not be found with the provided id.',
      });
    }

    const recentCheckins = await Checkin.find({
      student: studentId,
      createdAt: {
        $gte: addDays(parseISO(new Date().toISOString()), -7),
      },
    });

    if (recentCheckins.length > 4) {
      return res.status(403).json({
        error:
          "You have reached the maximum number of checkins you're allowed to have in a 7 day period.",
      });
    }

    await Checkin.create({
      student: studentId,
    });

    return res.json({ ok: true });
  }

  async index(req, res) {
    const { studentId } = req.params;

    const checkins = await Checkin.find({
      student: studentId,
    });

    return res.json(checkins);
  }
}

export default new CheckinController();

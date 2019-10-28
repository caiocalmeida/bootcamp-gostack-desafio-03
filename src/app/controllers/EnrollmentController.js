import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';
import Enrollment from '../models/Enrollment';
import ServicePlan from '../models/ServicePlan';
import Student from '../models/Student';
import constants from '../../config/constants';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      studentId: Yup.number()
        .integer()
        .required(),
      servicePlanId: Yup.number()
        .integer()
        .required(),
      startDate: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const { startDate, servicePlanId, studentId } = req.body;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        error: 'A student could not be found with the provided id.',
      });
    }

    const servicePlan = await ServicePlan.findByPk(servicePlanId);

    if (!servicePlan) {
      return res.status(404).json({
        error: 'A service plan could not be found with the provided id.',
      });
    }

    const enrollmentData = {
      student_id: studentId,
      plan_id: servicePlanId,
      start_date: parseISO(startDate),
      end_date: addMonths(parseISO(startDate), servicePlan.duration),
      price: servicePlan.getFullPrice(),
    };

    const enrollment = await Enrollment.create(enrollmentData);

    const mailData = {
      studentName: student.name,
      studentEmail: student.email,
      servicePlan: servicePlan.title,
      endDate: enrollment.end_date,
      price: enrollment.price,
    };

    await Queue.add(EnrollmentMail.key, {
      mailData,
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      servicePlanId: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        error: 'An enrollment could not be found with the provided id.',
      });
    }

    const student = await Student.findByPk(enrollment.student_id);

    if (!student) {
      return res.status(404).json({
        error: 'A student could not be found with the provided id.',
      });
    }

    const { servicePlanId } = req.body;

    const servicePlan = await ServicePlan.findByPk(servicePlanId);

    if (!servicePlan) {
      return res.status(404).json({
        error: 'A service plan could not be found with the provided id.',
      });
    }

    const enrollmentData = {
      student_id: student.id,
      plan_id: servicePlan.id,
      start_date: parseISO(new Date().toISOString()),
      end_date: addMonths(enrollment.start_date, servicePlan.duration),
      price: servicePlan.getFullPrice(),
    };

    await Enrollment.update(enrollmentData, {
      where: { id: req.params.id },
    });

    return res.json({ ok: true });
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({
        error: 'An enrollment could not be found with the provided id.',
      });
    }

    await Enrollment.destroy({ where: { id } });

    return res.json({ ok: true });
  }
}

export default new EnrollmentController();

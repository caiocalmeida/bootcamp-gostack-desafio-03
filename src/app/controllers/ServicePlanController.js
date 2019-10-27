import * as Yup from 'yup';

import ServicePlan from '../models/ServicePlan';
import constants from '../../config/constants';

class ServicePlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const { id, title, duration, price } = await ServicePlan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async index(req, res) {
    const servicePlans = await ServicePlan.findAll({ order: ['price'] });

    return res.json(servicePlans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: constants.schemaValidationFailureResponse });
    }

    const { id } = req.params;

    const servicePlan = ServicePlan.findByPk(id);

    if (!servicePlan) {
      return res.status(404).json({
        error: 'A service plan could not be found with the provided id.',
      });
    }

    await ServicePlan.update(req.body, { where: { id } });

    return res.json({ ok: true });
  }

  async delete(req, res) {
    const { id } = req.params;

    const servicePlan = ServicePlan.findByPk(id);

    if (!servicePlan) {
      return res.status(404).json({
        error: 'A service plan could not be found with the provided id.',
      });
    }

    await ServicePlan.destroy({ where: { id } });

    return res.json({ ok: true });
  }
}

export default new ServicePlanController();

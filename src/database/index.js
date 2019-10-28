import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import ServicePlan from '../app/models/ServicePlan';
import Enrollment from '../app/models/Enrollment';

import databaseConfig from '../config/database';

const models = [User, Student, ServicePlan, Enrollment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

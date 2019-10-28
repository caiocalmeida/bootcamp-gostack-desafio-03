import Sequelize, { Model } from 'sequelize';

class ServicePlan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  getFullPrice() {
    return this.duration * this.price;
  }
}

export default ServicePlan;

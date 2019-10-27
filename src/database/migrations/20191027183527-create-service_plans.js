module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('service_plans', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      price: Sequelize.DECIMAL,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('service_plans');
  },
};

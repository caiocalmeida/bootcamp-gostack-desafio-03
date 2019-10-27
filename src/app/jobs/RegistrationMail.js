import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;

    await Mail.sendMail({
      to: `${registration.student.name} <${registration.student.email}>`,
      subject: 'Welcome to Gympoint!',
      template: 'registration',
      context: {
        studentName: registration.student.name,
        servicePlan: registration.plan.title,
        endDate: registration.endDate,
        price: registration.price,
      },
    });
  }
}

export default new RegistrationMail();

import Mail from '../../lib/Mail';

class SupportMail {
  get key() {
    return 'SupportMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Gympoint answered your question!',
      template: 'support',
      context: {
        studentName: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new SupportMail();

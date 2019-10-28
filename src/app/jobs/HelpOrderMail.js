import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { mailData } = data;

    await Mail.sendMail({
      to: `${mailData.studentName} <${mailData.studentEmail}>`,
      subject: 'Gympoint answered your question!',
      template: 'helpOrder',
      context: {
        studentName: mailData.studentName,
        question: mailData.question,
        answer: mailData.answer,
      },
    });
  }
}

export default new HelpOrderMail();

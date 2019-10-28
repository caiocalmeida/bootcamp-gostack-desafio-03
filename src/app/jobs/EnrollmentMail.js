import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { mailData } = data;

    await Mail.sendMail({
      to: `${mailData.studentName} <${mailData.studentEmail}>`,
      subject: 'Welcome to Gympoint!',
      template: 'enrollment',
      context: {
        studentName: mailData.studentName,
        servicePlan: mailData.servicePlan,
        endDate: format(parseISO(mailData.endDate), "Do' of 'MMMM', 'yyyy", {
          locale: enUS,
        }),
        price: mailData.price,
      },
    });
  }
}

export default new EnrollmentMail();

import { FormattedMessage } from 'react-intl';
import { Sms } from 'iconsax-react';
const icons = {
  emailIcon: Sms
};

const emailPage = {
  id: 'email',
  title: <FormattedMessage id="Email" />,
  type: 'group',
  url: '/email',
  icon: icons.emailIcon
};

export default emailPage;

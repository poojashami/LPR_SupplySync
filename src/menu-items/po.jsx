import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
const icons = {
  po: DocumentText
};

const po = {
  id: 'Purchase Order',
  title: <FormattedMessage id="Purchase Order" />,
  type: 'group',
  url: '/purchase-order',
  icon: icons.po
};

export default po;

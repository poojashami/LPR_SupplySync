import { FormattedMessage } from 'react-intl';
import LocalMallIcon from '@mui/icons-material/LocalMall';
const icons = {
    LocalMallIcon: LocalMallIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const CommercialInvoice = {
    id: 'group-pages',
    type: 'group',
    children: [
        {
            id: 'rfq',
            title: <FormattedMessage id="Commercial Invoice (CI)" />,
            type: 'collapse',
            icon: icons.LocalMallIcon,
            children: [
                {
                    id: 'createCommercialInvoice',
                    title: <FormattedMessage id="Create CI" />,
                    type: 'item',
                    url: '/po/generate/commercialInvoice',
                    target: false
                },
                {
                    id: 'approvalCommercialInvoice',
                    title: <FormattedMessage id="Approve CI #" />,
                    type: 'item',
                    url: '/po/approval/commercialInvoice',
                    target: false
                },
                {
                    id: 'viewCommercialInvoice',
                    title: <FormattedMessage id="View CI" />,
                    type: 'item',
                    url: '/po/generate/commercialInvoic',
                    target: false
                },
                {
                    id: 'shipping',
                    title: <FormattedMessage id="Shipping Entry #" />,
                    type: 'item',
                    url: '/postshipmemt/shipping',
                    target: false
                },
            ]
        }
    ]
};

export default CommercialInvoice;

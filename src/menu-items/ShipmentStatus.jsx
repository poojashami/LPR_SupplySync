import { FormattedMessage } from 'react-intl';
import LocalMallIcon from '@mui/icons-material/LocalMall';
const icons = {
    LocalMallIcon: LocalMallIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const ShipmentStatus = {
    id: 'group-pages',
    type: 'group',
    children: [
        {
            id: 'rfq',
            title: <FormattedMessage id="Shipment Status" />,
            type: 'collapse',
            icon: icons.LocalMallIcon,
            children: [
                {
                    id: 'shipping_instruction',
                    title: <FormattedMessage id="Shipping Instruction" />,
                    type: 'item',
                    url: '/po/shipping/instructions',
                    target: false
                },
                {
                    id: 'shipping_readiness',
                    title: <FormattedMessage id="Shipment Readiness #" />,
                    type: 'item',
                    url: '/po/shipment/readiness',
                    target: false
                },
                {
                    id: 'shipping_advise',
                    title: <FormattedMessage id="Shipment Advise" />,
                    type: 'item',
                    url: '/po/shipment/advice',
                    target: false
                },
            ]
        }
    ]
};

export default ShipmentStatus;

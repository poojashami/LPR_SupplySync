import { FormattedMessage } from 'react-intl';
import LocalMallIcon from '@mui/icons-material/LocalMall';
const icons = {
    LocalMallIcon: LocalMallIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const Treasury = {
    id: 'group-pages',
    type: 'group',
    children: [
        {
            id: 'rfq',
            title: <FormattedMessage id="Treasury" />,
            type: 'collapse',
            icon: icons.LocalMallIcon,
            children: [
                {
                    id: 'treasury',
                    title: <FormattedMessage id="Treasury BH #" />,
                    type: 'item',
                    url: '/po/treasury',
                    target: false
                },
                {
                    id: 'treasury',
                    title: <FormattedMessage id="Treasury PH #" />,
                    type: 'item',
                    url: '/po/treasury',
                    target: false
                },
                {
                    id: 'treasury',
                    title: <FormattedMessage id="Duty Payment #" />,
                    type: 'item',
                    url: '/postshipmemt/paa',
                    target: false
                },
                {
                    id: 'treasury',
                    title: <FormattedMessage id="Operational Payment #" />,
                    type: 'item',
                    url: '/postshipmemt/paa',
                    target: false
                },
            ]
        }
    ]
};

export default Treasury;

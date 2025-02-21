import samplePage from './sample-page';
import LPR from './lpr';
import rfq_page from './rfq';
import Quote_Menu from './quote';
import PO_Menu from './poMenu';
import Treasury from './Treasury';
import ServicesPO from './servicesPO';
import GRN_Menu from './grn';

const MenuItems = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const user_role = userInfo.role || 'default';

  const menuItems = {
    admin: [samplePage, LPR, rfq_page, Quote_Menu, PO_Menu, Treasury, GRN_Menu, ServicesPO]
  };

  return { items: menuItems[user_role] || menuItems.default };
};

export default MenuItems;

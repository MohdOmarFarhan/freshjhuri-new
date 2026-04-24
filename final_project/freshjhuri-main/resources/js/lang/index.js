
import bnCartpage from '../lang/bn/cartpage.json';
import bnCheckout from '../lang/bn/checkout.json';
import bnCollection from '../lang/bn/collection.json';
import bnContact from '../lang/bn/contact.json';
import bnHomepage from '../lang/bn/homepage.json';
import bnNavBar from '../lang/bn/navbar.json';
import bnProductDetails from '../lang/bn/productdetails.json';
import enCartpage from '../lang/en/cartpage.json';
import enCheckout from '../lang/en/checkout.json';
import enCollection from '../lang/en/collection.json';
import enContact from '../lang/en/contact.json';
import enHomepage from '../lang/en/homepage.json';
import enNavBar from '../lang/en/navbar.json';
import enProductDetails from '../lang/en/productdetails.json';

export default {
  bn: { ...bnNavBar, ...bnHomepage, ...bnProductDetails, ...bnCartpage, ...bnCheckout, ...bnContact, ...bnCollection },
  en: { ...enNavBar, ...enHomepage, ...enProductDetails, ...enCartpage, ...enCheckout, ...enContact, ...enCollection },
};
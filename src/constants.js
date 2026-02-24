export const STORAGE_KEY = 'single_user_inventory_v1';

export const CATEGORIES = [
  'Short-Sleeve Tees',
  'Short-Sleeve Shirts',
  'Long-Sleeve Tees',
  'Sun Shirts & Sun Hoodies',
  'Thermal Baselayers',
  'Long-Sleeve Shirts & Wovens',
  'Fleece & Knits',
  'Insulation',
  'Rain/Shells/Jackets',
  'Pants',
  'Shorts',
  'Accessories',
];

export const CONDITIONS = ['New with tags', 'New without tags', 'Excellent', 'Good', 'Fair'];
export const SOURCES = [
  'eBay',
  'Goodwill',
  'Patagonia Outlet',
  'Patagonia Worn Wear',
  'Patagonia',
  'Patagonia Store',
  'Backcountry',
  'Facebook - in person',
  'Gift',
  'REI',
  'Other',
];
export const SEASONS = ['Spring', 'Fall'];
export const SIZE_OPTIONS = ['Medium', 'Large', 'Other'];

export const SORT_OPTIONS = [
  'Newest',
  'Alphabetical',
  'Price: Low to High',
  'Price: High to Low',
];

export const EMPTY_ITEM = {
  id: '',
  sku: '',
  image: '',
  imageUrl: '',
  name: '',
  category: '',
  color: '',
  styleNumber: '',
  season: 'Spring',
  year: '',
  size: 'Medium',
  sizeOther: '',
  listPrice: '',
  shippingPrice: '',
  discount: '',
  pricePaid: '',
  condition: '',
  source: '',
  notes: '',
  createdAt: '',
};

export const STORAGE_KEY = 'single_user_inventory_v1';

export const CATEGORIES = [
  'Jackets',
  'Fleece',
  'Baselayers',
  'Shirts',
  'Pants',
  'Shorts',
  'Accessories',
  'Footwear',
  'Other',
];

export const CONDITIONS = ['New with tags', 'New without tags', 'Excellent', 'Good', 'Fair'];
export const SOURCES = ['Retail', 'Outlet', 'Resale', 'Gift', 'Other'];
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

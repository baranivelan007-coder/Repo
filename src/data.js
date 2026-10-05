export const HOME = { latitude: 13.085, longitude: 80.2101 };
export const FEES = { delivery: 30, discount: 20, tax: 22 };
const m = (id, name, desc, price, img) => ({ id, name, desc, price, img });
export const RESTAURANTS = [
  { id: 'pizza', name: 'Pizza Corner', cuisine: 'Italian • Pizza', rating: 4.7, reviews: '1200+', km: 1.2, min: 20, cost: 400, off: '10% OFF', color: '#F97316', icon: 'pie-chart', loc: { latitude: 13.089, longitude: 80.206 }, img: require('../assets/img/pizza1.jpg'),
    menu: [m('p1', 'Margherita Pizza', 'Classic delight with 100% real mozzarella cheese.', 199, require('../assets/img/pizza1.jpg')), m('p2', 'Farmhouse Pizza', 'Loaded with fresh veggies, jalapenos & olives.', 249, require('../assets/img/pizza2.jpg')), m('p3', 'Paneer Pizza', 'Paneer with onion, capsicum & cheese.', 229, require('../assets/img/pizza1.jpg'))] },
  { id: 'burger', name: 'Burger House', cuisine: 'Burgers • Fast Food', rating: 4.5, reviews: '950+', km: 1.8, min: 25, cost: 300, off: '15% OFF', color: '#DC2626', icon: 'disc', loc: { latitude: 13.082, longitude: 80.215 }, img: require('../assets/img/burger1.jpg'),
    menu: [m('b1', 'Classic Cheeseburger', 'Juicy grilled patty with cheddar cheese, lettuce & house sauce.', 199, require('../assets/img/burger1.jpg')), m('b2', 'Spicy Double Patty', 'Two grilled patties with spicy mayo, jalapenos & cheese.', 249, require('../assets/img/burger2.jpg')), m('b3', 'Crispy Chicken Burger', 'Spicy fried chicken with lettuce & garlic mayo.', 179, require('../assets/img/burger2.jpg'))] },
  { id: 'brew', name: 'Morning Brew', cuisine: 'Cafe • Beverages', rating: 4.6, reviews: '780+', km: 0.8, min: 15, cost: 250, off: '12% OFF', color: '#7C3AED', icon: 'coffee', loc: { latitude: 13.087, longitude: 80.217 }, img: require('../assets/img/brew1.jpg'),
    menu: [m('c1', 'Cappuccino', 'Rich espresso with steamed milk and creamy foam.', 129, require('../assets/img/brew1.jpg')), m('c2', 'Cold Coffee', 'Chilled coffee blended with milk and ice.', 149, require('../assets/img/brew2.jpg')), m('c3', 'Chocolate Frappe', 'Creamy chocolate coffee topped with whipped cream.', 199, require('../assets/img/brew2.jpg'))] },
];
export const byId = id => RESTAURANTS.find(r => r.id === id);

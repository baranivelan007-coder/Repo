import { MenuItem } from '../types';

export const MENU: MenuItem[] = [
  // Pizza Corner
  { id: 'margherita', restaurantId: 'pizza-corner', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 199, image: require('../../assets/images/margherita.jpg'), category: 'Pizza', available: true },
  { id: 'farmhouse', restaurantId: 'pizza-corner', name: 'Farmhouse Pizza', description: 'Loaded with fresh veggies, jalapenos & olives.', price: 249, image: require('../../assets/images/farmhouse.jpg'), category: 'Pizza', available: true },
  { id: 'paneer-pizza', restaurantId: 'pizza-corner', name: 'Paneer Pizza', description: 'Spicy paneer with onion, capsicum & cheese.', price: 229, image: require('../../assets/images/paneer.jpg'), category: 'Pizza', available: true },
  // Burger House
  { id: 'classic-cheeseburger', restaurantId: 'burger-house', name: 'Classic Cheeseburger', description: 'Juicy grilled party with cheddar cheese, lettuce & house sauce.', price: 199, image: require('../../assets/images/classic_burger.jpg'), category: 'Burgers', available: true },
  { id: 'spicy-double-patty', restaurantId: 'burger-house', name: 'Spicy Double Patty', description: 'Two grilled patties with spicy mayo, jalapenos & cheese.', price: 249, image: require('../../assets/images/spicy_double.jpg'), category: 'Burgers', available: true },
  { id: 'crispy-chicken', restaurantId: 'burger-house', name: 'Crispy Chicken Burger', description: 'Crispy fried chicken with lettuce & garlic mayo.', price: 179, image: require('../../assets/images/crispy_chicken.jpg'), category: 'Burgers', available: true },
  // Morning Brew
  { id: 'cappuccino', restaurantId: 'morning-brew', name: 'Cappuccino', description: 'Rich espresso with steamed milk and creamy foam.', price: 129, image: require('../../assets/images/cappuccino.jpg'), category: 'Coffee', available: true },
  { id: 'cold-coffee', restaurantId: 'morning-brew', name: 'Cold Coffee', description: 'Chilled coffee blended with milk and ice.', price: 149, image: require('../../assets/images/cold_coffee.jpg'), category: 'Coffee', available: true },
  { id: 'chocolate-frappe', restaurantId: 'morning-brew', name: 'Chocolate Frappe', description: 'Creamy chocolate shake topped with whipped cream.', price: 199, image: require('../../assets/images/choc_frappe.jpg'), category: 'Coffee', available: true },
];

export const getMenuItem = (id: string) => MENU.find((m) => m.id === id);
export const getMenuFor = (restaurantId: string) => MENU.filter((m) => m.restaurantId === restaurantId);

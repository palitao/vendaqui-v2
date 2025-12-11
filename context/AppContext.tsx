import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, Order, Notification, Product, UserRole, NotificationType, Ticket, Review } from '../types';

// --- MOCK INITIAL DATA ---
const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    title: 'MacBook Pro M2 14" Space Grey', 
    price: 125000, 
    category: 'Electrónica', 
    rating: 4.8, 
    reviews: 120, 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000', 
    seller: 'TechMoz', 
    description: 'Potência incrível. Processador M2, 16GB RAM, 512GB SSD. Ideal para profissionais criativos.', 
    stock: 5,
    isPromoted: true,
    reviewsList: [] 
  },
  { 
    id: '2', 
    title: 'Nike Air Max 270 React', 
    price: 8500, 
    category: 'Moda', 
    rating: 4.5, 
    reviews: 45, 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000', 
    seller: 'Maputo Sports', 
    description: 'Conforto total. Estilo e performance para o dia a dia. Tecnologia de amortecimento de ar.', 
    stock: 12,
    reviewsList: [] 
  },
  { 
    id: '3', 
    title: 'Sofá de Canto Moderno Nórdico', 
    price: 25000, 
    category: 'Casa & Cozinha', 
    rating: 4.2, 
    reviews: 18, 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000', 
    seller: 'Lar Doce Lar', 
    description: 'Design elegante para a sua sala de estar. Tecido impermeável e fácil de limpar.', 
    stock: 2,
    reviewsList: [] 
  },
  { 
    id: '4', 
    title: 'Samsung Galaxy S23 Ultra 5G', 
    price: 75000, 
    category: 'Electrónica', 
    rating: 4.9, 
    reviews: 89, 
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000', 
    seller: 'TechMoz', 
    description: 'Câmera incrível e performance de topo. Nightography e processador Snapdragon 8 Gen 2.', 
    stock: 8,
    reviewsList: [] 
  },
  { 
    id: '5', 
    title: 'Kit Ferramentas Profissional', 
    price: 4500, 
    category: 'Serviços', 
    rating: 4.0, 
    reviews: 10, 
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1000', 
    seller: 'Constrói Já', 
    description: 'Tudo o que precisa para reparações domésticas. Mala resistente incluída.', 
    stock: 20,
    reviewsList: [] 
  },
  { 
    id: '6', 
    title: 'Smart Watch Series 8 Midnight', 
    price: 18000, 
    category: 'Electrónica', 
    rating: 4.6, 
    reviews: 32, 
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000', 
    seller: 'TechMoz', 
    description: 'O companheiro perfeito para a sua saúde e produtividade.', 
    stock: 15,
    reviewsList: [] 
  },
  { 
    id: '7', 
    title: 'Cadeira de Escritório Ergonômica', 
    price: 9500, 
    category: 'Casa & Cozinha', 
    rating: 4.3, 
    reviews: 22, 
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=1000', 
    seller: 'Lar Doce Lar', 
    description: 'Ergonomia para o seu dia de trabalho. Ajustável e confortável.', 
    stock: 7,
    reviewsList: [] 
  },
  { 
    id: '8', 
    title: 'Camisa Social Slim Fit Azul', 
    price: 2500, 
    category: 'Moda', 
    rating: 4.7, 
    reviews: 15, 
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', 
    seller: 'Maputo Sports', 
    description: 'Elegância para todas as ocasiões. Algodão premium.', 
    stock: 25,
    reviewsList: [] 
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Bem-vindo ao VendeAqui!', message: 'Complete o seu perfil para ganhar 50 pontos de fidelidade.', type: 'SYSTEM', read: false, time: 'Agora' },
];

const INITIAL_ORDERS: Order[] = [
    { id: '#ORD-2024-001', date: '12 Out 2024', total: 133500, status: 'Entregue', paymentMethod: 'M-Pesa', items: [] },
];

const INITIAL_TICKETS: Ticket[] = [
    { id: 'TCK-992', subject: 'Problema com entrega', status: 'Resolvido', date: '10 Out 2024', messages: [] }
];

interface AppContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  
  products: Product[];
  addProduct: (product: Product) => void;
  addReview: (productId: string, review: Review) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  orders: Order[];
  addOrder: (order: Order) => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  tickets: Ticket[];
  createTicket: (subject: string, message: string) => void;

  notifications: Notification[];
  addNotification: (title: string, message: string, type: NotificationType) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vendeaqui_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vendeaqui_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vendeaqui_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vendeaqui_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const wishlist = user?.wishlist || [];

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (user) localStorage.setItem('vendeaqui_user', JSON.stringify(user));
    else localStorage.removeItem('vendeaqui_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vendeaqui_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vendeaqui_cart', JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  const login = (role: UserRole) => {
    let newUser: User;
    
    if (role === UserRole.ADMIN) {
        newUser = {
            id: 'admin-01',
            name: 'Administrador',
            email: 'admin@vendeaqui.co.mz',
            role: role,
            avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=0D8ABC&color=fff',
            walletBalance: 0,
            loyaltyPoints: 0,
            wishlist: []
        };
    } else if (role === UserRole.SELLER) {
        newUser = {
            id: 'seller-01',
            name: 'TechMoz Solutions',
            email: 'vendas@techmoz.co.mz',
            role: role,
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
            walletBalance: 150000,
            loyaltyPoints: 0,
            wishlist: []
        };
    } else {
        newUser = {
            id: '123',
            name: 'João Silva',
            email: 'joao@exemplo.com',
            role: role,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            walletBalance: 1250,
            loyaltyPoints: 350,
            wishlist: []
        };
    }
    
    setUser(newUser);
    addNotification('Login Efetuado', `Bem-vindo de volta, ${newUser.name}!`, 'SYSTEM');
  };

  const logout = () => {
    setUser(null);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    addNotification('Produto Adicionado', `O produto "${product.title}" está agora à venda.`, 'SYSTEM');
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
        if(p.id === productId) {
            const newReviews = [...(p.reviewsList || []), review];
            // Recalculate rating mockup
            const newRating = (p.rating * p.reviews + review.rating) / (p.reviews + 1);
            return {
                ...p,
                reviewsList: newReviews,
                reviews: p.reviews + 1,
                rating: Number(newRating.toFixed(1))
            };
        }
        return p;
    }));
    addNotification('Avaliação Enviada', 'Obrigado pelo seu feedback!', 'SYSTEM');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addNotification('Produto Adicionado', `${product.title} foi adicionado ao carrinho.`, 'ORDER');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    if (user && user.role === UserRole.CUSTOMER) {
        const cashbackEarned = Math.floor(order.total * 0.01); // 1% cashback
        const pointsEarned = Math.floor(order.total / 100); // 1 point per 100 MT
        setUser({
            ...user,
            walletBalance: user.walletBalance + cashbackEarned,
            loyaltyPoints: user.loyaltyPoints + pointsEarned
        });
        addNotification('Cashback Recebido!', `Ganhou ${cashbackEarned} MT e ${pointsEarned} pontos nesta compra.`, 'PROMO');
    }
  };

  const toggleWishlist = (productId: string) => {
      if (!user) return;
      const exists = user.wishlist.includes(productId);
      const newWishlist = exists 
        ? user.wishlist.filter(id => id !== productId)
        : [...user.wishlist, productId];
      
      setUser({ ...user, wishlist: newWishlist });
      if (!exists) addNotification('Favoritos', 'Produto adicionado à sua lista de desejos.', 'SYSTEM');
  };

  const createTicket = (subject: string, message: string) => {
      const newTicket: Ticket = {
          id: `TCK-${Math.floor(Math.random() * 10000)}`,
          subject,
          status: 'Aberto',
          date: 'Hoje',
          messages: [{ sender: 'User', text: message }]
      };
      setTickets(prev => [newTicket, ...prev]);
      addNotification('Suporte', 'O seu ticket foi criado. Responderemos em breve.', 'SYSTEM');
  };

  const addNotification = (title: string, message: string, type: NotificationType) => {
    const newNote: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      time: 'Agora'
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user, login, logout,
      products, addProduct, addReview,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, addOrder,
      wishlist, toggleWishlist,
      tickets, createTicket,
      notifications, addNotification, markAllNotificationsAsRead, unreadCount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
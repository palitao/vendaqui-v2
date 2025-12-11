import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  UserRole, PageView, Product, CartItem, User, Notification, NotificationType, Order, Ticket, Transaction, Review
} from './types';
import { Button, ProductCard, Input, Badge, Modal } from './components/UI';
import { GeminiEditor } from './components/GeminiEditor';
import { ChatAssistant } from './components/ChatAssistant';
import { useApp } from './context/AppContext';
import { 
  Search, ShoppingCart, User as UserIcon, Menu, X, 
  LayoutDashboard, LogOut, Tag, Truck, 
  BarChart3, Plus, Settings, MessageSquare, Star, 
  Home, Image as ImageIcon, CheckCircle, Smartphone,
  Bell, Info, Check, Minus, Share2, Moon, Sun, Trash2,
  ChevronRight, ArrowRight, CreditCard, MapPin, Users, FileText, Shield, ShoppingBag, List, Heart, DollarSign, Edit, AlertTriangle, Filter, Wand2, ChevronLeft, Zap, Sparkles,
  Fingerprint, Wallet, Ticket as TicketIcon, TrendingUp, Gift, ShieldAlert, BadgePercent, Package, Upload, Activity, AlertOctagon, CheckSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const CATEGORIES = [
  { name: 'Electrónica', icon: Smartphone },
  { name: 'Moda', icon: Tag },
  { name: 'Casa & Cozinha', icon: Home },
  { name: 'Serviços', icon: Zap },
  { name: 'Supermercado', icon: ShoppingCart },
];

const MOCK_ADMIN_TRANSACTIONS: Transaction[] = [
    { id: 'TX-9981', user: 'João Silva', amount: 12500, date: 'Hoje, 10:30', riskScore: 12, status: 'Approved' },
    { id: 'TX-9982', user: 'Maria Langa', amount: 85000, date: 'Hoje, 11:15', riskScore: 85, status: 'Flagged' },
    { id: 'TX-9983', user: 'Pedro Muianga', amount: 2500, date: 'Ontem', riskScore: 5, status: 'Approved' },
    { id: 'TX-9984', user: 'Carlos Macamo', amount: 450000, date: 'Ontem', riskScore: 92, status: 'Rejected' },
];

// --- COMPONENTS MOVED OUTSIDE OF APP ---

const Header = ({ 
  view, setView, searchQuery, setSearchQuery, searchSuggestions, handleSearchSubmit, navigateToProduct, isDarkMode, toggleDarkMode, showNotifications, setShowNotifications, mobileMenuOpen, setMobileMenuOpen 
}: any) => {
  const { user, logout, cart, notifications, unreadCount, markAllNotificationsAsRead } = useApp();
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          // Close suggestions logic if implemented explicitly
      }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
      logout();
      setView(PageView.HOME);
  }

  return (
      <header className="sticky top-0 z-[60] glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer flex-shrink-0 group" onClick={() => setView(PageView.HOME)}>
              <div className="bg-primary hover:bg-primary-700 transition-colors text-white p-2.5 rounded-2xl mr-3 shadow-lg shadow-primary/30 group-hover:scale-105 group-hover:rotate-3 transform duration-300">
                  <span className="font-extrabold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block font-sans group-hover:text-primary transition-colors">VendeAqui</span>
          </div>

          <form ref={searchRef} onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-8 relative group z-50">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquise por produtos, marcas e mais..."
                  className="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 shadow-inner"
              />
              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up">
                      <ul className="py-2">
                          {searchSuggestions.map((suggestion: Product) => (
                              <li 
                                  key={suggestion.id} 
                                  onClick={() => navigateToProduct(suggestion)}
                                  className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 mx-2 rounded-xl transition-colors"
                              >
                                  <img src={suggestion.image} className="w-12 h-12 rounded-xl object-cover" alt={suggestion.title} />
                                  <div>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{suggestion.title}</p>
                                      <p className="text-xs font-semibold text-primary">{suggestion.price.toLocaleString()} MT</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </form>

          <nav className="hidden lg:flex items-center space-x-2">
              <button 
                  onClick={() => setView(PageView.PRODUCT_LIST)} 
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                  <Search className="w-4 h-4" />
                  Explorar
              </button>
              
              <button onClick={() => setView(PageView.PLANS)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                  Planos
              </button>

              <button onClick={() => setView(PageView.AI_STUDIO)} className="ml-2 relative group overflow-hidden px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2 z-10 group-hover:text-white">
                      <Wand2 className="w-4 h-4" />
                      AI Studio
                  </span>
              </button>
          </nav>

          <div className="hidden md:flex items-center space-x-3 ml-6 pl-6 border-l border-slate-200 dark:border-slate-700">
              <button onClick={toggleDarkMode} className="p-2.5 text-slate-500 hover:text-primary transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 text-slate-500 hover:text-primary transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2.5 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>}
              </button>

              {showNotifications && (
                  <div className="absolute right-0 mt-6 w-96 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-fade-in-up origin-top-right">
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                      {unreadCount > 0 && <button onClick={markAllNotificationsAsRead} className="text-xs text-primary font-bold hover:underline bg-primary/10 px-2 py-1 rounded-md">Marcar lidas</button>}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                          <div className="p-12 text-center text-slate-400">
                          <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="text-sm font-medium">Tudo limpo por aqui</p>
                          </div>
                      ) : (
                          notifications.map((n: Notification) => (
                          <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer flex gap-4 border-b border-slate-50 dark:border-slate-800/50 ${!n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}>
                              <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-primary shadow-glow' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                                  <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-wide">{n.time}</p>
                              </div>
                          </div>
                          ))
                      )}
                      </div>
                  </div>
              )}
              </div>

              <div className="relative cursor-pointer group" onClick={() => setView(PageView.CART)}>
              <div className="p-2.5 text-slate-500 group-hover:text-primary transition rounded-full group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-lg">
                      {cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)}
                      </span>
                  )}
              </div>
              </div>
              
              {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <img src={user.avatar} className="w-10 h-10 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 object-cover cursor-pointer hover:ring-primary transition-all" onClick={() => {
                       if (user.role === UserRole.SELLER) setView(PageView.DASHBOARD_SELLER);
                       else if (user.role === UserRole.ADMIN) setView(PageView.DASHBOARD_ADMIN);
                       else setView(PageView.DASHBOARD_CUSTOMER);
                  }} />
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><LogOut className="w-4 h-4"/></button>
              </div>
              ) : (
              <Button onClick={() => setView(PageView.AUTH)} size="sm" className="ml-2 shadow-lg shadow-primary/20">Entrar</Button>
              )}
          </div>
          
          <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  {mobileMenuOpen ? <X /> : <Menu />}
              </button>
          </div>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-fade-in-up">
          <div className="p-6 space-y-4">
              <button 
                  onClick={() => { setView(PageView.PRODUCT_LIST); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
              >
                  <div className="p-3 bg-white dark:bg-slate-700 text-blue-600 rounded-xl shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                      <span className="block font-bold text-slate-900 dark:text-white text-base">Explorar Loja</span>
                      <span className="text-xs text-slate-500">Milhares de produtos</span>
                  </div>
              </button>

              <button 
                  onClick={() => { setView(PageView.AI_STUDIO); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-900/20"
              >
                  <div className="p-3 bg-white dark:bg-slate-800 text-purple-600 rounded-xl shadow-sm">
                      <Wand2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                      <span className="block font-bold text-slate-900 dark:text-white text-base">AI Studio</span>
                      <span className="text-xs text-slate-500">Edite fotos com IA</span>
                  </div>
              </button>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/30">
              {user ? (
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-full ring-4 ring-white dark:ring-slate-700 shadow-md" />
                      <div>
                          <p className="font-bold text-base text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      </div>
                      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-semibold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                          <LogOut className="w-5 h-5" />
                          Sair da Conta
                      </button>
                  </div>
              ) : (
                  <Button className="w-full shadow-lg h-12 text-base" onClick={() => { setView(PageView.AUTH); setMobileMenuOpen(false); }}>
                      Entrar ou Criar Conta
                  </Button>
              )}
          </div>
          </div>
      )}
      </header>
  );
};

const Footer = ({ setView }: { setView: (v: PageView) => void }) => (
  <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-24 pb-12 mt-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
       <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white p-2 rounded-xl mr-3 font-bold shadow-lg shadow-primary/30">V</div>
            <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">VendeAqui</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-loose mb-6">
            A plataforma definitiva para negócios modernos. Conectamos compradores e vendedores num ecossistema digital premium e inovador.
          </p>
       </div>
       {[
         { title: "Plataforma", links: ["Marketplace", "AI Studio", "Planos Enterprise"] },
         { title: "Empresa", links: ["Sobre Nós", "Blog", "Imprensa"] },
         { title: "Suporte", links: ["Central de Ajuda", "Documentação API", "Estado do Sistema", "Contactos"] }
       ].map((col, i) => (
         <div key={i}>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-base">{col.title}</h4>
            <ul className="space-y-4">
               {col.links.map((link, j) => (
                  <li key={j} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer font-medium">{link}</li>
               ))}
            </ul>
         </div>
       ))}
    </div>
    <div className="max-w-7xl mx-auto px-6 border-t border-slate-100 dark:border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-medium">
       <p>&copy; 2024 VendeAqui Enterprise. Todos os direitos reservados.</p>
       <div className="flex gap-8 mt-4 md:mt-0">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacidade</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
       </div>
    </div>
  </footer>
);

const CheckoutPage = ({ setView }: any) => {
  const { cart, addOrder, clearCart, addNotification, removeFromCart } = useApp();
  const { user } = useApp();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (cart.length === 0) {
        addNotification('Carrinho Vazio', 'Adicione produtos antes de prosseguir.', 'SYSTEM');
        return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  const handleFinish = () => {
      if (!paymentMethod) {
          addNotification('Erro', 'Selecione um método de pagamento.', 'SYSTEM');
          return;
      }
      setIsLoading(true);
      setTimeout(() => {
          // Create Order Object
          const newOrder: Order = {
              id: `#ORD-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }),
              total: cart.reduce((a, b) => a + (b.price * b.quantity), 0),
              status: 'Processando',
              paymentMethod: paymentMethod,
              items: [...cart]
          };
          
          addOrder(newOrder);
          clearCart();
          addNotification('Compra Confirmada!', 'O seu pedido foi processado com sucesso.', 'ORDER');
          
          setStep(3);
          setIsLoading(false);
      }, 1500);
  };

  if (step === 3) {
      return (
          <div className="max-w-xl mx-auto py-24 px-4 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-float">
                  <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Pagamento Confirmado!</h2>
              <p className="text-slate-500 mb-10 text-lg">Obrigado pela sua compra. Enviámos um email de confirmação com os detalhes da sua encomenda.</p>
              <div className="flex justify-center gap-4">
                  <Button onClick={() => setView(PageView.DASHBOARD_CUSTOMER)} variant="outline" size="lg">Ver Pedido</Button>
                  <Button onClick={() => setView(PageView.HOME)} size="lg">Voltar à Loja</Button>
              </div>
          </div>
      );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-extrabold mb-12 text-slate-900 dark:text-white">Checkout Seguro</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-10">
                  {/* Steps Indicator */}
                  <div className="flex items-center gap-4 mb-8">
                      <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${step >= 1 ? 'border-primary bg-primary text-white shadow-glow' : 'border-slate-300'}`}>1</div>
                          <span className="font-bold text-lg">Envio</span>
                      </div>
                      <div className="w-16 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
                      <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${step >= 2 ? 'border-primary bg-primary text-white shadow-glow' : 'border-slate-300'}`}>2</div>
                          <span className="font-bold text-lg">Pagamento</span>
                      </div>
                  </div>

                  {step === 1 ? (
                      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-700 space-y-8 animate-fade-in-up">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3"><MapPin className="text-primary"/> Informações de Envio</h3>
                          <div className="grid grid-cols-2 gap-6">
                              <Input label="Nome" placeholder="João" defaultValue={user?.name.split(' ')[0]} />
                              <Input label="Apelido" placeholder="Silva" defaultValue={user?.name.split(' ')[1]} />
                          </div>
                          <Input label="Email" placeholder="joao@exemplo.com" type="email" defaultValue={user?.email} />
                          <Input label="Endereço" placeholder="Av. Julius Nyerere, 123" />
                          <div className="grid grid-cols-2 gap-6">
                              <Input label="Cidade" placeholder="Maputo" />
                              <Input label="Telefone" placeholder="+258 84 123 4567" />
                          </div>
                          <div className="pt-6 flex justify-end">
                              <Button onClick={handleNext} size="xl" isLoading={isLoading} className="shadow-xl">Continuar para Pagamento</Button>
                          </div>
                      </div>
                  ) : (
                      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-700 space-y-8 animate-fade-in-up">
                           <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3"><CreditCard className="text-primary"/> Método de Pagamento</h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* M-Pesa */}
                              <div 
                                onClick={() => setPaymentMethod('M-Pesa')}
                                className={`border-2 p-6 rounded-3xl cursor-pointer flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 ${paymentMethod === 'M-Pesa' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                              >
                                  <div className="bg-red-600 text-white p-2 rounded-lg font-bold text-xs tracking-wider">M-Pesa</div>
                                  <span className="font-bold text-slate-900 dark:text-white text-lg">Vodacom</span>
                              </div>
                              {/* e-Mola */}
                              <div 
                                onClick={() => setPaymentMethod('e-Mola')}
                                className={`border-2 p-6 rounded-3xl cursor-pointer flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 ${paymentMethod === 'e-Mola' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                              >
                                  <div className="bg-orange-500 text-white p-2 rounded-lg font-bold text-xs tracking-wider">e-Mola</div>
                                  <span className="font-bold text-slate-900 dark:text-white text-lg">Movitel</span>
                              </div>
                              {/* Card */}
                              <div 
                                onClick={() => setPaymentMethod('Cartão')}
                                className={`border-2 p-6 rounded-3xl cursor-pointer flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 ${paymentMethod === 'Cartão' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                              >
                                  <CreditCard className="w-8 h-8 text-slate-400" />
                                  <span className="font-bold text-slate-900 dark:text-white text-lg">Cartão</span>
                              </div>
                           </div>
                           
                           {paymentMethod === 'M-Pesa' || paymentMethod === 'e-Mola' ? (
                                <Input label={`Número ${paymentMethod}`} placeholder="+258 84/85 xxx xxxx" />
                           ) : paymentMethod === 'Cartão' ? (
                                <div className="space-y-4">
                                    <Input label="Número do Cartão" placeholder="0000 0000 0000 0000" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Validade" placeholder="MM/AA" />
                                        <Input label="CVV" placeholder="123" />
                                    </div>
                                </div>
                           ) : null}

                           <div className="pt-6 flex justify-between items-center">
                              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-primary font-bold text-sm uppercase tracking-wider px-4">Voltar</button>
                              <Button onClick={handleFinish} size="xl" isLoading={isLoading} className="shadow-xl bg-green-600 hover:bg-green-700">Pagar {cart.reduce((a,b)=>a+(b.price*b.quantity),0).toLocaleString()} MT</Button>
                           </div>
                      </div>
                  )}
              </div>

              <div className="lg:col-span-1">
                   <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-float border border-slate-100 dark:border-slate-700 sticky top-28">
                      <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Resumo do Pedido</h3>
                      <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                          {cart.length === 0 && <p className="text-slate-400 text-center py-4">O carrinho está vazio</p>}
                          {cart.map(item => (
                              <div key={item.id} className="flex gap-4 items-center group relative">
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                                      <p className="text-xs text-slate-500 font-medium mt-1">Qtd: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} MT</p>
                                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 hover:underline">Remover</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700 pt-6 space-y-3">
                           <div className="flex justify-between text-sm text-slate-500 font-medium"><span>Subtotal</span><span>{cart.reduce((a,b)=>a+(b.price*b.quantity),0).toLocaleString()} MT</span></div>
                           <div className="flex justify-between text-sm text-slate-500 font-medium"><span>Taxas</span> <span>0 MT</span></div>
                           <div className="flex justify-between text-2xl font-extrabold text-slate-900 dark:text-white mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700"><span>Total</span><span>{cart.reduce((a,b)=>a+(b.price*b.quantity),0).toLocaleString()} MT</span></div>
                      </div>
                   </div>
              </div>
          </div>
      </div>
  );
};

const DashboardLayout = ({ title, sidebar, children, setView, handleLogout, isDashboardSidebarOpen, setIsDashboardSidebarOpen, isDarkMode, toggleDarkMode }: any) => {
   const { user } = useApp();
   return (
   <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isDashboardSidebarOpen && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsDashboardSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transition-transform duration-300 shadow-xl lg:shadow-none ${isDashboardSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         <div className="p-8">
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => setView(PageView.HOME)}>
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-glow">V</div>
               <div>
                   <span className="font-bold text-xl text-slate-900 dark:text-white block">VendeAqui</span>
                   <span className="text-xs font-semibold text-primary uppercase tracking-wider">Dashboard</span>
               </div>
            </div>
            <nav className="space-y-2">
               {sidebar}
            </nav>
         </div>
         <div className="mt-auto p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <button onClick={() => setView(PageView.HOME)} className="flex items-center gap-3 text-slate-500 hover:text-primary transition text-sm font-bold mb-4 w-full p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800"><Home className="w-4 h-4"/> Voltar à Loja</button>
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-700 transition text-sm font-bold w-full p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut className="w-4 h-4"/> Sair da Conta</button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto lg:px-12 px-6 py-10">
         <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-6">
                   <button className="lg:hidden p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300" onClick={() => setIsDashboardSidebarOpen(true)}>
                       <Menu className="w-6 h-6"/>
                   </button>
                   <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
                      <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta, {user?.name}</p>
                   </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={toggleDarkMode} className="p-3 bg-white dark:bg-slate-800 text-slate-500 hover:text-primary transition rounded-full shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700">
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md">
                       <img src={user?.avatar || "https://ui-avatars.com/api/?name=User"} className="w-full h-full object-cover"/>
                  </div>
               </div>
            </header>
            <div className="animate-fade-in-up">
               {children}
            </div>
         </div>
      </main>
   </div>
   );
};

const PlansPage = ({ setView }: any) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <Badge color="bg-blue-100 text-blue-700 mb-4">Planos VendeAqui</Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Escolha o plano ideal para o seu negócio</h1>
                <p className="text-lg text-slate-500">Comece pequeno e cresça com a gente. Ferramentas poderosas para todos os estágios.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Starter */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-soft relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                    <p className="text-slate-500 text-sm mb-6">Para quem está a começar.</p>
                    <div className="flex items-baseline mb-8">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Gratuito</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Até 10 produtos',
                            'Comissão de 12%',
                            'Suporte Básico',
                            'Pagamentos via M-Pesa'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full" onClick={() => setView(PageView.AUTH)}>Começar Agora</Button>
                </div>

                {/* Pro */}
                <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden transform scale-105 z-10 text-white">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">Mais Popular</div>
                    <h3 className="text-xl font-bold mb-2">Profissional</h3>
                    <p className="text-slate-400 text-sm mb-6">Para lojas em crescimento.</p>
                    <div className="flex items-baseline mb-8">
                        <span className="text-4xl font-extrabold">2.500</span>
                        <span className="text-slate-400 ml-2">MT/mês</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Produtos ilimitados',
                            'Comissão Reduzida (5%)',
                            'AI Studio (50 edições/mês)',
                            'Dashboard Avançado',
                            'Suporte Prioritário'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="primary" className="w-full shadow-glow">Assinar Pro</Button>
                </div>

                {/* Enterprise */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-soft relative overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
                    <p className="text-slate-500 text-sm mb-6">Para grandes operações.</p>
                    <div className="flex items-baseline mb-8">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Sob Consulta</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            'API Dedicada',
                            'Gerente de Conta',
                            'AI Studio Ilimitado',
                            'Integração com ERPs',
                            'SLA de 99.9%'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full">Falar com Vendas</Button>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = ({ 
    adminTab, setAdminTab, ...props 
  }: any) => {
    return (
        <DashboardLayout 
            title="Administração"
            sidebar={
                <>
                     <button onClick={() => setAdminTab('OVERVIEW')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${adminTab === 'OVERVIEW' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5"/> Visão Global</button>
                     <button onClick={() => setAdminTab('TRANSACTIONS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${adminTab === 'TRANSACTIONS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Activity className="w-5 h-5"/> Transações</button>
                     <button onClick={() => setAdminTab('USERS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${adminTab === 'USERS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Users className="w-5 h-5"/> Utilizadores</button>
                     <button onClick={() => setAdminTab('RISK')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${adminTab === 'RISK' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><AlertOctagon className="w-5 h-5"/> Risco & Fraude</button>
                </>
            }
            {...props}
        >
            {adminTab === 'OVERVIEW' && (
                <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Volume Total', val: '4.2M MT', icon: DollarSign, color: 'text-green-500' },
                            { label: 'Utilizadores', val: '1,240', icon: Users, color: 'text-blue-500' },
                            { label: 'Vendedores', val: '85', icon: CheckSquare, color: 'text-purple-500' },
                            { label: 'Risco Alto', val: '12', icon: AlertOctagon, color: 'text-red-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-soft">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl"><stat.icon className={`w-6 h-6 ${stat.color}`}/></div>
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.val}</h3>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                     </div>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft h-[400px]">
                            <h3 className="font-bold text-xl mb-6 dark:text-white">Crescimento da Plataforma</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={[{n:'Jan',v:100},{n:'Fev',v:120},{n:'Mar',v:180},{n:'Abr',v:250},{n:'Mai',v:300},{n:'Jun',v:420}]}>
                                    <defs>
                                        <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={props.isDarkMode ? '#334155' : '#f1f5f9'} />
                                    <XAxis dataKey="n" axisLine={false} tickLine={false} />
                                    <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                                    <Tooltip />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft h-[400px] overflow-hidden flex flex-col">
                            <h3 className="font-bold text-xl mb-6 dark:text-white">Alertas Recentes</h3>
                            <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Tentativa de Fraude Detectada</p>
                                            <p className="text-xs text-slate-500">IP suspeito na conta #User-{900+i}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">2 min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                </div>
            )}

            {adminTab === 'TRANSACTIONS' && (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Monitoria de Transações</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[700px]">
                            <thead className="bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="p-6 pl-8">ID</th>
                                    <th className="p-6">Utilizador</th>
                                    <th className="p-6">Valor</th>
                                    <th className="p-6">Risco (0-100)</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right pr-8">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {MOCK_ADMIN_TRANSACTIONS.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-6 pl-8 font-bold text-slate-900 dark:text-white">{tx.id}</td>
                                        <td className="p-6 text-slate-500">{tx.user}</td>
                                        <td className="p-6 font-bold">{tx.amount.toLocaleString()} MT</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-slate-200 rounded-full w-24 overflow-hidden">
                                                    <div className={`h-full rounded-full ${tx.riskScore > 80 ? 'bg-red-500' : tx.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${tx.riskScore}%`}}></div>
                                                </div>
                                                <span className="text-xs font-bold">{tx.riskScore}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Badge color={tx.status === 'Rejected' ? 'bg-red-100 text-red-700' : tx.status === 'Flagged' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                                                {tx.status}
                                            </Badge>
                                        </td>
                                        <td className="p-6 pr-8 text-right">
                                            <Button variant="ghost" size="sm">Detalhes</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(adminTab === 'USERS' || adminTab === 'RISK') && (
                <div className="text-center py-20">
                    <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Módulo em Desenvolvimento</h3>
                    <p className="text-slate-500 mt-2">Esta funcionalidade estará disponível na próxima atualização do sistema VendeAqui.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

const CustomerDashboard = ({ 
  customerTab, setCustomerTab, navigateToProduct, ...props
}: any) => {
    const { orders, addToCart, user, wishlist, tickets, createTicket } = useApp();
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketMessage, setTicketMessage] = useState('');
    const [trackModalOpen, setTrackModalOpen] = useState(false);
    const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);

    const handleCreateTicket = () => {
        if(ticketSubject && ticketMessage){
            createTicket(ticketSubject, ticketMessage);
            setTicketSubject('');
            setTicketMessage('');
        }
    }

    const openTrackModal = (order: Order) => {
        setSelectedTrackOrder(order);
        setTrackModalOpen(true);
    };

    return (
    <>
    <Modal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} title={`Rastrear Pedido ${selectedTrackOrder?.id}`}>
        <div className="space-y-8 py-4">
            <div className="flex flex-col gap-6">
                {[
                    { status: 'Pendente', label: 'Pedido Recebido', date: '10:30', active: true },
                    { status: 'Processando', label: 'Em Processamento', date: '11:00', active: true },
                    { status: 'Enviado', label: 'Enviado', date: '14:30', active: selectedTrackOrder?.status === 'Enviado' || selectedTrackOrder?.status === 'Entregue' },
                    { status: 'Entregue', label: 'Entregue', date: '16:45', active: selectedTrackOrder?.status === 'Entregue' }
                ].map((step, idx, arr) => (
                    <div key={idx} className="flex gap-4 relative">
                        {idx !== arr.length - 1 && (
                            <div className={`absolute left-[11px] top-8 bottom-[-24px] w-0.5 ${step.active && arr[idx+1]?.active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        )}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.active ? 'bg-primary text-white shadow-glow' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            {step.active ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 bg-slate-400 rounded-full"></div>}
                        </div>
                        <div className={`${step.active ? 'opacity-100' : 'opacity-50'}`}>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{step.label}</p>
                            <p className="text-xs text-slate-500">{step.active ? step.date : '--:--'}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedTrackOrder?.status === 'Entregue' ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50 text-green-700 text-center text-sm font-bold">
                    O seu pedido foi entregue com sucesso!
                </div>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 text-blue-700 text-center text-sm font-bold flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4"/> Previsão de entrega: Hoje, 17:00
                </div>
            )}
        </div>
    </Modal>

    <DashboardLayout 
      title="Minha Conta"
      sidebar={
          <>
              <button onClick={() => setCustomerTab('OVERVIEW')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${customerTab === 'OVERVIEW' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><ShoppingBag className="w-5 h-5"/> Visão Geral</button>
              <button onClick={() => setCustomerTab('FAVORITES')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${customerTab === 'FAVORITES' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Heart className="w-5 h-5"/> Lista de Desejos</button>
              <button onClick={() => setCustomerTab('TICKETS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${customerTab === 'TICKETS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><TicketIcon className="w-5 h-5"/> Suporte</button>
              <button onClick={() => setCustomerTab('SETTINGS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${customerTab === 'SETTINGS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Settings className="w-5 h-5"/> Definições</button>
          </>
      }
      {...props}
    >
      {customerTab === 'OVERVIEW' && (
          <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Wallet Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-white/10 rounded-2xl"><Wallet className="w-6 h-6"/></div>
                           <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Carteira Digital</p>
                      </div>
                      <h3 className="text-4xl font-extrabold mb-1">{user?.walletBalance.toLocaleString()} <span className="text-xl text-slate-400 font-normal">MT</span></h3>
                      <p className="text-xs text-green-400 font-bold bg-green-400/10 inline-block px-2 py-1 rounded">Disponível para saque</p>
                  </div>

                  {/* Loyalty Points */}
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-float relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                       <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-2xl"><Gift className="w-6 h-6"/></div>
                           <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Pontos Fidelidade</p>
                      </div>
                      <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{user?.loyaltyPoints} <span className="text-xl text-slate-400 font-normal">pts</span></h3>
                      <p className="text-xs text-slate-400 mt-2">Próxima recompensa em 500 pts</p>
                  </div>

                  {/* Orders Summary */}
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-float relative overflow-hidden group">
                       <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl"><ShoppingBag className="w-6 h-6"/></div>
                           <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Pedidos</p>
                      </div>
                      <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{orders.length}</h3>
                      <p className="text-xs text-slate-400 mt-2">Última compra: {orders[0]?.date || 'N/A'}</p>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">Histórico de Encomendas</h3>
                      <Button variant="ghost" size="sm">Ver Tudo</Button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[600px]">
                          <thead className="bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100 dark:border-slate-700">
                              <tr>
                                  <th className="p-6 pl-8">ID</th>
                                  <th className="p-6">Data</th>
                                  <th className="p-6">Status</th>
                                  <th className="p-6">Pagamento</th>
                                  <th className="p-6">Total</th>
                                  <th className="p-6 text-right pr-8">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {orders.map(order => (
                                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                      <td className="p-6 pl-8 font-bold text-slate-900 dark:text-white">{order.id}</td>
                                      <td className="p-6 text-slate-500 font-medium">{order.date}</td>
                                      <td className="p-6">
                                          <Badge color={order.status === 'Entregue' ? 'bg-green-100 text-green-700' : order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}>
                                              {order.status}
                                          </Badge>
                                      </td>
                                      <td className="p-6 text-slate-500 font-medium">{order.paymentMethod}</td>
                                      <td className="p-6 font-bold text-slate-900 dark:text-white">{order.total.toLocaleString()} MT</td>
                                      <td className="p-6 pr-8 text-right flex gap-2 justify-end">
                                          <Button variant="ghost" size="sm" onClick={() => openTrackModal(order)}>Rastrear</Button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {customerTab === 'FAVORITES' && (
          <div>
              <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Minha Lista de Desejos ({wishlist.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {useApp().products.filter(p => wishlist.includes(p.id)).length > 0 ? (
                    useApp().products.filter(p => wishlist.includes(p.id)).map(product => (
                      <ProductCard 
                          key={product.id} 
                          {...product} 
                          onClick={() => navigateToProduct(product)}
                          onAddToCart={() => addToCart(product)} 
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 col-span-3 text-center py-10">Sua lista de desejos está vazia.</p>
                  )}
              </div>
          </div>
      )}

      {customerTab === 'TICKETS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-soft">
                      <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Novo Ticket</h3>
                      <div className="space-y-4">
                          <Input placeholder="Assunto" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
                          <textarea 
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-primary/50 outline-none text-sm resize-none" 
                            rows={4} 
                            placeholder="Descreva o seu problema..."
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                          ></textarea>
                          <Button className="w-full" onClick={handleCreateTicket}>Enviar Ticket</Button>
                      </div>
                  </div>
              </div>
              <div className="lg:col-span-2">
                  <div className="space-y-4">
                      {tickets.length === 0 ? <p className="text-slate-500">Nenhum ticket aberto.</p> : tickets.map(ticket => (
                          <div key={ticket.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                              <div>
                                  <div className="flex items-center gap-3 mb-1">
                                      <span className="font-bold text-slate-900 dark:text-white">{ticket.id}</span>
                                      <Badge color={ticket.status === 'Aberto' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>{ticket.status}</Badge>
                                  </div>
                                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{ticket.subject}</p>
                                  <p className="text-xs text-slate-400 mt-1">{ticket.date}</p>
                              </div>
                              <Button variant="ghost" size="sm">Ver Conversa</Button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {customerTab === 'SETTINGS' && (
          <div className="max-w-3xl bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft">
               <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Dados Pessoais</h3>
               <div className="space-y-6">
                   <div className="flex items-center gap-6 mb-8">
                      <img src={user?.avatar} className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-700" />
                      <Button variant="outline" size="sm">Alterar Foto</Button>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <Input label="Nome" defaultValue={user?.name.split(' ')[0]} />
                      <Input label="Apelido" defaultValue={user?.name.split(' ')[1]} />
                   </div>
                   <Input label="Email" defaultValue={user?.email} />
                   <Input label="Telefone" placeholder="+258 84 123 4567" />
                   
                   <div className="pt-8 border-t border-slate-100 dark:border-slate-700 mt-8">
                      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Endereços de Entrega</h3>
                      <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl mb-4 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                          <div className="flex items-center gap-4">
                              <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-400"><Home className="w-5 h-5"/></div>
                              <div>
                                  <p className="font-bold text-slate-900 dark:text-white">Casa</p>
                                  <p className="text-sm text-slate-500">Av. Julius Nyerere, 123, Maputo</p>
                              </div>
                          </div>
                          <Button variant="ghost" size="sm"><Edit className="w-4 h-4"/></Button>
                      </div>
                      <Button variant="outline" size="md" className="w-full border-dashed" icon={Plus}>Adicionar Endereço</Button>
                   </div>

                   <div className="pt-8 flex justify-end">
                      <Button size="lg" className="shadow-lg">Guardar Alterações</Button>
                   </div>
               </div>
          </div>
      )}
    </DashboardLayout>
    </>
);
};

const SellerDashboard = ({ sellerTab, setSellerTab, navigateToProduct, ...props }: any) => {
  const { orders, products, addProduct } = useApp();
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  
  // Add Product Form State
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
      const p: Product = {
          id: Date.now().toString(),
          title: newProdTitle,
          price: Number(newProdPrice),
          category: newProdCategory || 'Geral',
          image: newProdImage || 'https://placehold.co/600x600?text=New+Product',
          seller: 'Minha Loja',
          stock: 10,
          rating: 0,
          reviews: 0,
          description: 'Novo produto adicionado.',
          reviewsList: []
      };
      addProduct(p);
      setAddProductModalOpen(false);
      // Reset form
      setNewProdTitle(''); setNewProdPrice(''); setNewProdCategory(''); setNewProdImage('');
  };

  return (
  <>
  <Modal isOpen={addProductModalOpen} onClose={() => setAddProductModalOpen(false)} title="Adicionar Novo Produto">
      <div className="space-y-6">
          <Input label="Nome do Produto" value={newProdTitle} onChange={e => setNewProdTitle(e.target.value)} />
          <Input label="Preço (MT)" type="number" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} />
          <Input label="Categoria" placeholder="Ex: Electrónica" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} />
          
          <div className="space-y-2">
             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Imagem do Produto</label>
             <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group relative ${newProdImage ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
                {newProdImage ? (
                    <>
                        <img src={newProdImage} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Alterar Imagem</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-slate-400 group-hover:text-primary transition-colors">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-bold block">Carregar Imagem</span>
                        <span className="text-[10px] uppercase tracking-wide">JPG, PNG</span>
                    </div>
                )}
             </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
             />
             <div className="relative pt-2">
                 <div className="absolute inset-0 flex items-center pt-2"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">ou URL</span></div>
             </div>
             <Input 
                placeholder="https://..." 
                value={newProdImage.startsWith('data:') ? '' : newProdImage} 
                onChange={e => setNewProdImage(e.target.value)} 
                className="text-xs"
             />
          </div>

          <Button onClick={handleAddProduct} className="w-full">Publicar Produto</Button>
      </div>
  </Modal>

  <DashboardLayout 
      title="Painel do Vendedor"
      sidebar={
          <>
               <button onClick={() => setSellerTab('OVERVIEW')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${sellerTab === 'OVERVIEW' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5"/> Visão Geral</button>
               <button onClick={() => setSellerTab('PRODUCTS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${sellerTab === 'PRODUCTS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Tag className="w-5 h-5"/> Produtos</button>
               <button onClick={() => setSellerTab('ORDERS')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${sellerTab === 'ORDERS' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Truck className="w-5 h-5"/> Pedidos</button>
               <button onClick={() => setSellerTab('MARKETING')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${sellerTab === 'MARKETING' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><TrendingUp className="w-5 h-5"/> Marketing</button>
          </>
      }
      {...props}
  >
     {sellerTab === 'OVERVIEW' && (
         <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                  { label: 'Receita Total', val: '124.500 MT', change: '+12%', icon: BarChart3 },
                  { label: 'Pedidos', val: '45', change: '+5%', icon: Truck },
                  { label: 'Devoluções', val: '2', change: '-1%', icon: AlertTriangle, color: 'text-red-500' },
                  { label: 'Rating', val: '4.8', change: '+0.2', icon: Star },
              ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl text-slate-500"><stat.icon className={`w-5 h-5 ${stat.color || ''}`}/></div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-lg border border-green-100 dark:border-green-800">{stat.change}</span>
                      </div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.val}</h3>
                  </div>
              ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft h-[450px]">
                  <h3 className="font-bold text-xl mb-8 dark:text-white">Performance de Vendas vs Devoluções</h3>
                  <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={[{n:'Seg',v:4000, r:200},{n:'Ter',v:3000, r:100},{n:'Qua',v:2000, r:0},{n:'Qui',v:2780, r:300},{n:'Sex',v:1890, r:100},{n:'Sab',v:2390, r:50},{n:'Dom',v:3490, r:150}]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={props.isDarkMode ? '#334155' : '#f1f5f9'} />
                      <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: props.isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                      <Bar dataKey="v" fill="#2563EB" radius={[8, 8, 8, 8]} barSize={20} name="Vendas" />
                      <Bar dataKey="r" fill="#EF4444" radius={[8, 8, 8, 8]} barSize={20} name="Devoluções" />
                      <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                      />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft h-[450px] flex flex-col">
                   <h3 className="font-bold text-xl mb-6 dark:text-white">Top Produtos</h3>
                   <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                       {products.slice(0,5).map((p: Product, i: number) => (
                           <div key={i} className="flex items-center gap-4">
                               <span className="font-bold text-slate-300 text-lg w-4">{i+1}</span>
                               <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                               <div className="flex-1 min-w-0">
                                   <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{p.title}</p>
                                   <p className="text-xs text-slate-500">{p.stock} em stock</p>
                               </div>
                               <span className="text-sm font-bold text-primary">{Math.floor(Math.random() * 50)} un</span>
                           </div>
                       ))}
                   </div>
              </div>
          </div>
         </>
     )}

     {sellerTab === 'PRODUCTS' && (
         <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Gestão de Stock</h3>
                 <Button size="md" icon={Plus} className="shadow-lg" onClick={() => setAddProductModalOpen(true)}>Adicionar Produto</Button>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[700px]">
                     <thead className="bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100 dark:border-slate-700">
                         <tr>
                             <th className="p-6 pl-8">Produto</th>
                             <th className="p-6">Variações</th>
                             <th className="p-6">Preço</th>
                             <th className="p-6">Stock</th>
                             <th className="p-6 text-right pr-8">Ações</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                         {products.map((product: Product) => (
                             <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                 <td className="p-6 pl-8 flex items-center gap-4">
                                     <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                     <span className="font-bold text-slate-900 dark:text-white">{product.title}</span>
                                 </td>
                                 <td className="p-6 text-slate-500 font-medium">Cor, Tamanho</td>
                                 <td className="p-6 text-slate-500 font-medium">{product.price.toLocaleString()} MT</td>
                                 <td className="p-6">
                                     <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                         {product.stock} un
                                     </span>
                                 </td>
                                 <td className="p-6 pr-8 text-right">
                                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Button variant="ghost" size="sm"><Edit className="w-4 h-4"/></Button>
                                         <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>
     )}

     {sellerTab === 'MARKETING' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft">
                 <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/> Criar Promoção</h3>
                 <div className="space-y-4">
                     <Input label="Nome da Campanha" placeholder="Ex: Saldos de Verão" />
                     <div className="grid grid-cols-2 gap-4">
                         <Input label="Desconto (%)" type="number" placeholder="15" />
                         <Input label="Duração (Dias)" type="number" placeholder="7" />
                     </div>
                     <Button className="w-full">Lançar Campanha</Button>
                 </div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft">
                 <h3 className="font-bold text-xl mb-6 text-slate-900 dark:text-white">Produtos Impulsionados</h3>
                 <div className="space-y-4">
                     {products.filter((p: Product) => p.isPromoted).map((p: Product) => (
                         <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center gap-4">
                                 <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                                 <div>
                                     <p className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</p>
                                     <p className="text-xs text-green-500 font-bold">Ativo • CPC 5.00 MT</p>
                                 </div>
                             </div>
                             <Button variant="ghost" size="sm" className="text-red-500">Parar</Button>
                         </div>
                     ))}
                     <Button variant="outline" className="w-full border-dashed" icon={Plus}>Impulsionar Novo Produto</Button>
                 </div>
             </div>
         </div>
     )}

     {sellerTab === 'ORDERS' && (
         <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-700">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Gestão de Pedidos</h3>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[600px]">
                     <thead className="bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100 dark:border-slate-700">
                         <tr>
                             <th className="p-6 pl-8">ID Pedido</th>
                             <th className="p-6">Cliente</th>
                             <th className="p-6">Data</th>
                             <th className="p-6">Status</th>
                             <th className="p-6 text-right pr-8">Ações</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                         {/* Using mocked orders for Seller view for now, could be filtered from context orders if we had seller ID linkage */}
                         {orders.map(order => (
                             <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                 <td className="p-6 pl-8 font-bold text-slate-900 dark:text-white">{order.id}</td>
                                 <td className="p-6 text-slate-500 font-medium">João Silva</td>
                                 <td className="p-6 text-slate-500 font-medium">{order.date}</td>
                                 <td className="p-6">
                                     <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-xs font-bold p-2 cursor-pointer focus:ring-2 focus:ring-primary">
                                         <option>{order.status}</option>
                                         <option>Pendente</option>
                                         <option>Enviado</option>
                                         <option>Entregue</option>
                                     </select>
                                 </td>
                                 <td className="p-6 pr-8 text-right"><Button variant="ghost" size="sm">Ver Fatura</Button></td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>
     )}
  </DashboardLayout>
  </>
);
};

const App = () => {
  const { user, login, logout, products, addToCart, wishlist, toggleWishlist } = useApp();
  const [view, setView] = useState<PageView>(PageView.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dashboard states
  const [customerTab, setCustomerTab] = useState('OVERVIEW');
  const [sellerTab, setSellerTab] = useState('OVERVIEW');
  const [adminTab, setAdminTab] = useState('OVERVIEW');
  const [isDashboardSidebarOpen, setIsDashboardSidebarOpen] = useState(false);

  // Navigation states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Derived state
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, products]);

  // Effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView(PageView.PRODUCT_LIST);
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setView(PageView.PRODUCT_DETAIL);
    setSearchQuery('');
  };

  const handleLogout = () => {
      logout();
      setView(PageView.HOME);
  };

  // Views
  const renderHome = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Hero" />
        <div className="relative z-20 px-12 md:px-24 max-w-3xl">
          <Badge color="bg-primary text-white border-none mb-6 text-sm py-1.5 px-3">Novo Marketplace</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Descubra o extraordinário.
          </h1>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-xl">
            A melhor plataforma para comprar e vender em Moçambique. Tecnologia, moda e casa com entrega rápida.
          </p>
          <div className="flex gap-4">
             <Button size="xl" onClick={() => setView(PageView.PRODUCT_LIST)} className="shadow-2xl shadow-primary/50">Explorar Loja</Button>
             <Button variant="white" size="xl" onClick={() => setView(PageView.AUTH)}>Começar a Vender</Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Navegar por Categorias</h2>
         <div className="flex flex-wrap justify-center gap-6">
            {CATEGORIES.map((cat, i) => (
               <div key={i} onClick={() => { setSearchQuery(cat.name); setView(PageView.PRODUCT_LIST); }} className="group cursor-pointer flex flex-col items-center gap-4 min-w-[120px]">
                  <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-primary/40 group-hover:scale-110">
                     <cat.icon className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{cat.name}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex justify-between items-end mb-10">
           <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Destaques da Semana</h2>
              <p className="text-slate-500 mt-2">Os produtos mais desejados pelos nossos clientes.</p>
           </div>
           <Button variant="ghost" onClick={() => setView(PageView.PRODUCT_LIST)} className="hidden md:flex">Ver Todos <ArrowRight className="w-4 h-4 ml-2"/></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onClick={() => navigateToProduct(product)}
                onAddToCart={() => addToCart(product)} 
              />
           ))}
        </div>
      </div>

      {/* AI Studio Teaser */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md mb-8">
                 <Sparkles className="w-4 h-4 text-yellow-300" />
                 <span className="text-sm font-bold">Powered by Gemini 2.5</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Transforme suas fotos com IA</h2>
             <p className="text-lg text-indigo-100 mb-10">
                Vendedores profissionais usam o nosso estúdio de IA para criar fotos de produtos incríveis em segundos.
             </p>
             <Button size="xl" onClick={() => setView(PageView.AI_STUDIO)} className="bg-white text-indigo-900 hover:bg-indigo-50 border-none">Experimentar Agora</Button>
          </div>
      </div>
    </div>
  );

  const renderProductList = () => {
     const filtered = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
     );

     return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
               <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {searchQuery ? `Resultados para "${searchQuery}"` : 'Explorar Produtos'}
                  </h1>
                  <p className="text-slate-500 mt-2">{filtered.length} produtos encontrados</p>
               </div>
               <div className="flex gap-4">
                  <Button variant="outline" icon={Filter}>Filtros</Button>
                  <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary">
                      <option>Relevância</option>
                      <option>Menor Preço</option>
                      <option>Maior Preço</option>
                      <option>Mais Recentes</option>
                  </select>
               </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filtered.map(product => (
                        <ProductCard 
                            key={product.id} 
                            {...product} 
                            onClick={() => navigateToProduct(product)}
                            onAddToCart={() => addToCart(product)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nenhum produto encontrado</h3>
                    <p className="text-slate-500 mt-2">Tente pesquisar por outros termos ou categorias.</p>
                    <Button className="mt-8" onClick={() => { setSearchQuery(''); setView(PageView.PRODUCT_LIST); }}>Ver Todos</Button>
                </div>
            )}
        </div>
     );
  };

  const renderProductDetail = () => {
     if (!selectedProduct) return null;
     
     const isWishlisted = wishlist.includes(selectedProduct.id);

     return (
        <div className="max-w-7xl mx-auto px-4 py-12">
           <Button variant="ghost" onClick={() => setView(PageView.PRODUCT_LIST)} className="mb-8 pl-0 hover:bg-transparent hover:text-primary"><ChevronLeft className="w-5 h-5 mr-1"/> Voltar à Loja</Button>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
               <div className="bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden aspect-square relative group">
                   <img src={selectedProduct.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={selectedProduct.title} />
                   <button 
                     onClick={() => toggleWishlist(selectedProduct.id)}
                     className="absolute top-6 right-6 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 shadow-xl transition-all"
                   >
                       <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                   </button>
               </div>
               
               <div className="flex flex-col justify-center">
                   <div className="mb-6">
                       <Badge>{selectedProduct.category}</Badge>
                       <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 mb-4 leading-tight">{selectedProduct.title}</h1>
                       <div className="flex items-center gap-4">
                          <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                                ))}
                          </div>
                          <span className="text-sm font-bold text-slate-500">{selectedProduct.reviews} avaliações</span>
                       </div>
                   </div>

                   <div className="mb-8">
                       <p className="text-5xl font-extrabold text-slate-900 dark:text-white">{selectedProduct.price.toLocaleString()} <span className="text-2xl text-slate-500 font-medium">MT</span></p>
                   </div>

                   <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-10">
                       {selectedProduct.description}
                   </p>
                   
                   <div className="flex gap-4">
                       <Button size="xl" className="flex-1 shadow-xl" onClick={() => addToCart(selectedProduct)}>Adicionar ao Carrinho</Button>
                       <Button size="xl" variant="secondary" className="flex-1">Comprar Agora</Button>
                   </div>
                   
                   <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-6">
                       <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Truck className="w-5 h-5"/></div>
                           <div><p className="font-bold text-slate-900 dark:text-white text-sm">Entrega Grátis</p><p className="text-xs text-slate-500">Maputo e Matola</p></div>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl"><Shield className="w-5 h-5"/></div>
                           <div><p className="font-bold text-slate-900 dark:text-white text-sm">Garantia</p><p className="text-xs text-slate-500">12 Meses</p></div>
                       </div>
                   </div>
               </div>
           </div>
        </div>
     );
  };

  const renderCart = () => {
      // Re-use CheckoutPage logic for cart view as it contains the summary and steps
      return <CheckoutPage setView={setView} />;
  };

  const renderAuth = () => (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md text-center">
              <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl font-bold mx-auto mb-8 shadow-glow">V</div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Bem-vindo</h2>
              <p className="text-slate-500 mb-10">Entre na sua conta para continuar.</p>
              
              <div className="space-y-4">
                  <Button 
                    className="w-full h-14 text-lg shadow-lg" 
                    onClick={() => { login(UserRole.CUSTOMER); setView(PageView.DASHBOARD_CUSTOMER); }}
                  >
                      Entrar como Cliente
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg" 
                    onClick={() => { login(UserRole.SELLER); setView(PageView.DASHBOARD_SELLER); }}
                  >
                      Entrar como Vendedor
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-slate-400" 
                    onClick={() => { login(UserRole.ADMIN); setView(PageView.DASHBOARD_ADMIN); }}
                  >
                      Acesso Administrativo
                  </Button>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                      <p className="text-xs text-slate-400">Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderContent = () => {
    switch(view) {
      case PageView.HOME: return renderHome();
      case PageView.PRODUCT_LIST: return renderProductList();
      case PageView.PRODUCT_DETAIL: return renderProductDetail();
      case PageView.CART: return renderCart();
      case PageView.CHECKOUT: return <CheckoutPage setView={setView} />;
      case PageView.PLANS: return <PlansPage setView={setView} />;
      case PageView.AI_STUDIO: return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <GeminiEditor />
        </div>
      );
      case PageView.DASHBOARD_CUSTOMER: 
        return <CustomerDashboard 
            customerTab={customerTab} 
            setCustomerTab={setCustomerTab}
            navigateToProduct={navigateToProduct}
            setView={setView}
            handleLogout={handleLogout}
            isDashboardSidebarOpen={isDashboardSidebarOpen}
            setIsDashboardSidebarOpen={setIsDashboardSidebarOpen}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />;
      case PageView.DASHBOARD_SELLER: 
        return <SellerDashboard 
            sellerTab={sellerTab} 
            setSellerTab={setSellerTab}
            navigateToProduct={navigateToProduct}
            setView={setView}
            handleLogout={handleLogout}
            isDashboardSidebarOpen={isDashboardSidebarOpen}
            setIsDashboardSidebarOpen={setIsDashboardSidebarOpen}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />;
      case PageView.DASHBOARD_ADMIN: 
        return <AdminDashboard 
            adminTab={adminTab} 
            setAdminTab={setAdminTab}
            setView={setView}
            handleLogout={handleLogout}
            isDashboardSidebarOpen={isDashboardSidebarOpen}
            setIsDashboardSidebarOpen={setIsDashboardSidebarOpen}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />;
      case PageView.AUTH: return renderAuth();
      default: return renderHome();
    }
  };

  const isDashboard = [PageView.DASHBOARD_CUSTOMER, PageView.DASHBOARD_SELLER, PageView.DASHBOARD_ADMIN].includes(view);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {!isDashboard && (
        <Header 
            view={view} 
            setView={setView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchSuggestions={searchSuggestions}
            handleSearchSubmit={handleSearchSubmit}
            navigateToProduct={navigateToProduct}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      
      {renderContent()}
      
      {!isDashboard && <Footer setView={setView} />}
      
      <ChatAssistant />
    </div>
  );
};

export default App;
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db, auth, appId, initializeAuth } from './services/firebase';
import { Product, CartItem, CMSData, Notification } from './types';
import { PRODUCTS, DEFAULT_CMS_DATA } from './constants';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CMSPanel from './components/CMSPanel';
import AdminLoginModal from './components/AdminLoginModal';
import NotificationItem from './components/Notification';
import CheckoutModal from './components/CheckoutModal';
import { AboutSection, ContactSection, CustomizationSection, Footer } from './components/PageSections';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Cart is initialized from LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
      const saved = localStorage.getItem('ch_cart');
      return saved ? JSON.parse(saved) : [];
  });

  const [cmsData, setCmsData] = useState<CMSData>(DEFAULT_CMS_DATA);

  // Products are now initialized from LocalStorage (persistence fix)
  const [products, setProducts] = useState<Product[]>(() => {
      const saved = localStorage.getItem('ch_products');
      if (saved) {
          try {
              return JSON.parse(saved);
          } catch (e) {
              console.error("Error parsing products from local storage", e);
              return PRODUCTS;
          }
      }
      return PRODUCTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Helpers ---
  const calculateCartTotal = () => {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // --- Initial Setup ---
  useEffect(() => {
    initializeAuth();
    if (auth) {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
        });
        return () => unsubscribeAuth();
    }
  }, []);

  // --- LocalStorage Sync for Cart ---
  useEffect(() => {
      localStorage.setItem('ch_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- LocalStorage Sync for Products (Persistence Fix) ---
  useEffect(() => {
      localStorage.setItem('ch_products', JSON.stringify(products));
  }, [products]);

  // --- Firestore Listeners ---
  useEffect(() => {
    if (!db) return;

    // 1. CMS Listener
    const cmsRef = doc(db, `artifacts/${appId}/public/data/cms_settings/global`);
    const unsubCMS = onSnapshot(cmsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCmsData({ ...DEFAULT_CMS_DATA, ...docSnap.data() as Partial<CMSData> });
      } else {
        if (isAdmin) setDoc(cmsRef, DEFAULT_CMS_DATA, { merge: true });
      }
    }, (error) => console.error("CMS Error", error));

    // 2. Products Listener
    // Only listen to DB if DB is active. The listener merges/updates local state.
    const productsRef = collection(db, `artifacts/${appId}/public/products`);
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
        const dbProducts: Product[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const id = data.id || parseInt(doc.id) || Date.now();
            dbProducts.push({ ...data, id } as Product);
        });
        
        // If DB has data, it overrides/merges with local constants, but usually we use one source of truth.
        // For hybrid demo, if DB returns items, use them.
        if (dbProducts.length > 0) {
            setProducts(dbProducts.sort((a, b) => Number(a.id) - Number(b.id)));
        }
    });

    return () => {
      unsubCMS();
      unsubProducts();
    };
  }, [isAdmin]);

  // --- Notifications ---
  const addNotification = (message: string, type: 'info' | 'success' | 'error') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Cart Actions ---
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) {
        addNotification("Błąd produktu.", 'error');
        return;
    }

    setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => String(item.productId) === String(productId));
        
        if (existingItemIndex > -1) {
            const newItems = [...prevItems];
            newItems[existingItemIndex].quantity += 1;
            return newItems;
        } else {
            const newItem: CartItem = {
                id: `local-${Date.now()}-${Math.random()}`,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                timestamp: Date.now()
            };
            return [...prevItems, newItem];
        }
    });

    addNotification(`Dodano ${product.name}!`, 'success');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
      setCartItems(prevItems => {
          return prevItems.map(item => {
              if (item.id === itemId) {
                  return { ...item, quantity: Math.max(0, item.quantity + delta) };
              }
              return item;
          }).filter(item => item.quantity > 0);
      });
  };

  const handleRemoveFromCart = (itemId: string) => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleClearCart = async () => {
      setCartItems([]);
      localStorage.removeItem('ch_cart');
  };

  // --- CMS Actions ---
  const handleSaveCMS = async (newData: CMSData) => {
    // Optimistic Update / Demo Mode Support
    setCmsData(newData);

    if (db) {
      try {
        await updateDoc(doc(db, `artifacts/${appId}/public/data/cms_settings/global`), { ...newData });
        addNotification("Zapisano ustawienia!", 'success');
      } catch (e) {
        addNotification("Błąd zapisu.", 'error');
      }
    } else {
      addNotification("Zapisano ustawienia (Tryb Demo)!", 'success');
    }
  };

  const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
      const productId = 'id' in productData ? productData.id : Date.now();
      const productToSave = { ...productData, id: productId } as Product;

      // Update local state immediately (Optimistic UI / Demo Mode)
      setProducts(prev => {
          const index = prev.findIndex(p => p.id === productId);
          if (index >= 0) {
              const newProds = [...prev];
              newProds[index] = productToSave;
              return newProds;
          }
          return [...prev, productToSave];
      });

      if (db) {
          try {
              const productRef = doc(db, `artifacts/${appId}/public/products/${productId}`);
              await setDoc(productRef, productToSave);
              addNotification("Produkt zapisany!", 'success');
          } catch (e) {
              console.error(e);
              addNotification("Błąd zapisu produktu w bazie.", 'error');
          }
      } else {
          addNotification("Produkt zapisany (Tryb Demo)!", 'success');
      }
  };

  const handleDeleteProduct = async (id: number) => {
      if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
        // Update local state immediately
        setProducts(prev => prev.filter(p => p.id !== id));

        if (db) {
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/products/${id}`));
                addNotification("Produkt usunięty.", 'info');
            } catch (e) {
                addNotification("Błąd usuwania z bazy.", 'error');
            }
        } else {
             addNotification("Produkt usunięty (Tryb Demo).", 'info');
        }
      }
  };

  // --- Payment Flow ---
  const handlePaymentSuccess = async () => {
      await handleClearCart();
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      addNotification("Zamówienie złożone pomyślnie!", 'success');
  };

  return (
    <div className="bg-ch-bg-dark text-ch-text-light min-h-screen">
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
            {notifications.map(n => (
                <div key={n.id} className="pointer-events-auto">
                    <NotificationItem notification={n} onClose={removeNotification} />
                </div>
            ))}
        </div>

        {isAdmin && (
            <div className="bg-red-600 text-ch-bg-dark text-center py-2 font-bold text-sm tracking-wider shadow-lg cursor-pointer hover:bg-red-500" onClick={() => setIsCMSOpen(true)}>
                🔒 TRYB ADMINA: Kliknij tutaj, aby otworzyć panel CMS
            </div>
        )}

        <Navbar 
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            cartTotal={calculateCartTotal()}
            onCartClick={() => setIsCartOpen(true)}
            onAdminClick={() => setIsCMSOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            isAdmin={isAdmin}
        />

        <Hero data={cmsData} />

        <ProductList 
            products={products} 
            title={cmsData.productsTitle} 
            onAddToCart={handleAddToCart}
        />

        {/* Pass full cmsData to sections */}
        <CustomizationSection cmsData={cmsData} />
        <AboutSection cmsData={cmsData} />
        <ContactSection cmsData={cmsData} />
        
        <Footer />

        <Cart 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            items={cartItems} 
            userId={currentUser?.uid || "Gość"}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={() => setIsCheckoutOpen(true)}
        />

        <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cartItems}
            total={calculateCartTotal()}
            onPaymentSuccess={handlePaymentSuccess}
        />

        <CMSPanel 
            isOpen={isCMSOpen} 
            onClose={() => setIsCMSOpen(false)} 
            data={cmsData} 
            products={products}
            onSaveData={handleSaveCMS} 
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
        />

        <AdminLoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => { setIsAdmin(true); setIsLoginModalOpen(false); addNotification("Zalogowano.", 'success'); }}
            onLoginFail={() => addNotification("Nieprawidłowy klucz.", 'error')}
        />
    </div>
  );
};

export default App;
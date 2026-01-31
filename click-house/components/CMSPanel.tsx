import React, { useState, useEffect } from 'react';
import { CMSData, Product } from '../types';
import { X, Save, Plus, Trash2, Edit2, Sparkles, Loader } from 'lucide-react';
import { generateProductMetadata, generateProductImage } from '../services/ai';

interface CMSPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: CMSData;
  products: Product[];
  onSaveData: (newData: CMSData) => void;
  onSaveProduct: (product: Omit<Product, 'id'> | Product) => void;
  onDeleteProduct: (id: number) => void;
}

const CMSPanel: React.FC<CMSPanelProps> = ({ isOpen, onClose, data, products, onSaveData, onSaveProduct, onDeleteProduct }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'products'>('content');
  const [formData, setFormData] = useState<CMSData>(data);
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveData(formData);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that name exists and price is a valid number
    if (editingProduct.name && editingProduct.price !== undefined && !isNaN(editingProduct.price)) {
        onSaveProduct(editingProduct as Product);
        setIsProductFormOpen(false);
        setEditingProduct({});
    } else {
        alert("Proszę podać nazwę i poprawną cenę produktu.");
    }
  };

  const startEditProduct = (product: Product) => {
      setEditingProduct(product);
      setIsProductFormOpen(true);
  };

  const startNewProduct = () => {
      setEditingProduct({
          name: '',
          price: 0,
          description: '',
          category: 'Inne',
          icon: '📦',
          image: ''
      });
      setIsProductFormOpen(true);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    // Check for API Key if using Veo/Pro Image models
    if (window.aistudio) {
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await window.aistudio.openSelectKey();
            }
        } catch (e) {
            console.error("AI Studio Key Error", e);
        }
    }

    setIsGenerating(true);

    try {
        // 1. Generate Metadata (using Gemini 3 Pro Preview)
        const metadata = await generateProductMetadata(aiPrompt);
        if (!metadata) throw new Error("Nie udało się wygenerować danych.");

        // 2. Generate Image (using Nano Banana Pro / Gemini 3 Pro Image)
        const imageBase64 = await generateProductImage(aiPrompt + ", " + metadata.name);
        
        // 3. Fill Form
        setEditingProduct({
            name: metadata.name,
            price: metadata.price,
            description: metadata.description,
            category: metadata.category,
            icon: metadata.icon,
            image: imageBase64 || 'https://placehold.co/400x400?text=AI+Error'
        });
        setIsProductFormOpen(true);
        setAiPrompt('');
    } catch (e) {
        console.error(e);
        alert("Błąd generowania AI. Sprawdź klucz API.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-ch-bg-medium z-[100] shadow-2xl flex flex-col border-l-4 border-ch-primary transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h3 className="text-2xl font-heading text-ch-primary">🛠️ CMS Panel</h3>
        <button onClick={onClose} className="text-ch-primary hover:text-white transition duration-200">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'content' ? 'bg-ch-primary text-ch-bg-dark' : 'text-ch-gray hover:text-white'}`}
          >
              Treść Strony
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 font-bold transition-colors ${activeTab === 'products' ? 'bg-ch-primary text-ch-bg-dark' : 'text-ch-gray hover:text-white'}`}
          >
              Produkty ({products.length})
          </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
        {activeTab === 'content' ? (
             <form onSubmit={handleDataSubmit} className="space-y-4 pb-12">
                <h4 className="text-xl font-heading text-ch-tertiary border-b border-gray-700 pb-2">Sekcja HERO</h4>
                {/* Existing Fields */}
                <label className="block">
                <span className="text-ch-gray text-sm">Tytuł Główny</span>
                <input 
                    type="text" name="heroTitle" value={formData.heroTitle || ''} onChange={handleDataChange}
                    className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm focus:border-ch-primary outline-none" 
                />
                </label>
                <label className="block">
                <span className="text-ch-gray text-sm">Podtytuł</span>
                <input 
                    type="text" name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleDataChange}
                    className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm focus:border-ch-primary outline-none" 
                />
                </label>
                <label className="block">
                <span className="text-ch-gray text-sm">Opis</span>
                <textarea 
                    rows={3} name="heroDescription" value={formData.heroDescription || ''} onChange={handleDataChange}
                    className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm focus:border-ch-primary outline-none"
                />
                </label>
                <label className="block">
                <span className="text-ch-gray text-sm">URL Obrazu Tła Hero</span>
                <input 
                    type="text" name="heroBgUrl" value={formData.heroBgUrl || ''} onChange={handleDataChange}
                    className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm focus:border-ch-primary outline-none" 
                />
                </label>
                
                <h4 className="text-xl font-heading text-ch-tertiary border-b border-gray-700 pb-2 pt-4">Inne Sekcje</h4>
                <label className="block">
                    <span className="text-ch-gray text-sm">Tytuł Produktów</span>
                    <input type="text" name="productsTitle" value={formData.productsTitle || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                <label className="block">
                    <span className="text-ch-gray text-sm">Tytuł Customizacji</span>
                    <input type="text" name="customTitle" value={formData.customTitle || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                <label className="block">
                    <span className="text-ch-gray text-sm">Tło Customizacji (URL)</span>
                    <input type="text" name="customBgUrl" value={formData.customBgUrl || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                 <label className="block">
                    <span className="text-ch-gray text-sm">Tytuł 'O Nas'</span>
                    <input type="text" name="aboutTitle" value={formData.aboutTitle || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                <label className="block">
                    <span className="text-ch-gray text-sm">Tło 'O Nas' (URL)</span>
                    <input type="text" name="aboutBgUrl" value={formData.aboutBgUrl || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                 <label className="block">
                    <span className="text-ch-gray text-sm">Tytuł Kontaktu</span>
                    <input type="text" name="contactTitle" value={formData.contactTitle || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>
                 <label className="block">
                    <span className="text-ch-gray text-sm">Tło Kontaktu (URL)</span>
                    <input type="text" name="contactBgUrl" value={formData.contactBgUrl || ''} onChange={handleDataChange} className="w-full p-2 rounded bg-[#181818] border border-gray-700 mt-1 text-sm" />
                </label>

                <button type="submit" className="w-full bg-ch-secondary text-ch-bg-dark py-3 rounded-lg font-bold hover:bg-[#59b2cc] transition duration-300 shadow-xl flex items-center justify-center gap-2 mt-4">
                    <Save size={18} /> ZAPISZ WSZYSTKIE ZMIANY
                </button>
            </form>
        ) : (
            <div className="space-y-4 pb-12">
                {!isProductFormOpen ? (
                    <>  
                        {/* AI Generator Section */}
                        <div className="bg-[#101010] p-4 rounded-lg border border-ch-primary/50 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Sparkles size={100} />
                            </div>
                            <h4 className="text-ch-primary font-heading mb-2 flex items-center gap-2">
                                <Sparkles size={18}/> AI Generator Produktów
                            </h4>
                            <p className="text-xs text-ch-gray mb-3">Wpisz co chcesz dodać, a AI stworzy opis i zdjęcie (Nano Banana Pro).</p>
                            
                            <textarea 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="np. Futurystyczna podkładka pod mysz z podświetleniem RGB..."
                                className="w-full bg-[#181818] border border-gray-700 rounded p-2 text-sm text-white mb-2 focus:border-ch-primary outline-none"
                                rows={2}
                            />
                            
                            <button 
                                onClick={handleAIGenerate}
                                disabled={isGenerating || !aiPrompt}
                                className={`w-full py-2 rounded font-bold text-sm flex items-center justify-center gap-2 transition ${isGenerating ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-ch-primary to-purple-600 text-white hover:opacity-90'}`}
                            >
                                {isGenerating ? <><Loader className="animate-spin" size={16}/> Generowanie...</> : <><Sparkles size={16}/> Generuj Produkt</>}
                            </button>
                        </div>

                        <button 
                            onClick={startNewProduct}
                            className="w-full bg-[#202020] text-ch-gray hover:text-white border border-gray-700 py-3 rounded-lg font-bold hover:bg-[#2a2a2a] transition duration-300 flex items-center justify-center gap-2 mb-4"
                        >
                            <Plus size={18} /> Ręczne dodawanie
                        </button>

                        <div className="space-y-3">
                            {products.map(product => (
                                <div key={product.id} className="bg-[#181818] p-3 rounded-lg flex items-center justify-between border border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} className="w-10 h-10 rounded object-cover" alt="" />
                                        <div>
                                            <p className="font-bold text-sm text-white truncate w-32">{product.name}</p>
                                            <p className="text-xs text-ch-gray">{product.price.toFixed(2)} zł</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditProduct(product)} className="text-ch-secondary hover:text-white p-1"><Edit2 size={16}/></button>
                                        <button onClick={() => onDeleteProduct(product.id)} className="text-red-500 hover:text-white p-1"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleProductSubmit} className="space-y-3 animate-fade-in bg-[#181818] p-4 rounded-lg border border-ch-primary">
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-ch-primary">
                                 {editingProduct.id ? 'Edytuj Produkt' : 'Nowy Produkt'}
                             </h4>
                             <button type="button" onClick={() => setIsProductFormOpen(false)} className="text-gray-500 hover:text-white">Anuluj</button>
                        </div>

                        {editingProduct.image && (
                            <div className="mb-2 text-center">
                                <img src={editingProduct.image} alt="Preview" className="h-32 w-full object-cover rounded border border-gray-700" />
                                <p className="text-[10px] text-gray-500 mt-1">Podgląd zdjęcia</p>
                            </div>
                        )}

                        <input 
                            type="text" placeholder="Nazwa" required 
                            value={editingProduct.name || ''} 
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />
                        <input 
                            type="number" step="0.01" placeholder="Cena (zł)" required 
                            value={editingProduct.price} 
                            onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />
                        <input 
                            type="text" placeholder="Kategoria (np. Myszki)" required 
                            value={editingProduct.category || ''} 
                            onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />
                         <input 
                            type="text" placeholder="Ikona (Emoji)" 
                            value={editingProduct.icon || ''} 
                            onChange={e => setEditingProduct({...editingProduct, icon: e.target.value})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />
                         <input 
                            type="text" placeholder="URL Obrazka" required 
                            value={editingProduct.image || ''} 
                            onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />
                         <textarea 
                            placeholder="Opis produktu" rows={3}
                            value={editingProduct.description || ''} 
                            onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                            className="w-full p-2 rounded bg-ch-bg-dark border border-gray-600 text-sm"
                        />

                        <button type="submit" className="w-full bg-ch-primary text-ch-bg-dark py-2 rounded font-bold hover:bg-[#d900e3]">
                            ZAPISZ PRODUKT
                        </button>
                    </form>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default CMSPanel;
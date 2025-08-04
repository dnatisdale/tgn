import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, QrCode, Share2, Download, Upload, 
  Edit3, Trash2, Check, X, ChevronDown, ChevronRight,
  Globe, Languages, Music, BookOpen, Video, Mic,
  ArrowUp, ArrowDown, Settings, ExternalLink,
  RefreshCw, Database, Copy, AlertTriangle
} from 'lucide-react';

const TGNApp = () => {
  // Core state
  const [language, setLanguage] = useState('en');
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  
  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Form state
  const [newUrl, setNewUrl] = useState({ title: '', url: '', category: '', subcategory: '', notes: '' });
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: [''] });
  const [bulkImportText, setBulkImportText] = useState('');
  const [urlCheckResults, setUrlCheckResults] = useState([]);

  // Translations
  const t = {
    en: {
      title: 'Thai Good News',
      addResource: 'Add Resource',
      search: 'Search resources...',
      allCategories: 'All Categories',
      manageCategories: 'Manage Categories',
      importUrls: 'Import URLs',
      exportData: 'Export Data',
      installApp: 'Install App',
      checkUrls: 'Check URLs',
      title_label: 'Title',
      url_label: 'URL',
      category_label: 'Category',
      subcategory_label: 'Subcategory',
      notes_label: 'Notes',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      qrCode: 'QR Code',
      addCategory: 'Add Category',
      categoryName: 'Category Name',
      subcategories: 'Subcategories',
      addSubcategory: 'Add Subcategory',
      bulkImport: 'Bulk Import URLs',
      pasteUrls: 'Paste URLs (one per line)',
      urlStatus: 'URL Status',
      working: 'Working',
      broken: 'Broken',
      unknown: 'Unknown'
    },
    th: {
      title: 'ข่าวดีไทย',
      addResource: 'เพิ่มทรัพยากร',
      search: 'ค้นหาทรัพยากร...',
      allCategories: 'หมวดหมู่ทั้งหมด',
      manageCategories: 'จัดการหมวดหมู่',
      importUrls: 'นำเข้า URL',
      exportData: 'ส่งออกข้อมูล',
      installApp: 'ติดตั้งแอป',
      checkUrls: 'ตรวจสอบ URL',
      title_label: 'ชื่อ',
      url_label: 'URL',
      category_label: 'หมวดหมู่',
      subcategory_label: 'หมวดหมู่ย่อย',
      notes_label: 'หมายเหตุ',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      edit: 'แก้ไข',
      delete: 'ลบ',
      share: 'แชร์',
      qrCode: 'QR Code',
      addCategory: 'เพิ่มหมวดหมู่',
      categoryName: 'ชื่อหมวดหมู่',
      subcategories: 'หมวดหมู่ย่อย',
      addSubcategory: 'เพิ่มหมวดหมู่ย่อย',
      bulkImport: 'นำเข้า URL จำนวนมาก',
      pasteUrls: 'วาง URL (หนึ่งบรรทัดต่อหนึ่ง URL)',
      urlStatus: 'สถานะ URL',
      working: 'ใช้งานได้',
      broken: 'เสียหาย',
      unknown: 'ไม่ทราบ'
    }
  };

  // Default categories with two-tier structure
  const defaultCategories = [
    {
      id: 'thailand',
      name: 'Thailand',
      subcategories: [
        { id: 'thai-central', name: 'Thai (Central)' },
        { id: 'thai-northern', name: 'Thai (Northern)' },
        { id: 'thai-southern', name: 'Thai (Southern)' },
        { id: 'karen', name: 'Karen' },
        { id: 'hmong', name: 'Hmong' }
      ]
    },
    {
      id: 'myanmar',
      name: 'Myanmar',
      subcategories: [
        { id: 'burmese', name: 'Burmese' },
        { id: 'shan', name: 'Shan' },
        { id: 'karen-myanmar', name: 'Karen (Myanmar)' }
      ]
    },
    {
      id: 'laos',
      name: 'Laos',
      subcategories: [
        { id: 'lao', name: 'Lao' },
        { id: 'hmong-laos', name: 'Hmong (Laos)' }
      ]
    },
    {
      id: 'content-types',
      name: 'Content Types',
      subcategories: [
        { id: 'bible', name: 'Bible' },
        { id: 'songs', name: 'Songs' },
        { id: 'testimonies', name: 'Testimonies' },
        { id: 'videos', name: 'Videos' },
        { id: 'audio', name: 'Audio Messages' }
      ]
    }
  ];

  // Initialize data
  useEffect(() => {
    const savedUrls = localStorage.getItem('tgnUrls');
    const savedCategories = localStorage.getItem('tgnCategories');
    const savedLanguage = localStorage.getItem('tgnLanguage');

    if (savedUrls) setUrls(JSON.parse(savedUrls));
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('tgnCategories', JSON.stringify(defaultCategories));
    }
    if (savedLanguage) setLanguage(savedLanguage);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('tgnUrls', JSON.stringify(urls));
  }, [urls]);

  useEffect(() => {
    localStorage.setItem('tgnCategories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tgnLanguage', language);
  }, [language]);

  // URL validation and correction
  const validateAndCorrectUrl = (url) => {
    if (!url) return { corrected: '', isValid: false };
    
    let corrected = url.trim();
    
    // Common typo corrections
    const corrections = {
      'youtub.com': 'youtube.com',
      'youtube.co': 'youtube.com',
      'youtu.be': 'youtu.be', // Keep this as is
      'globalrecording.net': 'globalrecordings.net',
      '5fish.mob': '5fish.mobi'
    };
    
    Object.entries(corrections).forEach(([typo, correct]) => {
      corrected = corrected.replace(typo, correct);
    });
    
    // Add https if missing
    if (!/^https?:\/\//.test(corrected)) {
      corrected = 'https://' + corrected;
    }
    
    const isValid = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(corrected);
    
    return { corrected, isValid };
  };

  // Check URL status
  const checkUrlStatus = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return 'working';
    } catch {
      return 'unknown'; // Can't determine due to CORS
    }
  };

  // Handle PWA install
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setInstallPrompt(null);
    }
  };

  // Category management
  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category = {
      id: Date.now().toString(),
      name: newCategory.name,
      subcategories: newCategory.subcategories
        .filter(sub => sub.trim())
        .map(sub => ({
          id: Date.now().toString() + Math.random(),
          name: sub.trim()
        }))
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', subcategories: [''] });
  };

  const updateCategory = (categoryId, updatedCategory) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? updatedCategory : cat
    ));
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    // Also remove any URLs in this category
    setUrls(urls.filter(url => url.category !== categoryId));
  };

  const moveCategoryUp = (index) => {
    if (index === 0) return;
    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
    setCategories(newCategories);
  };

  const moveCategoryDown = (index) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    setCategories(newCategories);
  };

  // URL management
  const addUrl = () => {
    const { corrected, isValid } = validateAndCorrectUrl(newUrl.url);
    
    if (!newUrl.title.trim() || !isValid) return;
    
    const url = {
      id: Date.now().toString(),
      title: newUrl.title,
      url: corrected,
      category: newUrl.category,
      subcategory: newUrl.subcategory,
      notes: newUrl.notes,
      dateAdded: new Date().toISOString(),
      status: 'unknown'
    };
    
    setUrls([...urls, url]);
    setNewUrl({ title: '', url: '', category: '', subcategory: '', notes: '' });
    setShowAddForm(false);
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  // Bulk import
  const handleBulkImport = () => {
    const lines = bulkImportText.split('\n').filter(line => line.trim());
    const newUrls = [];
    
    lines.forEach(line => {
      const { corrected, isValid } = validateAndCorrectUrl(line.trim());
      if (isValid) {
        const url = {
          id: Date.now().toString() + Math.random(),
          title: corrected.replace(/^https?:\/\//, '').split('/')[0],
          url: corrected,
          category: '',
          subcategory: '',
          notes: 'Bulk imported',
          dateAdded: new Date().toISOString(),
          status: 'unknown'
        };
        newUrls.push(url);
      }
    });
    
    setUrls([...urls, ...newUrls]);
    setBulkImportText('');
    setShowImportDialog(false);
  };

  // Check all URLs
  const checkAllUrls = async () => {
    setUrlCheckResults([]);
    const results = [];
    
    for (const url of urls) {
      const status = await checkUrlStatus(url.url);
      results.push({ id: url.id, status });
      setUrlCheckResults([...results]);
      
      // Update URL status
      setUrls(prevUrls => 
        prevUrls.map(u => 
          u.id === url.id ? { ...u, status } : u
        )
      );
    }
  };

  // Export/Import
  const exportData = () => {
    const data = { urls, categories, version: '2.0' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tgn-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate QR code (simple implementation)
  const generateQRCode = (url) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    window.open(qrUrl, '_blank');
  };

  // Share functionality
  const shareUrl = async (url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: url.title,
          text: url.notes || 'Gospel resource',
          url: url.url
        });
      } catch (error) {
        copyToClipboard(url.url);
      }
    } else {
      copyToClipboard(url.url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  // Filter URLs
  const filteredUrls = useMemo(() => {
    return urls.filter(url => {
      const matchesSearch = url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          url.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || url.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || url.subcategory === selectedSubcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [urls, searchTerm, selectedCategory, selectedSubcategory]);

  // Get subcategories for selected category
  const getSubcategories = () => {
    if (selectedCategory === 'all') return [];
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.subcategories : [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t[language].title}</h1>
          <div className="flex items-center gap-2">
            {showInstallButton && (
              <button
                onClick={handleInstall}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Download size={16} />
                {t[language].installApp}
              </button>
            )}
            <button
              onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm"
            >
              {language === 'en' ? 'ไทย' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            {t[language].addResource}
          </button>
          <button
            onClick={() => setShowCategoryManager(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Settings size={16} />
            {t[language].manageCategories}
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Upload size={16} />
            {t[language].importUrls}
          </button>
          <button
            onClick={exportData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Download size={16} />
            {t[language].exportData}
          </button>
          <button
            onClick={checkAllUrls}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <RefreshCw size={16} />
            {t[language].checkUrls}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t[language].search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory('all');
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t[language].allCategories}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {getSubcategories().length > 0 && (
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subcategories</option>
              {getSubcategories().map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* URL List */}
      <div className="p-4">
        <div className="grid gap-4">
          {filteredUrls.map(url => (
            <div key={url.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{url.title}</h3>
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    {url.url}
                    <ExternalLink size={12} />
                  </a>
                  {url.notes && (
                    <p className="text-gray-600 text-sm mt-1">{url.notes}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {url.category && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {categories.find(c => c.id === url.category)?.name || url.category}
                      </span>
                    )}
                    {url.subcategory && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {categories.find(c => c.id === url.category)?.subcategories.find(s => s.id === url.subcategory)?.name || url.subcategory}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded ${
                      url.status === 'working' ? 'bg-green-100 text-green-800' :
                      url.status === 'broken' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t[language][url.status] || url.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => generateQRCode(url.url)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title={t[language].qrCode}
                  >
                    <QrCode size={16} />
                  </button>
                  <button
                    onClick={() => shareUrl(url)}
                    className="p-2 text-gray-600 hover:text-green-600"
                    title={t[language].share}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title={t[language].delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredUrls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No resources found. Add some resources to get started!
            </div>
          )}
        </div>
      </div>

      {/* Add URL Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t[language].addResource}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t[language].title_label}
                value={newUrl.title}
                onChange={(e) => setNewUrl({...newUrl, title: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder={t[language].url_label}
                value={newUrl.url}
                onChange={(e) => setNewUrl({...newUrl, url: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newUrl.category}
                onChange={(e) => setNewUrl({...newUrl, category: e.target.value, subcategory: ''})}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t[language].category_label}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {newUrl.category && (
                <select
                  value={newUrl.subcategory}
                  onChange={(e) => setNewUrl({...newUrl, subcategory: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t[language].subcategory_label}</option>
                  {categories.find(c => c.id === newUrl.category)?.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              )}
              <textarea
                placeholder={t[language].notes_label}
                value={newUrl.notes}
                onChange={(e) => setNewUrl({...newUrl, notes: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={addUrl}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {t[language].save}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t[language].manageCategories}</h2>
            
            {/* Add new category */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">{t[language].addCategory}</h3>
              <input
                type="text"
                placeholder={t[language].categoryName}
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <div className="space-y-2">
                <label className="font-medium text-sm">{t[language].subcategories}</label>
                {newCategory.subcategories.map((sub, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Subcategory name"
                      value={sub}
                      onChange={(e) => {
                        const subs = [...newCategory.subcategories];
                        subs[index] = e.target.value;
                        setNewCategory({...newCategory, subcategories: subs});
                      }}
                      className="flex-1 px-3 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={() => {
                        const subs = newCategory.subcategories.filter((_, i) => i !== index);
                        setNewCategory({...newCategory, subcategories: subs});
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setNewCategory({...newCategory, subcategories: [...newCategory.subcategories, '']})}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  {t[language].addSubcategory}
                </button>
              </div>
              <button
                onClick={addCategory}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2"
              >
                {t[language].addCategory}
              </button>
            </div>

            {/* Existing categories */}
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.id} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{category.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveCategoryUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveCategoryDown(index)}
                        disabled={index === categories.length - 1}
                        className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Subcategories: {category.subcategories.map(sub => sub.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCategoryManager(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t[language].bulkImport}</h2>
            <textarea
              placeholder={t[language].pasteUrls}
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="10"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleBulkImport}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Import
              </button>
              <button
                onClick={() => setShowImportDialog(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TGNApp;
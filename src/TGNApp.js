import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, QrCode, Share2, Download, Upload, 
  Edit3, Trash2, Check, X,
  ArrowUp, ArrowDown, Settings, ExternalLink,
  RefreshCw, Sun, Moon
} from 'lucide-react';

const TGNApp = () => {
  // Theme state - simplified to just light/dark
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tgn-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('tgn-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Core state
  const [language, setLanguage] = useState('en');
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [user, setUser] = useState({ email: 'demo@thaigood.news' }); // Demo user for this example
  const [isLoading, setIsLoading] = useState(false);
  
  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState(new Set());
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryData, setEditingCategoryData] = useState({ name: '', subcategories: [] });
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [currentQRUrl, setCurrentQRUrl] = useState(null);
  const [qrImageBlob, setQrImageBlob] = useState(null);
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced');
  
  // Form state
  const [newUrl, setNewUrl] = useState({ title: '', url: '', category: '', subcategory: '', subSubcategory: '', notes: '' });
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: [''] });
  const [bulkImportText, setBulkImportText] = useState('');

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
      selectAll: 'Select All',
      selectNone: 'Select None',
      selectCategory: 'Select Category',
      bulkActions: 'Bulk Actions',
      deleteSelected: 'Delete Selected',
      checkSelected: 'Check Selected',
      exportSelected: 'Export Selected',
      moveSelected: 'Move Selected',
      selectedCount: 'Selected',
      title_label: 'Title',
      url_label: 'URL',
      category_label: 'Category',
      subcategory_label: 'Subcategory',
      subSubcategory_label: 'Sub-Subcategory',
      notes_label: 'Notes',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      qrCode: 'QR',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      email: 'Email Address',
      signInButton: 'Sign In with Email',
      signInPrompt: 'Sign in to sync your gospel resources across all devices',
      syncStatus: 'Sync Status',
      syncing: 'Syncing...',
      synced: 'Synced',
      syncError: 'Sync Error',
      welcome: 'Welcome',
      updateCategory: 'Update Category',
      duplicateCategory: 'Duplicate Category',
      duplicateSubcategory: 'Duplicate Subcategory',
      categoryExists: 'Category already exists',
      subcategoryExists: 'Subcategory already exists in this category',
      categoryName: 'Category Name',
      subcategories: 'Subcategories',
      addSubcategory: 'Add Subcategory',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      bulkImport: 'Bulk Import URLs',
      pasteUrls: 'Paste URLs (one per line)',
      urlStatus: 'URL Status',
      working: 'Working',
      broken: 'Broken',
      unknown: 'Unknown',
      checking: 'Checking...',
      timeout: 'Timeout',
      invalid: 'Invalid'
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
      selectAll: 'เลือกทั้งหมด',
      selectNone: 'ไม่เลือก',
      selectCategory: 'เลือกหมวดหมู่',
      bulkActions: 'การดำเนินการกลุ่ม',
      deleteSelected: 'ลบที่เลือก',
      checkSelected: 'ตรวจสอบที่เลือก',
      exportSelected: 'ส่งออกที่เลือก',
      moveSelected: 'ย้ายที่เลือก',
      selectedCount: 'เลือกแล้ว',
      title_label: 'ชื่อ',
      url_label: 'URL',
      category_label: 'หมวดหมู่',
      subcategory_label: 'หมวดหมู่ย่อย',
      subSubcategory_label: 'หมวดหมู่ย่อยย่อย',
      notes_label: 'หมายเหตุ',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      edit: 'แก้ไข',
      delete: 'ลบ',
      share: 'แชร์',
      qrCode: 'QR Code',
      signIn: 'เข้าสู่ระบบ',
      signOut: 'ออกจากระบบ',
      email: 'ที่อยู่อีเมล',
      signInButton: 'เข้าสู่ระบบด้วยอีเมล',
      signInPrompt: 'เข้าสู่ระบบเพื่อซิงค์ทรัพยากรข่าวประเสริฐทั่วทุกอุปกรณ์',
      syncStatus: 'สถานะซิงค์',
      syncing: 'กำลังซิงค์...',
      synced: 'ซิงค์แล้ว',
      syncError: 'ข้อผิดพลาดซิงค์',
      welcome: 'ยินดีต้อนรับ',
      updateCategory: 'อัปเดตหมวดหมู่',
      duplicateCategory: 'หมวดหมู่ซ้ำ',
      duplicateSubcategory: 'หมวดหมู่ย่อยซ้ำ',
      categoryExists: 'หมวดหมู่นี้มีอยู่แล้ว',
      subcategoryExists: 'หมวดหมู่ย่อยนี้มีอยู่แล้วในหมวดหมู่นี้',
      categoryName: 'ชื่อหมวดหมู่',
      subcategories: 'หมวดหมู่ย่อย',
      addSubcategory: 'เพิ่มหมวดหมู่ย่อย',
      addCategory: 'เพิ่มหมวดหมู่',
      editCategory: 'แก้ไขหมวดหมู่',
      bulkImport: 'นำเข้า URL จำนวนมาก',
      pasteUrls: 'วาง URL (หนึ่งบรรทัดต่อหนึ่ง URL)',
      urlStatus: 'สถานะ URL',
      working: 'ใช้งานได้',
      broken: 'เสียหาย',
      unknown: 'ไม่ทราบ',
      checking: 'กำลังตรวจสอบ...',
      timeout: 'หมดเวลา',
      invalid: 'ไม่ถูกต้อง'
    }
  };

  // Default categories - Thailand only with sub-subcategories
  const defaultCategories = [
    {
      id: 'thailand',
      name: 'Thailand',
      subcategories: [
        { 
          id: 'thai-central', 
          name: 'Thai (Central)',
          subSubcategories: [
            { id: 'thai-central-bible', name: 'Bible' },
            { id: 'thai-central-songs', name: 'Songs' },
            { id: 'thai-central-testimonies', name: 'Testimonies' },
            { id: 'thai-central-videos', name: 'Videos' },
            { id: 'thai-central-audio', name: 'Audio Messages' }
          ]
        },
        { 
          id: 'thai-northern', 
          name: 'Thai (Northern)',
          subSubcategories: [
            { id: 'thai-northern-bible', name: 'Bible' },
            { id: 'thai-northern-songs', name: 'Songs' },
            { id: 'thai-northern-testimonies', name: 'Testimonies' },
            { id: 'thai-northern-videos', name: 'Videos' },
            { id: 'thai-northern-audio', name: 'Audio Messages' }
          ]
        },
        { 
          id: 'karen', 
          name: 'Karen',
          subSubcategories: [
            { id: 'karen-bible', name: 'Bible' },
            { id: 'karen-songs', name: 'Songs' },
            { id: 'karen-testimonies', name: 'Testimonies' },
            { id: 'karen-videos', name: 'Videos' },
            { id: 'karen-audio', name: 'Audio Messages' }
          ]
        },
        { 
          id: 'hmong', 
          name: 'Hmong',
          subSubcategories: [
            { id: 'hmong-bible', name: 'Bible' },
            { id: 'hmong-songs', name: 'Songs' },
            { id: 'hmong-testimonies', name: 'Testimonies' },
            { id: 'hmong-videos', name: 'Videos' },
            { id: 'hmong-audio', name: 'Audio Messages' }
          ]
        }
      ]
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    setCategories(defaultCategories);
    setUrls([
      {
        id: '1',
        title: 'Thai Gospel Songs Collection',
        url: 'https://5fish.mobi/th/songs/gospel',
        category: 'thailand',
        subcategory: 'thai-central',
        subSubcategory: 'thai-central-songs',
        notes: 'Beautiful collection of Thai worship songs',
        dateAdded: new Date().toISOString(),
        status: 'working'
      },
      {
        id: '2',
        title: 'Karen Bible Audio',
        url: 'https://globalrecordings.net/karen/bible',
        category: 'thailand',
        subcategory: 'karen',
        subSubcategory: 'karen-bible',
        notes: 'Complete Karen Bible recordings',
        dateAdded: new Date().toISOString(),
        status: 'working'
      }
    ]);
  }, []);

  // Theme toggle component
  const ThemeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`
        relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg shadow-slate-900/50' 
          : 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/50'
        }
        hover:scale-105 hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-slate-600
      `}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Toggle slider */}
      <div
        className={`
          absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isDarkMode ? 'translate-x-10' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-slate-600" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun 
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-40 text-slate-400' : 'opacity-0'
          }`} 
        />
        <Moon 
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDarkMode ? 'opacity-0' : 'opacity-40 text-blue-200'
          }`} 
        />
      </div>
    </button>
  );

  // Simple functions for demo
  const addUrl = () => {
    if (!newUrl.title.trim() || !newUrl.url.trim()) {
      alert('Please enter both title and URL');
      return;
    }
    
    const url = {
      id: Date.now().toString(),
      title: newUrl.title,
      url: newUrl.url,
      category: newUrl.category,
      subcategory: newUrl.subcategory,
      subSubcategory: newUrl.subSubcategory,
      notes: newUrl.notes,
      dateAdded: new Date().toISOString(),
      status: 'working'
    };
    
    setUrls([...urls, url]);
    setNewUrl({ title: '', url: '', category: '', subcategory: '', subSubcategory: '', notes: '' });
    setShowAddForm(false);
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const generateQRCode = (url) => {
    setCurrentQRUrl(url);
    setShowQRPopup(true);
    // Simulate QR generation
    setTimeout(() => {
      setQrImageBlob(new Blob(['fake-qr-data'], { type: 'image/png' }));
    }, 500);
  };

  const toggleUrlSelection = (urlId) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(urlId)) {
      newSelected.delete(urlId);
    } else {
      newSelected.add(urlId);
    }
    setSelectedUrls(newSelected);
  };

  const selectAll = () => {
    setSelectedUrls(new Set(filteredUrls.map(url => url.id)));
  };

  const selectNone = () => {
    setSelectedUrls(new Set());
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <header className={`p-4 shadow-lg transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white border-b border-slate-600' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t[language].title}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-200'}`}>
              {t[language].welcome}, {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Sync Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced' ? 'bg-green-400' :
                syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className={isDarkMode ? 'text-slate-300' : 'text-blue-200'}>
                {t[language][syncStatus]}
              </span>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {language === 'en' ? 'ไทย' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className={`p-4 shadow-sm transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800 border-b border-slate-700' 
          : 'bg-white'
      }`}>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            {t[language].addResource}
          </button>
          <button
            onClick={() => setShowCategoryManager(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings size={16} />
            {t[language].manageCategories}
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload size={16} />
            {t[language].importUrls}
          </button>
        </div>

        {/* Selection Controls */}
        <div className={`flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg transition-colors ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Check size={14} />
              {t[language].selectAll}
            </button>
            <button
              onClick={selectNone}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              {t[language].selectNone}
            </button>
          </div>

          {/* Selected count */}
          {selectedUrls.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {selectedUrls.size} {t[language].selectedCount}
              </span>
              <button
                onClick={() => setUrls(urls.filter(url => !selectedUrls.has(url.id)))}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
              >
                <Trash2 size={14} />
                {t[language].deleteSelected}
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} size={16} />
            <input
              type="text"
              placeholder={t[language].search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory('all');
            }}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
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
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
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
            <div key={url.id} className={`p-4 rounded-lg shadow-sm border transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedUrls.has(url.id)}
                  onChange={() => toggleUrlSelection(url.id)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {url.title}
                  </h3>
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
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {url.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {url.category && (
                      <span className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {categories.find(c => c.id === url.category)?.name || url.category}
                      </span>
                    )}
                    {url.subcategory && (
                      <span className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {categories.find(c => c.id === url.category)?.subcategories.find(s => s.id === url.subcategory)?.name || url.subcategory}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded ${
                      url.status === 'working' ? 'bg-green-100 text-green-800' :
                      url.status === 'broken' ? 'bg-red-100 text-red-800' :
                      url.status === 'checking' ? 'bg-blue-100 text-blue-800' :
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {t[language][url.status] || url.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => generateQRCode(url)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title={t[language].qrCode}
                  >
                    <QrCode size={16} />
                  </button>
                  <button
                    onClick={() => setSharePreviewUrl(url)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-green-400 hover:bg-slate-700' 
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={t[language].share}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={t[language].delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredUrls.length === 0 && (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              No resources found. Add some resources to get started!
            </div>
          )}
        </div>
      </div>

      {/* Add URL Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-6 w-full max-w-md transition-colors ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t[language].addResource}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t[language].title_label}
                value={newUrl.title}
                onChange={(e) => setNewUrl({...newUrl, title: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="url"
                placeholder={t[language].url_label}
                value={newUrl.url}
                onChange={(e) => setNewUrl({...newUrl, url: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <select
                value={newUrl.category}
                onChange={(e) => setNewUrl({...newUrl, category: e.target.value, subcategory: '', subSubcategory: ''})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">{t[language].category_label}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {newUrl.category && (
                <select
                  value={newUrl.subcategory}
                  onChange={(e) => setNewUrl({...newUrl, subcategory: e.target.value, subSubcategory: ''})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows="3"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={addUrl}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t[language].save}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Popup */}
      {showQRPopup && currentQRUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-6 w-full max-w-lg text-center transition-colors ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              QR Code for {currentQRUrl.title}
            </h2>
            
            {qrImageBlob ? (
              <div className="space-y-4">
                <div className={`mx-auto w-64 h-64 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <QrCode size={128} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    QR Code Preview
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('QR Code would be downloaded in production')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                  <button
                    onClick={() => setShowQRPopup(false)}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                  Generating QR code...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto transition-colors ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t[language].manageCategories}
            </h2>
            
            {/* Add new category */}
            <div className={`mb-6 p-4 rounded transition-colors ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t[language].addCategory}
              </h3>
              <input
                type="text"
                placeholder={t[language].categoryName}
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded mb-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={() => {
                  if (newCategory.name.trim()) {
                    const category = {
                      id: Date.now().toString(),
                      name: newCategory.name.trim(),
                      subcategories: []
                    };
                    setCategories([...categories, category]);
                    setNewCategory({ name: '', subcategories: [''] });
                  }
                }}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2 transition-colors"
              >
                {t[language].addCategory}
              </button>
            </div>

            {/* Existing categories */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className={`border rounded p-4 transition-colors ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h4>
                    <button
                      onClick={() => {
                        setCategories(categories.filter(cat => cat.id !== category.id));
                        setUrls(urls.filter(url => url.category !== category.id));
                      }}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={t[language].delete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    Subcategories: {category.subcategories.length > 0 
                      ? category.subcategories.map(sub => sub.name).join(', ') 
                      : 'None'
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCategoryManager(false)}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
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
          <div className={`rounded-lg p-6 w-full max-w-md transition-colors ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t[language].bulkImport}
            </h2>
            <textarea
              placeholder={t[language].pasteUrls}
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows="10"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  const lines = bulkImportText.split('\n').filter(line => line.trim());
                  const newUrls = lines.map(line => ({
                    id: Date.now().toString() + Math.random(),
                    title: line.trim().replace(/^https?:\/\//, '').split('/')[0],
                    url: line.trim(),
                    category: '',
                    subcategory: '',
                    notes: 'Bulk imported',
                    dateAdded: new Date().toISOString(),
                    status: 'working'
                  }));
                  setUrls([...urls, ...newUrls]);
                  setBulkImportText('');
                  setShowImportDialog(false);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => setShowImportDialog(false)}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
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
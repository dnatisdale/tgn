import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, QrCode, Mail, Share2, Download, Upload, Menu, X, Globe, BookOpen, Music, Video, Heart, Users, MapPin, Languages, Star, ExternalLink, Copy, Check } from 'lucide-react';

const TGNApp = () => {
  const [language, setLanguage] = useState('en');
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showShareModal, setShowShareModal] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const translations = {
    en: {
      title: "Thai Good News",
      subtitle: "Gospel Resource Manager",
      search: "Search resources...",
      addNew: "Add Resource",
      categories: "Categories",
      all: "All Resources",
      bible: "Bible Stories",
      songs: "Songs & Hymns",
      testimonies: "Testimonies",
      videos: "Videos",
      audio: "Audio",
      websites: "Websites",
      thai: "Thai Content",
      english: "English Content",
      multilingual: "Multilingual",
      dialects: "Thai Dialects",
      sortBy: "Sort by",
      name: "Name",
      date: "Date Added",
      category: "Category",
      share: "Share",
      edit: "Edit",
      delete: "Delete",
      qrCode: "QR Code",
      email: "Email",
      export: "Export",
      import: "Import",
      cancel: "Cancel",
      save: "Save",
      urlLabel: "Resource Name",
      urlAddress: "URL Address",
      selectCategory: "Select Category",
      description: "Description",
      language: "Language",
      copied: "Copied!",
      noResults: "No resources found",
      addFirst: "Add your first gospel resource to get started",
      close: "Close"
    },
    th: {
      title: "ข่าวดีไทย",
      subtitle: "ตัวจัดการทรัพยากรพระกิตติคุณ",
      search: "ค้นหาทรัพยากร...",
      addNew: "เพิ่มทรัพยากร",
      categories: "หมวดหมู่",
      all: "ทรัพยากรทั้งหมด",
      bible: "เรื่องราวพระคัมภีร์",
      songs: "เพลงและสดุดี",
      testimonies: "คำพยาน",
      videos: "วิดีโอ",
      audio: "เสียง",
      websites: "เว็บไซต์",
      thai: "เนื้อหาภาษาไทย",
      english: "เนื้อหาภาษาอังกฤษ",
      multilingual: "หลายภาษา",
      dialects: "ภาษาถิ่นไทย",
      sortBy: "เรียงตาม",
      name: "ชื่อ",
      date: "วันที่เพิ่ม",
      category: "หมวดหมู่",
      share: "แชร์",
      edit: "แก้ไข",
      delete: "ลบ",
      qrCode: "QR Code",
      email: "อีเมล",
      export: "ส่งออก",
      import: "นำเข้า",
      cancel: "ยกเลิก",
      save: "บันทึก",
      urlLabel: "ชื่อทรัพยากร",
      urlAddress: "ที่อยู่ URL",
      selectCategory: "เลือกหมวดหมู่",
      description: "คำอธิบาย",
      language: "ภาษา",
      copied: "คัดลอกแล้ว!",
      noResults: "ไม่พบทรัพยากร",
      addFirst: "เพิ่มทรัพยากรพระกิตติคุณแรกของคุณเพื่อเริ่มต้น",
      close: "ปิด"
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'bible', icon: BookOpen, color: 'text-blue-600' },
    { id: 'songs', icon: Music, color: 'text-purple-600' },
    { id: 'testimonies', icon: Heart, color: 'text-red-600' },
    { id: 'videos', icon: Video, color: 'text-green-600' },
    { id: 'audio', icon: Users, color: 'text-orange-600' },
    { id: 'websites', icon: Globe, color: 'text-cyan-600' },
    { id: 'thai', icon: MapPin, color: 'text-emerald-600' },
    { id: 'english', icon: Languages, color: 'text-indigo-600' },
    { id: 'multilingual', icon: Star, color: 'text-yellow-600' },
    { id: 'dialects', icon: Languages, color: 'text-pink-600' }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('tgnUrls');
    const savedLanguage = localStorage.getItem('tgnLanguage');
    
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save data to localStorage whenever urls change
  useEffect(() => {
    localStorage.setItem('tgnUrls', JSON.stringify(urls));
  }, [urls]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('tgnLanguage', language);
  }, [language]);

  const [newUrl, setNewUrl] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
    language: 'multilingual',
    dateAdded: new Date().toISOString()
  });

  const filteredAndSortedUrls = useMemo(() => {
    let filtered = urls.filter(url => {
      const matchesSearch = url.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           url.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           url.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || url.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else {
        return a.category.localeCompare(b.category);
      }
    });
  }, [urls, searchTerm, selectedCategory, sortBy]);

  const handleAddUrl = () => {
    if (newUrl.name && newUrl.url && newUrl.category) {
      const urlToAdd = {
        ...newUrl,
        id: Date.now(),
        dateAdded: new Date().toISOString()
      };
      setUrls([...urls, urlToAdd]);
      setNewUrl({
        name: '',
        url: '',
        category: '',
        description: '',
        language: 'multilingual',
        dateAdded: new Date().toISOString()
      });
      setIsAddingUrl(false);
    }
  };

  const handleEditUrl = (url) => {
    setEditingUrl(url);
    setNewUrl(url);
    setIsAddingUrl(true);
  };

  const handleUpdateUrl = () => {
    if (newUrl.name && newUrl.url && newUrl.category) {
      setUrls(urls.map(url => url.id === editingUrl.id ? newUrl : url));
      setNewUrl({
        name: '',
        url: '',
        category: '',
        description: '',
        language: 'multilingual',
        dateAdded: new Date().toISOString()
      });
      setIsAddingUrl(false);
      setEditingUrl(null);
    }
  };

  const handleDeleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const generateQRCode = (url) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrCodeUrl;
  };

  const copyToClipboard = async (text, urlId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(urlId);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(urls, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tgn-resources.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedUrls = JSON.parse(e.target.result);
          setUrls([...urls, ...importedUrls]);
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language === 'en' ? 'ไทย' : 'ENG'}</span>
              </button>
              
              <button
                onClick={() => setIsAddingUrl(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.addNew}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 h-screen bg-white shadow-xl transition-transform duration-300 ease-in-out`}>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t.categories}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">{t.all}</span>
                <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {urls.length}
                </span>
              </button>
              
              {categories.map((category) => {
                const Icon = category.icon;
                const count = urls.filter(url => url.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
                    <span className="font-medium">{t[category.id]}</span>
                    {count > 0 && (
                      <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">{t.name}</option>
                  <option value="date">{t.date}</option>
                  <option value="category">{t.category}</option>
                </select>
              </div>

              <div className="space-y-2">
                <button
                  onClick={exportData}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.export}</span>
                </button>
                
                <label className="w-full flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{t.import}</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {filteredAndSortedUrls.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || selectedCategory !== 'all' ? t.noResults : t.addFirst}
              </h3>
              {!searchTerm && selectedCategory === 'all' && (
                <button
                  onClick={() => setIsAddingUrl(true)}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  {t.addNew}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedUrls.map((url) => {
                const categoryInfo = categories.find(cat => cat.id === url.category);
                const Icon = categoryInfo?.icon || Globe;
                
                return (
                  <div key={url.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-50`}>
                            <Icon className={`w-5 h-5 ${categoryInfo?.color || 'text-gray-600'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{url.name}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {t[url.category]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditUrl(url)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUrl(url.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {url.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{url.description}</p>
                      )}
                      
                      <div className="mb-4">
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 truncate"
                        >
                          <span className="truncate">{url.url}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(url.url, url.id)}
                            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                          >
                            {copiedUrl === url.id ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">{t.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>{t.share}</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => setShowQRCode(url)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <span className="text-xs text-gray-400">
                          {new Date(url.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit URL Modal */}
      {isAddingUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingUrl ? `${t.edit} ${t.urlLabel}` : `${t.addNew} ${t.urlLabel}`}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.urlLabel}</label>
                  <input
                    type="text"
                    value={newUrl.name}
                    onChange={(e) => setNewUrl({...newUrl, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Resource name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.urlAddress}</label>
                  <input
                    type="url"
                    value={newUrl.url}
                    onChange={(e) => setNewUrl({...newUrl, url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectCategory}</label>
                  <select
                    value={newUrl.category}
                    onChange={(e) => setNewUrl({...newUrl, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {t[category.id]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.language}</label>
                  <select
                    value={newUrl.language}
                    onChange={(e) => setNewUrl({...newUrl, language: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="thai">{t.thai}</option>
                    <option value="english">{t.english}</option>
                    <option value="multilingual">{t.multilingual}</option>
                    <option value="dialects">{t.dialects}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.description}</label>
                  <textarea
                    value={newUrl.description}
                    onChange={(e) => setNewUrl({...newUrl, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setIsAddingUrl(false);
                    setEditingUrl(null);
                    setNewUrl({
                      name: '',
                      url: '',
                      category: '',
                      description: '',
                      language: 'multilingual',
                      dateAdded: new Date().toISOString()
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={editingUrl ? handleUpdateUrl : handleAddUrl}
                  disabled={!newUrl.name || !newUrl.url || !newUrl.category}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{showQRCode.name}</h3>
              <div className="mb-4">
                <img
                  src={generateQRCode(showQRCode.url)}
                  alt="QR Code"
                  className="mx-auto border rounded-lg shadow-sm"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4 break-all">{showQRCode.url}</p>
              <button
                onClick={() => setShowQRCode(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TGNApp;
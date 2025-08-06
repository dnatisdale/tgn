import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, QrCode, Share2, Download, Upload, 
  Edit3, Trash2, Check, X,
  ArrowUp, ArrowDown, Settings, ExternalLink,
  RefreshCw
} from 'lucide-react';

// ─── Theme support ──────────────────────────────────────────────────────────
import './index.css';    // load theme CSS variables

const themes = [
  'corporate-elegance',
  'lively-spectrum',
  'green-earth',
  'tech-fusion',
  'pure-simplicity',
];
// ← next you will insert theme support here

const TGNApp = () => {
  // ─── Theme state & effect ─────────────────────────────────────────────────
  const [theme, setTheme] = useState('corporate-elegance');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Core state
  const [language, setLanguage] = useState('en');
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const [showSignIn, setShowSignIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [syncStatus, setSyncStatus] = useState('synced'); // 'syncing', 'synced', 'error'
  
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
          id: 'thai-southern', 
          name: 'Thai (Southern)',
          subSubcategories: [
            { id: 'thai-southern-bible', name: 'Bible' },
            { id: 'thai-southern-songs', name: 'Songs' },
            { id: 'thai-southern-testimonies', name: 'Testimonies' },
            { id: 'thai-southern-videos', name: 'Videos' },
            { id: 'thai-southern-audio', name: 'Audio Messages' }
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

  // Initialize data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      // Check for existing user session
      const savedUser = localStorage.getItem('tgnUser');
      const savedLanguage = localStorage.getItem('tgnLanguage');
      
      if (savedLanguage) setLanguage(savedLanguage);
      
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUser(user);
        await loadUserData(user.email);
      } else {
        // Load default categories for new users
        setCategories(defaultCategories);
      }
      
      setIsLoading(false);
    };

    // PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    initializeApp();
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // User authentication
  const signInWithEmail = async (email) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would validate with a backend
      const user = { email: email.toLowerCase(), signedInAt: new Date().toISOString() };
      
      setUser(user);
      localStorage.setItem('tgnUser', JSON.stringify(user));
      
      // Load user's data from cloud storage
      await loadUserData(user.email);
      
      setShowSignIn(false);
      setEmailInput('');
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('tgnUser');
    setUrls([]);
    setCategories(defaultCategories);
    setSelectedUrls(new Set());
  };

  // Cloud data management (simplified - in production, use Firebase/Supabase)
  const loadUserData = async (email) => {
    try {
      setSyncStatus('syncing');
      
      // Simulate cloud storage (replace with real backend)
      const userDataKey = `tgn_user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const cloudData = localStorage.getItem(userDataKey);
      
      if (cloudData) {
        const { urls: cloudUrls, categories: cloudCategories } = JSON.parse(cloudData);
        setUrls(cloudUrls || []);
        setCategories(cloudCategories || defaultCategories);
      } else {
        // New user - set default categories
        setCategories(defaultCategories);
        setUrls([]);
      }
      
      setSyncStatus('synced');
    } catch (error) {
      console.error('Load data error:', error);
      setSyncStatus('error');
    }
  };

  const saveUserData = async () => {
    if (!user) return;
    
    try {
      setSyncStatus('syncing');
      
      // Simulate cloud storage (replace with real backend)
      const userDataKey = `tgn_user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const userData = {
        urls,
        categories,
        lastSync: new Date().toISOString()
      };
      
      localStorage.setItem(userDataKey, JSON.stringify(userData));
      setSyncStatus('synced');
    } catch (error) {
      console.error('Save data error:', error);
      setSyncStatus('error');
    }
  };

  // Save data when urls or categories change
  useEffect(() => {
    if (user && (urls.length > 0 || categories.length > 0)) {
      const timeoutId = setTimeout(() => {
        saveUserData();
      }, 1000); // Debounce saves by 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [urls, categories, user]);

  useEffect(() => {
    localStorage.setItem('tgnLanguage', language);
  }, [language]);

  // URL validation and correction
  const validateAndCorrectUrl = (url) => {
    if (!url) return { corrected: '', isValid: false, suggestions: [] };
    
    let corrected = url.trim();
    let suggestions = [];
    
    // Common typo corrections - use word boundaries to prevent double corrections
    const corrections = {
      'youtub\\.com\\b': 'youtube.com',
      'youtube\\.co\\b': 'youtube.com', 
      'globalrecording\\.net\\b': 'globalrecordings.net',
      '5fish\\.mob\\b': '5fish.mobi',
      'gobalrecordings\\.net\\b': 'globalrecordings.net',
      'globelrecordings\\.net\\b': 'globalrecordings.net'
    };
    
    // Apply corrections with word boundaries
    Object.entries(corrections).forEach(([typoPattern, correct]) => {
      const regex = new RegExp(typoPattern, 'gi');
      if (regex.test(corrected)) {
        const original = corrected;
        corrected = corrected.replace(regex, correct);
        if (original !== corrected) {
          suggestions.push(`Corrected: ${original} → ${corrected}`);
        }
      }
    });
    
    // Add https if missing
    if (!/^https?:\/\//.test(corrected)) {
      corrected = 'https://' + corrected;
    }
    
    // Enhanced URL validation
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
    const isValid = urlPattern.test(corrected);
    
    return { corrected, isValid, suggestions };
  };

  // Real URL checking function
  const checkUrlStatus = async (url) => {
    try {
      // Use a CORS proxy service to check URLs
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return 'working';
      } else if (response.status === 404) {
        return 'broken';
      } else {
        return 'unknown';
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return 'timeout';
      }
      // Fallback: try alternative validation methods
      return await fallbackUrlCheck(url);
    }
  };

  // Fallback URL checking
  const fallbackUrlCheck = async (url) => {
    try {
      // Try to create an image element to test if domain resolves
      return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => resolve('unknown'), 5000);
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve('working');
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          resolve('broken');
        };
        
        // Extract domain for basic connectivity test
        const domain = url.match(/https?:\/\/([^/]+)/)?.[1];
        if (domain) {
          img.src = `https://${domain}/favicon.ico?t=${Date.now()}`;
        } else {
          resolve('invalid');
        }
      });
    } catch {
      return 'unknown';
    }
  };

  // Generate QR code image for sharing (no auto-download)
  const generateQRCodeImage = async (url) => {
    try {
      // Create a canvas for the QR code image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set larger canvas size
      canvas.width = 500;
      canvas.height = 600;
      
      // Create rounded rectangle background
      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Draw white background with rounded corners
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(15, 15, 470, 570, 25);
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 3;
      drawRoundedRect(15, 15, 470, 570, 25);
      ctx.stroke();
      
      // Draw title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.textAlign = 'center';
      const title = url.title.length > 35 ? url.title.substring(0, 32) + '...' : url.title;
      ctx.fillText(title, 250, 60);
      
      // Load and draw QR code (bigger size)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(url.url)}&format=png&margin=15`;
      
      return new Promise((resolve, reject) => {
        const qrImage = new Image();
        qrImage.crossOrigin = 'anonymous';
        
        qrImage.onload = () => {
          // Draw larger QR code centered
          ctx.drawImage(qrImage, 110, 90, 280, 280);
          
          // Draw URL text (split into multiple lines if needed)
          ctx.fillStyle = '#4b5563';
          ctx.font = '16px Arial, sans-serif';
          ctx.textAlign = 'center';
          
          const urlText = url.url;
          const maxWidth = 440;
          const lineHeight = 22;
          let y = 410;
          
          // Split long URLs into multiple lines
          if (ctx.measureText(urlText).width > maxWidth) {
            const words = urlText.split('/');
            let line = '';
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + (i < words.length - 1 ? '/' : '');
              if (ctx.measureText(testLine).width > maxWidth && line !== '') {
                ctx.fillText(line, 250, y);
                y += lineHeight;
                line = words[i] + (i < words.length - 1 ? '/' : '');
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 250, y);
          } else {
            ctx.fillText(urlText, 250, y);
          }
          
          // Draw category/subcategory info
          if (url.category || url.subcategory) {
            ctx.fillStyle = '#6b7280';
            ctx.font = '14px Arial, sans-serif';
            let categoryText = '';
            
            if (url.category) {
              const categoryName = categories.find(c => c.id === url.category)?.name || url.category;
              categoryText = categoryName;
              
              if (url.subcategory) {
                const subcategoryName = categories.find(c => c.id === url.category)?.subcategories.find(s => s.id === url.subcategory)?.name || url.subcategory;
                categoryText += ` > ${subcategoryName}`;
              }
            }
            
            ctx.fillText(categoryText, 250, y + 50);
          }
          
          // Draw app name at bottom
          ctx.fillStyle = '#9ca3af';
          ctx.font = '14px Arial, sans-serif';
          ctx.fillText(t[language].title, 250, 560);
          
          // Convert to blob (no auto-download)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image'));
            }
          }, 'image/png');
        };
        
        qrImage.onerror = () => {
          reject(new Error('Failed to load QR code'));
        };
        
        qrImage.src = qrCodeUrl;
      });
      
    } catch (error) {
      console.error('Error generating QR code image:', error);
      throw error;
    }
  };

  // Share QR code image (kept for potential future use)
  const shareQRCodeImage = async (blob, url) => {
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr-code.png', { type: 'image/png' })] })) {
        // Use native sharing with image file
        const file = new File([blob], `${url.title.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`, { type: 'image/png' });
        await navigator.share({
          title: url.title,
          text: `Gospel Resource: ${url.title}`,
          files: [file]
        });
      } else {
        // Fallback: copy URL to clipboard
        copyToClipboard(url.url);
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      copyToClipboard(url.url);
    }
  };

  // Generate QR code with immediate popup
  const generateQRCode = async (url) => {
    setCurrentQRUrl(url);
    setShowQRPopup(true);
    
    try {
      const blob = await generateQRCodeImage(url);
      setQrImageBlob(blob);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
      setShowQRPopup(false);
    }
  };

  // Download QR code image
  const downloadQRCode = () => {
    if (qrImageBlob && currentQRUrl) {
      const downloadUrl = URL.createObjectURL(qrImageBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${currentQRUrl.title.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    }
  };

  // Show share preview
  const showSharePreviewHandler = (url) => {
    setSharePreviewUrl(url);
    setShowSharePreview(true);
  };

  // Actually share the URL
  const performShare = async (url) => {
    setShowSharePreview(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: url.title,
          text: url.notes || 'Gospel resource from Thai Good News',
          url: url.url
        });
      } catch (error) {
        copyToClipboard(url.url);
      }
    } else {
      copyToClipboard(url.url);
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

  // Selection management
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

  const selectByCategory = (categoryId, subcategoryId = null) => {
    const urlsInCategory = filteredUrls.filter(url => {
      if (subcategoryId) {
        return url.category === categoryId && url.subcategory === subcategoryId;
      }
      return url.category === categoryId;
    });
    
    const newSelected = new Set(selectedUrls);
    urlsInCategory.forEach(url => newSelected.add(url.id));
    setSelectedUrls(newSelected);
  };

  // Bulk actions
  const bulkDeleteSelected = () => {
    if (selectedUrls.size === 0) return;
    
    const confirmMessage = `Delete ${selectedUrls.size} selected URLs? This cannot be undone.`;
    // ESLint-compliant way to use confirm
    // eslint-disable-next-line no-restricted-globals
    if (confirm(confirmMessage)) {
      setUrls(urls.filter(url => !selectedUrls.has(url.id)));
      setSelectedUrls(new Set());
    }
  };

  const bulkCheckSelected = async () => {
    if (selectedUrls.size === 0) return;
    
    const selectedUrlObjects = urls.filter(url => selectedUrls.has(url.id));
    
    for (const url of selectedUrlObjects) {
      // Update status to checking
      setUrls(prevUrls => 
        prevUrls.map(u => 
          u.id === url.id ? { ...u, status: 'checking' } : u
        )
      );
      
      const status = await checkUrlStatus(url.url);
      setUrls(prevUrls => 
        prevUrls.map(u => 
          u.id === url.id ? { ...u, status } : u
        )
      );
    }
  };

  const bulkExportSelected = () => {
    if (selectedUrls.size === 0) return;
    
    const selectedUrlObjects = urls.filter(url => selectedUrls.has(url.id));
    const data = { 
      urls: selectedUrlObjects, 
      categories,
      exported: new Date().toISOString(),
      count: selectedUrlObjects.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tgn-selected-${selectedUrls.size}-urls-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Category management
  const checkDuplicateCategory = (name, excludeId = null) => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  };

  const checkDuplicateSubcategory = (categorySubcategories, name) => {
    return categorySubcategories.some(sub => 
      sub.toLowerCase() === name.toLowerCase()
    );
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    // Check for duplicate category
    if (checkDuplicateCategory(newCategory.name.trim())) {
      alert(`${t[language].categoryExists}: "${newCategory.name.trim()}"`);
      return;
    }
    
    // Check for duplicate subcategories within this category
    const subcategoryNames = newCategory.subcategories.filter(sub => sub.trim());
    const duplicates = [];
    const seen = new Set();
    
    subcategoryNames.forEach(sub => {
      const trimmedSub = sub.trim().toLowerCase();
      if (seen.has(trimmedSub)) {
        duplicates.push(sub.trim());
      } else {
        seen.add(trimmedSub);
      }
    });
    
    if (duplicates.length > 0) {
      alert(`${t[language].duplicateSubcategory}: ${duplicates.join(', ')}`);
      return;
    }
    
    const category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      subcategories: subcategoryNames.map(sub => ({
        id: Date.now().toString() + Math.random(),
        name: sub.trim()
      }))
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', subcategories: [''] });
  };

  const startEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditingCategoryData({
      name: category.name,
      subcategories: category.subcategories.map(sub => sub.name)
    });
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditingCategoryData({ name: '', subcategories: [] });
  };

  const updateCategory = () => {
    if (!editingCategoryData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    // Check for duplicate category (excluding current one)
    if (checkDuplicateCategory(editingCategoryData.name.trim(), editingCategory)) {
      alert(`${t[language].categoryExists}: "${editingCategoryData.name.trim()}"`);
      return;
    }
    
    // Check for duplicate subcategories within this category
    const subcategoryNames = editingCategoryData.subcategories.filter(sub => sub.trim());
    const duplicates = [];
    const seen = new Set();
    
    subcategoryNames.forEach(sub => {
      const trimmedSub = sub.trim().toLowerCase();
      if (seen.has(trimmedSub)) {
        duplicates.push(sub.trim());
      } else {
        seen.add(trimmedSub);
      }
    });
    
    if (duplicates.length > 0) {
      alert(`${t[language].duplicateSubcategory}: ${duplicates.join(', ')}`);
      return;
    }
    
    const updatedCategory = {
      id: editingCategory,
      name: editingCategoryData.name.trim(),
      subcategories: subcategoryNames.map((sub, index) => ({
        id: categories.find(c => c.id === editingCategory)?.subcategories[index]?.id || Date.now().toString() + Math.random(),
        name: sub.trim()
      }))
    };
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory ? updatedCategory : cat
    ));
    
    cancelEditCategory();
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
    const { corrected, isValid, suggestions } = validateAndCorrectUrl(newUrl.url);
    
    if (!newUrl.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!isValid) {
      alert('Please enter a valid URL');
      return;
    }
    
    // Show suggestions if any corrections were made
    if (suggestions.length > 0) {
      const confirmMessage = `URL corrections made:\n${suggestions.join('\n')}\n\nProceed with corrected URL?`;
      // ESLint-compliant way to use confirm
      // eslint-disable-next-line no-restricted-globals
      if (!confirm(confirmMessage)) {
        return;
      }
    }
    
    const url = {
      id: Date.now().toString(),
      title: newUrl.title,
      url: corrected,
      category: newUrl.category,
      subcategory: newUrl.subcategory,
      subSubcategory: newUrl.subSubcategory,
      notes: newUrl.notes,
      dateAdded: new Date().toISOString(),
      status: 'checking'
    };
    
    setUrls([...urls, url]);
    setNewUrl({ title: '', url: '', category: '', subcategory: '', subSubcategory: '', notes: '' });
    setShowAddForm(false);
    
    // Check URL status immediately after adding
    checkUrlStatus(corrected).then(status => {
      setUrls(prevUrls => 
        prevUrls.map(u => 
          u.id === url.id ? { ...u, status } : u
        )
      );
    });
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  // Bulk import
  const handleBulkImport = () => {
    const lines = bulkImportText.split('\n').filter(line => line.trim());
    const newUrls = [];
    const invalidUrls = [];
    const corrections = [];
    
    lines.forEach(line => {
      const { corrected, isValid, suggestions } = validateAndCorrectUrl(line.trim());
      if (isValid) {
        const url = {
          id: Date.now().toString() + Math.random(),
          title: corrected.replace(/^https?:\/\//, '').split('/')[0],
          url: corrected,
          category: '',
          subcategory: '',
          notes: 'Bulk imported',
          dateAdded: new Date().toISOString(),
          status: 'checking'
        };
        newUrls.push(url);
        if (suggestions.length > 0) {
          corrections.push(...suggestions);
        }
      } else {
        invalidUrls.push(line.trim());
      }
    });
    
    // Show import summary
    let message = `Import Summary:\n✅ Valid URLs: ${newUrls.length}\n❌ Invalid URLs: ${invalidUrls.length}`;
    
    if (corrections.length > 0) {
      message += `\n\n🔧 Auto-corrections made:\n${corrections.join('\n')}`;
    }
    
    if (invalidUrls.length > 0) {
      message += `\n\n❌ Invalid URLs (not imported):\n${invalidUrls.slice(0, 5).join('\n')}`;
      if (invalidUrls.length > 5) {
        message += `\n... and ${invalidUrls.length - 5} more`;
      }
    }
    
    alert(message);
    
    if (newUrls.length > 0) {
      setUrls([...urls, ...newUrls]);
      
      // Check URL status for all imported URLs
      newUrls.forEach(async (url) => {
        const status = await checkUrlStatus(url.url);
        setUrls(prevUrls => 
          prevUrls.map(u => 
            u.id === url.id ? { ...u, status } : u
          )
        );
      });
    }
    
    setBulkImportText('');
    setShowImportDialog(false);
  };

  // Check all URLs
  const checkAllUrls = async () => {
    for (const url of urls) {
      const status = await checkUrlStatus(url.url);
      
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

  // Get sub-subcategories for selected subcategory
  const getSubSubcategories = () => {
    if (selectedCategory === 'all' || selectedSubcategory === 'all') return [];
    const category = categories.find(cat => cat.id === selectedCategory);
    const subcategory = category?.subcategories.find(sub => sub.id === selectedSubcategory);
    return subcategory ? subcategory.subSubcategories || [] : [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
          {/* ─── Theme Picker ─────────────────────────────────────────────────────── */}
    <div className="p-4 bg-white shadow-sm flex items-center justify-start">
      <label className="font-medium mr-2">Theme:</label>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        className="border rounded p-1"
      >
        {themes.map(t => (
          <option key={t} value={t}>
            {t.replace(/-/g, ' ')}
          </option>
        ))}
      </select>
    </div>

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading TGN...</p>
          </div>
        </div>
      )}

      {/* Sign In Screen */}
      {!user && !isLoading && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">{t[language].title}</h1>
              <p className="text-gray-600">{t[language].signInPrompt}</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder={t[language].email}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && signInWithEmail(emailInput)}
              />
              <button
                onClick={() => signInWithEmail(emailInput)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                {t[language].signInButton}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {language === 'en' ? 'ไทย' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App (only show if user is signed in) */}
      {user && !isLoading && (
        <>
          {/* Header */}
          <header className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{t[language].title}</h1>
                <p className="text-blue-200 text-sm">{t[language].welcome}, {user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Sync Status */}
                <div className="flex items-center gap-1 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    syncStatus === 'synced' ? 'bg-green-400' :
                    syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-blue-200">{t[language][syncStatus]}</span>
                </div>
                
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
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  {t[language].signOut}
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

            {/* Selection Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAll}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Check size={14} />
                  {t[language].selectAll}
                </button>
                <button
                  onClick={selectNone}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <X size={14} />
                  {t[language].selectNone}
                </button>
                
                {/* Select by Category dropdown */}
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const [categoryId, subcategoryId] = e.target.value.split('|');
                        selectByCategory(categoryId, subcategoryId || null);
                        e.target.value = ''; // Reset dropdown
                      }
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <option value="">{t[language].selectCategory}</option>
                    {categories.map(category => (
                      <optgroup key={category.id} label={category.name}>
                        <option value={category.id}>All {category.name}</option>
                        {category.subcategories.map(sub => (
                          <option key={sub.id} value={`${category.id}|${sub.id}`}>
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected count and bulk actions */}
              {selectedUrls.size > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedUrls.size} {t[language].selectedCount}
                  </span>
                  <button
                    onClick={bulkCheckSelected}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <RefreshCw size={14} />
                    {t[language].checkSelected}
                  </button>
                  <button
                    onClick={bulkExportSelected}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Download size={14} />
                    {t[language].exportSelected}
                  </button>
                  <button
                    onClick={bulkDeleteSelected}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
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
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedUrls.has(url.id)}
                      onChange={() => toggleUrlSelection(url.id)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    
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
                          url.status === 'checking' ? 'bg-blue-100 text-blue-800' :
                          url.status === 'timeout' ? 'bg-yellow-100 text-yellow-800' :
                          url.status === 'invalid' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t[language][url.status] || url.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => generateQRCode(url)}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title={t[language].qrCode}
                      >
                        <QrCode size={16} />
                      </button>
                      <button
                        onClick={() => showSharePreviewHandler(url)}
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
                    onChange={(e) => setNewUrl({...newUrl, category: e.target.value, subcategory: '', subSubcategory: ''})}
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
                      onChange={(e) => setNewUrl({...newUrl, subcategory: e.target.value, subSubcategory: ''})}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t[language].subcategory_label}</option>
                      {categories.find(c => c.id === newUrl.category)?.subcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  )}
                  {newUrl.subcategory && (
                    <select
                      value={newUrl.subSubcategory}
                      onChange={(e) => setNewUrl({...newUrl, subSubcategory: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t[language].subSubcategory_label}</option>
                      {categories.find(c => c.id === newUrl.category)?.subcategories.find(s => s.id === newUrl.subcategory)?.subSubcategories?.map(subSub => (
                        <option key={subSub.id} value={subSub.id}>{subSub.name}</option>
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
                      {editingCategory === category.id ? (
                        // Edit mode
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder={t[language].categoryName}
                            value={editingCategoryData.name}
                            onChange={(e) => setEditingCategoryData({...editingCategoryData, name: e.target.value})}
                            className="w-full px-3 py-2 border rounded mb-2"
                          />
                          <div className="space-y-2">
                            <label className="font-medium text-sm">{t[language].subcategories}</label>
                            {editingCategoryData.subcategories.map((sub, subIndex) => (
                              <div key={subIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Subcategory name"
                                  value={sub}
                                  onChange={(e) => {
                                    const subs = [...editingCategoryData.subcategories];
                                    subs[subIndex] = e.target.value;
                                    setEditingCategoryData({...editingCategoryData, subcategories: subs});
                                  }}
                                  className="flex-1 px-3 py-1 border rounded text-sm"
                                />
                                <button
                                  onClick={() => {
                                    const subs = editingCategoryData.subcategories.filter((_, i) => i !== subIndex);
                                    setEditingCategoryData({...editingCategoryData, subcategories: subs});
                                  }}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => setEditingCategoryData({...editingCategoryData, subcategories: [...editingCategoryData.subcategories, '']})}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <Plus size={14} />
                              {t[language].addSubcategory}
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={updateCategory}
                              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                            >
                              {t[language].updateCategory}
                            </button>
                            <button
                              onClick={cancelEditCategory}
                              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                            >
                              {t[language].cancel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{category.name}</h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveCategoryUp(index)}
                                disabled={index === 0}
                                className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                                title="Move up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveCategoryDown(index)}
                                disabled={index === categories.length - 1}
                                className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                                title="Move down"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => startEditCategory(category)}
                                className="p-1 text-gray-600 hover:text-blue-600"
                                title={t[language].editCategory}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => deleteCategory(category.id)}
                                className="p-1 text-gray-600 hover:text-red-600"
                                title={t[language].delete}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Subcategories: {category.subcategories.length > 0 ? category.subcategories.map(sub => sub.name).join(', ') : 'None'}
                          </div>
                        </div>
                      )}
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

          {/* QR Code Popup */}
          {showQRPopup && currentQRUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg text-center">
                <h2 className="text-xl font-bold mb-4">QR Code for {currentQRUrl.title}</h2>
                
                {qrImageBlob ? (
                  <div className="space-y-4">
                    <img 
                      src={URL.createObjectURL(qrImageBlob)} 
                      alt="QR Code" 
                      className="mx-auto rounded-lg shadow-md"
                      style={{maxWidth: '400px', height: 'auto'}}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={downloadQRCode}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download PNG
                      </button>
                      <button
                        onClick={() => setShowQRPopup(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Generating QR code...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Share Preview Popup */}
          {showSharePreview && sharePreviewUrl && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Share Preview</h2>
                
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2">{sharePreviewUrl.title}</h3>
                  <p className="text-blue-600 text-sm mb-2 break-all">{sharePreviewUrl.url}</p>
                  {sharePreviewUrl.notes && (
                    <p className="text-gray-600 text-sm mb-2">{sharePreviewUrl.notes}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {sharePreviewUrl.category && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {categories.find(c => c.id === sharePreviewUrl.category)?.name}
                      </span>
                    )}
                    {sharePreviewUrl.subcategory && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {categories.find(c => c.id === sharePreviewUrl.category)?.subcategories.find(s => s.id === sharePreviewUrl.subcategory)?.name}
                      </span>
                    )}
                    {sharePreviewUrl.subSubcategory && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {categories.find(c => c.id === sharePreviewUrl.category)?.subcategories.find(s => s.id === sharePreviewUrl.subcategory)?.subSubcategories?.find(ss => ss.id === sharePreviewUrl.subSubcategory)?.name}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => performShare(sharePreviewUrl)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} />
                    Share Now
                  </button>
                  <button
                    onClick={() => setShowSharePreview(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TGNApp;
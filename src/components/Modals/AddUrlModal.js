import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

/**
 * Props:
 * - isOpen: boolean
 * - onOpenChange: (open: boolean) => void
 * - languages: Array<{ code: string, name: string }>
 * - categories: Array<{ id: string, name: string }>
 * - onAdd: ({ url, title, language, category }) => void
 */
export default function AddUrlModal({ isOpen, onOpenChange, languages = [], categories = [], onAdd }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = () => {
    if (!url.trim()) return;
    onAdd({ url: url.trim(), title: title.trim(), language, category });
    // reset fields
    setUrl('');
    setTitle('');
    setLanguage('');
    setCategory('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Resource</Button>
      </DialogTrigger>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Resource</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <Label htmlFor="add-url-input">URL</Label>
            <Input
              id="add-url-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="add-title-input">Title (optional)</Label>
            <Input
              id="add-title-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Resource title"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="add-language-select">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="add-language-select">
                <span>{language ? languages.find(l => l.code === language)?.name : 'Select language'}</span>
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="add-category-select">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="add-category-select">
                <span>{category ? categories.find(c => c.id === category)?.name : 'Select category'}</span>
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

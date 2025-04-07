import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, PlusCircle, Tag, Star, Clock, Calendar } from 'lucide-react';

// The default user ID we'll use until we have proper auth
const DEFAULT_USER_ID = 1;

// Types for journal entries
interface JournalEntry {
  id: number;
  userId: number;
  prompt: string;
  response: string;
  emotion?: string;
  emojiReaction?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isHighlighted: boolean;
}

interface NewJournalEntry {
  prompt: string;
  response: string;
  emotion?: string;
  emojiReaction?: string;
  tags: string[];
  isPrivate: boolean;
  isHighlighted: boolean;
}

const EMOTION_EMOJIS: Record<string, string> = {
  happy: "😄",
  excited: "🤩",
  proud: "🥳",
  calm: "😌",
  focused: "🧠",
  creative: "🎨",
  curious: "🤔",
  confused: "😕",
  tired: "😴",
  stressed: "😰",
  sad: "😢",
  frustrated: "😤",
};

export const BuddyJournal: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState<NewJournalEntry>({
    prompt: '',
    response: '',
    emotion: '',
    emojiReaction: '',
    tags: [],
    isPrivate: true,
    isHighlighted: false,
  });
  
  const [newTag, setNewTag] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'tags'
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch journal entries
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal'],
    queryFn: () => apiRequest(`/api/users/${DEFAULT_USER_ID}/buddy/journal`),
  });

  // Fetch tags for filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry: JournalEntry) => {
      entry.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [entries]);

  // Fetch entries by tag if a tag is selected
  const { data: taggedEntries = [] } = useQuery({
    queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal/tags', selectedTag],
    queryFn: () => apiRequest(`/api/users/${DEFAULT_USER_ID}/buddy/journal/tags/${selectedTag}`),
    enabled: !!selectedTag && viewMode === 'tags',
  });

  // Create journal entry mutation
  const createEntry = useMutation({
    mutationFn: (entry: NewJournalEntry) => 
      apiRequest(`/api/users/${DEFAULT_USER_ID}/buddy/journal`, { method: 'POST', body: entry }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal'] });
      setIsNewEntryOpen(false);
      setNewEntry({
        prompt: '',
        response: '',
        emotion: '',
        emojiReaction: '',
        tags: [],
        isPrivate: true,
        isHighlighted: false,
      });
      toast({
        title: "Journal Entry Created",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update journal entry mutation
  const updateEntry = useMutation({
    mutationFn: (entry: JournalEntry) => 
      apiRequest(`/api/users/${DEFAULT_USER_ID}/buddy/journal/${entry.id}`, { method: 'PATCH', body: entry }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal'] });
      if (selectedTag) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal/tags', selectedTag] 
        });
      }
      setIsEditEntryOpen(false);
      setSelectedEntry(null);
      toast({
        title: "Journal Entry Updated",
        description: "Your journal entry has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete journal entry mutation
  const deleteEntry = useMutation({
    mutationFn: (entryId: number) => 
      apiRequest(`/api/users/${DEFAULT_USER_ID}/buddy/journal/${entryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal'] });
      if (selectedTag) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/users', DEFAULT_USER_ID, 'buddy/journal/tags', selectedTag] 
        });
      }
      toast({
        title: "Journal Entry Deleted",
        description: "Your journal entry has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle new tag addition
  const handleAddTag = () => {
    if (newTag && !newEntry.tags.includes(newTag)) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, newTag],
      });
      setNewTag('');
    }
  };

  // Handle tag removal for new entry
  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Handle tag removal for edit entry
  const handleRemoveEditTag = (tagToRemove: string) => {
    if (selectedEntry) {
      setSelectedEntry({
        ...selectedEntry,
        tags: selectedEntry.tags.filter(tag => tag !== tagToRemove),
      });
    }
  };

  // Handle adding new tag in edit mode
  const handleAddEditTag = () => {
    if (newTag && selectedEntry && !selectedEntry.tags.includes(newTag)) {
      setSelectedEntry({
        ...selectedEntry,
        tags: [...selectedEntry.tags, newTag],
      });
      setNewTag('');
    }
  };

  // Create a new journal entry
  const handleCreateEntry = () => {
    createEntry.mutate(newEntry);
  };

  // Edit an existing journal entry
  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsEditEntryOpen(true);
  };

  // Save edited journal entry
  const handleSaveEditedEntry = () => {
    if (selectedEntry) {
      updateEntry.mutate(selectedEntry);
    }
  };

  // Delete journal entry
  const handleDeleteEntry = (entryId: number) => {
    if (confirm("Are you sure you want to delete this journal entry? This action cannot be undone.")) {
      deleteEntry.mutate(entryId);
    }
  };

  // Format date for display
  const formatEntryDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Get displayed entries based on view mode
  const displayedEntries = viewMode === 'tags' && selectedTag ? taggedEntries : entries;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Failed to load journal entries. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Your Journal</h1>
          <p className="text-muted-foreground">
            Record your thoughts, reflections, and learning journey
          </p>
        </div>
        <Button onClick={() => setIsNewEntryOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </header>

      <Tabs defaultValue="timeline" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger 
              value="timeline" 
              onClick={() => setViewMode('timeline')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="tags" 
              onClick={() => setViewMode('tags')}
            >
              <Tag className="mr-2 h-4 w-4" />
              By Tags
            </TabsTrigger>
          </TabsList>

          {viewMode === 'tags' && (
            <Select
              value={selectedTag || ""}
              onValueChange={(value) => setSelectedTag(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </Tabs>

      {displayedEntries.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-xl mb-4">No journal entries yet</p>
          <p className="text-muted-foreground mb-6">
            Start recording your learning journey by creating your first journal entry
          </p>
          <Button onClick={() => setIsNewEntryOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEntries.map((entry: JournalEntry) => (
            <Card key={entry.id} className={`relative ${entry.isHighlighted ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}>
              {entry.isHighlighted && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" /> Highlighted
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{entry.prompt}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatEntryDate(entry.createdAt)}
                      {entry.emotion && (
                        <span className="ml-2">
                          {EMOTION_EMOJIS[entry.emotion] || entry.emotion}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditEntry(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.response}</p>
              </CardContent>
              {entry.tags && entry.tags.length > 0 && (
                <CardFooter className="flex flex-wrap gap-2 pt-0">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => { setViewMode('tags'); setSelectedTag(tag); }}>
                      #{tag}
                    </Badge>
                  ))}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* New Entry Dialog */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>
              Record your thoughts, reflections, and learning experiences
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt">Prompt/Question</Label>
              <Input
                id="prompt"
                placeholder="What did you learn today?"
                value={newEntry.prompt}
                onChange={(e) => setNewEntry({ ...newEntry, prompt: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                placeholder="Write your response here..."
                rows={6}
                value={newEntry.response}
                onChange={(e) => setNewEntry({ ...newEntry, response: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="emotion">How do you feel?</Label>
                <Select
                  value={newEntry.emotion || ""}
                  onValueChange={(value) => setNewEntry({ 
                    ...newEntry, 
                    emotion: value,
                    emojiReaction: value ? EMOTION_EMOJIS[value] : ''
                  })}
                >
                  <SelectTrigger id="emotion">
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No emotion</SelectItem>
                    {Object.entries(EMOTION_EMOJIS).map(([emotion, emoji]) => (
                      <SelectItem key={emotion} value={emotion}>
                        {emoji} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Add Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </div>
            {newEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newEntry.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="text-xs rounded-full hover:bg-muted p-1"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="private" 
                checked={newEntry.isPrivate}
                onCheckedChange={(checked) => 
                  setNewEntry({ ...newEntry, isPrivate: checked === true })
                }
              />
              <Label htmlFor="private">Keep this entry private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="highlight" 
                checked={newEntry.isHighlighted}
                onCheckedChange={(checked) => 
                  setNewEntry({ ...newEntry, isHighlighted: checked === true })
                }
              />
              <Label htmlFor="highlight">Highlight this entry</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEntry} disabled={!newEntry.prompt || !newEntry.response}>
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditEntryOpen} onOpenChange={setIsEditEntryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Journal Entry</DialogTitle>
            <DialogDescription>
              Update your journal entry
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-prompt">Prompt/Question</Label>
                <Input
                  id="edit-prompt"
                  value={selectedEntry.prompt}
                  onChange={(e) => 
                    setSelectedEntry({ ...selectedEntry, prompt: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-response">Your Response</Label>
                <Textarea
                  id="edit-response"
                  rows={6}
                  value={selectedEntry.response}
                  onChange={(e) => 
                    setSelectedEntry({ ...selectedEntry, response: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-emotion">How do you feel?</Label>
                  <Select
                    value={selectedEntry.emotion || ""}
                    onValueChange={(value) => setSelectedEntry({ 
                      ...selectedEntry, 
                      emotion: value,
                      emojiReaction: value ? EMOTION_EMOJIS[value] : ''
                    })}
                  >
                    <SelectTrigger id="edit-emotion">
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No emotion</SelectItem>
                      {Object.entries(EMOTION_EMOJIS).map(([emotion, emoji]) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emoji} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-tags">Add Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-tags"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddEditTag()}
                    />
                    <Button type="button" onClick={handleAddEditTag} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        onClick={() => handleRemoveEditTag(tag)}
                        className="text-xs rounded-full hover:bg-muted p-1"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-private" 
                  checked={selectedEntry.isPrivate}
                  onCheckedChange={(checked) => 
                    setSelectedEntry({ ...selectedEntry, isPrivate: checked === true })
                  }
                />
                <Label htmlFor="edit-private">Keep this entry private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-highlight" 
                  checked={selectedEntry.isHighlighted}
                  onCheckedChange={(checked) => 
                    setSelectedEntry({ ...selectedEntry, isHighlighted: checked === true })
                  }
                />
                <Label htmlFor="edit-highlight">Highlight this entry</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEntryOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditedEntry} 
              disabled={!selectedEntry || !selectedEntry.prompt || !selectedEntry.response}
            >
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuddyJournal;
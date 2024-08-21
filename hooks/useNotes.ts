import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@/context/axiosConfig";
import NetInfo from '@react-native-community/netinfo';

export interface Note {
  _id: string;
  title: string;
  description: string;
}

export interface NewNote {
  _id?: string; 
  title: string;
  description: string;
}

export interface UpdatedNote {
  _id?: string;
  title?: string;
  description?: string;
}

interface OfflineAction {
  type: 'add' | 'update' | 'delete';
  id?: string;
  note?: NewNote | UpdatedNote;
}

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [queue, setQueue] = useState<OfflineAction[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  useEffect(() => {
    loadNotes();
    if (!isProcessingQueue) {
      syncNotesWithServer();
    }
    
 NetInfo.addEventListener((state) => {
      if (state.isConnected && !isProcessingQueue) {
        processQueue();
      }
    });

    // return () => unsubscribe();
  }, []); 

  const loadNotes = useCallback(async () => {
    const storedNotes = await AsyncStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes) as Note[]);
    }
  }, []);

  const syncNotesWithServer = useCallback(async () => {
    try {
      const { data } = await axios.get<{ posts: Note[] }>("post/get-posts");
      setNotes(data.posts);
      await AsyncStorage.setItem("notes", JSON.stringify(data.posts));
    } catch (error) {
      console.error("Failed to sync notes with server:", error);
    }
  }, []);

  const addNote = useCallback(async (note: NewNote) => {
    const tempNote: Note = { _id: generateTempId(), ...note };
    const updatedNotes = [...notes, tempNote];
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

    queueChange({ type: 'add', note });
  }, [notes]);

  const updateNote = useCallback(async (id: string, updatedContent: UpdatedNote) => {
    const updatedNotes = notes.map((note) =>
      note._id === id ? { ...note, ...updatedContent } : note
    );
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

    queueChange({ type: 'update', id, note: updatedContent });
  }, [notes]);

  const deleteNote = useCallback(async (id: string) => {
    const updatedNotes = notes.filter((note) => note._id !== id);
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

    queueChange({ type: 'delete', id });
  }, [notes]);

  const queueChange = useCallback(async (action: OfflineAction) => {
    const storedQueue = await AsyncStorage.getItem('queue');
    const currentQueue = storedQueue ? JSON.parse(storedQueue) : [];

    const newQueue = [...currentQueue, action];
    await AsyncStorage.setItem('queue', JSON.stringify(newQueue));
    setQueue(newQueue);
  }, []);

  const processQueue = useCallback(async () => {
    const storedQueue = await AsyncStorage.getItem('queue');
    const currentQueue: OfflineAction[] = storedQueue ? JSON.parse(storedQueue) : [];
  
    setIsProcessingQueue(true);
  
    const updatedNotes = [...notes];
  
    for (const action of currentQueue) {
      try {
        if (action.type === 'add') {
          const { data } = await axios.post('post/create-post', action.note);
          const tempNoteIndex = updatedNotes.findIndex(note => note._id === action.note?._id);
          if (tempNoteIndex !== -1) {
            updatedNotes[tempNoteIndex]._id = data.savedPost._id;
          }
        } else if (action.type === 'update') {
          await axios.put(`post/update-post/${action.id}`, action.note);
        } else if (action.type === 'delete') {
          await axios.delete(`post/delete-post/${action.id}`);
        }
      } catch (error) {
        console.error("Failed to process queue item:", error);
        setIsProcessingQueue(false);
        return;
      }
    }
  
    await AsyncStorage.removeItem('queue');
    setQueue([]);
    setNotes(updatedNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setIsProcessingQueue(false);
    await syncNotesWithServer();
  }, [notes]);
  
  const generateTempId = () => {
    return 'temp-' + Math.random().toString(36).substr(2, 9);
  };

  return { notes, addNote, updateNote, deleteNote, loadNotes, syncNotesWithServer };
};

export default useNotes;

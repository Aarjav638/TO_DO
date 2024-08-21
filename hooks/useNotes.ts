
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@/context/axiosConfig";
import NetInfo from '@react-native-community/netinfo';

export interface Note {
  _id: string;
  title: string;
  description: string;
  image?: string;
}

export interface NewNote {
  _id?: string;
  title: string;
  description: string;
  imageUri?: string;
}

export interface UpdatedNote {
  _id?: string;
  title?: string;
  description?: string;
  imageUri?: string;
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
  const [hasFetchedNotes, setHasFetchedNotes] = useState(false);

  const processQueue = useCallback(async () => {
    if (isProcessingQueue || queue.length === 0) return;

    console.log("Processing queue...");
    setIsProcessingQueue(true);

    for (const action of queue) {
      try {
        if (action.type === 'add') {
          const { data } = await axios.post('post/create-post', action.note);
          setNotes((prevNotes) => prevNotes.map(note => 
            note._id === action.note?._id ? { ...note, _id: data.savedPost._id } : note
          ));
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
    setIsProcessingQueue(false);
  }, [queue, isProcessingQueue]);

  useEffect(() => {
    const syncNotes = async () => {
      console.log("useEffect for loading and syncing notes");
      await syncNotesWithServer(); // Syncs with the server
    };
  
    if (!hasFetchedNotes) {  // Prevents multiple fetches
      syncNotes();
      setHasFetchedNotes(true); // Updates state to indicate fetch has occurred
    }
  
    // Process queue when the device is online
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !isProcessingQueue) {
        processQueue();
      }
      else if (!state.isConnected) {
        setIsProcessingQueue(false);
      }
    });
  
    return () => unsubscribe();  // Clean up the NetInfo subscription
  
  }, [hasFetchedNotes, isProcessingQueue, processQueue]);  // Dependency array
  
  const loadNotes = useCallback(async (storedNotes:Note[]) => {
    console.log("Loading notes from AsyncStorage...");
    
    if (storedNotes) {
      setNotes(storedNotes);
      console.log("Notes loaded from AsyncStorage:", storedNotes);
    }
  }, []);

  const syncNotesWithServer = useCallback(async () => {
    console.log("Syncing notes with server...");
    try {
      const { data } = await axios.get<{ posts: Note[] }>("post/get-posts");
      setNotes(data.posts);
      await AsyncStorage.setItem("notes", JSON.stringify(data.posts));
      console.log("Notes synced with server:", data.posts);
    } catch (error) {
      console.error("Failed to sync notes with server:", (error as any)?.message);
      alert("Network error: Failed to sync notes with server");
    }
  }, []);

  const addNote = useCallback(async (note: NewNote) => {
    console.log("Adding note locally:", note);
    const tempNote: Note = { _id: generateTempId(), ...note };
    setNotes((prevNotes) => [...prevNotes, tempNote]);
    await AsyncStorage.setItem("notes", JSON.stringify([...notes, tempNote]));

    queueChange({ type: 'add', note });
  }, [notes]);

  const updateNote = useCallback(async (id: string, updatedContent: UpdatedNote) => {
    console.log("Updating note locally:", id, updatedContent);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id ? { ...note, ...updatedContent } : note
      )
    );
    await AsyncStorage.setItem("notes", JSON.stringify(notes));

    queueChange({ type: 'update', id, note: updatedContent });
  }, [notes]);

  const deleteNote = useCallback(async (id: string) => {
    console.log("Deleting note locally:", id);
    setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    await AsyncStorage.setItem("notes", JSON.stringify(notes));

    queueChange({ type: 'delete', id });
  }, [notes]);

  const queueChange = useCallback(async (action: OfflineAction) => {
    console.log("Queueing change:", action);
    const storedQueue = await AsyncStorage.getItem('queue');
    const currentQueue = storedQueue ? JSON.parse(storedQueue) : [];

    const newQueue = [...currentQueue, action];
    await AsyncStorage.setItem('queue', JSON.stringify(newQueue));
    setQueue(newQueue);
  }, []);

  const generateTempId = () => {
    const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);
    console.log("Generated temp ID:", tempId);
    return tempId;
  };

  return { notes, addNote, updateNote, deleteNote, loadNotes, syncNotesWithServer };
};

export default useNotes;

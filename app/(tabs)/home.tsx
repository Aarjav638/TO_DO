import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AuthContext from "@/context/auth/authContext";
import useNotes, { Note } from "@/hooks/useNotes";
import RenderHtml from "react-native-render-html";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { syncNotesWithServer, notes, loadNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [hasFetchedNotes, setHasFetchedNotes] = useState(false);
  const loadNotesFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading notes from AsyncStorage...");
      await loadNotes();
      await syncNotesWithServer();
      setLoading(false);
    } catch (error) {
      console.error("Failed to load notes from storage:", error);
      Alert.alert("An error occurred while loading notes");
      setLoading(false);
    }
  }, [loadNotes, syncNotesWithServer]);

  useFocusEffect(
    useCallback(() => {
      loadNotesFromStorage();
    }, [loadNotesFromStorage])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadNotesFromStorage();
      setRefreshing(false);
      alert("Notes synced successfully");
    } catch (error) {
      console.error("Failed to sync notes:", error);
      alert("An error occurred while syncing notes");
      setRefreshing(false);
    }
  }, [loadNotesFromStorage]);

  const handleNavigateToDetails = async (noteId: string) => {
    const noteExists = notes.some((note) => note._id === noteId);
    if (noteExists) {
      router.push(`/notedetails/${noteId}`);
    } else {
      Alert.alert("Error", "Note not found. Please try syncing your notes.");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF8E01" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {user?.name}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#7b7b8b"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => handleNavigateToDetails(item._id)}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: item.description }}
              baseStyle={styles.noteDescription}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes available</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <CustomButton
        title="Add Note"
        onPress={() => {
          router.push("/addnotes");
        }}
        style={styles.addButton}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },
  searchInput: {
    marginTop: 16,
    backgroundColor: "#1E1E2D",
    borderColor: "#232533",
    borderWidth: 2,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  noteItem: {
    backgroundColor: "#232533",
    borderRadius: 12,
    padding: 16,
    flexDirection: "column",
    flex: 1,
    marginVertical: 8,
  },
  noteTitle: {
    fontSize: 18,
    color: "#FF9C01",
    fontFamily: "Poppins-SemiBold",
  },
  noteDescription: {
    color: "#CDCDE0",
    fontFamily: "Poppins-Regular",
    marginTop: 8,
  },
  emptyText: {
    color: "#CDCDE0",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#FF8E01",
  },
});

export default HomeScreen;

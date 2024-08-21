import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AuthContext from "@/context/auth/authContext";
import useNotes from "@/hooks/useNotes";
import RenderHtml from "react-native-render-html";

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { notes, loadNotes, syncNotesWithServer } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadNotes();
  }, [notes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncNotesWithServer();
    setRefreshing(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link
            href={{
              pathname: "/notedetails/[id]",
              params: { id: item._id },
            }}
            key={item._id}
            style={styles.noteItem}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: item.description }}
              baseStyle={styles.noteDescription}
            />
          </Link>
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

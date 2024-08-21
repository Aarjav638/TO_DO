import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import useNotes from "@/hooks/useNotes";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const AddNotes: React.FC = () => {
  const { addNote, updateNote, notes } = useNotes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const richText = useRef<RichEditor>(null);
  const router = useRouter();

  const handleSaveNote = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await addNote({ title, description });
      Alert.alert("Success", "Note added successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving the note");
    }

    setTitle(""); // Reset title
    setDescription(""); // Reset description
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.header}>{"Add Note"}</Text>
            <FormField
              title="Title"
              value={title}
              placeholder="Enter title"
              handleChange={setTitle}
              textInputStyles={styles.formField}
            />
            <RichEditor
              ref={richText}
              style={styles.richTextEditor}
              placeholder="Enter description"
              initialContentHTML={description}
              onChange={(text) => setDescription(text)}
            />
            <RichToolbar
              editor={richText}
              actions={[
                "bold",
                "italic",
                "underline",
                "unorderedList",
                "orderedList",
                "link",
              ]}
              style={styles.richToolbar}
            />
            <CustomButton
              title="Save Note"
              onPress={handleSaveNote}
              containerStyles={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  formField: {
    marginBottom: 20,
  },
  richTextEditor: {
    backgroundColor: "#1E1E2D",
    color: "#FFFFFF",
    borderColor: "#232533",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  richToolbar: {
    backgroundColor: "#1E1E2D",
    borderColor: "#232533",
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 10,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default AddNotes;

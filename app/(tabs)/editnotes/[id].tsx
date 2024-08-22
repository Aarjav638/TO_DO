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
import * as ImagePicker from "expo-image-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const EditNotes: React.FC = () => {
  const { updateNote, notes } = useNotes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const richText = useRef<RichEditor>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string>("");
  useEffect(() => {
    if (id) {
      const note = notes.find((n) => n._id === id);
      if (note) {
        setTitle(note.title);
        setDescription(note.description);
      }
    } else {
      setTitle("");
      setDescription("");
    }
  }, [id]);

  const handleSaveNote = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    console.log("id", id);

    try {
      if (id) {
        await updateNote(id.toString(), { title, description, imageUri });
        Alert.alert(
          "Success",
          "Note updated successfully 🎉 \nPull down to refresh "
        );
      }

      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving the note");
    }
    setDescription("");
    setTitle("");
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      richText.current?.insertImage(result.assets[0].uri);
    }
  };
  if (!id) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: "#161622", padding: 16 }]}
      >
        <Text style={styles.header}>{"Edit Note"}</Text>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.descriptionLabel, { textAlign: "center" }]}>
            {"Note not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: "#161622", padding: 14 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 50}
        >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <Text style={styles.header}>{"Edit Note"}</Text>
              <FormField
                title="Title"
                value={title}
                placeholder="Enter title"
                handleChange={setTitle}
                textInputStyles={styles.formField}
              />
              <Text style={styles.descriptionLabel}>Description</Text>
              <View style={styles.richEditorContainer}>
                <RichToolbar
                  style={{ backgroundColor: "#232533" }}
                  selectedIconTint="#FF8E01"
                  editor={richText}
                  actions={[
                    "bold",
                    "italic",
                    "underline",
                    "unorderedList",
                    "orderedList",
                    "link",
                    "customImage",
                  ]}
                  iconMap={{
                    customImage: () => <Text onPress={pickImage}>🖼️</Text>,
                  }}
                />
                <RichEditor
                  ref={richText}
                  style={styles.richTextEditor}
                  placeholder="Enter description"
                  initialContentHTML={description}
                  onChange={(text) => setDescription(text)}
                />
              </View>
              <CustomButton
                title="Save Note"
                onPress={handleSaveNote}
                containerStyles={styles.saveButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  formField: {
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  descriptionLabel: {
    color: "#FFFFFF",
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  richEditorContainer: {
    flex: 1,
    backgroundColor: "#1E1E2D",
    borderColor: "#232533",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 40,
    minHeight: 300,
  },
  richTextEditor: {
    backgroundColor: "#1E1E2D",
    color: "#FFFFFF",
    minHeight: 300, // Ensure the RichEditor has a minimum height

    borderRadius: 12,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default EditNotes;

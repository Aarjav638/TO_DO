import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import useNotes, { Note } from "@/hooks/useNotes"; // Import Note type
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { manipulateAsync } from "expo-image-manipulator";
import { set } from "lodash";

interface NoteDetails extends Note {
  image: string;
}
const NoteDetails: React.FC = () => {
  const { notes, deleteNote } = useNotes();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = React.useState(true);
  const [note, setNote] = React.useState<Note>();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const note = notes.find((n) => n._id === id);
      if (note) {
        console.log("Note", note);
        setNote(note);
        setLoading(false);
      }
    }
  }, [id, notes]);

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
  console.log("id", id);
  // console.log("Note", note);

  if (!note) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Note not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteNote(id!);
      Alert.alert(
        "Success",
        "Note deleted successfully 🎉\n Pull down to refresh "
      );
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the note");
    }
  };

  const exportToTxt = async () => {
    try {
      const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9]/g, "_");
      const path = `${FileSystem.documentDirectory}${sanitizedTitle}.txt`;
      await FileSystem.writeAsStringAsync(path, note.description, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(path, { dialogTitle: "Share as .txt" });
    } catch (error) {
      console.error("Error exporting to txt: ", error);
      Alert.alert("Error", "An error occurred while exporting the note");
    }
  };

  const exportToPdf = async (imageUri: string) => {
    try {
      let base64Image = "";
      if (imageUri) {
        const manipulatedImage = await manipulateAsync(imageUri, [], {
          base64: true,
        });
        base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;
      }

      const htmlContent = `
        <html>
          <head>
            <title>${note.title}</title>
          </head>
          <body>
            <h1>${note.title}</h1>
            <p>${note.description}</p>
            ${base64Image ? `<img src="${base64Image}" alt="Note Image"/>` : ""}
          </body>
        </html>
      `;

      // Generate the PDF from the HTML content
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Share the generated PDF
      await Sharing.shareAsync(uri, { dialogTitle: "Share as .pdf" });
    } catch (error) {
      console.error("Error exporting to pdf: ", error);
      Alert.alert("Error", "An error occurred while exporting the note");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.description}>{note.description}</Text>
        <CustomButton
          title="Export as .txt"
          onPress={exportToTxt}
          containerStyles={styles.button}
        />
        <CustomButton
          title="Export as .pdf"
          onPress={() => {
            if (note?.image) {
              exportToPdf(note.image);
            } else {
              Alert.alert("Error", "No image available to export");
            }
          }}
          containerStyles={styles.button}
        />
        <CustomButton
          title="Edit Note"
          onPress={() => router.push(`/editnotes/${id}`)}
          containerStyles={styles.button}
        />
        <CustomButton
          title="Delete Note"
          onPress={handleDelete}
          containerStyles={styles.deleteButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#FF9C01",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  description: {
    color: "#CDCDE0",
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: "#FF0000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 200,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
});

export default NoteDetails;

import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { GadgetInfo, GadgetInfoLink } from "../../../../shared-ts/gadgets";

type Props = {
  info: GadgetInfo;
  tintColor?: string;
};

export function GadgetInfoHeaderButton({ info, tintColor = "#2563eb" }: Props) {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        accessibilityLabel="Gadget information"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <Ionicons color={tintColor} name="information-circle-outline" size={28} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <View
          style={[
            styles.popoverRoot,
            { paddingRight: 12 + insets.right, paddingTop: 56 + insets.top },
          ]}
        >
          <Pressable
            accessibilityLabel="Close gadget information"
            onPress={() => setVisible(false)}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.popover}>
            <View style={styles.header}>
              <Text style={styles.title}>Info</Text>
              <Pressable
                accessibilityLabel="Close gadget information"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setVisible(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Ionicons color="#525252" name="close" size={22} />
              </Pressable>
            </View>

            <ScrollView bounces={false} contentContainerStyle={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sources</Text>
                <View style={styles.sourceList}>
                  {info.sources.map((source) => (
                    <SourceRow key={source.url} source={source} />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available</Text>
                <Text style={styles.availableText}>
                  {info.availableIn.join(", ")}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function SourceRow({ source }: { source: GadgetInfoLink }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => {
        void Linking.openURL(source.url);
      }}
      style={({ pressed }) => [
        styles.sourceRow,
        pressed ? styles.sourceRowPressed : null,
      ]}
    >
      <View style={styles.sourceText}>
        <Text style={styles.sourceLabel}>{source.label}</Text>
        <Text numberOfLines={2} style={styles.sourceUrl}>
          {source.url}
        </Text>
      </View>
      <Ionicons color="#a3a3a3" name="open-outline" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  availableText: {
    color: "#525252",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  content: {
    gap: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  popover: {
    backgroundColor: "#ffffff",
    borderColor: "#d4d4d4",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    maxHeight: 520,
    padding: 18,
    shadowColor: "#171717",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    width: 360,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 18px 45px rgba(23, 23, 23, 0.18)" }
      : null),
  },
  popoverRoot: {
    alignItems: "flex-end",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "flex-start",
  },
  pressed: {
    opacity: 0.45,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: "#525252",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  sourceLabel: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "700",
  },
  sourceList: {
    gap: 8,
  },
  sourceRow: {
    alignItems: "center",
    borderColor: "#e5e5e5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sourceRowPressed: {
    backgroundColor: "#f5f5f5",
  },
  sourceText: {
    flex: 1,
    gap: 3,
  },
  sourceUrl: {
    color: "#2563eb",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  title: {
    color: "#171717",
    fontSize: 20,
    fontWeight: "700",
  },
});

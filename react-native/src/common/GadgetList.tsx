import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GADGETS } from "./gadgetCatalog";
import type { RootStackParamList } from "./navigationTypes";

type Props = NativeStackScreenProps<RootStackParamList, "GadgetList">;

export function GadgetList({ navigation }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.list}>
        {GADGETS.map((gadget, index) => (
          <Pressable
            accessibilityRole="button"
            key={gadget.mode}
            onPress={() => {
              navigation.navigate("GadgetRunner", { mode: gadget.mode });
            }}
            style={({ pressed }) => [
              styles.listItem,
              index === 0 ? styles.firstListItem : null,
              pressed ? styles.listItemPressed : null,
            ]}
          >
            <Text numberOfLines={1} style={styles.listItemLabel}>
              {gadget.label}
            </Text>
            <Ionicons color="#a3a3a3" name="chevron-forward" size={20} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    backgroundColor: "#ffffff",
    borderColor: "#d4d4d4",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  listItem: {
    alignItems: "center",
    borderTopColor: "#e5e5e5",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 16,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  listItemLabel: {
    color: "#171717",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  listItemPressed: {
    backgroundColor: "#f5f5f5",
  },
});

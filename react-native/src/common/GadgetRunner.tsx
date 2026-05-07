import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { getGadget } from "./gadgetCatalog";
import type { RootStackParamList } from "./navigationTypes";

type Props = NativeStackScreenProps<RootStackParamList, "GadgetRunner">;

export function GadgetRunner({ route }: Props) {
  const gadget = getGadget(route.params.mode);

  return (
    <View style={styles.detailScreen}>
      <Text style={styles.emptyText}>{gadget?.label ?? "No preview."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailScreen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    color: "#737373",
    fontSize: 15,
  },
});

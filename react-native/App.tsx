import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GadgetInfoHeaderButton } from "./src/common/GadgetInfoHeaderButton";
import { GadgetList } from "./src/common/GadgetList";
import { GadgetRunner } from "./src/common/GadgetRunner";
import { getGadget } from "./src/common/gadgetCatalog";
import type { RootStackParamList } from "./src/common/navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="GadgetList"
          screenOptions={{
            contentStyle: styles.navigationContent,
            headerLargeTitle: true,
          }}
        >
          <Stack.Screen
            component={GadgetList}
            name="GadgetList"
            options={{ title: "Shader Gadgets" }}
          />
          <Stack.Screen
            name="GadgetRunner"
            options={({ route }) => {
              const gadget = getGadget(route.params.mode);

              return {
                headerBackButtonDisplayMode: "minimal",
                headerLargeTitle: false,
                headerRight: gadget
                  ? ({ tintColor }) => (
                      <GadgetInfoHeaderButton
                        info={gadget.info}
                        tintColor={tintColor}
                      />
                    )
                  : undefined,
                title: gadget?.label ?? "Shader Gadget",
              };
            }}
            component={GadgetRunner}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navigationContent: {
    backgroundColor: "#ffffff",
  },
});

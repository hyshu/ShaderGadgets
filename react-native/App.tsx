import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { ShaderGadgetSourceFactory } from "../shared-ts/gadgets";
import { GadgetInfoHeaderButton } from "./src/common/GadgetInfoHeaderButton";
import { GadgetList } from "./src/common/GadgetList";
import { GadgetRunner } from "./src/common/GadgetRunner";
import {
  createSourceFactory,
  getGadget,
  loadShaderSources,
  type SourceMap,
} from "./src/common/gadgetCatalog";
import type { RootStackParamList } from "./src/common/navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [sources, setSources] = useState<SourceMap | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadShaderSources()
      .then((nextSources) => {
        if (!cancelled) {
          setSources(nextSources);
        }
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Failed to load textures.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sourceFactory = useMemo<ShaderGadgetSourceFactory | null>(() => {
    return sources ? createSourceFactory(sources) : null;
  }, [sources]);

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
                headerRight: ({ tintColor }) => (
                  <GadgetInfoHeaderButton
                    info={gadget.info}
                    tintColor={tintColor}
                  />
                ),
                title: gadget.label,
              };
            }}
          >
            {(props) => (
              <GadgetRunner
                {...props}
                error={error}
                sourceFactory={sourceFactory}
              />
            )}
          </Stack.Screen>
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

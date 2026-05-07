import {
  Button as SwiftUIButton,
  Host,
  Link as SwiftUILink,
  Popover,
  Text as SwiftUIText,
  VStack,
} from "@expo/ui/swift-ui";
import {
  background,
  border,
  buttonStyle,
  controlSize,
  cornerRadius,
  font,
  foregroundStyle,
  frame,
  labelStyle,
  lineLimit,
  padding,
  shapes,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import type { GadgetInfo, GadgetInfoLink } from "../../../../shared-ts/gadgets";

type Props = {
  info: GadgetInfo;
  tintColor?: string;
};

export function GadgetInfoHeaderButton({ info, tintColor = "#2563eb" }: Props) {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host matchContents style={styles.host}>
      <Popover
        arrowEdge="top"
        attachmentAnchor="center"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
      >
        <Popover.Trigger>
          <SwiftUIButton
            label="Gadget information"
            modifiers={[
              labelStyle("iconOnly"),
              buttonStyle("borderless"),
              controlSize("regular"),
              tint(tintColor),
            ]}
            onPress={() => setIsPresented(true)}
            systemImage="info.circle"
          />
        </Popover.Trigger>

        <Popover.Content>
          <GadgetInfoPopover info={info} />
        </Popover.Content>
      </Popover>
    </Host>
  );
}

function GadgetInfoPopover({ info }: { info: GadgetInfo }) {
  return (
    <VStack
      alignment="leading"
      modifiers={[frame({ width: 360 }), padding({ all: 20 })]}
      spacing={20}
    >
      <SwiftUIText
        modifiers={[
          font({ size: 22, weight: "bold" }),
          foregroundStyle({ type: "hierarchical", style: "primary" }),
        ]}
      >
        Info
      </SwiftUIText>

      <VStack alignment="leading" spacing={10}>
        <SectionTitle title="Sources" />

        <VStack alignment="leading" spacing={8}>
          {info.sources.map((source) => (
            <SourceLink key={source.url} source={source} />
          ))}
        </VStack>
      </VStack>

      <VStack alignment="leading" spacing={8}>
        <SectionTitle title="Available" />
        <SwiftUIText
          modifiers={[
            font({ size: 15, weight: "regular" }),
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {info.availableIn.join(", ")}
        </SwiftUIText>
      </VStack>
    </VStack>
  );
}

function SourceLink({ source }: { source: GadgetInfoLink }) {
  return (
    <SwiftUILink destination={source.url}>
      <VStack
        alignment="leading"
        modifiers={[
          frame({ width: 320, alignment: "leading" }),
          padding({ all: 12 }),
          background("#ffffff", shapes.roundedRectangle({ cornerRadius: 8 })),
          cornerRadius(8),
          border({ color: "#d4d4d4", width: 1 }),
        ]}
        spacing={4}
      >
        <SwiftUIText
          modifiers={[
            font({ size: 16, weight: "semibold" }),
            foregroundStyle({ type: "hierarchical", style: "primary" }),
          ]}
        >
          {source.label}
        </SwiftUIText>
        <SwiftUIText
          modifiers={[
            font({ size: 12 }),
            lineLimit(2),
            foregroundStyle("#2563eb"),
          ]}
        >
          {source.url}
        </SwiftUIText>
      </VStack>
    </SwiftUILink>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <SwiftUIText
      modifiers={[
        font({ size: 12, weight: "bold" }),
        foregroundStyle({ type: "hierarchical", style: "secondary" }),
      ]}
    >
      {title.toUpperCase()}
    </SwiftUIText>
  );
}

const styles = {
  host: {
    minHeight: 32,
    minWidth: 32,
  },
};

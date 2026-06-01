import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GROUPS, GROUP_LABELS, Group } from "../data/hiragana";

interface Props {
  selected: Group;
  onSelect: (g: Group) => void;
}

export default function GroupFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {GROUPS.map((g) => (
        <TouchableOpacity
          key={g}
          onPress={() => onSelect(g)}
          style={[styles.btn, selected === g && styles.btnActive]}
        >
          <Text style={[styles.label, selected === g && styles.labelActive]}>
            {GROUP_LABELS[g]}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  btn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 6, borderWidth: 1, borderColor: "#333",
  },
  btnActive: { backgroundColor: "#fff", borderColor: "#fff" },
  label: { fontSize: 13, color: "#888", letterSpacing: 1 },
  labelActive: { color: "#0f0f0f" },
});

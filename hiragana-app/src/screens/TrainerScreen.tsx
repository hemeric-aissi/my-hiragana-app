import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HIRAGANA, ALL_CHARS, WORDS, Group,
  CharEntry, WordEntry, getRand,
} from "../data/hiragana";
import GroupFilter from "../components/GroupFilter";

type Mode = "chars" | "words";
type Feedback = { ok: boolean; text: string; translation: string | null } | null;

const SCORE_KEY = "hiragana_score";

export default function TrainerScreen() {
  const [mode, setMode] = useState<Mode>("chars");
  const [group, setGroup] = useState<Group>("all");
  const [current, setCurrent] = useState<CharEntry | WordEntry | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [waiting, setWaiting] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<TextInput>(null);

  // Load saved score
  useEffect(() => {
    AsyncStorage.getItem(SCORE_KEY).then((val) => {
      if (val) {
        const saved = JSON.parse(val);
        setScore(saved.score ?? 0);
        setTotal(saved.total ?? 0);
        setStreak(saved.streak ?? 0);
      }
    });
  }, []);

  // Save score
  useEffect(() => {
    AsyncStorage.setItem(SCORE_KEY, JSON.stringify({ score, total, streak }));
  }, [score, total, streak]);

  const getPool = useCallback(() => {
    if (mode === "words") return WORDS;
    return group === "all" ? ALL_CHARS : (HIRAGANA[group] ?? ALL_CHARS);
  }, [mode, group]);

  const next = useCallback(() => {
    setCurrent(getRand(getPool()));
    setInput("");
    setFeedback(null);
    setWaiting(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [getPool]);

  useEffect(() => { next(); }, [mode, group]);

  const check = useCallback(() => {
    if (waiting || !current) return;
    const val = input.trim().toLowerCase();
    if (!val) return;
    Keyboard.dismiss();
    setWaiting(true);
    setTotal((t) => t + 1);
    const answer = current[1];
    const translation = mode === "words" && current[2] ? (current as WordEntry)[2] : null;
    if (val === answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback({ ok: true, text: "Correct !", translation });
      setTimeout(() => next(), translation ? 1800 : 900);
    } else {
      setStreak(0);
      setFeedback({ ok: false, text: `Faux — c'était : ${answer}`, translation });
    }
  }, [waiting, current, input, next, mode]);

  const resetScore = () => {
    setScore(0); setTotal(0); setStreak(0);
    AsyncStorage.removeItem(SCORE_KEY);
    next();
  };

  const isWord = mode === "words";
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>ENTRAÎNEMENT</Text>
          <Text style={styles.title}>Hiragana</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeRow}>
          {(["chars", "words"] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === "chars" ? "Caractères" : "Mots"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Group filter */}
        {!isWord && (
          <GroupFilter selected={group} onSelect={setGroup} />
        )}

        {/* Card */}
        <View style={[styles.card, isWord && styles.cardWord]}>
          <Text style={[styles.charDisplay, isWord && styles.wordDisplay]}>
            {current?.[0] ?? "？"}
          </Text>
          {isWord && (
            <Text style={styles.cardHint}>hiragana → romaji</Text>
          )}
        </View>

        {/* Feedback */}
        {feedback ? (
          <View style={[styles.feedback, feedback.ok ? styles.feedbackOk : styles.feedbackWrong]}>
            <Text style={[styles.feedbackText, feedback.ok ? styles.feedbackTextOk : styles.feedbackTextWrong]}>
              {feedback.ok ? "✓ " : "✗ "}{feedback.text}
            </Text>
            {feedback.translation && (
              <Text style={styles.translation}>{feedback.translation}</Text>
            )}
          </View>
        ) : (
          <View style={styles.feedbackEmpty} />
        )}

        {/* Input */}
        <TextInput
          ref={inputRef}
          value={input}
          onChangeText={(t) => { if (!waiting) setInput(t); }}
          onSubmitEditing={check}
          placeholder="romaji..."
          placeholderTextColor="#555"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          style={styles.input}
        />

        {/* Buttons */}
        <View style={styles.btnRow}>
          {!waiting || (feedback && feedback.ok) ? (
            <TouchableOpacity onPress={check} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Valider</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={next} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Suivant →</Text>
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={styles.stats}>
            <Text style={styles.statText}>
              <Text style={styles.statValue}>{score}/{total}</Text>
              {"  "}
              <Text style={styles.statValue}>{accuracy}%</Text>
              {"  "}🔥<Text style={styles.statValue}>{streak}</Text>
            </Text>
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity onPress={resetScore} style={styles.resetBtn}>
          <Text style={styles.resetText}>Réinitialiser</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f0f0f" },
  scroll: { padding: 20, paddingTop: 40, flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 28 },
  subtitle: { color: "#555", fontSize: 11, letterSpacing: 4, marginBottom: 4 },
  title: { color: "#fff", fontSize: 28, fontWeight: "300", letterSpacing: 2 },
  modeRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 20 },
  modeBtn: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: "#444",
  },
  modeBtnActive: { backgroundColor: "#fff", borderColor: "#fff" },
  modeBtnText: { color: "#888", fontSize: 14, letterSpacing: 1 },
  modeBtnTextActive: { color: "#0f0f0f" },
  card: {
    backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#2a2a2a",
    borderRadius: 20, padding: 32, alignItems: "center",
    marginVertical: 20,
  },
  cardWord: { paddingVertical: 28 },
  charDisplay: { fontSize: 96, color: "#fff", lineHeight: 110 },
  wordDisplay: { fontSize: 48, color: "#fff", letterSpacing: 6 },
  cardHint: { color: "#444", fontSize: 11, letterSpacing: 2, marginTop: 8 },
  feedback: {
    borderRadius: 10, padding: 14, alignItems: "center",
    marginBottom: 16, borderWidth: 1,
  },
  feedbackEmpty: { height: 56, marginBottom: 16 },
  feedbackOk: { backgroundColor: "#1a3a1a", borderColor: "#2a5a2a" },
  feedbackWrong: { backgroundColor: "#3a1a1a", borderColor: "#5a2a2a" },
  feedbackText: { fontSize: 15, fontWeight: "500" },
  feedbackTextOk: { color: "#6fcf6f" },
  feedbackTextWrong: { color: "#f47474" },
  translation: { color: "#888", fontSize: 13, marginTop: 4, letterSpacing: 1 },
  input: {
    backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#333",
    borderRadius: 10, padding: 14, fontSize: 20, color: "#fff",
    textAlign: "center", letterSpacing: 2, marginBottom: 16,
  },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: "#fff", paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 8,
  },
  primaryBtnText: { color: "#0f0f0f", fontSize: 15, fontWeight: "600", letterSpacing: 1 },
  secondaryBtn: {
    borderWidth: 1, borderColor: "#444", paddingHorizontal: 28,
    paddingVertical: 12, borderRadius: 8,
  },
  secondaryBtnText: { color: "#fff", fontSize: 15, letterSpacing: 1 },
  stats: { marginLeft: "auto" },
  statText: { color: "#666", fontSize: 13 },
  statValue: { color: "#aaa", fontWeight: "600" },
  resetBtn: { alignSelf: "flex-end", marginTop: 8 },
  resetText: { color: "#444", fontSize: 12, letterSpacing: 1 },
});

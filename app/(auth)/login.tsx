import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Required", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert(
        "Login failed",
        e.response?.status === 401
          ? "Invalid email or password."
          : "Could not connect to server. Check your network.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/AppIcons/playstore.png")}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Text style={styles.appName}>Sky World</Text>
          <Text style={styles.tagline}>Survey Platform</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPwd}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPwd(!showPwd)}
              >
                <Text style={styles.eyeIcon}>{showPwd ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign in</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Sky World Limited © {new Date().getFullYear()}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a1a2e" },
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center", gap: 24 },
  header: { alignItems: "center", gap: 4 },
  logo: { fontSize: 52 },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tagline: { fontSize: 14, color: "#a5b4fc" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: -8 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "500", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIcon: { fontSize: 16 },
  btn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { textAlign: "center", color: "#6b7280", fontSize: 12 },
});

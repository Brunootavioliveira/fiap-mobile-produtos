import { useState, useRef } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Keyboard,
} from 'react-native';
import { registerUser } from '../firebase/authService';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius, typography, shadow } from '../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function validate(n = name, e = email, p = password) {
    const errs = {};
    if (!n.trim()) errs.name = 'Informe seu nome.';
    else if (n.trim().length < 2) errs.name = 'Nome muito curto.';
    if (!e.trim()) errs.email = 'Informe seu email.';
    else if (!/\S+@\S+\.\S+/.test(e)) errs.email = 'Email inválido.';
    if (!p.trim()) errs.password = 'Informe uma senha.';
    else if (p.length < 6) errs.password = 'Mínimo 6 caracteres.';
    return errs;
  }

  function touch(field, n = name, e = email, p = password) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(n, e, p));
  }

  async function handleRegister() {
    setTouched({ name: true, email: true, password: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    Keyboard.dismiss();
    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      Alert.alert('Conta criada! 🎉', 'Faça login para continuar.', [
        { text: 'Fazer login', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>👤</Text>
          </View>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para continuar</Text>
        </View>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={(v) => { setName(v); if (touched.name) touch('name', v, email, password); }}
              onBlur={() => touch('name')}
              style={[styles.input, touched.name && errors.name && styles.inputError]}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
            {touched.name && errors.name ? <Text style={styles.errorText}>⚠ {errors.name}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(v) => { setEmail(v); if (touched.email) touch('email', name, v, password); }}
              onBlur={() => touch('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, touched.email && errors.email && styles.inputError]}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            {touched.email && errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              ref={passwordRef}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={(v) => { setPassword(v); if (touched.password) touch('password', name, email, v); }}
              onBlur={() => touch('password')}
              secureTextEntry
              style={[styles.input, touched.password && errors.password && styles.inputError]}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            {touched.password && errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}
          </View>

          <PrimaryButton title="Criar conta" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.sm }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[typography.link, { fontWeight: '700' }]}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1, justifyContent: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl,
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoBox: {
    width: 72, height: 72, borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, ...shadow.card,
  },
  logoText: { fontSize: 32 },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary },
  form: {},
  inputGroup: { marginBottom: spacing.md },
  label: {
    fontSize: 13, fontWeight: '600', color: colors.textSecondary,
    marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14, paddingHorizontal: spacing.md,
    fontSize: 15, color: colors.text,
  },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFF5F5' },
  errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.xs, fontWeight: '500' },
  footer: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: spacing.xl,
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
});

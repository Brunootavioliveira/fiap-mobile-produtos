import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar, Keyboard,
} from 'react-native';
import { loginUser } from '../firebase/authService';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius, typography, shadow } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  function validate(e = email, p = password) {
    const errs = {};
    if (!e.trim()) errs.email = 'Informe seu email.';
    else if (!/\S+@\S+\.\S+/.test(e)) errs.email = 'Email inválido.';
    if (!p.trim()) errs.password = 'Informe sua senha.';
    else if (p.length < 6) errs.password = 'Senha deve ter pelo menos 6 caracteres.';
    return errs;
  }

  function handleEmailChange(v) {
    setEmail(v);
    if (touched.email) setErrors((prev) => ({ ...prev, email: validate(v, password).email }));
  }

  function handlePasswordChange(v) {
    setPassword(v);
    if (touched.password) setErrors((prev) => ({ ...prev, password: validate(email, v).password }));
  }

  async function handleLogin() {
    setTouched({ email: true, password: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    Keyboard.dismiss();
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>📦</Text>
          </View>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => {
                setTouched((p) => ({ ...p, email: true }));
                setErrors((p) => ({ ...p, email: validate().email }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, touched.email && errors.email && styles.inputError]}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            {touched.email && errors.email ? (
              <Text style={styles.errorText}>⚠ {errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              ref={passwordRef}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => {
                setTouched((p) => ({ ...p, password: true }));
                setErrors((p) => ({ ...p, password: validate().password }));
              }}
              secureTextEntry
              style={[styles.input, touched.password && errors.password && styles.inputError]}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            {touched.password && errors.password ? (
              <Text style={styles.errorText}>⚠ {errors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('EsqueciSenha')}
            style={styles.forgotLink}
          >
            <Text style={typography.link}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <PrimaryButton title="Entrar" onPress={handleLogin} loading={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={[typography.link, { fontWeight: '700' }]}>Criar conta</Text>
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
  forgotLink: { alignSelf: 'flex-end', marginBottom: spacing.lg, marginTop: -spacing.xs },
  footer: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: spacing.xl,
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
});

import { useState } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { resetUserPassword } from '../firebase/authService';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius, typography, shadow } from '../styles/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu email.');
      return;
    }
    setLoading(true);
    try {
      await resetUserPassword(email.trim());
      Alert.alert(
        'Email enviado! 📬',
        'Verifique sua caixa de entrada para as instruções de recuperação.',
        [{ text: 'Voltar ao login', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro ao enviar email', error.message);
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
            <Text style={styles.logoText}>🔑</Text>
          </View>
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe seu email e enviaremos as instruções para redefinir sua senha.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email cadastrado</Text>
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <PrimaryButton
            title="Enviar instruções"
            onPress={handleResetPassword}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[typography.link, { fontWeight: '600' }]}>← Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoBox: {
    width: 72, height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.card,
  },
  logoText: { fontSize: 32 },
  title: { ...typography.h1, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },
  form: { marginTop: spacing.sm },
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
  footer: { alignItems: 'center', marginTop: spacing.xl },
});

import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../styles/theme';

// Botão primário reutilizável
export function PrimaryButton({ title, onPress, loading = false, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={[styles.primaryButton, shadow.button, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Botão secundário / outline
export function SecondaryButton({ title, onPress, style, color }) {
  const btnColor = color || colors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.secondaryButton, { borderColor: btnColor }, style]}
    >
      <Text style={[styles.secondaryButtonText, { color: btnColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Botão de perigo (excluir)
export function DangerButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.dangerButton, style]}
    >
      <Text style={styles.dangerButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

// Card wrapper
export function Card({ children, style }) {
  return (
    <View style={[styles.card, shadow.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
});

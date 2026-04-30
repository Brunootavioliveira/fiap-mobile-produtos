import { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius, shadow, typography } from '../styles/theme';

export default function BarcodeScannerScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  function handleBarcodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    Alert.alert('Código lido! 🎉', data, [
      {
        text: 'Usar este código',
        onPress: () =>
          navigation.navigate('Home', {
            scannedBarcode: data,
            currentName: route.params?.currentName,
            currentPrice: route.params?.currentPrice,
          }),
      },
      {
        text: 'Ler novamente',
        style: 'cancel',
        onPress: () => setScanned(false),
      },
    ]);
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Permissão necessária</Text>
          <Text style={styles.permissionText}>
            Precisamos acessar sua câmera para ler o código de barras dos produtos.
          </Text>
          <PrimaryButton
            title="Permitir câmera"
            onPress={requestPermission}
            style={{ marginTop: spacing.lg }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.md, alignItems: 'center' }}
          >
            <Text style={typography.link}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'qr', 'code128'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.dimArea} />

        <View style={styles.middleRow}>
          <View style={styles.dimSide} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.dimSide} />
        </View>

        <View style={[styles.dimArea, styles.bottomArea]}>
          <Text style={styles.instructionText}>
            {scanned ? 'Código lido!' : 'Aponte para o código de barras'}
          </Text>
          {scanned && (
            <TouchableOpacity
              onPress={() => setScanned(false)}
              style={styles.rescanButton}
            >
              <Text style={styles.rescanText}>Ler novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const FRAME_SIZE = 240;
const CORNER_SIZE = 28;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: { ...typography.body, color: colors.textSecondary },

  permissionContainer: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  permissionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    ...shadow.card,
  },
  permissionIcon: { fontSize: 56, marginBottom: spacing.md },
  permissionTitle: { ...typography.h2, marginBottom: spacing.sm, textAlign: 'center' },
  permissionText: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },

  overlay: { ...StyleSheet.absoluteFillObject },
  dimArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  middleRow: { flexDirection: 'row', height: FRAME_SIZE },
  dimSide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanFrame: { width: FRAME_SIZE, height: FRAME_SIZE },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderColor: colors.white,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  bottomArea: {
    alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: spacing.xl,
  },
  instructionText: {
    color: colors.white, fontSize: 16,
    fontWeight: '500', textAlign: 'center',
  },
  rescanButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    ...shadow.button,
  },
  rescanText: { color: colors.white, fontWeight: '600', fontSize: 14 },
});
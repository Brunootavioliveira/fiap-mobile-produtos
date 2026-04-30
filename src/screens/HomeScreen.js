import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, Alert, FlatList,
  StyleSheet, TouchableOpacity, SafeAreaView,
  KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  createProduct, getProducts, deleteProduct, updateProduct,
} from '../firebase/productService';
import { PrimaryButton, SecondaryButton, DangerButton, Card } from '../components/ui';
import { colors, spacing, radius, typography, shadow } from '../styles/theme';


function formatPrice(raw) {
  // Remove tudo que não é dígito
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  // Converte para centavos e formata como "1.234,56"
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function validateForm(name, price, barcode) {
  const errors = {};
  if (!name.trim()) {
    errors.name = 'Informe o nome do produto.';
  } else if (name.trim().length < 2) {
    errors.name = 'Nome muito curto (mínimo 2 caracteres).';
  }
  if (!price.trim()) {
    errors.price = 'Informe o preço.';
  } else if (price === '0,00' || price === '0') {
    errors.price = 'Preço deve ser maior que zero.';
  }
  return errors;
}


export default function HomeScreen({ navigation, route }) {
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // App state
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const priceRef = useRef(null);
  const barcodeRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      loadProducts();

      if (route.params?.scannedBarcode) {
        setBarcode(String(route.params.scannedBarcode));
        if (route.params?.currentName) setName(route.params.currentName);
        if (route.params?.currentPrice) setPrice(route.params.currentPrice);
        navigation.setParams({
          scannedBarcode: undefined,
          currentName: undefined,
          currentPrice: undefined,
        });
      }
    }, [route.params?.scannedBarcode])
  );

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateForm(name, price, barcode);
    setErrors(errs);
  }

  function handleNameChange(v) {
    setName(v);
    if (touched.name) {
      const errs = validateForm(v, price, barcode);
      setErrors((prev) => ({ ...prev, name: errs.name }));
    }
  }

  function handlePriceChange(v) {
    const formatted = formatPrice(v);
    setPrice(formatted);
    if (touched.price) {
      const errs = validateForm(name, formatted, barcode);
      setErrors((prev) => ({ ...prev, price: errs.price }));
    }
  }

  function clearForm() {
    setName(''); setPrice(''); setBarcode('');
    setErrors({}); setTouched({}); setEditingProductId(null);
    Keyboard.dismiss();
  }

  async function handleSaveProduct() {
    setTouched({ name: true, price: true });
    const errs = validateForm(name, price, barcode);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    Keyboard.dismiss();
    const productData = {
      name: name.trim(),
      price: price.trim(),
      barcode: barcode.trim(),
    };

    setLoading(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        await createProduct(productData);
        Alert.alert('Sucesso', 'Produto cadastrado!');
      }
      clearForm();
      await loadProducts();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setLoading(false);
    }
  }

  function handleEditProduct(product) {
    setName(product.name || '');
    setPrice(product.price || '');
    setBarcode(product.barcode || '');
    setEditingProductId(product.id);
    setErrors({});
    setTouched({});
  }

  async function handleDeleteProduct(productId) {
    Alert.alert(
      'Excluir produto',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
              await loadProducts();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          },
        },
      ]
    );
  }

  function renderForm() {
    return (
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingProductId ? '✏️ Editar produto' : '➕ Novo produto'}
        </Text>

        {/* Scanner */}
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => {
            Keyboard.dismiss();
            navigation.navigate('BarcodeScanner', {
              currentName: name,
              currentPrice: price,
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.scannerButtonText}>🔲  Ler código de barras</Text>
        </TouchableOpacity>

        {/* Nome */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do produto</Text>
          <TextInput
            placeholder="Ex: Coca-Cola 2L"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={handleNameChange}
            onBlur={() => handleBlur('name')}
            style={[styles.input, touched.name && errors.name && styles.inputError]}
            returnKeyType="next"
            onSubmitEditing={() => priceRef.current?.focus()}
            blurOnSubmit={false}
          />
          {touched.name && errors.name ? (
            <Text style={styles.errorText}>⚠ {errors.name}</Text>
          ) : null}
        </View>

        {/* Preço */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço (R$)</Text>
          <View style={[styles.inputRow, touched.price && errors.price && styles.inputError]}>
            <Text style={styles.inputPrefix}>R$</Text>
            <TextInput
              ref={priceRef}
              placeholder="0,00"
              placeholderTextColor={colors.textSecondary}
              value={price}
              onChangeText={handlePriceChange}
              onBlur={() => handleBlur('price')}
              keyboardType="numeric"
              style={[styles.input, styles.inputFlex, { borderWidth: 0 }]}
              returnKeyType="next"
              onSubmitEditing={() => barcodeRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          {touched.price && errors.price ? (
            <Text style={styles.errorText}>⚠ {errors.price}</Text>
          ) : null}
        </View>

        {/* Código de barras */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Código de barras</Text>
          <TextInput
            ref={barcodeRef}
            placeholder="Escaneie ou digite"
            placeholderTextColor={colors.textSecondary}
            value={barcode}
            onChangeText={setBarcode}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleSaveProduct}
          />
        </View>

        <PrimaryButton
          title={editingProductId ? 'Salvar alterações' : 'Cadastrar produto'}
          onPress={handleSaveProduct}
          loading={loading}
        />

        {editingProductId && (
          <SecondaryButton
            title="Cancelar edição"
            onPress={clearForm}
            style={{ marginTop: spacing.sm }}
            color={colors.textSecondary}
          />
        )}
      </Card>
    );
  }

  function renderProduct({ item }) {
    const isEditing = editingProductId === item.id;
    return (
      <Card style={[styles.productCard, isEditing && styles.productCardEditing]}>
        {isEditing && (
          <View style={styles.editingBadge}>
            <Text style={styles.editingBadgeText}>Editando</Text>
          </View>
        )}

        <View style={styles.productHeader}>
          <View style={styles.productIcon}>
            <Text style={{ fontSize: 18 }}>📦</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>R$ {item.price}</Text>
          </View>
        </View>

        {item.barcode ? (
          <View style={styles.barcodeRow}>
            <Text style={styles.barcodeValue}>🔲 {item.barcode}</Text>
          </View>
        ) : null}

        <View style={styles.productActions}>
          <SecondaryButton title="Editar" onPress={() => handleEditProduct(item)} style={styles.actionBtn} />
          <DangerButton title="Excluir" onPress={() => handleDeleteProduct(item.id)} style={styles.actionBtn} />
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Top bar fixo */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarTitle}>Produtos</Text>
            <Text style={styles.topBarSub}>
              {products.length} cadastrado{products.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* FlatList com form no header — rola tudo junto */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={renderForm()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.emptyTitle}>Nenhum produto ainda</Text>
              <Text style={styles.emptySubtitle}>Cadastre seu primeiro produto acima</Text>
            </View>
          }
          ListHeaderComponentStyle={{ marginBottom: spacing.sm }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.card,
  },
  topBarTitle: { ...typography.h2 },
  topBarSub: { ...typography.caption, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  logoutText: { color: colors.primary, fontWeight: '600', fontSize: 13 },

  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  formCard: {},
  formTitle: { ...typography.h3, marginBottom: spacing.md },
  scannerButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scannerButtonText: { color: colors.primary, fontWeight: '600', fontSize: 14 },

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
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
  },
  inputPrefix: {
    fontSize: 15, fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 4,
  },
  inputFlex: { flex: 1 },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '500',
  },

  // Products
  productCard: {},
  productCardEditing: { borderWidth: 2, borderColor: colors.primary },
  editingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.sm,
  },
  editingBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  productHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  productIcon: {
    width: 44, height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  productInfo: { flex: 1 },
  productName: { ...typography.h3, fontSize: 16 },
  productPrice: { fontSize: 14, fontWeight: '700', color: colors.success, marginTop: 2 },
  barcodeRow: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  barcodeValue: {
    fontSize: 12, color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  productActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  actionBtn: { flex: 1 },

  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptySubtitle: { ...typography.caption, marginTop: spacing.xs },
});
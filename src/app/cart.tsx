import { useState } from "react";
import { Input } from "@/components/input";
import { useNavigation } from "expo-router";
import { Header } from "@/components/header";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/button";
import { Product } from "@/components/product";
import { LinkButton } from "@/components/link-button";
import { formatCurrency } from "@/utils/functions/format-currency";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PHONE_NUMBER = "5511959862964";

export default function Cart() {
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const [adress, setAdress] = useState("");

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert(
      "Remover produto",
      `Deseja remover ${product.title} do carrinho?`,
      [
        {
          text: "Cancelar",
        },
        {
          text: "Remover",
          onPress: () => cartStore.remove(product.id),
        },
      ]
    );
  }

  function handleOrder() {
    if (adress.trim().length === 0) {
      return Alert.alert("Pedido", "Informe o endereço de entrega.");
    }

    const products = cartStore.products
      .map((product) => `\n - ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    🍔 Pedido realizado com sucesso 🍔
     \n\nProdutos: ${products} 
     \n\nTotal: ${total} 
     \nEndereço de entrega: ${adress} 
     \n\n🚀 Obrigado pela preferência! 🚀 
     \n=============================================`;
    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );
    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={100}
      >
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-400">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio!
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              onChangeText={setAdress}
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemente."
              onSubmitEditing={handleOrder}
              blurOnSubmit
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton href="/" title="Voltar ao cardápio" />
      </View>
    </View>
  );
}

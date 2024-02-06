import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <ActivityIndicator color="#EEEEEEEE" />
    </View>
  );
}

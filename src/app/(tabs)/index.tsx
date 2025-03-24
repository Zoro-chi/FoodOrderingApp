import { StyleSheet, Text, View, Image } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import Colors from '@/src/constants/Colors';
import products from '@/assets/data/products';

const product = products[1];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: product.image }}
        style={styles.image}
      />
      <Text style={styles.title}> {product.name} </Text>
      <Text style={styles.price}> {product.price} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  price: {
    fontSize: 13,
    color: Colors.dark.tint,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginVertical: 10,
    backgroundColor: Colors.dark.tint,
    borderRadius: 10,
  }
});

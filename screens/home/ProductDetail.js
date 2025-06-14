import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import { CartContext } from '../../context/CartContext';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { dispatch } = useContext(CartContext);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const fetchRelated = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${product.category}`);
      const data = await res.json();
      const filtered = data.products.filter(p => p.id !== product.id);
      setRelatedProducts(filtered.slice(0, 5));
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelated();
  }, []);

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.push('ProductDetail', { product: item })}
      style={styles.recommendCard}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.recommendImage} />
      <Text numberOfLines={1} style={styles.recommendTitle}>{item.title}</Text>
      <Text style={styles.recommendPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}

      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.category}>Category: {product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>Price: Rs.{product.price}</Text>
      <Text style={styles.discount}>Discount: {product.discountPercentage}%</Text>
      <Text style={styles.rating}>Rating: ⭐ {product.rating}</Text>
      <View style={styles.buttonWrapper}>
        <Button
          title="Add to Cart"
          onPress={() => {
            dispatch({ type: 'ADD_TO_CART', payload: product });
            showMessage('Added to cart');
          }}
        />
      </View>
      <Text style={styles.recommendHeading}>You may also like</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <FlatList
          data={relatedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecommendation}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    height: 250,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 6,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    color: '#009688',
    marginTop: 10,
  },
  discount: {
    fontSize: 16,
    color: 'red',
    marginTop: 5,
  },
  rating: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  recommendHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendCard: {
    width: 140,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    padding: 10,
    alignItems: 'center',
  },
  recommendImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  recommendTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  recommendPrice: {
    fontSize: 14,
    color: '#009688',
  },
  toast: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  toastText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductDetail;

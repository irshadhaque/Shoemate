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
      <Text style={styles.recommendPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />

        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.category}>Category: {product.category}</Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.discount}>-{product.discountPercentage}%</Text>
        </View>

        <Text style={styles.rating}>⭐ {product.rating} / 5</Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            dispatch({ type: 'ADD_TO_CART', payload: product });
            showMessage('Added to cart');
          }}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    height: 250,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  category: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009688',
  },
  discount: {
    fontSize: 16,
    color: '#d32f2f',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 15,
    color: '#555',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cartButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recommendCard: {
    width: 140,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    elevation: 3,
  },
  recommendImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  recommendTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  recommendPrice: {
    fontSize: 14,
    color: '#009688',
    marginTop: 4,
    fontWeight: 'bold',
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

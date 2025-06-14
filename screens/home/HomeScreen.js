import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Button,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { dispatch: cartDispatch } = useContext(CartContext);
  const { wishlist, dispatch: wishlistDispatch } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      alert('Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => {
    const isFav = wishlist.some(p => p.id === item.id);

    return (
      <View style={styles.card}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
          <TouchableOpacity
            style={styles.heart}
            onPress={() => wishlistDispatch({ type: 'TOGGLE_WISHLIST', payload: item })}
          >
            <AntDesign name={isFav ? 'heart' : 'hearto'} size={22} color="red" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button
              title="View Details"
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Add to Cart"
              onPress={() => {
                cartDispatch({ type: 'ADD_TO_CART', payload: item });
                showMessage('Added to cart');
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },
  image: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    color: '#009688',
    fontSize: 16,
    marginBottom: 8,
  },
  toast: {
    position: 'absolute',
    top: 10,
    left: '10%',
    right: '10%',
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    zIndex: 999,
    alignItems: 'center',
    elevation: 6,
  },
  toastText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  buttonGroup: {
    marginTop: 10,
    flexDirection: 'column',
  },
  buttonWrapper: {
    marginBottom: 10,
  },
});

export default HomeScreen;

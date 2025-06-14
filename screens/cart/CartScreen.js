import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { CartContext } from '../../context/CartContext';

const CartScreen = () => {
  const { cart, dispatch } = useContext(CartContext);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    showMessage('Removed from cart');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulated refresh
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <View style={styles.details}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.price}>
                    ₹{item.price} x {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <Text style={styles.total}>Total: ₹{getTotalPrice()}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 10,
    left: '10%',
    right: '10%',
    backgroundColor: '#dc3545',
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
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#009688',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'left',
    backgroundColor: '#fff',
    elevation: 6,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    padding: 40,
    color: '#777',
  },
});

export default CartScreen;

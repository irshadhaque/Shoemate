import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, RefreshControl } from 'react-native';
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
    <View style={{ flex: 1 }}>
      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}

      {cart.length === 0 ? (
        <Text style={{ padding: 20 }}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price} x {item.quantity}</Text>
                <Button title="Remove" onPress={() => handleRemove(item.id)} />
              </View>
            )}
          />
          <Text style={styles.total}>Total: ${getTotalPrice()}</Text>
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
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  price: {
    color: '#009688',
    marginBottom: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'right',
    backgroundColor: '#f1f1f1',
  },
});

export default CartScreen;

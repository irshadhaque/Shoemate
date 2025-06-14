import React, { useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import { WishlistContext } from '../../context/WishlistContext';

const WishlistScreen = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {wishlist.length === 0 ? (
        <Text>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
              <Text>{item.title}</Text>
              <Text>${item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  image: {
    height: 100,
    width: '100%',
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default WishlistScreen;

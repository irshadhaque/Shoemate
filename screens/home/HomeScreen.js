import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
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
      const res = await fetch('https://dummyjson.com/products/category/mens-shoes');
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
      const res = await fetch('https://dummyjson.com/products/category/mens-shoes');
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
      <View style={styles.cardWrapper}>
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
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <TouchableOpacity
            style={styles.customButton}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.customButton}
            onPress={() => {
              cartDispatch({ type: 'ADD_TO_CART', payload: item });
              showMessage('Added to cart');
            }}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
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
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 10 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    elevation: 4,
  },
  image: {
    height: 120,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: '#009688',
    fontSize: 13,
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
  customButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default HomeScreen;



// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   StyleSheet,
//   RefreshControl,
//   TouchableOpacity
// } from 'react-native';
// import { CartContext } from '../../context/CartContext';
// import { WishlistContext } from '../../context/WishlistContext';
// import { AntDesign } from '@expo/vector-icons';

// const HomeScreen = ({ navigation }) => {
//   const { dispatch: cartDispatch } = useContext(CartContext);
//   const { wishlist, dispatch: wishlistDispatch } = useContext(WishlistContext);

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [message, setMessage] = useState('');

//   const showMessage = (msg) => {
//     setMessage(msg);
//     setTimeout(() => setMessage(''), 2000);
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch('https://dummyjson.com/products/category/mens-shoes');
//       const data = await res.json();
//       setProducts(data.products);
//     } catch (err) {
//       alert('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       const res = await fetch('https://dummyjson.com/products/category/mens-shoes');
//       const data = await res.json();
//       setProducts(data.products);
//     } catch (err) {
//       alert('Refresh failed');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const renderItem = ({ item }) => {
//     const isFav = wishlist.some(p => p.id === item.id);

//     return (
//       <View style={styles.card}>
//         <View style={{ position: 'relative' }}>
//           <Image source={{ uri: item.thumbnail }} style={styles.image} />
//           <TouchableOpacity
//             style={styles.heart}
//             onPress={() => wishlistDispatch({ type: 'TOGGLE_WISHLIST', payload: item })}
//           >
//             <AntDesign name={isFav ? 'heart' : 'hearto'} size={22} color="red" />
//           </TouchableOpacity>
//         </View>
// <Text style={styles.price}>${item.price}</Text>
//         <Text style={styles.title}>{item.title}</Text>
        

//         <TouchableOpacity
//           style={styles.customButton}
//           onPress={() => navigation.navigate('ProductDetail', { product: item })}
//         >
//           <Text style={styles.buttonText}>View Details</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.customButton}
//           onPress={() => {
//             cartDispatch({ type: 'ADD_TO_CART', payload: item });
//             showMessage('Added to cart');
//           }}
//         >
//           <Text style={styles.buttonText}>Add to Cart</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {message !== '' && (
//         <View style={styles.toast}>
//           <Text style={styles.toastText}>{message}</Text>
//         </View>
//       )}
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         numColumns={2}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         contentContainerStyle={{ padding: 10 }}
//         columnWrapperStyle={{ justifyContent: 'space-between' }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     flex: 1,
//     marginHorizontal: 5,
//     elevation: 4,
//   },
//   image: {
//     height: 120,
//     width: '100%',
//     borderRadius: 10,
//     marginBottom: 10,
//     resizeMode: 'cover',
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   title: {
//     color: '#009688',
//     fontSize: 13,
//     marginBottom: 8,
//   },
//   toast: {
//     position: 'absolute',
//     top: 10,
//     left: '10%',
//     right: '10%',
//     backgroundColor: '#28a745',
//     padding: 12,
//     borderRadius: 10,
//     zIndex: 999,
//     alignItems: 'center',
//     elevation: 6,
//   },
//   toastText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   heart: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 4,
//     elevation: 2,
//   },
//   customButton: {
//     backgroundColor: '#d32f2f',
//     paddingVertical: 8,
//     borderRadius: 6,
//     marginTop: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 13,
//   },
// });

// export default HomeScreen;

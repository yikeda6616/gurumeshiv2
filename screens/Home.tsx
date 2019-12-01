import axios from 'axios';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking
} from 'react-native';
import InformationDetail from '../components/InformationDetail';
import * as Permissions from 'expo-permissions';
import { API_KEY } from '../config';

import * as Location from 'expo-location';

export default class Home extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Image
        source={require('../assets/logo2.png')}
        style={{ resizeMode: 'contain', width: '45%' }}
      />
    )
  };

  state = {
    data: {},

    locationResult: {
      latitude: null,
      longitude: null,
      err: null
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: { err: 'Permission to access location was denied' }
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    const lat = JSON.stringify(location.coords.latitude);
    const long = JSON.stringify(location.coords.longitude);
    const radius = 200;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&types=restaurant&language=ja&key=${API_KEY}`;
    const res = await axios.get(url);
    const array = await res.data.results;
    const result = await array[Math.floor(Math.random() * array.length)];

    // Get map url
    const url2 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${result.place_id}&fields=url&key=${API_KEY}`;
    const res2 = await axios.get(url2);
    const shopUrl = await res2.data.result.url;

    this.setState({
      data: {
        name: result.name,
        url: shopUrl,
        isOpen: result.opening_hours.open_now,
        address: result.vicinity,
        priceLevel: result.price_level,
        rating: result.rating,
        image: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${API_KEY}`
      }
    });
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.headingWrap}>
              <Text style={styles.heading}>
                周辺のグル飯！みんなの評価は
                <Text style={styles.rating}>{this.state.data.rating}</Text>
                のお店！
              </Text>
            </View>
            <View style={styles.card}>
              <Image
                source={{ uri: this.state.data.image }}
                style={styles.image}
              />
              <Text style={styles.name}>{this.state.data.name}</Text>

              <View style={styles.tags}>
                <View
                  style={
                    this.state.data.isOpen
                      ? styles.businessTag
                      : styles.businessTagClosed
                  }
                >
                  <Text style={styles.businessTagText}>
                    {this.state.data.isOpen ? '営業中' : '営業終了'}
                  </Text>
                </View>
              </View>

              <InformationDetail
                name='map-marker'
                address={this.state.data.address}
              />
            </View>

            <View style={styles.footer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.buttonRetryContainer}
                  onPress={this._getLocationAsync}
                >
                  <Text style={styles.buttonRetry}>もう一度選ぶ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(this.state.data.url).catch(err =>
                      console.error('URLを開けませんでした。', err)
                    );
                  }}
                  style={styles.buttonMapContainer}
                >
                  <Text style={styles.buttonMap}>Google Map</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ads}>
                <Text style={styles.adsText}>Ads</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  headingWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 60,
    backgroundColor: '#D77F1C'
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    width: '100%',
    color: '#fff',

    fontWeight: 'bold'
  },
  card: {
    paddingTop: '3%',
    width: '90%',
    justifyContent: 'space-around'
  },
  rating: {
    fontSize: 23
  },
  name: {
    color: '#4B4B4B',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 16
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
    marginTop: 16
  },
  tags: {
    flexDirection: 'row'
  },
  categoryTag: {
    padding: 5,
    backgroundColor: '#BB1448',
    borderRadius: 50,
    marginRight: 5
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 16
  },
  businessTag: {
    backgroundColor: '#129017',
    padding: 5,
    borderRadius: 50,
    marginBottom: 16
  },
  businessTagClosed: {
    backgroundColor: '#555',
    padding: 5,
    borderRadius: 50,
    marginBottom: 16
  },
  businessTagText: {
    color: '#fff',
    paddingHorizontal: 8
  },
  desc: {
    color: '#4B4B4B',
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F1EEC8'
  },
  footer: {
    width: '100%'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonRetryContainer: {
    backgroundColor: '#525252',
    width: '50%',
    height: 64
  },
  buttonRetry: {
    textAlign: 'center',
    color: '#fff',
    lineHeight: 64
  },
  buttonMapContainer: {
    backgroundColor: '#167741',
    width: '50%',
    height: 64
  },
  buttonMap: {
    textAlign: 'center',
    color: '#fff',
    lineHeight: 64
  },
  ads: {
    backgroundColor: '#919191',
    height: 50,
    width: '100%',
    alignItems: 'center'
  },
  adsText: {
    lineHeight: 50
  }
});

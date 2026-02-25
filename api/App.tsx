import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, FlatList} from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'YEK-EGAROTS'

export default function App() {
  const URL = 'https://icanhazdadjoke.com/'
  const [refresh, setRefresh] = useState<Boolean>(false)
  const [joke, setJoke] = useState<string>('')
  const [error, setError] = useState<String | null>(null)
  const [likedJokes, setLikedJokes] = useState<string[]>([])


  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setLikedJokes(JSON.parse(json));
      } catch (e) {
        console.log("Error")
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(likedJokes));
  }, [likedJokes]);

  const addJoke = async () => {
    setLikedJokes([...likedJokes, joke])
  }

  const deleteJoke = async (joke: string) => {
    setLikedJokes(likedJokes.filter(i => (i !== joke)))
  }

  useEffect(() => {
    setError(null)

    fetch(URL, {
      headers: {
        'Contet-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'test'
      },
    })
      .then(response => response.json())
      .then(data => setJoke(data.joke))
      .catch(error => setError('Error: ' + error))
  }, [refresh])


  return (
    <View style={styles.container}>
      {!error && (
        <>
          <Text style={styles.joke}>{joke}</Text>
          <Button onPress={() => addJoke()} title='Like' />
          <Button onPress={() => setRefresh(!refresh)} title='New Joke' />
        </>
      )}
      {error && (
        <>
          <Text>{error}</Text>
          <Button onPress={() => setRefresh(!refresh)} title='Try Again' />
        </>
      )}
      <View style={styles.likedContainer}>
          <Text style={styles.likedHeader}>Liked Jokes:</Text>
          <FlatList
            data={likedJokes}
            keyExtractor={(item: string, index: number) => index.toString()}
            renderItem={({ item }) => (
              <>
                <Text style={styles.joke}>{item}</Text>
                <Button onPress={() => deleteJoke(item)} title='Delete'/>
              </>
              
            )}
          />
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  joke: {
    margin: 16,
    fontSize: 16
  },
  likedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  likedHeader: {
    fontSize: 24,
    marginTop: 16
  }
});

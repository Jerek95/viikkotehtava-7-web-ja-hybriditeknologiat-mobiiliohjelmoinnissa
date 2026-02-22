import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const URL = 'https://icanhazdadjoke.com/'

export default function App() {
  const [refresh, setRefresh] = useState<Boolean>(false)
  const [joke, setJoke] = useState<String>('')
  const [error, setError] = useState<String | null>(null)


  useEffect(() => {
    setError(null)
    
    fetch(URL, {
      headers: {
        'Contet-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin':'*',
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
          <Text>{joke}</Text>
          <Button onPress={() => setRefresh(!refresh)} title='New Joke'/>
        </> 
      )}
      {error && (
        <>
          <Text>{error}</Text>
          <Button onPress={() => setRefresh(!refresh)} title='Try Again'/>
        </>
      )}
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
  },
});

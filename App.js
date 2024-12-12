import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  View, StyleSheet, Text, TextInput, Pressable, ScrollView,
  ActivityIndicator, Keyboard
} from 'react-native';

export default function App() {

  const [pesquisa, setPesq] = useState("");
  const [travel, setTravel] = useState("");
  const [loading, setLoading] = useState(false);

  const API_TOKEN = "tokenaqui"
  async function chamarPesquisa() {
    if (!pesquisa) {
      alert("Por favor, insira um texto.");
      return;
    }
    setLoading(true);
    setTravel("");
    Keyboard.dismiss();

    const prompt = `Crie uma receita de cozinha para fazer um ${pesquisa}`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Resposta da API:", data);

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          const resposta = data.choices[0].message.content.trim();
          console.log("Conteúdo retornado:", resposta);
          setTravel(resposta);
        } else {
          console.error("Estrutura inesperada na resposta:", data);
          alert("Erro na resposta da API. Tente novamente.");
        }

      })
      .catch((error) => {
        console.error("Erro ao chamar API:", error);
        alert("Ocorreu um erro ao processar sua solicitação.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor='#F1F1F1' />

      <Text style={styles.heading}>Pergunte à Chat</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Time: </Text>
        <TextInput
          placeholder="Pesquise por um time: "
          style={styles.input}
          value={pesquisa}
          onChangeText={(text) => setPesq(text)}
        />
      </View>

      <Pressable style={styles.button} onPress={chamarPesquisa}>
        <Text style={styles.buttonText}>Pesquisar Time</Text>
      </Pressable>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Processando...</Text>
            <ActivityIndicator color='#000' size='large' />
          </View>
        )}

        {travel && (
          <View style={styles.content}>
            <Text style={styles.title}>Resultado:</Text>
            <Text>
              {travel}
            </Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: 34,
  },
  form: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  input: {
    padding: 8,
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#fff",
    width: '80%',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});

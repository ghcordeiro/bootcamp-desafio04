import React, { useEffect, useState } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function App() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepos(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const repository = {
      title: `New repository ${Date.now()}`,
      url: "https://github.com/ghcodeiro/fronted-gostack",
      techs: ["ReactJS", "NodeJS", "Express"],
    };
    api.post('/repositories', repository).then((response) => {
      setRepos([...repos, response.data]);
    });
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);
    const repoIndex = repos.findIndex(repo=> repo.id === id);
    repos[repoIndex].likes += 1;
    setRepos([...repos]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {repos.map(repository => (
            <View style={styles.repositoryContainer} key={repository.id}>
              <Text style={styles.repository}>{repository.title}</Text>
              {repository.techs.map(tech =>
                <View style={styles.techsContainer} key={tech}>
                  <Text style={styles.tech}>
                    {tech}
                  </Text>
                </View>
              )}
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}>
                  {repository.likes} curtidas</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}>
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});

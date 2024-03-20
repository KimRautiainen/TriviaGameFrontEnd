import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Text,
} from 'react-native';
import GameModeCard from '../components/gameScreenComponents/GameModeCard';
import gameModes from '../data/gameModes';

const GameModeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState(null);

  const gameModePressed = (mode) => {
    setSelectedGameMode(mode);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameModesScrollView}
      >
        {gameModes.map((mode, index) => (
          <TouchableOpacity key={index} onPress={() => gameModePressed(mode)}>
            <GameModeCard title={mode.title} description={mode.description} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedGameMode && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedGameMode.title}</Text>
            <Text style={styles.modalDescription}>
              {selectedGameMode.detailedDescription}
            </Text>
            <Button
              title="Play"
              onPress={() => {
                setModalVisible(!isModalVisible);
                // Navigate to the game screen with selectedGameMode.title
              }}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameModesScrollView: {
    paddingBottom: 20, // Adjust this value as needed
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'stretch', // Ensures modal stretches horizontally
    marginLeft: 30,
    marginRight: 30, // Adjust margins to control modal width
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333', // Dark text color for better readability
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666', // Slightly lighter text color for descriptions
  },
});
export default GameModeScreen;

import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Text,
  ImageBackground,
} from 'react-native';
import GameModeCard from '../components/gameScreenComponents/GameModeCard';
import gameModes from '../data/gameModes';
import PropTypes from 'prop-types';

const GameModeScreen = ({navigation, route}) => {
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
        showsVerticalScrollIndicator={false}
      >
        {gameModes.map((mode, index) => (
          <TouchableOpacity key={index} onPress={() => gameModePressed(mode)}>
            <GameModeCard
              title={mode.title}
              description={mode.description}
              imageSource={mode.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedGameMode && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ImageBackground
                source={selectedGameMode.image}
                style={styles.modalBackgroundImage}
                imageStyle={styles.modalBackgroundImageStyle}
              >
                <Text style={styles.modalTitle}>{selectedGameMode.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedGameMode.detailedDescription}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                    navigation.navigate('GameScreen', {
                      gameMode: selectedGameMode.title,
                    });
                  }}
                  style={styles.buttonStyle}
                >
                  <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.buttonStyle}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
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
    backgroundColor: '#e0f7fa', // Light grey
  },
  gameModesScrollView: {
    paddingVertical: 60,
  },
  modalBackgroundImage: {
    width: '100%', // Ensure the image covers the modalView
    height: '100%', // Ensure the image covers the modalView
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Match the borderRadius of modalView for consistency
    overflow: 'hidden', // Needed to apply borderRadius to ImageBackground
  },
  modalBackgroundImageStyle: {
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background for the modal overlay
  },
  modalView: {
    margin: 20,
    width: '100%', // Set a fixed width for the modal
    height: '70%', // Set a fixed height for the modal
    backgroundColor: 'transparent', // Ensure modalView itself has a transparent background
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
  },
  modalTitle: {
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 32,
    color: '#FFFFFF', // Dark text color for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  modalDescription: {
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF', // Slightly lighter text color for descriptions
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5, // Adds spacing between buttons
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 20, // Larger font for better visibility
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
GameModeScreen.propTypes = {
  navigation: PropTypes.object,
};
export default GameModeScreen;

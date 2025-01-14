import React, {useContext, useState} from 'react';
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
import {SoundContext} from '../contexts/SoundContext';

const GameModeScreen = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState(null);
  const {playButtonSound, playCloseButtonSound} = useContext(SoundContext);

  const gameModePressed = async (mode) => {
    await playButtonSound();
    setSelectedGameMode(mode);
    setModalVisible(true);
  };

  const gameModeClosed = async () => {
    await playCloseButtonSound();
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/blueSky.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gameModesScrollView}
          showsVerticalScrollIndicator={false}
        >
          {gameModes.map((mode, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => gameModePressed(mode)}
              style={styles.gameModeTouchable}
            >
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
              gameModeClosed();
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ImageBackground
                  source={selectedGameMode.image}
                  style={styles.modalBackgroundImage}
                  imageStyle={styles.modalBackgroundImageStyle}
                >
                  <Text style={styles.modalTitle}>
                    {selectedGameMode.title}
                  </Text>
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.modalDescription}>
                      {selectedGameMode.detailedDescription}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      await playButtonSound();
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
                    onPress={() => gameModeClosed()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </Modal>
        )}
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameModesScrollView: {
    flex: 1, // Ensures ScrollView fills the available space
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
    paddingVertical: 10,
  },
  /* gameModeTouchable: {
    marginBottom: 20, // Adds larger spacing between game modes
  }, */
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
  modalTextContainer: {
    alignItems: 'flex-start', // Aligns text to the start
    width: '100%', // Ensures the container takes up the full width of its parent
    padding: 25, // Adds padding inside the container for spacing
  },
});
GameModeScreen.propTypes = {
  navigation: PropTypes.object,
};
export default GameModeScreen;

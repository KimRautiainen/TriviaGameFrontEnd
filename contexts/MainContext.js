import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  // TODO: create state isLoggedIn, set value to false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [update, setUpdate] = useState(false);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [inventoryData, setInventoryData] = useState({
    goldCoins: 0,
    tournamentTickets: 0,
    otherItems: {},
  });
  const [showLevelUp, setShowLevelUp] = useState(false);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userData,
        setUserData,
        update,
        setUpdate,
        height,
        setHeight,
        loading,
        setLoading,
        userToken,
        setUserToken,
        inventoryData,
        setInventoryData,
        showLevelUp,
        setShowLevelUp,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};

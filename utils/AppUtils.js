import AsyncStorage from "@react-native-async-storage/async-storage";

export function getErrorMsgFromAxiosErrorObject(error) {
    let errorMsg = error && error.response && error.response.data ? error.response.data : {message : "Error Occured, Please contact Admin"} ;
    return errorMsg.message;
}

export const isLoggedIn = async () => {
    try {
      const userToken = await AsyncStorage.getItem('user'); // or 'user' if you store user info
      return !!userToken;
    } catch (error) {
      console.error('Error checking authentication status', error);
      return false;
    }
}
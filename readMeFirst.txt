Env reactnative to setup
    1. nodeJS : https://nodejs.org/en
    2. expo-cli : npm install -g expo-cli
    3. Navigation :
        i npx expo install @react-navigation/native
        ii. npm install @react-navigation/stack
        iii. npm install @react-navigation/bottom-tabs
        iii, npm i @react-navigation/native-stack
        iv. npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
    6. ReactNativesElements : npm install @rneui/themed @rneui/base
    5. React Redux : npx expo install react-redux
    5bis. toolkits : npm install @reduxjs/toolkit
    12. async-storage: npx expo install @react-native-async-storage/async-storage
    13: redux-persist : npx expo install redux-persist 
    14. redux-thunk : npx expo install redux-thunk
npm i react-native-rename
npm i axios
7. admob : npm i react-native-google-mobile-ads@12.2.0
npm install @react-navigation/drawer
npx expo install react-native-maps
npx expo install react-native-picker-select
npx expo install @react-native-picker/picker
npx expo install react-native-svg
npm i react-native-progress

prebuild :
npx expo prebuild

build configure:
eas build:configure

run with react native Env
npx react-native run-ios

dev client
npx expo install expo-dev-client


9. eas: npm install -g eas-cli

eas build -p android --profile preview
eas build --profile development --platform android
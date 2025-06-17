---
tags:
  - resource
  - react-native
  - expo
createdAt: 2025-05-08 08:19:03
modifiedAt: 2025-06-10 15:30:00
publish: 자원/ReactNative
related: ""
series: ""
---

# Expo 시작하기

## React와의 주요 차이점

### 컴포넌트
- `<div>` → `<View>`
- `<span>`, `<p>` → `<Text>`
- `<img>` → `<Image>`
- `<button>` → `<Button>` 또는 `<TouchableOpacity>`
### ⚠️ 중요: 텍스트 처리

```javascript // ❌ 에러 발생 <View> 안녕하세요 </View> // ✅ 올바른 방법 <View> <Text>안녕하세요</Text> </View>

### 스타일링
// CSS 대신 StyleSheet 사용
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,              // CSS: height: 100%
    backgroundColor: '#fff',
    alignItems: 'center',  // CSS: align-items
    justifyContent: 'center' // CSS: justify-content
  }
});
```

### 이벤트 처리
```javascript
// React: onClick
<button onClick={handleClick}>클릭</button>

// Expo: onPress
<Button title="클릭" onPress={handleClick} />
<TouchableOpacity onPress={handleClick}>
  <Text>클릭</Text>
</TouchableOpacity>
```

### 네이티브 기능 접근
```javascript
// 웹에서는 불가능, Expo에서는 간단
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import { Vibration } from 'react-native';
```

## 프로젝트 생성

- `npx` 사용

  ```bash
  npx create-expo-app@latest
  ```

- `bun` 사용

  ```bash
  bun create expo
  ```

- 특정 템플릿 사용

  ```bash
  # TypeScript 템플릿
  npx create-expo-app@latest MyApp --template
  
  # 네비게이션 포함
  npx create-expo-app@latest MyApp --template tabs
  
  # 빈 프로젝트
  npx create-expo-app@latest MyApp --template blank
  ```

## CLI 설치 및 실행

```bash
# CLI 설치
npm install -g @expo/cli

# 개발 서버 시작
expo start
# 또는
npx expo start
```

## 개발 환경

### Expo Go 앱
- iOS: App Store에서 "Expo Go" 설치
- Android: Google Play Store에서 "Expo Go" 설치

### 실행 단축키
- `i`: iOS 시뮬레이터
- `a`: Android 에뮬레이터  
- `w`: 웹 브라우저
- `r`: 앱 새로고침
- `c`: 로그 지우기

## 기본 구조

```
MyExpoApp/
├── App.js                 # 진입점
├── app.json              # 설정 파일
├── package.json          
├── babel.config.js       
└── assets/               # 이미지, 폰트
```

## 주요 라이브러리 설치

```bash
# 카메라
expo install expo-camera

# 위치
expo install expo-location

# 폰트
expo install expo-font

# 이미지 최적화
expo install expo-image

# 네비게이션
npm install @react-navigation/native
expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/stack
expo install react-native-gesture-handler
```

## 카메라 사용

```javascript
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
      {/* UI */}
    </Camera>
  );
}
```

## 위치 정보

```javascript
import * as Location from 'expo-location';

// 현재 위치 가져오기
const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;
  
  let location = await Location.getCurrentPositionAsync({});
  return location;
};
```

## 네비게이션 설정

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 폰트 사용

```javascript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'custom-font': require('./assets/fonts/CustomFont.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <Text style={{ fontFamily: 'custom-font' }}>텍스트</Text>
  );
}
```

## 환경 변수

```javascript
// app.config.js
export default {
  expo: {
    name: 'MyApp',
    extra: {
      apiUrl: process.env.API_URL || 'https://api.example.com',
    },
  },
};

// 사용
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.apiUrl;
```

## 권한 설정 (app.json)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "카메라 권한이 필요합니다.",
        "NSLocationWhenInUseUsageDescription": "위치 권한이 필요합니다."
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

## 빌드 및 배포

```bash
# EAS CLI 설치
npm install -g @expo/eas-cli
eas login
eas build:configure

# 개발 빌드
eas build --platform android --profile development
eas build --platform ios --profile development

# 프로덕션 빌드
eas build --platform android --profile production
eas build --platform ios --profile production

# 앱 스토어 제출
eas submit --platform android
eas submit --platform ios
```

## 트러블슈팅

```bash
# 캐시 문제
expo start --clear

# Metro bundler 리셋
npm start -- --reset-cache
```

## 유용한 코드

### 이미지 컴포넌트
```javascript
import { Image } from 'expo-image';

<Image
  source="https://example.com/image.jpg"
  style={{ width: 200, height: 200 }}
  contentFit="cover"
/>
```

### 버튼과 알림
```javascript
import { Button, Alert } from 'react-native';

<Button 
  title="클릭" 
  onPress={() => Alert.alert('알림', '메시지')} 
/>
```

### 상태 관리
```javascript
import { useState } from 'react';

const [count, setCount] = useState(0);
```
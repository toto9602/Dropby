import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Pressable,
} from "react-native";
import { theme } from "../../../../infrastructure/theme";
import { SvgXml } from "react-native-svg";
import { TextInput } from "react-native-gesture-handler";
import whiteBackButton from "../../../../../assets/whiteBackButton";

import { LoginBg } from "../../Component/LoginBg";
import { LoginButton } from "../../Component/LoginButton";
import {
  Cursor,
  CodeField,
  useClearByFocusCell,
  useBlurOnFulfill,
} from "react-native-confirmation-code-field";

export const SignIn0202 = ({ navigation, route }) => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  //인증번호 입력받는
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const CELL_COUNT = 6;
  // 전화번호, 이메일을 구분하는 method state
  const [code, setCode] = useState("");
  // 이전 스크린에서 method, input받아오기
  const { method, input } = route.params;
  const handleCode = (e) => {
    setCode(e);
  };

  const nextButton = async () => {
    // 인증 코드 입력받음
    // 코드 확인하고, signUp0202로 넘어감
    console.log("nextbutton 작동!");

    navigation.navigate("MapScreen");
  };
  return (
    <>
      <LoginBg>
        {/* 뒤로가기 버튼 */}
        <View style={styles.container1}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ alignSelf: "flex-start", position: "absolute", top: 30 }}
          >
            <SvgXml xml={whiteBackButton} width={50}></SvgXml>
          </TouchableOpacity>
        </View>

        {/* Main 안내 문구 */}
        <View style={styles.container2}>
          <Text style={styles.mainText}>
            {input}
            <Text>으로</Text>
          </Text>
          <Text style={styles.mainText}>전송된 인증 코드를 입력하세요</Text>
        </View>

        {/* 유저 입력창 */}
        <View style={styles.container3}>
          <View style={styles.buttonContainer}>
            {/* method에 따라 전화번호 변경, 이메일 주소 변경 으로 다르게 나타남 */}
            {method ? (
              <Pressable
                style={styles.methodButton}
                onPress={() => navigation.navigate("SignUp0101")}
              >
                <Text style={styles.methodText}>전화번호 변경</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.methodButton}
                onPress={() => navigation.navigate("SignUp0101")}
              >
                <Text style={styles.methodText}>이메일 주소 변경</Text>
              </Pressable>
            )}

            <Text style={styles.methodTextBasic}> 또는 </Text>
            <Pressable
              style={styles.methodButton}
              // 인증 코드 재전송 함수로 변경하기
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.methodText}>인증 코드 재전송</Text>
            </Pressable>
          </View>
          {/* 
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#02B5AA"
              placeholder="인증 코드 6자리"
              onChangeText={(code) => handleCode(code)}
              value={code}
            ></TextInput>
           
          </View>
           */}
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <LoginButton
            style={{ marginTop: 24 }}
            value="다 음"
            onPress={nextButton}
            width={300}
            height={43}
          />
        </View>
      </LoginBg>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container3: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  mainText: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",

    color: "white",
    fontFamily: theme.fonts.bold,
    fontWeight: "700",
    fontSize: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    margin: 12,
  },
  methodButton: {},

  methodTextBasic: {
    color: "white",
  },
  methodText: {
    color: "#68B8F2",
  },
  inputBox: {
    backgroundColor: theme.colors.bg.white,
    width: 300,
    height: 38,
    opacity: 0.9,
    borderColor: theme.colors.bg.a,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
  },

  input: {
    fontSize: 14,
    left: 32,
    fontFamily: theme.fonts.body,
  },
  subTextContainer: {
    flex: 0,
    marginTop: 16,
    alignItems: "center",
  },
  subText: {
    color: "white",
    fontFamily: theme.fonts.body,
    fontSize: 10,
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "white",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
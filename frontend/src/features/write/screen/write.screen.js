import React from "react";

import {
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Image,
  Video,
} from "react-native";
import { useEffect, useState, useContext } from "react";

import { SafeArea } from "../../../components/utility/safe-area.component";
import { TextInput } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";

import Constants from "expo-constants";

import addIcon from "../../../../assets/Buttons/addIcon";
import backButton2 from "../../../../assets/Buttons/backButton2";
import sendingButton from "../../../../assets/Buttons/sendingButton";
import bar from "../../../../assets/Background/bar";
import addPicture from "../../../../assets/Buttons/addPicture";
import LockButtonUnlocked from "../../../../assets/Buttons/LockButton(Unlocked)";

import { container, styles } from "./writescreen.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postDrop } from "../../../services/drops/postDrop";

export const WriteScreen = ({ navigation, route }) => {
  const place = route.params.selectedPlace;
  // const getToken = async () => AsyncStorage.getItem("accessToken");
  //accessToken 아래에 붙여넣기
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjUyNTI2NTUxLCJleHAiOjE2NTUxMTg1NTF9.eCGutzk0Zl7eJLCRvqY5yO6xcctIe9O7_Jvv5BxNuVA";

  const [placeAddress, setPlaceAddress] = useState("새로운 장소-주소");

  const [selectedEmoji, setSelectedEmoji] = useState("😀");
  const [area, setArea] = useState(null);

  /////////////////////로컬 이미지 여기에 담김
  const [image, setImage] = useState(null);
  //////////////////////
  let user_idx = Constants.installationId;

  useEffect(() => {
    setArea(route.params.activePolygon);
    // setPlaceAddress(route.params[0].pressedAddress);
    // setPlaceName(route.params[1].pressedAddressName);
    // if (route.params[3].calibratedLocation) {
    //   setPlaceLatlng(route.params[3].calibratedLocation);
    //   handleLatitude(placeLatlng.lat);
    //   handleLongitude(placeLatlng.lng);
    // } else {
    //   setPlaceLatlng(route.params[2].pressedLocation);
    //   handleLatitude(placeLatlng.latitude);
    //   handleLongitude(placeLatlng.longitude);
    // }
  }, []);

  useEffect(() => {
    setImage(route.params.source);
    setSelectedEmoji(route.params.selectedEmoji);
  }, [route, image, selectedEmoji]);

  ////////////////////

  const [pk, setPk] = useState("");
  const [content, setContent] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const drop = {
    pk,
    content,
    latitude,
    longitude,
  };

  const handlePk = (e) => {
    setPk(e);
  };

  const axios = require("axios");

  const handleContent = (e) => {
    setContent(e);
  };

  const handleLatitude = (e) => {
    setLatitude(e);
  };

  const handleLongitude = (e) => {
    setLongitude(e);
  };

  const PostWrite = async () => {
    console.log("Postwrite request sent");
    // const accessToken = await AsyncStorage.getItem("accessToken");

    await postDrop(area, place.pk, accessToken, content);
  };

  return (
    <SafeArea style={styles.container}>
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MapScreen");
            }}
          >
            <SvgXml
              xml={backButton2}
              width={50}
              height={50}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Emoji");
            }}
          >
            {selectedEmoji != null ? (
              <Text
                style={{
                  height: 70,
                  fontSize: 60,
                }}
              >
                {selectedEmoji}
              </Text>
            ) : (
              <SvgXml
                xml={addIcon}
                width={65}
                height={50}
                style={styles.addIcon}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              PostWrite();
              navigation.navigate("MapScreen");
            }}
          >
            <SvgXml
              xml={sendingButton}
              width={67}
              height={40}
              style={styles.sendingButton}
            />
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.textContainer}>
            <Text style={styles.place}>{place.name}</Text>
            <Text style={styles.address}>{placeAddress}</Text>
            <SvgXml xml={bar} width={280} height={2} style={styles.bar} />
            <TextInput
              style={styles.enter}
              placeholder="텍스트를 입력하세요"
              onChangeText={(content) => handleContent(content)}
              value={content}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* -----------------------------------------------이미지 불러와서 미리보기--------------------------------------------------- */}
      {route.params.type === 1 ? (
        <View>
          <Image
            style={container.image}
            source={{ uri: route.params.source }}
            // eslint-disable-next-line react/jsx-no-duplicate-props
          />
        </View>
      ) : route.params.type === 0 ? (
        <View>
          <Video
            source={{ uri: route.params.source }}
            shouldPlay={true}
            isLooping={true}
            resizeMode="cover"
            style={{ aspectRatio: 1 / 1, backgroundColor: "black" }}
          />
        </View>
      ) : null}
      <View style={styles.containerLow}>
        <TouchableOpacity
          onPress={() => {
            PostWrite();
            navigation.navigate("CameraScreen", route);
          }}
        >
          <SvgXml
            xml={addPicture}
            width={90}
            height={90}
            style={styles.addPicture}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SvgXml
            xml={LockButtonUnlocked}
            width={41}
            height={55}
            style={styles.LockButtonUnlocked}
          />
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
};
